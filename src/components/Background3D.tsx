import React, { useRef, useEffect, Suspense, Component, ErrorInfo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const GOLD_DARK = '#B38F2D';
const GOLD_LIGHT = '#E5BF48';

// --- ERROR BOUNDARY FOR 3D ---
class ThreeErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("3D Scene Error:", error, info);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function AnatomicalModel({ pointerPos, initialPosition }: { pointerPos: React.MutableRefObject<{ x: number, y: number }>, initialPosition: [number, number, number] }) {
  const { nodes } = useGLTF('/koerperfluss_model.glb') as any;
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    
    // Performance: Smooth interaction with high weight
    const lerpFactor = 0.05;
    const targetX = pointerPos.current.x * 0.4;
    const targetY = pointerPos.current.y * 0.25;
    const scrollParallax = (window.scrollY || 0) * 0.001;
    
    // RECTIFY ORIENTATION: Forced Standing (Vertical)
    // Most anatomical models exported from Z-up environments need this.
    // If it's lying down, 0 or Math.PI/2 is usually the fix.
    const targetRotX = (Math.PI / 2) + (-targetY * 0.3); 
    const targetRotY = (targetX + scrollParallax * 0.5);

    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetRotX, lerpFactor);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetRotY, lerpFactor);
    
    // Smooth hover motion
    ref.current.position.y = THREE.MathUtils.lerp(
        ref.current.position.y, 
        initialPosition[1] + Math.sin(t * 1.2) * 0.08 - scrollParallax * 0.3,
        lerpFactor
    );
  });

  // FOCUS ON THE HEAD (Based on original EDU merge spec)
  const geometry = nodes.mesh_4_1?.geometry || nodes.mesh_4?.geometry || nodes.mesh_2?.geometry || nodes.node_0?.geometry;

  if (!geometry) return null;

  return (
    <group ref={ref} scale={8} position={initialPosition}>
      <Center top>
        <mesh geometry={geometry}>
          <meshStandardMaterial 
            color="#ffffff"
            emissive={GOLD_DARK}
            emissiveIntensity={0.2}
            roughness={0.2}
            metalness={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>
      </Center>
    </group>
  );
}

const AbstractPremiumScene = () => {
  const pointerPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      pointerPos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerPos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('mousemove', handlePointerMove);
  }, []);

  return (
    <ThreeErrorBoundary>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} color={GOLD_LIGHT} />
      
      <Suspense fallback={null}>
        {/* SINGLE STANDING CENTERED HEAD: Close to camera (Z=3) */}
        <AnatomicalModel pointerPos={pointerPos} initialPosition={[0, -1, 3]} />
      </Suspense>

      <Environment preset="city" />
      <ContactShadows position={[0, -3, 0]} opacity={0.3} scale={15} blur={3} far={6} color="#000000" />
    </ThreeErrorBoundary>
  );
};

export const Global3DBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 10 }}>
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 40 }} 
        gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance",
            precision: "mediump"
        }}
        dpr={1} // Performance lock for mobile/stalling issues
      >
        <AbstractPremiumScene />
      </Canvas>
    </div>
  );
};
