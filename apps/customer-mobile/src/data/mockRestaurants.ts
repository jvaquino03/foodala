// Local mock data — the app runs entirely on this in mock-data mode (no Supabase).
// Shapes mirror the database types so screens stay backend-agnostic; the extra
// presentation fields (rating, delivery ETA, cuisine tags, etc.) live on a
// MockRestaurant superset used only for display.

import type { MenuCategory, MenuItem, Restaurant } from '@/types/database';

// Real, dish-accurate food photography. Stable CDN URLs harvested from
// TheMealDB (meals) and TheCocktailDB (drinks) — guaranteed food/beverage
// images, unlike keyword search. Keyed by restaurant / category / item id.
const IMG: Record<string, string> = {
  // restaurants
  r1: 'https://www.themealdb.com/images/media/meals/pkopc31683207947.jpg',
  r2: 'https://www.themealdb.com/images/media/meals/lgmnff1763789847.jpg',
  r3: 'https://www.themealdb.com/images/media/meals/g046bb1663960946.jpg',
  r4: 'https://www.themealdb.com/images/media/meals/lrfdwz1764438393.jpg',
  r5: 'https://www.themealdb.com/images/media/meals/zry07j1763779321.jpg',
  // categories
  cat_burgers: 'https://www.themealdb.com/images/media/meals/44bzep1761848278.jpg',
  cat_pizza: 'https://www.themealdb.com/images/media/meals/wf49qs1763075222.jpg',
  cat_filipino: 'https://www.themealdb.com/images/media/meals/41cxjh1683207682.jpg',
  cat_coffee: 'https://www.thecocktaildb.com/images/media/drink/ytprxy1454513855.jpg',
  cat_desserts: 'https://www.themealdb.com/images/media/meals/wkhg581762773124.jpg',
  cat_chicken: 'https://www.themealdb.com/images/media/meals/020z181619788503.jpg',
  // items
  i1: 'https://www.themealdb.com/images/media/meals/y7h0lq1683208991.jpg',
  i2: 'https://www.themealdb.com/images/media/meals/lwsnkl1604181187.jpg',
  i3: 'https://www.themealdb.com/images/media/meals/8rfd4q1764112993.jpg',
  i4: 'https://www.themealdb.com/images/media/meals/5r5rvx1763287943.jpg',
  i5: 'https://www.themealdb.com/images/media/meals/grhn401765687086.jpg',
  i6: 'https://www.thecocktaildb.com/images/media/drink/xrsrpr1441247464.jpg',
  i7: 'https://www.themealdb.com/images/media/meals/44bzep1761848278.jpg',
  i8: 'https://www.themealdb.com/images/media/meals/k420tj1585565244.jpg',
  i9: 'https://www.themealdb.com/images/media/meals/vdwloy1713225718.jpg',
  i10: 'https://www.themealdb.com/images/media/meals/5jdtie1763289302.jpg',
  i11: 'https://www.themealdb.com/images/media/meals/grhn401765687086.jpg',
  i12: 'https://www.thecocktaildb.com/images/media/drink/7stuuh1504885399.jpg',
  i13: 'https://www.themealdb.com/images/media/meals/g046bb1663960946.jpg',
  i14: 'https://www.themealdb.com/images/media/meals/tyywsw1505930373.jpg',
  i15: 'https://www.themealdb.com/images/media/meals/xxyupu1468262513.jpg',
  i16: 'https://www.themealdb.com/images/media/meals/ikizdm1763760862.jpg',
  i17: 'https://www.themealdb.com/images/media/meals/xxyupu1468262513.jpg',
  i18: 'https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg',
  i19: 'https://www.themealdb.com/images/media/meals/lrfdwz1764438393.jpg',
  i20: 'https://www.themealdb.com/images/media/meals/wf49qs1763075222.jpg',
  i21: 'https://www.themealdb.com/images/media/meals/sutysw1468247559.jpg',
  i22: 'https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg',
  i23: 'https://www.themealdb.com/images/media/meals/fqpqml1764359125.jpg',
  i24: 'https://www.themealdb.com/images/media/meals/z458v91763817681.jpg',
  i25: 'https://www.themealdb.com/images/media/meals/1549542994.jpg',
  i26: 'https://www.thecocktaildb.com/images/media/drink/wfqmgm1630406820.jpg',
  i27: 'https://www.thecocktaildb.com/images/media/drink/xwqvur1468876473.jpg',
};

