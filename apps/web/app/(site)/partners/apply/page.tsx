import type { Metadata } from 'next';
import { RestaurantApplicationForm } from '@/components/RestaurantApplicationForm';

export const metadata: Metadata = {
  title: 'Restaurant Application',
  description: 'Apply to become a Foodala restaurant partner.',
};

export default function PartnersApplyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <span className="overline text-gold">For Restaurants</span>
      <h1 className="mt-2 h1">Partner application</h1>
      <p className="mt-2 text-text-secondary">
        Tell us about your restaurant. Our team will review and reach out with next
        steps.
      </p>
      <div className="mt-8">
        <RestaurantApplicationForm />
      </div>
    </div>
  );
}
