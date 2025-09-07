/**
 * @fileoverview Pure formatting utility functions for data transformation
 * and display formatting operations.
 */

/**
 * Capitalizes the first letter of a string.
 * Pure function for string capitalization.
 * 
 * @param str - The string to capitalize
 * @returns String with first letter capitalized
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Converts a string to kebab-case.
 * Pure function for converting strings to kebab-case format.
 * 
 * @param str - The string to convert
 * @returns String in kebab-case format
 */
export const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

/**
 * Converts a string to camelCase.
 * Pure function for converting strings to camelCase format.
 * 
 * @param str - The string to convert
 * @returns String in camelCase format
 */
export const toCamelCase = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/[\s-_]+/g, '');
};

/**
 * Truncates a string to a specified length with ellipsis.
 * Pure function for string truncation.
 * 
 * @param str - The string to truncate
 * @param maxLength - Maximum length before truncation
 * @param suffix - Suffix to add when truncated (default: '...')
 * @returns Truncated string with suffix if needed
 */
export const truncate = (str: string, maxLength: number, suffix = '...'): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
};

/**
 * Formats a number with thousand separators.
 * Pure function for number formatting.
 * 
 * @param num - The number to format
 * @param locale - Locale string for formatting (default: 'en-US')
 * @returns Formatted number string
 */
export const formatNumber = (num: number, locale = 'en-US'): string => {
  return new Intl.NumberFormat(locale).format(num);
};

/**
 * Formats a date to a readable string.
 * Pure function for date formatting.
 * 
 * @param date - The date to format
 * @param options - Intl.DateTimeFormatOptions for formatting
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
): string => {
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

/**
 * Removes extra whitespace from a string.
 * Pure function for string cleaning.
 * 
 * @param str - The string to clean
 * @returns String with normalized whitespace
 */
export const cleanWhitespace = (str: string): string => {
  return str.replace(/\s+/g, ' ').trim();
};
