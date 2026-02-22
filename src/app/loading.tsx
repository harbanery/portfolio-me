"use client";

import { StarsBackground } from "@/components/aceternity/ui/bg-stars";
import { ShootingStars } from "@/components/aceternity/ui/shooting-stars";

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

        {/* Circular orbit with white/gray neon glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="absolute w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80"
            viewBox="0 0 100 100"
          >
            {/* Create radial gradient for circular flow effect */}
            <defs>
              <filter id="neonGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <radialGradient id="circularOpacityFlow">
                <stop offset="0%" stopColor="white" stopOpacity="0.5" />
                <stop offset="25%" stopColor="white" stopOpacity="0.3" />
                <stop offset="50%" stopColor="white" stopOpacity="0.3" />
                <stop offset="75%" stopColor="white" stopOpacity="0.3" />
                <stop offset="100%" stopColor="white" stopOpacity="0.3" />
                <animateTransform
                  attributeName="gradientTransform"
                  type="rotate"
                  from="0 50 50"
                  to="360 50 50"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </radialGradient>

              <filter id="dotGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Single orbit circle with radial gradient flow */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#circularOpacityFlow)"
              strokeWidth="0.5"
              filter="url(#neonGlow)"
            />

            {/* Glowing dot moving along orbit line */}
            <circle cx="90" cy="50" r="2" fill="white" filter="url(#dotGlow)">
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      </div>

      <style jsx>{`
        @keyframes logoPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(0.9);
            opacity: 0.7;
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes orbitRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default RootLoading;
