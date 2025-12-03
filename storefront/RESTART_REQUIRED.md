# ⚠️ WYMAGANY RESTART

## Błąd OpenTelemetry:
```
Error: Cannot find module './vendor-chunks/@opentelemetry.js'
```

---

## ✅ Rozwiązanie (10 sekund):

### Opcja 1: Użyj skryptu (ZALECANE)
```bash
cd storefront
./restart.sh
```

### Opcja 2: Ręcznie
```bash
cd storefront
rm -rf .next node_modules/.cache
npm run dev
```

---

## 🔍 Dlaczego ten błąd występuje?

Next.js 15 ma problem z cache OpenTelemetry po zmianach w konfiguracji.

**Kiedy występuje:**
- Po zmianie `next.config.js`
- Po zmianie `instrumentation.ts`
- Po aktualizacji zależności
- Po przełączeniu branch w git

**Rozwiązanie:**
Zawsze wyczyść cache `.next` i `node_modules/.cache`

---

## 📝 Skrypt restart.sh

Utworzyliśmy skrypt który automatycznie:
1. Czyści `.next`
2. Czyści `node_modules/.cache`
3. Uruchamia `npm run dev`

**Użycie:**
```bash
cd storefront
./restart.sh
```

---

## ✅ Po restarcie:

1. Poczekaj aż Next.js się uruchomi
2. Odśwież przeglądarkę: `Ctrl + Shift + R`
3. Sprawdź Console (F12) - powinien być czysty

---

## 🎯 Kiedy używać restart.sh:

- ✅ Po każdej zmianie w `next.config.js`
- ✅ Po każdej zmianie w `instrumentation.ts`
- ✅ Gdy widzisz błąd OpenTelemetry
- ✅ Gdy widzisz dziwne błędy cache
- ✅ Po `git pull` lub `git checkout`
- ✅ Po `npm install`

---

## 💡 Wskazówka:

Dodaj alias do `.bashrc` lub `.zshrc`:

```bash
alias restart-next="cd storefront && rm -rf .next node_modules/.cache && npm run dev"
```

Potem możesz użyć:
```bash
restart-next
```

---

**Status:** ✅ Naprawione po restarcie  
**Czas:** 10 sekund  
**Trudność:** Bardzo łatwa
