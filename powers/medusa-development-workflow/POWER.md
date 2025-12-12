---
name: "medusa-development-workflow"
displayName: "Medusa Development Workflow"
description: "Kompletny workflow dla rozwoju sklepu Medusa - migracje bazy danych, seeding produktów, testowanie API, zarządzanie środowiskiem deweloperskim."
keywords: ["medusa", "development", "migrations", "seeding", "database", "workflow"]
author: "Medusa Team"
---

# Medusa Development Workflow

## Przegląd

Ten power zawiera wszystkie niezbędne workflow i komendy do efektywnej pracy z Medusą. Obejmuje zarządzanie migracjami, seedowanie danych, testowanie API, oraz rozwiązywanie typowych problemów deweloperskich.

## Onboarding

### Struktura Projektu

```
my-medusa-store/
├── src/                    # Backend Medusa
│   ├── api/               # Custom API endpoints
│   ├── migrations/        # Database migrations
│   ├── models/            # Custom data models
│   └── subscribers/       # Event subscribers
├── storefront/            # Next.js frontend
│   ├── app/              # App Router pages
│   ├── components/       # React components
│   └── lib/              # Utilities
├── medusa-config.ts      # Medusa configuration
└── package.json
```

### Wymagania

- Node.js 18+
- PostgreSQL 14+
- Redis (opcjonalnie, dla cache)
- Python 3.8+ (dla venv)

### Uruchomienie Środowiska

```bash
# 1. Aktywuj virtual environment (jeśli używasz)
source .venv/bin/activate

# 2. Zainstaluj zależności
npm install

# 3. Uruchom migracje
npm run medusa:migrate

# 4. Seed danych (opcjonalnie)
npm run seed

# 5. Uruchom backend
npm run dev

# 6. W nowym terminalu - uruchom storefront
cd storefront
npm run dev
```

## Workflow 1: Tworzenie Nowych Migracji

### Kiedy Potrzebne

- Dodajesz nowe pole do istniejącej tabeli
- Tworzysz nową tabelę/model
- Modyfikujesz strukturę bazy danych

### Kroki

```bash
# 1. Wygeneruj nową migrację
npx typeorm migration:create src/migrations/AddFeaturedToProduct

# 2. Edytuj plik migracji
# Przykład: src/migrations/1733960000000-add-featured-priority-to-product.ts
```

**Przykład Migracji:**

```typescript
import { MigrationInterface, QueryRunner } from "typeorm"

export class AddFeaturedPriorityToProduct1733960000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "product" 
      ADD COLUMN "is_featured" boolean DEFAULT false,
      ADD COLUMN "featured_priority" integer DEFAULT 0
    `)
    
    // Dodaj index dla lepszej wydajności
    await queryRunner.query(`
      CREATE INDEX "idx_product_featured" 
      ON "product" ("is_featured", "featured_priority")
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_product_featured"`)
    await queryRunner.query(`
      ALTER TABLE "product" 
      DROP COLUMN "featured_priority",
      DROP COLUMN "is_featured"
    `)
  }
}
```

```bash
# 3. Uruchom migrację
npm run medusa:migrate

# 4. Zweryfikuj w bazie danych
psql -d medusa_db -c "\d product"
```

### Typowe Błędy

**Błąd: "Migration already exists"**
- Przyczyna: Timestamp w nazwie pliku jest duplikatem
- Rozwiązanie: Zmień timestamp na aktualny: `Date.now()`

**Błąd: "Column already exists"**
- Przyczyna: Migracja była już uruchomiona
- Rozwiązanie: Sprawdź `migrations` table lub użyj `down()` do rollback

## Workflow 2: Tworzenie Custom API Endpoints

### Struktura Endpointu

```typescript
// src/api/store/featured-products/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/medusa"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const productService = req.scope.resolve("productService")
    
    const [products, count] = await productService.listAndCount(
      {
        is_featured: true
      },
      {
        relations: ["variants", "images", "collection"],
        order: { featured_priority: "DESC" },
        take: 10
      }
    )
    
    res.json({
      products,
      count
    })
  } catch (error) {
    res.status(500).json({
      message: "Error fetching featured products",
      error: error.message
    })
  }
}
```

### Testowanie API

```bash
# 1. Uruchom backend
npm run dev

# 2. Testuj endpoint
curl http://localhost:9000/store/featured-products

# 3. Z parametrami
curl "http://localhost:9000/store/featured-products?limit=5"

# 4. POST request (z danymi)
curl -X POST http://localhost:9000/store/cart \
  -H "Content-Type: application/json" \
  -d '{"region_id": "reg_01..."}'
```

## Workflow 3: Seedowanie Danych Testowych

### Tworzenie Seed Script

```typescript
// scripts/seed-products.ts
import { Product } from "@medusajs/medusa"

async function seed() {
  const productService = container.resolve("productService")
  
  const products = [
    {
      title: "Test Product 1",
      description: "Description",
      is_featured: true,
      featured_priority: 10,
      variants: [
        {
          title: "Default Variant",
          prices: [
            {
              amount: 1000,
              currency_code: "pln"
            }
          ]
        }
      ]
    }
  ]
  
  for (const product of products) {
    await productService.create(product)
  }
  
  console.log("✅ Seeding completed")
}

seed()
```

```bash
# Uruchom seed
npm run seed

# Lub bezpośrednio
npx ts-node scripts/seed-products.ts
```

## Workflow 4: Debugging i Logi

### Włączenie Debug Logs

```bash
# W .env
LOG_LEVEL=debug

