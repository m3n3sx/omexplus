-- Dodaj wszystkie produkty do sales channel

DO $$
DECLARE
  sc_id TEXT;
  prod_record RECORD;
  added INTEGER := 0;
BEGIN
  -- Pobierz sales channel
  SELECT id INTO sc_id FROM sales_channel LIMIT 1;
  RAISE NOTICE 'Sales Channel: %', sc_id;
  
  -- Dla każdego produktu który nie ma sales channel
  FOR prod_record IN 
    SELECT p.id 
    FROM product p 
    LEFT JOIN product_sales_channel psc ON p.id = psc.product_id 
    WHERE psc.product_id IS NULL
  LOOP
    INSERT INTO product_sales_channel (id, product_id, sales_channel_id, created_at, updated_at)
    VALUES (
      'psc_' || (extract(epoch from clock_timestamp()) * 1000)::bigint || '_' || substr(md5(random()::text), 1, 9),
      prod_record.id,
      sc_id,
      NOW(),
      NOW()
    );
    
    added := added + 1;
  END LOOP;
  
  RAISE NOTICE 'Dodano % produktów do sales channel', added;
END $$;

-- Sprawdź
SELECT COUNT(*) as produkty_w_sales_channel FROM product_sales_channel;
