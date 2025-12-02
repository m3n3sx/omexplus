# KIRO PROMPTS - MEDUSAJS + NEXT.JS E-COMMERCE
## OMEX - Complete Implementation from Scratch

---

## 📋 PRZED ROZPOCZĘCIEM

```bash
# Upewnij się że masz:
node -v          # Node.js 18+
npm -v           # npm 9+
kiro --version   # Kiro CLI

# Jeśli brakuje Kiro CLI:
npm install -g @amazon-kiro/cli
```

---

## 🚀 PROMPT 1: NOWY PROJEKT - MEDUSAJS + NEXT.JS

```
Kiro, stwórz dla mnie nowy projekt e-commerce z następującymi specyfikacjami:

NAZWA PROJEKTU: omex-medusa-ecommerce
FRAMEWORK FRONTEND: Next.js 15 (App Router)
BACKEND: MedusaJS 2.0
DATABASE: PostgreSQL
AUTHENTICATION: NextAuth.js
PAYMENT GATEWAY: Stripe
EMAIL SERVICE: SendGrid
STYLING: Tailwind CSS + Shadcn/UI
LANGUAGE: TypeScript
PACKAGE MANAGER: npm

STRUKTURA:
- apps/storefront (Next.js frontend)
- apps/admin (Next.js admin panel)
- packages/medusa-backend (MedusaJS server)

FEATURES DO INICJALIZACJI:
- Next.js 15 z App Router
- Medusa v2 z domyślnymi pluginami
- PostgreSQL connection
- Tailwind CSS
- TypeScript strict mode
- ESLint + Prettier
- Git initialized
- Environment files (.env.local)

FOLDER STRUKTURA:
omex-medusa-ecommerce/
├── apps/
│   ├── storefront/          (Next.js store)
│   ├── admin/               (Next.js admin)
│   └── backend/             (MedusaJS)
├── packages/
│   ├── types/               (shared TypeScript)
│   └── ui/                  (shared components)
└── docker-compose.yml       (local dev setup)

ZAINSTALUJ DOMYŚLNIE:
- @medusajs/medusa
- @medusajs/admin
- @medusajs/plugins-*
- next-intl (dla multi-language)
- zustand (state management)
- axios (HTTP client)
- stripe (payment processing)

KONFIGURACJA:
- Next.js: Image optimization, Font optimization
- Medusa: Seed data (produkty), Default regions
- Database: PostgreSQL prepared
- Ports: Frontend 3000, Admin 7001, API 9000

Zacznij z domyślnym seeded data i gotowymi do modyfikacji konfiguracjami.
```

---

## 🏢 PROMPT 2: MEDUSA BACKEND - SETUP

```
Kiro, skonfiguruj MedusaJS backend z następującymi wymaganiami:

MEDUSA KONFIGURACJA:

DATABASE:
- PostgreSQL connection
- Migration scripts ready
- Seed data z produktami e-commerce

PLUGINS DO ZAINSTALOWANIA:
✓ @medusajs/plugins-cache-inmemory (cache)
✓ @medusajs/plugins-event-bus-local (events)
✓ @medusajs/plugins-file-local (file upload)
✓ medusa-plugin-stripe (Stripe integration)
✓ medusa-plugin-sendgrid (Email notifications)

ENTITIES DO KONFIGURACJI:
- Product (sku, nazwa, price_brutto, price_netto, images)
- ProductCategory (hierarchical - Koła, Wałki, Hydraulika, etc)
- ProductBrand (CAT, Komatsu, JCB, Volvo, etc)
- Order (full e-commerce order management)
- Customer (with loyalty points, discounts)
- Region (PL - PLN, EU - EUR)
- Currency (PLN, EUR)
- ShippingMethod (delivery options)

API ENDPOINTS - AUTOMATYCZNIE WYGENEROWANE:
- GET /store/products
- POST /store/carts
- POST /store/orders
- GET /store/customers/:id
- POST /store/auth/register
- POST /store/auth/login

ADMIN ENDPOINTS:
- GET /admin/products
- POST /admin/products (create)
- PUT /admin/products/:id (update)
- DELETE /admin/products/:id
- GET /admin/orders
- GET /admin/customers

SEED DATA:
- 100+ produkty z CSV (Koła, Wałki, Hydraulika, etc)
- 10 kategorii
- 8 marek
- 2 regiony (PL, EU)
- Sample orders (dla testowania)

EVENT SYSTEM:
- order.placed → Send confirmation email
- order.shipped → Send shipping notification
- customer.created → Send welcome email

STRIPE INTEGRATION:
- Payment method: Stripe
- Webhook handling
- Automatic payment processing

SENDGRID INTEGRATION:
- Transactional emails
- Order confirmations
- Shipping notifications
- Customer communications

API PORT: 9000
ADMIN PORT: 7001

Po skończeniu pokaż:
✓ Database connection working
✓ Seed data imported
✓ API endpoints responding
✓ Admin panel accessible
```

---

## 🎨 PROMPT 3: NEXT.JS STOREFRONT - SETUP

