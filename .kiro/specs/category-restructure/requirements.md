# Requirements Document: Category & Subcategory Restructure

## Introduction

The OMEX e-commerce platform requires a comprehensive restructuring of its product category hierarchy. The current system has a simplified 18-category structure, but the business needs a more detailed, multi-level categorization system with 13 main categories and up to 15 subcategories each. This restructure will improve product discoverability, enable better inventory management, and provide customers with a more intuitive browsing experience.

The new structure includes detailed subcategories for complex product areas like Hydraulics (14 subcategories), Undercarriage (14 subcategories), and Electrical Systems (15 subcategories), with some subcategories containing further nested levels (e.g., Pump Parts, Swing Motors, Final Drives).

## Glossary

- **Category**: Top-level product grouping (e.g., "Filtry", "Hydraulika")
- **Subcategory**: Second-level product grouping under a category (e.g., "Filtry powietrza" under "Filtry")
- **Sub-subcategory**: Third-level grouping for complex categories (e.g., "Uszczelki napinacza gąsienicy" under "Napinacze gąsienicy")
- **Slug**: URL-friendly identifier for categories (e.g., "filtry-powietrza")
- **Hierarchy**: The parent-child relationship structure between categories
- **Backend**: Medusa.js server handling category data and API endpoints
- **Frontend**: Next.js storefront displaying categories in navigation and filters
- **Database**: PostgreSQL storing category records with relationships

## Requirements

### Requirement 1: Implement Complete Category Hierarchy Structure

**User Story:** As a product manager, I want to organize products into a comprehensive 13-category structure with detailed subcategories, so that customers can easily find products and inventory can be properly managed.

#### Acceptance Criteria

1. WHEN the backend initializes THEN the system SHALL create exactly 13 main categories with the following names: Filtry, Silnik Części & Osprzęt Silnika, Układ Hamulcowy, Podwozia do Maszyn Budowlanych, Układ Hydrauliczny, Smarowanie, Układ Chłodzenia, Układ Jezdny, Elektryka, Ślizgi, Elementy Obrotu i Ramion, Nadwozie, Akcesoria
2. WHEN a main category is created THEN the system SHALL assign it a unique slug in kebab-case format derived from the category name
3. WHEN subcategories are created THEN the system SHALL establish parent-child relationships where each subcategory references its parent category by ID
4. WHEN the category hierarchy is queried THEN the system SHALL return categories organized in a tree structure with all parent-child relationships intact
5. WHEN a category is retrieved by slug THEN the system SHALL return the category with all its subcategories and metadata

### Requirement 2: Create Detailed Subcategories for Each Main Category

**User Story:** As a customer, I want to browse products organized into detailed subcategories, so that I can quickly find the specific product type I need.

#### Acceptance Criteria

1. WHEN the Filtry category is accessed THEN the system SHALL display 7 subcategories: Filtry powietrza, Filtry hydrauliczne, Filtry oleju, Filtry paliwa, Filtry kabinowe, Filtry Adblue, Filtry klimatyzacji, Filtry odpowietrzające
2. WHEN the Silnik Części & Osprzęt Silnika category is accessed THEN the system SHALL display 20+ subcategories including Zestawy uszczelek, Uszczelki pod głowicę, Rozrząd, Koła pasowe, Tłoki, Korbowody, Pompy wtryskowe, Wtryski, Pompy paliwa, Pompy oleju, Bloki silnika, Termostaty, Tłumiki, Poduszki pod silnik
3. WHEN the Układ Hamulcowy category is accessed THEN the system SHALL display 8 subcategories: Klocki hamulcowe, Pompki hamulcowe, Przewody hamulcowe, Tarcze hamulcowe, Okładziny hamulcowe, Zbiorniczki płynu hamulcowego, Uszczelki, Tarczki hamulcowe
4. WHEN the Podwozia do Maszyn Budowlanych category is accessed THEN the system SHALL display 14 subcategories including Koła napinające, Koła napędowe, Gąsienice gumowe, Rolki górne, Rolki dolne, Napinacze gąsienicy, Płytki gąsienicy, Łańcuchy gąsienicy, Zwolnice, Reduktory jazdy, Silniki jazdy
5. WHEN the Układ Hydrauliczny category is accessed THEN the system SHALL display 14 subcategories including Pompy hydrauliczne, Regulatory i sterowniki, Rozdzielacze hydrauliczne, Siłowniki hydrauliczne, Zawory hydrauliczne, Silniki jazdy, Obrót/Kolumny obrotu, Reduktory obrotu
6. WHEN the Smarowanie category is accessed THEN the system SHALL display 6 subcategories: Oleje silnikowe, Oleje hydrauliczne, Oleje do mostów i zwolnic, Oleje do skrzyń biegów, Smary, Elementy smarne
7. WHEN the Układ Chłodzenia category is accessed THEN the system SHALL display 9 subcategories: Chłodnice, Pompy wody, Termostaty, Wentylatory, Węże do chłodnic wody, Zbiorniki wyrównawcze, Kompresory, Osuszacze, Pozostałe
8. WHEN the Układ Jezdny category is accessed THEN the system SHALL display 15 subcategories including Felgi, Mosty, Części do zwolnic, Półosie, Wałki atakujące, Uszczelniacze, Sworznie, Drążki kierownicze, Flansze, Krzyżaki, Łożyska, Piasty, Szpilki, Wały napędowe, Amortyzatory
9. WHEN the Elektryka category is accessed THEN the system SHALL display 15 subcategories: Alternatory, Rozruszniki, Regulatory napięcia, Bezpieczniki, Cewki gaszenia, Czujniki, Przełączniki, Przekaźniki, Stacyjki, Liczniki, Wskaźniki, Kluczyki, Akumulatory, Joysticki, Diody, Dźwignie, Sterowniki
10. WHEN the Ślizgi category is accessed THEN the system SHALL display 3 subcategories: Podkładki do ślizgów, Ślizgi wysięgnika ramienia, Ślizgi na stabilizatory
11. WHEN the Elementy Obrotu i Ramion category is accessed THEN the system SHALL display 5 subcategories: Tuleje ramienia, Sworznie ramienia, Uszczelki tulei, Zabezpieczenia sworni, Podkładki dystansowe
12. WHEN the Nadwozie category is accessed THEN the system SHALL display 11 subcategories: Szyby, Drzwi, Błotniki, Klamki, Lusterka, Zamki, Wycieraczki, Pokrywy silnika, Lampy, Odbojniki, Kierunkowskazy, Przyciski, Nagrzewnice, Naklejki, Amortyzatory
13. WHEN the Akcesoria category is accessed THEN the system SHALL display 12 subcategories: Bagnety, Dyski, Łączniki, Śruby, Obejmy, Nakrętki, Opaski, Klemy, Węże, Zaślepki, Zatyczki, Rurki

