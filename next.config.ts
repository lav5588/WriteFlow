import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {//extra
    ignoreDuringBuilds: true,
  },
  typescript: {//extra
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
