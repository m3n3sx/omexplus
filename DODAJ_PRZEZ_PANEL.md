# 📦 Dodaj Produkty przez Admin Panel

## 🎯 Najszybsze Rozwiązanie

Skoro masz już konto w Admin Panel, dodajmy produkty bezpośrednio tam.

---

## 🚀 Krok po Kroku

### 1. Otwórz Admin Panel
```
http://localhost:7001
```

### 2. Zaloguj się
- Email: meneswczesny@gmail.com
- Hasło: CAnabis123#$

### 3. Dodaj Pierwszy Produkt Testowy

Kliknij **Products** → **New Product**

Wypełnij:
- **Title**: Pompa hydrauliczna Rexroth A100
- **Subtitle**: Model A100 - Oryginalna część Rexroth
- **Description**: Wysokiej jakości pompa hydrauliczna marki Rexroth. Model A100 zapewnia doskonałą wydajność i trwałość. Idealny do maszyn budowlanych.
- **Handle**: pompa-rexroth-a100
- **Status**: Published

### 4. Dodaj Wariant

W sekcji **Variants**:
- **Title**: Standard
- **SKU**: PUMP-0001
- **EAN**: 5900000000001
- **Inventory**: 15
- **Manage Inventory**: ✓

### 5. Dodaj Cenę

W sekcji **Pricing**:
- **Currency**: PLN
- **Amount**: 4500.00

Kliknij **Save**

### 6. Sprawdź na Frontendzie

```
http://localhost:3000/pl/products
```

Powinieneś zobaczyć produkt!

---

## 📋 Szablon Produktu (Kopiuj i Wklej)

### Hydraulika - Pompy (20 produktów)

```
1. Pompa hydrauliczna Rexroth A100 | SKU: PUMP-0001 | 4500 PLN
2. Pompa hydrauliczna Danfoss B101 | SKU: PUMP-0002 | 4200 PLN
3. Pompa hydrauliczna Parker C102 | SKU: PUMP-0003 | 3800 PLN
4. Pompa hydrauliczna Eaton D103 | SKU: PUMP-0004 | 4100 PLN
5. Pompa hydrauliczna Vickers E104 | SKU: PUMP-0005 | 3900 PLN
... (15 więcej)
```

### Filtry - Filtry powietrza (20 produktów)

```
1. Filtr powietrza Mann A100 | SKU: AIR-0001 | 150 PLN
2. Filtr powietrza Donaldson B101 | SKU: AIR-0002 | 180 PLN
3. Filtr powietrza Fleetguard C102 | SKU: AIR-0003 | 160 PLN
... (17 więcej)
```

---

## 💡 Import CSV (Szybsza Opcja)

Jeśli Admin Panel ma funkcję importu CSV:

### 1. Utwórz plik CSV

```csv
title,description,handle,sku,price,inventory
"Pompa Rexroth A100","Wysokiej jakości pompa","pompa-rexroth-a100","PUMP-0001",4500,15
"Pompa Danfoss B101","Wysokiej jakości pompa","pompa-danfoss-b101","PUMP-0002",4200,18
```

### 2. Import w Panelu

Products → Import → Upload CSV

---

## 🔧 Alternatywa: Dodaj przez API z Tokenem

### 1. Pobierz Token z Admin Panel

W Admin Panel:
1. Settings → API Keys
2. Create New Key
3. Skopiuj token

### 2. Zaktualizuj Skrypt

Edytuj `add-products-to-medusa.js`:

```javascript
// Zamiast logowania, użyj tokena bezpośrednio
const authToken = 'TWOJ_TOKEN_Z_PANELU'
```

### 3. Uruchom

```bash
node add-products-to-medusa.js
```

---

## ✅ Najprostsze Rozwiązanie

**Dodaj 5-10 produktów ręcznie przez panel** aby przetestować czy wszystko działa.

Następnie możemy:
1. Użyć importu CSV dla reszty
2. Naprawić autoryzację w skrypcie
3. Dodać więcej ręcznie

---

**Wybierz co wolisz - mogę pomóc z każdą opcją!**

Data: 3 grudnia 2024
