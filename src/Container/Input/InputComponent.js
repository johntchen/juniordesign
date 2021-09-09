import React from 'react';
import ReactDOM from 'react-dom';
import ContainerItem from "../ContainerItem/ContainerItem";


class InputComponent extends React.Component {
  render() {
    return 
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
    ;
  }
}

export default InputComponent;