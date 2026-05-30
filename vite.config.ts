// @lovable.dev/vite-tanstack-config bundles tanstackStart, viteReact, tailwindcss,
// tsConfigPaths, cloudflare (build-only), componentTagger (dev-only), VITE_* env
// injection, @ alias, dedupe, error loggers, and sandbox detection.
//
// For Vercel deployment we disable the Cloudflare plugin and add Nitro, which
// auto-detects the Vercel preset via the VERCEL env var at build time. Locally
// (without VERCEL) Nitro produces a standard Node server output, which Vercel
// also accepts.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

export default defineConfig({
  // Disable the Cloudflare Workers build plugin (was used for the previous
  // Cloudflare target). Nitro handles the server bundle instead.
  cloudflare: false,
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [nitro()],
  },
});
