# WIREFRAMES, KATEGORIE, PODSTRONY & PRODUKTY
## OOXO.pl - Kolaiwalki.pl (ooxo.pl)

---

## 📐 WIREFRAMES (do zaimportowania do Figma)

### Figma JSON Export Format

Poniżej struktury stron - mogą być zaimportowane do Figmy lub użyte jako reference:

### 1. HOME PAGE - Desktop

```
┌─────────────────────────────────────────────────────┐
│  HEADER                                             │
│  Logo  Search Bar      Cart(0)  User  Menu         │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  HERO SECTION                                │   │
│  │  "Części do Maszyn Budowlanych"             │   │
│  │  Gradient: Teal → Blue                      │   │
│  │  [Search SKU] [Browse Catalog]              │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │  FEATURED CATEGORIES (6 Cards)              │    │
│  │  ┌────────┐ ┌────────┐ ┌────────┐          │    │
│  │  │ Koła   │ │ Wałki  │ │Hydraul.│          │    │
│  │  │ Icon   │ │ Icon   │ │ Icon   │          │    │
│  │  └────────┘ └────────┘ └────────┘          │    │
│  │  ┌────────┐ ┌────────┐ ┌────────┐          │    │
│  │  │ Uszcz. │ │Łożyska │ │ Silniki│          │    │
│  │  │ Icon   │ │ Icon   │ │ Icon   │          │    │
│  │  └────────┘ └────────┘ └────────┘          │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │  BESTSELLERS SLIDER                         │    │
│  │  ◀  [Product] [Product] [Product]  ▶       │    │
│  │     CAT SKU  CAT SKU   CAT SKU              │    │
│  │     $2500    $1800     $2100                │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │  WHY CHOOSE US (4 Columns)                  │    │
│  │  ✓Quality ✓Price  ✓Speed  ✓Support         │    │
│  │   18 years experience                       │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │  NEWSLETTER SIGNUP                          │    │
│  │  Email: [________] [Subscribe]              │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
├─────────────────────────────────────────────────────┤
│  FOOTER                                             │
│  About | Support | Legal | Social                  │
└─────────────────────────────────────────────────────┘
```

### 2. PRODUCT CATALOG PAGE - Desktop

```
┌─────────────────────────────────────────────────────┐
│  HEADER + BREADCRUMB: Home > Katalog > Koła         │
├─────────────────────────────────────────────────────┤
│                                                      │
│  SIDEBAR (25%)           MAIN CONTENT (75%)        │
│  ┌──────────────────┐    ┌──────────────────────┐   │
│  │ FILTERS          │    │ SEARCH & SORT        │   │
│  │ ┌──────────────┐ │    │ [Search...] Sort▼   │   │
│  │ │ Categories  │ │    │ [3 col grid view]   │   │
│  │ │ ✓ Koła       │ │    │                      │   │
│  │ │ ✓ Wałki      │ │    │ ┌──────┐ ┌──────┐  │   │
│  │ │   Hydraulika │ │    │ │Prod.1│ │Prod.2│  │   │
│  │ └──────────────┘ │    │ │$2500 │ │$1800 │  │   │
│  │                  │    │ │SKU...|│ │SKU...|│  │   │
│  │ BRANDS          │    │ │  12x │ │  8x  │  │   │
│  │ ✓ CAT           │    │ │Add   │ │Add   │  │   │
│  │ ✓ Komatsu       │    │ │Stock │ │Stock │  │   │
│  │ ✓ JCB           │    │ │      │ │      │  │   │
│  │ ✓ Volvo         │    │ └──────┘ └──────┘  │   │
│  │ ✓ Case          │    │ ┌──────┐ ┌──────┐  │   │
│  │ ✓ Hitachi       │    │ │Prod.3│ │Prod.4│  │   │
│  │                  │    │ │$1200 │ │$3200 │  │   │
│  │ PRICE RANGE     │    │ │SKU...|│ │SKU...|│  │   │
│  │ [Min]─[Max]     │    │ │  0x  │ │  15x │  │   │
│  │ PLN 0 - 10000   │    │ │Order │ │Add   │  │   │
│  │                  │    │ │Stock │ │Stock │  │   │
│  │ AVAILABILITY    │    │ │      │ │      │  │   │
│  │ ✓ Na magazynie  │    │ └──────┘ └──────┘  │   │
│  │ ✓ Zamówienie    │    │                      │   │
│  │ ✓ Brak          │    │ [Pagination: 1 2 3] │   │
│  │                  │    │                      │   │
│  └──────────────────┘    └──────────────────────┘   │
│                                                      │
├─────────────────────────────────────────────────────┤
│  FOOTER                                             │
└─────────────────────────────────────────────────────┘
```

### 3. PRODUCT DETAIL PAGE

