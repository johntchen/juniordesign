const express = require("express");
const path = require("path");
const cors = require("cors");
const request = require("request");
const fs = require("fs");

const app = express();
app.use(cors());

var r = require("request");
const { type } = require("os");
const { raw } = require("express");
var txUrl = "http://localhost:7474/db/data/transaction/commit";
function cypher(query, params, cb) {
  r.post(
    {
      uri: txUrl,
      json: { statements: [{ statement: query, parameters: params }] },
    },
    function (err, res) {
      cb(err, res.body);
    }
  );
}

(async () => {
  const neo4j = require("neo4j-driver");

  const uri = "neo4j+s://e555b9c1.databases.neo4j.io";
  const user = "neo4j";
  const password = "56rf2y-C5bBKU2JVngj9IH2uEseoCJeKa5eIs9Z5E2A";

  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session();

  const applicationDirectory = "./Example-of-workflows/Application_containers";
  const inputDirectory = "./Example-of-workflows/Input_containers";
  const intermediateDirectory =
    "./Example-of-workflows/Intermediate_containers";
  const outputDirectory = "./Example-of-workflows/Output_containers";

  const JSON_uuid = "org.label-schema.build-container_uuid";
  const JSON_build_date = "org.label-schema.build-date";
  const JSON_schema_version = "org.label-schema.schema-version";
  const JSON_deffile_bootstrap =
    "org.label-schema.usage.singularity.deffile.bootstrap";
  const JSON_deffile_from = "org.label-schema.usage.singularity.deffile.from";
  const JSON_version = "org.label-schema.usage.singularity.version";

  let readDirResult;

  try {
    ////////////////////STARTED UPLOADING DATA////////////////////////////
    //CLEAR PREVIOUS NODES
    await driver
      .session()
      .writeTransaction((tx) => tx.run(`match(n:Application) DETACH DELETE n`));
    await driver
      .session()
      .writeTransaction((tx) =>
        tx.run(`match(n:Intermediate) DETACH DELETE n`)
      );
    await driver
      .session()
      .writeTransaction((tx) => tx.run(`match(n:Input) DETACH DELETE n`));
    await driver
      .session()
      .writeTransaction((tx) => tx.run(`match(n:Output) DETACH DELETE n`));

    //APPLICATION CONTAINER UPLOAD
    readDirResult = fs.readdirSync(
      path.resolve(__dirname, applicationDirectory),
      "utf8"
    );
    readDirResult.forEach((fileName) => {
      let rawdata = fs.readFileSync(
        path.resolve(__dirname, applicationDirectory + "/" + fileName),
        "utf8",
        function (err, data) {
          if (err) throw err;
        }
      );
      let dataMap = JSON.parse(rawdata);
      driver.session().writeTransaction((tx) =>
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
      );
    });
    //INPUT CONTAINER UPLOAD
    readDirResult = fs.readdirSync(
      path.resolve(__dirname, inputDirectory),
      "utf8"
    );
    readDirResult.forEach((fileName) => {
      let rawdata = fs.readFileSync(
        path.resolve(__dirname, inputDirectory + "/" + fileName),
        "utf8",
        function (err, data) {
          if (err) throw err;
        }
      );
      let dataMap = JSON.parse(rawdata);
      driver.session().writeTransaction((tx) =>
        tx.run(
          `CREATE (n:Input {\
            name: '${fileName}', \
            Container_UUID: '${dataMap[JSON_uuid]}', \
            Build_Date: '${dataMap[JSON_build_date]}'})`
        )
      );
    });
    //INTERMEDIATE CONTAINER UPLOAD
    readDirResult = fs.readdirSync(
      path.resolve(__dirname, intermediateDirectory),
      "utf8"
    );
    readDirResult.forEach((fileName) => {
      let rawdata = fs.readFileSync(
        path.resolve(__dirname, intermediateDirectory + "/" + fileName),
        "utf8",
        function (err, data) {
          if (err) throw err;
        }
      );
      let dataMap = JSON.parse(rawdata);
      
      driver.session().writeTransaction((tx) =>
        tx.run(
          `CREATE (n:Intermediate {\
            name: '${fileName}', \
            Container_UUID: '${dataMap[0][JSON_uuid]}', \
            Build_Date: '${dataMap[0][JSON_build_date]}'})`
        )
      ).then((value) => {
        driver.session().writeTransaction((tx) =>
          tx.run(
          `MATCH (a:Application), (b:Intermediate) \
          WHERE a.Container_UUID = '${dataMap[1]["UUID"]}' \
          AND b.Container_UUID = '${dataMap[0][JSON_uuid]}' \
          CREATE (a)-[r:PRODUCES]->(b) \
          RETURN type(r)`
          )
        )
      }).then((value) => {
        for (let i = 2; i < dataMap.length - 2; i++) {
          driver.session().writeTransaction((tx) =>
            tx.run(
              `MATCH (a:Input), (b:Application) \
              WHERE a.Container_UUID = '${dataMap[i]["UUID"]}' \
              AND b.Container_UUID = '${dataMap[1]["UUID"]}' \
              CREATE (a)-[r:FEEDSTEST]->(b) \
              RETURN type(r)`
            )
          );
          driver.session().writeTransaction((tx) =>
            tx.run(
              `MATCH (a:Intermediate), (b:Application) \
              WHERE a.Container_UUID = '${dataMap[i]["UUID"]}' \
              AND b.Container_UUID = '${dataMap[1]["UUID"]}' \
              CREATE (a)-[r:FEEDSTEST]->(b) \
              RETURN type(r)`
            )
          );
        }
      });
      
      
      
    });
    //OUTPUT CONTAINER UPLOAD
    readDirResult = fs.readdirSync(
      path.resolve(__dirname, outputDirectory),
      "utf8"
    );
    readDirResult.forEach((fileName) => {
      let rawdata = fs.readFileSync(
        path.resolve(__dirname, outputDirectory + "/" + fileName),
        "utf8",
        function (err, data) {
          if (err) throw err;
        }
      );
      let dataMap = JSON.parse(rawdata);
      driver.session().writeTransaction((tx) =>
        tx.run(
          `CREATE (n:Output {\
            name: '${fileName}', \
            Container_UUID: '${dataMap[0][JSON_uuid]}', \
            Build_Date: '${dataMap[0][JSON_build_date]}'})`
        )
      );
      driver.session().writeTransaction((tx) =>
        tx.run(
          `MATCH (a:Application), (b:Output) \
          WHERE a.Container_UUID = '${dataMap[1]["UUID"]}' \
          AND b.Container_UUID = '${dataMap[0][JSON_uuid]}' \
          CREATE (a)-[r:PRODUCES]->(b) \
          RETURN type(r)`
        )
      );
      for (let i = 2; i < dataMap.length - 2; i++) {
        driver.session().writeTransaction((tx) =>
          tx.run(
            `MATCH (a:Input), (b:Output) \
            WHERE a.Container_UUID = '${dataMap[i]["UUID"]}' \
            AND b.Container_UUID = '${dataMap[0][JSON_uuid]}' \
            CREATE (a)-[r:FEEDSTEST]->(b) \
            RETURN type(r)`
          )
        );
        driver.session().writeTransaction((tx) =>
          tx.run(
            `MATCH (a:Intermediate), (b:Output) \
            WHERE a.Container_UUID = '${dataMap[i]["UUID"]}' \
            AND b.Container_UUID = '${dataMap[0][JSON_uuid]}' \
            CREATE (a)-[r:FEEDSTEST]->(b) \
            RETURN type(r)`
          )
        );
      }
    });
    ////////////////////FINISHED UPLOADING DATA////////////////////////////

    const readQuery = `MATCH (n) RETURN n`;
    const readResult = await session.readTransaction((tx) => tx.run(readQuery));
    readResult.records.forEach((record) => {
      //console.log(`Found person: ${record.get('n')}`)
    });
  } catch (error) {
    console.error("Something went wrong: ", error);
  } finally {
    await session.close();
  }

  // Don't forget to close the driver connection when you're finished with it
  await driver.close();
})();

