# 🎨 System CMS - Dokumentacja

## 📚 Spis Treści

### 🚀 Dla początkujących

1. **[CMS_QUICK_START.md](./CMS_QUICK_START.md)** ⚡
   - Uruchomienie w 5 minut
   - Pierwsze kroki
   - Podstawowe przykłady

2. **[CMS_INSTRUKCJA_PL.md](./CMS_INSTRUKCJA_PL.md)** 🇵🇱
   - Pełna instrukcja po polsku
   - Szczegółowe wyjaśnienia
   - Wszystkie funkcje
   - Rozwiązywanie problemów

### 🔧 Dla deweloperów

3. **[CMS_README.md](./CMS_README.md)** 📖
   - Przegląd techniczny
   - Struktura projektu
   - API endpoints
   - Przykłady kodu

4. **[CMS_SETUP_GUIDE.md](./CMS_SETUP_GUIDE.md)** 🛠️
   - Przewodnik techniczny (EN)
   - Zaawansowane użycie
   - Integracja z frontendem
   - Best practices

## 🎯 Czym jest ten CMS?

System zarządzania treścią (CMS) podobny do WordPressa, który pozwala edytować **wszystkie** elementy frontendu przez panel administracyjny w backendzie.

### ✨ Główne funkcje:

- ✅ Edycja header i footer
- ✅ Zarządzanie menu
- ✅ Hero sections
- ✅ Sekcje treści
- ✅ Bannery i widgety
- ✅ Wielojęzyczność (pl, en, de, uk)
- ✅ Edytory wizualne
- ✅ Tryb JSON
- ✅ API REST
- ✅ Gotowe komponenty React

## 🚀 Szybki Start

```bash
# 1. Inicjalizuj
npm run init-cms

# 2. Uruchom backend
npm run dev

# 3. Uruchom panel (nowy terminal)
cd admin-dashboard && npm run dev

# 4. Otwórz panel
# http://localhost:3001/cms
```

## 📁 Struktura Projektu

```
├── src/
│   ├── models/
│   │   ├── cms-content.ts      # Model treści
│   │   ├── cms-menu.ts         # Model menu
│   │   └── cms-page.ts         # Model stron
│   ├── api/
│   │   ├── store/cms/          # API publiczne
│   │   └── admin/cms/          # API admin
│   └── scripts/
│       └── init-cms.ts         # Inicjalizacja
│
├── admin-dashboard/
│   ├── app/cms/                # Panel CMS
│   │   ├── page.tsx            # Lista elementów
│   │   ├── new/page.tsx        # Nowy element
│   │   ├── [id]/edit/page.tsx  # Edycja
│   │   └── menus/page.tsx      # Zarządzanie menu
│   └── components/cms/
│       └── CMSContentEditor.tsx # Edytor
│
├── storefront/
│   ├── lib/cms.ts              # Biblioteka CMS
│   └── components/cms/
│       ├── DynamicHeader.tsx   # Dynamiczny header
│       ├── DynamicFooter.tsx   # Dynamiczny footer
│       └── DynamicSection.tsx  # Dynamiczne sekcje
│
├── init-cms-db.js              # Skrypt inicjalizacji
├── test-cms.js                 # Testy API
└── Dokumentacja/
    ├── CMS_QUICK_START.md      # Szybki start
    ├── CMS_INSTRUKCJA_PL.md    # Instrukcja PL
    ├── CMS_README.md           # README
    └── CMS_SETUP_GUIDE.md      # Setup guide
```

## 🎨 Panel Administracyjny

### Strony:

- `/cms` - Lista wszystkich elementów
- `/cms/new` - Dodaj nowy element
- `/cms/:id/edit` - Edytuj element
- `/cms/menus` - Zarządzanie menu
- `/cms/menus/:id/edit` - Edytuj menu

### Funkcje:

- ✅ Edytory wizualne dla każdego typu
- ✅ Tryb JSON dla zaawansowanych
- ✅ Filtrowanie po typie i języku
- ✅ Aktywacja/deaktywacja elementów
- ✅ Sortowanie
- ✅ Wielojęzyczność

## 💻 Użycie na Frontendzie

### Gotowe komponenty:

```typescript
// Header
import DynamicHeader from '@/components/cms/DynamicHeader'
<DynamicHeader locale="pl" />

// Footer
import DynamicFooter from '@/components/cms/DynamicFooter'
<DynamicFooter locale="pl" />

// Dowolna sekcja
import DynamicSection from '@/components/cms/DynamicSection'
<DynamicSection sectionKey="my-section" locale="pl" />
```

