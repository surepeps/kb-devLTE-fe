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

    // Alias heavy native modules to empty stubs in the browser to avoid bundling errors
    if (!isServer) {
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        canvas: require('path').resolve(__dirname, 'empty-module.js'),
      };
    }

    return config;
  },
};

export default nextConfig;
