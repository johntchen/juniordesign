# Junior Design Team 1103 Project Release Notes

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