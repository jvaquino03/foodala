'use client';

import { useState } from 'react';

export type Field = {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: string[]; // for type: 'select'
  full?: boolean; // span both columns in the 2-col grid
};

// Generic mock application form. No backend — on submit it prevents default and
// renders a success card. Used by the restaurant and rider apply pages.
export function MockForm({
  fields,
  submitLabel,
  successTitle,
  successMessage,
}: {
  fields: Field[];
  submitLabel: string;
  successTitle: string;
  successMessage: string;
}) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="card p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-pill bg-success-soft text-2xl text-success">
          ✓
        </div>
        <h2 className="mt-4 text-xl font-bold">{successTitle}</h2>
        <p className="mt-2 text-text-secondary">{successMessage}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="card p-6 sm:p-8"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={f.type === 'textarea' || f.full ? 'sm:col-span-2' : ''}>
            <label htmlFor={f.name} className="mb-1.5 block text-sm font-semibold">
              {f.label}
              {f.required && <span className="text-primary"> *</span>}
            </label>
            {f.type === 'select' ? (
              <select
                id={f.name}
                name={f.name}
                required={f.required}
                defaultValue=""
                className="w-full rounded-md border border-border-strong bg-surface-elevated px-3 py-2.5 text-white outline-none focus:border-primary"
              >
                <option value="" disabled>
                  Select…
                </option>
                {f.options?.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea
                id={f.name}
                name={f.name}
                required={f.required}
                placeholder={f.placeholder}
                rows={3}
                className="w-full rounded-md border border-border-strong bg-surface-elevated px-3 py-2.5 text-white placeholder:text-text-muted outline-none focus:border-primary"
              />
            ) : (
              <input
                id={f.name}
                name={f.name}
                type={f.type ?? 'text'}
                required={f.required}
                placeholder={f.placeholder}
                className="w-full rounded-md border border-border-strong bg-surface-elevated px-3 py-2.5 text-white placeholder:text-text-muted outline-none focus:border-primary"
              />
            )}
          </div>
        ))}
      </div>
      <button type="submit" className="btn-primary mt-7 w-full sm:w-auto">
        {submitLabel}
      </button>
    </form>
  );
}
