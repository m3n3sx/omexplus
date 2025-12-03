# 📦 Dodawanie Produktów do Bazy Danych

## 🎯 Cel
Usunięcie demo content i dodanie 100 produktów (20 na kategorię) z pełnymi danymi dla zaawansowanej wyszukiwarki.

---

## 🚀 Szybkie Uruchomienie

### Krok 1: Upewnij się że backend działa
```bash
cd my-medusa-store
npm run dev
```

### Krok 2: Zainstaluj zależności (jeśli potrzeba)
```bash
npm install axios pg
```

### Krok 3: Uruchom skrypt
```bash
node add-products-to-medusa.js
```

---

## 📊 Co Zostanie Dodane

### 5 Kategorii × 34 Podkategorie × 20 Produktów = 680 Produktów!

1. **Hydraulika** (10 podkategorii × 20 = 200 produktów)
   - Pompy hydrauliczne (20)
   - Silniki hydrauliczne (20)
   - Zawory hydrauliczne (20)
   - Cylindry hydrauliczne (20)
   - Wąż hydrauliczny & Złączki (20)
   - Zbiorniki hydrauliczne (20)
   - Filtry hydrauliczne (20)
   - Płyny hydrauliczne (20)
   - Garne hydrauliczne (20)
   - Czujniki & Wskaźniki (20)

2. **Filtry** (7 podkategorii × 20 = 140 produktów)
   - Filtry powietrza (20)
   - Filtry paliwa (20)
   - Filtry oleju (20)
   - Filtry hydrauliczne HF (20)
   - Filtry hydrauliczne HG (20)
   - Filtry hydrauliczne HH (20)
   - Komplety filtrów (20)

3. **Silniki** (6 podkategorii × 20 = 120 produktów)
   - Silniki spalinowe (20)
   - Turbosprężarki (20)
   - Układ paliwowy (20)
   - Układ chłodzenia (20)
   - Układ rozruchowy (20)
   - Paski & Łańcuchy (20)

4. **Podwozia** (6 podkategorii × 20 = 120 produktów)
   - Gąsienice gumowe (20)
   - Podwozia kołowe (20)
   - Groty gąsienic (20)
   - Bolce gąsienic (20)
   - Łączniki gąsienic (20)
   - Napinacze gąsienic (20)

5. **Elektryka** (5 podkategorii × 20 = 100 produktów)
   - Oświetlenie (20)
   - Kable & Przewody (20)
   - Silniki elektryczne (20)
   - Elektronika sterowania (20)
   - Baterie & Zasilanie (20)

---

## 🔍 Dane Produktu

Każdy produkt zawiera:

### Podstawowe
- ✅ Tytuł (np. "Pompa Rexroth A123")
- ✅ Opis (szczegółowy, 2-3 zdania)
- ✅ SKU (np. "HYD-0001")
- ✅ EAN (13 cyfr)
- ✅ Cena (PLN i EUR)
- ✅ Stan magazynowy (5-55 szt)

### Metadata (dla wyszukiwarki)
- ✅ Producent (Rexroth, Danfoss, Parker, etc.)
- ✅ Numer producenta (np. "REX-A123-001")
- ✅ Kraj pochodzenia (DE, US, IT, FR, UK, PL)
- ✅ Gwarancja (12/18/24/36 miesięcy)
- ✅ Waga (kg)
- ✅ Wymiary (mm)
- ✅ Ciśnienie max (bar)
- ✅ Zakres temperatur
- ✅ Materiał (Stal, Aluminium, Żeliwo, Brąz)
- ✅ Zastosowanie (Koparki, Ładowarki, Spycharki, Dźwigi)
- ✅ Kategoria główna
- ✅ Podkategoria
- ✅ Handle podkategorii

### Tagi (dla wyszukiwarki)
- ✅ Kategoria główna
- ✅ Podkategoria (handle)
- ✅ Producent
- ✅ Typ produktu
- ✅ Model

---

## 🧪 Testowanie

### Test 1: Sprawdź API
```bash
curl http://localhost:9000/store/products?limit=5
```

