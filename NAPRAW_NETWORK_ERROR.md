# 🔧 Naprawa Network Error

## Problem
```
Unhandled Runtime Error
Error: Network Error
```

## Przyczyny

### 1. Backend nie jest uruchomiony ❌
Backend Medusa musi działać na porcie 9000.

### 2. CORS nie jest skonfigurowany ❌
Backend musi zezwalać na połączenia z localhost:3000.

### 3. Błędny URL backendu ❌
Zmienna środowiskowa może być niepoprawna.

---

## ✅ Rozwiązanie Krok po Kroku

### Krok 1: Sprawdź Backend

```bash
# Terminal 1 - Uruchom backend
cd my-medusa-store
npm run dev
```

**Sprawdź czy widzisz:**
```
Server is ready on port: 9000
```

**Jeśli nie działa:**
```bash
# Sprawdź czy port 9000 jest zajęty
lsof -i :9000

# Jeśli zajęty, zabij proces
kill -9 <PID>

# Uruchom ponownie
npm run dev
```

### Krok 2: Sprawdź CORS

Otwórz `my-medusa-store/medusa-config.ts`:

```typescript
module.exports = {
  projectConfig: {
    // ... inne ustawienia
    
    // WAŻNE: Dodaj CORS
    store_cors: "http://localhost:3000",
    admin_cors: "http://localhost:7001",
  },
  // ...
}
```

**Po zmianie, zrestartuj backend:**
```bash
# Ctrl+C aby zatrzymać
npm run dev
```

### Krok 3: Sprawdź Zmienne Środowiskowe

Otwórz `storefront/.env.local`:

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_storefront_2024_token
```

**Ważne:**
- URL musi być `http://localhost:9000` (nie `127.0.0.1`)
- Nie może być spacji ani cudzysłowów
- Musi zaczynać się od `NEXT_PUBLIC_`

**Po zmianie, zrestartuj frontend:**
```bash
# Ctrl+C aby zatrzymać
npm run dev
```

### Krok 4: Wyczyść Cache

```bash
cd storefront

# Usuń cache Next.js
rm -rf .next

# Usuń node_modules (opcjonalnie)
rm -rf node_modules
npm install

# Uruchom ponownie
npm run dev
```

### Krok 5: Sprawdź w Przeglądarce

1. Otwórz DevTools (F12)
2. Przejdź do zakładki **Console**
3. Odśwież stronę (F5)
4. Sprawdź czy są błędy

**Jeśli widzisz:**
```
Failed to load cart: Network Error
Auth check failed: Network Error
```

To znaczy że backend nie odpowiada.

### Krok 6: Test Połączenia

Otwórz nową kartę przeglądarki:
```
http://localhost:9000/health
```

**Powinno pokazać:**
```json
{
  "status": "ok"
}
```

**Jeśli nie działa:**
- Backend nie jest uruchomiony
- Port 9000 jest zajęty przez inny proces

---

## 🧪 Test API Bezpośrednio

### Test 1: Health Check
```bash
curl http://localhost:9000/health
```

**Oczekiwany wynik:**
```json
{"status":"ok"}
```

### Test 2: Store API
```bash
curl http://localhost:9000/store/products
```

**Oczekiwany wynik:**
```json
{
  "products": [...],
  "count": 10,
  "offset": 0,
  "limit": 100
}
```

### Test 3: CORS Headers
```bash
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:9000/store/products \
     -v
```

**Sprawdź czy widzisz:**
```
Access-Control-Allow-Origin: http://localhost:3000
```

---

## 🔍 Diagnostyka

### Sprawdź Logi Backendu

W terminalu gdzie działa backend, sprawdź czy są błędy:

```
[ERROR] ...
```

### Sprawdź Logi Frontendu

W terminalu gdzie działa frontend, sprawdź czy są błędy:

```
Error: Network Error
```

### Sprawdź DevTools Network

1. Otwórz DevTools (F12)
2. Zakładka **Network**
3. Odśwież stronę
4. Sprawdź requesty do `localhost:9000`

**Jeśli request jest czerwony:**
- Status: `(failed)` - Backend nie odpowiada
- Status: `CORS error` - CORS nie jest skonfigurowany
- Status: `404` - Endpoint nie istnieje

---

## ✅ Checklist

Przed uruchomieniem, sprawdź:

- [ ] Backend działa na porcie 9000
- [ ] Frontend działa na porcie 3000
- [ ] CORS jest skonfigurowany w `medusa-config.ts`
- [ ] `.env.local` ma poprawny URL
- [ ] Cache Next.js został wyczyszczony
- [ ] Brak błędów w Console
- [ ] `/health` endpoint odpowiada

---

## 🚀 Szybkie Uruchomienie

### Terminal 1 - Backend
```bash
cd my-medusa-store
npm run dev
```

Poczekaj aż zobaczysz:
```
Server is ready on port: 9000
```

### Terminal 2 - Frontend
```bash
cd storefront
rm -rf .next
npm run dev
```

Poczekaj aż zobaczysz:
```
Ready on http://localhost:3000
```

### Przeglądarka
```
http://localhost:3000/pl
```

---

## 🐛 Częste Problemy

### Problem: "Port 9000 already in use"

**Rozwiązanie:**
```bash
# Znajdź proces
lsof -i :9000

# Zabij proces
kill -9 <PID>

# Lub użyj
pkill -f medusa
```

### Problem: "CORS policy blocked"

**Rozwiązanie:**
Dodaj do `medusa-config.ts`:
```typescript
store_cors: "http://localhost:3000",
```

### Problem: "Cannot find module"

**Rozwiązanie:**
```bash
cd storefront
rm -rf node_modules
npm install
```

### Problem: "Connection refused"

**Rozwiązanie:**
1. Sprawdź czy backend działa
2. Sprawdź czy port 9000 jest otwarty
3. Sprawdź firewall

---

## 📞 Dalsze Wsparcie

Jeśli problem nadal występuje:

1. Sprawdź logi backendu
2. Sprawdź logi frontendu
3. Sprawdź DevTools Console
4. Sprawdź DevTools Network
5. Sprawdź `medusa-config.ts`
6. Sprawdź `.env.local`

---

## ✨ Po Naprawie

Gdy wszystko działa, powinieneś zobaczyć:

1. **Strona główna** ładuje się bez błędów
2. **Ikona koszyka** pokazuje (0)
3. **Menu użytkownika** pokazuje "Zaloguj"
4. **Console** nie ma błędów Network Error
5. **Network tab** pokazuje requesty do localhost:9000

---

**Status**: 🔧 Naprawiono konteksty aby były odporne na błędy sieci  
**Data**: 3 grudnia 2024
