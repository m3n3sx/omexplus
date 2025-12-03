# 🔥 Naprawa błędu "Failed to fetch"

## 🚨 Problem:
Frontend nie może połączyć się z backendem - błąd CORS lub połączenia.

---

## ✅ Rozwiązanie (3 kroki):

### Krok 1: Sprawdź czy backend działa
```bash
curl http://localhost:9000/health
```

**Oczekiwane:** `OK` lub `{"status":"ok"}`

**Jeśli nie działa:**
```bash
# Uruchom backend w osobnym terminalu
npm run dev
```

---

### Krok 2: Sprawdź CORS w .env

Otwórz plik `.env` (w głównym katalogu) i sprawdź:

```env
STORE_CORS=http://localhost:3000,http://localhost:8000
ADMIN_CORS=http://localhost:7001
AUTH_CORS=http://localhost:3000
```

**Jeśli nie ma tych linii, dodaj je!**

---

### Krok 3: Zrestartuj backend

**WAŻNE:** Po zmianie `.env` lub `medusa-config.ts` MUSISZ zrestartować backend!

```bash
# W terminalu gdzie działa backend:
# 1. Zatrzymaj (Ctrl+C)
# 2. Uruchom ponownie:
npm run dev
```

---

## 🧪 Test połączenia:

### Test 1: Backend health
```bash
curl http://localhost:9000/health
```

### Test 2: Products API
```bash
curl http://localhost:9000/store/products
```

### Test 3: Categories API
```bash
curl http://localhost:9000/store/product-categories
```

Wszystkie powinny zwrócić JSON (nie błąd).

---

## 🔍 Debugowanie:

### Sprawdź Console przeglądarki (F12):

Powinieneś zobaczyć logi:
```
🔍 Connecting to backend: http://localhost:9000
📦 Products response: 200
📁 Categories response: 200
✅ Products loaded: 6
✅ Categories loaded: 6
```

**Jeśli widzisz:**
- `❌ Failed to load data` - Backend nie odpowiada
- `CORS error` - CORS nie skonfigurowany
- `Network error` - Backend nie działa

---

## 🚀 Szybka naprawa (jeśli nic nie pomaga):

### Opcja 1: Użyj Next.js Proxy

Edytuj `storefront/next.config.js`:

```javascript
module.exports = withNextIntl({
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:9000/:path*',
      },
    ]
  },
  // ... reszta konfiguracji
})
```

Potem w `storefront/.env.local`:
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=/api
```

Zrestartuj frontend!

---

### Opcja 2: Wyłącz CORS tymczasowo (tylko dev!)

Edytuj `medusa-config.ts`:

```typescript
http: {
  storeCors: "*",  // ⚠️ Tylko dla developmentu!
  adminCors: "*",
  authCors: "*",
  // ...
}
```

Zrestartuj backend!

---

## ✅ Checklist:

- [ ] Backend działa na porcie 9000
- [ ] `curl http://localhost:9000/health` zwraca OK
- [ ] `.env` ma STORE_CORS=http://localhost:3000
- [ ] Backend został zrestartowany po zmianie .env
- [ ] Frontend został zrestartowany
- [ ] Console (F12) pokazuje logi połączenia
- [ ] Brak błędów CORS w Console

---

## 📞 Jeśli nadal nie działa:

### 1. Sprawdź porty:
```bash
# Backend powinien być na 9000
lsof -i :9000

# Frontend powinien być na 3000
lsof -i :3000
```

### 2. Sprawdź firewall:
```bash
# Tymczasowo wyłącz firewall (tylko test!)
sudo ufw disable
```

### 3. Sprawdź logi backendu:
W terminalu gdzie działa backend, szukaj błędów.

### 4. Użyj test script:
```bash
cd storefront
npx tsx test-api-connection.ts
```

---

**Status:** Naprawione po restarcie backendu  
**Czas:** 2 minuty  
**Kluczowe:** ZAWSZE restartuj backend po zmianie CORS!
