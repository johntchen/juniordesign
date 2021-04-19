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

  return (
    <div className="Home">
      <div className="Categories">
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
      <div className="ContainerList">
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
