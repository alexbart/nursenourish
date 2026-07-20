export interface DeliveryFeeRequest {
  latitude: number;
  longitude: number;
}

export interface DeliveryFeeResponse {
  fee: number;
  distanceKm: number;
  method: "PICKUP" | "DELIVERY";
}

export interface GeocodeRequest {
  address: string;
}

export interface GeocodeResponse {
  latitude: number;
  longitude: number;
  displayName: string;
}

const WAREHOUSE_LATITUDE = Number(process.env.WAREHOUSE_LATITUDE ?? -1.2921);
const WAREHOUSE_LONGITUDE = Number(process.env.WAREHOUSE_LONGITUDE ?? 36.8219);
const BASE_FEE = Number(process.env.DELIVERY_BASE_FEE ?? 200);
const PER_KM_RATE = Number(process.env.DELIVERY_PER_KM_RATE ?? 50);
const FREE_DELIVERY_THRESHOLD_KM = Number(process.env.FREE_DELIVERY_THRESHOLD_KM ?? 5);
const FREE_DELIVERY_MINIMUM_SPEND = Number(process.env.FREE_DELIVERY_MINIMUM_SPEND ?? 3000);

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateDeliveryFee(
  latitude: number,
  longitude: number,
  subtotal: number
): DeliveryFeeResponse {
  const distanceKm = calculateHaversineDistance(
    WAREHOUSE_LATITUDE,
    WAREHOUSE_LONGITUDE,
    latitude,
    longitude
  );

  let fee = BASE_FEE + distanceKm * PER_KM_RATE;

  if (distanceKm <= FREE_DELIVERY_THRESHOLD_KM) {
    fee = 0;
  } else if (subtotal >= FREE_DELIVERY_MINIMUM_SPEND) {
    fee = 0;
  }

  return {
    fee: Math.round(fee),
    distanceKm: Math.round(distanceKm * 100) / 100,
    method: "DELIVERY",
  };
}

export function geocodeAddress(address: string): Promise<GeocodeResponse> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", address);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  return fetch(url.toString(), {
    headers: {
      "User-Agent": "NurseNourish/1.0 (contact@nursenourish.co.ke)",
    },
  })
    .then((res) => res.json())
    .then((data: any[]) => {
      if (!data.length) {
        throw new Error("Address not found");
      }
      const place = data[0];
      return {
        latitude: parseFloat(place.lat),
        longitude: parseFloat(place.lon),
        displayName: place.display_name,
      };
    });
}

export function reverseGeocode(latitude: number, longitude: number): Promise<GeocodeResponse> {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("format", "json");

  return fetch(url.toString(), {
    headers: {
      "User-Agent": "NurseNourish/1.0 (contact@nursenourish.co.ke)",
    },
  })
    .then((res) => res.json())
    .then((data: any) => {
      if (data.error) {
        throw new Error(data.error);
      }
      return {
        latitude: parseFloat(data.lat),
        longitude: parseFloat(data.lon),
        displayName: data.display_name || `${latitude}, ${longitude}`,
      };
    });
}

