# Implementation Plan - OMEX B2B E-Commerce

## 1. Database Schema & Migrations

- [x] 1.1 Create base Medusa database schema
  - Initialize Medusa project with PostgreSQL
  - Run default Medusa migrations
  - Verify database connection
  - _Requirements: All_

- [x] 1.2 Extend Product table with B2B fields
  - Add part_number, equipment_type columns
  - Add technical_specs JSONB column
  - Add min_order_qty INTEGER column
  - Create migration file
  - _Requirements: 1.1, 1.2_

- [x] 1.3 Create hierarchical Category structure
  - Add parent_id UUID column to product_category
  - Add foreign key constraint to self-reference
  - Create indexes on parent_id
  - _Requirements: 2.1, 2.2_

- [x] 1.4 Extend Customer table for B2B
  - Add company_name VARCHAR(255)
  - Add tax_id VARCHAR(20)
  - Add customer_type ENUM('retail', 'b2b', 'wholesale')
  - _Requirements: 3.1, 3.2_

- [x] 1.5 Extend Order table with B2B fields
  - Add purchase_order_number VARCHAR(255)
  - Add delivery_date DATE
  - Add payment_terms VARCHAR(50)
  - Add warehouse_id UUID
  - _Requirements: 3.3, 9.1_

- [x] 1.6 Create PriceTier table
  - Define schema (product_id, customer_type, quantity_min, quantity_max, price)
  - Add foreign key to product
  - Create indexes
  - _Requirements: 4.1, 4.2_

- [x] 1.7 Create Inventory table for multi-warehouse
  - Define schema (product_id, warehouse_id, quantity, reserved)
  - Add foreign key to product
  - Create indexes on product_id and warehouse_id
  - _Requirements: 5.1, 5.2_

- [x] 1.8 Create Translation tables
  - Create product_translation table (product_id, locale, title, description)
  - Create category_translation table (category_id, locale, name, description)
  - Add foreign keys and indexes
  - _Requirements: 6.1, 6.2_

## 2. Backend Services - Core

- [x] 2.1 Implement ProductService
  - Create product with all B2B fields
  - Update product with validation
  - Retrieve product with translations
  - List products with pagination and filters
  - Delete product (soft delete)
  - _Requirements: 1.1, 1.2, 1.3_

- [ ]* 2.2 Write property test for ProductService
  - **Property 1: Product Data Persistence**
  - **Validates: Requirements 1.1**

- [ ]* 2.3 Write property test for technical specs
  - **Property 2: Technical Specs Round-Trip**
  - **Validates: Requirements 1.2**

- [x] 2.4 Implement CategoryService
  - Create category with parent_id
  - Update category
  - Retrieve category tree (recursive)
  - Get products by category (include subcategories)
  - Delete category with cascade warning
  - Generate hierarchical URL path
  - _Requirements: 2.1, 2.2, 2.3, 2.5_

- [ ]* 2.5 Write property test for CategoryService
  - **Property 6: Category Hierarchy Preservation**
  - **Property 7: Category Tree Completeness**
  - **Property 8: Subcategory Product Inclusion**
  - **Validates: Requirements 2.1, 2.2, 2.3**

- [x] 2.6 Implement TranslationService
  - Add translation for product
  - Add translation for category
  - Get translation by locale
  - Fallback to English if translation missing
  - Validate all languages present
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ]* 2.7 Write property test for TranslationService
  - **Property 4: Translation Round-Trip**
  - **Property 22: Product Translation Display**
  - **Property 23: Translation Fallback**
  - **Validates: Requirements 1.4, 6.2, 6.3**

## 3. Backend Services - B2B Features

- [x] 3.1 Implement CustomerService with B2B profiles
  - Create customer with company_name, tax_id
  - Validate B2B required fields
  - Update customer profile
  - Get customer with order history
  - Manage multiple addresses
  - _Requirements: 3.1, 3.4, 3.5_

