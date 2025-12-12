# System Szablonów Komponentów

Ten dokument opisuje kompletny system szablonów używany w projekcie, który zapewnia spójny wygląd i zachowanie komponentów w całej aplikacji.

## 📋 Spis Treści

1. [Filozofia](#filozofia)
2. [Instalacja i Użycie](#instalacja-i-użycie)
3. [Szablony Produktów](#szablony-produktów)
4. [Szablony Kategorii](#szablony-kategorii)
5. [Szablony Formularzy](#szablony-formularzy)
6. [Szablony UI](#szablony-ui)
7. [Szablony Koszyka](#szablony-koszyka)
8. [Szablony Modali](#szablony-modali)
9. [Szablony Notyfikacji](#szablony-notyfikacji)
10. [Szablony Wyszukiwania](#szablony-wyszukiwania)
11. [Zasady Tworzenia Nowych Szablonów](#zasady-tworzenia-nowych-szablonów)
12. [Migracja Starych Komponentów](#migracja-starych-komponentów)

---

## Filozofia

Każdy typ elementu (produkt, kategoria, karta, itp.) ma **jeden dedykowany szablon**, który jest używany wszędzie w aplikacji. Dzięki temu:
- ✅ Wszystkie produkty wyglądają identycznie niezależnie od miejsca wyświetlania
- ✅ Zmiany w szablonie automatycznie propagują się do całej aplikacji
- ✅ Łatwe utrzymanie i rozwój kodu
- ✅ Spójna user experience
- ✅ Szybszy rozwój - nie duplikujesz kodu
- ✅ Mniej błędów - jeden przetestowany komponent

---

## Instalacja i Użycie

### Import z Centralnego Pliku

Wszystkie szablony są eksportowane z jednego miejsca:

```tsx
import {
  // Produkty
  ProductCardTemplate,
  ProductGrid,
  ProductSkeleton,
  
  // Kategorie
  MainCategoryCard,
  CategoryHierarchy,
  
  // Formularze
  InputField,
  TextareaField,
  SelectField,
  CheckboxField,
  
  // UI
  Button,
  EmptyState,
  ErrorMessage,
  
  // Modals
  ModalTemplate,
  ConfirmModalTemplate,
  
  // Notyfikacje
  NotificationTemplate,
  useNotification,
  
  // Koszyk
  CartItemTemplate,
  
  // Info Cards
  InfoCardTemplate,
  FeatureCardTemplate,
  StatCardTemplate,
} from '@/components/templates'
```

---

## Dostępne Szablony

### 1. ProductCardTemplate
**Lokalizacja**: `storefront/components/product/ProductCardTemplate.tsx`

**Zastosowanie**: Wyświetlanie produktów w siatce (grid)

**Gdzie używany**:
- Strona główna (`/`)
- Wyniki wyszukiwania (`/search`)
- Strony kategorii (`/categories/[slug]`)
- Strony kolekcji
- Listy produktów

**Przykład użycia**:
```tsx
import { ProductCardTemplate } from '@/components/product/ProductCardTemplate'

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {products.map((product) => (
    <ProductCardTemplate key={product.id} product={product} />
  ))}
</div>
```

**Cechy**:
- Biała karta z zaokrąglonymi rogami
- Zdjęcie produktu
- Nazwa i opis
- Cena z walutą
- Status dostępności
- Przycisk "Dodaj do koszyka"
- Efekty hover

---

### 2. MainCategoryCard
**Lokalizacja**: `storefront/components/layout/MainCategoryCard.tsx`

**Zastosowanie**: Wyświetlanie kategorii głównych

**Gdzie używany**:
- Strona główna - sekcja "Kategorie produktów"

**Przykład użycia**:
```tsx
import { MainCategoryCard } from '@/components/layout/MainCategoryCard'

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {categories.map((category) => (
    <MainCategoryCard key={category.id} category={category} />
  ))}
</div>
```

**Cechy**:
- Biała karta z zaokrąglonymi rogami
- Nazwa kategorii (bold)
- Automatyczny opis z liczbą produktów
- Żółty przycisk "Zobacz więcej"
- Efekt hover z cieniem

---

### 3. CategoryHierarchy
**Lokalizacja**: `storefront/components/filters/CategoryHierarchy.tsx`

**Zastosowanie**: Wyświetlanie hierarchii kategorii (drzewo)

**Gdzie używany**:
- Strony kategorii - sidebar po lewej stronie

**Przykład użycia**:
```tsx
import { CategoryHierarchy } from '@/components/filters/CategoryHierarchy'

<CategoryHierarchy
  currentCategory={category}
  allSubcategories={allSubcategories}
/>
```

**Cechy**:
- Aktualna kategoria podświetlona na żółto
- Rozwijane/zwijane podkategorie
- Wszystkie poziomy hierarchii
- Licznik produktów przy każdej kategorii
- Nawigacja między kategoriami

---

### 4. UnifiedSearchHub
**Lokalizacja**: `storefront/components/search/UnifiedSearchHub.tsx`

**Zastosowanie**: Zaawansowana wyszukiwarka z 5 metodami

**Gdzie używany**:
- Strona główna - hero section
- Strona wyników wyszukiwania

**Przykład użycia**:
```tsx
import UnifiedSearchHub from '@/components/search/UnifiedSearchHub'

<UnifiedSearchHub 
  onSearch={handleSearch} 
  locale={locale} 
/>
```

**Cechy**:
- 5 metod wyszukiwania (tekst, maszyna, numer części, zdjęcie, filtry)
- Zakładki do przełączania metod
- Popularne wyszukiwania
- Sekcja pomocy z kontaktem
- Spójny design z resztą aplikacji

---

### 5. FeaturedProductCard
**Lokalizacja**: `storefront/components/layout/FeaturedProductCard.tsx`

**Zastosowanie**: Wyświetlanie wyróżnionych produktów w mega menu

**Gdzie używany**:
- Mega menu nawigacji - kolumna "Featured Products"

**Przykład użycia**:
```tsx
import { FeaturedProductCard } from '@/components/layout/FeaturedProductCard'

{featuredProducts.map((product) => (
  <FeaturedProductCard
    key={product.id}
    product={product}
    locale={locale}
    onClick={handleMenuClose}
  />
))}
```

**Cechy**:
- Kompaktowy format dla menu
- Nazwa i kategoria
- Krótki opis
- Link do produktu

---

## Zasady Tworzenia Nowych Szablonów

Jeśli potrzebujesz stworzyć nowy typ komponentu:

1. **Jeden szablon na typ elementu**
   - Nie twórz wielu wariantów tego samego komponentu
   - Użyj props do customizacji zamiast duplikacji kodu

2. **Lokalizacja**
   - Produkty: `storefront/components/product/`
   - Layout: `storefront/components/layout/`
   - Filtry: `storefront/components/filters/`
   - Wyszukiwanie: `storefront/components/search/`

3. **Nazewnictwo**
   - Używaj sufiksu `Template` dla głównych szablonów (np. `ProductCardTemplate`)
   - Używaj opisowych nazw (np. `MainCategoryCard`, nie `CategoryCard1`)

4. **TypeScript**
   - Zawsze definiuj interfejs dla props
   - Używaj typów z `@/types/` jeśli dostępne

5. **Styling**
   - Używaj Tailwind CSS
   - Przestrzegaj design system z `design-system.md`
   - Kolory: `primary-*`, `secondary-*`, `neutral-*`
   - Zaokrąglenia: `rounded-lg`, `rounded-2xl`, `rounded-3xl`

6. **Responsywność**
   - Mobile-first approach
   - Breakpointy: `sm:`, `md:`, `lg:`, `xl:`

7. **Dostępność**
   - ARIA labels
   - Semantic HTML
   - Keyboard navigation

## Przykład: Dodawanie Nowego Produktu

Gdy dodajesz nowy produkt do bazy danych, automatycznie będzie on wyświetlany z użyciem `ProductCardTemplate` w:
- Wynikach wyszukiwania
- Listach kategorii
- Stronie głównej (jeśli jest najnowszy)
- Wszędzie gdzie używany jest ten szablon

**Nie musisz** tworzyć osobnych komponentów dla każdego miejsca - szablon zadba o spójność!

## Przykład: Dodawanie Nowej Kategorii

Gdy dodajesz nową kategorię główną:
1. Dodaj ją do bazy danych z `parent_category_id = NULL`
2. Automatycznie pojawi się na stronie głównej używając `MainCategoryCard`
3. Automatycznie pojawi się w mega menu używając `CategoryNavigation`
4. Jej podkategorie będą wyświetlane używając `CategoryHierarchy`

## Migracja Starych Komponentów

Jeśli znajdziesz stary komponent, który nie używa systemu szablonów:

1. Zidentyfikuj typ elementu (produkt, kategoria, itp.)
2. Znajdź odpowiedni szablon z listy powyżej
3. Zastąp stary komponent szablonem
4. Usuń stary kod

**Przykład**:
```tsx
// ❌ Stary sposób
<div className="product-card">
  <img src={product.image} />
  <h3>{product.name}</h3>
  <p>{product.price}</p>
</div>

// ✅ Nowy sposób
<ProductCardTemplate product={product} />
```

## Korzyści

✅ **Spójność** - Wszystko wygląda tak samo  
✅ **Łatwość utrzymania** - Jedna zmiana = wszędzie zaktualizowane  
✅ **Szybszy rozwój** - Nie piszesz tego samego kodu wielokrotnie  
✅ **Mniej błędów** - Jeden przetestowany komponent  
✅ **Lepsza UX** - Użytkownicy wiedzą czego się spodziewać  

## Pytania?

Jeśli masz pytania dotyczące systemu szablonów, sprawdź:
- `design-system.md` - Design system i zasady stylowania
- Kod istniejących szablonów - Przykłady implementacji
- TypeScript interfaces - Wymagane props i typy


---

## Szablony Formularzy

### InputField
**Lokalizacja**: `storefront/components/templates/FormTemplate.tsx`

**Zastosowanie**: Pola tekstowe w formularzach

```tsx
<InputField
  label="Email"
  type="email"
  placeholder="twoj@email.pl"
  required
  error={errors.email}
  helperText="Podaj swój adres email"
  leftIcon={<svg>...</svg>}
/>
```

**Props**:
- `label` - Etykieta pola
- `error` - Komunikat błędu
- `helperText` - Tekst pomocniczy
- `leftIcon` / `rightIcon` - Ikony po lewej/prawej stronie
- Wszystkie standardowe props `<input>`

---

### TextareaField
**Zastosowanie**: Wieloliniowe pola tekstowe

```tsx
<TextareaField
  label="Wiadomość"
  rows={5}
  placeholder="Wpisz swoją wiadomość..."
  required
  error={errors.message}
/>
```

---

### SelectField
**Zastosowanie**: Listy rozwijane

```tsx
<SelectField
  label="Kraj"
  options={[
    { value: 'pl', label: 'Polska' },
    { value: 'de', label: 'Niemcy' },
  ]}
  required
  error={errors.country}
/>
```

---

### CheckboxField
**Zastosowanie**: Pola wyboru

```tsx
<CheckboxField
  label="Akceptuję regulamin"
  required
  error={errors.terms}
/>
```

---

## Szablony Koszyka

### CartItemTemplate
**Lokalizacja**: `storefront/components/templates/CartItemTemplate.tsx`

**Zastosowanie**: Wyświetlanie produktów w koszyku

```tsx
<CartItemTemplate
  item={{
    id: '1',
    title: 'Pompa hydrauliczna',
    handle: 'pompa-hydrauliczna',
    thumbnail: '/images/product.jpg',
    quantity: 2,
    price: 299.99,
    currency: 'PLN',
  }}
  onUpdateQuantity={(id, qty) => updateCart(id, qty)}
  onRemove={(id) => removeFromCart(id)}
/>
```

**Cechy**:
- Miniaturka produktu
- Nazwa i wariant
- Kontrolki ilości (+/-)
- Przycisk usuwania
- Cena jednostkowa i całkowita

---

## Szablony Modali

### ModalTemplate
**Lokalizacja**: `storefront/components/templates/ModalTemplate.tsx`

**Zastosowanie**: Uniwersalny modal

```tsx
<ModalTemplate
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Tytuł modala"
  size="md"
  footer={
    <div className="flex gap-3">
      <Button variant="outline" onClick={onClose}>Anuluj</Button>
      <Button onClick={onSave}>Zapisz</Button>
    </div>
  }
>
  <p>Treść modala...</p>
</ModalTemplate>
```

**Props**:
- `isOpen` - Czy modal jest otwarty
- `onClose` - Funkcja zamykania
- `title` - Tytuł (opcjonalny)
- `size` - Rozmiar: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `footer` - Stopka z przyciskami
- `closeOnOverlayClick` - Zamknij po kliknięciu w tło
- `showCloseButton` - Pokaż przycisk X

**Cechy**:
- Zamykanie na ESC
- Blokada scrollowania body
- Animacje wejścia/wyjścia
- Responsywny
- Dostępny (ARIA)

---

### ConfirmModalTemplate
**Zastosowanie**: Modal potwierdzenia akcji

```tsx
<ConfirmModalTemplate
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={handleDelete}
  title="Usuń produkt"
  message="Czy na pewno chcesz usunąć ten produkt?"
  confirmLabel="Usuń"
  cancelLabel="Anuluj"
  variant="danger"
  isLoading={isDeleting}
/>
```

**Warianty**:
- `danger` - Czerwony (usuwanie)
- `warning` - Żółty (ostrzeżenie)
- `info` - Niebieski (informacja)

---

## Szablony Notyfikacji

### NotificationTemplate
**Lokalizacja**: `storefront/components/templates/NotificationTemplate.tsx`

**Zastosowanie**: Toast notifications

```tsx
const { success, error, warning, info } = useNotification()

// Użycie
success('Produkt dodany do koszyka!')
error('Wystąpił błąd podczas zapisywania')
warning('Produkt jest niedostępny')
info('Twoje zamówienie jest w drodze')
```

**Cechy**:
- 4 typy: success, error, warning, info
- Automatyczne zamykanie (configurable)
- Pozycjonowanie (top/bottom, left/right/center)
- Animacje
- Możliwość ręcznego zamknięcia

**Pozycje**:
- `top-right` (domyślna)
- `top-left`
- `bottom-right`
- `bottom-left`
- `top-center`
- `bottom-center`

---

## Szablony Info Cards

### InfoCardTemplate
**Lokalizacja**: `storefront/components/templates/InfoCardTemplate.tsx`

**Zastosowanie**: Karty informacyjne

```tsx
<InfoCardTemplate
  icon="📦"
  title="Darmowa dostawa"
  description="Dla zamówień powyżej 500 PLN"
  link={{
    href: '/dostawa',
    label: 'Dowiedz się więcej'
  }}
  variant="primary"
/>
```

**Warianty**:
- `default` - Biały
- `primary` - Niebieski
- `secondary` - Pomarańczowy
- `success` - Zielony
- `warning` - Żółty
- `danger` - Czerwony

---

### FeatureCardTemplate
**Zastosowanie**: Karty funkcji/cech

```tsx
<FeatureCardTemplate
  icon={<svg>...</svg>}
  title="Szybka dostawa"
  description="Realizacja zamówień w 24h"
/>
```

---

### StatCardTemplate
**Zastosowanie**: Karty statystyk

```tsx
<StatCardTemplate
  value="10,000+"
  label="Produktów w ofercie"
  icon={<svg>...</svg>}
  trend={{ value: 15, isPositive: true }}
/>
```

---

## Przykłady Użycia

### Strona Produktu

```tsx
import { ProductCardTemplate, Button, NotificationTemplate } from '@/components/templates'

export default function ProductsPage() {
  const { success } = useNotification()
  
  const handleAddToCart = (product) => {
    // Dodaj do koszyka
    success('Produkt dodany do koszyka!')
  }
  
  return (
    <div className="grid grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCardTemplate 
          key={product.id} 
          product={product}
        />
      ))}
    </div>
  )
}
```

---

### Formularz Kontaktowy

```tsx
import { InputField, TextareaField, Button } from '@/components/templates'

export default function ContactForm() {
  return (
    <form className="space-y-6">
      <InputField
        label="Imię i nazwisko"
        required
        leftIcon={<UserIcon />}
      />
      
      <InputField
        label="Email"
        type="email"
        required
        leftIcon={<EmailIcon />}
      />
      
      <TextareaField
        label="Wiadomość"
        rows={5}
        required
      />
      
      <Button type="submit" size="lg">
        Wyślij wiadomość
      </Button>
    </form>
  )
}
```

---

### Koszyk

```tsx
import { CartItemTemplate, Button, EmptyState } from '@/components/templates'

export default function CartPage() {
  if (cart.items.length === 0) {
    return (
      <EmptyState
        icon="🛒"
        title="Twój koszyk jest pusty"
        description="Dodaj produkty do koszyka, aby kontynuować"
        action={{
          label: 'Przeglądaj produkty',
          onClick: () => router.push('/products')
        }}
      />
    )
  }
  
  return (
    <div>
      {cart.items.map(item => (
        <CartItemTemplate
          key={item.id}
          item={item}
          onUpdateQuantity={updateQuantity}
          onRemove={removeItem}
        />
      ))}
      
      <div className="mt-6">
        <Button size="lg" className="w-full">
          Przejdź do kasy
        </Button>
      </div>
    </div>
  )
}
```

---

## Zasady Design System

Wszystkie szablony przestrzegają zasad z `design-system.md`:

### Kolory
- **Primary**: Niebieski (główne akcje)
- **Secondary**: Pomarańczowy/Żółty (akcenty, promocje)
- **Neutral**: Szary (tła, teksty)
- **Success**: Zielony (#27ae60)
- **Warning**: Żółty (#F2B90C)
- **Danger**: Czerwony (#A62B0F)

### Spacing
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px

### Typography
- Font weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- Font sizes: xs (12px) do 4xl (48px)

### Border Radius
- `sm`: 4px
- `md`: 8px
- `lg`: 12px
- `rounded-full`: Pełne zaokrąglenie

### Transitions
- Duration: 150ms, 250ms, 350ms
- Timing: `ease-standard` cubic-bezier(0.16, 1, 0.3, 1)

---

## Checklist Przed Wdrożeniem

Przed użyciem szablonu upewnij się, że:

- [ ] Importujesz z `@/components/templates`
- [ ] Przekazujesz wszystkie wymagane props
- [ ] Używasz TypeScript types
- [ ] Testujesz responsywność (mobile, tablet, desktop)
- [ ] Sprawdzasz dostępność (keyboard navigation, screen readers)
- [ ] Weryfikujesz zgodność z design system
- [ ] Dodajesz obsługę błędów
- [ ] Implementujesz loading states

---

## FAQ

### Czy mogę customizować szablony?

Tak! Wszystkie szablony akceptują prop `className` do dodania własnych styli:

```tsx
<ProductCardTemplate 
  product={product}
  className="shadow-2xl hover:scale-105"
/>
```

### Co jeśli potrzebuję innego wariantu?

Zamiast tworzyć nowy komponent, dodaj prop `variant` do istniejącego szablonu:

```tsx
// ❌ Nie twórz nowego komponentu
<ProductCardSpecial product={product} />

// ✅ Użyj wariantu
<ProductCardTemplate product={product} variant="featured" />
```

### Jak zgłosić błąd w szablonie?

1. Sprawdź dokumentację
2. Sprawdź TypeScript types
3. Zgłoś issue z przykładem użycia
4. Zaproponuj fix w PR

---

## Roadmap

Planowane szablony:

- [ ] TableTemplate - Tabele danych
- [ ] PaginationTemplate - Paginacja
- [ ] TabsTemplate - Zakładki
- [ ] AccordionTemplate - Rozwijane sekcje
- [ ] CarouselTemplate - Karuzele
- [ ] FilterTemplate - Zaawansowane filtry
- [ ] ChartTemplate - Wykresy i statystyki

---

## Kontakt

Pytania? Sugestie? Skontaktuj się z zespołem deweloperskim!

**Dokumentacja**: `storefront/components/COMPONENT_TEMPLATES.md`  
**Kod źródłowy**: `storefront/components/templates/`  
**Design System**: `.kiro/steering/design-system.md`
