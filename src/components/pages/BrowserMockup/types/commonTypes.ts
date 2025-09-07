/**
 * @fileoverview Common type definitions used across multiple components
 * and utilities in the application.
 */

/**
 * Generic callback function type.
 */
export type CallbackFunction<T = void> = () => T;

/**
 * Generic event handler type.
 */
export type EventHandler<T = Event> = (event: T) => void;

/**
 * Generic async function type.
 */
export type AsyncFunction<T = void, U = void> = (arg: T) => Promise<U>;

/**
 * Theme mode options.
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Component size variants.
 */
export type ComponentSize = 'small' | 'medium' | 'large';

/**
 * Loading state interface.
 */
export interface LoadingState {
  /** Whether operation is in progress */
  isLoading: boolean;
  /** Loading message */
  message?: string;
  /** Progress percentage (0-100) */
  progress?: number;
}

/**
 * Error state interface.
 */
export interface ErrorState {
  /** Whether there's an error */
  hasError: boolean;
  /** Error message */
  message?: string;
  /** Error code */
  code?: string;
}
