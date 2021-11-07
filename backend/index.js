const express = require("express");
const path = require('path');
const cors = require("cors");
const request = require("request");
const fs = require('fs');

const app = express();
app.use(cors());

var r=require("request");
const { type } = require("os");
const { raw } = require("express");
var txUrl = "http://localhost:7474/db/data/transaction/commit";
function cypher(query,params,cb) {
  r.post({uri:txUrl,
          json:{statements:[{statement:query,parameters:params}]}},
         function(err,res) { cb(err,res.body)})
}

(async() => {
    const neo4j = require('neo4j-driver')
    
    const uri = 'neo4j+s://e555b9c1.databases.neo4j.io';
    const user = 'neo4j';
    const password = '56rf2y-C5bBKU2JVngj9IH2uEseoCJeKa5eIs9Z5E2A';
    
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
    const session = driver.session()
   
    const person1Name = 'Alice'
    const person2Name = 'David'

    const applicationDirectory = "./Example-of-workflows/Application_containers";
    const inputDirectory = "./Example-of-workflows/Input_containers";
    const intermediateDirectory = "./Example-of-workflows/Intermediate_containers";
    const outputDirectory = "./Example-of-workflows/Output_containers";

    const JSON_uuid = 'org.label-schema.build-container_uuid';
    const JSON_build_date = 'org.label-schema.build-date';
    const JSON_schema_version = 'org.label-schema.schema-version';
    const JSON_deffile_bootstrap = 'org.label-schema.usage.singularity.deffile.bootstrap';
    const JSON_deffile_from = 'org.label-schema.usage.singularity.deffile.from';
    const JSON_version = 'org.label-schema.usage.singularity.version';

    let readDirResult;
   
    try {
      // ABEL: THIS IS AN EXAMPLE QUERY
      // ABEL: try logging 'MATCH(n) RETURN n' to see get all nodes and relationships
      // To learn more about the Cypher syntax, see https://neo4j.com/docs/cypher-manual/current/
      // The Reference Card is also a good resource for keywords https://neo4j.com/docs/cypher-refcard/current/
      
    //   const writeQuery = `MERGE (p1:Person { name: $person1Name })
    //                       MERGE (p2:Person { name: $person2Name })
    //                       MERGE (p1)-[:KNOWS]->(p2)
    //                       RETURN p1, p2`
   
    //   // Write transactions allow the driver to handle retries and transient errors
    //   const writeResult = await session.writeTransaction(tx =>
    //     tx.run(writeQuery, { person1Name, person2Name })
    //   )
    //   writeResult.records.forEach(record => {
    //     const person1Node = record.get('p1')
    //     const person2Node = record.get('p2')
    //     console.log(
    //       `Created friendship between: ${person1Node.properties.name}, ${person2Node.properties.name}`
    //     )
    //   })

    //CLEAR PREVIOUS NODES
      await driver.session().writeTransaction(tx =>
        tx.run(`match(n:Application) DETACH DELETE n`)
      )
      await driver.session().writeTransaction(tx =>
        tx.run(`match(n:Intermediate) DETACH DELETE n`)
      )
      await driver.session().writeTransaction(tx =>
        tx.run(`match(n:Input) DETACH DELETE n`)
      )
      await driver.session().writeTransaction(tx =>
        tx.run(`match(n:Output) DETACH DELETE n`)
      )

    //APPLICATION CONTAINER UPLOAD
    readDirResult = fs.readdirSync(path.resolve(__dirname, applicationDirectory), 'utf8');
    readDirResult.forEach((fileName) => {
      let rawdata = fs.readFileSync(path.resolve(__dirname, applicationDirectory + "/" + fileName), 'utf8', function(err, data){
        if(err) throw err;
      });
      let dataMap = JSON.parse(rawdata);
      driver.session().writeTransaction(tx =>
        tx.run(
          `CREATE (n:Application {\
            name: '${fileName}', \
            Container_UUID: '${dataMap[JSON_uuid]}', \
            Build_Date: '${dataMap[JSON_build_date]}', \
            Schema_Version: '${dataMap[JSON_schema_version]}', \
            Deffile_Bootstrap: '${dataMap[JSON_deffile_bootstrap]}', \
            Deffile_From: '${dataMap[JSON_deffile_from]}', \
            Version: '${dataMap[JSON_version]}'})`
        )
      )
    });
    //INPUT CONTAINER UPLOAD
    readDirResult = fs.readdirSync(path.resolve(__dirname, inputDirectory), 'utf8');
    readDirResult.forEach((fileName) => {
      let rawdata = fs.readFileSync(path.resolve(__dirname, inputDirectory + "/" + fileName), 'utf8', function(err, data){
        if(err) throw err;
      });
      let dataMap = JSON.parse(rawdata);
      driver.session().writeTransaction(tx =>
        tx.run(
          `CREATE (n:Input {\
            name: '${fileName}', \
            Container_UUID: '${dataMap[JSON_uuid]}', \
            Build_Date: '${dataMap[JSON_build_date]}'})`
        )
      )
    });
    //INTERMEDIATE CONTAINER UPLOAD
    readDirResult = fs.readdirSync(path.resolve(__dirname, intermediateDirectory), 'utf8');
    readDirResult.forEach((fileName) => {
      let rawdata = fs.readFileSync(path.resolve(__dirname, intermediateDirectory + "/" + fileName), 'utf8', function(err, data){
        if(err) throw err;
      });
      let dataMap = JSON.parse(rawdata);
      driver.session().writeTransaction(tx =>
        tx.run(
          `CREATE (n:Intermediate {\
            name: '${fileName}', \
            Container_UUID: '${dataMap[0][JSON_uuid]}', \
            Build_Date: '${dataMap[0][JSON_build_date]}'})`
        )
      )
      driver.session().writeTransaction(tx =>
        tx.run(
          `MATCH (a:Application), (b:Intermediate) \
          WHERE a.Container_UUID = '${dataMap[1]["UUID"]}' \
          AND b.Container_UUID = '${dataMap[0][JSON_uuid]}' \
          CREATE (a)-[r:PRODUCES]->(b) \
          RETURN type(r)`
        )
      )
      for(let i = 2; i < dataMap.length - 2; i++) {
        driver.session().writeTransaction(tx =>
          tx.run(
            `MATCH (a:Input), (b:Intermediate) \
            WHERE a.Container_UUID = '${dataMap[i]["UUID"]}' \
            AND b.Container_UUID = '${dataMap[0][JSON_uuid]}' \
            CREATE (a)-[r:FEEDSTEST]->(b) \
            RETURN type(r)`
          )
        )
        driver.session().writeTransaction(tx =>
          tx.run(
            `MATCH (a:Input), (b:Intermediate) \
            WHERE a.Container_UUID = '${dataMap[i]["UUID"]}' \
            AND b.Container_UUID = '${dataMap[0][JSON_uuid]}' \
            CREATE (a)-[r:FEEDSTEST]->(b) \
            RETURN type(r)`
          )
        )
      }
    });
    //OUTPUT CONTAINER UPLOAD
    readDirResult = fs.readdirSync(path.resolve(__dirname, outputDirectory), 'utf8');
    readDirResult.forEach((fileName) => {
      let rawdata = fs.readFileSync(path.resolve(__dirname, outputDirectory + "/" + fileName), 'utf8', function(err, data){
        if(err) throw err;
      });
      let dataMap = JSON.parse(rawdata);
      driver.session().writeTransaction(tx =>
        tx.run(
          `CREATE (n:Output {\
            name: '${fileName}', \
            Container_UUID: '${dataMap[0][JSON_uuid]}', \
            Build_Date: '${dataMap[0][JSON_build_date]}'})`
        )
      )
      driver.session().writeTransaction(tx =>
        tx.run(
          `MATCH (a:Application), (b:Output) \
          WHERE a.Container_UUID = '${dataMap[1]["UUID"]}' \
          AND b.Container_UUID = '${dataMap[0][JSON_uuid]}' \
          CREATE (a)-[r:PRODUCES]->(b) \
          RETURN type(r)`
        )
      )
      for(let i = 2; i < dataMap.length - 2; i++) {
        driver.session().writeTransaction(tx =>
          tx.run(
            `MATCH (a:Input), (b:Output) \
            WHERE a.Container_UUID = '${dataMap[i]["UUID"]}' \
            AND b.Container_UUID = '${dataMap[0][JSON_uuid]}' \
            CREATE (a)-[r:FEEDSTEST]->(b) \
            RETURN type(r)`
          )
        )
        driver.session().writeTransaction(tx =>
          tx.run(
            `MATCH (a:Intermediate), (b:Output) \
            WHERE a.Container_UUID = '${dataMap[i]["UUID"]}' \
            AND b.Container_UUID = '${dataMap[0][JSON_uuid]}' \
            CREATE (a)-[r:FEEDSTEST]->(b) \
            RETURN type(r)`
          )
        )
      }
    });

    
      const readQuery = `MATCH (n) RETURN n`
      const readResult = await session.readTransaction(tx =>
        tx.run(readQuery)
      )
      readResult.records.forEach(record => {
        //console.log(`Found person: ${record.get('n')}`)
      })
    } catch (error) {
      console.error('Something went wrong: ', error)
    } finally {
      await session.close()
    }
   
    // Don't forget to close the driver connection when you're finished with it
    await driver.close()
   })();

