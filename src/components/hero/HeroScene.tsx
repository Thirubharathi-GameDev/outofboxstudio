"use client";

import { useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Icosahedron, Dodecahedron, Octahedron, Torus } from "@react-three/drei";
import * as THREE from "three";
import { useIsDesktop } from "@/hooks/useMediaQuery";

/** Deterministic hash-based pseudo-random in [0,1) — pure & SSR-stable. */
function rand(n: number) {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Lightweight float/rotate driver (delta-based, no deprecated THREE.Clock). */
function Floating({
  children,
  speed = 1,
  rotationIntensity = 1,
  floatIntensity = 1,
  position,
}: {
  children: ReactNode;
  speed?: number;
  rotationIntensity?: number;
  floatIntensity?: number;
  position: [number, number, number];
}) {
  const ref = useRef<THREE.Group>(null);
  const phase = useRef(rand(position[0] * 100 + position[1] * 10) * 10000);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current || speed === 0) return;
    elapsed.current += delta;
    const t = phase.current + elapsed.current;
    ref.current.rotation.x = (Math.cos(t / 4) / 8) * rotationIntensity * speed;
    ref.current.rotation.y = (Math.sin(t / 4) / 8) * rotationIntensity * speed;
    ref.current.rotation.z = (Math.sin(t / 4) / 20) * rotationIntensity * speed;
    ref.current.position.y = position[1] + (Math.sin(t / 4) / 10) * floatIntensity;
  });

  return (
    <group ref={ref} position={position}>
      {children}
    </group>
  );
}

/** Parallax starfield. */
function Starfield({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 7 + rand(i + 1) * 16;
      const theta = rand(i + 2) * Math.PI * 2;
      const phi = Math.acos(2 * rand(i + 3) - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.015;
    ref.current.rotation.x += delta * 0.004;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        sizeAttenuation
        color="#9db4ff"
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Drifting nebula geometry — a colored point cloud shaped into a soft, slowly
 * churning volumetric cloud. Each point is tinted along a purple→cyan gradient
 * and the whole field rotates + gently pulses. Additive blending makes overlaps
 * glow like gas.
 */
function Nebula({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const a = new THREE.Color("#6c63ff");
    const b = new THREE.Color("#00e5ff");
    const tmp = new THREE.Color();
    for (let i = 0; i < count; i++) {
      // clustered disc with vertical falloff → cloud-like
      const radius = Math.pow(rand(i + 100), 0.6) * 7 + 1.5;
      const angle = rand(i + 200) * Math.PI * 2;
      const spiral = angle + radius * 0.35;
      const y = (rand(i + 300) - 0.5) * 3 * (1 - radius / 12);
      positions[i * 3] = Math.cos(spiral) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(spiral) * radius - 4;

      tmp.copy(a).lerp(b, rand(i + 400));
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }
    return { positions, colors };
  }, [count]);

  const elapsed = useRef(0);
  useFrame((_, delta) => {
    if (!ref.current) return;
    elapsed.current += delta;
    ref.current.rotation.y += delta * 0.02;
    const s = 1 + Math.sin(elapsed.current * 0.2) * 0.04;
    ref.current.scale.set(s, s, s);
  });

  return (
    <points ref={ref} position={[-1, -0.5, -3]} rotation={[Math.PI / 2.6, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/** A slowly rotating belt of asteroid fragments. */
function AsteroidBelt({ n }: { n: number }) {
  const group = useRef<THREE.Group>(null);
  const frags = useMemo(
    () =>
      Array.from({ length: n }, (_, i) => {
        const angle = rand(i + 10) * Math.PI * 2;
        const radius = 3.6 + rand(i + 20) * 3.2;
        return {
          pos: [
            Math.cos(angle) * radius,
            (rand(i + 30) - 0.5) * 3,
            Math.sin(angle) * radius - 2,
          ] as [number, number, number],
          scale: 0.12 + rand(i + 40) * 0.22,
          shape: Math.floor(rand(i + 50) * 3),
          spin: 0.2 + rand(i + 60) * 0.5,
        };
      }),
    [n],
  );

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.03;
  });

  return (
    <group ref={group}>
      {frags.map((f, i) => (
        <Floating key={i} speed={f.spin} rotationIntensity={1.4} floatIntensity={0.6} position={f.pos}>
          {f.shape === 0 ? (
            <Dodecahedron args={[f.scale]}>
              <meshStandardMaterial color="#8a90b8" roughness={0.85} metalness={0.3} flatShading />
            </Dodecahedron>
          ) : f.shape === 1 ? (
            <Octahedron args={[f.scale]}>
              <meshStandardMaterial color="#6f7aa8" roughness={0.9} metalness={0.2} flatShading />
            </Octahedron>
          ) : (
            <Icosahedron args={[f.scale, 0]}>
              <meshStandardMaterial color="#9aa0c8" roughness={0.8} metalness={0.35} flatShading />
            </Icosahedron>
          )}
        </Floating>
      ))}
    </group>
  );
}

/** Hero focal objects: a big crystal + accent ring + shard. */
function FocalObjects() {
  return (
    <group>
      <Floating speed={1.2} rotationIntensity={0.9} floatIntensity={1.1} position={[-2.7, 0.5, -1]}>
        <Icosahedron args={[1.15, 1]}>
          <meshStandardMaterial
            color="#6c63ff"
            emissive="#3b2fbf"
            emissiveIntensity={0.55}
            roughness={0.22}
            metalness={0.65}
            flatShading
          />
        </Icosahedron>
      </Floating>

      <Floating speed={1} rotationIntensity={1} floatIntensity={1.3} position={[2.8, -0.4, -0.5]}>
        <Torus args={[0.72, 0.2, 24, 90]} rotation={[0.6, 0.2, 0]}>
          <meshStandardMaterial color="#00e5ff" emissive="#008ea0" emissiveIntensity={0.65} roughness={0.2} metalness={0.85} />
        </Torus>
      </Floating>

      <Floating speed={1.6} rotationIntensity={0.6} floatIntensity={1} position={[1.5, 1.7, 0.5]}>
        <Octahedron args={[0.34]}>
          <meshStandardMaterial color="#ffffff" emissive="#8a7dff" emissiveIntensity={0.9} roughness={0.1} metalness={0.4} />
        </Octahedron>
      </Floating>
    </group>
  );
}

/**
 * Ringed planet (Saturn-style). A tilted body with an atmosphere halo and two
 * translucent ring bands that rotate at slightly different speeds, plus a point
 * light so it doubles as the scene's key light.
 */
function RingedPlanet() {
  const body = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (body.current) body.current.rotation.y += delta * 0.05;
    if (ringA.current) ringA.current.rotation.z += delta * 0.03;
    if (ringB.current) ringB.current.rotation.z -= delta * 0.018;
  });

  return (
    <group position={[3.7, 3, -7]} rotation={[0.5, 0, 0.5]}>
      {/* body */}
      <mesh ref={body}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshStandardMaterial color="#c8d0ff" emissive="#8f9dff" emissiveIntensity={0.55} roughness={0.85} metalness={0.15} />
      </mesh>

      {/* atmosphere halo */}
      <mesh scale={1.3}>
        <sphereGeometry args={[1.6, 48, 48]} />
        <meshBasicMaterial color="#aeb9ff" transparent opacity={0.12} side={THREE.BackSide} depthWrite={false} />
      </mesh>

      {/* ring bands (flat rings laid in the XZ plane of the tilted group) */}
      <mesh ref={ringA} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.1, 2.9, 96]} />
        <meshBasicMaterial color="#8ea0ff" transparent opacity={0.28} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.0, 3.35, 96]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.16} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      <pointLight color="#c9d2ff" intensity={45} distance={36} decay={2} />
    </group>
  );
}

