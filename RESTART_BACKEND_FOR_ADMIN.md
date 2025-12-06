# ⚠️ Musisz Zrestartować Backend!

## Problem
Zmieniłeś konfigurację w `medusa-config.ts`, ale backend musi być zrestartowany, żeby zmiany zadziałały.

## ✅ Rozwiązanie

### 1. Zatrzymaj backend
Naciśnij `Ctrl + C` w terminalu gdzie działa backend

### 2. Uruchom ponownie
```bash
cd ~/my-medusa-store
npm run dev
```

### 3. Poczekaj na komunikat
```
✔ Server is ready on port: 9000
✔ Admin is ready at: http://localhost:9000/app
```

### 4. Otwórz admin
**URL:** http://localhost:9000/app

---

## 🎯 Co Zobaczysz

Po otwarciu http://localhost:9000/app zobaczysz:

1. **Ekran logowania** Medusa Admin
2. **Nowoczesny interfejs** z logo Medusa
3. **Formularz logowania:**
   - Email: `admin@medusa-test.com`
   - Password: `supersecret`

---

## 📸 Jak Wygląda Medusa Admin

### Ekran Logowania:
- Czyste, minimalistyczne logo
- Duże pola formularza
- Przycisk "Sign in"

### Po Zalogowaniu:
- **Lewe menu:**
  - 📦 Products
  - 📋 Orders
  - 👥 Customers
  - 💰 Discounts
  - 🎁 Gift Cards
  - ⚙️ Settings

- **Główny panel:**
  - Dashboard z statystykami
  - Szybkie akcje
  - Ostatnie zamówienia

---

## 🔍 Sprawdzenie

### Test 1: Sprawdź czy backend działa
```bash
curl http://localhost:9000/health
```
Powinno zwrócić: `OK`

### Test 2: Sprawdź czy admin działa
```bash
curl -I http://localhost:9000/app
```
Powinno zwrócić: `HTTP/1.1 200 OK`

### Test 3: Otwórz w przeglądarce
http://localhost:9000/app

---

## ❌ Jeśli Nadal Nie Działa

### Problem 1: Backend nie startuje
**Rozwiązanie:**
```bash
# Sprawdź logi
npm run dev

# Jeśli błąd z bazą danych:
# Sprawdź czy PostgreSQL działa
```

### Problem 2: Admin pokazuje błąd 404
**Rozwiązanie:**
```bash
# Sprawdź czy admin jest włączony w konfiguracji
cat medusa-config.ts | grep -A 5 "admin:"

# Powinno pokazać:
# admin: {
#   disable: false,
#   path: "/app",
#   ...
# }
```

### Problem 3: Strona się ładuje ale nic nie widać
**Rozwiązanie:**
- Wyczyść cache przeglądarki (Ctrl + Shift + R)
- Spróbuj w trybie incognito
- Sprawdź konsolę przeglądarki (F12)

---

## 🆘 Ostateczne Rozwiązanie

Jeśli nic nie pomaga, zrób pełny restart:

```bash
# 1. Zatrzymaj wszystko
# Ctrl + C w każdym terminalu

# 2. Wyczyść cache
cd ~/my-medusa-store
rm -rf .medusa
rm -rf node_modules/.cache

# 3. Przebuduj
npm run build

# 4. Uruchom ponownie
npm run dev
```

---

## ✅ Powinno Działać!

Po restarcie backendu, Medusa Admin będzie dostępny na:
**http://localhost:9000/app**

Zaloguj się i ciesz się nowoczesnym interfejsem! 🎉
