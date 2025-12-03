# OMEX Medusa.js Backend Setup Guide

Complete step-by-step guide to set up your Medusa v2.12.0 backend with PostgreSQL.

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] Node.js v20 or higher installed (`node --version`)
- [ ] PostgreSQL 12+ installed and running (`psql --version`)
- [ ] npm or yarn package manager
- [ ] Git (for version control)
- [ ] A code editor (VS Code recommended)
- [ ] Terminal/Command line access

### Verify PostgreSQL is Running

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# If not running, start it
sudo systemctl start postgresql

# Enable auto-start on boot
sudo systemctl enable postgresql
```

---

## 🗄️ Step 1: Database Setup

### 1.1 Create PostgreSQL Database

```bash
# Switch to postgres user
sudo -u postgres psql

# Inside PostgreSQL prompt, run:
CREATE DATABASE medusa_omex;
CREATE USER medusa_user WITH PASSWORD 'medusa_password';
GRANT ALL PRIVILEGES ON DATABASE medusa_omex TO medusa_user;
\q
```

**Expected Output:**
```
CREATE DATABASE
CREATE ROLE
GRANT
```

### 1.2 Verify Database Connection

```bash
# Test connection
psql -h localhost -U medusa_user -d medusa_omex -c "SELECT version();"
```

**Expected Output:** PostgreSQL version information

---

## ⚙️ Step 2: Environment Configuration

### 2.1 Create .env File

```bash
# Copy from template
cp .env.example .env
```

### 2.2 Configure .env File

Edit `.env` with these exact values:

```bash
# Database Configuration
DATABASE_URL=postgresql://medusa_user:medusa_password@localhost:5432/medusa_omex

# Security Secrets (CHANGE THESE IN PRODUCTION!)
JWT_SECRET=your_super_secret_jwt_key_change_in_production
COOKIE_SECRET=your_super_secret_cookie_key_change_in_production

# CORS Configuration
STORE_CORS=http://localhost:3000,http://localhost:8000
ADMIN_CORS=http://localhost:9000,http://localhost:5173,http://localhost:7001
AUTH_CORS=http://localhost:9000,http://localhost:5173,http://localhost:7001

# Stripe Configuration (Optional - for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_API_VERSION=2023-10-16

# Redis (Optional - for caching)
REDIS_URL=redis://localhost:6379

# Node Environment
NODE_ENV=development
```

### 2.3 Generate Secure Secrets

```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate COOKIE_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy these values into your `.env` file.

---

## 📦 Step 3: Install Dependencies

```bash
# Install all dependencies
npm install

# Or with yarn
yarn install
```

**Expected Output:**
```
added XXX packages in XXs
```

**Troubleshooting:**
- If you get permission errors, don't use `sudo`
- Clear cache if needed: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then reinstall

---

## 🔄 Step 4: Database Migrations

### 4.1 Run Migrations

```bash
# Run all database migrations
npx medusa db:migrate

# Alternative command
npm run build && npx medusa migrations run
```

**Expected Output:**
```
✔ Migrations completed successfully
✔ Applied 18 migrations:
  - 1733097600000-add-b2b-product-fields
  - 1733097700000-add-hierarchical-categories
  - 1733097800000-add-b2b-customer-fields
  - 1733097900000-add-b2b-order-fields
  - 1733098000000-create-price-tier-table
  - 1733098100000-create-inventory-table
  - 1733098200000-create-translation-tables
  - 1733150000000-add-seo-fields-to-product
  - 1733150100000-create-manufacturer-table
  - 1733150200000-create-manufacturer-part-table
  - 1733150300000-add-manufacturer-fields-to-product
  - 1733150400000-add-search-fields-to-product
  - 1733150500000-add-b2b-product-fields
  - 1733150600000-create-b2b-tables
  - 1733150700000-create-technical-document-table
  - 1733150800000-add-product-import-indexes
  - 1733150900000-create-import-history-table
  - 1733160000000-create-shipment-tables
```

### 4.2 Verify Migrations

```bash
# Check database tables
psql -h localhost -U medusa_user -d medusa_omex -c "\dt"
```

**Expected Output:** List of tables including `product`, `product_category`, `user`, `store`, etc.

**Troubleshooting:**
- **Error: "relation already exists"**: Drop and recreate database
- **Error: "permission denied"**: Check database user privileges
- **Error: "connection refused"**: Ensure PostgreSQL is running

```bash
# If you need to reset the database
sudo -u postgres psql -c "DROP DATABASE medusa_omex;"
sudo -u postgres psql -c "CREATE DATABASE medusa_omex;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE medusa_omex TO medusa_user;"
npx medusa db:migrate
```

---

## 👤 Step 5: Create Admin User

