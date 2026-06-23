'use client';

import { useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import type { RestaurantApplicationInsert } from '@/types/database';

const CUISINES = [
  'Filipino',
  'Burgers',
  'Pizza',
  'Japanese',
  'Healthy',
  'Desserts',
  'Coffee',
  'Other',
];

type FormState = 'idle' | 'submitting' | 'success' | 'error';

// Restaurant partner application form, wired to Supabase. On submit it validates
// the required fields, inserts a row into `restaurant_applications`, and shows
// loading / success / error states. No auth is involved (public anon insert).
export function RestaurantApplicationForm() {
  const [state, setState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (state === 'success') {
    return (
      <div className="card p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-pill bg-success-soft text-2xl text-success">
          ✓
        </div>
        <h2 className="mt-4 text-xl font-bold">Application received</h2>
        <p className="mt-2 text-text-secondary">
          Application received. Our team will contact you soon.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const get = (k: string) => (data.get(k) as string | null)?.trim() ?? '';

    const payload: RestaurantApplicationInsert = {
      business_name: get('business_name'),
      owner_name: get('owner_name'),
      phone: get('phone'),
      email: get('email'),
      address: get('address'),
      cuisine_type: get('cuisine_type'),
      facebook_page: get('facebook_page') || null,
      website: get('website') || null,
    };

    // Validate required fields (the browser also enforces `required`, this is a
    // safety net + a single clear message).
    const missing =
      !payload.business_name ||
      !payload.owner_name ||
      !payload.phone ||
      !payload.email ||
      !payload.address ||
      !payload.cuisine_type;
    if (missing) {
      setState('error');
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setState('error');
      setErrorMsg(
        'Applications are temporarily unavailable. Please try again later or contact us directly.'
      );
      return;
    }

    setState('submitting');
    const { error } = await supabase.from('restaurant_applications').insert(payload);

    // Dev-only logging (no secrets — never the anon key or tokens).
    if (process.env.NODE_ENV === 'development') {
      if (error) {
        console.error('[partners/apply] insert error:', error.message, error);
      } else {
        console.log('[partners/apply] insert ok — application submitted.');
      }
    }

    if (error) {
      setState('error');
      setErrorMsg('Something went wrong submitting your application. Please try again.');
      return;
    }

    setState('success');
  }

  const submitting = state === 'submitting';

  return (
    <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Text name="business_name" label="Business Name" required placeholder="e.g. Tasty Spoon" />
        <Text name="owner_name" label="Owner Name" required placeholder="Full name" />
        <Text name="phone" label="Phone" type="tel" required placeholder="0917 555 0000" />
        <Text name="email" label="Email" type="email" required placeholder="you@restaurant.com" />

        <div className="sm:col-span-2">
          <Label htmlFor="address" required>
            Address
          </Label>
          <textarea
            id="address"
            name="address"
            required
            rows={3}
            placeholder="Street, barangay, city"
            className={inputClass}
          />
        </div>

        <div>
          <Label htmlFor="cuisine_type" required>
            Cuisine Type
          </Label>
          <select
            id="cuisine_type"
            name="cuisine_type"
            required
            defaultValue=""
            className={inputClass}
          >
            <option value="" disabled>
              Select…
            </option>
            {CUISINES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <Text
          name="facebook_page"
          label="Facebook Page"
          type="url"
          placeholder="https://facebook.com/yourpage"
        />
        <Text
          name="website"
          label="Website"
          type="url"
          full
          placeholder="https://yourrestaurant.com"
        />
      </div>

      {state === 'error' && errorMsg && (
        <p
          role="alert"
          className="mt-5 rounded-md border border-danger/40 bg-[rgba(255,90,90,0.10)] px-4 py-3 text-sm text-danger"
        >
          {errorMsg}
        </p>
      )}

      <button type="submit" disabled={submitting} className="btn-primary mt-7 w-full sm:w-auto">
        {submitting ? 'Submitting…' : 'Submit application'}
      </button>
    </form>
  );
}

const inputClass =
  'w-full rounded-md border border-border-strong bg-surface-elevated px-3 py-2.5 text-white placeholder:text-text-muted outline-none focus:border-primary';

function Label({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold">
      {children}
      {required && <span className="text-primary"> *</span>}
    </label>
  );
}

function Text({
  name,
  label,
  type = 'text',
  required,
  placeholder,
  full,
}: {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'url';
  required?: boolean;
  placeholder?: string;
  full?: boolean;
}) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}
