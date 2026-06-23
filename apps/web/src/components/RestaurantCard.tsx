import Link from 'next/link';
import type { MockRestaurant } from '@/data/catalog';
import { formatPHP } from '@/utils/format';

// Premium restaurant card — large photo, rating, ETA, delivery fee, cuisine tags.
// Mirrors the mobile RestaurantCard.
export function RestaurantCard({ restaurant }: { restaurant: MockRestaurant }) {
  const r = restaurant;
  return (
    <Link
      href={`/restaurants/${r.id}`}
      className="group card overflow-hidden shadow-card transition-transform duration-200 hover:-translate-y-1 hover:shadow-elevated"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-high">
        {r.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={r.image_url}
            alt={r.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {r.featured && (
          <span className="absolute left-3 top-3 rounded-pill bg-primary px-3 py-1 text-xs font-bold text-white">
            Featured
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold leading-tight">{r.name}</h3>
          <span className="flex shrink-0 items-center gap-1 text-sm font-bold text-gold">
            ★ {r.rating.toFixed(1)}
          </span>
        </div>
        <p className="mt-1 line-clamp-1 text-sm text-text-secondary">{r.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-text-muted">
          <span>{r.deliveryTime}</span>
          <span aria-hidden>·</span>
          <span>{formatPHP(r.deliveryFee)} delivery</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {r.cuisines.map((c) => (
            <span
              key={c}
              className="rounded-pill border border-border bg-surface-elevated px-2.5 py-1 text-xs text-text-secondary"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