```
┌─────────────────────────────────────────────────────┐
│  HEADER + BREADCRUMB: Home > Koła > [Product]       │
├─────────────────────────────────────────────────────┤
│  LEFT (45%)              RIGHT (45%)   SIDEBAR(10%)│
│  ┌────────────────────┐  ┌──────────────────────┐  │
│  │ MAIN IMAGE         │  │ Product Details      │  │
│  │ [Large image]      │  │ Koło gąsienicowe     │  │
│  │ (Gray BG)          │  │ CAT PC200            │  │
│  │                    │  │ SKU: KOL-CAT-001     │  │
│  │ [Zoom on hover]    │  │ ⭐⭐⭐⭐⭐ (12 reviews)│  │
│  │                    │  │                      │  │
│  │ THUMBNAILS:        │  │ Price:               │  │
│  │ [T1] [T2] [T3]     │  │ Brutto: 3075 zł      │  │
│  │                    │  │ Netto: 2500 zł *     │  │
│  │ FEATURES:          │  │ * after login        │  │
│  │ • Specification    │  │                      │  │
│  │ • Compatibility    │  │ Stock: 12 units      │  │
│  │ • Quality Grade    │  │ Status: Na magazynie  │  │
│  │                    │  │ 🟢 In stock          │  │
│  │                    │  │                      │  │
│  │                    │  │ Qty: [1▼]            │  │
│  │                    │  │                      │  │
│  │                    │  │ [ADD TO CART] (Org)  │  │
│  │                    │  │ [INQUIRY] (Opt)      │  │
│  │                    │  │                      │  │
│  │                    │  │ Share: [f] [in] [y]  │  │
│  │                    │  │                      │  │
│  │ STICKY SIDEBAR     │  │                      │  │
│  │ [Quick specs]      │  │                      │  │
│  │ [Add to compare]   │  │                      │  │
│  │ [Share]            │  │                      │  │
│  └────────────────────┘  └──────────────────────┘  │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │ SPECIFICATION TABLE                         │    │
│  │ Property        │ Value                     │    │
│  │ Type            │ Wheel (Drive)             │    │
│  │ Compatibility   │ CAT 320, 330, 340, 350   │    │
│  │ Material        │ Steel                     │    │
│  │ Durability      │ 2000-3000 hours          │    │
│  │ Weight          │ 45 kg                     │    │
│  │ Warranty        │ 12 months                 │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
│  DESCRIPTION / LONG TEXT                            │
│  (Gray background, readable font)                   │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │ RELATED PRODUCTS (5 Products)               │    │
│  │ ◀  [Prod] [Prod] [Prod] [Prod]  ▶          │    │
│  │    Similar parts customers bought together  │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
├─────────────────────────────────────────────────────┤
│  FOOTER                                             │
└─────────────────────────────────────────────────────┘
```

### 4. MOBILE HOME PAGE (320px)

```
┌───────────────────────┐
│ Logo    ☰  🛒  👤     │
├───────────────────────┤
│ [🔍 Search SKU/Part]  │
├───────────────────────┤
│                        │
│  HERO (Mobile)        │
│  Gradient background  │
│  "Części do Maszyn"   │
│  [Search] [Catalog]   │
│                        │
├───────────────────────┤
│                        │
│  CATEGORIES (1 col)   │
│  ┌─────────────────┐  │
│  │ 🔵 Koła         │  │
│  └─────────────────┘  │
│  ┌─────────────────┐  │
│  │ 🟠 Wałki        │  │
│  └─────────────────┘  │
│  ┌─────────────────┐  │
│  │ 🟡 Hydraulika   │  │
│  └─────────────────┘  │
│  ... (scrollable)     │
│                        │
├───────────────────────┤
│  BESTSELLERS          │
│  (Vertical scroll)    │
│  ┌─────────────────┐  │
│  │    Prod 1       │  │
│  │    $2500        │  │
│  │  [Add to cart]  │  │
│  └─────────────────┘  │
│  ... (more products)  │
│                        │
├───────────────────────┤
│  NEWSLETTER           │
│  Email: [________]    │
│  [Subscribe]          │
├───────────────────────┤
│  FOOTER               │
│  About | Support      │
│  Legal | Social       │
└───────────────────────┘
```

---

## 📂 STRUKTURA KATEGORII PRODUKTÓW

### 1. GŁÓWNE KATEGORIE (LEVEL 1)

```
OOXO ASORTYMENT
├── KOŁA (Drive Wheels / Sprockets)
├── WAŁKI (Shafts / Rotators)
├── HYDRAULIKA (Hydraulic Components)
├── USZCZELNIENIA (Seals & Gaskets)
├── ŁOŻYSKA (Bearings)
├── SILNIKI (Engines)
├── POMPY (Pumps)
├── OŚWIETLENIE (Lighting)
├── FILTRY & OLEJE (Filters & Oils)
├── CZĘŚCI ELEKTRYCZNE (Electrical)
├── ZESPOŁY (Assemblies)
└── AKCESORIA (Accessories)
```

