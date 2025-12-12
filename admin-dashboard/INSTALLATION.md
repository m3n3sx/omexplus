# Instalacja i Konfiguracja OMEX Admin Dashboard

## 📋 Wymagania

- Node.js 18+ 
- npm lub yarn
- Działający backend Medusa (port 9000)

## 🚀 Instalacja

### 1. Instalacja zależności

```bash
cd admin-dashboard
npm install
```

### 2. Konfiguracja środowiska

Skopiuj plik przykładowy:
```bash
cp .env.local .env
```

Edytuj `.env` i ustaw URL backendu:
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
```

### 3. Uruchomienie

**Tryb deweloperski:**
```bash
npm run dev
```

Dashboard będzie dostępny pod: `http://localhost:3001`

**Tryb produkcyjny:**
```bash
npm run build
npm start
```

## 🔐 Pierwsze Logowanie

1. Otwórz `http://localhost:3001/login`
2. Użyj danych administratora Medusa:
   - Email: `admin@medusa-test.com` (lub twój email)
   - Hasło: `supersecret` (lub twoje hasło)

## ✅ Weryfikacja Instalacji

Po zalogowaniu sprawdź:
- [ ] Dashboard wyświetla statystyki
- [ ] Lista zamówień się ładuje
- [ ] Lista produktów jest dostępna
- [ ] Kategorie wyświetlają się poprawnie
- [ ] Moduły CMS są dostępne

## 🔧 Konfiguracja Backend

### Wymagane endpointy API

Dashboard wymaga następujących endpointów w backendzie:

**Standardowe Medusa:**
- `/admin/orders`
- `/admin/products`
- `/admin/customers`
- `/admin/product-categories`

**Niestandardowe (już zaimplementowane):**
- `/store/settings/topbar`
- `/admin/settings/topbar`
- `/store/settings/megamenu`
- `/admin/settings/megamenu`
- `/store/cms/pages`
- `/admin/cms/pages`
- `/store/banners`
- `/admin/banners`

### Sprawdzenie endpointów

Uruchom backend i sprawdź:
```bash
# Backend powinien działać na porcie 9000
curl http://localhost:9000/health

# Sprawdź czy API odpowiada
curl http://localhost:9000/store/settings/topbar
```

## 🐛 Rozwiązywanie Problemów

### Problem: "Cannot connect to backend"

**Rozwiązanie:**
1. Sprawdź czy backend działa: `curl http://localhost:9000/health`
2. Sprawdź URL w `.env`
3. Sprawdź CORS w backendzie

### Problem: "Unauthorized" po zalogowaniu

**Rozwiązanie:**
1. Wyczyść localStorage przeglądarki
2. Sprawdź dane logowania
3. Sprawdź czy token jest zapisywany (F12 → Application → Local Storage)

### Problem: Brak danych w dashboardzie

**Rozwiązanie:**
1. Sprawdź logi w konsoli (F12)
2. Sprawdź czy backend zwraca dane: `curl http://localhost:9000/admin/orders`
3. Sprawdź czy jesteś zalogowany

### Problem: Moduły CMS nie działają

**Rozwiązanie:**
1. Sprawdź czy endpointy API są dostępne
2. Sprawdź logi backendu
3. Sprawdź czy pliki w `src/api/` zostały utworzone

## 📦 Struktura Plików Backend

Upewnij się że masz następujące pliki w backendzie:

```
src/api/
├── store/
│   ├── settings/
│   │   ├── topbar/route.ts
│   │   └── megamenu/route.ts
│   ├── cms/
│   │   └── pages/route.ts
│   └── banners/route.ts
└── admin/
    ├── settings/
    │   ├── topbar/route.ts
    │   └── megamenu/route.ts
    ├── cms/
    │   ├── pages/route.ts
    │   └── pages/[id]/route.ts
    └── banners/
        ├── route.ts
        └── [id]/route.ts
```

## 🔄 Aktualizacja

Aby zaktualizować dashboard:

```bash
cd admin-dashboard
git pull
npm install
npm run build
```

## 🌐 Deployment

### Vercel

1. Połącz repozytorium z Vercel
2. Ustaw zmienne środowiskowe:
   - `NEXT_PUBLIC_MEDUSA_BACKEND_URL`
3. Deploy!

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

Build i uruchom:
```bash
docker build -t omex-admin .
docker run -p 3001:3001 -e NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.omex.pl omex-admin
```

### VPS (Ubuntu)

```bash
# Zainstaluj Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Zainstaluj PM2
sudo npm install -g pm2

# Deploy aplikacji
cd /var/www/admin-dashboard
npm install
npm run build

# Uruchom z PM2
pm2 start npm --name "omex-admin" -- start
pm2 save
pm2 startup
```

## 📚 Dalsze Kroki

Po instalacji przeczytaj:
- [USER_GUIDE.md](./USER_GUIDE.md) - Przewodnik użytkownika
- [ADMIN_FEATURES.md](./ADMIN_FEATURES.md) - Lista funkcjonalności
- [README.md](./README.md) - Dokumentacja techniczna

## 💡 Wskazówki

1. **Backup danych** - Regularnie twórz kopie zapasowe bazy danych
2. **Testuj na dev** - Zawsze testuj zmiany na środowisku deweloperskim
3. **Monitoruj logi** - Sprawdzaj logi backendu i frontendu
4. **Aktualizuj** - Regularnie aktualizuj zależności

## 📞 Wsparcie

W razie problemów:
1. Sprawdź dokumentację
2. Sprawdź logi (F12 w przeglądarce)
3. Sprawdź logi backendu
4. Skontaktuj się z zespołem technicznym
