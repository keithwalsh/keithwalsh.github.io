import { createContext } from 'react';

// Define the shape of the context
export type ThemeContextType = {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
};

// Create the context with default values
export const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
}); 