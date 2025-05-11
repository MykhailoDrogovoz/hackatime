import "./DiceWrapper.css";
import Dice from "./Dice";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import Table from "./Table";

function DiceWrapper() {
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
    <div id="dice-wrapper">
      <button onClick={rollHandler} className="main-button">
        {roll == null ? "Start" : roll == "start" ? "Drop" : "Reset"}
      </button>
      <button>Go home</button>
      <Canvas>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={5} />
        <Dice roll={roll} position={[-1.5, 5, 1]} />
        <Dice roll={roll} position={[1.5, 5, 1]} />
        <Table position={[0, -1, -1]}></Table>
      </Canvas>
    </div>
  );
}

export default DiceWrapper;
