# Junior Design Team 1103 Prototype Demo

# Installation and Launch Summary

## To Upload File Data:
1. If first time, cd to juniordesign/backend and then run command (otherwise skip this step):
"npm install"
2. then run command(NOTE: THIS will delete the current database and re-upload baded on local file information.):
"node upload.js"

## To Run The Server:
1. If first time, cd to juniordesign/backend and then run command (otherwise skip this step):
"npm install express --save"
2. then run command:
"node index.js"

## To Load Frontend Page:
(Remember to start server first to allow for frontend page data retrieval)
1. If first time, cd to juniordesign/ and then run command (otherwise skip this step):
"npm install"
2. then run command:
"npm start"

## Misc Issues
If having pagination errors, try:
npm install @emotion/react --save
npm install @emotion/styled --save

If "Can't resolve react-cytoscapejs", run: 
"npm i" in juniordesign/



# Project Release Notes

## Version 1.0

## Software Features
1. Menu screen is dynamically rendered based on information in the Neo4j backend database
2. Clicking on any of the containers in the menu brings the user to a page about that container
3. On a container's page, clicking on the workflow tab displays a graph which represents the workflow that container is a part of
4. Included is a sepperate file which, when run, reads the JSON files in a directory and uploads them to the Neo4j database

## Bug Fixes
1. Fixed container pages constantly being re-rendered
2. Improved (but did not complete) on issues with data files not being fully uploaded to the Neo4j database; see next section
3. Graphs are now displayed in a more organized layout.

## Known Bugs, Defects, and Missing Features
1. Graphs will not render if the container in question is not connected to other nodes. This case causes the container page's request to the backend to begin, but not end. We beleive this issue is due to the backend's attempts to find leaf nodes of the singular node's tree.
2. The application which uploads data to the Neo4j database does not upload all edges. We beleive this is due to Neo4j's commands being run asynchronously, and so some commands to create edges are enacted before the nodes they fit between are actually uploaded, causing that edge to be lost. At the time of submitting this project, the database has been manually fixed to include all missing edges.
3. Sometimes, in the home page, switching between container types might be slow or not change the containers displayed.
4. Sometimes, when in a container page, returning home leaves a blank list of containers until the container type is changed or the page is refreshed.
5. Missing feature: Top search bar is not functional; however, the backend calls necessary to implement them are already in backend/index.js.
6. Missing feature: Container page's inputs and outputs tabs are not functional.
7. Missing feature: Container Page's workflow List View is not implemented.



# Detailed Project Installation Guide

## Pre-requisites
This application runs React on the front end, uses Neo4j on the backend, and uses Express to query information from the back end to the front end. If the system can run these, then the application will be able to run.

## Dependent libraries that must be installed
The necessary dependant librarys will be installed via the processes in the "Installation and Launch Summary" section. The most prominent dependency we have used in the React side of our project is Cytoscape.

## Download instructions
The application may be accessed through this Github project, which may be cloned as desired.

## Build instructions
The project may be launched locally through the instructions given in the "Installation and Launch Summary" section. Because this is a web application project, the project may be hosted online by passing it to any web hosting service.

## Installation of actual application
All files in the "backend" and "src" directories are relevant to the project running propperly. Notably, the "backend/upload.js" file uploads data to the database from local files, and currently requires both a set of neo4j database address information as well as the location of the directory in which the container information is from; this is currently hard-coded to the neo4j database which we have used for our demo and the "backend/Example-of-workflows" folders, respectively.

## Run instructions
Run instructions are included in the "Installation and Launch Summary" section. If you would like to access the current neo4j database, it can be currently accessed via the link "https://e555b9c1.databases.neo4j.io/browser/", with the Username "neo4j" and the password "56rf2y-C5bBKU2JVngj9IH2uEseoCJeKa5eIs9Z5E2A".

## Troubleshooting
1. General notes: as noted, the project uses React, Express, Neo4j, and the Cytoscape for React dependency. For future support and development, please refer to the documentation for those systems.
2. If having trouble in installation, please make sure that you are running "npm install" and "npm install express --save" in the correct directories. The "Installation and Launch Summary" section files has other troubleshooting tips.
3. If having trouble running the backend server, it is possible that the Neo4j cloud database is offline and may need to be relauched by visiting the Neo4j database website.

# Acknowledgments
We acknowledge the support of Sandia National Laboratories and the Global Computing Lab at the University of Tennessee, Knoxville through the projects “SOMOSPIE: A modular SOil MOisture SPatial Inference Engine” and “SENSORY: Software Ecosystem for kNowledge diScOveRY - a data-driven framework for soil moisture applications” funded by the National Science Foundation (NSF) under grant numbers 1724843, 2103845, and 2103836.



