'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
  CircleF,
} from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCDxsmAEYAzhJGC4TsnnFzisFFa14ZSt8c';

const mapContainerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 6px 24px rgba(0,0,0,0.1)',
  border: '1px solid #e0e0e0',
};

const sampleShops = [
  {
    id: 1,
    name: 'Rahul Kirana',
    lat: 18.6290,
    lng: 73.7997,
    address: 'Shop No. 5, Near Railway Station, Pimpri',
    url: 'https://businesssahayata.com/shop1',
  },
  {
    id: 2,
    name: 'Pimpri General Store',
    lat: 18.6255,
    lng: 73.8050,
    address: 'Main Market Road, Pimpri',
    url: 'https://businesssahayata.com/shop2',
  },
  // Add more shops here
];

const MapComponent = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedShop, setSelectedShop] = useState<(typeof sampleShops)[number] | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('Geolocation denied or unavailable, using default location:', error.message);
          setUserLocation({ lat: 18.6290, lng: 73.7997 });
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      setUserLocation({ lat: 18.6290, lng: 73.7997 });
    }
  }, []);

  const center = useMemo(
    () => userLocation || { lat: 18.6290, lng: 73.7997 },
    [userLocation]
  );

  if (loadError) {
    return (
      <div style={{
        height: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffebee',
        color: '#c62828',
        borderRadius: '12px',
        fontWeight: 500,
      }}>
        Failed to load Google Maps. Check API key / internet.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div style={{
        height: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f7fa',
        borderRadius: '12px',
        color: '#555',
        fontSize: '18px',
      }}>
        Loading map...
      </div>
    );
  }

  const nearbyShops = sampleShops.filter((shop) => {
    if (!userLocation) return false;
    const distance = getDistanceInKm(
      userLocation.lat,
      userLocation.lng,
      shop.lat,
      shop.lng
    );
    return distance <= 2;
  });

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={13.8}
      options={{
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
        gestureHandling: 'greedy',
      }}
    >
      {userLocation && (
        <>
          <MarkerF
            position={userLocation}
            icon={{
              url: 'https://maps.gstatic.com/mapfiles/ms2/micons/man.png',
              scaledSize: new window.google.maps.Size(44, 44),
              anchor: new window.google.maps.Point(22, 44),
            }}
            title="You are here"
          />

          <CircleF
            center={userLocation}
            radius={2000}
            options={{
              fillColor: '#1976d2',
              fillOpacity: 0.07,
              strokeColor: '#1976d2',
              strokeOpacity: 0.5,
              strokeWeight: 2,
            }}
          />
        </>
      )}

      {nearbyShops.map((shop) => (
        <MarkerF
          key={shop.id}
          position={{ lat: shop.lat, lng: shop.lng }}
          title={shop.name}
          icon={{
            url: 'https://img.icons8.com/fluency/96/shopping-bag.png',
            scaledSize: new window.google.maps.Size(
              selectedShop?.id === shop.id ? 52 : 44,
              selectedShop?.id === shop.id ? 52 : 44
            ),
            anchor: new window.google.maps.Point(26, 52),
          }}
          zIndex={selectedShop?.id === shop.id ? 1000 : 10}
          onClick={() => window.open(shop.url, '_blank', 'noopener,noreferrer')}
          onMouseOver={() => setSelectedShop(shop)}
          onMouseOut={() => setSelectedShop(null)}
        />
      ))}

      {selectedShop && userLocation && (
        <InfoWindowF
          position={{ lat: selectedShop.lat, lng: selectedShop.lng }}
          onCloseClick={() => setSelectedShop(null)}
          options={{
            disableAutoPan: true,
            pixelOffset: new window.google.maps.Size(0, -55),
            maxWidth: 340,
          }}
        >
          <div
            style={{
              padding: '14px 16px',
              minWidth: '260px',
              maxWidth: '340px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
              lineHeight: '1.5',
            }}
          >
            <div style={{
              fontSize: '17px',
              fontWeight: 700,
              marginBottom: '6px',
              color: '#111',
            }}>
              {selectedShop.name}
            </div>

            <div style={{
              fontSize: '13.5px',
              color: '#555',
              marginBottom: '8px',
            }}>
              {getDistanceInKm(
                userLocation.lat,
                userLocation.lng,
                selectedShop.lat,
                selectedShop.lng
              ).toFixed(1)} km • {selectedShop.address}
            </div>

            <a
              href={selectedShop.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#1976d2',
                fontWeight: 600,
                fontSize: '14.5px',
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: '#e3f2fd',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#bbdefb'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#e3f2fd'; }}
            >
              View Shop Page →
            </a>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
};

function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default MapComponent;