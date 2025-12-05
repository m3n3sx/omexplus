# ⚡ Szybki Start - Wdrożenie na Netlify

## 🎯 3 proste kroki:

### 1️⃣ Zainstaluj i zaloguj się

```bash
npm install -g netlify-cli
netlify login
```

### 2️⃣ Zainicjuj projekt (w katalogu storefront)

```bash
cd storefront
netlify init
```

### 3️⃣ Ustaw zmienne i wdróż

```bash
# Ustaw URL backendu (ZMIEŃ NA SWÓJ!)
netlify env:set NEXT_PUBLIC_MEDUSA_BACKEND_URL "https://twoj-backend.com"

# Wdróż testowo
netlify deploy

# Jeśli działa - wdróż na produkcję
netlify deploy --prod
```

## ✅ Gotowe!

Więcej szczegółów w pliku `NETLIFY_DEPLOYMENT.md`

## 🔗 Przydatne linki:

- Panel Netlify: `netlify open`
- Status: `netlify status`
- Logi: `netlify logs`
