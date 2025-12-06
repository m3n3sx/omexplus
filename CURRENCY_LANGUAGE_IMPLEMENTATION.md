# Implementacja Zmiany Języków i Walut

## Zrealizowane Funkcjonalności

### 1. Zmiana Języków
- **Dostępne języki**: Polski (🇵🇱), English (🇬🇧), Deutsch (🇩🇪), Українська (🇺🇦)
- **Lokalizacja**: Wykorzystuje next-intl z plikami tłumaczeń w `storefront/messages/`
- **Routing**: Automatyczne przekierowanie do wybranego języka z zachowaniem ścieżki
- **Persistencja**: Wybór języka zapisywany w URL

### 2. Zmiana Walut
- **Dostępne waluty**: 
  - PLN (zł) - Polski Złoty
  - EUR (€) - Euro
  - USD ($) - US Dollar
  - GBP (£) - British Pound
  - UAH (₴) - Українська гривня ✨ NOWA
- **Persistencja**: Wybór waluty zapisywany w localStorage
- **Context API**: Globalne zarządzanie walutą przez CurrencyContext

### 3. Backend - Region Ukraina
- **Region**: Utworzony region "Ukraine" z walutą UAH
- **ID regionu**: `reg_01UKRAINE000000000000000`
- **Kraj**: Ukraina (ua) przypisana do regionu Ukraine
- **Waluta**: UAH (Ukrainian Hryvnia) - już dostępna w bazie Medusa

## Struktura Plików

### Frontend
```
storefront/
├── components/
│   ├── layout/
│   │   └── FigmaHeader.tsx          # Dropdown menu języków i walut
│   └── providers/
│       └── Providers.tsx             # Provider z CurrencyProvider
├── contexts/
│   └── CurrencyContext.tsx           # Context dla globalnej waluty
├── lib/
│   └── currency.ts                   # Utility do konwersji walut
└── messages/
    ├── pl.json                       # Tłumaczenia polskie
    ├── en.json                       # Tłumaczenia angielskie
    ├── de.json                       # Tłumaczenia niemieckie
    └── uk.json                       # Tłumaczenia ukraińskie
```

### Backend
```
add-ukraine-region.sql                # SQL do utworzenia regionu Ukraine
```

## Użycie

### Zmiana Języka
1. Kliknij dropdown z flagą i nazwą języka w górnym menu
2. Wybierz język z listy
3. Strona automatycznie przekieruje do wybranego języka

### Zmiana Waluty
1. Kliknij dropdown z symbolem waluty w górnym menu
2. Wybierz walutę z listy
3. Wybór zostanie zapisany i zastosowany globalnie

### Użycie w Komponencie
```typescript
import { useCurrency } from '@/contexts/CurrencyContext'
import { formatPrice, convertPrice } from '@/lib/currency'

function MyComponent() {
  const { currency, setCurrency } = useCurrency()
  
  // Konwersja ceny
  const priceInSelectedCurrency = convertPrice(10000, 'PLN', currency)
  
  // Formatowanie ceny
  const formattedPrice = formatPrice(priceInSelectedCurrency, currency)
  
  return <div>{formattedPrice}</div>
}
```

## Kursy Wymiany

Obecnie używane są statyczne kursy (PLN jako baza):
- PLN: 1
- EUR: 0.23
- USD: 0.25
- GBP: 0.20
- UAH: 10.5

**Uwaga**: W produkcji należy zintegrować API do pobierania aktualnych kursów (np. exchangerate-api.com)

## Baza Danych

### Regiony
```sql
SELECT id, name, currency_code FROM region;
```
| ID | Name | Currency |
|----|------|----------|
| reg_01KBDXHQAFG1GS7F3WH2680KP0 | Europe | EUR |
| reg_01UKRAINE000000000000000 | Ukraine | UAH |

### Kraje
```sql
SELECT iso_2, name, region_id FROM region_country WHERE iso_2 IN ('pl', 'ua');
```
| ISO | Name | Region |
|-----|------|--------|
| pl | POLAND | reg_01KBDXHQAFG1GS7F3WH2680KP0 |
| ua | UKRAINE | reg_01UKRAINE000000000000000 |

## UI/UX

### Dropdown Menu
- **Pozycja**: Górny niebieski pasek nawigacji (lewy górny róg)
- **Styl**: Białe tło, zaokrąglone rogi, cień
- **Hover**: Niebieskie tło dla aktywnego elementu
- **Ikona**: Checkmark (✓) przy wybranej opcji
- **Zamykanie**: Automatyczne po kliknięciu poza menu

### Responsywność
- Desktop: Pełne nazwy języków i walut
- Mobile: Może wymagać dostosowania (do rozważenia skrócone nazwy)

## Następne Kroki (Opcjonalne)

1. **Integracja API kursów walut**: Pobieranie aktualnych kursów z zewnętrznego API
2. **Konwersja cen produktów**: Automatyczna konwersja wszystkich cen w sklepie
3. **Geolokalizacja**: Automatyczne wykrywanie języka i waluty na podstawie IP
4. **Więcej walut**: Dodanie walut dla innych krajów (CZK, SEK, NOK, etc.)
5. **Tłumaczenia**: Uzupełnienie brakujących tłumaczeń we wszystkich językach
6. **Mobile optimization**: Dostosowanie dropdown menu dla urządzeń mobilnych

## Status
✅ Zmiana języków - GOTOWE
✅ Zmiana walut - GOTOWE  
✅ Region Ukraine z UAH - GOTOWE
✅ Separatory w menu - GOTOWE
✅ Persistencja wyboru - GOTOWE
