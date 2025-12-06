# Admin Dashboard - Integracja z Backendem

## Status: ✅ GOTOWE

Admin Dashboard jest już w pełni zintegrowany z backendem Medusa i pobiera dane w czasie rzeczywistym.

## Architektura

### Backend
- **URL**: `http://localhost:9000`
- **Framework**: Medusa.js v2
- **Baza danych**: PostgreSQL
- **Autentykacja**: JWT tokens

### Frontend (Admin Dashboard)
- **Framework**: Next.js 15 + React 18
- **Port**: 3001 (domyślnie)
- **Styling**: Tailwind CSS
- **API Client**: Custom fetch wrapper

## Konfiguracja

### Zmienne Środowiskowe
Plik: `admin-dashboard/.env.local`

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_ADMIN_EMAIL=admin@medusa-test.com
MEDUSA_ADMIN_PASSWORD=supersecret
```

### Dane Logowania
- **Email**: `admin@medusa-test.com`
- **Hasło**: `supersecret`

## API Client

### Lokalizacja
`admin-dashboard/lib/api-client.ts`

### Funkcjonalności

#### Autentykacja
```typescript
api.login(email, password)
```
- Logowanie administratora
- Zwraca token JWT
- Token zapisywany w localStorage

#### Zamówienia (Orders)
```typescript
api.getOrders(params)      // Lista zamówień
api.getOrder(id)           // Szczegóły zamówienia
api.createFulfillment()    // Realizacja zamówienia
api.refundOrder()          // Zwrot pieniędzy
```

#### Produkty (Products)
```typescript
api.getProducts(params)    // Lista produktów
api.getProduct(id)         // Szczegóły produktu
api.createProduct(data)    // Tworzenie produktu
api.updateProduct(id, data)// Aktualizacja produktu
api.deleteProduct(id)      // Usuwanie produktu
```

#### Klienci (Customers)
```typescript
api.getCustomers(params)   // Lista klientów
api.getCustomer(id)        // Szczegóły klienta
```

## Dashboard - Strona Główna

### Lokalizacja
`admin-dashboard/app/page.tsx`

### Wyświetlane Dane (z backendu)

#### 1. Statystyki (Stats Cards)
- **Total Orders**: Liczba wszystkich zamówień
- **Total Revenue**: Suma przychodów (w PLN)
- **New Orders (24h)**: Zamówienia z ostatnich 24h
- **Total Customers**: Liczba klientów

#### 2. Wykres Sprzedaży (Sales Chart)
- Dane z ostatnich 7 dni
- Przychody dzienne
- Komponent: `SalesChart`

#### 3. Top Produkty (Top Products)
- 5 najlepiej sprzedających się produktów
- Sortowane po przychodach
- Wyświetla: tytuł, sprzedaż, przychód
- Komponent: `TopProducts`

#### 4. Ostatnie Zamówienia (Recent Orders)
- 5 najnowszych zamówień
- Wyświetla: ID, klient, status, kwota, data
- Komponent: `RecentOrders`

## Przepływ Danych

```
┌─────────────────┐
│  Admin Dashboard│
│   (Next.js)     │
└────────┬────────┘
         │
         │ HTTP Requests
         │ (Authorization: Bearer TOKEN)
         │
         ▼
┌─────────────────┐
│  Medusa Backend │
│   (Node.js)     │
└────────┬────────┘
         │
         │ SQL Queries
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │
│    Database     │
└─────────────────┘
```

## Endpointy API

### Autentykacja
```
POST /auth/user/emailpass
Body: { email, password }
Response: { token }
```

### Zamówienia
```
GET  /admin/orders?limit=50
GET  /admin/orders/:id
POST /admin/orders/:id/fulfillment
POST /admin/orders/:id/refund
```

### Produkty
```
GET    /admin/products?limit=100
GET    /admin/products/:id
POST   /admin/products
POST   /admin/products/:id
DELETE /admin/products/:id
```

### Klienci
```
GET /admin/customers?limit=100
GET /admin/customers/:id
```

## Uruchomienie

### 1. Backend (Medusa)
```bash
# W głównym katalogu projektu
npm run dev
```
Backend uruchomi się na `http://localhost:9000`

