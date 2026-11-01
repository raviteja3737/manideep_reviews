import type { NextConfig } from "next";

// Static export: the built site is plain files in ./out — served by Cloudflare
// Workers static assets (see wrangler.jsonc). No server runtime needed; the only
// dynamic part (the feedback form + community list) talks to the same-origin
// Worker API (/api/feedback), which writes to Cloudflare D1.
const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
