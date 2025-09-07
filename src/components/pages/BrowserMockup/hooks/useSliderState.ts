/**
 * @fileoverview Custom hook for managing slider state with configurable
 * constraints and change handling, commonly used for resizable components.
 */

import { useState, useCallback } from 'react';

/**
 * Configuration options for the slider state hook.
 */
interface UseSliderStateOptions {
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Step increment for the slider */
  step?: number;
  /** Callback function called when value changes */
  onChange?: (value: number) => void;
}

/**
 * Return type for the useSliderState hook.
 */
interface UseSliderStateReturn {
  /** The current slider value */
  value: number;
  /** Function to update the slider value */
  setValue: (value: number) => void;
  /** Function to handle slider change events */
  handleChange: (event: Event, newValue: number | number[]) => void;
  /** Function to increment the value by step */
  increment: () => void;
  /** Function to decrement the value by step */
  decrement: () => void;
  /** Function to reset to initial value */
  reset: () => void;
  /** Function to set to minimum value */
  setMin: () => void;
  /** Function to set to maximum value */
  setMax: () => void;
}

/**
 * Custom hook for managing slider state with built-in constraints and utilities.
 * Provides value management, change handling, and convenience methods for
 * common slider operations.
 * 
 * @param initialValue - The initial value for the slider
 * @param options - Configuration options for the slider behavior
 * @returns Object containing slider value, change handlers, and utility functions
 */
export const useSliderState = (
  initialValue: number,
  options: UseSliderStateOptions = {}
): UseSliderStateReturn => {
  const {
    min = 0,
    max = 100,
    step = 1,
    onChange
  } = options;

  const [value, setValue] = useState(initialValue);

  /**
   * Clamps a value between min and max bounds.
   * @param val - The value to clamp
   * @returns The clamped value
   */
  const clampValue = useCallback((val: number): number => {
    return Math.min(Math.max(val, min), max);
  }, [min, max]);

  /**
   * Updates the slider value with validation and optional callback.
   * @param newValue - The new value to set
   */
  const updateValue = useCallback((newValue: number) => {
    const clampedValue = clampValue(newValue);
    setValue(clampedValue);
    onChange?.(clampedValue);
  }, [clampValue, onChange]);

  /**
   * Handles slider change events from MUI Slider component.
   * @param _event - The slider change event (unused)
   * @param newValue - The new value from the slider
   */
  const handleChange = useCallback((_event: Event, newValue: number | number[]) => {
    const val = Array.isArray(newValue) ? newValue[0] : newValue;
    updateValue(val);
  }, [updateValue]);

  /**
   * Increments the value by the step amount.
   */
  const increment = useCallback(() => {
    updateValue(value + step);
  }, [value, step, updateValue]);

  /**
   * Decrements the value by the step amount.
   */
  const decrement = useCallback(() => {
    updateValue(value - step);
  }, [value, step, updateValue]);

  /**
   * Resets the value to the initial value.
   */
  const reset = useCallback(() => {
    updateValue(initialValue);
  }, [initialValue, updateValue]);

  /**
   * Sets the value to the minimum allowed value.
   */
  const setMin = useCallback(() => {
    updateValue(min);
  }, [min, updateValue]);

  /**
   * Sets the value to the maximum allowed value.
   */
  const setMax = useCallback(() => {
    updateValue(max);
  }, [max, updateValue]);

  return {
    value,
    setValue: updateValue,
    handleChange,
    increment,
    decrement,
    reset,
    setMin,
    setMax
  };
};
