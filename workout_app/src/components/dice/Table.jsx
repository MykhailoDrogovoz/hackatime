import { useRef } from "react";
import "./Dice.css";
import { TextureLoader } from "three";

// import tableTexture from "./assets/tableTexture.jpg";

function Table(props) {
  const meshRef = useRef(null);

  const texture = new TextureLoader().load(
    "https://media.istockphoto.com/id/1083302826/photo/laminate-wooden-floor-texture-background.jpg?s=612x612&w=0&k=20&c=P-OHyJRQBXiuEsHv-JZApc6z_OxySYWqiNLCP1-T1GA="
  );

  const textureBottom = new TextureLoader().load(
    "https://static.vecteezy.com/system/resources/thumbnails/009/229/194/small_2x/brown-wooden-table-texture-for-background-or-wallpaper-use-free-photo.jpg"
  );

  https: return (
    <mesh ref={meshRef} position={props.position} scale={0.6}>
      {/* Group to combine all table elements */}
      <group>
        {/* Table base */}
        <mesh position={[0, -0.7, 2]}>
          <boxGeometry args={[10, 0.3, 5]} />
          <meshStandardMaterial map={texture} />
        </mesh>

        {/* Smaller box (the top part of the table) */}
        <mesh position={[0, 0, 1]}>
          <boxGeometry args={[10, 1.7, 1]} />
          <meshStandardMaterial map={textureBottom} />
        </mesh>
        <mesh position={[5, 0, 3]}>
          <boxGeometry args={[1, 1.7, 3]} />
          <meshStandardMaterial map={textureBottom} />
        </mesh>
        <mesh position={[-5, 0, 3]}>
          <boxGeometry args={[1, 1.7, 3]} />
          <meshStandardMaterial map={textureBottom} />
        </mesh>
        <mesh position={[0, -0.9, 4.46]}>
          <boxGeometry args={[11, 0.7, 0.1]} />
          <meshStandardMaterial map={textureBottom} />
        </mesh>
      </group>
    </mesh>
  );
}

export default Table;
