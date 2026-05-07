import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.101"],
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
