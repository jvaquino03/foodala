import type { Metadata } from 'next';
import { MockForm, type Field } from '@/components/MockForm';

export const metadata: Metadata = {
  title: 'Restaurant Application',
  description: 'Apply to become a Foodala restaurant partner.',
};

const FIELDS: Field[] = [
  { name: 'business_name', label: 'Business Name', required: true, placeholder: 'e.g. Tasty Spoon' },
  { name: 'owner_name', label: 'Owner Name', required: true, placeholder: 'Full name' },
  { name: 'phone', label: 'Phone', type: 'tel', required: true, placeholder: '0917 555 0000' },
  { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'you@restaurant.com' },
  { name: 'address', label: 'Address', type: 'textarea', required: true, placeholder: 'Street, barangay, city' },
  {
    name: 'cuisine_type',
    label: 'Cuisine Type',
    type: 'select',
    required: true,
    options: ['Filipino', 'Burgers', 'Pizza', 'Japanese', 'Healthy', 'Desserts', 'Coffee', 'Other'],
  },
  { name: 'facebook', label: 'Facebook Page', type: 'url', placeholder: 'https://facebook.com/yourpage' },
  { name: 'website', label: 'Website', type: 'url', placeholder: 'https://yourrestaurant.com' },
];

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
        <MockForm
          fields={FIELDS}
          submitLabel="Submit application"
          successTitle="Application received"
          successMessage="Application received. Our team will contact you soon."
        />
      </div>
    </div>
  );
}
