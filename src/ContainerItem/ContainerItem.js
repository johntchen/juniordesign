import "./ContainerItem.scss";
import React from "react";
import { withRouter } from "react-router-dom";

function ContainerItem(props) {
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
        <h3>{props.app}</h3>
        <br></br>
        <p> {props.description}</p>
        <br></br>
        <ul className="container-item__tags">
          <li>tag</li>
          <li>tag</li>
          <li>tag</li>
          <li>tag</li>
        </ul>
      </div>
    </div>
  );
}

export default withRouter(ContainerItem);