/** Volumetric light rays fanning from the planet (additive planes). */
function LightRays() {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.z += delta * 0.02;
  });
  const rays = 7;
  return (
    <group ref={group} position={[3.5, 2.9, -6.5]}>
      {Array.from({ length: rays }).map((_, i) => (
        <mesh key={i} rotation={[0, 0, (i / rays) * Math.PI * 2]}>
          <planeGeometry args={[0.5, 12]} />
          <meshBasicMaterial
            color="#aeb9ff"
            transparent
            opacity={0.04}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Camera drift + mouse parallax + slow "breathing" dolly (infinite zoom). */
function Rig() {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3());
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;
    const px = pointer.x * 1.1;
    const py = pointer.y * 0.75;
    const breathe = Math.sin(t * 0.25) * 0.35;
    target.current.set(
      Math.sin(t * 0.1) * 0.6 + px,
      Math.cos(t * 0.12) * 0.4 + py,
      6 + breathe,
    );
    camera.position.lerp(target.current, 0.03);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function HeroScene() {
  const isDesktop = useIsDesktop();
  const starCount = isDesktop ? 2400 : 1000;
  const asteroids = isDesktop ? 14 : 7;
  const nebulaCount = isDesktop ? 1800 : 700;

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="!absolute inset-0"
    >
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 16, 40]} />

      <ambientLight intensity={0.25} />
      <directionalLight position={[-5, 4, 3]} intensity={0.6} color="#6c63ff" />

      <RingedPlanet />
      <LightRays />
      <Nebula count={nebulaCount} />
      <Starfield count={starCount} />
      <AsteroidBelt n={asteroids} />
      <FocalObjects />
      <Rig />
    </Canvas>
  );
}
