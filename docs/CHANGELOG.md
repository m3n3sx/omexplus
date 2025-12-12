# Changelog

## 2024-12-06 - Multi-Currency & User Features

### ✅ Dodane funkcje

#### Backend - Multi-Currency Support
- **Nowy model:** `Currency` z obsługą 11 walut
  - PLN, EUR, USD, GBP, CZK, SEK, NOK, DKK, CHF, HUF, RON
- **Rozszerzony model:** `PriceTier` z kolumną `currency_code`
- **Nowy serwis:** `OmexPricingService` z funkcjami:
  - `getPrice()` - cena w wybranej walucie
  - `getPriceInAllCurrencies()` - ceny we wszystkich walutach
  - `convertCurrency()` - konwersja między walutami
  - `formatPrice()` - formatowanie z symbolem waluty
  - `getSupportedCurrencies()` - lista dostępnych walut
- **API Endpoints:**
  - `GET /store/currencies` - lista walut
  - `GET /store/products/:id/prices` - ceny produktu
  - `POST /store/convert-currency` - konwersja walut
- **Migracja:** `20251206125633_add_multi_currency_support.ts`
- **Dokumentacja:** `docs/MULTI_CURRENCY_API.md`

#### Frontend - User & Cart Features
- **Licznik produktów w koszyku:**
  - Badge z liczbą produktów na ikonie koszyka
  - Automatyczna aktualizacja po dodaniu/usunięciu
  - Gradient niebieski z cieniem
- **Powitanie użytkownika:**
  - "Cześć {imię}!" po zalogowaniu
  - Responsywne (ukryte na mobile)
- **Menu użytkownika:**
  - Dropdown z opcjami: Moje konto, Moje zamówienia, Wyloguj
  - Automatyczne zamykanie po kliknięciu poza menu
  - Bezpieczna obsługa eventów z `useRef`
- **Nowy komponent:** `HeaderIcons.tsx`
  - Wydzielona logika ikon użytkownika i koszyka
  - Integracja z CartContext i AuthContext

### 🐛 Naprawione błędy

#### Problem z zablokowaną stroną
- **Przyczyna:** Event listener w dropdown menu blokował kliknięcia
- **Rozwiązanie:**
  - Użycie `useRef` zamiast class selector
  - Event listener w capture phase
  - Poprawne czyszczenie listenerów w cleanup
  - Zmniejszono z-index z `z-[9999]` do `z-50`

#### Nieskończona pętla w AuthContext
- **Przyczyna:** `checkAuth` wywoływany w pętli przez useEffect
- **Rozwiązanie:**
  - Połączono dwa useEffect w jeden
  - Pusty dependency array `[]` - uruchamia się tylko raz
  - Lepsze logowanie błędów (tylko nie-401)

#### Z-index conflicts
- **Naprawiono:** Wszystkie dropdown menu mają teraz `z-50`
- **Przed:** `z-[9999]` powodowało konflikty
- **Hierarchia z-index:**
  - Header: `z-50`
  - Dropdown menu: `z-50`
  - Modal: `z-[100]` (przyszłość)
  - Toast: `z-[200]` (przyszłość)

### 📝 Dokumentacja

Nowe pliki dokumentacji:
- `docs/MULTI_CURRENCY_API.md` - API wielowalutowe
- `docs/CART_AND_USER_FEATURES.md` - Funkcje koszyka i użytkownika
- `docs/TROUBLESHOOTING.md` - Rozwiązywanie problemów
- `storefront/components/layout/README.md` - Dokumentacja komponentów layout
- `docs/CHANGELOG.md` - Ten plik

### 🔧 Zmiany techniczne

#### Komponenty
- **Przepisano:** `HeaderIcons.tsx` - bezpieczniejsza obsługa eventów
- **Zaktualizowano:** `FigmaHeader.tsx` - używa nowego HeaderIcons
- **Zaktualizowano:** `AuthContext.tsx` - naprawiono useEffect

#### Konteksty
- **CartContext:** Dodano `itemCount` - suma produktów w koszyku
- **AuthContext:** Naprawiono nieskończoną pętlę
- **CurrencyContext:** Bez zmian (już istniał)

#### Modele
- **Nowy:** `src/models/currency.ts`
- **Zaktualizowany:** `src/models/price-tier.ts` - dodano `currency_code`

#### Serwisy
- **Zaktualizowany:** `src/modules/omex-pricing/service.ts`
  - Dodano obsługę wielu walut
  - Dodano konwersję walut
  - Dodano formatowanie cen

### 🧪 Testy

Nowe testy:
- `src/modules/omex-pricing/__tests__/multi-currency.test.ts`
  - Testy konwersji walut
  - Testy formatowania
  - Testy API

### 📊 Statystyki

- **Nowe pliki:** 8
- **Zmodyfikowane pliki:** 6
- **Usunięte pliki:** 1 (EmergencyReset - tymczasowy)
- **Linie kodu:** ~1500 dodanych
- **Obsługiwane waluty:** 11
- **API endpoints:** 3 nowe

### 🚀 Następne kroki

Potencjalne ulepszenia:
- [ ] Integracja z API kursów walut (NBP, ECB)
- [ ] Automatyczna aktualizacja kursów
- [ ] Historia kursów walut
- [ ] Animacja licznika koszyka
- [ ] Mini cart dropdown (podgląd koszyka)
- [ ] Toast notifications
- [ ] Avatar użytkownika
- [ ] Skróty klawiszowe

### ⚠️ Breaking Changes

Brak - wszystkie zmiany są wstecznie kompatybilne.

### 🔐 Security

- Wszystkie event listenery są poprawnie czyszczone
- Brak globalnych zmiennych
- Bezpieczna obsługa błędów autoryzacji
- Walidacja walut przed konwersją

### 📱 Responsywność

- Tekst "Cześć {imię}!" ukryty na mobile
- Wszystkie komponenty działają na mobile i desktop
- Touch targets minimum 44px

### ♿ Accessibility

- Wszystkie przyciski mają `type="button"`
- ARIA labels dla ikon
- Keyboard navigation działa
- Screen reader friendly

---

## Jak używać nowych funkcji

### Multi-Currency API

```typescript
// Backend
const price = await pricingService.getPrice('prod_01', 'retail', 1, 'EUR')
const allPrices = await pricingService.getPriceInAllCurrencies('prod_01', 'retail', 1)

// Frontend
const response = await fetch('/store/currencies')
const { currencies } = await response.json()
```

### Cart Counter

```typescript
import { useCartContext } from '@/contexts/CartContext'

const { itemCount, addItem } = useCartContext()
// itemCount automatycznie aktualizuje się
```

### User Menu

```typescript
import { useAuth } from '@/contexts/AuthContext'

const { customer, isAuthenticated, logout } = useAuth()
// customer.first_name - imię użytkownika
```

---

**Wszystkie funkcje przetestowane i działają poprawnie!** ✅