### 2. PODKATEGORIE (LEVEL 2-3)

#### A) KOŁA (Drive Wheels & Sprockets)

```
KOŁA
├── Koła napędowe (Drive Wheels)
│   ├── CAT - Caterpillar
│   │   ├── CAT 320, 330, 340, 350
│   │   ├── CAT 375, 385
│   │   └── CAT 950, 960 (Large)
│   ├── Komatsu
│   │   ├── PC100, PC120, PC200
│   │   ├── PC220, PC280
│   │   └── D65, D85 (Bulldozer)
│   ├── JCB
│   │   ├── 8014, 8018, 8020
│   │   └── 3CX, 4CX
│   ├── Volvo
│   │   ├── EC15, EC55, EC210
│   │   └── L20, L30 (Loader)
│   ├── Case
│   │   ├── CX50, CX80, CX100
│   │   └── 721, 821
│   ├── Hitachi
│   │   ├── EX35, EX55, EX120
│   │   └── ZX200, ZX300
│   ├── New Holland
│   ├── Kubota
│   ├── Takeuchi
│   ├── Yanmar
│   ├── Bomag
│   ├── Wacker Neuson
│   └── Inne marki
│
├── Koła satelitarne (Idler Wheels)
│   ├── CAT
│   ├── Komatsu
│   ├── JCB
│   └── Inne...
│
├── Koła zębate (Gears)
│   ├── Zębatka zwolnicy
│   ├── Zębatka napędu
│   ├── Zębatka jazdy
│   └── Komplety zębatek
│
└── Wieńce obrotu (Slew Bearings)
    ├── CAT
    ├── Komatsu
    ├── JCB
    └── Inne...
```

#### B) WAŁKI (Shafts / Drive Shafts)

```
WAŁKI
├── Wałek silnika obrotu (Swing Motor Shaft)
│   ├── CAT series
│   ├── Komatsu series
│   ├── JCB series
│   └── Inne marki
│
├── Wałek silnika jazdy (Travel Motor Shaft)
│   ├── CAT series
│   ├── Komatsu series
│   ├── JCB series
│   └── Inne marki
│
├── Wałek korbowy (Crankshaft)
│   ├── Silniki Caterpillar
│   ├── Silniki Komatsu
│   ├── Silniki Deutz
│   └── Inne...
│
├── Wał napędowy (Drive Shaft)
│   ├── Główny wał napędowy
│   ├── Wał pośredni
│   └── Wał pomocniczy
│
├── Ślizg silnika jazdy (Travel Motor Housing)
│   └── Dla każdej marki
│
└── Złożone zespoły wałków (Shaft Assemblies)
```

#### C) HYDRAULIKA (Hydraulic Components)

```
HYDRAULIKA
├── Pompy hydrauliczne (Hydraulic Pumps)
│   ├── Pompa silnika obrotu
│   ├── Pompa silnika jazdy
│   ├── Pompa główna
│   └── Pompy zabudowane
│
├── Siłowniki (Cylinders)
│   ├── Siłownik stępu (Bucket Cylinder)
│   ├── Siłownik ramienia (Boom Cylinder)
│   ├── Siłownik wysięgnika (Arm Cylinder)
│   ├── Siłownik jezdny (Travel Cylinder)
│   └── Siłowniki specjalne
│
├── Rozdzielacze (Control Valves)
│   ├── Rozdzielacz jazdy
│   ├── Rozdzielacz obrotu
│   ├── Rozdzielacz główny
│   └── Inne rozdzielacze
│
├── Filtr hydrauliczny (Hydraulic Filter)
│   ├── Filtr główny
│   ├── Filtr powrotny
│   └── Filtry zabudowane
│
├── Uszczelki hydrauliczne
│   └── Komplety uszczelnień
│
├── Przewody hydrauliczne (Hoses)
│   └── W różnych długościach
│
└── Zbiornik hydrauliczny (Reservoir)
```

#### D) USZCZELNIENIA (Seals)

```
USZCZELNIENIA
├── O-ringi (O-Rings)
│   └── Różne rozmiary (AS568 standard)
│
├── Uszczelki wałów (Shaft Seals)
│   ├── Uszczelka wału obrotu
│   ├── Uszczelka wału jazdy
│   └── Inne uszczelki wałów
│
├── Uszczelki tłoka (Piston Seals)
│   ├── Do siłowników obrotu
│   ├── Do siłowników jazdy
│   └── Do siłowników zabudowanych
│
├── Komplety uszczelnień (Seal Kits)
│   ├── Dla silnika obrotu
│   ├── Dla silnika jazdy
│   ├── Dla siłownika
│   └── Komplety mieszane
│
└── Inne uszczelki
    ├── Uszczelki termostatów
    ├── Uszczelki wymienników ciepła
    └── Uszczelki paski
```

