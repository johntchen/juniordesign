const express = require("express");
const app = express();
const port = 4000;
var request = require("request");

// Example
app.get("/", (req, res) => res.send("Hello World"));

app.listen(port, () => console.log("Listening on port " + port));