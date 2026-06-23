import Link from 'next/link';
import { getFeaturedRestaurants, getRestaurants, HERO_IMAGE, HOME_CATEGORIES } from '@/data/catalog';
import { RestaurantCard } from '@/components/RestaurantCard';

export default function HomePage() {
  const featured = getFeaturedRestaurants();
  const all = getRestaurants();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        </div>
        <div className="relative mx-auto max-w-content px-5 py-24 md:py-32">
          <span className="overline text-gold">Davao City · Cash on Delivery</span>
          <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
            Great food, <span className="text-primary">delivered</span> to your door.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-text-secondary">
            Browse the city&apos;s best restaurants, build your cart, and order in
            minutes. No app required.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/restaurants" className="btn-primary">
              Browse restaurants
            </Link>
            <Link href="/#how-it-works" className="btn-ghost">
              How it works
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-content px-5 py-14">
        <div className="flex items-end justify-between">
          <h2 className="h2">Browse by category</h2>
          <Link href="/restaurants" className="text-sm font-semibold text-primary hover:underline">
            See all →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-6">
          {HOME_CATEGORIES.map((c) => (
            <Link
              key={c.key}
              href="/restaurants"
              className="group relative aspect-square overflow-hidden rounded-xl border border-border"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.image}
                alt={c.label}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
              <span className="absolute inset-x-0 bottom-2 text-center text-sm font-bold">
                {c.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-content px-5 py-6">
        <h2 className="h2">Featured restaurants</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-content px-5 py-16">
        <h2 className="h2 text-center">How it works</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            ['1', 'Pick a restaurant', 'Browse menus and photos from the best spots in town.'],
            ['2', 'Build your order', 'Add items to your cart and review your total.'],
            ['3', 'Pay on delivery', 'We bring it to your door. Pay with cash, no fuss.'],
          ].map(([n, title, body]) => (
            <div key={n} className="card p-6">
              <span className="grid h-10 w-10 place-items-center rounded-pill bg-primary-soft font-extrabold text-primary">
                {n}
              </span>
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* All restaurants strip */}
      <section className="mx-auto max-w-content px-5 pb-20">
        <div className="flex items-end justify-between">
          <h2 className="h2">All restaurants</h2>
          <span className="text-sm text-text-muted">{all.length} open now</span>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      </section>
    </>
  );
}
