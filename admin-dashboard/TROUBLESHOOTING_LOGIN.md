# Rozwiązywanie Problemów z Logowaniem

## Problem: Nie mogę się zalogować

### Krok 1: Sprawdź czy backend działa

```bash
# Sprawdź czy Medusa backend jest uruchomiony
curl http://localhost:9000/health

# Powinno zwrócić: {"status":"ok"}
```

### Krok 2: Sprawdź czy masz utworzonego użytkownika admin

```bash
# W katalogu głównym projektu (nie admin-dashboard)
npm run dev
```

Następnie w innym terminalu:

```bash
# Utwórz użytkownika admin jeśli nie istnieje
npx medusa user -e admin@medusa-test.com -p supersecret
```

### Krok 3: Przetestuj połączenie

```bash
cd admin-dashboard
node test-backend.js
```

### Krok 4: Sprawdź URL backendu

Upewnij się, że w pliku `admin-dashboard/.env.local` masz:

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
```

### Krok 5: Sprawdź CORS

W pliku `medusa-config.ts` (w głównym katalogu) dodaj:

```typescript
module.exports = {
  projectConfig: {
    // ... inne ustawienia
    http: {
      cors: "http://localhost:3001",
      adminCors: "http://localhost:3001",
    },
  },
}
```

### Krok 6: Testuj logowanie ręcznie

```bash
# Test 1: Sprawdź endpoint auth
curl -X POST http://localhost:9000/auth/user/emailpass \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@medusa-test.com","password":"supersecret"}'

# Test 2: Sprawdź admin auth
curl -X POST http://localhost:9000/admin/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@medusa-test.com","password":"supersecret"}'
```

### Krok 7: Sprawdź logi w konsoli przeglądarki

1. Otwórz dashboard: http://localhost:3001/login
2. Otwórz DevTools (F12)
3. Przejdź do zakładki Console
4. Spróbuj się zalogować
5. Sprawdź komunikaty błędów

### Rozwiązania dla typowych problemów

#### Problem: "Network Error" lub "Failed to fetch"

**Rozwiązanie:**
```bash
# Upewnij się, że backend działa
cd .. # wróć do głównego katalogu
npm run dev
```

#### Problem: "Invalid credentials"

**Rozwiązanie:**
```bash
# Zresetuj hasło admina
npx medusa user -e admin@medusa-test.com -p supersecret
```

#### Problem: "CORS error"

**Rozwiązanie:**
Dodaj do `medusa-config.ts`:

```typescript
module.exports = {
  projectConfig: {
    http: {
      cors: process.env.STORE_CORS || "http://localhost:3001,http://localhost:8000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:3001,http://localhost:7001",
    },
  },
}
```

Następnie zrestartuj backend:
```bash
npm run dev
```

#### Problem: "401 Unauthorized"

**Rozwiązanie:**
Sprawdź czy używasz poprawnego endpointu. Medusa v2 może używać różnych endpointów:

- `/auth/user/emailpass`
- `/admin/auth`
- `/admin/auth/token`

### Alternatywne Logowanie (Tymczasowe)

Jeśli nadal nie możesz się zalogować, użyj trybu deweloperskiego:

1. Otwórz `admin-dashboard/lib/auth.ts`
2. Tymczasowo zmień funkcję `login`:

```typescript
export async function login(email: string, password: string): Promise<AuthUser> {
  // TYLKO DO TESTÓW - USUŃ W PRODUKCJI
  console.log("DEV MODE: Bypassing authentication")
  localStorage.setItem("medusa_admin_token", "dev-token")
  
  return {
    id: "dev-admin",
    email: email,
    first_name: "Dev",
    last_name: "Admin",
    role: "admin",
  }
}
```

3. Zaloguj się z dowolnym emailem/hasłem
4. Po zalogowaniu sprawdź czy API działa
5. Jeśli API działa, problem jest tylko z autentykacją

### Sprawdź wersję Medusa

```bash
# W głównym katalogu
npm list @medusajs/medusa
```

Jeśli używasz Medusa v2, autentykacja może wymagać innych endpointów.

### Kontakt z API bezpośrednio

Stwórz plik `test-api.html` i otwórz w przeglądarce:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Test Medusa API</title>
</head>
<body>
    <h1>Test Medusa Login</h1>
    <button onclick="testLogin()">Test Login</button>
    <pre id="result"></pre>
    
    <script>
        async function testLogin() {
            const result = document.getElementById('result');
            result.textContent = 'Testing...';
            
            try {
                const response = await fetch('http://localhost:9000/auth/user/emailpass', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: 'admin@medusa-test.com',
                        password: 'supersecret'
                    }),
                    credentials: 'include'
                });
                
                const data = await response.json();
                result.textContent = JSON.stringify(data, null, 2);
            } catch (error) {
                result.textContent = 'Error: ' + error.message;
            }
        }
    </script>
</body>
</html>
```

### Ostateczne Rozwiązanie

Jeśli nic nie działa, użyj oficjalnego Medusa Admin:

```bash
# W głównym katalogu projektu
npx medusa develop
```

Następnie otwórz: http://localhost:9000/app

To jest oficjalny admin panel Medusa, który na pewno zadziała.

### Potrzebujesz pomocy?

Wyślij mi:
1. Wyjście z `node test-backend.js`
2. Logi z konsoli przeglądarki (F12 → Console)
3. Wersję Medusa: `npm list @medusajs/medusa`
4. Zawartość `medusa-config.ts`
