# 🚀 OMEX E-Commerce Fresh Start - 3 Master Prompts

## 📌 KONTEKST CAŁEJ ROZMOWY

**Projekt**: OMEX - B2B E-Commerce dla części przemysłowych (hydraulika, filtry, silniki, etc.)
**Stack**: Medusa (backend) + Next.js (frontend)
**Kategorie**: 18 głównych + 52 podkategorie hierarchiczne
**Produkty**: 50,000+ (hydraulika 40%, filtry 35%, inne 25%)
**Top Operatorzy**: InPost, DPD, DHL
**Języki**: Polski, Angielski, Niemiecki
**Integracje**: Stripe, SendGrid, i18n, Dark Mode

---

## 🎯 PROMPT MASTER #1: MEDUSA BACKEND - FRESH SETUP

### Wklej dokładnie to do ChatGPT/Claude:

```
COMPREHENSIVE PROJECT CONTEXT:
Buduję OMEX - B2B e-commerce dla części przemysłowych (kopiarki, hydraulika, filtry, itd.).
To jest FRESH START od zera. Potrzebuje kompletnego backendowego setup'u.

PROJECT STRUCTURE & DATA:
- 18 głównych kategorii (Hydraulika 40%, Filtry 35%, Silnik 15%, Osprzęt 5%, Inne 5%)
- 52 podkategorii (hierarchiczne)
- 50,000+ produktów
- Multi-language: PL, EN, DE (IMPORTANT!)
- Dark/Light Mode support
- B2B Features: VAT calculation, bulk orders, purchase orders

DETAILED REQUIREMENTS:

1. DATABASE SCHEMA:
   - Products (id, name, description, sku, part_number, price, cost, stock)
   - Categories (18 main + 52 sub, hierarchical parent_id)
   - Product_Categories (junction table - many-to-many)
   - Variants (color, size, material - if applicable)
   - Stock (warehouse management - multiple locations)
   - Orders (order_items, customer_id, total, status, payment_status)
   - Customers (company name, VAT ID, addresses, billing/shipping)
   - Prices (different pricing per customer type - B2B wholesale)
   - Technical_Specs (JSON for hydraulics, engines, etc.)
   - Translations (product_id, locale, translated fields)

2. MEDUSA BACKEND CORE:
   - Product service (CRUD with hierarchical categories)
   - Category service (nested categories - /hydraulika/pompy/pompy-tłokowe)
   - Cart service (B2B - multiple payment terms, line items)
   - Order service (with PO numbers, delivery dates, payment terms)
   - Customer service (B2B profiles - companies, tax IDs)
   - Fulfillment service (InPost/DPD/DHL integration stubs)
   - Payment service (Stripe integration stubs)

3. MEDUSA PLUGINS NEEDED:
   - Database migrations (create all tables)
   - Product plugin (custom fields: part_number, equipment_type, technical_specs)
   - Category plugin (hierarchical structure - parent_id)
   - Customer plugin (B2B fields: company_name, tax_id, purchase_order_number)
   - Stock plugin (multiple warehouses/locations)
   - Fulfillment plugin (shipping integrations: InPost, DPD, DHL)
   - Payment plugin (Stripe integration)
   - Email plugin (SendGrid events)

4. API ENDPOINTS (MEDUSA ADMIN + STORE):
   ADMIN ENDPOINTS (/admin):
   - POST /products (create with categories, translations, specs)
   - GET /products (list with filters: category, price, availability)
   - PUT /products/:id (update with all fields)
   - DELETE /products/:id
   - GET/POST /product-categories (hierarchical)
   - GET/POST /orders (with status workflow)
   - GET/POST /customers (B2B profiles)
   - GET /stock (inventory by location)
   - GET /analytics (sales trends, top products)
   - POST /webhooks/stripe, /webhooks/sendgrid
   
   STORE ENDPOINTS (/store - public):
   - GET /products (with pagination, filters)
   - GET /products/:id (detailed view)
   - GET /product-categories (tree structure)
   - GET /products/search (full-text search)
   - POST /carts (create)
   - GET /carts/:id (get with line items)
   - POST /carts/:id/line-items (add to cart)
   - POST /carts/:id/complete-cart (checkout)
   - GET /orders/:id (customer orders)

5. TRANSLATIONS SYSTEM:
   - All product descriptions translated (PL, EN, DE)
   - Category names translated
   - System messages translated
   - Dynamic content translation on Medusa level
   - Translation migration: translate_product_descriptions function
   - Fallback: PL is primary, EN/DE fallback to EN

6. B2B SPECIFIC:
   - Minimum order quantities per product
   - Tiered pricing (1-10 units, 11-50, 50+)
   - Purchase order support
   - Net payment terms (NET30, NET60)
   - Custom pricing per customer
   - Bulk order workflows

7. MEDUSA EXTENSIONS/MIGRATIONS:
   ```sql
   -- Products extended fields
   ALTER TABLE product ADD COLUMN part_number VARCHAR(255);
   ALTER TABLE product ADD COLUMN equipment_type VARCHAR(255);
   ALTER TABLE product ADD COLUMN technical_specs JSONB;
   ALTER TABLE product ADD COLUMN min_order_qty INTEGER DEFAULT 1;
   
   -- Categories hierarchical
   ALTER TABLE product_category ADD COLUMN parent_id UUID REFERENCES product_category(id);
   
   -- Customers B2B
   ALTER TABLE customer ADD COLUMN company_name VARCHAR(255);
   ALTER TABLE customer ADD COLUMN tax_id VARCHAR(20);
   ALTER TABLE customer ADD COLUMN customer_type ENUM('retail', 'b2b', 'wholesale');
   
   -- Orders extended
   ALTER TABLE order ADD COLUMN purchase_order_number VARCHAR(255);
   ALTER TABLE order ADD COLUMN delivery_date DATE;
   ALTER TABLE order ADD COLUMN payment_terms VARCHAR(50);
   ALTER TABLE order ADD COLUMN warehouse_id UUID;
   
   -- Prices (per customer tier)
   CREATE TABLE price_list (
     id UUID PRIMARY KEY,
     product_id UUID REFERENCES product(id),
     customer_type ENUM('retail', 'b2b', 'wholesale'),
     quantity_min INTEGER,
     quantity_max INTEGER,
     price DECIMAL(10,2),
     created_at TIMESTAMP
   );
   
   -- Stock (multi-warehouse)
   CREATE TABLE inventory (
     id UUID PRIMARY KEY,
     product_id UUID REFERENCES product(id),
     warehouse_id VARCHAR(50),
     quantity INTEGER,
     reserved INTEGER,
     updated_at TIMESTAMP
   );
   
   -- Translations
   CREATE TABLE product_translation (
     id UUID PRIMARY KEY,
     product_id UUID REFERENCES product(id),
     locale VARCHAR(5),
     title VARCHAR(255),
     description TEXT,
     created_at TIMESTAMP
   );
   ```

8. ENVIRONMENT VARIABLES (.env):
   DATABASE_URL=postgres://user:pass@localhost:5432/omex_db
   MEDUSA_BACKEND_URL=http://localhost:9000
   JWT_SECRET=your-jwt-secret
   ADMIN_BACKEND_URL=http://localhost:9000
   ADMIN_UI_URL=http://localhost:7001
   
   # Stripe (later integration)
   STRIPE_API_KEY=sk_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   
   # SendGrid (later integration)
   SENDGRID_API_KEY=SG....
   SENDGRID_SENDER_EMAIL=noreply@omex.pl
   
   # File storage
   FILE_SERVICE_LOCAL_URL=http://localhost:9000
   
   # Feature flags
   MEDUSA_FF_PRODUCT_CATEGORIES=true
   MEDUSA_FF_ORDER_EDITS=true

9. SERVICES TO CREATE:
   - ProductService (override default - add translations, specs, hierarchical categories)
   - CategoryService (hierarchical tree, parent_id management)
   - CustomerService (B2B profiles, tax validation)
   - InventoryService (multi-warehouse stock management)
   - PricingService (tiered pricing calculation)
   - OrderService (extended B2B workflows)
   - SearchService (full-text search on products + filters)
   - TranslationService (handle product translations)

10. DELIVERABLES EXPECTED:
    - Medusa project initialized (medusa new omexplus-ecommerce)
    - Database migrations (all tables)
    - Models/Entities (TypeScript)
    - Services (CRUD operations)
    - API routes (Admin + Store endpoints)
    - Seed data (18 categories, sample 50 products with translations)
    - Type definitions (.ts interfaces)
    - .env.example
    - package.json with all dependencies
    - README.md with setup instructions
    - Docker compose (optional - postgres setup)

11. IMPLEMENTATION NOTES:
    - Use Medusa 2.0+ (latest)
    - TypeScript everywhere
    - PostgreSQL default database
    - Hierarchical categories (nested - unlimited depth)
    - Translations at DB level (not on frontend)
    - B2B is first-class feature (not afterthought)
    - Stock tracked per warehouse
    - Prices dynamic (per customer type + qty)
    - All timestamps UTC
    - Soft deletes where appropriate

STRUCTURE EXAMPLE:
omexplus-ecommerce/
├── src/
│   ├── admin/
│   ├── api/
│   │   ├── store/
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── search/
│   │   │   ├── carts/
│   │   │   └── orders/
│   │   ├── admin/
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── customers/
│   │   │   ├── orders/
│   │   │   ├── stock/
│   │   │   └── analytics/
│   │   └── webhooks/
│   ├── models/
│   │   ├── product.ts
│   │   ├── category.ts
│   │   ├── customer.ts
│   │   ├── order.ts
│   │   └── inventory.ts
│   ├── services/
│   │   ├── product-service.ts
│   │   ├── category-service.ts
│   │   ├── customer-service.ts
│   │   ├── inventory-service.ts
│   │   ├── pricing-service.ts
│   │   ├── order-service.ts
│   │   ├── search-service.ts
│   │   └── translation-service.ts
│   ├── migrations/
│   └── subscribers/

WHAT YOU'LL GET:
✅ Complete Medusa backend setup
✅ All database schema + migrations
✅ All API endpoints (Store + Admin)
✅ B2B features baked in
✅ Multi-language ready
✅ Hierarchical categories working
✅ Stock management system
✅ Dynamic pricing system
✅ Sample data (18 categories, products)
✅ Type definitions
✅ Ready to connect Next.js frontend
✅ Ready for Stripe/SendGrid/Shipping integration

IMPORTANT:
- This is FRESH START - create from scratch
- Use latest Medusa version
- All code in TypeScript
- Seed with 18 real categories + sample products
- Include all B2B fields from day 1
- Make it production-ready (migrations, types, error handling)
- No shortcuts - complete and professional code

START WITH: 
Initialize Medusa project + Database setup + Models
Then: Services + API endpoints
Then: Seed data
Finally: provide complete package.json, .env.example, migration files
```

