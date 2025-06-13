import { useLocation, useNavigate } from "react-router-dom";
import Timer from "./Timer";
import "./Exercise.css";
import { useEffect, useState } from "react";

const VITE_API_URL = import.meta.env.VITE_API_URL;

function Exercise() {
  const location = useLocation();
  const navigate = useNavigate();
  const { exType, exNumber } = location.state || {};

  console.log(JSON.parse(localStorage.getItem("taskList")).Tags, exType);
  const exerciseData = JSON.parse(localStorage.getItem("taskList")).Tags.find(
    (ex) => ex.name === exType
  );
  const [doneSets, setDoneSets] = useState(0);

  useEffect(() => {
    const doneSets = async () => {
      const storedToken = localStorage.getItem("authToken");

      const response = await fetch(`${VITE_API_URL}tags/get-sets/${exType}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.userExercise !== 0) {
          setDoneSets(data.userExercise.setsCompleted);
        }
      }
    };
    doneSets();
  }, []);

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
        exNumber={exerciseData.secondsPerSet * exNumber}
        status={timerStatus}
        onDone={handleDone}
      ></Timer>
      <div className="exercise-info">
        {console.log(exerciseData)}
        <h1>
          Task completed: {doneSets}/
          {exerciseData.totalSeconds
            ? exerciseData.totalSeconds * exerciseData.totalSets + " s"
            : exerciseData.totalSets + " sets"}
        </h1>
        <h2>Type: {exType}</h2>
        <h2>
          {exerciseData.totalSeconds ? "Seconds:" : "Sets: "} {exNumber}
        </h2>
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
