import Link from 'next/link';
import { Logo } from './Logo';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-content px-5 py-12">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm text-text-secondary">
              Premium food delivery for one city, done right. Browse, order, and
              track — all in one place.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <FooterCol title="Company" links={[['About', '/'], ['Careers', '/'], ['Contact', '/']]} />
            <FooterCol title="For you" links={[['Restaurants', '/restaurants'], ['Order now', '/restaurants']]} />
            <FooterCol title="Partners" links={[['Admin', '/admin'], ['Become a partner', '/']]} />
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-xs text-text-muted">
          © 2026 Foodala · Davao City · Cash on Delivery
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="overline mb-3">{title}</h4>
      <ul className="space-y-2 text-sm text-text-secondary">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="hover:text-white">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
