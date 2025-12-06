# 🚀 OMEX E-commerce - Przewodnik Wdrożenia

## 🎯 Szybki Start

**Frontend jest już online!** 🎉
- URL: https://lucky-salmiakki-66fc35.netlify.app

**Backend wymaga wdrożenia** (5 minut)
- Przeczytaj: `START_HERE.md`

---

## 📋 Status Projektu

### ✅ Gotowe:
- [x] Frontend Next.js 15 + React 18
- [x] Backend Medusa.js (lokalnie)
- [x] Wyszukiwarka (text, visual, machine, part-number)
- [x] Koszyk i checkout
- [x] Integracja Stripe
- [x] Panel użytkownika
- [x] Wielojęzyczność (PL/EN)
- [x] Responsywny design
- [x] Wdrożenie frontendu na Netlify

### ⏳ Do zrobienia:
- [ ] Wdrożenie backendu na Railway/Render
- [ ] Połączenie frontend-backend
- [ ] Dodanie produktów
- [ ] Utworzenie użytkownika admin

---

## 📁 Struktura Projektu

```
my-medusa-store/
├── storefront/              # Frontend Next.js (WDROŻONY)
│   ├── app/                 # Next.js App Router
│   ├── components/          # React komponenty
│   ├── lib/                 # Utilities
│   └── netlify.toml         # Konfiguracja Netlify
│
├── src/                     # Backend Medusa
│   ├── api/                 # API endpoints
│   ├── modules/             # Moduły biznesowe
│   └── workflows/           # Workflows
│
├── START_HERE.md            # 👈 ZACZNIJ TUTAJ
├── RAILWAY_QUICK_START.md   # Szybki start Railway
├── BACKEND_DEPLOYMENT.md    # Pełna instrukcja wdrożenia
├── DEPLOYMENT_COMPLETE.md   # Kompletny przewodnik
└── SKLEP_ONLINE.md          # Status frontendu
```

---

## 🚀 Wdrożenie Krok po Kroku

### 1. Frontend (✅ Gotowe)

Frontend jest już wdrożony na Netlify:
- URL: https://lucky-salmiakki-66fc35.netlify.app
- Automatyczne wdrożenia przy push do repo
- 39 stron i tras
- Edge Functions i Server Functions

### 2. Backend (⏳ Do zrobienia)

**Przeczytaj**: `START_HERE.md` lub `RAILWAY_QUICK_START.md`

**Szybkie kroki:**
1. Otwórz https://railway.app
2. Utwórz projekt z GitHub repo
3. Dodaj PostgreSQL
4. Ustaw zmienne środowiskowe
5. Wygeneruj domain
6. Gotowe!

### 3. Połączenie (1 minuta)

```bash
cd storefront
netlify env:set NEXT_PUBLIC_MEDUSA_BACKEND_URL "https://twoj-backend.up.railway.app"
netlify deploy --prod
```

---

## 🛠️ Technologie

### Frontend:
- **Framework**: Next.js 15 (App Router)
- **UI**: React 18 + TypeScript
- **Styling**: Tailwind CSS 3.4
- **i18n**: next-intl
- **Payments**: Stripe
- **Hosting**: Netlify

### Backend:
- **Framework**: Medusa.js v2
- **Runtime**: Node.js 20+
- **Database**: PostgreSQL
- **ORM**: MikroORM
- **Hosting**: Railway (zalecane)

---

## 📚 Dokumentacja

### Wdrożenie:
- **START_HERE.md** - Zacznij tutaj (3 kroki)
- **RAILWAY_QUICK_START.md** - Railway w 5 minut
- **BACKEND_DEPLOYMENT.md** - Wszystkie platformy
- **DEPLOYMENT_COMPLETE.md** - Kompletny przewodnik

### Funkcje:
- **SKLEP_ONLINE.md** - Status frontendu
- **DODAJ_PRODUKTY.md** - Jak dodać produkty
- **CMS_README.md** - System CMS

### Konfiguracja:
- **railway.json** - Konfiguracja Railway
- **netlify.toml** - Konfiguracja Netlify
- **medusa-config.ts** - Konfiguracja Medusa

---

## 💰 Koszty Miesięczne

| Usługa | Plan | Koszt |
|--------|------|-------|
| Netlify | Free | $0 |
| Railway | Starter | $5 |
| **Łącznie** | | **$5/miesiąc** |

**Uwaga**: Railway oferuje $5 credit na start (darmowy pierwszy miesiąc)

---

## 🎨 Funkcje Sklepu

### Wyszukiwarka:
- ✅ Wyszukiwanie tekstowe
- ✅ Wyszukiwanie wizualne (upload zdjęcia)
- ✅ Wyszukiwanie po numerze części
- ✅ Wyszukiwanie po maszynie (marka, model, typ)
- ✅ Zaawansowane filtry

### E-commerce:
- ✅ Koszyk
- ✅ Checkout
- ✅ Płatności Stripe
- ✅ Panel użytkownika
- ✅ Historia zamówień
- ✅ Zarządzanie adresami

### Design:
- ✅ Responsywny (mobile, tablet, desktop)
- ✅ Nowoczesny UI
- ✅ Animacje i transitions
- ✅ Dark mode ready

---

## 🔧 Development

### Lokalne uruchomienie:

```bash
# Backend
npm install
npm run dev  # http://localhost:9000

# Frontend
cd storefront
npm install
npm run dev  # http://localhost:3000
```

### Build:

```bash
# Backend
npm run build

# Frontend
cd storefront
npm run build
```

---

## 🆘 Wsparcie

### Dokumentacja:
- Railway: https://docs.railway.app
- Netlify: https://docs.netlify.com
- Medusa: https://docs.medusajs.com
- Next.js: https://nextjs.org/docs

### Logi:
```bash
# Railway
railway logs

# Netlify
netlify logs
```

---

## 📝 Licencja

MIT

---

## 🎉 Gotowe do wdrożenia!

**Następny krok**: Otwórz `START_HERE.md` i wdróż backend w 5 minut!
