# Medusa Admin - Instalacja i Ulepszenia 🚀

## ✅ Dobra Wiadomość!

Medusa Admin jest już **wbudowany** w Medusa v2! Nie musisz nic instalować.

---

## 🎯 Jak Uruchomić Medusa Admin

### 1. Admin jest dostępny na tym samym porcie co backend

**URL:** `http://localhost:9000/app`

### 2. Dane logowania

Użyj tych samych danych co do twojego custom dashboardu:
- **Email:** `admin@medusa-test.com`
- **Hasło:** `supersecret`

### 3. Uruchom backend (jeśli nie działa)

```bash
cd ~/my-medusa-store
npm run dev
```

Poczekaj aż zobaczysz:
```
Server is ready on port: 9000
Admin is ready at: http://localhost:9000/app
```

---

## 🎨 Medusa Admin - Funkcje

### ✅ Co Jest Wbudowane:

1. **Produkty**
   - ✅ Drag & drop zdjęć
   - ✅ Rich text editor (WYSIWYG)
   - ✅ Warianty produktów
   - ✅ Ceny w wielu walutach
   - ✅ Stany magazynowe
   - ✅ Kategorie i kolekcje
   - ✅ Bulk operations

2. **Zamówienia**
   - ✅ Pełne zarządzanie
   - ✅ Zmiana statusów
   - ✅ Zwroty i refundy
   - ✅ Fulfillment
   - ✅ Tracking przesyłek

3. **Klienci**
   - ✅ Lista klientów
   - ✅ Historia zamówień
   - ✅ Grupy klientów
   - ✅ Edycja danych

4. **Rabaty i Promocje**
   - ✅ Kody rabatowe
   - ✅ Promocje
   - ✅ Gift cards

5. **Ustawienia**
   - ✅ Regiony i waluty
   - ✅ Metody płatności
   - ✅ Metody dostawy
   - ✅ Podatki
   - ✅ Użytkownicy i role

---

## 🔧 Konfiguracja i Ulepszenia

### 1. Dodaj Konfigurację Admin do `medusa-config.ts`

```typescript
import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  admin: {
    // Włącz admin
    disable: false,
    // Ścieżka do admina (domyślnie /app)
    path: "/app",
    // Opcjonalnie: własny backend URL
    backendUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
  },
  // ... reszta konfiguracji
})
```

### 2. Dodaj Zmienne Środowiskowe do `.env`

```bash
# Admin Configuration
MEDUSA_ADMIN_ONBOARDING_TYPE=default
MEDUSA_ADMIN_ONBOARDING_NEXTJS=true

# Backend URL (dla admina)
MEDUSA_BACKEND_URL=http://localhost:9000
```

---

## 🎨 Customizacja Medusa Admin

### 1. Zmień Logo i Kolory

Stwórz plik `src/admin/config.ts`:

```typescript
import { defineConfig } from "@medusajs/admin-sdk"

export default defineConfig({
  // Własne logo
  logo: {
    light: "/logo-light.svg",
    dark: "/logo-dark.svg",
  },
  // Kolory
  theme: {
    colors: {
      primary: "#3B82F6", // Niebieski
      secondary: "#F97316", // Pomarańczowy
    },
  },
  // Tytuł strony
  title: "OMEX Admin Panel",
})
```

### 2. Dodaj Własne Widgety

Stwórz `src/admin/widgets/sales-widget.tsx`:

```typescript
import { defineWidgetConfig } from "@medusajs/admin-sdk"

const SalesWidget = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Sprzedaż Dzisiaj</h3>
      <p className="text-3xl font-bold text-green-600">12,450 zł</p>
      <p className="text-sm text-gray-500 mt-2">+15% vs wczoraj</p>
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "product.list.before",
})

export default SalesWidget
```

### 3. Dodaj Własne Strony

Stwórz `src/admin/routes/analytics/page.tsx`:

```typescript
import { defineRouteConfig } from "@medusajs/admin-sdk"

const AnalyticsPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Analityka</h1>
      {/* Twoje wykresy i statystyki */}
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Analityka",
  icon: "chart-bar",
})

export default AnalyticsPage
```

---

## 🌍 Dodaj Polski Język

### 1. Stwórz plik tłumaczeń `src/admin/i18n/pl.json`:

```json
{
  "products": {
    "domain": "Produkty",
    "create": "Dodaj produkt",
    "edit": "Edytuj produkt",
    "list": "Lista produktów",
    "title": "Nazwa",
    "description": "Opis",
    "price": "Cena",
    "inventory": "Magazyn",
    "status": "Status"
  },
  "orders": {
    "domain": "Zamówienia",
    "list": "Lista zamówień",
    "details": "Szczegóły zamówienia",
    "status": "Status",
    "customer": "Klient",
    "total": "Suma"
  },
  "customers": {
    "domain": "Klienci",
    "list": "Lista klientów",
    "details": "Szczegóły klienta"
  }
}
```

### 2. Zarejestruj tłumaczenia w `src/admin/config.ts`:

```typescript
import { defineConfig } from "@medusajs/admin-sdk"
import pl from "./i18n/pl.json"

export default defineConfig({
  i18n: {
    locales: ["pl", "en"],
    defaultLocale: "pl",
    translations: {
      pl,
    },
  },
})
```

---

## 📦 Dodaj Upload Zdjęć (Cloudinary)

### 1. Zainstaluj plugin:

