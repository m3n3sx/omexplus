# Layout Components

## Header Components

### FigmaHeader
Główny nagłówek sklepu z pełną funkcjonalnością.

**Funkcje:**
- ✅ Licznik produktów w koszyku (dynamiczny)
- ✅ Powitanie zalogowanego użytkownika: "Cześć {imię}!"
- ✅ Menu użytkownika z opcjami:
  - Moje konto
  - Moje zamówienia
  - Wyloguj
- ✅ Selektor języka (PL, EN, DE, UK)
- ✅ Selektor waluty (PLN, EUR, USD, GBP, UAH)
- ✅ Mega menu z kategoriami
- ✅ Responsywny design

### HeaderIcons
Komponent zawierający ikony użytkownika i koszyka.

**Funkcje:**
- Ikona użytkownika z tekstem "Cześć {imię}!" dla zalogowanych
- Ikona logowania dla niezalogowanych
- Ikona koszyka z licznikiem produktów
- Dropdown menu dla zalogowanych użytkowników

**Użycie:**
```tsx
import { HeaderIcons } from '@/components/layout/HeaderIcons'

<HeaderIcons />
```

## Konteksty

### CartContext
Zarządza stanem koszyka:
- `itemCount` - liczba produktów w koszyku
- `addItem()` - dodaj produkt
- `removeItem()` - usuń produkt
- `cart` - pełny obiekt koszyka

### AuthContext
Zarządza autoryzacją:
- `customer` - dane zalogowanego użytkownika
- `isAuthenticated` - czy użytkownik jest zalogowany
- `login()` - logowanie
- `logout()` - wylogowanie
- `register()` - rejestracja

## Przykład integracji

```tsx
'use client'

import { useCartContext } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'

export function MyComponent() {
  const { itemCount, addItem } = useCartContext()
  const { customer, isAuthenticated } = useAuth()

  return (
    <div>
      {isAuthenticated && <p>Witaj {customer.first_name}!</p>}
      <p>Produktów w koszyku: {itemCount}</p>
    </div>
  )
}
```

## Stylowanie

Komponenty używają:
- Tailwind CSS dla stylów
- Gradient niebieski dla aktywnych elementów: `from-[#1675F2] to-[#22A2F2]`
- Zaokrąglone rogi: `rounded-xl`
- Smooth transitions: `transition-colors`

## Responsywność

- Mobile: Ukryty tekst "Cześć {imię}!", tylko ikona
- Desktop: Pełny tekst widoczny
- Breakpoint: `md:` (768px)
