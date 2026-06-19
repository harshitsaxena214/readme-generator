"use client";

import { Suspense, lazy } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

interface SplineSceneProps {
  scene: string;
  className?: string;
}

function SplineLoadingFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-border-warm opacity-30" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-accent-gold" />
        </div>
        <p className="text-sm text-text-muted animate-gold-pulse">Loading 3D scene...</p>
      </div>
    </div>
  );
}

export function SplineScene({ scene, className = "" }: SplineSceneProps) {
  return (
    <Suspense fallback={<SplineLoadingFallback />}>
      <div className={`h-full w-full ${className}`}>
        <Spline scene={scene} />
      </div>
    </Suspense>
  );
}
