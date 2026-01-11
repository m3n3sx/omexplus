# Konfiguracja Google Analytics i Google Ads API

## 1. Google Analytics Data API

### Krok 1: Utwórz projekt w Google Cloud Console
1. Przejdź do [Google Cloud Console](https://console.cloud.google.com/)
2. Utwórz nowy projekt lub wybierz istniejący
3. Włącz **Google Analytics Data API**:
   - APIs & Services → Library → Szukaj "Google Analytics Data API" → Enable

### Krok 2: Utwórz Service Account
1. APIs & Services → Credentials → Create Credentials → Service Account
2. Nadaj nazwę (np. "analytics-reader")
3. Pobierz plik JSON z kluczem

### Krok 3: Dodaj Service Account do Google Analytics
1. Przejdź do [Google Analytics](https://analytics.google.com/)
2. Admin → Property Access Management
3. Dodaj email Service Account (z pliku JSON) z rolą "Viewer"

### Krok 4: Skonfiguruj zmienne środowiskowe
```env
GA_PROPERTY_ID=458820636
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

**GA_PROPERTY_ID** znajdziesz w Google Analytics:
- Admin → Property Settings → Property ID (liczba, nie G-XXXXXXX)

---

## 2. Google Ads API

### Krok 1: Uzyskaj Developer Token
1. Zaloguj się do [Google Ads](https://ads.google.com/)
2. Tools & Settings → Setup → API Center
3. Złóż wniosek o Developer Token (Basic Access wystarczy)

### Krok 2: Utwórz OAuth Credentials
1. W Google Cloud Console → APIs & Services → Credentials
2. Create Credentials → OAuth client ID
3. Application type: Web application
4. Authorized redirect URIs: `http://localhost:3001/api/auth/callback`
5. Zapisz Client ID i Client Secret

### Krok 3: Uzyskaj Refresh Token
Użyj [OAuth Playground](https://developers.google.com/oauthplayground/):
1. Settings (⚙️) → Use your own OAuth credentials
2. Wpisz Client ID i Client Secret
3. Authorize APIs → Wybierz `https://www.googleapis.com/auth/adwords`
4. Exchange authorization code for tokens
5. Skopiuj Refresh Token

### Krok 4: Skonfiguruj zmienne środowiskowe
```env
GOOGLE_ADS_CUSTOMER_ID=751-186-138
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token
GOOGLE_ADS_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_ADS_CLIENT_SECRET=your_client_secret
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token
```

---

## 3. Włącz Live Data

Po skonfigurowaniu wszystkich zmiennych, ustaw:
```env
NEXT_PUBLIC_GOOGLE_CONFIGURED=true
```

Panel marketingowy automatycznie przełączy się z "Demo Data" na "Live Data".

---

## Troubleshooting

### "Permission denied" w Analytics
- Sprawdź czy Service Account ma dostęp do Property
- Upewnij się że GA_PROPERTY_ID to numer (np. 458820636), nie Measurement ID (G-XXXXXXX)

### "Invalid developer token" w Ads
- Developer Token wymaga zatwierdzenia przez Google (może potrwać kilka dni)
- Upewnij się że używasz tokenu z właściwego konta MCC

### "Refresh token expired"
- Wygeneruj nowy Refresh Token przez OAuth Playground
- Upewnij się że aplikacja OAuth jest w trybie "Production" (nie "Testing")

---

## Bezpieczeństwo

⚠️ **NIGDY nie commituj plików z credentials do repozytorium!**

Dodaj do `.gitignore`:
```
*.json
.env
.env.local
```

W produkcji użyj zmiennych środowiskowych serwera (np. Vercel Environment Variables).
