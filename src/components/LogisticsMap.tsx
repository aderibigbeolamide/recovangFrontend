import React, { useMemo } from "react";
import { GoogleMap, useLoadScript, Marker, Polyline } from "@react-google-maps/api";
import { Truck, MapPin } from "lucide-react";

interface LogisticsMapProps {
  routes: any[];
  hubs: any[];
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 6.5244, // Lagos
  lng: 3.3792,
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    {
      featureType: "all",
      elementType: "labels.text.fill",
      color: "#616161",
    },
    {
      featureType: "water",
      elementType: "geometry",
      color: "#e9e9e9",
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      color: "#f5f5f5",
    },
  ],
};

export function LogisticsMap({ routes, hubs }: LogisticsMapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  if (loadError) return <div className="h-[400px] bg-red-50 flex items-center justify-center text-error text-xs font-bold">Error loading maps</div>;
  if (!isLoaded) return <div className="h-[400px] bg-cream/20 animate-pulse flex items-center justify-center text-textgray text-xs">Initializing Satellite Link...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={11}
      center={center}
      options={options}
    >
      {/* Render Hubs */}
      {hubs.map((hub) => (
        <Marker
          key={hub.id}
          position={{ lat: Number(hub.lat) || 6.5, lng: Number(hub.lng) || 3.3 }}
          icon={{
            url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
          }}
          title={hub.name}
        />
      ))}

      {/* Render Active Trucks */}
      {routes.map((route) => (
        <React.Fragment key={route.id}>
          {route.partner?.currentLat && route.partner?.currentLng && (
            <Marker
              position={{ lat: Number(route.partner.currentLat), lng: Number(route.partner.currentLng) }}
              icon={{
                path: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",
                fillColor: "#1A6B3C",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#FFFFFF",
                scale: 1.5,
              }}
              title={`${route.partner.user?.firstName}'s Truck`}
            />
          )}
          
          {/* Path from Hub to Truck (Current Position) */}
          {route.hub && route.partner?.currentLat && (
            <Polyline
              path={[
                { lat: Number(route.hub.lat) || 6.5, lng: Number(route.hub.lng) || 3.3 },
                { lat: Number(route.partner.currentLat), lng: Number(route.partner.currentLng) }
              ]}
              options={{
                strokeColor: "#1A6B3C",
                strokeOpacity: 0.6,
                strokeWeight: 3,
                icons: [{
                  icon: { path: "M 0,-1 0,1", strokeOpacity: 1, scale: 4 },
                  offset: "0",
                  repeat: "20px"
                }]
              }}
            />
          )}
        </React.Fragment>
      ))}
    </GoogleMap>
  );
}
