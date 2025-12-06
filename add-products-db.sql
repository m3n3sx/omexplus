-- Dodaj produkty z cenami bezpośrednio do bazy danych

-- Najpierw pobierz ID regionu PLN
DO $$
DECLARE
  region_id TEXT;
  cat_id TEXT;
  prod_id TEXT;
  variant_id TEXT;
  price_set_id TEXT;
  i INTEGER;
BEGIN
  -- Pobierz region EUR
  SELECT id INTO region_id FROM region WHERE currency_code = 'eur' LIMIT 1;
  
  IF region_id IS NULL THEN
    RAISE NOTICE 'Brak regionu EUR';
    RETURN;
  END IF;
  
  RAISE NOTICE 'Region ID: %', region_id;
  
  -- Dla każdej kategorii
  FOR cat_id IN 
    SELECT id FROM product_category LIMIT 10
  LOOP
    RAISE NOTICE 'Kategoria: %', cat_id;
    
    -- Dodaj 50 produktów
    FOR i IN 1..50 LOOP
      -- Generuj ID
      prod_id := 'prod_' || floor(extract(epoch from now()) * 1000)::bigint || '_' || substr(md5(random()::text), 1, 9);
      variant_id := 'variant_' || floor(extract(epoch from now()) * 1000)::bigint || '_' || substr(md5(random()::text), 1, 9);
      price_set_id := 'pset_' || floor(extract(epoch from now()) * 1000)::bigint || '_' || substr(md5(random()::text), 1, 9);
      
      -- Wstaw produkt
      INSERT INTO product (id, title, description, handle, status, created_at, updated_at)
      VALUES (
        prod_id,
        'Pompa hydrauliczna Parker P' || i,
        'Wysokiej jakości pompa hydrauliczna do maszyn budowlanych',
        'pompa-parker-p' || i || '-' || substr(md5(random()::text), 1, 6),
        'published',
        NOW(),
        NOW()
      );
      
      -- Przypisz do kategorii
      INSERT INTO product_category_product (product_id, product_category_id)
      VALUES (prod_id, cat_id);
      
      -- Wstaw wariant
      INSERT INTO product_variant (id, product_id, title, sku, manage_inventory, inventory_quantity, created_at, updated_at)
      VALUES (
        variant_id,
        prod_id,
        'Standard',
        'PARK-' || substr(md5(random()::text), 1, 8),
        true,
        floor(random() * 100 + 1)::int,
        NOW(),
        NOW()
      );
      
      -- Wstaw price set
      INSERT INTO price_set (id, created_at, updated_at)
      VALUES (price_set_id, NOW(), NOW());
      
      -- Połącz wariant z price set
      INSERT INTO product_variant_price_set (variant_id, price_set_id)
      VALUES (variant_id, price_set_id);
      
      -- Wstaw cenę (50-500 EUR w centach)
      INSERT INTO price (id, price_set_id, amount, currency_code, created_at, updated_at)
      VALUES (
        'price_' || floor(extract(epoch from now()) * 1000)::bigint || '_' || substr(md5(random()::text), 1, 9),
        price_set_id,
        floor(random() * 45000 + 5000)::int,
        'eur',
        NOW(),
        NOW()
      );
      
      -- Małe opóźnienie żeby ID były unikalne
      PERFORM pg_sleep(0.001);
    END LOOP;
    
    RAISE NOTICE 'Dodano 50 produktów do kategorii %', cat_id;
  END LOOP;
  
  RAISE NOTICE 'Zakończono!';
END $$;
