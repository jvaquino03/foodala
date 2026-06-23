import { ImageResponse } from 'next/og';

// Branded social-share card, generated at build time with next/og so there is
// no binary image asset to ship or keep in sync. Mirrors the Foodala dark brand
// (near-black background, Foodala Red mark, warm cream + soft gold accents).
// Next auto-wires this as the default Open Graph + Twitter image for every page.

// Default (Node.js) runtime so Next prerenders this to a static PNG at build
// time — no on-demand server function and no runtime env dependency.
export const alt = 'Foodala — Premium food delivery in Davao City';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #2a0606 0%, #0b0303 42%, #050505 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 24,
              background: '#C40000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: 60,
              fontWeight: 800,
            }}
          >
            F
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: -1,
              color: '#FFFFFF',
              display: 'flex',
            }}
          >
            Food<span style={{ color: '#C40000' }}>ala</span>
          </div>
        </div>

        <div
          style={{
            marginTop: 48,
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
            color: '#FFFFFF',
            maxWidth: 900,
          }}
        >
          Premium food, delivered.
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 34,
            color: '#F2DFC2',
            maxWidth: 880,
          }}
        >
          Browse the best restaurants in Davao City and order in a few taps.
        </div>

        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: '#D8B56A',
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 999, background: '#D8B56A' }} />
          Cash on delivery · Davao City
        </div>
      </div>
    ),
    { ...size }
  );
}
