/**
 * @fileoverview Type definitions related to file processing and handling
 * operations used throughout the application.
 */

/**
 * Supported file reading methods.
 */
export type FileReadMethod = 'dataURL' | 'text' | 'arrayBuffer';

/**
 * File validation error types.
 */
export type FileValidationError = 
  | 'FILE_TOO_LARGE'
  | 'INVALID_FILE_TYPE'
  | 'FILE_CORRUPTED'
  | 'UNKNOWN_ERROR';

/**
 * File processing status.
 */
export type FileProcessingStatus = 'idle' | 'processing' | 'completed' | 'error';

/**
 * File metadata interface.
 */
export interface FileMetadata {
  /** File name */
  name: string;
  /** File size in bytes */
  size: number;
  /** MIME type */
  type: string;
  /** File extension */
  extension: string;
  /** Last modified timestamp */
  lastModified: number;
}

/**
 * File processing result interface.
 */
export interface FileProcessingResult {
  /** Processing status */
  status: FileProcessingStatus;
  /** File content if successful */
  content?: string | ArrayBuffer;
  /** Error message if failed */
  error?: string;
  /** File metadata */
  metadata?: FileMetadata;
}
