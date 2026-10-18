import fs from "fs"
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

import { siteConfig } from "./src/config/site"

// public/ files an offline build still needs: icons, the hash-route redirect
// and the og:image. Anything else (the CV, the weather CSVs) is left out.
const offlinePublicFiles = new Set([
  "404.html",
  "apple-touch-icon.png",
  "favicon-96x96.png",
  "favicon.ico",
  "favicon.svg",
  "photo.jpg",
  "site.webmanifest",
  "web-app-manifest-192x192.png",
  "web-app-manifest-512x512.png",
])

/**
 * The kill switch behind `siteConfig.online`. Offline, index.html boots
 * src/maintenance.tsx instead of the app, so no app code is bundled, and the
 * build drops every public/ file not listed above.
 */
function maintenanceMode(): Plugin {
  let outDir = ""
  let publicDir = ""
  return {
    name: "maintenance-mode",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
      publicDir = config.publicDir
    },
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        if (siteConfig.online) return html
        if (!html.includes("/src/main.tsx")) {
          throw new Error("maintenance-mode: no /src/main.tsx in index.html")
        }
        return html.replace("/src/main.tsx", "/src/maintenance.tsx")
      },
    },
    closeBundle() {
      if (siteConfig.online || !publicDir) return
      for (const name of fs.readdirSync(publicDir)) {
        if (offlinePublicFiles.has(name)) continue
        fs.rmSync(path.join(outDir, name), { recursive: true, force: true })
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the build runs from any static host path (GitHub Pages).
  base: "./",
  plugins: [react(), tailwindcss(), maintenanceMode()],
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
