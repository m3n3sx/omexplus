# 🎯 OSTATECZNA INSTRUKCJA - Dodawanie Produktów

## Problem
Medusa v2 ma nową strukturę autoryzacji która wymaga specjalnej konfiguracji.

## ✅ ROZWIĄZANIE (3 kroki)

### Krok 1: Utwórz Użytkownika Admin

Otwórz nowy terminal i uruchom:

```bash
npx medusa user -e admin@medusa-test.com -p supersecret
```

**LUB** jeśli to nie działa, użyj Admin Panel:

```
1. Otwórz: http://localhost:7001
2. Kliknij "Create Account"
3. Wypełnij formularz
4. Zaloguj się
```

### Krok 2: Uruchom Skrypt

```bash
node add-products-to-medusa.js
```

Skrypt doda **680 produktów** (20 na każdą z 34 podkategorii).

**Czas wykonania**: ~10-15 minut

### Krok 3: Sprawdź

```
Frontend: http://localhost:3000/pl/products
API: http://localhost:9000/store/products
```

---

## 📊 Co Zostanie Dodane

- **5 kategorii głównych**
- **34 podkategorie**
- **680 produktów** (20 na podkategorię)

Każdy produkt zawiera:
- Tytuł, opis
- SKU, EAN
- Ceny (PLN, EUR)
- Stan magazynowy
- Metadata (producent, wymiary, etc.)
- Tagi (dla wyszukiwarki)

---

## 🔧 Jeśli Nadal Nie Działa

### Opcja A: Dodaj Ręcznie przez Admin Panel

```
1. http://localhost:7001
2. Products → New Product
3. Wypełnij formularz
4. Save
```

### Opcja B: Użyj Medusa Seed

Medusa ma wbudowany system seedowania. Sprawdź dokumentację:
https://docs.medusajs.com/resources/references/medusa-config#seed

---

## 📝 Pliki Gotowe

- `add-products-to-medusa.js` - Główny skrypt
- `DODAJ_PRODUKTY.md` - Szczegółowa dokumentacja
- `PRODUKTY_GOTOWE.md` - Struktura produktów

---

## ✅ Podsumowanie

**Skrypt jest gotowy** - wymaga tylko utworzenia użytkownika admin.

**Najłatwiejszy sposób:**
1. Otwórz http://localhost:7001
2. Utwórz konto
3. Uruchom: `node add-products-to-medusa.js`

---

**Data**: 3 grudnia 2024  
**Status**: Gotowe - czeka na admina
