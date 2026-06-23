// Hand-written types mirroring the Supabase schema in
// apps/customer-mobile/supabase/migrations/0001_init.sql. Kept identical to the
// mobile app's src/types/database.ts so both apps speak the same data shapes.
// Can be replaced later by generated types (`supabase gen types typescript`).

export type Restaurant = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  address: string | null;
  city: string | null;
  is_active: boolean;
  created_at: string;
};

export type MenuCategory = {
  id: string;
  restaurant_id: string;
  name: string;
  sort_order: number;
};

export type MenuItem = {
  id: string;
  restaurant_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
};

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  restaurant_id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_notes: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: string;
  status: OrderStatus;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

// A menu category with its items attached, used by the restaurant detail page.
export type MenuCategoryWithItems = MenuCategory & {
  items: MenuItem[];
};
