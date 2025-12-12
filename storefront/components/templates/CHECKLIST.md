# ✅ Checklist Wdrożenia Szablonów

Użyj tej checklisty przy implementacji nowych funkcji lub migracji starych komponentów.

## 📋 Przed Rozpoczęciem

- [ ] Przeczytaj dokumentację (`COMPONENT_TEMPLATES.md`)
- [ ] Zobacz przykłady użycia (`EXAMPLES.md`)
- [ ] Sprawdź stronę demo (`/templates-demo`)
- [ ] Zapoznaj się z design system (`design-system.md`)

---

## 🎨 Wybór Odpowiedniego Szablonu

### Produkty
- [ ] `ProductCardTemplate` - Wyświetlanie produktu w siatce
- [ ] `ProductGrid` - Siatka produktów z paginacją
- [ ] `ProductSkeleton` - Loading state dla produktu

### Kategorie
- [ ] `MainCategoryCard` - Karta kategorii głównej
- [ ] `CategoryHierarchy` - Drzewo kategorii w sidebar

### Formularze
- [ ] `InputField` - Pole tekstowe
- [ ] `TextareaField` - Pole wieloliniowe
- [ ] `SelectField` - Lista rozwijana
- [ ] `CheckboxField` - Pole wyboru

### UI
- [ ] `Button` - Przyciski (primary, secondary, outline, ghost)
- [ ] `EmptyState` - Pusty stan (brak wyników, pusty koszyk)
- [ ] `ErrorMessage` - Komunikaty błędów
- [ ] `LoadingSkeleton` - Loading states

### Modals
- [ ] `ModalTemplate` - Uniwersalny modal
- [ ] `ConfirmModalTemplate` - Modal potwierdzenia

### Notyfikacje
- [ ] `NotificationTemplate` - Toast notifications
- [ ] `useNotification` - Hook do zarządzania notyfikacjami

### Koszyk
- [ ] `CartItemTemplate` - Element w koszyku

### Info Cards
- [ ] `InfoCardTemplate` - Karta informacyjna
- [ ] `FeatureCardTemplate` - Karta funkcji
- [ ] `StatCardTemplate` - Karta statystyk

---

## 💻 Implementacja

### 1. Import
```tsx
import { ComponentName } from '@/components/templates'
```

- [ ] Importuję z centralnego pliku `@/components/templates`
- [ ] Nie importuję bezpośrednio z plików komponentów
- [ ] Używam TypeScript types z `@/components/templates`

### 2. Props
- [ ] Sprawdziłem wymagane props w dokumentacji
- [ ] Używam TypeScript dla type safety
- [ ] Przekazuję wszystkie wymagane dane
- [ ] Dodaję opcjonalne props jeśli potrzebne

### 3. Styling
- [ ] Używam `className` prop do customizacji
- [ ] Przestrzegam design system (kolory, spacing, typography)
- [ ] Nie nadpisuję wewnętrznych styli komponentu
- [ ] Używam Tailwind CSS utilities

### 4. State Management
- [ ] Zarządzam stanem lokalnym przez `useState`
- [ ] Używam `useNotification` dla notyfikacji
- [ ] Implementuję loading states
- [ ] Obsługuję błędy

---

## 🧪 Testowanie

### Funkcjonalność
- [ ] Komponent renderuje się poprawnie
- [ ] Wszystkie props działają zgodnie z oczekiwaniami
- [ ] Obsługa zdarzeń (onClick, onChange) działa
- [ ] Loading states wyświetlają się poprawnie
- [ ] Error states wyświetlają się poprawnie

### Responsywność
- [ ] Mobile (375px) - Wygląda dobrze
- [ ] Tablet (768px) - Wygląda dobrze
- [ ] Desktop (1024px+) - Wygląda dobrze
- [ ] Breakpointy Tailwind działają poprawnie

### Dostępność (A11y)
- [ ] Keyboard navigation działa
- [ ] Focus states są widoczne
- [ ] ARIA labels są obecne
- [ ] Screen reader friendly
- [ ] Minimum touch target 44px (mobile)

### Performance
- [ ] Brak niepotrzebnych re-renderów
- [ ] Lazy loading gdzie możliwe
- [ ] Optymalizacja obrazków
- [ ] Brak memory leaks

---

## 🎯 Design System Compliance

### Kolory
- [ ] Primary (niebieski) - główne akcje
- [ ] Secondary (pomarańczowy/żółty) - akcenty
- [ ] Neutral (szary) - tła, teksty
- [ ] Success (zielony) - sukces
- [ ] Warning (żółty) - ostrzeżenia
- [ ] Danger (czerwony) - błędy

### Typography
- [ ] Font weights: 400, 500, 600, 700
- [ ] Font sizes: xs do 4xl
- [ ] Line heights odpowiednie
- [ ] Czytelność tekstu

### Spacing
- [ ] Używam custom spacing (xs, sm, md, lg, xl, 2xl)
- [ ] Konsystentne odstępy
- [ ] Padding i margin zgodne z design system

