# Design Document - OMEX B2B E-Commerce

## Overview

OMEX to kompleksowa platforma B2B e-commerce zbudowana na Medusa.js (backend) i Next.js 14 (frontend). System obsługuje 50,000+ produktów przemysłowych w hierarchicznej strukturze kategorii, wspiera wielojęzyczność (PL, EN, DE), zaawansowane funkcje B2B (ceny hurtowe, zamówienia z PO, zarządzanie wielomagazynowe) oraz integracje z systemami płatności (Stripe) i wysyłki (InPost, DPD, DHL).

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                             │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │  Next.js         │         │  Admin Dashboard │         │
│  │  Storefront      │         │  (Next.js)       │         │
│  │  (Port 8000)     │         │  (Port 3000)     │         │
│  └────────┬─────────┘         └────────┬─────────┘         │
└───────────┼──────────────────────────────┼──────────────────┘
            │                              │
            │         HTTP/REST            │
            │                              │
┌───────────┴──────────────────────────────┴──────────────────┐
│                   API GATEWAY LAYER                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Medusa.js Backend (Port 9000)                │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │ Store API  │  │ Admin API  │  │ Webhooks   │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────┬──────────────────────────────┬──────────────────┘
            │                              │
┌───────────┴──────────────────────────────┴──────────────────┐
│                   SERVICE LAYER                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Product  │ │ Category │ │ Customer │ │ Order    │      │
│  │ Service  │ │ Service  │ │ Service  │ │ Service  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │Inventory │ │ Pricing  │ │ Search   │ │Translation│     │
│  │ Service  │ │ Service  │ │ Service  │ │ Service  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└───────────┬──────────────────────────────────────────────────┘
            │
┌───────────┴──────────────────────────────────────────────────┐
│                   DATA LAYER                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         PostgreSQL Database                          │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │   │
│  │  │Products│ │Category│ │Customer│ │ Orders │       │   │
│  │  └────────┘ └────────┘ └────────┘ └────────┘       │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │   │
│  │  │Inventory│ │ Prices │ │Translations│ Stock │      │   │
│  │  └────────┘ └────────┘ └────────┘ └────────┘       │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
            │
┌───────────┴──────────────────────────────────────────────────┐
│                EXTERNAL INTEGRATIONS                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  Stripe  │ │ SendGrid │ │  InPost  │ │   DPD    │       │
│  │ Payment  │ │  Email   │ │ Shipping │ │ Shipping │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└──────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Backend:**
- Medusa.js 2.0+ (Node.js framework)
- PostgreSQL (primary database)
- TypeScript (type safety)
- Redis (optional - caching, sessions)

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- next-intl (i18n)
- next-themes (dark mode)
- React Query (data fetching)
- Tailwind CSS (styling)

**Integrations:**
- Stripe (payments)
- SendGrid (emails)
- InPost/DPD/DHL APIs (shipping)

## Components and Interfaces

### Backend Services

#### ProductService
```typescript
interface ProductService {
  create(data: CreateProductDTO): Promise<Product>
  update(id: string, data: UpdateProductDTO): Promise<Product>
  retrieve(id: string, locale?: string): Promise<Product>
  list(filters: ProductFilters, pagination: Pagination): Promise<ProductList>
  search(query: string, filters: SearchFilters): Promise<Product[]>
  delete(id: string): Promise<void>
  addTranslation(productId: string, locale: string, translation: Translation): Promise<void>
  setTechnicalSpecs(productId: string, specs: JSON): Promise<void>
}
```

#### CategoryService
```typescript
interface CategoryService {
  create(data: CreateCategoryDTO): Promise<Category>
  update(id: string, data: UpdateCategoryDTO): Promise<Category>
  retrieve(id: string): Promise<Category>
  listTree(): Promise<CategoryTree>
  getChildren(parentId: string): Promise<Category[]>
  getProductsByCategory(categoryId: string, includeSubcategories: boolean): Promise<Product[]>
  delete(id: string, cascade: boolean): Promise<void>
  generatePath(categoryId: string): Promise<string>
}
```

