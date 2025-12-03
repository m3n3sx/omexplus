# ✅ Custom Search Endpoints - DZIAŁAJĄ!

## Podsumowanie

Zaimplementowałem **Opcję 2 - Custom Search Endpoints** które szukają w:
- ✅ Tytule produktu
- ✅ Opisie produktu  
- ✅ SKU wariantów
- ✅ Metadata (machine_brand, machine_type, machine_models, part_number)

## 3 Działające Endpointy

### 1. Text Search (Wyszukiwanie tekstowe)
```bash
GET /store/omex-search/text?q=pompa
```

**Wynik:**
- Znaleziono: **6 produktów**
- Przykład: "Pompa ratunkowa PTO [JCB]"
- Szuka w: title, description, SKU, metadata

### 2. Part Number Search (Wyszukiwanie po SKU)
```bash
GET /store/omex-search/part-number?partNumber=HYD-001
```

**Wynik:**
- Znaleziono: **1 produkt**
- Produkt: "Pompa hydrauliczna A10VSO [Doosan]"
- SKU: HYD-001
- Szuka w: SKU, metadata->part_number, title

### 3. Machine Search (Wyszukiwanie według maszyny)
```bash
GET /store/omex-search?brand=Komatsu&machineType=Koparka&model=PC200
```

**Wynik:**
- Znaleziono: **10 produktów**
- Przykład: "Gąsienice gumowe Rexroth M108 [Komatsu]"
- Szuka w: metadata->machine_brand, machine_type, machine_models (JSON array)

## Implementacja

### Backend
- **Service:** `src/modules/omex-search/advanced-search.service.ts`
  - Używa raw SQL queries przez Knex
  - Szuka w metadata JSON fields
  - Wspiera JSON arrays (machine_models)
  
- **Endpointy:**
  - `src/api/store/omex-search/text/route.ts`
  - `src/api/store/omex-search/part-number/route.ts`
  - `src/api/store/omex-search/route.ts` (machine search)

### Frontend
- **Hook:** `storefront/hooks/useSearch.ts`
  - Zaktualizowany aby używać custom endpointów
  - Obsługuje wszystkie 3 metody wyszukiwania

## SQL Queries

### Text Search
```sql
SELECT p.*, json_agg(pv.*) as variants
FROM product p
LEFT JOIN product_variant pv ON p.id = pv.product_id
WHERE 
  LOWER(p.title) LIKE '%pompa%'
  OR LOWER(p.description) LIKE '%pompa%'
  OR LOWER(pv.sku) LIKE '%pompa%'
  OR LOWER(p.metadata->>'machine_brand') LIKE '%pompa%'
  OR LOWER(p.metadata->>'part_number') LIKE '%pompa%'
GROUP BY p.id
ORDER BY match_rank
```

### Part Number Search
```sql
SELECT p.*, json_agg(pv.*) as variants
FROM product p
LEFT JOIN product_variant pv ON p.id = pv.product_id
WHERE 
  pv.sku ILIKE '%HYD-001%'
  OR p.metadata->>'part_number' ILIKE '%HYD-001%'
  OR p.title ILIKE '%HYD-001%'
GROUP BY p.id
ORDER BY match_rank
```

### Machine Search
```sql
SELECT p.*, json_agg(pv.*) as variants
FROM product p
LEFT JOIN product_variant pv ON p.id = pv.product_id
WHERE 
  LOWER(p.metadata->>'machine_brand') LIKE '%komatsu%'
  AND LOWER(p.metadata->>'machine_type') LIKE '%koparka%'
  AND (p.metadata->'machine_models' @> '["PC200"]'::jsonb 
       OR LOWER(p.title) LIKE '%pc200%')
GROUP BY p.id
ORDER BY p.created_at DESC
```

## Kluczowe Rozwiązania

1. **Raw SQL przez Knex** - Medusa Query API nie wspiera dobrze zagnieżdżonych filtrów
2. **JSON operators** - Używam `->` i `->>` dla metadata, `@>` dla JSON arrays
3. **GROUP BY zamiast DISTINCT** - Unikam problemów z ORDER BY
4. **Match ranking** - Sortowanie według trafności (title > SKU > metadata)
5. **Normalizacja** - Zachowuję myślniki w SKU (HYD-001)

## Testowanie

```bash
# Test 1: Text search
curl -H "x-publishable-api-key: YOUR_KEY" \
  "http://localhost:9000/store/omex-search/text?q=pompa"

# Test 2: SKU search  
curl -H "x-publishable-api-key: YOUR_KEY" \
  "http://localhost:9000/store/omex-search/part-number?partNumber=HYD-001"

# Test 3: Machine search
curl -H "x-publishable-api-key: YOUR_KEY" \
  "http://localhost:9000/store/omex-search?brand=Komatsu&machineType=Koparka&model=PC200"
```

## Następne Kroki

1. ✅ Wyszukiwanie tekstowe działa
2. ✅ Wyszukiwanie po SKU działa
3. ✅ Wyszukiwanie według maszyny działa
4. 🔄 Integracja z frontendem (UnifiedSearchHub)
5. 🔄 Testy użytkownika

## Status: ✅ GOTOWE DO TESTOWANIA
