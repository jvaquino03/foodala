'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { signInAdmin } from '@/lib/auth';

const HERO = 'https://www.themealdb.com/images/media/meals/usywpp1511189717.jpg';

// Admin login (Supabase Auth, email/password). On success we verify the user's
// profile role: admins go to /admin, anyone else sees an "no admin access"
// message. There is no public signup or guest/customer login here.
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);

    const result = await signInAdmin(email.trim(), password);
    if (result.ok) {
      router.replace('/admin');
      return;
    }

    setError(result.message);
    setSubmitting(false);
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand hero (hidden on small screens) */}
      <div className="relative hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
        <div className="absolute inset-x-0 bottom-0 p-10">
          <h2 className="max-w-md text-3xl font-extrabold leading-tight tracking-tight">
            Great food, <span className="text-primary">delivered</span> to your door.
          </h2>
          <p className="mt-2 max-w-sm text-text-secondary">
            Foodala admin — sign in to manage operations.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col justify-center px-5 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Logo size="lg" />
          <h1 className="mt-8 text-3xl font-extrabold tracking-tight">Admin sign in</h1>
          <p className="mt-2 text-text-secondary">Restricted to Foodala staff.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@foodala.com"
                className="w-full rounded-md border border-border-strong bg-surface-elevated px-3 py-3 text-white placeholder:text-text-muted outline-none focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-border-strong bg-surface-elevated px-3 py-3 text-white placeholder:text-text-muted outline-none focus:border-primary"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-md border border-danger/40 bg-[rgba(255,90,90,0.10)] px-4 py-3 text-sm text-danger"
              >
                {error}
              </p>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            <Link href="/" className="font-semibold text-primary hover:underline">
              ← Back to Foodala
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
