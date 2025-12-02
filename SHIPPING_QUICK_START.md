# Multi-Carrier Shipping - Quick Start

## 🚀 Get Started in 3 Steps

### Step 1: Configure API Keys

Edit `.env` and add your shipping provider credentials:

```bash
# InPost (Poland)
INPOST_API_KEY=your_key_here
INPOST_API_SECRET=your_secret_here
INPOST_ORG_ID=your_org_id_here

# DPD (Europe)
DPD_API_KEY=your_key_here
DPD_LOGIN=your_login_here
DPD_PASSWORD=your_password_here

# DHL (Global)
DHL_API_KEY=your_key_here
DHL_ACCOUNT_NUMBER=your_account_here
```

### Step 2: Run Setup

```bash
./setup-shipping.sh
```

This will:
- Create database tables
- Run migrations
- Test the system

### Step 3: Test API

```bash
# Get shipping methods
curl http://localhost:9000/store/shipping/methods

# Calculate rates
curl -X POST http://localhost:9000/store/shipping/rates \
  -H "Content-Type: application/json" \
  -d '{"postal_code":"00-001","country":"PL","weight":1000}'
```

## 📦 Shipping Methods

### InPost (Poland) 🇵🇱
- **Paczkomat 24/7** - $4.99, 2 days
- **Courier** - $7.99, 2 days  
- **Standard Locker** - $3.99, 2 days

### DPD (Europe) 🇪🇺
- **Economy** - $6.99, 3 days
- **Express** - $12.99, 1 day

### DHL (Global) 🌍
- **Parcel** - $8.99, 3 days
- **Express** - $14.99, 1 day

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/store/shipping/methods` | List all methods |
| POST | `/store/shipping/rates` | Calculate rates |
| POST | `/admin/orders/:id/shipment` | Create shipment |
| GET | `/admin/shipments/:id/label` | Get label PDF |
| GET | `/store/shipments/:id/tracking` | Track shipment |

## 🎨 Frontend Components

```tsx
// Shipping selector in checkout
<ShippingSelector
  postalCode="00-001"
  country="PL"
  weight={1000}
  onSelect={(method) => console.log(method)}
/>

// Tracking page
<TrackingPage
  orderId="order_123"
  trackingNumber="1234567890"
  provider="inpost"
/>
```

## 📚 Full Documentation

See `SHIPPING_SYSTEM_GUIDE.md` for complete documentation.

## 🆘 Get API Keys

- **InPost:** https://manager.paczkomaty.pl/
- **DPD:** Contact DPD sales
- **DHL:** https://developer.dhl.com/

## ✅ Production Checklist

- [ ] Add production API keys
- [ ] Run migrations
- [ ] Test rate calculation
- [ ] Test shipment creation
- [ ] Configure webhooks
- [ ] Test tracking
- [ ] Deploy frontend components

## 🎉 You're Ready!

The shipping system is now fully integrated and ready to use.
