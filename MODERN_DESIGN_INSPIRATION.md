# Nowoczesny Design - Inspirowany Dribbble ✨

## Źródło inspiracji

Bazując na nowoczesnych e-commerce designach z Dribbble:
- Kolorowe, pastelowe tła
- Zaokrąglone karty (rounded-3xl)
- Floating elements
- Sidebar navigation
- Bold typography
- Gradient backgrounds
- Playful colors

## Nowa strona: `/modern`

**URL**: `http://localhost:3000/pl/modern`

### Główne elementy:

## 1. ModernHero
**Plik**: `storefront/components/layout/ModernHero.tsx`

### Cechy:
- **Background**: Gradient `from-yellow-100 via-yellow-50 to-orange-50`
- **Layout**: 2 kolumny (content + image)
- **Badge**: Biały z zielonym pulsującym kropką "Nowa kolekcja 2024"
- **Tytuł**: 4xl-6xl, extrabold, z kolorowym akcentem (primary-600)
- **Przyciski**: 
  - Primary: `bg-blue-600` z shadow i hover:scale-105
  - Secondary: Biały z borderem
- **Stats**: 3 kolumny z dużymi liczbami
- **Image Card**: 
  - Biała karta z shadow-2xl
  - Floating badge w rogu
  - Decorative circles (blur effects)
  - Hover: scale-105

### Style:
```tsx
// Primary button
className="bg-blue-600 text-white rounded-2xl hover:scale-105 shadow-lg shadow-blue-600/30"

// Image card
className="bg-white rounded-3xl p-6 shadow-2xl transform hover:scale-105"

// Floating badge
className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl"
```

---

## 2. ModernProductCard
**Plik**: `storefront/components/product/ModernProductCard.tsx`

### Cechy:
- **Background**: Random pastel colors (blue-50, purple-50, pink-50, green-50, yellow-50, orange-50)
- **Border radius**: rounded-3xl (główna karta), rounded-2xl (obraz)
- **Hover**: scale-105 + shadow-2xl
- **Image**: scale-110 on hover
- **Badge**: Niebieski z pulsującą kropką "NOWOŚĆ"
- **Wishlist**: Floating button, opacity-0 → opacity-100 on hover
- **Price**: 2xl, extrabold
- **Add button**: Niebieski, rounded-xl, hover:scale-110 z shadow

### Style:
```tsx
// Card container
className="bg-blue-50 rounded-3xl p-5 hover:scale-105 hover:shadow-2xl"

// Image
className="rounded-2xl overflow-hidden bg-white group-hover:scale-110"

// Badge
className="bg-blue-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full"

// Add button
className="w-11 h-11 bg-blue-600 text-white rounded-xl hover:scale-110 shadow-lg shadow-blue-600/30"
```

---

## 3. ModernSidebar
**Plik**: `storefront/components/layout/ModernSidebar.tsx`

### Cechy:
- **Container**: Biały, rounded-3xl, sticky top-24
- **Brand**: "BuyMore" z statystykami (37 zamówień)
- **Navigation**: 
  - Active: `bg-blue-600 text-white`
  - Inactive: `text-neutral-700 hover:bg-neutral-50`
- **Icons**: Wszystkie z stroke-width 2-2.5
- **Quick Actions**: Małe przyciski z ikonami
- **Last Orders**: Avatary z gradientami, skrócone nazwy
- **Logout**: Hover zmienia na czerwony

### Sekcje:
1. Brand + Stats
2. Main Navigation (4 linki)
3. Quick Actions (2 przyciski)
4. Last Orders (lista z avatarami)
5. Logout button

### Style:
```tsx
// Active nav item
className="bg-blue-600 text-white rounded-xl font-semibold"

// Avatar
className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"

// Quick action
className="text-neutral-700 hover:bg-neutral-50 rounded-lg"
```

---

## 4. ModernPromoCards
**Plik**: `storefront/components/layout/ModernPromoCards.tsx`

### Cechy:
- **Grid**: 2 kolumny (responsive)
- **Card 1 (Green)**: 
  - Gradient `from-green-300 to-green-400`
  - "GET UP TO 50% OFF"
  - Biały przycisk
  - Decorative circles
  - Emoji 🎁
- **Card 2 (Yellow)**:
  - Gradient `from-yellow-200 to-yellow-300`
  - "Winter's weekend"
  - Emoji ☀️
- **Hover**: scale-105
- **Border radius**: rounded-3xl

### Style:
```tsx
// Green card
className="bg-gradient-to-br from-green-300 to-green-400 rounded-3xl p-8 hover:scale-105"

// Yellow card
className="bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-3xl p-8 hover:scale-105"

// Button
className="bg-white text-neutral-900 rounded-xl font-bold"
```

---

## 5. Modern Page
**Plik**: `storefront/app/[locale]/modern/page.tsx`

### Layout:
```
┌─────────────────────────────────────────┐
│ ModernHero (full width)                 │
└─────────────────────────────────────────┘
┌──────────┬──────────────────────────────┐
│ Sidebar  │ Main Content                 │
│ (300px)  │ - Header (Explore + filters) │
│          │ - ModernPromoCards (2 cols)  │
│          │ - Products Grid (3 cols)     │
│          │ - Favourites Section         │
│          │ - Bring Bold Fashion         │
└──────────┴──────────────────────────────┘
```

### Sekcje:

**Header:**
- Tytuł "Explore" (3xl, extrabold)
- Tabs: All, Men, Women
- Filters button + Search icon

**Products Grid:**
- 3 kolumny (responsive)
- ModernProductCard components
- Gap-6

**Favourites:**
- Biała karta, rounded-3xl
- 4 kolumny małych obrazków
- Navigation arrows
- "See All" button

