import "./App.css";
import Kitchen from "./Kitchen";
import MoreDemo from "./MoreDemo";
import SolarSystem from "./SolarSystem";
import SolarSystemDemo from "./SolarSystemDemo";

function App() {
  return (
    <div className="App">
      <div className={"container"}>
        <section>
          <Kitchen />
        </section>
        <section>
          <MoreDemo />
        </section>
        <section></section>
      </div>
    </div>
  );
}

export default App;
