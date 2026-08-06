import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: '/',
  plugins: [command === 'serve' ? inspectAttr() : null, react()].filter(Boolean),
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // lucide-react ships one ~300 byte module per icon, so Vite would emit a
        // separate request for every icon used across the app (tens of requests on
        // a single page). Group them into one chunk that is gzip-compressed very
        // well (< 3 KB) instead. Only the tiny `lucide-react` package is matched —
        // app and other vendored modules keep their existing tree-shaken chunks.
        manualChunks(id) {
          if (id.includes("node_modules/lucide-react")) return "lucide-icons";
          return undefined;
        },
      },
    },
  },
}));
