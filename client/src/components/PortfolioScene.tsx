import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";
import { CatmullRomCurve3, MathUtils, TubeGeometry, Vector3 } from "three";
import type { Group } from "three";
import { STORY, clamp01, rangeProgress } from "../story/timeline";

type SceneProps = {
  progress: number;
  reducedMotion?: boolean;
};

const SCENE_COLORS = {
  cream: "#f7f3ea",
  creamDark: "#e7e0d2",
  creamDarker: "#dfe5d8",
  sageLight: "#dfe8d7",
  sage: "#a7bca1",
  sageDark: "#6f8e69",
  sageDeep: "#4f6853",
  forest: "#31483a",
  wood: "#d2b18f",
  woodDark: "#9a7154",
  concrete: "#e9e3d7",
  concreteDark: "#d0cbc0",
  mapsiBlue: "#7aa7c7",
  mapsiBlueDeep: "#5683ab",
  prioritizeAmber: "#d7a66d",
  prioritizeAmberDark: "#b98148",
  gameCoral: "#d67f66",
  gameCoralDark: "#b7664f",
  futureGold: "#d4b27c",
  finalPath: "#dfe7d7",
  finalAccent: "#d4b27c",
} as const;

const CAMERA_STOPS = {
  workspace: {
    position: new Vector3(6.2, 4.5, 6),
    target: new Vector3(0, -0.35, 0),
  },

  sfu: {
    position: new Vector3(3.8, 3.1, 5.2),
    target: new Vector3(0.8, -0.55, 0.8),
  },

  mapsi: {
    position: new Vector3(5.8, 4.0, 7.3),
    target: new Vector3(0.2, 0.08, 0.35),
  },

  prioritize: {
    position: new Vector3(6.2, 4.2, 7.4),
    target: new Vector3(0.6, 0.15, 0.6),
  },

  dogHuman: {
    position: new Vector3(9.1, 4.2, 7.4),
    target: new Vector3(0.55, 0.52, 0.2),
  },

  final: {
    position: new Vector3(10.4, 4.6, 9.2),
    target: new Vector3(0.8, 0.42, 0.5),
  },
} as const;

