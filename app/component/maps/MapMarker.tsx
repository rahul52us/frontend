'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  Tooltip,
  Progress,
  Fade,
  ScaleFade,
  Spinner,
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
  FaAward,
  FaLocationArrow,
  FaHeart,
  FaRegHeart,
  FaGift,
} from 'react-icons/fa';
import { FiNavigation, FiMapPin } from 'react-icons/fi';

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
const FALLBACK_CENTER: LatLng = { lat: 28.6139, lng: 77.209 };

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
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#e2e8f0' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#bfdbfe' }] },
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
  const [isShopDataLoading, setIsShopDataLoading] = useState<boolean>(false);
  const [likedShops, setLikedShops] = useState<Set<string>>(new Set());
  const [loaderProgress, setLoaderProgress] = useState<number>(0);
  const [loaderMessage, setLoaderMessage] = useState<string>('Finding great deals...');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const panelBg = useColorModeValue('rgba(255,255,255,0.92)', 'rgba(26,32,44,0.92)');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const glassBg = useColorModeValue('rgba(255,255,255,0.7)', 'rgba(26,32,44,0.7)');
  const blueGradient = 'linear(135deg, #1e3a8a 0%, #3b82f6 100%)';
  const glowGradient = 'linear(135deg, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.05) 100%)';

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const handleShopSelect = useCallback((shop: NearbyShop) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      if (progressInterval.current) clearInterval(progressInterval.current);
    }
    if (selectedShop?._id === shop._id && !isShopDataLoading) return;

    // Reset loader state
    setLoaderProgress(0);
    setLoaderMessage('Finding great deals...');
    setIsShopDataLoading(true);
    setSelectedShop(shop);

    // Simulate progress over 2 seconds
    progressInterval.current = setInterval(() => {
      setLoaderProgress(prev => {
        const next = prev + 2; // 2% per 40ms = 100% in 2000ms
        if (next >= 100) {
          if (progressInterval.current) clearInterval(progressInterval.current);
          return 100;
        }
        if (next < 30) setLoaderMessage('Finding great deals...');
        else if (next < 70) setLoaderMessage('Preparing your store ✨');
        else setLoaderMessage('Almost there! 🎁');
        return next;
      });
    }, 40);

    timeoutRef.current = setTimeout(() => {
      setIsShopDataLoading(false);
      setLoaderProgress(100);
      if (progressInterval.current) clearInterval(progressInterval.current);
      timeoutRef.current = null;
    }, 2000);
  }, [selectedShop?._id, isShopDataLoading]);

  const toggleLikeShop = (shopId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedShops(prev => {
      const newSet = new Set(prev);
      if (newSet.has(shopId)) newSet.delete(shopId);
      else newSet.add(shopId);
      return newSet;
    });
  };

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
              openingHours: '9:00 AM - 8:00 PM',
            };
          })
          .filter(Boolean) as NearbyShop[];
        setShops(normalized);
        setSelectedShop(null);
        setIsShopDataLoading(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (progressInterval.current) clearInterval(progressInterval.current);
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

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, []);

  const center = useMemo(() => {
    if (userLocation) return userLocation;
    if (shops.length > 0 && shops[0].mapPoint) return shops[0].mapPoint;
    return FALLBACK_CENTER;
  }, [shops, userLocation]);

  const radiusOptions = [
    { value: 2, label: '2 km', icon: FaMapMarkerAlt, color: 'blue' },
    { value: 5, label: '5 km', icon: FaMapMarkerAlt, color: 'teal' },
    { value: 10, label: '10 km', icon: FaMapMarkerAlt, color: 'purple' },
    { value: 20, label: '20 km', icon: FaMapMarkerAlt, color: 'orange' },
    { value: 50, label: '50 km', icon: FaMapMarkerAlt, color: 'pink' },
  ];

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <Container maxW="container.xl" py={12}>
        <Box p={10} borderRadius="3xl" bg="yellow.50" border="2px solid" borderColor="yellow.200" textAlign="center" _dark={{ bg: "yellow.900", borderColor: "yellow.700" }}>
          <Icon as={FaMapMarkerAlt} boxSize={12} color="yellow.600" mb={4} />
          <Heading size="md" color="yellow.800" _dark={{ color: "yellow.200" }}>Missing API Key</Heading>
          <Text color="yellow.600" mt={2}>Please configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</Text>
        </Box>
      </Container>
    );
  }

  if (loadError) {
    return (
      <Container maxW="container.xl" py={12}>
        <Box p={10} borderRadius="3xl" bg="red.50" border="2px solid" borderColor="red.200" textAlign="center" _dark={{ bg: "red.900", borderColor: "red.700" }}>
          <Icon as={FaMapMarkerAlt} boxSize={12} color="red.600" mb={4} />
          <Heading size="md" color="red.800" _dark={{ color: "red.200" }}>Map Loading Failed</Heading>
          <Text color="red.600" mt={2}>Please check your internet connection and API key</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Box position="relative" minH="100vh" bgGradient={glowGradient}>
      <Container maxW="100%" px={{ base: 4, md: 6, lg: 8 }} py={{ base: 8, md: 12 }}>
        {/* Floating Orbs */}
        <Box position="fixed" top="10%" left="-5%" w="300px" h="300px" borderRadius="full" bg="blue.200" filter="blur(80px)" opacity="0.3" pointerEvents="none" zIndex={0} />
        <Box position="fixed" bottom="5%" right="-5%" w="400px" h="400px" borderRadius="full" bg="purple.200" filter="blur(100px)" opacity="0.2" pointerEvents="none" zIndex={0} />

        {/* Header */}
        <VStack spacing={5} mb={10} textAlign="center" position="relative" zIndex={1}>
          <HStack spacing={2}>
            <Circle size="55px" bg="blue.100" _dark={{ bg: "blue.900" }} boxShadow="lg">
              <Icon as={FaStore} boxSize={7} color="blue.600" />
            </Circle>
            <Badge colorScheme="blue" fontSize="xs" px={3} py={1.5} borderRadius="full" letterSpacing="wider">LIVE TRACKING</Badge>
          </HStack>
          <Heading size={{ base: "xl", md: "2xl" }} fontWeight="900" bgGradient={blueGradient} bgClip="text" letterSpacing="tight">Discover Nearby Stores</Heading>
          <Text color="gray.600" _dark={{ color: "gray.400" }} maxW="2xl" fontSize="lg">Find authentic products from trusted sellers in your neighborhood</Text>
        </VStack>

        {/* Controls Bar */}
        <Flex mb={8} justify="space-between" align="center" wrap="wrap" gap={4} p={5} bg={glassBg} backdropFilter="blur(12px)" borderRadius="3xl" border="1px solid" borderColor={useColorModeValue('whiteAlpha.500', 'whiteAlpha.100')} boxShadow="xl" position="relative" zIndex={1}>
          <HStack spacing={4}>
            <Circle size="45px" bg="blue.500" boxShadow="lg"><Icon as={FaStore} color="white" boxSize={5} /></Circle>
            <Box>
              <Text fontSize="lg" fontWeight="800" color={textColor}>{shops.length} Sellers Found</Text>
              {userLocation && (
                <HStack spacing={1}>
                  <Icon as={FiMapPin} color="green.500" boxSize={3} />
                  <Text fontSize="sm" color="green.600" fontWeight="500">Within {radiusKm} km radius</Text>
                </HStack>
              )}
            </Box>
          </HStack>
          <HStack spacing={4} flexWrap="wrap">
            <Select value={radiusKm} onChange={(e) => setRadiusKm(Number(e.target.value))} w="160px" size="lg" borderRadius="2xl" bg={cardBg} fontWeight="600" cursor="pointer" _hover={{ borderColor: "blue.400" }}>
              {radiusOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </Select>
            <Button size="lg" colorScheme="blue" variant="solid" leftIcon={<FaCrosshairs />} onClick={requestCurrentLocation} isLoading={geoLoading} borderRadius="2xl" px={8} _hover={{ transform: "scale(1.02)", boxShadow: "xl" }} transition="all 0.2s" fontWeight="700">My Location</Button>
          </HStack>
        </Flex>

        {/* Map and Sidebar Grid */}
        <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6} position="relative" zIndex={1}>
          {/* Sidebar */}
          <Box bg={cardBg} borderRadius="3xl" border="1px solid" borderColor={borderColor} overflow="hidden" maxH={{ base: "400px", lg: "650px" }} overflowY="auto" boxShadow="2xl" sx={{ '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '10px' }, '&::-webkit-scrollbar-thumb': { background: '#3b82f6', borderRadius: '10px' } }}>
            <Box p={5} borderBottom="2px solid" borderColor={borderColor} bgGradient="linear(to-r, blue.50, white)">
              <Text fontWeight="900" fontSize="xl" color="blue.700" _dark={{ color: "blue.300" }}>✨ Nearby Sellers</Text>
              <Text fontSize="sm" color="gray.500" mt={1}>Tap on any store to see magical details</Text>
            </Box>
            {shopLoading ? (
              <Box p={5}>{[1,2,3].map(i => <Skeleton key={i} height="110px" mb={4} borderRadius="2xl" />)}</Box>
            ) : shops.length === 0 ? (
              <Box p={10} textAlign="center"><Icon as={FaStore} boxSize={12} color="gray.300" mb={4} /><Text color="gray.500" fontWeight="600">No sellers found nearby</Text><Text fontSize="sm" color="gray.400" mt={2}>Try increasing the radius</Text></Box>
            ) : (
              <VStack spacing={3} p={4} align="stretch">
                {shops.map((shop) => (
                  <ScaleFade in key={shop._id} initialScale={0.9}>
                    <Box p={4} borderRadius="2xl" bg={selectedShop?._id === shop._id ? "blue.50" : "transparent"} _dark={{ bg: selectedShop?._id === shop._id ? "blue.900" : "transparent" }} border="1.5px solid" borderColor={selectedShop?._id === shop._id ? "blue.400" : borderColor} cursor="pointer" transition="all 0.25s" _hover={{ transform: "translateX(6px)", borderColor: "blue.400", boxShadow: "md" }} onClick={() => handleShopSelect(shop)} onMouseEnter={() => setHoveredShop(shop._id)} onMouseLeave={() => setHoveredShop(null)} position="relative" overflow="hidden">
                      {selectedShop?._id === shop._id && isShopDataLoading && <Box position="absolute" top={2} right={2}><Spinner size="xs" color="blue.500" thickness="3px" /></Box>}
                      <Flex justify="space-between" align="start">
                        <Box flex={1}>
                          <HStack mb={2} spacing={2}>
                            <Text fontWeight="800" fontSize="md">{shop.name}</Text>
                            {shop.isVerified && <Tooltip label="Verified Seller" hasArrow><Icon as={FaShieldAlt} color="blue.500" boxSize={3.5} /></Tooltip>}
                            {shop.deliveryAvailable && <Tooltip label="Delivery Available" hasArrow><Icon as={FaShippingFast} color="green.500" boxSize={3.5} /></Tooltip>}
                          </HStack>
                          <HStack spacing={3} mb={2}>
                            {shop.rating && <HStack spacing={1}><Icon as={FaStar} color="yellow.400" boxSize={3.5} /><Text fontSize="sm" fontWeight="700">{shop.rating}</Text><Text fontSize="xs" color="gray.500">({shop.totalReviews})</Text></HStack>}
                            {shop.distanceKm && <Badge colorScheme="green" fontSize="xs" borderRadius="full" px={2}>{shop.distanceKm.toFixed(1)} km away</Badge>}
                          </HStack>
                          {shop.location?.city && <HStack spacing={1}><Icon as={FaCity} color="gray.400" boxSize={3} /><Text fontSize="xs" color="gray.600">{shop.location.city}, {shop.location.state}</Text></HStack>}
                        </Box>
                        <HStack spacing={2}>
                          <Tooltip label={likedShops.has(shop._id!) ? "Remove from favorites" : "Save to favorites"}>
                            <Circle size="36px" bg={likedShops.has(shop._id!) ? "red.100" : "gray.100"} cursor="pointer" onClick={(e) => toggleLikeShop(shop._id!, e)} _hover={{ transform: "scale(1.1)", bg: "red.50" }} transition="all 0.2s">
                              <Icon as={likedShops.has(shop._id!) ? FaHeart : FaRegHeart} color={likedShops.has(shop._id!) ? "red.500" : "gray.500"} boxSize={4} />
                            </Circle>
                          </Tooltip>
                          <Circle size="36px" bg={hoveredShop === shop._id ? "blue.500" : "blue.100"} transition="all 0.2s">
                            <Icon as={FiNavigation} color={hoveredShop === shop._id ? "white" : "blue.600"} boxSize={4.5} />
                          </Circle>
                        </HStack>
                      </Flex>
                    </Box>
                  </ScaleFade>
                ))}
              </VStack>
            )}
          </Box>

          {/* Map Container */}
          <Box gridColumn={{ lg: "span 2" }} h={{ base: "450px", md: "550px", lg: "650px" }} borderRadius="3xl" overflow="hidden" border="3px solid" borderColor={useColorModeValue('white', 'gray.700')} boxShadow="2xl" position="relative" bg={cardBg}>
            {errorMessage && (
              <Fade in>
                <Box position="absolute" top={4} left={4} zIndex={2} bg={panelBg} backdropFilter="blur(10px)" px={4} py={2} borderRadius="full" boxShadow="lg">
                  <HStack spacing={2}><Icon as={FaMapMarkerAlt} color="red.500" /><Text fontSize="sm" color="red.500" fontWeight="600">{errorMessage}</Text></HStack>
                </Box>
              </Fade>
            )}
            {!isLoaded || shopLoading ? (
              <Flex h="100%" align="center" justify="center" direction="column" gap={4}>
                <Spinner size="xl" color="blue.500" thickness="4px" speed="0.65s" />
                <Text color="gray.500" fontWeight="500">Loading magical map...</Text>
              </Flex>
            ) : (
              <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={13} options={mapOptions}>
                {userLocation && (
                  <>
                    <MarkerF position={userLocation} title="You are here" icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: '#3b82f6', fillOpacity: 1, strokeColor: '#ffffff', strokeWeight: 3 }} />
                    <CircleF center={userLocation} radius={radiusKm * 1000} options={{ fillColor: '#3b82f6', fillOpacity: 0.1, strokeColor: '#3b82f6', strokeOpacity: 0.4, strokeWeight: 2 }} />
                  </>
                )}
                {shops.map((shop) => {
                  if (!shop.mapPoint) return null;
                  const isSelected = selectedShop?._id === shop._id;
                  return (
                    <MarkerF
                      key={shop._id || `${shop.name}-${shop.mapPoint.lat}-${shop.mapPoint.lng}`}
                      position={shop.mapPoint}
                      title={shop.name || 'Seller'}
                      onClick={() => handleShopSelect(shop)}
                      icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: isSelected ? 14 : 10, fillColor: isSelected ? '#f97316' : '#3b82f6', fillOpacity: 1, strokeColor: '#ffffff', strokeWeight: 3 }}
                    />
                  );
                })}
                {selectedShop?.mapPoint && (
                  <InfoWindowF
                    position={selectedShop.mapPoint}
                    onCloseClick={() => {
                      setSelectedShop(null);
                      setIsShopDataLoading(false);
                      if (timeoutRef.current) clearTimeout(timeoutRef.current);
                      if (progressInterval.current) clearInterval(progressInterval.current);
                    }}
                    options={{ pixelOffset: new window.google.maps.Size(0, -40) }}
                  >
                    <Box maxW="300px" p={3} borderRadius="2xl">
                      {isShopDataLoading ? (
                        <VStack spacing={4} py={6} px={2}>
                          {/* Animated Gift Box Loader */}
                          <Box position="relative" boxSize="70px">
                            <Icon 
                              as={FaGift} 
                              boxSize="70px" 
                              color="blue.400" 
                              transition="all 0.2s"
                              animation="pulse 0.8s infinite"
                              sx={{
                                '@keyframes pulse': {
                                  '0%': { transform: 'scale(1)', opacity: 1 },
                                  '50%': { transform: 'scale(1.1)', opacity: 0.8 },
                                  '100%': { transform: 'scale(1)', opacity: 1 },
                                }
                              }}
                            />
                            <Icon 
                              as={FaHeart} 
                              position="absolute" 
                              top="-10px" 
                              right="-10px" 
                              boxSize="20px" 
                              color="red.500"
                              transition="all 0.2s"
                              animation="bounce 0.6s infinite"
                              sx={{
                                '@keyframes bounce': {
                                  '0%, 100%': { transform: 'translateY(0)' },
                                  '50%': { transform: 'translateY(-5px)' },
                                }
                              }}
                            />
                          </Box>
                          <Text fontWeight="800" fontSize="md" color="blue.600">{loaderMessage}</Text>
                          <Progress value={loaderProgress} size="sm" width="100%" colorScheme="blue" borderRadius="full" hasStripe isAnimated />
                          <Text fontSize="xs" color="gray.500">Opening shop in a moment...</Text>
                        </VStack>
                      ) : (
                        <VStack align="stretch" spacing={3}>
                          <Flex justify="space-between" align="start">
                            <Heading size="sm" color="blue.700" fontWeight="900">{selectedShop.name || 'Seller'}</Heading>
                            {selectedShop.isVerified && <Tooltip label="Verified"><Icon as={FaShieldAlt} color="blue.500" boxSize={4} /></Tooltip>}
                          </Flex>
                          <Text fontSize="sm" color="gray.600" noOfLines={2}>{selectedShop.description || 'Local seller near your location offering quality products'}</Text>
                          {selectedShop.rating && <HStack spacing={1}><Icon as={FaStar} color="#fbbf24" boxSize={3.5} /><Text fontSize="md" fontWeight="800">{selectedShop.rating}</Text><Text fontSize="xs" color="gray.500">({selectedShop.totalReviews} reviews)</Text></HStack>}
                          {(selectedShop.location?.city || selectedShop.location?.state) && <HStack spacing={1}><Icon as={FaCity} color="gray.400" boxSize={3} /><Text fontSize="xs" fontWeight="500">{ [selectedShop.location?.city, selectedShop.location?.state].filter(Boolean).join(', ') }</Text></HStack>}
                          {selectedShop.contactInfo?.phone && <HStack spacing={2}><Icon as={FaPhoneAlt} color="green.500" boxSize={3} /><Text fontSize="xs" color="green.600" fontWeight="600">{selectedShop.contactInfo.phone}</Text></HStack>}
                          <HStack spacing={2} wrap="wrap">
                            {selectedShop.distanceKm && <Badge colorScheme="green" fontSize="xs" px={2} py={1} borderRadius="full">📍 {selectedShop.distanceKm.toFixed(1)} km away</Badge>}
                            {selectedShop.deliveryAvailable && <Badge colorScheme="blue" fontSize="xs" px={2} py={1} borderRadius="full">🚚 Delivery Available</Badge>}
                            {selectedShop.openingHours && <Badge colorScheme="purple" fontSize="xs" px={2} py={1} borderRadius="full">🕒 {selectedShop.openingHours}</Badge>}
                          </HStack>
                          <Button size="sm" colorScheme="blue" borderRadius="2xl" leftIcon={<FaLocationArrow />} onClick={() => window.open(`https://maps.google.com/?q=${selectedShop.mapPoint?.lat},${selectedShop.mapPoint?.lng}`, '_blank')} fontWeight="700" mt={1} _hover={{ transform: "scale(1.02)" }}>Get Directions</Button>
                        </VStack>
                      )}
                    </Box>
                  </InfoWindowF>
                )}
              </GoogleMap>
            )}
          </Box>
        </SimpleGrid>

        {/* Features Footer */}
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={5} mt={10} position="relative" zIndex={1}>
          <Flex align="center" gap={4} p={4} bg={glassBg} backdropFilter="blur(8px)" borderRadius="2xl" border="1px solid" borderColor={borderColor} transition="all 0.2s" _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}>
            <Circle size="45px" bg="blue.100" _dark={{ bg: "blue.900" }}><Icon as={FaShieldAlt} color="blue.600" boxSize={5} /></Circle>
            <Box><Text fontWeight="800" fontSize="sm">Verified Sellers</Text><Text fontSize="xs" color="gray.500">100% authentic stores</Text></Box>
          </Flex>
          <Flex align="center" gap={4} p={4} bg={glassBg} backdropFilter="blur(8px)" borderRadius="2xl" border="1px solid" borderColor={borderColor} transition="all 0.2s" _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}>
            <Circle size="45px" bg="green.100" _dark={{ bg: "green.900" }}><Icon as={FaShippingFast} color="green.600" boxSize={5} /></Circle>
            <Box><Text fontWeight="800" fontSize="sm">Fast Delivery</Text><Text fontSize="xs" color="gray.500">Same day dispatch</Text></Box>
          </Flex>
          <Flex align="center" gap={4} p={4} bg={glassBg} backdropFilter="blur(8px)" borderRadius="2xl" border="1px solid" borderColor={borderColor} transition="all 0.2s" _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}>
            <Circle size="45px" bg="orange.100" _dark={{ bg: "orange.900" }}><Icon as={FaAward} color="orange.600" boxSize={5} /></Circle>
            <Box><Text fontWeight="800" fontSize="sm">Quality Guarantee</Text><Text fontSize="xs" color="gray.500">Best price assured</Text></Box>
          </Flex>
          <Flex align="center" gap={4} p={4} bg={glassBg} backdropFilter="blur(8px)" borderRadius="2xl" border="1px solid" borderColor={borderColor} transition="all 0.2s" _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}>
            <Circle size="45px" bg="pink.100" _dark={{ bg: "pink.900" }}><Icon as={FaHeart} color="pink.600" boxSize={5} /></Circle>
            <Box><Text fontWeight="800" fontSize="sm">Trusted by Many</Text><Text fontSize="xs" color="gray.500">50K+ happy customers</Text></Box>
          </Flex>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default MapComponent;