### Requirement 3: Implement Multi-Level Subcategories for Complex Categories

**User Story:** As a product specialist, I want to organize complex product areas into multiple hierarchy levels, so that products can be precisely categorized and easily found.

#### Acceptance Criteria

1. WHEN the Napinacze gąsienicy subcategory is accessed THEN the system SHALL display 3 sub-subcategories: Uszczelki napinacza gąsienicy, Tłoki do napinacza gąsienicy, Zawory smarne kalamitki napinacza gąsienicy
2. WHEN the Zwolnice subcategory is accessed THEN the system SHALL display 2 sub-subcategories: Reduktory jazdy, Silniki jazdy
3. WHEN the Reduktory jazdy sub-subcategory is accessed THEN the system SHALL display 2 further levels: Kompletne reduktory jazdy, Części do reduktorów jazdy
4. WHEN the Silniki jazdy sub-subcategory is accessed THEN the system SHALL display 2 further levels: Kompletne silniki jazdy, Części do silników jazdy
5. WHEN the Pompy hydrauliczne subcategory is accessed THEN the system SHALL display 8 sub-subcategories: Części do pomp hydraulicznych, Cylindry do pomp hydraulicznych, Tłoczki do pomp hydraulicznych, Tarcze cierne i rozdzielcze, Łożyska do pomp hydraulicznych, Uszczelki i zestawy uszczelek, Pozostałe części do pomp hydraulicznych
6. WHEN the Części do pomp hydraulicznych sub-subcategory is accessed THEN the system SHALL display 5 further levels: Bieżnie tłoczków, Kołyski, Kule, Sprężyny, Separatory tłoczków
7. WHEN the Rozdzielacze hydrauliczne subcategory is accessed THEN the system SHALL display 5 sub-subcategories: Suwaki do rozdzielaczy, Uszczelki do rozdzielaczy, Zawory do rozdzielaczy, Cewki i elektrozawory do rozdzielaczy, Czujniki do rozdzielaczy
8. WHEN the Siłowniki hydrauliczne subcategory is accessed THEN the system SHALL display 4 sub-subcategories: Uszczelki do siłowników hydraulicznych, Tłoczyska do siłowników, Dławice do siłowników, Tuleje i łożyska do siłowników
9. WHEN the Obrót/Kolumny obrotu subcategory is accessed THEN the system SHALL display 3 sub-subcategories: Silniki obrotu, Wałki obrotu do koparek, Reduktory obrotu
10. WHEN the Silniki obrotu sub-subcategory is accessed THEN the system SHALL display 2 further levels: Kompletne silniki obrotu, Części do silników obrotu
11. WHEN the Reduktory obrotu sub-subcategory is accessed THEN the system SHALL display 2 further levels: Kompletne reduktory obrotu, Części do reduktorów obrotu

### Requirement 4: Persist Category Structure to Database