function CameraRig({ progress, reducedMotion = false }: SceneProps) {
  const { camera } = useThree();

  useFrame(() => {
    const p = reducedMotion ? clamp01(progress * 0.8) : clamp01(progress);

    let start = CAMERA_STOPS.workspace;
    let end = CAMERA_STOPS.sfu;
    let t = 0;

    if (p >= STORY.transition56.start) {
      start = CAMERA_STOPS.dogHuman;
      end = CAMERA_STOPS.final;
      t = rangeProgress(p, STORY.transition56.start, STORY.transition56.end);
    } else if (p >= STORY.transition45.start) {
      start = CAMERA_STOPS.prioritize;
      end = CAMERA_STOPS.dogHuman;
      t = rangeProgress(p, STORY.transition45.start, STORY.transition45.end);
    } else if (p >= STORY.transition34.start) {
      start = CAMERA_STOPS.mapsi;
      end = CAMERA_STOPS.prioritize;
      t = rangeProgress(p, STORY.transition34.start, STORY.transition34.end);
    } else if (p >= STORY.transition23.start) {
      start = CAMERA_STOPS.sfu;
      end = CAMERA_STOPS.mapsi;
      t = rangeProgress(p, STORY.transition23.start, STORY.transition23.end);
    } else if (p >= STORY.transition12.start) {
      start = CAMERA_STOPS.workspace;
      end = CAMERA_STOPS.sfu;
      t = rangeProgress(p, STORY.transition12.start, STORY.transition12.end);
    }

    const targetPosition = new Vector3().lerpVectors(start.position, end.position, t);
    const lookAtTarget = new Vector3().lerpVectors(start.target, end.target, t);

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

    const initial = { x: 0, y: 0, z: 0, scale: 1 };
    const exit = { x: -7.2, y: 1.5, z: -5.6, scale: 0.38 };

    let targetX = initial.x;
    let targetY = initial.y;
    let targetZ = initial.z;
    let targetScale = initial.scale;

    if (p >= STORY.transition12.start && p < STORY.transition12.end) {
      const local = rangeProgress(p, STORY.transition12.start, STORY.transition12.end);
      targetX = MathUtils.lerp(initial.x, exit.x, local);
      targetY = MathUtils.lerp(initial.y, exit.y, local);
      targetZ = MathUtils.lerp(initial.z, exit.z, local);
      targetScale = MathUtils.lerp(initial.scale, exit.scale, local);
    } else if (p >= STORY.transition12.end) {
      targetX = exit.x;
      targetY = exit.y;
      targetZ = exit.z;
      targetScale = exit.scale;
    }

    const rotationY = MathUtils.lerp(-0.35, 0.2, p);
    groupRef.current.rotation.y = MathUtils.lerp(
      groupRef.current.rotation.y,
      rotationY,
      0.08
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
          <meshStandardMaterial color={SCENE_COLORS.sageLight} roughness={0.88} metalness={0.02} />
        </mesh>

        <mesh position={[-0.5, -1.25, 0.4]}>
          <boxGeometry args={[3.4, 0.04, 2.5]} />
          <meshStandardMaterial color={SCENE_COLORS.creamDark} roughness={0.9} metalness={0.02} />
        </mesh>

        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[3.1, 0.18, 1.35]} />
          <meshStandardMaterial color={SCENE_COLORS.wood} roughness={0.82} metalness={0.02} />
        </mesh>

        {[
          [-1.25, -0.82, -0.45],
          [1.25, -0.82, -0.45],
          [-1.25, -0.82, 0.45],
          [1.25, -0.82, 0.45],
        ].map((position, index) => (
          <mesh key={index} position={position as [number, number, number]}>
            <boxGeometry args={[0.16, 1, 0.16]} />
            <meshStandardMaterial color={SCENE_COLORS.woodDark} roughness={0.8} metalness={0.02} />
          </mesh>
        ))}

        <mesh position={[-0.3, -0.08, 0]}>
          <boxGeometry args={[1.25, 0.07, 0.78]} />
          <meshStandardMaterial color={SCENE_COLORS.sageDeep} roughness={0.85} metalness={0.02} />
        </mesh>

        <mesh position={[-0.3, 0.43, -0.34]} rotation={[-0.18, 0, 0]}>
          <boxGeometry args={[1.25, 0.85, 0.06]} />
          <meshStandardMaterial color={SCENE_COLORS.forest} roughness={0.9} metalness={0.02} />
        </mesh>

        <mesh position={[-0.3, 0.43, -0.302]} rotation={[-0.18, 0, 0]}>
          <planeGeometry args={[1.03, 0.66]} />
          <meshStandardMaterial
            color={SCENE_COLORS.cream}
            emissive={SCENE_COLORS.sage}
            emissiveIntensity={0.16}
            roughness={0.82}
            metalness={0.02}
          />
        </mesh>

        <mesh position={[-1.05, -0.05, 0]}>
          <boxGeometry args={[0.55, 0.12, 0.7]} />
          <meshStandardMaterial color={SCENE_COLORS.sage} roughness={0.8} metalness={0.02} />
        </mesh>

        <mesh position={[-1.05, 0.08, 0]}>
          <boxGeometry args={[0.5, 0.12, 0.67]} />
          <meshStandardMaterial color={SCENE_COLORS.wood} roughness={0.82} metalness={0.02} />
        </mesh>

        <mesh position={[1.15, 0.02, 0]}>
          <cylinderGeometry args={[0.3, 0.24, 0.5, 16]} />
          <meshStandardMaterial color={SCENE_COLORS.wood} roughness={0.8} metalness={0.02} />
        </mesh>

        <mesh position={[1.15, 0.45, 0]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color={SCENE_COLORS.sageDark} roughness={0.8} metalness={0.02} />
        </mesh>

        <mesh position={[0.9, 0.52, 0.05]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color={SCENE_COLORS.sage} roughness={0.82} metalness={0.02} />
        </mesh>

        <mesh position={[1.4, 0.58, -0.05]}>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshStandardMaterial color={SCENE_COLORS.sageDeep} roughness={0.85} metalness={0.02} />
        </mesh>

        <mesh position={[0, -0.75, 1.3]}>
          <boxGeometry args={[1, 0.16, 0.9]} />
          <meshStandardMaterial color={SCENE_COLORS.sageDark} roughness={0.82} metalness={0.02} />
        </mesh>

        <mesh position={[0, -0.15, 1.68]}>
          <boxGeometry args={[1, 1.1, 0.16]} />
          <meshStandardMaterial color={SCENE_COLORS.sageDeep} roughness={0.82} metalness={0.02} />
        </mesh>

        <group position={[2, -0.85, 1]}>
          <mesh>
            <boxGeometry args={[0.75, 0.55, 1]} />
            <meshStandardMaterial color={SCENE_COLORS.wood} roughness={0.82} metalness={0.02} />
          </mesh>

          <mesh position={[0, 0.28, -0.55]}>
            <boxGeometry args={[0.55, 0.5, 0.5]} />
            <meshStandardMaterial color={SCENE_COLORS.woodDark} roughness={0.82} metalness={0.02} />
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

    const hidden = { x: 8.2, y: -1.1, z: 3.1, scale: 0.72 };
    const settled = { x: 0.7, y: -0.18, z: 0.8, scale: 1 };
    const exit = { x: -10.5, y: -2.9, z: -9.8, scale: 0.24 };

    let targetX = hidden.x;
    let targetY = hidden.y;
    let targetZ = hidden.z;
    let targetScale = hidden.scale;

    if (p >= STORY.transition12.start && p < STORY.transition12.end) {
      const local = rangeProgress(p, STORY.transition12.start, STORY.transition12.end);
      targetX = MathUtils.lerp(hidden.x, settled.x, local);
      targetY = MathUtils.lerp(hidden.y, settled.y, local);
      targetZ = MathUtils.lerp(hidden.z, settled.z, local);
      targetScale = MathUtils.lerp(hidden.scale, settled.scale, local);
    } else if (p >= STORY.transition12.end && p < STORY.transition23.start) {
      targetX = settled.x;
      targetY = settled.y;
      targetZ = settled.z;
      targetScale = settled.scale;
    } else if (p >= STORY.transition23.start && p < STORY.transition23.end) {
      const local = rangeProgress(p, STORY.transition23.start, STORY.transition23.end);
      targetX = MathUtils.lerp(settled.x, exit.x, local);
      targetY = MathUtils.lerp(settled.y, exit.y, local);
      targetZ = MathUtils.lerp(settled.z, exit.z, local);
      targetScale = MathUtils.lerp(settled.scale, exit.scale, local);
    } else if (p >= STORY.transition23.end) {
      targetX = exit.x;
      targetY = exit.y;
      targetZ = exit.z;
      targetScale = exit.scale;
    }

    const localExit = p >= STORY.transition23.start ? rangeProgress(p, STORY.transition23.start, STORY.transition23.end) : 0;
    const targetRotationY = MathUtils.lerp(0.15, 0.95, Math.min(1, localExit + 0.15));
    const targetRotationZ = MathUtils.lerp(0, -0.18, Math.min(1, localExit + 0.12));

    ref.current.rotation.y = MathUtils.lerp(
      ref.current.rotation.y,
      targetRotationY,
      0.08
    );
    ref.current.rotation.z = MathUtils.lerp(
      ref.current.rotation.z,
      targetRotationZ,
      0.08
    );

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
        <meshStandardMaterial color={SCENE_COLORS.sageLight} roughness={0.88} metalness={0.02} />
      </mesh>

      <mesh position={[0, -0.8, 0]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[1.8, 0.06, 4]} />
        <meshStandardMaterial color={SCENE_COLORS.creamDark} roughness={0.88} metalness={0.02} />
      </mesh>

      <mesh position={[-1.1, -0.38, -0.6]}>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial color={SCENE_COLORS.concrete} roughness={0.9} metalness={0.02} />
      </mesh>

      <mesh position={[1.15, -0.36, -0.2]}>
        <boxGeometry args={[0.7, 0.7, 0.9]} />
        <meshStandardMaterial color={SCENE_COLORS.concreteDark} roughness={0.9} metalness={0.02} />
      </mesh>

      <mesh position={[0, -0.36, 1.05]}>
        <boxGeometry args={[1.4, 0.7, 0.5]} />
        <meshStandardMaterial color={SCENE_COLORS.creamDarker} roughness={0.9} metalness={0.02} />
      </mesh>

      <mesh position={[0.6, -0.6, -0.9]}>
        <boxGeometry args={[0.9, 0.08, 0.28]} />
        <meshStandardMaterial color={SCENE_COLORS.woodDark} roughness={0.85} metalness={0.02} />
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
          color={SCENE_COLORS.forest}
          anchorX="center"
          anchorY="middle"
        >
          SFU
        </Text>
      </group>
    </group>
  );
}

function MapPin({
  position,
  color = "#8fb7d6",
  scale = 1,
}: {
  position: [number, number, number];
  color?: string;
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.18, 18, 18]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.14} roughness={0.76} metalness={0.02} />
      </mesh>

      <mesh position={[0, -0.12, 0]}>
        <coneGeometry args={[0.14, 0.58, 18]} />
        <meshStandardMaterial color={color} roughness={0.78} metalness={0.02} />
      </mesh>

      <mesh position={[0, -0.38, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#eaf1f7" />
      </mesh>
    </group>
  );
}

function RouteNode({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.11, 16, 16]} />
      <meshStandardMaterial color="#dfeaf7" emissive="#99bad7" emissiveIntensity={0.34} />
    </mesh>
  );
}

function Airplane({ reducedMotion = false, path }: { reducedMotion?: boolean; path: CatmullRomCurve3 }) {
  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    if (reducedMotion) {
      ref.current.position.set(2.3, 1.05, -0.1);
      ref.current.rotation.set(0.2, -0.9, -0.12);
      return;
    }

    const t = (clock.getElapsedTime() * 0.08) % 1;
    const point = path.getPointAt(t);
    const nextPoint = path.getPointAt((t + 0.01) % 1);

    ref.current.position.set(point.x + 0.2, point.y + 0.42, point.z + 0.15);
    ref.current.lookAt(nextPoint.x, nextPoint.y, nextPoint.z);
    ref.current.rotateY(Math.PI * 0.5);
    ref.current.rotateZ(-0.12);
  });

  return (
    <group ref={ref}>
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.9, 0.12, 0.18]} />
        <meshStandardMaterial color={SCENE_COLORS.cream} roughness={0.8} metalness={0.02} />
      </mesh>
      <mesh position={[-0.25, 0.04, 0]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[0.38, 0.08, 0.18]} />
        <meshStandardMaterial color={SCENE_COLORS.creamDark} roughness={0.82} metalness={0.02} />
      </mesh>
      <mesh position={[0.3, 0.02, 0]} rotation={[0, 0, 0.08]}>
        <boxGeometry args={[0.5, 0.08, 0.16]} />
        <meshStandardMaterial color={SCENE_COLORS.creamDark} roughness={0.82} metalness={0.02} />
      </mesh>
      <mesh position={[0.1, 0.15, 0]}>
        <boxGeometry args={[0.14, 0.12, 0.08]} />
        <meshStandardMaterial color={SCENE_COLORS.creamDark} roughness={0.82} metalness={0.02} />
      </mesh>
      <mesh position={[-0.2, -0.12, 0]}>
        <boxGeometry args={[0.2, 0.08, 0.08]} />
        <meshStandardMaterial color={SCENE_COLORS.creamDark} roughness={0.82} metalness={0.02} />
      </mesh>
      <mesh position={[-0.05, 0, 0.12]}>
        <boxGeometry args={[0.16, 0.04, 0.1]} />
        <meshStandardMaterial color={SCENE_COLORS.mapsiBlue} emissive={SCENE_COLORS.mapsiBlue} emissiveIntensity={0.18} roughness={0.8} metalness={0.02} />
      </mesh>
    </group>
  );
}

