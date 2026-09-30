import React, { useRef, useEffect, Suspense, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
// REAKTIVIERT (30.09.2026, Abend): Der Vormittags-Fix war fachlich falsch —
// @react-three/drei 9.122 exportiert useGLTF sehr wohl (belegt:
// node_modules/@react-three/drei/index.js -> export { Gltf, useGLTF }).
// Das goldene Anatomie-Modell ist wieder Teil der Landing-Szene.
import { useGLTF, Environment, Float, Sphere, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useLocation } from 'react-router-dom';

const GOLD = '#D4AF37';
const GOLD_LIGHT = '#E5BF48';
const GOLD_DARK = '#B38F2D';

// PLATZIERUNGS-FIX (30.09.2026, Nacht): Das Modell ist für die STARTSEITEN-Komposition
// gebaut (zentraler Anker zwischen CAMPUS/FAKULTÄT). Auf Unterseiten verdeckte es
// Headlines — dort steht es jetzt dezent rechts-unten, kleiner und über CSS-Opacity
// des Canvas-Wrappers als Hintergrund. Startseite bleibt exakt der 17.09.-Zustand.
function AnatomicalModel({ pointerPos, home = true }: { pointerPos: React.MutableRefObject<{ x: number, y: number }>; home?: boolean }) {
  // Load the authentic Körperfluss Full-Body Anatomical 3D Model
  const { nodes } = useGLTF('/koerperfluss_model.glb') as any;
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const scrollParallax = (window.scrollY || 0) * 0.001;
    
    // Smooth target rotation based on mouse
    const targetX = pointerPos.current.x * 0.3;
    const targetY = pointerPos.current.y * 0.3;
    
    // Authentic Körperfluss 3D model with ergonomic right-offset
    if (ref.current) {
      const isWide = typeof window !== 'undefined' && window.innerWidth >= 1280;
      const targetBaseX = isWide ? 2.4 : 1.0;
      ref.current.position.x += (targetBaseX - ref.current.position.x) * 0.05;
      ref.current.rotation.y += (targetX - ref.current.rotation.y + scrollParallax * 0.5) * 0.05;
      ref.current.rotation.x += (-targetY - ref.current.rotation.x) * 0.05;
      ref.current.position.y = -0.65 + Math.sin(t * 1.5) * 0.04 - scrollParallax * 0.15;
    }
  });

  // FIX A1: Die GLB-Rohgeometrie ist unnormalisiert (~65.000 Einheiten Spannweite,
  // int16-Scan-Export). Der Node-Transform (scale 0.567) geht beim direkten
  // geometry-Zugriff verloren → Kamera (Sichtbereich ~5,8 Einheiten) hing IM Modell.
  // Hier: zentrieren + explizit auf definierte Weltgröße normalisieren.
  const modelGeometry = React.useMemo(() => {
    const src = nodes?.node_0?.geometry
      ?? (() => {
        const foundKey = Object.keys(nodes || {}).find(key => nodes[key]?.geometry);
        return foundKey ? nodes[foundKey].geometry : null;
      })();
    if (!src) return null;
    try {
      const geom = src.clone();
      geom.computeBoundingBox();
      if (!geom.boundingBox) return null;
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      geom.boundingBox.getSize(size);
      geom.boundingBox.getCenter(center);
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const TARGET = 4.0; // Welteinheiten ≈ 75 % der sichtbaren Kamera-Höhe (fov 45, z=7)
      geom.translate(-center.x, -center.y, -center.z);
      const s = TARGET / maxDim;
      geom.scale(s, s, s);
      return geom;
    } catch {
      return null;
    }
  }, [nodes]);

  if (!modelGeometry) return null;

  return (
    <group ref={ref} position={home ? [0, -0.65, 0] : [2.7, -1.0, 0]} scale={home ? 1 : 0.7}>
      <mesh
        geometry={modelGeometry}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        receiveShadow
      >
        {/* FIX D3+UX: sichtbares Gold-Glas statt unsichtbarem Klarglas —
            transmission 0.92 auf schwarzem BG = optisch nicht existent */}
        <meshStandardMaterial color="#d4af37" emissive="#8a6d1f" emissiveIntensity={0.55} metalness={0.85} roughness={0.3} />
      </mesh>
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
    groupRef.current.position.y += (-0.8 - targetY - groupRef.current.position.y) * 0.05;
    
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

const AbstractPremiumScene = ({ home = true }: { home?: boolean }) => {
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
        {/* FIX B1: Environment MUSS innerhalb von Suspense hängen — preset="city" lädt
            ein HDR von einem externen CDN. Außerhalb von Suspense hat das Suspendieren
            die ganze App in den „System-Fehler"-Screen gerissen (Chrome-CDN-Blockade). */}
        {/* Anatomie-Modell WIEDER AKTIV (30.09. Abend) — zusammen mit den Orbit-Ringen */}
        <AnatomicalModel pointerPos={pointerPos} home={home} />
        <AnimatedLogoRings pointerPos={pointerPos} />
        <Environment preset="city" />
      </Suspense>

      <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2} far={4} color="#000000" />
    </>
  );
};

