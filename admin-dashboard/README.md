# OMEX Admin Dashboard

A complete, production-ready admin dashboard for managing your Medusa e-commerce store.

## Features

### 📊 Dashboard
- Real-time statistics (orders, revenue, customers)
- Sales charts and analytics
- Recent orders overview
- Top-selling products
- Performance metrics

### 📦 Orders Management
- List all orders with pagination
- Advanced filtering (status, payment, date)
- Order detail view
- Mark orders as shipped/delivered
- Process refunds
- Generate invoices
- Email customers
- Export orders to CSV

### 🛍️ Products Management
- Product catalog with search
- Create/edit/delete products
- Manage variants and options
- Upload product images
- Inventory tracking
- Bulk actions
- Status management (draft/published)

### 👥 Customers Management
- Customer list with search
- Customer profiles
- Order history per customer
- Account status tracking
- Email customers

### 🎨 Treść & Wygląd (NEW!)
- **Kategorie** - Hierarchiczne zarządzanie kategoriami produktów
- **Strony CMS** - Tworzenie i edycja statycznych stron (O nas, Kontakt, FAQ)
- **Topbar** - Zarządzanie górnym paskiem (telefon, email, języki, waluty)
- **Mega Menu** - Konfiguracja głównego menu kategorii z ikonami i priorytetami
- **Bannery** - Zarządzanie bannerami promocyjnymi z pozycjonowaniem
- **SEO** - Zarządzanie meta tagami i optymalizacja SEO

### ⚙️ Settings
- Store configuration
- Payment settings (Stripe, PayPal)
- Shipping zones and rates
- Tax configuration
- Email templates

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **API Client**: @medusajs/medusa-js
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

## Installation

1. **Install dependencies**:
```bash
cd admin-dashboard
npm install
```

2. **Configure environment**:
```bash
cp .env.local .env
```

Edit `.env` and set your Medusa backend URL:
```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_ADMIN_EMAIL=admin@medusa-test.com
MEDUSA_ADMIN_PASSWORD=supersecret
```

3. **Run development server**:
```bash
npm run dev
```

The dashboard will be available at `http://localhost:3001`

## Project Structure

```
admin-dashboard/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Dashboard home
│   ├── login/               # Authentication
│   ├── orders/              # Orders management
│   ├── products/            # Products management
│   ├── customers/           # Customers management
│   ├── cms/                 # CMS Management (NEW!)
│   │   ├── page.tsx         # CMS content list
│   │   ├── new/page.tsx     # Create new content
│   │   ├── [id]/edit/       # Edit content
│   │   └── menus/           # Menu management
│   └── settings/            # Settings pages
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Table.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   └── LoadingSpinner.tsx
│   ├── layout/              # Layout components
│   │   ├── DashboardLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── cms/                 # CMS components (NEW!)
│   │   └── CMSContentEditor.tsx
│   └── dashboard/           # Dashboard-specific components
│       ├── StatsCard.tsx
│       ├── RecentOrders.tsx
│       ├── SalesChart.tsx
│       └── TopProducts.tsx
├── lib/
│   ├── medusa-client.ts     # Medusa API client
│   ├── api-client.ts        # API client wrapper
│   ├── auth.ts              # Authentication utilities
│   ├── types.ts             # TypeScript types
│   └── utils.ts             # Helper functions
└── public/                  # Static assets
```

## Authentication

The dashboard uses Medusa's admin authentication:

1. Navigate to `/login`
2. Enter admin credentials
3. Token is stored in localStorage
4. Protected routes check authentication status

Default credentials (from your Medusa setup):
- Email: `admin@medusa-test.com`
- Password: `supersecret`

## API Integration

### Medusa Client Setup

```typescript
import medusaClient from "@/lib/medusa-client"

// List orders
const orders = await medusaClient.admin.orders.list({
  limit: 20,
  offset: 0,
})

// Get order details
const order = await medusaClient.admin.orders.retrieve(orderId)

// Create product
const product = await medusaClient.admin.products.create({
  title: "Product Name",
  // ... other fields
})
```

### Available Endpoints

