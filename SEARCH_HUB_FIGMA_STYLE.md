# UnifiedSearchHub - Ostylowany zgodnie z Figma ✅

## Zmiany w stylu

### Główny kontener
**Przed:**
```tsx
<div className="w-full">
  <div className="flex gap-2 mb-6">
    {/* tabs */}
  </div>
  <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
    {/* content */}
  </div>
</div>
```

**Po:**
```tsx
<div className="w-full bg-white rounded-2xl shadow-md border border-neutral-200 p-6 md:p-8">
  <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
    {/* tabs */}
  </div>
  <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
    {/* content */}
  </div>
</div>
```

### Zakładki metod wyszukiwania

**Przed:**
- Kolorowe przyciski (bg-blue-500, bg-green-500, etc.)
- Border-2 dla nieaktywnych
- Różne kolory dla każdej metody

**Po:**
- Neutralne kolory (bg-neutral-900 dla aktywnych, bg-neutral-50 dla nieaktywnych)
- Ikony emoji dla każdej metody (🔍, 🚜, 🔢, 📷, ⚙️)
- Jednolity design zgodny z Figma
- Hover: bg-neutral-100

```tsx
className={`flex items-center gap-2 px-5 py-3 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-all ${
  activeMethod === method.id
    ? 'bg-neutral-900 text-white shadow-sm'
    : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
}`}
```

### Typografia

**Wszystkie nagłówki:**
- `text-lg font-bold` → `text-[16px] font-semibold`
- `text-gray-800` → `text-neutral-900`

**Wszystkie opisy:**
- `text-sm text-gray-600` → `text-[13px] text-neutral-600 leading-relaxed`

**Przyciski popularne:**
- `text-xs` → `text-[12px] font-medium`
- `bg-gray-100` → `bg-white border border-neutral-200`
- Hover: `hover:bg-neutral-900 hover:text-white`

### Quick Stats

**Przed:**
```tsx
<div className="p-4 bg-white rounded-lg border">
  <div className="text-2xl font-bold text-primary-500">50,000+</div>
  <div className="text-xs text-gray-600">Części w magazynie</div>
</div>
```

**Po:**
```tsx
<div className="p-5 bg-neutral-50 rounded-lg border border-neutral-200">
  <div className="text-2xl md:text-3xl font-bold text-neutral-900">50,000+</div>
  <div className="text-[12px] text-neutral-600 mt-1">Części w magazynie</div>
</div>
```

Zmiany:
- Wszystkie liczby w neutral-900 (zamiast kolorowych)
- Grid: `grid-cols-4` → `grid-cols-2 md:grid-cols-4`
- Padding: p-4 → p-5
- Background: bg-white → bg-neutral-50
- Margin top: mt-6 → mt-8

### Help Section

**Przed:**
```tsx
<div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-500">
  <button className="px-4 py-2 bg-blue-500 text-white">
    Czat na żywo
  </button>
</div>
```

**Po:**
```tsx
<div className="mt-8 p-6 bg-neutral-50 rounded-xl border border-neutral-200">
  <button className="px-5 py-2.5 bg-neutral-900 text-white rounded-lg text-[13px] font-semibold">
    Czat na żywo
  </button>
</div>
```

Zmiany:
- Usunięty gradient → bg-neutral-50
- Border-l-4 → border (all sides)
- Przyciski: bg-blue-500 → bg-neutral-900
- Font size: text-sm → text-[13px]
- Padding: px-4 py-2 → px-5 py-2.5

### Visual Search Tips

**Przed:**
```tsx
<div className="p-3 bg-gray-50 rounded-lg border-l-2 border-green-500">
  <div className="font-semibold mb-1 text-green-700">Zdjęcie części</div>
  <div>Sfotografuj część z bliska</div>
</div>
```

**Po:**
```tsx
<div className="p-4 bg-white rounded-lg border border-neutral-200">
  <div className="font-semibold mb-1 text-neutral-900">Zdjęcie części</div>
  <div className="text-neutral-600">Sfotografuj część z bliska</div>
</div>
```

Zmiany:
- Usunięte kolorowe bordery (border-l-2 border-green-500)
- Wszystkie kolory → neutral
- Grid: `grid-cols-3` → `grid-cols-1 md:grid-cols-3`
- Background: bg-gray-50 → bg-white

### Part Number Hint

**Przed:**
```tsx
<div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
  <div className="text-sm text-blue-800">
    <strong>Wskazówka:</strong> ...
  </div>
</div>
```

