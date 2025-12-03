-- Uzupełnienie produktów o pełne dane: SKU, ceny, ilości, metadata z maszynami
BEGIN;

-- 1. Dodaj SKU do wariantów które go nie mają
UPDATE product_variant pv
SET sku = 'SKU-' || pv.id
WHERE sku IS NULL OR sku = '';

-- 2. Dodaj metadata do produktów z informacjami o maszynach
DO $$
DECLARE
  prod RECORD;
  machine_brands TEXT[] := ARRAY['Caterpillar', 'Komatsu', 'Volvo', 'Hitachi', 'JCB', 'Liebherr', 'Doosan', 'Hyundai'];
  machine_types TEXT[] := ARRAY['Koparka', 'Ładowarka', 'Spycharka', 'Dźwig', 'Walec'];
  machine_models TEXT[] := ARRAY['320D', '330D', '336D', 'PC200', 'PC300', 'EC210', 'EC380', 'ZX200', 'ZX350'];
  rand_brand TEXT;
  rand_type TEXT;
  rand_models TEXT[];
  metadata_json JSONB;
BEGIN
  FOR prod IN SELECT id, title FROM product WHERE deleted_at IS NULL LOOP
    -- Losuj markę, typ i modele maszyn
    rand_brand := machine_brands[1 + floor(random() * array_length(machine_brands, 1))];
    rand_type := machine_types[1 + floor(random() * array_length(machine_types, 1))];
    rand_models := ARRAY[
      machine_models[1 + floor(random() * array_length(machine_models, 1))],
      machine_models[1 + floor(random() * array_length(machine_models, 1))]
    ];
    
    -- Utwórz metadata JSON
    metadata_json := jsonb_build_object(
      'machine_brand', rand_brand,
      'machine_type', rand_type,
      'machine_models', rand_models,
      'manufacturer', CASE 
        WHEN prod.title LIKE '%Rexroth%' THEN 'Rexroth'
        WHEN prod.title LIKE '%Danfoss%' THEN 'Danfoss'
        WHEN prod.title LIKE '%Parker%' THEN 'Parker'
        WHEN prod.title LIKE '%Eaton%' THEN 'Eaton'
        WHEN prod.title LIKE '%Vickers%' THEN 'Vickers'
        WHEN prod.title LIKE '%Bosch%' THEN 'Bosch'
        WHEN prod.title LIKE '%Mann%' THEN 'Mann'
        WHEN prod.title LIKE '%CAT%' THEN 'CAT'
        ELSE 'Generic'
      END,
      'warranty_months', 12 + (floor(random() * 3) * 6),
      'origin_country', (ARRAY['DE', 'US', 'IT', 'FR', 'UK', 'PL'])[1 + floor(random() * 6)],
      'weight_kg', round((random() * 50 + 1)::numeric, 2),
      'condition', 'new',
      'oem_number', 'OEM-' || substr(md5(random()::text), 1, 8)
    );
    
    -- Zaktualizuj metadata produktu
    UPDATE product 
    SET metadata = metadata_json,
        description = CASE 
          WHEN description IS NULL OR description = '' THEN
            'Wysokiej jakości część do maszyn ' || rand_brand || '. Kompatybilna z modelami: ' || 
            array_to_string(rand_models, ', ') || '. Gwarancja producenta. Certyfikaty CE i ISO.'
          ELSE description
        END
    WHERE id = prod.id;
  END LOOP;
  
  RAISE NOTICE 'Zaktualizowano metadata dla wszystkich produktów';
END $$;

-- 3. Upewnij się że wszystkie warianty mają ceny
DO $$
DECLARE
  var RECORD;
  pset_id TEXT;
  price_id TEXT;
  price_amount NUMERIC;
  raw_amount_json JSONB;
