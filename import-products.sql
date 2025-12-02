-- Import 120 products directly to database
-- Run with: psql -d your_database -f import-products.sql

BEGIN;

-- Insert sample products (first 10 as example)
-- HYD-001
INSERT INTO product (id, title, handle, status, created_at, updated_at, metadata)
VALUES (
  'prod_hyd001',
  'Pompa hydrauliczna A10VSO',
  'hyd-001',
  'published',
  NOW(),
  NOW(),
  '{"sku": "HYD-001", "name_en": "Hydraulic pump A10VSO", "name_de": "Hydraulische Pumpe A10VSO", "category_id": "cat-hydraulika", "equipment_type": "Hydraulika", "min_order_qty": 1, "cost": 1249.99, "technical_specs": {"displacement": "28cc", "pressure": "280bar", "speed": "2800rpm"}}'::jsonb
);

INSERT INTO product_variant (id, product_id, title, sku, manage_inventory, created_at, updated_at)
VALUES ('var_hyd001', 'prod_hyd001', 'Default', 'HYD-001', false, NOW(), NOW());

INSERT INTO price (id, variant_id, amount, currency_code, created_at, updated_at)
VALUES ('price_hyd001', 'var_hyd001', 249999, 'pln', NOW(), NOW());

-- HYD-002
INSERT INTO product (id, title, handle, status, created_at, updated_at, metadata)
VALUES (
  'prod_hyd002',
  'Zawór sterujący 4/3',
  'hyd-002',
  'published',
  NOW(),
  NOW(),
  '{"sku": "HYD-002", "name_en": "Directional control valve 4/3", "name_de": "Wegeventil 4/3", "category_id": "cat-hydraulika", "equipment_type": "Hydraulika", "min_order_qty": 1, "cost": 449.99, "technical_specs": {"flow": "80L/min", "pressure": "350bar", "ports": "G1/2"}}'::jsonb
);

INSERT INTO product_variant (id, product_id, title, sku, manage_inventory, created_at, updated_at)
VALUES ('var_hyd002', 'prod_hyd002', 'Default', 'HYD-002', false, NOW(), NOW());

INSERT INTO price (id, variant_id, amount, currency_code, created_at, updated_at)
VALUES ('price_hyd002', 'var_hyd002', 89999, 'pln', NOW(), NOW());

-- HYD-003
INSERT INTO product (id, title, handle, status, created_at, updated_at, metadata)
VALUES (
  'prod_hyd003',
  'Cylinder hydrauliczny 50/28',
  'hyd-003',
  'published',
  NOW(),
  NOW(),
  '{"sku": "HYD-003", "name_en": "Hydraulic cylinder 50/28", "name_de": "Hydraulikzylinder 50/28", "category_id": "cat-hydraulika", "equipment_type": "Hydraulika", "min_order_qty": 1, "cost": 649.99, "technical_specs": {"bore": "50mm", "rod": "28mm", "stroke": "300mm"}}'::jsonb
);

INSERT INTO product_variant (id, product_id, title, sku, manage_inventory, created_at, updated_at)
VALUES ('var_hyd003', 'prod_hyd003', 'Default', 'HYD-003', false, NOW(), NOW());

INSERT INTO price (id, variant_id, amount, currency_code, created_at, updated_at)
VALUES ('price_hyd003', 'var_hyd003', 129999, 'pln', NOW(), NOW());

COMMIT;

-- Check results
SELECT COUNT(*) as total_products FROM product WHERE handle LIKE 'hyd-%';
SELECT p.title, pv.sku, pr.amount/100.0 as price_pln 
FROM product p 
JOIN product_variant pv ON p.id = pv.product_id 
JOIN price pr ON pv.id = pr.variant_id 
WHERE p.handle LIKE 'hyd-%'
LIMIT 10;
