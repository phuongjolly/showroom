import "./App.css";
import Kitchen from "./Kitchen/Kitchen";
import MainMenu from "./MainMenu/MainMenu";
import Footer from "./Footer/Footer";
import AboutMe from "./About/AboutMe";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Kitchen />,
  },
  {
    path: "/about-me",
    element: <AboutMe />,
  },
]);
function App() {
  return (
    <div className="App">
      <div className={"container"}>
        <nav className={"main-menu"}>
          <MainMenu />
        </nav>
        <section>
          <RouterProvider router={router} />
        </section>
        <section>
          <Footer />
        </section>
      </div>
    </div>
  );
}

export default App;
