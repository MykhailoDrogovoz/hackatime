import { useNavigate } from "react-router-dom";
import "./Randomizer.css";
import { useState } from "react";

function Randomizer(props) {
  const navigate = useNavigate();

  const [randomNumber, setRandomNumber] = useState(
    Math.floor(Math.random() * 100)
  );
  const [valueFirst, setValueFirst] = useState(0);
  const [valueLast, setValueLast] = useState(100);

  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    if (name === "first") {
      setValueFirst(Number(value));
    } else {
      setValueLast(Number(value));
    }
  };

  const handleAgain = () => {
    const min = Math.min(valueFirst, valueLast);
    const max = Math.max(valueFirst, valueLast);
    const newNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    setRandomNumber(newNumber);
  };

  return (
      <div id="roulette-wheel-wrapper" className="randomizer mobile-view">
        <div className="icon-bar">
          <button className="icon-button" onClick={props.onBack} title="Back">
            <i className="fas fa-arrow-left"></i>
          </button>
          <button className="icon-button" onClick={handleAgain} title="Again">
            <i className="fas fa-rotate-right"></i>
          </button>
        </div>
        <h1>You got {randomNumber}</h1>

        <div id="range">
          <div>
            <label htmlFor="first">First number: {valueFirst}</label>
            <input
              type="range"
              name="first"
              min="0"
              max="100"
              onChange={handleChangeValue}
              value={valueFirst}
            />
          </div>
          <div>
            <label htmlFor="last">Last number: {valueLast}</label>
            <input
              type="range"
              name="last"
              min="0"
              max="100"
              onChange={handleChangeValue}
              value={valueLast}
            />
          </div>
        </div>

        <div>
          <button
            onClick={() => {
              navigate("/");
            }}
          >
            Back to Home
          </button>
          <button
            className="main-button"
            onClick={() => {
              props.handleTake(randomNumber);
            }}
          >
            Take
          </button>
        </div>
      </div>
  );
}

export default Randomizer;