//Example
app.get("/", function (req, res) {
  res.send("Server is up");
});

//Allows for external css file (static web pages)
app.use(express.static(__dirname + "/public"));

app.get("/workflow", function (req, res) {
  (async () => {
    const neo4j = require("neo4j-driver");

    const uri = "neo4j+s://e555b9c1.databases.neo4j.io";
    const user = "neo4j";
    const password = "56rf2y-C5bBKU2JVngj9IH2uEseoCJeKa5eIs9Z5E2A";

    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

    const name = req.query.name;
    leafNodes = [];
    nodes = [];
    edges = "";

    // Gets leaf nodes of related workflow
    try {
      session = driver.session();
      writeQuery = `MATCH (parent {name: $name})-[r*]->(child)
                    WHERE NOT (child)-[]->() 
                    RETURN child`;

      // Write transactions allow the driver to handle retries and transient errors
      writeResult = await session.writeTransaction((tx) =>
        tx.run(writeQuery, { name: name })
      );

      writeResult.records.forEach((record) => {
        leafNodes.push(record);
      });
    } catch (error) {
      console.error("Something went wrong when finding nodes: ", error);
    } finally {
      await session.close();
    }

    // Gets relationships of workflow
    try {
      console.log("START RELATE");
      session = driver.session();
      writeQuery = "MATCH (root)-[r*]->(a)";

      if (leafNodes != undefined && leafNodes.length > 0) {
        writeQuery += " WHERE ";

        for (i = 0; i < leafNodes.length; i++) {
          if (i == 0) {
            writeQuery +=
              "a.name = " +
              '"' +
              leafNodes[i].get("child").properties.name +
              '"';
          } else {
            writeQuery +=
              " or a.name = " +
              '"' +
              leafNodes[i].get("child").properties.name +
              '"';
          }
        }
        console.log("MID RELATE");

        writeQuery =
          writeQuery +
          " UNWIND r AS rs RETURN DISTINCT startNode(rs).name, type(rs), endNode(rs).name";
      }

      edges = await session.writeTransaction((tx) => tx.run(writeQuery));
      console.log("END RELATE");
    } catch (error) {
      console.error("Something went wrong when finding edges: ", error);
    } finally {
      await session.close();
    }

    // Gets nodes of workflow
    try {
      console.log("BEGIN GETTING NODES OF WORKFLOW");
      session = driver.session();
      writeQuery = "MATCH (root)-[r*]->(a)";

      if (leafNodes != undefined && leafNodes.length > 0) {
        writeQuery += " WHERE ";

        for (i = 0; i < leafNodes.length; i++) {
          nodes.push(leafNodes[i]);
          if (i == 0) {
            writeQuery =
              writeQuery +
              "a.name = " +
              '"' +
              leafNodes[i].get("child").properties.name +
              '"';
          } else {
            writeQuery =
              writeQuery +
              " or a.name = " +
              '"' +
              leafNodes[i].get("child").properties.name +
              '"';
          }
        }
        console.log("MIDDLE GETTING NODES OF WORKFLOW");
      }

      writeQuery = writeQuery + " RETURN DISTINCT root";

      writeResult = await session.writeTransaction((tx) => tx.run(writeQuery));
      // console.log(writeResult.records)
      writeResult.records.forEach((record) => {
        nodes.push(record);
      });
      console.log("END GETTING NODES OF WORKFLOW");
      res.send([nodes, edges]);
    } catch (error) {
      console.error("Something went wrong: ", error);
    } finally {
      await session.close();
    }
    await driver.close();
  })();
});

