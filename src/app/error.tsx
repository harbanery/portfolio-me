"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

const RootError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950">
      {/* Error Message */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center z-50 text-center px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, delay: 1, ease: "easeOut" }}
      >
        <motion.h1
          className="text-6xl md:text-8xl font-bold font-neue-haas text-white mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 1.5, type: "spring" }}
        >
          Error
        </motion.h1>

        <motion.h2
          className="text-2xl md:text-4xl font-light font-neue-haas text-white/80 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          Something Went Wrong
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl font-neue-haas text-white/60 mb-8 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
        >
          An unexpected error occurred. Please try again later.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            onClick={reset}
            className="bg-white text-black px-12 py-4 rounded-none font-neue-haas text-sm font-medium tracking-wider hover:bg-gray-200 transition-colors duration-300"
          >
            TRY AGAIN
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

      {/* Atmospheric effects */}
      <div className="absolute inset-0 z-50 pointer-events-none">
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
    </div>
  );
};

export default RootError;
