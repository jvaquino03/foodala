import type { Config } from 'tailwindcss';

// Brand tokens are kept in sync with apps/customer-mobile/src/theme so the
// website and the mobile app share one premium, dark-mode-first identity.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C40000', // Foodala Red
          dark: '#9E0000',
          pressed: '#A60000',
          soft: 'rgba(196, 0, 0, 0.14)',
        },
        cream: '#F2DFC2',
        gold: { DEFAULT: '#D8B56A', soft: 'rgba(216, 181, 106, 0.16)' },
        background: '#050505',
        surface: {
          DEFAULT: '#111111',
          elevated: '#1A1A1A',
          high: '#242424',
        },
        border: { DEFAULT: '#272727', strong: '#383838' },
        text: {
          primary: '#FFFFFF',
          secondary: '#B6B6B6',
          muted: '#7C7C7C',
        },
        success: { DEFAULT: '#3FB66A', soft: 'rgba(63, 182, 106, 0.16)' },
        danger: '#FF5A5A',
        star: '#D8B56A',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '28px',
        pill: '999px',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 24px rgba(0, 0, 0, 0.45)',
        elevated: '0 16px 40px rgba(0, 0, 0, 0.55)',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
};

export default config;