// FIX B2: Guard um den Canvas — ein Fehler in der 3D-Szene (WebGL-Verlust,
// CDN-Fehler, Treiber-Problem) darf NIE mehr die ganze App in den
// „System-Fehler"-Screen werfen, sondern fällt auf das CSS-Grid zurück.
class CanvasGuard extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  constructor(props: any) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err: Error) { console.warn('3D background disabled after error:', err); }
  render() { return this.state.failed ? null : this.props.children; }
}

export const Global3DBackground = () => {
  const location = useLocation();
  // Startseite = originale Modell-Komposition (17.09.); Unterseiten = dezenter Hintergrund
  const isHome = location.pathname === '/';
  const [show3D, setShow3D] = React.useState(() => {
    const stored = localStorage.getItem('show3D');
    if (stored === null) return true; // Default to active
    return stored === 'true';
  });
  const [isDesktop, setIsDesktop] = React.useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
  // A11Y (WCAG 2.3.3): Bei „Bewegung reduzieren" (prefers-reduced-motion) keine animierte
  // 3D-Szene (Partikel/Ring-Rotation) rendern — stattdessen das statische Grid.
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  React.useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    // REVIEW-FIX (30.09.2026): MediaQueryList EINMAL cachen und add/remove auf
    // derselben Referenz aufrufen — ein zweites matchMedia() liefert ein neues
    // Objekt, auf dem removeEventListener wirkungslos wäre.
    window.addEventListener('resize', handleResize);
    let mql: MediaQueryList | null = null;
    const handleMotionPreference = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    if (typeof window.matchMedia === 'function') {
      mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      mql.addEventListener('change', handleMotionPreference);
    }
    return () => {
      window.removeEventListener('resize', handleResize);
      mql?.removeEventListener('change', handleMotionPreference);
    };
  }, []);

  React.useEffect(() => {
    const handleToggle = (e: any) => {
      const active = e.detail?.active ?? (localStorage.getItem('show3D') === 'true');
      setShow3D(active);
    };
    window.addEventListener('toggle-3d-bg', handleToggle);
    return () => window.removeEventListener('toggle-3d-bg', handleToggle);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1, opacity: isHome ? 1 : 0.3, transition: 'opacity 0.5s ease' }}>
      {show3D && isDesktop && !prefersReducedMotion ? (
        <CanvasGuard>
          <Canvas
            camera={{ position: [0, 0, 7], fov: 45 }}
            dpr={[1, 1.75]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            <AbstractPremiumScene home={isHome} />
          </Canvas>
        </CanvasGuard>
      ) : (
        /* 🏫 HELE DISTRACTION-FREE FH KREMS / ST. PÖLTEN UNIVERSITY CHARTING GRID */
        <div className="absolute inset-0 bg-[#040404] transition-colors duration-1000">
          {/* Subtle medical grid cells */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(212,175,55,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,175,55,0.01)_1px,transparent_1px)] bg-[size:15rem_15rem] border-t border-white/[0.02]" />
          
          {/* Ambient scientific auroras */}
          <div className="absolute top-[10%] right-[10%] w-[30vw] h-[30vw] min-w-[300px] bg-brand-primary/[0.03] rounded-full blur-[180px] pointer-events-none" />
          <div className="absolute bottom-[20%] left-[5%] w-[40vw] h-[40vw] min-w-[350px] bg-amber-500/[0.015] rounded-full blur-[200px] pointer-events-none" />
        </div>
      )}
    </div>
  );
};


// REAKTIVIERT (30.09.2026, Abend): Preload zurück — das Modell gehört zur Szene,
// der frühere Load soll nicht erst nach dem ersten Frame starten.
useGLTF.preload('/koerperfluss_model.glb');
