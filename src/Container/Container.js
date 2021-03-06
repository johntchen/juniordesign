import "./Container.scss";
import React from "react";
import ContainerItem from "../ContainerItem/ContainerItem";

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
    <div className="container">
      <div className="heading">
        <div className="section">
          <h2 className="heading__title">KKNN Application</h2>
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
              app="KKNN Application"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              quibusdam iusto velit, nobis quasi provident."
            ></ContainerItem>
          ) : null}

          {value == "workflow" ? (
            <ContainerItem
              app="RF Application"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              quibusdam iusto velit, nobis quasi provident."
            ></ContainerItem>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Container;
