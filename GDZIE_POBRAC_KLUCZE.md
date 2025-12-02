# 🔑 Gdzie pobrać klucze Stripe?

## Szybka instrukcja (2 minuty)

### Krok 1: Załóż konto Stripe

Przejdź do: **https://dashboard.stripe.com/register**

- Wpisz email
- Ustaw hasło
- Potwierdź email
- **Gotowe!** (nie musisz podawać danych firmy do testów)

### Krok 2: Przejdź do kluczy API

Po zalogowaniu:

1. Kliknij **"Developers"** w górnym menu
2. Wybierz **"API keys"** z lewego menu
3. Lub przejdź bezpośrednio: **https://dashboard.stripe.com/test/apikeys**

### Krok 3: Skopiuj klucze

Zobaczysz dwa klucze:

#### 1. Publishable key (klucz publiczny)
```
pk_test_51xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
- Zaczyna się od `pk_test_`
- Jest widoczny od razu
- **Skopiuj go!**

#### 2. Secret key (klucz tajny)
```
sk_test_51xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
- Zaczyna się od `sk_test_`
- Musisz kliknąć "Reveal test key" żeby go zobaczyć
- **Skopiuj go!**

### Krok 4: Dodaj klucze do projektu

#### Backend - plik `.env`

Otwórz plik `.env` w głównym folderze projektu i znajdź te linie:

```bash
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

Zamień na swoje klucze:

```bash
STRIPE_SECRET_KEY=sk_test_51xxxxx... # Wklej swój Secret key
STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxx... # Wklej swój Publishable key
```

#### Frontend - plik `storefront/.env.local`

Otwórz plik `storefront/.env.local` i znajdź:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

Zamień na swój klucz:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxx... # Ten sam Publishable key
```

### Krok 5: Gotowe!

Teraz możesz uruchomić:

```bash
bash uruchom.sh
```

Lub ręcznie:

```bash
# Terminal 1
npm run dev

# Terminal 2
cd storefront && npm run dev
```

---

## 🔐 Bezpieczeństwo

### Klucze testowe vs produkcyjne

**Klucze testowe** (do nauki i testów):
- Zaczynają się od `pk_test_` i `sk_test_`
- Nie pobierają prawdziwych pieniędzy
- Używaj kart testowych (4242 4242 4242 4242)

**Klucze produkcyjne** (do prawdziwych płatności):
- Zaczynają się od `pk_live_` i `sk_live_`
- Pobierają prawdziwe pieniądze
- Wymagają weryfikacji konta

### Ważne!

⚠️ **NIE UDOSTĘPNIAJ** klucza Secret key (`sk_test_...`)  
✅ Klucz Publishable (`pk_test_...`) może być publiczny  
✅ Dodaj `.env` do `.gitignore` (już jest)  

---

## 📸 Zrzuty ekranu

### Gdzie znaleźć klucze:

```
Stripe Dashboard
├── Developers (górne menu)
│   └── API keys (lewe menu)
│       ├── Publishable key: pk_test_51...
│       └── Secret key: sk_test_51... (kliknij "Reveal")
```

---

## ❓ FAQ

### Czy muszę płacić za konto Stripe?
Nie! Konto testowe jest darmowe. Płacisz tylko prowizję od prawdziwych transakcji.

### Czy muszę weryfikować firmę?
Nie do testów. Weryfikacja jest potrzebna tylko do prawdziwych płatności.

### Czy mogę używać kluczy testowych w produkcji?
Nie! Klucze testowe nie pobierają prawdziwych pieniędzy.

### Co jeśli zgubię klucze?
Możesz je zawsze zobaczyć w dashboard lub wygenerować nowe.

### Czy klucze wygasają?
Nie, ale możesz je ręcznie unieważnić i wygenerować nowe.

---

## 🆘 Problemy?

### Nie widzę kluczy w dashboard
- Upewnij się, że jesteś zalogowany
- Sprawdź czy jesteś w trybie testowym (przełącznik w lewym górnym rogu)

### Klucze nie działają
- Sprawdź czy skopiowałeś pełny klucz (są długie!)
- Upewnij się, że nie ma spacji na początku/końcu
- Sprawdź czy używasz kluczy testowych (`pk_test_`, `sk_test_`)

### Gdzie jest webhook secret?
- Developers → Webhooks → Add endpoint
- Potrzebny tylko do produkcji, na razie pomiń

---

## ✅ Checklist

- [ ] Założyłem konto Stripe
- [ ] Zalogowałem się do dashboard
- [ ] Przeszedłem do API keys
- [ ] Skopiowałem Publishable key (pk_test_...)
- [ ] Skopiowałem Secret key (sk_test_...)
- [ ] Dodałem klucze do .env
- [ ] Dodałem klucz do storefront/.env.local
- [ ] Zapisałem pliki
- [ ] Uruchomiłem projekt

---

## 🔗 Przydatne linki

- **Rejestracja**: https://dashboard.stripe.com/register
- **API Keys**: https://dashboard.stripe.com/test/apikeys
- **Dokumentacja**: https://stripe.com/docs
- **Karty testowe**: https://stripe.com/docs/testing

---

**Czas: ~2 minuty**  
**Koszt: Darmowe**  
**Wymagania: Email**

Po dodaniu kluczy przejdź do: **START_TUTAJ.md**
