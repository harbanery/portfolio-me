"use client";

import { motion } from "framer-motion";

interface WaveProps {
  duration: number;
  opacity: number;
  color: string;
  scale: number;
  delay?: number;
}

const Wave: React.FC<WaveProps> = ({
  duration,
  opacity,
  color,
  scale,
  delay = 0,
}) => {
  return (
    <motion.div
      className="absolute bottom-0 left-0 w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      transition={{ duration: 2, delay }}
    >
      <motion.div
        className="absolute bottom-0 left-0 w-[200%] h-full"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          duration,
          ease: "linear",
          repeat: Infinity,
          delay,
        }}
        style={{ transformOrigin: "center" }}
      >
        <svg
          viewBox="0 0 1920 1080"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id={`wave-gradient-${scale}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={color} stopOpacity={opacity} />
              <stop
                offset="100%"
                stopColor={color}
                stopOpacity={opacity * 0.8}
              />
            </linearGradient>
          </defs>
          <path
            d={`M0,${540 + scale * 50} Q240,${540 + scale * 30} 480,${540 + scale * 50} T960,${540 + scale * 50} T1440,${540 + scale * 50} T1920,${540 + scale * 50} L1920,1080 L0,1080 Z`}
            fill={`url(#wave-gradient-${scale})`}
          />
          <path
            d={`M0,${540 + scale * 50} Q240,${540 + scale * 30} 480,${540 + scale * 50} T960,${540 + scale * 50} T1440,${540 + scale * 50} T1920,${540 + scale * 50} L1920,1080 L0,1080 Z`}
            fill={`url(#wave-gradient-${scale})`}
            transform="translate(1920, 0)"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
};

export const NightOceanSimple: React.FC = () => {
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #020617, #041c32, #000814)",
      }}
    >
      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />

      {/* Back Wave - Slowest */}
      <Wave duration={18} opacity={1} color="#041e42" scale={3} delay={0} />

      {/* Mid Wave */}
      <Wave duration={12} opacity={0.8} color="#0c4a6e" scale={2} delay={0.5} />

      {/* Front Wave - Fastest */}
      <Wave duration={7} opacity={0.6} color="#075985" scale={1} delay={1} />

      {/* Subtle fog layer */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 4, delay: 1 }}
        style={{
          background:
            "linear-gradient(to top, rgba(255, 255, 255, 0.1), transparent)",
          filter: "blur(40px)",
        }}
      />
    </div>
  );
};

export default NightOceanSimple;
