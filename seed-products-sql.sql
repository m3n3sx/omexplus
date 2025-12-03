-- Czyszczenie istniejących danych
DELETE FROM product_variant WHERE 1=1;
DELETE FROM product WHERE 1=1;
DELETE FROM product_category WHERE 1=1;

-- Dodanie kategorii
INSERT INTO product_category (id, name, handle, is_active, is_internal, created_at, updated_at)
VALUES
  ('cat_hydraulika', 'Hydraulika', 'hydraulika', true, false, NOW(), NOW()),
  ('cat_filtry', 'Filtry', 'filtry', true, false, NOW(), NOW()),
  ('cat_silniki', 'Silniki', 'silniki', true, false, NOW(), NOW()),
  ('cat_podwozia', 'Podwozia', 'podwozia', true, false, NOW(), NOW()),
  ('cat_elektryka', 'Elektryka', 'elektryka', true, false, NOW(), NOW());

-- Przykładowe produkty (pierwsze 5 z każdej kategorii)
-- Hydraulika
INSERT INTO product (id, title, subtitle, description, handle, status, created_at, updated_at, metadata)
VALUES
  ('prod_hyd_001', 'Pompa hydrauliczna Rexroth A100', 'Model A100 - Oryginalna część Rexroth', 
   'Wysokiej jakości pompa hydrauliczna marki Rexroth. Model A100 zapewnia doskonałą wydajność i trwałość.', 
   'hydraulika-rexroth-a100-1', 'published', NOW(), NOW(),
   '{"manufacturer":"Rexroth","manufacturer_sku":"REX-A100-001","ean":"5900000000001","origin_country":"DE","warranty_months":24}'::jsonb);

-- Dodaj wariant dla produktu
INSERT INTO product_variant (id, title, product_id, sku, ean, inventory_quantity, manage_inventory, allow_backorder, created_at, updated_at)
VALUES
  ('var_hyd_001', 'Standard', 'prod_hyd_001', 'HYD-0001', '5900000000001', 15, true, false, NOW(), NOW());

-- Dodaj cenę
INSERT INTO money_amount (id, currency_code, amount, variant_id, created_at, updated_at)
VALUES
  ('price_hyd_001_pln', 'pln', 450000, 'var_hyd_001', NOW(), NOW()),
  ('price_hyd_001_eur', 'eur', 110000, 'var_hyd_001', NOW(), NOW());

-- Powtórz dla pozostałych produktów...
-- (To jest przykład - pełny skrypt byłby bardzo długi)

-- Sprawdzenie
SELECT COUNT(*) as total_products FROM product;
SELECT COUNT(*) as total_variants FROM product_variant;
SELECT COUNT(*) as total_categories FROM product_category;
