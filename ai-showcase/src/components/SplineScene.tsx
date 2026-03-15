"use client";

import { useState } from "react";
import Spline from "@splinetool/react-spline";

export default function SplineScene() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
            <span className="text-sm text-gray-500 font-mono">
              Carregando cena 3D...
            </span>
          </div>
        </div>
      )}
      <Spline
        scene="https://prod.spline.design/nMOff4Onas8mg7sm/scene.splinecode"
        onLoad={() => setIsLoading(false)}
        className="w-full h-full"
      />
    </div>
  );
}
