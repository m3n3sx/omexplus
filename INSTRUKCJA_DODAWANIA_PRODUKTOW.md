# 📦 Instrukcja Dodawania Produktów

## Problem
Skrypt automatyczny wymaga autoryzacji admina, która może nie być skonfigurowana.

## ✅ Rozwiązanie: Użyj Medusa Admin Panel

### Krok 1: Otwórz Admin Panel
```
http://localhost:7001
```

### Krok 2: Zaloguj się
- Email: `admin@medusa-test.com`
- Hasło: `supersecret`

**Jeśli nie możesz się zalogować**, utwórz użytkownika:

```bash
cd my-medusa-store
npx medusa user -e admin@medusa-test.com -p supersecret
```

### Krok 3: Dodaj Produkty Ręcznie (lub użyj CSV)

#### Opcja A: Ręcznie przez Panel
1. Kliknij "Products" w menu
2. Kliknij "New Product"
3. Wypełnij formularz
4. Zapisz

#### Opcja B: Import CSV
1. Przygotuj plik CSV z produktami
2. Użyj funkcji importu w panelu admin

---

## 🚀 Alternatywa: Użyj Medusa Seed

### Krok 1: Utwórz plik seed

Edytuj `my-medusa-store/data/seed.json`:

```json
{
  "products": [
    {
      "title": "Pompa hydrauliczna Rexroth A100",
      "description": "Wysokiej jakości pompa hydrauliczna",
      "handle": "pompa-rexroth-a100",
      "status": "published",
      "variants": [
        {
          "title": "Standard",
          "sku": "PUMP-0001",
          "inventory_quantity": 15,
          "prices": [
            {
              "amount": 450000,
              "currency_code": "pln"
            }
          ]
        }
      ]
    }
  ]
}
```

### Krok 2: Uruchom seed

```bash
cd my-medusa-store
npm run seed
```

---

## 📊 Szybkie Testowanie

### Dodaj 1 Produkt Testowy

```bash
curl -X POST http://localhost:9000/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Product",
    "description": "Test description",
    "status": "published"
  }'
```

---

## ✅ Sprawdź Produkty

### API
```bash
curl http://localhost:9000/store/products
```

### Frontend
```
http://localhost:3000/pl/products
```

---

## 🔧 Rozwiązywanie Problemów

### Problem: "Unauthorized"
**Rozwiązanie**: Utwórz użytkownika admin:
```bash
cd my-medusa-store
npx medusa user -e admin@medusa-test.com -p supersecret
```

### Problem: "Cannot connect to database"
**Rozwiązanie**: Sprawdź czy PostgreSQL działa:
```bash
psql -U postgres -d medusa-store -c "SELECT COUNT(*) FROM product;"
```

### Problem: "Products not showing"
**Rozwiązanie**: Sprawdź status produktów (muszą być "published")

---

## 📝 Ręczne Dodawanie przez SQL

Jeśli wszystko inne zawiedzie:

```sql
-- Połącz się z bazą
psql -U postgres -d medusa-store

-- Dodaj produkt
INSERT INTO product (id, title, handle, status, created_at, updated_at)
VALUES ('prod_test_001', 'Test Product', 'test-product', 'published', NOW(), NOW());

-- Dodaj wariant
INSERT INTO product_variant (id, title, product_id, sku, inventory_quantity, created_at, updated_at)
VALUES ('var_test_001', 'Standard', 'prod_test_001', 'TEST-0001', 10, NOW(), NOW());

-- Dodaj cenę
INSERT INTO money_amount (id, currency_code, amount, variant_id, created_at, updated_at)
VALUES ('price_test_001', 'pln', 100000, 'var_test_001', NOW(), NOW());

-- Sprawdź
SELECT * FROM product;
```

---

## 🎯 Rekomendacja

**Najłatwiejszy sposób:**
1. Otwórz Admin Panel: http://localhost:7001
2. Zaloguj się
3. Dodaj produkty przez interfejs

**Dla wielu produktów:**
1. Przygotuj CSV
2. Użyj funkcji importu w panelu

---

**Data**: 3 grudnia 2024  
**Status**: Instrukcje gotowe
