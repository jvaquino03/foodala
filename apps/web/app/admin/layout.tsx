import type { Metadata } from 'next';
import { AdminShell } from '@/components/admin/AdminShell';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s · Foodala Admin' },
  description: 'Foodala admin dashboard.',
  robots: { index: false, follow: false },
};

// AdminShell (client) guards every /admin route — unauthenticated users are sent
// to /login and non-admins are denied — and renders the sidebar + header chrome.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
