import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // "require-corp" blocks WebContainer preview iframes — use credentialless instead
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
          { key: "Cross-Origin-Opener-Policy",   value: "same-origin"  },
        ],
      },
    ];
  },

  // Silence the Chrome DevTools probe — harmless 404s from Chrome DevTools
  async rewrites() {
    return [
      {
        source: "/.well-known/appspecific/com.chrome.devtools.json",
        destination: "/api/devtools-stub",
      },
    ];
  },

  serverExternalPackages: [
    "better-sqlite3",
    "mongoose",
    "groq-sdk",
  ],
};

export default nextConfig;