// Gets containers for a search
app.get("/searchData", function (req, res) {
  (async () => {
    const neo4j = require("neo4j-driver");

    const uri = "neo4j+s://e555b9c1.databases.neo4j.io";
    const user = "neo4j";
    const password = "56rf2y-C5bBKU2JVngj9IH2uEseoCJeKa5eIs9Z5E2A";

    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

    const search = req.query.search;

    try {
      session = driver.session();
      writeQuery = `MATCH (data) 
                    WHERE data.name CONTAINS $search OR data.Container_UUID CONTAINS $search
                    RETURN data`;

      // Write transactions allow the driver to handle retries and transient errors
      writeResult = await session.writeTransaction((tx) =>
        tx.run(writeQuery, { search: search })
      );
      res.send(writeResult);
    } catch (error) {
      console.error("Something went wrong: ", error);
    } finally {
      await session.close();
    }
    await driver.close();
  })();
});

// Gets inputs for a specific container
app.get("/getInput", function (req, res) {
  (async () => {
    const neo4j = require("neo4j-driver");

    const uri = "neo4j+s://e555b9c1.databases.neo4j.io";
    const user = "neo4j";
    const password = "56rf2y-C5bBKU2JVngj9IH2uEseoCJeKa5eIs9Z5E2A";

    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

    const name = req.query.name;

    try {
      session = driver.session();
      writeQuery = `MATCH (root {name: $name})<-[r*]-(a)
                    RETURN DISTINCT a`;

      // Write transactions allow the driver to handle retries and transient errors
      writeResult = await session.writeTransaction((tx) =>
        tx.run(writeQuery, { name: name })
      );
      res.send(writeResult);
    } catch (error) {
      console.error("Something went wrong: ", error);
    } finally {
      await session.close();
    }
    await driver.close();
  })();
});

// Gets outputs for a specific container
app.get("/getOutput", function (req, res) {
  (async () => {
    const neo4j = require("neo4j-driver");

    const uri = "neo4j+s://e555b9c1.databases.neo4j.io";
    const user = "neo4j";
    const password = "56rf2y-C5bBKU2JVngj9IH2uEseoCJeKa5eIs9Z5E2A";

    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

    const name = req.query.name;

    try {
      session = driver.session();
      writeQuery = `MATCH (root {name: $name})-[r*]->(a)
                    RETURN DISTINCT a`;

      // Write transactions allow the driver to handle retries and transient errors
      writeResult = await session.writeTransaction((tx) =>
        tx.run(writeQuery, { name: name })
      );
      res.send(writeResult);
    } catch (error) {
      console.error("Something went wrong: ", error);
    } finally {
      await session.close();
    }
    await driver.close();
  })();
});