function MapSiWorld({ progress, reducedMotion = false }: SceneProps) {
  const ref = useRef<Group>(null);

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 650;
  const settledScale = isMobile ? 0.9 : 0.96;

  const routeCurve = useMemo(
    () =>
      new CatmullRomCurve3([
        new Vector3(-2.1, 0.18, -0.9),
        new Vector3(-1.0, 0.21, 0.05),
        new Vector3(0.15, 0.25, 0.85),
        new Vector3(1.2, 0.22, 0.4),
        new Vector3(2.0, 0.18, -0.2),
      ]),
    []
  );

  const routeGeometry = useMemo(
    () => new TubeGeometry(routeCurve, 120, 0.055, 12, false),
    [routeCurve]
  );

  const routeNodes = useMemo(
    () =>
      Array.from({ length: 6 }, (_, index) => {
        const t = index / 5;
        return routeCurve.getPointAt(t);
      }),
    [routeCurve]
  );

  useFrame(() => {
    if (!ref.current) return;

    const p = reducedMotion ? clamp01(progress * 0.8) : clamp01(progress);

    const hidden = { x: 9.2, y: -1.2, z: 3.3, scale: 0.7 };
    const settled = { x: 0.25, y: 0.08, z: 0.45, scale: settledScale };
    const exit = { x: -9.2, y: -3.4, z: -7.8, scale: 0.26 };

    let targetX = hidden.x;
    let targetY = hidden.y;
    let targetZ = hidden.z;
    let targetScale = hidden.scale;

    if (p >= STORY.transition23.start && p < STORY.transition23.end) {
      const local = rangeProgress(p, STORY.transition23.start, STORY.transition23.end);
      targetX = MathUtils.lerp(hidden.x, settled.x, local);
      targetY = MathUtils.lerp(hidden.y, settled.y, local);
      targetZ = MathUtils.lerp(hidden.z, settled.z, local);
      targetScale = MathUtils.lerp(hidden.scale, settled.scale, local);
    } else if (p >= STORY.transition23.end && p < STORY.transition34.start) {
      targetX = settled.x;
      targetY = settled.y;
      targetZ = settled.z;
      targetScale = settled.scale;
    } else if (p >= STORY.transition34.start && p < STORY.transition34.end) {
      const local = rangeProgress(p, STORY.transition34.start, STORY.transition34.end);
      targetX = MathUtils.lerp(settled.x, exit.x, local);
      targetY = MathUtils.lerp(settled.y, exit.y, local);
      targetZ = MathUtils.lerp(settled.z, exit.z, local);
      targetScale = MathUtils.lerp(settled.scale, exit.scale, local);
    } else if (p >= STORY.transition34.end) {
      targetX = exit.x;
      targetY = exit.y;
      targetZ = exit.z;
      targetScale = exit.scale;
    }

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
      ref.current.scale.x || 0.7,
      targetScale,
      0.08
    );
    ref.current.scale.x = nextScale;
    ref.current.scale.y = nextScale;
    ref.current.scale.z = nextScale;
  });

  return (
    <group ref={ref}>
      <mesh position={[0, -1.18, 0]} rotation={[0.08, 0.2, 0]}>
        <boxGeometry args={[5.8, 0.38, 4.4]} />
        <meshStandardMaterial color={SCENE_COLORS.cream} roughness={0.9} metalness={0.02} />
      </mesh>

      <mesh position={[0, -0.92, 0]} rotation={[-0.08, 0, 0]}>
        <boxGeometry args={[5.1, 0.14, 3.5]} />
        <meshStandardMaterial color={SCENE_COLORS.sageLight} roughness={0.88} metalness={0.02} />
      </mesh>

      <mesh geometry={routeGeometry} position={[0, 0.04, 0]}>
        <meshStandardMaterial color={SCENE_COLORS.mapsiBlue} emissive={SCENE_COLORS.mapsiBlue} emissiveIntensity={0.18} roughness={0.7} metalness={0.02} />
      </mesh>

      {routeNodes.map((point, index) => (
        <RouteNode key={index} position={[point.x, point.y + 0.02, point.z] as [number, number, number]} />
      ))}

      <MapPin position={[-1.9, 0.3, -0.8]} color="#7eaed3" scale={0.9} />
      <MapPin position={[0.2, 0.34, 0.75]} color="#7eaed3" scale={0.88} />
      <MapPin position={[2.0, 0.3, -0.2]} color="#7eaed3" scale={0.92} />

      <group position={[-2.25, 0.02, -0.95]}>
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[1.2, 0.8, 0.9]} />
          <meshStandardMaterial color={SCENE_COLORS.creamDark} roughness={0.88} metalness={0.02} />
        </mesh>
        <mesh position={[0, 0.64, 0.22]}>
          <boxGeometry args={[0.8, 0.14, 0.28]} />
          <meshStandardMaterial color={SCENE_COLORS.sageLight} roughness={0.82} metalness={0.02} />
        </mesh>
        <mesh position={[-0.34, 0.42, 0.24]}>
          <boxGeometry args={[0.12, 0.18, 0.06]} />
          <meshStandardMaterial color="#aac6d8" />
        </mesh>
        <mesh position={[0, 0.42, 0.24]}>
          <boxGeometry args={[0.12, 0.18, 0.06]} />
          <meshStandardMaterial color="#aac6d8" />
        </mesh>
        <mesh position={[0.34, 0.42, 0.24]}>
          <boxGeometry args={[0.12, 0.18, 0.06]} />
          <meshStandardMaterial color="#aac6d8" />
        </mesh>
      </group>

      <group position={[0.2, 0.02, 1.25]}>
        <mesh position={[0, 0.18, 0]}>
          <boxGeometry args={[0.85, 0.52, 0.75]} />
          <meshStandardMaterial color={SCENE_COLORS.concrete} roughness={0.9} metalness={0.02} />
        </mesh>
        <mesh position={[0, 0.53, 0.1]}>
          <boxGeometry args={[0.9, 0.12, 0.24]} />
          <meshStandardMaterial color={SCENE_COLORS.wood} roughness={0.8} metalness={0.02} />
        </mesh>
        <mesh position={[-0.18, 0.32, 0.2]}>
          <boxGeometry args={[0.16, 0.16, 0.1]} />
          <meshStandardMaterial color="#8da9bd" />
        </mesh>
        <mesh position={[0.24, 0.32, 0.12]}>
          <boxGeometry args={[0.14, 0.14, 0.1]} />
          <meshStandardMaterial color="#8da9bd" />
        </mesh>
      </group>

      <group position={[2.1, 0.02, -0.82]}>
        <mesh position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.32, 0.46, 1.0, 8]} />
          <meshStandardMaterial color={SCENE_COLORS.creamDark} roughness={0.88} metalness={0.02} />
        </mesh>
        <mesh position={[0, 1.15, 0]}>
          <coneGeometry args={[0.24, 0.52, 8]} />
          <meshStandardMaterial color={SCENE_COLORS.sageLight} roughness={0.8} metalness={0.02} />
        </mesh>
      </group>

      <Airplane reducedMotion={reducedMotion} path={routeCurve} />
    </group>
  );
}

