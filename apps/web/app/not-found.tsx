import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <span className="overline text-primary">404</span>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Page not found</h1>
      <p className="mt-2 max-w-sm text-text-secondary">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}
