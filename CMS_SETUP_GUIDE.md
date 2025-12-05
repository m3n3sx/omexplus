# 🎨 CMS System - Kompletny Przewodnik

System CMS podobny do WordPressa - edytuj wszystkie elementy frontendu przez backend!

## 🚀 Szybki Start

### 1. Inicjalizacja bazy danych

```bash
# Uruchom skrypt inicjalizacyjny
node init-cms-db.js
```

To utworzy:
- Tabele CMS (cms_content, cms_menu, cms_menu_item, cms_page)
- Przykładowe dane (header, footer, menu)

### 2. Uruchom backend

```bash
npm run dev
```

### 3. Otwórz panel administracyjny

```bash
cd admin-dashboard
npm run dev
```

Przejdź do: http://localhost:3001/cms

## 📋 Funkcje CMS

### ✅ Co możesz edytować:

1. **Header** - Logo, wyszukiwarka, koszyk, nawigacja
2. **Footer** - Copyright, kolumny, linki
3. **Menu** - Wszystkie menu i ich pozycje
4. **Hero Sections** - Tytuły, podtytuły, obrazy tła
5. **Sekcje** - Dowolne sekcje treści
6. **Bannery** - Promocje, ogłoszenia
7. **Widgety** - Małe komponenty
8. **Teksty** - Pojedyncze teksty
9. **Przyciski** - CTA buttons
10. **Strony** - Pełne strony (wkrótce)

### 🎯 Typy elementów:

- `header` - Nagłówki
- `footer` - Stopki
- `menu` - Menu nawigacyjne
- `hero` - Sekcje hero
- `section` - Sekcje treści
- `banner` - Bannery
- `widget` - Widgety
- `text` - Teksty
- `image` - Obrazy
- `button` - Przyciski
- `custom` - Niestandardowe

## 🔧 API Endpoints

### Store (Publiczne)

```typescript
// Pobierz element po key
GET /store/cms?key=main-header&locale=pl

// Pobierz wszystkie elementy typu
GET /store/cms?type=section&locale=pl

// Pobierz menu
GET /store/cms/menus?key=main-menu&locale=pl

// Pobierz wszystkie menu
GET /store/cms/menus?locale=pl
```

### Admin (Chronione)

```typescript
// Lista elementów
GET /admin/cms?type=header&locale=pl

// Utwórz element
POST /admin/cms
{
  "key": "my-section",
  "type": "section",
  "name": "Moja Sekcja",
  "content": { "title": "Hello" },
  "locale": "pl"
}

// Pobierz element
GET /admin/cms/:id

// Aktualizuj element
PUT /admin/cms/:id
{
  "name": "Nowa nazwa",
  "content": { "title": "Updated" }
}

// Usuń element
DELETE /admin/cms/:id

// Menu
GET /admin/cms/menus
POST /admin/cms/menus
GET /admin/cms/menus/:id/items
POST /admin/cms/menus/:id/items
```

## 💻 Użycie na Frontendzie

### 1. Import funkcji CMS

```typescript
import { getCMSContent, getCMSMenu } from '@/lib/cms'
```

### 2. Pobierz dane

```typescript
// W komponencie
const headerContent = await getCMSContent('main-header', 'pl')
const mainMenu = await getCMSMenu('main-menu', 'pl')
```

### 3. Użyj danych

```typescript
const { logo, showSearch, showCart } = headerContent.content

return (
  <header>
    {logo && <img src={logo} alt="Logo" />}
    {showSearch && <SearchBar />}
    {showCart && <CartIcon />}
  </header>
)
```

### 4. Gotowy komponent DynamicHeader

```typescript
import DynamicHeader from '@/components/cms/DynamicHeader'

// W layout.tsx
<DynamicHeader locale="pl" />
```

## 🎨 Panel Administracyjny

### Strony CMS:

1. **`/cms`** - Lista wszystkich elementów
2. **`/cms/new`** - Dodaj nowy element
3. **`/cms/:id/edit`** - Edytuj element
4. **`/cms/menus`** - Zarządzanie menu
5. **`/cms/menus/:id/edit`** - Edytuj menu