---

## 🎯 PROMPT MASTER #2: NEXT.JS FRONTEND - FRESH SETUP

### Wklej dokładnie to do ChatGPT/Claude:

```
COMPREHENSIVE NEXT.JS STOREFRONT + ADMIN:
Building OMEX e-commerce frontend from scratch. Fresh install.

FULL PROJECT CONTEXT:
- Backend: Medusa (http://localhost:9000)
- Frontend: Next.js 14 (app router, TypeScript)
- 18 product categories + 52 subcategories (hierarchical)
- Multi-language: PL, EN, DE (i18n with next-intl)
- Dark/Light mode toggle (next-themes)
- Customer storefront + Admin dashboard (same app, different routes)
- Responsive design (mobile first)
- B2B features: bulk orders, pricing tiers, purchase orders

CUSTOMER STOREFRONT REQUIREMENTS:

1. PAGES & ROUTES:
   - / (homepage - hero + featured products)
   - /pl/, /en/, /de/ (language prefix for all routes)
   - /products (catalog with filters)
   - /products/[category] (category page - hierarchical navigation)
   - /products/[category]/[subcategory] (subcategory products)
   - /products/:id (product detail)
   - /search (search results page)
   - /cart (shopping cart)
   - /checkout (multi-step checkout)
   - /checkout/success (after payment)
   - /checkout/cancel (payment cancelled)
   - /account (customer profile)
   - /account/orders (order history)
   - /account/orders/:id (order detail)
   - /about (about page)
   - /contact (contact form)

2. HOMEPAGE COMPONENTS:
   - Header (logo, search, language switcher, dark mode toggle, cart icon, admin link)
   - Hero section (banner image, CTA)
   - Featured categories (18 categories as cards with icons)
   - Top products (bestsellers from API)
   - Marketing sections (trust badges, shipping info)
   - Newsletter signup
   - Footer (links, contact info, social)

3. CATALOG PAGE (/products):
   - Left sidebar: Advanced Filters
     * Category tree (collapsible hierarchical)
     * Price range slider (0-10000)
     * Brand multi-select (Rexroth, Parker, Hydac, etc.)
     * Product type (Pompy, Filtry, Zawory, etc.)
     * Equipment type (CAT, Komatsu, Hitachi, etc.)
     * Availability (in stock, low stock, out of stock)
     * SKU search
   - Main area: Product grid
     * 12 items per page
     * Pagination controls
     * Sort options (price low-high, high-low, newest, popularity)
     * Product cards (image, name, brand, price, stock status, quick add)
   - Advanced search (full-text across products + descriptions)
   - Real-time filter application

4. PRODUCT DETAIL PAGE:
   - Product images gallery (multiple images, zoom on hover)
   - Product name, brand, SKU
   - Rating/reviews (if applicable)
   - Price (with tiered pricing for B2B)
   - Stock status (quantity available)
   - Technical specifications (table)
   - Description (formatted, possibly with HTML)
   - Variants selector (if applicable)
   - Quantity selector + Add to cart button
   - "Add to Wishlist" button
   - Related products (same category)
   - Shipping info box (estimated delivery, carriers)
   - B2B features:
     * Minimum order quantity info
     * Volume pricing table
     * "Request quote" button

5. SHOPPING CART SIDEBAR:
   - Cart item list (image, name, price, quantity, remove button)
   - Subtotal + tax estimate
   - Shipping cost estimate
   - Total price
   - "Proceed to checkout" button
   - "Continue shopping" button
   - Empty cart message
   - Suggested items (complementary products)

6. CHECKOUT FLOW (Multi-step):
   - Step 1: Shipping Address
     * Auto-fill from profile if logged in
     * Address form (street, postal code, city)
     * Multiple addresses support
     * Same as billing option
   
   - Step 2: Shipping Method
     * Shipping method selector (InPost, DPD, DHL)
     * Real-time rate calculation
     * Delivery time estimates
     * Tracking info note
   
   - Step 3: Billing Address
     * Same as shipping option
     * Or separate address
     * VAT ID field (B2B)
     * Company name field
   
   - Step 4: Payment
     * Stripe integration
     * Card payment
     * Apple Pay
     * Google Pay
     * Invoice/PO option (B2B - future)
   
   - Step 5: Review & Confirm
     * Order summary
     * All items with prices
     * Shipping method + cost
     * Total
     * Place order button

7. ORDER MANAGEMENT:
   - Order history (list of past orders)
   - Order detail page:
     * Order number, date, status
     * Items ordered
     * Shipping address + method
     * Tracking number + link
     * Payment status
     * Invoice download (if available)
     * Return request (if applicable)
     * Contact support link

ADMIN DASHBOARD REQUIREMENTS:

1. ADMIN ROUTES (/admin):
   - /admin (login if not authenticated)
   - /admin/dashboard (overview)
   - /admin/products (product management)
   - /admin/products/new (create product)
   - /admin/products/:id/edit (edit product)
   - /admin/categories (category management)
   - /admin/categories/new (create category)
   - /admin/categories/:id/edit (edit category)
   - /admin/orders (order list)
   - /admin/orders/:id (order detail + status management)
   - /admin/customers (customer list)
   - /admin/customers/:id (customer detail)
   - /admin/stock (inventory management)
   - /admin/analytics (sales analytics, charts)
   - /admin/settings (store settings)

2. DASHBOARD OVERVIEW:
   - Key metrics cards (total sales, orders, customers, revenue)
   - Sales chart (line chart - last 30 days)
   - Top products (table with top 10)
   - Recent orders (table with latest 5)
   - Category performance (bar chart)
   - Quick actions (Add product, View orders, etc.)

3. PRODUCTS MANAGEMENT:
   - Products list (table with search, filters, sort)
     * Columns: SKU, Name, Category, Price, Stock, Status, Actions
     * Bulk actions (delete, change status)
     * Pagination
   - Create product form:
     * Name (PL, EN, DE translations)
     * Description (PL, EN, DE)
     * SKU, Part number
     * Brand
     * Categories (multi-select - hierarchical tree)
     * Price (retail, B2B wholesale)
     * Cost
     * Stock quantity (per warehouse)
     * Technical specifications (JSON editor or form)
     * Images upload
     * Equipment type (CAT, Komatsu, etc.)
     * Minimum order quantity
     * Volume pricing
     * Meta tags for SEO
   - Edit product form (same as create)
   - Product preview (how it looks in storefront)

4. CATEGORIES MANAGEMENT:
   - Category tree (hierarchical view - collapsible)
   - Drag & drop to reorder
   - Create category:
     * Name (PL, EN, DE)
     * Icon/emoji selector
     * Parent category (for subcategories)
     * Description
     * Meta tags
   - Edit category (same fields)
   - Delete category (with cascade warning)
   - Category preview

5. ORDERS MANAGEMENT:
   - Orders list (table)
     * Columns: Order #, Customer, Date, Total, Status, Payment, Shipping
     * Filters: Status, Date range, Customer
     * Search by order number
   - Order detail page:
     * Customer info (name, email, phone, company)
     * Shipping address
     * Billing address
     * Items (table with qty, price, subtotal)
     * Shipping method + cost
     * Payment status (paid, pending, failed)
     * Order status dropdown (pending, processing, shipped, delivered, cancelled)
     * Status history timeline
     * Action buttons:
       - Generate invoice
       - Print shipping label
       - Send notification to customer
       - Create return
       - Cancel order
     * Notes section (admin notes, customer messages)

6. CUSTOMERS MANAGEMENT:
   - Customers list (table)
     * Columns: Name, Company, Email, Phone, Orders, Total Spent, Type (B2B/Retail)
     * Search by name, email, company
     * Filters: Customer type, registration date
   - Customer detail:
     * Profile info (name, email, phone, company, tax ID)
     * Addresses (shipping/billing)
     * Orders history
     * Total spent, order count
     * Tags/groups
     * Notes

7. STOCK MANAGEMENT:
   - Inventory by warehouse (table)
   - Product list with stock levels per warehouse
   - Low stock alerts (products below minimum threshold)
   - Adjust stock (form to add/reduce quantity)
   - Stock transfer between warehouses
   - Stock history/movement log

8. ANALYTICS:
   - Sales trends (line chart)
   - Revenue by category (bar chart)
   - Top products (table)
   - Customer acquisition (new customers chart)
   - Average order value
   - Conversion rate
   - Report export (CSV, PDF)

TECHNICAL REQUIREMENTS:

1. STATE MANAGEMENT:
   - Context API for auth (admin login)
   - Context API for cart
   - Context API for theme (dark/light)
   - Context API for language (i18n)
   - Consider Zustand for complex state if needed

2. DATA FETCHING:
   - React Query or SWR for API calls
   - Cache strategy (5 min stale time for products)
   - Real-time updates for admin (orders, stock)
   - Optimistic updates for cart

3. FORMS:
   - React Hook Form + Zod validation
   - Form builders for complex forms (products, categories)
   - Real-time validation feedback
   - Error handling + display

4. STYLING:
   - Tailwind CSS OR inline styles
   - Responsive design (mobile first)
   - Dark mode support (CSS variables + next-themes)
   - Consistent spacing and typography
   - Design tokens for colors, sizes

5. INTERNATIONALIZATION (i18n):
   - next-intl for language routing
   - Middleware for /locale/* routing
   - Language switcher component
   - Translate UI text + system messages
   - Format numbers, dates, currencies per locale
   - Fallback language (PL primary)

6. PERFORMANCE:
   - Image optimization (next/image)
   - Code splitting (lazy load admin sections)
   - API response caching
   - Minimize bundle size
   - SEO optimization (meta tags, structured data)

7. SECURITY:
   - Admin authentication (JWT tokens)
   - Role-based access (admin-only routes)
   - CORS headers
   - XSS protection
   - CSRF protection

COMPONENTS STRUCTURE:
src/
├── app/
│   ├── layout.tsx (root layout)
│   ├── page.tsx (homepage)
│   ├── [locale]/
│   │   ├── layout.tsx (language layout)
│   │   ├── products/
│   │   │   ├── page.tsx (catalog)
│   │   │   ├── [category]/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx (detail)
│   │   ├── search/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/
│   │   │   ├── page.tsx (multi-step)
│   │   │   ├── success/page.tsx
│   │   │   └── cancel/page.tsx
│   │   ├── account/
│   │   │   ├── page.tsx
│   │   │   └── orders/[id]/page.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── orders/
│   │   │   ├── customers/
│   │   │   ├── stock/
│   │   │   ├── analytics/
│   │   │   └── settings/
│   │   ├── about/page.tsx
│   │   └── contact/page.tsx
│   ├── api/
│   │   ├── auth/
│   │   ├── proxy/ (proxy to Medusa)
│   │   └── webhooks/
│
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── FilterPanel.tsx
│   ├── SearchBar.tsx
│   ├── Cart.tsx
│   ├── LanguageSwitcher.tsx
│   ├── ThemeToggle.tsx
│   ├── admin/
│   │   ├── AdminHeader.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ProductForm.tsx
│   │   ├── CategoryForm.tsx
│   │   ├── OrderTable.tsx
│   │   ├── Analytics.tsx
│   │   └── ...
│
├── hooks/
│   ├── useProducts.ts
│   ├── useCart.ts
│   ├── useOrders.ts
│   ├── useCategories.ts
│   ├── useAdmin.ts
│   └── ...
│
├── lib/
│   ├── api-client.ts (Medusa API wrapper)
│   ├── utils.ts
│   ├── constants.ts
│   └── types.ts
│
├── context/
│   ├── CartContext.tsx
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   └── LanguageContext.tsx
│
├── styles/
│   ├── globals.css
│   ├── theme.css (CSS variables)
│   └── admin.css

ENV VARIABLES (.env.local):
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_STOREFRONT_URL=http://localhost:3000

API INTEGRATIONS:
- Medusa backend (/store/* endpoints for public, /admin/* for admin)
- Stripe (embedded in checkout - later)
- SendGrid (webhooks - later)
- i18n (next-intl)
- Theme (next-themes)

DELIVERABLES:
✅ Complete Next.js project structure
✅ All pages implemented
✅ All components built
✅ API client to Medusa
✅ Dark/light mode working
✅ Multi-language i18n setup
✅ Admin dashboard skeleton
✅ Shopping flow complete (browse → add to cart → checkout)
✅ Responsive mobile design
✅ TypeScript types for all data
✅ Environmental configuration
✅ README with setup
✅ package.json with dependencies

THIS IS PRODUCTION READY CODE - No shortcuts, no TODOs.

START WITH:
1. Project initialization
2. Layout + Header/Footer
3. Homepage
4. Product catalog + filters
5. Product detail
6. Cart + checkout skeleton
7. Admin dashboard skeleton
8. i18n + Dark mode setup
```

