# Stripe Payment Integration - Setup Guide

## Overview
Complete Stripe payment integration for OMEX B2B e-commerce platform with Medusa.js backend and Next.js frontend.

## Prerequisites
- Stripe account (https://stripe.com)
- Node.js 18+
- PostgreSQL database
- Medusa.js backend running
- Next.js frontend running

## Installation

### 1. Install Dependencies

**Backend (Medusa):**
```bash
npm install stripe
```

**Frontend (Next.js):**
```bash
cd storefront
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and add your Stripe keys:

```bash
# Get from https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Get from https://dashboard.stripe.com/test/webhooks
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Register Stripe Plugin

Update `medusa-config.ts`:

```typescript
import stripePlugin from './src/plugins/stripe';

export default {
  plugins: [
    // ... other plugins
    {
      resolve: stripePlugin,
      options: {
        apiKey: process.env.STRIPE_SECRET_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        apiVersion: '2023-10-16',
      },
    },
  ],
};
```

### 4. Setup Webhooks

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. URL: `https://your-domain.com/webhooks/stripe`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
   - `charge.dispute.created`
5. Copy webhook secret to `.env`

## Testing

### Run Test Script
```bash
npx ts-node src/scripts/test-stripe-payment.ts
```

### Test Cards
Use these cards in your checkout:

| Card Number | Scenario |
|-------------|----------|
| 4242 4242 4242 4242 | Success |
| 4000 0025 0000 3155 | 3D Secure |
| 4000 0000 0000 0002 | Declined |
| 4000 0000 0000 9995 | Insufficient Funds |

**Expiry:** Any future date  
**CVC:** Any 3 digits  
**ZIP:** Any 5 digits

## API Endpoints

### Store (Customer)

**Create Payment Intent**
```bash
POST /store/checkout/payment/intent
Content-Type: application/json

{
  "cart_id": "cart_123",
  "amount": 9999,
  "currency": "usd",
  "email": "customer@example.com"
}
```

**Confirm Payment**
```bash
POST /store/checkout/payment/confirm
Content-Type: application/json

{
  "paymentIntentId": "pi_...",
  "paymentMethodId": "pm_...",
  "cart_id": "cart_123"
}
```

### Admin

**Capture Payment**
```bash
POST /admin/orders/:id/payments
Content-Type: application/json

{
  "paymentIntentId": "pi_...",
  "amount": 9999
}
```

**Refund Payment**
```bash
POST /admin/orders/:id/refund
Content-Type: application/json

{
  "paymentIntentId": "pi_...",
  "amount": 5000,
  "reason": "requested_by_customer"
}
```

## Frontend Usage

### Checkout Payment Page

```tsx
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '@/components/PaymentForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentPage() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        amount={9999}
        currency="usd"
        onSuccess={(paymentIntentId) => console.log('Success!')}
        onError={(error) => console.error(error)}
      />
    </Elements>
  );
}
```

## Error Handling

### Common Errors

**Card Declined**
```typescript
if (error.type === 'StripeCardError') {
  // Show user-friendly message
  setError('Your card was declined. Please try another card.');
}
```

**3D Secure Required**
```typescript
if (paymentIntent.status === 'requires_action') {
  // Stripe.js will automatically show 3D Secure modal
  const { error } = await stripe.confirmCardPayment(clientSecret);
}
```

**Network Error**
```typescript
try {
  await createPaymentIntent();
} catch (error) {
  // Show retry button
  setError('Network error. Please try again.');
}
```

## Security Checklist

- ✅ Never send card details to your backend
- ✅ Use HTTPS in production
- ✅ Verify webhook signatures
- ✅ Use HTTP-only cookies for JWT
- ✅ Log all transactions
- ✅ Implement rate limiting
- ✅ Validate amounts on backend
- ✅ Use Stripe's latest API version

## Production Deployment

### 1. Switch to Live Keys
Replace test keys with live keys from https://dashboard.stripe.com/apikeys

### 2. Update Webhook URL
Point webhook to production URL

### 3. Enable HTTPS
Ensure SSL certificate is valid

### 4. Test Live Mode
Use real card (will be charged!)

### 5. Monitor Transactions
Check Stripe Dashboard regularly

## Troubleshooting

### Webhook Not Receiving Events
1. Check webhook URL is publicly accessible
2. Verify webhook secret matches
3. Check Stripe Dashboard logs

### Payment Fails Silently
1. Check browser console for errors
2. Verify Stripe publishable key
3. Check network tab for API errors

### 3D Secure Not Working
1. Ensure using latest Stripe.js
2. Check popup blockers
3. Test with 3D Secure test card

## Support

- Stripe Docs: https://stripe.com/docs
- Medusa Docs: https://docs.medusajs.com
- Test Dashboard: https://dashboard.stripe.com/test

## Next Steps

1. ✅ Test with all test cards
2. ✅ Implement order creation after payment
3. ✅ Add email notifications
4. ✅ Setup refund workflow
5. ✅ Add payment analytics
6. ✅ Test webhook handling
7. ✅ Deploy to staging
8. ✅ Switch to production keys
