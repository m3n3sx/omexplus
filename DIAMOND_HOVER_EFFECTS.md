# Efekty Hover w Kształcie Rombu

## Zrealizowane Zmiany

Zastąpiono zaokrąglone prostokąty (`rounded-lg`, `rounded-xl`) efektami hover w kształcie rombu (skośne krawędzie jak separator "/") w obu menu nawigacyjnych.

## Lokalizacje Zmian

### 1. Górne Menu Nawigacyjne
**Plik**: `storefront/components/layout/FigmaHeader.tsx`

**Elementy z efektem rombu**:
- Śledzenie paczki
- FAQ
- O nas
- Kontakt
- Promocje (stały romb z żółtym tłem)

**Implementacja**:
```typescript
<Link className="relative ... group">
  <span 
    className="absolute inset-0 bg-[#E8F4FE] opacity-0 group-hover:opacity-100 transition-opacity" 
    style={{ clipPath: 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0% 50%)' }}
  />
  <span className="relative z-10">Tekst</span>
</Link>
```

### 2. Mega Menu Kategorii
**Plik**: `storefront/components/layout/FigmaHeader.tsx`

**Elementy z efektem rombu**:
- Przyciski kategorii głównych (Hydraulika, Filtry, Silnik, etc.)
- Podkategorie w dropdown
- Przycisk "Zobacz wszystkie →"

**Implementacja kategorii aktywnej**:
```typescript
<button 
  style={{
    background: 'linear-gradient(to right, #1675F2, #22A2F2)',
    clipPath: 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0% 50%)'
  }}
>
  {category.name}
</button>
```

## Parametry Kształtu Rombu

### Duże Elementy (przyciski kategorii, linki główne)
```css
clip-path: polygon(
  8px 0%,              /* lewy górny róg - 8px wcięcie */
  calc(100% - 8px) 0%, /* prawy górny róg - 8px wcięcie */
  100% 50%,            /* prawy środek - pełna szerokość */
  calc(100% - 8px) 100%, /* prawy dolny róg - 8px wcięcie */
  8px 100%,            /* lewy dolny róg - 8px wcięcie */
  0% 50%               /* lewy środek - pełna szerokość */
);
```

### Małe Elementy (podkategorie w dropdown)
```css
clip-path: polygon(
  6px 0%,              /* mniejsze wcięcie dla subtelniejszego efektu */
  calc(100% - 6px) 0%,
  100% 50%,
  calc(100% - 6px) 100%,
  6px 100%,
  0% 50%
);
```

## Efekty Wizualne

### Stan Normalny
- Tekst: `text-neutral-700`
- Tło: przezroczyste

### Stan Hover
- Tekst: `text-[#1675F2]` (niebieski)
- Tło: `bg-[#E8F4FE]` (jasnoniebieski) w kształcie rombu
- Animacja: `opacity-0` → `opacity-100` z `transition-opacity`

### Stan Active (kategoria otwarta)
- Tekst: `text-white`
- Tło: gradient `from-[#1675F2] to-[#22A2F2]` w kształcie rombu
- Brak efektu hover (już aktywny)

### Przycisk Promocje (stały)
- Tekst: `text-neutral-900`
- Tło: `bg-[#F2B90C]` (żółty) w kształcie rombu
- Hover: `bg-[#d9a50b]` (ciemniejszy żółty)

## Technika Implementacji

### Użycie `clip-path`
- Tworzy skośne krawędzie bez dodatkowych elementów DOM
- Wydajne renderowanie przez GPU
- Responsywne - dostosowuje się do szerokości contentu

### Struktura HTML
```html
<element className="relative group">
  <!-- Warstwa tła hover (absolutnie pozycjonowana) -->
  <span className="absolute inset-0 ... group-hover:opacity-100" style={{ clipPath: '...' }} />
  
  <!-- Zawartość (relatywnie pozycjonowana, z-index: 10) -->
  <span className="relative z-10">Treść</span>
</element>
```

### Zalety Podejścia
1. **Czysty kod**: Brak dodatkowych pseudo-elementów
2. **Kontrola**: Pełna kontrola nad kształtem przez `clip-path`
3. **Animacje**: Płynne przejścia przez `transition-opacity`
4. **Responsywność**: Automatyczne dostosowanie do rozmiaru
5. **Zgodność**: Działa we wszystkich nowoczesnych przeglądarkach

## Spójność z Design System

### Kolory
- Hover tło: `#E8F4FE` (primary-50)
- Hover tekst: `#1675F2` (primary-600)
- Active gradient: `#1675F2` → `#22A2F2` (primary-600 → primary-500)
- Promocje: `#F2B90C` (yellow accent)

### Przejścia
- Duration: `transition-opacity` (domyślnie 150ms)
- Timing: ease (domyślnie)

### Spacing
- Padding: `px-3 py-2` (małe elementy), `px-4 py-3` (duże elementy)
- Gap między elementami: `gap-2`, `gap-3`

## Wizualna Spójność

Kształt rombu nawiązuje do separatora "/" używanego między elementami menu, tworząc spójny język wizualny w całej nawigacji.

```
Element 1  /  Element 2  /  Element 3
   ◇           ◇             ◇
(romb)      (separator)    (romb)
```

## Status
✅ Górne menu nawigacyjne - GOTOWE
✅ Mega menu kategorii - GOTOWE
✅ Dropdown podkategorii - GOTOWE
✅ Przycisk "Zobacz wszystkie" - GOTOWE
✅ Przycisk Promocje - GOTOWE
