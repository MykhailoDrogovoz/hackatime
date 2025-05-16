import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Options from "./components//categories/choice/Options";
import Exercise from "./components/exercise/Exercise";
import Home from "./components/home/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        {/* <Header /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/options" element={<Options />} />
          <Route path="/exercise" element={<Exercise />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
