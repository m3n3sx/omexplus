# 🚂 Railway - Szybki Start (5 minut)

## Krok po kroku - Wdrożenie przez przeglądarkę

### 1️⃣ Utwórz konto Railway (1 min)

1. Otwórz https://railway.app
2. Kliknij **"Start a New Project"**
3. Zaloguj się przez **GitHub**

### 2️⃣ Utwórz nowy projekt (1 min)

1. Kliknij **"+ New Project"**
2. Wybierz **"Deploy from GitHub repo"**
3. Jeśli nie masz repo na GitHub:
   - Utwórz nowe repo na GitHub
   - Wypchnij kod: `git push origin main`
   - Wróć do Railway i odśwież

### 3️⃣ Dodaj PostgreSQL (30 sek)

1. W projekcie kliknij **"+ New"**
2. Wybierz **"Database"**
3. Wybierz **"Add PostgreSQL"**
4. Railway automatycznie utworzy bazę danych

### 4️⃣ Połącz bazę z backendem (30 sek)

1. Kliknij na swój backend service
2. Przejdź do zakładki **"Variables"**
3. Kliknij **"+ New Variable"** → **"Add Reference"**
4. Wybierz **PostgreSQL** → **DATABASE_URL**

### 5️⃣ Dodaj zmienne środowiskowe (2 min)

W zakładce **"Variables"** dodaj:

#### CORS (skopiuj i wklej):
```
STORE_CORS=https://lucky-salmiakki-66fc35.netlify.app
ADMIN_CORS=https://lucky-salmiakki-66fc35.netlify.app
AUTH_CORS=https://lucky-salmiakki-66fc35.netlify.app
```

#### Sekrety (wygeneruj nowe):

**Otwórz terminal i uruchom:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Skopiuj wynik i dodaj jako:
- `JWT_SECRET` = [wygenerowany klucz]

**Uruchom ponownie:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Skopiuj wynik i dodaj jako:
- `COOKIE_SECRET` = [wygenerowany klucz]

### 6️⃣ Wdróż! (automatyczne)

Railway automatycznie:
1. Wykryje Node.js
2. Zainstaluje zależności (`npm install`)
3. Zbuduje projekt (`npm run build`)
4. Uruchomi serwer (`npm run start`)

**Poczekaj 2-3 minuty na zakończenie buildu.**

### 7️⃣ Pobierz URL backendu

1. Kliknij na swój backend service
2. Przejdź do zakładki **"Settings"**
3. W sekcji **"Domains"** kliknij **"Generate Domain"**
4. Skopiuj URL (np. `https://omex-backend.up.railway.app`)

---

## ✅ Gotowe! Teraz zaktualizuj frontend:

### Zaktualizuj Netlify:

```bash
cd storefront
netlify env:set NEXT_PUBLIC_MEDUSA_BACKEND_URL "https://twoj-backend.up.railway.app"
netlify deploy --prod
```

### Przetestuj backend:

```bash
curl https://twoj-backend.up.railway.app/health
```

Powinno zwrócić: `{"status":"ok"}`

---

## 🎯 Następne kroki:

### 1. Dodaj produkty testowe

Możesz użyć skryptów z projektu:
```bash
# Lokalnie, wskazując na Railway backend
DATABASE_URL="twoj-railway-database-url" node seed-products-advanced.js
```

### 2. Utwórz użytkownika admin

Przez Railway CLI:
```bash
railway run npm run seed
```

Lub ręcznie przez API:
```bash
curl -X POST https://twoj-backend.up.railway.app/admin/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@omex.pl",
    "password": "supersecret123"
  }'
```

---

## 💰 Koszty

**Railway Starter Plan: $5/miesiąc**
- 500 godzin wykonania
- PostgreSQL included
- Unlimited deployments
- Custom domains

**Darmowy trial: $5 credit** (wystarczy na ~1 miesiąc testów)

---

## 🆘 Problemy?

### Build fails?
- Sprawdź logi w Railway Dashboard
- Upewnij się że `package.json` ma skrypt `build`

### Database connection error?
- Sprawdź czy `DATABASE_URL` jest dodany jako Reference Variable
- Railway automatycznie łączy bazę z backendem

### CORS errors?
- Sprawdź czy URL Netlify jest dokładnie taki sam (bez trailing slash)
- Upewnij się że backend zwraca nagłówki CORS

---

## 📚 Więcej informacji

- Railway Docs: https://docs.railway.app
- Medusa Docs: https://docs.medusajs.com
- Pełna instrukcja: `BACKEND_DEPLOYMENT.md`
