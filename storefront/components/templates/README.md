# 🎨 System Szablonów - Quick Start

Kompletny system szablonów dla frontendu e-commerce.

## 🚀 Szybki Start

```tsx
import {
  ProductCardTemplate,
  Button,
  InputField,
  ModalTemplate,
  useNotification
} from '@/components/templates'

function MyComponent() {
  const { success } = useNotification()
  
  return (
    <>
      <ProductCardTemplate product={product} />
      <Button onClick={() => success('Gotowe!')}>Kliknij</Button>
    </>
  )
}
```

## 📦 Dostępne Szablony

### Produkty
- `ProductCardTemplate` - Karta produktu
- `ProductGrid` - Siatka produktów
- `ProductSkeleton` - Loading state

### Kategorie
- `MainCategoryCard` - Karta kategorii głównej
- `CategoryHierarchy` - Drzewo kategorii

### Formularze
- `InputField` - Pole tekstowe
- `TextareaField` - Pole wieloliniowe
- `SelectField` - Lista rozwijana
- `CheckboxField` - Pole wyboru

### UI
- `Button` - Przycisk
- `EmptyState` - Pusty stan
- `ErrorMessage` - Komunikat błędu
- `LoadingSkeleton` - Loading skeleton

### Modals
- `ModalTemplate` - Uniwersalny modal
- `ConfirmModalTemplate` - Modal potwierdzenia

### Notyfikacje
- `NotificationTemplate` - Toast notification
- `useNotification` - Hook do notyfikacji

### Koszyk
- `CartItemTemplate` - Element koszyka

### Info Cards
- `InfoCardTemplate` - Karta informacyjna
- `FeatureCardTemplate` - Karta funkcji
- `StatCardTemplate` - Karta statystyk

### Wyszukiwanie
- `UnifiedSearchHub` - Hub wyszukiwania
- `EnhancedSearchBar` - Pasek wyszukiwania

## 📚 Pełna Dokumentacja

Zobacz `COMPONENT_TEMPLATES.md` dla:
- Szczegółowych przykładów użycia
- Props i API
- Best practices
- Design system guidelines
- FAQ

## 🎯 Filozofia

**Jeden szablon = Jeden typ elementu**

Zamiast tworzyć wiele wariantów tego samego komponentu, używamy jednego szablonu z props:

```tsx
// ❌ Źle
<ProductCardSmall />
<ProductCardLarge />
<ProductCardFeatured />

// ✅ Dobrze
<ProductCardTemplate size="sm" />
<ProductCardTemplate size="lg" />
<ProductCardTemplate variant="featured" />
```

## 🔥 Przykłady

### Strona z produktami

```tsx
import { ProductCardTemplate } from '@/components/templates'

export default function ProductsPage({ products }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCardTemplate key={product.id} product={product} />
      ))}
    </div>
  )
}
```

### Formularz z walidacją

```tsx
import { InputField, Button } from '@/components/templates'

export default function LoginForm() {
  const [errors, setErrors] = useState({})
  
  return (
    <form className="space-y-6">
      <InputField
        label="Email"
        type="email"
        error={errors.email}
        required
      />
      
      <InputField
        label="Hasło"
        type="password"
        error={errors.password}
        required
      />
      
      <Button type="submit" size="lg" className="w-full">
        Zaloguj się
      </Button>
    </form>
  )
}
```

### Notyfikacje

```tsx
import { useNotification } from '@/components/templates'

export default function MyComponent() {
  const { success, error } = useNotification()
  
  const handleSave = async () => {
    try {
      await saveData()
      success('Zapisano pomyślnie!')
    } catch (err) {
      error('Wystąpił błąd podczas zapisywania')
    }
  }
  
  return <Button onClick={handleSave}>Zapisz</Button>
}
```

### Modal potwierdzenia

```tsx
import { ConfirmModalTemplate } from '@/components/templates'

export default function DeleteButton({ onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false)
  
  return (
    <>
      <Button onClick={() => setShowConfirm(true)}>Usuń</Button>
      
      <ConfirmModalTemplate
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={onDelete}
        title="Usuń produkt"
        message="Czy na pewno chcesz usunąć ten produkt?"
        variant="danger"
      />
    </>
  )
}
```

## ✅ Korzyści

- ✅ **Spójność** - Wszystko wygląda tak samo
- ✅ **Szybkość** - Nie piszesz tego samego kodu wielokrotnie
- ✅ **Łatwość** - Jedna zmiana = wszędzie zaktualizowane
- ✅ **Jakość** - Przetestowane i zoptymalizowane
- ✅ **TypeScript** - Pełne wsparcie typów

## 🛠️ Development

### Dodawanie nowego szablonu

1. Utwórz plik w `storefront/components/templates/`
2. Zdefiniuj TypeScript interface
3. Implementuj komponent zgodnie z design system
4. Dodaj export do `index.ts`
5. Dodaj dokumentację do `COMPONENT_TEMPLATES.md`
6. Dodaj przykład użycia

### Testowanie

```bash
# Sprawdź TypeScript
npm run type-check

# Sprawdź linting
npm run lint

# Uruchom testy
npm run test
```

## 📖 Więcej Informacji

- [Pełna Dokumentacja](./COMPONENT_TEMPLATES.md)
- [Design System](../../.kiro/steering/design-system.md)
- [TypeScript Types](./types.ts)

## 🤝 Contributing

Masz pomysł na nowy szablon? Znalazłeś błąd? Otwórz issue lub PR!

---

**Made with ❤️ for OMEX E-commerce**
