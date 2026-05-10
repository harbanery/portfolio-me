/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "jfbwaakuillpudswyfkg.supabase.co",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  compress: true,
  poweredByHeader: false,
  swcMinify: true,

  // Enable production source maps for debugging (disable if not needed)
  productionBrowserSourceMaps: false,

  // Optimize for faster builds and smaller bundles
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
    reactRemoveProperties: true,
  },

  // Optimize bundle size with tree shaking
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "antd", "dayjs"],
  },
  webpack: (config, { isServer }) => {
    // Optimize chunk splitting
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        maxSize: 244000, // Split chunks larger than 244KB
        cacheGroups: {
          default: false,
          vendors: false,
          // Framework: React and React DOM
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|react-reconciler)[\\/]/,
            name: "framework",
            chunks: "all",
            priority: 40,
            enforce: true,
          },
          // UI Library: Ant Design
          antd: {
            test: /[\\/]node_modules[\\/](@ant-design|antd|rc-|@ant-design|@babel|@rc-pagination|@rc-table)[\\/]/,
            name: "antd",
            chunks: "all",
            priority: 30,
            enforce: true,
          },
          // Animation: Framer Motion & AOS
          animation: {
            test: /[\\/]node_modules[\\/](framer-motion|motion|aos)[\\/]/,
            name: "animation",
            chunks: "all",
            priority: 25,
            enforce: true,
          },
          // Utilities: Common utility libraries
          utilities: {
            test: /[\\/]node_modules[\\/](dayjs|clsx|tailwind-merge|class-variance-authority|lucide-react|@radix-ui)[\\/]/,
            name: "utilities",
            chunks: "all",
            priority: 20,
            enforce: true,
          },
          // Database & API: Supabase, Prisma
          database: {
            test: /[\\/]node_modules[\\/](@supabase|@prisma|pg)[\\/]/,
            name: "database",
            chunks: "all",
            priority: 15,
            enforce: true,
          },
          // Other vendor modules
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "all",
            priority: 10,
          },
          // Common code shared across pages
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
      config.optimization.usedExports = process.env.NODE_ENV === "production";
      config.optimization.sideEffects = false;
    }
    return config;
  },
};

export default nextConfig;
