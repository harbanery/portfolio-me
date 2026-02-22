"use client";

import { motion } from "framer-motion";
import { StarsBackground } from "@/components/aceternity/ui/bg-stars";
import { ShootingStars } from "@/components/aceternity/ui/shooting-stars";
import { NightOceanSimple } from "@/components/custom/animation/NightOceanSimple";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Layer 1: Night Ocean Background */}
      <div className="absolute inset-0 z-0">
        <NightOceanSimple />
      </div>

      {/* Layer 2: Background stars & shooting stars */}
      <div className="absolute inset-0 z-10">
        <StarsBackground className="pointer-events-none" />
        <ShootingStars className="pointer-events-none" />
      </div>

      {/* Layer 5: 404 Message */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center z-50 text-center px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, delay: 1, ease: "easeOut" }}
      >
        <motion.h1
          className="text-9xl md:text-8xl font-bold font-neue-haas text-white mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 1.5, type: "spring" }}
        >
          404
        </motion.h1>

        <motion.h2
          className="text-4xl font-light font-neue-haas text-white/80 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          Lost at Ocean
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl font-neue-haas text-white/60 mb-8 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
        >
          The page you're looking for seems to have drifted away in the night.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            onClick={() => router.back()}
            className="bg-white text-black px-12 py-4 rounded-none font-neue-haas text-sm font-medium tracking-wider hover:bg-gray-200 transition-colors duration-300"
          >
            GO BACK
          </button>
        </motion.div>
      </motion.div>

      {/* Layer 6: Fade-in overlay */}
      <motion.div
        className="absolute inset-0 bg-black pointer-events-none z-60"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      <style jsx>{`
        @keyframes mistDrift {
          0%,
          100% {
            opacity: 0.1;
            transform: translateX(0);
          }
          50% {
            opacity: 0.2;
            transform: translateX(20px);
          }
        }
      `}</style>

      {/* Layer 5: Atmospheric effects */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        {/* Light mist effect */}
        <div
          className="absolute bottom-20 left-0 right-0 h-32"
          style={{
            background:
              "radial-gradient(ellipse at center bottom, rgba(255, 255, 255, 0.1) 0%, transparent 60%)",
            filter: "blur(20px)",
            animation: "mistDrift 10s ease-in-out infinite",
          }}
        />

        {/* Depth haze */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48"
          style={{
            background:
              "linear-gradient(to top, rgba(0, 50, 100, 0.05) 0%, transparent)",
            filter: "blur(30px)",
          }}
        />
      </div>

      {/* 404 Message */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center z-50 text-center px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, delay: 1, ease: "easeOut" }}
      >
        <motion.h1
          className="text-9xl md:text-8xl font-bold font-neue-haas text-white mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 1.5, type: "spring" }}
        >
          404
        </motion.h1>

        <motion.h2
          className="text-4xl font-light font-neue-haas text-white/80 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          Lost at Ocean
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl font-neue-haas text-white/60 mb-8 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
        >
          The page you're looking for seems to have drifted away in the night.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            onClick={() => router.back()}
            className="bg-white text-black px-12 py-4 rounded-none font-neue-haas text-sm font-medium tracking-wider hover:bg-gray-200 transition-colors duration-300"
          >
            GO BACK
          </button>
        </motion.div>
      </motion.div>

      {/* Fade-in overlay */}
      <motion.div
        className="absolute inset-0 bg-black pointer-events-none z-60"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      <style jsx>{`
        @keyframes mistDrift {
          0%,
          100% {
            opacity: 0.1;
            transform: translateX(0);
          }
          50% {
            opacity: 0.2;
            transform: translateX(20px);
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
