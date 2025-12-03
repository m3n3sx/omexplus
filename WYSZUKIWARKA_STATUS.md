# 🔍 Status Wyszukiwarki - Testy

## ✅ Co Działa

### 1. Wyszukiwanie Tekstowe ✅
**Status**: DZIAŁA

**Test**:
```bash
curl "http://localhost:9000/store/products?q=pompa"
```

**Wynik**: Znaleziono 6 produktów
- Pompa hydrauliczna A10VSO
- Pompa zębata PGP505
- Pompa łopatkowa V20

**Szuka w**: Tytuł produktu

---

### 2. Wyszukiwanie po Numerze Części ❌
**Status**: NIE DZIAŁA (ograniczenie API)

**Problem**: API Medusa `?q=` szuka tylko w tytule, nie w SKU wariantów

**Rozwiązanie**: Potrzebny custom endpoint lub rozszerzenie API

**Co by działało**:
- Gdyby SKU było w tytule produktu
- Gdyby był custom endpoint `/store/products/by-sku`

---

### 3. Wyszukiwanie Według Maszyny ❌
**Status**: NIE DZIAŁA (ograniczenie API)

**Problem**: API Medusa `?q=` nie szuka w metadata

**Test**:
```bash
curl "http://localhost:9000/store/products?q=Caterpillar"
```

**Wynik**: 0 produktów (mimo że metadata zawiera "Caterpillar")

**Rozwiązanie**: Potrzebny custom endpoint lub rozszerzenie API

**Co by działało**:
- Gdyby marka maszyny była w tytule
- Gdyby był custom endpoint `/store/products/by-machine`

---

## 🔧 Jak Naprawić

### Opcja 1: Dodaj Informacje do Tytułu (SZYBKIE)

Zaktualizuj tytuły produktów aby zawierały:
```sql
UPDATE product 
SET title = title || ' - ' || (metadata->>'machine_brand')
WHERE metadata->>'machine_brand' IS NOT NULL;
```

**Zalety**: Działa natychmiast z istniejącym API
**Wady**: Długie tytuły

---

### Opcja 2: Custom Search Endpoint (LEPSZE)

Stwórz custom endpoint w Medusa:
```typescript
// src/api/store/products/search/route.ts
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { q, machine_brand, sku } = req.query
  
  // Szukaj w metadata, SKU, tytule
  const products = await productService.search({
    q,
    metadata: { machine_brand },
    sku
  })
  
  return res.json({ products })
}
```

**Zalety**: Pełna kontrola nad wyszukiwaniem
**Wady**: Wymaga kodu backendu

---

### Opcja 3: Elasticsearch/Meilisearch (NAJLEPSZE)

Dodaj zewnętrzny search engine:
- Indeksuje wszystkie pola (tytuł, metadata, SKU)
- Szybkie wyszukiwanie full-text
- Faceted search (filtry)

**Zalety**: Profesjonalne wyszukiwanie
**Wady**: Wymaga dodatkowego serwisu

---

## 📊 Podsumowanie Testów

| Metoda | Status | Szuka w | Działa |
|--------|--------|---------|--------|
| Tekstowe | ✅ | Tytuł | TAK |
| Po numerze części | ❌ | SKU | NIE |
| Według maszyny | ❌ | Metadata | NIE |
| Filtry (cena) | ✅ | Cena | TAK |
| Wizualne | ⚠️ | - | Nie zaimplementowane |

## 🎯 Rekomendacja

### Dla Szybkiego Rozwiązania:
Zaktualizuj tytuły produktów aby zawierały kluczowe informacje:
```
"Pompa hydrauliczna A10VSO - Caterpillar 320D - SKU-123"
```

### Dla Długoterminowego Rozwiązania:
Zaimplementuj custom search endpoint który szuka w:
- Tytule
- Opisie
- Metadata (machine_brand, machine_type, machine_models)
- SKU wariantów
- Tagach

## 🚀 Następne Kroki

1. **Natychmiast**: Zaktualizuj tytuły produktów
2. **Krótkoterminowo**: Dodaj custom search endpoint
3. **Długoterminowo**: Rozważ Elasticsearch/Meilisearch

---

**Data**: 3 grudnia 2024  
**Wyszukiwanie tekstowe**: ✅ DZIAŁA  
**Wyszukiwanie zaawansowane**: ❌ Wymaga custom endpoint
