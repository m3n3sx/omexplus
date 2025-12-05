# ✅ Netlify Deployment - Konfiguracja Zakończona

## 🎉 Co zostało przygotowane:

### 1. Pliki konfiguracyjne:
- ✅ `storefront/netlify.toml` - konfiguracja budowania i wdrażania
- ✅ `storefront/.env.production` - szablon zmiennych środowiskowych
- ✅ `storefront/deploy-to-netlify.sh` - skrypt pomocniczy

### 2. Dokumentacja:
- ✅ `storefront/NETLIFY_DEPLOYMENT.md` - pełna instrukcja krok po kroku
- ✅ `storefront/SZYBKI_START_NETLIFY.md` - szybki start (3 kroki)

## 🚀 Co musisz teraz zrobić:

### Opcja A: Szybki start (3 komendy)

```bash
# 1. Zainstaluj CLI i zaloguj się
npm install -g netlify-cli
netlify login

# 2. Przejdź do storefront i zainicjuj
cd storefront
netlify init

# 3. Ustaw zmienne i wdróż
netlify env:set NEXT_PUBLIC_MEDUSA_BACKEND_URL "https://twoj-backend.com"
netlify deploy --prod
```

### Opcja B: Użyj skryptu pomocniczego

```bash
cd storefront
./deploy-to-netlify.sh preview  # testowe wdrożenie
./deploy-to-netlify.sh prod     # produkcyjne wdrożenie
```

## 📋 Konfiguracja netlify.toml zawiera:

- ✅ Komendę budowania Next.js
- ✅ Plugin Next.js dla Netlify
- ✅ Przekierowania dla SPA
- ✅ Nagłówki bezpieczeństwa
- ✅ Optymalizację obrazów

## ⚠️ Ważne przed wdrożeniem:

1. **Backend musi być dostępny publicznie** (np. Heroku, Railway, DigitalOcean)
2. **Skonfiguruj CORS na backendzie** dla domeny Netlify
3. **Zmień URL backendu** w zmiennych środowiskowych na produkcyjny
4. **Dla produkcji użyj prawdziwych kluczy Stripe** (nie testowych)

## 🔗 Następne kroki:

1. Przeczytaj `storefront/SZYBKI_START_NETLIFY.md` dla szybkiego wdrożenia
2. Lub `storefront/NETLIFY_DEPLOYMENT.md` dla szczegółowej instrukcji
3. Wykonaj komendy z jednej z opcji powyżej

## 🎯 Rezultat:

Po wykonaniu kroków twój storefront będzie dostępny pod adresem:
`https://twoja-nazwa.netlify.app`

---

**Powodzenia! 🚀**
