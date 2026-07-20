import { api } from "@/lib/api";

export interface DeliveryFeeRequest {
  latitude: number;
  longitude: number;
  subtotal?: number;
}

export interface DeliveryFeeResponse {
  fee: number;
  distanceKm: number;
  method: "PICKUP" | "DELIVERY";
}

export interface GeocodeResponse {
  latitude: number;
  longitude: number;
  displayName: string;
}

export async function calculateDeliveryFee(
  data: DeliveryFeeRequest
): Promise<DeliveryFeeResponse> {
  const response = await api.post("/delivery/calculate", data);
  return response.data;
}

export async function geocodeAddress(address: string): Promise<GeocodeResponse> {
  const response = await api.post("/delivery/geocode", { address });
  return response.data;
}

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<GeocodeResponse> {
  const response = await api.post("/delivery/reverse-geocode", { latitude, longitude });
  return response.data;
}
