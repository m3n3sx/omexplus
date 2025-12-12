# OMEX Admin Dashboard - Funkcjonalności

## Przegląd Modułów

Dashboard administracyjny OMEX zawiera kompletny zestaw narzędzi do zarządzania sklepem internetowym z częściami do maszyn budowlanych.

## 🎯 Główne Moduły

### 1. Dashboard (/)
- Statystyki sprzedaży w czasie rzeczywistym
- Wykres sprzedaży (ostatnie 7 dni)
- Lista ostatnich zamówień
- Top 5 najlepiej sprzedających się produktów
- Liczba klientów

### 2. Zamówienia (/orders)
- Lista wszystkich zamówień
- Szczegóły zamówienia
- Zarządzanie statusem
- Realizacja zamówień
- Zwroty i reklamacje

### 3. Produkty (/products)
- Lista produktów z filtrowaniem
- Dodawanie nowych produktów
- Edycja produktów
- Zarządzanie wariantami
- Zarządzanie cenami i stanami magazynowymi
- Upload zdjęć produktów

### 4. Kategorie (/categories)
- **Hierarchiczna struktura kategorii**
- Dodawanie kategorii głównych i podkategorii
- Edycja nazw, opisów i slugów
- Ustawianie kolejności wyświetlania (rank)
- Aktywacja/dezaktywacja kategorii
- Widok drzewa kategorii z możliwością rozwijania

**Funkcje:**
- Tworzenie nieograniczonej liczby poziomów kategorii
- Drag & drop do zmiany kolejności (planowane)
- Przypisywanie produktów do kategorii
- SEO-friendly slugi

### 5. Klienci (/customers)
- Lista klientów
- Szczegóły klienta
- Historia zamówień klienta
- Zarządzanie danymi kontaktowymi

## 🎨 Treść & Wygląd

### 6. Strony CMS (/cms/pages)
- **Zarządzanie statycznymi stronami**
- Tworzenie nowych stron (O nas, Kontakt, FAQ, itp.)
- Edytor treści (HTML/Markdown)
- Zarządzanie slugami URL
- Publikacja/ukrywanie stron
- Podgląd na żywo

**Przykładowe strony:**
- O nas
- Kontakt
- Regulamin
- Polityka prywatności
- FAQ
- Dostawa i płatność

### 7. Topbar (/topbar)
- **Zarządzanie górnym paskiem nawigacyjnym**
- Edycja danych kontaktowych (telefon, email)
- Zarządzanie językami:
  - Włączanie/wyłączanie języków
  - Edycja nazw wyświetlanych
  - Flagi krajów
- Zarządzanie walutami:
  - Włączanie/wyłączanie walut
  - Symbole walut
- Dodatkowe linki w topbarze

**Dane edytowalne:**
```
- Telefon: +48 500 189 080
- Email: omexsales@gmail.com
- Języki: PL, EN, DE
- Waluty: PLN, EUR, USD
- Linki: FAQ, Koszyk
```

### 8. Mega Menu (/megamenu)
- **Zarządzanie strukturą głównego menu**
- Dodawanie kategorii do mega menu
- Edycja ikon kategorii (3-literowe kody)
- Ustawianie priorytetów (⭐⭐⭐)
- Procent sprzedaży dla kategorii
- Zarządzanie podkategoriami
- Kolejność wyświetlania

**Struktura elementu menu:**
```typescript
{
  name: "Hydraulika & Osprzęt",
  icon: "HYD",
  slug: "hydraulika",
  priority: "⭐⭐⭐",
  salesPercent: "40%",
  subcategories: [
    "Pompy hydrauliczne",
    "Silniki hydrauliczne",
    ...
  ]
}
```

### 9. Bannery (/banners)
- **Zarządzanie bannerami promocyjnymi**
- Dodawanie nowych bannerów
- Upload obrazków
- Ustawianie linków docelowych
- Pozycjonowanie bannerów:
  - Strona główna - Hero
  - Strona główna - Sekundarne
  - Kategoria - Góra
  - Sidebar
- Priorytet wyświetlania
- Aktywacja/dezaktywacja

### 10. SEO (/seo)
- Zarządzanie meta tagami
- Edycja tytułów stron
- Opisy meta description
- Open Graph tags
- Structured data

## 🔧 Ustawienia (/settings)
- Ogólne ustawienia sklepu
- Konfiguracja płatności
- Ustawienia wysyłki
- Integracje
- Powiadomienia email

## 📊 Integracja z Backendem

Wszystkie moduły pracują na prawdziwych danych z Medusa backend:

### API Endpoints

**Kategorie:**
- `GET /admin/product-categories` - lista kategorii
- `POST /admin/product-categories` - nowa kategoria
- `POST /admin/product-categories/:id` - edycja
- `DELETE /admin/product-categories/:id` - usunięcie

**Strony CMS:**
- `GET /store/cms/pages` - lista stron
- `POST /admin/cms/pages` - nowa strona
- `POST /admin/cms/pages/:id` - edycja
- `DELETE /admin/cms/pages/:id` - usunięcie

**Topbar:**
- `GET /store/settings/topbar` - pobierz ustawienia
- `POST /admin/settings/topbar` - zapisz ustawienia

**Mega Menu:**
- `GET /store/settings/megamenu` - pobierz strukturę
- `POST /admin/settings/megamenu` - zapisz strukturę

**Bannery:**
- `GET /store/banners` - lista bannerów
- `POST /admin/banners` - nowy banner
- `POST /admin/banners/:id` - edycja
- `DELETE /admin/banners/:id` - usunięcie

## 🚀 Uruchomienie

```bash
cd admin-dashboard
npm install
npm run dev
```

Dashboard będzie dostępny pod: `http://localhost:3001`

## 🔐 Logowanie

Użyj tych samych danych co do głównego Medusa Admin:
- Email: admin@omex.pl
- Hasło: [twoje hasło]

## 📱 Responsywność

Dashboard jest w pełni responsywny i działa na:
- Desktop (1920px+)
- Laptop (1366px+)
- Tablet (768px+)
- Mobile (320px+)

## 🎨 Technologie

- **Next.js 15** - Framework React
- **TypeScript** - Typowanie
- **Tailwind CSS** - Stylowanie
- **Lucide React** - Ikony
- **Recharts** - Wykresy
- **Medusa JS SDK** - Integracja z backendem

## 📝 Dalszy Rozwój

Planowane funkcjonalności:
- [ ] Drag & drop dla kategorii
- [ ] Zaawansowany edytor WYSIWYG dla stron CMS
- [ ] Upload obrazków bezpośrednio w dashboardzie
- [ ] Wersje językowe dla treści CMS
- [ ] Historia zmian
- [ ] Uprawnienia użytkowników
- [ ] Bulk operations dla produktów
- [ ] Eksport/import danych