```
Kiro, skonfiguruj Next.js storefront (frontend) z następującymi wymaganiami:

FRONTEND SETUP:
- Next.js 15 (App Router)
- TypeScript strict mode
- Tailwind CSS
- Shadcn/UI components
- next-intl (multi-language: PL, EN, DE, UKR)
- Zustand (state management)

INICJALNA KONFIGURACJA:

tailwind.config.js - OMEX COLORS:
Primary: #2185a3 (Omex teal)
Secondary: #f39c12 (Omex orange)
Full neutral palette (50-950)

FOLDER STRUKTURA:
apps/storefront/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx          (i18n wrapper)
│   │   ├── page.tsx            (home)
│   │   ├── (shop)/
│   │   │   ├── produkty/        (catalog)
│   │   │   ├── produkty/[sku]/  (detail)
│   │   │   ├── koszyk/          (cart)
│   │   │   ├── checkout/        (checkout)
│   │   │   ├── account/         (user account)
│   │   │   └── szukaj/          (search)
│   │   ├── api/
│   │   │   ├── auth/            (NextAuth)
│   │   │   ├── cart/
│   │   │   ├── orders/
│   │   │   └── products/
│   │   └── (auth)/
│   │       ├── login/
│   │       └── register/
│   │
│   └── robots.ts
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── Cart.tsx
│   ├── SearchBar.tsx
│   └── LanguageCurrencySwitcher.tsx
├── lib/
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useCurrency.ts
│   │   └── useProducts.ts
│   ├── store/
│   │   ├── cartStore.ts (Zustand)
│   │   └── userStore.ts
│   └── medusa-client.ts (API client)
├── messages/
│   ├── pl.json
│   ├── en.json
│   ├── de.json
│   └── uk.json
├── public/
│   └── logo.png
└── styles/
    └── globals.css

ZAINSTALUJ PACKAGES:
- next-intl
- zustand
- axios
- next-auth
- @stripe/react-js
- react-hot-toast
- swiper (product carousel)
- @radix-ui/react-* (UI primitives)

MEDUSA API CLIENT:
- Połączenie do http://localhost:9000
- Automatic request/response handling
- Error handling
- Token management

AUTHENTICATION:
- NextAuth.js configuration
- JWT strategy
- Medusa user sync
- Login/Register flows

IMAGE OPTIMIZATION:
- Next.js Image component
- Medusa file upload integration
- Responsive images
- WebP format

Pokaż gotowy do uruchomienia projekt z `npm run dev`
```

---

## 💳 PROMPT 4: STRIPE INTEGRATION (MedusaJS)

```
Kiro, skonfiguruj Stripe integration w MedusaJS z pełnymi capabilities:

STRIPE MEDUSA PLUGIN:

INSTALACJA:
npm install medusa-plugin-stripe

KONFIGURACJA (medusa-config.js):
{
  resolve: 'medusa-plugin-stripe',
  options: {
    apiKey: process.env.STRIPE_API_KEY,
    webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
}

PAYMENT METHOD CONFIGURATION:
- Region: PL (Currency: PLN)
- Region: EU (Currency: EUR)
- Payment Processor: Stripe
- Webhook: /admin/webhooks/stripe

STRIPE SETUP:
1. Create Stripe Account (stripe.com)
2. Get API Keys:
   - Publishable Key (pk_test_...)
   - Secret Key (sk_test_...)
   - Webhook Secret (whsec_...)
3. Configure webhook endpoint: /admin/webhooks/stripe

WEBHOOK HANDLERS:
- payment_intent.succeeded → Update order status
- payment_intent.payment_failed → Order failed notification
- charge.dispute.created → Handle disputes

ORDER FLOW:
1. Customer adds items to cart
2. Proceeds to checkout
3. Enters payment details
4. Payment Intent created
5. Payment processed via Stripe
6. Order confirmed in Medusa
7. Confirmation email sent

ENVIRONMENT VARIABLES (.env):
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

API ENDPOINTS:
- POST /store/payment-collections/:id/sessions
- POST /store/payment-collections/:id/authorize
- POST /store/payment-collections/:id/capture

TESTING:
- Use Stripe test cards
- 4242 4242 4242 4242 (success)
- 4000 0000 0000 0002 (declined)
- Test webhooks locally with stripe-cli

Pokaż gotową do testowania Stripe integrację
```

---

## 📧 PROMPT 5: SENDGRID INTEGRATION (MedusaJS)

```
Kiro, skonfiguruj SendGrid email service w MedusaJS:

SENDGRID SETUP:

PLUGIN:
npm install medusa-plugin-sendgrid

KONFIGURACJA (medusa-config.js):
{
  resolve: 'medusa-plugin-sendgrid',
  options: {
    apiKey: process.env.SENDGRID_API_KEY,
    from: 'noreply@omex.pl',
    templates: {
      order_placed: 'd-xxx',      // SendGrid template ID
      order_shipped: 'd-xxx',
      user_created: 'd-xxx',
      order_confirmed: 'd-xxx',
    }
  }
}

ENVIRONMENT VARIABLES:
SENDGRID_API_KEY=SG.xxxxx

EMAIL TEMPLATES (SendGrid):
1. Order Confirmation
   - Order number
   - Items list
   - Total price
   - Tracking link
   - Support contact

2. Order Shipped
   - Tracking number
   - Carrier info
   - Estimated delivery
   - Track & trace link

3. Welcome Email (new customer)
   - Welcome message
   - Profile setup
   - First order discount (10%)
   - Support info

4. Password Reset
   - Reset link
   - Expiration time
   - Support contact

5. Order Status Update
   - Current status
   - Timeline
   - Next steps

EVENT LISTENERS:
- order.placed → Send confirmation
- order.updated → Send status update
- customer.created → Send welcome
- user.password_reset → Send reset link

VARIABLES W TEMPLATES:
- {{first_name}}
- {{last_name}}
- {{order_number}}
- {{order_total}}
- {{order_items}}
- {{tracking_number}}
- {{discount_code}}

EMAIL CONFIGURATION:
From: noreply@omex.pl
Reply-To: support@omex.pl
Logo: Omex branding
Language Support: Multi-language templates

TESTING:
- Send test emails from SendGrid dashboard
- Verify templates rendering
- Check all variables populated
- Test with real order flow

Pokaż gotową integrację SendGrid z example templates
```

