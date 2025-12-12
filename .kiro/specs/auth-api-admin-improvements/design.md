# Design Document - Auth, API Integration & Admin Dashboard Improvements

## Overview

This design document outlines the architecture and implementation approach for improving authentication, integrating real API data, and enhancing the admin dashboard with advanced features.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js 15 Frontend                      │
│  ┌────────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  Storefront    │  │  Auth Pages  │  │ Admin Dashboard│  │
│  │  (Customer UI) │  │ (Login/Reg)  │  │  (Admin UI)    │  │
│  └────────┬───────┘  └──────┬───────┘  └────────┬───────┘  │
│           │                  │                    │          │
│           └──────────────────┼────────────────────┘          │
│                              │                               │
│                    ┌─────────▼─────────┐                     │
│                    │   API Client      │                     │
│                    │  (api-client.ts)  │                     │
│                    └─────────┬─────────┘                     │
└──────────────────────────────┼───────────────────────────────┘
                               │
                               │ HTTP/HTTPS
                               │
┌──────────────────────────────▼───────────────────────────────┐
│                      Medusa.js Backend                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Auth API     │  │ Products API │  │  Admin API   │       │
│  │ /store/auth  │  │ /store/...   │  │  /admin/...  │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                  │                  │               │
│         └──────────────────┼──────────────────┘               │
│                            │                                  │
│                   ┌────────▼────────┐                         │
│                   │   PostgreSQL    │                         │
│                   │    Database     │                         │
│                   └─────────────────┘                         │
└───────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Authentication System

#### Auth Context Provider
```typescript
// storefront/contexts/AuthContext.tsx
interface AuthContextType {
  user: Customer | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}
```

#### Auth API Client
```typescript
// storefront/lib/auth-api.ts
class AuthAPI {
  async login(email: string, password: string): Promise<AuthResponse>
  async register(data: RegisterData): Promise<AuthResponse>
  async logout(): Promise<void>
  async getSession(): Promise<Customer | null>
  async refreshToken(): Promise<string>
}
```

### 2. API Client Enhancement

#### Centralized API Client
```typescript
// storefront/lib/api-client.ts (enhanced)
class APIClient {
  private baseURL: string
  private token: string | null
  
  // Auth methods
  async login(credentials): Promise<AuthResponse>
  async register(data): Promise<AuthResponse>
  
  // Product methods
  async getProducts(params): Promise<ProductsResponse>
  async getProduct(id): Promise<Product>
  
  // Cart methods
  async getCart(): Promise<Cart>
  async addToCart(item): Promise<Cart>
  async updateCartItem(id, quantity): Promise<Cart>
  
  // Customer methods
  async getCustomer(): Promise<Customer>
  async updateCustomer(data): Promise<Customer>
  
  // Admin methods
  async adminGetProducts(): Promise<Product[]>
  async adminUpdateProduct(id, data): Promise<Product>
  async adminUploadImage(file): Promise<Image>
  async adminGetStatistics(params): Promise<Statistics>
}
```

### 3. Admin Dashboard Components

#### Multi-Currency Price Manager
```typescript
// admin-dashboard/components/PriceManager.tsx
interface PriceManagerProps {
  product: Product
  currencies: Currency[]
  onUpdate: (prices: PriceData[]) => Promise<void>
}

interface PriceData {
  currency_code: string
  amount: number
  min_quantity?: number
  max_quantity?: number
}
```

#### Image Gallery Manager
```typescript
// admin-dashboard/components/ImageGallery.tsx
interface ImageGalleryProps {
  product: Product
  images: ProductImage[]
  onUpload: (files: File[]) => Promise<void>
  onReorder: (images: ProductImage[]) => Promise<void>
  onDelete: (imageId: string) => Promise<void>
  onSetPrimary: (imageId: string) => Promise<void>
}

interface ProductImage {
  id: string
  url: string
  order: number
  is_primary: boolean
}
```

#### Variant Manager
```typescript
// admin-dashboard/components/VariantManager.tsx
interface VariantManagerProps {
  product: Product
  variants: ProductVariant[]
  onCreateVariant: (data: VariantData) => Promise<void>
  onUpdateVariant: (id: string, data: VariantData) => Promise<void>
  onDeleteVariant: (id: string) => Promise<void>
}

interface ProductVariant {
  id: string
  title: string
  sku: string
  options: VariantOption[]
  prices: PriceData[]
  inventory_quantity: number
  manage_inventory: boolean
}
```

#### Sales Statistics Dashboard
```typescript
// admin-dashboard/components/StatisticsDashboard.tsx
interface StatisticsDashboardProps {
  dateRange: DateRange
  onDateRangeChange: (range: DateRange) => void
}

interface Statistics {
  total_revenue: number
  total_orders: number
  average_order_value: number
  top_products: TopProduct[]
  revenue_by_day: RevenueData[]
  orders_by_status: OrderStatusData[]
}
```