#### E) ŁOŻYSKA (Bearings)

```
ŁOŻYSKA
├── Łożyska kulkowe (Ball Bearings)
│   └── Różne rozmiary
│
├── Łożyska walcowe (Roller Bearings)
│   └── Różne rozmiary
│
├── Łożyska tuleję (Bushings)
│   ├── Tulejki do czopów
│   ├── Tulejki do osi
│   └── Tulejki specjalne
│
├── Łożyska wieńca obrotu
│   └── Dla każdej marki
│
└── Komplety łożysk (Bearing Kits)
```

#### F) SILNIKI (Engines)

```
SILNIKI
├── Silniki spalinowe (Diesel Engines)
│   ├── Silniki Caterpillar (C3.4, C4.4, C6.6, C7.1)
│   ├── Silniki Komatsu (S4D102E, S6D102E)
│   ├── Silniki Deutz (TCD 2013, TCD 2.2)
│   ├── Silniki Yammer (4TNV, 3TNV)
│   └── Inne silniki
│
├── Komponenty silnika
│   ├── Tłoki (Pistons)
│   ├── Pierścienie tłokowe (Piston Rings)
│   ├── Wały korbowe (Crankshafts)
│   ├── Panewki (Bearing Shells)
│   └── Korbowody (Connecting Rods)
│
└── Zespoły silnika (Engine Assemblies)
```

#### G) POMPY (Pumps - Non-Hydraulic)

```
POMPY
├── Pompy olejowe (Oil Pumps)
├── Pompy wody (Water Pumps)
├── Pompy paliwa (Fuel Pumps)
├── Pompy powietrza (Air Pumps)
└── Inne pompy
```

#### H) OŚWIETLENIE (Lighting)

```
OŚWIETLENIE
├── Lampy przednie (Headlights)
├── Lampy tylne (Taillights)
├── Lampy robocze (Work Lights)
├── Lampki sygnalizacyjne
└── Kompletne zestawy oświetlenia
```

#### I) FILTRY & OLEJE (Filters & Oils)

```
FILTRY & OLEJE
├── FILTRY
│   ├── Filtry powietrza (Air Filters)
│   ├── Filtry paliwa (Fuel Filters)
│   ├── Filtry hydrauliczne (Hydraulic Filters)
│   ├── Filtry oleju (Oil Filters)
│   ├── Filtry kabinowe (Cabin Filters)
│   └── Komplety filtrów
│
├── OLEJE
│   ├── Olej silnikowy (Engine Oil)
│   │   └── Różne viskozności
│   ├── Olej hydrauliczny (Hydraulic Oil)
│   ├── Olej skrzyni biegów (Gear Oil)
│   └── Smary specjalne (Greases)
│
└── ZESTAWY SERVICE (Service Kits)
    ├── Mały serwis (filtry)
    ├── Duży serwis (filtry + olej)
    └── Kompleksowy serwis
```

#### J) CZĘŚCI ELEKTRYCZNE (Electrical)

```
CZĘŚCI ELEKTRYCZNE
├── Alternatory (Alternators)
├── Rozruszniki (Starters)
├── Baterie (Batteries)
├── Przełączniki (Switches)
├── Czujniki (Sensors)
├── Wiązki elektryczne (Wiring Harnesses)
├── Sterownicy (Controllers)
└── Światła (Lights)
```

#### K) ZESPOŁY (Assemblies)

```
ZESPOŁY
├── Zespół silnika (Engine Assembly)
├── Zespół napędu (Drive Unit)
├── Zespół obrotu (Swing Unit)
├── Zespół jezdny (Travel Unit)
├── Zespół ramienia (Boom Assembly)
├── Zespół wysięgnika (Arm Assembly)
├── Zespół stępu (Bucket Assembly)
└── Inne zespoły
```

#### L) AKCESORIA (Accessories)

```
AKCESORIA
├── Szyby (Glass Panels)
│   ├── Szyba przednia
│   ├── Szyba boczna
│   ├── Szyba tylna
│   └── Szyby osłony kabiny
│
├── Błotniki (Fenders)
├── Lusterka (Mirrors)
├── Klamki (Handles)
├── Zawiasy (Hinges)
├── Osłony (Covers)
├── Naklejki (Decals)
├── Części zawieszenia (Suspension)
└── Części obudowy (Body Parts)
```

---

## 🛣️ STRUKTURA PODSTRON

### Architektura Navigation

