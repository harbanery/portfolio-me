"use client";

import { useState, useEffect } from "react";
import { StarsBackground } from "@/components/aceternity/ui/bg-stars";
import { ShootingStars } from "@/components/aceternity/ui/shooting-stars";

const IntroSection = ({ onComplete }: { onComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);

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
        <div
          className={`transform transition-all duration-1000 ${
            isVisible ? "scale-100 opacity-100" : "scale-110 opacity-0"
          }`}
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default IntroSection;
