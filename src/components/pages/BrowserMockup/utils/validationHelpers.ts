/**
 * @fileoverview Pure validation utility functions for common data validation
 * operations used throughout the application.
 */

/**
 * Validates if a string is a valid URL.
 * Pure function for URL validation.
 * 
 * @param url - The URL string to validate
 * @returns True if valid URL, false otherwise
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates if a string is a valid email address.
 * Pure function for email validation using regex.
 * 
 * @param email - The email string to validate
 * @returns True if valid email, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates if a value is not empty (null, undefined, or empty string).
 * Pure function for checking if a value exists.
 * 
 * @param value - The value to check
 * @returns True if value exists and is not empty, false otherwise
 */
export const isNotEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return true;
};

/**
 * Validates if a number is within a specified range.
 * Pure function for numeric range validation.
 * 
 * @param value - The number to validate
 * @param min - Minimum allowed value (inclusive)
 * @param max - Maximum allowed value (inclusive)
 * @returns True if value is within range, false otherwise
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Validates if a string matches a specific pattern.
 * Pure function for pattern matching validation.
 * 
 * @param value - The string to validate
 * @param pattern - Regular expression pattern to match against
 * @returns True if string matches pattern, false otherwise
 */
export const matchesPattern = (value: string, pattern: RegExp): boolean => {
  return pattern.test(value);
};
