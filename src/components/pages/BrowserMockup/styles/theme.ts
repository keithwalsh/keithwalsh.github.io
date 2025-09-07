/**
 * @fileoverview Centralized theme configuration with design tokens for MUI and
 * custom components. Includes color palettes, spacing, typography, and component
 * style overrides.
 */

import { createTheme, responsiveFontSizes, Theme } from '@mui/material/styles';

// Design Tokens
export const designTokens = {
  colors: {
    primary: {
      light: '#1976d2',
      dark: '#90caf9',
    },
    secondary: {
      light: '#dc004e',
      dark: '#f48fb1',
    },
    background: {
      light: {
        default: '#ffffff',
        paper: '#ffffff',
      },
      dark: {
        default: '#121212',
        paper: '#1e1e1e',
      },
    },
    text: {
      light: {
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: 'rgba(0, 0, 0, 0.6)',
      },
      dark: {
        primary: 'rgba(255, 255, 255, 0.87)',
        secondary: 'rgba(255, 255, 255, 0.6)',
      },
    },
    browser: {
      light: {
        border: '#e0e0e0',
        header: '#f0f0f0',
        addressBar: '#ffffff',
        addressBarText: '#333333',
        body: '#ffffff',
        bars: '#aaaaaa',
        inputText: '#333333',
        resizeControlsBg: '#f8f8f8',
        resizeControlsText: '#444444',
      },
      dark: {
        border: '#444444',
        header: '#333333',
        addressBar: '#222222',
        addressBarText: '#dddddd',
        body: '#222222',
        bars: '#dddddd',
        inputText: '#dddddd',
        resizeControlsBg: '#333333',
        resizeControlsText: '#dddddd',
      },
    },
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    xxl: '3rem',     // 48px
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    round: '50%',
  },
  transitions: {
    fast: '0.15s ease',
    medium: '0.3s ease',
    slow: '0.5s ease',
  },
  shadows: {
    light: '0 2px 8px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.15)',
    heavy: '0 8px 32px rgba(0, 0, 0, 0.2)',
  },
  typography: {
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontSize: {
      xs: '0.75rem',   // 12px
      sm: '0.875rem',  // 14px
      md: '1rem',      // 16px
      lg: '1.125rem',  // 18px
      xl: '1.25rem',   // 20px
      xxl: '1.5rem',   // 24px
      xxxl: '2rem',    // 32px
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8,
    },
  },
};

// Create theme function
export const createAppTheme = (mode: 'light' | 'dark'): Theme => {
  const tokens = designTokens;
  const isDark = mode === 'dark';

  let theme = createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? tokens.colors.primary.dark : tokens.colors.primary.light,
      },
      secondary: {
        main: isDark ? tokens.colors.secondary.dark : tokens.colors.secondary.light,
      },
      background: {
        default: isDark ? tokens.colors.background.dark.default : tokens.colors.background.light.default,
        paper: isDark ? tokens.colors.background.dark.paper : tokens.colors.background.light.paper,
      },
      text: {
        primary: isDark ? tokens.colors.text.dark.primary : tokens.colors.text.light.primary,
        secondary: isDark ? tokens.colors.text.dark.secondary : tokens.colors.text.light.secondary,
      },
    },
    typography: {
      fontFamily: tokens.typography.fontFamily,
      fontSize: 14,
    },
    shape: {
      borderRadius: parseInt(tokens.borderRadius.md),
    },
    spacing: 8, // Base spacing unit (8px)
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            transition: `background-color ${tokens.transitions.medium}, color ${tokens.transitions.medium}, box-shadow ${tokens.transitions.medium}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            transition: `background-color ${tokens.transitions.medium}, color ${tokens.transitions.medium}, box-shadow ${tokens.transitions.medium}`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: tokens.borderRadius.md,
            transition: `background-color ${tokens.transitions.medium}, color ${tokens.transitions.medium}, border-color ${tokens.transitions.medium}`,
            textTransform: 'none',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: `background-color ${tokens.transitions.medium}, color ${tokens.transitions.medium}`,
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            transition: `background-color ${tokens.transitions.medium}, color ${tokens.transitions.medium}, border-color ${tokens.transitions.medium}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: tokens.borderRadius.lg,
            boxShadow: tokens.shadows.light,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: tokens.borderRadius.md,
            },
          },
        },
      },
    },
  });

  // Add responsive font sizes
  theme = responsiveFontSizes(theme);

  return theme;
};

// CSS Custom Properties for browser window component
export const getCSSCustomProperties = (mode: 'light' | 'dark') => {
  const browserColors = designTokens.colors.browser[mode];
  
  return {
    '--browser-border-color': browserColors.border,
    '--header-bg-color': browserColors.header,
    '--address-bar-bg-color': browserColors.addressBar,
    '--address-bar-text-color': browserColors.addressBarText,
    '--bar-color': browserColors.bars,
    '--body-bg-color': browserColors.body,
    '--input-text-color': browserColors.inputText,
    '--resize-controls-bg-color': browserColors.resizeControlsBg,
    '--resize-controls-text-color': browserColors.resizeControlsText,
  } as const;
};

// Export default theme configurations
export const lightTheme = createAppTheme('light');
export const darkTheme = createAppTheme('dark');
