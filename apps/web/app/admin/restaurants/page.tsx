import type { Metadata } from 'next';
import { getRestaurants, getMenuForRestaurant } from '@/data/catalog';
import { formatPHP } from '@/utils/format';

export const metadata: Metadata = { title: 'Restaurants' };

export default function AdminRestaurantsPage() {
  const restaurants = getRestaurants();

  return (
    <div>
      <h1 className="h1">Restaurants</h1>
      <p className="mt-1 text-text-secondary">
        {restaurants.length} restaurants and their live menus.
      </p>

      <div className="mt-8 space-y-6">
        {restaurants.map((r) => {
          const { items } = getMenuForRestaurant(r.id);
          const available = items.filter((i) => i.is_available).length;
          return (
            <div key={r.id} className="card overflow-hidden">
              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                {r.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.image_url}
                    alt={r.name}
                    className="h-20 w-28 shrink-0 rounded-lg object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold">{r.name}</h2>
                    <span
                      className={`rounded-pill px-2.5 py-0.5 text-xs font-bold ${
                        r.is_active ? 'bg-success-soft text-success' : 'bg-surface-high text-text-muted'
                      }`}
                    >
                      {r.is_active ? 'Active' : 'Hidden'}
                    </span>
                    {r.featured && (
                      <span className="rounded-pill bg-primary-soft px-2.5 py-0.5 text-xs font-bold text-primary">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">{r.description}</p>
                  <p className="mt-1 text-xs text-text-muted">
                    {r.address} · {r.city}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center sm:gap-6">
                  <Metric label="Rating" value={`★ ${r.rating.toFixed(1)}`} />
                  <Metric label="Menu" value={String(items.length)} />
                  <Metric label="Available" value={String(available)} />
                </div>
              </div>

              <details className="border-t border-border">
                <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-text-secondary hover:text-white">
                  View menu ({items.length} items)
                </summary>
                <div className="grid grid-cols-1 gap-x-8 gap-y-1 px-4 pb-4 sm:grid-cols-2">
                  {items.map((it) => (
                    <div
                      key={it.id}
                      className="flex items-center justify-between border-b border-border py-2 text-sm last:border-0"
                    >
                      <span className={it.is_available ? '' : 'text-text-muted line-through'}>
                        {it.name}
                      </span>
                      <span className="font-semibold text-cream">{formatPHP(it.price)}</span>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-lg font-extrabold">{value}</div>
      <div className="overline">{label}</div>
    </div>
  );
}
