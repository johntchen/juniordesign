const express = require("express");
const path = require('path');
const cors = require("cors");
var request = require("request");

const app = express();
app.use(cors());

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