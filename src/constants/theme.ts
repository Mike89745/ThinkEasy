/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

const PALETTE = {
  black: '#000000',
  white: '#ffffff',
  neutral100: '#F0F0F3',
  neutral200: '#E0E1E6',
  neutral600: '#60646C',
  neutral700: '#B0B4BA',
  neutral900: '#212225',
  neutral950: '#2E3135',
  blue600: '#2563eb',
  blue300Alpha35: 'rgba(147, 197, 253, 0.35)',
  emerald600: '#059669',
  emerald300Alpha35: 'rgba(110, 231, 183, 0.35)',
  splashBlue500: '#208AEF',
  splashBlue600: '#0274DF',
  splashBlue400: '#3C9FFE',
} as const;

export const AUTH_LOGIN_ACCENT = PALETTE.blue600;
export const AUTH_LOGIN_ACCENT_SOFT = PALETTE.blue300Alpha35;
export const AUTH_SIGNUP_ACCENT = PALETTE.emerald600;
export const AUTH_SIGNUP_ACCENT_SOFT = PALETTE.emerald300Alpha35;
export const AUTH_CARD_SHADOW = PALETTE.black;

export const SPLASH_GRADIENT_START = PALETTE.splashBlue400;
export const SPLASH_GRADIENT_END = PALETTE.splashBlue600;
export const SPLASH_BACKGROUND = PALETTE.splashBlue500;

export const Colors = {
  light: {
    text: PALETTE.black,
    background: PALETTE.white,
    backgroundElement: PALETTE.neutral100,
    backgroundSelected: PALETTE.neutral200,
    textSecondary: PALETTE.neutral600,
  },
  dark: {
    text: PALETTE.white,
    background: PALETTE.black,
    backgroundElement: PALETTE.neutral900,
    backgroundSelected: PALETTE.neutral950,
    textSecondary: PALETTE.neutral700,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
