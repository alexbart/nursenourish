import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface DeliveryMapProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  onAddressResolved?: (address: string) => void;
}

function LocationMarker({ latitude, longitude, onLocationChange, onAddressResolved }: DeliveryMapProps) {
  const map = useMap();

  useEffect(() => {
    map.setView([latitude, longitude], 13);
  }, [latitude, longitude, map]);

  useEffect(() => {
    const handleClick = async (e: L.LeafletMouseEvent) => {
      onLocationChange(e.latlng.lat, e.latlng.lng);
      if (onAddressResolved) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`,
            {
              headers: {
                "User-Agent": "NurseNourish/1.0 (contact@nursenourish.co.ke)",
              },
            }
          );
          const data = await response.json();
          if (data.display_name) {
            onAddressResolved(data.display_name);
          }
        } catch {
          // ignore reverse geocoding errors
        }
      }
    };

    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map, onLocationChange, onAddressResolved]);

  return (
    <Marker position={[latitude, longitude]} icon={defaultIcon}>
      <Popup>Delivery location</Popup>
    </Marker>
  );
}

export function DeliveryMap({ latitude, longitude, onLocationChange, onAddressResolved }: DeliveryMapProps) {
  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-border">
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          latitude={latitude}
          longitude={longitude}
          onLocationChange={onLocationChange}
          onAddressResolved={onAddressResolved}
        />
      </MapContainer>
    </div>
  );
}
