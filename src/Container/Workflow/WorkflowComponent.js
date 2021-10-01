import "./WorkflowComponent.scss";
import React from 'react';
import ReactDOM from 'react-dom';
import CytoscapeComponent from 'react-cytoscapejs';
import ContainerItem from "../../ContainerItem/ContainerItem";
import { withRouter } from "react-router-dom";
import { Checkbox, Radio, FormGroup, FormControlLabel, FormControl, RadioGroup } from "@mui/material";
import { ListItemText, ListItem, List, ListItemIcon } from "@material-ui/core";
import StorageIcon from '@mui/icons-material/Storage';


class WorkflowComponent extends React.Component {
  state = {
    view: "graph"
  }

  handleRadioChange = (e) => {
    this.setState({
      view: e.target.value
    });
  }

  render() {

  const elements = [
    { data: { id: 'input_node1', label: 'Evaluation CONUS' }, position: { x: 100, y: 100 } },
    { data: { id: 'input_node2', label: 'Evaluation Gatlinburg' }, position: { x: 100, y:  200} },
    
    { data: { id: 'app_node1', label: 'KKNN Application' }, position: { x: 300, y:  100} },

    { data: { id: 'output_node1', label: 'KKNN Conus Output' }, position: { x: 500, y:  100} },
    { data: { id: 'output_node2', label: 'KKNN Gatlinburg Output' }, position: { x: 500, y:  200} },

    { data: { source: 'input_node1', target: 'app_node1', label: 'input_node1 to app_node1 edge' } },
    { data: { source: 'input_node2', target: 'app_node1', label: 'input_node2 to app_node1 edge' } },
    { data: { source: 'app_node1', target: 'output_node1', label: 'app_node1 to output_node1 edge' } },
    { data: { source: 'app_node1', target: 'output_node2', label: 'app_node1 to output_node2 edge' } }
  ];

    return (
      <div class="workflow">
        <div class="workflowOptions">
          <div class="workflowRadio">
              <FormControl component="fieldset">
                <RadioGroup
                  value={this.state.view}
                  name="workflow-radio-group"
                  onChange={this.handleRadioChange}
                >
                  <FormControlLabel value="graph" control={<Radio />} label="Graph View" />
                  <FormControlLabel value="list" control={<Radio />} label="List View" />
                </RadioGroup>
              </FormControl>
          </div>

          <div class="workflowCheckbox">
            <FormGroup>
              <FormControlLabel control={<Checkbox defaultChecked/>} label="Input"/>
              <FormControlLabel control={<Checkbox defaultChecked/>} label="Output"/>
            </FormGroup>
          </div>
        </div>

        <div class="workflowView">
          {this.state.view === "graph" &&
            <CytoscapeComponent elements={elements} 
            style={{ width: '800px', height: '400px', outline: '2px solid black' }} 
            stylesheet={[
              {
                selector: 'node',
                style: {
                  width: 30,
                  height: 30,
                  shape: 'circle',
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

          {this.state.view === "list" && (
            <> 
            <div class="workflowList">
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

            <div class="workflowList">
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
}

export default withRouter(WorkflowComponent);