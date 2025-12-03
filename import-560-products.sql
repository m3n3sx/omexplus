-- Import 560 produktów do Medusa v2
BEGIN;

DO $$
DECLARE
  i INTEGER;
  cat_idx INTEGER;
  prod_id TEXT;
  var_id TEXT;
  pset_id TEXT;
  price_id TEXT;
  inv_item_id TEXT;
  inv_level_id TEXT;
  pvii_id TEXT;
  pvps_id TEXT;
  
  categories TEXT[] := ARRAY[
    'Wąż hydrauliczny', 'Zbiorniki hydrauliczne', 'Płyny hydrauliczne', 'Garne hydrauliczne', 'Czujniki hydrauliczne',
    'Filtry HF', 'Filtry HG', 'Filtry HH', 'Komplety filtrów',
    'Silniki spalinowe', 'Turbosprężarki', 'Układ paliwowy', 'Układ chłodzenia', 'Układ rozruchowy', 'Paski napędowe',
    'Gąsienice gumowe', 'Podwozia kołowe', 'Groty gąsienic', 'Bolce gąsienic', 'Łączniki gąsienic', 'Napinacze gąsienic',
    'Oświetlenie LED', 'Kable elektryczne', 'Silniki elektryczne', 'Elektronika', 'Baterie', 'Uszczelnienia', 'Łożyska'
  ];
  
  mfr TEXT;
  title TEXT;
  handle TEXT;
  sku TEXT;
  price_amount NUMERIC;
  raw_amount_json JSONB;
  stock_qty INTEGER;
  ts BIGINT;
  
BEGIN
  FOR cat_idx IN 1..28 LOOP
    FOR i IN 1..20 LOOP
      ts := floor(extract(epoch from now()) * 1000000)::bigint + (cat_idx * 100000) + (i * 1000) + floor(random() * 1000)::bigint;
      
      prod_id := 'prod_' || ts;
      var_id := 'var_' || ts;
      pset_id := 'pset_' || ts;
      price_id := 'price_' || ts;
      inv_item_id := 'iitem_' || ts;
      inv_level_id := 'ilevel_' || ts;
      pvii_id := 'pvii_' || ts;
      pvps_id := 'pvps_' || ts;
      
      mfr := (ARRAY['Rexroth', 'Danfoss', 'Parker', 'Eaton', 'Vickers', 'Bosch', 'Mann', 'CAT'])[(i % 8) + 1];
      title := categories[cat_idx] || ' ' || mfr || ' M' || (100 + i);
      handle := 'product-' || ts;
      sku := 'SKU-' || ts;
      price_amount := (50000 + (i * 5000) + (cat_idx * 10000));
      stock_qty := 5 + (i % 45);
      raw_amount_json := json_build_object('value', price_amount::text, 'precision', 20)::jsonb;
      
      -- 1. Produkt
      INSERT INTO product (id, title, handle, status, created_at, updated_at)
      VALUES (prod_id, title, handle, 'published', NOW(), NOW());
      
      -- 2. Wariant
      INSERT INTO product_variant (id, title, product_id, sku, manage_inventory, created_at, updated_at)
      VALUES (var_id, 'Standard', prod_id, sku, true, NOW(), NOW());
      
      -- 3. Price Set
      INSERT INTO price_set (id, created_at, updated_at)
      VALUES (pset_id, NOW(), NOW());
      
      -- 4. Cena
      INSERT INTO price (id, price_set_id, amount, raw_amount, currency_code, created_at, updated_at)
      VALUES (price_id, pset_id, price_amount, raw_amount_json, 'pln', NOW(), NOW());
      
      -- 5. Połącz wariant z price_set
      INSERT INTO product_variant_price_set (id, variant_id, price_set_id, created_at, updated_at)
      VALUES (pvps_id, var_id, pset_id, NOW(), NOW());
      
      -- 6. Inventory Item
      INSERT INTO inventory_item (id, sku, created_at, updated_at)
      VALUES (inv_item_id, sku, NOW(), NOW());
      
      -- 7. Połącz wariant z inventory
      INSERT INTO product_variant_inventory_item (id, variant_id, inventory_item_id, required_quantity, created_at, updated_at)
      VALUES (pvii_id, var_id, inv_item_id, 1, NOW(), NOW());
      
      -- 8. Stan magazynowy
      INSERT INTO inventory_level (id, inventory_item_id, location_id, stocked_quantity, reserved_quantity, created_at, updated_at)
      VALUES (inv_level_id, inv_item_id, 'sloc_01KBDXHQCK3KM5ZFCHT7ZAQAK3', stock_qty, 0, NOW(), NOW());
      
    END LOOP;
    
    IF cat_idx % 5 = 0 THEN
      RAISE NOTICE 'Postęp: %/28 kategorii (% produktów)', cat_idx, cat_idx * 20;
    END IF;
  END LOOP;
  
  RAISE NOTICE 'Zakończono! Dodano 560 produktów.';
END $$;

COMMIT;

SELECT COUNT(*) as total_products FROM product WHERE deleted_at IS NULL;