---

## 🌍 PROMPT 6: MULTI-LANGUAGE SETUP (next-intl)

```
Kiro, skonfiguruj multi-language system z next-intl dla 4 języków:

LANGUAGES:
- PL - Polski
- EN - English  
- DE - Deutsch
- UK - Українська

INSTALACJA:
npm install next-intl

KONFIGURACJA (next.config.js):
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();

module.exports = withNextIntl({
  i18n: {
    locales: ['pl', 'en', 'de', 'uk'],
    defaultLocale: 'pl',
    localeDetection: true,
  }
});

STRUKTURA MESSAGES:

messages/pl.json - PEŁNE TŁUMACZENIA:
{
  "nav": {
    "home": "Strona główna",
    "products": "Produkty",
    "categories": "Kategorie",
    "cart": "Koszyk",
    "account": "Konto",
    "search": "Szukaj",
    "languages": "Języki",
    "currencies": "Waluty"
  },
  "products": {
    "title": "Nasze produkty",
    "filters": "Filtry",
    "price": "Cena",
    "inStock": "Na magazynie",
    "outOfStock": "Brak",
    "addToCart": "Dodaj do koszyka",
    "viewDetails": "Szczegóły"
  },
  "cart": {
    "empty": "Koszyk pusty",
    "total": "Razem",
    "checkout": "Przejdź do kasy",
    "continueShopping": "Kontynuuj zakupy"
  },
  "account": {
    "profile": "Profil",
    "orders": "Moje zamówienia",
    "addresses": "Adresy",
    "logout": "Wyloguj"
  },
  "checkout": {
    "billing": "Adres rozliczeniowy",
    "shipping": "Adres dostawy",
    "payment": "Płatność",
    "review": "Podsumowanie",
    "placeOrder": "Złóż zamówienie"
  }
}

messages/en.json - ENGLISH:
{
  "nav": {
    "home": "Home",
    "products": "Products",
    "categories": "Categories",
    "cart": "Cart",
    "account": "Account",
    "search": "Search",
    "languages": "Languages",
    "currencies": "Currencies"
  },
  "products": {
    "title": "Our Products",
    "filters": "Filters",
    "price": "Price",
    "inStock": "In Stock",
    "outOfStock": "Out of Stock",
    "addToCart": "Add to Cart",
    "viewDetails": "View Details"
  },
  "cart": {
    "empty": "Your cart is empty",
    "total": "Total",
    "checkout": "Proceed to Checkout",
    "continueShopping": "Continue Shopping"
  },
  "account": {
    "profile": "Profile",
    "orders": "My Orders",
    "addresses": "Addresses",
    "logout": "Logout"
  },
  "checkout": {
    "billing": "Billing Address",
    "shipping": "Shipping Address",
    "payment": "Payment",
    "review": "Order Review",
    "placeOrder": "Place Order"
  }
}

messages/de.json - DEUTSCH:
(Complete German translations)

messages/uk.json - УКРАЇНСЬКА:
(Complete Ukrainian translations)

ROOT LAYOUT (app/[locale]/layout.tsx):
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

export async function generateStaticParams() {
  return [
    { locale: 'pl' },
    { locale: 'en' },
    { locale: 'de' },
    { locale: 'uk' }
  ];
}

LANGUAGE SWITCHER COMPONENT:
- Shows current language: 🇵🇱 Polski
- Dropdown with all 4 languages
- Smooth language switching
- Persists selection in localStorage

SEO METADATA:
- hreflang tags dla każdego języka
- Proper lang attributes
- Canonical URLs

Pokaż gotowy system multi-language z działającymi przełącznikami
```

---

## 💱 PROMPT 7: MULTI-CURRENCY SETUP

```
Kiro, skonfiguruj system multi-currency dla PLN i EUR:

MEDUSA REGIONS CONFIGURATION:

REGION 1 - POLAND:
- Name: Poland
- Currency: PLN
- Tax Rate: 23%
- Shipping Methods:
  * Standard (2-3 dni) - 15 zł
  * Express (1 dzień) - 25 zł
  * Free (3-5 dni, na zamówienia > 200 zł)

REGION 2 - EUROPE:
- Name: Europe
- Currency: EUR
- Tax Rate: 19%
- Shipping Methods:
  * Standard (3-5 dni) - 8 EUR
  * Express (1-2 dni) - 12 EUR
  * Free (4-7 dni, na zamówienia > 100 EUR)

EXCHANGE RATES:
- 1 EUR = 4.3 PLN (dynamically updatable)
- Update daily via API

CURRENCY STORE (Zustand):
interface CurrencyStore {
  currency: 'PLN' | 'EUR';
  region: 'PL' | 'EU';
  exchangeRate: number;
  setCurrency: (currency) => void;
  setRegion: (region) => void;
  convertPrice: (price: number) => number;
  formatPrice: (price: number) => string;
}

HOOKS:
export const useCurrency = create<CurrencyStore>()(
  persist((set, get) => ({
    currency: 'PLN',
    region: 'PL',
    exchangeRate: 4.3,
    
    setCurrency: (curr) => set({ currency: curr }),
    setRegion: (reg) => set({ region: reg }),
    
    convertPrice: (price) => {
      const { currency, exchangeRate } = get();
      if (currency === 'PLN') return price;
      return price / exchangeRate;
    },
    
    formatPrice: (price) => {
      const { currency } = get();
      return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: currency,
      }).format(price);
    }
  }), { name: 'currency-store' })
);

COMPONENT - CURRENCY SWITCHER:
- Show current: PLN / EUR
- Dropdown selector
- Auto-update all prices
- Persist selection
- Show exchange rate

PRICE DISPLAY:
- Always show in selected currency
- Include VAT in displayed price
- Clear pricing information
- Currency symbol (zł / €)

CHECKOUT:
- Show prices in selected currency
- Tax calculation per region
- Shipping cost in selected currency
- Final total in selected currency

ENVIRONMENT VARIABLES:
NEXT_PUBLIC_CURRENCY_PLN=PLN
NEXT_PUBLIC_CURRENCY_EUR=EUR
EXCHANGE_RATE_EUR_PLN=4.3

Pokaż działający system z przełącznikiem walut i konwersją cen
```

