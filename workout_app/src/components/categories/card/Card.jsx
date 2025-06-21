import { useRef, useState } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";

function Card(props) {
  const cardRef = useRef();
  const cardMeshRef = useRef();
  const suits = [`♠`, `♥`, `♦`, `♣`];
  const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
  const [suit] = useState(suits[Math.floor(Math.random() * suits.length)]);
  const [value] = useState(values[Math.floor(Math.random() * values.length)]);
  const [flipped, setFlipped] = useState(false);

  const texture = new TextureLoader().load("/card_texture.jpg");
  const rotation = useRef(Math.PI);
  const yPos = useRef(0);
  const phase = useRef("idle");

  const cardCount = 32;

  const convertToNumber = (value) => {
    if (value === "J") return 11;
    if (value === "Q") return 12;
    if (value === "K") return 13;
    if (value === "A") return 14;
    return value;
  };

  useFrame(() => {
    if (flipped) {
      if (phase.current === "idle") {
        phase.current = "movingBack";
      }

      if (phase.current === "movingBack") {
        if (yPos.current > -1.5) {
          yPos.current -= 0.02;
        } else {
          phase.current = "flipping";
        }
      }

      if (phase.current === "flipping") {
        if (rotation.current > 0) {
          rotation.current = Math.max(rotation.current - 0.1, 0);
        } else {
          phase.current = "returning";
        }
      }

      if (phase.current === "returning") {
        if (yPos.current < 0) {
          yPos.current = Math.min(yPos.current + 0.02, 0);
        }
      }
    }

    cardMeshRef.current.position.y = yPos.current;
    cardMeshRef.current.rotation.x = rotation.current;
  });

  const handleClick = () => {
    if (!flipped && phase.current === "idle") {
      setFlipped(true);
    }

    const numericValue = convertToNumber(value);
    props.setCards(numericValue);
  };

  const cardTextColor = suit === "♥" || suit === "♦" ? "red" : "black";

  return (
    <group>
      <group
        ref={cardMeshRef}
        position={[0, yPos.current, 0.33]}
        rotation={[rotation.current, 0, 0]}
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
