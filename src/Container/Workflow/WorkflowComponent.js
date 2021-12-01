import "./WorkflowComponent.scss";
import ReactDOM from 'react-dom';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from "cytoscape";
import ContainerItem from "../../ContainerItem/ContainerItem";
import { withRouter } from "react-router-dom";
import { Checkbox, Radio, FormGroup, FormControlLabel, FormControl, RadioGroup } from "@mui/material";
import { ListItemText, ListItem, List, ListItemIcon } from "@material-ui/core";
import StorageIcon from '@mui/icons-material/Storage';
import axios from "axios";
import { useEffect, useState } from "react";
import { LayersRounded } from "@mui/icons-material";


function WorkflowComponent(props) {
  console.log("WORKFLOWCOMPONENT FUNCTION CALLED");
  console.log(props);
  console.log(props.location.state.appName);
  const [view, setView] = useState("graph");
  const [workflowEdges, setWorkflowEdges] = useState([]);
  const [workflowNodes, setWorkflowNodes] = useState([]);

  

  useEffect(() => {
    console.log("USEEFFECT CALLED");
    let retrievedData = [];
    let retreivedNodes = [];
    axios
      .get("http://localhost:4000/workflow", {params:{name:props.location.state.appName ?? "testInput"}})
      .then((response) => {
        retreivedNodes = response["data"][0].map(record => record._fields[0].properties.name);
        setWorkflowNodes(retreivedNodes);
        retrievedData = response["data"][1]["records"].map(record => record._fields);
        setWorkflowEdges(retrievedData);
      })
      .catch(function (error) {
        console.log("ERROR IN WORKFLOW COMPONENT:", error);
      });
  });

  const handleRadioChange = (e) => {
    setView(
      e.target.value
    );
  }
  //x: Math.random()*600, y: Math.random()*300
  let layout = { name: 'circle' };
  
  let elements = workflowNodes.map(nodeName => ({ 
    data: { id: nodeName, label: nodeName }, 
    position: { x:10, y:10 } 
  }));
  elements = elements.concat(workflowEdges.map(edge => 
    ({ data: { source: edge[0], target: edge[2], label: edge[1] } })));
    


    return (
      <div className="workflow">
        <div className="workflowOptions">
          <div className="workflowRadio">
              <FormControl component="fieldset">
                <RadioGroup
                  value={view}
                  name="workflow-radio-group"
                  onChange={handleRadioChange}
                >
                  <FormControlLabel value="graph" control={<Radio />} label="Graph View" />
                  <FormControlLabel value="list" control={<Radio />} label="List View" />
                </RadioGroup>
              </FormControl>
          </div>

          <div className="workflowCheckbox">
            <FormGroup>
              <FormControlLabel control={<Checkbox defaultChecked/>} label="Input"/>
              <FormControlLabel control={<Checkbox defaultChecked/>} label="Output"/>
            </FormGroup>
          </div>
        </div>

        <div className="workflowView">
          {view === "graph" &&
            <CytoscapeComponent 
            layout={layout}
            elements={elements}
            style={{ width: '800px', height: '400px', outline: '2px solid black' }}
            stylesheet={[
              {
                selector: 'node',
                style: {
                  width: 30,
                  height: 30,
                  // shape: 'circle',
                  'background-color': 'darkcyan',
                  'background-opacity': 0.5,
                  'border-width': 1.5,
                  'border-color': 'teal',
                  label: 'data(label)'
                }
              },
              {
                selector: 'edge',
                style: {
                  width: 2,
                  'curve-style': 'bezier',
                  'target-arrow-shape': 'triangle'
                }
              }
            ]} 
          />
          }

          {view === "list" && (
            <> 
            <div className="workflowList">
              <h5>Inputs</h5>
              <List>

                <ListItem>
                  <ListItemIcon>
                    <StorageIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Evaluation CONUS"/>
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <StorageIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Evaluation Gatlinburg"/>
                </ListItem>

              </List>
            </div>

            <div className="workflowList">
              <h5>Outputs</h5>
              <List>

                <ListItem>
                  <ListItemIcon>
                    <StorageIcon/>
                  </ListItemIcon>
                  <ListItemText primary="KKNN Conus Output"/>
                </ListItem>

                <ListItem>
                <ListItemIcon>
                  <StorageIcon/>
                  </ListItemIcon>
                  <ListItemText primary="KKNN Gatlinburg Output"/>
                </ListItem>
              </List>
            </div>
            </>
          )} 
        </div>
      </div>
    );
}
export default withRouter(WorkflowComponent);