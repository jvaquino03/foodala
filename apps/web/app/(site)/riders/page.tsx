import type { Metadata } from 'next';
import { RecruitLanding } from '@/components/RecruitLanding';

export const metadata: Metadata = {
  title: 'Become a Rider',
  description:
    'Deliver with Foodala — flexible schedule, competitive earnings, fast payouts, and local deliveries.',
};

export default function RidersPage() {
  return (
    <RecruitLanding
      eyebrow="For Riders"
      title="Ride, deliver, and earn with"
      highlight="Foodala."
      subtitle="Be your own boss. Pick your hours, deliver around your city, and get paid fast — all with a local team behind you."
      ctaLabel="Apply as Rider"
      ctaHref="/riders/apply"
      heroImage="https://www.themealdb.com/images/media/meals/usywpp1511189717.jpg"
      benefits={[
        {
          icon: '🗓️',
          title: 'Flexible schedule',
          body: 'Go online whenever it suits you. Work full-time, part-time, or weekends only.',
        },
        {
          icon: '💰',
          title: 'Competitive earnings',
          body: 'Earn per delivery plus tips, with clear, upfront rates on every trip.',
        },
        {
          icon: '⚡',
          title: 'Fast payouts',
          body: 'Get your earnings quickly — no long waits between rides and payday.',
        },
        {
          icon: '📍',
          title: 'Local deliveries',
          body: 'Stay close to home with short, city-wide routes you already know.',
        },
      ]}
    />
  );
}
