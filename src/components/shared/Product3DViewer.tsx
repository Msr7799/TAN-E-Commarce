"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  useTexture,
  PresentationControls,
  Float,
  ContactShadows,
  Html,
} from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";
import { RotateCcw, ZoomIn, ZoomOut, Maximize2, X } from "lucide-react";

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────
interface Product3DViewerProps {
  frontTextureUrl?: string;
  backTextureUrl?: string;
  liquidColor?: string;
  productName?: string;
  height?: number;
  onClose?: () => void;
}

// ─────────────────────────────────────────────────────────
// 3D Model Component
// ─────────────────────────────────────────────────────────
function Model({ autoRotate, textureUrl }: { autoRotate: boolean; textureUrl?: string }) {
  const modelRef = useRef<THREE.Group>(null);

  // تحميل النموذج
  const { scene } = useGLTF("/white_mesh.glb");
  // تحميل الخامات
  const [frontTexture] = useTexture([textureUrl || "/red-front-removebg.png"]);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshStandardMaterial({
          map: frontTexture,
          transparent: true,
          side: THREE.DoubleSide,
          roughness: 0.3,
          metalness: 0.1,
        });
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene, frontTexture]);

  useFrame((_, delta) => {
    if (autoRotate && modelRef.current) {
      modelRef.current.rotation.y += delta * 0.4;
    }
  });

  return <primitive ref={modelRef} object={scene} scale={2} />;
}

// ─────────────────────────────────────────────────────────
// Scene & Lighting
// ─────────────────────────────────────────────────────────
function Scene({ autoRotate, textureUrl }: { autoRotate: boolean; textureUrl?: string }) {
  return (
    <>
      {/* إضاءة مستقرة بدلاً من Environment لمنع أخطاء الشبكة */}
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={2.5} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={1.5} />

      <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={4} blur={2.5} far={3} />

      <PresentationControls
        global
        snap={true}
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 5, Math.PI / 5]}
        azimuth={[-Infinity, Infinity]}
        speed={1.2}
      >
        <Float speed={1.2} rotationIntensity={0} floatIntensity={0.3}>
          <Model autoRotate={autoRotate} textureUrl={textureUrl} />
        </Float>
      </PresentationControls>
    </>
  );
}

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────
function LoadingSpinner() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-red-800/30 border-t-red-700" />
        <p className="text-xs tracking-widest text-stone-400 uppercase">جارٍ التحميل</p>
      </div>
    </Html>
  );
}

function CameraController({ zoom }: { zoom: number }) {
  const { camera } = useThree();
  useFrame(() => {
    (camera as THREE.PerspectiveCamera).position.z +=
      (zoom - (camera as THREE.PerspectiveCamera).position.z) * 0.08;
  });
  return null;
}

// ─────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────
export default function Product3DViewer({
  frontTextureUrl,
  backTextureUrl,
  liquidColor = "#8B1A1A",
  productName = "المنتج",
  height = 520,
  onClose,
}: Product3DViewerProps) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoom, setZoom] = useState(5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleZoomIn = () => setZoom((z) => Math.max(z - 0.8, 2.5));
  const handleZoomOut = () => setZoom((z) => Math.min(z + 0.8, 8));
  const handleReset = () => {
    setZoom(5);
    setAutoRotate(true);
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full overflow-hidden rounded-none bg-gradient-to-b from-[#f4f2ef] to-[#ede9e3] select-none"
      style={{ height: isFullscreen ? "100vh" : height }}
    >
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 pt-4 pb-2">
        <div>
          <p className="text-[10px] tracking-[0.2em] text-stone-400 uppercase">عرض ثلاثي الأبعاد</p>
          <p className="mt-0.5 text-sm font-semibold tracking-wide text-stone-700">{productName}</p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/90 p-2 text-stone-600 transition hover:text-red-700"
            aria-label="Close 3D view"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <Canvas
        shadows
        camera={{ position: [0, 0, zoom], fov: 38 }}
        onPointerDown={() => setAutoRotate(false)}
        className="h-full w-full"
        style={{ touchAction: "none" }}
      >
        <CameraController zoom={zoom} />
        <Suspense fallback={<LoadingSpinner />}>
          <Scene autoRotate={autoRotate} textureUrl={frontTextureUrl} />
        </Suspense>
      </Canvas>

      <div className="absolute inset-x-0 bottom-5 z-10 flex items-center justify-center gap-2">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white/80 px-3 py-2 text-[11px] tracking-wider text-stone-600 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-red-700"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">إعادة</span>
        </button>
        <button
          onClick={handleZoomIn}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white/80 text-stone-600 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-red-700"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white/80 text-stone-600 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-red-700"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={toggleFullscreen}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white/80 text-stone-600 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-red-700"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
