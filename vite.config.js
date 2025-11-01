import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/habito/" : "/",
  plugins: [
    react({
      babel: { plugins: [] }, // kein React Refresh
      fastRefresh: false,     // verhindert eval()
    }),
  ],
  build: {
    minify: "terser",
    sourcemap: false,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
}));