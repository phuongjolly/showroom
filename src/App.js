import "./App.css";
import Kitchen from "./Kitchen";
import MoreDemo from "./MoreDemo";
import MainMenu from "./MainMenu/MainMenu";
import Footer from "./Footer/Footer";

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
        <section>
          <Footer />
        </section>
      </div>
    </div>
  );
}

export default App;
