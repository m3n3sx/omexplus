# Jak się zalogować do Admin Dashboard

## ✅ Backend działa poprawnie!

Twój backend Medusa odpowiada i autentykacja działa.

## Kroki do zalogowania:

### 1. Uruchom backend (jeśli nie jest uruchomiony)

```bash
# W głównym katalogu projektu
npm run dev
```

Backend powinien działać na: `http://localhost:9000`

### 2. Uruchom Admin Dashboard

```bash
cd admin-dashboard
npm install  # tylko za pierwszym razem
npm run dev
```

Dashboard będzie dostępny na: `http://localhost:3001`

### 3. Zaloguj się

Otwórz: http://localhost:3001/login

**Dane logowania:**
- Email: `admin@medusa-test.com`
- Hasło: `supersecret`

### 4. Jeśli nadal nie działa

Otwórz konsolę przeglądarki (F12) i sprawdź logi. Powinieneś zobaczyć:
- "Attempting login with: admin@medusa-test.com"
- "Login response: {token: '...'}"
- "Token stored successfully"
- "Login successful, redirecting..."

## Rozwiązywanie problemów

### Problem: "Network Error"

**Sprawdź czy backend działa:**
```bash
curl http://localhost:9000/health
# Powinno zwrócić: OK
```

### Problem: "Invalid credentials"

**Zresetuj hasło admina:**
```bash
npx medusa user -e admin@medusa-test.com -p supersecret
```

### Problem: "CORS Error"

**Dodaj do `medusa-config.ts`:**
```typescript
module.exports = {
  projectConfig: {
    http: {
      cors: "http://localhost:3001",
      adminCors: "http://localhost:3001",
    },
  },
}
```

Następnie zrestartuj backend.

### Sprawdź czy autentykacja działa

```bash
curl -X POST http://localhost:9000/auth/user/emailpass \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@medusa-test.com","password":"supersecret"}'
```

Powinno zwrócić token JWT.

## Co zostało naprawione

1. ✅ Zaktualizowano autentykację dla Medusa v2
2. ✅ Dodano nowy API client z lepszym logowaniem
3. ✅ Poprawiono obsługę tokenów
4. ✅ Dodano szczegółowe logi w konsoli
5. ✅ Naprawiono endpoint autentykacji

## Testowanie

Po zalogowaniu powinieneś zobaczyć:
- Dashboard ze statystykami
- Menu boczne z nawigacją
- Możliwość przeglądania zamówień, produktów, klientów

Jeśli coś nie działa, sprawdź konsolę przeglądarki (F12 → Console) i wyślij mi logi!
