/**
 * @fileoverview Pure utility functions for extracting and processing file
 * metadata information.
 */

import { FileMetadata } from '../types';
import { getFileExtension, formatFileSize } from './fileHelpers';

/**
 * Extracts metadata from a File object.
 * Pure function that creates a metadata object from file properties.
 * 
 * @param file - The file to extract metadata from
 * @returns File metadata object
 */
export const extractFileMetadata = (file: File): FileMetadata => {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    extension: getFileExtension(file.name),
    lastModified: file.lastModified
  };
};

/**
 * Creates a human-readable file summary.
 * Pure function for generating file information strings.
 * 
 * @param metadata - File metadata object
 * @returns Human-readable file summary
 */
export const createFileSummary = (metadata: FileMetadata): string => {
  const { name, size, type } = metadata;
  const sizeStr = formatFileSize(size);
  return `${name} (${sizeStr}, ${type})`;
};

/**
 * Checks if a file is considered large based on size threshold.
 * Pure function for size classification.
 * 
 * @param metadata - File metadata object
 * @param threshold - Size threshold in bytes (default: 5MB)
 * @returns True if file is large, false otherwise
 */
export const isLargeFile = (metadata: FileMetadata, threshold = 5 * 1024 * 1024): boolean => {
  return metadata.size > threshold;
};

/**
 * Groups files by their type category.
 * Pure function for categorizing files.
 * 
 * @param files - Array of file metadata objects
 * @returns Object with categorized file arrays
 */
export const groupFilesByType = (files: FileMetadata[]): Record<string, FileMetadata[]> => {
  return files.reduce((groups, file) => {
    const category = getFileCategory(file.type);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(file);
    return groups;
  }, {} as Record<string, FileMetadata[]>);
};

/**
 * Gets the general category of a file based on its MIME type.
 * Pure function for file categorization.
 * 
 * @param mimeType - The MIME type of the file
 * @returns File category string
 */
export const getFileCategory = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return 'images';
  if (mimeType.startsWith('video/')) return 'videos';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('text/') || mimeType.includes('json') || mimeType.includes('xml')) {
    return 'documents';
  }
  if (mimeType.includes('pdf') || mimeType.includes('word') || mimeType.includes('presentation')) {
    return 'documents';
  }
  return 'other';
};
