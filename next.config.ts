/** @format */
import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    optimizePackageImports: [
      "react-icons",
      "framer-motion",
      "lucide-react",
      "@fortawesome/react-fontawesome",
      "@fortawesome/free-solid-svg-icons",
    ],
    optimizeCss: true,
    parallelRouteGeneration: true,
  },
  compress: true,
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
    minimumCacheTTL: 31536000, // 1 year cache for optimized images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: process.env.NODE_ENV === "development",
    formats: ['image/avif', 'image/webp'],
  },
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ],
        has: [
          {
            type: 'query',
            key: '_next'
          }
        ]
      }
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };

      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        canvas: require("path").resolve(__dirname, "empty-module.js"),
      };
    }

    // Development caching optimization
    if (process.env.NODE_ENV === "development") {
      config.cache = {
        type: "filesystem",
        compression: "gzip" as const,
        name: process.env.NODE_ENV,
        managedPaths: ["node_modules"],
        buildDependencies: {
          config: [__filename],
        },
      };
    }

    return config;
  },
};

// ✅ Wrap config with bundle analyzer
export default withBundleAnalyzer(nextConfig);
