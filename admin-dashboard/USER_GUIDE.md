# OMEX Admin Dashboard - Przewodnik Użytkownika

## 🚀 Szybki Start

### Logowanie
1. Otwórz `http://localhost:3001`
2. Zaloguj się używając danych administratora Medusa
3. Po zalogowaniu zobaczysz główny dashboard

## 📋 Podstawowe Operacje

### Zarządzanie Kategoriami

#### Dodawanie Nowej Kategorii
1. Przejdź do **Kategorie** w menu bocznym
2. Kliknij **Dodaj Kategorię**
3. Wypełnij formularz:
   - **Nazwa** - wyświetlana nazwa kategorii (np. "Hydraulika")
   - **Handle** - slug URL (zostaw puste dla auto-generowania)
   - **Opis** - opcjonalny opis kategorii
   - **Kategoria Nadrzędna** - wybierz jeśli to podkategoria
   - **Kolejność** - numer określający pozycję w liście
   - **Aktywna** - czy kategoria jest widoczna w sklepie
4. Kliknij **Zapisz Kategorię**

#### Edycja Kategorii
1. Na liście kategorii kliknij ikonę **Edytuj** (ołówek)
2. Zmień potrzebne pola
3. Kliknij **Zapisz Zmiany**

#### Usuwanie Kategorii
1. Kliknij ikonę **Usuń** (kosz)
2. Potwierdź usunięcie

**Uwaga:** Usunięcie kategorii nadrzędnej może wpłynąć na podkategorie!

### Zarządzanie Stronami CMS

#### Tworzenie Nowej Strony
1. Przejdź do **Treść & Wygląd** → **Strony CMS**
2. Kliknij **Nowa Strona**
3. Wypełnij:
   - **Tytuł** - nazwa strony (np. "O Nas")
   - **Slug** - URL strony (np. "o-nas")
   - **Treść** - zawartość w HTML lub Markdown
   - **Opublikuj** - zaznacz aby strona była widoczna
4. Kliknij **Zapisz Stronę**

#### Edycja Strony
1. Na liście stron kliknij **Edytuj**
2. Zmień treść
3. Kliknij **Zapisz Zmiany**

#### Podgląd Strony
- Kliknij ikonę **Oka** aby otworzyć stronę w nowej karcie

### Konfiguracja Topbar

1. Przejdź do **Treść & Wygląd** → **Topbar**
2. Edytuj dane kontaktowe:
   - Telefon
   - Email
3. Zarządzaj językami:
   - Zaznacz checkbox aby włączyć język
   - Edytuj nazwę wyświetlaną
4. Zarządzaj walutami:
   - Włącz/wyłącz dostępne waluty
5. Kliknij **Zapisz Ustawienia**

**Efekt:** Zmiany będą widoczne w górnym pasku na stronie sklepu.

### Konfiguracja Mega Menu

1. Przejdź do **Treść & Wygląd** → **Mega Menu**
2. Aby dodać nowy element:
   - Kliknij **Dodaj Element**
   - Wypełnij:
     - **Nazwa** - nazwa kategorii (np. "Hydraulika & Osprzęt")
     - **Ikona** - 3-literowy kod (np. "HYD")
     - **Slug** - URL (np. "hydraulika")
     - **Priorytet** - wybierz ⭐⭐⭐, ⭐⭐ lub ⭐
     - **Podkategorie** - jedna na linię
   - Kliknij **Zapisz Element**
3. Aby edytować:
   - Kliknij **Edytuj** przy elemencie
   - Zmień dane
   - Kliknij **Zapisz Element**
4. Po zakończeniu edycji kliknij **Zapisz Wszystkie Zmiany**

**Efekt:** Mega menu będzie wyświetlane po najechaniu na "PRODUKTY" w głównym menu.

### Zarządzanie Bannerami

#### Dodawanie Bannera
1. Przejdź do **Treść & Wygląd** → **Bannery**
2. Kliknij **Dodaj Banner**
3. Wypełnij:
   - **Tytuł** - nazwa bannera (do użytku wewnętrznego)
   - **Pozycja** - gdzie banner ma się wyświetlać
   - **URL Obrazka** - link do grafiki
   - **Link** - gdzie przekierować po kliknięciu (opcjonalnie)
   - **Aktywny** - czy banner jest widoczny
   - **Priorytet** - kolejność wyświetlania (niższy = wyżej)
4. Kliknij **Zapisz**

#### Szybkie Włączanie/Wyłączanie
- Kliknij ikonę **Oka** na bannerze aby szybko włączyć/wyłączyć

## 🎯 Najlepsze Praktyki

### Kategorie
- Używaj logicznej hierarchii (max 3-4 poziomy)
- Nadawaj sensowne nazwy i slugi
- Ustawiaj kolejność według ważności
- Regularnie przeglądaj i aktualizuj strukturę

### Strony CMS
- Używaj spójnego formatowania
- Dodawaj nagłówki H1, H2 dla SEO
- Testuj linki przed publikacją
- Zachowuj kopie zapasowe ważnych treści

### Topbar
- Sprawdzaj poprawność danych kontaktowych
- Włączaj tylko aktywnie używane języki i waluty
- Testuj linki po każdej zmianie

### Mega Menu
- Nie dodawaj więcej niż 14-16 głównych kategorii
- Ogranicz podkategorie do 8-10 na kategorię
- Używaj priorytetów dla najważniejszych kategorii
- Synchronizuj z rzeczywistymi kategoriami produktów

### Bannery
- Używaj obrazków w odpowiedniej rozdzielczości
- Hero banners: 1920x600px
- Sidebar: 300x400px
- Optymalizuj rozmiar plików (max 200KB)
- Testuj na różnych urządzeniach

## 🔍 Rozwiązywanie Problemów

### Nie widzę zmian na stronie
1. Wyczyść cache przeglądarki (Ctrl+Shift+R)
2. Sprawdź czy element jest aktywny/opublikowany
3. Sprawdź czy zapisałeś zmiany
4. Zrestartuj serwer deweloperski

### Błąd podczas zapisywania
1. Sprawdź połączenie z backendem
2. Sprawdź czy jesteś zalogowany
3. Sprawdź logi w konsoli przeglądarki (F12)
4. Sprawdź czy wszystkie wymagane pola są wypełnione

### Kategorie nie wyświetlają się hierarchicznie
1. Sprawdź czy poprawnie ustawiono kategorię nadrzędną
2. Sprawdź czy kategoria jest aktywna
3. Odśwież stronę

## 📞 Wsparcie

W razie problemów:
1. Sprawdź logi w konsoli (F12)
2. Sprawdź dokumentację API
3. Skontaktuj się z zespołem technicznym

## 🔄 Aktualizacje

Dashboard jest regularnie aktualizowany. Sprawdzaj:
- `ADMIN_FEATURES.md` - lista funkcjonalności
- `CHANGELOG.md` - historia zmian
- GitHub Issues - zgłoszone problemy i propozycje
