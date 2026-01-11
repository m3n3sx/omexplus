# Integracje Płatności i Wysyłki - OMEX

## Przegląd

Sklep OMEX obsługuje następujące integracje:

### Płatności

#### TPay (Polska)
- **BLIK** - szybkie płatności kodem 6-cyfrowym
- **Przelewy bankowe** - wszystkie polskie banki
- **Karty płatnicze** - Visa, Mastercard, Maestro
- **Google Pay** - płatności mobilne
- **Apple Pay** - płatności mobilne
- **Raty** - płatność ratalna

#### Stripe (Międzynarodowe)
- Karty kredytowe/debetowe
- Apple Pay, Google Pay
- SEPA Direct Debit

### Wysyłka

#### InPost (Polska)
- Paczkomaty 24/7
- Kurier InPost
- Punkty odbioru

#### DPD (Europa)
- Dostawa standardowa
- Dostawa ekspresowa
- Punkty DPD Pickup

#### DHL (Międzynarodowa)
- Dostawa standardowa
- Dostawa ekspresowa
- Dostawa ekonomiczna

---

## Konfiguracja

### TPay

1. Zarejestruj się na https://panel.tpay.com/
2. Przejdź do sekcji Integracja > OpenAPI
3. Utwórz nowe poświadczenia API z rolami: TRANSACTION, REFUND
4. Skonfiguruj webhook URL: `https://api.ooxo.pl/webhooks/tpay`
5. Dodaj zmienne do `.env`:

```env
TPAY_CLIENT_ID=your_client_id
TPAY_CLIENT_SECRET=your_client_secret
TPAY_SANDBOX=false
```

### InPost

1. Zarejestruj się na https://manager.paczkomaty.pl/
2. Uzyskaj klucze API
3. Dodaj zmienne do `.env`:

```env
INPOST_API_KEY=your_api_key
INPOST_API_SECRET=your_api_secret
INPOST_ORG_ID=your_organization_id
```

### DPD

1. Skontaktuj się z DPD Polska
2. Uzyskaj dostęp do API
3. Dodaj zmienne do `.env`:

```env
DPD_API_KEY=your_api_key
DPD_LOGIN=your_login
DPD_PASSWORD=your_password
```

### DHL

1. Zarejestruj się na https://developer.dhl.com/
2. Uzyskaj klucze API
3. Dodaj zmienne do `.env`:

```env
DHL_API_KEY=your_api_key
DHL_ACCOUNT_NUMBER=your_account_number
```

---

## API Endpoints

### Płatności

```
GET  /store/payments/methods     - Lista dostępnych metod płatności
POST /store/payments             - Utworzenie płatności
POST /webhooks/tpay              - Webhook TPay (powiadomienia)
```

### Wysyłka

```
GET  /store/shipping/methods         - Lista metod wysyłki
POST /store/shipping/calculate       - Kalkulacja kosztów
GET  /store/shipping/inpost-points   - Lista Paczkomatów
```

---

## Darmowa dostawa

Sklep oferuje darmową dostawę dla zamówień powyżej 500 PLN.
Próg można zmienić w zmiennej `FREE_SHIPPING_THRESHOLD`.

---

## Testowanie

### TPay Sandbox

Ustaw `TPAY_SANDBOX=true` w `.env` aby używać środowiska testowego.

Testowe dane karty:
- Numer: 4012001038443335
- Data: dowolna przyszła
- CVV: 123

### Stripe Test Mode

Użyj kluczy testowych (zaczynających się od `sk_test_` i `pk_test_`).

Testowa karta:
- Numer: 4242 4242 4242 4242
- Data: dowolna przyszła
- CVV: dowolne 3 cyfry

---

## Pliki źródłowe

- `src/services/payment-tpay.ts` - Provider TPay
- `src/services/payment-service.ts` - Provider Stripe
- `src/services/shipping-service.ts` - Główny serwis wysyłki
- `src/services/shipping-inpost.ts` - Provider InPost
- `src/services/shipping-dpd.ts` - Provider DPD
- `src/services/shipping-dhl.ts` - Provider DHL
- `src/api/store/payments/route.ts` - API płatności
- `src/api/store/shipping/route.ts` - API wysyłki
- `src/api/webhooks/tpay/route.ts` - Webhook TPay