BEGIN
  FOR var IN 
    SELECT pv.id, pv.product_id, pv.sku
    FROM product_variant pv
    LEFT JOIN product_variant_price_set pvps ON pv.id = pvps.variant_id
    WHERE pvps.variant_id IS NULL
  LOOP
    -- Generuj ID
    pset_id := 'pset_fix_' || var.id;
    price_id := 'price_fix_' || var.id;
    price_amount := (50000 + floor(random() * 450000));
    raw_amount_json := json_build_object('value', price_amount::text, 'precision', 20)::jsonb;
    
    -- Utwórz price_set
    INSERT INTO price_set (id, created_at, updated_at)
    VALUES (pset_id, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;
    
    -- Utwórz cenę
    INSERT INTO price (id, price_set_id, amount, raw_amount, currency_code, created_at, updated_at)
    VALUES (price_id, pset_id, price_amount, raw_amount_json, 'pln', NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;
    
    -- Połącz wariant z price_set
    INSERT INTO product_variant_price_set (id, variant_id, price_set_id, created_at, updated_at)
    VALUES ('pvps_fix_' || var.id, var.id, pset_id, NOW(), NOW())
    ON CONFLICT (variant_id, price_set_id) DO NOTHING;
  END LOOP;
  
  RAISE NOTICE 'Dodano ceny do wariantów które ich nie miały';
END $$;

-- 4. Upewnij się że wszystkie warianty mają inventory
DO $$
DECLARE
  var RECORD;
  inv_item_id TEXT;
  inv_level_id TEXT;
  stock_qty INTEGER;
BEGIN
  FOR var IN 
    SELECT pv.id, pv.sku
    FROM product_variant pv
    LEFT JOIN product_variant_inventory_item pvii ON pv.id = pvii.variant_id
    WHERE pvii.variant_id IS NULL
  LOOP
    inv_item_id := 'iitem_fix_' || var.id;
    inv_level_id := 'ilevel_fix_' || var.id;
    stock_qty := 5 + floor(random() * 45);
    
    -- Utwórz inventory_item
    INSERT INTO inventory_item (id, sku, created_at, updated_at)
    VALUES (inv_item_id, var.sku, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;
    
    -- Połącz wariant z inventory_item (sprawdź czy już nie istnieje)
    IF NOT EXISTS (SELECT 1 FROM product_variant_inventory_item WHERE variant_id = var.id) THEN
      INSERT INTO product_variant_inventory_item (id, variant_id, inventory_item_id, required_quantity, created_at, updated_at)
      VALUES ('pvii_fix_' || var.id, var.id, inv_item_id, 1, NOW(), NOW());
    END IF;
    
    -- Dodaj inventory_level
    INSERT INTO inventory_level (id, inventory_item_id, location_id, stocked_quantity, reserved_quantity, created_at, updated_at)
    VALUES (inv_level_id, inv_item_id, 'sloc_01KBDXHQCK3KM5ZFCHT7ZAQAK3', stock_qty, 0, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;
  END LOOP;
  
  RAISE NOTICE 'Dodano stany magazynowe do wariantów które ich nie miały';
END $$;

COMMIT;

-- Podsumowanie
SELECT 
  'Produkty' as typ,
  COUNT(*) as total,
  COUNT(CASE WHEN metadata IS NOT NULL THEN 1 END) as z_metadata,
  COUNT(CASE WHEN description IS NOT NULL AND description != '' THEN 1 END) as z_opisem
FROM product WHERE deleted_at IS NULL;

SELECT 
  'Warianty' as typ,
  COUNT(*) as total,
  COUNT(CASE WHEN sku IS NOT NULL AND sku != '' THEN 1 END) as z_sku
FROM product_variant WHERE deleted_at IS NULL;

SELECT 
  'Ceny' as typ,
  COUNT(DISTINCT pvps.variant_id) as warianty_z_cena
FROM product_variant_price_set pvps;

SELECT 
  'Magazyn' as typ,
  COUNT(DISTINCT pvii.variant_id) as warianty_z_magazynem,
  COALESCE(SUM(il.stocked_quantity), 0) as total_stock
FROM product_variant_inventory_item pvii
LEFT JOIN inventory_level il ON pvii.inventory_item_id = il.inventory_item_id;
