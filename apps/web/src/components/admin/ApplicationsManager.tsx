'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import type { ApplicationStatus, RestaurantApplication } from '@/types/database';
import { formatDateTime } from '@/utils/format';

type Filter = 'all' | ApplicationStatus;
type Load = 'loading' | 'ready' | 'unconfigured' | 'error';

// Surfaced to the admin (and console in dev) so a "no rows" result is never
// ambiguous: it could be a genuinely empty table, a missing/expired session, a
// non-admin profile (RLS silently filters every row), or a select error.
type Diagnostics = {
  configured: boolean;
  sessionExists: boolean;
  role: string | null;
  selectError: string | null;
  rowCount: number;
};

const isDev = process.env.NODE_ENV === 'development';

const STATUS_ORDER: Record<ApplicationStatus, number> = {
  pending: 0,
  approved: 1,
  rejected: 2,
};

// Admin review for restaurant partner applications. Reads + updates Supabase
// using the signed-in admin's session (RLS restricts select/update to admins —
// see migration 0003; this page is only reachable through the AdminShell guard).
// Pending applications are listed first.
export function ApplicationsManager() {
  const [apps, setApps] = useState<RestaurantApplication[]>([]);
  const [load, setLoad] = useState<Load>('loading');
  const [filter, setFilter] = useState<Filter>('all');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [diag, setDiag] = useState<Diagnostics | null>(null);

  const refresh = useCallback(async () => {
    setActionError(null);

    const supabase = getSupabase();
    if (!supabase) {
      setDiag({ configured: false, sessionExists: false, role: null, selectError: null, rowCount: 0 });
      setLoad('unconfigured');
      return;
    }

    // Is there a live session, and what role does this user's profile carry?
    // (RLS on restaurant_applications requires profiles.role = 'admin'.)
    const { data: sessionRes } = await supabase.auth.getSession();
    const session = sessionRes.session;
    const sessionExists = Boolean(session);

    let role: string | null = null;
    if (session) {
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle();
      role = (profile as { role?: string } | null)?.role ?? null;
      if (profileErr && isDev) {
        console.error('[applications] profile lookup error:', profileErr.message, profileErr);
      }
    }

    const { data, error } = await supabase
      .from('restaurant_applications')
      .select('*')
      .order('created_at', { ascending: false });

    const rowCount = data?.length ?? 0;
    setDiag({ configured: true, sessionExists, role, selectError: error?.message ?? null, rowCount });

    // Dev-only logging (no secrets — never the anon key or tokens).
    if (isDev) {
      if (error) {
        console.error('[applications] select error:', error.message, error);
      } else {
        console.log(
          `[applications] select ok — ${rowCount} row(s); session=${sessionExists}; role=${role ?? 'none'}`
        );
      }
    }

    if (error) {
      setLoad('error');
      return;
    }
    setApps((data ?? []) as RestaurantApplication[]);
    setLoad('ready');
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Pending first, then approved, then rejected; newest first within each group.
  const sorted = useMemo(() => {
    return [...apps].sort((a, b) => {
      const byStatus = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      if (byStatus !== 0) return byStatus;
      return b.created_at.localeCompare(a.created_at);
    });
  }, [apps]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: apps.length, pending: 0, approved: 0, rejected: 0 };
    for (const a of apps) c[a.status] += 1;
    return c;
  }, [apps]);

  const visible = filter === 'all' ? sorted : sorted.filter((a) => a.status === filter);

  async function patch(id: string, changes: Partial<RestaurantApplication>) {
    const supabase = getSupabase();
    if (!supabase) return;
    setActionError(null);
    setSavingId(id);
    const { error } = await supabase
      .from('restaurant_applications')
      .update(changes)
      .eq('id', id);
    if (error) {
      setActionError('Could not save changes. Please try again.');
    } else {
      // Optimistically reflect the change locally.
      setApps((prev) => prev.map((a) => (a.id === id ? { ...a, ...changes } : a)));
    }
    setSavingId(null);
  }

  if (load === 'loading') {
    return <p className="mt-8 text-text-muted">Loading applications…</p>;
  }

  if (load === 'unconfigured') {
    return (
      <div className="card mt-8 p-6">
        <h2 className="text-lg font-bold">Supabase not configured</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Set <code className="text-cream">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
          <code className="text-cream">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> (see{' '}
          <code className="text-cream">.env.example</code>) and run the{' '}
          <code className="text-cream">0002_restaurant_applications.sql</code> migration to
          review applications here.
        </p>
      </div>
    );
  }

  if (load === 'error') {
    return (
      <div className="card mt-8 p-6">
        <h2 className="text-lg font-bold">Couldn’t load applications</h2>
        <p className="mt-2 text-sm text-text-secondary">
          There was a problem reaching Supabase.
        </p>
        <DiagnosticsPanel diag={diag} />
        <button onClick={() => { setLoad('loading'); void refresh(); }} className="btn-ghost mt-4">
          Retry
        </button>
      </div>
    );
  }

  const tabs: Filter[] = ['all', 'pending', 'approved', 'rejected'];

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`rounded-pill px-4 py-2 text-sm font-semibold capitalize transition-colors ${
              filter === t
                ? 'bg-primary text-white'
                : 'border border-border bg-surface text-text-secondary hover:text-white'
            }`}
          >
            {t} <span className="opacity-60">({counts[t] ?? 0})</span>
          </button>
        ))}
      </div>

      {actionError && (
        <p role="alert" className="mt-4 text-sm text-danger">
          {actionError}
        </p>
      )}

      {/* When the whole table comes back empty, show diagnostics so it's clear
          whether it's genuinely empty or a session/role/RLS issue. */}
      {apps.length === 0 && <DiagnosticsPanel diag={diag} />}

      <div className="mt-5 space-y-4">
        {visible.map((app) => (
          <ApplicationCard
            key={app.id}
            app={app}
            saving={savingId === app.id}
            onStatus={(status) => patch(app.id, { status })}
            onSaveNotes={(admin_notes) => patch(app.id, { admin_notes })}
          />
        ))}
        {visible.length === 0 && (
          <div className="card p-10 text-center text-text-muted">No applications in this view.</div>
        )}
      </div>
    </div>
  );
}

