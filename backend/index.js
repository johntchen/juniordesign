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
    const rxSession = driver.rxSession()

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
////////////////////STARTED UPLOADING DATA////////////////////////////
    //CLEAR PREVIOUS NODES
      await session.writeTransaction(tx =>
        tx.run(`match(n:Application) DETACH DELETE n`)
      )
      await session.writeTransaction(tx =>
        tx.run(`match(n:Intermediate) DETACH DELETE n`)
      )
      await session.writeTransaction(tx =>
        tx.run(`match(n:Input) DETACH DELETE n`)
      )
      await session.writeTransaction(tx =>
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

      // driver.session().writeTransaction(tx =>
      //   tx.run(
      //     `MATCH (a:Application), (b:Intermediate) \
      //     WHERE a.Container_UUID = '${dataMap[1]["UUID"]}' \
      //     AND b.Container_UUID = '${dataMap[0][JSON_uuid]}' \
      //     CREATE (a)-[r:PRODUCES]->(b) \
      //     RETURN type(r)`
      //   )
      // )
      // for(let i = 2; i < dataMap.length - 2; i++) {
      //   driver.session().writeTransaction(tx =>
      //     tx.run(
      //       `MATCH (a:Input), (b:Intermediate) \
      //       WHERE a.Container_UUID = '${dataMap[i]["UUID"]}' \
      //       AND b.Container_UUID = '${dataMap[0][JSON_uuid]}' \
      //       CREATE (a)-[r:FEEDSTEST]->(b) \
      //       RETURN type(r)`
      //     )
      //   )
      //   driver.session().writeTransaction(tx =>
      //     tx.run(
      //       `MATCH (a:Input), (b:Intermediate) \
      //       WHERE a.Container_UUID = '${dataMap[i]["UUID"]}' \
      //       AND b.Container_UUID = '${dataMap[0][JSON_uuid]}' \
      //       CREATE (a)-[r:FEEDSTEST]->(b) \
      //       RETURN type(r)`
      //     )
      //   )
      // }
    });

    // console.log(driver.session().writeTransaction(tx =>
    //   tx.run(
    //     `MATCH (n) RETURN n`
    //   )));

    // readDirResult = fs.readdirSync(path.resolve(__dirname, intermediateDirectory), 'utf8');
    // readDirResult.forEach((fileName) => {
    //   let rawdata = fs.readFileSync(path.resolve(__dirname, intermediateDirectory + "/" + fileName), 'utf8', function(err, data){
    //     if(err) throw err;
    //   });
    //   let dataMap = JSON.parse(rawdata);
    //   driver.session().writeTransaction(tx =>
    //     tx.run(
    //       `MATCH (a:Application), (b:Intermediate) \
    //       WHERE a.Container_UUID = '${dataMap[1]["UUID"]}' \
    //       AND b.Container_UUID = '${dataMap[0][JSON_uuid]}' \
    //       CREATE (a)-[r:PRODUCES]->(b) \
    //       RETURN type(r)`
    //     )
    //   )
    //   for(let i = 2; i < dataMap.length - 2; i++) {
    //     driver.session().writeTransaction(tx =>
    //       tx.run(
    //         `MATCH (a:Input), (b:Intermediate) \
    //         WHERE a.Container_UUID = '${dataMap[i]["UUID"]}' \
    //         AND b.Container_UUID = '${dataMap[0][JSON_uuid]}' \
    //         CREATE (a)-[r:FEEDSTEST]->(b) \
    //         RETURN type(r)`
    //       )
    //     )
    //     driver.session().writeTransaction(tx =>
    //       tx.run(
    //         `MATCH (a:Input), (b:Intermediate) \
    //         WHERE a.Container_UUID = '${dataMap[i]["UUID"]}' \
    //         AND b.Container_UUID = '${dataMap[0][JSON_uuid]}' \
    //         CREATE (a)-[r:FEEDSTEST]->(b) \
    //         RETURN type(r)`
    //       )
    //     )
    //   }
    // });

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
      // driver.session().writeTransaction(tx =>
      //   tx.run(
      //     `MATCH (a:Application), (b:Output) \
      //     WHERE a.Container_UUID = '${dataMap[1]["UUID"]}' \
      //     AND b.Container_UUID = '${dataMap[0][JSON_uuid]}' \
      //     CREATE (a)-[r:PRODUCES]->(b) \
      //     RETURN type(r)`
      //   )
      // )
      // for(let i = 2; i < dataMap.length - 2; i++) {
      //   driver.session().writeTransaction(tx =>
      //     tx.run(
      //       `MATCH (a:Input), (b:Output) \
      //       WHERE a.Container_UUID = '${dataMap[i]["UUID"]}' \
      //       AND b.Container_UUID = '${dataMap[0][JSON_uuid]}' \
      //       CREATE (a)-[r:FEEDSTEST]->(b) \
      //       RETURN type(r)`
      //     )
      //   )
      //   driver.session().writeTransaction(tx =>
      //     tx.run(
      //       `MATCH (a:Intermediate), (b:Output) \
      //       WHERE a.Container_UUID = '${dataMap[i]["UUID"]}' \
      //       AND b.Container_UUID = '${dataMap[0][JSON_uuid]}' \
      //       CREATE (a)-[r:FEEDSTEST]->(b) \
      //       RETURN type(r)`
      //     )
      //   )
      // }
    });

    //INTERMEDIATE CONTAINER RELATIONSHIPS
    readDirResult = fs.readdirSync(path.resolve(__dirname, intermediateDirectory), 'utf8');
    readDirResult.forEach((fileName) => {
      let rawdata = fs.readFileSync(path.resolve(__dirname, intermediateDirectory + "/" + fileName), 'utf8', function(err, data){
        if(err) throw err;
      });
      let dataMap = JSON.parse(rawdata);

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

    //OUTPUT CONTAINER RELATIONSHIPS
    readDirResult = fs.readdirSync(path.resolve(__dirname, outputDirectory), 'utf8');
    readDirResult.forEach((fileName) => {
      let rawdata = fs.readFileSync(path.resolve(__dirname, outputDirectory + "/" + fileName), 'utf8', function(err, data){
        if(err) throw err;
      });
      let dataMap = JSON.parse(rawdata);

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
    ////////////////////FINISHED UPLOADING DATA////////////////////////////
    

    
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



app.get('/workflow', function(req, res) {
  (async() => {
    const neo4j = require('neo4j-driver')
    
    const uri = 'neo4j+s://e555b9c1.databases.neo4j.io';
    const user = 'neo4j';
    const password = '56rf2y-C5bBKU2JVngj9IH2uEseoCJeKa5eIs9Z5E2A';
    
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
    
    const name = req.query.name
    leafNodes = []
  
    // Gets leaf nodes of related workflow
    try {
      session = driver.session()
      writeQuery = `MATCH (parent {name: $name})-[r*]->(child)
                    WHERE NOT (child)-[]->() 
                    RETURN child` 
     
      // Write transactions allow the driver to handle retries and transient errors
      writeResult = await session.writeTransaction(tx =>
        tx.run(writeQuery, {name: name})
      )
  
      writeResult.records.forEach(record => {
        leafNodes.push(record.get("child").properties.name)
      })
    } catch (error) {
      console.error('Something went wrong: ', error)
    } finally {
      await session.close()
    }
  
  // Gets nodes and relationship of workflow
  try {
    session = driver.session()
    writeQuery = "MATCH (root)-[r*]->(a) WHERE "
    
    for (i = 0; i < leafNodes.length; i++) {
      if (i == 0) {
        writeQuery = writeQuery + "a.name = " + "\"" + leafNodes[i] + "\"" 
      } else {
        writeQuery = writeQuery + " or a.name = " + "\"" + leafNodes[i] + "\""
      }
    }
    
    writeQuery = writeQuery + " UNWIND r AS rs RETURN DISTINCT startNode(rs).name, type(rs), endNode(rs).name"

    writeResult = await session.writeTransaction(tx =>
      tx.run(writeQuery)
    )
    // console.log(writeResult.records)
    res.send(writeResult)
  } catch (error) {
    console.error('Something went wrong: ', error)
  } finally {
    await session.close()
  } 
  await driver.close()
  })();
});

// Gets data for specific containers
app.get('/containerData', function(req, res) {
  (async() => {
    const neo4j = require('neo4j-driver')
    
    const uri = 'neo4j+s://e555b9c1.databases.neo4j.io';
    const user = 'neo4j';
    const password = '56rf2y-C5bBKU2JVngj9IH2uEseoCJeKa5eIs9Z5E2A';
    
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
    
    const name = req.query.name

    try {
      session = driver.session()
      writeQuery = `MATCH (data {name: $name}) 
                    RETURN data` 
     
      // Write transactions allow the driver to handle retries and transient errors
      writeResult = await session.writeTransaction(tx =>
        tx.run(writeQuery, {name: name})
      )
      res.send(writeResult)
    } catch (error) {
      console.error('Something went wrong: ', error)
    } finally {
      await session.close()
    }
    await driver.close()
  })();
});

//Sends application data to frontend landing page
app.get('/applicationData', function(req, res) {
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

    // (async() => {
    //   const neo4j = require('neo4j-driver')
      
    //   const uri = 'neo4j+s://e555b9c1.databases.neo4j.io';
    //   const user = 'neo4j';
    //   const password = '56rf2y-C5bBKU2JVngj9IH2uEseoCJeKa5eIs9Z5E2A';
      
    //   const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
    
    //   // Gets data for application containers
    //   try {
    //     session = driver.session()
    //     writeQuery = `MATCH (data:Application)
    //                   RETURN data` 
       
    //     // Write transactions allow the driver to handle retries and transient errors
    //     writeResult = await session.writeTransaction(tx =>
    //       tx.run(writeQuery)
    //     )
    //     res.send(writeResult)
    //   } catch (error) {
    //     console.error('Something went wrong: ', error)
    //   } finally {
    //     await session.close()
    //   }
    //   await driver.close()
    // })();
  });

//Sends input data
app.get("/inputData", function(req, res) {
  const Data = [{
    "org.label-schema.build-container_uuid": "08dbf045-9312-4fd2-b57b-513dc6ed6b4e",
    "org.label-schema.build-date": "2021-10-26 17:34:11 -0600 CST"
  }, {
    "org.label-schema.build-container_uuid": "1dfc766a-5230-4df1-8ba0-553e1a21b96d",
    "org.label-schema.build-date": "2021-10-26 11:23:59 -0600 CST"
  }, {
    "org.label-schema.build-container_uuid": "d9c59799-e3c3-4cfa-9e08-91a15b15d71f",
    "org.label-schema.build-date": "2021-10-26 12:09:18 -0600 CST"
  }, {
    "org.label-schema.build-container_uuid": "f22b8c51-592b-48e0-9085-13f32a734b73",
    "org.label-schema.build-date": "2021-10-26 16:21:15 -0600 CST"
  }, {
    "org.label-schema.build-container_uuid": "2b4a7bbf-20b3-488e-a2da-4f852380f143",
    "org.label-schema.build-date": "2021-10-26 16:31:17 -0600 CST"
  }, {
    "org.label-schema.build-container_uuid": "d9cd006a-cf5e-4cb7-ab8c-e854f0755ac2",
    "org.label-schema.build-date": "2021-10-26 08:10:27 -0600 CST"
  }, {
    "org.label-schema.build-container_uuid": "758afe34-5865-42b6-8cbf-3eb4a23e18ce",
    "org.label-schema.build-date": "2021-10-26 07:19:58 -0600 CST"
  }, {
    "org.label-schema.build-container_uuid": "48d5b343-33e8-41a7-ad85-5a449141cd54",
    "org.label-schema.build-date": "2021-10-26 21:45:06 -0600 CST"
  }, {
    "org.label-schema.build-container_uuid": "0336d500-86de-4378-abf6-d1f94f76b35d",
    "org.label-schema.build-date": "2021-10-26 09:17:45 -0600 CST"
  }, {
    "org.label-schema.build-container_uuid": "5af8cb18-e46d-450f-b046-3067186ed7f5",
    "org.label-schema.build-date": "2021-10-26 16:57:29 -0600 CST"
  }, {
    "org.label-schema.build-container_uuid": "86d90f0c-b93e-4cf4-bb19-fd2177e5e37a",
    "org.label-schema.build-date": "2021-10-26 17:22:12 -0600 CST"
  }, {
    "org.label-schema.build-container_uuid": "86d90f0c-b93e-4cf4-bb19-fd2177e5e37a",
    "org.label-schema.build-date": "2021-10-26 13:21:14 -0600 CST"
  }, {
    "org.label-schema.build-container_uuid": "479bf785-45bf-47ee-a7ba-0f5fd494cce5",
    "org.label-schema.build-date": "2021-10-26 17:11:16 -0600 CST"
  }, {
    "org.label-schema.build-container_uuid": "dcbe07eb-903a-4b65-b2ce-8bb73134e257",
    "org.label-schema.build-date": "2021-10-26 17:11:16 -0600 CST"
  }, {
    "org.label-schema.build-container_uuid": "6423d7e2-63f8-4c8a-b5a4-b311637da987",
    "org.label-schema.build-date": "2021-10-26 14:19:38 -0600 CST"
  }, {
    "org.label-schema.build-container_uuid": "f104cd46-607e-4c5c-91d0-fb9f5a96f6cc",
    "org.label-schema.build-date": "2021-10-26 14:07:59 -0600 CST"
  }, {
    "org.label-schema.build-container_uuid": "a0c8bee97-555b-4d07-bea1-00b041381847",
    "org.label-schema.build-date": "2021-10-26 14:36:09 -0600 CST"
  }, {
    "org.label-schema.build-container_uuid": "358c548e-264d-4ca0-aee8-ae69fac8cd4a",
    "org.label-schema.build-date": "2021-10-26 14:19:17 -0600 CST"
  }, {
    "org.label-schema.build-container_uuid": "78b43baf-4b28-4cdd-94f7-1a19c6850d33",
    "org.label-schema.build-date": "2021-10-26 14:19:17 -0600 CST"
  }, {
    "org.label-schema.build-container_uuid": "8ce16dae-d603-4bfb-9bc0-c73a54f41373",
    "org.label-schema.build-date": "2021-10-26 14:07:57 -0600 CST"
  }];
  res.send(Data);

  // (async() => {
  //   const neo4j = require('neo4j-driver')
    
  //   const uri = 'neo4j+s://e555b9c1.databases.neo4j.io';
  //   const user = 'neo4j';
  //   const password = '56rf2y-C5bBKU2JVngj9IH2uEseoCJeKa5eIs9Z5E2A';
    
  //   const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
  
  //   // Gets data for application containers
  //   try {
  //     session = driver.session()
  //     writeQuery = `MATCH (data:Input)
  //                   RETURN data` 
     
  //     // Write transactions allow the driver to handle retries and transient errors
  //     writeResult = await session.writeTransaction(tx =>
  //       tx.run(writeQuery)
  //     )
  //     res.send(writeResult)
  //   } catch (error) {
  //     console.error('Something went wrong: ', error)
  //   } finally {
  //     await session.close()
  //   }
  //   await driver.close()
  // })();
});

//Sends intermediate data
app.get("/intermediateData", function(req, res) {
  const Data = [
    [{
      "org.label-schema.build-container_uuid": "8c6f3a06-68ef-4f8b-b4d2-b34d875f3809",
      "org.label-schema.build-date": "2021-09-10 14:36:16 -0600 CST"
      },
      {"Container_name": "p-knn.sif",
        "UUID": "25ab9ee2-e2cb-444d-b16b-2bebf30b5663",
        "Creation_time": "2021-07-22T09:10:24-06:00",
        "Modification_time": "2021-07-22T09:10:24-06:00"
      },
      {"Container_name": "train.sif",
        "UUID":"a0c8bee97-555b-4d07-bea1-00b041381847",
        "Creation_time":"2021-10-26T14:36:09-06:00",
        "Modification_time":"2021-10-26T14:37:09-06:00"
      },
      {"Container_name":"eval.sif",
        "UUID":"479bf785-45bf-47ee-a7ba-0f5fd494cce5",
        "Creation_time":"2021-10-26T17:11:16-06:00",
        "Modification_time":"2021-10-26T17:20:16-06:00"
      },
      {"Container_name":"predictions.sif",
        "UUID":"8c6f3a06-68ef-4f8b-b4d2-b34d875f3809",
        "Creation_time":"2021-09-10T14:36:16-0600",
        "Modification_time":"2021-09-10T14:41:21-0600"
      },
      {"Command_line":"singularity run -B train.sif:/Train:image-src=/Train -B eval.sif:/Eval:image-src=/Eval -B predictions.sif:/Predictions:image-src=/Predictions p-knn.sif"
    }], [
      {
      "org.label-schema.build-container_uuid": "8435ce89-40b5-428b-a96a-86b62ef5d499",
      "org.label-schema.build-date": "2021-10-20 22:10:21 -0600 CST"
      },
      {"Container_name": "p-knn.sif",
        "UUID": "25ab9ee2-e2cb-444d-b16b-2bebf30b5663",
        "Creation_time": "2021-07-22T09:10:24-06:00",
        "Modification_time": "2021-07-22T09:10:24-06:00"
      },
      {"Container_name": "train.sif",
        "UUID":"358c548e-264d-4ca0-aee8-ae69fac8cd4a",
        "Creation_time":"2021-10-26T14:19:17-06:00",
        "Modification_time":"2021-10-26T14:19:17-06:00"
      },
      {"Container_name":"eval.sif",
        "UUID":"dcbe07eb-903a-4b65-b2ce-8bb73134e257",
        "Creation_time":"2021-10-26T17:11:16-06:00",
        "Modification_time":"2021-10-26T17:11:16-06:00"
      },
      {"Container_name":"predictions.sif",
        "UUID":"8435ce89-40b5-428b-a96a-86b62ef5d499",
        "Creation_time":"2021-10-20T22:10:21-0600",
        "Modification_time":"2021-10-20T03:21:58-0600"
      },
      {"Command_line":"singularity run -B train.sif:/Train:image-src=/Train -B eval.sif:/Eval:image-src=/Eval -B predictions.sif:/Predictions:image-src=/Predictions p-knn.sif"
      }
    ], [
      {
      "org.label-schema.build-container_uuid": "20471ad1-2a70-4891-9093-81b37bd95862",
      "org.label-schema.build-date": "2021-10-22 13:02:01 -0600 CST"
      },
      {"Container_name": "p-knn.sif",
        "UUID": "25ab9ee2-e2cb-444d-b16b-2bebf30b5663",
        "Creation_time": "2021-07-22T09:10:24-06:00",
        "Modification_time": "2021-07-22T09:10:24-06:00"
      },
      {"Container_name": "train.sif",
        "UUID":"78b43baf-4b28-4cdd-94f7-1a19c6850d33",
        "Creation_time":"2021-10-26T14:19:17-06:00",
        "Modification_time":"2021-10-26T14:19:17-06:00"
      },
      {"Container_name":"eval.sif",
        "UUID":"6423d7e2-63f8-4c8a-b5a4-b311637da987",
        "Creation_time":"2021-10-26T14:19:38-06:00",
        "Modification_time":"2021-10-26T14:19:38-06:00"
      },
      {"Container_name":"predictions.sif",
        "UUID":"20471ad1-2a70-4891-9093-81b37bd95862",
        "Creation_time":"2021-10-22T13:02:01-06:00",
        "Modification_time":"2021-10-22T13:22:41-06:00"
      },
      {"Command_line":"singularity run -B train.sif:/Train:image-src=/Train -B eval.sif:/Eval:image-src=/Eval -B predictions.sif:/Predictions:image-src=/Predictions p-knn.sif"
      }
    ], [
      {
      "org.label-schema.build-container_uuid": "8d6e1a29-2c9e-46e9-affa-b29dee0ac1ab",
      "org.label-schema.build-date": "2021-10-20 10:18:01 -0600 CST"
      },
      {"Container_name": "p-knn.sif",
        "UUID": "25ab9ee2-e2cb-444d-b16b-2bebf30b5663",
        "Creation_time": "2021-07-22T09:10:24-06:00",
        "Modification_time": "2021-07-22T09:10:24-06:00"
      },
      {"Container_name": "train.sif",
        "UUID":"8ce16dae-d603-4bfb-9bc0-c73a54f41373",
        "Creation_time":"2021-10-26T14:07:57-06:00",
        "Modification_time":"2021-10-26T14:07:57-06:00"
      },
      {"Container_name":"eval.sif",
        "UUID":"f104cd46-607e-4c5c-91d0-fb9f5a96f6cc",
        "Creation_time":"2021-10-26T14:07:59-06:00",
        "Modification_time":"2021-10-26T14:07:59-06:00"
      },
      {"Container_name":"predictions.sif",
        "UUID":"8d6e1a29-2c9e-46e9-affa-b29dee0ac1ab",
        "Creation_time":"2021-10-20T10:18:01-06:00",
        "Modification_time":"2021-10-20T11:26:47-06:00"
      },
      {"Command_line":"singularity run -B train.sif:/Train:image-src=/Train -B eval.sif:/Eval:image-src=/Eval -B predictions-sbm.sif:/Predictions:image-src=/Predictions p-knn.sif"
      }
    ], [
      {
      "org.label-schema.build-container_uuid": "f090d0d3-e89c-4e34-8b89-03d923f15b9b",
      "org.label-schema.build-date": "2021-10-20 02:16:54 -0600 CST"
      },
      {"Container_name": "p-rf.sif",
        "UUID": "488a996c-92ba-4cee-85d9-a80cec703dbc",
        "Creation_time": "2021-08-12T10:25:17-06:00",
        "Modification_time": "2021-08-12T10:25:17-06:00"
      },
      {"Container_name": "train.sif",
        "UUID":"a0c8bee97-555b-4d07-bea1-00b041381847",
        "Creation_time":"2021-10-26T14:36:09-06:00",
        "Modification_time":"2021-10-26T14:37:09-06:00"
      },
      {"Container_name":"eval.sif",
        "UUID":"479bf785-45bf-47ee-a7ba-0f5fd494cce5",
        "Creation_time":"2021-10-26T17:11:16-06:00",
        "Modification_time":"2021-10-26T17:20:16-06:00"
      },
      {"Container_name":"predictions.sif",
        "UUID":"f090d0d3-e89c-4e34-8b89-03d923f15b9b",
        "Creation_time":"2021-09-10T02:16:54-0600",
        "Modification_time":"2021-09-10T02:21:13-0600"
      },
      {"Command_line":"singularity run -B train.sif:/Train:image-src=/Train -B eval.sif:/Eval:image-src=/Eval -B predictions.sif:/Predictions:image-src=/Predictions p-rf.sif"
      }
    ], [
      {
      "org.label-schema.build-container_uuid": "4d3b3d84-a407-4baa-a870-3e9929ea1af2",
      "org.label-schema.build-date": "2021-10-20 02:16:54 -0600 CST"
      },
      {"Container_name": "p-rf.sif",
        "UUID": "488a996c-92ba-4cee-85d9-a80cec703dbc",
        "Creation_time": "2021-08-12T10:25:17-06:00",
        "Modification_time": "2021-08-12T10:25:17-06:00"
      },
      {"Container_name": "train.sif",
        "UUID":"358c548e-264d-4ca0-aee8-ae69fac8cd4a",
        "Creation_time":"2021-10-26T14:19:17-06:00",
        "Modification_time":"2021-10-26T14:19:17-06:00"
      },
      {"Container_name":"eval.sif",
        "UUID":"dcbe07eb-903a-4b65-b2ce-8bb73134e257",
        "Creation_time":"2021-10-26T17:11:16-06:00",
        "Modification_time":"2021-10-26T17:11:16-06:00"
      },
      {"Container_name":"predictions.sif",
        "UUID":"4d3b3d84-a407-4baa-a870-3e9929ea1af2",
        "Creation_time":"2021-10-20T02:16:54-0600",
        "Modification_time":"2021-10-20T05:21:58-0600"
      },
      {"Command_line":"singularity run -B train.sif:/Train:image-src=/Train -B eval.sif:/Eval:image-src=/Eval -B predictions.sif:/Predictions:image-src=/Predictions p-rf.sif"
      }
    ], [
      {
      "org.label-schema.build-container_uuid": "aea3d968-5cff-4c5a-a51e-0b775ad8a19d",
      "org.label-schema.build-date": "2021-10-20 02:16:54 -0600 CST"
      },
      {"Container_name": "p-rf.sif",
        "UUID": "488a996c-92ba-4cee-85d9-a80cec703dbc",
        "Creation_time": "2021-08-12T10:25:17-06:00",
        "Modification_time": "2021-08-12T10:25:17-06:00"
      },
      {"Container_name": "train.sif",
        "UUID":"78b43baf-4b28-4cdd-94f7-1a19c6850d33",
        "Creation_time":"2021-10-26T14:19:17-06:00",
        "Modification_time":"2021-10-26T14:19:17-06:00"
      },
      {"Container_name":"eval.sif",
        "UUID":"6423d7e2-63f8-4c8a-b5a4-b311637da987",
        "Creation_time":"2021-10-26T14:19:38-06:00",
        "Modification_time":"2021-10-26T14:19:38-06:00"
      },
      {"Container_name":"predictions.sif",
        "UUID":"aea3d968-5cff-4c5a-a51e-0b775ad8a19d",
        "Creation_time":"2021-10-20T02:16:54-06:00",
        "Modification_time":"2021-10-20T02:37:31-06:00"
      },
      {"Command_line":"singularity run -B train.sif:/Train:image-src=/Train -B eval.sif:/Eval:image-src=/Eval -B predictions.sif:/Predictions:image-src=/Predictions p-rf.sif"
      }
    ], [
      {
      "org.label-schema.build-container_uuid": "4bdb710a-c344-4454-8ce1-25681ad356c0",
      "org.label-schema.build-date": "2021-10-20 02:16:54 -0600 CST"
      },
      {"Container_name": "p-rf.sif",
        "UUID": "488a996c-92ba-4cee-85d9-a80cec703dbc",
        "Creation_time": "2021-08-12T10:25:17-06:00",
        "Modification_time": "2021-08-12T10:25:17-06:00"
      },
      {"Container_name": "train.sif",
        "UUID":"8ce16dae-d603-4bfb-9bc0-c73a54f41373",
        "Creation_time":"2021-10-26T14:07:57-06:00",
        "Modification_time":"2021-10-26T14:07:57-06:00"
      },
      {"Container_name":"eval.sif",
        "UUID":"f104cd46-607e-4c5c-91d0-fb9f5a96f6cc",
        "Creation_time":"2021-10-26T14:07:59-06:00",
        "Modification_time":"2021-10-26T14:07:59-06:00"
      },
      {"Container_name":"predictions.sif",
        "UUID":"4bdb710a-c344-4454-8ce1-25681ad356c0",
        "Creation_time":"2021-10-20T02:16:54-06:00",
        "Modification_time":"2021-10-20T03:09:44-06:00"
      },
      {"Command_line":"singularity run -B train.sif:/Train:image-src=/Train -B eval.sif:/Eval:image-src=/Eval -B predictions-sbm.sif:/Predictions:image-src=/Predictions p-rf.sif"
      }
    ], [
      {
      "org.label-schema.build-container_uuid": "2d805829-5e19-4e89-a038-67f4ed8e2b53",
      "org.label-schema.build-date": "2021-10-19 13:12:46 -0600 CST"
      },
      {"Container_name": "p-sbm.sif",
        "UUID": "666ac759-c5e0-4e3b-b2ed-02d9e35d63e4",
        "Creation_time": "2020-12-27T17:01:31-06:00",
        "Modification_time": "2020-12-27T17:01:31-06:00"
      },
      {"Container_name": "train.sif",
        "UUID":"a0c8bee97-555b-4d07-bea1-00b041381847",
        "Creation_time":"2021-10-26T14:36:09-06:00",
        "Modification_time":"2021-10-26T14:37:09-06:00"
      },
      {"Container_name":"eval.sif",
        "UUID":"479bf785-45bf-47ee-a7ba-0f5fd494cce5",
        "Creation_time":"2021-10-26T17:11:16-06:00",
        "Modification_time":"2021-10-26T17:20:16-06:00"
      },
      {"Container_name":"predictions.sif",
        "UUID":"2d805829-5e19-4e89-a038-67f4ed8e2b53",
        "Creation_time":"2021-09-10T13:12:46-0600",
        "Modification_time":"2021-09-10T13:52:50-0600"
      },
      {"Command_line":"singularity run -B train.sif:/Train:image-src=/Train -B eval.sif:/Eval:image-src=/Eval -B predictions.sif:/Predictions:image-src=/Predictions p-sbm.sif"
      }
    ], [
      {
      "org.label-schema.build-container_uuid": "02baa592-ffe8-44bb-af2e-f791137ac97c",
      "org.label-schema.build-date": "2021-10-19 13:12:46 -0600 CST"
      },
      {"Container_name": "p-sbm.sif",
        "UUID": "666ac759-c5e0-4e3b-b2ed-02d9e35d63e4",
        "Creation_time": "2020-12-27T17:01:31-06:00",
        "Modification_time": "2020-12-27T17:01:31-06:00"
      },
      {"Container_name": "train.sif",
        "UUID":"358c548e-264d-4ca0-aee8-ae69fac8cd4a",
        "Creation_time":"2021-10-26T14:19:17-06:00",
        "Modification_time":"2021-10-26T14:19:17-06:00"
      },
      {"Container_name":"eval.sif",
        "UUID":"dcbe07eb-903a-4b65-b2ce-8bb73134e257",
        "Creation_time":"2021-10-26T17:11:16-06:00",
        "Modification_time":"2021-10-26T17:11:16-06:00"
      },
      {"Container_name":"predictions.sif",
        "UUID":"02baa592-ffe8-44bb-af2e-f791137ac97c",
        "Creation_time":"2021-10-19T13:12:46-0600",
        "Modification_time":"2021-10-19T16:29:17-0600"
      },
      {"Command_line":"singularity run -B train.sif:/Train:image-src=/Train -B eval.sif:/Eval:image-src=/Eval -B predictions.sif:/Predictions:image-src=/Predictions p-sbm.sif"
      }
    ], [
      {
      "org.label-schema.build-container_uuid": "a8a37ed9-3c65-4439-8e6f-adcb161edb3c",
      "org.label-schema.build-date": "2021-10-19 13:12:46 -0600 CST"
      },
      {"Container_name": "p-sbm.sif",
        "UUID": "666ac759-c5e0-4e3b-b2ed-02d9e35d63e4",
        "Creation_time": "2020-12-27T17:01:31-06:00",
        "Modification_time": "2020-12-27T17:01:31-06:00"
      },
      {"Container_name": "train.sif",
        "UUID":"78b43baf-4b28-4cdd-94f7-1a19c6850d33",
        "Creation_time":"2021-10-26T14:19:17-06:00",
        "Modification_time":"2021-10-26T14:19:17-06:00"
      },
      {"Container_name":"eval.sif",
        "UUID":"6423d7e2-63f8-4c8a-b5a4-b311637da987",
        "Creation_time":"2021-10-26T14:19:38-06:00",
        "Modification_time":"2021-10-26T14:19:38-06:00"
      },
      {"Container_name":"predictions.sif",
        "UUID":"a8a37ed9-3c65-4439-8e6f-adcb161edb3c",
        "Creation_time":"2021-10-19T13:12:46-06:00",
        "Modification_time":"2021-10-19T13:32:52-06:00"
      },
      {"Command_line":"singularity run -B train.sif:/Train:image-src=/Train -B eval.sif:/Eval:image-src=/Eval -B predictions.sif:/Predictions:image-src=/Predictions p-sbm.sif"
      }
    ], [
      {
      "org.label-schema.build-container_uuid": "94257175-4347-4377-8fcd-5c83caa81574",
      "org.label-schema.build-date": "2021-10-19 13:12:46 -0600 CST"
      },
      {"Container_name": "p-sbm.sif",
        "UUID": "666ac759-c5e0-4e3b-b2ed-02d9e35d63e4",
        "Creation_time": "2020-12-27T17:01:31-06:00",
        "Modification_time": "2020-12-27T17:01:31-06:00"
      },
      {"Container_name": "train.sif",
        "UUID":"8ce16dae-d603-4bfb-9bc0-c73a54f41373",
        "Creation_time":"2021-10-26T14:07:57-06:00",
        "Modification_time":"2021-10-26T14:07:57-06:00"
      },
      {"Container_name":"eval.sif",
        "UUID":"f104cd46-607e-4c5c-91d0-fb9f5a96f6cc",
        "Creation_time":"2021-10-26T14:07:59-06:00",
        "Modification_time":"2021-10-26T14:07:59-06:00"
      },
      {"Container_name":"predictions.sif",
        "UUID":"94257175-4347-4377-8fcd-5c83caa81574",
        "Creation_time":"2021-10-19T13:12:46-06:00",
        "Modification_time":"2021-10-19T14:07:36-06:00"
      },
      {"Command_line":"singularity run -B train.sif:/Train:image-src=/Train -B eval.sif:/Eval:image-src=/Eval -B predictions-sbm.sif:/Predictions:image-src=/Predictions p-sbm.sif"
      }
    ]    
  ];
  res.send(Data);

  // (async() => {
  //   const neo4j = require('neo4j-driver')
    
  //   const uri = 'neo4j+s://e555b9c1.databases.neo4j.io';
  //   const user = 'neo4j';
  //   const password = '56rf2y-C5bBKU2JVngj9IH2uEseoCJeKa5eIs9Z5E2A';
    
  //   const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
  
  //   try {
  //     session = driver.session()
  //     writeQuery = `MATCH (data:Intermediate)
  //                   RETURN data` 
     
  //     // Write transactions allow the driver to handle retries and transient errors
  //     writeResult = await session.writeTransaction(tx =>
  //       tx.run(writeQuery)
  //     )
  //     res.send(writeResult)
  //   } catch (error) {
  //     console.error('Something went wrong: ', error)
  //   } finally {
  //     await session.close()
  //   }
  //   await driver.close()
  // })();
});

//Sends output data
app.get('/outputData', function(req, res) {
  const Data = [[
    {
    "org.label-schema.build-container_uuid": "1c403a8d-1cb7-4d0e-aab6-25df052a384d",
    "org.label-schema.build-date": "2021-03-09 14:36:34 -0600 CST"
    },
    {"Container_name": "visualization.sif",
      "UUID": "d7742f95-32db-41b8-8002-0cca4d0db057",
      "Creation_time": "2021-03-09T12:00:31-06:00",
      "Modification_time": "2021-03-09T12:00:31-06:00"
    },
    {"Container_name":"outputkknn.sif",
      "UUID":"81b45452-e0b6-4dcf-8313-c0da066f5b0b",
      "Creation_time":"2021-03-09T14:36:20-0600",
      "Modification_time":"2021-03-09T14:36:21-0600"
    },
    {"Container_name":"outputvisualization_kknn.sif",
      "UUID":"1c403a8d-1cb7-4d0e-aab6-25df052a384d",
      "Creation_time":"2021-03-09T14:36:34-06:00",
      "Modification_time":"2021-03-09T14:36:34-06:00"
    },
    {"Command_line":"singularity run -B outputkknn.sif:/Outputs:image-src=/Outputs -B outputvisualization_kknn.sif:/Output_Visualization:image-src=/Output_Visualization visualization.sif"
    }
  ], [
    {
    "org.label-schema.build-container_uuid": "536a2498-01a3-4ef0-b796-f7577b3627ac",
    "org.label-schema.build-date": "2021-10-27 14:36:16 -0600 CST"
    },
    {"Container_name": "stats.sif",
      "UUID": "3c35251f-8720-49bf-995b-15dc55434432",
      "Creation_time": "2021-10-26T10:00:31-06:00",
      "Modification_time": "2021-10-26T10:00:31-06:00"
    },
    {"Container_name":"predictions.sif",
      "UUID":"8c6f3a06-68ef-4f8b-b4d2-b34d875f3809",
      "Creation_time":"2021-09-10T14:36:16-0600",
      "Modification_time":"2021-09-10T14:41:21-0600"
    },
    {"Container_name":"config.sif",
      "UUID":"08dbf045-9312-4fd2-b57b-513dc6ed6b4e",
      "Creation_time":"2021-10-26T17:34:11-06:00",
      "Modification_time":"2021-10-26T17:34:11-06:00"
    },
    {"Container_name":"output-stats.sif",
      "UUID":"536a2498-01a3-4ef0-b796-f7577b3627ac",
      "Creation_time":"2021-10-27T14:36:20-0600",
      "Modification_time":"2021-10-27T14:36:21-0600"
    },
    {"Command_line":"singularity exec -B predictions.sif:/Predictions:image-src=/Predictions -B config.sif:/Config:image-src=/Config -B output-stats.sif:/Outputs:image-src=/Outputs stats.sif python3 stats.py median -i Predictions"
    }
  ], [
    {
    "org.label-schema.build-container_uuid": "fdc50374-75a5-4202-b26a-432386d00a58",
    "org.label-schema.build-date": "2021-10-27 14:36:16 -0600 CST"
    },
    {"Container_name": "stats.sif",
      "UUID": "3c35251f-8720-49bf-995b-15dc55434432",
      "Creation_time": "2021-10-26T10:00:31-06:00",
      "Modification_time": "2021-10-26T10:00:31-06:00"
    },
    {"Container_name":"predictions.sif",
      "UUID":"8435ce89-40b5-428b-a96a-86b62ef5d499",
      "Creation_time":"2021-10-20T22:10:21-0600",
      "Modification_time":"2021-10-20T03:21:58-0600"
    },
    {"Container_name":"config.sif",
      "UUID":"1dfc766a-5230-4df1-8ba0-553e1a21b96d",
      "Creation_time":"2021-10-26T11:23:59-06:00",
      "Modification_time":"2021-10-26T11:23:59-06:00"
    },
    {"Container_name":"output-stats.sif",
      "UUID":"fdc50374-75a5-4202-b26a-432386d00a58",
      "Creation_time":"2021-10-27T14:36:20-0600",
      "Modification_time":"2021-10-27T14:36:21-0600"
    },
    {"Command_line":"singularity exec -B predictions.sif:/Predictions:image-src=/Predictions -B config.sif:/Config:image-src=/Config -B output-stats.sif:/Outputs:image-src=/Outputs stats.sif python3 stats.py median -i Predictions"
    }
  ], [
    {
    "org.label-schema.build-container_uuid": "aa358965-12df-4a61-a7cd-ad160a773d51",
    "org.label-schema.build-date": "2021-10-27 14:20:01 -0600 CST"
    },
    {"Container_name": "stats.sif",
      "UUID": "3c35251f-8720-49bf-995b-15dc55434432",
      "Creation_time": "2021-10-26T10:00:31-06:00",
      "Modification_time": "2021-10-26T10:00:31-06:00"
    },
    {"Container_name":"predictions.sif",
      "UUID":"20471ad1-2a70-4891-9093-81b37bd95862",
      "Creation_time":"2021-10-22T13:02:01-06:00",
      "Modification_time":"2021-10-22T13:22:41-06:00"
    },
    {"Container_name":"config.sif",
      "UUID":"d9c59799-e3c3-4cfa-9e08-91a15b15d71f",
      "Creation_time":"2021-10-26T12:09:18-06:00",
      "Modification_time":"2021-10-26T12:09:18-06:00"
    },
    {"Container_name":"output-stats.sif",
      "UUID":"aa358965-12df-4a61-a7cd-ad160a773d51",
      "Creation_time":"2021-10-27T14:20:01-06:00",
      "Modification_time":"2021-10-27T14:20:03-06:00"
    },
    {"Command_line":"singularity exec -B predictions.sif:/Predictions:image-src=/Predictions -B config.sif:/Config:image-src=/Config -B output-stats.sif:/Outputs:image-src=/Outputs stats.sif python3 stats.py median -i Predictions"
    }
  ], [
    {
    "org.label-schema.build-container_uuid": "e8d5bf4e-60cd-4d66-b99f-9f1fd3ff8071",
    "org.label-schema.build-date": "2021-10-27 14:08:01 -0600 CST"
    },
    {"Container_name": "stats.sif",
      "UUID": "3c35251f-8720-49bf-995b-15dc55434432",
      "Creation_time": "2021-10-26T10:00:31-06:00",
      "Modification_time": "2021-10-26T10:00:31-06:00"
    },
    {"Container_name":"predictions.sif",
      "UUID":"8d6e1a29-2c9e-46e9-affa-b29dee0ac1ab",
      "Creation_time":"2021-10-20T10:18:01-06:00",
      "Modification_time":"2021-10-20T11:26:47-06:00"
    },
    {"Container_name":"config.sif",
      "UUID":"f22b8c51-592b-48e0-9085-13f32a734b73",
      "Creation_time":"2021-10-26T16:21:15-06:00",
      "Modification_time":"2021-10-26T16:21:15-06:00"
    },
    {"Container_name":"output-stats.sif",
      "UUID":"e8d5bf4e-60cd-4d66-b99f-9f1fd3ff8071",
      "Creation_time":"2021-10-27T14:08:01-06:00",
      "Modification_time":"2021-10-27T14:08:02-06:00"
    },
    {"Command_line":"singularity exec -B predictions.sif:/Predictions:image-src=/Predictions -B config.sif:/Config:image-src=/Config -B output-stats.sif:/Outputs:image-src=/Outputs stats.sif python3 stats.py median -i Predictions"
    }
  ], [
    {
    "org.label-schema.build-container_uuid": "7c8056b8-a27f-4c32-80c0-d78db542e3f8",
    "org.label-schema.build-date": "2021-10-27 14:36:24 -0600 CST"
    },
    {"Container_name": "stats.sif",
      "UUID": "3c35251f-8720-49bf-995b-15dc55434432",
      "Creation_time": "2021-10-26T10:00:31-06:00",
      "Modification_time": "2021-10-26T10:00:31-06:00"
    },
    {"Container_name":"predictions.sif",
      "UUID":"f090d0d3-e89c-4e34-8b89-03d923f15b9b",
      "Creation_time":"2021-09-10T02:16:54-0600",
      "Modification_time":"2021-09-10T02:21:13-0600"
    },
    {"Container_name":"config.sif",
      "UUID":"2b4a7bbf-20b3-488e-a2da-4f852380f143",
      "Creation_time":"2021-10-26T16:31:17-06:00",
      "Modification_time":"2021-10-26T16:31:17-06:00"
    },
    {"Container_name":"output-stats.sif",
      "UUID":"7c8056b8-a27f-4c32-80c0-d78db542e3f8",
      "Creation_time":"2021-10-27T14:36:24-06:00",
      "Modification_time":"2021-10-27T14:36:25-06:00"
    },
    {"Command_line":"singularity exec -B predictions.sif:/Predictions:image-src=/Predictions -B config.sif:/Config:image-src=/Config -B output-stats.sif:/Outputs:image-src=/Outputs stats.sif python3 stats.py median -i Predictions"
    }
  ], [
    {
    "org.label-schema.build-container_uuid": "744d1ed7-ecf4-444a-b0dc-e2497b822dd5",
    "org.label-schema.build-date": "2021-10-27 14:36:24 -0600 CST"
    },
    {"Container_name": "stats.sif",
      "UUID": "3c35251f-8720-49bf-995b-15dc55434432",
      "Creation_time": "2021-10-26T10:00:31-06:00",
      "Modification_time": "2021-10-26T10:00:31-06:00"
    },
    {"Container_name":"predictions.sif",
      "UUID":"4d3b3d84-a407-4baa-a870-3e9929ea1af2",
      "Creation_time":"2021-10-20T02:16:54-0600",
      "Modification_time":"2021-10-20T05:21:58-0600"
    },
    {"Container_name":"config.sif",
      "UUID":"d9cd006a-cf5e-4cb7-ab8c-e854f0755ac2",
      "Creation_time":"2021-10-26T08:10:27-06:00",
      "Modification_time":"2021-10-26T08:10:27-06:00"
    },
    {"Container_name":"output-stats.sif",
      "UUID":"744d1ed7-ecf4-444a-b0dc-e2497b822dd5",
      "Creation_time":"2021-10-27T14:36:24-06:00",
      "Modification_time":"2021-10-27T14:36:25-06:00"
    },
    {"Command_line":"singularity exec -B predictions.sif:/Predictions:image-src=/Predictions -B config.sif:/Config:image-src=/Config -B output-stats.sif:/Outputs:image-src=/Outputs stats.sif python3 stats.py median -i Predictions"
    }
  ], [
    {
    "org.label-schema.build-container_uuid": "82b66871-7329-483a-ae10-1b4ce9369e3f",
    "org.label-schema.build-date": "2021-10-27 14:20:15 -0600 CST"
    },
    {"Container_name": "stats.sif",
      "UUID": "3c35251f-8720-49bf-995b-15dc55434432",
      "Creation_time": "2021-10-26T10:00:31-06:00",
      "Modification_time": "2021-10-26T10:00:31-06:00"
    },
    {"Container_name":"predictions.sif",
      "UUID":"aea3d968-5cff-4c5a-a51e-0b775ad8a19d",
      "Creation_time":"2021-10-20T02:16:54-06:00",
      "Modification_time":"2021-10-20T02:37:31-06:00"
    },
    {"Container_name":"config.sif",
      "UUID":"758afe34-5865-42b6-8cbf-3eb4a23e18ce",
      "Creation_time":"2021-10-26T07:19:58-06:00",
      "Modification_time":"2021-10-26T07:19:58-06:00"
    },
    {"Container_name":"output-stats.sif",
      "UUID":"82b66871-7329-483a-ae10-1b4ce9369e3f",
      "Creation_time":"2021-10-27T14:20:15-06:00",
      "Modification_time":"2021-10-27T14:20:17-06:00"
    },
    {"Command_line":"singularity exec -B predictions.sif:/Predictions:image-src=/Predictions -B config.sif:/Config:image-src=/Config -B output-stats.sif:/Outputs:image-src=/Outputs stats.sif python3 stats.py median -i Predictions"
    }
  ], [
    {
    "org.label-schema.build-container_uuid": "04d7dfe9-b983-42ca-ba2a-6038ff255970",
    "org.label-schema.build-date": "2021-10-27 14:08:03 -0600 CST"
    },
    {"Container_name": "stats.sif",
      "UUID": "3c35251f-8720-49bf-995b-15dc55434432",
      "Creation_time": "2021-10-26T10:00:31-06:00",
      "Modification_time": "2021-10-26T10:00:31-06:00"
    },
    {"Container_name":"predictions.sif",
      "UUID":"4bdb710a-c344-4454-8ce1-25681ad356c0",
      "Creation_time":"2021-10-20T02:16:54-06:00",
      "Modification_time":"2021-10-20T03:09:44-06:00"
    },
    {"Container_name":"config.sif",
      "UUID":"48d5b343-33e8-41a7-ad85-5a449141cd5",
      "Creation_time":"2021-10-26T21:45:06-06:00",
      "Modification_time":"2021-10-26T21:45:06-06:00"
    },
    {"Container_name":"output-stats.sif",
      "UUID":"04d7dfe9-b983-42ca-ba2a-6038ff255970",
      "Creation_time":"2021-10-27T14:08:03-06:00",
      "Modification_time":"2021-10-27T14:08:04-06:00"
    },
    {"Command_line":"singularity exec -B predictions.sif:/Predictions:image-src=/Predictions -B config.sif:/Config:image-src=/Config -B output-stats.sif:/Outputs:image-src=/Outputs stats.sif python3 stats.py median -i Predictions"
    }
  ], [
    {
    "org.label-schema.build-container_uuid": "ad225aef-98c1-43f6-a4ac-bb5e7276c054",
    "org.label-schema.build-date": "2021-10-27 14:36:29 -0600 CST"
    },
    {"Container_name": "stats.sif",
      "UUID": "3c35251f-8720-49bf-995b-15dc55434432",
      "Creation_time": "2021-10-26T10:00:31-06:00",
      "Modification_time": "2021-10-26T10:00:31-06:00"
    },
    {"Container_name":"predictions.sif",
      "UUID":"2d805829-5e19-4e89-a038-67f4ed8e2b53",
      "Creation_time":"2021-09-10T13:12:46-0600",
      "Modification_time":"2021-09-10T13:52:50-0600"
    },
    {"Container_name":"config.sif",
      "UUID":"0336d500-86de-4378-abf6-d1f94f76b35d",
      "Creation_time":"2021-10-26T09:17:45-06:00",
      "Modification_time":"2021-10-26T09:17:45-06:00"
    },
    {"Container_name":"output-stats.sif",
      "UUID":"ad225aef-98c1-43f6-a4ac-bb5e7276c054",
      "Creation_time":"2021-10-27T14:36:29-06:00",
      "Modification_time":"2021-10-27T14:36:30-06:00"
    },
    {"Command_line":"singularity exec -B predictions.sif:/Predictions:image-src=/Predictions -B config.sif:/Config:image-src=/Config -B output-stats.sif:/Outputs:image-src=/Outputs stats.sif python3 stats.py median -i Predictions"
    }
  ], [
    {
    "org.label-schema.build-container_uuid": "8409abc4-784f-4517-b0f8-6247101fb63a",
    "org.label-schema.build-date": "2021-10-27 14:36:29 -0600 CST"
    },
    {"Container_name": "stats.sif",
      "UUID": "3c35251f-8720-49bf-995b-15dc55434432",
      "Creation_time": "2021-10-26T10:00:31-06:00",
      "Modification_time": "2021-10-26T10:00:31-06:00"
    },
    {"Container_name":"predictions.sif",
      "UUID":"02baa592-ffe8-44bb-af2e-f791137ac97c",
      "Creation_time":"2021-10-19T13:12:46-0600",
      "Modification_time":"2021-10-19T16:29:17-0600"
    },
    {"Container_name":"config.sif",
      "UUID":"5af8cb18-e46d-450f-b046-3067186ed7f5",
      "Creation_time":"2021-10-26T16:57:29-06:00",
      "Modification_time":"2021-10-26T16:57:29-06:00"
    },
    {"Container_name":"output-stats.sif",
      "UUID":"8409abc4-784f-4517-b0f8-6247101fb63a",
      "Creation_time":"2021-10-27T14:36:29-06:00",
      "Modification_time":"2021-10-27T14:36:30-06:00"
    },
    {"Command_line":"singularity exec -B predictions.sif:/Predictions:image-src=/Predictions -B config.sif:/Config:image-src=/Config -B output-stats.sif:/Outputs:image-src=/Outputs stats.sif python3 stats.py median -i Predictions"
    }
  ], [
    {
    "org.label-schema.build-container_uuid": "dc1afe7a-ee80-41b2-98ca-e02e56d280df",
    "org.label-schema.build-date": "2021-10-27 14:08:05 -0600 CST"
    },
    {"Container_name": "stats.sif",
      "UUID": "3c35251f-8720-49bf-995b-15dc55434432",
      "Creation_time": "2021-10-26T10:00:31-06:00",
      "Modification_time": "2021-10-26T10:00:31-06:00"
    },
    {"Container_name":"predictions.sif",
      "UUID":"a8a37ed9-3c65-4439-8e6f-adcb161edb3c",
      "Creation_time":"2021-10-19T13:12:46-06:00",
      "Modification_time":"2021-10-19T13:32:52-06:00"
    },
    {"Container_name":"config.sif",
      "UUID":"86d90f0c-b93e-4cf4-bb19-fd2177e5e37a",
      "Creation_time":"2021-10-26T17:22:12-06:00",
      "Modification_time":"2021-10-26T17:22:12-06:00"
    },
    {"Container_name":"output-stats.sif",
      "UUID":"dc1afe7a-ee80-41b2-98ca-e02e56d280df",
      "Creation_time":"2021-10-27T14:08:05-06:00",
      "Modification_time":"2021-10-27T14:08:05-06:00"
    },
    {"Command_line":"singularity exec -B predictions.sif:/Predictions:image-src=/Predictions -B config.sif:/Config:image-src=/Config -B output-stats.sif:/Outputs:image-src=/Outputs stats.sif python3 stats.py median -i Predictions"
    }
  ], [
    {
    "org.label-schema.build-container_uuid": "005b1617-7b94-4d84-b40f-888b90a1d52d",
    "org.label-schema.build-date": "2021-10-27 14:20:28 -0600 CST"
    },
    {"Container_name": "stats.sif",
      "UUID": "3c35251f-8720-49bf-995b-15dc55434432",
      "Creation_time": "2021-10-26T10:00:31-06:00",
      "Modification_time": "2021-10-26T10:00:31-06:00"
    },
    {"Container_name":"predictions.sif",
      "UUID":"94257175-4347-4377-8fcd-5c83caa81574",
      "Creation_time":"2021-10-19T13:12:46-06:00",
      "Modification_time":"2021-10-19T14:07:36-06:00"
    },
    {"Container_name":"config.sif",
      "UUID":"86d90f0c-b93e-4cf4-bb19-fd2177e5e37a",
      "Creation_time":"2021-10-26T13:21:14-06:00",
      "Modification_time":"2021-10-26T13:21:14-06:00"
    },
    {"Container_name":"output-stats.sif",
      "UUID":"005b1617-7b94-4d84-b40f-888b90a1d52d",
      "Creation_time":"2021-10-27T14:20:28-06:00",
      "Modification_time":"2021-10-27T14:20:30-06:00"
    },
    {"Command_line":"singularity exec -B predictions.sif:/Predictions:image-src=/Predictions -B config.sif:/Config:image-src=/Config -B output-stats.sif:/Outputs:image-src=/Outputs stats.sif python3 stats.py median -i Predictions"
    }
  ], [
    {
    "org.label-schema.build-container_uuid": "b8aba4c2-982b-4884-9801-2744c1224510",
    "org.label-schema.build-date": "2021-10-27 14:36:16 -0600 CST"
    },
    {"Container_name": "visual.sif",
      "UUID": "aaf59148-4e1d-4e12-90b8-30eccd23e6a",
      "Creation_time": "2021-03-09T12:00:31-06:00",
      "Modification_time": "2021-03-09T12:00:56-06:00"
    },
    {"Container_name":"predictions.sif",
      "UUID":"8c6f3a06-68ef-4f8b-b4d2-b34d875f3809",
      "Creation_time":"2021-09-10T14:36:16-0600",
      "Modification_time":"2021-09-10T14:41:21-0600"
    },
    {"Container_name":"config.sif",
      "UUID":"08dbf045-9312-4fd2-b57b-513dc6ed6b4e",
      "Creation_time":"2021-10-26T17:34:11-06:00",
      "Modification_time":"2021-10-26T17:34:11-06:00"
    },
    {"Container_name":"output-visual.sif",
      "UUID":"b8aba4c2-982b-4884-9801-2744c1224510",
      "Creation_time":"2021-10-27T14:36:20-0600",
      "Modification_time":"2021-10-27T14:36:21-0600"
    },
    {"Command_line":"singularity exec -B predictions.sif:/Predictions:image-src=/Predictions -B config.sif:/Config:image-src=/Config -B output-visual.sif:/Outputs:image-src=/Outputs visual.sif python3 visual.py 0.15 0.375"
    }
  ], [
    {
    "org.label-schema.build-container_uuid": "c476712a-7a93-408b-b9fa-1e5e2e70fc80",
    "org.label-schema.build-date": "2021-10-27 14:36:16 -0600 CST"
    },
    {"Container_name": "visual.sif",
      "UUID": "aaf59148-4e1d-4e12-90b8-30eccd23e6a",
      "Creation_time": "2021-03-09T12:00:31-06:00",
      "Modification_time": "2021-03-09T12:00:56-06:00"
    },
    {"Container_name":"predictions.sif",
      "UUID":"8435ce89-40b5-428b-a96a-86b62ef5d499",
      "Creation_time":"2021-10-20T22:10:21-0600",
      "Modification_time":"2021-10-20T03:21:58-0600"
    },
    {"Container_name":"config.sif",
      "UUID":"1dfc766a-5230-4df1-8ba0-553e1a21b96d",
      "Creation_time":"2021-10-26T11:23:59-06:00",
      "Modification_time":"2021-10-26T11:23:59-06:00"
    },
    {"Container_name":"output-visual.sif",
      "UUID":"c476712a-7a93-408b-b9fa-1e5e2e70fc80",
      "Creation_time":"2021-10-27T14:36:20-0600",
      "Modification_time":"2021-10-27T14:36:21-0600"
    },
    {"Command_line":"singularity exec -B predictions.sif:/Predictions:image-src=/Predictions -B config.sif:/Config:image-src=/Config -B output-visual.sif:/Outputs:image-src=/Outputs visual.sif python3 visual.py 0.15 0.375"
    }
  ], [
    {
    "org.label-schema.build-container_uuid": "05ff8b8d-77d4-465f-aacb-f6a004366349",
    "org.label-schema.build-date": "2021-10-27 14:20:01 -0600 CST"
    },
    {"Container_name": "visual.sif",
      "UUID": "aaf59148-4e1d-4e12-90b8-30eccd23e6a",
      "Creation_time": "2021-03-09T12:00:31-06:00",
      "Modification_time": "2021-03-09T12:00:56-06:00"
    },
    {"Container_name":"predictions.sif",
      "UUID":"20471ad1-2a70-4891-9093-81b37bd95862",
      "Creation_time":"2021-10-22T13:02:01-06:00",
      "Modification_time":"2021-10-22T13:22:41-06:00"
    },
    {"Container_name":"config.sif",
      "UUID":"d9c59799-e3c3-4cfa-9e08-91a15b15d71f",
      "Creation_time":"2021-10-26T12:09:18-06:00",
      "Modification_time":"2021-10-26T12:09:18-06:00"
    },
    {"Container_name":"output-visual.sif",
      "UUID":"05ff8b8d-77d4-465f-aacb-f6a004366349",
      "Creation_time":"2021-10-27T14:20:01-06:00",
      "Modification_time":"2021-10-27T14:20:03-06:00"
    },
    {"Command_line":"singularity exec -B predictions.sif:/Predictions:image-src=/Predictions -B config.sif:/Config:image-src=/Config -B output-visual.sif:/Outputs:image-src=/Outputs visual.sif python3 visual.py 0.15 0.375"
    }
  ], [
    {
    "org.label-schema.build-container_uuid": "e960e50b-b79d-4e1a-af97-bfcfc4a74b5b",
    "org.label-schema.build-date": "2021-10-27 14:08:01 -0600 CST"
    },
    {"Container_name": "visual.sif",
      "UUID": "aaf59148-4e1d-4e12-90b8-30eccd23e6a",
      "Creation_time": "2021-03-09T12:00:31-06:00",
      "Modification_time": "2021-03-09T12:00:56-06:00"
    },
    {"Container_name":"predictions.sif",
      "UUID":"8d6e1a29-2c9e-46e9-affa-b29dee0ac1ab",
      "Creation_time":"2021-10-20T10:18:01-06:00",
      "Modification_time":"2021-10-20T11:26:47-06:00"
    },
    {"Container_name":"config.sif",
      "UUID":"f22b8c51-592b-48e0-9085-13f32a734b73",
      "Creation_time":"2021-10-26T16:21:15-06:00",
      "Modification_time":"2021-10-26T16:21:15-06:00"
    },
    {"Container_name":"output-visual.sif",
      "UUID":"e960e50b-b79d-4e1a-af97-bfcfc4a74b5b",
      "Creation_time":"2021-10-27T14:08:01-06:00",
      "Modification_time":"2021-10-27T14:08:02-06:00"
    },
    {"Command_line":"singularity exec -B predictions.sif:/Predictions:image-src=/Predictions -B config.sif:/Config:image-src=/Config -B output-visual.sif:/Outputs:image-src=/Outputs visual.sif python3 visual.py 0.15 0.375"
    }
  ], [
    {
    "org.label-schema.build-container_uuid": "3a36e199-5db9-42fc-b3dc-8e4cbc59d67c",
    "org.label-schema.build-date": "2021-10-27 14:36:24 -0600 CST"
    },
    {"Container_name": "visual.sif",
      "UUID": "aaf59148-4e1d-4e12-90b8-30eccd23e6a",
      "Creation_time": "2021-03-09T12:00:31-06:00",
      "Modification_time": "2021-03-09T12:00:56-06:00"
    },
    {"Container_name":"predictions.sif",
      "UUID":"f090d0d3-e89c-4e34-8b89-03d923f15b9b",
      "Creation_time":"2021-09-10T02:16:54-0600",
      "Modification_time":"2021-09-10T02:21:13-0600"
    },
    {"Container_name":"config.sif",
      "UUID":"2b4a7bbf-20b3-488e-a2da-4f852380f143",
      "Creation_time":"2021-10-26T16:31:17-06:00",
      "Modification_time":"2021-10-26T16:31:17-06:00"
    },
    {"Container_name":"output-visual.sif",
      "UUID":"3a36e199-5db9-42fc-b3dc-8e4cbc59d67c",
      "Creation_time":"2021-10-27T14:36:24-06:00",
      "Modification_time":"2021-10-27T14:36:25-06:00"
    },
    {"Command_line":"singularity exec -B predictions.sif:/Predictions:image-src=/Predictions -B config.sif:/Config:image-src=/Config -B output-visual.sif:/Outputs:image-src=/Outputs visual.sif python3 visual.py 0.15 0.375"
    }
  ], [
    {
    "org.label-schema.build-container_uuid": "560bc7d8-51eb-4ad1-82fd-2cbda3a8729d",
    "org.label-schema.build-date": "2021-10-27 14:36:24 -0600 CST"
    },
    {"Container_name": "visual.sif",
      "UUID": "aaf59148-4e1d-4e12-90b8-30eccd23e6a",
      "Creation_time": "2021-03-09T12:00:31-06:00",
      "Modification_time": "2021-03-09T12:00:56-06:00"
    },
    {"Container_name":"predictions.sif",
      "UUID":"4d3b3d84-a407-4baa-a870-3e9929ea1af2",
      "Creation_time":"2021-10-20T02:16:54-0600",
      "Modification_time":"2021-10-20T05:21:58-0600"
    },
    {"Container_name":"config.sif",
      "UUID":"d9cd006a-cf5e-4cb7-ab8c-e854f0755ac2",
      "Creation_time":"2021-10-26T08:10:27-06:00",
      "Modification_time":"2021-10-26T08:10:27-06:00"
    },
    {"Container_name":"output-visual.sif",
      "UUID":"560bc7d8-51eb-4ad1-82fd-2cbda3a8729d",
      "Creation_time":"2021-10-27T14:36:24-06:00",
      "Modification_time":"2021-10-27T14:36:25-06:00"
    },
    {"Command_line":"singularity exec -B predictions.sif:/Predictions:image-src=/Predictions -B config.sif:/Config:image-src=/Config -B output-visual.sif:/Outputs:image-src=/Outputs visual.sif python3 visual.py 0.15 0.375"
    }
  ], [
    {
    "org.label-schema.build-container_uuid": "69118880-27b5-4bef-bfd8-ab979908fbef",
    "org.label-schema.build-date": "2021-10-27 14:20:15 -0600 CST"
    },
    {"Container_name": "visual.sif",
      "UUID": "aaf59148-4e1d-4e12-90b8-30eccd23e6a",
      "Creation_time": "2021-03-09T12:00:31-06:00",
      "Modification_time": "2021-03-09T12:00:56-06:00"
    },
    {"Container_name":"predictions.sif",
      "UUID":"aea3d968-5cff-4c5a-a51e-0b775ad8a19d",
      "Creation_time":"2021-10-20T02:16:54-06:00",
      "Modification_time":"2021-10-20T02:37:31-06:00"
    },
    {"Container_name":"config.sif",
      "UUID":"758afe34-5865-42b6-8cbf-3eb4a23e18ce",
      "Creation_time":"2021-10-26T07:19:58-06:00",
      "Modification_time":"2021-10-26T07:19:58-06:00"
    },
    {"Container_name":"output-visual.sif",
      "UUID":"69118880-27b5-4bef-bfd8-ab979908fbef",
      "Creation_time":"2021-10-27T14:20:15-06:00",
      "Modification_time":"2021-10-27T14:20:17-06:00"
    },
    {"Command_line":"singularity exec -B predictions.sif:/Predictions:image-src=/Predictions -B config.sif:/Config:image-src=/Config -B output-visual.sif:/Outputs:image-src=/Outputs visual.sif python3 visual.py 0.15 0.375"
    }
  ], [
    {
    "org.label-schema.build-container_uuid": "10447cfe-2b15-4fb3-8256-0d6640360650",
    "org.label-schema.build-date": "2021-10-27 14:08:03 -0600 CST"
    },
    {"Container_name": "visual.sif",
      "UUID": "aaf59148-4e1d-4e12-90b8-30eccd23e6a",
      "Creation_time": "2021-03-09T12:00:31-06:00",
      "Modification_time": "2021-03-09T12:00:56-06:00"
    },
    {"Container_name":"predictions.sif",
      "UUID":"4bdb710a-c344-4454-8ce1-25681ad356c0",
      "Creation_time":"2021-10-20T02:16:54-06:00",
      "Modification_time":"2021-10-20T03:09:44-06:00"
    },
    {"Container_name":"config.sif",
      "UUID":"48d5b343-33e8-41a7-ad85-5a449141cd5",
      "Creation_time":"2021-10-26T21:45:06-06:00",
      "Modification_time":"2021-10-26T21:45:06-06:00"
    },
    {"Container_name":"output-visual.sif",
      "UUID":"10447cfe-2b15-4fb3-8256-0d6640360650",
      "Creation_time":"2021-10-27T14:08:03-06:00",
      "Modification_time":"2021-10-27T14:08:04-06:00"
    },
    {"Command_line":"singularity exec -B predictions.sif:/Predictions:image-src=/Predictions -B config.sif:/Config:image-src=/Config -B output-visual.sif:/Outputs:image-src=/Outputs visual.sif python3 visual.py 0.15 0.375"
    }
  ], [
    {
    "org.label-schema.build-container_uuid": "1152580b-ae9f-46b6-bd89-5edfacffb112",
    "org.label-schema.build-date": "2021-10-27 14:36:29 -0600 CST"
    },
    {"Container_name": "visual.sif",
      "UUID": "aaf59148-4e1d-4e12-90b8-30eccd23e6a",
      "Creation_time": "2021-03-09T12:00:31-06:00",
      "Modification_time": "2021-03-09T12:00:56-06:00"
    },
    {"Container_name":"predictions.sif",
      "UUID":"2d805829-5e19-4e89-a038-67f4ed8e2b53",
      "Creation_time":"2021-09-10T13:12:46-0600",
      "Modification_time":"2021-09-10T13:52:50-0600"
    },
    {"Container_name":"config.sif",
      "UUID":"0336d500-86de-4378-abf6-d1f94f76b35d",
      "Creation_time":"2021-10-26T09:17:45-06:00",
      "Modification_time":"2021-10-26T09:17:45-06:00"
    },
    {"Container_name":"output-visual.sif",
      "UUID":"1152580b-ae9f-46b6-bd89-5edfacffb112",
      "Creation_time":"2021-10-27T14:36:29-06:00",
      "Modification_time":"2021-10-27T14:36:30-06:00"
    },
    {"Command_line":"singularity exec -B predictions.sif:/Predictions:image-src=/Predictions -B config.sif:/Config:image-src=/Config -B output-visual.sif:/Outputs:image-src=/Outputs visual.sif python3 visual.py 0.15 0.375"
    }
  ], [
    {
    "org.label-schema.build-container_uuid": "00482419-b81c-495b-81c4-bd9521968b15",
    "org.label-schema.build-date": "2021-10-27 14:36:29 -0600 CST"
    },
    {"Container_name": "visual.sif",
      "UUID": "aaf59148-4e1d-4e12-90b8-30eccd23e6a",
      "Creation_time": "2021-03-09T12:00:31-06:00",
      "Modification_time": "2021-03-09T12:00:56-06:00"
    },
    {"Container_name":"predictions.sif",
      "UUID":"02baa592-ffe8-44bb-af2e-f791137ac97c",
      "Creation_time":"2021-10-19T13:12:46-0600",
      "Modification_time":"2021-10-19T16:29:17-0600"
    },
    {"Container_name":"config.sif",
      "UUID":"5af8cb18-e46d-450f-b046-3067186ed7f5",
      "Creation_time":"2021-10-26T16:57:29-06:00",
      "Modification_time":"2021-10-26T16:57:29-06:00"
    },
    {"Container_name":"output-visual.sif",
      "UUID":"00482419-b81c-495b-81c4-bd9521968b15",
      "Creation_time":"2021-10-27T14:36:29-06:00",
      "Modification_time":"2021-10-27T14:36:30-06:00"
    },
    {"Command_line":"singularity exec -B predictions.sif:/Predictions:image-src=/Predictions -B config.sif:/Config:image-src=/Config -B output-visual.sif:/Outputs:image-src=/Outputs visual.sif python3 visual.py 0.15 0.375"
    }
  ], [
    {
    "org.label-schema.build-container_uuid": "df708510-bc7a-4d56-8384-38a46dcb6559",
    "org.label-schema.build-date": "2021-10-27 14:08:05 -0600 CST"
    },
    {"Container_name": "visual.sif",
      "UUID": "aaf59148-4e1d-4e12-90b8-30eccd23e6a",
      "Creation_time": "2021-03-09T12:00:31-06:00",
      "Modification_time": "2021-03-09T12:00:56-06:00"
    },
    {"Container_name":"predictions.sif",
      "UUID":"a8a37ed9-3c65-4439-8e6f-adcb161edb3c",
      "Creation_time":"2021-10-19T13:12:46-06:00",
      "Modification_time":"2021-10-19T13:32:52-06:00"
    },
    {"Container_name":"config.sif",
      "UUID":"86d90f0c-b93e-4cf4-bb19-fd2177e5e37a",
      "Creation_time":"2021-10-26T17:22:12-06:00",
      "Modification_time":"2021-10-26T17:22:12-06:00"
    },
    {"Container_name":"output-visual.sif",
      "UUID":"df708510-bc7a-4d56-8384-38a46dcb6559",
      "Creation_time":"2021-10-27T14:08:05-06:00",
      "Modification_time":"2021-10-27T14:08:05-06:00"
    },
    {"Command_line":"singularity exec -B predictions.sif:/Predictions:image-src=/Predictions -B config.sif:/Config:image-src=/Config -B output-visual.sif:/Outputs:image-src=/Outputs visual.sif python3 visual.py 0.15 0.375"
    }
  ], [
    {
    "org.label-schema.build-container_uuid": "2d92af69-dc6a-408e-afe1-e48c5056419d0",
    "org.label-schema.build-date": "2021-10-27 14:20:28 -0600 CST"
    },
    {"Container_name": "visual.sif",
      "UUID": "aaf59148-4e1d-4e12-90b8-30eccd23e6a",
      "Creation_time": "2021-03-09T12:00:31-06:00",
      "Modification_time": "2021-03-09T12:00:56-06:00"
    },
    {"Container_name":"predictions.sif",
      "UUID":"94257175-4347-4377-8fcd-5c83caa81574",
      "Creation_time":"2021-10-19T13:12:46-06:00",
      "Modification_time":"2021-10-19T14:07:36-06:00"
    },
    {"Container_name":"config.sif",
      "UUID":"86d90f0c-b93e-4cf4-bb19-fd2177e5e37a",
      "Creation_time":"2021-10-26T13:21:14-06:00",
      "Modification_time":"2021-10-26T13:21:14-06:00"
    },
    {"Container_name":"output-visual.sif",
      "UUID":"2d92af69-dc6a-408e-afe1-e48c5056419d",
      "Creation_time":"2021-10-27T14:20:28-06:00",
      "Modification_time":"2021-10-27T14:20:30-06:00"
    },
    {"Command_line":"singularity exec -B predictions.sif:/Predictions:image-src=/Predictions -B config.sif:/Config:image-src=/Config -B output-visual.sif:/Outputs:image-src=/Outputs visual.sif python3 visual.py 0.15 0.375"
    }
  ]    
  ];
  res.send(Data);

  // (async() => {
  //   const neo4j = require('neo4j-driver')
    
  //   const uri = 'neo4j+s://e555b9c1.databases.neo4j.io';
  //   const user = 'neo4j';
  //   const password = '56rf2y-C5bBKU2JVngj9IH2uEseoCJeKa5eIs9Z5E2A';
    
  //   const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
  
  //   try {
  //     session = driver.session()
  //     writeQuery = `MATCH (data:Output)
  //                   RETURN data` 
     
  //     // Write transactions allow the driver to handle retries and transient errors
  //     writeResult = await session.writeTransaction(tx =>
  //       tx.run(writeQuery)
  //     )
  //     res.send(writeResult)
  //   } catch (error) {
  //     console.error('Something went wrong: ', error)
  //   } finally {
  //     await session.close()
  //   }
  //   await driver.close()
  // })();
});

const port = 4000;
app.listen(port, () => console.log("Listening on port " + port));