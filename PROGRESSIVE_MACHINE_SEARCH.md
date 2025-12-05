# 🔍 Progressive Machine Search - Wyszukiwanie Krok Po Kroku

## Jak Działa

Wyszukiwarka według maszyny pokazuje **wyniki po każdym kroku**, pozwalając użytkownikowi:
1. Zobaczyć ile części jest dostępnych
2. Zdecydować czy zawęzić wyniki dalej
3. Lub od razu przejść do pełnych wyników

## Przepływ Użytkownika

### Krok 1: Wybór Marki
```
Użytkownik klika: CAT
↓
Przechodzi automatycznie do kroku 2
```

### Krok 2: Wybór Typu Maszyny
```
Użytkownik klika: Koparka (EXC)
↓
🔍 AUTOMATYCZNE WYSZUKIWANIE
↓
Pokazuje: "Znalezione części dla CAT Koparka"
- Wyświetla 5 pierwszych produktów
- Pokazuje liczbę wszystkich wyników
↓
Użytkownik ma 2 opcje:
  A) "Zobacz wszystkie (150)" → Przechodzi do wyników
  B) "Zawęź wyniki" → Przechodzi do kroku 3
```

### Krok 3: Wybór Modelu
```
Użytkownik wpisuje lub klika: 320
↓
🔍 AUTOMATYCZNE WYSZUKIWANIE
↓
Pokazuje: "Znalezione części dla CAT Koparka 320"
- Wyświetla 8 pierwszych produktów
- Pokazuje liczbę wszystkich wyników
↓
Użytkownik ma 2 opcje:
  A) "Zobacz wszystkie (45)" → Przechodzi do wyników
  B) "Zawęź wyniki" → Przechodzi do kroku 4
```

### Krok 4: Wybór Serii (Opcjonalnie)
```
Użytkownik klika: Small frame (301, 305, 308)
↓
🔍 AUTOMATYCZNE WYSZUKIWANIE
↓
Pokazuje zawężone wyniki
↓
Opcje: "Zobacz wszystkie" lub "Zawęź wyniki" (krok 5)
```

### Krok 5: Wybór Silnika (Opcjonalnie)
```
Użytkownik klika: Perkins
↓
🔍 AUTOMATYCZNE WYSZUKIWANIE
↓
Pokazuje najbardziej precyzyjne wyniki
↓
"Szukaj części" → Przechodzi do pełnych wyników
```

## Przykład Użycia

### Scenariusz 1: Szybkie Wyszukiwanie
```
1. Klik: CAT
2. Klik: Koparka (EXC)
   → Widzi: 150 części
3. Klik: "Zobacz wszystkie (150)"
   ✅ Gotowe w 3 krokach!
```

### Scenariusz 2: Precyzyjne Wyszukiwanie
```
1. Klik: CAT
2. Klik: Koparka (EXC)
   → Widzi: 150 części
3. Klik: "Zawęź wyniki"
4. Wpisuje: 320
   → Widzi: 45 części
5. Klik: "Zawęź wyniki"
6. Klik: Small frame
   → Widzi: 12 części
7. Klik: "Zobacz wszystkie (12)"
   ✅ Precyzyjne wyniki!
```

## Implementacja

### Frontend Component
**Plik:** `storefront/components/search/MachineSelector.tsx`

**Kluczowe funkcje:**
```typescript
// Automatyczne wyszukiwanie po każdej zmianie
useEffect(() => {
  if (selectedBrand && selectedType) {
    performSearch()
  }
}, [selectedBrand, selectedType, selectedModel, selectedSeries])

// Wykonanie wyszukiwania
const performSearch = async () => {
  await search({
    method: 'machine',
    params: {
      brand: selectedBrand,
      machineType: selectedType,
      model: selectedModel || '',
      series: selectedSeries || undefined,
    }
  })
  setShowResults(true)
}
```

### Backend API
**Endpoint:** `GET /store/omex-search?brand=CAT&machineType=Koparka&model=320`

**SQL Query:**
```sql
SELECT p.*, json_agg(pv.*) as variants
FROM product p
LEFT JOIN product_variant pv ON p.id = pv.product_id
WHERE 
  LOWER(p.metadata->>'machine_brand') LIKE '%cat%'
  AND LOWER(p.metadata->>'machine_type') LIKE '%koparka%'
  AND (p.metadata->'machine_models' @> '["320"]'::jsonb 
       OR LOWER(p.title) LIKE '%320%')
GROUP BY p.id
ORDER BY p.created_at DESC
```

## UI/UX Features

### 1. Progress Bar
- 5 kroków wizualnie pokazanych
- Aktywny krok podświetlony na niebiesko

### 2. Results Preview
- Pokazuje 5-8 pierwszych produktów
- Scrollowalna lista
- Licznik: "+ X więcej produktów"

### 3. Dual Action Buttons
```
[Wstecz]  [Zobacz wszystkie (150)] [Zawęź wyniki]
```

### 4. Quick Model Selection
- Popularne modele jako przyciski
- Input do wpisania własnego modelu
- Przykłady: PC200, 320, 330, ZX210

### 5. Loading States
- "Wyszukiwanie..." podczas ładowania
- "Brak wyników" jeśli nic nie znaleziono

## Korzyści

### Dla Użytkownika
✅ Widzi wyniki natychmiast po wyborze typu  
✅ Może szybko ocenić dostępność części  
✅ Decyduje sam jak precyzyjnie szukać  
✅ Oszczędza czas - nie musi wypełniać wszystkich kroków  

### Dla Biznesu
✅ Wyższa konwersja - użytkownik widzi że mamy części  
✅ Lepsza UX - progresywne ujawnianie informacji  
✅ Mniej porzuconych wyszukiwań  
✅ Dane o popularnych kombinacjach marka+typ+model  

## Testowanie

### Test 1: CAT Koparka
```bash
curl -H "x-publishable-api-key: YOUR_KEY" \
  "http://localhost:9000/store/omex-search?brand=CAT&machineType=Koparka"
```

### Test 2: Komatsu Koparka PC200
```bash
curl -H "x-publishable-api-key: YOUR_KEY" \
  "http://localhost:9000/store/omex-search?brand=Komatsu&machineType=Koparka&model=PC200"
```

### Test 3: Volvo Ładowarka
```bash
curl -H "x-publishable-api-key: YOUR_KEY" \
  "http://localhost:9000/store/omex-search?brand=Volvo&machineType=Ładowarka"
```

## Następne Kroki

1. ✅ Backend API działa
2. ✅ Frontend component zaktualizowany
3. 🔄 Integracja z UnifiedSearchHub
4. 🔄 Testy użytkownika
5. 🔄 Analytics tracking (które kombinacje są popularne)

## Status: ✅ GOTOWE DO TESTOWANIA
