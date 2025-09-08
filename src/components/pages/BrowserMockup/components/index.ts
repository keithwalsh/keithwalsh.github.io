/**
 * @fileoverview Barrel exports for all components in the application including
 * BrowserWindow, FileUploader, and error boundary components.
 */

export { default as BrowserWindow } from './BrowserWindow'
export { default as FileUploader, InstructionsCard } from './FileUploader'
export { ErrorBoundary, SectionErrorBoundary } from './ErrorBoundary'
