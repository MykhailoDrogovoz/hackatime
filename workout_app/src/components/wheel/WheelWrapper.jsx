import "./WheelWrapper.css";
import Wheel from "./Wheel";
import { useState, useRef } from "react";

function WheelWrapper({ onBack }) {
  const wheelRef = useRef();
  const [returnedNumber, setReturnedNumber] = useState(null);

  const setReturnedNumberHandle = (number) => {
    setReturnedNumber(number);
  };

  const handleSpinAgain = () => {
    if (wheelRef.current) {
      wheelRef.current.spinAgain();
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
          onClick={handleSpinAgain}
          title="Spin Again"
        >
          <i className="fas fa-rotate-right"></i>
        </button>
      </div>
      <div id="roulette-wheel-wrapper">
        {/* Icon control row */}

        <Wheel
          ref={wheelRef}
          setReturnedNumberHandle={setReturnedNumberHandle}
        />

        <div>
          <h1>You got: {returnedNumber}</h1>
          <button onClick={onBack}>Back to Home</button>
          <button className="main-button">Take</button>
        </div>
      </div>
    </div>
  );
}

export default WheelWrapper;
