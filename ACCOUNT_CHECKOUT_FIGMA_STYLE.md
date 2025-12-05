# Konto i Checkout - Ostylowane zgodnie z Figma ✅

## Zaimplementowane strony

### 1. Moje Konto (`/konto`)
**Plik**: `storefront/app/[locale]/konto/page.tsx`

#### Layout:
- **Desktop**: Sidebar (280px) + Main content
- **Mobile**: Stack layout
- **Sidebar**: Sticky (top-24)

#### Elementy:

**Sidebar Navigation:**
- User info (imię, nazwisko, email)
- 4 zakładki: Profil 👤, Zamówienia 📦, Adresy 📍, Ulubione ❤️
- Active state: `bg-neutral-900 text-white`
- Inactive state: `text-neutral-700 hover:bg-neutral-50`
- Przycisk wylogowania (czerwony)

**Zakładka Profil:**
- Grid 2 kolumny (responsive)
- 6 pól: Imię, Nazwisko, Email, Telefon, Firma, NIP
- Read-only inputs z `bg-neutral-50`
- 2 przyciski: "Edytuj profil" (primary), "Zmień hasło" (secondary)

**Zakładka Zamówienia:**
- Lista zamówień jako karty
- Każda karta: Numer, Data, Status (badge), Wartość
- Status badges: zielony (Dostarczone), niebieski (W transporcie)
- Hover effect: `hover:border-neutral-900`
- Link do szczegółów zamówienia

**Zakładka Adresy:**
- Grid 2 kolumny
- Każdy adres jako karta z border-2
- Główny adres: `border-neutral-900 bg-neutral-50`
- Badge typu adresu
- Przyciski: Edytuj, Usuń
- Przycisk "+ Dodaj adres"

**Zakładka Ulubione:**
- Empty state z ikoną ❤️
- Komunikat i przycisk do produktów

#### Style Figma:
```tsx
// Sidebar button active
className="bg-neutral-900 text-white"

// Sidebar button inactive
className="text-neutral-700 hover:bg-neutral-50"

// Order card
className="p-5 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-neutral-900"

// Address card (primary)
className="border-2 border-neutral-900 bg-neutral-50"

// Status badge (delivered)
className="bg-green-100 text-green-700"

// Status badge (in transit)
className="bg-blue-100 text-blue-700"
```

---

### 2. Checkout (`/checkout`)
**Plik**: `storefront/app/[locale]/checkout/page.tsx`

#### Layout:
- **Desktop**: Main content (2 kolumny) + Sidebar (1 kolumna)
- **Mobile**: Stack layout
- **Sidebar**: Sticky (top-24)

#### Progress Steps:
- 4 kroki: Adres dostawy, Dostawa, Płatność, Podsumowanie
- Progress bar z animacją
- Completed steps: checkmark icon
- Active step: `bg-neutral-900 text-white`
- Inactive step: `bg-white border-2 border-neutral-200`

#### Kroki:

**Krok 1 - Adres dostawy:**
- Grid 2 kolumny (responsive)
- 7 pól: Imię, Nazwisko, Email, Telefon, Adres (full width), Miasto, Kod pocztowy
- Wszystkie pola required
- Focus state: `focus:border-neutral-900`

**Krok 2 - Metoda dostawy:**
- 3 opcje: InPost, DPD, DHL
- Radio buttons jako karty
- Selected: `border-2 border-neutral-900 bg-neutral-50`
- Każda karta: Nazwa, Czas dostawy, Cena
- Hover: `hover:border-neutral-300`

**Krok 3 - Płatność:**
- Placeholder z ikoną 💳
- Komunikat o integracji Stripe
- Lista akceptowanych metod płatności
- Background: `bg-neutral-50`

**Krok 4 - Podsumowanie:**
- Lista produktów (karty)
- Grid 2 kolumny: Adres dostawy, Metoda dostawy
- Wszystkie dane do weryfikacji

#### Sidebar - Podsumowanie zamówienia:
- Sticky position
- Produkty (subtotal)
- Dostawa (conditional)
- Podatek
- **Razem** (bold, duży font)
- Border separator przed total

#### Navigation:
- Przycisk "Wstecz" (secondary) - tylko od kroku 2
- Przycisk "Dalej" (primary) - kroki 1-3
- Przycisk "Złóż zamówienie" (green) - krok 4

#### Style Figma:
```tsx
// Progress step (active)
className="w-10 h-10 rounded-full bg-neutral-900 text-white"

// Progress step (completed)
// Shows checkmark icon

// Progress step (inactive)
className="w-10 h-10 rounded-full bg-white border-2 border-neutral-200 text-neutral-400"

// Progress bar
className="h-0.5 bg-neutral-200"
// Active portion: bg-neutral-900

// Shipping method card (selected)
className="border-2 border-neutral-900 bg-neutral-50"

// Shipping method card (unselected)
className="border-2 border-neutral-200 hover:border-neutral-300"

// Place order button
className="bg-green-600 hover:bg-green-700"
```

---

## Wspólne elementy

### Kolory:
- **Background**: `bg-neutral-50` (strony)
- **Cards**: `bg-white` z `border-neutral-200`
- **Active/Selected**: `bg-neutral-900` lub `border-neutral-900`
- **Hover**: `hover:bg-neutral-50`, `hover:border-neutral-900`
- **Status badges**: 
  - Success: `bg-green-100 text-green-700`
  - Info: `bg-blue-100 text-blue-700`
  - Primary: `bg-neutral-900 text-white`