## Data Models

### Customer (Enhanced)
```typescript
interface Customer {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string | null
  has_account: boolean
  created_at: string
  updated_at: string
  billing_address?: Address
  shipping_addresses?: Address[]
  orders?: Order[]
}
```

### Product (Enhanced with Multi-Currency)
```typescript
interface Product {
  id: string
  title: string
  description: string
  handle: string
  thumbnail: string | null
  images: ProductImage[]
  variants: ProductVariant[]
  prices: PriceData[]  // Multi-currency prices
  options: ProductOption[]
  tags: ProductTag[]
  collection_id: string | null
  type_id: string | null
  created_at: string
  updated_at: string
}
```

### Currency
```typescript
interface Currency {
  code: string  // USD, EUR, PLN, etc.
  symbol: string  // $, €, zł
  name: string
  exchange_rate: number  // Relative to base currency
  is_default: boolean
}
```

## Error Handling

### Error Types
```typescript
enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED'
}

interface APIError {
  type: ErrorType
  message: string
  field?: string  // For validation errors
  code?: string
}
```

### Error Handling Strategy
1. **Network Errors**: Retry with exponential backoff (3 attempts)
2. **Auth Errors**: Redirect to login, clear session
3. **Validation Errors**: Display field-specific errors
4. **Server Errors**: Show generic error, log to monitoring
5. **Permission Errors**: Show access denied message

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Authentication Properties

**Property 1: Registration creates account**
*For any* valid registration data (email, password, name), submitting it should result in a new customer account existing in the database
**Validates: Requirements 1.1**

**Property 2: Login creates session**
*For any* valid user credentials, logging in should create a session token that can be used for authenticated requests
**Validates: Requirements 1.2**

**Property 3: Invalid credentials return errors**
*For any* invalid credentials (wrong password, non-existent email), authentication should fail with appropriate error messages
**Validates: Requirements 1.3**

**Property 4: Session persistence (round-trip)**
*For any* logged-in user, refreshing the page should maintain the session without requiring re-login
**Validates: Requirements 1.4**

**Property 5: Logout clears session**
*For any* logged-in user, logging out should clear all session data and subsequent requests should be unauthenticated
**Validates: Requirements 1.5, 8.4**

### API Integration Properties

**Property 6: Cart operations persist**
*For any* product added to cart, the cart state should be updated via API and persist across page refreshes
**Validates: Requirements 2.2**

**Property 7: Loading states during API calls**
*For any* API request, a loading indicator should be displayed while the request is in progress
**Validates: Requirements 2.3, 7.1**

**Property 8: API errors show messages**
*For any* failed API request, an error message should be displayed to the user with option to retry
**Validates: Requirements 2.4, 7.2**

**Property 9: Form validation highlights errors**
*For any* invalid form submission, all invalid fields should be highlighted with specific error messages
**Validates: Requirements 7.4**

### Multi-Currency Properties

**Property 10: All currency prices displayed**
*For any* product with prices in multiple currencies, the admin view should display all configured currency prices
**Validates: Requirements 3.1**

**Property 11: Price update round-trip**
*For any* currency and price value, updating a product's price should persist the change and subsequent fetches should return the updated price
**Validates: Requirements 3.2**

**Property 12: Currency selection affects display**
*For any* selected currency, all product prices should be displayed in that currency
**Validates: Requirements 3.3**

### Image Gallery Properties

**Property 13: Image upload associates with product**
*For any* valid image file, uploading it should store the image and associate it with the correct product
**Validates: Requirements 4.1**

**Property 14: All images displayed in gallery**
*For any* product with multiple images, all images should be displayed in the gallery view
**Validates: Requirements 4.2**

**Property 15: Image reordering persists**
*For any* reordering of product images, the new order should be saved and maintained in subsequent views
**Validates: Requirements 4.3**

**Property 16: Image deletion removes from product**
*For any* product image, deleting it should remove it from the product and it should not appear in subsequent views
**Validates: Requirements 4.4**

**Property 17: Primary image becomes thumbnail**
*For any* image set as primary, it should be used as the product thumbnail in all product listings
**Validates: Requirements 4.5**

### Product Variants Properties

**Property 18: Variant creation stores options**
*For any* valid variant data (options, SKU, etc.), creating a variant should store all options and make them retrievable
**Validates: Requirements 5.1**

**Property 19: Variant-specific pricing**
*For any* product variant, setting a price should apply only to that variant and not affect other variants
**Validates: Requirements 5.2**

**Property 20: Inventory tracking per variant**
*For any* variant inventory update, the stock level should be tracked independently for that variant
**Validates: Requirements 5.3**

**Property 21: Variant selection shows correct data**
*For any* variant selection, the displayed price and availability should match that specific variant's data
**Validates: Requirements 5.4**