// Appetizing hero image for the login screen.
export const HERO_IMAGE = 'https://www.themealdb.com/images/media/meals/usywpp1511189717.jpg';

// Display-only metadata layered on top of the persisted Restaurant shape.
export type MockRestaurant = Restaurant & {
  rating: number;
  ratingCount: number;
  deliveryTime: string; // e.g. "25–35 min"
  deliveryFee: number; // display value; checkout uses the flat DELIVERY_FEE
  cuisines: string[]; // tags shown on the card
  categories: string[]; // home-category keys this restaurant belongs to
  featured: boolean;
};

// Home category carousel. Image-backed chips keep the "photography first" feel.
export type HomeCategory = { key: string; label: string; image: string };

export const HOME_CATEGORIES: HomeCategory[] = [
  { key: 'burgers', label: 'Burgers', image: IMG.cat_burgers },
  { key: 'pizza', label: 'Pizza', image: IMG.cat_pizza },
  { key: 'filipino', label: 'Filipino', image: IMG.cat_filipino },
  { key: 'coffee', label: 'Coffee', image: IMG.cat_coffee },
  { key: 'desserts', label: 'Desserts', image: IMG.cat_desserts },
  { key: 'chicken', label: 'Chicken', image: IMG.cat_chicken },
];

const now = '2026-01-01T00:00:00.000Z';

export const MOCK_RESTAURANTS: MockRestaurant[] = [
  {
    id: 'r1',
    name: 'Tasty Spoon',
    description: 'Comfort Filipino classics cooked fresh daily.',
    image_url: IMG.r1,
    address: '12 Mabini St, Poblacion',
    city: 'Davao City',
    is_active: true,
    created_at: now,
    rating: 4.7,
    ratingCount: 820,
    deliveryTime: '25–35 min',
    deliveryFee: 50,
    cuisines: ['Filipino', 'Comfort'],
    categories: ['filipino', 'chicken'],
    featured: false,
  },
  {
    id: 'r2',
    name: 'Burger Barn',
    description: 'Juicy smash burgers and hand-cut fries.',
    image_url: IMG.r2,
    address: '88 Rizal Ave',
    city: 'Davao City',
    is_active: true,
    created_at: now,
    rating: 4.6,
    ratingCount: 1240,
    deliveryTime: '20–30 min',
    deliveryFee: 50,
    cuisines: ['Burgers', 'American'],
    categories: ['burgers', 'chicken'],
    featured: true,
  },
  {
    id: 'r3',
    name: 'Sushi Hana',
    description: 'Fresh sushi, sashimi, and rice bowls.',
    image_url: IMG.r3,
    address: '5 Quimpo Blvd',
    city: 'Davao City',
    is_active: true,
    created_at: now,
    rating: 4.8,
    ratingCount: 670,
    deliveryTime: '30–40 min',
    deliveryFee: 50,
    cuisines: ['Japanese', 'Sushi'],
    categories: [],
    featured: true,
  },
  {
    id: 'r4',
    name: 'Pizza Forno',
    description: 'Wood-fired pizzas and pasta.',
    image_url: IMG.r4,
    address: '210 Torres St',
    city: 'Davao City',
    is_active: true,
    created_at: now,
    rating: 4.5,
    ratingCount: 980,
    deliveryTime: '25–35 min',
    deliveryFee: 50,
    cuisines: ['Pizza', 'Italian'],
    categories: ['pizza'],
    featured: true,
  },
  {
    id: 'r5',
    name: 'Green Bowl',
    description: 'Healthy salads, wraps, and smoothies.',
    image_url: IMG.r5,
    address: '47 Bajada Rd',
    city: 'Davao City',
    is_active: true,
    created_at: now,
    rating: 4.7,
    ratingCount: 540,
    deliveryTime: '15–25 min',
    deliveryFee: 50,
    cuisines: ['Healthy', 'Salads'],
    categories: [],
    featured: false,
  },
];