---

## 👤 PROMPT 8: MEDUSA CUSTOMER & AUTH

```
Kiro, skonfiguruj system klientów i autentyfikacji w MedusaJS:

CUSTOMER ENTITY W MEDUSA:

Pola:
- email (unique)
- first_name
- last_name
- phone
- billing_address
- shipping_addresses[]
- orders[]
- metadata: {
    company_name: string,
    nip: string,
    loyalty_points: number,
    discount_percentage: number,
    preferred_language: 'pl'|'en'|'de'|'uk',
    preferred_currency: 'PLN'|'EUR'
  }

ADDRESSES:
- Type: billing | shipping
- street
- city
- postal_code
- country
- is_default: boolean

AUTHENTICATION (MedusaJS API):

ENDPOINTS:
POST /store/auth
- Register new customer
- Body: email, password, first_name, last_name, phone
- Returns: JWT token + customer data

POST /store/auth/login
- Login
- Body: email, password
- Returns: JWT token

POST /store/auth/logout
- Logout
- Headers: Authorization

GET /store/auth/me
- Get current user
- Headers: Authorization
- Returns: customer data + orders + addresses

PASSWORD MANAGEMENT:
POST /store/auth/request-reset-password
- Request password reset
- Body: email
- Sends email with reset link

POST /store/auth/reset-password
- Reset password
- Body: email, token, password
- Updates password

CUSTOMER API (MedusaJS):

GET /store/customers/:id
GET /store/customers/:id/orders
GET /store/customers/:id/addresses
POST /store/customers/:id/addresses (add address)
PUT /store/customers/:id (update profile)

NEXTAUTH CONFIGURATION:

[...nextauth].ts:
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const response = await fetch(
          `${process.env.MEDUSA_API_URL}/store/auth/login`,
          {
            method: 'POST',
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          }
        );

        const user = await response.json();
        if (response.ok && user) {
          return user;
        }
        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) token.user = user;
      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user;
      return session;
    },
  },
};

LOYALTY SYSTEM:
- 1 PLN = 1 punkt
- 100 punktów = 10 PLN rabat
- Discount automatic na checkout

CUSTOMER DASHBOARD:
- Profile info
- Order history
- Saved addresses
- Loyalty points balance
- Discount codes
- Preferences (language, currency)

Pokaż gotowy system autentyfikacji z NextAuth + MedusaJS integrą
```

---

## 🛍️ PROMPT 9: PRODUCT CATALOG & SEARCH

```
Kiro, skonfiguruj katalog produktów i system wyszukiwania:

PRODUCT ENTITY (MedusaJS):

Pola:
- id (UUID)
- sku (unique, string)
- title (nazwa produktu)
- description (long text)
- collection (Koła, Wałki, etc)
- type (internal categorization)
- tags (dla search)
- metadata: {
    oem_number: string,
    compatibility: string[],
    warranty_months: number
  }

PRODUCT VARIANTS:
- price_netto
- price_brutto
- sku_variant
- stock_quantity
- images[]

MEDUSA COLLECTIONS (Kategorie):
1. Koła (Drive Wheels)
2. Wałki (Shafts)
3. Hydraulika (Hydraulic)
4. Uszczelnienia (Seals)
5. Łożyska (Bearings)
6. Silniki (Engines)
7. Pompy (Pumps)
8. Filtry & Oleje (Filters)
9. Elektryka (Electrical)
10. Akcesoria (Accessories)

MEDUSA PRODUCT TYPES:
- By Brand: CAT, Komatsu, JCB, Volvo, Case, Hitachi, etc
- Filtering per brand

API ENDPOINTS:

GET /store/products
- Query params:
  * collection_id
  * type
  * limit
  * offset
  * sort (price_asc, price_desc, newest)
- Returns: paginated products

GET /store/products/:id
- Returns: full product details + variants

SEARCH SYSTEM (Full-text):

POST /store/search
- Query: search term
- Fields: title, description, sku, tags
- Returns: matched products (max 20)
- Sorting by relevance

SEARCH IMPLEMENTATION:
- Client-side debouncing (300ms)
- Server-side full-text search in Medusa
- Results show: image, title, price, availability
- Click → product detail page

FILTERS:

FilterSidebar Component:
- Collections (checkboxes)
- Type/Brand (checkboxes)
- Price Range (slider)
  * Min: 0 PLN
  * Max: 10000 PLN
- Stock Status:
  * In Stock
  * Pre-order
  * Out of stock
- Sort Options:
  * Newest
  * Price: Low to High
  * Price: High to Low
  * Most Popular
  * Best Rated

PRODUCT DETAIL PAGE:

Display:
- Title, SKU, OEM#
- Image gallery (5+ images)
- Price (netto/brutto)
- Stock status
- Rating & reviews
- Specification table
- Compatibility info
- Warranty info
- Add to cart button
- Related products carousel

SEED DATA:
- 100+ produkty
- Każdy z pełnym opisem
- Images (4+ per product)
- Specifications
- OEM numbers
- Compatibility lists

Pokaż gotowy system katalogowy z filtrowaniem i wyszukiwaniem
```

