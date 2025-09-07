/**
 * @fileoverview Custom hook for handling file reading operations with
 * support for multiple file types and error handling.
 */

import { useState, useCallback } from 'react';
import { validateFile, processFile, FileProcessingOptions } from '../utils/fileHelpers';
import { extractFileMetadata } from '../utils/fileMetadataHelpers';
import { FileMetadata } from '../types';

/**
 * Configuration options for the file reader hook.
 */
type UseFileReaderOptions = FileProcessingOptions;

/**
 * Return type for the useFileReader hook.
 */
interface UseFileReaderReturn {
  /** The current file content */
  content: string | ArrayBuffer | null;
  /** Loading state during file reading */
  isLoading: boolean;
  /** Error message if file reading fails */
  error: string | null;
  /** Function to read a file */
  readFile: (file: File) => Promise<void>;
  /** Function to clear the current content and error */
  reset: () => void;
  /** The currently selected file */
  file: File | null;
  /** File metadata if available */
  metadata: FileMetadata | null;
}

/**
 * Custom hook for reading files with various options and error handling.
 * Supports reading files as data URLs, text, or array buffers.
 * 
 * @param options - Configuration options for file reading
 * @returns Object containing file content, loading state, and utility functions
 */
export const useFileReader = (options: UseFileReaderOptions = {}): UseFileReaderReturn => {
  const {
    readAs = 'dataURL',
    maxSize = 10 * 1024 * 1024, // 10MB default
    acceptedTypes = []
  } = options;

  const [content, setContent] = useState<string | ArrayBuffer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);

  /**
   * Validates a file using the pure validation utility.
   * @param file - The file to validate
   * @returns True if valid, false otherwise
   */
  const validateFileWithState = useCallback((file: File): boolean => {
    const validation = validateFile(file, { maxSize, acceptedTypes });
    if (!validation.isValid) {
      setError(validation.error || 'File validation failed');
      return false;
    }
    return true;
  }, [maxSize, acceptedTypes]);

  /**
   * Reads a file using the pure file processing utility.
   * @param file - The file to read
   */
  const readFile = useCallback(async (file: File): Promise<void> => {
    setError(null);
    setIsLoading(true);

    if (!validateFileWithState(file)) {
      setIsLoading(false);
      return;
    }

    setFile(file);
    setMetadata(extractFileMetadata(file));

    try {
      const result = await processFile(file, { readAs, maxSize, acceptedTypes });
      setContent(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setContent(null);
    } finally {
      setIsLoading(false);
    }
  }, [readAs, maxSize, acceptedTypes, validateFileWithState]);

  /**
   * Resets the hook state to initial values.
   */
  const reset = useCallback(() => {
    setContent(null);
    setError(null);
    setFile(null);
    setMetadata(null);
    setIsLoading(false);
  }, []);

  return {
    content,
    isLoading,
    error,
    readFile,
    reset,
    file,
    metadata
  };
};
