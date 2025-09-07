/**
 * @fileoverview Theme provider component that manages light/dark mode state and
 * applies MUI theme configuration with CSS custom properties for browser window
 * component styling.
 */

import React, { useMemo, ReactNode, useEffect, useCallback } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeContext } from './ThemeContextCore';
import { useLocalStorage } from '../hooks';
import { createAppTheme, getCSSCustomProperties } from '../styles';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get system preference
  const getSystemPreference = (): 'light' | 'dark' => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Use localStorage hook for theme mode persistence
  const { value: mode, setValue: setMode } = useLocalStorage<'light' | 'dark'>(
    'themeMode',
    getSystemPreference()
  );

  // Toggle between light and dark themes
  const toggleTheme = useCallback(() => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  }, [setMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't explicitly set a preference
      // The localStorage hook will handle the persistence logic
      if (mode === getSystemPreference()) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    // Add event listener with newer API if available
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    
    return undefined;
  }, [mode, setMode]);

  // Create the theme object using centralized theme configuration
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  // Apply CSS custom properties for browser window styling
  useEffect(() => {
    const customProperties = getCSSCustomProperties(mode);
    const root = document.documentElement;
    
    Object.entries(customProperties).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }, [mode]);

  // Create context value
  const contextValue = useMemo(
    () => ({
      mode,
      toggleTheme,
    }),
    [mode, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}; 