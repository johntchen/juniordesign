import "./ContainerItem.scss";
import React from "react";
import { withRouter } from "react-router-dom";

function ContainerItem(props) {
  const { app, description, schemaVersion, container, runtimeVersion } = props;

  const redirect = () => {
    props.history.push("/container");
  };

  return (
    <div className="container-item" onClick={redirect}>
      <div className="container-item__img">
        <img
          src="https://www.computerhope.com/jargon/d/database.jpg"
          alt="database"
          className=""
        />
      </div>
      <div className="container-item__desc">
        <h3>{app}</h3>
        <br></br>
        <p> {description}</p>
        <br></br>
        <ul className="container-item__tags">
          <li>Schema Version: {schemaVersion}</li>
          <li>Container: {container}</li>
          <li>Runtime Version: {runtimeVersion}</li>
        </ul>
      </div>
    </div>
  );
}

export default withRouter(ContainerItem);