---

## 🛒 PROMPT 10: SHOPPING CART & CHECKOUT

```
Kiro, skonfiguruj system koszyka i checkout:

CART SYSTEM (MedusaJS):

ENDPOINTS:
POST /store/carts
- Stwórz nowy koszyk
- Returns: cart_id + items

GET /store/carts/:id
- Pobierz zawartość koszyka
- Returns: items, totals, tax, shipping

POST /store/carts/:id/line-items
- Add product to cart
- Body: product_id, quantity
- Returns: updated cart

PUT /store/carts/:id/line-items/:line_id
- Update quantity
- Body: quantity

DELETE /store/carts/:id/line-items/:line_id
- Remove item from cart

CART FEATURES:
- Persistent cart (localStorage + backend)
- Real-time price updates
- Tax calculation
- Shipping cost calculation
- Coupon/Discount application
- Stock validation

ZUSTAND CART STORE:
interface CartStore {
  cart: Cart | null;
  items: CartItem[];
  addToCart: (product, quantity) => void;
  removeFromCart: (lineItemId) => void;
  updateQuantity: (lineItemId, quantity) => void;
  clearCart: () => void;
  applyCoupon: (code) => void;
}

CHECKOUT FLOW (4 STEPS):

STEP 1 - SHIPPING ADDRESS:
- First name, Last name
- Street address
- City, Postal code
- Country (predefined: PL, EU)
- Select from saved addresses
- Mark as default
- Continue button

STEP 2 - BILLING ADDRESS:
- Same as shipping (auto-fill option)
- Different address option
- Select from saved addresses
- Continue button

STEP 3 - SHIPPING METHOD:
- Show available shipping options
- Standard, Express, Free (if qualified)
- Cost displayed in selected currency
- Estimated delivery time
- Select one
- Continue button

STEP 4 - PAYMENT:
- Order summary (itemized)
- Subtotal
- Tax (per region)
- Shipping cost
- Discount/Coupon
- TOTAL

Payment options:
- Stripe Card
- Apple Pay (if available)
- Google Pay (if available)
- Place Order button

ORDER CONFIRMATION:
- Order number
- Order date
- Items list
- Total paid
- Shipping address
- Tracking info (soon)
- Email confirmation sent

MEDUSA ENDPOINTS - CHECKOUT:

POST /store/carts/:id/complete
- Complete cart → Create order
- Body: email, billing_address, shipping_address, shipping_method, payment_method
- Returns: order created

POST /store/orders/:id
- Get order details
- Returns: full order info

EMAIL AFTER ORDER:
- SendGrid triggered
- Order confirmation email
- With tracking link (later)

ERROR HANDLING:
- Stock validation errors
- Address validation
- Payment errors (Stripe)
- Shipping errors
- User-friendly error messages

Pokaż działający flow checkout ze wszystkimi 4 krokami
```

---

## 📊 PROMPT 11: ADMIN PANEL (Next.js)

```
Kiro, stwórz Admin Panel w Next.js z Medusa integracją:

ADMIN STRUKTURA:

apps/admin/
├── app/
│   ├── dashboard/
│   ├── products/
│   │   ├── page.tsx (lista)
│   │   └── [id]/page.tsx (edycja)
│   ├── orders/
│   │   └── [id]/page.tsx (detale)
│   ├── customers/
│   ├── analytics/
│   ├── settings/
│   └── login/
└── components/
    ├── AdminLayout.tsx
    └── Sidebar.tsx

DASHBOARD:
- Total Revenue (today, week, month)
- Total Orders
- Total Customers
- Recent Orders (last 5)
- Top Products
- Revenue Chart (line chart)
- Orders Chart (bar chart)

PRODUCTS MANAGEMENT:

List View:
- SKU
- Title
- Price (netto/brutto)
- Stock
- Category
- Brand
- Actions: Edit, Delete

Create/Edit Product:
- Title, Description
- SKU (unique)
- OEM Number
- Category dropdown
- Brand dropdown
- Price (netto → brutto auto-calc)
- Stock quantity
- Images upload (multiple)
- Specifications (JSON editor)
- Compatibility list
- Meta tags (SEO)
- Save/Cancel buttons

ORDERS MANAGEMENT:

List View:
- Order Number
- Customer Name
- Date
- Total
- Status (pending, processing, shipped, delivered)
- Actions: View, Update Status, Invoice

Order Detail:
- Customer info
- Shipping address
- Billing address
- Items (product, qty, price)
- Order total
- Payment status
- Shipping status
- Tracking number
- Status update dropdown
- Print invoice button

CUSTOMERS MANAGEMENT:

List View:
- Email
- Name
- Phone
- Total Orders
- Total Spent
- Loyalty Points
- Actions: View, Edit

Customer Detail:
- Profile info
- Order history
- Addresses saved
- Loyalty points balance
- Discount percentage
- Preferences
- Edit button

ANALYTICS:

Charts:
- Revenue trend (line)
- Sales by category (pie)
- Top products (bar)
- Customer acquisition (line)
- Conversion rate

Metrics:
- Total revenue
- AOV (Average Order Value)
- Conversion rate
- Customer LTV
- Repeat purchase %

SETTINGS:

Configuration:
- Store name
- Logo upload
- Contact email
- Support phone
- Address
- Shipping methods
- Tax rates
- Currencies

AUTHENTICATION:
- Admin login required
- Protected routes
- Session-based
- Logout option

API INTEGRATION:
- GET /admin/products
- POST /admin/products
- PUT /admin/products/:id
- DELETE /admin/products/:id
- GET /admin/orders
- PUT /admin/orders/:id (status update)
- GET /admin/customers
- GET /admin/analytics

Pokaż admin panel z wszystkimi 6 sekcjami
```

