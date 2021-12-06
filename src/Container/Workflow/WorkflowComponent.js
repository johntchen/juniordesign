import "./WorkflowComponent.scss";
import ReactDOM from "react-dom";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import ContainerItem from "../../ContainerItem/ContainerItem";
import { withRouter } from "react-router-dom";
import {
  Checkbox,
  Radio,
  FormGroup,
  FormControlLabel,
  FormControl,
  RadioGroup,
} from "@mui/material";
import { ListItemText, ListItem, List, ListItemIcon } from "@material-ui/core";
import StorageIcon from "@mui/icons-material/Storage";
import axios from "axios";
import { useEffect, useState } from "react";

function WorkflowComponent(props) {
  const [view, setView] = useState("graph");
  const [graphElements, setGraphElements] = useState([]);
  const [graph, setGraph] = useState(undefined);

  useEffect(() => {
    axios
      .get("http://localhost:4000/workflow", {
        params: { name: props.app ?? "p-knn_app" },
      })
      .then((response) => {
        const retrievedNodes = response["data"][0].map(
          (record) => record._fields[0].properties.name
        );

        let elements = retrievedNodes.map((nodeName) => ({
          data: { id: nodeName, label: nodeName },
        }));

        const edgesResponse = response["data"][1]["records"];

        if (edgesResponse) {
          const retrievedEdges = edgesResponse.map((record) => record._fields);
          elements = elements.concat(
            retrievedEdges.map((edge) => ({
              data: { source: edge[0], target: edge[2], label: edge[1] },
            }))
          );
          setGraphElements(elements);
        }
      })
      .catch(function (error) {
        console.log("ERROR IN WORKFLOW COMPONENT:", error);
      });
  }, []);

  const handleRadioChange = (e) => {
    setView(e.target.value);
  };

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
              <FormControlLabel
                value="graph"
                control={<Radio />}
                label="Graph View"
              />
              <FormControlLabel
                value="list"
                control={<Radio />}
                label="List View"
              />
            </RadioGroup>
          </FormControl>
        </div>

        <div className="workflowCheckbox">
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Input"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Output"
            />
          </FormGroup>
        </div>
      </div>

      <div className="workflowView">
        {view === "graph" && (
          <CytoscapeComponent
            cy={(cy) =>
              cy.on("add", "node", (_evt) => {
                cy.layout({ name: "breadthfirst" }).run();
              })
            }
            layout={{ name: "breadthfirst" }}
            elements={graphElements}
            style={{
              width: "800px",
              height: "400px",
              outline: "2px solid black",
            }}
            stylesheet={[
              {
                selector: "node",
                style: {
                  width: 30,
                  height: 30,
                  "background-color": "darkcyan",
                  "background-opacity": 0.5,
                  "border-width": 1.5,
                  "border-color": "teal",
                  label: "data(label)",
                },
              },
              {
                selector: "edge",
                style: {
                  width: 2,
                  "curve-style": "bezier",
                  "target-arrow-shape": "triangle",
                },
              },
            ]}
          />
        )}

        {view === "list" && (
          <>
            <div className="workflowList">
              <h5>Inputs</h5>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <StorageIcon />
                  </ListItemIcon>
                  <ListItemText primary="Evaluation CONUS" />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <StorageIcon />
                  </ListItemIcon>
                  <ListItemText primary="Evaluation Gatlinburg" />
                </ListItem>
              </List>
            </div>

            <div className="workflowList">
              <h5>Outputs</h5>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <StorageIcon />
                  </ListItemIcon>
                  <ListItemText primary="KKNN Conus Output" />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <StorageIcon />
                  </ListItemIcon>
                  <ListItemText primary="KKNN Gatlinburg Output" />
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