### 5.1 Create User via Medusa CLI

```bash
# Create admin user interactively
npx medusa user -e admin@omex.com -p admin123

# Or non-interactively
npx medusa user create --email admin@omex.com --password admin123
```

**Expected Output:**
```
✔ Admin user created successfully
Email: admin@omex.com
```

### 5.2 Verify User Creation

```bash
# Check users in database
psql -h localhost -U medusa_user -d medusa_omex -c "SELECT id, email, role FROM user;"
```

**Expected Output:**
```
              id              |      email       | role
------------------------------+------------------+-------
 user_01XXXXXXXXXXXXXXXXXXXXX | admin@omex.com   | admin
```

---

## 🚀 Step 6: Start Backend Server

### 6.1 Build the Project

```bash
# Build TypeScript files
npm run build
```

**Expected Output:**
```
✔ Build completed successfully
```

### 6.2 Start Development Server

```bash
# Start in development mode with hot reload
npm run dev
```

**Expected Output:**
```
info:    Starting Medusa...
info:    Medusa is running on: http://localhost:9000
info:    Admin dashboard: http://localhost:9000/app
info:    Health check: http://localhost:9000/health
```

**Server should start in 10-30 seconds**

### 6.3 Start Production Server (Alternative)

```bash
# Start in production mode
npm run start
```

---

## ✅ Step 7: Health Check Verification

### 7.1 Test Backend Health

```bash
# Basic health check
curl http://localhost:9000/health

# With verbose output
curl -v http://localhost:9000/health
```

**Expected Output:**
```json
{
  "status": "ok",
  "timestamp": "2024-12-03T10:30:00.000Z"
}
```

### 7.2 Test Store API

```bash
# Get store information
curl http://localhost:9000/store/products

# With pretty print
curl http://localhost:9000/store/products | json_pp
```

**Expected Output:**
```json
{
  "products": [],
  "count": 0,
  "offset": 0,
  "limit": 50
}
```

### 7.3 Test Admin API (Requires Authentication)

```bash
# Login to get auth token
curl -X POST http://localhost:9000/admin/auth/user/emailpass \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@omex.com",
    "password": "admin123"
  }'
```

**Expected Output:**
```json
{
  "user": {
    "id": "user_01XXXXXXXXXXXXXXXXXXXXX",
    "email": "admin@omex.com",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Save the token for authenticated requests:

```bash
# Set token as variable
TOKEN="your_token_here"

# Test authenticated endpoint
curl http://localhost:9000/admin/products \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🌐 Step 8: CORS Configuration

### 8.1 Verify CORS Settings

Your `medusa-config.ts` should have:

```typescript
http: {
  storeCors: process.env.STORE_CORS!,
  adminCors: process.env.ADMIN_CORS!,
  authCors: process.env.AUTH_CORS!,
  jwtSecret: process.env.JWT_SECRET || "supersecret",
  cookieSecret: process.env.COOKIE_SECRET || "supersecret",
}
```

### 8.2 Test CORS from Frontend

```bash
# Test CORS with OPTIONS request
curl -X OPTIONS http://localhost:9000/store/products \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

**Expected Headers:**
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Credentials: true
```

### 8.3 Common CORS Issues

**Problem:** Frontend can't connect to backend

**Solution:** Add frontend URL to `.env`:
```bash
STORE_CORS=http://localhost:3000,http://localhost:8000
ADMIN_CORS=http://localhost:9000,http://localhost:5173
```

Then restart the server.

---

## 💳 Step 9: Stripe Integration Setup

### 9.1 Get Stripe API Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Secret key** (starts with `sk_test_`)
3. Copy your **Publishable key** (starts with `pk_test_`)

### 9.2 Configure Stripe in .env

```bash
STRIPE_SECRET_KEY=sk_test_51XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
STRIPE_PUBLISHABLE_KEY=pk_test_51XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
STRIPE_API_VERSION=2023-10-16
```

### 9.3 Enable Stripe Plugin

Edit `medusa-config.ts` and uncomment the Stripe plugin:

```typescript
plugins: [
  {
    resolve: "./src/plugins/stripe",
    options: {
      apiKey: process.env.STRIPE_SECRET_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      apiVersion: process.env.STRIPE_API_VERSION || '2023-10-16',
    },
  },
],
```

### 9.4 Test Stripe Connection

```bash
# Run the Stripe test script
node test-stripe-simple.js
```

**Expected Output:**
```
✓ Stripe connection successful
✓ API version: 2023-10-16
```

### 9.5 Setup Stripe Webhooks (Optional)

