import { createTheme } from '@mui/material/styles';

export const customTheme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        text: {
          primary: '#4F7577',
        },
        primary: {
          main: '#0068A8',
        },
        secondary: {
          main: '#0C884C',
        },
        info: {
          main: '#0072B8',
        },
      },
    },
    dark: {
      palette: {
        text: {
          primary: '#CECFD2',
          secondary: '#96999E',
        },
        action: {
          active: '#CECFD2',
        },
      },
    },
  },
});