function TaskCard({
  progress,
  reducedMotion,
  start,
  end,
  color,
  checked,
}: {
  progress: number;
  reducedMotion?: boolean;
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  checked?: boolean;
}) {
  const ref = useRef<Group>(null);

  useFrame(() => {
    if (!ref.current) return;

    const stage = reducedMotion
      ? 1
      : clamp01(rangeProgress(progress, STORY.transition34.start, STORY.transition34.end + 0.14));

    const startVector = new Vector3(...start);
    const endVector = new Vector3(...end);
    const targetPosition = startVector.lerp(endVector, stage);

    ref.current.position.lerp(targetPosition, 0.08);
    ref.current.rotation.y = MathUtils.lerp(ref.current.rotation.y, 0.08, 0.08);
    ref.current.rotation.z = MathUtils.lerp(ref.current.rotation.z, stage > 0.4 ? 0 : -0.12, 0.08);
  });

  return (
    <group ref={ref}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.45, 0.72, 0.12]} />
        <meshStandardMaterial color={color} roughness={0.84} metalness={0.02} />
      </mesh>

      <mesh position={[-0.52, 0, 0.08]}>
        <boxGeometry args={[0.22, 0.22, 0.04]} />
        <meshStandardMaterial color={SCENE_COLORS.cream} roughness={0.86} metalness={0.02} />
      </mesh>

      <mesh position={[-0.2, 0.12, 0.1]}>
        <boxGeometry args={[0.78, 0.1, 0.04]} />
        <meshStandardMaterial color="#526d52" />
      </mesh>

      <mesh position={[-0.12, -0.12, 0.1]}>
        <boxGeometry args={[0.62, 0.1, 0.04]} />
        <meshStandardMaterial color="#7d8c70" />
      </mesh>

      {checked && (
        <group position={[-0.52, 0, 0.14]}>
          <mesh rotation={[0, 0, -0.6]}>
            <boxGeometry args={[0.18, 0.06, 0.04]} />
            <meshStandardMaterial color={SCENE_COLORS.prioritizeAmber} roughness={0.76} metalness={0.02} />
          </mesh>
          <mesh rotation={[0, 0, 0.75]} position={[0.09, -0.02, 0]}>
            <boxGeometry args={[0.26, 0.06, 0.04]} />
            <meshStandardMaterial color={SCENE_COLORS.prioritizeAmber} roughness={0.76} metalness={0.02} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function PrioritizeClock() {
  return (
    <group position={[1.95, 0.55, 0.2]} rotation={[0.1, 0.15, 0]}>
      <mesh>
        <cylinderGeometry args={[0.38, 0.38, 0.12, 28]} />
        <meshStandardMaterial color={SCENE_COLORS.cream} roughness={0.85} metalness={0.02} />
      </mesh>
      <mesh position={[0, 0, 0.06]}>
        <cylinderGeometry args={[0.31, 0.31, 0.02, 28]} />
        <meshStandardMaterial color={SCENE_COLORS.creamDark} emissive={SCENE_COLORS.prioritizeAmber} emissiveIntensity={0.1} roughness={0.8} metalness={0.02} />
      </mesh>
      <mesh position={[0, 0, 0.08]} rotation={[0, 0, 0.7]}>
        <boxGeometry args={[0.28, 0.05, 0.04]} />
        <meshStandardMaterial color="#566b54" />
      </mesh>
      <mesh position={[0, 0, 0.08]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.17, 0.05, 0.04]} />
        <meshStandardMaterial color="#566b54" />
      </mesh>
    </group>
  );
}

function PrioritizeWorld({ progress, reducedMotion = false }: SceneProps) {
  const ref = useRef<Group>(null);

  useFrame(() => {
    if (!ref.current) return;

    const p = reducedMotion ? clamp01(progress * 0.8) : clamp01(progress);
    const hidden = { x: 7.8, y: 2.8, z: -3.2, scale: 0.7, rotY: 0.8, rotZ: 0.25 };
    const settled = { x: 0.7, y: 0.2, z: 0.8, scale: 1, rotY: 0.15, rotZ: 0.08 };
    const exit = { x: -10.5, y: -3.4, z: -7.8, scale: 0.22, rotY: 0.95, rotZ: -0.2 };

    let targetX = hidden.x;
    let targetY = hidden.y;
    let targetZ = hidden.z;
    let targetScale = hidden.scale;
    let targetRotY = hidden.rotY;
    let targetRotZ = hidden.rotZ;

    if (p >= STORY.transition34.start && p < STORY.transition34.end) {
      const local = rangeProgress(p, STORY.transition34.start, STORY.transition34.end);
      targetX = MathUtils.lerp(hidden.x, settled.x, local);
      targetY = MathUtils.lerp(hidden.y, settled.y, local);
      targetZ = MathUtils.lerp(hidden.z, settled.z, local);
      targetScale = MathUtils.lerp(hidden.scale, settled.scale, local);
      targetRotY = MathUtils.lerp(hidden.rotY, settled.rotY, local);
      targetRotZ = MathUtils.lerp(hidden.rotZ, settled.rotZ, local);
    } else if (p >= STORY.transition34.end && p < STORY.transition45.start) {
      targetX = settled.x;
      targetY = settled.y;
      targetZ = settled.z;
      targetScale = settled.scale;
      targetRotY = settled.rotY;
      targetRotZ = settled.rotZ;
    } else if (p >= STORY.transition45.start && p < STORY.transition45.end) {
      const local = rangeProgress(p, STORY.transition45.start, STORY.transition45.end);
      targetX = MathUtils.lerp(settled.x, exit.x, local);
      targetY = MathUtils.lerp(settled.y, exit.y, local);
      targetZ = MathUtils.lerp(settled.z, exit.z, local);
      targetScale = MathUtils.lerp(settled.scale, exit.scale, local);
      targetRotY = MathUtils.lerp(settled.rotY, exit.rotY, local);
      targetRotZ = MathUtils.lerp(settled.rotZ, exit.rotZ, local);
    } else if (p >= STORY.transition45.end) {
      targetX = exit.x;
      targetY = exit.y;
      targetZ = exit.z;
      targetScale = exit.scale;
      targetRotY = exit.rotY;
      targetRotZ = exit.rotZ;
    }

    ref.current.position.x = MathUtils.lerp(ref.current.position.x, targetX, 0.08);
    ref.current.position.y = MathUtils.lerp(ref.current.position.y, targetY, 0.08);
    ref.current.position.z = MathUtils.lerp(ref.current.position.z, targetZ, 0.08);
    ref.current.rotation.y = MathUtils.lerp(ref.current.rotation.y, targetRotY, 0.08);
    ref.current.rotation.z = MathUtils.lerp(ref.current.rotation.z, targetRotZ, 0.08);
    ref.current.scale.setScalar(MathUtils.lerp(ref.current.scale.x || hidden.scale, targetScale, 0.08));
  });

  return (
    <group ref={ref}>
      <mesh position={[0, -1.1, 0]} rotation={[0.1, 0.2, 0]}>
        <cylinderGeometry args={[2.7, 2.9, 0.35, 28]} />
        <meshStandardMaterial color="#dfece0" />
      </mesh>

      <group position={[0, 0.15, 0]} rotation={[0.26, 0.2, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4.8, 3.1, 0.18]} />
          <meshStandardMaterial color="#f4efe7" />
        </mesh>

        <mesh position={[0, 0, -0.04]}>
          <boxGeometry args={[4.95, 3.28, 0.08]} />
          <meshStandardMaterial color="#586d57" />
        </mesh>

        <mesh position={[0, 1.18, 0.08]}>
          <boxGeometry args={[4.65, 0.34, 0.06]} />
          <meshStandardMaterial color="#d4ba8b" emissive="#d4ba8b" emissiveIntensity={0.08} />
        </mesh>

        <Text position={[0, 1.1, 0.18]} fontSize={0.22} color="#445941" anchorX="center" anchorY="middle">
          WEEK
        </Text>

        {[
          [-1.7, 0.5, 0.11],
          [-1.7, -0.1, 0.11],
          [-1.7, -0.7, 0.11],
          [-1.7, -1.3, 0.11],
        ].map((pos, index) => (
          <mesh key={index} position={pos as [number, number, number]}>
            <boxGeometry args={[0.1, 1.9, 0.06]} />
            <meshStandardMaterial color="#dfe4d7" />
          </mesh>
        ))}

        {[
          [-1.15, 0.78, 0.11],
          [-0.35, 0.78, 0.11],
          [0.45, 0.78, 0.11],
          [1.4, 0.78, 0.11],
        ].map((pos, index) => (
          <mesh key={index} position={pos as [number, number, number]}>
            <boxGeometry args={[1.7, 0.08, 0.06]} />
            <meshStandardMaterial color="#dfe4d7" />
          </mesh>
        ))}

        <mesh position={[-1.02, 0.2, 0.16]}>
          <boxGeometry args={[1.55, 0.32, 0.1]} />
          <meshStandardMaterial color="#dfe6d2" />
        </mesh>
        <mesh position={[-0.1, 0.18, 0.16]}>
          <boxGeometry args={[1.1, 0.26, 0.1]} />
          <meshStandardMaterial color="#d7b884" emissive="#d7b884" emissiveIntensity={0.08} />
        </mesh>
        <mesh position={[1.25, -0.16, 0.16]}>
          <boxGeometry args={[1.42, 0.32, 0.1]} />
          <meshStandardMaterial color="#dfe6d2" />
        </mesh>
        <mesh position={[-1.08, -0.62, 0.16]}>
          <boxGeometry args={[1.25, 0.28, 0.1]} />
          <meshStandardMaterial color="#e9e0d2" />
        </mesh>
        <mesh position={[0.68, -0.58, 0.16]}>
          <boxGeometry args={[1.88, 0.26, 0.1]} />
          <meshStandardMaterial color="#d9e1ce" />
        </mesh>
      </group>

      <TaskCard
        progress={progress}
        reducedMotion={reducedMotion}
        start={[-2.6, 0.6, -0.8]}
        end={[-2.2, 0.8, 0.7]}
        color="#f2ead9"
        checked
      />
      <TaskCard
        progress={progress}
        reducedMotion={reducedMotion}
        start={[-1.2, 1.8, -0.8]}
        end={[-1.5, 1.2, 0.9]}
        color="#dfe8d3"
        checked
      />
      <TaskCard
        progress={progress}
        reducedMotion={reducedMotion}
        start={[1.7, 1.2, -0.7]}
        end={[1.6, 1.1, 0.9]}
        color="#e8dfcf"
      />
      <TaskCard
        progress={progress}
        reducedMotion={reducedMotion}
        start={[2.6, 0.4, -0.2]}
        end={[2.2, 0.25, 0.7]}
        color="#edf1e9"
      />

      <PrioritizeClock />

      <group position={[1.8, -0.9, 0.2]} rotation={[0.18, -0.15, 0]}>
        <mesh>
          <boxGeometry args={[1.05, 0.7, 0.1]} />
          <meshStandardMaterial color="#f4efe7" />
        </mesh>
        <mesh position={[0.2, 0.15, 0.08]}>
          <boxGeometry args={[0.48, 0.1, 0.06]} />
          <meshStandardMaterial color="#d7b884" emissive="#d7b884" emissiveIntensity={0.12} />
        </mesh>
        <mesh position={[-0.22, -0.18, 0.08]}>
          <boxGeometry args={[0.34, 0.1, 0.06]} />
          <meshStandardMaterial color="#dfe8d3" />
        </mesh>
      </group>
    </group>
  );
}

function DogCharacter({ progress, reducedMotion = false }: { progress: number; reducedMotion?: boolean }) {
  const ref = useRef<Group>(null);

  useFrame(() => {
    if (!ref.current) return;

    const p = reducedMotion ? 1 : clamp01(rangeProgress(progress, STORY.transition45.start, 1));
    const split = clamp01((p - 0.18) / 0.24);
    const plateReached = clamp01((p - 0.42) / 0.2);
    const reunite = clamp01((p - 0.76) / 0.2);

    const x = MathUtils.lerp(-2.8, -1.2, split) + plateReached * 1.7 + reunite * 0.9;
    const y = 0.22;
    const z = 0.22 + Math.sin(p * 2.3) * 0.05;
    const targetRotationY = MathUtils.lerp(0.24, -0.1, plateReached);

    ref.current.position.set(x, y, z);
    ref.current.rotation.set(0, targetRotationY, 0);
  });

  return (
    <group ref={ref} position={[-2.8, 0.22, 0.22]}>
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.82, 0.42, 0.44]} />
        <meshStandardMaterial color="#d8b17d" />
      </mesh>
      <mesh position={[0.44, 0.38, 0.02]}>
        <boxGeometry args={[0.28, 0.22, 0.24]} />
        <meshStandardMaterial color="#d8b17d" />
      </mesh>
      <mesh position={[0.62, 0.54, 0.15]} rotation={[0, 0, -0.32]}>
        <boxGeometry args={[0.18, 0.06, 0.07]} />
        <meshStandardMaterial color="#d8b17d" />
      </mesh>
      <mesh position={[0.62, 0.54, -0.15]} rotation={[0, 0, -0.32]}>
        <boxGeometry args={[0.18, 0.06, 0.07]} />
        <meshStandardMaterial color="#d8b17d" />
      </mesh>
      <mesh position={[-0.14, -0.18, 0.12]}>
        <boxGeometry args={[0.12, 0.34, 0.12]} />
        <meshStandardMaterial color="#d8b17d" />
      </mesh>
      <mesh position={[0.14, -0.18, 0.12]}>
        <boxGeometry args={[0.12, 0.34, 0.12]} />
        <meshStandardMaterial color="#d8b17d" />
      </mesh>
      <mesh position={[-0.14, -0.18, -0.12]}>
        <boxGeometry args={[0.12, 0.34, 0.12]} />
        <meshStandardMaterial color="#d8b17d" />
      </mesh>
      <mesh position={[0.14, -0.18, -0.12]}>
        <boxGeometry args={[0.12, 0.34, 0.12]} />
        <meshStandardMaterial color="#d8b17d" />
      </mesh>
      <mesh position={[-0.38, 0.06, 0.22]} rotation={[0, 0, 0.75]}>
        <boxGeometry args={[0.18, 0.06, 0.06]} />
        <meshStandardMaterial color="#c89e6e" />
      </mesh>
      <mesh position={[-0.38, 0.06, -0.22]} rotation={[0, 0, 0.75]}>
        <boxGeometry args={[0.18, 0.06, 0.06]} />
        <meshStandardMaterial color="#c89e6e" />
      </mesh>
      <mesh position={[0.04, 0.08, 0.24]} rotation={[0, 0, -0.78]}>
        <boxGeometry args={[0.22, 0.06, 0.06]} />
        <meshStandardMaterial color="#c89e6e" />
      </mesh>
    </group>
  );
}

