import { createTheme, type ThemeOptions } from '@mui/material/styles';

const PineconeColors = {
  LIGHT: {
    PRIMARY_MAIN: '#002BFF',
    PRIMARY_DARK: '#0A0A0A',
    TEXT_PRIMARY: '#0A0A0A',
    TEXT_SECONDARY: '#737373',
    TEXT_CONTRAST: '#FFF',
    BACKGROUND: '#FAFAFA',
    PAPER: '#FFFFFF',
    SURFACE: '#F5F5F5',
    DIVIDER: '#E5E5E5',
    SECONDARY: '#737373',
    ERROR: '#E31957',
    WARNING: '#DDB15D',
    SUCCESS: '#15B077',
    INFO: '#002BFF',
  },
  DARK: {
    PRIMARY_MAIN: '#4DA4FA',
    PRIMARY_DARK: '#FFFFFF',
    TEXT_PRIMARY: '#FFFFFF',
    TEXT_SECONDARY: '#CCCCCC',
    TEXT_CONTRAST: '#0A0A0A',
    BACKGROUND: '#171717',
    PAPER: '#1C1C1C',
    SURFACE: '#262626',
    DIVIDER: '#404040',
    SECONDARY: '#FFFFFF',
    ERROR: '#FF1A5E',
    WARNING: '#DDB15D',
    SUCCESS: '#15B077',
    INFO: '#0080FF',
  },
};

function createPineconeTheme(mode: 'light' | 'dark' = 'light') {
  const colors = mode === 'light' ? PineconeColors.LIGHT : PineconeColors.DARK;

  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      primary: {
        main: colors.PRIMARY_MAIN,
        dark: colors.PRIMARY_DARK,
        contrastText: colors.TEXT_CONTRAST,
      },
      secondary: {
        main: colors.SECONDARY,
      },
      text: {
        primary: colors.TEXT_PRIMARY,
        secondary: colors.TEXT_SECONDARY,
      },
      error: {
        main: colors.ERROR,
      },
      warning: {
        main: colors.WARNING,
      },
      success: {
        main: colors.SUCCESS,
      },
      info: {
        main: colors.INFO,
      },
      background: {
        default: colors.BACKGROUND,
        paper: colors.PAPER,
        surface: colors.SURFACE,
      },
      divider: colors.DIVIDER,
    },
    typography: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    shape: {
      borderRadius: 8,
    },
  };

  return createTheme(themeOptions);
}

export default createPineconeTheme;

