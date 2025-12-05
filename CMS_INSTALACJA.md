# 🚀 Instalacja Systemu CMS - Krok po Kroku

## 📋 Wymagania

- Node.js 20+
- PostgreSQL
- Backend Medusa działający
- Panel administracyjny

## ⚡ Szybka Instalacja (3 minuty)

### Krok 1: Inicjalizacja bazy danych

```bash
npm run init-cms
```

**Co się dzieje:**
- Tworzy tabele: `cms_content`, `cms_menu`, `cms_menu_item`, `cms_page`
- Dodaje przykładowe dane (header, footer, menu)
- Wyświetla potwierdzenie

**Oczekiwany output:**
```
🚀 Inicjalizacja CMS...
✅ Tabele CMS utworzone
✅ Przykładowe dane dodane
🎉 CMS zainicjalizowany!
```

### Krok 2: Uruchom backend

```bash
npm run dev
```

**Sprawdź:**
- Backend działa na porcie 9000
- Brak błędów w konsoli
- API odpowiada

### Krok 3: Uruchom panel administracyjny

```bash
cd admin-dashboard
npm run dev
```

**Sprawdź:**
- Panel działa na porcie 3001
- Możesz się zalogować
- Widzisz menu "CMS Content" i "CMS Menus"

### Krok 4: Otwórz panel CMS

Przejdź do: **http://localhost:3001/cms**

**Powinieneś zobaczyć:**
- Listę elementów CMS
- Przykładowe dane (main-header, main-footer, home-hero)
- Przyciski do edycji i dodawania

## ✅ Weryfikacja Instalacji

### Test 1: Sprawdź API

```bash
npm run test-cms
```

**Oczekiwany output:**
```
🧪 Testowanie CMS API...

1️⃣ Test: GET /store/cms
✅ Status: 200
📦 Elementy: 3

2️⃣ Test: GET /store/cms?key=main-header
✅ Status: 200
📦 Element: Główny Header

3️⃣ Test: GET /store/cms/menus?key=main-menu
✅ Status: 200
📦 Menu: Menu Główne
   Pozycje: 5

🎉 Wszystkie testy zakończone!
```

### Test 2: Sprawdź panel

1. Otwórz http://localhost:3001/cms
2. Kliknij "Edytuj" przy dowolnym elemencie
3. Zmień nazwę
4. Kliknij "Zapisz zmiany"
5. Sprawdź czy zmiana została zapisana

### Test 3: Sprawdź frontend

1. Otwórz http://localhost:3000/pl/cms-demo
2. Powinieneś zobaczyć stronę demo CMS
3. Sekcje powinny się ładować z backendu

## 🔧 Rozwiązywanie Problemów

### Problem 1: Błąd "Tabele już istnieją"

**Rozwiązanie:**
```bash
# Usuń stare tabele (UWAGA: usuwa dane!)
psql -d medusa-store -c "DROP TABLE IF EXISTS cms_content, cms_menu, cms_menu_item, cms_page CASCADE;"

# Uruchom ponownie
npm run init-cms
```

### Problem 2: Błąd połączenia z bazą

**Sprawdź:**
```bash
# Sprawdź czy PostgreSQL działa
pg_isready

# Sprawdź zmienną DATABASE_URL
echo $DATABASE_URL

# Lub w .env
cat .env | grep DATABASE_URL
```

**Popraw:**
```bash
# W .env ustaw poprawny URL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/medusa-store
```

### Problem 3: Nie widzę menu CMS w panelu

**Sprawdź:**
1. Czy panel jest zaktualizowany?
   ```bash
   cd admin-dashboard
   git pull  # lub pobierz najnowsze pliki
   npm install
   ```

2. Czy plik `Sidebar.tsx` ma wpisy CMS?
   - Powinien zawierać: "CMS Content" i "CMS Menus"

3. Restart panelu:
   ```bash
   # Ctrl+C aby zatrzymać
   npm run dev
   ```

### Problem 4: API zwraca 404

**Sprawdź:**
1. Backend działa?
   ```bash
   curl http://localhost:9000/health
   ```

2. Endpointy CMS istnieją?
   ```bash
   curl http://localhost:9000/store/cms
   ```

3. Sprawdź logi backendu w konsoli

### Problem 5: Nie mogę zapisać elementu

**Sprawdź:**
1. Czy jesteś zalogowany?
2. Czy wszystkie wymagane pola są wypełnione?
3. Czy `key` jest unikalny?
4. Sprawdź console w przeglądarce (F12)
5. Sprawdź logi backendu

## 📦 Import Przykładowych Danych

Jeśli chcesz więcej przykładowych danych:

```bash
# Skopiuj przykładowe dane
cp cms-sample-data.json /tmp/

# Import przez API (wymaga zalogowania)
# Użyj panelu CMS lub napisz skrypt
```

Lub ręcznie przez panel:
1. Otwórz http://localhost:3001/cms
2. Kliknij "+ Dodaj Element"
3. Skopiuj dane z `cms-sample-data.json`
4. Wklej do formularza
5. Zapisz

## 🎯 Następne Kroki

Po instalacji:

1. **Przeczytaj dokumentację:**
   - [CMS_QUICK_START.md](./CMS_QUICK_START.md) - Szybki start
   - [CMS_INSTRUKCJA_PL.md](./CMS_INSTRUKCJA_PL.md) - Pełna instrukcja

2. **Dodaj swoje elementy:**
   - Otwórz panel CMS
   - Dodaj header dla swojej strony
   - Dodaj menu
   - Dodaj sekcje

3. **Użyj na frontendzie:**
   ```typescript
   import DynamicHeader from '@/components/cms/DynamicHeader'
   import DynamicSection from '@/components/cms/DynamicSection'
   
   <DynamicHeader locale="pl" />
   <DynamicSection sectionKey="my-section" locale="pl" />
   ```

4. **Dostosuj do swoich potrzeb:**
   - Dodaj nowe typy elementów
   - Stwórz własne edytory
   - Rozszerz API

## 📞 Wsparcie

Jeśli masz problemy:

1. Sprawdź [CMS_INSTRUKCJA_PL.md](./CMS_INSTRUKCJA_PL.md) - sekcja "Pomoc"
2. Uruchom `npm run test-cms` aby zdiagnozować problem
3. Sprawdź logi backendu i frontendu
4. Sprawdź console w przeglądarce (F12)

## ✅ Checklist Instalacji

- [ ] PostgreSQL działa
- [ ] Backend Medusa działa (port 9000)
- [ ] Panel admin działa (port 3001)
- [ ] Uruchomiłem `npm run init-cms`
- [ ] Tabele CMS zostały utworzone
- [ ] Przykładowe dane zostały dodane
- [ ] Test API przeszedł (`npm run test-cms`)
- [ ] Widzę menu CMS w panelu
- [ ] Mogę dodać nowy element
- [ ] Mogę edytować element
- [ ] Frontend ładuje dane z CMS
- [ ] Wszystko działa! 🎉

## 🎉 Gotowe!

System CMS jest zainstalowany i gotowy do użycia!

**Zacznij edytować:** http://localhost:3001/cms

**Zobacz demo:** http://localhost:3000/pl/cms-demo

---

**Powodzenia!** 🚀
