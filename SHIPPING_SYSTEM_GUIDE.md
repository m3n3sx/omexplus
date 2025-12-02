# Multi-Carrier Shipping System - Complete Guide

## Overview

Complete multi-carrier shipping integration for OMEX B2B e-commerce platform with InPost (Poland), DPD (Europe), and DHL (Global) support.

## Features

✅ **3 Shipping Providers**
- InPost (Poland) - Parcel lockers & courier
- DPD (Europe) - Economy & express
- DHL (Global) - Worldwide shipping

✅ **Core Functionality**
- Real-time rate calculation
- Automatic provider selection based on destination
- Shipment creation & label generation
- Real-time tracking with webhooks
- Multi-currency support

✅ **Frontend Components**
- Shipping method selector
- Tracking page with timeline
- Real-time updates (auto-refresh every 60s)

## Quick Start

### 1. Environment Setup

Add to `.env`:

```bash
# InPost (Poland)
INPOST_API_KEY=your_inpost_api_key
INPOST_API_SECRET=your_inpost_api_secret
INPOST_ORG_ID=your_inpost_organization_id

# DPD (Europe)
DPD_API_KEY=your_dpd_api_key
DPD_LOGIN=your_dpd_login
DPD_PASSWORD=your_dpd_password

# DHL (Global)
DHL_API_KEY=your_dhl_api_key
DHL_ACCOUNT_NUMBER=your_dhl_account_number
```

### 2. Run Database Migration

```bash
npm run build
medusa migrations run
```

This creates:
- `shipment` table
- `tracking_event` table
- Indexes for performance

### 3. Test the API

```bash
# Get available shipping methods
curl http://localhost:9000/store/shipping/methods

# Calculate rates
curl -X POST http://localhost:9000/store/shipping/rates \
  -H "Content-Type: application/json" \
  -d '{
    "postal_code": "00-001",
    "country": "PL",
    "weight": 1000
  }'
```

## API Endpoints

### Store Endpoints (Customer-facing)

#### GET /store/shipping/methods
Get all available shipping methods.

**Response:**
```json
{
  "methods": [
    {
      "id": "inpost_paczkomat_24_7",
      "name": "InPost Paczkomat 24/7",
      "provider": "inpost",
      "price": 4.99,
      "delivery_days": 2,
      "currency": "USD"
    }
  ]
}
```

#### POST /store/shipping/rates
Calculate shipping rates for specific address.

**Request:**
```json
{
  "postal_code": "00-001",
  "country": "PL",
  "weight": 1000,
  "dimensions": {
    "length": 30,
    "width": 20,
    "height": 10
  }
}
```

**Response:**
```json
{
  "rates": [
    {
      "provider": "inpost",
      "method": "parcel_locker",
      "price": 3.99,
      "delivery_days": 2,
      "currency": "USD"
    }
  ]
}
```

#### GET /store/shipments/:id/tracking
Get real-time tracking information.

**Response:**
```json
{
  "tracking": {
    "tracking_number": "1234567890",
    "status": "in_transit",
    "events": [
      {
        "timestamp": "2024-12-02T10:00:00Z",
        "status": "picked_up",
        "location": "Warsaw",
        "description": "Package picked up"
      }
    ]
  }
}
```

### Admin Endpoints

#### POST /admin/orders/:id/shipment
Create shipment for order.

**Request:**
```json
{
  "shipping_method_id": "inpost_courier",
  "weight": 1000,
  "dimensions": {
    "length": 30,
    "width": 20,
    "height": 10
  }
}
```

**Response:**
```json
{
  "shipment": {
    "shipment_id": "abc123",
    "tracking_number": "1234567890",
    "label_url": "https://...",
    "provider": "inpost",
    "status": "pending"
  }
}
```

#### GET /admin/shipments/:id/label
Get shipping label (PDF).

**Response:**
```json
{
  "label_url": "https://api.provider.com/labels/abc123.pdf"
}
```

## Frontend Integration

### Shipping Selector Component

```tsx
import { ShippingSelector } from "@/components/ShippingSelector";

function CheckoutPage() {
  const [selectedMethod, setSelectedMethod] = useState(null);

  return (
    <ShippingSelector
      postalCode="00-001"
      country="PL"
      weight={1000}
      onSelect={(method) => setSelectedMethod(method)}
      selectedMethodId={selectedMethod?.id}
    />
  );
}
```

### Tracking Page

```tsx
import { TrackingPage } from "@/components/TrackingPage";

function OrderTrackingPage({ orderId, trackingNumber, provider }) {
  return (
    <TrackingPage
      orderId={orderId}
      trackingNumber={trackingNumber}
      provider={provider}
    />
  );
}
```

### Custom Hooks

```tsx
// Fetch shipping rates
import { useShipping } from "@/hooks/useShipping";

const { rates, loading, error, fetchRates } = useShipping();

fetchRates({
  postal_code: "00-001",
  country: "PL",
  weight: 1000
});

// Track shipment
import { useTracking } from "@/hooks/useTracking";

const { tracking, loading, error, refresh } = useTracking(trackingNumber);
```

## Provider Configuration

### InPost (Poland)

**Services:**
- `paczkomat_24_7` - Parcel locker 24/7 ($4.99, 2 days)
- `courier` - Door-to-door ($7.99, 2 days)
- `parcel_locker` - Standard locker ($3.99, 2 days)

**API:** https://api-shipx-pl.easypack24.net/v1

**Get API Keys:**
1. Register at https://manager.paczkomaty.pl/
2. Create organization
3. Generate API credentials

### DPD (Europe)

