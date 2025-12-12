# Troubleshooting Guide

## Strona przyciemniona i zablokowana po zalogowaniu

### Objawy:
- Strona staje się przyciemniona
- Nie można kliknąć żadnych elementów
- Narzędzia deweloperskie nie działają
- Problem występuje po zalogowaniu

### Możliwe przyczyny:

#### 1. Fast Refresh (Hot Module Replacement)
**Najczęstsza przyczyna w trybie development**

Gdy zapisujesz plik podczas development, Next.js automatycznie przebudowuje aplikację. To może trwać kilka sekund.

**Rozwiązanie:**
- Poczekaj 2-3 sekundy aż Fast Refresh się zakończy
- Sprawdź console - powinno być `[Fast Refresh] done`
- To normalne zachowanie w development

#### 2. Dropdown menu z zbyt wysokim z-index
Menu użytkownika lub mega menu może blokować całą stronę.

**Rozwiązanie:**
- Odśwież stronę (F5 lub Ctrl+R)
- Sprawdź czy z-index nie jest ustawiony na `z-[9999]`
- Użyj `z-50` dla dropdown menu

**Fix zastosowany:**
```tsx
// HeaderIcons.tsx - z-50 zamiast z-[9999]
<div className="... z-50">
```

#### 3. Event listener blokuje kliknięcia
Event listener `mousedown` może przechwytywać wszystkie kliknięcia.

**Rozwiązanie:**
- Sprawdź czy event listener ma `stopPropagation()`
- Upewnij się że listener jest usuwany w cleanup

**Fix zastosowany:**
```tsx
useEffect(() => {
  if (!showUserMenu) return
  
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest('.user-menu')) {
      setShowUserMenu(false)
    }
  }

  const timeoutId = setTimeout(() => {
    document.addEventListener('mousedown', handleClickOutside)
  }, 0)

  return () => {
    clearTimeout(timeoutId)
    document.removeEventListener('mousedown', handleClickOutside)
  }
}, [showUserMenu])
```

#### 4. Nieskończona pętla re-renderów
AuthContext może powodować nieskończone re-rendery.

**Rozwiązanie:**
- Sprawdź console czy nie ma ostrzeżeń o re-renderach
- Upewnij się że `checkAuth` nie jest wywoływany w pętli

**Fix zastosowany:**
```tsx
// Zamknij menu gdy zmienia się stan autoryzacji
useEffect(() => {
  setShowUserMenu(false)
}, [isAuthenticated])
```

### Szybkie rozwiązania:

1. **Odśwież stronę** (F5)
2. **Wyczyść cache przeglądarki** (Ctrl+Shift+R)
3. **Sprawdź console** - szukaj błędów
4. **Zamknij wszystkie dropdown menu** - kliknij poza nimi
5. **Restart dev server**:
   ```bash
   # Zatrzymaj (Ctrl+C)
   # Uruchom ponownie
   cd storefront
   npm run dev
   ```

### Debug w konsoli:

```javascript
// Sprawdź czy są otwarte menu
document.querySelectorAll('[class*="z-"]').forEach(el => {
  console.log(el.className, window.getComputedStyle(el).zIndex)
})

// Sprawdź event listenery
getEventListeners(document)

// Sprawdź czy są blokujące overlay
document.querySelectorAll('[class*="fixed"], [class*="absolute"]').forEach(el => {
  const style = window.getComputedStyle(el)
  if (style.position === 'fixed' || style.position === 'absolute') {
    console.log(el, style.zIndex, style.pointerEvents)
  }
})
```

### Zapobieganie problemowi:

1. **Używaj rozsądnych z-index:**
   - Header: `z-50`
   - Dropdown menu: `z-50`
   - Modal: `z-[100]`
   - Toast: `z-[200]`

2. **Zawsze usuwaj event listenery:**
   ```tsx
   useEffect(() => {
     // ... add listener
     return () => {
       // ZAWSZE usuwaj listener
       document.removeEventListener('mousedown', handler)
     }
   }, [deps])
   ```

3. **Zamykaj menu przy zmianie stanu:**
   ```tsx
   useEffect(() => {
     setShowMenu(false)
   }, [isAuthenticated, pathname])
   ```

4. **Używaj `stopPropagation()` ostrożnie:**
   ```tsx
   onClick={(e) => {
     e.stopPropagation() // Tylko gdy naprawdę potrzebne
     handleClick()
   }}
   ```

## Inne problemy

### Backend nie odpowiada (401 Unauthorized)

**Objaw:**
```
GET http://localhost:9000/store/customers/me 401 (Unauthorized)
```

**Przyczyna:**
- Użytkownik nie jest zalogowany
- Sesja wygasła
- Backend nie działa

**Rozwiązanie:**
- To normalne dla niezalogowanych użytkowników
- Zaloguj się ponownie
- Sprawdź czy backend działa: `curl http://localhost:9000/health`

### Licznik koszyka nie aktualizuje się

**Rozwiązanie:**
1. Sprawdź czy CartContext jest w providers
2. Sprawdź czy `addItem()` jest wywoływane
3. Sprawdź console czy nie ma błędów

### Menu użytkownika nie pokazuje imienia

**Rozwiązanie:**
1. Sprawdź czy `customer.first_name` istnieje
2. Sprawdź czy AuthContext zwraca `customer`
3. Zaloguj się ponownie

## Kontakt

Jeśli problem nadal występuje:
1. Sprawdź console (F12)
2. Zrób screenshot błędu
3. Opisz kroki do reprodukcji
4. Sprawdź czy problem występuje w trybie produkcyjnym
