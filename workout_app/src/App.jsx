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
import MusicPlayer from "./components/music/MusicPlayer";
import { useEffect } from "react";
import globalAudioManager from "./GlobalAudioManager";
import VerifyEmail from "./components/account/EmailVerifier";
import ResetPasswordRequest from "./components/account/ResetPasswordToken";
import ResetPassword from "./components/account/ResetPassword";
import { ThemeContext } from "./components/ThemeContext";
import { useContext } from "react";
import LandingPage from "./components/home/LandingPage";

function App() {
  const location = useLocation();
  const { isGradient } = useContext(ThemeContext);
  console.log(isGradient);
  const userAuthorized = !!localStorage.getItem("authToken");

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      tag.onload = () => globalAudioManager.initYouTubePlayer("yt-player");
    } else {
      globalAudioManager.initYouTubePlayer("yt-player");
    }
  }, []);

  return (
    <div className={`App ${isGradient ? "gradient-bg" : ""}`}>
      {console.log("hello ", isGradient ? "gradient-bg" : "", isGradient)}
      <div id="yt-player" style={{ display: "none" }}></div>
      <Header isGradientPage={isGradient} />
      <Routes>
        <Route path="/" element={userAuthorized ? <Home /> : <LandingPage />} />
        <Route path="/options" element={<Options />} />
        <Route path="/exercise" element={<Exercise />} />
        <Route path="/exercise-done" element={<DoneExercise />} />
        <Route path="/new-list" element={<NewList />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/login" element={<LoginContainer />} />
        <Route path="/account" element={<Account />} />
        <Route path="/list/:id" element={<UpdateList />} />
        <Route path="/music-player" element={<MusicPlayer />}></Route>
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          path="/reset-password-token"
          element={<ResetPasswordRequest />}
        />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/main" element={<LandingPage />} />
      </Routes>
    </div>
  );
}

export default App;