**Services:**
- `economy` - Standard delivery ($6.99, 3 days)
- `express` - Next day ($12.99, 1 day)

**API:** https://www.dpd.com.pl/api

**Get API Keys:**
1. Contact DPD sales
2. Request API access
3. Receive credentials

### DHL (Global)

**Services:**
- `parcel` - Standard ($8.99, 3 days)
- `express` - Express ($14.99, 1 day)

**API:** https://api.dhl.com/v1

**Get API Keys:**
1. Register at https://developer.dhl.com/
2. Create application
3. Get API key

## Rate Calculation Logic

Base rates + surcharges:

1. **Weight Surcharge:** +$1 per kg over 5kg
2. **Insurance:** +$0.50 per $100 value
3. **Saturday Delivery:** +$2.00

Example:
```
Base: $4.99 (InPost Paczkomat)
Weight: 7kg → +$2.00 (2kg over limit)
Total: $6.99
```

## Provider Selection Logic

Automatic selection based on destination:

```typescript
if (country === "PL") {
  return "inpost";  // Poland → InPost
} else if (euCountries.includes(country)) {
  return "dpd";     // EU → DPD
} else {
  return "dhl";     // Global → DHL
}
```

## Webhooks

Configure webhooks in provider dashboards:

- **InPost:** `https://yourdomain.com/webhooks/inpost`
- **DPD:** `https://yourdomain.com/webhooks/dpd`
- **DHL:** `https://yourdomain.com/webhooks/dhl`

Webhook payload:
```json
{
  "tracking_number": "1234567890",
  "status": "in_transit",
  "event_type": "status_update",
  "timestamp": "2024-12-02T10:00:00Z",
  "location": "Warsaw"
}
```

## Database Schema

### shipment table
```sql
id              UUID PRIMARY KEY
order_id        UUID NOT NULL (FK → order)
provider        VARCHAR(50) NOT NULL
shipping_method VARCHAR(100)
tracking_number VARCHAR(255) UNIQUE
label_url       VARCHAR(500)
price           DECIMAL(10,2)
status          VARCHAR(50) DEFAULT 'pending'
metadata        JSONB
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### tracking_event table
```sql
id          UUID PRIMARY KEY
shipment_id UUID NOT NULL (FK → shipment)
status      VARCHAR(50) NOT NULL
location    VARCHAR(255)
timestamp   TIMESTAMP NOT NULL
description TEXT
created_at  TIMESTAMP
```

## Status Flow

```
pending → picked_up → in_transit → out_for_delivery → delivered
                                 ↘ failed
                                 ↘ cancelled
```

## Error Handling

All endpoints include comprehensive error handling:

```typescript
try {
  // API call
} catch (error) {
  console.error("Operation failed:", error);
  return res.status(500).json({
    error: "Operation failed",
    message: error.message
  });
}
```

Frontend displays user-friendly errors with retry options.

## Testing

### Test Shipment Creation

```bash
curl -X POST http://localhost:9000/admin/orders/ORDER_ID/shipment \
  -H "Content-Type: application/json" \
  -d '{
    "shipping_method_id": "inpost_courier",
    "weight": 1000
  }'
```

### Test Tracking

```bash
curl http://localhost:9000/store/shipments/TRACKING_NUMBER/tracking
```

## Production Checklist

- [ ] Configure production API keys for all providers
- [ ] Set up webhook endpoints with HTTPS
- [ ] Test rate calculation with real addresses
- [ ] Verify label generation
- [ ] Test tracking updates
- [ ] Configure error monitoring
- [ ] Set up backup provider fallback
- [ ] Test international shipping
- [ ] Verify currency conversion
- [ ] Load test API endpoints

## Support

For issues or questions:
1. Check provider API documentation
2. Review error logs
3. Test with sandbox/test APIs first
4. Contact provider support if needed

## Architecture

```
Frontend (Next.js)
  ↓
API Routes (/store/shipping/*, /admin/orders/*/shipment)
  ↓
ShippingService (Router)
  ↓
Provider Services (InPost, DPD, DHL)
  ↓
External APIs
```

## Files Created

**Backend:**
- `src/services/shipping-base.ts` - Abstract base class
- `src/services/shipping-inpost.ts` - InPost provider
- `src/services/shipping-dpd.ts` - DPD provider
- `src/services/shipping-dhl.ts` - DHL provider
- `src/services/shipping-service.ts` - Service manager
- `src/api/store/shipping/methods/route.ts` - Get methods
- `src/api/store/shipping/rates/route.ts` - Calculate rates
- `src/api/admin/orders/[id]/shipment/route.ts` - Create shipment
- `src/api/admin/shipments/[id]/label/route.ts` - Get label
- `src/api/store/shipments/[id]/tracking/route.ts` - Track shipment
- `src/api/webhooks/inpost/route.ts` - InPost webhook
- `src/api/webhooks/dpd/route.ts` - DPD webhook
- `src/api/webhooks/dhl/route.ts` - DHL webhook
- `src/migrations/1733160000000-create-shipment-tables.ts` - Database schema

**Frontend:**
- `storefront/components/ShippingSelector.tsx` - Method selector
- `storefront/components/TrackingPage.tsx` - Tracking page
- `storefront/components/TrackingTimeline.tsx` - Event timeline
- `storefront/hooks/useShipping.ts` - Shipping hook
- `storefront/hooks/useTracking.ts` - Tracking hook

**Documentation:**
- `SHIPPING_SYSTEM_GUIDE.md` - This file

## Next Steps

1. Add API keys to `.env`
2. Run migrations
3. Test with sandbox APIs
4. Integrate into checkout flow
5. Configure webhooks
6. Deploy to production