function HumanCharacter({ progress, reducedMotion = false }: { progress: number; reducedMotion?: boolean }) {
  const ref = useRef<Group>(null);

  useFrame(() => {
    if (!ref.current) return;

    const p = reducedMotion ? 1 : clamp01(rangeProgress(progress, STORY.transition45.start, 1));
    const split = clamp01((p - 0.12) / 0.22);
    const doorOpen = clamp01((p - 0.56) / 0.18);
    const reunite = clamp01((p - 0.78) / 0.2);

    const x = MathUtils.lerp(-2.5, -0.15, split) + doorOpen * 1.5 + reunite * 1.15;
    const y = 0.33 + (split > 0.4 ? 0.08 : 0);
    const z = 0.42 + Math.sin(p * 2.8) * 0.04;
    const rotationY = MathUtils.lerp(0.2, -0.08, doorOpen);

    ref.current.position.set(x, y, z);
    ref.current.rotation.set(0, rotationY, 0);
  });

  return (
    <group ref={ref} position={[-2.5, 0.33, 0.42]}>
      <mesh position={[0, 0.78, 0]}>
        <sphereGeometry args={[0.22, 18, 18]} />
        <meshStandardMaterial color="#f1e6d9" />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[0.48, 0.64, 0.22]} />
        <meshStandardMaterial color="#8ea68f" />
      </mesh>
      <mesh position={[-0.32, 0.38, 0]} rotation={[0, 0, 0.48]}>
        <boxGeometry args={[0.26, 0.08, 0.08]} />
        <meshStandardMaterial color="#f1e6d9" />
      </mesh>
      <mesh position={[0.32, 0.38, 0]} rotation={[0, 0, -0.48]}>
        <boxGeometry args={[0.26, 0.08, 0.08]} />
        <meshStandardMaterial color="#f1e6d9" />
      </mesh>
      <mesh position={[-0.08, 0.02, 0]}>
        <boxGeometry args={[0.12, 0.54, 0.12]} />
        <meshStandardMaterial color="#f1e6d9" />
      </mesh>
      <mesh position={[0.12, 0.02, 0]}>
        <boxGeometry args={[0.12, 0.54, 0.12]} />
        <meshStandardMaterial color="#f1e6d9" />
      </mesh>
      <mesh position={[0, -0.46, 0]}>
        <boxGeometry args={[0.16, 0.26, 0.16]} />
        <meshStandardMaterial color="#342f2d" />
      </mesh>
    </group>
  );
}

