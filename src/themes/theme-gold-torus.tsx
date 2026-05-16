import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GOLD = '#C9A84C';

// 1. Anamnese-Trainer
const AnamneseTrainerScene = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Simple latency geometry representing a torso/vase structure
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 10; i++) {
        pts.push(new THREE.Vector2(Math.sin(i * 0.3) * 0.5 + 1.2, (i - 5) * 0.8));
    }
    return pts;
  }, []);

  const latheGeo = useMemo(() => new THREE.LatheGeometry(points, 30), [points]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef} geometry={latheGeo}>
      <meshBasicMaterial color={GOLD} wireframe transparent opacity={0.3} />
    </mesh>
  );
};

// 2. Assessment Center
const AssessmentScene = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particlesCount = 600;
  const positions = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      const strand = i % 2;
      const angle = (i / particlesCount) * Math.PI * 10; // 5 full turns
      const radius = 1.5;
      const y = (i / particlesCount) * 10 - 5;
      
      positions[i * 3] = Math.cos(angle + strand * Math.PI) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle + strand * Math.PI) * radius;
    }
    return positions;
  }, []);

  const bgGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <points ref={pointsRef} geometry={bgGeo}>
      <pointsMaterial color={GOLD} size={0.05} transparent opacity={0.6} />
    </points>
  );
};

// 3. Vision Agent
const VisionScene = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime * 2;
      groupRef.current.children.forEach((child, i) => {
        child.position.y = Math.sin(t + i * Math.PI * 0.6) * 0.5;
      });
    }
  });

  return (
    <group ref={groupRef} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[(i - 1) * 2, 0, (i - 1) * 2]}>
          <cylinderGeometry args={[0.5, 0.4, 0.2, 32]} />
          <meshBasicMaterial color={GOLD} wireframe transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
};

// 4. Media Analyzer
const MediaScene = () => {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ring1.current) ring1.current.rotation.x += 0.01;
    if (ring2.current) ring2.current.rotation.y += 0.02;
    if (ring3.current) ring3.current.rotation.z += 0.015;
  });

  return (
    <group>
      <mesh ref={ring1}><torusGeometry args={[2, 0.05, 16, 100]} /><meshBasicMaterial color={GOLD} wireframe opacity={0.3} transparent /></mesh>
      <mesh ref={ring2}><torusGeometry args={[1.5, 0.05, 16, 100]} /><meshBasicMaterial color={GOLD} wireframe opacity={0.5} transparent /></mesh>
      <mesh ref={ring3}><torusGeometry args={[1, 0.05, 16, 100]} /><meshBasicMaterial color={GOLD} wireframe opacity={0.7} transparent /></mesh>
    </group>
  );
};

// 5. Educator Workspace
const EducatorScene = () => {
  const pageRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (pageRef.current) {
      // sine wave mapped to 0 to 90 degrees (Math.PI / 2)
      const angle = (Math.sin(state.clock.elapsedTime * (Math.PI * 2 / 4)) * 0.5 + 0.5) * (Math.PI / 2);
      pageRef.current.rotation.z = -angle; // Opening like a book
    }
  });

  return (
    <group rotation={[Math.PI/6, Math.PI/4, 0]}>
      {/* Back cover */}
      <mesh position={[1, 0, 0]}>
        <boxGeometry args={[2, 2.5, 0.1]} />
        <meshBasicMaterial color={GOLD} wireframe transparent opacity={0.3} />
      </mesh>
      {/* Moving cover, hinged at left edge (x=-1 relative to center) */}
      <group position={[0, 0, 0]}>
        <mesh ref={pageRef} position={[1, 0, 0]}>
          <boxGeometry args={[2, 2.5, 0.1]} />
          <meshBasicMaterial color={GOLD} wireframe transparent opacity={0.5} />
        </mesh>
      </group>
    </group>
  );
};

