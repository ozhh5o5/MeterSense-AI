import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: "standalone",
  outputFileTracingIncludes: {
    "/*": ["./prisma/metersense.db", "./public/geo/**/*"],
  },
};

export default nextConfig;
