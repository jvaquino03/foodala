'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { fetchMyProfile, signOut } from '@/lib/auth';
import { getSupabase } from '@/lib/supabase';
import type { Profile } from '@/types/database';

type Status = 'checking' | 'ok' | 'denied';

// Client-side guard + chrome for every /admin route. The real security boundary
// is Supabase RLS (admin-only policies on the data); this gate controls UI
// access: unauthenticated users are sent to /login, and authenticated non-admins
// get a clear "no access" screen instead of the dashboard.
export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('checking');
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      const supabase = getSupabase();
      if (!supabase) {
        router.replace('/login');
        return;
      }
      const me = await fetchMyProfile();
      if (!active) return;
      if (!me) {
        router.replace('/login');
        return;
      }
      if (me.role !== 'admin') {
        setStatus('denied');
        return;
      }
      setProfile(me);
      setStatus('ok');
    })();

    // If the session ends (logout here or in another tab), bounce to login.
    const supabase = getSupabase();
    const sub = supabase?.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') router.replace('/login');
    });

    return () => {
      active = false;
      sub?.data.subscription.unsubscribe();
    };
  }, [router]);

  async function handleLogout() {
    await signOut();
    router.replace('/login');
  }

  if (status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-text-muted">Checking access…</p>
      </div>
    );
  }

  if (status === 'denied') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-5">
        <div className="card max-w-md p-8 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight">No admin access</h1>
          <p className="mt-2 text-text-secondary">You do not have admin access.</p>
          <div className="mt-6 flex flex-col gap-2">
            <button onClick={handleLogout} className="btn-primary w-full">
              Sign out
            </button>
            <Link href="/" className="btn-ghost w-full">
              Back to Foodala
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
          <span className="text-sm font-semibold text-text-secondary">
            Foodala Operations · Davao City
          </span>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-text-muted sm:block">{profile?.email}</span>
            <span className="grid h-8 w-8 place-items-center rounded-pill bg-primary text-sm font-bold uppercase text-white">
              {profile?.email?.charAt(0) ?? 'A'}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-pill border border-border-strong px-4 py-1.5 text-sm font-semibold text-text-secondary transition-colors hover:text-white"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