export const MOCK_CATEGORIES: MenuCategory[] = [
  // Tasty Spoon
  { id: 'c1', restaurant_id: 'r1', name: 'Mains', sort_order: 1 },
  { id: 'c2', restaurant_id: 'r1', name: 'Sides', sort_order: 2 },
  { id: 'c3', restaurant_id: 'r1', name: 'Drinks', sort_order: 3 },
  // Burger Barn
  { id: 'c4', restaurant_id: 'r2', name: 'Burgers', sort_order: 1 },
  { id: 'c5', restaurant_id: 'r2', name: 'Sides', sort_order: 2 },
  { id: 'c6', restaurant_id: 'r2', name: 'Drinks', sort_order: 3 },
  // Sushi Hana
  { id: 'c7', restaurant_id: 'r3', name: 'Rolls', sort_order: 1 },
  { id: 'c8', restaurant_id: 'r3', name: 'Rice Bowls', sort_order: 2 },
  // Pizza Forno
  { id: 'c9', restaurant_id: 'r4', name: 'Pizza', sort_order: 1 },
  { id: 'c10', restaurant_id: 'r4', name: 'Pasta', sort_order: 2 },
  // Green Bowl
  { id: 'c11', restaurant_id: 'r5', name: 'Salads', sort_order: 1 },
  { id: 'c12', restaurant_id: 'r5', name: 'Smoothies', sort_order: 2 },
];

