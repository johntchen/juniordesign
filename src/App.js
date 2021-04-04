import "./App.scss";
import Home from "./Home/Home";
import TextField from "@material-ui/core/TextField";

function App() {
  return (
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
      <Home />
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
  );
}

export default App;
