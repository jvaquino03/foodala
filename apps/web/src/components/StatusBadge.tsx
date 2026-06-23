import type { OrderStatus } from '@/types/database';

const STYLES: Record<OrderStatus, string> = {
  pending: 'bg-gold-soft text-gold',
  confirmed: 'bg-primary-soft text-primary',
  preparing: 'bg-gold-soft text-gold',
  delivered: 'bg-success-soft text-success',
  cancelled: 'bg-[rgba(255,90,90,0.14)] text-danger',
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-3 py-1 text-xs font-bold capitalize ${STYLES[status]}`}
    >
      {status}
    </span>
  );
}
