import "./App.scss";
import {useState, useEffect} from "react";
import Home from "./Home/Home";
import Container from "./Container/Container";
import TextField from "@material-ui/core/TextField";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  const [page, setPage] = useState("/"); 

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
        
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/container" component={Container} />
        </Switch>

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
