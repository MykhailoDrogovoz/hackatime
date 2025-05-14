import { useThree, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";

function CameraAnimation({ trigger }) {
  const { camera } = useThree();
  const target = new Vector3(0, -3, 5);
  const start = useRef(camera.position.clone());

  useFrame(() => {
    if (trigger) {
      camera.position.lerp(target, 0.05);
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

export default CameraAnimation;
