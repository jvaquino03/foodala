import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'Restaurant Portal',
  description: 'The Foodala restaurant portal is coming soon.',
  robots: { index: false, follow: false },
};

export default function RestaurantPortalPage() {
  return (
    <ComingSoon
      eyebrow="Restaurant Portal"
      title="Manage your store, your way"
      description="A dedicated home for partner restaurants to run day-to-day operations on Foodala."
      features={[
        { icon: '🧾', label: 'Restaurant orders' },
        { icon: '🍽', label: 'Menu management' },
        { icon: '🕒', label: 'Store hours' },
        { icon: '📊', label: 'Reports' },
        { icon: '💰', label: 'Payouts' },
      ]}
    />
  );
}
