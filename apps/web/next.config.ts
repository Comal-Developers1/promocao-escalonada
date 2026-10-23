import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  // basePath: "/dev-test",
  basePath: "/escalonada",
  assetPrefix: "/escalonada",

  output: "standalone",

  allowedDevOrigins: ['painelcomal.duckdns.org'],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