#### InventoryService
```typescript
interface InventoryService {
  getStock(productId: string, warehouseId?: string): Promise<StockLevel>
  updateStock(productId: string, warehouseId: string, quantity: number): Promise<void>
  transferStock(productId: string, fromWarehouse: string, toWarehouse: string, quantity: number): Promise<void>
  reserveStock(productId: string, quantity: number): Promise<Reservation>
  releaseReservation(reservationId: string): Promise<void>
  getLowStockAlerts(threshold: number): Promise<LowStockAlert[]>
}
```

#### PricingService
```typescript
interface PricingService {
  getPrice(productId: string, customerType: CustomerType, quantity: number): Promise<Price>
  setTieredPricing(productId: string, tiers: PriceTier[]): Promise<void>
  calculateCartTotal(cart: Cart, customerType: CustomerType): Promise<CartTotal>
  applyDiscount(amount: number, discountCode: string): Promise<number>
}
```

### Frontend Components

#### Storefront Components
```typescript
// Product Catalog
<ProductGrid products={products} />
<FilterPanel filters={filters} onFilterChange={handleFilter} />
<ProductCard product={product} />
<ProductDetail product={product} />

// Shopping Flow
<Cart items={cartItems} />
<CheckoutFlow steps={checkoutSteps} />
<OrderSummary order={order} />

// Navigation
<Header />
<CategoryNav categories={categoryTree} />
<LanguageSwitcher />
<ThemeToggle />
<SearchBar />

// Customer Account
<AccountDashboard />
<OrderHistory orders={orders} />
<AddressBook addresses={addresses} />
```

#### Admin Components
```typescript
// Dashboard
<AdminDashboard metrics={metrics} />
<SalesChart data={salesData} />
<TopProducts products={topProducts} />

// Management
<ProductForm product={product} />
<CategoryForm category={category} />
<OrderTable orders={orders} />
<CustomerTable customers={customers} />
<InventoryManager stock={stockLevels} />

// Analytics
<AnalyticsPanel />
<ReportGenerator />
```

## Data Models

### Product
```typescript
interface Product {
  id: string
  sku: string
  part_number: string
  brand: string
  equipment_type: string
  price: number
  cost: number
  min_order_qty: number
  technical_specs: JSON
  created_at: Date
  updated_at: Date
  
  // Relations
  categories: Category[]
  translations: ProductTranslation[]
  inventory: InventoryItem[]
  prices: PriceTier[]
}
```

### Category
```typescript
interface Category {
  id: string
  parent_id: string | null
  name: string
  slug: string
  icon: string
  description: string
  created_at: Date
  
  // Relations
  parent: Category | null
  children: Category[]
  products: Product[]
  translations: CategoryTranslation[]
}
```

### Customer
```typescript
interface Customer {
  id: string
  email: string
  first_name: string
  last_name: string
  company_name: string
  tax_id: string
  customer_type: 'retail' | 'b2b' | 'wholesale'
  created_at: Date
  
  // Relations
  addresses: Address[]
  orders: Order[]
}
```

### Order
```typescript
interface Order {
  id: string
  order_number: string
  customer_id: string
  purchase_order_number: string
  payment_terms: string
  delivery_date: Date
  status: OrderStatus
  payment_status: PaymentStatus
  total: number
  created_at: Date
  
  // Relations
  customer: Customer
  items: OrderItem[]
  shipping_address: Address
  billing_address: Address
  fulfillments: Fulfillment[]
}
```

### Inventory
```typescript
interface InventoryItem {
  id: string
  product_id: string
  warehouse_id: string
  quantity: number
  reserved: number
  updated_at: Date
  
  // Relations
  product: Product
}
```

