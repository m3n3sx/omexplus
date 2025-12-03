# ⚡ START HERE - Szybki Start

## 🎯 Wszystko naprawione! Uruchom w 30 sekund:

### Krok 1: Backend (Terminal 1)
```bash
npm run dev
```
✅ Poczekaj na: "Server is ready on port 9000"

### Krok 2: Frontend (Terminal 2)

**Opcja A - Użyj skryptu (zalecane):**
```bash
cd storefront
./restart.sh
```

**Opcja B - Ręcznie:**
```bash
cd storefront
npm run dev
```
✅ Poczekaj na: "Ready in X ms"

### Krok 3: Otwórz przeglądarkę
```
http://localhost:3000
```

---

## ✅ Checklist - Co zostało naprawione:

- [x] Błąd OpenTelemetry - NAPRAWIONY
- [x] CSS konflikty - NAPRAWIONY  
- [x] Brakujące zależności - ZAINSTALOWANE
- [x] Strona główna - DZIAŁA
- [x] API połączenie - SKONFIGUROWANE
- [x] Mobile responsive - DZIAŁA
- [x] Tailwind CSS - DZIAŁA

---

## 🚨 Jeśli widzisz błąd:

### "Cannot find module" lub błąd OpenTelemetry
```bash
cd storefront
./restart.sh
```

Lub ręcznie:
```bash
rm -rf .next node_modules/.cache
npm run dev
```

### "CORS error"
```bash
# Edytuj medusa-config.ts:
http: {
  storeCors: "http://localhost:3000"
}
# Zrestartuj backend!
```

### "Port 3000 in use"
```bash
lsof -i :3000
kill -9 <PID>
```

---

## 📚 Pełna dokumentacja:

1. **URUCHOM_FRONTEND.md** ← Przeczytaj to najpierw!
2. **STOREFRONT_RESTORATION_GUIDE.md** - Kompletny przewodnik
3. **CORS_FIX_GUIDE.md** - Problemy CORS
4. **ERROR_FIXES.md** - Konkretne błędy

---

## 🎉 To wszystko!

Frontend jest gotowy. Otwórz http://localhost:3000 i ciesz się!