// 6. Intelligence Matrix
const MatrixScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  const points = useMemo(() => {
    const pts = [];
    for(let i=0; i<12; i++) {
      pts.push(new THREE.Vector3(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5
      ));
    }
    return pts;
  }, []);
  
  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    // Add indices connecting almost all of them
    const indices = [];
    for(let i=0; i<12; i++) {
      for(let j=i+1; j<12; j++) {
        if(Math.random() > 0.5) {
          indices.push(i, j);
        }
      }
    }
    geo.setIndex(indices);
    return geo;
  }, [points]);

  useFrame((state) => {
    if(groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.children.forEach((child, i) => {
        if((child as THREE.Mesh).isMesh) {
           const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.3;
           child.scale.set(scale, scale, scale);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={GOLD} />
        </mesh>
      ))}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color={GOLD} transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
};

// 7. Creative Lab
const CreativeScene = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const particlesCount = 800;

  const { pos1, pos2 } = useMemo(() => {
    const p1 = new Float32Array(particlesCount * 3);
    const p2 = new Float32Array(particlesCount * 3);
    for(let i=0; i<particlesCount; i++) {
       // Chaos
       p1[i*3] = (Math.random() - 0.5) * 10;
       p1[i*3+1] = (Math.random() - 0.5) * 10;
       p1[i*3+2] = (Math.random() - 0.5) * 10;
       // Silhouette-ish (sphere)
       const r = 2;
       const theta = Math.random() * Math.PI * 2;
       const phi = Math.acos((Math.random() - 0.5) * 2);
       p2[i*3] = r * Math.sin(phi) * Math.cos(theta);
       p2[i*3+1] = r * Math.sin(phi) * Math.sin(theta) * 1.5; // taller
       p2[i*3+2] = r * Math.cos(phi);
    }
    return { pos1: p1, pos2: p2 };
  }, []);

  const currentPos = useMemo(() => new Float32Array(particlesCount * 3), []);

  const pointGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(currentPos, 3));
    return geo;
  }, [currentPos]);

  useFrame((state) => {
    if(pointsRef.current) {
       // 0 to 1 based on sine wave (3s loop roughly)
       const lerpFactor = (Math.sin(state.clock.elapsedTime * (Math.PI / 3)) + 1) / 2;
       for(let i=0; i<particlesCount * 3; i++) {
         currentPos[i] = pos1[i] + (pos2[i] - pos1[i]) * lerpFactor;
       }
       pointsRef.current.geometry.attributes.position.needsUpdate = true;
       pointsRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <points ref={pointsRef} geometry={pointGeo}>
      <pointsMaterial color={GOLD} size={0.06} transparent opacity={0.6} />
    </points>
  );
};

// 8. Report Generator
const ReportScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if(groupRef.current) {
       const t = state.clock.elapsedTime;
       groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.2;
       const factor = (Math.sin(t) + 1) / 2; // 0 to 1
       groupRef.current.children.forEach((child, i) => {
          child.rotation.z = -factor * i * 0.3;
       });
    }
  });

  return (
    <group ref={groupRef} position={[-1, -2, 0]}>
       {[0,1,2,3,4].map(i => (
         <mesh key={i} position={[0, 2, 0]}>
           {/* Shifted so rotation point is bottom left */}
           <group position={[1.5, 2, 0]}>
              <mesh>
                 <boxGeometry args={[3, 4, 0.05]} />
                 <meshBasicMaterial color={GOLD} wireframe transparent opacity={0.5 - i*0.05} />
              </mesh>
           </group>
         </mesh>
       ))}
    </group>
  );
};

// 9. Landingpage
const LandingScene = () => {
  const torusRef = useRef<THREE.Mesh>(null);
  const waveRef = useRef<THREE.Mesh>(null);

  const curve = useMemo(() => {
    const points = [];
    for(let i=0; i<8; i++) {
       points.push(new THREE.Vector3(
          Math.cos(i/8 * Math.PI * 2) * 2,
          Math.sin(i/8 * Math.PI * 4) * 0.5,
          Math.sin(i/8 * Math.PI * 2) * 2
       ));
    }
    return new THREE.CatmullRomCurve3(points, true);
  }, []);

  const tubeGeo = useMemo(() => new THREE.TubeGeometry(curve, 64, 0.05, 8, true), [curve]);

  useFrame((state) => {
    if(torusRef.current) torusRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    if(waveRef.current) {
        waveRef.current.rotation.y = -state.clock.elapsedTime * 0.15;
        waveRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={torusRef}>
        <torusGeometry args={[2.5, 0.05, 16, 100]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.3} wireframe />
      </mesh>
      <mesh ref={waveRef} geometry={tubeGeo}>
        <meshBasicMaterial color={GOLD} transparent opacity={0.6} wireframe />
      </mesh>
    </group>
  );
};

export const GoldTorusScene = ({ toolId }: { toolId: string }) => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        {toolId === 'anamnese-trainer' && <AnamneseTrainerScene />}
        {toolId === 'assessment' && <AssessmentScene />}
        {toolId === 'vision' && <VisionScene />}
        {toolId === 'media' && <MediaScene />}
        {toolId === 'educator' && <EducatorScene />}
        {toolId === 'matrix' && <MatrixScene />}
        {toolId === 'creative' && <CreativeScene />}
        {toolId === 'report' && <ReportScene />}
        {toolId === 'landing' && <LandingScene />}
      </Canvas>
    </div>
  );
};
