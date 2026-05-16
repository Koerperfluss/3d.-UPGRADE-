import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center, Environment, Float, Sphere, MeshTransmissionMaterial, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const GOLD = '#D4AF37';
const GOLD_LIGHT = '#E5BF48';
const GOLD_DARK = '#B38F2D';

function AnatomicalModel({ pointerPos }: { pointerPos: React.MutableRefObject<{ x: number, y: number }> }) {
  // We use the open source LeePerrySmith head scan as the anatomical figure
  const { nodes } = useGLTF('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb') as any;
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    
    // Smooth target rotation based on mouse
    const targetX = pointerPos.current.x * 0.3;
    const targetY = pointerPos.current.y * 0.3;
    
    ref.current.rotation.y += (targetX - ref.current.rotation.y) * 0.05;
    ref.current.rotation.x += (-targetY - ref.current.rotation.x) * 0.05;
    
    // Subtle breathing/floating
    ref.current.position.y = Math.sin(t * 1.5) * 0.05;
  });

  return (
    <group ref={ref} scale={0.8} position={[0, -1, 0]}>
      <Center>
        <mesh geometry={nodes.mesh_4_1?.geometry || nodes.mesh_4?.geometry || nodes.mesh_2?.geometry || nodes[Object.keys(nodes).find(key => nodes[key]?.geometry) as string]?.geometry}>
          <MeshTransmissionMaterial 
            backside
            backsideThickness={5}
            thickness={2}
            roughness={0.05}
            transmission={1}
            ior={1.5}
            chromaticAberration={0.04}
            anisotropy={0.1}
            color="#ffffff"
            emissive={GOLD_DARK}
            emissiveIntensity={0.1}
          />
        </mesh>
      </Center>
    </group>
  );
}

function AnimatedLogoRings({ pointerPos }: { pointerPos: React.MutableRefObject<{x: number, y: number}> }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const targetX = pointerPos.current.x * -0.15;
    const targetY = pointerPos.current.y * -0.15;
    
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.05;
    groupRef.current.position.y += (-targetY - groupRef.current.position.y) * 0.05;
    
    groupRef.current.rotation.z -= delta * 0.1;
    groupRef.current.rotation.x += delta * 0.05;
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.2, 0.02, 32, 100]} />
          <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.5} roughness={0.2} metalness={1} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={0.85}>
          <torusGeometry args={[3.2, 0.015, 32, 100]} />
          <meshStandardMaterial color={GOLD_LIGHT} emissive={GOLD} emissiveIntensity={0.8} roughness={0.1} metalness={1} />
        </mesh>
      </Float>
      <Particles />
    </group>
  );
}

function Particles() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = 50;
  
  useEffect(() => {
    if (!ref.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 3 + Math.random() * 1.5;
      
      dummy.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const scale = 0.2 + Math.random() * 0.8;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      ref.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <instancedMesh ref={ref} args={[null as any, null as any, count]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color={GOLD_LIGHT} toneMapped={false} />
    </instancedMesh>
  );
}

const AbstractPremiumScene = () => {
  const scrollY = useRef(0);
  const pointerPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };
    
    const handlePointerMove = (e: MouseEvent) => {
      pointerPos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerPos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handlePointerMove);
    };
  }, []);

  return (
    <>
      <ambientLight intensity={0.2} color="#ffffff" />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color={GOLD_LIGHT} />
      <pointLight position={[-10, -10, -5]} intensity={1} color="#ffffff" />
      
      <Suspense fallback={
        <Sphere args={[1, 32, 32]}><meshStandardMaterial color={GOLD} wireframe /></Sphere>
      }>
        <AnatomicalModel pointerPos={pointerPos} />
        <AnimatedLogoRings pointerPos={pointerPos} />
      </Suspense>

      <Environment preset="city" />
      <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2} far={4} color="#000000" />
    </>
  );
};

export const Global3DBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      <Canvas 
        camera={{ position: [0, 0, 7], fov: 45 }} 
        gl={{ antialias: true, alpha: true }}
      >
        <AbstractPremiumScene />
      </Canvas>
    </div>
  );
};

