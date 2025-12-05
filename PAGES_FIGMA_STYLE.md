# Strony ostylowane zgodnie z Figma ✅

## Zaimplementowane strony

### 1. Logowanie (`/logowanie`)
**Plik**: `storefront/app/[locale]/logowanie/page.tsx`

**Elementy:**
- Header z ikoną 🔐 i opisem
- Formularz logowania (email, hasło)
- Checkbox "Zapamiętaj mnie"
- Link "Zapomniałeś hasła?"
- Przycisk logowania
- Social login (Google, Microsoft) z prawdziwymi ikonami SVG
- Link do rejestracji
- Sekcja "Kontynuuj jako gość"

**Style Figma:**
- Background: `bg-neutral-50`
- Card: `bg-white rounded-xl border border-neutral-200`
- Inputs: `border-neutral-300 focus:border-neutral-900`
- Button: `bg-neutral-900 hover:bg-neutral-800`
- Font sizes: 13px, 14px (labels, inputs)
- Padding: `p-6 md:p-8`
- Icons: SVG eye icons dla show/hide password

**Responsive:**
- Mobile: Single column, full width
- Desktop: Max-width 28rem (448px), centered

---

### 2. Rejestracja (`/rejestracja`)
**Plik**: `storefront/app/[locale]/rejestracja/page.tsx`

**Elementy:**
- Header z ikoną 📝 i opisem
- Wybór typu konta (Osobiste 👤 / Firmowe 🏢)
- Formularz rejestracji:
  - Imię, Nazwisko
  - Email, Telefon
  - Nazwa firmy, NIP (dla B2B)
  - Hasło, Potwierdź hasło
- Checkboxy (Regulamin, RODO)
- Przycisk rejestracji
- Link do logowania

**Style Figma:**
- Background: `bg-neutral-50`
- Card: `bg-white rounded-xl border border-neutral-200`
- Account type selector: `border-2` (active: `border-neutral-900 bg-neutral-50`)
- Inputs: `border-neutral-300 focus:border-neutral-900`
- Button: `bg-neutral-900 hover:bg-neutral-800`
- Font sizes: 12px (hints), 13px (labels), 14px (inputs)
- Grid: `grid-cols-1 md:grid-cols-2` dla pól formularza

**Responsive:**
- Mobile: Single column
- Desktop: Max-width 48rem (768px), 2 kolumny dla pól

---

### 3. Koszyk (`/cart`)
**Plik**: `storefront/app/[locale]/cart/page.tsx`

**Elementy:**
- Header z breadcrumbs
- Lista produktów w koszyku:
  - Miniatura produktu
  - Nazwa, opis, SKU
  - Quantity controls (+/-)
  - Przycisk "Usuń"
  - Cena jednostkowa i całkowita
- Przycisk "Kontynuuj zakupy"
- Order Summary (sticky sidebar):
  - Subtotal
  - Rabat (jeśli jest)
  - Dostawa
  - Podatek
  - Total
  - Przycisk "Przejdź do kasy"
  - Trust badges (3 ikony z checkmarkami)

**Empty State:**
- Ikona 🛒
- Komunikat "Koszyk jest pusty"
- Przycisk "Przeglądaj produkty"

**Style Figma:**
- Background: `bg-neutral-50`
- Cards: `bg-white rounded-xl border border-neutral-200`
- Quantity controls: `border border-neutral-300 rounded-lg`
- Remove button: `bg-red-50 text-red-600 hover:bg-red-100`
- Checkout button: `bg-neutral-900 hover:bg-neutral-800`
- Trust badges: `bg-neutral-50 rounded-lg` z zielonymi checkmarkami
- Font sizes: 12px (SKU, hints), 13px (labels), 14px-16px (product names)
- Divider: `divide-y divide-neutral-200`

**Layout:**
- Desktop: `grid-cols-3` (2 kolumny items + 1 kolumna summary)
- Mobile: Stack (items na górze, summary na dole)
- Summary: `sticky top-24` (desktop)

**Responsive:**
- Mobile: 
  - Image: 24x24 (96px)
  - Single column layout
  - Full width buttons
- Desktop:
  - Image: 32x32 (128px)
  - 3 column grid
  - Sticky sidebar

---

## Wspólne elementy designu

### Kolory:
- **Background**: `bg-neutral-50` (strony)
- **Cards**: `bg-white` z `border-neutral-200`
- **Text**: `text-neutral-900` (headings), `text-neutral-600` (body), `text-neutral-500` (hints)
- **Borders**: `border-neutral-200`, `border-neutral-300` (inputs)
- **Buttons Primary**: `bg-neutral-900 hover:bg-neutral-800`
- **Buttons Secondary**: `bg-white border-neutral-300 hover:bg-neutral-50`
- **Focus**: `focus:border-neutral-900`

