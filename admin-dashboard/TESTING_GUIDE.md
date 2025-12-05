# Testing Guide

Complete testing guide for the OMEX Admin Dashboard.

## Manual Testing Checklist

### Authentication
- [ ] Login with valid credentials
- [ ] Login with invalid credentials shows error
- [ ] Logout clears session
- [ ] Protected routes redirect to login
- [ ] Token persists across page refreshes
- [ ] Expired token redirects to login

### Dashboard Page
- [ ] Statistics cards display correct data
- [ ] Sales chart renders properly
- [ ] Recent orders table shows latest orders
- [ ] Top products list displays correctly
- [ ] All links navigate to correct pages
- [ ] Loading states show while fetching data
- [ ] Error handling for failed API calls

### Orders Management
- [ ] Orders list loads with pagination
- [ ] Search filters orders correctly
- [ ] Status filter works
- [ ] Export to CSV downloads file
- [ ] Order detail page shows all information
- [ ] Mark as shipped creates fulfillment
- [ ] Refund modal processes refunds
- [ ] Email customer button works
- [ ] Invoice generation works
- [ ] Order status badges show correct colors
- [ ] Pagination navigation works

### Products Management
- [ ] Products list loads with pagination
- [ ] Search filters products correctly
- [ ] Status filter works (published/draft)
- [ ] Create new product form validates
- [ ] Product creation succeeds
- [ ] Product edit page loads existing data
- [ ] Product update saves changes
- [ ] Product deletion works with confirmation
- [ ] Image upload functionality
- [ ] Variant management
- [ ] Inventory tracking updates

### Customers Management
- [ ] Customers list loads with pagination
- [ ] Search filters customers correctly
- [ ] Customer detail page shows information
- [ ] Order history displays for customer
- [ ] Email customer functionality
- [ ] Account status badge displays correctly

### Settings
- [ ] All settings tabs load
- [ ] Store settings form displays
- [ ] Payment settings form displays
- [ ] Shipping settings form displays
- [ ] Tax settings form displays
- [ ] Email templates list displays
- [ ] Save changes button works
- [ ] Form validation works

## Responsive Design Testing

### Mobile (320px - 767px)
- [ ] Sidebar collapses/expands
- [ ] Tables scroll horizontally
- [ ] Forms stack vertically
- [ ] Buttons are touch-friendly
- [ ] Navigation is accessible
- [ ] Modals fit screen

### Tablet (768px - 1023px)
- [ ] Layout adjusts appropriately
- [ ] Grid columns stack correctly
- [ ] Charts resize properly
- [ ] Tables remain readable

### Desktop (1024px+)
- [ ] Full layout displays
- [ ] Sidebar always visible
- [ ] Multi-column grids work
- [ ] All features accessible

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Performance Testing

### Page Load Times
- [ ] Dashboard loads in < 2 seconds
- [ ] Orders list loads in < 2 seconds
- [ ] Products list loads in < 2 seconds
- [ ] Order detail loads in < 1 second

### API Response Times
- [ ] Orders API responds in < 500ms
- [ ] Products API responds in < 500ms
- [ ] Customers API responds in < 500ms

### Optimization Checks
- [ ] Images are optimized
- [ ] No unnecessary re-renders
- [ ] Pagination limits data fetching
- [ ] Loading states prevent multiple requests

## Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG AA
- [ ] Form labels properly associated
- [ ] Error messages are clear
- [ ] Alt text on images

## Security Testing

- [ ] Authentication required for all pages
- [ ] API tokens stored securely
- [ ] No sensitive data in URLs
- [ ] XSS protection in place
- [ ] CSRF protection enabled
- [ ] Input validation on all forms
- [ ] SQL injection prevention

## Error Scenarios

### Network Errors
- [ ] API timeout handled gracefully
- [ ] Network offline shows message
- [ ] Failed requests show error
- [ ] Retry mechanism works

### Data Errors
- [ ] Empty states display correctly
- [ ] Invalid data shows validation errors
- [ ] Missing data handled gracefully
- [ ] Malformed responses caught

### User Errors
- [ ] Form validation prevents submission
- [ ] Clear error messages displayed
- [ ] Confirmation dialogs for destructive actions
- [ ] Undo/cancel options available

## Integration Testing

### Order Flow
1. [ ] Create order in storefront
2. [ ] Order appears in admin dashboard
3. [ ] Order details are correct
4. [ ] Mark order as shipped
5. [ ] Process refund
6. [ ] Verify order status updates

### Product Flow
1. [ ] Create product in admin
2. [ ] Product appears in storefront
3. [ ] Update product details
4. [ ] Changes reflect in storefront
5. [ ] Delete product
6. [ ] Product removed from storefront

