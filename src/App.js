import "./App.scss";
import { useState } from "react";
import Home from "./Home/Home";
import Container from "./Container/Container";
import TextField from "@material-ui/core/TextField";
import { BrowserRouter as Router, Route, useHistory } from "react-router-dom";

function App() {
  const [route, setRoute] = useState("/");

  let history = useHistory(); 

  return (
    <Router>
      <div className="App">
        <div className="Navigation">
          <nav>
            <div>Sandia National Labs</div>
            <div className="SearchBar">
              <form action="">
                <TextField
                  id="outlined-basic"
                  label="Search"
                  variant="outlined"
                />
              </form>
            </div>
          </nav>
        </div>

        <Route path="/" exact render={(props) => <Home history={history} />} />
        <Route
          path="/container"
          exact
          render={(props) => <Container {...props} />}
        />

        <footer className="Footer">
          <div className="Footer--links">
            <ul>
              <li>Contacts</li>
              <li>Documentation</li>
              <li>FAQs</li>
            </ul>
          </div>
          <div className="Footer--copyright">
            Copyright @ 2021 Sandia National Labs
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
