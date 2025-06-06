import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Options from "./components//categories/choice/Options";
import Exercise from "./components/exercise/Exercise";
import Home from "./components/home/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import { useLocation } from "react-router-dom";
import DoneExercise from "./components/exercise/DoneExercise";
import NewList from "./components/home/lists/NewList";
import Leaderboard from "./components/leaderboard/Leaderboard";
import LoginContainer from "./components/account/LoginContainer";
import Account from "./components/account/Account";
import UpdateList from "./components/home/lists/UpdateList";

function App() {
  const location = useLocation();
  const isGradientPage =
    location.pathname === "/options" || location.pathname === "/exercise";

  console.log(isGradientPage);

  return (
    <div className={`App ${isGradientPage ? "gradient-bg" : ""}`}>
      <Header isGradientPage={isGradientPage} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/options" element={<Options />} />
        <Route path="/exercise" element={<Exercise />} />
        <Route path="/exercise-done" element={<DoneExercise />} />
        <Route path="/new-list" element={<NewList />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/login" element={<LoginContainer />} />
        <Route path="/account" element={<Account />} />
        <Route path="/list/:id" element={<UpdateList />} />
      </Routes>
    </div>
  );
}

export default App;
