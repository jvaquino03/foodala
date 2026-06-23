'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import type { ApplicationStatus, RestaurantApplication } from '@/types/database';
import { formatDateTime } from '@/utils/format';

type Filter = 'all' | ApplicationStatus;
type Load = 'loading' | 'ready' | 'unconfigured' | 'error';

const STATUS_ORDER: Record<ApplicationStatus, number> = {
  pending: 0,
  approved: 1,
  rejected: 2,
};

// Admin review for restaurant partner applications. Reads + updates Supabase
// directly with the anon key (no auth yet — see the RLS note in the migration).
// Pending applications are listed first.
export function ApplicationsManager() {
  const [apps, setApps] = useState<RestaurantApplication[]>([]);
  const [load, setLoad] = useState<Load>('loading');
  const [filter, setFilter] = useState<Filter>('all');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoad('unconfigured');
      return;
    }
    const { data, error } = await supabase
      .from('restaurant_applications')
      .select('*')
      .order('created_at', { ascending: false });

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
