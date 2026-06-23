import { create } from 'zustand';
import type { CartItem } from '@/stores/cartStore';

// A fake, locally-created order (mock-data mode — nothing is sent to a backend).
export type PlacedOrder = {
  id: string; // e.g. "FOOD-123456"
  restaurantId: string;
  restaurantName: string | null;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryNotes: string | null;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
};

type OrderState = {
  // Only the most recent order is kept, in memory, to drive the confirmation screen.
  lastOrder: PlacedOrder | null;
  setLastOrder: (order: PlacedOrder) => void;
  clearLastOrder: () => void;
};

export const useOrderStore = create<OrderState>((set) => ({
  lastOrder: null,
  setLastOrder: (order) => set({ lastOrder: order }),
  clearLastOrder: () => set({ lastOrder: null }),
}));

/** Generates a friendly fake order id like "FOOD-123456". */
export function generateOrderId(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `FOOD-${n}`;
}
