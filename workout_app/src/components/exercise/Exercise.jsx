import { useLocation, useNavigate } from "react-router-dom";
import Timer from "./Timer";
import "./Exercise.css";
import { useState } from "react";

function Exercise() {
  const location = useLocation();
  const navigate = useNavigate();
  const { exType, exNumber } = location.state || {};

  console.log(JSON.parse(localStorage.getItem("taskList")).Tags, exType);
  const exerciseData = JSON.parse(localStorage.getItem("taskList")).Tags.find(
    (ex) => ex.name === exType
  );

  const [timerStatus, setTimerStatus] = useState("ready");

  const handleStart = () => {
    if (timerStatus === "running") {
      setTimerStatus("stopped");
    } else if (timerStatus === "done") {
      navigate("/exercise-done", {
        state: { exType: exType, exNumber: exNumber },
      });
    } else {
      setTimerStatus("running");
    }
  };

  const handleReset = () => {
    setTimerStatus("reset");
    setTimeout(() => setTimerStatus("stopped"), 10);
  };

  const handleDone = () => {
    setTimerStatus("done");
  };

  return (
    <div id="main-frame" className="exercise-frame">
      <Timer
        exNumber={exNumber}
        status={timerStatus}
        onDone={handleDone}
      ></Timer>
      <div className="exercise-info">
        {console.log(exerciseData)}
        <h1>Task completed: {exerciseData.totalSets}</h1>
        <h2>Type: {exType}</h2>
        <h2>Sets: {exNumber}</h2>
        <div>
          <button onClick={handleReset}>Reset</button>
          <button className="main-button" onClick={handleStart}>
            {timerStatus === "running"
              ? "Stop"
              : timerStatus === "done"
              ? "Next"
              : "Start"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Exercise;
