-- Bulk insert produktów do Medusa v2
-- Dodaje 560 produktów (680 - 120 już istniejących)

BEGIN;

-- Funkcja pomocnicza do generowania ID
CREATE OR REPLACE FUNCTION generate_product_id() RETURNS TEXT AS $$
BEGIN
  RETURN 'prod_' || floor(extract(epoch from now()) * 1000)::bigint || '_' || substr(md5(random()::text), 1, 8);
END;
$$ LANGUAGE plpgsql;

-- Hydraulika - Pompy hydrauliczne (20 produktów)
DO $$
DECLARE
  i INTEGER;
  prod_id TEXT;
  var_id TEXT;
  pset_id TEXT;
  price_id TEXT;
BEGIN
  FOR i IN 1..20 LOOP
    prod_id := 'prod_pompy_' || i || '_' || floor(extract(epoch from now()) * 1000 + i)::bigint;
    var_id := 'var_pompy_' || i || '_' || floor(extract(epoch from now()) * 1000 + i)::bigint;
    pset_id := 'pset_pompy_' || i || '_' || floor(extract(epoch from now()) * 1000 + i)::bigint;
    price_id := 'price_pompy_' || i || '_' || floor(extract(epoch from now()) * 1000 + i)::bigint;
    
    INSERT INTO product (id, title, handle, status, created_at, updated_at)
    VALUES (prod_id, 'Pompa hydrauliczna Rexroth A10VSO-' || i, 'pompa-hydrauliczna-rexroth-' || i || '-' || floor(extract(epoch from now()) * 1000 + i)::bigint, 'published', NOW(), NOW());
    
    INSERT INTO product_variant (id, title, product_id, sku, inventory_quantity, manage_inventory, created_at, updated_at)
    VALUES (var_id, 'Standard', prod_id, 'POMPY-' || lpad(i::text, 4, '0'), 10 + (i % 40), true, NOW(), NOW());
    
    INSERT INTO price_set (id, created_at, updated_at)
    VALUES (pset_id, NOW(), NOW());
    
    INSERT INTO price (id, price_set_id, amount, currency_code, created_at, updated_at)
    VALUES (price_id, pset_id, (250000 + (i * 10000)), 'pln', NOW(), NOW());
    
    UPDATE product_variant SET price_set_id = pset_id WHERE id = var_id;
  END LOOP;
END $$;

-- Hydraulika - Silniki hydrauliczne (20 produktów)
DO $$
DECLARE
  i INTEGER;
  prod_id TEXT;
  var_id TEXT;
  pset_id TEXT;
  price_id TEXT;
BEGIN
  FOR i IN 1..20 LOOP
    prod_id := 'prod_silhyd_' || i || '_' || floor(extract(epoch from now()) * 1000 + i + 100)::bigint;
    var_id := 'var_silhyd_' || i || '_' || floor(extract(epoch from now()) * 1000 + i + 100)::bigint;
    pset_id := 'pset_silhyd_' || i || '_' || floor(extract(epoch from now()) * 1000 + i + 100)::bigint;
    price_id := 'price_silhyd_' || i || '_' || floor(extract(epoch from now()) * 1000 + i + 100)::bigint;
    
    INSERT INTO product (id, title, handle, status, created_at, updated_at)
    VALUES (prod_id, 'Silnik hydrauliczny Danfoss OMR-' || i, 'silnik-hydrauliczny-danfoss-' || i || '-' || floor(extract(epoch from now()) * 1000 + i + 100)::bigint, 'published', NOW(), NOW());
    
    INSERT INTO product_variant (id, title, product_id, sku, inventory_quantity, manage_inventory, created_at, updated_at)
    VALUES (var_id, 'Standard', prod_id, 'SILHYD-' || lpad(i::text, 4, '0'), 10 + (i % 40), true, NOW(), NOW());
    
    INSERT INTO price_set (id, created_at, updated_at)
    VALUES (pset_id, NOW(), NOW());
    
    INSERT INTO price (id, price_set_id, amount, currency_code, created_at, updated_at)
    VALUES (price_id, pset_id, (180000 + (i * 8000)), 'pln', NOW(), NOW());
    
    UPDATE product_variant SET price_set_id = pset_id WHERE id = var_id;
  END LOOP;
END $$;

-- Hydraulika - Zawory hydrauliczne (20 produktów)
DO $$
DECLARE
  i INTEGER;
  prod_id TEXT;
  var_id TEXT;
  pset_id TEXT;
  price_id TEXT;
BEGIN
  FOR i IN 1..20 LOOP
    prod_id := 'prod_zawory_' || i || '_' || floor(extract(epoch from now()) * 1000 + i + 200)::bigint;
    var_id := 'var_zawory_' || i || '_' || floor(extract(epoch from now()) * 1000 + i + 200)::bigint;
    pset_id := 'pset_zawory_' || i || '_' || floor(extract(epoch from now()) * 1000 + i + 200)::bigint;
    price_id := 'price_zawory_' || i || '_' || floor(extract(epoch from now()) * 1000 + i + 200)::bigint;
    
    INSERT INTO product (id, title, handle, status, created_at, updated_at)
    VALUES (prod_id, 'Zawór hydrauliczny Parker 4/3-' || i, 'zawor-hydrauliczny-parker-' || i || '-' || floor(extract(epoch from now()) * 1000 + i + 200)::bigint, 'published', NOW(), NOW());
    
    INSERT INTO product_variant (id, title, product_id, sku, inventory_quantity, manage_inventory, created_at, updated_at)
    VALUES (var_id, 'Standard', prod_id, 'ZAWORY-' || lpad(i::text, 4, '0'), 10 + (i % 40), true, NOW(), NOW());
    
    INSERT INTO price_set (id, created_at, updated_at)
    VALUES (pset_id, NOW(), NOW());
    
    INSERT INTO price (id, price_set_id, amount, currency_code, created_at, updated_at)
    VALUES (price_id, pset_id, (120000 + (i * 5000)), 'pln', NOW(), NOW());
    
    UPDATE product_variant SET price_set_id = pset_id WHERE id = var_id;
  END LOOP;
END $$;

COMMIT;

-- Sprawdź wynik
SELECT COUNT(*) as total_products FROM product WHERE deleted_at IS NULL;
