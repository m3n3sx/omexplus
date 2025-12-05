# 🎨 System CMS - Instrukcja po Polsku

## Co to jest?

Stworzyłem dla Ciebie kompletny system CMS (Content Management System) podobny do WordPressa. Możesz teraz edytować **WSZYSTKIE** elementy frontendu przez panel administracyjny w backendzie!

## 🚀 Jak uruchomić?

### Krok 1: Inicjalizacja bazy danych

```bash
node init-cms-db.js
```

To utworzy wszystkie potrzebne tabele i doda przykładowe dane.

### Krok 2: Uruchom backend

```bash
npm run dev
```

### Krok 3: Uruchom panel administracyjny

```bash
cd admin-dashboard
npm run dev
```

### Krok 4: Otwórz panel CMS

Przejdź do: **http://localhost:3001/cms**

## 📋 Co możesz edytować?

### ✅ Wszystko!

1. **Header (Nagłówek)**
   - Logo
   - Wyszukiwarka (pokaż/ukryj)
   - Koszyk (pokaż/ukryj)
   - Nawigacja

2. **Footer (Stopka)**
   - Tekst copyright
   - Kolumny z linkami
   - Social media

3. **Menu**
   - Wszystkie menu nawigacyjne
   - Pozycje menu
   - Podmenu (hierarchia)
   - Linki wewnętrzne i zewnętrzne

4. **Hero Sections (Sekcje główne)**
   - Tytuły
   - Podtytuły
   - Obrazy tła
   - Przyciski CTA

5. **Sekcje treści**
   - Dowolne sekcje na stronie
   - Teksty
   - Layouty

6. **Bannery**
   - Promocje
   - Ogłoszenia

7. **Widgety**
   - Małe komponenty

8. **Przyciski**
   - Teksty przycisków
   - Linki
   - Style

9. **Strony** (wkrótce)
   - Pełne strony statyczne

## 🎯 Jak używać panelu?

### Dodawanie nowego elementu:

1. Wejdź na `/cms`
2. Kliknij **"+ Dodaj Element"**
3. Wypełnij formularz:
   - **Key** - unikalny identyfikator (np. `home-hero`)
   - **Typ** - wybierz typ elementu
   - **Nazwa** - nazwa w panelu (dla Ciebie)
   - **Opis** - opcjonalny opis
   - **Zawartość** - edytuj w edytorze wizualnym lub JSON
   - **Język** - wybierz język (pl, en, de, uk)
   - **Status** - aktywny/nieaktywny
4. Kliknij **"Zapisz"**

### Edycja istniejącego elementu:

1. Wejdź na `/cms`
2. Znajdź element na liście
3. Kliknij **"Edytuj"**
4. Zmień co chcesz
5. Kliknij **"Zapisz zmiany"**

### Zarządzanie menu:

1. Wejdź na `/cms/menus`
2. Wybierz menu do edycji
3. Dodaj/edytuj/usuń pozycje menu
4. Ustaw kolejność
5. Zapisz

## 💻 Jak to działa na frontendzie?

### Automatyczne ładowanie:

Stworzyłem gotowy komponent `DynamicHeader`, który automatycznie pobiera dane z CMS:

```typescript
// W layout.tsx
import DynamicHeader from '@/components/cms/DynamicHeader'

<DynamicHeader locale="pl" />
```

### Ręczne pobieranie danych:

```typescript
import { getCMSContent, getCMSMenu } from '@/lib/cms'

// Pobierz element
const hero = await getCMSContent('home-hero', 'pl')

// Użyj danych
<h1>{hero.content.title}</h1>
<p>{hero.content.subtitle}</p>

// Pobierz menu
const menu = await getCMSMenu('main-menu', 'pl')

// Wyświetl menu
{menu.items.map(item => (
  <a href={item.url}>{item.label}</a>
))}
```

## 🎨 Typy edytorów

System ma różne edytory dla różnych typów:

### 1. Header Editor
- Logo URL
- Checkbox: Pokaż wyszukiwarkę
- Checkbox: Pokaż koszyk

### 2. Hero Editor
- Tytuł
- Podtytuł
- Obraz tła (URL)

### 3. Section Editor
- Tytuł sekcji
- Zawartość (textarea)
- Layout (dropdown)

### 4. Text Editor
- Tekst (textarea)
- Styl (dropdown)

### 5. Button Editor
- Tekst przycisku
- URL
- Styl (primary/secondary/outline)

### 6. JSON Editor
Dla wszystkich typów możesz przełączyć się na tryb JSON i edytować bezpośrednio.

## 🌍 Wielojęzyczność

System wspiera 4 języki:
- **pl** - Polski (domyślny)
- **en** - English
- **de** - Deutsch
- **uk** - Українська

