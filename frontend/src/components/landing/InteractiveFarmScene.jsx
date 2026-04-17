import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, RoundedBox } from "@react-three/drei";
import { Box } from "@mui/material";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const weatherDots = [
  { position: [-2.5, 2.7, -0.4], color: "#F7C948", size: 0.1 },
  { position: [-2.15, 2.95, 0.25], color: "#FFF1B3", size: 0.07 },
  { position: [2.35, 2.45, -0.1], color: "#4DA3FF", size: 0.09 },
  { position: [2.65, 2.75, 0.3], color: "#B8D9FF", size: 0.06 },
];

const FieldTile = ({ position, color, rotation = [0, 0, 0], accent }) => (
  <group position={position} rotation={rotation}>
    <RoundedBox args={[1.9, 0.18, 1.3]} radius={0.1} smoothness={4}>
      <meshStandardMaterial color={color} roughness={0.9} />
    </RoundedBox>
    <mesh position={[0, 0.11, 0]}>
      <planeGeometry args={[1.45, 0.82]} />
      <meshStandardMaterial color={accent} roughness={1} />
    </mesh>
  </group>
);

const CropRow = ({ position, rotation = [0, 0, 0], color = "#86C95B" }) => (
  <group position={position} rotation={rotation}>
    {[-0.36, -0.12, 0.12, 0.36].map((offset) => (
      <mesh key={offset} position={[offset, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.04, 0.55, 4, 10]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
    ))}
  </group>
);

const Fence = ({ position, rotation = [0, 0, 0], count = 4 }) => (
  <group position={position} rotation={rotation}>
    {Array.from({ length: count }).map((_, index) => {
      const x = index * 0.45 - ((count - 1) * 0.45) / 2;
      return (
        <group key={index} position={[x, 0, 0]}>
          <mesh position={[0, 0.18, 0]}>
            <boxGeometry args={[0.06, 0.36, 0.06]} />
            <meshStandardMaterial color="#C89B62" roughness={0.95} />
          </mesh>
        </group>
      );
    })}
    {[-0.08, 0.08].map((y) => (
      <mesh key={y} position={[0, 0.18 + y, 0]}>
        <boxGeometry args={[count * 0.45 + 0.15, 0.04, 0.04]} />
        <meshStandardMaterial color="#DEBB89" roughness={0.9} />
      </mesh>
    ))}
  </group>
);

const WheatStem = ({ position, rotation = [0, 0, 0] }) => (
  <group position={position} rotation={rotation}>
    <mesh position={[0, 0.3, 0]}>
      <cylinderGeometry args={[0.015, 0.02, 0.62, 10]} />
      <meshStandardMaterial color="#4E9B38" roughness={0.8} />
    </mesh>
    <mesh position={[0, 0.68, 0]} rotation={[0.15, 0.1, 0.1]}>
      <capsuleGeometry args={[0.035, 0.22, 4, 10]} />
      <meshStandardMaterial color="#E4C766" roughness={0.65} />
    </mesh>
  </group>
);

const WheatPatch = ({ position }) => (
  <Float speed={1.5} floatIntensity={0.2} rotationIntensity={0.2}>
    <group position={position}>
      {[
        [-0.22, 0, -0.06, -0.12],
        [-0.04, 0, 0.08, 0.06],
        [0.15, 0, -0.02, 0.14],
        [0.28, 0, 0.09, -0.08],
      ].map(([x, y, z, rot], index) => (
        <WheatStem key={index} position={[x, y, z]} rotation={[0, rot, 0]} />
      ))}
    </group>
  </Float>
);

const Tree = ({ position, scale = 1 }) => (
  <Float speed={1.2} floatIntensity={0.12} rotationIntensity={0.08}>
    <group position={position} scale={scale}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.5, 10]} />
        <meshStandardMaterial color="#835A35" roughness={0.95} />
      </mesh>
      {[
        [0, 0.72, 0, 0.34],
        [-0.18, 0.58, 0.1, 0.26],
        [0.2, 0.6, -0.08, 0.28],
      ].map(([x, y, z, size], index) => (
        <mesh key={index} position={[x, y, z]} scale={size}>
          <sphereGeometry args={[1, 18, 18]} />
          <meshStandardMaterial color="#4E9B38" roughness={0.8} />
        </mesh>
      ))}
    </group>
  </Float>
);

const Pond = ({ position }) => (
  <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
    <mesh>
      <circleGeometry args={[0.42, 36]} />
      <meshStandardMaterial color="#B8E9FF" roughness={0.2} metalness={0.15} />
    </mesh>
    <mesh position={[0, 0.01, 0]}>
      <ringGeometry args={[0.43, 0.56, 36]} />
      <meshStandardMaterial color="#8C6B42" roughness={0.95} />
    </mesh>
  </group>
);

