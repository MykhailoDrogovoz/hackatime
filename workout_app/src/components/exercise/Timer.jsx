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
  const [remainingTime, setRemainingTime] = useState(defSeconds * 1000);

  const getTime = (time) => {
    const maxBorder = 10;
    const minBorder = 1;
    const ratio = time / (defSeconds * 1000);

    const newBorderWidth = minBorder + ratio * (maxBorder - minBorder);
    setBorderWidth(newBorderWidth);

    if (time <= 0) {
      clearInterval(intervalRef.current);
      props.onDone();
      setHours(0);
      setMinutes(0);
      setSeconds(0);
      return;
    }

    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    clearInterval(intervalRef.current);

    if (props.status === "ready") {
      setRemainingTime(defSeconds * 1000);
      getTime(defSeconds * 1000);
      return;
    }

    if (props.status === "reset") {
      const resetTime = defSeconds * 1000;
      setRemainingTime(resetTime);
      getTime(resetTime);
      return; // Don't start timer after reset
    }

    if (props.status === "running") {
      const start = Date.now();
      const initialRemaining = remainingTime;

      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - start;
        const newRemaining = initialRemaining - elapsed;

        if (newRemaining <= 0) {
          clearInterval(intervalRef.current);
          props.onDone?.(); // optional chaining in case not passed
          setRemainingTime(0);
          getTime(0);
        } else {
          setRemainingTime(newRemaining);
          getTime(newRemaining);
        }
      }, 100);
    }

    return () => clearInterval(intervalRef.current);
  }, [props.status]);

  return (
    <div className="timer-container">
      <div className="timer">
        <div className="timer-top-1"></div>
        <div className="timer-top-2"></div>
        <div
          className="progress-arc"
          style={{
            "--progress": `${(remainingTime / (defSeconds * 1000)) * 100}%`,
          }}
        ></div>
        {hours}:{minutes}:{seconds}
      </div>
    </div>
  );
}

export default Timer;