### Customer Flow
1. [ ] Customer registers in storefront
2. [ ] Customer appears in admin
3. [ ] Customer places order
4. [ ] Order linked to customer
5. [ ] Customer data updates correctly

## Automated Testing Examples

### Unit Tests (Jest)

```typescript
// lib/utils.test.ts
import { formatPrice, formatDate } from "./utils"

describe("formatPrice", () => {
  it("formats USD correctly", () => {
    expect(formatPrice(2999, "USD")).toBe("$29.99")
  })
  
  it("handles zero", () => {
    expect(formatPrice(0, "USD")).toBe("$0.00")
  })
})

describe("formatDate", () => {
  it("formats date correctly", () => {
    const date = new Date("2024-01-15T10:30:00Z")
    expect(formatDate(date)).toContain("Jan")
    expect(formatDate(date)).toContain("15")
  })
})
```

### Component Tests (React Testing Library)

```typescript
// components/ui/Button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react"
import Button from "./Button"

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })
  
  it("calls onClick when clicked", () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByText("Click me"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
  
  it("shows loading state", () => {
    render(<Button isLoading>Click me</Button>)
    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })
  
  it("is disabled when loading", () => {
    render(<Button isLoading>Click me</Button>)
    expect(screen.getByRole("button")).toBeDisabled()
  })
})
```

### API Integration Tests

```typescript
// lib/api.test.ts
import medusaClient from "./medusa-client"

describe("Orders API", () => {
  it("fetches orders list", async () => {
    const response = await medusaClient.admin.orders.list({ limit: 10 })
    expect(response.orders).toBeDefined()
    expect(Array.isArray(response.orders)).toBe(true)
  })
  
  it("fetches order details", async () => {
    const orders = await medusaClient.admin.orders.list({ limit: 1 })
    const orderId = orders.orders[0].id
    
    const response = await medusaClient.admin.orders.retrieve(orderId)
    expect(response.order).toBeDefined()
    expect(response.order.id).toBe(orderId)
  })
})
```

## Load Testing

### Concurrent Users
Test with multiple users:
- [ ] 10 concurrent users
- [ ] 50 concurrent users
- [ ] 100 concurrent users

### Data Volume
Test with large datasets:
- [ ] 1,000 orders
- [ ] 10,000 products
- [ ] 5,000 customers

## Regression Testing

After each update, verify:
- [ ] All existing features still work
- [ ] No new console errors
- [ ] Performance hasn't degraded
- [ ] UI remains consistent
- [ ] API integrations intact

## Test Data Setup

### Create Test Orders
```bash
# Use Medusa admin or API to create test orders
curl -X POST http://localhost:9000/admin/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

### Create Test Products
```bash
# Use the product creation script
node scripts/create-test-products.js
```

### Create Test Customers
```bash
# Use the customer creation script
node scripts/create-test-customers.js
```

## Bug Reporting Template

```markdown
**Bug Description**
Clear description of the issue

**Steps to Reproduce**
1. Go to...
2. Click on...
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Screenshots**
If applicable

**Environment**
- Browser: Chrome 120
- OS: Windows 11
- Dashboard Version: 1.0.0
- Medusa Version: 2.12.0

**Console Errors**
Any error messages from browser console
```

## Testing Tools

### Recommended Tools
- **Jest**: Unit testing
- **React Testing Library**: Component testing
- **Cypress**: E2E testing
- **Lighthouse**: Performance auditing
- **axe DevTools**: Accessibility testing
- **Postman**: API testing

### Setup Jest

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

```javascript
// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
}
```

### Setup Cypress

```bash
npm install --save-dev cypress
npx cypress open
```

```javascript
// cypress/e2e/dashboard.cy.js
describe("Dashboard", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3001")
    cy.login("admin@medusa-test.com", "supersecret")
  })
  
  it("displays statistics", () => {
    cy.contains("Total Orders").should("be.visible")
    cy.contains("Total Revenue").should("be.visible")
  })
  
  it("navigates to orders page", () => {
    cy.contains("Orders").click()
    cy.url().should("include", "/orders")
  })
})
```

## Continuous Testing

### Pre-commit Checks
- Run linter
- Run unit tests
- Check TypeScript types

### CI/CD Pipeline
```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run lint
      - run: npm run type-check
      - run: npm test
```

## Performance Benchmarks

Target metrics:
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

## Sign-off Checklist

Before release:
- [ ] All manual tests passed
- [ ] All automated tests passed
- [ ] Performance benchmarks met
- [ ] Accessibility audit passed
- [ ] Security audit passed
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped
