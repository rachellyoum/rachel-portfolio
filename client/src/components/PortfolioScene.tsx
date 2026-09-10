import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";
import { MathUtils, Vector3 } from "three";
import type { Group } from "three";

type SceneProps = {
  progress: number;
  reducedMotion?: boolean;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const smoothstep = (start: number, end: number, value: number) => {
  if (end === start) return 0;

  const t = clamp01((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

const rangeProgress = (value: number, start: number, end: number) => {
  if (end === start) return 0;

  return clamp01((value - start) / (end - start));
};

const STORY_RANGES = {
  chapter1: [0, 0.3] as const,
  workspaceExit: [0.3, 0.48] as const,
  campusIntro: [0.42, 0.6] as const,
  chapter2: [0.6, 1] as const,
};

function CameraRig({ progress, reducedMotion = false }: SceneProps) {
  const { camera } = useThree();

  useFrame(() => {
    const p = reducedMotion ? clamp01(progress * 0.8) : clamp01(progress);
    const travel = rangeProgress(p, STORY_RANGES.workspaceExit[0], STORY_RANGES.chapter2[0]);
    const lookAtTravel = smoothstep(
      STORY_RANGES.workspaceExit[0],
      STORY_RANGES.chapter2[0],
      p
    );

    const startPosition = new Vector3(6.2, 4.5, 6);
    const endPosition = new Vector3(3.5, 3.1, 5.1);
    const targetPosition = new Vector3().lerpVectors(
      startPosition,
      endPosition,
      travel
    );

    const workspaceLookAt = new Vector3(0, 0.2, 0);
    const campusLookAt = new Vector3(0.8, -0.1, 0.7);
    const lookAtTarget = new Vector3().lerpVectors(
      workspaceLookAt,
      campusLookAt,
      lookAtTravel
    );

    camera.position.lerp(targetPosition, 0.08);
    camera.lookAt(lookAtTarget);
  });

  return null;
}

function Workspace({ progress, reducedMotion = false }: SceneProps) {
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;

    const p = reducedMotion ? clamp01(progress * 0.8) : clamp01(progress);
    const exitProgress = smoothstep(
      STORY_RANGES.workspaceExit[0],
      STORY_RANGES.workspaceExit[1],
      p
    );
    const chapter2Progress = rangeProgress(
      p,
      STORY_RANGES.chapter2[0],
      STORY_RANGES.chapter2[1]
    );

    const rotationY = MathUtils.lerp(-0.35, 0.2, p);
    groupRef.current.rotation.y = MathUtils.lerp(
      groupRef.current.rotation.y,
      rotationY,
      0.08
    );

    const targetX = MathUtils.lerp(0, -7.2, exitProgress);
    const targetY = MathUtils.lerp(0, 1.5, exitProgress);
    const targetZ = MathUtils.lerp(0, -5.6, exitProgress);
    const targetScale = MathUtils.lerp(
      1,
      0.38 + chapter2Progress * 0.04,
      exitProgress
    );

    groupRef.current.position.x = MathUtils.lerp(
      groupRef.current.position.x,
      targetX,
      0.08
    );
    groupRef.current.position.y = MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      0.08
    );
    groupRef.current.position.z = MathUtils.lerp(
      groupRef.current.position.z,
      targetZ,
      0.08
    );

    const nextScale = MathUtils.lerp(
      groupRef.current.scale.x || 1,
      targetScale,
      0.08
    );
    groupRef.current.scale.x = nextScale;
    groupRef.current.scale.y = nextScale;
    groupRef.current.scale.z = nextScale;
  });

  return (
    <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.1}>
      <group ref={groupRef}>
        <mesh position={[0, -1.45, 0]}>
          <boxGeometry args={[6, 0.35, 5]} />
          <meshStandardMaterial color="#cbd9c3" />
        </mesh>

        <mesh position={[-0.5, -1.25, 0.4]}>
          <boxGeometry args={[3.4, 0.04, 2.5]} />
          <meshStandardMaterial color="#e9e5d8" />
        </mesh>

        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[3.1, 0.18, 1.35]} />
          <meshStandardMaterial color="#c9aa82" />
        </mesh>

        {[
          [-1.25, -0.82, -0.45],
          [1.25, -0.82, -0.45],
          [-1.25, -0.82, 0.45],
          [1.25, -0.82, 0.45],
        ].map((position, index) => (
          <mesh key={index} position={position as [number, number, number]}>
            <boxGeometry args={[0.16, 1, 0.16]} />
            <meshStandardMaterial color="#98785b" />
          </mesh>
        ))}

        <mesh position={[-0.3, -0.08, 0]}>
          <boxGeometry args={[1.25, 0.07, 0.78]} />
          <meshStandardMaterial color="#435747" />
        </mesh>

        <mesh position={[-0.3, 0.43, -0.34]} rotation={[-0.18, 0, 0]}>
          <boxGeometry args={[1.25, 0.85, 0.06]} />
          <meshStandardMaterial color="#314135" />
        </mesh>

        <mesh position={[-0.3, 0.43, -0.302]} rotation={[-0.18, 0, 0]}>
          <planeGeometry args={[1.03, 0.66]} />
          <meshStandardMaterial
            color="#e4ecdf"
            emissive="#b9cdb0"
            emissiveIntensity={0.25}
          />
        </mesh>

        <mesh position={[-1.05, -0.05, 0]}>
          <boxGeometry args={[0.55, 0.12, 0.7]} />
          <meshStandardMaterial color="#859d7c" />
        </mesh>

        <mesh position={[-1.05, 0.08, 0]}>
          <boxGeometry args={[0.5, 0.12, 0.67]} />
          <meshStandardMaterial color="#e2c7a0" />
        </mesh>

        <mesh position={[1.15, 0.02, 0]}>
          <cylinderGeometry args={[0.3, 0.24, 0.5, 16]} />
          <meshStandardMaterial color="#d2b49c" />
        </mesh>

        <mesh position={[1.15, 0.45, 0]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#718d68" />
        </mesh>

        <mesh position={[0.9, 0.52, 0.05]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#91aa87" />
        </mesh>

        <mesh position={[1.4, 0.58, -0.05]}>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshStandardMaterial color="#587252" />
        </mesh>

        <mesh position={[0, -0.75, 1.3]}>
          <boxGeometry args={[1, 0.16, 0.9]} />
          <meshStandardMaterial color="#738f6b" />
        </mesh>

        <mesh position={[0, -0.15, 1.68]}>
          <boxGeometry args={[1, 1.1, 0.16]} />
          <meshStandardMaterial color="#738f6b" />
        </mesh>

        <group position={[2, -0.85, 1]}>
          <mesh>
            <boxGeometry args={[0.75, 0.55, 1]} />
            <meshStandardMaterial color="#c49b6c" />
          </mesh>

          <mesh position={[0, 0.28, -0.55]}>
            <boxGeometry args={[0.55, 0.5, 0.5]} />
            <meshStandardMaterial color="#c49b6c" />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

function SFUCampus({ progress, reducedMotion = false }: SceneProps) {
  const ref = useRef<Group>(null);

  useFrame(() => {
    if (!ref.current) return;

    const p = reducedMotion ? clamp01(progress * 0.8) : clamp01(progress);
    const campusProgress = rangeProgress(
      p,
      STORY_RANGES.campusIntro[0],
      STORY_RANGES.campusIntro[1]
    );

    const startPos = { x: 8.2, y: -1.0, z: 3.2 };
    const endPos = { x: 0.6, y: -0.2, z: 0.8 };

    const targetX = MathUtils.lerp(startPos.x, endPos.x, campusProgress);
    const targetY = MathUtils.lerp(startPos.y, endPos.y, campusProgress);
    const targetZ = MathUtils.lerp(startPos.z, endPos.z, campusProgress);
    const targetScale = MathUtils.lerp(0.72, 1, campusProgress);

    ref.current.position.x = MathUtils.lerp(
      ref.current.position.x,
      targetX,
      0.08
    );
    ref.current.position.y = MathUtils.lerp(
      ref.current.position.y,
      targetY,
      0.08
    );
    ref.current.position.z = MathUtils.lerp(
      ref.current.position.z,
      targetZ,
      0.08
    );

    const nextScale = MathUtils.lerp(
      ref.current.scale.x || 0.72,
      targetScale,
      0.08
    );
    ref.current.scale.x = nextScale;
    ref.current.scale.y = nextScale;
    ref.current.scale.z = nextScale;
  });

  return (
    <group ref={ref}>
      <mesh position={[0, -1.3, 0]}>
        <cylinderGeometry args={[3.5, 4.2, 0.9, 24]} />
        <meshStandardMaterial color="#cbd9c3" />
      </mesh>

      <mesh position={[0, -0.8, 0]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[1.8, 0.06, 4]} />
        <meshStandardMaterial color="#e9e5d8" />
      </mesh>

      <mesh position={[-1.1, -0.38, -0.6]}>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial color="#dfd9d1" />
      </mesh>

      <mesh position={[1.15, -0.36, -0.2]}>
        <boxGeometry args={[0.7, 0.7, 0.9]} />
        <meshStandardMaterial color="#cfc6bf" />
      </mesh>

      <mesh position={[0, -0.36, 1.05]}>
        <boxGeometry args={[1.4, 0.7, 0.5]} />
        <meshStandardMaterial color="#e6dfd9" />
      </mesh>

      <mesh position={[0.6, -0.6, -0.9]}>
        <boxGeometry args={[0.9, 0.08, 0.28]} />
        <meshStandardMaterial color="#b88c66" />
      </mesh>

      {[
        [-2.2, -0.5, 0.8],
        [-1.4, -0.5, 1.8],
        [1.8, -0.5, 1.4],
      ].map((pos, index) => (
        <group key={index} position={pos as [number, number, number]}>
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
            <meshStandardMaterial color="#8b5a3c" />
          </mesh>

          <mesh position={[0, 0.35, 0]}>
            <sphereGeometry args={[0.32, 8, 8]} />
            <meshStandardMaterial color="#587252" />
          </mesh>
        </group>
      ))}

      <group position={[-0.2, -0.55, -1.8]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.7, 0.32, 0.06]} />
          <meshStandardMaterial color="#f6f1e9" />
        </mesh>

        <Text
          position={[0, 0.02, 0.04]}
          fontSize={0.12}
          color="#465a43"
          anchorX="center"
          anchorY="middle"
        >
          SFU
        </Text>
      </group>
    </group>
  );
}

function PortfolioScene({ progress, reducedMotion = false }: SceneProps) {
  return (
    <div className="scene-shell">
      <Canvas
        camera={{
          position: [6, 4.5, 6],
          fov: 42,
        }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={1.5} />

        <directionalLight position={[4, 7, 5]} intensity={2.5} />
        <directionalLight position={[-4, 2, -3]} intensity={0.8} />

        <SFUCampus progress={progress} reducedMotion={reducedMotion} />
        <Workspace progress={progress} reducedMotion={reducedMotion} />
        <CameraRig progress={progress} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}

export default PortfolioScene;