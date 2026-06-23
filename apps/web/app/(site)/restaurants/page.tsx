import type { Metadata } from 'next';
import { getRestaurants } from '@/data/catalog';
import { RestaurantCard } from '@/components/RestaurantCard';

export const metadata: Metadata = {
  title: 'Restaurants',
  description: 'All restaurants delivering in Davao City right now.',
};

export default function RestaurantsPage() {
  const restaurants = getRestaurants();
  return (
    <div className="mx-auto max-w-content px-5 py-12">
      <h1 className="h1">Restaurants</h1>
      <p className="mt-2 text-text-secondary">
        {restaurants.length} restaurants delivering in Davao City.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((r) => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
      </div>
    </div>
  );
}
