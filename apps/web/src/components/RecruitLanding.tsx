import Link from 'next/link';

export type Benefit = { icon: string; title: string; body: string };

// Shared landing layout for the partner and rider recruitment pages.
export function RecruitLanding({
  eyebrow,
  title,
  highlight,
  subtitle,
  benefits,
  ctaLabel,
  ctaHref,
  heroImage,
}: {
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  benefits: Benefit[];
  ctaLabel: string;
  ctaHref: string;
  heroImage: string;
}) {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImage} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        </div>
        <div className="relative mx-auto max-w-content px-5 py-24 md:py-32">
          <span className="overline text-gold">{eyebrow}</span>
          <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
            {title} <span className="text-primary">{highlight}</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-text-secondary">{subtitle}</p>
          <div className="mt-8">
            <Link href={ctaHref} className="btn-primary">
              {ctaLabel}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-5 py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title} className="card p-6">
              <div className="grid h-11 w-11 place-items-center rounded-pill bg-primary-soft text-xl">
                {b.icon}
              </div>
              <h3 className="mt-4 text-lg font-bold">{b.title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{b.body}</p>
            </div>
          ))}
        </div>

        <div className="card mt-12 flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="h2">Ready to get started?</h2>
            <p className="mt-1 text-text-secondary">It only takes a few minutes.</p>
          </div>
          <Link href={ctaHref} className="btn-primary shrink-0">
            {ctaLabel}
          </Link>
        </div>
      </section>
    </>
  );
}
