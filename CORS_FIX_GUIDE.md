# 🔥 CORS Error Complete Fix Guide

## What is CORS?

CORS (Cross-Origin Resource Sharing) is a security feature that prevents your frontend (localhost:3000) from accessing your backend (localhost:9000) unless explicitly allowed.

---

## 🚨 Symptoms of CORS Issues

### In Browser Console:
```
Access to fetch at 'http://localhost:9000/store/products' from origin 'http://localhost:3000' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

### In Network Tab:
- Request shows as "CORS error"
- Status: (failed)
- Type: cors

---

## ✅ Solution 1: Fix Backend CORS (RECOMMENDED)

### Step 1: Update `medusa-config.ts`

**File: `medusa-config.ts` (root directory)**

```typescript
module.exports = {
  projectConfig: {
    // ... other config
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:7001",
      authCors: process.env.AUTH_CORS || "http://localhost:3000",
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
  },
  // ... rest of config
}
```

### Step 2: Update `.env` (Backend)

**File: `.env` (root directory)**

```env
# CORS Configuration
STORE_CORS=http://localhost:3000,http://localhost:8000
ADMIN_CORS=http://localhost:7001,http://localhost:7000
AUTH_CORS=http://localhost:3000,http://localhost:7001

# For production, use your actual domains:
# STORE_CORS=https://yourdomain.com,https://www.yourdomain.com
```

### Step 3: Restart Backend

**IMPORTANT:** Changes to `medusa-config.ts` require restart!

```bash
# Stop backend (Ctrl+C)
# Start again
npm run dev
```

### Step 4: Verify CORS Headers

```bash
curl -I http://localhost:9000/store/products
```

Look for:
```
access-control-allow-origin: http://localhost:3000
```

---

## ✅ Solution 2: Next.js Proxy (Alternative)

If you can't modify backend, proxy requests through Next.js.

### Update `storefront/next.config.js`

```javascript
const createNextIntlPlugin = require('next-intl/plugin')
const withNextIntl = createNextIntlPlugin('./i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/store/:path*',
        destination: 'http://localhost:9000/store/:path*',
      },
      {
        source: '/api/admin/:path*',
        destination: 'http://localhost:9000/admin/:path*',
      },
    ]
  },
  // ... rest of config
}

module.exports = withNextIntl(nextConfig)
```

### Update API Calls

**Before:**
```typescript
fetch('http://localhost:9000/store/products')
```

**After:**
```typescript
fetch('/api/store/products')
```

### Update `.env.local`

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=/api
```

### Restart Next.js

```bash
cd storefront
# Stop (Ctrl+C)
npm run dev
```

---

## ✅ Solution 3: Development Proxy (Quick Test)

Use a proxy server for quick testing.

### Install Proxy

```bash
npm install -g local-cors-proxy
```

### Run Proxy

```bash
lcp --proxyUrl http://localhost:9000 --port 8010
```

### Update `.env.local`

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:8010
```

### Restart Storefront

```bash
cd storefront
npm run dev
```

Now your requests go: Frontend → Proxy (8010) → Backend (9000)

---

## ✅ Solution 4: Medusa 2.x Specific Fix

For Medusa v2, CORS is configured differently.

### Check `medusa-config.ts`

```typescript
module.exports = defineConfig({
  projectConfig: {
    http: {
      storeCors: "http://localhost:3000",
      adminCors: "http://localhost:7001",
      authCors: "http://localhost:3000",
    },
  },
})
```

### Or use environment variables:

```typescript
module.exports = defineConfig({
  projectConfig: {
    http: {
      storeCors: process.env.STORE_CORS,
      adminCors: process.env.ADMIN_CORS,
    },
  },
})
```

---

## 🧪 Testing CORS Configuration

### Test 1: OPTIONS Request

```bash
curl -X OPTIONS http://localhost:9000/store/products \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

Should return:
```
< access-control-allow-origin: http://localhost:3000
< access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS
```

### Test 2: GET Request with Origin

```bash
curl http://localhost:9000/store/products \
  -H "Origin: http://localhost:3000" \
  -v
```

Should return:
```
< access-control-allow-origin: http://localhost:3000
```

### Test 3: Browser Console

```javascript
// Open browser console on http://localhost:3000
fetch('http://localhost:9000/store/products')
  .then(r => r.json())
  .then(d => console.log('✅ CORS working:', d))
  .catch(e => console.error('❌ CORS error:', e))
```

---

