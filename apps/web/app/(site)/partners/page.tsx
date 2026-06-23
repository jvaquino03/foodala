import type { Metadata } from 'next';
import { RecruitLanding } from '@/components/RecruitLanding';

export const metadata: Metadata = {
  title: 'Become a Partner',
  description:
    'Grow your restaurant with Foodala — lower commissions, a local-first marketplace, fast onboarding, and direct support.',
};

export default function PartnersPage() {
  return (
    <RecruitLanding
      eyebrow="For Restaurants"
      title="Grow your restaurant with"
      highlight="Foodala."
      subtitle="Join the local-first delivery marketplace built for Davao City. Reach more customers, keep more of every sale, and get live in days."
      ctaLabel="Apply Now"
      ctaHref="/partners/apply"
      heroImage="https://www.themealdb.com/images/media/meals/lrfdwz1764438393.jpg"
      benefits={[
        {
          icon: '💸',
          title: 'Lower commissions',
          body: 'Keep more of every order. Our rates are built for local restaurants, not global chains.',
        },
        {
          icon: '📍',
          title: 'Local-first marketplace',
          body: 'We focus on one city at a time, so hungry customers nearby find you first.',
        },
        {
          icon: '⚡',
          title: 'Fast onboarding',
          body: 'Send your details and menu — most partners go live within a few days.',
        },
        {
          icon: '🤝',
          title: 'Direct support',
          body: 'A real local team you can reach, not a ticket queue. We help you succeed.',
        },
      ]}
    />
  );
}
