# Quick Start Guide

Get your OMEX Admin Dashboard up and running in 5 minutes.

## Prerequisites

- Node.js 20+ installed
- Medusa backend running (default: http://localhost:9000)
- Admin user created in Medusa

## Installation

```bash
# Navigate to dashboard directory
cd admin-dashboard

# Install dependencies
npm install

# Copy environment file
cp .env.local .env

# Start development server
npm run dev
```

Dashboard will be available at: **http://localhost:3001**

## First Login

1. Open http://localhost:3001/login
2. Enter your Medusa admin credentials:
   - Email: `admin@medusa-test.com`
   - Password: `supersecret`
3. Click "Sign in"

## Quick Tour

### Dashboard (/)
- View key metrics: orders, revenue, customers
- See recent orders
- Check top products
- Monitor sales trends

### Orders (/orders)
- View all orders
- Filter by status
- Search by customer/order ID
- Click order to see details
- Mark as shipped
- Process refunds

### Products (/products)
- Browse product catalog
- Search products
- Click "Add Product" to create new
- Edit existing products
- Manage inventory

### Customers (/customers)
- View customer list
- Search customers
- See order history
- Manage customer data

### Settings (/settings)
- Configure store details
- Setup payment methods
- Manage shipping options
- Configure tax rates
- Customize email templates

## Common Tasks

### Create a Product

1. Go to Products → Add Product
2. Fill in:
   - Title: "Premium T-Shirt"
   - Description: "High quality cotton t-shirt"
   - Price: 29.99
   - SKU: "TSHIRT-001"
   - Inventory: 100
3. Click "Create Product"

### Process an Order

1. Go to Orders
2. Click on an order
3. Review order details
4. Click "Mark Shipped" to fulfill
5. Or click "Refund" to process refund

### Update Settings

1. Go to Settings
2. Select a tab (Store, Payment, Shipping, etc.)
3. Update fields
4. Click "Save Changes"

## Keyboard Shortcuts

- `Ctrl/Cmd + K` - Quick search (coming soon)
- `Esc` - Close modals
- `Tab` - Navigate forms

## Troubleshooting

### Can't Login?
- Verify Medusa backend is running
- Check credentials
- Clear browser cache
- Check console for errors

### Data Not Loading?
- Check `NEXT_PUBLIC_MEDUSA_BACKEND_URL` in `.env`
- Verify backend is accessible
- Check network tab in browser DevTools

### Build Errors?
```bash
rm -rf node_modules .next
npm install
npm run dev
```

## Next Steps

1. **Customize**: Update branding and colors in `tailwind.config.ts`
2. **Deploy**: Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
3. **Test**: Run through [TESTING_GUIDE.md](./TESTING_GUIDE.md)
4. **Learn**: Read [API_EXAMPLES.md](./API_EXAMPLES.md)

## Support

- Documentation: [README.md](./README.md)
- API Examples: [API_EXAMPLES.md](./API_EXAMPLES.md)
- Medusa Docs: https://docs.medusajs.com

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run type-check

# Lint code
npm run lint
```

## Project Structure

```
admin-dashboard/
├── app/              # Pages (Next.js App Router)
├── components/       # React components
├── lib/             # Utilities and API client
├── public/          # Static files
└── package.json     # Dependencies
```

## Key Files

- `lib/medusa-client.ts` - API client configuration
- `lib/auth.ts` - Authentication logic
- `lib/utils.ts` - Helper functions
- `components/layout/DashboardLayout.tsx` - Main layout
- `app/page.tsx` - Dashboard home page

## Tips

1. **Search Everything**: Use the search bar in header
2. **Keyboard Navigation**: Tab through forms quickly
3. **Bulk Actions**: Select multiple items for batch operations
4. **Export Data**: Use export buttons to download CSV
5. **Filters**: Combine filters for precise results

## What's Included

✅ Complete dashboard with analytics
✅ Orders management with refunds
✅ Products CRUD operations
✅ Customer management
✅ Settings configuration
✅ Responsive design
✅ TypeScript support
✅ Tailwind CSS styling
✅ Loading states
✅ Error handling
✅ Authentication
✅ API integration

## What's Not Included (Future)

- [ ] Advanced analytics
- [ ] Bulk import/export
- [ ] Email campaigns
- [ ] Multi-user roles
- [ ] Activity logs
- [ ] Automated reports

## Getting Help

1. Check documentation files
2. Review code comments
3. Check browser console
4. Verify API responses
5. Test with Postman

## Quick Reference

### API Endpoints
- Orders: `/admin/orders`
- Products: `/admin/products`
- Customers: `/admin/customers`

### Environment Variables
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
```

### Default Port
```
Dashboard: 3001
Medusa Backend: 9000
```

## Ready to Go!

You're all set! Start managing your e-commerce store with the OMEX Admin Dashboard.

Happy selling! 🚀
