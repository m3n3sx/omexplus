# 🧪 E-commerce Testing Guide

## Pre-requisites

1. ✅ Medusa backend running on `http://localhost:9000`
2. ✅ Next.js frontend running on `http://localhost:3000`
3. ✅ Database populated with products
4. ✅ Publishable API key configured

## Test Scenarios

### 1. Shopping Cart Tests

#### Test 1.1: Add Item to Cart
1. Navigate to products page: `http://localhost:3000/pl/products`
2. Click "Dodaj do koszyka" on any product
3. **Expected**: Success message, cart count increases
4. **Verify**: Check localStorage for `cart_id`

#### Test 1.2: View Cart
1. Click cart icon in header
2. Navigate to: `http://localhost:3000/pl/cart`
3. **Expected**: See added items with correct prices
4. **Verify**: Subtotal, tax, and total calculations

#### Test 1.3: Update Quantity
1. In cart, click + or - buttons
2. **Expected**: Quantity updates, prices recalculate
3. **Verify**: Total updates correctly

#### Test 1.4: Remove Item
1. Click "Usuń" button on cart item
2. **Expected**: Item removed, totals update
3. **Verify**: Cart updates in real-time

#### Test 1.5: Empty Cart
1. Remove all items
2. **Expected**: "Koszyk pusty" message
3. **Verify**: "Przeglądaj produkty" button appears

#### Test 1.6: Cart Persistence
1. Add items to cart
2. Refresh page
3. **Expected**: Cart items persist
4. **Verify**: Same items and quantities

### 2. Authentication Tests

#### Test 2.1: Register New Account
1. Navigate to: `http://localhost:3000/pl/account/login`
2. Click "Zarejestruj" tab
3. Fill form:
   - First Name: Jan
   - Last Name: Kowalski
   - Email: jan@example.com
   - Password: Test123!
4. Click "Zarejestruj"
5. **Expected**: Auto-login, redirect to account dashboard
6. **Verify**: Welcome message with name

#### Test 2.2: Login
1. Navigate to login page
2. Enter credentials
3. Click "Zaloguj"
4. **Expected**: Redirect to account dashboard
5. **Verify**: User menu shows name

#### Test 2.3: Logout
1. In account dashboard, click "Wyloguj"
2. **Expected**: Redirect to home, user menu shows "Zaloguj"
3. **Verify**: Session cleared

#### Test 2.4: Protected Routes
1. Logout
2. Try to access: `http://localhost:3000/pl/account`
3. **Expected**: Redirect to login page
4. **Verify**: Cannot access without authentication

### 3. Checkout Tests

#### Test 3.1: Start Checkout
1. Add items to cart
2. Click "Przejdź do kasy"
3. Navigate to: `http://localhost:3000/pl/checkout`
4. **Expected**: Step 1 - Shipping Address form
5. **Verify**: Progress indicator shows step 1/5

#### Test 3.2: Shipping Address
1. Fill shipping address form:
   - First Name: Jan
   - Last Name: Kowalski
   - Email: jan@example.com
   - Phone: +48 123 456 789
   - Address: ul. Testowa 1
   - City: Warszawa
   - Postal Code: 00-001
2. Click "Dalej"
3. **Expected**: Move to step 2
4. **Verify**: Address saved

#### Test 3.3: Shipping Method
1. Select shipping method (e.g., InPost)
2. Click "Dalej"
3. **Expected**: Move to step 3
4. **Verify**: Shipping cost added to total

#### Test 3.4: Billing Address
1. Check "Taki sam jak adres dostawy"
2. Click "Dalej"
3. **Expected**: Move to step 4
4. **Verify**: Billing address matches shipping

#### Test 3.5: Payment Method
1. View payment options
2. Click "Dalej"
3. **Expected**: Move to step 5
4. **Verify**: Payment method selected

#### Test 3.6: Order Review
1. Review order details
2. Verify:
   - Items list
   - Shipping address
   - Billing address
   - Shipping method
   - Total amount
3. Click "Złóż zamówienie"
4. **Expected**: Order created, redirect to confirmation
5. **Verify**: Order appears in account

#### Test 3.7: Empty Cart Checkout
1. Clear cart
2. Try to access checkout
3. **Expected**: Redirect to cart with empty message
4. **Verify**: Cannot checkout with empty cart

### 4. Account Dashboard Tests

#### Test 4.1: View Dashboard
1. Login
2. Navigate to: `http://localhost:3000/pl/account`
3. **Expected**: See dashboard with stats
4. **Verify**: 
   - Order count
   - Address count
   - User info

#### Test 4.2: View Orders
1. Click "Moje zamówienia"
2. Navigate to: `http://localhost:3000/pl/account/orders`
3. **Expected**: List of orders
4. **Verify**:
   - Order numbers
   - Dates
   - Totals
   - Status badges

