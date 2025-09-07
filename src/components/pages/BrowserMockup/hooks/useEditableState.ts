/**
 * @fileoverview Custom hook for managing editable state with toggle functionality,
 * commonly used for inline editing interfaces like URL bars or text fields.
 */

import { useState, useCallback } from 'react';

/**
 * Return type for the useEditableState hook.
 */
interface UseEditableStateReturn<T> {
  /** The current value */
  value: T;
  /** Whether the field is currently in edit mode */
  isEditing: boolean;
  /** Function to update the value */
  setValue: (value: T) => void;
  /** Function to enter edit mode */
  startEditing: () => void;
  /** Function to exit edit mode */
  stopEditing: () => void;
  /** Function to toggle edit mode */
  toggleEditing: () => void;
  /** Function to handle input changes */
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Function to handle key events (Enter to save, Escape to cancel) */
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Function to handle blur events (exit edit mode) */
  handleBlur: () => void;
  /** Function to handle click events (enter edit mode) */
  handleClick: () => void;
}

/**
 * Custom hook for managing editable state with built-in edit mode functionality.
 * Useful for inline editing components like URL bars, titles, or any text that
 * can be clicked to edit.
 * 
 * @param initialValue - The initial value for the editable field
 * @returns Object containing value, editing state, and event handlers
 */
export const useEditableState = <T extends string | number>(
  initialValue: T
): UseEditableStateReturn<T> => {
  const [value, setValue] = useState<T>(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  /**
   * Enters edit mode.
   */
  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  /**
   * Exits edit mode.
   */
  const stopEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  /**
   * Toggles edit mode.
   */
  const toggleEditing = useCallback(() => {
    setIsEditing(prev => !prev);
  }, []);

  /**
   * Handles input change events.
   * @param event - The input change event
   */
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue as T);
  }, []);

  /**
   * Handles keyboard events for the input field.
   * - Enter: Save and exit edit mode
   * - Escape: Cancel edit and revert to original value
   * @param event - The keyboard event
   */
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      stopEditing();
    } else if (event.key === 'Escape') {
      // Could implement revert functionality here if needed
      stopEditing();
    }
  }, [stopEditing]);

  /**
   * Handles blur events by exiting edit mode.
   */
  const handleBlur = useCallback(() => {
    stopEditing();
  }, [stopEditing]);

  /**
   * Handles click events by entering edit mode.
   */
  const handleClick = useCallback(() => {
    startEditing();
  }, [startEditing]);

  return {
    value,
    isEditing,
    setValue,
    startEditing,
    stopEditing,
    toggleEditing,
    handleChange,
    handleKeyDown,
    handleBlur,
    handleClick
  };
};