export const MOCK_ITEMS: MenuItem[] = [
  // Tasty Spoon — Mains
  { id: 'i1', restaurant_id: 'r1', category_id: 'c1', name: 'Chicken Adobo', description: 'Braised chicken in soy, garlic, and vinegar with rice.', price: 180, image_url: IMG.i1, is_available: true },
  { id: 'i2', restaurant_id: 'r1', category_id: 'c1', name: 'Pork Sinigang', description: 'Sour tamarind soup with pork and vegetables.', price: 210, image_url: IMG.i2, is_available: true },
  { id: 'i3', restaurant_id: 'r1', category_id: 'c1', name: 'Beef Kaldereta', description: 'Hearty beef stew in tomato sauce. Currently sold out.', price: 240, image_url: IMG.i3, is_available: false },
  // Tasty Spoon — Sides
  { id: 'i4', restaurant_id: 'r1', category_id: 'c2', name: 'Garlic Rice', description: 'Fragrant fried garlic rice.', price: 45, image_url: IMG.i4, is_available: true },
  { id: 'i5', restaurant_id: 'r1', category_id: 'c2', name: 'Lumpiang Shanghai', description: 'Crispy pork spring rolls (6 pcs).', price: 90, image_url: IMG.i5, is_available: true },
  // Tasty Spoon — Drinks
  { id: 'i6', restaurant_id: 'r1', category_id: 'c3', name: 'Iced Tea', description: 'House-brewed sweet iced tea.', price: 40, image_url: IMG.i6, is_available: true },

  // Burger Barn — Burgers
  { id: 'i7', restaurant_id: 'r2', category_id: 'c4', name: 'Classic Smash', description: 'Single smash patty, cheese, pickles, house sauce.', price: 160, image_url: IMG.i7, is_available: true },
  { id: 'i8', restaurant_id: 'r2', category_id: 'c4', name: 'Double Bacon', description: 'Double patty, bacon, cheddar, caramelized onions.', price: 230, image_url: IMG.i8, is_available: true },
  { id: 'i9', restaurant_id: 'r2', category_id: 'c4', name: 'Mushroom Swiss', description: 'Beef patty, sautéed mushrooms, swiss.', price: 200, image_url: IMG.i9, is_available: true },
  // Burger Barn — Sides
  { id: 'i10', restaurant_id: 'r2', category_id: 'c5', name: 'Hand-cut Fries', description: 'Crispy skin-on fries with sea salt.', price: 80, image_url: IMG.i10, is_available: true },
  { id: 'i11', restaurant_id: 'r2', category_id: 'c5', name: 'Onion Rings', description: 'Beer-battered onion rings.', price: 95, image_url: IMG.i11, is_available: true },
  // Burger Barn — Drinks
  { id: 'i12', restaurant_id: 'r2', category_id: 'c6', name: 'Chocolate Shake', description: 'Thick chocolate milkshake.', price: 120, image_url: IMG.i12, is_available: true },

  // Sushi Hana — Rolls
  { id: 'i13', restaurant_id: 'r3', category_id: 'c7', name: 'California Roll', description: 'Crab, avocado, cucumber (8 pcs).', price: 220, image_url: IMG.i13, is_available: true },
  { id: 'i14', restaurant_id: 'r3', category_id: 'c7', name: 'Spicy Tuna Roll', description: 'Spicy tuna and scallions (8 pcs).', price: 260, image_url: IMG.i14, is_available: true },
  { id: 'i15', restaurant_id: 'r3', category_id: 'c7', name: 'Eel Roll', description: 'Grilled eel with sweet sauce (8 pcs).', price: 290, image_url: IMG.i15, is_available: false },
  // Sushi Hana — Rice Bowls
  { id: 'i16', restaurant_id: 'r3', category_id: 'c8', name: 'Salmon Donburi', description: 'Fresh salmon over seasoned rice.', price: 280, image_url: IMG.i16, is_available: true },
  { id: 'i17', restaurant_id: 'r3', category_id: 'c8', name: 'Chicken Teriyaki Bowl', description: 'Grilled chicken teriyaki with rice.', price: 230, image_url: IMG.i17, is_available: true },

  // Pizza Forno — Pizza
  { id: 'i18', restaurant_id: 'r4', category_id: 'c9', name: 'Margherita', description: 'Tomato, mozzarella, fresh basil.', price: 320, image_url: IMG.i18, is_available: true },
  { id: 'i19', restaurant_id: 'r4', category_id: 'c9', name: 'Pepperoni', description: 'Loaded pepperoni and mozzarella.', price: 380, image_url: IMG.i19, is_available: true },
  { id: 'i20', restaurant_id: 'r4', category_id: 'c9', name: 'Quattro Formaggi', description: 'Four-cheese white pizza.', price: 410, image_url: IMG.i20, is_available: true },
  // Pizza Forno — Pasta
  { id: 'i21', restaurant_id: 'r4', category_id: 'c10', name: 'Spaghetti Bolognese', description: 'Slow-cooked beef ragu.', price: 250, image_url: IMG.i21, is_available: true },
  { id: 'i22', restaurant_id: 'r4', category_id: 'c10', name: 'Carbonara', description: 'Creamy bacon and parmesan.', price: 270, image_url: IMG.i22, is_available: true },

  // Green Bowl — Salads
  { id: 'i23', restaurant_id: 'r5', category_id: 'c11', name: 'Caesar Salad', description: 'Romaine, parmesan, croutons, caesar dressing.', price: 180, image_url: IMG.i23, is_available: true },
  { id: 'i24', restaurant_id: 'r5', category_id: 'c11', name: 'Greek Salad', description: 'Tomato, cucumber, olives, feta.', price: 190, image_url: IMG.i24, is_available: true },
  { id: 'i25', restaurant_id: 'r5', category_id: 'c11', name: 'Quinoa Power Bowl', description: 'Quinoa, chickpeas, greens, tahini.', price: 220, image_url: IMG.i25, is_available: true },
  // Green Bowl — Smoothies
  { id: 'i26', restaurant_id: 'r5', category_id: 'c12', name: 'Mango Smoothie', description: 'Fresh mango and yogurt.', price: 130, image_url: IMG.i26, is_available: true },
  { id: 'i27', restaurant_id: 'r5', category_id: 'c12', name: 'Berry Blast', description: 'Mixed berries and banana.', price: 140, image_url: IMG.i27, is_available: true },
];

// Simulates network latency so loading states are still exercised in mock mode.
function delay<T>(value: T, ms = 450): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/** All active restaurants, sorted by name. */
export function getRestaurants(): Promise<MockRestaurant[]> {
  const data = MOCK_RESTAURANTS.filter((r) => r.is_active).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  return delay(data);
}

/** Featured restaurants for the home hero carousel. */
export function getFeaturedRestaurants(): Promise<MockRestaurant[]> {
  return delay(MOCK_RESTAURANTS.filter((r) => r.is_active && r.featured));
}

/** A single restaurant by id, or null if not found. */
export function getRestaurantById(id: string): Promise<MockRestaurant | null> {
  return delay(MOCK_RESTAURANTS.find((r) => r.id === id) ?? null);
}

/** Categories (sorted) and items (sorted by name) for a restaurant. */
export function getMenuForRestaurant(
  restaurantId: string
): Promise<{ categories: MenuCategory[]; items: MenuItem[] }> {
  const categories = MOCK_CATEGORIES.filter((c) => c.restaurant_id === restaurantId).sort(
    (a, b) => a.sort_order - b.sort_order
  );
  const items = MOCK_ITEMS.filter((i) => i.restaurant_id === restaurantId).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  return delay({ categories, items });
}