function DogHumanWorld({ progress, reducedMotion = false }: SceneProps) {
  const ref = useRef<Group>(null);

  useFrame(() => {
    if (!ref.current) return;

    const p = reducedMotion ? clamp01(progress * 0.8) : clamp01(progress);
    const hidden = { x: 8.4, y: 2.7, z: -3.8, scale: 0.68, rotY: 0.85, rotZ: 0.3 };
    const settled = { x: 0.52, y: 0.18, z: 0.62, scale: 0.9, rotY: 0.12, rotZ: 0.04 };
    const exit = { x: -8.8, y: -3.6, z: -7.2, scale: 0.18, rotY: 0.9, rotZ: -0.18 };

    let targetX = hidden.x;
    let targetY = hidden.y;
    let targetZ = hidden.z;
    let targetScale = hidden.scale;
    let targetRotY = hidden.rotY;
    let targetRotZ = hidden.rotZ;

    if (p >= STORY.transition45.start && p < STORY.transition45.end) {
      const local = rangeProgress(p, STORY.transition45.start, STORY.transition45.end);
      targetX = MathUtils.lerp(hidden.x, settled.x, local);
      targetY = MathUtils.lerp(hidden.y, settled.y, local);
      targetZ = MathUtils.lerp(hidden.z, settled.z, local);
      targetScale = MathUtils.lerp(hidden.scale, settled.scale, local);
      targetRotY = MathUtils.lerp(hidden.rotY, settled.rotY, local);
      targetRotZ = MathUtils.lerp(hidden.rotZ, settled.rotZ, local);
    } else if (p >= STORY.transition45.end && p < STORY.transition56.start) {
      targetX = settled.x;
      targetY = settled.y;
      targetZ = settled.z;
      targetScale = settled.scale;
      targetRotY = settled.rotY;
      targetRotZ = settled.rotZ;
    } else if (p >= STORY.transition56.start && p < STORY.transition56.end) {
      const local = rangeProgress(p, STORY.transition56.start, STORY.transition56.end);
      targetX = MathUtils.lerp(settled.x, exit.x, local);
      targetY = MathUtils.lerp(settled.y, exit.y, local);
      targetZ = MathUtils.lerp(settled.z, exit.z, local);
      targetScale = MathUtils.lerp(settled.scale, exit.scale, local);
      targetRotY = MathUtils.lerp(settled.rotY, exit.rotY, local);
      targetRotZ = MathUtils.lerp(settled.rotZ, exit.rotZ, local);
    } else if (p >= STORY.transition56.end) {
      targetX = exit.x;
      targetY = exit.y;
      targetZ = exit.z;
      targetScale = exit.scale;
      targetRotY = exit.rotY;
      targetRotZ = exit.rotZ;
    }

    ref.current.position.x = MathUtils.lerp(ref.current.position.x, targetX, 0.08);
    ref.current.position.y = MathUtils.lerp(ref.current.position.y, targetY, 0.08);
    ref.current.position.z = MathUtils.lerp(ref.current.position.z, targetZ, 0.08);
    ref.current.rotation.y = MathUtils.lerp(ref.current.rotation.y, targetRotY, 0.08);
    ref.current.rotation.z = MathUtils.lerp(ref.current.rotation.z, targetRotZ, 0.08);
    ref.current.scale.setScalar(MathUtils.lerp(ref.current.scale.x || hidden.scale, targetScale, 0.08));
  });

  const plateProgress = reducedMotion ? 1 : clamp01(rangeProgress(progress, STORY.transition45.start, 1));
  const doorOpen = plateProgress > 0.58;
  const plateDown = plateProgress > 0.4;
  const exitOpen = plateProgress > 0.62;

  return (
    <group ref={ref}>
      <mesh position={[0, -0.9, 0]} rotation={[0.05, 0.12, 0]}>
        <boxGeometry args={[8.5, 0.48, 1.8]} />
        <meshStandardMaterial color="#dfe7d7" />
      </mesh>

      <mesh position={[-3.4, 0.16, 0]}>
        <boxGeometry args={[2.2, 0.28, 1.15]} />
        <meshStandardMaterial color="#cfdcc5" />
      </mesh>

      <mesh position={[-0.1, 0.28, 0]}>
        <boxGeometry args={[2.3, 0.14, 1.0]} />
        <meshStandardMaterial color="#e9e4d9" />
      </mesh>

      <mesh position={[2.4, 0.18, 0]}>
        <boxGeometry args={[2.2, 0.22, 1.0]} />
        <meshStandardMaterial color="#c8d6bc" />
      </mesh>

      <mesh position={[0.35, 0.72, 0]}>
        <boxGeometry args={[2.8, 0.12, 1.0]} />
        <meshStandardMaterial color="#c8d5b6" />
      </mesh>

      <mesh position={[2.8, 0.8, 0]}>
        <boxGeometry args={[0.12, 1.2, 0.12]} />
        <meshStandardMaterial color="#d4a287" />
      </mesh>

      <group position={[1.8, 0.26, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.22, 1.2, 0.14]} />
          <meshStandardMaterial color="#b76d53" />
        </mesh>
        <mesh position={[0.18, 0.54, 0]}>
          <boxGeometry args={[0.14, 0.2, 0.14]} />
          <meshStandardMaterial color="#d4a287" />
        </mesh>
      </group>

      <mesh position={[1.1, 0.36, 0]}>
        <boxGeometry args={[0.18, 0.72, 0.18]} />
        <meshStandardMaterial color="#6d7d5f" />
      </mesh>

      <mesh position={[1.1, 0.8, 0]}>
        <boxGeometry args={[1.1, 0.16, 0.16]} />
        <meshStandardMaterial color="#6d7d5f" />
      </mesh>

      <mesh position={[1.1, 0.7, 0]}>
        <boxGeometry args={[0.1, 0.3, 0.1]} />
        <meshStandardMaterial color="#d4a287" />
      </mesh>

      <mesh position={[-0.8, 0.12, 0]}>
        <boxGeometry args={[0.24, 0.12, 0.38]} />
        <meshStandardMaterial color={plateDown ? "#d67f66" : "#df8f75"} />
      </mesh>
      <mesh position={[-0.8, -0.02, 0]}>
        <boxGeometry args={[0.64, 0.14, 0.64]} />
        <meshStandardMaterial color="#b7c7af" />
      </mesh>

      <group position={[1.1, 0.18, 0.2]}>
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[0.18, 0.22, 0.18]} />
          <meshStandardMaterial color={doorOpen ? "#cf9b7d" : "#a9b9a2"} />
        </mesh>
        <mesh position={[-0.42, 0.12, 0]}>
          <boxGeometry args={[0.18, 0.22, 0.18]} />
          <meshStandardMaterial color={doorOpen ? "#cf9b7d" : "#a9b9a2"} />
        </mesh>
      </group>

      {doorOpen && (
        <mesh position={[1.18, 0.26, 0]}>
          <boxGeometry args={[0.5, 0.68, 0.12]} />
          <meshStandardMaterial color="#d8c7a9" />
        </mesh>
      )}

      <group position={[3.75, 0.9, 0]}>
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[0.08, 0.55, 0.08]} />
          <meshStandardMaterial color="#b5674a" />
        </mesh>
        <mesh position={[0.18, 0.2, 0]}>
          <boxGeometry args={[0.36, 0.22, 0.06]} />
          <meshStandardMaterial color="#d67f66" />
        </mesh>
      </group>

      <HumanCharacter progress={progress} reducedMotion={reducedMotion} />
      <DogCharacter progress={progress} reducedMotion={reducedMotion} />

      <mesh position={[3.6, 0.28, 0]}>
        <boxGeometry args={[0.56, 0.56, 0.08]} />
        <meshStandardMaterial color={exitOpen ? "#d7a57f" : "#dfe6d4"} />
      </mesh>

      <mesh position={[3.8, 0.58, 0]}>
        <boxGeometry args={[0.1, 0.32, 0.1]} />
        <meshStandardMaterial color="#7a8e73" />
      </mesh>
    </group>
  );
}

