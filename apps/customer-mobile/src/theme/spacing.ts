// 4pt spacing scale for consistent, Apple-like rhythm.
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  giant: 56,
} as const;

// Standard horizontal screen padding.
export const screenPadding = spacing.xl;

export type Spacing = typeof spacing;