const Barn = () => (
  <Float speed={1.05} floatIntensity={0.08} rotationIntensity={0.05}>
    <group position={[-1.95, 0.32, -1.35]} rotation={[0, 0.48, 0]}>
      <RoundedBox args={[0.9, 0.5, 0.7]} radius={0.06} smoothness={4}>
        <meshStandardMaterial color="#B6412E" roughness={0.88} />
      </RoundedBox>
      <mesh position={[0, 0.42, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.52, 0.38, 4]} />
        <meshStandardMaterial color="#5A3022" roughness={0.92} />
      </mesh>
      <mesh position={[0, -0.02, 0.36]}>
        <boxGeometry args={[0.2, 0.26, 0.05]} />
        <meshStandardMaterial color="#F0E6D6" roughness={0.75} />
      </mesh>
    </group>
  </Float>
);

const Tractor = () => (
  <Float speed={1.2} floatIntensity={0.15} rotationIntensity={0.08}>
    <group position={[1.2, 0.45, 0.65]} rotation={[0, -0.45, 0]}>
      <RoundedBox args={[1.05, 0.36, 0.62]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color="#6AAE2C" roughness={0.55} metalness={0.18} />
      </RoundedBox>

      <RoundedBox args={[0.46, 0.34, 0.48]} radius={0.08} smoothness={4} position={[0.16, 0.3, 0]}>
        <meshStandardMaterial color="#F4F8EF" roughness={0.2} metalness={0.08} />
      </RoundedBox>

      <mesh position={[-0.15, 0.26, 0]}>
        <boxGeometry args={[0.32, 0.18, 0.5]} />
        <meshStandardMaterial color="#2D7C45" roughness={0.55} />
      </mesh>

      {[
        [-0.3, -0.22, 0.28, 0.2],
        [-0.3, -0.22, -0.28, 0.2],
        [0.32, -0.18, 0.25, 0.15],
        [0.32, -0.18, -0.25, 0.15],
      ].map(([x, y, z, radius], index) => (
        <group key={index} position={[x, y, z]} rotation={[0, 0, Math.PI / 2]}>
          <mesh>
            <torusGeometry args={[radius, 0.08, 18, 40]} />
            <meshStandardMaterial color="#1E2320" roughness={0.9} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[radius - 0.06, radius - 0.06, 0.1, 24]} />
            <meshStandardMaterial color="#A7B0AA" roughness={0.45} />
          </mesh>
        </group>
      ))}

      <mesh position={[-0.62, 0, 0]}>
        <boxGeometry args={[0.22, 0.06, 0.58]} />
        <meshStandardMaterial color="#F39500" roughness={0.45} metalness={0.12} />
      </mesh>

      <mesh position={[0.3, 0.56, -0.08]}>
        <cylinderGeometry args={[0.03, 0.03, 0.24, 12]} />
        <meshStandardMaterial color="#2E3431" roughness={0.75} />
      </mesh>
    </group>
  </Float>
);

const WeatherElements = () => (
  <>
    <Float speed={1.1} floatIntensity={0.3} rotationIntensity={0.1}>
      <group position={[-2.15, 2.15, 0]}>
        <mesh>
          <sphereGeometry args={[0.28, 24, 24]} />
          <meshStandardMaterial color="#F7C948" emissive="#F7C948" emissiveIntensity={0.45} />
        </mesh>
        {Array.from({ length: 8 }).map((_, index) => {
          const angle = (index / 8) * Math.PI * 2;
          return (
            <mesh
              key={index}
              position={[Math.cos(angle) * 0.48, Math.sin(angle) * 0.48, 0]}
              rotation={[0, 0, angle]}
            >
              <boxGeometry args={[0.05, 0.2, 0.05]} />
              <meshStandardMaterial color="#FFF1B3" emissive="#FFF1B3" emissiveIntensity={0.25} />
            </mesh>
          );
        })}
      </group>
    </Float>

    <Float speed={1.3} floatIntensity={0.18} rotationIntensity={0.1}>
      <group position={[2.3, 2.1, 0.1]}>
        {[
          [0, 0, 0.38],
          [-0.36, -0.05, 0.28],
          [0.36, -0.05, 0.28],
        ].map(([x, y, scale], index) => (
          <mesh key={index} position={[x, y, 0]} scale={scale}>
            <sphereGeometry args={[1, 24, 24]} />
            <meshStandardMaterial color="#F8FBFD" roughness={0.6} />
          </mesh>
        ))}
        {[-0.16, 0, 0.16].map((x, index) => (
          <mesh key={index} position={[x, -0.6, 0.02]}>
            <capsuleGeometry args={[0.03, 0.22, 4, 8]} />
            <meshStandardMaterial color="#4DA3FF" emissive="#4DA3FF" emissiveIntensity={0.18} />
          </mesh>
        ))}
      </group>
    </Float>

    {weatherDots.map((dot, index) => (
      <Float key={index} speed={1.4 + index * 0.18} floatIntensity={0.42}>
        <mesh position={dot.position} scale={dot.size}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color={dot.color}
            emissive={dot.color}
            emissiveIntensity={0.45}
            toneMapped={false}
          />
        </mesh>
      </Float>
    ))}
  </>
);

