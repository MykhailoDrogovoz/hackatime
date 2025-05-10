import './WheelWrapper.css'

import Wheel from './Wheel';
import { useState, useRef } from 'react';

function WheelWrapper() {
  const wheelRef = useRef();

  const [returnedNumber, setReturnedNumber] = useState(null);

  const setReturnedNumberHandle = (number) => {
    setReturnedNumber(number)
  }

  const handleSpinAgain = () => {
    wheelRef.current.spinAgain();
  };

    return (
      <div id="roulette-wheel-wrapper">
        <Wheel
          ref={wheelRef}
          setReturnedNumberHandle={setReturnedNumberHandle}
        ></Wheel>
        <div>
          <h1>
            You got: {returnedNumber} <span> </span>
            <i class="fa fa-repeat" onClick={handleSpinAgain}></i>
          </h1>
          <p></p>
          <button>Back to Home</button>
          <button className="main-button">Take</button>
        </div>
      </div>
    );
}

export default WheelWrapper;