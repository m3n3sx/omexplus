# 🚨 Storefront Error Fixes

## Error: Cannot find module './vendor-chunks/@opentelemetry.js'

### Root Cause
This error occurs when:
1. You have duplicate Next.js config files (`next.config.js` AND `next.config.ts`)
2. Next.js build cache is corrupted
3. OpenTelemetry instrumentation is misconfigured

### ✅ FIXED - What We Did

1. **Removed duplicate config file**
   - Deleted `next.config.ts`
   - Kept `next.config.js` with proper configuration

2. **Disabled instrumentation**
   - Added `instrumentationHook: false` to Next.js config

3. **Cleaned build cache**
   - Removed `.next` directory
   - Removed `node_modules/.cache`

### 🚀 Quick Fix Commands

```bash
cd storefront

# Clean everything
rm -rf .next node_modules/.cache

# Start fresh
npm run dev
```

Or use the automated script:

```bash
cd storefront
./fix-and-start.sh
```

---

## Other Common Errors

### Error: "Module not found: @medusajs/medusa-js"

**Fix:**
```bash
cd storefront
npm install @medusajs/medusa-js
```

### Error: "fetch failed" or "ECONNREFUSED"

**Fix:**
```bash
# Make sure backend is running
cd ..  # Go to root directory
npm run dev
```

**Verify:**
```bash
curl http://localhost:9000/health
```

### Error: CORS Policy

**Fix:** Edit `medusa-config.ts` in root directory:

```typescript
module.exports = {
  projectConfig: {
    http: {
      storeCors: "http://localhost:3000",
    },
  },
}
```

Then restart backend!

### Error: "Cannot find module 'next-intl'"

**Fix:**
```bash
cd storefront
npm install next-intl
```

### Error: Port 3000 already in use

**Fix:**
```bash
# Find what's using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Error: TypeScript errors

**Fix:**
```bash
cd storefront
npm run build
# Fix reported errors
```

### Error: Tailwind styles not applying

**Fix:**
```bash
cd storefront
rm -rf .next
npm run dev
```

---

## 🔍 Debugging Steps

### 1. Check Backend Status
```bash
curl http://localhost:9000/health
# Should return: {"status":"ok"}
```

### 2. Check Environment Variables
```bash
cd storefront
cat .env.local
# Should show NEXT_PUBLIC_MEDUSA_BACKEND_URL
```

### 3. Check Node Version
```bash
node --version
# Should be 18+ or 20+
```

### 4. Check Dependencies
```bash
cd storefront
npm list @medusajs/medusa-js
npm list next
npm list next-intl
```

### 5. Check Browser Console
- Open http://localhost:3000
- Press F12
- Look for errors in Console tab

### 6. Check Network Tab
- F12 → Network tab
- Refresh page
- Look for failed requests (red)
- Check if API calls are going to correct URL

---

## 🧹 Nuclear Option (Complete Reset)

If nothing works, do a complete reset:

```bash
cd storefront

# 1. Remove everything
rm -rf .next
rm -rf node_modules
rm -rf package-lock.json

# 2. Reinstall
npm install

# 3. Clean start
npm run dev
```

---

## ✅ Verification Checklist

After fixing, verify:

- [ ] `npm run dev` starts without errors
- [ ] Browser shows page (not error)
- [ ] Console has no red errors
- [ ] API calls succeed (check Network tab)
- [ ] Products/categories load
- [ ] Mobile view works

---

## 📞 Still Broken?

### Check These Files:

1. **storefront/next.config.js** - Should exist (not .ts)
2. **storefront/.env.local** - Should have NEXT_PUBLIC_MEDUSA_BACKEND_URL
3. **storefront/package.json** - Should have @medusajs/medusa-js
4. **Backend running** - curl http://localhost:9000/health

### Get Detailed Error Info:

```bash
cd storefront
npm run dev 2>&1 | tee error.log
# Check error.log for full error details
```

---

## 🎯 Current Configuration

### Working Files:
- ✅ `next.config.js` (JavaScript, not TypeScript)
- ✅ `.env.local` (with correct variables)
- ✅ `lib/medusa.ts` (Medusa client)
- ✅ `lib/api-client.ts` (API wrapper)
- ✅ `app/globals-clean.css` (minimal CSS)
- ✅ `app/[locale]/page-simple.tsx` (working homepage)

### Configuration:
```javascript
// next.config.js
{
  instrumentationHook: false,  // Disables OpenTelemetry
  experimental: {
    turbo: false,  // Disables Turbopack
  },
}
```

---

**Last Updated:** December 2024
**Status:** ✅ Fixed
