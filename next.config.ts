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
    // Add timeout and retry settings for external images
    dangerouslyAllowSVG: false,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Reduce timeout to fail faster instead of hanging
    imageSizeLimit: 8192,
  },
  // Fix cross-origin warnings for dev environment
  allowedDevOrigins: [
    "15926671fc324092973eeb5e0d7e8356-5ab49ed98488415c98ebd4d45.fly.dev",
    "7e1629ae3bbb45039d02ca943e4cf137-426cc1e95e0949608b0629b62.fly.dev",
  ],
  // Improve performance and reduce network issues
  turbopack: {
    // Turbopack is now stable, moved from experimental
  },
};

export default nextConfig;
