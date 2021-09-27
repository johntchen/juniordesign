import "./WorkflowComponent.scss";
import React from 'react';
import ReactDOM from 'react-dom';
import ContainerItem from "../../ContainerItem/ContainerItem";
import { withRouter } from "react-router-dom";
import { Checkbox, FormGroup, FormControlLabel  } from "@mui/material";
import chartImage from "./traceability.png";

class WorkflowComponent extends React.Component {
  render() {
    return (
      <div class="workflow">
        <div class="workflowCheckbox">
          <FormGroup>
            <FormControlLabel control={<Checkbox defaultChecked/>} label="Input"/>
            <FormControlLabel control={<Checkbox defaultChecked/>} label="Output"/>
          </FormGroup>
        </div>
        <div>
          <img src={chartImage} alt="chart"/>
        </div>
      </div>
    );
  }
}

export default withRouter(WorkflowComponent);