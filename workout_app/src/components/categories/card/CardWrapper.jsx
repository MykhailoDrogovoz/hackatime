import "./Card.css";
import Card from "./Card";
import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import CameraAnimation from "./CameraAnimation";
import { useNavigate } from "react-router-dom";

function CardWrapper(props) {
  const navigate = useNavigate();

  const [flipped, setFlipped] = useState(false);
  const [key, setKey] = useState(0);
  const [card, setCard] = useState();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFlipped(true);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [key]);

  const handleAgain = () => {
    setFlipped(false);
    setKey((prev) => prev + 1);
    setTimeout(() => {
      setFlipped(true);
    }, 100); // Delay to trigger the animation again
  };

  console.log(`User got: ${card}`);

  return (
    <div id="roulette-wheel-wrapper" className="randomizer">
      <div className="icon-bar">
        <button className="icon-button" onClick={props.onBack} title="Back">
          <i className="fas fa-arrow-left"></i>
        </button>
        <button
          className="icon-button"
          onClick={handleAgain}
          title="Spin Again"
        >
          <i className="fas fa-rotate-right"></i>
        </button>
      </div>
      <div className="card-deck">
        <Canvas camera={{ position: [0, -3, 3], fov: 50 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[1, 0, 5]} intensity={5} />
          <Card
            key={key}
            flipped={flipped}
            setCards={(card) => {
              setCard(card);
            }}
          />
          <CameraAnimation trigger={flipped} />
        </Canvas>

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
              props.handleTake(card);
            }}
          >
            Take
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardWrapper;
