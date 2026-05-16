import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useLocation } from 'react-router-dom';

const GOLD = '#C9A84C';

const AbstractBodyModel = () => {
  const { rings, splines } = useMemo(() => {
    const r = [];
    const numRings = 32;
    for (let i = 0; i < numRings; i++) {
      const y = (i - numRings / 2) * 0.2;
      const radius = 0.7 + Math.sin(i * 0.25) * 0.3 + Math.cos(i * 0.1) * 0.2;
      r.push({ y, radius });
    }
    
    const s = [];
    for (let j = 0; j < 12; j++) {
      const angle = (j / 12) * Math.PI * 2;
      const points = [];
      for (let i = 0; i <= numRings; i++) {
        const y = (i - numRings / 2) * 0.2;
        const radius = 0.7 + Math.sin(i * 0.25) * 0.3 + Math.cos(i * 0.1) * 0.2;
        const twist = y * 0.3;
        points.push(new THREE.Vector3(
          Math.cos(angle + twist) * radius,
          y,
          Math.sin(angle + twist) * radius
        ));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      s.push(curve);
    }
    
    return { rings: r, splines: s };
  }, []);

  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.3, 6, 16, 32]} />
        <meshPhysicalMaterial 
           color={GOLD} 
           emissive={GOLD} 
           emissiveIntensity={0.8} 
           transmission={1} 
           roughness={0.1} 
           transparent 
           opacity={0.15} 
        />
      </mesh>
      
      {rings.map((ring, i) => (
        <mesh key={`ring-${i}`} position={[0, ring.y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[ring.radius, i % 4 === 0 ? 0.03 : 0.015, 16, 64]} />
          <meshPhysicalMaterial 
             color={GOLD}
             emissive={GOLD}
             emissiveIntensity={i % 4 === 0 ? 0.5 : 0.1}
             roughness={0.2}
             metalness={1}
             clearcoat={1}
             transparent
             opacity={0.8}
          />
        </mesh>
      ))}

      {splines.map((curve, i) => (
        <mesh key={`spline-${i}`}>
          <tubeGeometry args={[curve, 64, 0.015, 8, false]} />
          <meshBasicMaterial color={GOLD} transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
};

class ModelErrorBoundary extends React.Component<{ fallback: React.ReactNode, children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { fallback: React.ReactNode, children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.warn("Could not load 3D model, showing fallback.", error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const ExternalModel = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={[1, 1, 1]} position={[0, -1, 0]} />; // Passe Skalierung/Position nach Bedarf an
};

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

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef}>
      <latheGeometry args={[points, 30]} />
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

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
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
       const phi = Math.acos((Math.random() * 2) - 1);
       p2[i*3] = r * Math.sin(phi) * Math.cos(theta);
       p2[i*3+1] = r * Math.sin(phi) * Math.sin(theta) * 1.5; // taller
       p2[i*3+2] = r * Math.cos(phi);
    }
    return { pos1: p1, pos2: p2 };
  }, []);

  const currentPos = useMemo(() => new Float32Array(particlesCount * 3), []);

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
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={currentPos}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color={GOLD} size={0.06} transparent opacity={0.6} />
    </points>
  );
};

// 8. Case Training (Spine Anatomy - Herniated Disc)
const CaseTrainingScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  const herniationRef = useRef<THREE.Mesh>(null);
  const nerveRef = useRef<THREE.Mesh>(null);
  
  // Vertebrae positions
  const stackCount = 5;
  const spacing = 1.2;

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      // Gentle breathing/swaying motion of the whole spine
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.2;
      groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
      
      // Throbbing effect on the herniated disc & nerve
      if (herniationRef.current) {
        const throb = (Math.sin(t * 4) + 1) * 0.5; // 0 to 1
        herniationRef.current.scale.x = 1 + throb * 0.2;
        herniationRef.current.scale.z = 1 + throb * 0.2;
        (herniationRef.current.material as THREE.MeshBasicMaterial).opacity = 0.5 + throb * 0.4;
      }
      
      if (nerveRef.current) {
        const throb = (Math.sin(t * 4 + Math.PI) + 1) * 0.5; 
        (nerveRef.current.material as THREE.MeshBasicMaterial).opacity = 0.4 + throb * 0.4;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, -2.5, 0]}>
       {Array.from({ length: stackCount }).map((_, i) => {
         const yPos = i * spacing;
         const isHerniatedLevel = i === 2; // Middle disc

         return (
           <group key={i} position={[0, yPos, 0]}>
             {/* Vertebra (Wirbelkörper) */}
             <mesh position={[0, 0.4, 0]}>
               <cylinderGeometry args={[1.2, 1.1, 0.7, 32, 1]} />
               <meshBasicMaterial color={GOLD} wireframe transparent opacity={0.6} />
             </mesh>
             
             {/* Spinous process (Dornfortsatz) - simplified tail */}
             <mesh position={[0, 0.4, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
               <coneGeometry args={[0.3, 1.5, 4]} />
               <meshBasicMaterial color={GOLD} wireframe transparent opacity={0.4} />
             </mesh>

             {/* Spinal Canal (Spinalkanal) */}
             <mesh position={[0, 0.4, -0.6]}>
               <cylinderGeometry args={[0.3, 0.3, 0.7, 16]} />
               <meshBasicMaterial color={"#ffffff"} transparent opacity={0.1} />
             </mesh>

             {/* Intervertebral Disc (Bandscheibe) */}
             {i < stackCount - 1 && (
               <group position={[0, spacing * 0.5 + 0.4, 0]}>
                 <mesh>
                   <cylinderGeometry args={[1.15, 1.15, 0.3, 32]} />
                   <meshBasicMaterial color={GOLD} transparent opacity={0.3} />
                 </mesh>
                 
                 {/* Herniation & Compression at specific level */}
                 {isHerniatedLevel && (
                   <>
                     {/* The bulge (Bandscheibenvorfall) */}
                     <mesh ref={herniationRef} position={[0.7, 0, -0.6]}>
                       <sphereGeometry args={[0.4, 16, 16]} />
                       <meshBasicMaterial color={"#ff3333"} wireframe transparent opacity={0.8} />
                     </mesh>
                     
                     {/* The compressed nerve (Kompression) */}
                     <mesh ref={nerveRef} position={[1.2, 0, -0.6]} rotation={[0, 0, Math.PI / 4]}>
                       <cylinderGeometry args={[0.08, 0.08, 1.5, 16]} />
                       <meshBasicMaterial color={"#ffaa00"} transparent opacity={0.8} />
                     </mesh>
                   </>
                 )}
                 
                 {/* Normal nerves for other levels */}
                 {!isHerniatedLevel && (
                    <mesh position={[1.2, 0, -0.6]} rotation={[0, 0, Math.PI / 4]}>
                      <cylinderGeometry args={[0.08, 0.08, 1.5, 16]} />
                      <meshBasicMaterial color={GOLD} transparent opacity={0.3} />
                    </mesh>
                 )}
                 {/* Left nerve (uncompressed) */}
                 <mesh position={[-1.2, 0, -0.6]} rotation={[0, 0, -Math.PI / 4]}>
                   <cylinderGeometry args={[0.08, 0.08, 1.5, 16]} />
                   <meshBasicMaterial color={GOLD} transparent opacity={0.3} />
                 </mesh>
               </group>
             )}
           </group>
         );
       })}

       {/* Main Spinal Cord (Rückenmark) connecting all the way through */}
       <mesh position={[0, (stackCount * spacing) / 2, -0.6]}>
         <cylinderGeometry args={[0.15, 0.15, stackCount * spacing + 1, 16]} />
         <meshBasicMaterial color={GOLD} transparent opacity={0.5} />
       </mesh>
    </group>
  );
};