#### Orders
- `GET /admin/orders` - List orders
- `GET /admin/orders/:id` - Get order details
- `POST /admin/orders/:id/fulfillment` - Create fulfillment
- `POST /admin/orders/:id/refund` - Process refund

#### Products
- `GET /admin/products` - List products
- `GET /admin/products/:id` - Get product details
- `POST /admin/products` - Create product
- `PUT /admin/products/:id` - Update product
- `DELETE /admin/products/:id` - Delete product

#### Customers
- `GET /admin/customers` - List customers
- `GET /admin/customers/:id` - Get customer details

## Components Usage

### Button
```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

### Input
```tsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
/>
```

### Table
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Modal
```tsx
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirm">
  <p>Are you sure?</p>
  <Button onClick={handleConfirm}>Confirm</Button>
</Modal>
```

## Styling

The dashboard uses Tailwind CSS with a custom theme:

```typescript
// Primary colors
primary-50 to primary-900

// Common patterns
bg-white rounded-lg border border-gray-200 shadow-sm
px-6 py-4
text-gray-900 font-semibold
```

## Responsive Design

All components are mobile-responsive:
- Sidebar collapses on mobile
- Tables scroll horizontally
- Grid layouts stack on small screens
- Touch-friendly buttons and inputs

## Error Handling

```typescript
try {
  const response = await medusaClient.admin.orders.list()
  setOrders(response.orders)
} catch (error) {
  console.error("Error loading orders:", error)
  alert("Failed to load orders")
}
```

## Loading States

```tsx
{loading ? (
  <LoadingSpinner size="lg" />
) : (
  <DataComponent data={data} />
)}
```

## Deployment

### Build for production
```bash
npm run build
npm start
```

### Environment Variables
Set these in your production environment:
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL` - Your Medusa backend URL

## Testing

### Manual Testing Checklist
- [ ] Login/logout functionality
- [ ] Dashboard statistics load correctly
- [ ] Orders list and filtering
- [ ] Order detail view
- [ ] Product CRUD operations
- [ ] Customer list
- [ ] Settings save functionality
- [ ] Responsive design on mobile
- [ ] Error handling

## CMS System

The dashboard now includes a complete CMS system for managing all frontend content!

### Quick Start

```bash
# Initialize CMS database
npm run init-cms

# Access CMS panel
http://localhost:3001/cms
```

### Documentation

- **[CMS_QUICK_START.md](../CMS_QUICK_START.md)** - Get started in 5 minutes
- **[CMS_INSTRUKCJA_PL.md](../CMS_INSTRUKCJA_PL.md)** - Full guide in Polish
- **[CMS_README.md](../CMS_README.md)** - Technical documentation
- **[CMS_INDEX.md](../CMS_INDEX.md)** - Documentation index

### Features

- Edit headers, footers, menus
- Manage hero sections and content blocks
- Visual editors for each content type
- Multi-language support (pl, en, de, uk)
- JSON mode for advanced users
- Ready-to-use React components

## Nowe Funkcjonalności ✨

### Zaimplementowane
- [x] **Zarządzanie Kategoriami** - Pełna hierarchia z edycją i kolejnością
- [x] **Strony CMS** - Tworzenie i edycja statycznych stron
- [x] **Topbar Settings** - Konfiguracja górnego paska nawigacyjnego
- [x] **Mega Menu** - Zaawansowane menu kategorii z ikonami
- [x] **Bannery** - System zarządzania bannerami promocyjnymi
- [x] **Integracja z Backend** - Wszystkie moduły pracują na prawdziwych danych

### Planowane
- [ ] Drag & drop dla kategorii
- [ ] WYSIWYG editor dla stron CMS
- [ ] Upload obrazków w dashboardzie
- [ ] Wersje językowe dla treści
- [ ] Historia zmian
- [ ] Uprawnienia użytkowników
- [ ] Bulk operations
- [ ] Media Library
- [ ] Advanced analytics

## Support

For issues or questions:
1. Check Medusa documentation: https://docs.medusajs.com
2. Review the code comments
3. Check browser console for errors

## License

MIT
