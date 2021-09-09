import "./Container.scss";
import React from "react";
import ContainerItem from "../ContainerItem/ContainerItem";
import InputComponent from "../Container/Input/InputComponent";
import OutputComponent from "../Container/Output/OutputComponent";
import WorkflowComponent from "../Container/Workflow/WorkflowComponent";

function Container() {
  const [value, setValue] = React.useState("input");

  function inputClicked() {
    setValue("input");
  }

  function outputClicked() {
    setValue("output");
  }

  function workflowClicked() {
    setValue("workflow");
  }

  return (
    <div className="Container">
      <div className="Heading">
        <div className="section">
          <h2 className="Heading__title">KKNN Application</h2>
          <p className="Heading__desc">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
            repudiandae, voluptatem maxime iure maiores nisi vero cupiditate
            quae tenetur numquam repellat necessitatibus quam excepturi,
            provident tempore aut omnis, incidunt quidem fuga dolor! Cupiditate
            quis necessitatibus voluptatem exercitationem neque obcaecati
            magnam. Placeat, harum quo! Amet, veritatis laborum
            repudiandae reiciendis odit. Lorem ipsum dolor sit amet consectetur,
            adipisicing elit. Fuga, nulla.
          </p>
          <ul className="Heading__tags">
            <li>tag1</li>
            <li>tag2</li>
            <li>tag3</li>
            <li>tag4</li>
          </ul>

          <div className="Heading__tabs">
            <div className="Heading__tab" onClick={inputClicked}>
              Input
            </div>
            <div className="Heading__tab" onClick={outputClicked}>
              Output
            </div>
            <div className="Heading__tab" onClick={workflowClicked}>
              Workflow
            </div>
          </div>
        </div>
      </div>

      <div className="Subsection">
        <div className="section">
          {/* Input */}
          {value == "input" ? (
            <InputComponent></InputComponent>
            ) : null}

          {/* Output */}
          {value == "output" ? (
            <OutputComponent></OutputComponent>     
            ) : null}

          {/* Workflow */}
          {value == "workflow" ? (
            <WorkflowComponent></WorkflowComponent>     
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Container;
