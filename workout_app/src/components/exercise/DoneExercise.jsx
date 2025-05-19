import { useLocation } from "react-router-dom";
import "./DoneExercise.css";
import { useState } from "react";

function Exercise() {
  return (
    <div id="main-frame" className="exercise-frame">
      <h2>Congratulations!</h2>
      <p>Next</p>
      <button>Home</button>
      <button>Proceed with</button>
    </div>
  );
}

export default Exercise;
