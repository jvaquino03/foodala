import type { Metadata } from 'next';
import { ApplicationsManager } from '@/components/admin/ApplicationsManager';

export const metadata: Metadata = { title: 'Restaurant Applications' };

export default function AdminApplicationsPage() {
  return (
    <div>
      <h1 className="h1">Restaurant Applications</h1>
      <p className="mt-1 text-text-secondary">
        Review partner applications submitted from the public site. Pending applications appear
        first.
      </p>
      <ApplicationsManager />
    </div>
  );
}
