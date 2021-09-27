import "./App.scss";
import { useState } from "react";
import Home from "./Home/Home";
import Container from "./Container/Container";
import TextField from "@material-ui/core/TextField";
import { BrowserRouter as Router, Route, useHistory } from "react-router-dom";

function HomeButton() {
  let history = useHistory();

  function handleClick() {
    history.push("/");
  }

  return (
    <h2 className="navigation__title" onClick={handleClick}>
      Sandia National Labs
    </h2>
  );
}

function App() {
  const [route, setRoute] = useState("/");
  let history = useHistory();

  function returnHome() {
    history.push("/");
  }

  function handleClick() {
    history.push("/");
  }

  return (
    <Router>
      <div className="App">
        {/* Nav */}
        <div className="navigation">
          <nav className="section"> 
            <HomeButton></HomeButton>
            {/* Below code is weird, and is replaced by above line */}
            {/* <div className="navigation__title" onClick={handleClick}>
              <h2 className="navigation-text">Sandia National Labs</h2>
            </div> */}
            <div className="search-bar">
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

        {/* Routes */}
        <Route path="/" exact render={(props) => <Home history={history} />} />
        <Route
          path="/container"
          exact
          render={(props) => <Container {...props} />}
        />

        {/* Footer */}
        <footer className="footer">
          <div className="footer__container">
            <div className="footer__links">
              <ul>
                <li>Contacts</li>
                <li>Documentation</li>
                <li>FAQs</li>
              </ul>
            </div>
            <div className="footer__copyright">
              Copyright @ 2021 Sandia National Labs
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