```bash
# Install Stripe CLI
# Follow: https://stripe.com/docs/stripe-cli

# Forward webhooks to local server
stripe listen --forward-to localhost:9000/hooks/stripe

# Copy the webhook secret (starts with whsec_)
# Add to .env:
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## 🎛️ Step 10: Admin Dashboard Verification

### 10.1 Access Admin UI

Open your browser and navigate to:

```
http://localhost:9000/app
```

### 10.2 Login to Admin

- **Email:** `admin@omex.com`
- **Password:** `admin123`

**Expected:** You should see the Medusa admin dashboard

### 10.3 Verify Admin Features

Check these sections work:
- [ ] Products page loads
- [ ] Orders page loads
- [ ] Customers page loads
- [ ] Settings page loads

### 10.4 Admin UI Not Loading?

```bash
# Check if admin build exists
ls -la .medusa/admin/

# Rebuild admin
npx medusa build --admin

# Restart server
npm run dev
```

---

## 📊 Step 11: Seed Initial Data

### 11.1 Seed Categories

```bash
# Seed product categories
npm run seed:categories
```

**Expected Output:**
```
✔ Seeded 50+ categories successfully
```

### 11.2 Seed Manufacturers

```bash
# Seed manufacturers
npm run seed:manufacturers
```

**Expected Output:**
```
✔ Seeded manufacturers successfully
```

### 11.3 Import Products from CSV

```bash
# Import the 120 products
npm run import:products
```

**Expected Output:**
```
✔ Imported 120 products successfully
✔ Created product variants
✔ Set up inventory
```

### 11.4 Verify Data Import

```bash
# Check products via API
curl http://localhost:9000/store/products | json_pp

# Or check in database
psql -h localhost -U medusa_user -d medusa_omex -c "SELECT COUNT(*) FROM product;"
```

**Expected:** 120 products

---

## 🧪 Step 12: API Endpoint Testing

### 12.1 Store Endpoints (Public)

```bash
# List all products
curl http://localhost:9000/store/products

# Get single product
curl http://localhost:9000/store/products/{product_id}

# List categories
curl http://localhost:9000/store/product-categories

# Get regions
curl http://localhost:9000/store/regions

# Create cart
curl -X POST http://localhost:9000/store/carts \
  -H "Content-Type: application/json"
```

### 12.2 Admin Endpoints (Authenticated)

First, get auth token:

```bash
# Login
TOKEN=$(curl -X POST http://localhost:9000/admin/auth/user/emailpass \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@omex.com","password":"admin123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo $TOKEN
```

Then test admin endpoints:

```bash
# List products (admin view)
curl http://localhost:9000/admin/products \
  -H "Authorization: Bearer $TOKEN"

# Create product
curl -X POST http://localhost:9000/admin/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Product",
    "description": "Test Description",
    "status": "published"
  }'

# List orders
curl http://localhost:9000/admin/orders \
  -H "Authorization: Bearer $TOKEN"

# List customers
curl http://localhost:9000/admin/customers \
  -H "Authorization: Bearer $TOKEN"
```

### 12.3 Test with Postman/Insomnia

Import this collection:

**Base URL:** `http://localhost:9000`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {your_token}
```

**Endpoints to test:**
- GET `/store/products`
- GET `/store/product-categories`
- POST `/store/carts`
- POST `/admin/auth/user/emailpass`
- GET `/admin/products`
- GET `/admin/orders`

---

## 🔍 Troubleshooting Common Issues

### Issue 1: Database Connection Failed

**Error:** `connection refused` or `authentication failed`

**Solutions:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Verify credentials
psql -h localhost -U medusa_user -d medusa_omex

# Check DATABASE_URL format
echo $DATABASE_URL
# Should be: postgresql://username:password@host:port/database
```

### Issue 2: Port 9000 Already in Use

**Error:** `EADDRINUSE: address already in use :::9000`

**Solutions:**
```bash
# Find process using port 9000
lsof -i :9000

# Kill the process
kill -9 <PID>

# Or use different port in .env
PORT=9001
```

### Issue 3: Migrations Failed

**Error:** `relation already exists` or `migration failed`

**Solutions:**
```bash
# Reset database
sudo -u postgres psql -c "DROP DATABASE medusa_omex;"
sudo -u postgres psql -c "CREATE DATABASE medusa_omex;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE medusa_omex TO medusa_user;"

# Run migrations again
npx medusa db:migrate
```

### Issue 4: Admin User Can't Login

**Error:** `Invalid credentials`

**Solutions:**
```bash
# Verify user exists
psql -h localhost -U medusa_user -d medusa_omex -c "SELECT email FROM user;"

# Create new admin user
npx medusa user -e admin@omex.com -p admin123

# Reset password (if user exists)
psql -h localhost -U medusa_user -d medusa_omex -c "UPDATE user SET password_hash = crypt('admin123', gen_salt('bf')) WHERE email = 'admin@omex.com';"
```

