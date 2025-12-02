# Requirements Document - OMEX B2B E-Commerce

## Introduction

OMEX to platforma B2B e-commerce dla części przemysłowych (hydraulika, filtry, silniki, osprzęt). System obsługuje 50,000+ produktów w 18 głównych kategoriach z 52 podkategoriami hierarchicznymi. Platforma wspiera wielojęzyczność (PL, EN, DE), tryb ciemny/jasny oraz zaawansowane funkcje B2B.

## Glossary

- **System**: Platforma OMEX B2B E-Commerce
- **Backend**: Medusa.js backend API (port 9000)
- **Frontend**: Next.js 14 storefront + admin (port 3000/8000)
- **B2B Customer**: Klient biznesowy z firmą, NIP, zamówieniami hurtowymi
- **Hierarchical Categories**: Struktura kategorii z parent_id (nieograniczona głębokość)
- **Tiered Pricing**: Ceny zależne od ilości (1-10, 11-50, 50+)
- **Purchase Order (PO)**: Zamówienie z numerem PO, terminem płatności
- **Multi-warehouse**: Zarządzanie stanem magazynowym w wielu lokalizacjach
- **Translation**: Tłumaczenia produktów/kategorii na poziomie bazy danych

## Requirements

### Requirement 1: Product Management

**User Story:** Jako administrator, chcę zarządzać produktami z pełnymi danymi technicznymi, aby klienci mieli dostęp do szczegółowych informacji.

#### Acceptance Criteria

1. WHEN administrator tworzy produkt THEN System SHALL zapisać nazwę, opis, SKU, part_number, cenę, koszt, stan magazynowy
2. WHEN administrator dodaje specyfikacje techniczne THEN System SHALL zapisać dane w formacie JSON
3. WHEN administrator przypisuje kategorie THEN System SHALL obsłużyć relację many-to-many (produkt może być w wielu kategoriach)
4. WHEN administrator dodaje tłumaczenia THEN System SHALL zapisać nazwę i opis w językach PL, EN, DE
5. WHEN administrator ustawia minimum order quantity THEN System SHALL wymusić tę ilość przy dodawaniu do koszyka

### Requirement 2: Hierarchical Categories

**User Story:** Jako administrator, chcę tworzyć hierarchiczne kategorie z nieograniczoną głębokością, aby organizować produkty w logiczną strukturę.

#### Acceptance Criteria

1. WHEN administrator tworzy kategorię THEN System SHALL umożliwić wybór kategorii nadrzędnej (parent_id)
2. WHEN administrator wyświetla drzewo kategorii THEN System SHALL pokazać pełną hierarchię z zagnieżdżeniem
3. WHEN klient przegląda kategorię THEN System SHALL wyświetlić produkty z tej kategorii i wszystkich podkategorii
4. WHEN administrator usuwa kategorię z podkategoriami THEN System SHALL wyświetlić ostrzeżenie o kaskadowym usunięciu
5. WHEN System generuje URL kategorii THEN System SHALL utworzyć ścieżkę hierarchiczną (/hydraulika/pompy/pompy-tlokowe)

### Requirement 3: B2B Customer Profiles

**User Story:** Jako klient B2B, chcę mieć profil firmowy z danymi podatkowymi, aby otrzymywać faktury VAT i korzystać z cen hurtowych.

#### Acceptance Criteria

1. WHEN klient rejestruje się jako B2B THEN System SHALL wymagać nazwy firmy, NIP, adresu
2. WHEN klient ma typ B2B THEN System SHALL wyświetlać ceny hurtowe zamiast detalicznych
3. WHEN klient składa zamówienie THEN System SHALL umożliwić dodanie numeru PO i terminu płatności
4. WHEN klient ma wiele adresów THEN System SHALL umożliwić wybór adresu dostawy i rozliczeniowego
5. WHEN administrator przegląda profil klienta THEN System SHALL wyświetlić historię zamówień, łączną wartość zakupów

### Requirement 4: Tiered Pricing

**User Story:** Jako klient B2B, chcę widzieć ceny zależne od ilości, aby planować zakupy hurtowe.

#### Acceptance Criteria

1. WHEN produkt ma tiered pricing THEN System SHALL wyświetlić tabelę cen (1-10 szt, 11-50 szt, 50+ szt)
2. WHEN klient dodaje produkt do koszyka THEN System SHALL automatycznie zastosować odpowiednią cenę na podstawie ilości
3. WHEN klient zmienia ilość w koszyku THEN System SHALL przeliczyć cenę zgodnie z progami
4. WHEN administrator ustawia ceny THEN System SHALL umożliwić definiowanie nieograniczonej liczby progów
5. WHEN klient ma typ wholesale THEN System SHALL zastosować dodatkowy rabat na wszystkie produkty

