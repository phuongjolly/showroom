import "./App.css";
import Kitchen from "./Kitchen";
import MoreDemo from "./MoreDemo";
import SolarSystem from "./SolarSystem";
import SolarSystemDemo from "./SolarSystemDemo";
import MainMenu from "./MainMenu/MainMenu";

function App() {
  return (
    <div className="App">
      <div className={"container"}>
        <nav className={"main-menu"}>
          <MainMenu />
        </nav>
        <section>
          <Kitchen />
        </section>
        <section>
          <MoreDemo />
        </section>
      </div>
    </div>
  );
}

export default App;
