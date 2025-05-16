import './Wheel.css'
import anime from "animejs/lib/anime.es.js";
import { useEffect, forwardRef, useImperativeHandle } from "react";

const Wheel = forwardRef((props, ref) => {
  const totalNumbers = 37;
  const singleRotationDegree = 360 / totalNumbers;
  const singleSpinDuration = 5000;
  const ballMinNumberOfSpins = 2;
  const ballMaxNumberOfSpins = 4;
  let lastNumber = 0;
  const rouletteWheelNumbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
    24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
  ];

  const getRouletteIndexFromNumber = (number) => {
    props.setReturnedNumberHandle(number);
    return rouletteWheelNumbers.indexOf(parseInt(number));
  };

  const nextNumber = (number) => {
    var value = number;
    return value;
  };

  const getRotationFromNumber = (number) => {
    var index = getRouletteIndexFromNumber(number);
    return singleRotationDegree * index;
  };

  const getRandomEndRotation = (minNumberOfSpins, maxNumberOfSpins) => {
    const rotateTo = anime.random(
      minNumberOfSpins * totalNumbers,
      maxNumberOfSpins * totalNumbers
    );
    return singleRotationDegree * rotateTo;
  };

  const getZeroEndRotation = (totalRotaiton) => {
    var rotation = 360 - Math.abs(totalRotaiton % 360);

    return rotation;
  };

  const getBallEndRotation = (zeroEndRotation, currentNumber) => {
    return Math.abs(zeroEndRotation) + getRotationFromNumber(currentNumber);
  };

  const getBallNumberOfRotations = (minNumberOfSpins, maxNumberOfSpins) => {
    let numberOfSpins = anime.random(minNumberOfSpins, maxNumberOfSpins);
    return 360 * numberOfSpins;
  };

  useImperativeHandle(ref, () => ({
    spinAgain: () => {
      const newNumber = Math.floor(Math.random() * 37);
      spinWheel(newNumber);
    },
  }));

  function spinWheel(number) {
    const bezier = [0.165, 0.84, 0.44, 1.005];
    const wheelMinNumberOfSpins = 2;
    const wheelMaxNumberOfSpins = 4;
    let currentNumber = nextNumber(number);

    const lastNumberRotation = getRotationFromNumber(lastNumber.toString());

    const endRotation = -getRandomEndRotation(
      ballMinNumberOfSpins,
      ballMaxNumberOfSpins
    );
    const zeroFromEndRotation = getZeroEndRotation(endRotation);

    const ballEndRotation =
      getBallNumberOfRotations(wheelMinNumberOfSpins, wheelMaxNumberOfSpins) +
      getBallEndRotation(zeroFromEndRotation, currentNumber);

    anime.set([".layer-2", ".layer-4"], {
      rotate: function () {
        return lastNumberRotation;
      },
    });

    anime.set(".ball-container", {
      rotate: function () {
        return 0;
      },
    });

    anime({
      targets: ".ball-container",
      translateY: [
        { value: 0, duration: 2000 },
        { value: 20, duration: 1000 },
        { value: 25, duration: 900 },
        { value: 50, duration: 1000 },
      ],
      rotate: [{ value: ballEndRotation, duration: singleSpinDuration }],
      loop: 1,
      easing: `cubicBezier(${bezier.join(",")})`,
    });

    anime({
      targets: [".layer-2", ".layer-4"],
      rotate: function () {
        return endRotation;
      },
      duration: singleSpinDuration,
      easing: `cubicBezier(${bezier.join(",")})`,
      complete: function (anime) {
        lastNumber = currentNumber;
      },
    });
  }

  useEffect(() => {
    const nextNumber = Math.floor(Math.random() * 37);
    spinWheel(nextNumber);
  }, []);

  return (
    <div className="roulette-wheel">
      <div
        className="layer-2 wheel"
        style={{ transform: "rotate(0deg)" }}
      ></div>
      <div className="layer-3"></div>
      <div
        className="layer-4 wheel"
        style={{ transform: "rotate(0deg)" }}
      ></div>
      <div className="layer-5"></div>
      <div className={"ball-container"} style={{ transform: "rotate(0deg)" }}>
        <div
          className={"ball"}
          style={{ transform: "translate(0, -163.221px)" }}
        ></div>
      </div>
    </div>
  );
});

export default Wheel;