import type { NextConfig } from "next";

// Static export: the built site is plain files in ./out — served by Cloudflare
// Workers static assets (see wrangler.jsonc). No server runtime needed; the only
// dynamic part (the feedback form + community list) talks to Supabase directly
// from the browser with the anon key, protected by RLS.
const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
