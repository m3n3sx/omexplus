---
name: "medusa-troubleshooting"
displayName: "Medusa Troubleshooting"
description: "Rozwiązywanie typowych problemów w Medusa - błędy API, problemy z bazą danych, CORS, Stripe, migracje i performance issues."
keywords: ["medusa", "troubleshooting", "debugging", "errors", "fixes"]
author: "Medusa Team"
---

# Medusa Troubleshooting

## Przegląd

Kompleksowy przewodnik po rozwiązywaniu najczęstszych problemów w Medusa. Zawiera diagnostykę, przyczyny i rozwiązania dla błędów API, bazy danych, CORS, Stripe i innych.

## Kategorie Problemów

1. [Błędy Startowe](#błędy-startowe)
2. [Problemy z Bazą Danych](#problemy-z-bazą-danych)
3. [Błędy API](#błędy-api)
4. [Problemy CORS](#problemy-cors)
5. [Stripe Issues](#stripe-issues)
6. [Performance Problems](#performance-problems)
7. [Migracje](#migracje)
8. [Frontend Issues](#frontend-issues)

---

## Błędy Startowe

### Błąd: "Cannot find module '@medusajs/medusa'"

**Objawy:**
```
Error: Cannot find module '@medusajs/medusa'
```

**Przyczyna:** Brak zainstalowanych dependencies

**Rozwiązanie:**
```bash
# 1. Usuń node_modules i lock files
rm -rf node_modules package-lock.json

# 2. Wyczyść npm cache
npm cache clean --force

# 3. Reinstall
npm install

# 4. Jeśli nadal nie działa - sprawdź wersję Node
node --version  # Powinno być 18+
```

### Błąd: "Port 9000 already in use"

**Objawy:**
```
Error: listen EADDRINUSE: address already in use :::9000
```

**Przyczyna:** Inny proces używa portu 9000

**Rozwiązanie:**
```bash
# Opcja 1: Znajdź i zabij proces
lsof -i :9000
kill -9 <PID>

# Opcja 2: Użyj innego portu
# W .env:
PORT=9001

# Opcja 3: Zabij wszystkie node procesy (ostrożnie!)
pkill -f node
```

### Błąd: "Database connection failed"

**Objawy:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Przyczyna:** PostgreSQL nie działa lub błędne credentials

**Rozwiązanie:**
```bash
# 1. Sprawdź czy PostgreSQL działa
# Linux:
systemctl status postgresql
# macOS:
brew services list

# 2. Uruchom PostgreSQL jeśli nie działa
# Linux:
sudo systemctl start postgresql
# macOS:
brew services start postgresql

# 3. Sprawdź connection string w .env
cat .env | grep DATABASE_URL

# 4. Test połączenia
psql -d medusa_db -c "SELECT 1;"

# 5. Jeśli baza nie istnieje - utwórz
createdb medusa_db
```

---

## Problemy z Bazą Danych

### Błąd: "relation does not exist"

**Objawy:**
```
error: relation "product" does not exist
```

**Przyczyna:** Migracje nie zostały uruchomione

**Rozwiązanie:**
```bash
# 1. Sprawdź status migracji
npm run typeorm migration:show

# 2. Uruchom migracje
npm run medusa:migrate

# 3. Jeśli to nie pomaga - sprawdź czy baza jest pusta
psql medusa_db -c "\dt"

# 4. Jeśli baza jest pusta - uruchom seed
npm run seed
```

### Błąd: "duplicate key value violates unique constraint"

**Objawy:**
```
error: duplicate key value violates unique constraint "pk_product"
```

**Przyczyna:** Próba wstawienia rekordu z istniejącym ID

**Rozwiązanie:**
```bash
# 1. Sprawdź czy sequence jest zsynchronizowany
psql medusa_db

# W PostgreSQL:
SELECT setval('product_id_seq', (SELECT MAX(id) FROM product));

# 2. Lub zresetuj sequence dla wszystkich tabel
SELECT 'SELECT SETVAL(' ||
       quote_literal(quote_ident(PGT.schemaname) || '.' || quote_ident(S.relname)) ||
       ', COALESCE(MAX(' ||quote_ident(C.attname)|| '), 1) ) FROM ' ||
       quote_ident(PGT.schemaname)|| '.'||quote_ident(T.relname)|| ';'
FROM pg_class AS S,
     pg_depend AS D,
     pg_class AS T,
     pg_attribute AS C,
     pg_tables AS PGT
WHERE S.relkind = 'S'
    AND S.oid = D.objid
    AND D.refobjid = T.oid
    AND D.refobjid = C.attrelid
    AND D.refobjsubid = C.attnum
    AND T.relname = PGT.tablename
ORDER BY S.relname;
```

### Błąd: "too many connections"

**Objawy:**
```
error: sorry, too many clients already
```

**Przyczyna:** Za dużo otwartych połączeń do PostgreSQL

**Rozwiązanie:**
```bash
# 1. Sprawdź aktualne połączenia
psql medusa_db -c "SELECT count(*) FROM pg_stat_activity;"

# 2. Zabij idle connections
psql medusa_db -c "
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = 'medusa_db' 
AND state = 'idle' 
AND state_change < current_timestamp - INTERVAL '5 minutes';
"

# 3. Zwiększ max_connections w PostgreSQL
# Edytuj postgresql.conf:
sudo nano /etc/postgresql/14/main/postgresql.conf
# Zmień: max_connections = 200

# 4. Restart PostgreSQL
sudo systemctl restart postgresql
```

---

## Błędy API

### Błąd: 404 Not Found na Custom Endpoint

**Objawy:**
```
GET /store/featured-products → 404 Not Found
```

**Przyczyna:** Endpoint nie jest poprawnie zarejestrowany

**Rozwiązanie:**
```bash
# 1. Sprawdź strukturę plików
ls -la src/api/store/featured-products/

# Powinno być:
# src/api/store/featured-products/route.ts

# 2. Sprawdź export w route.ts
cat src/api/store/featured-products/route.ts

# Musi być:
export async function GET(req, res) { ... }

# 3. Restart serwera
npm run dev

# 4. Sprawdź logi startowe
# Powinno pokazać: "Registered route: /store/featured-products"
```

### Błąd: 500 Internal Server Error

**Objawy:**
```
POST /store/cart → 500 Internal Server Error
```

**Przyczyna:** Błąd w kodzie endpointu

**Rozwiązanie:**
```bash
# 1. Włącz debug logs
LOG_LEVEL=debug npm run dev

# 2. Sprawdź logi
tail -f logs/medusa.log

# 3. Dodaj try-catch w endpoincie
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    // ... kod
  } catch (error) {
    console.error("Error:", error)
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    })
  }
}

# 4. Sprawdź czy wszystkie services są resolved
const productService = req.scope.resolve("productService")
if (!productService) {
  throw new Error("Product service not found")
}
```

### Błąd: "Service not found"

**Objawy:**
```
Error: Unable to resolve service "customService"
```

**Przyczyna:** Service nie jest zarejestrowany w DI container

**Rozwiązanie:**
```typescript
// 1. Sprawdź czy service jest w src/services/
// src/services/custom.ts

import { TransactionBaseService } from "@medusajs/medusa"

class CustomService extends TransactionBaseService {
  // ... implementation
}

export default CustomService

// 2. Sprawdź naming convention
// Plik: custom.ts → Service: customService (camelCase)

// 3. Restart serwera
npm run dev

// 4. Resolve service
const customService = req.scope.resolve("customService")
```

---

## Problemy CORS

### Błąd: "CORS policy: No 'Access-Control-Allow-Origin'"

**Objawy:**
```
Access to fetch at 'http://localhost:9000/store/products' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Przyczyna:** Frontend origin nie jest w CORS whitelist

**Rozwiązanie:**
```bash
# W .env dodaj:
STORE_CORS=http://localhost:3000,http://localhost:3001

# Dla production:
STORE_CORS=https://yourdomain.com,https://www.yourdomain.com

# Dla admin:
ADMIN_CORS=http://localhost:7001

# Restart serwera
npm run dev
```

### Błąd: CORS z credentials

**Objawy:**
```
CORS policy: The value of the 'Access-Control-Allow-Credentials' 
header in the response is '' which must be 'true'
```

**Przyczyna:** Brak credentials w fetch request

**Rozwiązanie:**
```typescript
// W frontend fetch:
fetch('http://localhost:9000/store/products', {
  credentials: 'include',  // ← Dodaj to
  headers: {
    'Content-Type': 'application/json'
  }
})

// Lub w axios:
axios.get('http://localhost:9000/store/products', {
  withCredentials: true  // ← Dodaj to
})
```

---

## Stripe Issues

### Błąd: "No such customer"

**Objawy:**
```
Error: No such customer: 'cus_xxx'
```

**Przyczyna:** Customer ID nie istnieje w Stripe lub używasz test key z production ID

**Rozwiązanie:**
```bash
# 1. Sprawdź czy używasz poprawnych keys
cat .env | grep STRIPE

# Test mode:
STRIPE_API_KEY=sk_test_...

# Production mode:
STRIPE_API_KEY=sk_live_...

# 2. Nie mieszaj test i production danych!

# 3. Sprawdź customer w Stripe Dashboard
# https://dashboard.stripe.com/customers

# 4. Jeśli customer nie istnieje - utwórz nowego
# Medusa automatycznie utworzy customer przy pierwszym zamówieniu
```

### Błąd: Webhook signature verification failed

**Objawy:**
```
Error: No signatures found matching the expected signature for payload
```

**Przyczyna:** Błędny webhook secret lub payload został zmodyfikowany

**Rozwiązanie:**
```bash
# 1. Sprawdź webhook secret w .env
cat .env | grep STRIPE_WEBHOOK_SECRET

# 2. Pobierz poprawny secret ze Stripe Dashboard
# https://dashboard.stripe.com/webhooks

# 3. Dla local testing użyj Stripe CLI
stripe listen --forward-to localhost:9000/hooks/stripe

# 4. Skopiuj webhook signing secret z output
# whsec_xxx

# 5. Dodaj do .env
STRIPE_WEBHOOK_SECRET=whsec_xxx

# 6. Restart serwera
npm run dev
```

### Błąd: "Amount must be at least"

**Objawy:**
```
Error: Amount must be at least $0.50 usd
```

**Przyczyna:** Kwota jest za niska (Stripe minimum)

**Rozwiązanie:**
```typescript
// Sprawdź czy cena produktu jest >= 50 centów
// W src/api/store/products/route.ts

const minAmount = 50 // 50 centów = $0.50

if (variant.prices[0].amount < minAmount) {
  throw new Error(`Price must be at least ${minAmount} cents`)
}

// Lub ustaw minimum w frontend validation
```

---

## Performance Problems

### Problem: Wolne ładowanie produktów

**Objawy:**
- Endpoint `/store/products` zajmuje >2 sekundy
- Wysoka liczba database queries

**Rozwiązanie:**
```typescript
// 1. Dodaj indexy w migracji
await queryRunner.query(`
  CREATE INDEX idx_product_status ON product(status);
  CREATE INDEX idx_product_created_at ON product(created_at);
`)

// 2. Użyj relations tylko gdy potrzebne
const products = await productService.list({}, {
  relations: ["variants", "images"], // Tylko to co potrzebne
  take: 20 // Limit results
})

// 3. Implementuj pagination
const [products, count] = await productService.listAndCount(
  {},
  {
    skip: page * limit,
    take: limit
  }
)

// 4. Cache w Redis
const cached = await redis.get(`products:${page}`)
if (cached) return JSON.parse(cached)

const products = await productService.list(...)
await redis.setex(`products:${page}`, 3600, JSON.stringify(products))
```

### Problem: Wysokie użycie pamięci

**Objawy:**
- Server crashuje z "Out of memory"
- PM2 pokazuje wysokie użycie RAM

**Rozwiązanie:**
```bash
# 1. Sprawdź użycie pamięci
pm2 monit

# 2. Zwiększ Node memory limit
# W package.json:
"scripts": {
  "start": "node --max-old-space-size=4096 dist/main.js"
}

# 3. Dodaj swap na VPS
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 4. Optymalizuj queries - nie ładuj wszystkiego naraz
# Używaj pagination i limit
```

---

## Migracje

### Problem: Migracja nie działa

**Objawy:**
```
No migrations pending
```
Ale zmiany w bazie nie są widoczne

**Rozwiązanie:**
```bash
# 1. Sprawdź status migracji
npm run typeorm migration:show

# 2. Sprawdź tabelę migrations
psql medusa_db -c "SELECT * FROM migrations ORDER BY timestamp DESC LIMIT 5;"

# 3. Jeśli migracja jest oznaczona jako wykonana ale nie działa:
# Usuń wpis z tabeli migrations
psql medusa_db -c "DELETE FROM migrations WHERE name = 'YourMigration1234567890';"

# 4. Uruchom ponownie
npm run medusa:migrate

# 5. Jeśli to nie pomaga - rollback i ponownie
npm run typeorm migration:revert
npm run medusa:migrate
```

### Problem: Błąd w migracji

**Objawy:**
```
QueryFailedError: column "new_column" already exists
```

**Rozwiązanie:**
```typescript
// Dodaj sprawdzenie w migracji
public async up(queryRunner: QueryRunner): Promise<void> {
  // Sprawdź czy kolumna istnieje
  const table = await queryRunner.getTable("product")
  const column = table?.findColumnByName("new_column")
  
  if (!column) {
    await queryRunner.query(`
      ALTER TABLE "product" ADD COLUMN "new_column" varchar
    `)
  }
}

// Lub użyj IF NOT EXISTS (PostgreSQL 9.6+)
await queryRunner.query(`
  ALTER TABLE "product" 
  ADD COLUMN IF NOT EXISTS "new_column" varchar
`)
```

---

## Frontend Issues

### Problem: "Hydration failed"

**Objawy:**
```
Error: Hydration failed because the initial UI does not match 
what was rendered on the server
```

**Przyczyna:** Różnica między server-side i client-side render

**Rozwiązanie:**
```typescript
// 1. Użyj useEffect dla client-only content
const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])

if (!mounted) return null

// 2. Lub użyj dynamic import z ssr: false
import dynamic from 'next/dynamic'

const ClientOnlyComponent = dynamic(
  () => import('./ClientOnlyComponent'),
  { ssr: false }
)

// 3. Sprawdź czy używasz Date.now() lub Math.random()
// Te wartości będą różne na server i client
```

### Problem: "Failed to fetch" w production

**Objawy:**
- Działa lokalnie
- W production: `TypeError: Failed to fetch`

**Przyczyna:** Błędny MEDUSA_BACKEND_URL lub CORS

**Rozwiązanie:**
```bash
# 1. Sprawdź environment variables w Netlify
# Dashboard → Site settings → Environment variables

NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.yourdomain.com

# 2. Sprawdź CORS w backend .env
STORE_CORS=https://yourdomain.com

# 3. Sprawdź czy backend jest dostępny
curl https://api.yourdomain.com/health

# 4. Sprawdź SSL certificate
curl -v https://api.yourdomain.com
```

---

## Przydatne Komendy Diagnostyczne

```bash
# Sprawdź logi Medusa
tail -f logs/medusa.log

# Sprawdź logi PM2
pm2 logs medusa-backend

# Sprawdź połączenia do bazy
psql medusa_db -c "SELECT * FROM pg_stat_activity;"

# Sprawdź rozmiar bazy
psql medusa_db -c "SELECT pg_size_pretty(pg_database_size('medusa_db'));"

# Sprawdź wolne queries
psql medusa_db -c "SELECT query, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;"

# Sprawdź port usage
lsof -i :9000

# Sprawdź memory usage
free -h

# Sprawdź disk space
df -h

# Test API endpoint
curl -v http://localhost:9000/store/products
```

## Dodatkowe Zasoby

- [Medusa Discord](https://discord.gg/medusajs) - Community support
- [Medusa GitHub Issues](https://github.com/medusajs/medusa/issues)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Stripe API Errors](https://stripe.com/docs/error-codes)

---

**Type:** Knowledge Base Power
**Focus:** Problem Solving & Debugging
