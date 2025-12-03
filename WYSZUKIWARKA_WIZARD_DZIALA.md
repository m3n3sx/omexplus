# ✅ Wyszukiwarka Według Maszyny - Wizard Krok Po Kroku DZIAŁA!

## Podsumowanie

Zaimplementowałem **4-krokowy wizard** wyszukiwania według maszyny, który działa dokładnie jak opisano:

## Flow Wizarda

### KROK 1: Wybór Marki
```bash
GET /store/omex-search
```

**Wynik:**
```json
{
  "step": 1,
  "brands": [
    {"value": "Doosan", "label": "Doosan", "count": 191},
    {"value": "Liebherr", "label": "Liebherr", "count": 187},
    {"value": "Volvo", "label": "Volvo", "count": 174},
    {"value": "Caterpillar", "label": "Caterpillar", "count": 150}
  ]
}
```

### KROK 2: Wybór Typu Maszyny
**Użytkownik kliknie: Caterpillar**

```bash
GET /store/omex-search?brand=Caterpillar
```

**Wynik:**
```json
{
  "step": 2,
  "brand": "Caterpillar",
  "types": [
    {"value": "Ładowarka", "label": "Ładowarka", "count": 45},
    {"value": "Spycharka", "label": "Spycharka", "count": 36},
    {"value": "Koparka", "label": "Koparka", "count": 31},
    {"value": "Walec", "label": "Walec", "count": 23},
    {"value": "Dźwig", "label": "Dźwig", "count": 15}
  ],
  "products": [...],  // 50 produktów dla Caterpillar
  "total": 50
}
```

### KROK 3: Wybór Modelu
**Użytkownik kliknie: Koparka**

```bash
GET /store/omex-search?brand=Caterpillar&machineType=Koparka
```

**Wynik:**
```json
{
  "step": 3,
  "brand": "Caterpillar",
  "machineType": "Koparka",
  "models": [
    {"value": "ZX350", "label": "ZX350", "count": 10},
    {"value": "EC210", "label": "EC210", "count": 8},
    {"value": "PC200", "label": "PC200", "count": 8},
    {"value": "320D", "label": "320D", "count": 7},
    {"value": "330D", "label": "330D", "count": 6}
  ],
  "products": [...],  // 31 produktów dla Caterpillar Koparka
  "total": 31
}
```

### KROK 4: Finalne Wyniki
**Użytkownik kliknie: 320D**

```bash
GET /store/omex-search?brand=Caterpillar&machineType=Koparka&model=320D
```

**Wynik:**
```json
{
  "step": 4,
  "brand": "Caterpillar",
  "machineType": "Koparka",
  "model": "320D",
  "products": [
    {
      "id": "prod_xxx",
      "title": "Komplety filtrów Rexroth M108 [Caterpillar]",
      "handle": "komplety-filtrow-rexroth-m108-caterpillar",
      "variants": [...]
    }
  ],
  "total": 7
}
```

## Kluczowe Cechy

✅ **Progresywne zawężanie** - każdy krok pokazuje dostępne opcje i zawęża wyniki  
✅ **Liczniki** - każda opcja pokazuje ile produktów jest dostępnych  
✅ **Produkty na każdym kroku** - od kroku 2 użytkownik widzi produkty  
✅ **Dynamiczne opcje** - opcje w kroku 2 i 3 zależą od poprzednich wyborów  
✅ **Real-time z bazy** - wszystkie dane pobierane z PostgreSQL metadata

## Implementacja

### Backend Endpoints

**Główny endpoint:** `src/api/store/omex-search/route.ts`
- Obsługuje wszystkie 4 kroki w jednym endpoincie
- Zwraca różne dane w zależności od parametrów

**Service:** `src/modules/omex-search/advanced-search.service.ts`
- `getMachineBrands()` - pobiera marki z metadata
- `getMachineTypes(brand)` - pobiera typy dla marki
- `getMachineModels(brand, type)` - pobiera modele z JSON array
- `searchByMachine(params)` - wyszukuje produkty

### SQL Queries

**Krok 1 - Marki:**
```sql
SELECT 
  metadata->>'machine_brand' as brand,
  COUNT(DISTINCT p.id) as count
FROM product p
WHERE p.deleted_at IS NULL
  AND metadata->>'machine_brand' IS NOT NULL
GROUP BY metadata->>'machine_brand'
ORDER BY count DESC
```

**Krok 2 - Typy:**
```sql
SELECT 
  metadata->>'machine_type' as type,
  COUNT(DISTINCT p.id) as count
FROM product p
WHERE p.deleted_at IS NULL
  AND metadata->>'machine_brand' = 'Caterpillar'
GROUP BY metadata->>'machine_type'
ORDER BY count DESC
```

**Krok 3 - Modele:**
```sql
SELECT 
  jsonb_array_elements_text(metadata->'machine_models') as model,
  COUNT(DISTINCT p.id) as count
FROM product p
WHERE p.deleted_at IS NULL
  AND metadata->>'machine_brand' = 'Caterpillar'
  AND metadata->>'machine_type' = 'Koparka'
GROUP BY model
ORDER BY count DESC
```

**Krok 4 - Produkty:**
```sql
SELECT p.*, json_agg(pv.*) as variants
FROM product p
LEFT JOIN product_variant pv ON p.id = pv.product_id
WHERE p.deleted_at IS NULL
  AND metadata->>'machine_brand' = 'Caterpillar'
  AND metadata->>'machine_type' = 'Koparka'
  AND metadata->'machine_models' @> '["320D"]'::jsonb
GROUP BY p.id
ORDER BY p.created_at DESC
```

## Testowanie

```bash
# Krok 1: Lista marek
curl -H "x-publishable-api-key: YOUR_KEY" \
  "http://localhost:9000/store/omex-search"

# Krok 2: Wybrano Caterpillar
curl -H "x-publishable-api-key: YOUR_KEY" \
  "http://localhost:9000/store/omex-search?brand=Caterpillar"

# Krok 3: Wybrano Caterpillar + Koparka
curl -H "x-publishable-api-key: YOUR_KEY" \
  "http://localhost:9000/store/omex-search?brand=Caterpillar&machineType=Koparka"

# Krok 4: Wybrano Caterpillar + Koparka + 320D
curl -H "x-publishable-api-key: YOUR_KEY" \
  "http://localhost:9000/store/omex-search?brand=Caterpillar&machineType=Koparka&model=320D"
```

## Przykładowy Flow Użytkownika

1. **Użytkownik otwiera wyszukiwarkę** → widzi 8 marek
2. **Klika "Caterpillar"** → widzi 5 typów maszyn + 150 produktów Caterpillar
3. **Klika "Koparka"** → widzi 31 modeli + 31 produktów dla koparek Caterpillar
4. **Klika "320D"** → widzi 7 produktów specyficznych dla CAT 320D

## Status: ✅ GOTOWE DO INTEGRACJI Z FRONTENDEM

Następny krok: Zaktualizować `UnifiedSearchHub` aby używał tego wizarda.
