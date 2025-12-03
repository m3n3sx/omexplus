-- Bulk insert produktów do Medusa v2 (poprawna struktura)
BEGIN;

-- Dodaj 60 produktów (3 kategorie x 20)
DO $$
DECLARE
  i INTEGER;
  prod_id TEXT;
  var_id TEXT;
  pset_id TEXT;
  price_id TEXT;
  inv_item_id TEXT;
  inv_level_id TEXT;
  categories TEXT[] := ARRAY['Pompy hydrauliczne', 'Silniki hydrauliczne', 'Zawory hydrauliczne'];
  handles TEXT[] := ARRAY['pompy-hydrauliczne', 'silniki-hydrauliczne', 'zawory-hydrauliczne'];
  manufacturers TEXT[] := ARRAY['Rexroth', 'Danfoss', 'Parker'];
  cat_idx INTEGER;
  mfr TEXT;
  title TEXT;
  handle TEXT;
  sku TEXT;
  price INTEGER;
BEGIN
  FOR cat_idx IN 1..3 LOOP
    FOR i IN 1..20 LOOP
      -- Generuj unikalne ID
      prod_id := 'prod_' || handles[cat_idx] || '_' || i || '_' || floor(extract(epoch from now()) * 1000 + (cat_idx * 1000) + i)::bigint;
      var_id := 'var_' || handles[cat_idx] || '_' || i || '_' || floor(extract(epoch from now()) * 1000 + (cat_idx * 1000) + i)::bigint;
      pset_id := 'pset_' || handles[cat_idx] || '_' || i || '_' || floor(extract(epoch from now()) * 1000 + (cat_idx * 1000) + i)::bigint;
      price_id := 'price_' || handles[cat_idx] || '_' || i || '_' || floor(extract(epoch from now()) * 1000 + (cat_idx * 1000) + i)::bigint;
      inv_item_id := 'iitem_' || handles[cat_idx] || '_' || i || '_' || floor(extract(epoch from now()) * 1000 + (cat_idx * 1000) + i)::bigint;
      inv_level_id := 'ilevel_' || handles[cat_idx] || '_' || i || '_' || floor(extract(epoch from now()) * 1000 + (cat_idx * 1000) + i)::bigint;
      
      mfr := manufacturers[cat_idx];
      title := categories[cat_idx] || ' ' || mfr || ' Model-' || i;
      handle := handles[cat_idx] || '-' || lower(mfr) || '-model-' || i || '-' || floor(extract(epoch from now()) * 1000 + (cat_idx * 1000) + i)::bigint;
      sku := upper(substring(handles[cat_idx] from 1 for 6)) || '-' || lpad(i::text, 4, '0');
      price := (150000 + (i * 10000) + (cat_idx * 50000));
      
      -- Dodaj produkt
      INSERT INTO product (id, title, handle, status, created_at, updated_at)
      VALUES (prod_id, title, handle, 'published', NOW(), NOW());
      
      -- Dodaj wariant
      INSERT INTO product_variant (id, title, product_id, sku, manage_inventory, created_at, updated_at)
      VALUES (var_id, 'Standard', prod_id, sku, true, NOW(), NOW());
      
      -- Dodaj price_set
      INSERT INTO price_set (id, created_at, updated_at)
      VALUES (pset_id, NOW(), NOW());
      
      -- Dodaj cenę
      INSERT INTO price (id, price_set_id, amount, currency_code, created_at, updated_at)
      VALUES (price_id, pset_id, price, 'pln', NOW(), NOW());
      
      -- Połącz wariant z price_set
      UPDATE product_variant SET price_set_id = pset_id WHERE id = var_id;
      
      -- Dodaj inventory_item
      INSERT INTO inventory_item (id, sku, created_at, updated_at)
      VALUES (inv_item_id, sku, NOW(), NOW());
      
      -- Połącz wariant z inventory_item
      INSERT INTO product_variant_inventory_item (id, variant_id, inventory_item_id, required_quantity, created_at, updated_at)
      VALUES ('pvii_' || i || '_' || floor(extract(epoch from now()) * 1000 + (cat_idx * 1000) + i)::bigint, var_id, inv_item_id, 1, NOW(), NOW());
      
      -- Dodaj inventory_level (stan magazynowy)
      INSERT INTO inventory_level (id, inventory_item_id, stocked_quantity, reserved_quantity, created_at, updated_at)
      VALUES (inv_level_id, inv_item_id, 10 + (i % 40), 0, NOW(), NOW());
      
    END LOOP;
    RAISE NOTICE 'Dodano 20 produktów dla kategorii: %', categories[cat_idx];
  END LOOP;
END $$;

COMMIT;

-- Sprawdź wynik
SELECT COUNT(*) as total_products FROM product WHERE deleted_at IS NULL;
SELECT 'Produkty dodane pomyślnie!' as status;
