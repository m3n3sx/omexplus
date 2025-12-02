# ⚡ Phase 0 - Quick Start Guide

## 🎯 Co to jest Phase 0?

Phase 0 to **rozszerzona architektura produktów** z:
- ✅ **SEO** - Meta tags, sitemaps, structured data
- ✅ **Search** - Full-text search, autocomplete, filters
- ✅ **Manufacturers** - Dane producentów, SKU mapping
- ✅ **B2B** - Pricing tiers, quotes, customer groups
- ✅ **Documentation** - Technical docs, datasheets

## 🚀 Instalacja (3 kroki)

### Krok 1: Uruchom setup script
```bash
chmod +x setup-phase-0.sh
./setup-phase-0.sh
```

To uruchomi:
1. Migracje bazy danych (8 migrations)
2. Seed manufacturers (10 producentów)
3. Generowanie SEO dla produktów

### Krok 2: Start backend
```bash
npm run dev
```

### Krok 3: Test endpoints
```bash
chmod +x test-phase-0.sh
./test-phase-0.sh
```

## ✅ Gotowe!

Teraz masz dostęp do:

### 🔍 Search
```bash
# Wyszukaj produkty
curl "http://localhost:9000/store/search?q=pompa"

# Autocomplete
curl "http://localhost:9000/store/search/autocomplete?q=pom"

# Szukaj po SKU producenta
curl "http://localhost:9000/store/search/manufacturer-sku?sku=REXROTH-123"
```

### 🏭 Manufacturers
```bash
# Lista producentów
curl "http://localhost:9000/admin/manufacturers"

# Dodaj producenta
curl -X POST http://localhost:9000/admin/manufacturers \
  -H "Content-Type: application/json" \
  -d '{"name":"Parker","slug":"parker"}'
```

### 🎯 SEO
```bash
# Sitemap
curl "http://localhost:9000/store/seo/sitemap.xml"

# Robots.txt
curl "http://localhost:9000/store/seo/robots.txt"
```

## 📚 Dokumentacja

- **API Reference**: `PHASE_0_API_REFERENCE.md`
- **Examples**: `PHASE_0_EXAMPLES.md`
- **Complete Guide**: `PHASE_0_COMPLETE.md`

## 🔧 Troubleshooting

### Problem: Migrations fail
```bash
# Reset database
npm run migrations:revert
npm run migrations:run
```

### Problem: No manufacturers
```bash
# Re-seed
npx ts-node src/scripts/seed-manufacturers.ts
```

### Problem: No SEO data
```bash
# Re-generate
npx ts-node src/scripts/generate-seo.ts
```

## 🎉 Co dalej?

1. **Import produktów** - Użyj bulk import z CSV
2. **Dodaj więcej producentów** - POST /admin/manufacturers
3. **Testuj search** - Sprawdź różne zapytania
4. **Integruj frontend** - Użyj przykładów z PHASE_0_EXAMPLES.md

## 📊 Status Check

Sprawdź czy wszystko działa:
```bash
# Check migrations
npm run migrations:show

# Check manufacturers count
curl "http://localhost:9000/admin/manufacturers" | jq '.total'

# Check search
curl "http://localhost:9000/store/search?q=test" | jq '.total'
```

Wszystko działa? **Phase 0 Complete!** 🎉
