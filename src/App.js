import './App.css';
import Kitchen from "./Kitchen";

function App() {
  return (
    <div className="App">
        <div className="box">
            <div className="left">
                <p>Show your kitchen</p>
            </div>
            <div className="right">
                <Kitchen />
            </div>
        </div>
    </div>
  );
}

export default App;
