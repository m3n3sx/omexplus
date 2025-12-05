# 🎨 System CMS dla OMEX

## Szybki Start (3 kroki)

```bash
# 1. Inicjalizuj CMS
npm run init-cms

# 2. Uruchom backend
npm run dev

# 3. Otwórz panel (w nowym terminalu)
cd admin-dashboard && npm run dev
```

Gotowe! Panel CMS: **http://localhost:3001/cms**

## Co zostało stworzone?

### 📁 Backend (Medusa)

**Modele:**
- `src/models/cms-content.ts` - Główny model treści
- `src/models/cms-menu.ts` - Model menu i pozycji menu
- `src/models/cms-page.ts` - Model stron (przyszłość)

**API Endpoints:**

**Store (publiczne):**
- `GET /store/cms` - Pobierz elementy CMS
- `GET /store/cms/menus` - Pobierz menu

**Admin (chronione):**
- `GET /admin/cms` - Lista elementów
- `POST /admin/cms` - Utwórz element
- `GET /admin/cms/:id` - Pobierz element
- `PUT /admin/cms/:id` - Aktualizuj element
- `DELETE /admin/cms/:id` - Usuń element
- `GET /admin/cms/menus` - Lista menu
- `POST /admin/cms/menus` - Utwórz menu
- `GET /admin/cms/menus/:id/items` - Pozycje menu
- `POST /admin/cms/menus/:id/items` - Dodaj pozycję

### 🎨 Panel Administracyjny

**Strony:**
- `/cms` - Lista wszystkich elementów CMS
- `/cms/new` - Dodaj nowy element
- `/cms/:id/edit` - Edytuj element
- `/cms/menus` - Zarządzanie menu
- `/cms/menus/:id/edit` - Edytuj menu

**Komponenty:**
- `components/cms/CMSContentEditor.tsx` - Edytor treści z różnymi trybami

### 🌐 Frontend (Storefront)

**Biblioteka:**
- `storefront/lib/cms.ts` - Funkcje do pobierania danych CMS

**Komponenty:**
- `storefront/components/cms/DynamicHeader.tsx` - Dynamiczny header z CMS

**Funkcje:**
```typescript
getCMSContent(key, locale)      // Pobierz element
getCMSContentsByType(type, locale) // Pobierz po typie
getCMSMenu(key, locale)         // Pobierz menu
getAllCMSMenus(locale)          // Wszystkie menu
```

### 🛠️ Narzędzia

**Skrypty:**
- `init-cms-db.js` - Inicjalizacja bazy danych
- `test-cms.js` - Test API CMS
- `src/scripts/init-cms.ts` - Inicjalizacja z Medusa

**Komendy npm:**
```bash
npm run init-cms    # Inicjalizuj CMS
npm run test-cms    # Testuj API
```

## 📖 Dokumentacja

- **CMS_INSTRUKCJA_PL.md** - Pełna instrukcja po polsku
- **CMS_SETUP_GUIDE.md** - Przewodnik techniczny (EN)

## 🎯 Typy elementów

System wspiera następujące typy:

1. **header** - Nagłówki strony
2. **footer** - Stopki strony
3. **menu** - Menu nawigacyjne
4. **hero** - Sekcje hero
5. **section** - Sekcje treści
6. **banner** - Bannery promocyjne
7. **widget** - Małe komponenty
8. **text** - Pojedyncze teksty
9. **image** - Obrazy
10. **button** - Przyciski CTA
11. **custom** - Niestandardowe

## 🌍 Wielojęzyczność

Wspierane języki:
- `pl` - Polski (domyślny)
- `en` - English
- `de` - Deutsch
- `uk` - Українська

## 💡 Przykłady

### Przykład 1: Edytowalny Hero

**Backend (panel CMS):**
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

**Frontend:**
```typescript
const hero = await getCMSContent('home-hero', 'pl')

<section style={{ backgroundImage: `url(${hero.content.backgroundImage})` }}>
  <h1>{hero.content.title}</h1>
  <p>{hero.content.subtitle}</p>
</section>
```

### Przykład 2: Dynamiczne Menu

