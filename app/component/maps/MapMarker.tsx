'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Select,
  Skeleton,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF, CircleF } from '@react-google-maps/api';
import { FaCrosshairs } from 'react-icons/fa';

type LatLng = { lat: number; lng: number };

type NearbyShop = {
  _id?: string;
  name?: string;
  description?: string;
  location?: {
    coordinates?: any;
    address?: string;
    city?: string;
    state?: string;
  };
  contactInfo?: {
    phone?: string;
  };
  distanceKm?: number;
  distanceMeters?: number;
  mapPoint?: LatLng;
};

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '');
const FALLBACK_CENTER: LatLng = { lat: 28.6139, lng: 77.209 }; // Delhi

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  fullscreenControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  gestureHandling: 'greedy',
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#f4f6fb' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#374151' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#f4f6fb' }] },
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#dbe3f0' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c7dcff' }] },
  ],
};

const safeNumber = (value: any) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeCoordinates = (coordinates: any): LatLng | null => {
  if (Array.isArray(coordinates) && coordinates.length >= 2) {
    const first = safeNumber(coordinates[0]);
    const second = safeNumber(coordinates[1]);
    if (first === null || second === null) return null;

    // Preferred order: [lng, lat]
    if (Math.abs(first) <= 180 && Math.abs(second) <= 90) {
      return { lng: first, lat: second };
    }

    // Legacy/reversed data fallback: [lat, lng]
    if (Math.abs(first) <= 90 && Math.abs(second) <= 180) {
      return { lng: second, lat: first };
    }
    return null;
  }

  if (typeof coordinates === 'string') {
    const parts = coordinates.split(/[,\s]+/).filter(Boolean);
    if (parts.length < 2) return null;
    return normalizeCoordinates([parts[0], parts[1]]);
  }

  return null;
};

const buildCompanyEndpoint = () => {
  if (BACKEND_URL) return `${BACKEND_URL}/company`;
  return '/company';
};

