# Instrukcja Konfiguracji Sklepu

## Wymagania Systemowe

- Node.js >= 20
- PostgreSQL >= 13 lub SQLite
- Redis (opcjonalnie, dla cache i kolejek)
- npm lub yarn

## Instalacja Krok po Kroku

### 1. Klonowanie i Instalacja

```bash
# Instalacja zależności
npm install
```

### 2. Konfiguracja Bazy Danych

#### PostgreSQL (Zalecane dla produkcji)

```bash
# Utwórz bazę danych
createdb medusa-store

# Zaktualizuj .env
DATABASE_URL=postgresql://user:password@localhost:5432/medusa-store
```

#### SQLite (Dla rozwoju)

```bash
# W .env
DATABASE_URL=sqlite://./medusa.db
```

### 3. Konfiguracja Zmiennych Środowiskowych

```bash
# Skopiuj template
cp .env.template .env

# Edytuj .env i uzupełnij:
DATABASE_URL=postgresql://localhost/medusa-store
REDIS_URL=redis://localhost:6379
JWT_SECRET=$(openssl rand -base64 32)
COOKIE_SECRET=$(openssl rand -base64 32)
```

### 4. Migracje i Build

```bash
# Build projektu
npm run build

# Uruchom migracje
npx medusa migrations run
```

### 5. Seed Danych Testowych

```bash
# Załaduj przykładowe dane
npm run seed
```

### 6. Uruchomienie

```bash
# Tryb deweloperski
npm run dev

# Produkcja
npm run start
```

## Dostęp do Aplikacji

- **Admin Panel**: http://localhost:9000/app
- **Store API**: http://localhost:9000/store
- **Admin API**: http://localhost:9000/admin

### Domyślne Dane Logowania

Po wykonaniu seed:
- Email: `admin@medusa-test.com`
- Hasło: `supersecret`

## Konfiguracja Modułów

### Program Lojalnościowy

Moduł automatycznie dodaje punkty za:
- Rejestrację: 100 punktów
- Zakup: 1 punkt za każde 10 PLN
- Recenzję: 50 punktów

### System Recenzji

Klienci mogą dodawać recenzje po zakupie produktu.
Średnia ocena jest automatycznie obliczana.

### Lista Życzeń

Każdy zalogowany klient może dodawać produkty do listy życzeń.

## Zaplanowane Zadania

Zadania są automatycznie uruchamiane według harmonogramu:

- **Czyszczenie koszyków**: Codziennie o 2:00
- **Raporty**: Codziennie o północy
- **Aktualizacja magazynu**: Co 30 minut
- **Emaile promocyjne**: Poniedziałki o 10:00

## Integracje

### Płatności

Dodaj providera płatności w `medusa-config.ts`:

```typescript
{
  resolve: "@medusajs/payment-stripe",
  options: {
    apiKey: process.env.STRIPE_API_KEY,
  }
}
```

### Wysyłka

Skonfiguruj providera wysyłki:

```typescript
{
  resolve: "@medusajs/fulfillment-manual",
  options: {}
}
```

### Email

Dodaj provider email (np. SendGrid, Mailgun):

```typescript
{
  resolve: "@medusajs/notification-sendgrid",
  options: {
    apiKey: process.env.SENDGRID_API_KEY,
    from: "sklep@example.com",
  }
}
```

## Testowanie

```bash
# Testy jednostkowe
npm run test:unit

# Testy integracyjne HTTP
npm run test:integration:http

# Testy integracyjne modułów
npm run test:integration:modules
```

## Deployment

### Przygotowanie do Produkcji

1. Ustaw zmienne środowiskowe produkcyjne
2. Użyj PostgreSQL zamiast SQLite
3. Skonfiguruj Redis dla cache
4. Ustaw silne JWT_SECRET i COOKIE_SECRET
5. Skonfiguruj CORS dla swojej domeny

```bash
# Build produkcyjny
npm run build

# Uruchom migracje
npx medusa migrations run

# Start
npm run start
```

### Platformy Deployment

- **Railway**: Automatyczny deployment z GitHub
- **Heroku**: Dodaj Procfile
- **DigitalOcean**: App Platform
- **AWS**: EC2 lub ECS
- **Vercel**: Dla frontendu

## Rozwiązywanie Problemów

### Błąd połączenia z bazą danych

```bash
# Sprawdź czy PostgreSQL działa
pg_isready

# Sprawdź połączenie
psql -d medusa-store
```

### Błąd migracji

```bash
# Wyczyść i uruchom ponownie
npx medusa migrations revert
npx medusa migrations run
```