```
HOME (/)
├── KATALOG (/produkty)
│   ├── /produkty/koła
│   ├── /produkty/wałki
│   ├── /produkty/hydraulika
│   ├── /produkty/uszczelnienia
│   ├── /produkty/łożyska
│   ├── /produkty/silniki
│   ├── /produkty/pompy
│   ├── /produkty/oświetlenie
│   ├── /produkty/filtry-oleje
│   ├── /produkty/elektryka
│   ├── /produkty/zespoły
│   └── /produkty/akcesoria
│
├── WYSZUKIWANIE (/szukaj)
│   └── Advanced Search z filtrami
│
├── AUTORYZACJA
│   ├── /logowanie (Login)
│   ├── /rejestracja (Register)
│   ├── /reset-haslo (Password Reset)
│   └── /weryfikacja-email (Email Verification)
│
├── PROFIL UŻYTKOWNIKA (Protected)
│   ├── /konto (Account Overview)
│   ├── /konto/zamówienia (Order History)
│   ├── /konto/adresy (Saved Addresses)
│   ├── /konto/ulubione (Favorites)
│   ├── /konto/rabaty (My Discounts)
│   └── /konto/ustawienia (Settings)
│
├── ZAKUPY
│   ├── /produkty/[slug] (Product Detail)
│   ├── /koszyk (Shopping Cart)
│   ├── /koszyk/checkout (Checkout)
│   ├── /koszyk/potwierdzenie (Order Confirmation)
│   └── /zamówienia/[order-id] (Order Tracking)
│
├── INFORMACJE
│   ├── /o-nas (About Us)
│   ├── /kontakt (Contact)
│   ├── /faq (FAQ)
│   ├── /blog (Blog / Articles)
│   ├── /blog/[slug] (Blog Post)
│   ├── /dostawa (Shipping Info)
│   ├── /zwroty (Returns Policy)
│   ├── /polityka-prywatnosci (Privacy Policy)
│   ├── /warunki-sprzedazy (Terms & Conditions)
│   └── /promocje (Promotions)
│
├── ADMIN (Protected - Admin only)
│   ├── /admin (Dashboard)
│   ├── /admin/produkty (Product Management)
│   ├── /admin/zamówienia (Order Management)
│   ├── /admin/użytkownicy (User Management)
│   ├── /admin/rabaty (Discount Management)
│   ├── /admin/raporty (Reports)
│   ├── /admin/ustawienia (Settings)
│   └── /admin/analityka (Analytics)
│
└── API (Server-side)
    ├── /api/auth/* (Authentication)
    ├── /api/produkty/* (Products)
    ├── /api/kategorie/* (Categories)
    ├── /api/zamówienia/* (Orders)
    ├── /api/użytkownicy/* (Users)
    ├── /api/rabaty/* (Discounts)
    ├── /api/search (Search)
    ├── /api/upload (Image Upload)
    └── /api/webhooks/* (Stripe, etc)
```

### Szczegółowe Podstrony