### PriceTier
```typescript
interface PriceTier {
  id: string
  product_id: string
  customer_type: CustomerType
  quantity_min: number
  quantity_max: number
  price: number
  created_at: Date
}
```

### Translation
```typescript
interface ProductTranslation {
  id: string
  product_id: string
  locale: 'pl' | 'en' | 'de'
  title: string
  description: string
  created_at: Date
}

interface CategoryTranslation {
  id: string
  category_id: string
  locale: 'pl' | 'en' | 'de'
  name: string
  description: string
  created_at: Date
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Product Data Persistence
*For any* product with valid data (name, SKU, price, etc.), after saving to database, retrieving the product should return identical data
**Validates: Requirements 1.1**

### Property 2: Technical Specs Round-Trip
*For any* product with technical specifications in JSON format, saving and then retrieving should return identical JSON structure
**Validates: Requirements 1.2**

### Property 3: Category Assignment Consistency
*For any* product and set of categories, after assigning categories, retrieving the product should return the same set of categories
**Validates: Requirements 1.3**

### Property 4: Translation Round-Trip
*For any* product translation in PL, EN, or DE, saving and retrieving should return identical translated content
**Validates: Requirements 1.4**

### Property 5: Minimum Order Quantity Enforcement
*For any* product with min_order_qty set, attempting to add quantity less than minimum to cart should be rejected
**Validates: Requirements 1.5**

### Property 6: Category Hierarchy Preservation
*For any* category with parent_id, after saving, the parent-child relationship should be retrievable
**Validates: Requirements 2.1**

### Property 7: Category Tree Completeness
*For any* set of hierarchical categories, the generated tree should contain all categories in correct parent-child order
**Validates: Requirements 2.2**

### Property 8: Subcategory Product Inclusion
*For any* category with subcategories, retrieving products should include products from all descendant categories
**Validates: Requirements 2.3**

### Property 9: Hierarchical URL Generation
*For any* category with parent categories, generated URL should contain full path from root to leaf
**Validates: Requirements 2.5**

### Property 10: B2B Registration Validation
*For any* B2B registration attempt without company_name, tax_id, or address, the system should reject the registration
**Validates: Requirements 3.1**

### Property 11: B2B Pricing Application
*For any* customer with type 'b2b' and any product, displayed price should be wholesale price, not retail
**Validates: Requirements 3.2**

### Property 12: Purchase Order Persistence
*For any* B2B order with PO number, after saving, the PO number should be retrievable with the order
**Validates: Requirements 3.3**

### Property 13: Address Selection Availability
*For any* customer with N addresses, the system should return all N addresses for selection
**Validates: Requirements 3.4**

### Property 14: Order History Completeness
*For any* customer with orders, order history should contain all orders associated with that customer
**Validates: Requirements 3.5**

### Property 15: Tiered Price Calculation
*For any* quantity and product with price tiers, applied price should match the tier containing that quantity
**Validates: Requirements 4.2**

### Property 16: Price Recalculation on Quantity Change
*For any* cart item, changing quantity across tier boundaries should update unit price to match new tier
**Validates: Requirements 4.3**

### Property 17: Wholesale Discount Application
*For any* customer with type 'wholesale', final price should be lower than B2B price for same product
**Validates: Requirements 4.5**

### Property 18: Multi-Warehouse Stock Persistence
*For any* product and N warehouses, system should store and retrieve stock level for each warehouse
**Validates: Requirements 5.1**

### Property 19: Stock Transfer Conservation
*For any* stock transfer of X units from warehouse A to B, warehouse A stock should decrease by X and warehouse B should increase by X, with total unchanged
**Validates: Requirements 5.4**

### Property 20: Total Stock Calculation
*For any* product in multiple warehouses, displayed total stock should equal sum of stock across all warehouses
**Validates: Requirements 5.5**

### Property 21: Language-Specific Content Display
*For any* selected language (PL, EN, DE), all UI text should be displayed in that language
**Validates: Requirements 6.1**

### Property 22: Product Translation Display
*For any* product with translations, displayed name and description should match selected language
**Validates: Requirements 6.2**

### Property 23: Translation Fallback
*For any* product without translation in selected language, system should display English translation as fallback
**Validates: Requirements 6.3**

### Property 24: Translation Completeness Validation
*For any* product creation, system should require translations for all supported languages (PL, EN, DE)
**Validates: Requirements 6.4**

### Property 25: Language URL Prefix
*For any* URL and selected language, URL should contain language prefix (/pl/, /en/, /de/)
**Validates: Requirements 6.5**

### Property 26: Search Field Coverage
*For any* search query matching product name, description, SKU, or part_number, that product should appear in results
**Validates: Requirements 7.1**

### Property 27: Filter Criteria Compliance
*For any* applied filters (category, price, brand, availability), all returned products should satisfy all filter criteria
**Validates: Requirements 7.2**

### Property 28: Sort Order Correctness
*For any* sort criterion (price, date, popularity), returned products should be ordered according to that criterion
**Validates: Requirements 7.3**

### Property 29: Pagination Limit
*For any* product search results, number of products per page should not exceed 12
**Validates: Requirements 7.4**

### Property 30: Equipment Type Filter
*For any* equipment_type filter, all returned products should have that equipment_type value
**Validates: Requirements 7.5**

### Property 31: Cart Subtotal Accuracy
*For any* cart with items, displayed subtotal should equal sum of (quantity × price) for all items
**Validates: Requirements 8.2**

### Property 32: Checkout Required Fields Validation
*For any* checkout attempt without shipping address, shipping method, or payment method, system should block checkout
**Validates: Requirements 8.3**

### Property 33: Shipping Cost Calculation
*For any* shipping method (InPost, DPD, DHL), calculated cost should be greater than zero and different for different methods
**Validates: Requirements 8.4**

### Property 34: Order Status Filter
*For any* order status filter, returned orders should have only that status
**Validates: Requirements 9.1**

### Property 35: Order Status History
*For any* order with status changes, history should contain all status changes in chronological order
**Validates: Requirements 9.3**

### Property 36: Order Cancellation Stock Return
*For any* cancelled order, product stock levels should increase by quantities from order items
**Validates: Requirements 9.5**

### Property 37: Dashboard Metrics Accuracy
*For any* dashboard metrics (total sales, orders, customers), values should match actual database counts
**Validates: Requirements 10.1**

### Property 38: Sales Chart Data Points
*For any* 30-day sales chart, chart should contain exactly 30 data points
**Validates: Requirements 10.2**

### Property 39: Top Products Limit and Order
*For any* top products list, list should contain at most 10 products sorted by sales descending
**Validates: Requirements 10.3**

### Property 40: Theme Preference Persistence
*For any* selected theme (dark/light), preference should be stored in localStorage and persist across sessions
**Validates: Requirements 11.2**

### Property 41: Shipping Options Completeness
*For any* shipping selection, system should display all three options (InPost, DPD, DHL) with prices
**Validates: Requirements 12.1**

### Property 42: Shipping Cost Variation
*For any* product with different weight/dimensions/location, shipping cost should vary accordingly
**Validates: Requirements 12.2**

### Property 43: Tracking Number Uniqueness
*For any* shipped order, generated tracking number should be unique and non-empty
**Validates: Requirements 12.3**

### Property 44: Tracking Link Format
*For any* tracking link, it should contain tracking number and be valid URL format
**Validates: Requirements 12.4**

### Property 45: Delivery Status Update
*For any* delivered shipment, order status should be updated to "delivered"
**Validates: Requirements 12.5**

### Property 46: Card Data Validation
*For any* invalid card data (wrong number, expired date), system should reject payment attempt
**Validates: Requirements 13.2**

### Property 47: Payment Success Order Creation
*For any* successful payment, order should exist in database with payment_status "paid"
**Validates: Requirements 13.3**

### Property 48: B2B Payment Terms
*For any* B2B customer selecting invoice payment, order should have payment_terms set to NET30 or NET60
**Validates: Requirements 13.5**

### Property 49: Meta Tags Presence
*For any* product page HTML, document should contain title, description, and og:image meta tags
**Validates: Requirements 15.1**

### Property 50: SEO-Friendly URL Format
*For any* generated URL, it should be in slug format (lowercase, hyphens, no IDs)
**Validates: Requirements 15.2**

### Property 51: Sitemap Completeness
*For any* generated sitemap, number of URLs should equal total number of products plus categories
**Validates: Requirements 15.4**

## Error Handling

### Error Categories

1. **Validation Errors** (400)
   - Missing required fields
   - Invalid data format
   - Business rule violations (e.g., min_order_qty)

2. **Authentication Errors** (401)
   - Invalid credentials
   - Expired tokens
   - Missing authentication

3. **Authorization Errors** (403)
   - Insufficient permissions
   - Admin-only routes accessed by customers

4. **Not Found Errors** (404)
   - Product not found
   - Category not found
   - Order not found

5. **Conflict Errors** (409)
   - Duplicate SKU
   - Insufficient stock
   - Concurrent modification

6. **Server Errors** (500)
   - Database connection failures
   - External API failures
   - Unexpected exceptions

### Error Response Format
```typescript
interface ErrorResponse {
  error: {
    code: string
    message: string
    details?: any
    timestamp: Date
  }
}
```

### Retry Strategy
- Network errors: Exponential backoff (1s, 2s, 4s)
- Rate limit errors: Wait and retry after specified time
- Transient errors: Up to 3 retries
- Fatal errors: No retry, log and alert

## Testing Strategy

### Unit Testing
- Service layer methods (ProductService, CategoryService, etc.)
- Utility functions (price calculation, URL generation)
- Data transformations
- Validation logic

**Tools:** Jest, TypeScript

### Property-Based Testing
- All 51 correctness properties listed above
- Generate random valid inputs
- Verify properties hold for all inputs
- Use fast-check library for TypeScript

**Configuration:**
- Minimum 100 iterations per property
- Shrinking enabled for counterexample minimization
- Seed for reproducibility

**Example:**
```typescript
// Property 1: Product Data Persistence
test('Product data round-trip', () => {
  fc.assert(
    fc.property(
      fc.record({
        name: fc.string(),
        sku: fc.string(),
        price: fc.float({ min: 0 }),
        // ... other fields
      }),
      async (productData) => {
        const saved = await productService.create(productData)
        const retrieved = await productService.retrieve(saved.id)
        expect(retrieved).toMatchObject(productData)
      }
    ),
    { numRuns: 100 }
  )
})
```

### Integration Testing
- API endpoint testing (Store + Admin)
- Database operations
- External service mocking (Stripe, SendGrid)
- Multi-step workflows (checkout, order fulfillment)

**Tools:** Supertest, MSW (Mock Service Worker)

### End-to-End Testing
- Complete user journeys
- Product search → add to cart → checkout → order
- Admin product creation → publish → verify on storefront
- Multi-language switching
- Dark mode toggle

**Tools:** Playwright or Cypress

### Performance Testing
- Load testing (concurrent users)
- Database query optimization
- API response times
- Frontend bundle size
- Lighthouse scores

**Targets:**
- API response < 200ms (p95)
- Page load < 2s
- Lighthouse score > 80
- Bundle size < 500KB

## Security Considerations

1. **Authentication**
   - JWT tokens with expiration
   - HTTP-only cookies
   - Refresh token rotation

2. **Authorization**
   - Role-based access control (RBAC)
   - Admin routes protected
   - Customer data isolation

3. **Input Validation**
   - Zod schema validation
   - SQL injection prevention (parameterized queries)
   - XSS protection (sanitize user input)

4. **Data Protection**
   - Passwords hashed (bcrypt)
   - Sensitive data encrypted at rest
   - HTTPS in production
   - CORS properly configured

5. **Rate Limiting**
   - API rate limits per IP
   - Brute force protection on login
   - DDoS mitigation

## Performance Optimization

1. **Database**
   - Indexes on frequently queried fields (SKU, category_id, customer_id)
   - Query optimization (avoid N+1)
   - Connection pooling
   - Read replicas for analytics

2. **Caching**
   - Redis for session storage
   - Product catalog caching (5 min TTL)
   - Category tree caching (1 hour TTL)
   - CDN for static assets

3. **Frontend**
   - Code splitting (lazy load admin)
   - Image optimization (next/image)
   - Bundle size optimization
   - Server-side rendering for SEO

4. **API**
   - Response compression (gzip)
   - Pagination for large datasets
   - GraphQL for flexible queries (optional)
   - Batch operations for bulk updates

## Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────────────────────┐
│                    Load Balancer                         │
│                    (Nginx/CloudFlare)                    │
└────────────┬────────────────────────────┬────────────────┘
             │                            │
    ┌────────┴────────┐          ┌───────┴────────┐
    │  Next.js App    │          │  Medusa API    │
    │  (Vercel)       │          │  (Railway)     │
    │  Port 3000      │          │  Port 9000     │
    └─────────────────┘          └────────┬───────┘
                                          │
                                 ┌────────┴────────┐
                                 │  PostgreSQL     │
                                 │  (Managed DB)   │
                                 └─────────────────┘
```