- [ ]* 3.2 Write property test for CustomerService
  - **Property 10: B2B Registration Validation**
  - **Property 13: Address Selection Availability**
  - **Property 14: Order History Completeness**
  - **Validates: Requirements 3.1, 3.4, 3.5**

- [x] 3.3 Implement PricingService
  - Get price based on customer type and quantity
  - Set tiered pricing for product
  - Calculate cart total with tiered prices
  - Apply wholesale discount
  - _Requirements: 4.1, 4.2, 4.3, 4.5_

- [ ]* 3.4 Write property test for PricingService
  - **Property 11: B2B Pricing Application**
  - **Property 15: Tiered Price Calculation**
  - **Property 16: Price Recalculation on Quantity Change**
  - **Property 17: Wholesale Discount Application**
  - **Validates: Requirements 3.2, 4.2, 4.3, 4.5**

- [x] 3.5 Implement InventoryService
  - Get stock by product and warehouse
  - Update stock for warehouse
  - Transfer stock between warehouses
  - Reserve stock for order
  - Release reservation
  - Get low stock alerts
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 3.6 Write property test for InventoryService
  - **Property 18: Multi-Warehouse Stock Persistence**
  - **Property 19: Stock Transfer Conservation**
  - **Property 20: Total Stock Calculation**
  - **Validates: Requirements 5.1, 5.4, 5.5**

## 4. Backend Services - Orders & Search

- [x] 4.1 Implement OrderService
  - Create order from cart
  - Add purchase_order_number for B2B
  - Update order status
  - Track status history
  - Cancel order and return stock
  - Generate invoice PDF
  - _Requirements: 8.5, 9.1, 9.3, 9.4, 9.5_

- [ ]* 4.2 Write property test for OrderService
  - **Property 34: Order Status Filter**
  - **Property 35: Order Status History**
  - **Property 36: Order Cancellation Stock Return**
  - **Validates: Requirements 9.1, 9.3, 9.5**

- [x] 4.3 Implement SearchService
  - Full-text search across name, description, SKU, part_number
  - Apply filters (category, price, brand, availability, equipment_type)
  - Sort results (price, date, popularity)
  - Paginate results (12 per page)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ]* 4.4 Write property test for SearchService
  - **Property 26: Search Field Coverage**
  - **Property 27: Filter Criteria Compliance**
  - **Property 28: Sort Order Correctness**
  - **Property 29: Pagination Limit**
  - **Property 30: Equipment Type Filter**
  - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**

## 5. API Endpoints - Store (Public)

- [x] 5.1 Create Store API: Products
  - GET /store/products (list with filters, pagination)
  - GET /store/products/:id (detail with translations)
  - GET /store/products/search (search with query and filters)
  - _Requirements: 7.1, 7.2_

- [x] 5.2 Create Store API: Categories
  - GET /store/product-categories (tree structure)
  - GET /store/product-categories/:id (category with products)
  - GET /store/product-categories/:id/products (products including subcategories)
  - _Requirements: 2.2, 2.3_

- [x] 5.3 Create Store API: Cart
  - POST /store/carts (create cart)
  - GET /store/carts/:id (get cart with items)
  - POST /store/carts/:id/line-items (add to cart with min_qty validation)
  - PUT /store/carts/:id/line-items/:item_id (update quantity, recalculate price)
  - DELETE /store/carts/:id/line-items/:item_id (remove item)
  - _Requirements: 8.1, 8.2_

- [ ]* 5.4 Write property test for Cart API
  - **Property 5: Minimum Order Quantity Enforcement**
  - **Property 31: Cart Subtotal Accuracy**
  - **Validates: Requirements 1.5, 8.2**

- [x] 5.5 Create Store API: Checkout
  - POST /store/carts/:id/complete-cart (finalize order)
  - Validate required fields (address, shipping, payment)
  - Calculate shipping cost
  - Create order with PO number for B2B
  - _Requirements: 8.3, 8.4, 8.5_

