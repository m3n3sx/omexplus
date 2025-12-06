-- Add Ukraine region with UAH currency
INSERT INTO region (id, name, currency_code, automatic_taxes, created_at, updated_at)
VALUES (
  'reg_01UKRAINE000000000000000',
  'Ukraine',
  'uah',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  currency_code = EXCLUDED.currency_code,
  updated_at = NOW();

-- Update Ukraine country to point to Ukraine region
UPDATE region_country 
SET region_id = 'reg_01UKRAINE000000000000000'
WHERE iso_2 = 'ua';

SELECT 'Ukraine region with UAH currency created successfully!' as status;