# Lub przy uruchomieniu
LOG_LEVEL=debug npm run dev
```

### Logowanie w Kodzie

```typescript
// W custom endpoint
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger")
  
  logger.info("Fetching featured products")
  logger.debug("Query params:", req.query)
  
  try {
    // ... kod
  } catch (error) {
    logger.error("Error:", error)
    throw error
  }
}
```

### Sprawdzanie Logów

```bash
# Tail logs w czasie rzeczywistym
tail -f logs/medusa.log

# Filtrowanie błędów
grep "ERROR" logs/medusa.log

# Ostatnie 50 linii
tail -n 50 logs/medusa.log
```

## Workflow 5: Praca z Bazą Danych

### Bezpośredni Dostęp do PostgreSQL

```bash
# Połącz się z bazą
psql -d medusa_db

# Przydatne komendy
\dt                    # Lista tabel
\d product            # Struktura tabeli product
\d+ product           # Szczegółowa struktura

# Przykładowe query
SELECT id, title, is_featured, featured_priority 
FROM product 
WHERE is_featured = true 
ORDER BY featured_priority DESC;
```

### Backup i Restore

```bash
# Backup bazy danych
pg_dump medusa_db > backup_$(date +%Y%m%d).sql

# Restore z backupu
psql medusa_db < backup_20241211.sql

# Backup tylko danych (bez struktury)
pg_dump --data-only medusa_db > data_backup.sql
```

## Workflow 6: Testowanie Integracji

### Test Custom Endpoint

```typescript
// integration-tests/api/featured-products.test.ts
import { request } from "supertest"

describe("Featured Products API", () => {
  it("should return featured products", async () => {
    const response = await request("http://localhost:9000")
      .get("/store/featured-products")
      .expect(200)
    
    expect(response.body.products).toBeDefined()
    expect(response.body.products.length).toBeGreaterThan(0)
  })
  
  it("should respect limit parameter", async () => {
    const response = await request("http://localhost:9000")
      .get("/store/featured-products?limit=3")
      .expect(200)
    
    expect(response.body.products.length).toBeLessThanOrEqual(3)
  })
})
```

```bash
# Uruchom testy
npm test

# Tylko testy API
npm test -- integration-tests/api
```

## Workflow 7: Hot Reload i Development

### Automatyczne Przeładowanie

```bash
# Backend z hot reload
npm run dev

# Storefront z hot reload
cd storefront && npm run dev
```

### Czyszczenie Cache

```bash
# Wyczyść cache Medusa
rm -rf .medusa/cache

# Wyczyść cache Next.js
cd storefront && rm -rf .next

# Restart Redis (jeśli używasz)
redis-cli FLUSHALL
```

## Best Practices

- **Zawsze twórz migracje** - Nigdy nie modyfikuj bazy ręcznie
- **Testuj API lokalnie** - Przed deploymentem przetestuj wszystkie endpointy
- **Używaj transactions** - W migracjach używaj queryRunner dla atomowości
- **Loguj ważne operacje** - Ułatwia debugging w production
- **Backup przed migracją** - Zawsze rób backup przed uruchomieniem migracji
- **Seeduj dane testowe** - Ułatwia development i testowanie
- **Używaj TypeScript** - Dla lepszej type safety w całym projekcie

## Przydatne Komendy

```bash
# Backend
npm run dev                    # Uruchom backend dev server
npm run build                  # Build backend
npm run medusa:migrate        # Uruchom migracje
npm run medusa:seed           # Seed danych

# Storefront
cd storefront
npm run dev                    # Uruchom Next.js dev server
npm run build                  # Build production
npm run start                  # Uruchom production build

# Database
psql medusa_db                # Połącz z bazą
pg_dump medusa_db > backup.sql # Backup
npm run typeorm migration:show # Pokaż status migracji

# Debugging
LOG_LEVEL=debug npm run dev   # Debug mode
tail -f logs/medusa.log       # Watch logs
```

## Troubleshooting

### Problem: Migracje nie działają

**Objawy:**
- Błąd: "No migrations pending"
- Zmiany w bazie nie są widoczne

**Rozwiązanie:**
```bash
# 1. Sprawdź status migracji
npm run typeorm migration:show

# 2. Sprawdź tabelę migrations
psql medusa_db -c "SELECT * FROM migrations ORDER BY timestamp DESC LIMIT 5;"

# 3. Jeśli potrzeba - rollback
npm run typeorm migration:revert

# 4. Uruchom ponownie
npm run medusa:migrate
```

### Problem: Port już zajęty

**Objawy:**
- Błąd: "EADDRINUSE: address already in use :::9000"

**Rozwiązanie:**
```bash
# Znajdź proces
lsof -i :9000

# Zabij proces
kill -9 <PID>

# Lub zmień port w .env
PORT=9001
```

### Problem: Błędy TypeScript w runtime

**Objawy:**
- Kod działa lokalnie, ale nie po build

**Rozwiązanie:**
```bash
# 1. Wyczyść build
rm -rf dist

# 2. Rebuild
npm run build

# 3. Sprawdź tsconfig.json
cat tsconfig.json

# 4. Sprawdź czy wszystkie typy są zainstalowane
npm install --save-dev @types/node
```

## Dodatkowe Zasoby

- [Medusa Documentation](https://docs.medusajs.com/)
- [Medusa GitHub](https://github.com/medusajs/medusa)
- [TypeORM Migrations](https://typeorm.io/migrations)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Framework:** Medusa.js + Next.js
**Database:** PostgreSQL + TypeORM
**Type:** Knowledge Base Power
