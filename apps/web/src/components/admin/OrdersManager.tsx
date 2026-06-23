'use client';

import { useMemo, useState } from 'react';
import type { OrderStatus } from '@/types/database';
import { ORDER_STATUSES, type AdminOrder } from '@/data/orders';
import { restaurantName } from '@/data/catalog';
import { StatusBadge } from '@/components/StatusBadge';
import { formatPHP, formatDateTime } from '@/utils/format';

type Filter = 'all' | OrderStatus;

// Client-side orders manager. In mock-data mode it mutates local state; wired to
// Supabase it would PATCH the order's status. Lets staff filter, expand line
// items, and advance an order's status.
export function OrdersManager({ initialOrders }: { initialOrders: AdminOrder[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState<Filter>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    for (const s of ORDER_STATUSES) c[s] = orders.filter((o) => o.status === s).length;
    return c;
  }, [orders]);

  const visible = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  function updateStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  const tabs: Filter[] = ['all', ...ORDER_STATUSES];

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`rounded-pill px-4 py-2 text-sm font-semibold capitalize transition-colors ${
              filter === t
                ? 'bg-primary text-white'
                : 'border border-border bg-surface text-text-secondary hover:text-white'
            }`}
          >
            {t} <span className="opacity-60">({counts[t] ?? 0})</span>
          </button>
        ))}
      </div>

      <div className="card mt-5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-border text-left text-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Restaurant</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Placed</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Update</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((o) => (
                <FragmentRow
                  key={o.id}
                  order={o}
                  expanded={expanded === o.id}
                  onToggle={() => setExpanded((cur) => (cur === o.id ? null : o.id))}
                  onStatus={(s) => updateStatus(o.id, s)}
                />
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-text-muted">
                    No orders in this view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FragmentRow({
  order,
  expanded,
  onToggle,
  onStatus,
}: {
  order: AdminOrder;
  expanded: boolean;
  onToggle: () => void;
  onStatus: (s: OrderStatus) => void;
}) {
  return (
    <>
      <tr className="border-b border-border last:border-0">
        <td className="px-4 py-3">
          <button onClick={onToggle} className="font-semibold hover:text-primary">
            {order.id} <span className="text-text-muted">{expanded ? '▲' : '▼'}</span>
          </button>
        </td>
        <td className="px-4 py-3 text-text-secondary">{restaurantName(order.restaurant_id)}</td>
        <td className="px-4 py-3 text-text-secondary">{order.customer_name}</td>
        <td className="px-4 py-3 font-semibold text-cream">{formatPHP(order.total)}</td>
        <td className="px-4 py-3 text-text-muted">{formatDateTime(order.created_at)}</td>
        <td className="px-4 py-3">
          <StatusBadge status={order.status} />
        </td>
        <td className="px-4 py-3">
          <select
            value={order.status}
            onChange={(e) => onStatus(e.target.value as OrderStatus)}
            className="rounded-md border border-border-strong bg-surface-elevated px-2 py-1.5 text-sm capitalize text-white outline-none focus:border-primary"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-border bg-surface-elevated last:border-0">
          <td colSpan={7} className="px-4 py-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <div className="overline mb-2">Items</div>
                <ul className="space-y-1.5">
                  {order.items.map((it) => (
                    <li key={it.id} className="flex justify-between text-sm">
                      <span className="text-text-secondary">
                        {it.quantity}× {it.item_name}
                      </span>
                      <span className="font-semibold">{formatPHP(it.total_price)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
                  <Row label="Subtotal" value={formatPHP(order.subtotal)} />
                  <Row label="Delivery fee" value={formatPHP(order.delivery_fee)} />
                  <Row label="Total" value={formatPHP(order.total)} strong />
                </div>
              </div>
              <div>
                <div className="overline mb-2">Delivery</div>
                <dl className="space-y-1.5 text-sm">
                  <Info label="Phone" value={order.customer_phone} />
                  <Info label="Address" value={order.delivery_address} />
                  <Info label="Notes" value={order.delivery_notes ?? '—'} />
                  <Info label="Payment" value="Cash on Delivery" />
                </dl>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between ${strong ? 'font-bold text-cream' : 'text-text-secondary'}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-20 shrink-0 text-text-muted">{label}</dt>
      <dd className="text-text-secondary">{value}</dd>
    </div>
  );
}
