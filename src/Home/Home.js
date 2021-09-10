import "./Home.scss";
import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { withRouter } from "react-router-dom";
import ContainerItem from "../ContainerItem/ContainerItem";

function Home(props) {
  const [value, setValue] = React.useState("application");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const redirect = () => {
    console.log(props);
    props.history.push("/container");
  };

  //Data parsing example
  const Data = [{
    "org.label-schema.build-container_uuid": "d7742f95-32db-41b8-8002-0cca4d0db057",
    "org.label-schema.build-date": "2021-03-09 12:00:31 -0600 CST",
    "org.label-schema.schema-version": "1.0",
    "org.label-schema.usage.singularity.deffile.bootstrap": "docker",
    "org.label-schema.usage.singularity.deffile.from": "python:3.7.3",
    "org.label-schema.usage.singularity.version": "3.5.2+265-g608fcea15",
    "org.name": "KKNN"
  }, {
    "org.label-schema.build-container_uuid": "d87f4946-b908-43e9-bd75-b183787aeb0f",
    "org.label-schema.build-date": "2020-12-11 17:20:32 -0600 CST",
    "org.label-schema.schema-version": "1.0",
    "org.label-schema.usage.singularity.deffile.bootstrap": "docker",
    "org.label-schema.usage.singularity.deffile.from": "ubuntu:16.04",
    "org.label-schema.usage.singularity.version": "3.5.2+265-g608fcea15",
    "org.name": "RF"
  }, {
    "org.label-schema.build-container_uuid": "9b5c7895-d98a-4803-bf7c-a1af268c54e0",
    "org.label-schema.build-date": "2020-12-11 17:01:05 -0600 CST",
    "org.label-schema.schema-version": "1.0",
    "org.label-schema.usage.singularity.deffile.bootstrap": "docker",
    "org.label-schema.usage.singularity.deffile.from": "ubuntu:16.04",
    "org.label-schema.usage.singularity.version": "3.5.2+265-g608fcea15",
    "org.name": "SBM"
  }, {
    "org.label-schema.build-container_uuid": "3f1ae6bb-9a0e-4240-91d2-d3cb3db9304c",
    "org.label-schema.build-date": "2020-12-27 17:01:31 -0600 CST",
    "org.label-schema.schema-version": "1.0",
    "org.label-schema.usage.singularity.deffile.bootstrap": "docker",
    "org.label-schema.usage.singularity.deffile.from": "python:3.7.3",
    "org.label-schema.usage.singularity.version": "3.5.2+265-g608fcea15",
    "org.name": "Visualization"
  }]

  const getAppInfo=(containerData)=> {
    const containerItem = <ContainerItem
      app={containerData["org.name"] + " App"}
      description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              quibusdam iusto velit, nobis quasi provident."
      uuid={containerData["org.label-schema.build-container_uuid"]}
      schemaVersion={containerData["org.label-schema.schema-version"]}
      container={containerData["org.label-schema.usage.singularity.deffile.bootstrap"]}
      version={containerData["org.label-schema.usage.singularity.deffile.from"]}
    ></ContainerItem>
    return containerItem;
  }

  return (
    <div className="home">
      <div className="categories">
        <FormControl component="fieldset">
          <FormLabel component="legend">Containers</FormLabel>
          <RadioGroup
            aria-label="containers"
            name="containers"
            value={value}
            onChange={handleChange}
          >
            <FormControlLabel
              value="application"
              control={<Radio color="primary" />}
              label="Application"
            />
            <FormControlLabel
              value="input"
              control={<Radio color="primary" />}
              label="Input"
            />

            <FormControlLabel
              value="output"
              control={<Radio color="primary" />}
              label="Output"
            />
          </RadioGroup>
        </FormControl>
      </div>
      <div className="container-list">
        {Data.map(data => getAppInfo(data))}
        {/* Application */}
        {value == "application" ? (
          <ContainerItem
            app="KKNN App"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              quibusdam iusto velit, nobis quasi provident."
          ></ContainerItem>
        ) : null}

        {value == "application" ? (
          <ContainerItem
            app="RF App"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              quibusdam iusto velit, nobis quasi provident."
          ></ContainerItem>
        ) : null}

        {value == "application" ? (
          <ContainerItem
            app="SBM App"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              quibusdam iusto velit, nobis quasi provident."
          ></ContainerItem>
        ) : null}

        {value == "application" ? (
          <ContainerItem
            app="Visualization App"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              quibusdam iusto velit, nobis quasi provident."
          ></ContainerItem>
        ) : null}

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

        {value == "input" ? (
          <ContainerItem
            app="Evaluation Oklahoma"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              quibusdam iusto velit, nobis quasi provident."
          ></ContainerItem>
        ) : null}

        {value == "input" ? (
          <ContainerItem
            app="Training CONUS"
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

        {value == "output" ? (
          <ContainerItem
            app="KKNN Oklahoma Output"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              quibusdam iusto velit, nobis quasi provident."
          ></ContainerItem>
        ) : null}

        {value == "output" ? (
          <ContainerItem
            app="Plot KKNN Conus Output"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              quibusdam iusto velit, nobis quasi provident."
          ></ContainerItem>
        ) : null}
      </div>
    </div>
  );
}

export default withRouter(Home);