**Backend (panel /cms/menus):**
- Dodaj menu "main-menu"
- Dodaj pozycje: Home, Products, Contact

**Frontend:**
```typescript
import DynamicHeader from '@/components/cms/DynamicHeader'

<DynamicHeader locale="pl" />
```

Menu automatycznie się pojawi!

### Przykład 3: Edytowalna Sekcja

**Backend:**
```json
{
  "key": "about-intro",
  "type": "section",
  "content": {
    "title": "O nas",
    "content": "Jesteśmy firmą...",
    "layout": "centered"
  }
}
```

**Frontend:**
```typescript
const about = await getCMSContent('about-intro', 'pl')

<section className={about.content.layout}>
  <h2>{about.content.title}</h2>
  <p>{about.content.content}</p>
</section>
```

## 🔧 Struktura bazy danych

### cms_content
```sql
id              VARCHAR PRIMARY KEY
key             VARCHAR UNIQUE NOT NULL
type            VARCHAR NOT NULL
name            VARCHAR NOT NULL
description     TEXT
content         JSONB NOT NULL
is_active       BOOLEAN DEFAULT true
sort_order      INTEGER DEFAULT 0
locale          VARCHAR DEFAULT 'pl'
metadata        JSONB
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### cms_menu
```sql
id              VARCHAR PRIMARY KEY
key             VARCHAR UNIQUE NOT NULL
name            VARCHAR NOT NULL
position        VARCHAR NOT NULL
is_active       BOOLEAN DEFAULT true
locale          VARCHAR DEFAULT 'pl'
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### cms_menu_item
```sql
id              VARCHAR PRIMARY KEY
menu_id         VARCHAR NOT NULL
parent_id       VARCHAR
label           VARCHAR NOT NULL
url             VARCHAR NOT NULL
link_type       VARCHAR DEFAULT 'internal'
icon            VARCHAR
description     TEXT
open_in_new_tab BOOLEAN DEFAULT false
sort_order      INTEGER DEFAULT 0
is_active       BOOLEAN DEFAULT true
css_classes     VARCHAR
metadata        JSONB
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

## 🚀 Roadmap

Planowane funkcje:

- [ ] Page Builder (drag & drop)
- [ ] Media Library (upload obrazów)
- [ ] Wersjonowanie treści
- [ ] Harmonogram publikacji
- [ ] SEO Manager
- [ ] Bulk operations
- [ ] Import/Export
- [ ] Revision history
- [ ] Preview mode
- [ ] A/B testing

## 🆘 Troubleshooting

### Problem: Tabele nie istnieją

**Rozwiązanie:**
```bash
npm run init-cms
```

### Problem: Nie widzę danych na frontendzie

**Sprawdź:**
1. Backend działa? (`npm run dev`)
2. Element jest aktywny? (panel CMS)
3. Poprawny `key`?
4. Poprawny `locale`?

### Problem: Błąd 404 na API

**Sprawdź:**
1. Backend działa na porcie 9000
2. CORS jest skonfigurowany
3. Endpoint jest poprawny

### Problem: Nie mogę zapisać w panelu

**Sprawdź:**
1. Wszystkie wymagane pola wypełnione?
2. `key` jest unikalny?
3. Jesteś zalogowany?
4. Logi backendu

## 📞 Wsparcie

Przeczytaj dokumentację:
- `CMS_INSTRUKCJA_PL.md` - Instrukcja po polsku
- `CMS_SETUP_GUIDE.md` - Przewodnik techniczny

## ✅ Checklist

- [x] Modele danych
- [x] API endpoints (store)
- [x] API endpoints (admin)
- [x] Panel administracyjny
- [x] Edytory treści
- [x] Zarządzanie menu
- [x] Biblioteka frontend
- [x] Komponenty dynamiczne
- [x] Wielojęzyczność
- [x] Dokumentacja
- [x] Skrypty inicjalizacyjne
- [x] Testy API

## 🎉 Gotowe!

System CMS jest w pełni funkcjonalny i gotowy do użycia!

**Zaczynaj edytować:** http://localhost:3001/cms
