"use client";

import { StarsBackground } from "@/components/effects/bg-stars";
import { ShootingStars } from "@/components/effects/shooting-stars";

const RootLoading = () => {
  return (
    <div className="fixed select-none inset-0 z-50 bg-black flex items-center justify-center">
      <StarsBackground className="pointer-events-none" />
      <ShootingStars className="pointer-events-none" />

      <div className="relative">
        {/* Logo with pulsing animation */}
        <div className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Loading Logo"
            className="w-full h-full object-contain"
            style={{
              animation: "logoPulse 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      {/* Keyframes (logoPulse) live in the global stylesheet. */}
    </div>
  );
};

export default RootLoading;