#### Test 4.3: View Order Details
1. Click on an order
2. **Expected**: See order details
3. **Verify**:
   - Items list
   - Shipping info
   - Payment status
   - Tracking info (if available)

### 5. Integration Tests

#### Test 5.1: Guest Checkout
1. Logout
2. Add items to cart
3. Start checkout
4. **Expected**: Can complete checkout as guest
5. **Verify**: Order created without account

#### Test 5.2: Logged-in Checkout
1. Login
2. Add items to cart
3. Start checkout
4. **Expected**: Address pre-filled from account
5. **Verify**: Order linked to customer account

#### Test 5.3: Cart Merge
1. Add items as guest
2. Login
3. **Expected**: Guest cart merges with user cart
4. **Verify**: All items present

### 6. Error Handling Tests

#### Test 6.1: Invalid Email
1. Try to register with invalid email
2. **Expected**: Validation error
3. **Verify**: Form shows error message

#### Test 6.2: Weak Password
1. Try to register with weak password
2. **Expected**: Validation error
3. **Verify**: Password requirements shown

#### Test 6.3: Duplicate Email
1. Try to register with existing email
2. **Expected**: Error message
3. **Verify**: "Email already exists" message

#### Test 6.4: Wrong Password
1. Try to login with wrong password
2. **Expected**: Error message
3. **Verify**: "Invalid credentials" message

#### Test 6.5: Network Error
1. Stop Medusa backend
2. Try to add item to cart
3. **Expected**: Error message
4. **Verify**: User-friendly error displayed

### 7. Performance Tests

#### Test 7.1: Cart Loading Speed
1. Add 10 items to cart
2. Navigate to cart page
3. **Expected**: Loads in < 2 seconds
4. **Verify**: No lag or freezing

#### Test 7.2: Checkout Performance
1. Complete full checkout flow
2. **Expected**: Each step loads quickly
3. **Verify**: Smooth transitions

### 8. Mobile Responsiveness Tests

#### Test 8.1: Mobile Cart
1. Open on mobile device
2. Add items to cart
3. **Expected**: Responsive layout
4. **Verify**: All buttons accessible

#### Test 8.2: Mobile Checkout
1. Complete checkout on mobile
2. **Expected**: Forms easy to fill
3. **Verify**: No horizontal scrolling

## Test Results Template

```
Test Date: ___________
Tester: ___________

| Test ID | Test Name | Status | Notes |
|---------|-----------|--------|-------|
| 1.1 | Add Item to Cart | ☐ Pass ☐ Fail | |
| 1.2 | View Cart | ☐ Pass ☐ Fail | |
| 1.3 | Update Quantity | ☐ Pass ☐ Fail | |
| 1.4 | Remove Item | ☐ Pass ☐ Fail | |
| 1.5 | Empty Cart | ☐ Pass ☐ Fail | |
| 1.6 | Cart Persistence | ☐ Pass ☐ Fail | |
| 2.1 | Register Account | ☐ Pass ☐ Fail | |
| 2.2 | Login | ☐ Pass ☐ Fail | |
| 2.3 | Logout | ☐ Pass ☐ Fail | |
| 2.4 | Protected Routes | ☐ Pass ☐ Fail | |
| 3.1 | Start Checkout | ☐ Pass ☐ Fail | |
| 3.2 | Shipping Address | ☐ Pass ☐ Fail | |
| 3.3 | Shipping Method | ☐ Pass ☐ Fail | |
| 3.4 | Billing Address | ☐ Pass ☐ Fail | |
| 3.5 | Payment Method | ☐ Pass ☐ Fail | |
| 3.6 | Order Review | ☐ Pass ☐ Fail | |
| 3.7 | Empty Cart Checkout | ☐ Pass ☐ Fail | |
| 4.1 | View Dashboard | ☐ Pass ☐ Fail | |
| 4.2 | View Orders | ☐ Pass ☐ Fail | |
| 4.3 | View Order Details | ☐ Pass ☐ Fail | |
```

## Automated Testing

### Unit Tests (Jest)

```bash
npm test
```

### E2E Tests (Playwright)

```bash
npx playwright test
```

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## Accessibility Tests

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast sufficient
- [ ] Focus indicators visible
- [ ] ARIA labels present

## Security Tests

- [ ] XSS protection
- [ ] CSRF tokens
- [ ] SQL injection prevention
- [ ] Secure password storage
- [ ] HTTPS enforced (production)

## Performance Benchmarks

| Metric | Target | Actual |
|--------|--------|--------|
| Page Load | < 3s | ___ |
| Add to Cart | < 1s | ___ |
| Checkout Complete | < 5s | ___ |
| API Response | < 500ms | ___ |

---

**Status**: Ready for testing
**Last Updated**: December 2024