**Po:**
```tsx
<div className="mt-4 p-4 bg-primary-50 rounded-lg border-l-2 border-primary-600">
  <div className="text-[13px] text-neutral-800 leading-relaxed">
    <strong className="font-semibold">Wskazówka:</strong> ...
  </div>
</div>
```

Zmiany:
- Border: border-l-4 → border-l-2
- Text: text-sm → text-[13px]
- Color: text-blue-800 → text-neutral-800
- Strong: `<strong>` → `<strong className="font-semibold">`

## Integracja na stronie głównej

**Przed:**
```tsx
<section className="container mx-auto px-4 -mt-8">
  <UnifiedSearchHub onSearch={handleSearch} locale="pl" />
</section>
```

**Po:**
```tsx
<section className="container mx-auto px-4 md:px-[60px] py-12 md:py-16">
  <div className="max-w-5xl mx-auto">
    <div className="text-center mb-8">
      <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">
        Znajdź części do swojej maszyny
      </h2>
      <p className="text-[14px] text-neutral-600 max-w-2xl mx-auto">
        Użyj jednej z 5 metod wyszukiwania, aby szybko znaleźć potrzebne części zamienne
      </p>
    </div>
    <UnifiedSearchHub onSearch={handleSearch} locale="pl" />
  </div>
</section>
```

Zmiany:
- Dodany padding: py-12 md:py-16
- Dodany max-width: max-w-5xl mx-auto
- Dodany nagłówek sekcji
- Usunięty negatywny margin (-mt-8)
- Padding: px-4 → px-4 md:px-[60px]

## Inne sekcje na stronie

### Categories Section
- Background: dodany bg-neutral-50
- Padding: py-16 → py-12 md:py-16
- Heading: text-3xl md:text-4xl → text-2xl md:text-3xl
- Description: text-lg → text-[14px]
- Margin bottom: mb-12 → mb-10

### Products Section
- Background: bg-neutral-50 → usunięty (white)
- Padding: py-16 → py-12 md:py-16
- Heading: text-3xl → text-2xl md:text-3xl
- Description: text-neutral-600 → text-[14px] text-neutral-600
- Button: bg-primary-500 → bg-neutral-900
- Button text: font-semibold → text-[13px] font-semibold
- Icon: w-5 h-5 → w-4 h-4

## Nowe utility classes

Dodano do `globals.css`:

```css
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

## Paleta kolorów

### Przed (kolorowe):
- Tabs: blue-500, green-500, purple-500, orange-500, red-500
- Stats: primary-500, green-500, blue-500, orange-500
- Borders: blue-500, green-500, purple-500
- Buttons: blue-500, blue-600

### Po (neutralne):
- Tabs: neutral-900 (active), neutral-50 (inactive)
- Stats: neutral-900 (wszystkie)
- Borders: neutral-200, primary-600 (hints)
- Buttons: neutral-900, neutral-800 (hover)
- Backgrounds: neutral-50, white

## Font sizes zgodne z Figma

- 12px → `text-[12px]` (small text, stats labels)
- 13px → `text-[13px]` (buttons, descriptions, body text)
- 14px → `text-[14px]` (section descriptions)
- 16px → `text-[16px]` (headings in search content)
- 24px → `text-2xl` (section headings mobile)
- 30px → `text-3xl` (section headings desktop)

## Responsive

### Mobile (< 768px):
- Tabs: horizontal scroll z scrollbar-hide
- Stats: grid-cols-2
- Visual tips: grid-cols-1
- Padding: p-6, px-4, py-12

### Desktop (≥ 768px):
- Tabs: wszystkie widoczne
- Stats: grid-cols-4
- Visual tips: grid-cols-3
- Padding: p-8, px-[60px], py-16

## Podsumowanie zmian

✅ **Kolory**: Kolorowe → Neutralne (zgodnie z Figma)
✅ **Typografia**: Dokładne font sizes (13px, 14px, 16px)
✅ **Spacing**: Zwiększony padding i margin
✅ **Borders**: Border-2/4 → border/border-2
✅ **Shadows**: shadow-lg → shadow-md/shadow-sm
✅ **Buttons**: Jednolity styl (neutral-900)
✅ **Icons**: Dodane emoji dla metod wyszukiwania
✅ **Responsive**: Grid adjustments dla mobile
✅ **Scrollbar**: Ukryty dla tabs (scrollbar-hide)
✅ **Layout**: Dodany nagłówek sekcji na stronie głównej

Wszystko zgodne z minimalistycznym designem Figma! 🎉

