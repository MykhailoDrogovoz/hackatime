import "./DiceWrapper.css";
import Dice from "./Dice";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import Table from "./Table";
import { useNavigate } from "react-router-dom";

function DiceWrapper(props) {
  const navigate = useNavigate();
  const [roll, setRoll] = useState(null);
  const [pips, setPips] = useState(null);

  const rollHandler = () => {
    if (roll === "start") {
      setPips(null);
      setRoll("drop");
    } else if (roll === "drop") {
      setRoll("take");
    } else if (roll === "take") {
      props.handleTake(pips);
      setRoll(null);
    } else {
      setPips(null);
      setRoll("start");
    }
  };

  useEffect(() => {
    if (roll === "take") {
      props.handleTake(pips);
    }
  }, [roll]);

  return (
    <div>
      <div className="icon-bar">
        <button className="icon-button" onClick={props.onBack} title="Back">
          <i className="fas fa-arrow-left"></i>
        </button>
        <button
          className="icon-button"
          onClick={() => {
            setRoll(null);
          }}
          title="Roll / Drop / Reset"
        >
          <i className="fas fa-rotate-right"></i>
        </button>
      </div>
      <div id="dice-wrapper">
        {/* Icon control row */}

        <button
          onClick={() => {
            navigate("/");
          }}
        >
          Go home
        </button>
        <button onClick={rollHandler} className="main-button">
          {roll == null ? "Start" : roll === "start" ? "Drop" : "Take"}
        </button>
        {/* <button
          onClick={() => {
            props.handleTake(pips);
          }}
          className="main-button"
        >
          Take
        </button> */}

        <Canvas camera={{ position: [0, 2, 8], fov: 40 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={5} />
          <Dice
            roll={roll}
            position={[-1.5, 5, 1]}
            pipsHandle={(rPips) => {
              setPips((prevTotal) => prevTotal + rPips);
            }}
          />
          <Dice
            roll={roll}
            position={[1.5, 5, 1]}
            pipsHandle={(rPips) => {
              setPips((prevTotal) => prevTotal + rPips);
            }}
          />
          <Table position={[0, -1, -1]} />
        </Canvas>
      </div>
    </div>
  );
}

export default DiceWrapper;
