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
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
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
