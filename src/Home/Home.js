import "./Home.scss";
import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { withRouter } from "react-router-dom";

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
              control={<Radio />}
              label="Application"
            />
            <FormControlLabel value="input" control={<Radio />} label="Input" />
            <FormControlLabel
              value="output"
              control={<Radio />}
              label="Output"
            />
          </RadioGroup>
        </FormControl>
      </div>
      <div className="ContainerList">
        <div className="ContainerListItem" onClick={redirect}>
          <div className="ContainerListItem__img"></div>
          <div className="ContainerListItem__desc">
            <h3>Container Name</h3>
            <p>
              {" "}
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              quibusdam iusto velit, nobis quasi provident.
            </p>
          </div>
        </div>

        <div className="ContainerListItem" onClick={redirect}>
          <div className="ContainerListItem__img"></div>
          <div className="ContainerListItem__desc">
            <h3>Container Name</h3>
            <p>
              {" "}
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              quibusdam iusto velit, nobis quasi provident.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Home);
