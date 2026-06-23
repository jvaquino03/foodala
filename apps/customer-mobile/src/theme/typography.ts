import { Platform, type TextStyle } from 'react-native';

// Clean, modern system sans — SF Pro on iOS, Roboto on Android, system on web.
// No custom font files needed; weight + size + tracking carry the hierarchy.
const sans = Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' });

export const fontFamily = {
  regular: sans,
} as const;

// Reusable text presets. Headings are bold with tight tracking for a strong
// hierarchy; body copy is comfortable and legible.
export const typography = {
  display: { fontFamily: sans, fontSize: 36, fontWeight: '800', letterSpacing: -0.6, lineHeight: 42 },
  h1: { fontFamily: sans, fontSize: 28, fontWeight: '800', letterSpacing: -0.4, lineHeight: 34 },
  h2: { fontFamily: sans, fontSize: 22, fontWeight: '700', letterSpacing: -0.3, lineHeight: 28 },
  h3: { fontFamily: sans, fontSize: 18, fontWeight: '700', letterSpacing: -0.2, lineHeight: 24 },
  title: { fontFamily: sans, fontSize: 16, fontWeight: '600', lineHeight: 22 },
  body: { fontFamily: sans, fontSize: 15, fontWeight: '400', lineHeight: 22 },
  bodyStrong: { fontFamily: sans, fontSize: 15, fontWeight: '600', lineHeight: 22 },
  caption: { fontFamily: sans, fontSize: 13, fontWeight: '400', lineHeight: 18 },
  captionStrong: { fontFamily: sans, fontSize: 13, fontWeight: '600', lineHeight: 18 },
  overline: {
    fontFamily: sans,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    lineHeight: 14,
    textTransform: 'uppercase',
  },
  button: { fontFamily: sans, fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
} satisfies Record<string, TextStyle>;

export type Typography = typeof typography;