**Bring Bold Fashion:**
- Gradient background (neutral-100 to neutral-200)
- 2 kolumny (text + image)
- Czarny przycisk CTA

---

## Paleta kolorów

### Backgrounds:
- **Page**: `bg-gradient-to-br from-green-50 via-white to-blue-50`
- **Hero**: `bg-gradient-to-br from-yellow-100 via-yellow-50 to-orange-50`
- **Cards**: Pastelowe (blue-50, purple-50, pink-50, green-50, yellow-50, orange-50)
- **Promo Green**: `from-green-300 to-green-400`
- **Promo Yellow**: `from-yellow-200 to-yellow-300`

### Akcenty:
- **Primary CTA**: `bg-blue-600` z `shadow-blue-600/30`
- **Text**: `text-neutral-900` (bold), `text-neutral-700` (medium), `text-neutral-600` (light)
- **Borders**: `border-neutral-100`, `border-neutral-200`

### Gradienty:
- **Avatar**: `from-blue-400 to-blue-600`, `from-purple-400 to-purple-600`
- **Decorative**: Blur effects z opacity 20-50%

---

## Typografia

### Font Weights:
- **Extrabold** (800): Tytuły, ceny, brand
- **Bold** (700): Przyciski, labels
- **Semibold** (600): Navigation active
- **Medium** (500): Navigation inactive, body

### Font Sizes:
- **Hero title**: 4xl-6xl (36-60px)
- **Section title**: 2xl-3xl (24-30px)
- **Card title**: 15px
- **Body**: 14px
- **Small**: 13px
- **Tiny**: 11-12px (badges, labels)

---

## Border Radius

### Hierarchy:
- **3xl** (24px): Main cards, containers, sidebar
- **2xl** (16px): Buttons, images, badges
- **xl** (12px): Small buttons, inputs
- **full**: Badges, avatars, dots

---

## Shadows

### Levels:
- **2xl**: Main cards (`shadow-2xl`)
- **lg**: Floating elements, buttons (`shadow-lg`)
- **Colored**: Blue buttons (`shadow-blue-600/30`)
- **None**: Flat elements

---

## Animations & Transitions

### Hover Effects:
- **Scale**: `hover:scale-105` (cards), `hover:scale-110` (buttons, images)
- **Colors**: `hover:bg-blue-700`, `hover:text-blue-700`
- **Opacity**: `opacity-0 group-hover:opacity-100`
- **Transform**: `transition-transform duration-300`

### Special:
- **Pulse**: Zielona kropka w badge (`animate-pulse`)
- **Image zoom**: `group-hover:scale-110` (duration-500)

---

## Decorative Elements

### Floating Circles:
```tsx
<div className="absolute -top-4 -left-4 w-20 h-20 bg-yellow-300 rounded-2xl opacity-50 blur-xl"></div>
<div className="absolute -bottom-4 -right-4 w-32 h-32 bg-orange-300 rounded-full opacity-30 blur-2xl"></div>
```

### Gradient Overlays:
```tsx
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-20 blur-3xl"></div>
```

---

## Responsive

### Breakpoints:
- **Mobile** (< 768px): Stack wszystko, sidebar ukryty
- **Tablet** (768px - 1024px): 2 kolumny produktów
- **Desktop** (> 1024px): Sidebar + 3 kolumny produktów

### Grid Adjustments:
```tsx
// Products
className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"

// Promo cards
className="grid-cols-1 md:grid-cols-2"

// Favourites
className="grid-cols-2 md:grid-cols-4"
```

---

## Accessibility

### Wszystkie elementy:
- ✅ ARIA labels na buttonach
- ✅ Semantic HTML
- ✅ Focus states
- ✅ Keyboard navigation
- ✅ Alt text na obrazach
- ✅ Proper heading hierarchy

---

## Porównanie: Figma vs Modern

### Figma Design:
- Minimalistyczny
- Neutral colors (czarno-biały)
- Proste borders
- Małe shadows
- Professional, clean

### Modern Design:
- Playful, energetic
- Kolorowy (pastele + gradienty)
- Zaokrąglone (3xl)
- Duże shadows
- Fun, engaging

---

## Użycie

### Dostęp do strony:
```
http://localhost:3000/pl/modern
```

### Komponenty do reużycia:
```tsx
import { ModernHero } from '@/components/layout/ModernHero'
import { ModernSidebar } from '@/components/layout/ModernSidebar'
import { ModernPromoCards } from '@/components/layout/ModernPromoCards'
import { ModernProductCard } from '@/components/product/ModernProductCard'
```

### Przykład użycia:
```tsx
<div className="bg-gradient-to-br from-green-50 via-white to-blue-50">
  <ModernHero />
  <div className="grid lg:grid-cols-[300px_1fr] gap-8">
    <ModernSidebar />
    <div>
      <ModernPromoCards />
      <div className="grid grid-cols-3 gap-6">
        {products.map(p => <ModernProductCard product={p} />)}
      </div>
    </div>
  </div>
</div>
```

---

## Podsumowanie

Stworzono kompletny, nowoczesny design inspirowany Dribbble:

✅ **ModernHero** - Kolorowy hero z floating elements
✅ **ModernProductCard** - Pastelowe karty z hover effects
✅ **ModernSidebar** - Sidebar z navigation i stats
✅ **ModernPromoCards** - Gradient promo cards
✅ **Modern Page** - Kompletna strona z layoutem

**Cechy charakterystyczne:**
- Kolorowe gradienty i pastele
- Zaokrąglone elementy (rounded-3xl)
- Playful typography (extrabold)
- Hover animations (scale, shadow)
- Floating badges i decorative elements
- Bold, energetic vibe

Wszystko gotowe do użycia! 🎨✨

