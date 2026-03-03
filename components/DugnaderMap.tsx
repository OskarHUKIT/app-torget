'use client';

import { useMemo } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { type FeedItem } from '@/lib/mockFeed';

type DugnaderMapItem = FeedItem & { distanceKm?: number };

interface DugnaderMapProps {
  items: DugnaderMapItem[];
  center: { latitude: number; longitude: number } | null;
  onSelect: (id: string) => void;
}

const FALLBACK_CENTER = { lat: 59.9139, lng: 10.7522 }; // Oslo

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapViewportController({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  map.setView(center, 10);
  return null;
}

export default function DugnaderMap({ items, center, onSelect }: DugnaderMapProps) {
  const mapCenter = useMemo(
    () => (center ? { lat: center.latitude, lng: center.longitude } : FALLBACK_CENTER),
    [center]
  );

  return (
    <div className="h-[420px] overflow-hidden rounded-2xl border border-border shadow-card">
      <MapContainer center={mapCenter} zoom={10} className="h-full w-full" scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewportController center={mapCenter} />

        {center && (
          <>
            <Circle center={mapCenter} radius={10000} pathOptions={{ color: '#E93B8A', opacity: 0.5 }} />
            <Marker position={mapCenter}>
              <Popup>Du er her</Popup>
            </Marker>
          </>
        )}

        {items
          .filter((item) => item.latitude != null && item.longitude != null)
          .map((item) => (
            <Marker key={item.id} position={{ lat: item.latitude as number, lng: item.longitude as number }}>
              <Popup>
                <div className="space-y-1">
                  <p className="font-semibold">{item.title}</p>
                  {item.location_name && <p className="text-xs text-gray-600">{item.location_name}</p>}
                  {item.distanceKm != null && <p className="text-xs text-gray-600">{item.distanceKm.toFixed(1)} km unna</p>}
                  <button
                    onClick={() => onSelect(item.id)}
                    className="mt-1 rounded bg-nytti-pink px-2 py-1 text-xs font-semibold text-white"
                  >
                    Åpne
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}

