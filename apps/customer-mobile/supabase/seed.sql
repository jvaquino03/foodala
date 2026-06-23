-- Foodala — Phase 1 seed data
-- 5 active restaurants in one city (Davao City), each with categories + items.
-- Safe to re-run: it deletes existing seed rows (by fixed UUID) first.
-- Images use real, dish-accurate food/drink photography (TheMealDB + TheCocktailDB)
-- and mirror src/data/mockRestaurants.ts.

begin;

-- Clean previous seed (cascades to categories, items, and any orders' items).
delete from restaurants where id in (
  '11111111-1111-1111-1111-111111111101',
  '11111111-1111-1111-1111-111111111102',
  '11111111-1111-1111-1111-111111111103',
  '11111111-1111-1111-1111-111111111104',
  '11111111-1111-1111-1111-111111111105'
);

-- ---------------------------------------------------------------------------
-- Restaurants
-- ---------------------------------------------------------------------------
insert into restaurants (id, name, description, image_url, address, city, is_active) values
('11111111-1111-1111-1111-111111111101', 'Tasty Spoon', 'Comfort Filipino classics cooked fresh daily.', 'https://www.themealdb.com/images/media/meals/pkopc31683207947.jpg', '12 Mabini St, Poblacion', 'Davao City', true),
('11111111-1111-1111-1111-111111111102', 'Burger Barn', 'Juicy smash burgers and hand-cut fries.', 'https://www.themealdb.com/images/media/meals/lgmnff1763789847.jpg', '88 Rizal Ave', 'Davao City', true),
('11111111-1111-1111-1111-111111111103', 'Sushi Hana', 'Fresh sushi, sashimi, and rice bowls.', 'https://www.themealdb.com/images/media/meals/g046bb1663960946.jpg', '5 Quimpo Blvd', 'Davao City', true),
('11111111-1111-1111-1111-111111111104', 'Pizza Forno', 'Wood-fired pizzas and pasta.', 'https://www.themealdb.com/images/media/meals/lrfdwz1764438393.jpg', '210 Torres St', 'Davao City', true),
('11111111-1111-1111-1111-111111111105', 'Green Bowl', 'Healthy salads, wraps, and smoothies.', 'https://www.themealdb.com/images/media/meals/zry07j1763779321.jpg', '47 Bajada Rd', 'Davao City', true);

-- ---------------------------------------------------------------------------
-- Menu categories
-- ---------------------------------------------------------------------------
insert into menu_categories (id, restaurant_id, name, sort_order) values
-- Tasty Spoon
('22222222-0000-0000-0000-000000000101', '11111111-1111-1111-1111-111111111101', 'Mains', 1),
('22222222-0000-0000-0000-000000000102', '11111111-1111-1111-1111-111111111101', 'Sides', 2),
('22222222-0000-0000-0000-000000000103', '11111111-1111-1111-1111-111111111101', 'Drinks', 3),
-- Burger Barn
('22222222-0000-0000-0000-000000000201', '11111111-1111-1111-1111-111111111102', 'Burgers', 1),
('22222222-0000-0000-0000-000000000202', '11111111-1111-1111-1111-111111111102', 'Sides', 2),
('22222222-0000-0000-0000-000000000203', '11111111-1111-1111-1111-111111111102', 'Drinks', 3),
-- Sushi Hana
('22222222-0000-0000-0000-000000000301', '11111111-1111-1111-1111-111111111103', 'Rolls', 1),
('22222222-0000-0000-0000-000000000302', '11111111-1111-1111-1111-111111111103', 'Rice Bowls', 2),
-- Pizza Forno
('22222222-0000-0000-0000-000000000401', '11111111-1111-1111-1111-111111111104', 'Pizza', 1),
('22222222-0000-0000-0000-000000000402', '11111111-1111-1111-1111-111111111104', 'Pasta', 2),
-- Green Bowl
('22222222-0000-0000-0000-000000000501', '11111111-1111-1111-1111-111111111105', 'Salads', 1),
('22222222-0000-0000-0000-000000000502', '11111111-1111-1111-1111-111111111105', 'Smoothies', 2);

-- ---------------------------------------------------------------------------
-- Menu items
-- ---------------------------------------------------------------------------
insert into menu_items (restaurant_id, category_id, name, description, price, image_url, is_available) values
-- Tasty Spoon — Mains
('11111111-1111-1111-1111-111111111101', '22222222-0000-0000-0000-000000000101', 'Chicken Adobo', 'Braised chicken in soy, garlic, and vinegar with rice.', 180.00, 'https://www.themealdb.com/images/media/meals/y7h0lq1683208991.jpg', true),
('11111111-1111-1111-1111-111111111101', '22222222-0000-0000-0000-000000000101', 'Pork Sinigang', 'Sour tamarind soup with pork and vegetables.', 210.00, 'https://www.themealdb.com/images/media/meals/lwsnkl1604181187.jpg', true),
('11111111-1111-1111-1111-111111111101', '22222222-0000-0000-0000-000000000101', 'Beef Kaldereta', 'Hearty beef stew in tomato sauce. Currently sold out.', 240.00, 'https://www.themealdb.com/images/media/meals/8rfd4q1764112993.jpg', false),
-- Tasty Spoon — Sides
('11111111-1111-1111-1111-111111111101', '22222222-0000-0000-0000-000000000102', 'Garlic Rice', 'Fragrant fried garlic rice.', 45.00, 'https://www.themealdb.com/images/media/meals/5r5rvx1763287943.jpg', true),
('11111111-1111-1111-1111-111111111101', '22222222-0000-0000-0000-000000000102', 'Lumpiang Shanghai', 'Crispy pork spring rolls (6 pcs).', 90.00, 'https://www.themealdb.com/images/media/meals/grhn401765687086.jpg', true),
-- Tasty Spoon — Drinks
('11111111-1111-1111-1111-111111111101', '22222222-0000-0000-0000-000000000103', 'Iced Tea', 'House-brewed sweet iced tea.', 40.00, 'https://www.thecocktaildb.com/images/media/drink/xrsrpr1441247464.jpg', true),

-- Burger Barn — Burgers
('11111111-1111-1111-1111-111111111102', '22222222-0000-0000-0000-000000000201', 'Classic Smash', 'Single smash patty, cheese, pickles, house sauce.', 160.00, 'https://www.themealdb.com/images/media/meals/44bzep1761848278.jpg', true),
('11111111-1111-1111-1111-111111111102', '22222222-0000-0000-0000-000000000201', 'Double Bacon', 'Double patty, bacon, cheddar, caramelized onions.', 230.00, 'https://www.themealdb.com/images/media/meals/k420tj1585565244.jpg', true),
('11111111-1111-1111-1111-111111111102', '22222222-0000-0000-0000-000000000201', 'Mushroom Swiss', 'Beef patty, sautéed mushrooms, swiss.', 200.00, 'https://www.themealdb.com/images/media/meals/vdwloy1713225718.jpg', true),
-- Burger Barn — Sides
('11111111-1111-1111-1111-111111111102', '22222222-0000-0000-0000-000000000202', 'Hand-cut Fries', 'Crispy skin-on fries with sea salt.', 80.00, 'https://www.themealdb.com/images/media/meals/5jdtie1763289302.jpg', true),
('11111111-1111-1111-1111-111111111102', '22222222-0000-0000-0000-000000000202', 'Onion Rings', 'Beer-battered onion rings.', 95.00, 'https://www.themealdb.com/images/media/meals/grhn401765687086.jpg', true),
-- Burger Barn — Drinks
('11111111-1111-1111-1111-111111111102', '22222222-0000-0000-0000-000000000203', 'Chocolate Shake', 'Thick chocolate milkshake.', 120.00, 'https://www.thecocktaildb.com/images/media/drink/7stuuh1504885399.jpg', true),

-- Sushi Hana — Rolls
('11111111-1111-1111-1111-111111111103', '22222222-0000-0000-0000-000000000301', 'California Roll', 'Crab, avocado, cucumber (8 pcs).', 220.00, 'https://www.themealdb.com/images/media/meals/g046bb1663960946.jpg', true),
('11111111-1111-1111-1111-111111111103', '22222222-0000-0000-0000-000000000301', 'Spicy Tuna Roll', 'Spicy tuna and scallions (8 pcs).', 260.00, 'https://www.themealdb.com/images/media/meals/tyywsw1505930373.jpg', true),
('11111111-1111-1111-1111-111111111103', '22222222-0000-0000-0000-000000000301', 'Eel Roll', 'Grilled eel with sweet sauce (8 pcs).', 290.00, 'https://www.themealdb.com/images/media/meals/xxyupu1468262513.jpg', false),
-- Sushi Hana — Rice Bowls
('11111111-1111-1111-1111-111111111103', '22222222-0000-0000-0000-000000000302', 'Salmon Donburi', 'Fresh salmon over seasoned rice.', 280.00, 'https://www.themealdb.com/images/media/meals/ikizdm1763760862.jpg', true),
('11111111-1111-1111-1111-111111111103', '22222222-0000-0000-0000-000000000302', 'Chicken Teriyaki Bowl', 'Grilled chicken teriyaki with rice.', 230.00, 'https://www.themealdb.com/images/media/meals/xxyupu1468262513.jpg', true),

-- Pizza Forno — Pizza
('11111111-1111-1111-1111-111111111104', '22222222-0000-0000-0000-000000000401', 'Margherita', 'Tomato, mozzarella, fresh basil.', 320.00, 'https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg', true),
('11111111-1111-1111-1111-111111111104', '22222222-0000-0000-0000-000000000401', 'Pepperoni', 'Loaded pepperoni and mozzarella.', 380.00, 'https://www.themealdb.com/images/media/meals/lrfdwz1764438393.jpg', true),
('11111111-1111-1111-1111-111111111104', '22222222-0000-0000-0000-000000000401', 'Quattro Formaggi', 'Four-cheese white pizza.', 410.00, 'https://www.themealdb.com/images/media/meals/wf49qs1763075222.jpg', true),
-- Pizza Forno — Pasta
('11111111-1111-1111-1111-111111111104', '22222222-0000-0000-0000-000000000402', 'Spaghetti Bolognese', 'Slow-cooked beef ragu.', 250.00, 'https://www.themealdb.com/images/media/meals/sutysw1468247559.jpg', true),
('11111111-1111-1111-1111-111111111104', '22222222-0000-0000-0000-000000000402', 'Carbonara', 'Creamy bacon and parmesan.', 270.00, 'https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg', true),

-- Green Bowl — Salads
('11111111-1111-1111-1111-111111111105', '22222222-0000-0000-0000-000000000501', 'Caesar Salad', 'Romaine, parmesan, croutons, caesar dressing.', 180.00, 'https://www.themealdb.com/images/media/meals/fqpqml1764359125.jpg', true),
('11111111-1111-1111-1111-111111111105', '22222222-0000-0000-0000-000000000501', 'Greek Salad', 'Tomato, cucumber, olives, feta.', 190.00, 'https://www.themealdb.com/images/media/meals/z458v91763817681.jpg', true),
('11111111-1111-1111-1111-111111111105', '22222222-0000-0000-0000-000000000501', 'Quinoa Power Bowl', 'Quinoa, chickpeas, greens, tahini.', 220.00, 'https://www.themealdb.com/images/media/meals/1549542994.jpg', true),
-- Green Bowl — Smoothies
('11111111-1111-1111-1111-111111111105', '22222222-0000-0000-0000-000000000502', 'Mango Smoothie', 'Fresh mango and yogurt.', 130.00, 'https://www.thecocktaildb.com/images/media/drink/wfqmgm1630406820.jpg', true),
('11111111-1111-1111-1111-111111111105', '22222222-0000-0000-0000-000000000502', 'Berry Blast', 'Mixed berries and banana.', 140.00, 'https://www.thecocktaildb.com/images/media/drink/xwqvur1468876473.jpg', true);

commit;
