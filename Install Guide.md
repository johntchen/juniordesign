# Junior Design Team 1103 Project Installation Guide

## Pre-requisites
This application runs React on the front end, uses Neo4j on the backend, and uses Express to query information from the back end to the front end. If the system can run these, then the application will be able to run.

## Dependent libraries that must be installed
The necessary dependant librarys will be installed via the processes in the "README" file. The most prominent dependency we have used in the React side of our project is Cytoscape.

## Download instructions
The application may be accessed through this Github project, which may be cloned as desired.

## Build instructions
The project may be launched locally through the instructions given in the "README" file. Because this is a web application project, the project may be hosted online by passing it to any web hosting service.

## Installation of actual application
All files in the "backend" and "src" directories are relevant to the project running propperly. Notably, the "backend/upload.js" file uploads data to the database from local files, and currently requires both a set of neo4j database address information as well as the location of the directory in which the container information is from; this is currently hard-coded to the neo4j database which we have used for our demo and the "backend/Example-of-workflows" folders, respectively.

## Run instructions
Run instructions are included in the "README" file. If you would like to access the current neo4j database, it can be currently accessed via the link "https://e555b9c1.databases.neo4j.io/browser/", with the Username "neo4j" and the password "56rf2y-C5bBKU2JVngj9IH2uEseoCJeKa5eIs9Z5E2A".

## Troubleshooting
1. General notes: as noted, the project uses React, Express, Neo4j, and the Cytoscape for React dependency. For future support and development, please refer to the documentation for those systems.
2. If having trouble in installation, please make sure that you are running "npm install" and "npm install express --save" in the correct directories. the "README" files has other troubleshooting tips.
3. If having trouble running the backend server, it is possible that the Neo4j cloud database is offline and may need to be relauched by visiting the Neo4j database website.


