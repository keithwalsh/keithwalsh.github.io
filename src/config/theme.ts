import { createTheme, ThemeOptions } from '@mui/material/styles';

// Define palette configurations for each mode
export const lightPalette = {
  text: {
    primary: "#4F7577",
  },
  primary: {
    main: "#14767D",
    light: "#0C884C",
  },
  secondary: {
    main: "#0068A8",
  },
  info: {
    main: '#0072B8',
    light: "#F4F9FD",
  },
  action: {
    hover: "rgba(0, 0, 0, 0.01)",
    selected: "#F5F6FA",
  },
};

export const darkPalette = {
  text: {
    primary: "#CECFD2",
    secondary: "#96999E",
  },
  action: {
    active: "#CECFD2",
  },
};

// Base theme configuration (shared across modes)
export const baseThemeOptions: ThemeOptions = {
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          minHeight: "46px",
          height: "46px",
        },
      },
    },
  },
};

// Create theme based on mode
export const createCustomTheme = (mode: 'light' | 'dark') => {
  return createTheme({
    ...baseThemeOptions,
    palette: {
      mode,
      ...(mode === 'light' ? lightPalette : darkPalette),
    },
  });
};

// Pre-created themes for convenience (if needed elsewhere)
export const customTheme = createCustomTheme('light');