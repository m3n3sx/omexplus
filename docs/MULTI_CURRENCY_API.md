# Multi-Currency API Documentation

## Overview

Backend Medusa obsługuje teraz ceny w wielu walutach z automatyczną konwersją i formatowaniem.

## Obsługiwane Waluty

| Kod | Nazwa | Symbol | Miejsca dziesiętne |
|-----|-------|--------|-------------------|
| PLN | Polish Złoty | zł | 2 |
| EUR | Euro | € | 2 |
| USD | US Dollar | $ | 2 |
| GBP | British Pound | £ | 2 |
| CZK | Czech Koruna | Kč | 2 |
| SEK | Swedish Krona | kr | 2 |
| NOK | Norwegian Krone | kr | 2 |
| DKK | Danish Krone | kr | 2 |
| CHF | Swiss Franc | CHF | 2 |
| HUF | Hungarian Forint | Ft | 0 |
| RON | Romanian Leu | lei | 2 |

## API Endpoints

### 1. Pobierz Obsługiwane Waluty

```http
GET /store/currencies
```

**Response:**
```json
{
  "currencies": [
    {
      "code": "PLN",
      "name": "Polish Złoty",
      "symbol": "zł",
      "exchange_rate": 1.0,
      "is_active": true,
      "decimal_places": 2
    },
    {
      "code": "EUR",
      "name": "Euro",
      "symbol": "€",
      "exchange_rate": 0.23,
      "is_active": true,
      "decimal_places": 2
    }
  ]
}
```

### 2. Pobierz Ceny Produktu We Wszystkich Walutach

```http
GET /store/products/:id/prices?customer_type=retail&quantity=1
```

**Parameters:**
- `id` (path) - ID produktu
- `customer_type` (query) - Typ klienta: `retail`, `b2b`, `wholesale` (domyślnie: `retail`)
- `quantity` (query) - Ilość (domyślnie: `1`)

**Response:**
```json
{
  "product_id": "prod_01",
  "customer_type": "retail",
  "quantity": 1,
  "prices": {
    "PLN": {
      "amount": 12500,
      "currency": "PLN",
      "customer_type": "retail",
      "quantity": 1
    },
    "EUR": {
      "amount": 2875,
      "currency": "EUR",
      "customer_type": "retail",
      "quantity": 1
    },
    "USD": {
      "amount": 3125,
      "currency": "USD",
      "customer_type": "retail",
      "quantity": 1
    }
  }
}
```

### 3. Konwertuj Walutę

```http
POST /store/convert-currency
```

**Request Body:**
```json
{
  "amount": 12500,
  "from_currency": "PLN",
  "to_currency": "EUR"
}
```

**Response:**
```json
{
  "original_amount": 12500,
  "from_currency": "PLN",
  "to_currency": "EUR",
  "converted_amount": 2875,
  "formatted": "2875.00 €"
}
```

## Użycie w Kodzie

### Backend Service

```typescript
import { OmexPricingService } from './modules/omex-pricing/service'

// Pobierz cenę w konkretnej walucie
const price = await pricingService.getPrice(
  'prod_01',
  'retail',
  1,
  'EUR'
)

// Pobierz ceny we wszystkich walutach
const allPrices = await pricingService.getPriceInAllCurrencies(
  'prod_01',
  'retail',
  1
)

// Konwertuj walutę
const converted = pricingService.convertCurrency(12500, 'PLN', 'EUR')

// Formatuj cenę
const formatted = pricingService.formatPrice(2875, 'EUR')
// Output: "2875.00 €"
```

### Frontend Integration

```typescript
// Pobierz dostępne waluty
const response = await fetch('/store/currencies')
const { currencies } = await response.json()

// Pobierz ceny produktu
const pricesResponse = await fetch('/store/products/prod_01/prices?customer_type=retail&quantity=1')
const { prices } = await pricesResponse.json()

// Konwertuj walutę
const convertResponse = await fetch('/store/convert-currency', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 12500,
    from_currency: 'PLN',
    to_currency: 'EUR'
  })
})
const { converted_amount, formatted } = await convertResponse.json()
```

## Model Danych

### Currency Table

```sql
CREATE TABLE currency (
  code VARCHAR(3) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  exchange_rate DECIMAL(10, 6) NOT NULL DEFAULT 1.0,
  is_active BOOLEAN DEFAULT true,
  decimal_places INTEGER DEFAULT 2,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

### Price Tier Table (Updated)

```sql
ALTER TABLE price_tier 
ADD COLUMN currency_code VARCHAR(3) DEFAULT 'PLN'
```

## Kursy Wymiany

Kursy wymiany są relatywne do PLN (PLN = 1.0):
- EUR: 0.23 (1 PLN = 0.23 EUR)
- USD: 0.25 (1 PLN = 0.25 USD)
- GBP: 0.20 (1 PLN = 0.20 GBP)

**Uwaga:** W produkcji należy zintegrować z API kursów walut (np. ECB, NBP) dla aktualnych kursów.

## Migracja

Uruchom migrację aby dodać obsługę wielu walut:

```bash
npm run build
npm run start
```

Migracja automatycznie:
1. Doda kolumnę `currency_code` do tabeli `price_tier`
2. Utworzy tabelę `currency`
3. Wypełni domyślne waluty
4. Utworzy indeksy

## Najlepsze Praktyki

1. **Przechowuj ceny w groszach/centach** - używaj liczb całkowitych (12500 = 125.00 PLN)
2. **Zawsze podawaj walutę** - nigdy nie zakładaj domyślnej waluty
3. **Aktualizuj kursy regularnie** - zintegruj z zewnętrznym API
4. **Zaokrąglaj poprawnie** - używaj odpowiedniej liczby miejsc dziesiętnych
5. **Waliduj waluty** - sprawdzaj czy waluta jest obsługiwana przed konwersją

## Integracja z Stripe

Stripe obsługuje wiele walut. Przykład:

```typescript
const paymentIntent = await stripe.paymentIntents.create({
  amount: convertedAmount,
  currency: currencyCode.toLowerCase(),
  metadata: {
    product_id: 'prod_01',
    original_currency: 'PLN',
    original_amount: 12500
  }
})
```

## Roadmap

- [ ] Integracja z API kursów walut (NBP, ECB)
- [ ] Automatyczna aktualizacja kursów
- [ ] Historia kursów walut
- [ ] Wsparcie dla kryptowalut
- [ ] Zaawansowane zaokrąglanie (np. 9.99 zamiast 10.00)
