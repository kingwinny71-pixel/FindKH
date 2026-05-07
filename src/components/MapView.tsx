import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Item } from "@/src/types";
import { Link } from "react-router-dom";

// Fix for default marker icon in Leaflet + React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  items: Item[];
}

export default function MapView({ items }: MapViewProps) {
  // Center of Phnom Penh
  const center: [number, number] = [11.5564, 104.9282];

  const mapItems = items.filter(item => item.geopoint);

  return (
    <div className="h-[600px] w-full rounded-3xl overflow-hidden border border-gray-100 shadow-xl z-0">
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mapItems.map((item) => (
          <Marker 
            key={item.id} 
            position={[item.geopoint!.latitude, item.geopoint!.longitude]}
          >
            <Popup>
              <div className="p-1 min-w-[150px]">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full aspect-video object-cover rounded-lg mb-2"
                  referrerPolicy="no-referrer"
                />
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500 mb-2">{item.location}</p>
                <Link 
                  to={`/item/${item.id}`} 
                  className="text-xs font-bold text-primary hover:underline"
                >
                  View item
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
