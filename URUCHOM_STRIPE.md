# 🚀 Jak uruchomić Stripe Payment - INSTRUKCJA PL

## ⚡ Szybki Start (5 minut)

### Krok 1: Pobierz klucze Stripe (2 min)

1. Otwórz: https://dashboard.stripe.com/register
2. Załóż konto (lub zaloguj się)
3. Przejdź do: https://dashboard.stripe.com/test/apikeys
4. Skopiuj oba klucze

### Krok 2: Skonfiguruj backend (1 min)

Edytuj plik `.env` i zamień placeholdery:

```bash
# Zamień te linie:
STRIPE_SECRET_KEY=sk_test_51xxxxx... # Wklej swój klucz
STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxx... # Wklej swój klucz
```

### Krok 3: Skonfiguruj frontend (1 min)

Utwórz plik `storefront/.env.local`:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxx... # Ten sam co wyżej
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
```

### Krok 4: Zainstaluj zależności (1 min)

```bash
# Backend (główny folder)
npm install

# Frontend (folder storefront)
cd storefront
npm install
cd ..
```

### Krok 5: Przetestuj połączenie (30 sek)

```bash
npx ts-node src/scripts/test-stripe-payment.ts
```

Jeśli zobaczysz ✅ - wszystko działa!

### Krok 6: Uruchom aplikację

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd storefront
npm run dev
```

### Krok 7: Przetestuj płatność

1. Otwórz: http://localhost:3000/checkout/payment
2. Wpisz kartę testową: **4242 4242 4242 4242**
3. Data ważności: **12/34**
4. CVC: **123**
5. Kliknij "Pay"

## 🧪 Karty testowe

| Numer karty | Scenariusz |
|-------------|------------|
| 4242 4242 4242 4242 | ✅ Sukces |
| 4000 0025 0000 3155 | 🔐 3D Secure |
| 4000 0000 0000 0002 | ❌ Odrzucona |
| 4000 0000 0000 9995 | 💰 Brak środków |

## ❓ Problemy?

### "Stripe not initialized"
```bash
# Sprawdź czy klucze są w .env
cat .env | grep STRIPE

# Zrestartuj serwery
npm run dev
```

### "Payment intent creation failed"
```bash
# Sprawdź czy klucz jest poprawny
npx ts-node src/scripts/test-stripe-payment.ts
```

### Brak folderu storefront
```bash
# Utwórz podstawową strukturę
mkdir -p storefront
```

## 📚 Więcej informacji

- **Szybki start**: STRIPE_QUICK_START.md
- **Pełna instrukcja**: STRIPE_SETUP_GUIDE.md
- **Architektura**: STRIPE_PAYMENT_SYSTEM.md
- **Główny README**: README_STRIPE_PAYMENT.md

## ✅ Checklist

- [ ] Mam konto Stripe
- [ ] Skopiowałem klucze API
- [ ] Zaktualizowałem .env
- [ ] Utworzyłem storefront/.env.local
- [ ] Zainstalowałem zależności (npm install)
- [ ] Przetestowałem połączenie (test-stripe-payment.ts)
- [ ] Uruchomiłem backend (npm run dev)
- [ ] Uruchomiłem frontend (cd storefront && npm run dev)
- [ ] Przetestowałem płatność (4242 4242 4242 4242)

## 🎯 Co dalej?

Po uruchomieniu możesz:
- Testować różne scenariusze płatności
- Podłączyć do prawdziwego koszyka
- Skonfigurować webhooki
- Przygotować do produkcji

---

**Status**: Gotowe do uruchomienia ✅  
**Czas setup**: ~5 minut  
**Wymagane**: Konto Stripe (darmowe)