### Funkcje pomocnicze:

```typescript
import { getCMSContent, getCMSMenu } from '@/lib/cms'

// Pobierz element
const hero = await getCMSContent('home-hero', 'pl')

// Pobierz menu
const menu = await getCMSMenu('main-menu', 'pl')
```

## 🔧 API Endpoints

### Store (publiczne):

```
GET /store/cms?key=main-header&locale=pl
GET /store/cms?type=section&locale=pl
GET /store/cms/menus?key=main-menu&locale=pl
```

### Admin (chronione):

```
GET    /admin/cms
POST   /admin/cms
GET    /admin/cms/:id
PUT    /admin/cms/:id
DELETE /admin/cms/:id
GET    /admin/cms/menus
POST   /admin/cms/menus
```

## 🎯 Typy Elementów

1. **header** - Nagłówki strony
2. **footer** - Stopki strony
3. **menu** - Menu nawigacyjne
4. **hero** - Sekcje hero
5. **section** - Sekcje treści
6. **banner** - Bannery
7. **widget** - Widgety
8. **text** - Teksty
9. **image** - Obrazy
10. **button** - Przyciski
11. **custom** - Niestandardowe

## 🌍 Wielojęzyczność

Wspierane języki:
- `pl` - Polski (domyślny)
- `en` - English
- `de` - Deutsch
- `uk` - Українська

## 📝 Przykłady

### Przykład 1: Hero Section

```json
{
  "key": "home-hero",
  "type": "hero",
  "content": {
    "title": "Witaj w OMEX",
    "subtitle": "Najlepsze części",
    "backgroundImage": "/hero.jpg"
  }
}
```

### Przykład 2: Menu

```json
{
  "key": "main-menu",
  "name": "Menu Główne",
  "items": [
    { "label": "Home", "url": "/pl" },
    { "label": "Products", "url": "/pl/products" }
  ]
}
```

### Przykład 3: Sekcja

```json
{
  "key": "about-section",
  "type": "section",
  "content": {
    "title": "O nas",
    "content": "Jesteśmy firmą...",
    "layout": "centered"
  }
}
```

## 🛠️ Narzędzia

### Skrypty npm:

```bash
npm run init-cms    # Inicjalizuj CMS
npm run test-cms    # Testuj API
npm run dev         # Uruchom backend
```

### Pliki pomocnicze:

- `init-cms-db.js` - Inicjalizacja bazy
- `test-cms.js` - Testy API

## 🆘 Pomoc

### Problemy?

1. Sprawdź dokumentację odpowiednią dla Ciebie:
   - Początkujący → **CMS_QUICK_START.md**
   - Użytkownik → **CMS_INSTRUKCJA_PL.md**
   - Deweloper → **CMS_README.md**

2. Uruchom testy:
   ```bash
   npm run test-cms
   ```

3. Sprawdź logi backendu

### Najczęstsze problemy:

- **Nie widzę elementów** → Sprawdź czy backend działa
- **Błąd 404** → Sprawdź URL backendu
- **Nie mogę zapisać** → Sprawdź wymagane pola

## 🎯 Roadmap

Planowane funkcje:

- [ ] Page Builder (drag & drop)
- [ ] Media Library
- [ ] Wersjonowanie
- [ ] Harmonogram publikacji
- [ ] SEO Manager
- [ ] Import/Export

## ✅ Status

System jest **w pełni funkcjonalny** i gotowy do użycia!

- ✅ Modele danych
- ✅ API endpoints
- ✅ Panel administracyjny
- ✅ Edytory treści
- ✅ Komponenty frontend
- ✅ Wielojęzyczność
- ✅ Dokumentacja

## 📞 Wsparcie

Przeczytaj odpowiednią dokumentację:

1. **Szybki start** → [CMS_QUICK_START.md](./CMS_QUICK_START.md)
2. **Instrukcja PL** → [CMS_INSTRUKCJA_PL.md](./CMS_INSTRUKCJA_PL.md)
3. **Dokumentacja techniczna** → [CMS_README.md](./CMS_README.md)
4. **Setup guide** → [CMS_SETUP_GUIDE.md](./CMS_SETUP_GUIDE.md)

## 🎉 Gotowe!

System CMS jest gotowy do użycia. Zacznij od **CMS_QUICK_START.md** i ciesz się edycją treści przez panel!

---

**Powodzenia!** 🚀
