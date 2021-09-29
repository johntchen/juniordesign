import "./App.scss";
import Home from "./Home/Home";
import Container from "./Container/Container";
import { Route, Switch, useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";

function App() {
  let history = useHistory();

  const returnHome = () => {
    history.push("/");
  };

  return (
    <div className="App">
      <div className="header-bar">
        <nav className="section">
          <h2 className="header-title" onClick={returnHome}>
            Sandia National Labs
          </h2>
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

      <Switch>
        <Route path="/" exact render={(props) => <Home {...props} />} />
        <Route
          path="/container"
          exact
          render={(props) => <Container {...props} />}
        />
      </Switch>

      <footer className="footer">
        <div className="footer__container">
          <div className="footer__links">
            <ul>
              <li>ContactsÎ</li>
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
  );
}

export default App;
