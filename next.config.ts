import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["ui-avatars.com"],
    dangerouslyAllowSVG: true,
  }
};

export default nextConfig;
