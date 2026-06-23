import Link from 'next/link';

// Wordmark logo. The mobile app ships an image asset; on the web we render a
// crisp typographic mark so there's no asset dependency.
export function Logo({ href = '/', className = '' }: { href?: string; className?: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 font-extrabold tracking-tight ${className}`}
    >
      <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-white">
        F
      </span>
      <span className="text-xl text-white">
        Food<span className="text-primary">ala</span>
      </span>
    </Link>
  );
}
