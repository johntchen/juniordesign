import "./Home.scss";
import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

function Home() {
  const [value, setValue] = React.useState("application");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className="Home">
      <div className="Categories">
        <FormControl component="fieldset">
          <FormLabel component="legend">Containers</FormLabel>
          <RadioGroup
            aria-label="containers"
            name="gender1"
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
      <div className="ContainerList">container list</div>
    </div>
  );
}

export default Home;
