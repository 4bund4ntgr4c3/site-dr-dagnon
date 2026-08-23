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
        // Group tiny many-file packages into single requests instead of one per
        // icon/component. lucide-react alone would emit ~30 requests; react +
        // router + framer-motion dominate the main vendor chunk (~415 kB
        // before this split). Gzip compresses each grouped chunk very well.
        manualChunks(id) {
          if (id.includes("node_modules/lucide-react")) return "lucide-icons";
          if (id.includes("node_modules/framer-motion")) return "motion";
          if (id.includes("node_modules/react-router")) return "router";
          if (id.includes("node_modules/react-dom")) return "react-dom";
          if (id.includes("node_modules/react/")) return "react";
          return undefined;
        },
      },
    },
  },
}));
