/** @format */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
    "15926671fc324092973eeb5e0d7e8356-5ab49ed98488415c98ebd4d45.fly.dev",
    "7e1629ae3bbb45039d02ca943e4cf137-426cc1e95e0949608b0629b62.fly.dev",
    "8c3b9fa43c3c4316bcbd26d40ffcf48f-93031c550c6543c98390c80ea.fly.dev",
  ],
  // Disable turbopack for now to fix build issues
  // turbopack: {
  //   // Turbopack is now stable, moved from experimental
  // },
};

export default nextConfig;