```bash
npm install medusa-file-cloudinary
```

### 2. Dodaj do `medusa-config.ts`:

```typescript
plugins: [
  {
    resolve: "medusa-file-cloudinary",
    options: {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    },
  },
]
```

### 3. Dodaj zmienne do `.env`:

```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Teraz możesz uploadować zdjęcia bezpośrednio w adminie!

---

## 🚀 Dodatkowe Pluginy dla Admina

### 1. **Import/Export CSV**

```bash
npm install medusa-plugin-product-import-export
```

Dodaj do `medusa-config.ts`:
```typescript
plugins: [
  {
    resolve: "medusa-plugin-product-import-export",
  },
]
```

### 2. **Email Templates**

```bash
npm install medusa-plugin-sendgrid
```

### 3. **Analytics Dashboard**

```bash
npm install medusa-plugin-analytics
```

### 4. **Multi-language Products**

```bash
npm install medusa-plugin-product-translations
```

---

## 🎯 Porównanie: Custom Dashboard vs Medusa Admin

| Funkcja | Custom Dashboard | Medusa Admin |
|---------|-----------------|--------------|
| **Upload zdjęć** | ❌ Tylko URL | ✅ Drag & drop |
| **Edytor tekstu** | ⚠️ Markdown | ✅ WYSIWYG |
| **Bulk operations** | ❌ Nie | ✅ Tak |
| **Import CSV** | ❌ Nie | ✅ Tak (z pluginem) |
| **Rabaty** | ❌ Nie | ✅ Tak |
| **Gift cards** | ❌ Nie | ✅ Tak |
| **Fulfillment** | ❌ Nie | ✅ Tak |
| **Zwroty** | ❌ Nie | ✅ Tak |
| **Role użytkowników** | ❌ Nie | ✅ Tak |
| **Mobilny** | ⚠️ Częściowo | ✅ Pełne wsparcie |
| **Tłumaczenia** | ❌ Nie | ✅ Tak |
| **Customizacja** | ✅ Pełna | ✅ Pełna |

---

## 📱 Mobilna Aplikacja

Medusa Admin działa świetnie na urządzeniach mobilnych przez przeglądarkę!

Możesz też zainstalować jako PWA:
1. Otwórz `http://localhost:9000/app` na telefonie
2. Kliknij "Dodaj do ekranu głównego"
3. Gotowe! Masz aplikację mobilną

---

## 🔐 Bezpieczeństwo

### 1. Zmień domyślne hasło:

```bash
# W konsoli backendu
npm run seed -- --email admin@twojadomena.com --password NoweHaslo123!
```

### 2. Dodaj 2FA (opcjonalnie):

```bash
npm install medusa-plugin-2fa
```

### 3. Ogranicz dostęp po IP (produkcja):

W `medusa-config.ts`:
```typescript
admin: {
  allowedIPs: ["123.456.789.0"], // Tylko z tego IP
}
```

---

## 🎓 Szkolenie dla Pracowników

### Materiały:
1. **Oficjalna dokumentacja:** https://docs.medusajs.com/admin
2. **Video tutorial:** https://www.youtube.com/medusajs
3. **Interaktywny tour:** Włączony w adminie przy pierwszym logowaniu

### Podstawowe Operacje:

#### Dodawanie Produktu:
1. Kliknij "Products" w menu
2. Kliknij "+ New Product"
3. Wypełnij formularz
4. Przeciągnij zdjęcia
5. Kliknij "Publish"

#### Obsługa Zamówienia:
1. Kliknij "Orders"
2. Wybierz zamówienie
3. Kliknij "Fulfill"
4. Wybierz produkty do wysyłki
5. Dodaj tracking number
6. Kliknij "Complete"

---

## 🆘 Troubleshooting

### Problem: Admin nie ładuje się

**Rozwiązanie:**
```bash
# Wyczyść cache
rm -rf .medusa
npm run build
npm run dev
```

### Problem: Nie mogę się zalogować

**Rozwiązanie:**
```bash
# Zresetuj hasło
npm run seed -- --email admin@medusa-test.com --password supersecret
```

### Problem: Zdjęcia nie uploadują się

**Rozwiązanie:**
- Zainstaluj plugin Cloudinary (patrz wyżej)
- Lub użyj AWS S3
- Lub lokalny storage (tylko development)

---

## 📊 Następne Kroki

1. ✅ Uruchom Medusa Admin: `http://localhost:9000/app`
2. ✅ Zaloguj się
3. ✅ Dodaj plugin Cloudinary dla uploadów
4. ✅ Dodaj polskie tłumaczenia
5. ✅ Customizuj kolory i logo
6. ✅ Przeszkol pracowników
7. ✅ Deploy na produkcję

---

## 🎉 Gotowe!

Medusa Admin jest **znacznie bardziej przyjazny** dla nietechnicznych użytkowników niż custom dashboard.

**Zalety:**
- 🖱️ Wszystko przez klikanie
- 📸 Drag & drop zdjęć
- 📝 WYSIWYG editor
- 📱 Działa na telefonie
- 🌍 Polski interfejs
- 🎓 Łatwy w nauce
- 🔧 Gotowe pluginy
- 📚 Świetna dokumentacja

**Możesz zachować oba dashboardy:**
- Medusa Admin: `http://localhost:9000/app` (dla pracowników)
- Custom Dashboard: `http://localhost:3001` (dla developerów/zaawansowanych)

Powodzenia! 🚀