---

## 🎯 PROMPT MASTER #3: COMPLETE INTEGRATION & TESTING

### Wklej dokładnie to do ChatGPT/Claude:

```
COMPLETE OMEX INTEGRATION & DEPLOYMENT:
Final prompt - integrate Medusa backend with Next.js frontend, full testing, ready for production.

CONTEXT FROM PREVIOUS SETUP:
✅ Medusa backend: Running on http://localhost:9000
✅ Next.js frontend: Running on http://localhost:3000
✅ Database: PostgreSQL with all schemas
✅ i18n: next-intl setup (PL, EN, DE)
✅ Dark mode: next-themes
✅ Admin panel: Basic structure

NOW INTEGRATING:
- API communication between frontend ↔ backend
- Medusa webhooks for order events
- Error handling & retry logic
- Caching strategies
- Performance optimization
- Testing setup
- Production deployment checklist

FULL INTEGRATION REQUIREMENTS:

1. API CLIENT LAYER:
   - Create comprehensive Medusa API wrapper (lib/api-client.ts)
   - Methods for:
     * Products (list, get, search with filters)
     * Categories (tree structure, hierarchical)
     * Cart (create, add items, update, get)
     * Orders (create from cart, list, get detail)
     * Customers (register, login, update profile)
     * Checkout (shipping rates, payment)
     * Admin endpoints (all CRUD operations)
   - Error handling (network errors, validation errors, server errors)
   - Retry logic (exponential backoff)
   - Request/Response interceptors
   - Token management (JWT for admin)
   - Type-safe requests/responses (TypeScript)

2. REACT HOOKS:
   - useProducts() - fetch products with filters/pagination
   - useProduct(id) - get single product detail
   - useCategories() - get category tree
   - useCart() - cart management (add, remove, update qty)
   - useOrders() - fetch orders (customer or admin)
   - useOrder(id) - get order detail with tracking
   - useCustomer() - customer profile
   - useSearch(query, filters) - product search
   - useCheckout() - checkout workflow
   - useAdmin() - admin data fetching (products, orders, customers, analytics)
   - useAuth() - login/logout for admin

3. CONTEXT PROVIDERS:
   - CartContext: { items, add, remove, update, total, shipping }
   - AuthContext: { user, isAdmin, login, logout, token }
   - ThemeContext: { theme, toggleTheme } (already with next-themes)
   - LanguageContext: { locale, setLocale } (already with next-intl)
   - Combine all providers in RootProvider wrapper

4. API PROXY ROUTES (app/api/):
   - /api/proxy/* - Forward requests to Medusa backend
   - /api/auth/* - Auth endpoints (login, logout, refresh token)
   - /api/webhooks/stripe - Stripe webhook handler
   - /api/webhooks/medusa - Medusa order events

5. ERROR HANDLING:
   - Global error boundary component
   - Toast notifications for user feedback (success, error, warning, info)
   - Form validation errors
   - Network error retry
   - 404, 500 error pages
   - Graceful degradation

6. CACHING STRATEGY:
   - React Query configuration:
     * staleTime: 5 minutes for products
     * staleTime: 1 minute for cart
     * staleTime: 0 for real-time data (orders, admin)
   - Cache invalidation on mutations
   - Background refetching
   - Offline support (if applicable)

7. PERFORMANCE OPTIMIZATION:
   - Image optimization (next/image)
   - Lazy loading for components (React.lazy + Suspense)
   - Code splitting for admin sections
   - CSS optimization (Tailwind PurgeCSS)
   - API response caching headers
   - Bundle analysis (next/bundle-analyzer)
   - Lighthouse score targets (80+)

8. TESTING SETUP:
   - Unit tests (Jest)
   - Component tests (React Testing Library)
   - E2E tests (Cypress or Playwright)
   - API mocking (MSW - Mock Service Worker)
   - Test fixtures (sample products, orders, categories)

   TEST SCENARIOS:
   - Product search + filtering
   - Add/remove from cart
   - Checkout flow (all steps)
   - Order confirmation
   - Admin product CRUD
   - Admin order management
   - Language switching
   - Dark mode toggle

9. SECURITY CHECKLIST:
   - ✅ JWT token in HTTP-only cookies
   - ✅ CORS properly configured
   - ✅ Input validation (Zod schema)
   - ✅ XSS protection (sanitize user input)
   - ✅ CSRF tokens (if needed)
   - ✅ Rate limiting on API (backend)
   - ✅ Admin routes protected (middleware)
   - ✅ Secrets in .env.local (never committed)
   - ✅ HTTPS in production

10. DEPLOYMENT PREPARATION:
    - Production environment variables
    - Database migrations (production DB)
    - Static files optimization
    - Build verification (npm run build)
    - Performance testing
    - Load testing
    - Security scanning

11. DEPLOYMENT OPTIONS:
    BACKEND (Medusa):
    - Railway.app (easiest)
    - Render.com
    - AWS EC2 + RDS
    - DigitalOcean App Platform
    
    FRONTEND (Next.js):
    - Vercel (recommended - built for Next.js)
    - Netlify
    - AWS S3 + CloudFront
    - Heroku
    
    DATABASE:
    - Managed PostgreSQL (Railway, Render, AWS RDS, DigitalOcean)
    - DO NOT use SQLite in production

12. PRODUCTION CHECKLIST:
    BACKEND:
    - [ ] Environment variables configured
    - [ ] Database backups enabled
    - [ ] Email service configured (SendGrid)
    - [ ] Stripe keys configured (production)
    - [ ] File storage configured (S3 or similar)
    - [ ] Webhooks configured
    - [ ] Monitoring enabled (error tracking, APM)
    - [ ] SSL certificate configured
    - [ ] Rate limiting enabled
    - [ ] CORS configured for production domain
    
    FRONTEND:
    - [ ] API URL pointing to production backend
    - [ ] Stripe public key (production)
    - [ ] Analytics configured
    - [ ] SEO meta tags
    - [ ] Sitemap generated
    - [ ] robots.txt configured
    - [ ] SSL certificate
    - [ ] CDN configured for images
    - [ ] Error logging (Sentry)
    - [ ] Performance monitoring (Vercel Analytics)

13. MONITORING & MAINTENANCE:
    - Uptime monitoring (UptimeRobot, Better Uptime)
    - Error tracking (Sentry)
    - Performance monitoring (Vercel Analytics, Datadog)
    - Log aggregation (LogRocket, Loggly)
    - Database monitoring
    - Email delivery tracking
    - Payment processing monitoring
    - Customer support tickets

14. CI/CD PIPELINE:
    - GitHub Actions (or GitLab CI, CircleCI)
    - Run tests on every PR
    - Build verification
    - Deploy to staging on merge to dev
    - Deploy to production on merge to main
    - Automated rollback on failed deployment

    EXAMPLE WORKFLOW:
    - PR created → Run tests → Run linter → Build → Comment results
    - Merge to dev → Deploy to staging → Run E2E tests → Verify
    - Merge to main → Deploy to production → Monitor → Alert on errors

15. DOCUMENTATION:
    - API documentation (Swagger/OpenAPI for Medusa)
    - Frontend component library (Storybook)
    - Setup guide (README)
    - Deployment guide
    - Database schema diagrams
    - Architecture diagrams
    - Troubleshooting guide

DELIVERABLES:
✅ Complete API client with all methods
✅ All custom hooks (useProducts, useCart, etc.)
✅ Context providers (Cart, Auth, Theme, Language)
✅ API proxy routes
✅ Error handling & notifications
✅ React Query configuration
✅ Testing setup with examples
✅ Performance optimizations
✅ Security checklist completed
✅ Deployment guide
✅ Environment configuration
✅ Monitoring setup
✅ CI/CD pipeline config
✅ Documentation

AFTER THIS:
✅ Frontend fully integrated with backend
✅ Shopping flow working end-to-end
✅ Admin panel functional
✅ i18n working
✅ Dark mode working
✅ Testing setup ready
✅ Ready for production deployment

FILE STRUCTURE FOR THIS PHASE:
src/
├── lib/
│   ├── api-client.ts (complete Medusa wrapper)
│   ├── types.ts (TypeScript interfaces)
│   └── constants.ts (config)
├── hooks/
│   ├── useProducts.ts
│   ├── useCart.ts
│   ├── useOrders.ts
│   ├── useAdmin.ts
│   └── ... (all hooks)
├── context/
│   ├── providers.tsx (combined all providers)
│   └── ... (individual contexts)
├── app/api/
│   ├── proxy/[...path].ts (proxy to Medusa)
│   ├── auth/
│   ├── webhooks/
├── components/
│   ├── ErrorBoundary.tsx
│   ├── Toast.tsx
│   └── ... (all components)
└── utils/
    ├── validation.ts (Zod schemas)
    └── helpers.ts

TESTING FILES:
tests/
├── unit/
├── integration/
├── e2e/
├── fixtures/ (mock data)
└── setup.ts

DEPLOYMENT FILES:
├── .github/workflows/
│   ├── test.yml
│   ├── deploy-staging.yml
│   └── deploy-production.yml
├── docker-compose.yml
├── .dockerignore
├── nginx.conf (if needed)
└── deployment-guide.md

START WITH:
1. API client implementation (Medusa wrapper)
2. React Query & hooks setup
3. Context providers setup
4. API proxy routes
5. Error handling & validation
6. Testing configuration
7. Performance optimization
8. Security checklist
9. Deployment preparation
10. Documentation

FINAL NOTES:
- This is PRODUCTION READY code
- No shortcuts, complete implementation
- Includes testing, monitoring, and deployment
- Support for scaling and future features
- All error cases handled
- All edge cases covered
- Performance optimized
- Security hardened
```

