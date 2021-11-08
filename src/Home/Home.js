import "./Home.scss";
import ContainerItem from "../ContainerItem/ContainerItem";

import axios from "axios";
import { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import Pagination from "@mui/material/Pagination";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

function Home() {
  const [value, setValue] = useState("application");
  const [containerItems, setContainerItems] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 3;

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const pageChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    axios
      .get("http://localhost:4000/applicationData")
      .then((response) => {
        setContainerItems(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  useEffect(() => {
    axios
      .get("http://localhost:4000/workflow", {params: {name: "p-knn_app"}})
      .then((response) => {
        console.log(response)
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
        {containerItems
          .slice((page - 1) * itemsPerPage, page * itemsPerPage)
          .map((data, index) => (
            <ContainerItem
              app={data["org.name"] + " App"}
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
                    quibusdam iusto velit, nobis quasi provident."
              uuid={data["org.label-schema.build-container_uuid"]}
              schemaVersion={data["org.label-schema.schema-version"]}
              container={
                data["org.label-schema.usage.singularity.deffile.bootstrap"]
              }
              runtimeVersion={
                data["org.label-schema.usage.singularity.deffile.from"]
              }
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
        <div className="center-left-right">
          <Pagination
            count={Math.ceil(containerItems.length / itemsPerPage)}
            page={page}
            onChange={pageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default withRouter(Home);
