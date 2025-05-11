import "./Randomizer.css";
import { useState } from "react";

function Randomizer() {
    const [valueFirst, setValueFirst] = useState(0);
    const [valueLast, setValueLast] = useState(100);

    function handleChangeValue(e) {
        if (e.target.name === "first") {setValueFirst(e.target.value);}
        else {setValueLast(e.target.value);}
        // setValueFirst(e.target.value);
    }

  return (
    <div id="main-frame">
      <div>
        <i class="fa fa-repeat"></i>
        <h1>You got 1</h1>
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
        <button>Home</button>
        <button className="main-button">Take</button>
      </div>
    </div>
  );
}

export default Randomizer;
