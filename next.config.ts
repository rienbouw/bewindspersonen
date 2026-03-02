import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "www",
  trailingSlash: true,
};

export default nextConfig;