---

## 📌 IMPLEMENTACJA - KOLEJNOŚĆ

### **FAZA 1: Backend** (1 tydzień)
```
1. Wklej PROMPT #1 do ChatGPT/Claude
2. Otrzymaj kompletny Medusa setup
3. Zainstaluj: npm install
4. Uruchom migracje: npm run migrations:run
5. Seed data: npm run seed
6. Start: npm run dev (http://localhost:9000)
```

### **FAZA 2: Frontend** (1 tydzień)
```
1. Wklej PROMPT #2 do ChatGPT/Claude
2. Otrzymaj kompletny Next.js setup
3. Zainstaluj: npm install
4. Konfiguruj .env.local
5. Start: npm run dev (http://localhost:3000)
```

### **FAZA 3: Integracja** (3-5 dni)
```
1. Wklej PROMPT #3 do ChatGPT/Claude
2. Otrzymaj API client + hooks + context
3. Integrujesz z frontend
4. Testujesz end-to-end
5. Deployujesz
```

---

## ✅ SUMMARY

**Masz teraz 3 MASTER PROMPTY która zawierają:**
- ✅ CAŁĄ naszą rozmowę
- ✅ Wszystkie wymagania (18 kategorii, B2B, multi-lang, etc.)
- ✅ Kompletny setup od zera
- ✅ Production-ready code
- ✅ Testing + Security + Deployment
- ✅ Nie trzeba nic więcej dodawać - prompty są COMPLETE

**Następny krok**: Weź **PROMPT #1** i wklej do ChatGPT/Claude. Gotowe! 🚀

---

**Status**: ✅ Ready for Fresh Start
**Date**: December 1, 2025
