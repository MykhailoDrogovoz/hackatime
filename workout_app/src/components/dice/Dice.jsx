import { useFrame } from "@react-three/fiber";
import "./Dice.css";
import { useRef, useState } from "react";

function Dice(props) {
  const meshRef = useRef(null);
  const finalFaceRef = useRef(null);

  const faceRotations = [
    [0, 0, 0],
    [0, Math.PI, 0],
    [0, -Math.PI / 2, 0],
    [0, Math.PI / 2, 0],
    [-Math.PI / 2, 0, 0],
    [Math.PI / 2, 0, 0],
  ];

  useFrame(() => {
    if (!meshRef.current) return;

    if (props.roll === "start") {
      finalFaceRef.current = null; // reset the face if starting again
      meshRef.current.rotation.y += 0.1;
      meshRef.current.rotation.z += 0.1;
    } else if (props.roll === "drop") {
      if (meshRef.current.position.y > -1) {
        meshRef.current.position.y -= 0.1;
        meshRef.current.rotation.y += 0.1;
        meshRef.current.rotation.z += 0.1;
      } else {
        meshRef.current.position.y = -1;

        // only choose and set face once
        if (finalFaceRef.current === null) {
          const randomIndex = Math.floor(Math.random() * 6);
          finalFaceRef.current = randomIndex;
          const [x, y, z] = faceRotations[randomIndex];
          meshRef.current.rotation.set(x, y, z);
        }
      }
    } else {
      // reset position when roll is null
      meshRef.current.position.y = 2;
    }
  });

  function getPipPositions(face) {
    const center = [0, 0];
    const topLeft = [-0.25, 0.25];
    const topRight = [0.25, 0.25];
    const bottomLeft = [-0.25, -0.25];
    const bottomRight = [0.25, -0.25];
    const middleLeft = [-0.25, 0];
    const middleRight = [0.25, 0];

    switch (face) {
      case 1:
        return [center];
      case 2:
        return [topLeft, bottomRight];
      case 3:
        return [topLeft, center, bottomRight];
      case 4:
        return [topLeft, topRight, bottomLeft, bottomRight];
      case 5:
        return [topLeft, topRight, center, bottomLeft, bottomRight];
      case 6:
        return [
          topLeft,
          middleLeft,
          bottomLeft,
          topRight,
          middleRight,
          bottomRight,
        ];
      default:
        return [];
    }
  }

  const faceTransforms = [
    { face: 1, position: [0, 0, 0.5] },
    { face: 2, position: [0, 0, -0.5] },
    { face: 3, position: [0.5, 0, 0] },
    { face: 4, position: [-0.5, 0, 0] },
    { face: 5, position: [0, 0.5, 0] },
    { face: 6, position: [0, -0.5, 0] },
  ];

  for (let i = 0; i < faceTransforms.length; i++) {
    faceTransforms[i].rotation = faceRotations[i];
  }

  return (
    <mesh ref={meshRef} position={props.position} scale={0.6}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="white" />
      {faceTransforms.map(({ face, position, rotation }) => (
        <group key={face} position={position} rotation={rotation}>
          {getPipPositions(face).map((pos, i) => (
            <mesh key={`${face}-${i}`} position={[pos[0], pos[1], 0]}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial color="black" />
            </mesh>
          ))}
        </group>
      ))}
    </mesh>
  );
}

export default Dice;
