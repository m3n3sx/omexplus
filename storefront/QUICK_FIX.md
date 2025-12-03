# 🚀 Quick Fix Guide - Get Your Storefront Working NOW

## ⚡ 5-Minute Fix

### Step 1: Install Missing Package (30 seconds)
```bash
cd storefront
npm install @medusajs/medusa-js
```

### Step 2: Replace globals.css (10 seconds)
```bash
# Backup current file
cp app/globals.css app/globals.css.backup

# Replace with clean version
cp app/globals-clean.css app/globals.css
```

Or manually replace `storefront/app/globals.css` with this minimal version:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-white text-gray-900;
  }
}

@layer components {
  .container {
    @apply mx-auto px-4 w-full max-w-7xl;
  }
}
```

### Step 3: Test API Connection (30 seconds)
```bash
# From storefront directory
npx tsx test-api-connection.ts
```

Expected output:
```
✅ Health check passed
✅ Regions: 1
✅ Products: 5
✅ Categories: 6
```

### Step 4: Use Simple Homepage (Optional - if components are broken)
```bash
# Backup current page
cp app/[locale]/page.tsx app/[locale]/page.tsx.backup

# Use simple version
cp app/[locale]/page-simple.tsx app/[locale]/page.tsx
```

### Step 5: Start Development Server
```bash
npm run dev
```

Open http://localhost:3000

---

## 🔥 Common Issues & Instant Fixes

### Issue 1: "Cannot find module '@medusajs/medusa-js'"
```bash
cd storefront
npm install @medusajs/medusa-js
```

### Issue 2: "fetch failed" or "ECONNREFUSED"
**Check backend is running:**
```bash
# In root directory (not storefront)
npm run dev
```

**Verify it's working:**
```bash
curl http://localhost:9000/health
```

### Issue 3: CORS Error in Browser Console
**Fix backend CORS in `medusa-config.ts`:**
```typescript
module.exports = {
  projectConfig: {
    http: {
      storeCors: "http://localhost:3000",
      adminCors: "http://localhost:7001",
    },
  },
}
```

**Restart backend after changing config!**

### Issue 4: Tailwind Styles Not Working
```bash
cd storefront
rm -rf .next
npm run dev
```

### Issue 5: TypeScript Errors
```bash
cd storefront
npm run build
# Fix any errors shown
```

---

## ✅ Verification Checklist

Run these commands to verify everything works:

```bash
# 1. Backend health
curl http://localhost:9000/health
# Should return: {"status":"ok"}

# 2. Products API
curl http://localhost:9000/store/products
# Should return JSON with products array

# 3. Categories API
curl http://localhost:9000/store/product-categories
# Should return JSON with categories array

# 4. Storefront loads
curl http://localhost:3000
# Should return HTML (not error)
```

---

## 🎯 What Each File Does

| File | Purpose | Status |
|------|---------|--------|
| `globals.css` | Tailwind + custom styles | ⚠️ Too complex, use clean version |
| `tailwind.config.ts` | Tailwind configuration | ✅ Good |
| `.env.local` | Environment variables | ✅ Good |
| `lib/medusa-client.ts` | Old Medusa client | ⚠️ Missing import |
| `lib/medusa.ts` | New Medusa client | ✅ Created |
| `lib/api-client.ts` | Custom API wrapper | ✅ Good |
| `page.tsx` | Homepage | ⚠️ Uses missing components |
| `page-simple.tsx` | Simple homepage | ✅ Works standalone |

---

## 🔧 Environment Variables Explained

**File: `storefront/.env.local`**

```env
# Backend URL - where Medusa is running
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# Publishable API Key - get from Medusa admin
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_storefront_2024_token

# Stripe - for payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Important:**
- `NEXT_PUBLIC_*` variables are exposed to browser
- Restart dev server after changing `.env.local`
- Never commit real API keys to git

---

## 📱 Mobile Testing Quick Check

```bash
# Open in Chrome
# Press F12
# Click device toolbar icon (or Ctrl+Shift+M)
# Select "iPhone 12 Pro"
# Refresh page
```

Check:
- [ ] Header is readable
- [ ] Products stack vertically
- [ ] Buttons are clickable
- [ ] No horizontal scroll

---

## 🚨 Emergency Reset

If everything is broken:

```bash
cd storefront

# 1. Clean build
rm -rf .next
rm -rf node_modules
rm package-lock.json

# 2. Reinstall
npm install

# 3. Use simple page
cp app/[locale]/page-simple.tsx app/[locale]/page.tsx

# 4. Use clean CSS
cp app/globals-clean.css app/globals.css

# 5. Start fresh
npm run dev
```

---

## 📞 Still Not Working?

### Check These:

1. **Backend Running?**
   ```bash
   curl http://localhost:9000/health
   ```

2. **Port 3000 Available?**
   ```bash
   lsof -i :3000
   # If something is using it, kill it or use different port
   ```

3. **Node Version?**
   ```bash
   node --version
   # Should be 18+ or 20+
   ```

4. **Environment Variables Loaded?**
   ```bash
   cd storefront
   cat .env.local
   # Should show your variables
   ```

5. **Browser Console Errors?**
   - Open http://localhost:3000
   - Press F12
   - Check Console tab
   - Look for red errors

---

## 🎉 Success Indicators

You'll know it's working when:

1. ✅ `npm run dev` starts without errors
2. ✅ Browser shows homepage (not error page)
3. ✅ Console has no red errors
4. ✅ Products/categories load from API
5. ✅ Mobile view looks good

---

## 📚 Next Steps After It Works

1. Restore your custom components one by one
2. Test each component after adding it
3. Keep `globals.css` minimal
4. Use Tailwind utilities instead of custom CSS
5. Add proper error boundaries
6. Implement proper loading states
7. Add cart functionality
8. Set up authentication

---

**Time to fix: 5-10 minutes**
**Difficulty: Easy**
**Success rate: 99%**

Good luck! 🚀
