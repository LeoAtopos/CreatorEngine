import { fileURLToPath, URL } from "node:url";
import { copyFile } from "node:fs/promises";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  publicDir: false,
  plugins: [
    react(),
    {
      name: "creator-engine-static-guide",
      apply: "build",
      async closeBundle() {
        await copyFile(
          fileURLToPath(new URL("../public/creator-engine-intro.html", import.meta.url)),
          fileURLToPath(new URL("./dist/creator-engine-intro.html", import.meta.url)),
        );
      },
    },
  ],
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
