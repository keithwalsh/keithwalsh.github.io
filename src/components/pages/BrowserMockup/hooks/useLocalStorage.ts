/**
 * @fileoverview Custom hook for managing localStorage with automatic
 * serialization, error handling, and synchronization across tabs.
 */

import { useState, useCallback, useEffect } from 'react';

/**
 * Return type for the useLocalStorage hook.
 */
interface UseLocalStorageReturn<T> {
  /** The current stored value */
  value: T;
  /** Function to update the stored value */
  setValue: (value: T | ((prev: T) => T)) => void;
  /** Function to remove the item from localStorage */
  removeValue: () => void;
  /** Loading state during initial value retrieval */
  isLoading: boolean;
  /** Error state if localStorage operations fail */
  error: string | null;
}

/**
 * Custom hook for managing localStorage with automatic JSON serialization.
 * Provides synchronization across browser tabs and error handling for
 * localStorage operations.
 * 
 * @param key - The localStorage key to use
 * @param defaultValue - The default value if no stored value exists
 * @returns Object containing the stored value and management functions
 */
export const useLocalStorage = <T>(
  key: string,
  defaultValue: T
): UseLocalStorageReturn<T> => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState<T>(defaultValue);

  /**
   * Reads a value from localStorage with error handling.
   * @returns The parsed value or the default value
   */
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      setError(`Failed to read from localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return defaultValue;
    }
  }, [key, defaultValue]);

  /**
   * Writes a value to localStorage with error handling.
   * @param valueToStore - The value to store
   */
  const writeValue = useCallback((valueToStore: T): void => {
    if (typeof window === 'undefined') {
      console.warn('localStorage is not available in this environment');
      return;
    }

    try {
      localStorage.setItem(key, JSON.stringify(valueToStore));
      setError(null);
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
      setError(`Failed to write to localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [key]);

  /**
   * Removes the item from localStorage.
   */
  const removeValue = useCallback((): void => {
    if (typeof window === 'undefined') {
      console.warn('localStorage is not available in this environment');
      return;
    }

    try {
      localStorage.removeItem(key);
      setValue(defaultValue);
      setError(null);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
      setError(`Failed to remove from localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [key, defaultValue]);

  /**
   * Updates the stored value with support for functional updates.
   * @param newValue - The new value or a function that returns the new value
   */
  const setStoredValue = useCallback((newValue: T | ((prev: T) => T)): void => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      writeValue(valueToStore);
    } catch (error) {
      console.warn(`Error updating localStorage key "${key}":`, error);
      setError(`Failed to update localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [key, value, writeValue]);

  // Initialize value from localStorage on mount
  useEffect(() => {
    const initialValue = readValue();
    setValue(initialValue);
    setIsLoading(false);
  }, [readValue]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== key || e.storageArea !== localStorage) {
        return;
      }

      try {
        const newValue = e.newValue ? JSON.parse(e.newValue) : defaultValue;
        setValue(newValue);
        setError(null);
      } catch (error) {
        console.warn(`Error parsing storage event for key "${key}":`, error);
        setError(`Failed to sync with localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, defaultValue]);

  return {
    value,
    setValue: setStoredValue,
    removeValue,
    isLoading,
    error
  };
};
