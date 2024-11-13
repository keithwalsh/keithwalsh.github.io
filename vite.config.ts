/**
 * @fileoverview Vite configuration for React application with source maps enabled
 * and custom build output directory. Uses React plugin and sets base URL for
 * GitHub Pages deployment.
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/website/',
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})