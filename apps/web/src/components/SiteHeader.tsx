import Link from 'next/link';
import { Logo } from './Logo';

// Public site header — sticky, translucent, with the primary nav and a link
// through to the admin dashboard.
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-5">
        <Logo />
        <nav className="flex items-center gap-5 text-sm font-semibold text-text-secondary">
          <Link href="/restaurants" className="hidden hover:text-white md:block">
            Restaurants
          </Link>
          <Link href="/partners" className="hidden hover:text-white md:block">
            Become a Partner
          </Link>
          <Link href="/riders" className="hidden hover:text-white md:block">
            Become a Rider
          </Link>
          <Link href="/login" className="hover:text-white">
            Login
          </Link>
          <Link href="/restaurants" className="btn-primary !px-5 !py-2 text-sm">
            Order now
          </Link>
        </nav>
      </div>
    </header>
  );
}
