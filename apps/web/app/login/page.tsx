'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';

const HERO = 'https://www.themealdb.com/images/media/meals/usywpp1511189717.jpg';

// Premium, mock-only login. "Login" routes to /admin; "Continue as Guest"
// routes to /. No real auth provider is involved.
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
            Sign in to manage your Foodala experience.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col justify-center px-5 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Logo />
          <h1 className="mt-8 text-3xl font-extrabold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-text-secondary">Sign in to continue.</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push('/admin');
            }}
            className="mt-8 space-y-4"
          >
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-md border border-border-strong bg-surface-elevated px-3 py-3 text-white placeholder:text-text-muted outline-none focus:border-primary"
              />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold">
                  Password
                </label>
                <Link href="#" className="text-sm font-semibold text-primary hover:underline">
                  Forgot Password
                </Link>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-border-strong bg-surface-elevated px-3 py-3 text-white placeholder:text-text-muted outline-none focus:border-primary"
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              Login
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="btn-ghost w-full"
            >
              Continue as Guest
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Don&apos;t have an account?{' '}
            <Link href="#" className="font-semibold text-primary hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
