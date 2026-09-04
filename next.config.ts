import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async rewrites() {
    // אמא's birthday game: a static file in /public served at a clean path.
    return [{ source: "/ima", destination: "/ima.html" }];
  },
};

export default nextConfig;
