import "./Container.scss";
import React from "react";

function Container() {
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
            <div className="Heading__tab">Input</div>
            <div className="Heading__tab">Output</div>
            <div className="Heading__tab">Workflow</div>
          </div>
        </div>
      </div>

      <div className="Subsection">
        <div className="section"></div>
      </div>
    </div>
  );
}

export default Container;
