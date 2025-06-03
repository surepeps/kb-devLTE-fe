/** @format */

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: 'www.res.cloudinary.com',
      pathname: '/**',
    },
  ],
  },
};

export default nextConfig;
