import type { Metadata } from 'next';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s · Foodala Admin' },
  description: 'Foodala admin dashboard.',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
          <span className="text-sm font-semibold text-text-secondary">
            Foodala Operations · Davao City
          </span>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-text-muted sm:block">
              Mock data mode
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-pill bg-primary text-sm font-bold text-white">
              A
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