---

## ⚙️ PROMPT 12: ENVIRONMENT & DEPLOYMENT

```
Kiro, skonfiguruj environment variables i deployment:

.env.local (LOCAL DEVELOPMENT):

# MEDUSA API
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_BACKEND_URL=http://localhost:9000

# DATABASE
DATABASE_URL=postgresql://user:password@localhost:5432/omex
DATABASE_TYPE=postgres

# AUTHENTICATION
NEXTAUTH_SECRET=your-secret-key-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# STRIPE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SENDGRID
SENDGRID_API_KEY=SG.xxxxx

# MEDUSA ADMIN
MEDUSA_ADMIN_BACKEND_URL=http://localhost:9000

# MULTI-LANGUAGE
NEXT_PUBLIC_LANGUAGES=pl,en,de,uk
NEXT_PUBLIC_DEFAULT_LANGUAGE=pl

# CURRENCY
NEXT_PUBLIC_CURRENCIES=PLN,EUR
NEXT_PUBLIC_DEFAULT_CURRENCY=PLN
NEXT_PUBLIC_EXCHANGE_RATE_EUR_PLN=4.3

.env.production:

# MEDUSA API
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.omex.pl
MEDUSA_BACKEND_URL=https://api.omex.pl

# DATABASE (Production DB credentials)
DATABASE_URL=postgresql://prod_user:secure_password@db.provider.com:5432/omex_prod

# AUTHENTICATION
NEXTAUTH_SECRET=production-secret-key-min-32-chars
NEXTAUTH_URL=https://omex.pl

# STRIPE (Production keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_API_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_live_...

DOCKER SETUP (docker-compose.yml):

version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: omex
      POSTGRES_USER: omex_user
      POSTGRES_PASSWORD: secure_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  medusa:
    build: ./apps/backend
    environment:
      DATABASE_URL: postgresql://omex_user:secure_password@postgres:5432/omex
      NODE_ENV: development
      STRIPE_API_KEY: ${STRIPE_API_KEY}
      SENDGRID_API_KEY: ${SENDGRID_API_KEY}
    ports:
      - "9000:9000"
    depends_on:
      - postgres

  storefront:
    build: ./apps/storefront
    environment:
      NEXT_PUBLIC_MEDUSA_BACKEND_URL: http://medusa:9000
    ports:
      - "3000:3000"
    depends_on:
      - medusa

  admin:
    build: ./apps/admin
    environment:
      NEXT_PUBLIC_MEDUSA_BACKEND_URL: http://medusa:9000
    ports:
      - "7001:3000"
    depends_on:
      - medusa

volumes:
  postgres_data:

DEVELOPMENT (docker-compose up):
- PostgreSQL running on 5432
- Medusa backend on 9000
- Next.js storefront on 3000
- Next.js admin on 7001
- All services connected

BUILD COMMANDS:
npm run build
npm run start
npm run dev

PRODUCTION DEPLOYMENT:

Option 1 - Vercel (Frontend):
1. Connect GitHub repo
2. Set environment variables
3. Deploy
4. Point domain to Vercel

Option 2 - Self-hosted (VPS):
1. Build frontend & backend
2. Upload to VPS
3. Setup Nginx reverse proxy
4. Configure SSL (Let's Encrypt)
5. Setup PM2 for process management
6. Configure database backups

Option 3 - Railway/Render:
1. Connect GitHub
2. Set environment variables
3. Auto-deploy on push

DATABASE BACKUP:
- Daily automated backups
- Store on cloud (AWS S3, Google Drive)
- Point-in-time recovery

MONITORING:
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- Database monitoring
- API monitoring

Pokaż gotową do deploymentu konfigurację
```

---

## 🎨 PROMPT 13: DESIGN SYSTEM & COMPONENTS (Shadcn)

