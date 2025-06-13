import { useRef, useState } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";

function Card(props) {
  const cardRef = useRef();
  const suits = [`♠`, `♥`, `♦`, `♣`];

  // Updated values array with face cards
  const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];

  const [suit, setSuit] = useState(
    suits[Math.floor(Math.random() * suits.length)]
  );

  // Set the value of the card (could be a face card or a number)
  const [value, setValue] = useState(
    values[Math.floor(Math.random() * values.length)]
  );

  const cardCount = 32;
  const [rotation, setRotation] = useState(Math.PI);
  const [yPos, setYPos] = useState(0);
  const [phase, setPhase] = useState("idle");
  const [flipped, setFlipped] = useState(false);

  const texture = new TextureLoader().load("/card_texture.jpg");

  // Convert face cards to numbers (if the value is a face card)
  const convertToNumber = (value) => {
    if (value === "J") return 11;
    if (value === "Q") return 12;
    if (value === "K") return 13;
    if (value === "A") return 14;
    return value; // For numeric cards, return as is
  };

  // Animate on frame
  useFrame(() => {
    if (flipped) {
      if (phase === "idle") {
        setPhase("movingBack");
      }

      if (phase === "movingBack") {
        if (yPos > -1.5) {
          setYPos((prev) => prev - 0.02);
        } else {
          setPhase("flipping");
        }
      }

      if (phase === "flipping") {
        if (rotation > 0) {
          setRotation((prev) => Math.max(prev - 0.1, 0));
        } else {
          setPhase("returning");
        }
      }

      if (phase === "returning") {
        if (yPos < 0) {
          setYPos((prev) => Math.min(prev + 0.02, 0));
        }
      }
    }
  });

  // Click handler to start flip
  const handleClick = () => {
    if (!flipped && phase === "idle") {
      setFlipped(true);
    }

    // Convert face cards to numbers and log the value
    const numericValue = convertToNumber(value);
    props.setCards(numericValue);
  };

  const cardTextColor = suit === "♥" || suit === "♦" ? "red" : "black";

  return (
    <group>
      {/* Clickable flipping card */}
      <group
        ref={cardRef}
        position={[0, yPos, 0.33]}
        rotation={[rotation, 0, 0]}
        onClick={handleClick}
      >
        <mesh>
          <boxGeometry args={[1.5, 2.5, 0.01]} />
          <meshStandardMaterial color="white" />
        </mesh>

        <mesh rotation={[0, Math.PI, 0]} position={[0, 0, -0.01]}>
          <boxGeometry args={[1.5, 2.5, 0.01]} />
          <meshStandardMaterial map={texture} />
        </mesh>

        {/* Text on card face */}
        <Text
          position={[0.4, -0.9, 0.01]}
          fontSize={0.2}
          color={cardTextColor}
          anchorX="center"
          anchorY="middle"
        >
          {`${value} ${suit}`}
        </Text>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.4}
          color={cardTextColor}
          anchorX="center"
          anchorY="middle"
        >
          {`${suit}`}
        </Text>
        <Text
          position={[-0.4, 0.9, 0.01]}
          fontSize={0.2}
          color={cardTextColor}
          anchorX="center"
          anchorY="middle"
        >
          {`${value} ${suit}`}
        </Text>
      </group>

      {/* Card stack underneath */}
      <group position={[0, 0, 0.01]}>
        {[...Array(cardCount)].map((_, index) => (
          <mesh key={index} position={[0, 0, index * 0.01]}>
            <boxGeometry args={[1.5, 2.5, 0.01]} />
            <meshStandardMaterial map={texture} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default Card;