function FinalWorld({ progress, reducedMotion = false }: SceneProps) {
  const ref = useRef<Group>(null);

  useFrame(() => {
    if (!ref.current) return;

    const p = reducedMotion ? clamp01(progress * 0.8) : clamp01(progress);
    const hidden = { x: 10.4, y: 2.8, z: -4.8, scale: 0.46, rotY: 0.78, rotZ: 0.24 };
    const settled = { x: 0.8, y: 0.1, z: 0.6, scale: 0.97, rotY: 0.1, rotZ: 0.04 };

    let targetX = hidden.x;
    let targetY = hidden.y;
    let targetZ = hidden.z;
    let targetScale = hidden.scale;
    let targetRotY = hidden.rotY;
    let targetRotZ = hidden.rotZ;

    if (p >= STORY.transition56.start && p < STORY.transition56.end) {
      const local = rangeProgress(p, STORY.transition56.start, STORY.transition56.end);
      targetX = MathUtils.lerp(hidden.x, settled.x, local);
      targetY = MathUtils.lerp(hidden.y, settled.y, local);
      targetZ = MathUtils.lerp(hidden.z, settled.z, local);
      targetScale = MathUtils.lerp(hidden.scale, settled.scale, local);
      targetRotY = MathUtils.lerp(hidden.rotY, settled.rotY, local);
      targetRotZ = MathUtils.lerp(hidden.rotZ, settled.rotZ, local);
    } else if (p >= STORY.transition56.end) {
      targetX = settled.x;
      targetY = settled.y;
      targetZ = settled.z;
      targetScale = settled.scale;
      targetRotY = settled.rotY;
      targetRotZ = settled.rotZ;
    }

    ref.current.position.x = MathUtils.lerp(ref.current.position.x, targetX, 0.08);
    ref.current.position.y = MathUtils.lerp(ref.current.position.y, targetY, 0.08);
    ref.current.position.z = MathUtils.lerp(ref.current.position.z, targetZ, 0.08);
    ref.current.rotation.y = MathUtils.lerp(ref.current.rotation.y, targetRotY, 0.08);
    ref.current.rotation.z = MathUtils.lerp(ref.current.rotation.z, targetRotZ, 0.08);
    ref.current.scale.setScalar(MathUtils.lerp(ref.current.scale.x || hidden.scale, targetScale, 0.08));
  });

  return (
    <group ref={ref}>
      <mesh position={[0, -1.05, 0]} rotation={[0.08, 0.12, 0]}>
        <boxGeometry args={[10.5, 0.28, 2.4]} />
        <meshStandardMaterial color={SCENE_COLORS.cream} roughness={0.9} metalness={0.02} />
      </mesh>

      <mesh position={[0.1, -0.8, 0.35]} rotation={[0.02, 0.1, 0]}>
        <boxGeometry args={[5.8, 0.12, 1.2]} />
        <meshStandardMaterial color={SCENE_COLORS.sageLight} roughness={0.9} metalness={0.02} />
      </mesh>

      {[-2.2, -0.8, 0.6, 2.0, 3.6, 5.2].map((x, index) => (
        <mesh key={index} position={[x, -0.48, 0.4 + (index % 2 === 0 ? 0.12 : -0.18)]} rotation={[0, 0.04, 0]}>
          <boxGeometry args={[1.1, 0.1, 0.28]} />
          <meshStandardMaterial color={SCENE_COLORS.sageLight} roughness={0.9} metalness={0.02} />
        </mesh>
      ))}

      <mesh position={[5.8, 0.18, 0.7]}>
        <boxGeometry args={[1.2, 0.18, 0.9]} />
        <meshStandardMaterial color={SCENE_COLORS.creamDark} roughness={0.88} metalness={0.02} />
      </mesh>

      <mesh position={[6.0, 0.72, 0.7]}>
        <boxGeometry args={[0.12, 0.74, 0.12]} />
        <meshStandardMaterial color={SCENE_COLORS.woodDark} roughness={0.82} metalness={0.02} />
      </mesh>

      <mesh position={[6.0, 1.04, 0.7]}>
        <boxGeometry args={[0.38, 0.14, 0.08]} />
        <meshStandardMaterial color={SCENE_COLORS.futureGold} roughness={0.78} metalness={0.02} />
      </mesh>

      <mesh position={[4.9, 0.7, 0.2]}>
        <boxGeometry args={[0.6, 0.12, 0.6]} />
        <meshStandardMaterial color={SCENE_COLORS.sageLight} roughness={0.88} metalness={0.02} />
      </mesh>

      {[[-3.4, -0.3, -0.5], [-1.8, -0.18, 0.9], [2.2, -0.22, -0.8], [4.2, -0.18, 0.85]].map((pos, index) => (
        <group key={index} position={pos as [number, number, number]}>
          <mesh position={[0, 0.18, 0]}>
            <sphereGeometry args={[0.22, 12, 12]} />
            <meshStandardMaterial color="#8fa986" />
          </mesh>
          <mesh position={[0.1, -0.08, 0]}>
            <coneGeometry args={[0.26, 0.5, 12]} />
            <meshStandardMaterial color="#7b9372" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function PortfolioScene({ progress, reducedMotion = false }: SceneProps) {
  const workspaceVisible = progress < STORY.transition12.end + 0.001;
  const sfuVisible = progress < STORY.transition23.end + 0.001;
  const mapsiVisible = progress < STORY.transition34.end + 0.001;
  const prioritizeVisible = progress < STORY.transition45.end + 0.001;
  const dogHumanVisible = progress < STORY.transition56.end + 0.001;
  const finalVisible = progress >= STORY.transition56.start - 0.01;

  return (
    <div className="scene-shell">
      <Canvas
        camera={{
          position: [6, 4.5, 6],
          fov: 42,
        }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={1.1} color="#f7f0e0" />
        <hemisphereLight args={["#f7ede0", SCENE_COLORS.forest, 1.2]} />

        <directionalLight position={[5, 8, 5]} intensity={1.8} color="#f4ead6" />
        <directionalLight position={[-4, 4, -3]} intensity={0.9} color="#dfead8" />

        {sfuVisible && <SFUCampus progress={progress} reducedMotion={reducedMotion} />}
        {workspaceVisible && <Workspace progress={progress} reducedMotion={reducedMotion} />}
        {mapsiVisible && <MapSiWorld progress={progress} reducedMotion={reducedMotion} />}
        {prioritizeVisible && <PrioritizeWorld progress={progress} reducedMotion={reducedMotion} />}
        {dogHumanVisible && <DogHumanWorld progress={progress} reducedMotion={reducedMotion} />}
        {finalVisible && <FinalWorld progress={progress} reducedMotion={reducedMotion} />}
        <CameraRig progress={progress} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}

export default PortfolioScene;