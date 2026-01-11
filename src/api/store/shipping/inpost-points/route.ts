/**
 * InPost Points API
 * 
 * Get nearby Paczkomat locations
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

interface InPostPoint {
  name: string;
  address: {
    line1: string;
    line2: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  type: string;
  status: string;
  opening_hours: string;
  location_description?: string;
  payment_available: boolean;
}

/**
 * GET /store/shipping/inpost-points
 * Get InPost Paczkomat locations
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { 
      city, 
      postal_code, 
      latitude, 
      longitude, 
      limit = '20',
      type = 'parcel_locker' // parcel_locker, pop (punkt odbioru)
    } = req.query as any;

    // InPost public API for points
    const baseUrl = 'https://api-shipx-pl.easypack24.net/v1/points';
    
    const params = new URLSearchParams({
      per_page: limit,
      type: type,
      status: 'Operating',
    });

    // Search by location
    if (latitude && longitude) {
      params.append('relative_point', `${latitude},${longitude}`);
    } else if (city) {
      params.append('city', city);
    } else if (postal_code) {
      params.append('post_code', postal_code);
    }

    const response = await fetch(`${baseUrl}?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`InPost API error: ${response.status}`);
    }

    const data = await response.json();

    // Format response
    const points: InPostPoint[] = (data.items || []).map((point: any) => ({
      name: point.name,
      address: {
        line1: point.address?.line1 || `${point.address_details?.street} ${point.address_details?.building_number}`,
        line2: `${point.address_details?.post_code} ${point.address_details?.city}`,
      },
      location: {
        latitude: point.location?.latitude,
        longitude: point.location?.longitude,
      },
      type: point.type,
      status: point.status,
      opening_hours: point.opening_hours || '24/7',
      location_description: point.location_description,
      payment_available: point.payment_available || false,
    }));

    res.json({
      points,
      total: data.total_count || points.length,
    });
  } catch (error: any) {
    console.error('Failed to fetch InPost points:', error);
    res.status(500).json({ error: error.message });
  }
}
