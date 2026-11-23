import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets `ielts.localhost:3000` talk to the dev server (HMR, dev assets).
  allowedDevOrigins: ["*.localhost"],
  experimental: {
    // Two root layouts (main site + IELTS) need one shared 404 for unmatched URLs.
    globalNotFound: true,
  },
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
