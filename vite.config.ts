import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the build runs from any static host path (GitHub Pages).
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(import.meta.dirname, "./src") },
      // The generated ui/ components import `cn` from the package; send them
      // to the instance configured with the type-scale tokens.
      {
        find: /^cn$/,
        replacement: path.resolve(import.meta.dirname, "./src/lib/utils.ts"),
      },
    ],
  },
  // Node resolves "localhost" to IPv6 (::1) first, which leaves
  // http://127.0.0.1:5173 unreachable; bind to IPv4 loopback explicitly.
  server: {
    host: "127.0.0.1",
  },
  build: {
    sourcemap: true,
  },
})
