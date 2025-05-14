import "./DiceWrapper.css";
import Dice from "./Dice";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import Table from "./Table";

function DiceWrapper({ onBack }) {
  const [roll, setRoll] = useState(null);

  const rollHandler = () => {
    if (roll === "start") {
      setRoll("drop");
    } else if (roll === "drop") {
      setRoll(null);
    } else {
      setRoll("start");
    }
  };

  return (
    <div>
      <div className="icon-bar">
        <button className="icon-button" onClick={onBack} title="Back">
          <i className="fas fa-arrow-left"></i>
        </button>
        <button
          className="icon-button"
          onClick={rollHandler}
          title="Roll / Drop / Reset"
        >
          <i className="fas fa-rotate-right"></i>
        </button>
      </div>
      <div id="dice-wrapper">
        {/* Icon control row */}

        <button onClick={rollHandler} className="main-button">
          {roll == null ? "Start" : roll === "start" ? "Drop" : "Reset"}
        </button>
        <button onClick={onBack}>Go home</button>

        <Canvas camera={{ position: [0, 2, 8], fov: 40 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={5} />
          <Dice roll={roll} position={[-1.5, 5, 1]} />
          <Dice roll={roll} position={[1.5, 5, 1]} />
          <Table position={[0, -1, -1]} />
        </Canvas>
      </div>
    </div>
  );
}

export default DiceWrapper;