// Gets data for specific containers
app.get("/containerData", function (req, res) {
  (async () => {
    const neo4j = require("neo4j-driver");

    const uri = "neo4j+s://e555b9c1.databases.neo4j.io";
    const user = "neo4j";
    const password = "56rf2y-C5bBKU2JVngj9IH2uEseoCJeKa5eIs9Z5E2A";

    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

    const name = req.query.name;

    try {
      session = driver.session();
      writeQuery = `MATCH (data {name: $name}) 
                    RETURN data`;

      // Write transactions allow the driver to handle retries and transient errors
      writeResult = await session.writeTransaction((tx) =>
        tx.run(writeQuery, { name: name })
      );
      res.send(writeResult);
    } catch (error) {
      console.error("Something went wrong: ", error);
    } finally {
      await session.close();
    }
    await driver.close();
  })();
});

//Sends application data to frontend landing page
app.get("/applicationData", function (req, res) {
  (async () => {
    dataArray = [];
    const neo4j = require("neo4j-driver");

    const uri = "neo4j+s://e555b9c1.databases.neo4j.io";
    const user = "neo4j";
    const password = "56rf2y-C5bBKU2JVngj9IH2uEseoCJeKa5eIs9Z5E2A";

    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

    // Gets data for application containers
    try {
      session = driver.session();
      writeQuery = `MATCH (data:Application)
                    RETURN data`;

      // Write transactions allow the driver to handle retries and transient errors
      writeResult = await session.writeTransaction((tx) => tx.run(writeQuery));

      writeResult.records.forEach((record) => {
        dataArray.push(record._fields[0].properties);
      });
      res.send(dataArray);
    } catch (error) {
      console.error("Something went wrong: ", error);
    } finally {
      await session.close();
    }
    await driver.close();
  })();
});

//Sends input data
app.get("/inputData", function (req, res) {
  (async () => {
    dataArray = [];
    const neo4j = require("neo4j-driver");

    const uri = "neo4j+s://e555b9c1.databases.neo4j.io";
    const user = "neo4j";
    const password = "56rf2y-C5bBKU2JVngj9IH2uEseoCJeKa5eIs9Z5E2A";

    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

    // Gets data for application containers
    try {
      session = driver.session();
      writeQuery = `MATCH (data:Input)
                    RETURN data`;

      // Write transactions allow the driver to handle retries and transient errors
      writeResult = await session.writeTransaction((tx) => tx.run(writeQuery));
      writeResult.records.forEach((record) => {
        dataArray.push(record._fields[0].properties);
      });
      res.send(dataArray);
    } catch (error) {
      console.error("Something went wrong: ", error);
    } finally {
      await session.close();
    }
    await driver.close();
  })();
});

//Sends intermediate data
app.get("/intermediateData", function (req, res) {
  (async () => {
    dataArray = [];
    const neo4j = require("neo4j-driver");

    const uri = "neo4j+s://e555b9c1.databases.neo4j.io";
    const user = "neo4j";
    const password = "56rf2y-C5bBKU2JVngj9IH2uEseoCJeKa5eIs9Z5E2A";

    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

    try {
      session = driver.session();
      writeQuery = `MATCH (data:Intermediate)
                    RETURN data`;

      // Write transactions allow the driver to handle retries and transient errors
      writeResult = await session.writeTransaction((tx) => tx.run(writeQuery));
      writeResult.records.forEach((record) => {
        dataArray.push(record._fields[0].properties);
      });
      res.send(dataArray);
    } catch (error) {
      console.error("Something went wrong: ", error);
    } finally {
      await session.close();
    }
    await driver.close();
  })();
});

//Sends output data
app.get("/outputData", function (req, res) {
  (async () => {
    dataArray = [];
    const neo4j = require("neo4j-driver");

    const uri = "neo4j+s://e555b9c1.databases.neo4j.io";
    const user = "neo4j";
    const password = "56rf2y-C5bBKU2JVngj9IH2uEseoCJeKa5eIs9Z5E2A";

    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

    try {
      session = driver.session();
      writeQuery = `MATCH (data:Output)
                    RETURN data`;

      // Write transactions allow the driver to handle retries and transient errors
      writeResult = await session.writeTransaction((tx) => tx.run(writeQuery));
      writeResult.records.forEach((record) => {
        dataArray.push(record._fields[0].properties);
      });
      res.send(dataArray);
    } catch (error) {
      console.error("Something went wrong: ", error);
    } finally {
      await session.close();
    }
    await driver.close();
  })();
});

const port = 4000;
app.listen(port, () => console.log("Listening on port " + port));
