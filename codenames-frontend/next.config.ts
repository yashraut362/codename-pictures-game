import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["media.istockphoto.com","plus.unsplash.com","images.unsplash.com"],
  },
};

export default nextConfig;