//Example
app.get("/", function(req, res){
    res.send("Server is up");
});

//Allows for external css file (static web pages)
app.use(express.static((__dirname + '/public')));

//Sends sample data to frontend landing page
app.post('/appdata', function(req, res) {
    //Data parsing example
    const Data = [{
        "org.label-schema.build-container_uuid": "d7742f95-32db-41b8-8002-0cca4d0db057",
        "org.label-schema.build-date": "2021-03-09 12:00:31 -0600 CST",
        "org.label-schema.schema-version": "1.0",
        "org.label-schema.usage.singularity.deffile.bootstrap": "docker",
        "org.label-schema.usage.singularity.deffile.from": "python:3.7.3",
        "org.label-schema.usage.singularity.version": "3.5.2+265-g608fcea15",
        "org.name": "KKNN"
    }, {
        "org.label-schema.build-container_uuid": "d87f4946-b908-43e9-bd75-b183787aeb0f",
        "org.label-schema.build-date": "2020-12-11 17:20:32 -0600 CST",
        "org.label-schema.schema-version": "1.0",
        "org.label-schema.usage.singularity.deffile.bootstrap": "docker",
        "org.label-schema.usage.singularity.deffile.from": "ubuntu:16.04",
        "org.label-schema.usage.singularity.version": "3.5.2+265-g608fcea15",
        "org.name": "RF"
    }, {
        "org.label-schema.build-container_uuid": "9b5c7895-d98a-4803-bf7c-a1af268c54e0",
        "org.label-schema.build-date": "2020-12-11 17:01:05 -0600 CST",
        "org.label-schema.schema-version": "1.0",
        "org.label-schema.usage.singularity.deffile.bootstrap": "docker",
        "org.label-schema.usage.singularity.deffile.from": "ubuntu:16.04",
        "org.label-schema.usage.singularity.version": "3.5.2+265-g608fcea15",
        "org.name": "SBM"
    }, {
        "org.label-schema.build-container_uuid": "3f1ae6bb-9a0e-4240-91d2-d3cb3db9304c",
        "org.label-schema.build-date": "2020-12-27 17:01:31 -0600 CST",
        "org.label-schema.schema-version": "1.0",
        "org.label-schema.usage.singularity.deffile.bootstrap": "docker",
        "org.label-schema.usage.singularity.deffile.from": "python:3.7.3",
        "org.label-schema.usage.singularity.version": "3.5.2+265-g608fcea15",
        "org.name": "Visualization"
    }];
    res.send(Data);
  });

const port = 4000;
app.listen(port, () => console.log("Listening on port " + port));