const MapComponent = () => {
  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [geoLoading, setGeoLoading] = useState<boolean>(false);
  const [shopLoading, setShopLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [shops, setShops] = useState<NearbyShop[]>([]);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [selectedShop, setSelectedShop] = useState<NearbyShop | null>(null);

  const panelBg = useColorModeValue('whiteAlpha.900', 'blackAlpha.700');
  const cardBg = useColorModeValue('white', 'gray.900');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const fetchShops = useCallback(
    async (location: LatLng | null, radius: number) => {
      setShopLoading(true);
      setErrorMessage('');

      try {
        const payload: any = { page: 1, limit: 50 };
        if (location) {
          payload.lat = location.lat;
          payload.lng = location.lng;
          payload.radiusKm = radius;
          payload.sortBy = 'distance';
        } else {
          payload.sortBy = 'latest';
        }

        const response = await fetch(buildCompanyEndpoint(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        const apiShops: NearbyShop[] = data?.data?.data || [];

        const normalized = apiShops
          .map((shop) => {
            const point = normalizeCoordinates(shop?.location?.coordinates);
            if (!point) return null;
            return { ...shop, mapPoint: point };
          })
          .filter(Boolean) as NearbyShop[];

        setShops(normalized);
      } catch (error: any) {
        setErrorMessage(error?.message || 'Unable to load nearby sellers.');
      } finally {
        setShopLoading(false);
      }
    },
    []
  );

  const requestCurrentLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setErrorMessage('Geolocation is not supported on this browser.');
      fetchShops(null, radiusKm);
      return;
    }

    setGeoLoading(true);
    setErrorMessage('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: Number(position.coords.latitude.toFixed(6)),
          lng: Number(position.coords.longitude.toFixed(6)),
        };
        setUserLocation(location);
        setGeoLoading(false);
        fetchShops(location, radiusKm);
      },
      (error) => {
        setGeoLoading(false);
        setErrorMessage(error.message || 'Location permission denied. Showing general sellers.');
        fetchShops(null, radiusKm);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [fetchShops, radiusKm]);

  useEffect(() => {
    requestCurrentLocation();
  }, [requestCurrentLocation]);

  useEffect(() => {
    if (userLocation) {
      fetchShops(userLocation, radiusKm);
    }
  }, [radiusKm, userLocation, fetchShops]);

  const center = useMemo(() => {
    if (userLocation) return userLocation;
    if (shops.length > 0 && shops[0].mapPoint) return shops[0].mapPoint;
    return FALLBACK_CENTER;
  }, [shops, userLocation]);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <Box
        my={12}
        mx="auto"
        maxW="90%"
        p={10}
        borderRadius="2xl"
        bg="yellow.50"
        border="1px solid"
        borderColor="yellow.200"
        textAlign="center"
      >
        <Text fontWeight="700" color="yellow.800">
          Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        </Text>
      </Box>
    );
  }

  if (loadError) {
    return (
      <Box
        my={12}
        mx="auto"
        maxW="90%"
        p={10}
        borderRadius="2xl"
        bg="red.50"
        border="1px solid"
        borderColor="red.200"
        textAlign="center"
      >
        <Text fontWeight="700" color="red.700">
          Failed to load Google Maps. Check API key / internet.
        </Text>
      </Box>
    );
  }

  return (
    <Box my={12} mx="auto" maxW="90%">
      <Flex mb={5} justify="space-between" align="center" wrap="wrap" gap={3}>
        <Box>
          <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="800" color="gray.800">
            Nearby Sellers
          </Text>
          <Text color="gray.500" fontSize="sm">
            Real-time seller discovery around the buyer location.
          </Text>
        </Box>
        <HStack spacing={3}>
          <Badge colorScheme="blue" px={3} py={1.5} borderRadius="full" fontSize="xs">
            {shops.length} sellers
          </Badge>
          <Select value={radiusKm} onChange={(e) => setRadiusKm(Number(e.target.value))} w="130px" size="sm">
            <option value={2}>2 km</option>
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={20}>20 km</option>
            <option value={50}>50 km</option>
          </Select>
          <Button
            size="sm"
            colorScheme="blue"
            variant="outline"
            leftIcon={<FaCrosshairs />}
            onClick={requestCurrentLocation}
            isLoading={geoLoading}
          >
            Use my location
          </Button>
        </HStack>
      </Flex>

      <Box
        h={{ base: '420px', md: '560px' }}
        borderRadius="2xl"
        overflow="hidden"
        border="1px solid"
        borderColor="gray.200"
        boxShadow="xl"
        position="relative"
        bg={cardBg}
      >
        {errorMessage ? (
          <Box position="absolute" top={3} left={3} zIndex={2} bg={panelBg} px={3} py={2} borderRadius="lg">
            <Text fontSize="xs" color="red.500">
              {errorMessage}
            </Text>
          </Box>
        ) : null}

        {!isLoaded || shopLoading ? (
          <Skeleton h="100%" w="100%" />
        ) : (
          <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={12.5} options={mapOptions}>
            {userLocation ? (
              <>
                <MarkerF
                  position={userLocation}
                  title="You are here"
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: '#2563eb',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 3,
                  }}
                />

                <CircleF
                  center={userLocation}
                  radius={radiusKm * 1000}
                  options={{
                    fillColor: '#2563eb',
                    fillOpacity: 0.08,
                    strokeColor: '#2563eb',
                    strokeOpacity: 0.4,
                    strokeWeight: 2,
                  }}
                />
              </>
            ) : null}

            {shops.map((shop) => {
              if (!shop.mapPoint) return null;
              return (
                <MarkerF
                  key={shop._id || `${shop.name}-${shop.mapPoint.lat}-${shop.mapPoint.lng}`}
                  position={shop.mapPoint}
                  title={shop.name || 'Seller'}
                  onClick={() => setSelectedShop(shop)}
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: selectedShop?._id === shop._id ? 10 : 7,
                    fillColor: '#f97316',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                  }}
                />
              );
            })}

            {selectedShop?.mapPoint ? (
              <InfoWindowF position={selectedShop.mapPoint} onCloseClick={() => setSelectedShop(null)}>
                <Box minW="220px" maxW="260px" p={1}>
                  <Text fontWeight="700" fontSize="sm">
                    {selectedShop.name || 'Seller'}
                  </Text>
                  <Text fontSize="xs" color="gray.500" noOfLines={2} mt={1}>
                    {selectedShop.description || 'Local seller near your location'}
                  </Text>
                  <Text fontSize="xs" mt={2}>
                    {(selectedShop.location?.city || '')}
                    {selectedShop.location?.city && selectedShop.location?.state ? ', ' : ''}
                    {selectedShop.location?.state || ''}
                  </Text>
                  <HStack mt={2} spacing={2}>
                    {typeof selectedShop.distanceKm === 'number' ? (
                      <Badge colorScheme="green">{selectedShop.distanceKm.toFixed(2)} km</Badge>
                    ) : null}
                    {selectedShop.contactInfo?.phone ? (
                      <Badge colorScheme="purple">{selectedShop.contactInfo.phone}</Badge>
                    ) : null}
                  </HStack>
                </Box>
              </InfoWindowF>
            ) : null}
          </GoogleMap>
        )}
      </Box>
    </Box>
  );
};

export default MapComponent;
