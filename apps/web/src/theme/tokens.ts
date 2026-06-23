// Design tokens mirrored from apps/customer-mobile/src/theme. The Tailwind config
// (tailwind.config.ts) is the primary styling surface for the web app; this file
// exists for the rare cases where a raw token value is needed in TS (charts,
// inline styles, dynamic colors) and to keep one source of truth documented.

export const colors = {
  primary: '#C40000',
  primaryDark: '#9E0000',
  cream: '#F2DFC2',
  gold: '#D8B56A',
  background: '#050505',
  surface: '#111111',
  surfaceElevated: '#1A1A1A',
  surfaceHigh: '#242424',
  border: '#272727',
  borderStrong: '#383838',
  textPrimary: '#FFFFFF',
  textSecondary: '#B6B6B6',
  textMuted: '#7C7C7C',
  success: '#3FB66A',
  danger: '#FF5A5A',
  star: '#D8B56A',
} as const;

export type AppColors = typeof colors;
