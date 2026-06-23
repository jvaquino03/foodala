// Foodala brand palette — premium, dark-mode-first.
export const colors = {
  // --- Brand ---
  primary: '#C40000', // Foodala Red
  primaryDark: '#9E0000',
  primaryPressed: '#A60000',
  primarySoft: 'rgba(196, 0, 0, 0.14)',

  black: '#050505',
  white: '#FFFFFF',

  cream: '#F2DFC2', // Warm Cream
  gold: '#D8B56A', // Soft Gold
  goldSoft: 'rgba(216, 181, 106, 0.16)',

  // --- Dark theme surfaces ---
  background: '#050505',
  surface: '#111111',
  surfaceElevated: '#1A1A1A',
  surfaceHigh: '#242424',
  border: '#272727',
  borderStrong: '#383838',

  // --- Text ---
  textPrimary: '#FFFFFF',
  textSecondary: '#B6B6B6',
  textMuted: '#7C7C7C',
  textOnPrimary: '#FFFFFF',
  textOnGold: '#1A1206',

  // --- Utility ---
  star: '#D8B56A',
  success: '#3FB66A',
  successSoft: 'rgba(63, 182, 106, 0.16)',
  danger: '#FF5A5A',
  overlay: 'rgba(5, 5, 5, 0.55)',
  overlayStrong: 'rgba(5, 5, 5, 0.78)',
  skeleton: '#1C1C1C',
  skeletonHighlight: '#2A2A2A',
  transparent: 'transparent',
} as const;

export type AppColors = typeof colors;
