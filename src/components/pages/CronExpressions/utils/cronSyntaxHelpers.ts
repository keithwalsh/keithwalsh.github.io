// Helper functions and utilities for CronSyntaxBar component

import type { FieldData, SpecialCharacterData } from '../types/cronSyntaxTypes';

/**
 * Validates field data structure and content
 * @param fields Array of field data to validate
 * @returns true if all fields are valid, false otherwise
 */
export const validateFieldData = (fields: FieldData[]): boolean => {
  return fields.every(field => 
    field.short && 
    field.range && 
    field.desc && 
    field.detailedDesc && 
    Array.isArray(field.examples) && 
    field.examples.length > 0
  );
};

/**
 * Validates special characters data structure and content
 * @param characters Array of special character data to validate
 * @returns true if all characters are valid, false otherwise
 */
export const validateSpecialCharactersData = (characters: SpecialCharacterData[]): boolean => {
  return characters.every(char => 
    char.symbol && 
    char.name && 
    char.description && 
    Array.isArray(char.examples) && 
    char.examples.length > 0 &&
    char.examples.every(example => example.value && example.meaning)
  );
};

/**
 * Generates a safe ID from field name for accessibility
 * @param fieldName The field name to convert
 * @returns A safe ID string
 */
export const generateFieldId = (fieldName: string): string => {
  return `field-${fieldName.toLowerCase().replace(/\s+/g, '-')}`;
};

/**
 * Splits example string into code and description parts
 * @param example The example string in format "code - description"
 * @returns Object with code and description parts
 */
export const parseExample = (example: string): { code: string; description: string } => {
  const parts = example.split(' - ');
  return {
    code: parts[0] || '',
    description: parts[1] || ''
  };
}; 