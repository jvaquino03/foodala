import Link from 'next/link';
import { Logo } from '@/components/Logo';

// Placeholder shell for the future restaurant/rider portals.
export function ComingSoon({
  eyebrow,
  title,
  description,
  features,
}: {
  eyebrow: string;
  title: string;
  description: string;
  features: { icon: string; label: string }[];
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b border-border px-5">
        <Logo />
        <Link href="/" className="text-sm font-semibold text-text-secondary hover:text-white">
          ← Back to website
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="w-full max-w-2xl text-center">
          <span className="inline-flex items-center rounded-pill bg-primary-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            Coming soon
          </span>
          <p className="mt-6 overline text-gold">{eyebrow}</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight">{title}</h1>
          <p className="mx-auto mt-3 max-w-md text-text-secondary">{description}</p>

          <div className="mt-10 grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
            {features.map((f) => (
              <div key={f.label} className="card flex items-center gap-3 p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-pill bg-surface-high text-lg">
                  {f.icon}
                </span>
                <span className="font-semibold">{f.label}</span>
              </div>
            ))}
          </div>

          <p className="mt-10 text-sm text-text-muted">
            This portal is under construction. Check back soon.
          </p>
        </div>
      </main>
    </div>
  );
}
