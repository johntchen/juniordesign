import React from 'react';
import ReactDOM from 'react-dom';
import ContainerItem from "../../ContainerItem/ContainerItem";
import { withRouter } from "react-router-dom";


class OutputComponent extends React.Component {
  render() {
    return (
      <div>
        <ContainerItem
          app="KKNN Conus Output"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
          quibusdam iusto velit, nobis quasi provident."
        ></ContainerItem>

        <ContainerItem
          app="KKNN Gatlinburg Output"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
          quibusdam iusto velit, nobis quasi provident."
        ></ContainerItem>
      </div>
    );
  }
}

export default withRouter(OutputComponent);