### Scaling Strategy
- Horizontal scaling for API servers
- Database read replicas
- CDN for static content
- Redis cluster for caching
- Queue system for background jobs (Bull/BullMQ)

## Monitoring and Observability

1. **Application Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring (Datadog/New Relic)
   - Uptime monitoring (UptimeRobot)

2. **Logging**
   - Structured logging (Winston/Pino)
   - Log aggregation (ELK stack or Loggly)
   - Request/response logging

3. **Metrics**
   - API response times
   - Database query performance
   - Error rates
   - User activity

4. **Alerts**
   - High error rate
   - Slow response times
   - Low stock levels
   - Failed payments
   - System downtime

## Migration Strategy

### Phase 1: Core Setup (Week 1-2)
- Database schema creation
- Medusa backend initialization
- Basic CRUD services
- Admin API endpoints

### Phase 2: Product Management (Week 3-4)
- Product service with translations
- Category service with hierarchy
- Inventory management
- Pricing service with tiers

### Phase 3: Customer & Orders (Week 5-6)
- Customer service with B2B profiles
- Cart functionality
- Order service
- Checkout flow

### Phase 4: Frontend (Week 7-8)
- Next.js storefront
- Product catalog with filters
- Shopping cart
- Checkout pages

### Phase 5: Admin Dashboard (Week 9-10)
- Admin UI components
- Product management
- Order management
- Analytics dashboard

### Phase 6: Integrations (Week 11-12)
- Stripe payment integration
- SendGrid email integration
- Shipping provider APIs
- Webhook handlers

### Phase 7: Testing & Optimization (Week 13-14)
- Property-based tests
- Integration tests
- E2E tests
- Performance optimization

### Phase 8: Deployment (Week 15-16)
- Production environment setup
- CI/CD pipeline
- Monitoring setup
- Go-live

## Future Enhancements

1. **Advanced Features**
   - Product recommendations (ML-based)
   - Advanced analytics (predictive)
   - Mobile app (React Native)
   - Voice search

2. **B2B Enhancements**
   - Quote requests
   - Contract pricing
   - Approval workflows
   - Credit limits

3. **Marketplace**
   - Multi-vendor support
   - Vendor dashboards
   - Commission management

4. **Internationalization**
   - Additional languages
   - Multi-currency support
   - Regional pricing
   - Local payment methods