### 2. Admin Dashboard
```bash
cd admin-dashboard
npm run dev
```
Dashboard uruchomi się na `http://localhost:3001`

### 3. Logowanie
1. Otwórz `http://localhost:3001`
2. Zaloguj się:
   - Email: `admin@medusa-test.com`
   - Hasło: `supersecret`
3. Dashboard załaduje dane z backendu

## Testowanie Integracji

### Skrypt Testowy
```bash
./test-admin-dashboard.sh
```

Sprawdza:
- ✅ Połączenie z backendem
- ✅ Autentykację administratora
- ✅ Endpoint zamówień
- ✅ Endpoint produktów
- ✅ Endpoint klientów

### Ręczne Testowanie

#### Test 1: Statystyki
1. Zaloguj się do dashboardu
2. Sprawdź czy karty statystyk pokazują dane
3. Liczby powinny odpowiadać danym w bazie

#### Test 2: Wykres
1. Sprawdź wykres sprzedaży
2. Powinien pokazywać ostatnie 7 dni
3. Dane powinny być zsumowane po dniach

#### Test 3: Produkty
1. Przejdź do `/products`
2. Lista produktów powinna się załadować
3. Możliwość edycji i usuwania

#### Test 4: Zamówienia
1. Przejdź do `/orders`
2. Lista zamówień powinna się załadować
3. Możliwość przeglądania szczegółów

## Bezpieczeństwo

### Token JWT
- Przechowywany w `localStorage`
- Automatycznie dodawany do nagłówków
- Wygasa po określonym czasie

### Autoryzacja
```typescript
headers: {
  "Authorization": `Bearer ${token}`
}
```

### CORS
Backend musi mieć skonfigurowany CORS dla `http://localhost:3001`:
```env
ADMIN_CORS=http://localhost:3001
```

## Rozwiązywanie Problemów

### Problem: "Unauthorized" / 401
**Rozwiązanie**:
1. Sprawdź czy backend działa: `curl http://localhost:9000/health`
2. Sprawdź dane logowania w `.env.local`
3. Wyloguj się i zaloguj ponownie

### Problem: "Network Error"
**Rozwiązanie**:
1. Sprawdź czy backend działa na porcie 9000
2. Sprawdź CORS w backendzie
3. Sprawdź `NEXT_PUBLIC_MEDUSA_BACKEND_URL` w `.env.local`

### Problem: Brak danych na dashboardzie
**Rozwiązanie**:
1. Sprawdź console w przeglądarce (F12)
2. Sprawdź czy są produkty w bazie: `./test-admin-dashboard.sh`
3. Dodaj testowe dane przez Medusa Admin

### Problem: "Failed to fetch"
**Rozwiązanie**:
1. Sprawdź czy oba serwery działają
2. Backend: `http://localhost:9000`
3. Dashboard: `http://localhost:3001`

## Aktualne Dane w Systemie

### Produkty
- **Liczba**: 20 produktów
- **Źródło**: Baza danych PostgreSQL
- **Kategorie**: Hydraulika, Filtry, Silnik, etc.

### Klienci
- **Liczba**: 4 klientów
- **Zawiera**: Admin + testowi użytkownicy

### Zamówienia
- **Status**: Sprawdź w dashboardzie
- **Tworzenie**: Przez storefront lub API

## Następne Kroki (Opcjonalne)

### 1. Dodatkowe Funkcje
- [ ] Eksport danych do CSV
- [ ] Zaawansowane filtry
- [ ] Powiadomienia real-time
- [ ] Analityka sprzedaży

### 2. Optymalizacja
- [ ] Cache dla często używanych danych
- [ ] Paginacja dla dużych list
- [ ] Lazy loading komponentów
- [ ] Optymalizacja zapytań SQL

### 3. Bezpieczeństwo
- [ ] Refresh tokens
- [ ] Rate limiting
- [ ] Audit log
- [ ] Role-based access control

## Podsumowanie

✅ **Dashboard jest w pełni zintegrowany z backendem**
✅ **Wszystkie dane są pobierane w czasie rzeczywistym**
✅ **Autentykacja działa poprawnie**
✅ **API endpoints są funkcjonalne**
✅ **Testy integracji przechodzą pomyślnie**

Dashboard jest gotowy do użycia i wyświetla aktualne dane z backendu Medusa!