// 9. Landingpage
const FluidBackground = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const particlesCount = 3000;
  
  const { positions, phases } = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    const ph = new Float32Array(particlesCount);
    for (let i = 0; i < particlesCount; i++) {
      // Create a flowing organic shape with noise-like placement
      const r = 3 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() - 0.5) * 2);
      
      pos[i*3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i*3+1] = (Math.random() - 0.5) * 10;
      pos[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
      
      ph[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, phases: ph };
  }, [particlesCount]);

  useFrame((state) => {
    if (pointsRef.current) {
      const positionsAttr = pointsRef.current.geometry.attributes.position;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < particlesCount; i++) {
        // Subtle wave motion mimicking blood flow/nerves
        const x = positions[i*3];
        const z = positions[i*3+2];
        const dist = Math.sqrt(x*x + z*z);
        const yOffset = Math.sin(time + dist + phases[i]) * 0.1;
        
        positionsAttr.array[i*3+1] = positions[i*3+1] + yOffset;
      }
      positionsAttr.needsUpdate = true;
      pointsRef.current.rotation.y = time * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particlesCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={GOLD} size={0.03} transparent opacity={0.3} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
};

const LandingScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Trage hier deinen externen Link ein, sobald dein 3D-Modell (unter 30 MB oder extern gehostet) verfügbar ist:
  const externalModelUrl = null;

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      groupRef.current.rotation.y = time * 0.15;
      
      const targetX = state.pointer.y * 0.2;
      const targetY = state.pointer.x * 0.2;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.05);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -targetY, 0.05);
    }
  });

  return (
    <group>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} color={GOLD} />
      <directionalLight position={[-5, 5, 5]} intensity={0.5} color="#ffffff" />
      <pointLight position={[0, 0, 0]} intensity={2} color={GOLD} distance={5} />
      <FluidBackground />
      
      <group ref={groupRef} position={[0, -0.5, 0]}>
        <ModelErrorBoundary fallback={<AbstractBodyModel />}>
          <Suspense fallback={<AbstractBodyModel />}>
            {externalModelUrl && <ExternalModel url={externalModelUrl} />}
          </Suspense>
        </ModelErrorBoundary>
      </group>
    </group>
  );
};

export const Global3DBackground = () => {
  const location = useLocation();
  const path = location.pathname;
  
  let toolId = '';
  if (path === '/') toolId = 'landing';
  else if (path.includes('anamnese-trainer')) toolId = 'anamnese-trainer';
  else if (path.includes('assessment')) toolId = 'assessment';
  else if (path.includes('vision')) toolId = 'vision';
  else if (path.includes('analysis')) toolId = 'media';
  else if (path.includes('educator')) toolId = 'educator';
  else if (path.includes('dashboard')) toolId = 'matrix';
  else if (path.includes('labor')) toolId = 'creative';
  else if (path.includes('case-training')) toolId = 'case-training';

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{ zIndex: -1 }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} gl={{ preserveDrawingBuffer: false, powerPreference: "high-performance" }}>
        {toolId === 'anamnese-trainer' && <AnamneseTrainerScene />}
        {toolId === 'assessment' && <AssessmentScene />}
        {toolId === 'vision' && <VisionScene />}
        {toolId === 'media' && <MediaScene />}
        {toolId === 'educator' && <EducatorScene />}
        {toolId === 'matrix' && <MatrixScene />}
        {toolId === 'creative' && <CreativeScene />}
        {toolId === 'case-training' && <CaseTrainingScene />}
        {toolId === 'landing' && <LandingScene />}
      </Canvas>
    </div>
  );
};
