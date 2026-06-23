// Mock orders powering the admin dashboard in mock-data mode. These mirror the
// `orders` / `order_items` schema. In a real backend they'd come from Supabase;
// here they seed an in-memory store the admin UI can read and mutate.

import type { Order, OrderItem, OrderStatus } from '@/types/database';

export type AdminOrder = Order & { items: OrderItem[] };

export const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'preparing',
  'delivered',
  'cancelled',
];

// Fixed timestamps keep the table deterministic across renders.
export const MOCK_ORDERS: AdminOrder[] = [
  {
    id: 'FOOD-100231',
    restaurant_id: 'r2',
    customer_name: 'Maria Santos',
    customer_phone: '0917 555 0142',
    delivery_address: '24 Ponciano St, Davao City',
    delivery_notes: 'Leave at the gate, ring twice.',
    subtotal: 390,
    delivery_fee: 50,
    total: 440,
    payment_method: 'cash_on_delivery',
    status: 'pending',
    created_at: '2026-06-20T13:42:00.000Z',
    items: [
      { id: 'oi1', order_id: 'FOOD-100231', menu_item_id: 'i8', item_name: 'Double Bacon', quantity: 1, unit_price: 230, total_price: 230 },
      { id: 'oi2', order_id: 'FOOD-100231', menu_item_id: 'i10', item_name: 'Hand-cut Fries', quantity: 2, unit_price: 80, total_price: 160 },
    ],
  },
  {
    id: 'FOOD-100230',
    restaurant_id: 'r4',
    customer_name: 'Jollibee Cruz',
    customer_phone: '0918 222 7781',
    delivery_address: '5 Quimpo Blvd, Davao City',
    delivery_notes: null,
    subtotal: 700,
    delivery_fee: 50,
    total: 750,
    payment_method: 'cash_on_delivery',
    status: 'preparing',
    created_at: '2026-06-20T13:05:00.000Z',
    items: [
      { id: 'oi3', order_id: 'FOOD-100230', menu_item_id: 'i19', item_name: 'Pepperoni', quantity: 1, unit_price: 380, total_price: 380 },
      { id: 'oi4', order_id: 'FOOD-100230', menu_item_id: 'i18', item_name: 'Margherita', quantity: 1, unit_price: 320, total_price: 320 },
    ],
  },
  {
    id: 'FOOD-100229',
    restaurant_id: 'r1',
    customer_name: 'Andres Bonifacio',
    customer_phone: '0920 444 9913',
    delivery_address: '12 Mabini St, Poblacion, Davao City',
    delivery_notes: 'Extra rice please.',
    subtotal: 270,
    delivery_fee: 50,
    total: 320,
    payment_method: 'cash_on_delivery',
    status: 'confirmed',
    created_at: '2026-06-20T12:18:00.000Z',
    items: [
      { id: 'oi5', order_id: 'FOOD-100229', menu_item_id: 'i1', item_name: 'Chicken Adobo', quantity: 1, unit_price: 180, total_price: 180 },
      { id: 'oi6', order_id: 'FOOD-100229', menu_item_id: 'i4', item_name: 'Garlic Rice', quantity: 2, unit_price: 45, total_price: 90 },
    ],
  },
  {
    id: 'FOOD-100228',
    restaurant_id: 'r3',
    customer_name: 'Gabriela Silang',
    customer_phone: '0915 010 2244',
    delivery_address: '88 Rizal Ave, Davao City',
    delivery_notes: null,
    subtotal: 480,
    delivery_fee: 50,
    total: 530,
    payment_method: 'cash_on_delivery',
    status: 'delivered',
    created_at: '2026-06-20T11:02:00.000Z',
    items: [
      { id: 'oi7', order_id: 'FOOD-100228', menu_item_id: 'i13', item_name: 'California Roll', quantity: 1, unit_price: 220, total_price: 220 },
      { id: 'oi8', order_id: 'FOOD-100228', menu_item_id: 'i14', item_name: 'Spicy Tuna Roll', quantity: 1, unit_price: 260, total_price: 260 },
    ],
  },
  {
    id: 'FOOD-100227',
    restaurant_id: 'r5',
    customer_name: 'Jose Rizal',
    customer_phone: '0917 888 3320',
    delivery_address: '47 Bajada Rd, Davao City',
    delivery_notes: 'No onions.',
    subtotal: 320,
    delivery_fee: 50,
    total: 370,
    payment_method: 'cash_on_delivery',
    status: 'cancelled',
    created_at: '2026-06-19T19:47:00.000Z',
    items: [
      { id: 'oi9', order_id: 'FOOD-100227', menu_item_id: 'i23', item_name: 'Caesar Salad', quantity: 1, unit_price: 180, total_price: 180 },
      { id: 'oi10', order_id: 'FOOD-100227', menu_item_id: 'i26', item_name: 'Mango Smoothie', quantity: 1, unit_price: 130, total_price: 130 },
    ],
  },
  {
    id: 'FOOD-100226',
    restaurant_id: 'r2',
    customer_name: 'Melchora Aquino',
    customer_phone: '0919 121 6655',
    delivery_address: '210 Torres St, Davao City',
    delivery_notes: null,
    subtotal: 255,
    delivery_fee: 50,
    total: 305,
    payment_method: 'cash_on_delivery',
    status: 'delivered',
    created_at: '2026-06-19T18:30:00.000Z',
    items: [
      { id: 'oi11', order_id: 'FOOD-100226', menu_item_id: 'i7', item_name: 'Classic Smash', quantity: 1, unit_price: 160, total_price: 160 },
      { id: 'oi12', order_id: 'FOOD-100226', menu_item_id: 'i12', item_name: 'Chocolate Shake', quantity: 1, unit_price: 120, total_price: 120 },
    ],
  },
];