**Property 22: Disabled variants hidden from customers**
*For any* variant marked as disabled, it should not appear in the customer-facing product options
**Validates: Requirements 5.5**

### Statistics Properties

**Property 23: Revenue calculation accuracy**
*For any* date range and set of orders, the calculated total revenue should equal the sum of all order totals in that range
**Validates: Requirements 6.1**

**Property 24: Statistics calculations correct**
*For any* set of orders, the number of orders and average order value should be mathematically accurate
**Validates: Requirements 6.2**

**Property 25: Date filtering updates statistics**
*For any* date range filter, the statistics should only include orders within that range
**Validates: Requirements 6.3**

**Property 26: Top products correctly identified**
*For any* sales data, the top products list should be ordered by total sales volume
**Validates: Requirements 6.4**

### Session Management Properties

**Property 27: Secure token storage**
*For any* successful login, the session token should be stored securely (httpOnly cookie or secure storage)
**Validates: Requirements 8.1**

**Property 28: Session restoration (round-trip)**
*For any* user with valid session, refreshing the page should restore the session from the stored token
**Validates: Requirements 8.2**

## Testing Strategy

### Unit Tests
- Auth context provider logic
- API client methods
- Form validation functions
- Currency conversion utilities
- Image upload handlers
- Statistics calculation functions

### Integration Tests
- Login/logout flow
- Product fetching and display
- Cart operations
- Admin product updates
- Multi-currency price updates
- Image upload and gallery management

### Property-Based Tests
Each correctness property above should be implemented as a property-based test using an appropriate testing library (e.g., fast-check for TypeScript/JavaScript). Each test should:
- Run a minimum of 100 iterations
- Generate random valid inputs
- Verify the property holds for all inputs
- Be tagged with the property number and requirement reference

## Security Considerations

### Authentication
- Store JWT tokens in httpOnly cookies
- Implement CSRF protection
- Use secure session management
- Implement rate limiting on auth endpoints

### API Security
- Validate all inputs on backend
- Sanitize user-generated content
- Implement proper CORS policies
- Use HTTPS for all communications

### Admin Security
- Require admin authentication for all admin routes
- Implement role-based access control (RBAC)
- Log all admin actions for audit trail
- Validate file uploads (type, size, content)

## Performance Optimization

### Frontend
- Implement React Query for caching API responses
- Use Next.js Image component for optimized images
- Lazy load admin dashboard components
- Implement virtual scrolling for large product lists

### Backend
- Add database indexes for frequently queried fields
- Implement Redis caching for product data
- Use connection pooling for database
- Optimize image storage (CDN, compression)

## Implementation Phases

### Phase 1: Authentication (Priority: HIGH)
1. Fix auth API endpoints
2. Implement AuthContext provider
3. Create login/register pages
4. Add session management
5. Test auth flow

### Phase 2: API Integration (Priority: HIGH)
1. Enhance API client
2. Replace mock data in product pages
3. Integrate cart API
4. Add loading states
5. Implement error handling

### Phase 3: Multi-Currency (Priority: MEDIUM)
1. Add currency table to database
2. Create currency management API
3. Build price manager UI
4. Implement currency selector
5. Test price display

### Phase 4: Image Gallery (Priority: MEDIUM)
1. Implement image upload API
2. Create gallery component
3. Add drag-and-drop reordering
4. Implement image optimization
5. Test upload flow

### Phase 5: Variants (Priority: MEDIUM)
1. Review Medusa variant structure
2. Build variant manager UI
3. Implement variant CRUD operations
4. Add inventory management
5. Test variant selection

### Phase 6: Statistics (Priority: LOW)
1. Create statistics API endpoints
2. Build dashboard charts
3. Implement date range filtering
4. Add export functionality
5. Test data accuracy

## Migration Strategy

### Database Migrations
```sql
-- Add currency support
ALTER TABLE product_prices ADD COLUMN currency_code VARCHAR(3) DEFAULT 'USD';
CREATE INDEX idx_prices_currency ON product_prices(currency_code);

-- Add image ordering
ALTER TABLE product_images ADD COLUMN display_order INTEGER DEFAULT 0;
ALTER TABLE product_images ADD COLUMN is_primary BOOLEAN DEFAULT false;
```

### Data Migration
1. Migrate existing prices to USD currency
2. Set first image as primary for all products
3. Create default currency records (USD, EUR, PLN)

## Deployment Considerations

- Run database migrations before deploying code
- Update environment variables for new features
- Clear Redis cache after deployment
- Monitor error rates post-deployment
- Have rollback plan ready

## Monitoring and Logging

### Metrics to Track
- Authentication success/failure rates
- API response times
- Error rates by endpoint
- Image upload success rates
- Admin action audit logs

### Logging Strategy
- Log all authentication attempts
- Log API errors with stack traces
- Log admin actions (who, what, when)
- Log performance metrics
- Use structured logging (JSON format)
