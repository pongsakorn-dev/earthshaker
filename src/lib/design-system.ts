// Design System Constants

// Typography
export const typography = {
  fontFamily: 'Sarabun, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  fontSizes: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
  lineHeights: {
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
  },
};

// Colors (HSL Values for Tailwind)
export const colors = {
  // Main colors
  primary: 'hsl(217, 91%, 60%)',          // #2563EB - น้ำเงินเข้ม
  secondary: 'hsl(215, 20%, 65%)',        // #64748B - เทาอมฟ้า
  
  // States
  warning: 'hsl(38, 92%, 50%)',           // #F59E0B - เหลือง
  success: 'hsl(142, 72%, 50%)',          // #10B981 - เขียว
  destructive: 'hsl(0, 84%, 60%)',        // #EF4444 - แดง
  
  // Accents
  lightOrange: 'hsl(45, 95%, 65%)',       // #FCD34D - ส้มอ่อน
  taupe: 'hsl(215, 20%, 65%)',            // #94A3B8 - เทาอมน้ำตาล
  
  // Base
  background: 'hsl(0, 0%, 100%)',         // #FFFFFF - ขาว
  backgroundAlt: 'hsl(210, 40%, 98%)',    // #F9FAFB - เทาอ่อนมาก
  foreground: 'hsl(222, 84%, 4.9%)',      // #1E293B - เทาเข้ม
  
  // Grayscale
  gray: {
    50: 'hsl(210, 40%, 98%)',
    100: 'hsl(214, 32%, 91%)',
    200: 'hsl(214, 18%, 85%)',
    300: 'hsl(212, 16%, 75%)',
    400: 'hsl(214, 12%, 63%)',
    500: 'hsl(215, 16%, 47%)',
    600: 'hsl(217, 20%, 32%)',
    700: 'hsl(218, 25%, 25%)',
    800: 'hsl(220, 30%, 19%)',
    900: 'hsl(222, 47%, 11%)',
  },
};

// Spacing
export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
};

// Border Radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  default: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

// Box Shadow
export const boxShadow = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
};

// Animation
export const animation = {
  durations: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easings: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  },
};

// Z-Index
export const zIndex = {
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  auto: 'auto',
};

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Media Queries
export const media = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
}; 