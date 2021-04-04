import "./App.scss";
import Home from "./Home/Home";

function App() {
  return (
    <div className="App">
      <nav className="Navigation">
        <div>Sandia National Labs</div>
        {/* <ul>
          <li>Component</li>
          <li>Link</li>
        </ul> */}
        <div className="SearchBar">Search Bar</div>
      </nav>
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
