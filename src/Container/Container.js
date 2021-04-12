import "./Container.scss";
import React from "react";

function Container() {
  return (
    <div className="Container">
      <div className="Container__heading">
        <h1>Title</h1>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Pariatur
          voluptatem ratione cumque iusto, rem accusamus consequuntur autem
          dignissimos aspernatur. Provident, ad? Consequuntur quibusdam porro
          doloremque, assumenda quisquam, voluptatem quam non vitae nostrum
          provident ratione ducimus saepe ea quia rerum perspiciatis praesentium
          nihil in id. Omnis impedit ad nostrum quia eius?
        </p>
        <nav>some links</nav>
      </div>
      <div className="Container__subsection">subsection for container</div>
    </div>
  );
}

export default Container;
