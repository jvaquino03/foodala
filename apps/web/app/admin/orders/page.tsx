import type { Metadata } from 'next';
import { MOCK_ORDERS } from '@/data/orders';
import { OrdersManager } from '@/components/admin/OrdersManager';

export const metadata: Metadata = { title: 'Orders' };

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="h1">Orders</h1>
      <p className="mt-1 text-text-secondary">
        Track and update order status. Click an order to see its line items and
        delivery details.
      </p>
      <div className="mt-8">
        <OrdersManager initialOrders={MOCK_ORDERS} />
      </div>
    </div>
  );
}