### Requirement 5: Multi-warehouse Inventory

**User Story:** Jako administrator, chcę zarządzać stanem magazynowym w wielu lokalizacjach, aby optymalizować wysyłkę.

#### Acceptance Criteria

1. WHEN administrator dodaje produkt THEN System SHALL umożliwić ustawienie stanu dla każdego magazynu
2. WHEN klient składa zamówienie THEN System SHALL automatycznie wybrać magazyn z dostępnym stanem
3. WHEN stan magazynowy spada poniżej minimum THEN System SHALL wysłać alert do administratora
4. WHEN administrator przenosi towar THEN System SHALL zaktualizować stan w obu magazynach
5. WHEN System wyświetla dostępność THEN System SHALL pokazać łączny stan ze wszystkich magazynów

### Requirement 6: Multi-language Support

**User Story:** Jako klient międzynarodowy, chcę przeglądać sklep w moim języku, aby łatwiej znaleźć produkty.

#### Acceptance Criteria

1. WHEN klient wybiera język THEN System SHALL wyświetlić interfejs w języku PL, EN lub DE
2. WHEN System wyświetla produkt THEN System SHALL pokazać przetłumaczoną nazwę i opis
3. WHEN tłumaczenie nie istnieje THEN System SHALL użyć języka angielskiego jako fallback
4. WHEN administrator dodaje produkt THEN System SHALL wymagać tłumaczeń dla wszystkich języków
5. WHEN System generuje URL THEN System SHALL dodać prefix języka (/pl/, /en/, /de/)

### Requirement 7: Advanced Product Search

**User Story:** Jako klient, chcę wyszukiwać produkty po wielu kryteriach, aby szybko znaleźć potrzebne części.

#### Acceptance Criteria

1. WHEN klient wpisuje zapytanie THEN System SHALL przeszukać nazwę, opis, SKU, part_number
2. WHEN klient stosuje filtry THEN System SHALL filtrować po kategorii, cenie, marce, dostępności
3. WHEN klient sortuje wyniki THEN System SHALL umożliwić sortowanie po cenie, dacie, popularności
4. WHEN System zwraca wyniki THEN System SHALL wyświetlić 12 produktów na stronę z paginacją
5. WHEN klient filtruje po equipment_type THEN System SHALL pokazać tylko produkty dla danego sprzętu (CAT, Komatsu, etc.)

### Requirement 8: Shopping Cart & Checkout

**User Story:** Jako klient, chcę dodawać produkty do koszyka i finalizować zamówienie, aby kupić potrzebne części.

#### Acceptance Criteria

1. WHEN klient dodaje produkt do koszyka THEN System SHALL sprawdzić minimum order quantity
2. WHEN klient przegląda koszyk THEN System SHALL wyświetlić produkty, ilości, ceny, sumę
3. WHEN klient przechodzi do checkout THEN System SHALL wymagać adresu dostawy, metody wysyłki, płatności
4. WHEN klient wybiera metodę wysyłki THEN System SHALL obliczyć koszt dla InPost, DPD lub DHL
5. WHEN klient finalizuje zamówienie THEN System SHALL utworzyć zamówienie, wysłać email potwierdzający

### Requirement 9: Order Management

**User Story:** Jako administrator, chcę zarządzać zamówieniami i ich statusami, aby kontrolować proces realizacji.

#### Acceptance Criteria

1. WHEN administrator przegląda zamówienia THEN System SHALL wyświetlić listę z filtrowaniem po statusie, dacie, kliencie
2. WHEN administrator otwiera zamówienie THEN System SHALL pokazać szczegóły: produkty, klient, adresy, płatność, wysyłka
3. WHEN administrator zmienia status THEN System SHALL zapisać zmianę w historii i wysłać powiadomienie do klienta
4. WHEN administrator generuje fakturę THEN System SHALL utworzyć PDF z danymi zamówienia
5. WHEN administrator anuluje zamówienie THEN System SHALL zwrócić produkty do stanu magazynowego

### Requirement 10: Admin Dashboard & Analytics

**User Story:** Jako administrator, chcę widzieć kluczowe metryki i analizy, aby monitorować wydajność sklepu.

#### Acceptance Criteria

