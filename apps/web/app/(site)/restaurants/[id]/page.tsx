import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getMenuForRestaurant, getRestaurantById, MOCK_RESTAURANTS } from '@/data/catalog';
import { MenuNav } from '@/components/MenuNav';
import { formatPHP } from '@/utils/format';

// Pre-render a page for every mock restaurant.
export function generateStaticParams() {
  return MOCK_RESTAURANTS.map((r) => ({ id: r.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const r = getRestaurantById(params.id);
  if (!r) return { title: 'Restaurant not found' };
  return { title: r.name, description: r.description ?? undefined };
}

export default function RestaurantPage({ params }: { params: { id: string } }) {
  const restaurant = getRestaurantById(params.id);
  if (!restaurant) notFound();

  const { categories, items } = getMenuForRestaurant(restaurant.id);
  const navCategories = categories.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div>
      {/* Cover */}
      <div className="relative h-64 w-full overflow-hidden md:h-80">
        {restaurant.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={restaurant.image_url}
            alt={restaurant.name}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-content px-5 pb-6">
            <Link href="/restaurants" className="text-sm font-semibold text-text-secondary hover:text-white">
              ← All restaurants
            </Link>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
              {restaurant.name}
            </h1>
            <p className="mt-1 max-w-xl text-text-secondary">{restaurant.description}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-content px-5">
        {/* Stats */}
        <div className="flex flex-wrap gap-x-8 gap-y-2 border-b border-border py-5 text-sm">
          <Stat label="Rating" value={`★ ${restaurant.rating.toFixed(1)} (${restaurant.ratingCount})`} />
          <Stat label="Delivery" value={restaurant.deliveryTime} />
          <Stat label="Delivery fee" value={formatPHP(restaurant.deliveryFee)} />
          <Stat label="Address" value={`${restaurant.address}`} />
        </div>

        {navCategories.length > 0 && <MenuNav categories={navCategories} />}

        {/* Menu */}
        <div className="py-8">
          {categories.map((category) => {
            const categoryItems = items.filter((i) => i.category_id === category.id);
            if (categoryItems.length === 0) return null;
            return (
              <section key={category.id} id={category.id} className="scroll-mt-32 pb-10">
                <h2 className="h2 mb-4">{category.name}</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className={`card flex gap-4 p-3 ${item.is_available ? '' : 'opacity-60'}`}
                    >
                      {item.image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-24 w-24 shrink-0 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold leading-tight">{item.name}</h3>
                          <span className="shrink-0 font-bold text-cream">
                            {formatPHP(item.price)}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm text-text-secondary">
                          {item.description}
                        </p>
                        <div className="mt-auto pt-3">
                          {item.is_available ? (
                            <span className="text-xs font-semibold text-success">
                              Available
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-text-muted">
                              Sold out
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Order CTA — ordering happens in the Foodala mobile app (this site is
            the catalog/marketing surface). */}
        <div className="mb-16 rounded-2xl border border-border bg-surface p-6 text-center">
          <h3 className="text-lg font-bold">Hungry? Place your order in the Foodala app</h3>
          <p className="mt-1 text-sm text-text-secondary">
            Build your cart and check out with Cash on Delivery.
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="overline">{label}</div>
      <div className="mt-0.5 font-semibold">{value}</div>
    </div>
  );
}