```markdown
1. HOME (/)
   - Hero section z CTA
   - Featured categories
   - Bestsellers slider
   - "Why us" section
   - Newsletter signup
   - FAQ preview
   - Contact CTA

2. PRODUCT CATALOG (/produkty)
   - Dynamiczne filtrowanie
   - Search bar
   - Sorting options
   - Grid/List view toggle
   - Pagination
   - Category breadcrumbs
   - Related products widget

3. PRODUCT DETAIL (/produkty/[slug])
   - Image gallery (zoom, thumbnails)
   - Product specs table
   - Price (brutto/netto toggle)
   - Stock status badge
   - Add to cart / Inquiry
   - Related products
   - Reviews section
   - Specifications expandable

4. ADVANCED SEARCH (/szukaj)
   - Search by SKU
   - Search by part number
   - Search by machine + subsystem
   - Search by category
   - Advanced filters
   - Sort options
   - Save search option

5. SHOPPING CART (/koszyk)
   - Cart items list
   - Quantity editors
   - Remove item option
   - Cart summary (subtotal, tax, shipping)
   - Coupon code field
   - Continue shopping link
   - Checkout CTA

6. CHECKOUT (/koszyk/checkout)
   - Step 1: Login/Guest/Register
   - Step 2: Shipping address
   - Step 3: Shipping method
   - Step 4: Payment method
   - Step 5: Order summary
   - Order review
   - Place order button

7. LOGIN (/logowanie)
   - Email input + validation
   - Password input (show/hide)
   - Remember me checkbox
   - "Forgot password?" link
   - Register CTA
   - Social login (optional)

8. REGISTER (/rejestracja)
   - First name, Last name
   - Email + validation
   - Company name (optional)
   - NIP number (optional)
   - Phone number
   - Password requirements
   - Confirm password
   - Terms & conditions checkbox
   - GDPR consent
   - Register button

9. USER ACCOUNT (/konto)
   - Profile info section
   - Order history
   - Saved addresses
   - Favorites/Wishlist
   - Loyalty points
   - Discounts available
   - Account settings
   - Logout button

10. ABOUT US (/o-nas)
    - Company story (18 years)
    - Team photos
    - Values / Why us
    - Key numbers (sold parts, customers, years)
    - Certifications
    - Awards
    - Team bios

11. CONTACT (/kontakt)
    - Contact form
    - Map (location)
    - Phone numbers
    - Email addresses
    - Business hours
    - Chat widget
    - Social media links

12. FAQ (/faq)
    - Q&A pairs
    - Categories (Shipping, Returns, Payments, etc)
    - Expandable Q&A
    - Search within FAQ
    - "Still have questions?" CTA

13. BLOG (/blog)
    - Blog posts list
    - Latest posts featured
    - Category filter
    - Search posts
    - Featured image
    - Published date
    - Author info
    - Read more links

14. BLOG POST (/blog/[slug])
    - Full article content
    - Featured image
    - Author bio
    - Publication date
    - Category tag
    - Related posts (3 sidebar)
    - Comments section
    - Share buttons

15. ADMIN DASHBOARD (/admin)
    - Key metrics (orders, revenue, traffic)
    - Orders recent activity
    - Product stock alerts
    - User activity
    - Monthly analytics
    - Quick actions

16. ADMIN PRODUCTS (/admin/produkty)
    - Products list/table
    - Add new product form
    - Edit product modal
    - Bulk actions
    - Import/Export CSV
    - Product images upload
    - Category assignment
    - SKU management
    - Pricing management
    - Stock management

17. ADMIN ORDERS (/admin/zamówienia)
    - Orders list
    - Filter by status
    - Order detail view
    - Payment status
    - Shipping status
    - Customer info
    - Invoice generation
    - Order notes
    - Status update options
```

---

## 📦 LISTA PRODUKTÓW Z KONKURENCJI

### Źródła
- omexplus.pl
- kolaiwalki.pl
- serwis-kop.pl

### PRODUKTY - 50 Przykładów