```
Kiro, skonfiguruj design system z Shadcn/UI dla OMEX:

SHADCN/UI INSTALACJA:

npx shadcn-ui@latest init

Components to install:
- Button
- Card
- Input
- Select
- Checkbox
- Badge
- Tabs
- Dropdown Menu
- Dialog
- Toast
- Skeleton
- Pagination
- Table
- Sheet (Sidebar)
- Form
- Popover
- Avatar
- Progress

TAILWIND KONFIGURACJA:

tailwind.config.js:

export const colors = {
  primary: {
    50: '#f0f7fa',
    100: '#e0f0f5',
    200: '#c1e1eb',
    300: '#a2d2e1',
    400: '#83c3d7',
    500: '#2185a3', // OMEX Main
    600: '#1b6a82',
    700: '#155461',
    800: '#0f3c40',
    900: '#092829',
  },
  secondary: {
    50: '#fef5e7',
    100: '#fdebd0',
    200: '#f9e79f',
    300: '#f5b041',
    400: '#f39c12', // OMEX Orange
    500: '#d68910',
    600: '#ba4a00',
    700: '#922b21',
  },
  neutral: {
    50: '#f8f9fa',
    // ... full palette
    950: '#111827',
  },
};

COMPONENT LIBRARY:

components/ui/
├── Button.tsx
├── Card.tsx
├── Input.tsx
├── Select.tsx
├── Badge.tsx
├── ProductCard.tsx (custom)
├── HeroSection.tsx (custom)
├── FilterSidebar.tsx (custom)
├── Cart.tsx (custom)
└── SearchBar.tsx (custom)

SHADCN BUTTON VARIANTS:
- Primary (solid teal)
- Secondary (solid orange)
- Outline (border)
- Ghost (transparent)
- Destructive (red for delete)

CUSTOM COMPONENTS:

ProductCard:
- Image carousel
- Price display (brutto/netto)
- Stock badge
- Rating
- Add to cart button
- Quick view option

HeroSection:
- Gradient background
- Headline
- CTA buttons
- Feature highlights

FilterSidebar:
- Category filter (checkboxes)
- Brand filter (checkboxes)
- Price range (slider)
- Stock status (checkboxes)
- Reset button

Cart Dropdown:
- Item list
- Remove button
- Update quantity
- Checkout button
- Total price

SearchBar:
- Input field
- Icon
- Autocomplete results
- Click to navigate

TYPOGRAPHY:

export const typography = {
  h1: 'text-4xl md:text-5xl font-bold text-neutral-900',
  h2: 'text-3xl md:text-4xl font-semibold text-neutral-900',
  h3: 'text-2xl font-semibold text-neutral-900',
  body: 'text-base text-neutral-700',
  small: 'text-sm text-neutral-600',
  caption: 'text-xs text-neutral-500',
};

SPACING SYSTEM:

const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
};

SHADOWS:

const shadows = {
  sm: '0 1px 3px rgba(0,0,0,0.1)',
  md: '0 4px 6px rgba(0,0,0,0.1)',
  lg: '0 10px 15px rgba(0,0,0,0.1)',
  xl: '0 20px 25px rgba(0,0,0,0.1)',
};

ANIMATIONS:

const animations = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  scaleIn: 'animate-scale-in',
};

Pokaż gotowy design system z działającymi komponentami
```

---

## 🚀 PROMPT 14: INICJACJA & SEED DATA

```
Kiro, przygotuj seed data i inicjalizację bazy danych:

SEED SCRIPT (npm run seed):

KROKI:

1. CLEAR DATABASE:
   - Usuń istniejące produkty
   - Usuń kategorie
   - Usuń marki

2. CREATE COLLECTIONS (Kategorie):
   - Koła (Drive Wheels)
   - Wałki (Shafts)
   - Hydraulika (Hydraulic)
   - Uszczelnienia (Seals)
   - Łożyska (Bearings)
   - Silniki (Engines)
   - Pompy (Pumps)
   - Filtry & Oleje (Filters)
   - Elektryka (Electrical)
   - Akcesoria (Accessories)

3. CREATE PRODUCT TYPES (Marki):
   - CAT (Caterpillar)
   - Komatsu
   - JCB
   - Volvo
   - Case
   - Hitachi
   - New Holland
   - Kubota

4. CREATE REGIONS:
   Region 1 - Poland:
   - Currency: PLN
   - Tax: 23%
   - Shipping: Standard (15 zł), Express (25 zł)

   Region 2 - Europe:
   - Currency: EUR
   - Tax: 19%
   - Shipping: Standard (8 EUR), Express (12 EUR)

5. IMPORT PRODUCTS (100+):
   CSV format:
   sku,title,collection,type,price_netto,price_brutto,stock

   Example rows:
   KOL-CAT-001,Koło gąsienicowe CAT PC200,Koła,CAT,2500,3075,12
   WAL-KOM-001,Wałek jazdy Komatsu PC200,Wałki,Komatsu,1400,1722,7
   SIL-JCB-001,Siłownik wysięgnika JCB,Hydraulika,JCB,2800,3444,4

6. CREATE SAMPLE CUSTOMERS:
   - 10 test customers
   - Email: test1@omex.pl, test2@omex.pl, etc
   - With sample orders

7. CREATE SAMPLE ORDERS:
   - 5 sample orders per customer
   - Different statuses (pending, processing, shipped)
   - Various products

8. VERIFY IMPORT:
   - Count products
   - Count customers
   - Check prices calculated correctly
   - Verify collections assigned
   - Check stock quantities

SEED DATA FILES:

seeds/products.csv:
sku,title,oem_number,collection,type,price_netto,price_brutto,stock,description
KOL-CAT-001,Koło gąsienicowe CAT PC200,1234567,Koła,CAT,2500,3075,12,"Oryginalne koło..."
...

seeds/customers.json:
[
  {
    email: "test@omex.pl",
    first_name: "Jan",
    last_name: "Kowalski",
    phone: "+48123456789"
  },
  ...
]

COMMAND:
npm run seed

OUTPUT:
✓ Collections created (10)
✓ Product types created (8)
✓ Regions created (2)
✓ Products imported (100)
✓ Customers created (10)
✓ Sample orders created (50)
✓ Database ready for development

Pokaż działający seed script z danymi do testowania
```

---

## 🏁 PROMPT 15: FINAL INTEGRATION & LAUNCH

