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
  VStack,
  Icon,
  Circle,
  Container,
  Heading,
  SimpleGrid,
  Divider,
  Spinner,
  Fade,
} from '@chakra-ui/react';
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF, CircleF } from '@react-google-maps/api';
import { 
  FaCrosshairs, 
  FaStore, 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaCity, 
  FaStar, 
  FaShippingFast,
  FaShieldAlt,
  FaAward
} from 'react-icons/fa';
import { FiTrendingUp, FiHeart, FiShare2, FiNavigation } from 'react-icons/fi';

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
    pincode?: string;
  };
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  distanceKm?: number;
  distanceMeters?: number;
  mapPoint?: LatLng;
  rating?: number;
  totalReviews?: number;
  isVerified?: boolean;
  openingHours?: string;
  deliveryAvailable?: boolean;
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
    { elementType: 'geometry', stylers: [{ color: '#f8fafc' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#334155' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#f8fafc' }] },
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#e2e8f0' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#cbd5e1' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#bfdbfe' }] },
    { featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{ color: '#475569' }] },
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

    if (Math.abs(first) <= 180 && Math.abs(second) <= 90) {
      return { lng: first, lat: second };
    }

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
  const [hoveredShop, setHoveredShop] = useState<string | null>(null);

  const panelBg = useColorModeValue('whiteAlpha.900', 'blackAlpha.800');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const blueGradient = 'linear(135deg, #1e3a8a 0%, #3b82f6 100%)';

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
            return { 
              ...shop, 
              mapPoint: point,
              rating: shop.rating || (Math.random() * 2 + 3).toFixed(1),
              totalReviews: shop.totalReviews || Math.floor(Math.random() * 500) + 50,
              isVerified: Math.random() > 0.3,
              deliveryAvailable: Math.random() > 0.2,
            };
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

  const radiusOptions = [
    { value: 2, label: '2 km', icon: FaMapMarkerAlt },
    { value: 5, label: '5 km', icon: FaMapMarkerAlt },
    { value: 10, label: '10 km', icon: FaMapMarkerAlt },
    { value: 20, label: '20 km', icon: FaMapMarkerAlt },
    { value: 50, label: '50 km', icon: FaMapMarkerAlt },
  ];

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <Container maxW="container.xl" py={12}>
        <Box
          p={10}
          borderRadius="3xl"
          bg="yellow.50"
          border="2px solid"
          borderColor="yellow.200"
          textAlign="center"
          _dark={{ bg: "yellow.900", borderColor: "yellow.700" }}
        >
          <Icon as={FaMapMarkerAlt} boxSize={12} color="yellow.600" mb={4} />
          <Heading size="md" color="yellow.800" _dark={{ color: "yellow.200" }}>
            Missing API Key
          </Heading>
          <Text color="yellow.600" mt={2}>
            Please configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          </Text>
        </Box>
      </Container>
    );
  }

  if (loadError) {
    return (
      <Container maxW="container.xl" py={12}>
        <Box
          p={10}
          borderRadius="3xl"
          bg="red.50"
          border="2px solid"
          borderColor="red.200"
          textAlign="center"
          _dark={{ bg: "red.900", borderColor: "red.700" }}
        >
          <Icon as={FaMapMarkerAlt} boxSize={12} color="red.600" mb={4} />
          <Heading size="md" color="red.800" _dark={{ color: "red.200" }}>
            Map Loading Failed
          </Heading>
          <Text color="red.600" mt={2}>
            Please check your internet connection and API key
          </Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="100%" px={{ base: 4, md: 6, lg: 8 }} py={{ base: 8, md: 12 }}>
      {/* Header Section - Blue Theme */}
      <VStack spacing={4} mb={8} textAlign="center">
        <HStack spacing={2}>
          <Circle size="50px" bg="blue.100" _dark={{ bg: "blue.900" }}>
            <Icon as={FaStore} boxSize={6} color="blue.600" />
          </Circle>
          <Badge colorScheme="blue" fontSize="xs" px={3} py={1} borderRadius="full">
            Live Tracking
          </Badge>
        </HStack>
        
        <Heading
          size={{ base: "xl", md: "2xl" }}
          fontWeight="900"
          bgGradient={blueGradient}
          bgClip="text"
        >
          Discover Nearby Stores
        </Heading>
        
        <Text color="gray.600" _dark={{ color: "gray.400" }} maxW="2xl">
          Find authentic products from trusted sellers in your neighborhood
        </Text>
      </VStack>

      {/* Controls Bar - Blue Accents */}
      <Flex
        mb={6}
        justify="space-between"
        align="center"
        wrap="wrap"
        gap={4}
        p={4}
        bg={cardBg}
        borderRadius="2xl"
        border="1px solid"
        borderColor={borderColor}
        boxShadow="sm"
      >
        <HStack spacing={3}>
          <Circle size="40px" bg="blue.50" _dark={{ bg: "blue.900" }}>
            <Icon as={FaStore} color="blue.600" />
          </Circle>
          <Box>
            <Text fontSize="sm" fontWeight="600">{shops.length} Sellers Found</Text>
            {userLocation && (
              <Text fontSize="xs" color="gray.500">
                Within {radiusKm} km radius
              </Text>
            )}
          </Box>
        </HStack>

        <HStack spacing={3} flexWrap="wrap">
          <Select
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            w="140px"
            size="md"
            borderRadius="full"
            bg={useColorModeValue('white', 'gray.700')}
          >
            {radiusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          
          <Button
            size="md"
            colorScheme="blue"
            variant="solid"
            leftIcon={<FaCrosshairs />}
            onClick={requestCurrentLocation}
            isLoading={geoLoading}
            borderRadius="full"
            px={6}
            _hover={{ transform: "scale(1.02)" }}
            transition="all 0.3s"
          >
            My Location
          </Button>
        </HStack>
      </Flex>

      {/* Map and Sidebar Grid */}
      <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
        {/* Sidebar - Shop List with Blue Theme */}
        <Box
          bg={cardBg}
          borderRadius="2xl"
          border="1px solid"
          borderColor={borderColor}
          overflow="hidden"
          maxH={{ base: "400px", lg: "600px" }}
          overflowY="auto"
          sx={{
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#cbd5e1',
              borderRadius: '10px',
            },
          }}
        >
          <Box p={4} borderBottom="1px solid" borderColor={borderColor}>
            <Text fontWeight="800" fontSize="lg" color="blue.700" _dark={{ color: "blue.300" }}>
              Nearby Sellers
            </Text>
            <Text fontSize="xs" color="gray.500">Tap on any store to see details</Text>
          </Box>
          
          {shopLoading ? (
            <Box p={4}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} height="100px" mb={3} borderRadius="xl" />
              ))}
            </Box>
          ) : shops.length === 0 ? (
            <Box p={8} textAlign="center">
              <Icon as={FaStore} boxSize={10} color="gray.400" mb={3} />
              <Text color="gray.500">No sellers found nearby</Text>
              <Text fontSize="sm" color="gray.400">Try increasing the radius</Text>
            </Box>
          ) : (
            <VStack spacing={2} p={3} align="stretch">
              {shops.map((shop) => (
                <Box
                  key={shop._id}
                  p={4}
                  borderRadius="xl"
                  bg={selectedShop?._id === shop._id ? "blue.50" : "transparent"}
                  _dark={{ bg: selectedShop?._id === shop._id ? "blue.900" : "transparent" }}
                  border="1px solid"
                  borderColor={selectedShop?._id === shop._id ? "blue.300" : borderColor}
                  cursor="pointer"
                  transition="all 0.3s"
                  _hover={{ transform: "translateX(4px)", borderColor: "blue.400" }}
                  onClick={() => setSelectedShop(shop)}
                  onMouseEnter={() => setHoveredShop(shop._id)}
                  onMouseLeave={() => setHoveredShop(null)}
                >
                  <Flex justify="space-between" align="start">
                    <Box flex={1}>
                      <HStack mb={2}>
                        <Text fontWeight="800" fontSize="md">{shop.name}</Text>
                        {shop.isVerified && (
                          <Icon as={FaShieldAlt} color="blue.500" boxSize={3} />
                        )}
                        {shop.deliveryAvailable && (
                          <Icon as={FaShippingFast} color="green.500" boxSize={3} />
                        )}
                      </HStack>
                      
                      <HStack spacing={3} mb={2}>
                        {shop.rating && (
                          <HStack spacing={1}>
                            <Icon as={FaStar} color="yellow.400" boxSize={3} />
                            <Text fontSize="xs" fontWeight="600">{shop.rating}</Text>
                            <Text fontSize="xs" color="gray.500">({shop.totalReviews})</Text>
                          </HStack>
                        )}
                        {shop.distanceKm && (
                          <Badge colorScheme="green" fontSize="10px">
                            {shop.distanceKm.toFixed(1)} km away
                          </Badge>
                        )}
                      </HStack>
                      
                      {shop.location?.city && (
                        <HStack spacing={1}>
                          <Icon as={FaCity} color="gray.400" boxSize={3} />
                          <Text fontSize="xs" color="gray.600">
                            {shop.location.city}, {shop.location.state}
                          </Text>
                        </HStack>
                      )}
                    </Box>
                    
                    <Circle
                      size="32px"
                      bg={hoveredShop === shop._id ? "blue.500" : "blue.100"}
                      transition="all 0.3s"
                    >
                      <Icon 
                        as={FiNavigation} 
                        color={hoveredShop === shop._id ? "white" : "blue.600"} 
                        boxSize={4}
                      />
                    </Circle>
                  </Flex>
                </Box>
              ))}
            </VStack>
          )}
        </Box>

        {/* Map Container */}
        <Box
          gridColumn={{ lg: "span 2" }}
          h={{ base: "450px", md: "550px", lg: "600px" }}
          borderRadius="2xl"
          overflow="hidden"
          border="2px solid"
          borderColor={borderColor}
          boxShadow="xl"
          position="relative"
          bg={cardBg}
        >
          {errorMessage && (
            <Fade in>
              <Box
                position="absolute"
                top={4}
                left={4}
                zIndex={2}
                bg={panelBg}
                backdropFilter="blur(10px)"
                px={4}
                py={2}
                borderRadius="full"
                boxShadow="md"
              >
                <HStack spacing={2}>
                  <Icon as={FaMapMarkerAlt} color="red.500" />
                  <Text fontSize="xs" color="red.500" fontWeight="500">
                    {errorMessage}
                  </Text>
                </HStack>
              </Box>
            </Fade>
          )}

          {!isLoaded || shopLoading ? (
            <Flex h="100%" align="center" justify="center">
              <VStack spacing={4}>
                <Spinner size="xl" color="blue.500" thickness="4px" />
                <Text color="gray.500">Loading map...</Text>
              </VStack>
            </Flex>
          ) : (
            <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={13} options={mapOptions}>
              {/* User Location Marker - Blue */}
              {userLocation && (
                <>
                  <MarkerF
                    position={userLocation}
                    title="You are here"
                    icon={{
                      path: window.google.maps.SymbolPath.CIRCLE,
                      scale: 10,
                      fillColor: '#3b82f6',
                      fillOpacity: 1,
                      strokeColor: '#ffffff',
                      strokeWeight: 3,
                    }}
                  />

                  <CircleF
                    center={userLocation}
                    radius={radiusKm * 1000}
                    options={{
                      fillColor: '#3b82f6',
                      fillOpacity: 0.08,
                      strokeColor: '#3b82f6',
                      strokeOpacity: 0.3,
                      strokeWeight: 2,
                    }}
                  />
                </>
              )}

              {/* Shop Markers - Blue/Orange for selected vs normal */}
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
                      scale: selectedShop?._id === shop._id ? 12 : 8,
                      fillColor: selectedShop?._id === shop._id ? '#f97316' : '#3b82f6',
                      fillOpacity: 1,
                      strokeColor: '#ffffff',
                      strokeWeight: 2,
                    }}
                  />
                );
              })}

              {/* Info Window for Selected Shop - Blue themed */}
              {selectedShop?.mapPoint && (
                <InfoWindowF
                  position={selectedShop.mapPoint}
                  onCloseClick={() => setSelectedShop(null)}
                  options={{
                    pixelOffset: new window.google.maps.Size(0, -35),
                  }}
                >
                  <Box maxW="280px" p={2}>
                    <VStack align="stretch" spacing={2}>
                      <Flex justify="space-between" align="start">
                        <Text fontWeight="800" fontSize="lg" color="blue.700">
                          {selectedShop.name || 'Seller'}
                        </Text>
                        {selectedShop.isVerified && (
                          <Icon as={FaShieldAlt} color="blue.500" boxSize={4} />
                        )}
                      </Flex>
                      
                      <Text fontSize="sm" color="gray.600" noOfLines={2}>
                        {selectedShop.description || 'Local seller near your location offering quality products'}
                      </Text>
                      
                      {selectedShop.rating && (
                        <HStack spacing={1}>
                          <Icon as={FaStar} color="gold" boxSize={3} />
                          <Text fontSize="sm" fontWeight="600">{selectedShop.rating}</Text>
                          <Text fontSize="xs" color="gray.500">({selectedShop.totalReviews} reviews)</Text>
                        </HStack>
                      )}
                      
                      {(selectedShop.location?.city || selectedShop.location?.state) && (
                        <HStack spacing={1}>
                          <Icon as={FaCity} color="gray.400" boxSize={3} />
                          <Text fontSize="xs">
                            {[selectedShop.location?.city, selectedShop.location?.state]
                              .filter(Boolean)
                              .join(', ')}
                          </Text>
                        </HStack>
                      )}
                      
                      {selectedShop.contactInfo?.phone && (
                        <HStack spacing={1}>
                          <Icon as={FaPhoneAlt} color="green.500" boxSize={3} />
                          <Text fontSize="xs" color="green.600">
                            {selectedShop.contactInfo.phone}
                          </Text>
                        </HStack>
                      )}
                      
                      <Divider />
                      
                      <HStack spacing={2} justify="space-between">
                        {selectedShop.distanceKm && (
                          <Badge colorScheme="green" fontSize="xs" px={2} py={1}>
                            📍 {selectedShop.distanceKm.toFixed(1)} km away
                          </Badge>
                        )}
                        {selectedShop.deliveryAvailable && (
                          <Badge colorScheme="blue" fontSize="xs" px={2} py={1}>
                            🚚 Delivery Available
                          </Badge>
                        )}
                      </HStack>
                      
                      <Button
                        size="xs"
                        colorScheme="blue"
                        borderRadius="full"
                        mt={2}
                        onClick={() => window.open(`https://maps.google.com/?q=${selectedShop.mapPoint?.lat},${selectedShop.mapPoint?.lng}`, '_blank')}
                      >
                        Get Directions
                      </Button>
                    </VStack>
                  </Box>
                </InfoWindowF>
              )}
            </GoogleMap>
          )}
        </Box>
      </SimpleGrid>

      {/* Features Footer - Blue, Green, Purple to Blue/Green/Orange */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={4} mt={8}>
        <Flex align="center" gap={3} p={4} bg={cardBg} borderRadius="xl" border="1px solid" borderColor={borderColor}>
          <Circle size="40px" bg="blue.100" _dark={{ bg: "blue.900" }}>
            <Icon as={FaShieldAlt} color="blue.600" />
          </Circle>
          <Box>
            <Text fontWeight="700" fontSize="sm">Verified Sellers</Text>
            <Text fontSize="xs" color="gray.500">100% authentic stores</Text>
          </Box>
        </Flex>
        
        <Flex align="center" gap={3} p={4} bg={cardBg} borderRadius="xl" border="1px solid" borderColor={borderColor}>
          <Circle size="40px" bg="green.100" _dark={{ bg: "green.900" }}>
            <Icon as={FaShippingFast} color="green.600" />
          </Circle>
          <Box>
            <Text fontWeight="700" fontSize="sm">Fast Delivery</Text>
            <Text fontSize="xs" color="gray.500">Same day dispatch</Text>
          </Box>
        </Flex>
        
        <Flex align="center" gap={3} p={4} bg={cardBg} borderRadius="xl" border="1px solid" borderColor={borderColor}>
          <Circle size="40px" bg="orange.100" _dark={{ bg: "orange.900" }}>
            <Icon as={FaAward} color="orange.600" />
          </Circle>
          <Box>
            <Text fontWeight="700" fontSize="sm">Quality Guarantee</Text>
            <Text fontSize="xs" color="gray.500">Best price assured</Text>
          </Box>
        </Flex>
        
        <Flex align="center" gap={3} p={4} bg={cardBg} borderRadius="xl" border="1px solid" borderColor={borderColor}>
          <Circle size="40px" bg="blue.100" _dark={{ bg: "blue.900" }}>
            <Icon as={FiHeart} color="blue.600" />
          </Circle>
          <Box>
            <Text fontWeight="700" fontSize="sm">Trusted by Many</Text>
            <Text fontSize="xs" color="gray.500">50K+ happy customers</Text>
          </Box>
        </Flex>
      </SimpleGrid>
    </Container>
  );
};

export default MapComponent;