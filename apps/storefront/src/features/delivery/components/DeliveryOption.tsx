import { useState, useEffect, useRef } from "react";
import { MapPin, Truck, Store } from "lucide-react";
import { DeliveryMap } from "./DeliveryMap";
import { calculateDeliveryFee, geocodeAddress, type DeliveryFeeResponse } from "@/api/delivery";

const NAIROBI_CENTER = { lat: -1.2921, lng: 36.8219 };

interface DefaultAddress {
  addressLine?: string;
  latitude?: number;
  longitude?: number;
}

interface DeliveryOptionProps {
  subtotal: number;
  onDeliveryChange: (data: {
    method: "PICKUP" | "DELIVERY";
    fee: number;
    address?: string;
    latitude?: number;
    longitude?: number;
  }) => void;
  defaultAddress?: DefaultAddress | null;
}

export function DeliveryOption({ subtotal, onDeliveryChange, defaultAddress }: DeliveryOptionProps) {
  const [method, setMethod] = useState<"PICKUP" | "DELIVERY">("PICKUP");
  const [address, setAddress] = useState(defaultAddress?.addressLine || "");
  const [latitude, setLatitude] = useState<number>(defaultAddress?.latitude ?? NAIROBI_CENTER.lat);
  const [longitude, setLongitude] = useState<number>(defaultAddress?.longitude ?? NAIROBI_CENTER.lng);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (defaultAddress?.addressLine && method === "PICKUP") {
      setAddress(defaultAddress.addressLine);
    }
    if (defaultAddress?.latitude) {
      setLatitude(defaultAddress.latitude);
    }
    if (defaultAddress?.longitude) {
      setLongitude(defaultAddress.longitude);
    }
  }, [defaultAddress]);

  useEffect(() => {
    onDeliveryChange({
      method,
      fee: deliveryFee,
      address: method === "DELIVERY" ? address : undefined,
      latitude: method === "DELIVERY" ? latitude : undefined,
      longitude: method === "DELIVERY" ? longitude : undefined,
    });
  }, [method, deliveryFee, address, latitude, longitude, onDeliveryChange]);

  useEffect(() => {
    if (method === "DELIVERY" && address.trim().length > 0) {
      setLoading(true);
      calculateDeliveryFee({
        latitude,
        longitude,
        subtotal,
      })
        .then((result: DeliveryFeeResponse) => {
          setDeliveryFee(result.fee);
          setDistanceKm(result.distanceKm);
        })
        .catch(() => {
          setDeliveryFee(0);
          setDistanceKm(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setDeliveryFee(0);
      setDistanceKm(null);
    }
  }, [method, latitude, longitude, subtotal]);

  const handleMapClick = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleAddressChange = (value: string) => {
    setAddress(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.trim().length < 5) {
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setGeocoding(true);
      try {
        const result = await geocodeAddress(value);
        setLatitude(result.latitude);
        setLongitude(result.longitude);
      } catch {
        // keep current coordinates if geocoding fails
      } finally {
        setGeocoding(false);
      }
    }, 800);
  };

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 mb-6">
      <h2 className="font-heading font-semibold text-xl text-primary mb-4">Delivery Method</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          type="button"
          onClick={() => setMethod("PICKUP")}
          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${
            method === "PICKUP"
              ? "border-primary bg-primary-light"
              : "border-border hover:border-primary/50"
          }`}
        >
          <Store className="w-6 h-6 text-primary" />
          <span className="font-medium text-sm">Store Pickup</span>
          <span className="text-xs text-muted">Free</span>
        </button>

        <button
          type="button"
          onClick={() => setMethod("DELIVERY")}
          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${
            method === "DELIVERY"
              ? "border-primary bg-primary-light"
              : "border-border hover:border-primary/50"
          }`}
        >
          <Truck className="w-6 h-6 text-primary" />
          <span className="font-medium text-sm">Home Delivery</span>
          <span className="text-xs text-muted">
            {distanceKm !== null ? `KES ${deliveryFee.toLocaleString()}` : "Fee varies"}
          </span>
        </button>
      </div>

      {method === "DELIVERY" && (
        <div className="space-y-4">
          <div>
            <label className="block font-medium text-primary mb-1">Delivery Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted" />
              <textarea
                value={address}
                onChange={(e) => handleAddressChange(e.target.value)}
                placeholder="Enter your delivery address anywhere in Kenya"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                rows={2}
              />
            </div>
            {geocoding && (
              <p className="text-xs text-muted mt-1">Finding location...</p>
            )}
          </div>

          <div>
            <label className="block font-medium text-primary mb-1">Select Location on Map</label>
            <p className="text-xs text-muted mb-2">
              Click on the map to set your exact delivery location
            </p>
            <DeliveryMap
              latitude={latitude}
              longitude={longitude}
              onLocationChange={handleMapClick}
            />
          </div>

          {loading && (
            <p className="text-sm text-muted">Calculating delivery fee...</p>
          )}

          {!loading && distanceKm !== null && (
            <div className="bg-background rounded-lg p-3 text-sm">
              <p className="text-muted">
                Distance: <span className="font-semibold text-text">{distanceKm} km</span>
              </p>
              <p className="text-muted">
                Delivery fee: <span className="font-semibold text-text">KES {deliveryFee.toLocaleString()}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