Możesz stworzyć ten sam element w różnych językach - po prostu użyj tego samego `key` ale innego `locale`.

## 📦 Struktura danych

### Przykład Hero Section:

```json
{
  "key": "home-hero",
  "type": "hero",
  "name": "Hero Strony Głównej",
  "content": {
    "title": "Części do Maszyn Budowlanych",
    "subtitle": "Profesjonalny sklep B2B",
    "backgroundImage": "/images/hero-bg.jpg",
    "cta": {
      "text": "Zobacz produkty",
      "url": "/products"
    }
  },
  "locale": "pl",
  "is_active": true
}
```

### Przykład Menu:

```json
{
  "key": "main-menu",
  "name": "Menu Główne",
  "position": "header-secondary",
  "items": [
    {
      "label": "Strona główna",
      "url": "/pl",
      "sort_order": 1
    },
    {
      "label": "Produkty",
      "url": "/pl/products",
      "sort_order": 2
    }
  ]
}
```

## 🔧 API Endpoints

### Dla frontendu (publiczne):

```
GET /store/cms?key=main-header&locale=pl
GET /store/cms?type=section&locale=pl
GET /store/cms/menus?key=main-menu&locale=pl
```

### Dla admina (chronione):

```
GET    /admin/cms              - Lista elementów
POST   /admin/cms              - Utwórz element
GET    /admin/cms/:id          - Pobierz element
PUT    /admin/cms/:id          - Aktualizuj element
DELETE /admin/cms/:id          - Usuń element

GET    /admin/cms/menus        - Lista menu
POST   /admin/cms/menus        - Utwórz menu
GET    /admin/cms/menus/:id/items - Pozycje menu
POST   /admin/cms/menus/:id/items - Dodaj pozycję
```

## 💡 Przykłady użycia

### Przykład 1: Edytowalny nagłówek strony

1. W panelu CMS dodaj element:
   - Key: `page-about-header`
   - Typ: `text`
   - Zawartość: `{"text": "O nas", "style": "heading"}`

2. Na frontendzie:
```typescript
const header = await getCMSContent('page-about-header', 'pl')
<h1>{header.content.text}</h1>
```

### Przykład 2: Edytowalna sekcja

1. W panelu CMS dodaj:
   - Key: `home-features`
   - Typ: `section`
   - Zawartość: `{"title": "Dlaczego my?", "content": "..."}`

2. Na frontendzie:
```typescript
const features = await getCMSContent('home-features', 'pl')
<section>
  <h2>{features.content.title}</h2>
  <p>{features.content.content}</p>
</section>
```

### Przykład 3: Edytowalne menu

1. W panelu `/cms/menus` dodaj pozycje
2. Na frontendzie automatycznie się pojawią w `DynamicHeader`

## 🎯 Najlepsze praktyki

1. **Używaj opisowych key**
   - ✅ `home-hero`, `footer-contact`, `about-team`
   - ❌ `section1`, `text2`, `thing`

2. **Grupuj przez typ**
   - Wszystkie hero sections → typ `hero`
   - Wszystkie sekcje → typ `section`

3. **Dodawaj opisy**
   - Pomaga w organizacji
   - Wiesz co edytujesz

4. **Używaj sort_order**
   - Kontroluj kolejność wyświetlania

5. **Testuj na różnych językach**
   - Upewnij się że wszystkie wersje językowe działają

## 🚀 Co dalej?

System jest gotowy do użycia! Możesz:

1. ✅ Dodawać nowe elementy przez panel
2. ✅ Edytować istniejące elementy
3. ✅ Zarządzać menu
4. ✅ Tworzyć wersje w różnych językach
5. ✅ Używać na frontendzie

## 🆘 Pomoc

### Problem: Nie widzę elementów na frontendzie

**Rozwiązanie:**
- Sprawdź czy element jest aktywny (`is_active = true`)
- Sprawdź czy używasz poprawnego `key`
- Sprawdź czy backend działa
- Sprawdź console w przeglądarce

### Problem: Nie mogę zapisać elementu

**Rozwiązanie:**
- Sprawdź czy wszystkie wymagane pola są wypełnione
- Sprawdź czy `key` jest unikalny
- Sprawdź logi backendu

### Problem: Menu się nie wyświetla

**Rozwiązanie:**
- Sprawdź czy menu ma pozycje
- Sprawdź czy pozycje są aktywne
- Sprawdź czy używasz poprawnego `key` menu

## 🎉 Gotowe!

Masz teraz pełny system CMS jak WordPress! Możesz edytować wszystko przez panel administracyjny.

**Powodzenia!** 🚀
