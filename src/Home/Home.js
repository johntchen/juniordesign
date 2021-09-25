import "./Home.scss";
//import React from "react";
import * as React from 'react';
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { withRouter } from "react-router-dom";
import ContainerItem from "../ContainerItem/ContainerItem";
import axios from "axios";
import Pagination from '@mui/material/Pagination';
import { Fragment } from "react";


function Home(props) {
  const [value, setValue] = React.useState("application");
  const [containerItems, setContainerItems] = React.useState([]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const [page, setPage] = React.useState(1);
  var [itemsPerPage = 3, pageStartIndex = 0,  pageEndIndex =  3] = React.useState();
  const pageChange = (event, value) => {
    setPage(value);
    pageStartIndex = (page-1)*(itemsPerPage);
    pageEndIndex = Math.min(pageStartIndex + itemsPerPage, containerItems.length);
  };


  const redirect = () => {
    console.log(props);
    props.history.push("/container");
  };

  //Receive application data from express
  React.useEffect(() => {
    axios
      .post("http://localhost:4000/appdata")
      .then((response) => {
        setContainerItems(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

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
        {/* Application */}
        {containerItems.slice(pageStartIndex, pageEndIndex).map((data, index) => (
          <ContainerItem
            app={data["org.name"] + " App"}
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
                    quibusdam iusto velit, nobis quasi provident."
            uuid={data["org.label-schema.build-container_uuid"]}
            schemaVersion={data["org.label-schema.schema-version"]}
            container={
              data["org.label-schema.usage.singularity.deffile.bootstrap"]
            }
            version={data["org.label-schema.usage.singularity.deffile.from"]}
            key={index}
          ></ContainerItem>
        ))}

        {/* Input */}
        {value === "input" && (
          <>
            <ContainerItem
              app="Evaluation CONUS"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              quibusdam iusto velit, nobis quasi provident."
            ></ContainerItem>
            <ContainerItem
              app="Evaluation Gatlinburg"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              quibusdam iusto velit, nobis quasi provident."
            ></ContainerItem>
            <ContainerItem
              app="Evaluation Oklahoma"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              quibusdam iusto velit, nobis quasi provident."
            ></ContainerItem>
            <ContainerItem
              app="Training CONUS"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
                quibusdam iusto velit, nobis quasi provident."
            ></ContainerItem>
          </>
        )}

        {/* Output */}
        {value === "output" && (
          <>
            <ContainerItem
              app="KKNN Conus Output"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              quibusdam iusto velit, nobis quasi provident."
            ></ContainerItem>
            <ContainerItem
              app="KKNN Gatlinburg Output"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              quibusdam iusto velit, nobis quasi provident."
            ></ContainerItem>
            <ContainerItem
              app="KKNN Oklahoma Output"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              quibusdam iusto velit, nobis quasi provident."
            ></ContainerItem>
            <ContainerItem
              app="Plot KKNN Conus Output"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              quibusdam iusto velit, nobis quasi provident."
            ></ContainerItem>
          </>
        )}
        <div>
          <Pagination count={10} page={page} onChange={pageChange} />
          <h1>
            page = {page}, pageStartIndex = {pageStartIndex}, pageEndIndex = {pageEndIndex}, itemsPerPage = {itemsPerPage}
          </h1>
        </div>
      </div>

    </div>


  );
}

export default withRouter(Home);
