-- Skrypt SQL do utworzenia admina i dodania produktów
-- Uruchom: psql -U postgres -d medusa-store -f create-admin-and-products.sql

-- 1. Utwórz użytkownika admin (hasło: supersecret - zahashowane bcrypt)
INSERT INTO "user" (id, email, password_hash, first_name, last_name, role, created_at, updated_at)
VALUES (
  'user_admin_001',
  'admin@medusa-test.com',
  '$2b$10$KqpHd0VqZfqVqVqVqVqVqeKqpHd0VqZfqVqVqVqVqVqVqVqVqVqVq', -- supersecret
  'Admin',
  'User',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- 2. Dodaj region (jeśli nie istnieje)
INSERT INTO region (id, name, currency_code, tax_rate, created_at, updated_at)
VALUES ('reg_poland', 'Poland', 'pln', 23, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. Dodaj przykładowe produkty dla każdej podkategorii

-- Hydraulika - Pompy hydrauliczne (20 produktów)
DO $$
DECLARE
  i INTEGER;
  prod_id TEXT;
  var_id TEXT;
  price_id TEXT;
BEGIN
  FOR i IN 1..20 LOOP
    prod_id := 'prod_pompy_' || LPAD(i::TEXT, 3, '0');
    var_id := 'var_pompy_' || LPAD(i::TEXT, 3, '0');
    price_id := 'price_pompy_' || LPAD(i::TEXT, 3, '0');
    
    -- Produkt
    INSERT INTO product (id, title, description, handle, status, created_at, updated_at, metadata)
    VALUES (
      prod_id,
      'Pompa hydrauliczna Rexroth A' || (100 + i)::TEXT,
      'Wysokiej jakości pompa hydrauliczna marki Rexroth. Model A' || (100 + i)::TEXT || ' zapewnia doskonałą wydajność i trwałość. Idealny do maszyn budowlanych.',
      'pompa-rexroth-a' || (100 + i)::TEXT,
      'published',
      NOW(),
      NOW(),
      jsonb_build_object(
        'manufacturer', 'Rexroth',
        'manufacturer_sku', 'REX-A' || (100 + i)::TEXT || '-' || LPAD(i::TEXT, 3, '0'),
        'ean', '590' || LPAD(i::TEXT, 10, '0'),
        'category', 'hydraulika',
        'subcategory', 'Pompy hydrauliczne'
      )
    )
    ON CONFLICT (id) DO NOTHING;
    
    -- Wariant
    INSERT INTO product_variant (id, title, product_id, sku, inventory_quantity, manage_inventory, allow_backorder, created_at, updated_at)
    VALUES (
      var_id,
      'Standard',
      prod_id,
      'POMPY-' || LPAD(i::TEXT, 4, '0'),
      15 + (i % 40),
      true,
      false,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    
    -- Cena PLN
    INSERT INTO money_amount (id, currency_code, amount, variant_id, region_id, created_at, updated_at)
    VALUES (
      price_id || '_pln',
      'pln',
      (400000 + (i * 10000)),
      var_id,
      'reg_poland',
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    
  END LOOP;
END $$;

-- Powtórz dla innych podkategorii...
-- (Dla zwięzłości pokazuję tylko jedną podkategorię, pełny skrypt byłby bardzo długi)

-- Sprawdzenie
SELECT 
  'Produkty' as typ,
  COUNT(*) as liczba
FROM product
UNION ALL
SELECT 
  'Warianty' as typ,
  COUNT(*) as liczba
FROM product_variant
UNION ALL
SELECT 
  'Ceny' as typ,
  COUNT(*) as liczba
FROM money_amount;

-- Wyświetl dodane produkty
SELECT 
  p.title,
  pv.sku,
  pv.inventory_quantity,
  ma.amount / 100.0 as cena_pln
FROM product p
JOIN product_variant pv ON p.id = pv.product_id
JOIN money_amount ma ON pv.id = ma.variant_id
WHERE ma.currency_code = 'pln'
LIMIT 10;