**User Story:** As a system administrator, I want the category structure to be persisted in the database, so that it survives application restarts and can be queried efficiently.

#### Acceptance Criteria

1. WHEN the application starts THEN the system SHALL load all categories from the database and populate the category tree in memory
2. WHEN a new category is created via API THEN the system SHALL persist it to the database with all metadata and relationships
3. WHEN a category is updated THEN the system SHALL update the database record and maintain referential integrity with child categories
4. WHEN a category is deleted THEN the system SHALL remove it from the database and handle orphaned subcategories according to business rules
5. WHEN the database is queried for categories THEN the system SHALL return results with proper parent-child relationships and all metadata intact

### Requirement 5: Expose Category API Endpoints

**User Story:** As a frontend developer, I want to access category data via REST API endpoints, so that I can display categories in the navigation and filters.

#### Acceptance Criteria

1. WHEN a GET request is made to `/api/categories` THEN the system SHALL return all top-level categories with their metadata
2. WHEN a GET request is made to `/api/categories/:slug` THEN the system SHALL return the category with all its subcategories and metadata
3. WHEN a GET request is made to `/api/categories/:slug/subcategories` THEN the system SHALL return only the direct subcategories of the specified category
4. WHEN a GET request is made to `/api/categories/tree` THEN the system SHALL return the complete category hierarchy as a nested tree structure
5. WHEN a GET request is made to `/api/categories/:slug/breadcrumb` THEN the system SHALL return the full path from root to the specified category for breadcrumb navigation

### Requirement 6: Display Categories in Frontend Navigation

**User Story:** As a customer, I want to see all categories and subcategories in the header navigation, so that I can easily browse products.

#### Acceptance Criteria

1. WHEN the header component loads THEN the system SHALL fetch all top-level categories from the API
2. WHEN a customer hovers over a category in the navigation THEN the system SHALL display a mega-menu with all subcategories
3. WHEN a customer clicks on a subcategory THEN the system SHALL navigate to the category page with products filtered by that subcategory
4. WHEN the category page loads THEN the system SHALL display breadcrumb navigation showing the full category path
5. WHEN a customer views a category with sub-subcategories THEN the system SHALL display a sidebar or filter showing the nested hierarchy

### Requirement 7: Implement Category Filtering in Product Search

**User Story:** As a customer, I want to filter products by category and subcategory, so that I can narrow down my search results.

#### Acceptance Criteria

1. WHEN a customer visits a category page THEN the system SHALL display all products belonging to that category and its subcategories
2. WHEN a customer selects a subcategory filter THEN the system SHALL update the product list to show only products in that subcategory
3. WHEN a customer selects multiple subcategories THEN the system SHALL display products that belong to any of the selected subcategories
4. WHEN a customer applies category filters THEN the system SHALL update the URL with filter parameters for bookmarking and sharing
5. WHEN a customer clears category filters THEN the system SHALL reset the product list to show all products in the parent category

### Requirement 8: Seed Database with Complete Category Structure

**User Story:** As a system administrator, I want to seed the database with the complete category structure, so that the application starts with all categories ready to use.

#### Acceptance Criteria

1. WHEN the seed script runs THEN the system SHALL create all 13 main categories with correct metadata
2. WHEN the seed script runs THEN the system SHALL create all subcategories with correct parent-child relationships
3. WHEN the seed script runs THEN the system SHALL create all sub-subcategories with correct hierarchy levels
4. WHEN the seed script completes THEN the system SHALL verify that all categories are properly linked and no orphaned records exist
5. WHEN the seed script is run multiple times THEN the system SHALL handle duplicates gracefully without creating duplicate records

### Requirement 9: Provide Category Management Admin Interface

**User Story:** As an admin user, I want to manage categories through an admin interface, so that I can add, edit, or delete categories without code changes.

#### Acceptance Criteria

1. WHEN an admin accesses the category management page THEN the system SHALL display all categories in a hierarchical tree view
2. WHEN an admin clicks "Add Category" THEN the system SHALL display a form to create a new category with parent selection
3. WHEN an admin edits a category THEN the system SHALL allow updating name, slug, description, and parent category
4. WHEN an admin deletes a category THEN the system SHALL prompt for confirmation and handle subcategories according to business rules
5. WHEN an admin saves category changes THEN the system SHALL update the database and invalidate relevant caches

### Requirement 10: Implement Category Caching Strategy

**User Story:** As a system architect, I want to implement caching for category data, so that the application performs efficiently under load.

#### Acceptance Criteria

1. WHEN categories are loaded THEN the system SHALL cache the complete category tree in memory
2. WHEN a category is updated THEN the system SHALL invalidate the relevant cache entries
3. WHEN the cache expires THEN the system SHALL reload categories from the database
4. WHEN multiple requests for the same category are made THEN the system SHALL serve results from cache without database queries
5. WHEN the application restarts THEN the system SHALL rebuild the cache from the database on first access