### Port zajęty

```bash
# Zmień port w .env
PORT=9001
```

## Wsparcie

- Dokumentacja: https://docs.medusajs.com
- Discord: https://discord.gg/medusajs
- GitHub Issues: https://github.com/medusajs/medusa/issues


## 📝 Konfiguracja CMS

### Dostęp do CMS

Po zalogowaniu do panelu admin (`http://localhost:9000/app`), znajdziesz sekcję CMS w menu bocznym.

### Pierwsze Kroki z CMS

1. **Ustawienia Globalne**
   - Przejdź do CMS → Ustawienia
   - Uzupełnij nazwę strony, logo, dane kontaktowe
   - Skonfiguruj media społecznościowe
   - Dodaj Google Analytics ID

2. **Tworzenie Pierwszej Strony**
   - CMS → Strony → Dodaj stronę
   - Wybierz szablon lub zacznij od zera
   - Dodaj bloki treści
   - Ustaw meta tagi dla SEO
   - Opublikuj

3. **Konfiguracja Menu**
   - CMS → Menu → Edytuj menu główne
   - Dodaj linki do stron
   - Ustaw hierarchię
   - Zapisz

4. **Dodawanie Banerów**
   - CMS → Banery → Dodaj baner
   - Upload obrazu
   - Ustaw link i pozycję
   - Określ okres wyświetlania

### Typy Bloków Treści

CMS obsługuje następujące typy bloków:

- **heading** - Nagłówki (H1-H6)
- **paragraph** - Akapity tekstu z formatowaniem
- **image** - Pojedyncze obrazy
- **gallery** - Galerie zdjęć
- **video** - Filmy (YouTube, Vimeo)
- **button** - Przyciski CTA
- **columns** - Układ kolumnowy
- **html** - Własny kod HTML

### Przykład Użycia API

```typescript
// Pobieranie strony w komponencie React
import { useEffect, useState } from 'react'

function AboutPage() {
  const [page, setPage] = useState(null)
  
  useEffect(() => {
    fetch('/store/cms/pages/o-nas')
      .then(res => res.json())
      .then(data => setPage(data.page))
  }, [])
  
  if (!page) return <div>Ładowanie...</div>
  
  return (
    <div>
      <h1>{page.title}</h1>
      {page.content.blocks.map((block, i) => (
        <ContentBlock key={i} block={block} />
      ))}
    </div>
  )
}
```

### Integracja z Frontendem

Szczegółowy przewodnik znajdziesz w pliku `CMS_GUIDE.md`.


## 🌍 Konfiguracja Wielojęzyczności

### Obsługiwane Języki

Sklep domyślnie obsługuje 4 języki:
- 🇵🇱 Polski (domyślny)
- 🇬🇧 Angielski
- 🇩🇪 Niemiecki
- 🇺🇦 Ukraiński

### Zmiana Domyślnego Języka

Edytuj `src/i18n/config.ts`:

```typescript
export const i18nConfig = {
  defaultLocale: "en", // Zmień na wybrany język
  locales: ["pl", "en", "de", "uk"],
}
```

### Dodawanie Nowego Języka

1. Skopiuj istniejący plik tłumaczeń:
```bash
cp src/i18n/locales/en.json src/i18n/locales/fr.json
```

2. Przetłumacz wszystkie klucze w nowym pliku

3. Dodaj język do konfiguracji:
```typescript
// src/i18n/config.ts
locales: ["pl", "en", "de", "uk", "fr"]

// src/modules/i18n/service.ts
export const SUPPORTED_LANGUAGES = {
  // ...
  fr: { name: "French", nativeName: "Français", flag: "🇫🇷" }
}
```

4. Zbuduj projekt:
```bash
npm run build
```

### Zarządzanie Tłumaczeniami

W panelu admin znajdziesz sekcję **Tłumaczenia**, gdzie możesz:
- Edytować tłumaczenia dla każdego języka
- Eksportować tłumaczenia do JSON/CSV
- Importować tłumaczenia z plików
- Wyszukiwać w tłumaczeniach

### Użycie w Komponencie

```tsx
import { useTranslation } from '../i18n/hooks/useTranslation'
import { LanguageSwitcher } from '../i18n/components/LanguageSwitcher'

function MyComponent() {
  const { t } = useTranslation()
  
  return (
    <div>
      <LanguageSwitcher />
      <h1>{t('common.welcome')}</h1>
      <button>{t('products.addToCart')}</button>
    </div>
  )
}
```

Szczegółowa dokumentacja znajduje się w `I18N_GUIDE.md`.
