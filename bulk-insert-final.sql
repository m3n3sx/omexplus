-- Bulk insert produktów do Medusa v2 (FINALNA WERSJA)
BEGIN;

-- Dodaj 560 produktów (28 podkategorii x 20)
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
  
  categories TEXT[] := ARRAY[
    'Wąż hydrauliczny & Złączki', 'Zbiorniki hydrauliczne', 'Płyny hydrauliczne', 'Garne hydrauliczne', 'Czujniki & Wskaźniki',
    'Filtry hydrauliczne HF', 'Filtry hydrauliczne HG', 'Filtry hydrauliczne HH', 'Komplety filtrów',
    'Silniki spalinowe', 'Turbosprężarki', 'Układ paliwowy', 'Układ chłodzenia', 'Układ rozruchowy', 'Paski & Łańcuchy',
    'Gąsienice gumowe', 'Podwozia kołowe', 'Groty gąsienic', 'Bolce gąsienic', 'Łączniki gąsienic', 'Napinacze gąsienic',
    'Oświetlenie', 'Kable & Przewody', 'Silniki elektryczne', 'Elektronika sterowania', 'Baterie & Zasilanie',
    'Uszczelnienia', 'Łożyska'
  ];
  
  handles TEXT[] := ARRAY[
    'waz-hydrauliczny-zlaczki', 'zbiorniki-hydrauliczne', 'plyny-hydrauliczne', 'garne-hydrauliczne', 'czujniki-wskazniki',
    'filtry-hydrauliczne-hf', 'filtry-hydrauliczne-hg', 'filtry-hydrauliczne-hh', 'komplety-filtrow',
    'silniki-spalinowe', 'turbosprezarki', 'uklad-paliwowy', 'uklad-chlodzenia', 'uklad-rozruchowy', 'paski-lancuchy',
    'gasienice-gumowe', 'podwozia-kolowe', 'groty-gasienic', 'bolce-gasienic', 'laczniki-gasienic', 'napinacze-gasienic',
    'oswietlenie', 'kable-przewody', 'silniki-elektryczne', 'elektronika-sterowania', 'baterie-zasilanie',
    'uszczelnienia', 'lozyska'
  ];
  
  manufacturers TEXT[] := ARRAY['Rexroth', 'Danfoss', 'Parker', 'Eaton', 'Vickers', 'Bosch', 'Mann', 'Caterpillar'];
  
  mfr TEXT;
  title TEXT;
  handle TEXT;
  sku TEXT;
  price_amount NUMERIC;
  raw_amount_json JSONB;
  stock_qty INTEGER;
  
BEGIN
  FOR cat_idx IN 1..28 LOOP
    RAISE NOTICE 'Dodaję produkty dla kategorii: % (%/28)', categories[cat_idx], cat_idx;
    
    FOR i IN 1..20 LOOP
      -- Generuj unikalne ID z timestamp
      prod_id := 'prod_' || cat_idx || '_' || i || '_' || floor(extract(epoch from now()) * 1000000 + (cat_idx * 100000) + (i * 1000) + random() * 1000)::bigint;
      var_id := 'var_' || cat_idx || '_' || i || '_' || floor(extract(epoch from now()) * 1000000 + (cat_idx * 100000) + (i * 1000) + random() * 1000)::bigint;
      pset_id := 'pset_' || cat_idx || '_' || i || '_' || floor(extract(epoch from now()) * 1000000 + (cat_idx * 100000) + (i * 1000) + random() * 1000)::bigint;
      price_id := 'price_' || cat_idx || '_' || i || '_' || floor(extract(epoch from now()) * 1000000 + (cat_idx * 100000) + (i * 1000) + random() * 1000)::bigint;
      inv_item_id := 'iitem_' || cat_idx || '_' || i || '_' || floor(extract(epoch from now()) * 1000000 + (cat_idx * 100000) + (i * 1000) + random() * 1000)::bigint;
      inv_level_id := 'ilevel_' || cat_idx || '_' || i || '_' || floor(extract(epoch from now()) * 1000000 + (cat_idx * 100000) + (i * 1000) + random() * 1000)::bigint;
      pvii_id := 'pvii_' || cat_idx || '_' || i || '_' || floor(extract(epoch from now()) * 1000000 + (cat_idx * 100000) + (i * 1000) + random() * 1000)::bigint;
      
      mfr := manufacturers[(i % 8) + 1];
      title := categories[cat_idx] || ' ' || mfr || ' M' || (100 + i);
      handle := handles[cat_idx] || '-' || lower(mfr) || '-m' || (100 + i) || '-' || floor(extract(epoch from now()) * 1000 + cat_idx + i)::bigint;
      sku := upper(substring(handles[cat_idx] from 1 for 6)) || '-' || lpad(((cat_idx * 100) + i)::text, 5, '0');
      price_amount := (50000 + (i * 5000) + (cat_idx * 10000));
      stock_qty := 5 + (i % 45);
      
      -- Przygotuj raw_amount jako JSONB
      raw_amount_json := json_build_object('value', price_amount::text, 'precision', 20)::jsonb;
      
      -- Dodaj produkt
      INSERT INTO product (id, title, handle, status, created_at, updated_at)
      VALUES (prod_id, title, handle, 'published', NOW(), NOW());
      
      -- Dodaj wariant
      INSERT INTO product_variant (id, title, product_id, sku, manage_inventory, created_at, updated_at)
      VALUES (var_id, 'Standard', prod_id, sku, true, NOW(), NOW());
      
      -- Dodaj price_set
      INSERT INTO price_set (id, created_at, updated_at)
      VALUES (pset_id, NOW(), NOW());
      
      -- Dodaj cenę z raw_amount
      INSERT INTO price (id, price_set_id, amount, raw_amount, currency_code, created_at, updated_at)
      VALUES (price_id, pset_id, price_amount, raw_amount_json, 'pln', NOW(), NOW());
      
      -- Połącz wariant z price_set (używając price_set_id w product_variant)
      UPDATE product_variant SET price_set_id = pset_id WHERE id = var_id;
      
      -- Dodaj inventory_item
      INSERT INTO inventory_item (id, sku, created_at, updated_at)
      VALUES (inv_item_id, sku, NOW(), NOW());
      
      -- Połącz wariant z inventory_item
      INSERT INTO product_variant_inventory_item (id, variant_id, inventory_item_id, required_quantity, created_at, updated_at)
      VALUES (pvii_id, var_id, inv_item_id, 1, NOW(), NOW());
      
      -- Dodaj inventory_level (stan magazynowy)
      INSERT INTO inventory_level (id, inventory_item_id, stocked_quantity, reserved_quantity, created_at, updated_at)
      VALUES (inv_level_id, inv_item_id, stock_qty, 0, NOW(), NOW());
      
      -- Małe opóźnienie co 50 produktów
      IF (cat_idx * 20 + i) % 50 = 0 THEN
        PERFORM pg_sleep(0.1);
      END IF;
    END LOOP;
  END LOOP;
  
  RAISE NOTICE 'Zakończono dodawanie 560 produktów!';
END $$;

COMMIT;

-- Sprawdź wynik
SELECT COUNT(*) as total_products FROM product WHERE deleted_at IS NULL;
SELECT '✅ Import zakończony pomyślnie!' as status;