- [ ]* 5.6 Write property test for Checkout API
  - **Property 32: Checkout Required Fields Validation**
  - **Property 33: Shipping Cost Calculation**
  - **Validates: Requirements 8.3, 8.4**

- [x] 5.7 Create Store API: Orders
  - GET /store/orders (customer order history)
  - GET /store/orders/:id (order detail with tracking)
  - _Requirements: 3.5, 12.4_

## 6. API Endpoints - Admin

- [x] 6.1 Create Admin API: Products
  - POST /admin/products (create with translations, specs, categories)
  - GET /admin/products (list with filters)
  - GET /admin/products/:id (detail)
  - PUT /admin/products/:id (update all fields)
  - DELETE /admin/products/:id (soft delete)
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 6.2 Create Admin API: Categories
  - POST /admin/product-categories (create with parent_id)
  - GET /admin/product-categories (tree view)
  - PUT /admin/product-categories/:id (update)
  - DELETE /admin/product-categories/:id (with cascade warning)
  - _Requirements: 2.1, 2.4_

- [x] 6.3 Create Admin API: Customers
  - GET /admin/customers (list with filters)
  - GET /admin/customers/:id (profile with order history)
  - PUT /admin/customers/:id (update profile)
  - _Requirements: 3.5_

- [x] 6.4 Create Admin API: Orders
  - GET /admin/orders (list with status filter)
  - GET /admin/orders/:id (detail)
  - PUT /admin/orders/:id/status (update status, save to history)
  - POST /admin/orders/:id/cancel (cancel and return stock)
  - POST /admin/orders/:id/invoice (generate PDF)
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ]* 6.5 Write property test for Admin Order API
  - **Property 47: Payment Success Order Creation**
  - **Validates: Requirements 13.3**

- [x] 6.6 Create Admin API: Inventory
  - GET /admin/stock (inventory by warehouse)
  - PUT /admin/stock/:product_id (update stock for warehouse)
  - POST /admin/stock/transfer (transfer between warehouses)
  - GET /admin/stock/alerts (low stock alerts)
  - _Requirements: 5.1, 5.3, 5.4_

- [x] 6.7 Create Admin API: Analytics
  - GET /admin/analytics/dashboard (metrics: sales, orders, customers, revenue)
  - GET /admin/analytics/sales-chart (30-day data)
  - GET /admin/analytics/top-products (top 10)
  - GET /admin/analytics/categories (performance by category)
  - POST /admin/analytics/export (CSV/PDF report)
  - _Requirements: 10.1, 10.2, 10.3_

- [ ]* 6.8 Write property test for Analytics API
  - **Property 37: Dashboard Metrics Accuracy**
  - **Property 38: Sales Chart Data Points**
  - **Property 39: Top Products Limit and Order**
  - **Validates: Requirements 10.1, 10.2, 10.3**

## 7. Checkpoint - Backend Complete

- [ ] 7.1 Ensure all backend tests pass
  - Run all unit tests
  - Run all property-based tests
  - Run integration tests
  - Fix any failing tests
  - Ensure all tests pass, ask the user if questions arise.

## 8. Frontend - Next.js Setup

- [x] 8.1 Initialize Next.js 14 project
  - Create Next.js app with App Router
  - Configure TypeScript
  - Set up Tailwind CSS
  - Configure environment variables
  - _Requirements: All frontend_

