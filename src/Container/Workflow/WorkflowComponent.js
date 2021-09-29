import React from 'react';
import ReactDOM from 'react-dom';
import CytoscapeComponent from 'react-cytoscapejs';
import ContainerItem from "../../ContainerItem/ContainerItem";
import { withRouter } from "react-router-dom";


class WorkflowComponent extends React.Component {
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
      <CytoscapeComponent elements={elements} style={ { width: '600px', height: '600px' } } />
    );
  }
}

export default withRouter(WorkflowComponent);