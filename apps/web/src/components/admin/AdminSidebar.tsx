'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/Logo';

const NAV: { href: string; label: string; icon: string }[] = [
  { href: '/admin', label: 'Dashboard', icon: '▤' },
  { href: '/admin/orders', label: 'Orders', icon: '🧾' },
  { href: '/admin/restaurants', label: 'Restaurants', icon: '🍽' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Logo href="/admin" />
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV.map((item) => {
          const active =
            item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? 'bg-primary-soft text-white'
                  : 'text-text-secondary hover:bg-surface-high hover:text-white'
              }`}
            >
              <span aria-hidden className="w-5 text-center">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-text-secondary hover:bg-surface-high hover:text-white"
        >
          <span aria-hidden className="w-5 text-center">
            ←
          </span>
          View website
        </Link>
      </div>
    </aside>
  );
}