### Test 2: Sprawdź Frontend
```
http://localhost:3000/pl/products
```

### Test 3: Sprawdź Wyszukiwarkę
1. Wpisz "Rexroth" w wyszukiwarkę
2. Wpisz "pompa"
3. Wpisz "hydraulika"
4. Wpisz numer SKU (np. "HYD-0001")

---

## 🔧 Konfiguracja

### Zmiana danych logowania
Edytuj `add-products-to-medusa.js`:

```javascript
const ADMIN_EMAIL = 'admin@medusa-test.com'
const ADMIN_PASSWORD = 'supersecret'
```

### Zmiana liczby produktów
Edytuj `add-products-to-medusa.js`:

```javascript
const CATEGORIES_DATA = [
  {
    name: "Hydraulika",
    handle: "hydraulika",
    products: 30  // Zmień na 30
  },
  // ...
]
```

---

## 📈 Zaawansowane Opcje

### Dodaj tylko jedną kategorię
Edytuj skrypt i zostaw tylko jedną kategorię w `CATEGORIES_DATA`.

### Dodaj własne produkty
Edytuj funkcję `generateProduct()` w skrypcie.

### Zmień producent
ów
Edytuj tablicę `manufacturers` w funkcji `generateProduct()`.

---

## 🐛 Rozwiązywanie Problemów

### Problem: "Cannot login"
**Rozwiązanie**: Sprawdź czy backend działa i dane logowania są poprawne.

```bash
# Sprawdź backend
curl http://localhost:9000/health

# Sprawdź użytkownika admin
# W bazie danych powinien być użytkownik z emailem admin@medusa-test.com
```

### Problem: "Product creation failed"
**Rozwiązanie**: Sprawdź logi backendu w terminalu gdzie działa `npm run dev`.

### Problem: "Too many requests"
**Rozwiązanie**: Zwiększ opóźnienie w skrypcie:

```javascript
await new Promise(resolve => setTimeout(resolve, 500)) // Zmień z 100 na 500
```

---

## 📊 Struktura Produktu

### Przykład JSON
```json
{
  "title": "Pompa Rexroth A123",
  "description": "Wysokiej jakości pompa hydrauliczna...",
  "handle": "hydraulika-rexroth-a123-1",
  "status": "published",
  "metadata": {
    "manufacturer": "Rexroth",
    "manufacturer_sku": "REX-A123-001",
    "ean": "5900000000001",
    "origin_country": "DE",
    "warranty_months": 24,
    "weight_kg": "25.50",
    "pressure_max_bar": 280,
    "material": "Stal",
    "application": "Koparki"
  },
  "variants": [{
    "sku": "HYD-0001",
    "inventory_quantity": 15,
    "prices": [
      { "amount": 450000, "currency_code": "pln" },
      { "amount": 110000, "currency_code": "eur" }
    ]
  }],
  "tags": [
    { "value": "hydraulika" },
    { "value": "rexroth" },
    { "value": "pompa" }
  ]
}
```

---

## ✅ Checklist

Przed uruchomieniem:
- [ ] Backend działa na porcie 9000
- [ ] Masz dane logowania admina
- [ ] Zainstalowane zależności (axios, pg)
- [ ] Baza danych jest dostępna

Po uruchomieniu:
- [ ] Sprawdź logi - czy są błędy
- [ ] Sprawdź API - czy produkty są dodane
- [ ] Sprawdź frontend - czy produkty się wyświetlają
- [ ] Sprawdź wyszukiwarkę - czy działa

---

## 🎉 Gotowe!

Po uruchomieniu skryptu będziesz miał:
- ✅ **680 produktów** w bazie
- ✅ **5 kategorii głównych**
- ✅ **34 podkategorie**
- ✅ **20 produktów w każdej podkategorii**
- ✅ Pełne dane dla wyszukiwarki
- ✅ SKU, EAN, metadata
- ✅ Tagi dla filtrowania

**Czas wykonania**: ~10-15 minut (680 produktów × 100ms = ~68 sekund + overhead)

---

**Data**: 3 grudnia 2024  
**Status**: ✅ Gotowe do uruchomienia
