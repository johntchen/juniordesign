import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import ContainerItem from "../../ContainerItem/ContainerItem";
import { withRouter } from "react-router-dom";


class InputComponent extends React.Component {
  render() {
    return (
      <Fragment>
        <ContainerItem
          app="Evaluation CONUS"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
          quibusdam iusto velit, nobis quasi provident."
        ></ContainerItem>

        <ContainerItem
          app="Evaluation Gatlinburg"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
          quibusdam iusto velit, nobis quasi provident."
        ></ContainerItem>
      </Fragment>
    );
  }
}

export default withRouter(InputComponent);