function ApplicationCard({
  app,
  saving,
  onStatus,
  onSaveNotes,
}: {
  app: RestaurantApplication;
  saving: boolean;
  onStatus: (s: ApplicationStatus) => void;
  onSaveNotes: (notes: string) => void;
}) {
  const [notes, setNotes] = useState(app.admin_notes ?? '');
  const notesDirty = notes.trim() !== (app.admin_notes ?? '').trim();

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold">{app.business_name}</h2>
            <ApplicationStatusBadge status={app.status} />
          </div>
          <p className="mt-0.5 text-sm text-text-secondary">{app.cuisine_type}</p>
        </div>
        <span className="text-xs text-text-muted">{formatDateTime(app.created_at)}</span>
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
        <Info label="Owner" value={app.owner_name} />
        <Info label="Phone" value={app.phone} />
        <Info label="Email" value={app.email} />
        <Info label="Cuisine" value={app.cuisine_type} />
        <Info label="Address" value={app.address} full />
        <Info label="Facebook" value={app.facebook_page} link />
        <Info label="Website" value={app.website} link />
      </dl>

      <div className="mt-4 border-t border-border pt-4">
        <label htmlFor={`notes-${app.id}`} className="overline mb-2 block">
          Admin notes
        </label>
        <textarea
          id={`notes-${app.id}`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Internal notes about this application…"
          className="w-full rounded-md border border-border-strong bg-surface-elevated px-3 py-2.5 text-sm text-white placeholder:text-text-muted outline-none focus:border-primary"
        />
        {notesDirty && (
          <button
            onClick={() => onSaveNotes(notes.trim())}
            disabled={saving}
            className="btn-ghost mt-2 !px-4 !py-2 text-sm"
          >
            {saving ? 'Saving…' : 'Save notes'}
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
        <ActionButton
          label="Approve"
          active={app.status === 'approved'}
          activeClass="bg-success text-white"
          disabled={saving || app.status === 'approved'}
          onClick={() => onStatus('approved')}
        />
        <ActionButton
          label="Reject"
          active={app.status === 'rejected'}
          activeClass="bg-danger text-white"
          disabled={saving || app.status === 'rejected'}
          onClick={() => onStatus('rejected')}
        />
        <ActionButton
          label="Mark Pending"
          active={app.status === 'pending'}
          activeClass="bg-gold text-black"
          disabled={saving || app.status === 'pending'}
          onClick={() => onStatus('pending')}
        />
      </div>
    </div>
  );
}

function ActionButton({
  label,
  active,
  activeClass,
  disabled,
  onClick,
}: {
  label: string;
  active: boolean;
  activeClass: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-pill px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 ${
        active ? activeClass : 'border border-border-strong text-text-secondary hover:text-white'
      }`}
    >
      {active ? `✓ ${label}` : label}
    </button>
  );
}

// Admin-facing diagnostics for when applications don't show up. Surfaces the
// exact reason: not configured, no session, wrong role (RLS hides rows), a
// select error, or a genuinely empty table. Never exposes the anon key/tokens.
function DiagnosticsPanel({ diag }: { diag: Diagnostics | null }) {
  if (!diag) return null;

  const hint =
    !diag.configured
      ? 'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then reload.'
      : !diag.sessionExists
        ? 'No active session — sign in again at /login.'
        : diag.role !== 'admin'
          ? `Signed in, but profile role is "${diag.role ?? 'none'}". RLS only returns rows to role 'admin'. Add a profiles row with role 'admin' for this user (see migration 0003).`
          : diag.selectError
            ? 'A select error occurred — see the message above.'
            : diag.rowCount === 0
              ? 'Connected as admin with no rows returned — the table is empty. Submit a test application at /partners/apply.'
              : null;

  const yn = (v: boolean) => (
    <b className={v ? 'text-success' : 'text-danger'}>{v ? 'yes' : 'no'}</b>
  );

  return (
    <div className="card mt-4 p-4 text-sm">
      <div className="overline mb-2">Diagnostics</div>
      <ul className="space-y-1 text-text-secondary">
        <li>Supabase configured: {yn(diag.configured)}</li>
        <li>Session exists: {yn(diag.sessionExists)}</li>
        <li>
          Profile role: <b className="text-cream">{diag.role ?? '—'}</b>
        </li>
        <li>
          Select error:{' '}
          <b className={diag.selectError ? 'text-danger' : 'text-text-muted'}>
            {diag.selectError ?? 'none'}
          </b>
        </li>
        <li>
          Rows returned: <b className="text-cream">{diag.rowCount}</b>
        </li>
      </ul>
      {hint && <p className="mt-3 text-text-muted">{hint}</p>}
    </div>
  );
}

function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  const styles: Record<ApplicationStatus, string> = {
    pending: 'bg-gold-soft text-gold',
    approved: 'bg-success-soft text-success',
    rejected: 'bg-[rgba(255,90,90,0.14)] text-danger',
  };
  return (
    <span
      className={`inline-flex items-center rounded-pill px-3 py-1 text-xs font-bold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function Info({
  label,
  value,
  full,
  link,
}: {
  label: string;
  value: string | null;
  full?: boolean;
  link?: boolean;
}) {
  return (
    <div className={`flex gap-2 ${full ? 'sm:col-span-2' : ''}`}>
      <dt className="w-20 shrink-0 text-text-muted">{label}</dt>
      <dd className="min-w-0 break-words text-text-secondary">
        {value ? (
          link ? (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {value}
            </a>
          ) : (
            value
          )
        ) : (
          '—'
        )}
      </dd>
    </div>
  );
}
