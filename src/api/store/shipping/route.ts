/**
 * Shipping API Routes
 * 
 * Handles shipping rates and shipment creation
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ShippingService } from "../../../services/shipping-service";

// Initialize shipping service
const getShippingService = () => {
  return new ShippingService({
    inpost: process.env.INPOST_API_KEY ? {
      apiKey: process.env.INPOST_API_KEY,
      apiSecret: process.env.INPOST_API_SECRET || '',
      orgId: process.env.INPOST_ORG_ID || '',
    } : undefined,
    dpd: process.env.DPD_API_KEY ? {
      apiKey: process.env.DPD_API_KEY,
      login: process.env.DPD_LOGIN || '',
      password: process.env.DPD_PASSWORD || '',
    } : undefined,
    dhl: process.env.DHL_API_KEY ? {
      apiKey: process.env.DHL_API_KEY,
      accountNumber: process.env.DHL_ACCOUNT_NUMBER || '',
    } : undefined,
  });
};

// Default warehouse address
const WAREHOUSE_ADDRESS = {
  name: 'OMEX Warehouse',
  street: process.env.WAREHOUSE_STREET || 'ul. Gnieźnieńska 19',
  city: process.env.WAREHOUSE_CITY || 'Września',
  postal_code: process.env.WAREHOUSE_POSTAL_CODE || '62-300',
  country: process.env.WAREHOUSE_COUNTRY || 'PL',
  phone: process.env.WAREHOUSE_PHONE || '+48500169060',
  email: process.env.WAREHOUSE_EMAIL || 'omexplus@gmail.com',
};

/**
 * GET /store/shipping/methods
 * Get available shipping methods for a destination
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { country, postal_code, weight, length, width, height } = req.query as any;

    const destination = {
      country: country || 'PL',
      postal_code: postal_code || '',
      city: '',
      street: '',
    };

    const parcel = {
      weight: parseFloat(weight) || 1000, // Default 1kg
      length: parseFloat(length) || 30,
      width: parseFloat(width) || 20,
      height: parseFloat(height) || 10,
    };

    const shippingService = getShippingService();
    
    // Get rates from all providers
    const rates = await shippingService.getRates(WAREHOUSE_ADDRESS, destination, parcel);

    // Format response with Polish labels
    const methods = rates.map(rate => ({
      id: `${rate.provider}_${rate.method}`,
      provider: rate.provider,
      method: rate.method,
      name: getMethodName(rate.provider, rate.method),
      description: getMethodDescription(rate.provider, rate.method),
      price: rate.price,
      currency: 'PLN',
      delivery_days: rate.delivery_days,
      icon: getMethodIcon(rate.provider),
    }));

    // Add free shipping threshold info
    const freeShippingThreshold = parseFloat(process.env.FREE_SHIPPING_THRESHOLD || '500');

    res.json({
      methods,
      free_shipping_threshold: freeShippingThreshold,
      currency: 'PLN',
    });
  } catch (error: any) {
    console.error('Failed to get shipping methods:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * POST /store/shipping/calculate
 * Calculate shipping cost for specific items
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const {
      destination,
      items, // Array of { weight, length, width, height, quantity }
      method, // Optional: specific method to calculate
    } = req.body as any;

    if (!destination || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Missing destination or items' });
    }

    // Calculate total parcel dimensions
    const totalWeight = items.reduce((sum: number, item: any) => 
      sum + (item.weight || 500) * (item.quantity || 1), 0
    );

    // Estimate box size based on items
    const parcel = {
      weight: totalWeight,
      length: Math.max(...items.map((i: any) => i.length || 30)),
      width: Math.max(...items.map((i: any) => i.width || 20)),
      height: items.reduce((sum: number, item: any) => 
        sum + (item.height || 5) * (item.quantity || 1), 0
      ),
    };

    const shippingService = getShippingService();
    const rates = await shippingService.getRates(WAREHOUSE_ADDRESS, destination, parcel);

    // If specific method requested, filter
    const filteredRates = method 
      ? rates.filter(r => `${r.provider}_${r.method}` === method)
      : rates;

    res.json({
      rates: filteredRates.map(rate => ({
        id: `${rate.provider}_${rate.method}`,
        provider: rate.provider,
        method: rate.method,
        name: getMethodName(rate.provider, rate.method),
        price: rate.price,
        currency: 'PLN',
        delivery_days: rate.delivery_days,
      })),
      parcel_info: {
        total_weight: totalWeight,
        dimensions: parcel,
      },
    });
  } catch (error: any) {
    console.error('Failed to calculate shipping:', error);
    res.status(500).json({ error: error.message });
  }
}

// Helper functions for Polish labels
function getMethodName(provider: string, method: string): string {
  const names: Record<string, Record<string, string>> = {
    inpost: {
      paczkomat_24_7: 'InPost Paczkomat 24/7',
      courier: 'InPost Kurier',
      parcel_locker: 'InPost Paczkomat',
    },
    dpd: {
      standard: 'DPD Standard',
      express: 'DPD Express',
      pickup: 'DPD Pickup Point',
    },
    dhl: {
      standard: 'DHL Standard',
      express: 'DHL Express',
      economy: 'DHL Economy',
    },
  };

  return names[provider]?.[method] || `${provider} ${method}`;
}

function getMethodDescription(provider: string, method: string): string {
  const descriptions: Record<string, Record<string, string>> = {
    inpost: {
      paczkomat_24_7: 'Odbiór w Paczkomacie 24/7 - dostępny całą dobę',
      courier: 'Dostawa kurierem InPost pod wskazany adres',
      parcel_locker: 'Odbiór w Paczkomacie',
    },
    dpd: {
      standard: 'Standardowa dostawa kurierska 1-2 dni robocze',
      express: 'Ekspresowa dostawa następnego dnia roboczego',
      pickup: 'Odbiór w punkcie DPD Pickup',
    },
    dhl: {
      standard: 'Dostawa standardowa 2-3 dni robocze',
      express: 'Ekspresowa dostawa następnego dnia',
      economy: 'Ekonomiczna dostawa 4-5 dni roboczych',
    },
  };

  return descriptions[provider]?.[method] || '';
}

function getMethodIcon(provider: string): string {
  const icons: Record<string, string> = {
    inpost: '/images/shipping/inpost.svg',
    dpd: '/images/shipping/dpd.svg',
    dhl: '/images/shipping/dhl.svg',
  };

  return icons[provider] || '/images/shipping/default.svg';
}
