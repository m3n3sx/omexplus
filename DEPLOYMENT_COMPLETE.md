# 🎉 Kompletny Przewodnik Wdrożenia OMEX

## ✅ Co już działa:

### Frontend (Netlify) - WDROŻONY ✓
- **URL**: https://lucky-salmiakki-66fc35.netlify.app
- **Status**: Online i działający
- **Funkcje**: Wszystkie strony, wyszukiwarka, koszyk, checkout
- **Build**: Automatyczny przy każdym push do repo

### Backend (Medusa) - DO WDROŻENIA
- **Status**: Działa lokalnie na `localhost:9000`
- **Potrzebne**: Wdrożenie na platformie cloud

---

## 🚀 Wdróż Backend (wybierz jedną opcję):

### Opcja A: Railway Dashboard (NAJŁATWIEJSZA - 5 minut)

**Przeczytaj**: `RAILWAY_QUICK_START.md`

**Szybkie kroki:**
1. Otwórz https://railway.app i zaloguj się
2. Utwórz nowy projekt z GitHub repo
3. Dodaj PostgreSQL database
4. Ustaw zmienne środowiskowe (CORS, JWT_SECRET, COOKIE_SECRET)
5. Wygeneruj domain
6. Gotowe!

### Opcja B: Railway CLI (dla zaawansowanych)

```bash
./deploy-backend.sh
```

Lub ręcznie:
```bash
# Zainstaluj CLI
curl -fsSL https://railway.app/install.sh | sh

# Zaloguj się
railway login

# Wdróż
railway init
railway add --database postgres
railway up
```

### Opcja C: Inne platformy

**Przeczytaj**: `BACKEND_DEPLOYMENT.md`

Dostępne opcje:
- **Render.com** (darmowy tier, dobre do testów)
- **Heroku** ($10/miesiąc, sprawdzone rozwiązanie)
- **DigitalOcean** (VPS, pełna kontrola)

---

## 📋 Po wdrożeniu backendu:

### 1. Zaktualizuj URL w Netlify

```bash
cd storefront
netlify env:set NEXT_PUBLIC_MEDUSA_BACKEND_URL "https://twoj-backend.up.railway.app"
netlify deploy --prod
```

### 2. Przetestuj połączenie

```bash
# Sprawdź backend
curl https://twoj-backend.up.railway.app/health

# Sprawdź frontend
# Otwórz https://lucky-salmiakki-66fc35.netlify.app
# Produkty powinny się załadować
```

### 3. Dodaj produkty

```bash
# Opcja 1: Przez panel admin
# Otwórz https://twoj-backend.up.railway.app/app
# Zaloguj się i dodaj produkty ręcznie

# Opcja 2: Import z pliku
# Użyj skryptów z projektu (patrz DODAJ_PRODUKTY.md)
```

---

## 📁 Pliki pomocnicze w projekcie:

### Wdrożenie:
- `RAILWAY_QUICK_START.md` - Szybki start Railway (5 min)
- `BACKEND_DEPLOYMENT.md` - Pełna instrukcja wszystkich platform
- `deploy-backend.sh` - Automatyczny skrypt wdrożenia
- `SKLEP_ONLINE.md` - Status frontendu

### Produkty:
- `DODAJ_PRODUKTY.md` - Jak dodać produkty
- `seed-products-advanced.js` - Skrypt do importu produktów
- `products-data.json` - Przykładowe dane produktów

### Konfiguracja:
- `railway.json` - Konfiguracja Railway
- `netlify.toml` - Konfiguracja Netlify (główny katalog)
- `storefront/netlify.toml` - Konfiguracja frontendu

---

## 🎯 Checklist wdrożenia:

- [x] Frontend zbudowany i wdrożony na Netlify
- [x] Konfiguracja Netlify poprawiona (base directory)
- [x] Wszystkie strony działają (39 tras)
- [ ] Backend wdrożony na Railway/Render/Heroku
- [ ] PostgreSQL database utworzona
- [ ] Zmienne środowiskowe ustawione
- [ ] URL backendu zaktualizowany w Netlify
- [ ] Połączenie frontend-backend przetestowane
- [ ] Użytkownik admin utworzony
- [ ] Produkty dodane do sklepu

---

## 💡 Wskazówki:

### Bezpieczeństwo:
- Użyj silnych sekretów (min. 32 znaki)
- Nie commituj `.env` do repo
- Użyj zmiennych środowiskowych na platformach cloud

### Performance:
- Railway/Render automatycznie skalują
- PostgreSQL jest zoptymalizowany
- Netlify CDN zapewnia szybkie ładowanie

### Koszty:
- **Netlify**: Darmowy (do 100GB bandwidth)
- **Railway**: $5/miesiąc (Starter Plan)
- **Łącznie**: ~$5/miesiąc dla małego sklepu

---

## 🆘 Potrzebujesz pomocy?

### Dokumentacja:
- Railway: https://docs.railway.app
- Netlify: https://docs.netlify.com
- Medusa: https://docs.medusajs.com

### Logi i debugging:
```bash
# Railway logs
railway logs

# Netlify logs
netlify logs

# Lokalne testy
npm run dev  # backend
cd storefront && npm run dev  # frontend
```

---

## 🎊 Gratulacje!

Po wykonaniu tych kroków będziesz miał:
- ✅ Sklep online dostępny 24/7
- ✅ Automatyczne wdrożenia przy zmianach
- ✅ Skalowalną infrastrukturę
- ✅ Profesjonalny setup produkcyjny

**Powodzenia z wdrożeniem! 🚀**
