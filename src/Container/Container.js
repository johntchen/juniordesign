import "./Container.scss";
import React from "react";
import ContainerItem from "../ContainerItem/ContainerItem";



function Container() {

  const [value, setValue] = React.useState("input");

  function inputClicked() {
    setValue('input');
  };

  function outputClicked() {
    setValue('output');
  };

  function workflowClicked() {
    setValue('workflow');
  };

  return (
    <div className="Container">
      <div className="Heading">
        <div className="section">
          <h1 className="Heading__title">KKNN Application</h1>
          <p className="Heading__desc">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
            repudiandae, voluptatem maxime iure maiores nisi vero cupiditate
            quae tenetur numquam repellat necessitatibus quam excepturi,
            provident tempore aut omnis, incidunt quidem fuga dolor! Cupiditate
            quis necessitatibus voluptatem exercitationem neque obcaecati
            magnam. Placeat, harum quo! Amet, quidem veritatis laborum
            repudiandae reiciendis odit. Lorem ipsum dolor sit amet consectetur,
            adipisicing elit. Fuga, nulla.
          </p>
          <ul className="Heading__tags">
            <li>tag</li>
            <li>tag</li>
            <li>tag</li>
            <li>tag</li>
          </ul>

          <div className="Heading__tabs">
            <div className="Heading__tab" onClick={inputClicked}>Input</div>
            <div className="Heading__tab" onClick={outputClicked}>Output</div>
            <div className="Heading__tab" onClick={workflowClicked}>Workflow</div>
          </div>
        </div>
      </div>

      <div className="Subsection">

        {/* Input */}
        {value == "input" ? (
          <ContainerItem
            app="Evaluation CONUS"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              quibusdam iusto velit, nobis quasi provident."
          ></ContainerItem>
        ) : null}

        {value == "input" ? (
          <ContainerItem
            app="Evaluation Gatlinburg"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              quibusdam iusto velit, nobis quasi provident."
          ></ContainerItem>
        ) : null}

        {/* Output */}
        {value == "output" ? (
          <ContainerItem
            app="KKNN Conus Output"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              quibusdam iusto velit, nobis quasi provident."
          ></ContainerItem>
        ) : null}

        {value == "output" ? (
          <ContainerItem
            app="KKNN Gatlinburg Output"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              quibusdam iusto velit, nobis quasi provident."
          ></ContainerItem>
        ) : null}

        {/* Workflow */}
        {value == "workflow" ? (
          <ContainerItem
            app="CoreJJ"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              quibusdam iusto velit, nobis quasi provident."
          ></ContainerItem>
        ) : null}

        {value == "workflow" ? (
          <ContainerItem
            app="Dabbers"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              quibusdam iusto velit, nobis quasi provident."
          ></ContainerItem>
        ) : null}
        
      </div>
    </div>
  );
}

export default Container;
