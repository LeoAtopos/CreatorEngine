import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 1420,
    strictPort: true,
    fs: {
      allow: [fileURLToPath(new URL("..", import.meta.url))],
    },
  },
  clearScreen: false,
  build: {
    target: "es2021",
  },
});
