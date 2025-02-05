/**
 * @fileoverview TypeScript declaration file that provides type definitions for
 * Vite-specific environment variables and imports.
 */

/// <reference types="vite/client" />

declare module '*.json' {
    const value: any
    export default value
}