## 🔍 Debugging CORS Issues

### Check 1: Backend is Running

```bash
curl http://localhost:9000/health
```

Should return: `{"status":"ok"}`

### Check 2: CORS Headers Present

```bash
curl -I http://localhost:9000/store/products
```

Look for `access-control-allow-origin` header.

### Check 3: Browser Network Tab

1. Open http://localhost:3000
2. Press F12 → Network tab
3. Refresh page
4. Click on failed request
5. Check "Response Headers"

Should see:
```
access-control-allow-origin: http://localhost:3000
```

### Check 4: Preflight Request

Some requests send OPTIONS first (preflight).

In Network tab, look for:
- Method: OPTIONS
- Status: 204 or 200

If OPTIONS fails, CORS is not configured.

---

## 🚨 Common CORS Mistakes

### Mistake 1: Wrong Origin

```typescript
// ❌ Wrong
storeCors: "localhost:3000"

// ✅ Correct
storeCors: "http://localhost:3000"
```

### Mistake 2: Missing Protocol

```typescript
// ❌ Wrong
storeCors: "//localhost:3000"

// ✅ Correct
storeCors: "http://localhost:3000"
```

### Mistake 3: Trailing Slash

```typescript
// ❌ Wrong
storeCors: "http://localhost:3000/"

// ✅ Correct
storeCors: "http://localhost:3000"
```

### Mistake 4: Not Restarting Backend

After changing `medusa-config.ts`, you MUST restart!

```bash
# Stop backend (Ctrl+C)
npm run dev
```

### Mistake 5: Wrong Port

```typescript
// Make sure ports match!
// Backend: 9000
// Storefront: 3000

storeCors: "http://localhost:3000"  // ✅
storeCors: "http://localhost:9000"  // ❌ Wrong port
```

---

## 🌐 Production CORS Setup

### For Production Deployment

```typescript
module.exports = {
  projectConfig: {
    http: {
      storeCors: process.env.STORE_CORS || "https://yourdomain.com",
      adminCors: process.env.ADMIN_CORS || "https://admin.yourdomain.com",
    },
  },
}
```

### Environment Variables

```env
# Production
STORE_CORS=https://yourdomain.com,https://www.yourdomain.com
ADMIN_CORS=https://admin.yourdomain.com

# Staging
STORE_CORS=https://staging.yourdomain.com
ADMIN_CORS=https://admin-staging.yourdomain.com
```

### Multiple Origins

```typescript
storeCors: "https://yourdomain.com,https://www.yourdomain.com,https://app.yourdomain.com"
```

---

## 🛠️ Advanced CORS Configuration

### Custom CORS Middleware (if needed)

**File: `src/api/middlewares.ts`**

```typescript
import { defineMiddlewares } from "@medusajs/medusa"
import cors from "cors"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/*",
      middlewares: [
        cors({
          origin: [
            "http://localhost:3000",
            "http://localhost:8000",
            process.env.STORE_CORS,
          ].filter(Boolean),
          credentials: true,
        }),
      ],
    },
  ],
})
```

---

## ✅ Verification Checklist

- [ ] Backend running on port 9000
- [ ] Storefront running on port 3000
- [ ] `medusa-config.ts` has correct CORS settings
- [ ] `.env` has STORE_CORS variable
- [ ] Backend restarted after config change
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows `access-control-allow-origin` header
- [ ] API requests succeed

---

## 📞 Still Having CORS Issues?

### Last Resort Debugging

1. **Check exact error message:**
   ```
   Open browser console → Copy full error
   ```

2. **Check request headers:**
   ```
   Network tab → Click request → Headers tab
   ```

3. **Check response headers:**
   ```
   Network tab → Click request → Headers tab → Response Headers
   ```

4. **Test with curl:**
   ```bash
   curl -v http://localhost:9000/store/products \
     -H "Origin: http://localhost:3000"
   ```

5. **Check Medusa logs:**
   ```
   Look at terminal where backend is running
   Should show incoming requests
   ```

---

## 🎯 Quick Fix Summary

**Most common fix (works 90% of the time):**

1. Edit `medusa-config.ts`:
   ```typescript
   http: {
     storeCors: "http://localhost:3000",
   }
   ```

2. Restart backend:
   ```bash
   npm run dev
   ```

3. Refresh browser:
   ```
   http://localhost:3000
   ```

**Done!** 🎉

---

**Time to fix: 2-5 minutes**
**Difficulty: Easy**
**Success rate: 95%**