### Border Radius
- [ ] sm (4px), md (8px), lg (12px)
- [ ] rounded-full dla okrągłych elementów
- [ ] Konsystentne zaokrąglenia

### Transitions
- [ ] Duration: 150ms, 250ms, 350ms
- [ ] Smooth animations
- [ ] Nie przesadzam z animacjami

---

## 📱 Integracja

### API
- [ ] Poprawne endpointy
- [ ] Error handling
- [ ] Loading states
- [ ] Retry logic gdzie potrzebne

### Routing
- [ ] Poprawne linki (Next.js Link)
- [ ] Locale w URL
- [ ] Query params gdzie potrzebne

### i18n
- [ ] Wszystkie teksty przez `useTranslations`
- [ ] Brak hardcoded strings
- [ ] Tłumaczenia w `messages/`

### Context
- [ ] Używam odpowiednich Context providers
- [ ] Nie duplikuję state
- [ ] Optymalizacja re-renderów

---

## 🚀 Deployment

### Code Quality
- [ ] TypeScript bez błędów
- [ ] ESLint bez błędów (lub uzasadnione ignore)
- [ ] Kod sformatowany (Prettier)
- [ ] Brak console.log w produkcji

### Documentation
- [ ] Dodałem komentarze JSDoc gdzie potrzebne
- [ ] Zaktualizowałem README jeśli potrzebne
- [ ] Dodałem przykład użycia jeśli nowy pattern

### Testing
- [ ] Przetestowałem lokalnie
- [ ] Sprawdziłem na różnych przeglądarkach
- [ ] Sprawdziłem na różnych urządzeniach
- [ ] Brak regresji w innych częściach aplikacji

### Performance
- [ ] Lighthouse score > 90
- [ ] Brak performance warnings
- [ ] Optymalizacja bundle size
- [ ] Lazy loading gdzie możliwe

---

## 🔄 Migracja Starych Komponentów

### Identyfikacja
- [ ] Znalazłem stary komponent do migracji
- [ ] Zidentyfikowałem odpowiedni szablon
- [ ] Sprawdziłem wszystkie miejsca użycia

### Zamiana
- [ ] Zastąpiłem import
- [ ] Dostosowałem props
- [ ] Przetestowałem funkcjonalność
- [ ] Sprawdziłem styling

### Cleanup
- [ ] Usunąłem stary komponent
- [ ] Usunąłem nieużywane pliki
- [ ] Zaktualizowałem imports w innych plikach
- [ ] Sprawdziłem czy nic się nie zepsuło

---

## 📊 Metryki Sukcesu

Po wdrożeniu sprawdź:

- [ ] Czas ładowania strony nie wzrósł
- [ ] Bundle size nie wzrósł znacząco
- [ ] Brak błędów w console
- [ ] Brak błędów w Sentry/monitoring
- [ ] Pozytywny feedback od użytkowników
- [ ] Brak zgłoszeń bugów

---

## 🆘 Troubleshooting

### Problem: Komponent się nie renderuje
- [ ] Sprawdź czy import jest poprawny
- [ ] Sprawdź czy przekazujesz wymagane props
- [ ] Sprawdź console na błędy TypeScript
- [ ] Sprawdź czy dane są w poprawnym formacie

### Problem: Styling nie działa
- [ ] Sprawdź czy Tailwind classes są poprawne
- [ ] Sprawdź czy nie nadpisujesz ważnych styli
- [ ] Sprawdź czy `className` prop jest przekazany
- [ ] Sprawdź kolejność classes (specificity)

### Problem: TypeScript errors
- [ ] Sprawdź czy types są zaimportowane
- [ ] Sprawdź czy props są poprawnego typu
- [ ] Sprawdź dokumentację dla poprawnych types
- [ ] Użyj `as` cast tylko w ostateczności

### Problem: Performance issues
- [ ] Sprawdź czy nie ma niepotrzebnych re-renderów
- [ ] Użyj React DevTools Profiler
- [ ] Sprawdź czy używasz memo/useMemo gdzie potrzebne
- [ ] Sprawdź czy lazy loading działa

---

## 📚 Dodatkowe Zasoby

- [Dokumentacja](./COMPONENT_TEMPLATES.md)
- [Przykłady](./EXAMPLES.md)
- [Quick Start](./README.md)
- [Design System](../../.kiro/steering/design-system.md)
- [Demo Page](/templates-demo)

---

## ✨ Best Practices

1. **Zawsze używaj szablonów** - Nie twórz nowych komponentów jeśli istnieje szablon
2. **Jeden szablon = Jeden typ** - Nie duplikuj komponentów
3. **Props > Nowe komponenty** - Używaj props do customizacji
4. **TypeScript zawsze** - Pełne type safety
5. **Testuj responsywność** - Mobile-first approach
6. **Dostępność** - Keyboard navigation, ARIA labels
7. **Performance** - Optymalizuj od początku
8. **Dokumentuj** - Dodaj komentarze dla złożonej logiki

---

**Powodzenia! 🚀**

Jeśli masz pytania, sprawdź dokumentację lub zapytaj zespół!