### Typografia:
- **Headings H1**: `text-2xl md:text-3xl font-bold`
- **Headings H2**: `text-[16px] font-bold`
- **Labels**: `text-[13px] font-semibold`
- **Body**: `text-[14px]`
- **Small**: `text-[12px]`
- **Hints**: `text-[12px] text-neutral-500`

### Spacing:
- **Container**: `px-4 md:px-[60px]`
- **Section padding**: `py-8 md:py-12` lub `py-12 md:py-20`
- **Card padding**: `p-6 md:p-8`
- **Form spacing**: `space-y-5`
- **Grid gap**: `gap-4` lub `gap-6`

### Border Radius:
- **Cards**: `rounded-xl`
- **Inputs/Buttons**: `rounded-lg`
- **Small elements**: `rounded-lg`

### Shadows:
- **Cards**: `shadow-sm` lub brak (tylko border)
- **Sticky elements**: brak (tylko border)

### Transitions:
- **All interactive**: `transition-colors`
- **Duration**: Default (150ms)

### Icons:
- **Size**: `w-4 h-4` (small), `w-5 h-5` (medium)
- **Stroke width**: `strokeWidth={2}`
- **Style**: Heroicons outline style

---

## Formularze

### Input Style:
```tsx
className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-[14px] focus:outline-none focus:border-neutral-900 transition-colors"
```

### Button Primary:
```tsx
className="px-6 py-3 bg-neutral-900 text-white rounded-lg text-[14px] font-semibold hover:bg-neutral-800 transition-colors"
```

### Button Secondary:
```tsx
className="px-6 py-3 bg-white text-neutral-900 border border-neutral-300 rounded-lg text-[14px] font-semibold hover:bg-neutral-50 transition-colors"
```

### Label:
```tsx
className="block text-[13px] font-semibold mb-2 text-neutral-900"
```

### Checkbox:
```tsx
className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
```

---

## Empty States

### Pattern:
```tsx
<div className="text-center">
  <div className="text-7xl mb-6">🛒</div>
  <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">
    Tytuł
  </h1>
  <p className="text-[14px] text-neutral-600 mb-8">
    Opis
  </p>
  <Link className="inline-flex items-center gap-2 px-8 py-3 bg-neutral-900 text-white rounded-lg text-[14px] font-semibold hover:bg-neutral-800 transition-colors">
    Akcja
  </Link>
</div>
```

---

## Loading States

### Pattern:
```tsx
<div className="min-h-screen flex items-center justify-center">
  <div className="text-center">
    <div className="text-5xl mb-4">⏳</div>
    <p className="text-neutral-600">Ładowanie...</p>
  </div>
</div>
```

---

## Trust Badges

### Pattern (używany w koszyku):
```tsx
<div className="p-4 bg-neutral-50 rounded-lg space-y-2">
  <div className="flex items-center gap-2 text-[12px] text-neutral-700">
    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
    Bezpieczne płatności
  </div>
  {/* więcej badges */}
</div>
```

---

## Social Login Icons

### Google:
```tsx
<svg className="w-5 h-5" viewBox="0 0 24 24">
  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
</svg>
```

### Microsoft:
```tsx
<svg className="w-5 h-5" viewBox="0 0 24 24">
  <path fill="#00A4EF" d="M0 0h11.377v11.372H0z"/>
  <path fill="#FFB900" d="M12.623 0H24v11.372H12.623z"/>
  <path fill="#05A6F0" d="M0 12.628h11.377V24H0z"/>
  <path fill="#FFBB00" d="M12.623 12.628H24V24H12.623z"/>
</svg>
```

---

## Accessibility

### Wszystkie strony zawierają:
- ✅ Semantic HTML (form, label, button)
- ✅ Proper label associations
- ✅ Focus states (focus:border-neutral-900)
- ✅ Disabled states (disabled:opacity-50, disabled:cursor-not-allowed)
- ✅ Keyboard navigation
- ✅ ARIA labels gdzie potrzebne
- ✅ Proper heading hierarchy (h1, h2)

---

## Podsumowanie zmian

### Przed (inline styles):
```tsx
style={{ 
  backgroundColor: '#3b82f6',
  padding: '1rem 2rem',
  borderRadius: '0.5rem'
}}
```

### Po (Tailwind + Figma):
```tsx
className="px-8 py-4 bg-neutral-900 text-white rounded-lg text-[14px] font-semibold hover:bg-neutral-800 transition-colors"
```

### Korzyści:
- ✅ Spójny design system
- ✅ Łatwiejsze utrzymanie
- ✅ Mniejszy bundle size
- ✅ Lepsze performance
- ✅ Responsive out of the box
- ✅ Zgodność z Figma design
- ✅ Dark mode ready (jeśli potrzebne)

Wszystkie strony gotowe do użycia! 🎉