```
Kiro, przygotuj ostateczną integrację i launch readiness:

INTEGRATION CHECKLIST:

FRONTEND-BACKEND INTEGRATION:
□ Medusa API client configured
□ All endpoints tested
□ Authentication working
□ JWT token handling
□ Error handling implemented
□ Loading states
□ Toast notifications

PAYMENT INTEGRATION:
□ Stripe account configured
□ API keys in .env
□ Payment flow tested
□ Webhook handling
□ Test cards validated
□ Production keys ready

EMAIL INTEGRATION:
□ SendGrid account configured
□ API key in .env
□ Email templates created
□ Test emails sent
□ Production email ready

MULTI-LANGUAGE:
□ All 4 languages translated
□ Language switcher working
□ All pages in all languages
□ SEO hreflang tags

MULTI-CURRENCY:
□ PLN ↔ EUR conversion working
□ All prices display correctly
□ Exchange rate updating
□ Currency switcher working
□ Tax calculation per region

RESPONSIVE DESIGN:
□ Mobile (375px) - tested
□ Tablet (768px) - tested
□ Desktop (1440px) - tested
□ All components responsive
□ Lighthouse score 90+

PERFORMANCE:
□ Images optimized
□ Code splitting
□ Lazy loading
□ Caching strategy
□ CDN configured (optional)
□ Page load < 2.5s

SEO:
□ Meta tags
□ Sitemap generated
□ robots.txt configured
□ Schema markup
□ Google Search Console
□ Structured data

SECURITY:
□ HTTPS configured
□ CSP headers
□ CORS configured
□ API keys secured
□ Database backups
□ Regular updates

TESTING:
□ Unit tests
□ Integration tests
□ E2E tests
□ Manual testing complete

DEPLOYMENT READY:
□ Production build tested
□ Environment variables set
□ Database migrations ready
□ CDN configured
□ Monitoring active
□ Backup system ready
□ Support documentation

LAUNCH TASKS:

24 HOURS BEFORE:
1. Final database backup
2. Verify all integrations
3. Test payment flow end-to-end
4. Test email notifications
5. Check all language/currency combos
6. Performance testing
7. Security audit
8. Backup rollback procedure

LAUNCH DAY:
1. Enable monitoring
2. Deploy to production
3. Run smoke tests
4. Monitor error logs
5. Verify DNS propagation
6. Test customer registration
7. Test first order flow
8. Verify emails sending
9. Check analytics tracking

POST-LAUNCH (24H):
1. Monitor all metrics
2. Check user feedback
3. Verify conversions
4. Monitor performance
5. Check for errors
6. Verify email delivery
7. Be ready to rollback

PRODUCTION DEPLOYMENT:

COMMAND:
npm run build
npm run deploy:production

VERIFIES:
✓ No build errors
✓ All environment variables set
✓ Database migrations run
✓ Seed data imported
✓ SSL certificate valid
✓ DNS points to server
✓ Monitoring active
✓ Backups configured

READY FOR GO LIVE ✅

POST-LAUNCH MONITORING:
- Error tracking (Sentry)
- Performance (Web Vitals)
- Uptime monitoring
- Daily backups
- Security updates
- Regular reviews

Pokaż gotowy system do uruchomienia
```

---

## 📋 SUMMARY - WSZYSTKIE 15 PROMPTÓW

| # | Prompt | Czas |
|---|--------|------|
| 1 | Nowy projekt (Medusa + Next.js) | 5 min |
| 2 | Medusa Backend Setup | 30 min |
| 3 | Next.js Storefront Setup | 30 min |
| 4 | Stripe Integration | 20 min |
| 5 | SendGrid Integration | 15 min |
| 6 | Multi-language (next-intl) | 20 min |
| 7 | Multi-currency (PLN/EUR) | 15 min |
| 8 | Customer & Auth | 25 min |
| 9 | Product Catalog & Search | 30 min |
| 10 | Shopping Cart & Checkout | 30 min |
| 11 | Admin Panel | 45 min |
| 12 | Environment & Deployment | 20 min |
| 13 | Design System | 20 min |
| 14 | Seed Data | 15 min |
| 15 | Final Integration | 30 min |

**TOTAL: ~5-6 godzin wdrażania**

---

## 🚀 EXECUTION ORDER

```
DAY 1 (Morning - 3 hours):
1. PROMPT 1: New project
2. PROMPT 2: Medusa backend
3. PROMPT 3: Next.js storefront
4. Test: npm run dev → works on localhost

DAY 1 (Afternoon - 3 hours):
5. PROMPT 6: Multi-language
6. PROMPT 7: Multi-currency
7. PROMPT 13: Design system
8. PROMPT 14: Seed data
9. Test: All products visible

DAY 2 (Morning - 2 hours):
10. PROMPT 4: Stripe integration
11. PROMPT 5: SendGrid integration
12. Test: Payment flow works

DAY 2 (Afternoon - 2.5 hours):
13. PROMPT 8: Auth system
14. PROMPT 9: Catalog & search
15. PROMPT 10: Cart & checkout
16. Test: Full user flow

DAY 3 (All day):
17. PROMPT 11: Admin panel
18. PROMPT 12: Environment
19. PROMPT 15: Final integration
20. FULL TESTING
21. PRODUCTION DEPLOYMENT
```

---

**Przygotowane:** 28.11.2025  
**Framework:** MedusaJS + Next.js  
**Status:** Ready to Execute  
**Estimated Time:** 5-6 hours  
**Output:** Fully functional OMEX e-commerce  

---

## 🎯 GOTOWY NA WDRAŻANIE?

Każdy prompt zawiera:
✅ Dokładne instrukcje krok-po-kroku
✅ Konfiguracje plików
✅ Kod do copy-paste
✅ Weryfikację
✅ Troubleshooting tips

Wstaw każdy prompt w Kiro i wykonuj po kolei!

**Let's go! 🚀**