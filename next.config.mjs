/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com"
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com"
      },
      {
        protocol: "https",
        hostname: "jfbwaakuillpudswyfkg.supabase.co"
      }
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },
  compress: true,
  poweredByHeader: false,
  swcMinify: true,

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: true
  },
  webpack: (config, { isServer }) => {
    // Optimize chunk splitting
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            enforce: true
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true
          },
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'framework',
            chunks: 'all',
            priority: 20,
            enforce: true
          }
        }
      };
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }
    return config;
  }
};

export default nextConfig;
