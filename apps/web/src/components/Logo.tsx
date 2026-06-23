import Link from 'next/link';

// Foodala brand lockup for the web — the SAME approved logo asset the mobile app
// ships (apps/customer-mobile/src/components/Logo.tsx), served from /public via a
// symlink to the shared master at /assets/branding/foodala-logo-transparent.png.
// The illustrative mark is paired with the FOODALA wordmark exactly like mobile,
// so the brand reads identically across platforms.
//
// Plain <img> (not next/image) keeps it dependency-free and matches the project's
// existing pattern; the asset is small and the Next image optimizer is disabled.
const LOGO_SRC = '/foodala-logo-transparent.png';

export function Logo({
  href = '/',
  className = '',
  size = 'md',
  wordmark = true,
}: {
  href?: string;
  className?: string;
  size?: 'md' | 'lg';
  wordmark?: boolean;
}) {
  const large = size === 'lg';

  return (
    <Link href={href} className={`inline-flex items-center gap-3 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO_SRC}
        // Decorative when the wordmark text is shown; otherwise it carries the name.
        alt={wordmark ? '' : 'Foodala'}
        className={large ? 'h-16 w-auto' : 'h-9 w-auto'}
      />
      {wordmark ? (
        <span className="flex flex-col leading-none">
          <span
            className={`font-black uppercase tracking-[0.12em] text-white ${
              large ? 'text-4xl' : 'text-lg'
            }`}
          >
            Foodala
          </span>
          {large ? (
            <span className="overline mt-1.5 text-gold">Premium food delivery</span>
          ) : null}
        </span>
      ) : null}
    </Link>
  );
}
