import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DELIVERY_FEE } from '@/utils/constants';
import type { MenuItem } from '@/types/database';

export type CartItem = {
  menuItemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
};

type CartState = {
  // The single restaurant the current cart belongs to (one-restaurant-per-order rule).
  restaurantId: string | null;
  restaurantName: string | null;
  items: CartItem[];

  // Returns true if an item from this restaurant can be added without clearing the cart.
  // (Empty cart, or cart already belongs to this restaurant.)
  canAdd: (restaurantId: string) => boolean;

  // Adds one unit of a menu item. Assumes the caller has already resolved any
  // cross-restaurant conflict (see canAdd) and that the item is available.
  addItem: (restaurantId: string, restaurantName: string, item: MenuItem) => void;

  increment: (menuItemId: string) => void;
  // Decrements; removes the line when quantity would reach 0.
  decrement: (menuItemId: string) => void;
  removeItem: (menuItemId: string) => void;
  clearCart: () => void;

  // Derived helpers.
  totalQuantity: () => number;
  subtotal: () => number;
  deliveryFee: () => number;
  total: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      restaurantId: null,
      restaurantName: null,
      items: [],

      canAdd: (restaurantId) => {
        const state = get();
        return state.items.length === 0 || state.restaurantId === restaurantId;
      },

      addItem: (restaurantId, restaurantName, item) =>
        set((state) => {
          // Switching restaurants: start a fresh cart.
          const switching = state.restaurantId !== null && state.restaurantId !== restaurantId;
          const baseItems = switching ? [] : state.items;

          const existing = baseItems.find((i) => i.menuItemId === item.id);
          const items = existing
            ? baseItems.map((i) =>
                i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i
              )
            : [
                ...baseItems,
                {
                  menuItemId: item.id,
                  name: item.name,
                  unitPrice: item.price,
                  quantity: 1,
                },
              ];

          return { restaurantId, restaurantName, items };
        }),

      increment: (menuItemId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.menuItemId === menuItemId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        })),

      decrement: (menuItemId) =>
        set((state) => {
          const items = state.items
            .map((i) =>
              i.menuItemId === menuItemId ? { ...i, quantity: i.quantity - 1 } : i
            )
            .filter((i) => i.quantity > 0);
          // Clearing the last item resets the restaurant binding.
          return items.length === 0
            ? { items, restaurantId: null, restaurantName: null }
            : { items };
        }),

      removeItem: (menuItemId) =>
        set((state) => {
          const items = state.items.filter((i) => i.menuItemId !== menuItemId);
          return items.length === 0
            ? { items, restaurantId: null, restaurantName: null }
            : { items };
        }),

      clearCart: () => set({ items: [], restaurantId: null, restaurantName: null }),

      totalQuantity: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
      deliveryFee: () => (get().items.length > 0 ? DELIVERY_FEE : 0),
      total: () => get().subtotal() + get().deliveryFee(),
    }),
    {
      name: 'foodala-cart',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist data, not the derived functions.
      partialize: (state) => ({
        restaurantId: state.restaurantId,
        restaurantName: state.restaurantName,
        items: state.items,
      }),
    }
  )
);