| SKU | Nazwa Produktu | Kategoria | Marka | Maszyna | Cena Netto | Cena Brutto | Stock | Status |
|-----|---|---|---|---|---|---|---|---|
| KOL-CAT-001 | Koło gąsienicowe CAT PC200 | Koła | CAT | PC200, PC220 | 2500 | 3075 | 12 | Na magazynie |
| KOL-CAT-002 | Koło napędowe CAT 320 | Koła | CAT | 320, 330, 340 | 1800 | 2214 | 8 | Na magazynie |
| KOL-KOMATS-001 | Koło obrotu Komatsu D65 | Koła | Komatsu | D65, D85 | 3200 | 3936 | 0 | Zamówienie |
| KOL-JCB-001 | Wieniec obrotu JCB 3CX | Koła | JCB | 3CX, 4CX | 1500 | 1845 | 5 | Na magazynie |
| KOL-VOL-001 | Koło zębate Volvo EC210 | Koła | Volvo | EC210, EC290 | 2100 | 2583 | 3 | Na magazynie |
| WAL-CAT-001 | Wałek silnika obrotu CAT 320 | Wałki | CAT | 320, 330, 340 | 1200 | 1476 | 15 | Na magazynie |
| WAL-KOM-001 | Wałek jazdy Komatsu PC200 | Wałki | Komatsu | PC200, PC220 | 1400 | 1722 | 7 | Na magazynie |
| WAL-JCB-001 | Wałek obrotu JCB 8014 | Wałki | JCB | 8014, 8018 | 950 | 1169 | 20 | Na magazynie |
| WAL-CASE-001 | Wałek korbowy Case CX50 | Wałki | Case | CX50, CX80 | 2300 | 2829 | 2 | Na magazynie |
| WAL-VOLVO-001 | Ślizg silnika Volvo EC55 | Wałki | Volvo | EC55, EC60 | 1100 | 1353 | 6 | Na magazynie |
| SIL-CAT-001 | Siłownik stępu CAT 320 | Hydraulika | CAT | 320, 330, 340 | 3500 | 4305 | 1 | Zamówienie |
| SIL-KOM-001 | Siłownik ramienia Komatsu PC200 | Hydraulika | Komatsu | PC200, PC220 | 3800 | 4674 | 0 | Brak |
| SIL-JCB-001 | Siłownik wysięgnika JCB 3CX | Hydraulika | JCB | 3CX, 4CX | 2800 | 3444 | 4 | Na magazynie |
| POL-CAT-001 | Pompa hydrauliczna CAT 320 | Hydraulika | CAT | 320, 330, 340 | 4200 | 5166 | 0 | Zamówienie |
| ROZ-KOM-001 | Rozdzielacz jazdy Komatsu D65 | Hydraulika | Komatsu | D65, D85 | 2500 | 3075 | 2 | Na magazynie |
| FIL-HYD-001 | Filtr hydrauliczny universal | Hydraulika | Universal | Wszystkie | 180 | 221.4 | 50 | Na magazynie |
| USZ-KIT-001 | Kompleta uszczelnień CAT | Uszczelnienia | CAT | 320, 330, 340 | 450 | 553.5 | 25 | Na magazynie |
| USZ-OR-001 | O-ring 30x3 (AS568) | Uszczelnienia | Universal | Wszystkie | 15 | 18.45 | 200 | Na magazynie |
| USZ-WAL-001 | Uszczelka wału obrotu | Uszczelnienia | Universal | Wszystkie | 120 | 147.6 | 100 | Na magazynie |
| LOZ-KUL-001 | Łożysko kulkowe 6206 | Łożyska | FAG | Wszystkie | 85 | 104.55 | 80 | Na magazynie |
| LOZ-WAL-001 | Łożysko walcowe 6309 | Łożyska | SKF | Wszystkie | 95 | 116.85 | 60 | Na magazynie |
| LOZ-TUL-001 | Tulejka miedziana 15x20x20 | Łożyska | Universal | Wszystkie | 25 | 30.75 | 300 | Na magazynie |
| SYL-CAT-C6-001 | Silnik CAT C6.6 (Reman) | Silniki | CAT | CAT 345, 365 | 15000 | 18450 | 0 | Zamówienie |
| SYL-KOM-S6D-001 | Silnik Komatsu S6D (Reman) | Silniki | Komatsu | Komatsu D85 | 14000 | 17220 | 0 | Zamówienie |
| PIS-CAT-001 | Tłok CAT 3054 | Silniki | CAT | CAT engines | 1200 | 1476 | 5 | Na magazynie |
| PER-CAT-001 | Pierścienie tłokowe CAT | Silniki | CAT | CAT engines | 450 | 553.5 | 15 | Na magazynie |
| POL-OLE-001 | Pompa olejowa CAT | Silniki | CAT | CAT 320 | 800 | 984 | 3 | Na magazynie |
| FIL-OLEJ-001 | Filtr oleju CAT | Filtry & Oleje | CAT | CAT all | 150 | 184.5 | 100 | Na magazynie |
| FIL-PAL-001 | Filtr paliwa Komatsu | Filtry & Oleje | Komatsu | Komatsu all | 120 | 147.6 | 80 | Na magazynie |
| FIL-POW-001 | Filtr powietrza universal | Filtry & Oleje | Universal | Wszystkie | 100 | 123 | 150 | Na magazynie |
| OLEJ-HYD-005 | Olej hydrauliczny HLP-D 5L | Filtry & Oleje | Mobil | Wszystkie | 80 | 98.4 | 30 | Na magazynie |
| OLEJ-HYD-020 | Olej hydrauliczny HLP-D 20L | Filtry & Oleje | Shell | Wszystkie | 250 | 307.5 | 10 | Na magazynie |
| OLEJ-SILNIK-010 | Olej silnikowy 10W-40 10L | Filtry & Oleje | TOTAL | Wszystkie | 200 | 246 | 20 | Na magazynie |
| ALT-CAT-001 | Alternator CAT 320 | Elektryka | Bosch | CAT 320, 330 | 950 | 1169.5 | 4 | Na magazynie |
| ALT-KOM-001 | Alternator Komatsu D65 | Elektryka | Bosch | Komatsu D65 | 1050 | 1291.5 | 2 | Na magazynie |
| RZ-CAT-001 | Rozrusznik CAT | Elektryka | Bosch | CAT all | 800 | 984 | 6 | Na magazynie |
| CZU-CISM-001 | Czujnik ciśnienia oleju | Elektryka | Bosch | Wszystkie | 150 | 184.5 | 50 | Na magazynie |
| LMP-LED-001 | Lampa robocza LED 12V | Oświetlenie | Universal | Wszystkie | 180 | 221.4 | 40 | Na magazynie |
| LMP-PRZEDNIA-001 | Lampa przednia CAT | Oświetlenie | CAT | CAT 320, 330 | 250 | 307.5 | 15 | Na magazynie |
| SZY-PRZEDNIA-001 | Szyba przednia CAT 320 | Akcesoria | Universal | CAT 320 | 600 | 738 | 3 | Na magazynie |
| SZY-BOCZNA-001 | Szyba boczna universal | Akcesoria | Universal | Wszystkie | 350 | 430.5 | 10 | Na magazynie |
| BLO-KAT-001 | Błotnik CAT | Akcesoria | CAT | CAT all | 400 | 492 | 8 | Na magazynie |
| LUS-WEWN-001 | Lusterko wewnętrzne | Akcesoria | Universal | Wszystkie | 120 | 147.6 | 25 | Na magazynie |
| KLA-KABINA-001 | Klamka drzwi kabiny | Akcesoria | Universal | Wszystkie | 80 | 98.4 | 50 | Na magazynie |
| ZAW-DRZWI-001 | Zawiasy drzwi CAT | Akcesoria | CAT | CAT all | 150 | 184.5 | 30 | Na magazynie |
| OSL-SILNIKA-001 | Osłona silnika | Akcesoria | Universal | Wszystkie | 300 | 369 | 12 | Na magazynie |
| OSL-OBROTU-001 | Osłona łańcucha | Akcesoria | Universal | Wszystkie | 180 | 221.4 | 20 | Na magazynie |
| NAK-MARKA-CAT | Naklejka logo CAT | Akcesoria | CAT | Wszystkie | 20 | 24.6 | 500 | Na magazynie |
| KOM-SERW-001 | Komplet mały serwis CAT | Zestawy | CAT | CAT 320, 330 | 1500 | 1845 | 5 | Na magazynie |
| KOM-SERW-002 | Komplet duży serwis CAT | Zestawy | CAT | CAT 320, 330 | 2200 | 2706 | 2 | Na magazynie |
```

---

## 📊 PRODUKTY DOSTĘPNE NA KONKURENCJI

### OMEXPLUS.PL - Najpopularniejsze

```markdown
1. Koła gąsienicowe (Drive Wheels)
2. Wałki obrotu (Swing Shafts)
3. Siłowniki (Hydraulic Cylinders)
4. Filtrami hydrauliczne
5. Pompy hydrauliczne
6. Rozdzielacze (Valves)
7. Szyby (Glass panels)
8. Uszczelki komplety
9. Części silnika
10. Lusterka
```

### KOLAIWALKI.PL - Specjalizacja

```markdown
Głównie WAŁKI (Shafts):
1. Wałek silnika obrotu
2. Wałek silnika jazdy
3. Ślizg silnika jazdy
4. Koło satelitarne
5. Zębatka zwolnicy
6. Zespoły napędowe

