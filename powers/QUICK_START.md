# Quick Start Guide - Medusa Powers

Szybki start z Medusa Powers w 5 minut.

## 1. Instalacja (2 minuty)

### Krok 1: Otwórz Powers Panel
```
Ctrl/Cmd + Shift + P → wpisz "Configure Powers"
```

### Krok 2: Dodaj Local Repository
1. Kliknij **"Available Powers"**
2. Kliknij **"Manage Repos"** → **"Add Repository"**
3. Wybierz **"Local Directory"**
4. Wpisz ścieżkę: `/home/ooxo/my-medusa-store/powers`
5. Kliknij **"Add"**

### Krok 3: Zainstaluj Powers
Zaznacz wszystkie powers i kliknij **"Install"**:
- ✅ Medusa Best Practices
- ✅ Medusa Development Workflow
- ✅ Medusa Deployment
- ✅ Medusa Troubleshooting
- ✅ Storefront Optimization
- ✅ Medusa API Reference

## 2. Pierwsze Użycie (3 minuty)

### Test 1: Development Workflow
Zapytaj w chacie:
```
"Jak stworzyć nową migrację w Medusa?"
```

Kiro automatycznie:
1. Aktywuje power **medusa-development-workflow**
2. Pokaże ci dokładne kroki
3. Dostarczy przykłady kodu

### Test 2: Troubleshooting
Zapytaj:
```
"Mam błąd CORS, jak to naprawić?"
```

Kiro:
1. Aktywuje **medusa-troubleshooting**
2. Zdiagnozuje problem
3. Pokaże rozwiązanie krok po kroku

### Test 3: API Reference
Zapytaj:
```
"Jak dodać produkt do koszyka przez API?"
```

Kiro:
1. Aktywuje **medusa-api-reference**
2. Pokaże endpoint i przykład
3. Dostarczy TypeScript types

## 3. Codzienne Użycie

### Scenariusz 1: Nowa Funkcjonalność
```
Ty: "Chcę dodać featured products do strony głównej"

Kiro aktywuje:
- medusa-development-workflow (jak stworzyć migrację)
- medusa-api-reference (jak stworzyć endpoint)
- storefront-optimization (jak zoptymalizować wyświetlanie)
```

### Scenariusz 2: Problem do Rozwiązania
```
Ty: "Backend nie startuje, błąd z bazą danych"

Kiro aktywuje:
- medusa-troubleshooting (diagnostyka i rozwiązanie)
```

### Scenariusz 3: Deployment
```
Ty: "Jak wdrożyć sklep na production?"

Kiro aktywuje:
- medusa-deployment (pełny przewodnik)
- storefront-optimization (przed deploymentem)
```

## 4. Pro Tips

### Tip 1: Używaj Konkretnych Pytań
❌ "Pomóż mi z Medusą"
✅ "Jak stworzyć custom endpoint w Medusa?"

### Tip 2: Łącz Powers
```
"Chcę zoptymalizować ładowanie produktów - 
pokaż mi jak to zrobić w API i frontend"

→ Aktywuje: development-workflow + storefront-optimization
```

### Tip 3: Pytaj o Przykłady
```
"Pokaż mi przykład migracji dodającej nowe pole do produktu"

→ Dostaniesz gotowy kod do skopiowania
```

### Tip 4: Troubleshooting
```
"Mam błąd: [wklej błąd]"

→ Kiro zdiagnozuje i pokaże rozwiązanie
```

## 5. Najczęstsze Pytania

### Q: Jak sprawdzić które powers są aktywne?
A: Powers panel → "Installed Powers" - zobaczysz listę

### Q: Czy mogę wyłączyć power?
A: Tak, w Powers panel → kliknij power → "Disable"

### Q: Jak zaktualizować powers?
A: Powers panel → "Refresh" (jeśli używasz repo)

### Q: Czy powers działają offline?
A: Tak! Wszystkie powers są lokalne

### Q: Mogę edytować powers?
A: Tak! Edytuj pliki w `powers/*/POWER.md`

## 6. Keyboard Shortcuts

```
Ctrl/Cmd + Shift + P  → Command Palette
→ "Configure Powers"  → Otwórz Powers panel

Ctrl/Cmd + K          → Otwórz chat z Kiro
→ Zadaj pytanie       → Powers aktywują się automatycznie
```

## 7. Przykładowe Workflow

### Morning Routine
```bash
# 1. Uruchom środowisko
source .venv/bin/activate
npm run dev

# 2. Zapytaj Kiro
"Pokaż mi status mojego projektu i co powinienem dzisiaj zrobić"
```

### Podczas Kodowania
```bash
# Potrzebujesz pomocy?
Ctrl/Cmd + K → Zapytaj Kiro

"Jak zrobić X?"
"Mam błąd Y"
"Pokaż przykład Z"
```

### Przed Commitem
```bash
# Code review
"Sprawdź czy mój kod jest zgodny z best practices"

# Testing
"Jak przetestować ten endpoint?"
```

## 8. Troubleshooting Quick Start

### Problem: Powers nie aktywują się automatycznie
**Rozwiązanie:**
1. Sprawdź czy są zainstalowane: Powers panel → "Installed Powers"
2. Sprawdź czy są enabled (nie disabled)
3. Restart Kiro

### Problem: Nie widzę powers w panelu
**Rozwiązanie:**
1. Sprawdź ścieżkę do katalogu `powers/`
2. Sprawdź czy każdy power ma `POWER.md`
3. Kliknij "Refresh" w Powers panel

### Problem: Power pokazuje błędne informacje
**Rozwiązanie:**
1. Sprawdź czy używasz najnowszej wersji
2. Edytuj `POWER.md` jeśli potrzeba
3. Kliknij "Refresh"

## 9. Next Steps

Po opanowaniu podstaw:

1. **Dostosuj powers** - Edytuj `POWER.md` pod swoje potrzeby
2. **Stwórz własne** - Dodaj custom powers dla swojego projektu
3. **Podziel się** - Share z zespołem przez Git repo

## 10. Pomoc

Potrzebujesz pomocy?

1. **Zapytaj Kiro**: "Jak używać powers?"
2. **Przeczytaj README**: `powers/README.md`
3. **Sprawdź dokumentację**: Każdy power ma szczegółową dokumentację

---

**Gotowy do startu?** Otwórz Powers panel i zainstaluj swoje pierwsze powers! 🚀

**Czas instalacji:** ~2 minuty  
**Czas nauki:** ~3 minuty  
**Korzyści:** Nieograniczone! 💪
