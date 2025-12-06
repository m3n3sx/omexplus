-- Prosty skrypt dodający produkty z cenami

DO $$
DECLARE
  region_id TEXT;
  cat_record RECORD;
  prod_id TEXT;
  variant_id TEXT;
  price_set_id TEXT;
  price_id TEXT;
  i INTEGER;
  total_added INTEGER := 0;
BEGIN
  -- Pobierz region
  SELECT id INTO region_id FROM region LIMIT 1;
  RAISE NOTICE 'Region: %', region_id;
  
  -- Dla każdej kategorii
  FOR cat_record IN 
    SELECT id, name FROM product_category LIMIT 10
  LOOP
    RAISE NOTICE 'Kategoria: % (%)', cat_record.name, cat_record.id;
    
    -- Dodaj 50 produktów
    FOR i IN 1..50 LOOP
      -- Generuj unikalne ID
      prod_id := 'prod_' || (extract(epoch from clock_timestamp()) * 1000)::bigint || '_' || substr(md5(random()::text), 1, 9);
      variant_id := 'variant_' || (extract(epoch from clock_timestamp()) * 1000)::bigint || '_' || substr(md5(random()::text), 1, 9);
      price_set_id := 'pset_' || (extract(epoch from clock_timestamp()) * 1000)::bigint || '_' || substr(md5(random()::text), 1, 9);
      price_id := 'price_' || (extract(epoch from clock_timestamp()) * 1000)::bigint || '_' || substr(md5(random()::text), 1, 9);
      
      -- Produkt
      INSERT INTO product (id, title, description, handle, status, created_at, updated_at)
      VALUES (
        prod_id,
        'Pompa Parker P' || i || ' [' || cat_record.name || ']',
        'Wysokiej jakości pompa hydrauliczna',
        'pompa-' || substr(md5(random()::text), 1, 12),
        'published',
        NOW(),
        NOW()
      );
      
      -- Kategoria
      INSERT INTO product_category_product (product_id, product_category_id)
      VALUES (prod_id, cat_record.id);
      
      -- Wariant
      INSERT INTO product_variant (id, product_id, title, sku, manage_inventory, created_at, updated_at)
      VALUES (
        variant_id,
        prod_id,
        'Standard',
        'PARK-' || substr(md5(random()::text), 1, 8),
        false,
        NOW(),
        NOW()
      );
      
      -- Price set
      INSERT INTO price_set (id, created_at, updated_at)
      VALUES (price_set_id, NOW(), NOW());
      
      -- Link variant -> price set
      INSERT INTO product_variant_price_set (id, variant_id, price_set_id, created_at, updated_at)
      VALUES (
        'pvps_' || (extract(epoch from clock_timestamp()) * 1000)::bigint || '_' || substr(md5(random()::text), 1, 9),
        variant_id,
        price_set_id,
        NOW(),
        NOW()
      );
      
      -- Cena (50-500 EUR)
      INSERT INTO price (id, price_set_id, amount, raw_amount, currency_code, created_at, updated_at)
      VALUES (
        price_id,
        price_set_id,
        (random() * 45000 + 5000)::int,
        json_build_object('value', ((random() * 45000 + 5000)::int)::text, 'precision', 20)::jsonb,
        'eur',
        NOW(),
        NOW()
      );
      
      total_added := total_added + 1;
      
      -- Małe opóźnienie
      PERFORM pg_sleep(0.002);
    END LOOP;
    
    RAISE NOTICE '  Dodano 50 produktów';
  END LOOP;
  
  RAISE NOTICE 'ZAKOŃCZONO! Dodano łącznie % produktów', total_added;
END $$;

-- Pokaż statystyki
SELECT 
  (SELECT COUNT(*) FROM product) as produkty,
  (SELECT COUNT(*) FROM product_variant) as warianty,
  (SELECT COUNT(*) FROM price) as ceny;
