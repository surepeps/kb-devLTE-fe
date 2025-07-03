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
  },
  // Fix cross-origin warnings for dev environment
  allowedDevOrigins: [
    "15926671fc324092973eeb5e0d7e8356-5ab49ed98488415c98ebd4d45.fly.dev",
  ],
  // Improve performance and reduce network issues
  experimental: {
    turbo: {
      useSwcCss: true,
    },
  },
};

export default nextConfig;
