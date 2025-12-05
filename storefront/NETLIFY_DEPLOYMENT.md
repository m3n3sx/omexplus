# 🚀 Instrukcja Wdrożenia na Netlify

## ✅ Co zostało przygotowane:

1. ✅ `netlify.toml` - konfiguracja budowania
2. ✅ `.env.production` - szablon zmiennych środowiskowych dla produkcji

## 📋 Kroki do wykonania:

### 1. Zainstaluj Netlify CLI (jednorazowo)

```bash
npm install -g netlify-cli
```

### 2. Przejdź do katalogu storefront

```bash
cd storefront
```

### 3. Zaloguj się do Netlify

```bash
netlify login
```

To otworzy przeglądarkę - zaloguj się swoim kontem Netlify (lub utwórz nowe).

### 4. Sprawdź status

```bash
netlify status
```

### 5. Zainicjuj projekt

```bash
netlify init
```

Odpowiedz na pytania:
- **Create & configure a new site** (jeśli nowa strona)
- **Team**: wybierz swój team
- **Site name**: np. `omex-storefront` (lub zostaw puste dla losowej nazwy)
- **Build command**: `npm run build` (już skonfigurowane w netlify.toml)
- **Publish directory**: `.next` (już skonfigurowane)

### 6. Ustaw zmienne środowiskowe

**WAŻNE**: Przed wdrożeniem musisz ustawić URL swojego backendu produkcyjnego!

```bash
# Ustaw URL backendu (ZMIEŃ NA SWÓJ!)
netlify env:set NEXT_PUBLIC_MEDUSA_BACKEND_URL "https://twoj-backend-url.com"

# Ustaw klucz Stripe
netlify env:set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY "pk_test_51SZb2ZBEhIjq58F9e5RI9recju3zt6gMUtWFqnJcJP9oQeJ9hBQCVB903pifAF8wmSC1f90XT0TvwBsn0lkPewYw00svf5ANHg"

# Ustaw klucz API Medusa
netlify env:set NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY "pk_c70e4aeb4dfff475873e37bbeb633670a95b4246e07eb7fa7e10beecfdf66cf0"
```

### 7. Testowe wdrożenie (preview)

```bash
netlify deploy
```

To utworzy wersję testową. Sprawdź link który dostaniesz i przetestuj stronę.

### 8. Wdrożenie produkcyjne

Gdy wszystko działa poprawnie:

```bash
netlify deploy --prod
```

## 🎯 Gotowe!

Twoja strona będzie dostępna pod adresem typu:
`https://twoja-nazwa.netlify.app`

## 🔧 Przydatne komendy:

```bash
# Zobacz status strony
netlify status

# Otwórz panel Netlify w przeglądarce
netlify open

# Zobacz logi budowania
netlify logs

# Lista zmiennych środowiskowych
netlify env:list
```

## ⚠️ Ważne uwagi:

1. **Backend URL**: Musisz mieć działający backend Medusa w produkcji (np. na Heroku, Railway, DigitalOcean)
2. **CORS**: Upewnij się, że backend ma skonfigurowany CORS dla domeny Netlify
3. **Stripe**: Dla produkcji użyj prawdziwych kluczy Stripe (nie testowych)

## 🐛 Rozwiązywanie problemów:

Jeśli build się nie powiedzie:
1. Sprawdź logi: `netlify logs`
2. Sprawdź czy wszystkie zmienne środowiskowe są ustawione
3. Sprawdź czy `npm run build` działa lokalnie

Jeśli strona nie łączy się z backendem:
1. Sprawdź URL backendu w zmiennych środowiskowych
2. Sprawdź CORS na backendzie
3. Sprawdź czy backend jest dostępny publicznie
