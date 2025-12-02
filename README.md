# OMEX B2B E-Commerce Platform 🏭

> Professional B2B e-commerce platform for industrial parts, built with Medusa.js and Next.js 14

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Progress](https://img.shields.io/badge/progress-60%25-blue)
![Node](https://img.shields.io/badge/node-%3E%3D20-green)
![TypeScript](https://img.shields.io/badge/typescript-5.0-blue)

---

## ✨ Features

### 🛒 E-Commerce Core
- ✅ 50,000+ products capacity
- ✅ Hierarchical categories (18 main + 200+ subcategories)
- ✅ Advanced search system (5 methods)
- ✅ Shopping cart with live updates
- ✅ Multi-step checkout (5 steps)
- ✅ Order tracking & history

### 🔍 Advanced Search System (NEW!)
- ✅ **Machine-Based Search** - 5-step wizard (brand → type → model → series → engine)
- ✅ **Part Number Search** - OEM numbers with alternatives
- ✅ **Visual Search** - Image upload with OCR
- ✅ **Text Search** - Natural language queries
- ✅ **Advanced Filters** - Multi-criteria filtering
- ✅ **Autocomplete** - Real-time suggestions

### 🏢 B2B Features
- ✅ Tiered pricing (wholesale discounts)
- ✅ Multi-warehouse inventory management
- ✅ Purchase Order numbers
- ✅ Company profiles (NIP, tax ID)
- ✅ Customer types (retail, B2B, wholesale)
- ✅ Minimum order quantities

### 🌍 Internationalization
- ✅ 4 languages: Polski, English, Deutsch, Українська
- ✅ Locale-based routing (/pl, /en, /de, /uk)
- ✅ Language switcher component
- ✅ Translation fallback mechanism

### 🎨 UI/UX
- ✅ Dark/Light mode with next-themes
- ✅ Responsive design
- ✅ Smooth animations
- ✅ Real-time search suggestions
- ✅ Cart sidebar with slide-in animation
- ✅ Progress indicators
- ✅ Status badges

---

---

## 📚 Documentation

### 🚀 START HERE
- **[START_HERE.md](./START_HERE.md)** ⭐ - Quick start guide
- **[FULL_IMPLEMENTATION_COMPLETE.md](./FULL_IMPLEMENTATION_COMPLETE.md)** - Complete implementation summary

### Core Documentation
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Complete project overview
- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Development guide
- **[QUICK_START.md](./QUICK_START.md)** - Quick start guide

### Search System Documentation
- **[SEARCH_README.md](./SEARCH_README.md)** - Search system overview
- **[SEARCH_API_DOCUMENTATION.md](./SEARCH_API_DOCUMENTATION.md)** - Complete API reference
- **[SEARCH_EXAMPLES.md](./SEARCH_EXAMPLES.md)** - Usage examples
- **[SEARCH_QUICK_REFERENCE.md](./SEARCH_QUICK_REFERENCE.md)** - Quick reference card
- **[storefront/SEARCH_COMPONENTS_README.md](./storefront/SEARCH_COMPONENTS_README.md)** - Frontend components

### Categories & Implementation
- **[CATEGORIES_IMPLEMENTATION.md](./CATEGORIES_IMPLEMENTATION.md)** - Categories structure
- **[SEARCH_IMPLEMENTATION_SUMMARY.md](./SEARCH_IMPLEMENTATION_SUMMARY.md)** - Implementation details
- **[SEARCH_TODO.md](./SEARCH_TODO.md)** - Roadmap & next steps
- **[CHANGELOG_SEARCH.md](./CHANGELOG_SEARCH.md)** - Change history

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 20
- PostgreSQL >= 13
- npm or yarn

### Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd my-medusa-store

# 2. Install backend dependencies
npm install

# 3. Setup environment
cp .env.template .env
# Edit .env with your database credentials

# 4. Run migrations
npx medusa migrations run

# 5. Start backend
npm run dev
# Backend: http://localhost:9000
# Admin Panel: http://localhost:9000/app

# 6. Install frontend dependencies (in new terminal)
cd storefront
npm install

# 7. Start frontend
npm run dev
# Frontend: http://localhost:8000
```

### Default Admin Credentials
- **Email:** admin@medusa-test.com
- **Password:** supersecret

---

## 📁 Project Structure

```
my-medusa-store/
├── src/                      # Backend (Medusa.js)
│   ├── api/                 # API endpoints
│   │   ├── store/          # Public Store API
│   │   └── admin/          # Admin API
│   ├── modules/            # Custom business logic
│   │   ├── omex-product/
│   │   ├── omex-category/
│   │   ├── omex-translation/
│   │   ├── omex-pricing/
│   │   ├── omex-inventory/
│   │   ├── omex-order/
│   │   └── omex-search/
│   └── migrations/         # Database migrations
│
└── storefront/              # Frontend (Next.js 14)
    ├── app/
    │   └── [locale]/       # Locale-based routing
    │       ├── page.tsx    # Homepage
    │       ├── products/   # Product catalog & detail
    │       ├── checkout/   # Checkout flow
    │       └── orders/     # Order management
    ├── components/         # Reusable components
    ├── hooks/             # Custom React hooks
    ├── lib/               # Utilities & API client
    └── messages/          # i18n translations
```

---

## 🛠️ Tech Stack

### Backend
- **Medusa.js** - E-commerce framework
- **PostgreSQL** - Database
- **TypeScript** - Type safety
- **Node.js 20+** - Runtime

### Frontend
- **Next.js 14** - React framework (App Router)
- **React 18** - UI library
- **TypeScript** - Type safety
- **next-intl** - Internationalization
- **next-themes** - Theme management

---

## 📖 Documentation

- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Complete project overview
- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Development guide
- **[SETUP.md](./SETUP.md)** - Detailed setup instructions
- **[I18N_GUIDE.md](./I18N_GUIDE.md)** - Internationalization guide
- **[FEATURES.md](./FEATURES.md)** - Feature documentation
- **[.kiro/specs/](./kiro/specs/)** - Technical specifications

---

## 🎯 Current Status

### ✅ Completed (60%)
- Database schema & migrations
- Backend services (7 modules)
- API endpoints (Store + Admin)
- Frontend storefront (all pages)
- Internationalization (4 languages)
- Dark/Light mode
- Checkout flow
- Order management

### 🚧 In Progress
- Admin dashboard
- Payment integration (Stripe)
- Email integration (SendGrid)
- Shipping providers

### 📋 Planned
- Testing suite
- SEO optimization
- Performance optimization
- Production deployment
- CI/CD pipeline

---

## 🔧 Development

### Start Development Servers
```bash
# Backend
npm run dev

# Frontend (in separate terminal)
cd storefront && npm run dev
```

### Build for Production
```bash
# Backend
npm run build

# Frontend
cd storefront && npm run build
```

### Run Migrations
```bash
# Run all migrations
npx medusa migrations run

# Revert last migration
npx medusa migrations revert
```

---

## 🌍 Internationalization

### Supported Languages
- 🇵🇱 Polski (pl) - Default
- 🇬🇧 English (en)
- 🇩🇪 Deutsch (de)
- 🇺🇦 Українська (uk)

### URL Structure
- Polish: `http://localhost:8000/pl`
- English: `http://localhost:8000/en`
- German: `http://localhost:8000/de`
- Ukrainian: `http://localhost:8000/uk`

---

## 🎨 Features Showcase

### Homepage
- Hero section with gradient background
- 18 featured categories with icons
- Top products grid (8 items)
- Trust badges (shipping, quality, payment, support)
- Newsletter signup form

### Product Catalog
- Advanced filters (price, availability, equipment type)
- Grid layout (12 items per page)
- Pagination controls
- Sort options (price, date, popularity)
- Product cards with hover effects

### Product Detail
- Image gallery with thumbnail selection
- Product information (SKU, part number, brand)
- Technical specifications table
- Quantity selector with min_qty validation
- Add to cart functionality
- Related products section

### Checkout Flow
1. Shipping Address
2. Shipping Method (InPost, DPD, DHL)
3. Billing Address (with B2B fields)
4. Payment Method
5. Review & Confirm

### Order Management
- Order history with status filters
- Order detail with tracking
- Status timeline
- Invoice download (placeholder)

---

## 🤝 Contributing

This is a private project. For questions or suggestions, please contact the development team.

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🙏 Acknowledgments

Built with:
- [Medusa.js](https://medusajs.com) - E-commerce framework
- [Next.js](https://nextjs.org) - React framework
- [next-intl](https://next-intl-docs.vercel.app) - Internationalization
- [next-themes](https://github.com/pacocoursey/next-themes) - Theme management

---

## 📞 Support

For support and questions:
- Check [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
- Review [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
- Contact the development team

---

**OMEX B2B E-Commerce Platform** - Professional industrial parts marketplace  
*Built with ❤️ using Medusa.js and Next.js*
