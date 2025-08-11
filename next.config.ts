/** @format */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore build errors to prevent clientReferenceManifest issues
    ignoreBuildErrors: false,
  },
  // Optimize for faster compilation and prevent memory issues
  experimental: {
    optimizePackageImports: ['react-icons', 'framer-motion', 'lucide-react'],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.res.cloudinary.com",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: false,
    // Add timeout and error handling
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Reduce timeout to prevent hanging
    unoptimized: process.env.NODE_ENV === "development", // Skip optimization in dev to avoid timeouts
  },
  // Fix cross-origin warnings for dev environment
  allowedDevOrigins: [
    "e7d15a9216da4885bec59cd01458be4a-6845b121add241b5a73be3ac1.fly.dev",
    "*.fly.dev",
  ],
  // Disable turbopack for now to fix build issues
  // turbopack: {
  //   // Turbopack is now stable, moved from experimental
  // },
  // Add minimal webpack configuration
  webpack: (config, { isServer }) => {
    // Prevent client/server mismatch issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }

    // Optimize for faster builds and prevent memory issues
    config.optimization = {
      ...config.optimization,
      sideEffects: false,
    };

    return config;
  },
};

export default nextConfig;
