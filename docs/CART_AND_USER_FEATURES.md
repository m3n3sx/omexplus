# Funkcje Koszyka i Użytkownika

## Zaimplementowane Funkcje

### 1. Licznik Produktów w Koszyku ✅

Ikona koszyka w nagłówku wyświetla liczbę produktów:

```tsx
{itemCount > 0 && (
  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#1675F2] to-[#22A2F2] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
    {itemCount}
  </span>
)}
```

**Funkcjonalność:**
- Licznik pojawia się tylko gdy koszyk nie jest pusty
- Automatycznie aktualizuje się po dodaniu/usunięciu produktów
- Gradient niebieski z cieniem dla lepszej widoczności
- Zaokrąglony badge w prawym górnym rogu ikony

### 2. Powitanie Zalogowanego Użytkownika ✅

Po zalogowaniu, przy ikonie użytkownika wyświetla się tekst:

```tsx
<span className="hidden md:block text-[13px] font-bold whitespace-nowrap">
  Cześć {customer.first_name}!
</span>
```

**Funkcjonalność:**
- Wyświetla imię użytkownika z bazy danych
- Responsywne: ukryte na mobile, widoczne na desktop (md:)
- Klikalne - otwiera menu użytkownika

### 3. Menu Użytkownika ✅

Dropdown menu dla zalogowanych użytkowników:

**Opcje menu:**
- 📱 **Moje konto** - link do `/[locale]/konto`
- 📦 **Moje zamówienia** - link do `/[locale]/zamowienia`
- 🚪 **Wyloguj** - wywołuje `logout()` z AuthContext

**Funkcjonalność:**
- Automatyczne zamykanie po kliknięciu poza menu
- Smooth transitions
- Ikony przy każdej opcji
- Czerwony kolor dla opcji wylogowania

## Komponenty

### HeaderIcons.tsx

Nowy komponent zawierający logikę ikon użytkownika i koszyka.

**Props:** Brak (używa kontekstów)

**Konteksty:**
- `useCartContext()` - dla licznika koszyka
- `useAuth()` - dla danych użytkownika
- `useLocale()` - dla lokalizacji linków

**Stan:**
- `showUserMenu` - kontroluje widoczność dropdown menu

### FigmaHeader.tsx

Główny nagłówek zaktualizowany do używania `HeaderIcons`.

**Zmiany:**
- Usunięto hardcoded ikony użytkownika i koszyka
- Dodano import `HeaderIcons`
- Uproszczono kod nagłówka

## Integracja z Kontekstami

### CartContext

```tsx
const { itemCount, addItem, removeItem } = useCartContext()
```

**Dostępne właściwości:**
- `itemCount: number` - suma ilości wszystkich produktów
- `cart: Cart | null` - pełny obiekt koszyka
- `addItem(variantId, quantity)` - dodaj produkt
- `removeItem(lineId)` - usuń produkt
- `updateItem(lineId, quantity)` - zaktualizuj ilość

### AuthContext

```tsx
const { customer, isAuthenticated, logout } = useAuth()
```

**Dostępne właściwości:**
- `customer: Customer | null` - dane użytkownika
- `isAuthenticated: boolean` - status logowania
- `login(email, password)` - logowanie
- `logout()` - wylogowanie
- `register(data)` - rejestracja

## Przykłady Użycia

### Dodawanie produktu do koszyka

```tsx
import { useCartContext } from '@/contexts/CartContext'

export function AddToCartButton({ variantId }: { variantId: string }) {
  const { addItem } = useCartContext()
  
  const handleAdd = async () => {
    try {
      await addItem(variantId, 1)
      // Licznik w nagłówku automatycznie się zaktualizuje
    } catch (error) {
      console.error('Failed to add item:', error)
    }
  }
  
  return <button onClick={handleAdd}>Dodaj do koszyka</button>
}
```

### Wyświetlanie zawartości dla zalogowanych

```tsx
import { useAuth } from '@/contexts/AuthContext'

export function UserProfile() {
  const { customer, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Link href="/logowanie">Zaloguj się</Link>
  }
  
  return (
    <div>
      <h1>Witaj {customer.first_name} {customer.last_name}!</h1>
      <p>Email: {customer.email}</p>
    </div>
  )
}
```

## Stylowanie

### Kolory

- **Niebieski gradient:** `from-[#1675F2] to-[#22A2F2]`
- **Tło ikony:** `bg-[#E8F4FE]`
- **Tekst ikony:** `text-[#1675F2]`
- **Hover:** `hover:bg-[#1675F2] hover:text-white`
- **Czerwony (wyloguj):** `text-red-600 hover:bg-red-50`

### Rozmiary

- **Ikona:** `w-5 h-5`
- **Badge licznika:** `w-5 h-5`
- **Font badge:** `text-[10px]`
- **Font tekstu:** `text-[13px]`

### Responsywność

```tsx
// Ukryj tekst na mobile
<span className="hidden md:block">Cześć {name}!</span>

// Pokaż tylko ikonę na mobile
<svg className="w-5 h-5">...</svg>
```

## Testowanie

### Test licznika koszyka

1. Otwórz stronę produktu
2. Kliknij "Dodaj do koszyka"
3. Sprawdź czy licznik w nagłówku się pojawił
4. Dodaj więcej produktów
5. Sprawdź czy licznik się zwiększa

### Test menu użytkownika

1. Zaloguj się na konto
2. Sprawdź czy pojawia się "Cześć {imię}!"
3. Kliknij na przycisk użytkownika
4. Sprawdź czy otwiera się menu
5. Kliknij poza menu - powinno się zamknąć
6. Kliknij "Wyloguj" - powinno wylogować

## Przyszłe Ulepszenia

- [ ] Animacja licznika przy dodawaniu produktu
- [ ] Podgląd koszyka w dropdown (mini cart)
- [ ] Powiadomienia o dodaniu do koszyka (toast)
- [ ] Avatar użytkownika zamiast ikony
- [ ] Skróty klawiszowe (Ctrl+K dla koszyka)
- [ ] Wskaźnik ładowania przy dodawaniu do koszyka
