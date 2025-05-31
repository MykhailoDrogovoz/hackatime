import { Link, useLocation, useNavigate } from "react-router-dom";
import "./DoneExercise.css";
import { useState } from "react";

function Exercise() {
  const location = useLocation();
  const navigate = useNavigate();
  const { exType } = location.state || {};

  const handleNext = () => {
    const taskList = JSON.parse(localStorage.getItem("taskList"));
    const tags = taskList?.Tags || [];

    const currentIndex = tags.findIndex((tag) => tag.name === exType);

    if (currentIndex !== -1 && currentIndex < tags.length - 1) {
      const nextExercise = tags[currentIndex + 1];

      // Redirect to the exercise route
      navigate("/options", {
        state: { exType: nextExercise.name },
      });
    } else {
      alert("No more exercises!");
    }
  };

  return (
    <div id="main-frame" className="exercise-frame done">
      <div>
        <h2>Congratulations!</h2>
        <p>You have done all {exType}</p>
        <div className="coin-container-cong">
          <p>You have earned 3</p>
          <img src="/coin.png" alt="" />
          <a href="#">Take</a>
        </div>
        <button>
          <Link to="/">Home</Link>
        </button>
        <button className="main-button" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Exercise;
