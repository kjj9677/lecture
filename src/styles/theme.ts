import { colors } from './colors';

export const theme = {
  colors,

  // Typography scales
  typography: {
    fontFamily: {
      primary: 'Arial, Helvetica, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
    },

    fontSize: {
      xs: '12px',    // CAPTION
      sm: '14px',    // BODY_2
      base: '16px',  // BODY_1
      lg: '20px',    // HEADER_3
      xl: '24px',    // HEADER_2
      '2xl': '32px', // HEADER_1
    },

    lineHeight: {
      xs: '16px',    // CAPTION
      sm: '20px',    // BODY_2
      base: '24px',  // BODY_1
      lg: '28px',    // HEADER_3
      xl: '32px',    // HEADER_2
      '2xl': '40px', // HEADER_1
    },

    fontWeight: {
      regular: '400',
      semibold: '600',
      bold: '700',
    },
  },

  // Spacing scale
  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
  },

  // Border radius
  borderRadius: {
    none: '0px',
    sm: '4px',
    base: '8px',
    lg: '12px',
    full: '9999px',
  },

  // Shadow system
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    lg: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    xl: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },

  // Transition
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Breakpoints for responsive design
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
} as const;

export type Theme = typeof theme;