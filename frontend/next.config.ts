import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Requerido para exportación estática
  images: {
    unoptimized: true, // Requerido para exportación estática
  },
};

export default nextConfig;