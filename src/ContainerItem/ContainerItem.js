import "./ContainerItem.scss";
import React from "react";
import { withRouter } from "react-router-dom";

function ContainerItem(props) {
  const { app, description, schemaVersion, container, pythonVersion } = props;

  const redirect = () => {
    console.log(props);
    props.history.push("/container");
  };

  return (
    <div className="container-item" onClick={redirect}>
      <div className="container-item__img">
        <img src="" alt="" className="" />
      </div>
      <div className="container-item__desc">
        <h3>{app}</h3>
        <br></br>
        <p> {description}</p>
        <br></br>
        <ul className="container-item__tags">
          <li>Schema Version: {schemaVersion}</li>
          <li>Container: {container}</li>
          <li>Python Version: {pythonVersion}</li>
        </ul>
      </div>
    </div>
  );
}

export default withRouter(ContainerItem);
