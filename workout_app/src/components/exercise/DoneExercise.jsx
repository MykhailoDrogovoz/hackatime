import { Link, useLocation } from "react-router-dom";
import "./DoneExercise.css";
import { useState } from "react";

function Exercise() {
  return (
    <div id="main-frame" className="exercise-frame done">
      <div>
        <h2>Congratulations!</h2>
        <p>You have done all pushups</p>
        <div className="coin-container-cong">
          <p>You have earned 3</p>
          <img src="/coin.png" alt="" />
          <a href="#">Take</a>
        </div>
        <button>
          <Link to="/">Home</Link>
        </button>
        <button className="main-button">Next</button>
      </div>
    </div>
  );
}

export default Exercise;
