import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'Rider Portal',
  description: 'The Foodala rider portal is coming soon.',
  robots: { index: false, follow: false },
};

export default function RiderPortalPage() {
  return (
    <ComingSoon
      eyebrow="Rider Portal"
      title="Your deliveries, in one place"
      description="A dedicated home for Foodala riders to manage deliveries and track earnings."
      features={[
        { icon: '📦', label: 'Assigned deliveries' },
        { icon: '🛵', label: 'Pickup status' },
        { icon: '✅', label: 'Delivery status' },
        { icon: '💰', label: 'Earnings' },
      ]}
    />
  );
}