- [x] 8.2 Set up i18n with next-intl
  - Install next-intl
  - Configure middleware for /[locale]/* routing
  - Create translation files (pl.json, en.json, de.json)
  - Implement LanguageSwitcher component
  - _Requirements: 6.1, 6.5_

- [ ]* 8.3 Write property test for i18n
  - **Property 21: Language-Specific Content Display**
  - **Property 25: Language URL Prefix**
  - **Validates: Requirements 6.1, 6.5**

- [x] 8.4 Set up dark/light mode with next-themes
  - Install next-themes
  - Create ThemeProvider
  - Implement ThemeToggle component
  - Configure CSS variables for themes
  - _Requirements: 11.1, 11.2_

- [ ]* 8.5 Write property test for theme
  - **Property 40: Theme Preference Persistence**
  - **Validates: Requirements 11.2**

- [x] 8.6 Create API client for Medusa
  - Implement fetch wrapper with error handling
  - Create methods for all Store API endpoints
  - Create methods for all Admin API endpoints
  - Add retry logic with exponential backoff
  - Add TypeScript types for requests/responses
  - _Requirements: All_

## 9. Frontend - Storefront Components

- [x] 9.1 Create Layout components
  - Header (logo, search, language switcher, theme toggle, cart icon)
  - Footer (links, contact info, social)
  - Navigation (category menu)
  - _Requirements: All storefront_

- [x] 9.2 Create Homepage
  - Hero section with banner
  - Featured categories (18 cards with icons)
  - Top products grid
  - Marketing sections (trust badges, shipping info)
  - Newsletter signup form
  - _Requirements: All_

- [x] 9.3 Create Product Catalog page
  - FilterPanel component (category tree, price range, brand, equipment_type, availability)
  - ProductGrid component (12 items per page)
  - Pagination controls
  - Sort dropdown (price, date, popularity)
  - ProductCard component (image, name, brand, price, stock, quick add)
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 9.4 Create Product Detail page
  - Image gallery with zoom
  - Product info (name, brand, SKU, price, stock)
  - Technical specifications table
  - Tiered pricing table for B2B
  - Quantity selector with min_qty validation
  - Add to cart button
  - Related products section
  - _Requirements: 1.1, 1.5, 4.1_

- [x] 9.5 Create SearchBar component
  - Real-time search with debounce
  - Search suggestions dropdown
  - Full-text search across products
  - _Requirements: 7.1_

- [x] 9.6 Create Cart sidebar
  - Cart items list (image, name, price, quantity, remove)
  - Subtotal, tax, shipping estimate
  - Total price
  - Proceed to checkout button
  - Empty cart message
  - _Requirements: 8.2_

## 10. Frontend - Checkout Flow

- [x] 10.1 Create Checkout multi-step form
  - Step 1: Shipping Address (auto-fill from profile, multiple addresses)
  - Step 2: Shipping Method (InPost, DPD, DHL with rates)
  - Step 3: Billing Address (same as shipping option, VAT ID for B2B)
  - Step 4: Payment (Stripe integration placeholder)
  - Step 5: Review & Confirm (order summary, place order button)
  - _Requirements: 8.3, 8.4, 12.1_

- [ ]* 10.2 Write property test for Checkout
  - **Property 12: Purchase Order Persistence**
  - **Property 41: Shipping Options Completeness**
  - **Property 42: Shipping Cost Variation**
  - **Validates: Requirements 3.3, 12.1, 12.2**

- [x] 10.3 Create Order Success page
  - Order confirmation message
  - Order number and details
  - Estimated delivery date
  - Tracking information (when available)
  - _Requirements: 8.5, 12.3_

- [x] 10.4 Create Order History page
  - List of past orders
  - Order status badges
  - Filter by status and date
  - _Requirements: 3.5_

- [x] 10.5 Create Order Detail page
  - Order items table
  - Shipping and billing addresses
  - Tracking link
  - Invoice download button
  - Order status timeline
  - _Requirements: 9.2, 12.4_

- [ ]* 10.6 Write property test for Order pages
  - **Property 43: Tracking Number Uniqueness**
  - **Property 44: Tracking Link Format**
  - **Property 45: Delivery Status Update**
  - **Validates: Requirements 12.3, 12.4, 12.5**

## 11. Frontend - Admin Dashboard

- [ ] 11.1 Create Admin layout
  - AdminHeader with user menu
  - Sidebar navigation
  - Protected routes (require authentication)
  - _Requirements: All admin_

- [ ] 11.2 Create Dashboard overview
  - Metrics cards (total sales, orders, customers, revenue)
  - Sales chart (line chart, 30 days)
  - Top products table
  - Recent orders table
  - Category performance chart
  - _Requirements: 10.1, 10.2, 10.3_

- [ ] 11.3 Create Product Management pages
  - Products list table (search, filters, sort, pagination)
  - Create product form (all fields, translations, categories, images)
  - Edit product form
  - Product preview
  - Bulk actions (delete, change status)
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 11.4 Create Category Management pages
  - Category tree view (collapsible, drag & drop)
  - Create category form (name translations, parent, icon)
  - Edit category form
  - Delete with cascade warning
  - _Requirements: 2.1, 2.4_

- [ ] 11.5 Create Order Management pages
  - Orders list table (filters, search)
  - Order detail page (customer info, items, addresses, status)
  - Status dropdown with history timeline
  - Action buttons (invoice, shipping label, cancel)
  - Notes section
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 11.6 Create Customer Management pages
  - Customers list table (search, filters)
  - Customer detail page (profile, addresses, order history, total spent)
  - _Requirements: 3.5_

- [ ] 11.7 Create Inventory Management page
  - Stock levels by warehouse table
  - Low stock alerts
  - Adjust stock form
  - Stock transfer form
  - Stock history log
  - _Requirements: 5.1, 5.3, 5.4_

- [ ] 11.8 Create Analytics page
  - Sales trends chart
  - Revenue by category chart
  - Top products table
  - Customer acquisition chart
  - Average order value metric
  - Export report button (CSV/PDF)
  - _Requirements: 10.1, 10.2, 10.3, 10.5_

## 12. Integrations

- [ ] 12.1 Integrate Stripe payment
  - Install Stripe SDK
  - Create Stripe checkout session
  - Handle payment success webhook
  - Handle payment failure
  - Store payment status in order
  - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [ ]* 12.2 Write property test for Stripe integration
  - **Property 46: Card Data Validation**
  - **Property 48: B2B Payment Terms**
  - **Validates: Requirements 13.2, 13.5**

- [ ] 12.3 Integrate SendGrid email
  - Install SendGrid SDK
  - Create email templates (order confirmation, shipping notification, delivery, welcome, cancellation)
  - Send email on order events
  - Handle webhook for email status
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ] 12.4 Integrate shipping providers (stubs)
  - Create InPost API client (rate calculation, label generation)
  - Create DPD API client
  - Create DHL API client
  - Generate tracking numbers
  - Update order with tracking info
  - _Requirements: 12.1, 12.2, 12.3_

## 13. SEO & Performance

- [ ] 13.1 Implement SEO optimization
  - Add meta tags to all pages (title, description, og:image)
  - Generate SEO-friendly URLs (slugs)
  - Create sitemap.xml (products + categories)
  - Add robots.txt
  - Implement structured data (JSON-LD for products)
  - _Requirements: 15.1, 15.2, 15.4_

- [ ]* 13.2 Write property test for SEO
  - **Property 49: Meta Tags Presence**
  - **Property 50: SEO-Friendly URL Format**
  - **Property 51: Sitemap Completeness**
  - **Validates: Requirements 15.1, 15.2, 15.4**

- [ ] 13.3 Optimize performance
  - Implement image optimization (next/image)
  - Add lazy loading for images
  - Code split admin sections
  - Minimize bundle size
  - Add caching headers
  - Run Lighthouse audit (target 80+)
  - _Requirements: 15.3, 15.5_

## 14. Testing & Quality Assurance

- [ ] 14.1 Write integration tests
  - Test complete checkout flow
  - Test admin product CRUD
  - Test order management workflow
  - Test multi-language switching
  - Test dark mode toggle
  - _Requirements: All_

- [ ] 14.2 Write E2E tests
  - Test user journey: browse → search → add to cart → checkout → order
  - Test admin journey: create product → publish → verify on storefront
  - Test B2B features: tiered pricing, PO numbers
  - _Requirements: All_

- [ ] 14.3 Performance testing
  - Load test API endpoints (concurrent users)
  - Measure database query performance
  - Optimize slow queries
  - Test frontend bundle size
  - Run Lighthouse performance audit
  - _Requirements: 15.3_

## 15. Checkpoint - Full System Test

- [ ] 15.1 Ensure all tests pass
  - Run all unit tests
  - Run all property-based tests
  - Run all integration tests
  - Run all E2E tests
  - Fix any failing tests
  - Ensure all tests pass, ask the user if questions arise.

## 16. Deployment Preparation

- [ ] 16.1 Set up production environment
  - Configure production database (PostgreSQL)
  - Set up Redis for caching
  - Configure environment variables
  - Set up SSL certificates
  - Configure CORS for production domains
  - _Requirements: All_

- [ ] 16.2 Set up CI/CD pipeline
  - Create GitHub Actions workflow
  - Run tests on every PR
  - Build verification
  - Deploy to staging on merge to dev
  - Deploy to production on merge to main
  - _Requirements: All_

- [ ] 16.3 Set up monitoring
  - Configure error tracking (Sentry)
  - Set up uptime monitoring
  - Configure performance monitoring
  - Set up log aggregation
  - Create alert rules
  - _Requirements: All_

- [ ] 16.4 Create deployment documentation
  - Write deployment guide
  - Document environment variables
  - Create troubleshooting guide
  - Document backup procedures
  - _Requirements: All_

## 17. Data Seeding

- [ ] 17.1 Create seed data
  - Seed 18 main categories with translations
  - Seed 52 subcategories with parent relationships
  - Seed 50 sample products with all fields
  - Seed product translations (PL, EN, DE)
  - Seed tiered pricing for products
  - Seed inventory for multiple warehouses
  - Seed sample customers (retail, B2B, wholesale)
  - Seed sample orders with different statuses
  - _Requirements: All_

- [ ] 17.2 Create data import scripts
  - CSV import for products
  - CSV import for categories
  - Bulk translation import
  - Inventory import
  - _Requirements: All_

## 18. Final Checkpoint

- [ ] 18.1 Complete system verification
  - Verify all 15 requirements are implemented
  - Verify all 51 correctness properties pass
  - Verify all API endpoints work
  - Verify all frontend pages render correctly
  - Verify multi-language works (PL, EN, DE)
  - Verify dark/light mode works
  - Verify B2B features work (tiered pricing, PO, multi-warehouse)
  - Verify integrations work (Stripe, SendGrid, shipping)
  - Ensure all tests pass, ask the user if questions arise.

## 19. Documentation

- [ ] 19.1 Write user documentation
  - Customer guide (how to shop, checkout, track orders)
  - Admin guide (how to manage products, orders, customers)
  - API documentation (Swagger/OpenAPI)
  - _Requirements: All_

- [ ] 19.2 Write developer documentation
  - Architecture overview
  - Database schema diagrams
  - API endpoint reference
  - Component library (Storybook)
  - Setup guide for developers
  - _Requirements: All_

## 20. Go-Live Preparation

- [ ] 20.1 Final production checklist
  - Database backups enabled
  - SSL certificates configured
  - Email service configured (SendGrid production keys)
  - Stripe production keys configured
  - File storage configured
  - Webhooks configured
  - Monitoring enabled
  - Rate limiting enabled
  - CORS configured for production
  - Performance optimized (Lighthouse 80+)
  - Security audit passed
  - Load testing passed
  - _Requirements: All_

- [ ] 20.2 Launch
  - Deploy to production
  - Verify all systems operational
  - Monitor for errors
  - Be ready for rollback if needed
  - _Requirements: All_
