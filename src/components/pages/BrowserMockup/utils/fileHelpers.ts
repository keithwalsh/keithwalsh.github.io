/**
 * @fileoverview Pure utility functions for file processing operations including
 * validation, reading, and type checking.
 */

/**
 * Configuration options for file operations.
 */
export interface FileProcessingOptions {
  /** The file reading method to use */
  readAs?: 'dataURL' | 'text' | 'arrayBuffer';
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Accepted file types */
  acceptedTypes?: string[];
}

/**
 * Result of file validation operation.
 */
export interface FileValidationResult {
  /** Whether the file is valid */
  isValid: boolean;
  /** Error message if validation fails */
  error?: string;
}

/**
 * Validates a file against specified constraints.
 * Pure function that checks file size and type without side effects.
 * 
 * @param file - The file to validate
 * @param options - Validation options
 * @returns Validation result with success status and optional error message
 */
export const validateFile = (
  file: File,
  options: FileProcessingOptions = {}
): FileValidationResult => {
  const { maxSize = 10 * 1024 * 1024, acceptedTypes = [] } = options;

  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`
    };
  }

  // Check file type if specified
  if (acceptedTypes.length > 0) {
    const isAccepted = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      if (type.includes('*')) {
        const baseType = type.split('/')[0];
        return file.type.startsWith(baseType);
      }
      return file.type === type;
    });

    if (!isAccepted) {
      return {
        isValid: false,
        error: `File type not accepted. Accepted types: ${acceptedTypes.join(', ')}`
      };
    }
  }

  return { isValid: true };
};

/**
 * Reads a file using the FileReader API with the specified method.
 * Pure async function that handles file reading without managing state.
 * 
 * @param file - The file to read
 * @param readAs - The method to use for reading ('dataURL', 'text', or 'arrayBuffer')
 * @returns Promise resolving to the file content
 */
export const readFileContent = (
  file: File,
  readAs: 'dataURL' | 'text' | 'arrayBuffer' = 'dataURL'
): Promise<string | ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result;
      if (result !== null && result !== undefined) {
        resolve(result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    // Choose reading method based on parameter
    switch (readAs) {
      case 'text':
        reader.readAsText(file);
        break;
      case 'arrayBuffer':
        reader.readAsArrayBuffer(file);
        break;
      case 'dataURL':
      default:
        reader.readAsDataURL(file);
        break;
    }
  });
};

/**
 * Processes a file by validating it and reading its content.
 * Combines validation and reading operations into a single pure function.
 * 
 * @param file - The file to process
 * @param options - Processing options including validation and reading parameters
 * @returns Promise resolving to the file content or rejecting with validation/reading errors
 */
export const processFile = async (
  file: File,
  options: FileProcessingOptions = {}
): Promise<string | ArrayBuffer> => {
  const { readAs = 'dataURL' } = options;

  // First validate the file
  const validation = validateFile(file, options);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // Then read the file content
  return readFileContent(file, readAs);
};

/**
 * Checks if a file type is an image.
 * Pure function for determining if a file is an image type.
 * 
 * @param file - The file to check
 * @returns True if the file is an image, false otherwise
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Gets a human-readable file size string.
 * Pure function for formatting file sizes.
 * 
 * @param bytes - File size in bytes
 * @returns Formatted file size string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Extracts file extension from filename.
 * Pure function for getting file extensions.
 * 
 * @param filename - The filename to extract extension from
 * @returns File extension with dot (e.g., ".jpg") or empty string if no extension
 */
export const getFileExtension = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex !== -1 ? filename.slice(lastDotIndex) : '';
};
