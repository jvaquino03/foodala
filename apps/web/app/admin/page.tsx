import Link from 'next/link';
import { MOCK_ORDERS } from '@/data/orders';
import { getRestaurants, restaurantName } from '@/data/catalog';
import { StatusBadge } from '@/components/StatusBadge';
import { formatPHP, formatDateTime } from '@/utils/format';

export default function AdminDashboard() {
  const orders = MOCK_ORDERS;
  const restaurants = getRestaurants();

  const revenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  const activeOrders = orders.filter(
    (o) => o.status === 'pending' || o.status === 'confirmed' || o.status === 'preparing'
  ).length;
  const delivered = orders.filter((o) => o.status === 'delivered').length;

  const recent = [...orders].slice(0, 5);

  return (
    <div>
      <h1 className="h1">Dashboard</h1>
      <p className="mt-1 text-text-secondary">An overview of today&apos;s operations.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Revenue (excl. cancelled)" value={formatPHP(revenue)} accent />
        <StatCard label="Active orders" value={String(activeOrders)} />
        <StatCard label="Delivered" value={String(delivered)} />
        <StatCard label="Restaurants" value={String(restaurants.length)} />
      </div>

      <div className="mt-10 flex items-end justify-between">
        <h2 className="h2">Recent orders</h2>
        <Link href="/admin/orders" className="text-sm font-semibold text-primary hover:underline">
          Manage all orders →
        </Link>
      </div>

      <div className="card mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-border text-left text-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Restaurant</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Placed</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-semibold">{o.id}</td>
                  <td className="px-4 py-3 text-text-secondary">{restaurantName(o.restaurant_id)}</td>
                  <td className="px-4 py-3 text-text-secondary">{o.customer_name}</td>
                  <td className="px-4 py-3 font-semibold text-cream">{formatPHP(o.total)}</td>
                  <td className="px-4 py-3 text-text-muted">{formatDateTime(o.created_at)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`card p-5 ${accent ? 'border-primary/40' : ''}`}>
      <div className="overline">{label}</div>
      <div className={`mt-2 text-2xl font-extrabold ${accent ? 'text-primary' : ''}`}>
        {value}
      </div>
    </div>
  );
}
