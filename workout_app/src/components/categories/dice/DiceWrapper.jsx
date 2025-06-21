import "./DiceWrapper.css";
import Dice from "./Dice";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import Table from "./Table";
import { useNavigate } from "react-router-dom";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

function DiceWrapper(props) {
  const navigate = useNavigate();
  const [roll, setRoll] = useState(null);
  const [pips, setPips] = useState(null);
  const isMobile = useIsMobile();

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

  const dicePos1 = isMobile ? [-1.5, 5, -3] : [-1.5, 5, 1];
  const dicePos2 = isMobile ? [1.5, 5, -3] : [1.5, 5, 1];
  const tablePos = isMobile ? [0, -2, -8] : [0, -1, -1];  

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
        <button onClick={() => navigate("/")}>Go home</button>
        <button onClick={rollHandler} className="main-button">
          {roll == null ? "Start" : roll === "start" ? "Drop" : "Take"}
        </button>

        <Canvas camera={{ position: [0, 2, 8], fov: 40 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={5} />
          <Dice
            roll={roll}
            position={dicePos1}
            pipsHandle={(rPips) => {
              setPips((prevTotal) => prevTotal + rPips);
            }}
          />
          <Dice
            roll={roll}
            position={dicePos2}
            pipsHandle={(rPips) => {
              setPips((prevTotal) => prevTotal + rPips);
            }}
          />
          <Table position={tablePos} />
        </Canvas>
      </div>
    </div>
  );

}

export default DiceWrapper;
