import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets `ielts.localhost:3000` talk to the dev server (HMR, dev assets).
  allowedDevOrigins: ["*.localhost"],
  experimental: {
    // Two root layouts (main site + IELTS) need one shared 404 for unmatched URLs.
    globalNotFound: true,
  },
  // Research and projects are one page now.
  async redirects() {
    return [
      { source: "/research", destination: "/projects", permanent: true },
      { source: "/:lang(en|zh)/research", destination: "/:lang/projects", permanent: true },
    ];
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
