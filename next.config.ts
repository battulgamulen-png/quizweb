import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  env: {
    DATABASE_URL: process.env.DATABASE_URL || "",
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET || "",
  },
};

export default nextConfig;