1. WHEN administrator otwiera dashboard THEN System SHALL wyświetlić łączną sprzedaż, liczbę zamówień, klientów, przychód
2. WHEN System generuje wykres sprzedaży THEN System SHALL pokazać dane z ostatnich 30 dni
3. WHEN administrator przegląda top produkty THEN System SHALL wyświetlić 10 najlepiej sprzedających się produktów
4. WHEN administrator analizuje kategorie THEN System SHALL pokazać wykres słupkowy wydajności kategorii
5. WHEN administrator eksportuje raport THEN System SHALL wygenerować plik CSV lub PDF

### Requirement 11: Dark/Light Mode

**User Story:** Jako użytkownik, chcę przełączać między trybem jasnym i ciemnym, aby dostosować interfejs do swoich preferencji.

#### Acceptance Criteria

1. WHEN użytkownik przełącza tryb THEN System SHALL zmienić schemat kolorów całej aplikacji
2. WHEN użytkownik odwiedza stronę THEN System SHALL zapamiętać wybrany tryb w localStorage
3. WHEN System wykrywa preferencje systemowe THEN System SHALL automatycznie ustawić odpowiedni tryb
4. WHEN użytkownik jest w trybie ciemnym THEN System SHALL użyć ciemnych kolorów tła i jasnego tekstu
5. WHEN użytkownik przełącza tryb THEN System SHALL zastosować zmianę bez przeładowania strony

### Requirement 12: Shipping Integration

**User Story:** Jako klient, chcę wybrać metodę wysyłki i śledzić przesyłkę, aby wiedzieć kiedy otrzymam zamówienie.

#### Acceptance Criteria

1. WHEN klient wybiera wysyłkę THEN System SHALL wyświetlić opcje: InPost, DPD, DHL z cenami
2. WHEN System oblicza koszt wysyłki THEN System SHALL uwzględnić wagę, wymiary, lokalizację
3. WHEN zamówienie jest wysłane THEN System SHALL wygenerować numer śledzenia
4. WHEN klient sprawdza status THEN System SHALL wyświetlić link do śledzenia przesyłki
5. WHEN przesyłka jest dostarczona THEN System SHALL zaktualizować status zamówienia na "delivered"

### Requirement 13: Payment Processing

**User Story:** Jako klient, chcę płacić kartą przez Stripe, aby szybko finalizować zamówienia.

#### Acceptance Criteria

1. WHEN klient wybiera płatność kartą THEN System SHALL wyświetlić formularz Stripe
2. WHEN klient wprowadza dane karty THEN System SHALL zwalidować dane przed przetworzeniem
3. WHEN płatność jest zatwierdzona THEN System SHALL utworzyć zamówienie i wysłać potwierdzenie
4. WHEN płatność jest odrzucona THEN System SHALL wyświetlić komunikat błędu i umożliwić ponowną próbę
5. WHEN klient B2B wybiera fakturę THEN System SHALL umożliwić płatność z terminem NET30 lub NET60

### Requirement 14: Email Notifications

**User Story:** Jako klient, chcę otrzymywać emaile o statusie zamówienia, aby być na bieżąco.

#### Acceptance Criteria

1. WHEN zamówienie jest złożone THEN System SHALL wysłać email potwierdzający z numerem zamówienia
2. WHEN zamówienie jest wysłane THEN System SHALL wysłać email z numerem śledzenia
3. WHEN zamówienie jest dostarczone THEN System SHALL wysłać email z prośbą o opinię
4. WHEN klient rejestruje się THEN System SHALL wysłać email powitalny
5. WHEN administrator anuluje zamówienie THEN System SHALL wysłać email z wyjaśnieniem

### Requirement 15: SEO & Performance

**User Story:** Jako właściciel sklepu, chcę aby strona była zoptymalizowana pod SEO i szybko się ładowała, aby przyciągnąć więcej klientów.

#### Acceptance Criteria

1. WHEN System generuje stronę produktu THEN System SHALL dodać meta tagi (title, description, og:image)
2. WHEN System generuje URL THEN System SHALL utworzyć przyjazne URL (/produkty/hydraulika/pompy)
3. WHEN klient ładuje stronę THEN System SHALL osiągnąć Lighthouse score 80+ dla wydajności
4. WHEN System generuje sitemap THEN System SHALL zawrzeć wszystkie produkty i kategorie
5. WHEN klient ładuje obrazy THEN System SHALL użyć next/image z optymalizacją i lazy loading