### Edytory:

- **Wizualny** - Formularze dla każdego typu
- **JSON** - Bezpośrednia edycja JSON

## 📦 Struktura Danych

### CMS Content

```typescript
{
  id: string
  key: string              // Unikalny identyfikator
  type: string             // Typ elementu
  name: string             // Nazwa w panelu
  description?: string     // Opis
  content: object          // Zawartość JSON
  is_active: boolean       // Czy aktywny
  sort_order: number       // Kolejność
  locale: string           // Język (pl, en, de, uk)
  metadata?: object        // Dodatkowe dane
}
```

### CMS Menu

```typescript
{
  id: string
  key: string              // np. "main-menu"
  name: string             // Nazwa w panelu
  position: string         // header-main, footer, etc.
  is_active: boolean
  locale: string
  items: MenuItem[]        // Pozycje menu
}
```

### CMS Menu Item

```typescript
{
  id: string
  menu_id: string
  parent_id?: string       // Dla podmenu
  label: string            // Tekst linku
  url: string              // URL
  link_type: string        // internal, external, category, etc.
  icon?: string
  description?: string
  open_in_new_tab: boolean
  sort_order: number
  is_active: boolean
  css_classes?: string
  children?: MenuItem[]    // Podmenu
}
```

## 🌍 Wielojęzyczność

System wspiera 4 języki:
- `pl` - Polski (domyślny)
- `en` - English
- `de` - Deutsch
- `uk` - Українська

Każdy element może mieć wersje w różnych językach.

## 🔐 Bezpieczeństwo

- Endpointy `/admin/*` wymagają autoryzacji
- Endpointy `/store/*` są publiczne (tylko odczyt)
- Walidacja danych wejściowych
- Sanityzacja HTML (zalecane)

## 📝 Przykłady Użycia

### Edytowalny Hero Section

```typescript
// Backend - utwórz przez API lub panel
POST /admin/cms
{
  "key": "home-hero",
  "type": "hero",
  "name": "Hero Strony Głównej",
  "content": {
    "title": "Witaj w OMEX",
    "subtitle": "Najlepsze części",
    "backgroundImage": "/hero-bg.jpg",
    "cta": {
      "text": "Zobacz produkty",
      "url": "/products"
    }
  }
}

// Frontend - użyj
const hero = await getCMSContent('home-hero', 'pl')

<section style={{ backgroundImage: `url(${hero.content.backgroundImage})` }}>
  <h1>{hero.content.title}</h1>
  <p>{hero.content.subtitle}</p>
  <a href={hero.content.cta.url}>{hero.content.cta.text}</a>
</section>
```

### Edytowalne Menu

```typescript
// Backend - dodaj menu przez panel /cms/menus

// Frontend
const menu = await getCMSMenu('main-menu', 'pl')

<nav>
  {menu.items.map(item => (
    <a key={item.id} href={item.url}>
      {item.icon && <Icon name={item.icon} />}
      {item.label}
    </a>
  ))}
</nav>
```

## 🚀 Następne Kroki

1. ✅ Uruchom `node init-cms-db.js`
2. ✅ Otwórz panel `/cms`
3. ✅ Dodaj swoje elementy
4. ✅ Użyj na frontendzie
5. 🎨 Dostosuj edytory do swoich potrzeb

## 🎯 Roadmap

- [ ] Page Builder (drag & drop)
- [ ] Media Library
- [ ] Wersjonowanie treści
- [ ] Harmonogram publikacji
- [ ] SEO Manager
- [ ] Bulk operations
- [ ] Import/Export
- [ ] Revision history

## 💡 Tips

1. Używaj opisowych `key` (np. `home-hero`, `footer-contact`)
2. Grupuj elementy przez `type`
3. Wykorzystuj `sort_order` do kontroli kolejności
4. Dodawaj `description` dla lepszej organizacji
5. Używaj `metadata` dla dodatkowych danych

---

**Gotowe! Masz teraz pełny CMS jak WordPress! 🎉**
