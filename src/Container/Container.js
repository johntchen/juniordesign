import "./Container.scss";
import React from "react";
import InputComponent from "../Container/Input/InputComponent";
import OutputComponent from "../Container/Output/OutputComponent";
import WorkflowComponent from "../Container/Workflow/WorkflowComponent";

function Container(props) {
  console.log(props.location.state.containerTitle);

  const [value, setValue] = React.useState("input");

  const inputClicked = ( ) => {
    setValue("input");
  }

  const outputClicked = () => {
    setValue("output");
  }

  const workflowClicked = () => {
    setValue("workflow");
  }

  return (
    <div className="container">
      <div className="heading">
        <div className="section">
          <h2 className="heading__title">{props.location.state.containerTitle}</h2>
          <p className="heading__desc">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
            repudiandae, voluptatem maxime iure maiores nisi vero cupiditate
            quae tenetur numquam repellat necessitatibus quam excepturi,
            provident tempore aut omnis, incidunt quidem fuga dolor! Cupiditate
            quis necessitatibus voluptatem exercitationem neque obcaecati
            magnam. Placeat, harum quo! Amet, veritatis laborum repudiandae
            reiciendis odit. Lorem ipsum dolor sit amet consectetur, adipisicing
            elit. Fuga, nulla.
          </p>
          <ul className="heading__tags">
            <li>tag1</li>
            <li>tag2</li>
            <li>tag3</li>
            <li>tag4</li>
          </ul>

          <div className="heading__tabs">
            <div className="heading__tab" onClick={inputClicked}>
              Input
            </div>
            <div className="heading__tab" onClick={outputClicked}>
              Output
            </div>
            <div className="heading__tab" onClick={workflowClicked}>
              Workflow
            </div>
          </div>
        </div>
      </div>

      <div className="subsection">
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
            <WorkflowComponent app={props.appName}></WorkflowComponent>     
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Container;
