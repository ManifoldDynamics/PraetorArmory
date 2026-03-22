import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["better-sqlite3", "@prisma/client", "prisma"],
};

export default nextConfig;