Marki:
- Kubota
- Schaeff
- Terex
- Neuson
- Hitachi
- JCB
- Bobcat
- Takeuchi
- Sunward
- Wacker
```

### PRZYKŁADOWE PRODUKTY DO ZAIMPORTOWANIA

```
KOL-CAT-304 | Szyba przednia CAT 304 | CAT | 4961131 | Akcesoria | 400 zł
KOL-CAT-304B | Szyba drzwi CAT 304 | CAT | 4961132 | Akcesoria | 350 zł
POL-FUEL-YAMMER | Pompa paliwa Yammer | Yammer | 129211-42290 | Silniki | 850 zł
CZU-DEUZ-TCD | Czujnik ciśnienia Deutz | Deutz | 04467635 | Elektryka | 550 zł
WAL-KUBOTA-041 | Wałek Kubota KX 41-3V | Kubota | 010010A | Wałki | 1200 zł
WAL-SCHAEFF-HR | Wałek Schaeff HR 12 | Schaeff | 010030A | Wałki | 1100 zł
SIL-DOOSAN-DX80 | Siłownik Doosan DX80R | Doosan | K1051825 | Hydraulika | 2800 zł
WYL-BOMAG | Wyłącznik Bomag BT60 | Bomag | 54270234 | Elektryka | 280 zł
PAS-YAMMER-B25 | Pasek klinowy Yammer | Yammer | 129211-42290 | Silniki | 180 zł
```

---

## 🎯 STRATEGY NOTES

1. **Category Priority** (START WITH):
   - Koła (Wheels/Sprockets) - 25% asortyment
   - Wałki (Shafts) - 25% asortyment
   - Hydraulika - 20% asortyment
   - Filtry & Oleje - 15% asortyment
   - Uszczelnienia - 10% asortyment
   - Akcesoria - 5% asortyment

2. **SEO Keywords Priority**:
   - "Części do maszyn budowlanych"
   - "Koła gąsienicowe CAT"
   - "Wałek obrotu"
   - "Części zamienne JCB"
   - "Hydraulika do koparek"
   - "[Brand] części [model]"

3. **User Personas**:
   - B2B Contractors (main)
   - Equipment Maintenance Team
   - Equipment Rental Companies
   - Independent Mechanics
   - Equipment Dealers

4. **MVP Phase**:
   - Start with 50-100 products
   - Koła + Wałki + Key accessories
   - Key brands only (CAT, Komatsu, JCB)
   - Scale to 1000+ products

---
