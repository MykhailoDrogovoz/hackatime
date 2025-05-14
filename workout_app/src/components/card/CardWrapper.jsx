import "./Card.css";
import Card from "./Card";
import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import CameraAnimation from "./CameraAnimation";

function CardWrapper({ onBack }) {
  const [flipped, setFlipped] = useState(false);
  const [key, setKey] = useState(0);

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

  return (
    <div>
      <div className="icon-bar">
        <button className="icon-button" onClick={onBack} title="Back">
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
          <Card key={key} flipped={flipped} />
          <CameraAnimation trigger={flipped} />
        </Canvas>

        <div>
          <button onClick={onBack}>Back to Home</button>
          <button className="main-button">Take</button>
        </div>
      </div>
    </div>
  );
}

export default CardWrapper;
