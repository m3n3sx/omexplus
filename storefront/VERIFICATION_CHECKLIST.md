# Checklist weryfikacji - Frontend bez błędów 404

## Instrukcja testowania

Uruchom serwer deweloperski i przetestuj wszystkie poniższe linki:

```bash
cd storefront
npm run dev
```

## ✅ Header - Górna nawigacja

Sprawdź wszystkie linki w górnym pasku:

- [ ] Kliknij "Śledzenie paczki" → powinno otworzyć `/pl/tracking`
- [ ] Kliknij "FAQ" → powinno otworzyć `/pl/faq`
- [ ] Kliknij "O nas" → powinno otworzyć `/pl/o-nas`
- [ ] Kliknij "Kontakt" → powinno otworzyć `/pl/kontakt`
- [ ] Kliknij "Promocje" (żółty przycisk) → powinno otworzyć `/pl/promocje`

## ✅ Mega Menu - Kategorie

Najedź myszką na każdą kategorię i kliknij "Zobacz wszystkie":

- [ ] Hydraulika → `/pl/categories/hydraulika`
- [ ] Filtry & Uszczelnienia → `/pl/categories/filtry`
- [ ] Silnik & Osprzęt → `/pl/categories/silnik`
- [ ] Podwozie & Gąsienice → `/pl/categories/podwozie`
- [ ] Elektryka → `/pl/categories/elektryka`
- [ ] Kabina & Komfort → `/pl/categories/kabina`
- [ ] Oświetlenie → `/pl/categories/oswietlenie`
- [ ] Narzędzia & Akcesoria → `/pl/categories/narzedzia`

Kliknij dowolną podkategorię w każdym menu:

- [ ] Wszystkie podkategorie prowadzą do odpowiedniej kategorii głównej
- [ ] Żadna nie daje błędu 404

## ✅ Footer - Linki w stopce

### Kolumna "Sklep":
- [ ] Nowości → `/pl/nowosci`
- [ ] Bestsellery → `/pl/bestsellery`
- [ ] Promocje → `/pl/promocje`
- [ ] Wszystkie produkty → `/pl/products`

### Kolumna "Informacje":
- [ ] O nas → `/pl/o-nas`
- [ ] Kontakt → `/pl/kontakt`
- [ ] Dostawa i płatność → `/pl/dostawa`
- [ ] Zwroty i reklamacje → `/pl/zwroty`

### Kolumna "Pomoc":
- [ ] FAQ → `/pl/faq`
- [ ] Regulamin → `/pl/regulamin`
- [ ] Polityka prywatności → `/pl/polityka-prywatnosci`
- [ ] Śledzenie przesyłki → `/pl/sledzenie` (przekierowanie do `/pl/tracking`)

### Kolumna "Firma":
- [ ] Kariera → `/pl/kariera`
- [ ] Blog → `/pl/blog`

## ✅ Strona główna - Dynamiczne dane

Sprawdź sekcję ze statystykami na dole strony głównej:

- [ ] Liczba produktów NIE jest "1,884" (powinna być dynamiczna z bazy)
- [ ] Liczba kategorii jest dynamiczna
- [ ] Kliknij "Zobacz wszystkie produkty" → `/pl/products`

## ✅ Menu użytkownika (ikona użytkownika)

- [ ] Moje zamówienia → `/pl/zamowienia` (przekierowanie do `/pl/orders`)
- [ ] Moje konto → `/pl/konto`
- [ ] Wyloguj → funkcja wylogowania

## ✅ Nowe strony - Zawartość

Sprawdź czy strony się ładują i mają zawartość:

### Strony informacyjne:
- [ ] `/pl/tracking` - formularz śledzenia
- [ ] `/pl/promocje` - lista produktów promocyjnych
- [ ] `/pl/regulamin` - tekst regulaminu
- [ ] `/pl/zwroty` - informacje o zwrotach
- [ ] `/pl/dostawa` - informacje o dostawie
- [ ] `/pl/polityka-prywatnosci` - polityka prywatności
- [ ] `/pl/kariera` - oferty pracy
- [ ] `/pl/blog` - lista artykułów

### Strony produktowe:
- [ ] `/pl/nowosci` - produkty z badge "NOWOŚĆ"
- [ ] `/pl/bestsellery` - produkty z badge "TOP 1/2/3"

## ✅ Responsywność

Sprawdź na różnych rozdzielczościach:

- [ ] Mobile (375px) - wszystkie linki działają
- [ ] Tablet (768px) - wszystkie linki działają
- [ ] Desktop (1024px+) - wszystkie linki działają

## 🎯 Oczekiwany rezultat

**WSZYSTKIE checkboxy powinny być zaznaczone ✅**

Jeśli którykolwiek link daje błąd 404, oznacza to problem wymagający naprawy.

## 📝 Notatki

- Obrazki produktów używają SVG placeholderów - to normalne
- Niektóre strony mają przykładową zawartość - to normalne
- Wszystkie linki MUSZĄ działać - to wymagane

## 🐛 Zgłaszanie problemów

Jeśli znajdziesz błąd 404:
1. Zapisz URL który nie działa
2. Zapisz skąd kliknąłeś (który link)
3. Zrób screenshot
4. Zgłoś do naprawy
