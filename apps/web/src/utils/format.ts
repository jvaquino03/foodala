// Display a number as Philippine Peso, e.g. 50 -> "₱50.00".
export function formatPHP(amount: number): string {
  return `₱${amount.toFixed(2)}`;
}

// Fixed business rules for Phase 1 (kept in sync with the mobile app).
export const DELIVERY_FEE = 50;
export const PAYMENT_METHOD = 'cash_on_delivery';
export const PAYMENT_METHOD_LABEL = 'Cash on Delivery';

// Short, readable date for tables: "Jun 20, 2026 · 2:14 PM".
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
