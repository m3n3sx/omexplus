# Stripe Payment - Quick Start

## 🚀 5-Minute Setup

### 1. Get Stripe Keys (2 min)
1. Go to https://dashboard.stripe.com/register
2. Create account (or login)
3. Go to https://dashboard.stripe.com/test/apikeys
4. Copy both keys

### 2. Configure Environment (1 min)
Add to `.env`:
```bash
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_... # (optional for now)
```

Add to `storefront/.env.local`:
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
```

### 3. Install & Test (2 min)
```bash
# Install dependencies
npm install
cd storefront && npm install && cd ..

# Test Stripe connection
npx ts-node src/scripts/test-stripe-payment.ts
```

### 4. Run Application
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd storefront && npm run dev
```

### 5. Test Payment
1. Open http://localhost:3000/checkout/payment
2. Use test card: `4242 4242 4242 4242`
3. Expiry: Any future date
4. CVC: Any 3 digits
5. Click "Pay"

## ✅ Success!
If payment goes through, you're done!

## 🔧 Troubleshooting

**"Stripe not initialized"**
- Check publishable key in `storefront/.env.local`
- Restart frontend server

**"Payment intent creation failed"**
- Check secret key in `.env`
- Restart backend server

**"Invalid API key"**
- Make sure you copied the full key
- Check for extra spaces

## 📚 Full Documentation
See `STRIPE_SETUP_GUIDE.md` for complete setup instructions.

## 🧪 Test Cards

| Card | Scenario |
|------|----------|
| 4242 4242 4242 4242 | ✅ Success |
| 4000 0025 0000 3155 | 🔐 3D Secure |
| 4000 0000 0000 0002 | ❌ Declined |
| 4000 0000 0000 9995 | 💰 Insufficient Funds |

## 🎯 What's Included

✅ Complete payment flow  
✅ Error handling  
✅ 3D Secure support  
✅ Refund capability  
✅ Webhook handling  
✅ Admin endpoints  
✅ Test script  
✅ Production ready  

## 🔐 Security

- Card details never touch your server
- PCI compliant by design
- Webhook signature verification
- HTTPS enforced in production

## 📞 Need Help?

- Stripe Docs: https://stripe.com/docs
- Test Dashboard: https://dashboard.stripe.com/test
- Full Guide: `STRIPE_SETUP_GUIDE.md`
