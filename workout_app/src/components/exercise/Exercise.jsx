import { useLocation } from "react-router-dom";
import Timer from "./Timer";
import "./Exercise.css";

function Exercise() {
  const location = useLocation();

  const { exType, exNumber } = location.state || {};

  return (
    <div id="main-frame" className="exercise-frame">
      <div>
        <h1>Type: {exType}</h1>
        <h1>Sets: {exNumber}</h1>
      </div>
      <Timer exNumber={exNumber}></Timer>
    </div>
  );
}

export default Exercise;