const SceneContents = () => {
  const sceneRef = useRef(null);
  const rows = useMemo(
    () => [
      [-1.52, 0.15, 0.9],
      [-1.55, 0.15, -0.1],
      [0.05, 0.15, -1.1],
      [0.05, 0.15, 1],
    ],
    []
  );

  useFrame(({ clock, pointer }) => {
    if (!sceneRef.current) {
      return;
    }

    const elapsed = clock.getElapsedTime();
    sceneRef.current.rotation.y = THREE.MathUtils.lerp(
      sceneRef.current.rotation.y,
      elapsed * 0.08 + pointer.x * 0.16,
      0.04
    );
    sceneRef.current.rotation.x = THREE.MathUtils.lerp(
      sceneRef.current.rotation.x,
      -0.08 + pointer.y * 0.08,
      0.04
    );
  });

  return (
    <group ref={sceneRef} position={[0, -0.55, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.28, 0]}>
        <cylinderGeometry args={[3.2, 3.45, 0.4, 64]} />
        <meshStandardMaterial color="#E5F0D8" roughness={0.92} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.35, -0.07, 0.08]}>
        <ringGeometry args={[0.72, 0.88, 48, 1, 0.4, 1.8]} />
        <meshStandardMaterial color="#D9C28D" roughness={0.98} />
      </mesh>

      <FieldTile position={[-1.1, 0, 0.72]} color="#6E4D2C" rotation={[0, 0.23, 0]} accent="#8BCF66" />
      <FieldTile position={[-1.02, 0, -0.68]} color="#7A542E" rotation={[0, -0.16, 0]} accent="#C5A355" />
      <FieldTile position={[0.92, 0, -0.78]} color="#6E4D2C" rotation={[0, 0.14, 0]} accent="#7DBF5A" />
      <FieldTile position={[1.08, 0, 0.75]} color="#7B5A34" rotation={[0, -0.22, 0]} accent="#99D678" />

      {rows.map((position, index) => (
        <CropRow key={index} position={position} rotation={[-Math.PI / 2, 0, index % 2 ? 0.2 : -0.14]} />
      ))}

      <WheatPatch position={[-0.15, 0.05, 1.45]} />
      <WheatPatch position={[-0.5, 0.05, 1.12]} />

      <Fence position={[0, 0.02, 2.18]} count={7} />
      <Fence position={[-2.52, 0.02, 0.2]} rotation={[0, Math.PI / 2.1, 0]} count={5} />
      <Fence position={[2.45, 0.02, -0.28]} rotation={[0, -Math.PI / 2.2, 0]} count={5} />
      <Tree position={[-2.15, 0.1, 1.45]} scale={0.82} />
      <Tree position={[2.15, 0.08, 1.72]} scale={0.88} />
      <Pond position={[1.9, 0.03, 1.35]} />
      <Barn />
      <Tractor />
      <WeatherElements />
    </group>
  );
};

const InteractiveFarmScene = () => (
  <Box
    sx={{
      position: "relative",
      width: "100%",
      height: { xs: 320, sm: 380, md: 500 },
      borderRadius: "28px",
      overflow: "hidden",
      background:
        "radial-gradient(circle at 18% 18%, rgba(250, 242, 182, 0.82), rgba(250, 242, 182, 0) 24%), linear-gradient(180deg, #9DD4FF 0%, #DDF4FF 35%, #193C25 35%, #102A1A 100%)",
      border: "1px solid rgba(226, 236, 216, 0.32)",
      boxShadow: "0 30px 80px rgba(16, 42, 26, 0.22)",
      "&::after": {
        content: '""',
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 36%, rgba(255,255,255,0.08) 100%)",
        pointerEvents: "none",
      },
    }}
  >
    <Canvas camera={{ position: [0, 2.2, 6.9], fov: 42 }}>
      <ambientLight intensity={1.25} />
      <directionalLight position={[4.8, 6, 4]} intensity={2} color="#FFF1BE" />
      <pointLight position={[-4, 3, 1]} intensity={1.2} color="#F7C948" />
      <pointLight position={[3, 2, 2]} intensity={1.1} color="#9FE870" />
      <SceneContents />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2.65}
        maxPolarAngle={Math.PI / 2.05}
        autoRotate
        autoRotateSpeed={0.34}
      />
    </Canvas>
  </Box>
);

export default InteractiveFarmScene;
