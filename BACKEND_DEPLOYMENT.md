# 🚀 Wdrożenie Backendu Medusa na Railway

## Opcja 1: Wdrożenie przez Railway Dashboard (Najłatwiejsze)

### Krok 1: Utwórz konto na Railway
1. Przejdź na https://railway.app
2. Zaloguj się przez GitHub
3. Kliknij "New Project"

### Krok 2: Dodaj PostgreSQL
1. W nowym projekcie kliknij "+ New"
2. Wybierz "Database" → "Add PostgreSQL"
3. Railway automatycznie utworzy bazę danych

### Krok 3: Wdróż Backend
1. Kliknij "+ New" → "GitHub Repo"
2. Wybierz swoje repozytorium (lub utwórz nowe)
3. Railway automatycznie wykryje Node.js i zbuduje projekt

### Krok 4: Ustaw zmienne środowiskowe

W ustawieniach serwisu dodaj:

```bash
# Database (Railway automatycznie ustawi DATABASE_URL)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# CORS - dodaj URL swojego frontendu Netlify
STORE_CORS=https://lucky-salmiakki-66fc35.netlify.app
ADMIN_CORS=https://lucky-salmiakki-66fc35.netlify.app
AUTH_CORS=https://lucky-salmiakki-66fc35.netlify.app

# Secrets - wygeneruj bezpieczne klucze
JWT_SECRET=twoj-bezpieczny-jwt-secret-min-32-znaki
COOKIE_SECRET=twoj-bezpieczny-cookie-secret-min-32-znaki

# Port (Railway automatycznie ustawi)
PORT=${{PORT}}

# Redis (opcjonalnie - dodaj Redis service)
# REDIS_URL=${{Redis.REDIS_URL}}
```

### Krok 5: Wygeneruj bezpieczne sekrety

```bash
# W terminalu wygeneruj bezpieczne klucze:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Użyj tego dla JWT_SECRET

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Użyj tego dla COOKIE_SECRET
```

### Krok 6: Deploy
1. Railway automatycznie zbuduje i wdroży backend
2. Po zakończeniu otrzymasz URL typu: `https://twoj-projekt.up.railway.app`

---

## Opcja 2: Wdrożenie przez Railway CLI

### Instalacja Railway CLI

```bash
# Linux/macOS
curl -fsSL https://railway.app/install.sh | sh

# Lub przez npm
npm install -g @railway/cli
```

### Wdrożenie

```bash
# 1. Zaloguj się
railway login

# 2. Zainicjuj projekt
railway init

# 3. Dodaj PostgreSQL
railway add --database postgres

# 4. Ustaw zmienne środowiskowe
railway variables set STORE_CORS=https://lucky-salmiakki-66fc35.netlify.app
railway variables set ADMIN_CORS=https://lucky-salmiakki-66fc35.netlify.app
railway variables set AUTH_CORS=https://lucky-salmiakki-66fc35.netlify.app
railway variables set JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
railway variables set COOKIE_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# 5. Wdróż
railway up
```

---

## Opcja 3: Alternatywne platformy

### Render.com (Darmowy tier)

1. Przejdź na https://render.com
2. Utwórz "New Web Service"
3. Połącz z GitHub repo
4. Ustaw:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Dodaj PostgreSQL database
5. Ustaw zmienne środowiskowe (jak powyżej)

### Heroku

```bash
# Zainstaluj Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Zaloguj się
heroku login

# Utwórz aplikację
heroku create omex-backend

# Dodaj PostgreSQL
heroku addons:create heroku-postgresql:mini

# Ustaw zmienne
heroku config:set STORE_CORS=https://lucky-salmiakki-66fc35.netlify.app
heroku config:set ADMIN_CORS=https://lucky-salmiakki-66fc35.netlify.app
heroku config:set AUTH_CORS=https://lucky-salmiakki-66fc35.netlify.app
heroku config:set JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
heroku config:set COOKIE_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Wdróż
git push heroku main
```

---

## Po wdrożeniu backendu

### 1. Zaktualizuj URL w Netlify

```bash
cd storefront
netlify env:set NEXT_PUBLIC_MEDUSA_BACKEND_URL "https://twoj-backend.up.railway.app"
netlify deploy --prod
```

### 2. Przetestuj backend

```bash
# Sprawdź czy backend działa
curl https://twoj-backend.up.railway.app/health

# Powinno zwrócić: {"status":"ok"}
```

### 3. Utwórz użytkownika admin

```bash
# Połącz się z backendem przez Railway CLI
railway run npm run seed

# Lub ręcznie przez API
curl -X POST https://twoj-backend.up.railway.app/admin/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@omex.pl",
    "password": "supersecret123"
  }'
```

---

## Troubleshooting

### Problem: Build fails
- Sprawdź czy `package.json` ma poprawne skrypty
- Upewnij się że wszystkie zależności są w `dependencies` (nie `devDependencies`)

### Problem: Database connection error
- Sprawdź czy `DATABASE_URL` jest poprawnie ustawiony
- Railway automatycznie ustawia tę zmienną dla PostgreSQL

### Problem: CORS errors
- Upewnij się że `STORE_CORS` zawiera dokładny URL Netlify (bez trailing slash)
- Sprawdź czy backend zwraca poprawne nagłówki CORS

### Problem: Port binding error
- Railway automatycznie ustawia zmienną `PORT`
- Upewnij się że Medusa używa `process.env.PORT`

---

## Koszty

### Railway
- **Starter Plan**: $5/miesiąc
- Zawiera: 500 godzin wykonania, PostgreSQL, Redis
- Idealne dla małych projektów

### Render
- **Free Tier**: $0
- Ograniczenia: usypia po 15 min nieaktywności
- Dobre do testów

### Heroku
- **Eco Plan**: $5/miesiąc
- Mini PostgreSQL: $5/miesiąc
- Łącznie: $10/miesiąc

---

## Zalecenia

1. **Railway** - najlepsze dla Medusa, łatwa konfiguracja
2. **Render** - dobre dla testów (darmowy tier)
3. **Heroku** - sprawdzone, ale droższe

**Polecam Railway** - najlepsza integracja z Node.js i PostgreSQL, automatyczna konfiguracja, dobra cena.
