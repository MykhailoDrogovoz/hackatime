import { useEffect, useRef, useState } from "react";

import "./Timer.css";

function Timer(props) {
  const [borderWidth, setBorderWidth] = useState(10);

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);
  const defSeconds = 1 * props.exNumber;

  const deadline = useRef(new Date(Date.now() + defSeconds * 1000));

  const getTime = (deadline) => {
    const time = deadline - Date.now();

    const maxBorder = 10;
    const minBorder = 1;
    const ratio = time / (defSeconds * 1000);

    const newBorderWidth = minBorder + ratio * (maxBorder - minBorder);
    setBorderWidth(newBorderWidth);

    if (time <= 0) {
      clearInterval(intervalRef.current);
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      getTime(deadline.current);
    }, 100);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [deadline]);

  return (
    <div className="timer-container">
      <div className="timer">
        <div className="timer-top-1"></div>
        <div className="timer-top-2"></div>
        <div
          className="progress-arc"
          style={{
            "--progress": `${100 - (seconds / defSeconds) * 100}%`,
          }}
        ></div>
        {hours}:{minutes}:{seconds}
      </div>
    </div>
  );
}

export default Timer;
