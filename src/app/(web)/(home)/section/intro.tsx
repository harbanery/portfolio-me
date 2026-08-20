"use client";

import { useState, useEffect } from "react";
import { StarsBackground } from "@/components/effects/bg-stars";
import { ShootingStars } from "@/components/effects/shooting-stars";
import Lottie from "react-lottie";

const IntroSection = ({ onComplete }: { onComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isPlaying] = useState(true);

  // Simple zoom-in animation data
  const zoomInAnimation = {
    v: "5.5.7",
    meta: { g: "LottieFiles AE ", a: "", k: "", d: "", tc: "" },
    fr: 29.9700012207031,
    ip: 0,
    op: 30,
    w: 1920,
    h: 1080,
    nm: "Comp 1",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "logo",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [960, 540, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              { t: 0, s: [0, 0, 100], e: [100, 100, 100] },
              { t: 15, s: [100, 100, 100], e: [100, 100, 100] }
            ]
          }
        },
        ao: 0,
        shapes: [
          {
            ty: "rc",
            d: 1,
            s: { a: 0, k: [200, 200] },
            p: { a: 0, k: [0, 0] },
            r: { a: 0, k: 0 }
          }
        ],
        ip: 0,
        op: 30,
        st: 0
      }
    ]
  };

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: zoomInAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet"
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <StarsBackground className="pointer-events-none" />
      <ShootingStars className="pointer-events-none" />
      <div className="text-center">
        <div className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64">
          <Lottie
            options={defaultOptions}
            height="100%"
            width="100%"
            isStopped={!isPlaying}
            isPaused={!isPlaying}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-full h-full object-contain"
              style={{
                animation: isVisible ? 'zoomIn 1s ease-out' : 'zoomOut 0.5s ease-in'
              }}
            />
          </div>
        </div>
      </div>
      {/* Keyframes (zoomIn/zoomOut) live in the global stylesheet. */}
    </div>
  );
};

export default IntroSection;
