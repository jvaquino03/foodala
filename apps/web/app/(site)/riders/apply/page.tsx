import type { Metadata } from 'next';
import { MockForm, type Field } from '@/components/MockForm';

export const metadata: Metadata = {
  title: 'Rider Application',
  description: 'Apply to become a Foodala delivery rider.',
};

const FIELDS: Field[] = [
  { name: 'name', label: 'Name', required: true, placeholder: 'Full name' },
  { name: 'phone', label: 'Phone', type: 'tel', required: true, placeholder: '0917 555 0000' },
  { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'you@email.com' },
  {
    name: 'vehicle_type',
    label: 'Vehicle Type',
    type: 'select',
    required: true,
    options: ['Motorcycle', 'Scooter', 'Bicycle', 'Car'],
  },
  { name: 'license_number', label: 'License Number', required: true, placeholder: 'e.g. N01-23-456789' },
  {
    name: 'availability',
    label: 'Availability',
    type: 'select',
    required: true,
    options: ['Full-time', 'Part-time', 'Weekends only', 'Evenings only'],
  },
];

export default function RidersApplyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <span className="overline text-gold">For Riders</span>
      <h1 className="mt-2 h1">Rider application</h1>
      <p className="mt-2 text-text-secondary">
        Tell us a bit about you and your vehicle. Our team will review and reach
        out with next steps.
      </p>
      <div className="mt-8">
        <MockForm
          fields={FIELDS}
          submitLabel="Submit application"
          successTitle="Application received"
          successMessage="Rider application received. Our team will contact you soon."
        />
      </div>
    </div>
  );
}
