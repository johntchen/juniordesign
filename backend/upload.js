const path = require('path');
const fs = require('fs');

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