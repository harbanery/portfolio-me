"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { StarsBackground } from "@/components/effects/bg-stars";
import { ShootingStars } from "@/components/effects/shooting-stars";

/**
 * Intro splash — the logo zooms in on a starfield, then zooms out and
 * hands off to the hero. The logo animation runs on plain CSS keyframes
 * (`zoomIn` / `zoomOut` in the global stylesheet); no animation library
 * involved.
 */
/**
 * sessionStorage flag marking the intro as played for this visit. The hero
 * reads it on mount to skip the splash for repeat visitors within the same
 * session, keeping the LCP of return navigations instant.
 */
export const INTRO_SHOWN_KEY = "introShown";

/** True when this session already saw the intro (client only). */
export const hasIntroBeenShown = (): boolean => {
  try {
    return sessionStorage.getItem(INTRO_SHOWN_KEY) === "1";
  } catch {
    return false;
  }
};

/** Mark the intro as played for this session (client only). */
export const markIntroShown = (): void => {
  try {
    sessionStorage.setItem(INTRO_SHOWN_KEY, "1");
  } catch {
    // Storage unavailable (privacy mode, quota) — the intro just plays.
  }
};

const IntroSection = ({ onComplete }: { onComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    markIntroShown();
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
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              priority
              sizes="(max-width: 640px) 128px, (max-width: 768px) 192px, 256px"
              className="object-contain"
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
