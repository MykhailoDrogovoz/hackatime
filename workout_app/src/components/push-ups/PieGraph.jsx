import "./PieGraph.css";
import { useState } from "react";

import Options from "../categories/choice/Options";

function PieGraph(props) {
  const exType = "Pushups";

  return (
    <div className="coin-container">
      <div className="coin">ℭ</div>
      <div className="pie-graph-container">
        <h1>Pushups</h1>
        <div className="display-flex">
          <div
            className="pie-graph"
            style={{ "--percentage": `${props.percentage}%` }}
          >
            <div className="pie-center">{props.percentage}%</div>
          </div>
          <div>
            <p className="done">Today done:</p>
            <p className="goal">Today's goal</p>
            <p className="record">Your record</p>
            <button onClick={() => props.handleClick(exType)}>Do it!</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PieGraph;