### Typografia:
- **Page title**: `text-2xl md:text-3xl font-bold`
- **Section title**: `text-[18px] font-bold`
- **Subsection**: `text-[16px] font-bold`
- **Labels**: `text-[13px] font-semibold`
- **Body**: `text-[14px]`
- **Small**: `text-[12px]`
- **Tiny**: `text-[11px]` (badges)

### Spacing:
- **Container**: `px-4 md:px-[60px]`
- **Section padding**: `py-8 md:py-12`
- **Card padding**: `p-6 md:p-8`
- **Small card**: `p-5`
- **Grid gap**: `gap-4`, `gap-6`, `gap-8`

### Border Radius:
- **Cards**: `rounded-xl`
- **Inputs/Buttons**: `rounded-lg`
- **Badges**: `rounded-full`

### Responsive:
- **Sidebar**: `lg:grid-cols-[280px_1fr]`
- **Checkout**: `lg:grid-cols-3` (2+1)
- **Forms**: `md:grid-cols-2`
- **Mobile**: Stack wszystko

---

## Progress Steps Pattern

### HTML Structure:
```tsx
<div className="flex items-center justify-between relative">
  {/* Progress Line */}
  <div className="absolute top-5 left-0 right-0 h-0.5 bg-neutral-200 -z-10">
    <div 
      className="h-full bg-neutral-900 transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>

  {/* Steps */}
  {steps.map((step) => (
    <div key={step.number} className="flex flex-col items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        currentStep >= step.number
          ? 'bg-neutral-900 text-white'
          : 'bg-white border-2 border-neutral-200 text-neutral-400'
      }`}>
        {currentStep > step.number ? <CheckIcon /> : step.number}
      </div>
      <div className="mt-2 text-[12px]">{step.title}</div>
    </div>
  ))}
</div>
```

---

## Sidebar Navigation Pattern

### Active/Inactive States:
```tsx
<button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium transition-colors ${
  activeTab === item.id
    ? 'bg-neutral-900 text-white'
    : 'text-neutral-700 hover:bg-neutral-50'
}`}>
  <span className="text-lg">{item.icon}</span>
  {item.label}
</button>
```

---

## Order Card Pattern

### Hover Effect:
```tsx
<Link className="block p-5 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-neutral-900 transition-all group">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {/* Content */}
  </div>
  <svg className="text-neutral-400 group-hover:text-neutral-900 transition-colors">
    {/* Arrow icon */}
  </svg>
</Link>
```

---

## Address Card Pattern

### Primary vs Secondary:
```tsx
<div className={`p-5 rounded-lg border-2 ${
  address.type === 'Główny'
    ? 'border-neutral-900 bg-neutral-50'
    : 'border-neutral-200 bg-white'
}`}>
  <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${
    address.type === 'Główny'
      ? 'bg-neutral-900 text-white'
      : 'bg-neutral-200 text-neutral-700'
  }`}>
    {address.type}
  </span>
  {/* Address content */}
</div>
```

---

## Shipping Method Pattern

### Radio Card:
```tsx
<label className={`flex items-center p-5 border-2 rounded-lg cursor-pointer transition-all ${
  selected
    ? 'border-neutral-900 bg-neutral-50'
    : 'border-neutral-200 hover:border-neutral-300'
}`}>
  <input type="radio" className="w-4 h-4 text-neutral-900" />
  <div className="ml-4 flex-1">
    <div className="font-semibold text-[14px]">{method.name}</div>
    <div className="text-[13px] text-neutral-600">{method.description}</div>
  </div>
  <div className="text-[16px] font-bold">{method.price}</div>
</label>
```

---

## Empty State Pattern

### Centered with Icon:
```tsx
<div className="text-center py-16">
  <div className="text-6xl mb-4">❤️</div>
  <p className="text-[14px] text-neutral-600 mb-6">
    Nie masz jeszcze ulubionych produktów
  </p>
  <Link className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-lg text-[14px] font-semibold hover:bg-neutral-800 transition-colors">
    Przeglądaj produkty
    <ArrowIcon />
  </Link>
</div>
```

---

## Accessibility

### Wszystkie strony zawierają:
- ✅ Semantic HTML (nav, form, label, button)
- ✅ Proper label associations
- ✅ Focus states (focus:border-neutral-900)
- ✅ Keyboard navigation
- ✅ ARIA labels gdzie potrzebne
- ✅ Proper heading hierarchy
- ✅ Radio buttons z labels
- ✅ Required field indicators

---

## Podsumowanie zmian

### Konto:
- ✅ Sidebar navigation z 4 zakładkami
- ✅ Responsive grid layouts
- ✅ Status badges dla zamówień
- ✅ Primary/secondary address styling
- ✅ Empty states
- ✅ Sticky sidebar (desktop)

### Checkout:
- ✅ 4-step progress indicator z animacją
- ✅ Multi-step form z walidacją
- ✅ Radio cards dla metod dostawy
- ✅ Sticky order summary
- ✅ Conditional navigation buttons
- ✅ Green "Place order" button

### Style:
- ✅ Neutral color palette
- ✅ Consistent spacing (4, 6, 8)
- ✅ Font sizes: 11-18px
- ✅ Border radius: lg, xl, full
- ✅ Hover states na wszystkich interaktywnych elementach
- ✅ Smooth transitions

Wszystkie strony gotowe i bez błędów TypeScript! 🎉

