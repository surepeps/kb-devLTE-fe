/** @format */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
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
  ],
  // Disable turbopack for now to fix build issues
  // turbopack: {
  //   // Turbopack is now stable, moved from experimental
  // },
};

export default nextConfig;