### Issue 5: CORS Errors

**Error:** `Access to fetch blocked by CORS policy`

**Solutions:**
```bash
# Add frontend URL to .env
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:9000,http://localhost:5173

# Restart server
npm run dev
```

### Issue 6: Module Not Found

**Error:** `Cannot find module '@medusajs/framework'`

**Solutions:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Rebuild
npm run build
```

### Issue 7: Stripe Connection Failed

**Error:** `Invalid API Key`

**Solutions:**
```bash
# Verify Stripe key format
echo $STRIPE_SECRET_KEY
# Should start with: sk_test_ or sk_live_

# Test Stripe connection
node test-stripe-simple.js

# Check Stripe dashboard for key
# https://dashboard.stripe.com/test/apikeys
```

### Issue 8: Admin UI Not Loading

**Error:** Blank page or 404 at `/app`

**Solutions:**
```bash
# Rebuild admin
npx medusa build --admin

# Check admin files exist
ls -la .medusa/admin/

# Clear browser cache
# Try incognito mode

# Restart server
npm run dev
```

---

## ✅ Final Verification Checklist

Run through this checklist to ensure everything works:

### Backend Health
- [ ] PostgreSQL is running
- [ ] Database `medusa_omex` exists
- [ ] Migrations completed (18 migrations)
- [ ] Server starts without errors
- [ ] Health endpoint returns `{"status":"ok"}`

### Authentication
- [ ] Admin user created
- [ ] Can login via API
- [ ] Receives valid JWT token
- [ ] Token works for authenticated endpoints

### API Endpoints
- [ ] `/health` returns 200
- [ ] `/store/products` returns products list
- [ ] `/store/product-categories` returns categories
- [ ] `/admin/auth/user/emailpass` accepts login
- [ ] `/admin/products` returns data with token

### Admin Dashboard
- [ ] Admin UI loads at `http://localhost:9000/app`
- [ ] Can login with credentials
- [ ] Products page works
- [ ] Orders page works
- [ ] Settings page works

### Data
- [ ] Categories seeded
- [ ] Manufacturers seeded
- [ ] 120 products imported from CSV
- [ ] Products visible in admin
- [ ] Products visible via API

### Integrations
- [ ] CORS configured for frontend
- [ ] Stripe keys configured (if using payments)
- [ ] Stripe connection tested
- [ ] Webhooks configured (optional)

---

## 🚀 Next Steps

Once backend is verified:

1. **Connect Frontend:**
   ```bash
   cd storefront
   # Update .env.local with:
   NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
   npm run dev
   ```

2. **Test Full Flow:**
   - Browse products on frontend
   - Add to cart
   - Checkout process
   - View order in admin

3. **Production Deployment:**
   - Set up production database
   - Configure environment variables
   - Enable SSL/HTTPS
   - Set up domain
   - Configure production Stripe keys

---

## 📚 Useful Commands Reference

```bash
# Development
npm run dev                    # Start dev server with hot reload
npm run build                  # Build TypeScript
npm run start                  # Start production server

# Database
npx medusa db:migrate          # Run migrations
npx medusa db:seed             # Seed data

# User Management
npx medusa user -e email -p pass    # Create admin user

# Data Import
npm run seed:categories        # Seed categories
npm run seed:manufacturers     # Seed manufacturers
npm run import:products        # Import products from CSV

# Testing
npm run test:integration:http  # Run integration tests
curl http://localhost:9000/health  # Health check

# Debugging
npm run dev -- --verbose       # Verbose logging
DEBUG=* npm run dev            # Full debug output
```

---

## 🆘 Getting Help

If you encounter issues:

1. Check server logs in terminal
2. Check browser console for frontend errors
3. Verify `.env` configuration
4. Check PostgreSQL logs: `sudo tail -f /var/log/postgresql/postgresql-*.log`
5. Review Medusa docs: https://docs.medusajs.com
6. Check GitHub issues: https://github.com/medusajs/medusa/issues

---

## 📝 Configuration Files Summary

**Key files to configure:**
- `.env` - Environment variables
- `medusa-config.ts` - Medusa configuration
- `package.json` - Dependencies and scripts

**Database connection format:**
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

**Default ports:**
- Backend: 9000
- Frontend: 3000
- PostgreSQL: 5432
- Redis: 6379

**Timeout values:**
- Server startup: 10-30 seconds
- Database connection: 5 seconds
- API requests: 30 seconds
- Admin build: 1-2 minutes

---

**Setup Complete! 🎉**

Your Medusa backend should now be fully operational. Proceed to connect your Next.js frontend.
