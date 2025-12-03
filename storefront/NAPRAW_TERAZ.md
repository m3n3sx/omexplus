# 🔧 Błąd naprawiony - Odśwież przeglądarkę

## ✅ Co zostało naprawione:

Błąd: `The 'border-border' class does not exist`

**Rozwiązanie:** Zastąpiono `@apply border-border` na `box-sizing: border-box`

---

## 🚀 Co zrobić teraz:

### Opcja 1: Odśwież przeglądarkę
```
Naciśnij Ctrl+Shift+R (lub Cmd+Shift+R na Mac)
```

### Opcja 2: Jeśli nadal błąd, zrestartuj dev server
```bash
# W terminalu gdzie działa frontend:
# Naciśnij Ctrl+C aby zatrzymać

# Potem uruchom ponownie:
npm run dev
```

---

## ✅ Plik naprawiony:

**storefront/app/globals.css** - Teraz używa tylko standardowych klas Tailwind

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    box-sizing: border-box;  ← Naprawione!
  }
  
  body {
    @apply bg-white text-gray-900;
  }
}
```

---

## 🧪 Weryfikacja:

Po odświeżeniu powinieneś zobaczyć:
- ✅ Stronę główną bez błędów
- ✅ Białe tło
- ✅ Niebieski gradient w hero section
- ✅ Produkty i kategorie (jeśli są w bazie)

---

## 🚨 Jeśli nadal widzisz błąd:

```bash
cd storefront
rm -rf .next
npm run dev
```

To wyczyści cache i zrestartuje serwer.

---

**Status:** ✅ Naprawione  
**Czas:** 10 sekund  
**Akcja:** Odśwież przeglądarkę (Ctrl+Shift+R)
