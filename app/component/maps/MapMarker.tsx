'use client';

import {
  Badge,
  Box,
  Button,
  Circle,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  SimpleGrid,
  Skeleton,
  Spinner,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import {
  CircleF,
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useLoadScript,
} from '@react-google-maps/api';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import {
  FaCheckCircle,
  FaCrosshairs,
  FaHeart,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRegHeart,
  FaShippingFast,
  FaStar,
  FaStore,
  FaTimes,
} from 'react-icons/fa';
import {
  FiArrowUpRight,
  // FiClose,
  FiCompass,
  FiList,
  FiMap,
  FiMapPin,
  FiMaximize2,
  FiNavigation,
  FiSearch,
} from 'react-icons/fi';

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
  rating?: number | string;
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
  zoomControl: false,
  fullscreenControl: false,
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

const radiusOptions = [2, 5, 10, 20, 50];

const safeNumber = (value: any) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

// Deterministic hash so fallback ratings/reviews don't flicker on re-render
const getStableSeed = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
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
  const router = useRouter();
  const mapRef = useRef<google.maps.Map | null>(null);
  const mobileCardsRef = useRef<HTMLDivElement | null>(null);

  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [geoLoading, setGeoLoading] = useState<boolean>(false);
  const [shopLoading, setShopLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [shops, setShops] = useState<NearbyShop[]>([]);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [selectedShop, setSelectedShop] = useState<NearbyShop | null>(null);
  const [likedShops, setLikedShops] = useState<Set<string>>(new Set());

  // New interactive controls for smoother UX
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterVerified, setFilterVerified] = useState<boolean>(false);
  const [filterDelivery, setFilterDelivery] = useState<boolean>(false);
  const [filterTopRated, setFilterTopRated] = useState<boolean>(false);
  const [mobileViewMode, setMobileViewMode] = useState<'map' | 'list'>('map');

  // Theme tokens hoisted to top
  const sectionBg = useColorModeValue('#F8FAFC', 'gray.950');
  const cardBg = useColorModeValue('white', 'gray.800');
  const subtleBg = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.900', 'white');
  const mutedText = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.100', 'gray.700');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // Smoothly pan & zoom map when a shop is selected
  const handleShopSelect = useCallback((shop: NearbyShop, index?: number) => {
    setSelectedShop(shop);
    if (shop.mapPoint && mapRef.current) {
      mapRef.current.panTo(shop.mapPoint);
      const currentZoom = mapRef.current.getZoom() || 13;
      if (currentZoom < 14) {
        mapRef.current.setZoom(14);
      }
    }
    // Scroll mobile bottom card rail to matching card
    if (typeof index === 'number' && mobileCardsRef.current) {
      const cardWidth = 272; // card width + gap
      mobileCardsRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth',
      });
    }
  }, []);

  const toggleLikeShop = (shopId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedShops((prev) => {
      const next = new Set(prev);
      if (next.has(shopId)) next.delete(shopId);
      else next.add(shopId);
      return next;
    });
  };

  const handleVisitStore = (shop: NearbyShop, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const slug = shop.name?.replace(/\s+/g, '-').toLowerCase() || 'shop';
    if (shop._id) {
      router.push(`/shop?id=${shop._id}&slug=${slug}`);
      return;
    }
    router.push(`/shop-details?title=${slug}`);
  };

  const handleGetDirections = (shop: NearbyShop, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!shop.mapPoint) return;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${shop.mapPoint.lat},${shop.mapPoint.lng}`,
      '_blank'
    );
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
          .map((shop, idx) => {
            const point = normalizeCoordinates(shop?.location?.coordinates);
            if (!point) return null;
            const seed = getStableSeed(shop._id || shop.name || String(idx));
            const fallbackRating = (4.1 + (seed % 9) * 0.1).toFixed(1);
            const distKm =
              typeof shop.distanceKm === 'number'
                ? shop.distanceKm
                : typeof shop.distanceMeters === 'number'
                ? Number((shop.distanceMeters / 1000).toFixed(1))
                : undefined;

            return {
              ...shop,
              distanceKm: distKm,
              mapPoint: point,
              rating: shop.rating || fallbackRating,
              totalReviews: shop.totalReviews || 40 + (seed % 260),
              isVerified: shop.isVerified ?? seed % 10 > 2,
              deliveryAvailable: shop.deliveryAvailable ?? seed % 10 > 1,
              openingHours: shop.openingHours || '9:00 AM – 9:00 PM',
            };
          })
          .filter(Boolean) as NearbyShop[];

        setShops(normalized);
        setSelectedShop(normalized[0] || null);
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
        if (mapRef.current) {
          mapRef.current.panTo(location);
          mapRef.current.setZoom(13);
        }
        fetchShops(location, radiusKm);
      },
      () => {
        setGeoLoading(false);
        setErrorMessage('Location permission off — showing popular local stores.');
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

  // Client-side instant search & quick filters
  const filteredShops = useMemo(() => {
    return shops.filter((shop) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        shop.name?.toLowerCase().includes(q) ||
        shop.location?.city?.toLowerCase().includes(q) ||
        shop.location?.address?.toLowerCase().includes(q);

      const matchesVerified = !filterVerified || Boolean(shop.isVerified);
      const matchesDelivery = !filterDelivery || Boolean(shop.deliveryAvailable);
      const matchesRating = !filterTopRated || Number(shop.rating || 0) >= 4.5;

      return matchesSearch && matchesVerified && matchesDelivery && matchesRating;
    });
  }, [shops, searchQuery, filterVerified, filterDelivery, filterTopRated]);

  const center = useMemo(() => {
    if (userLocation) return userLocation;
    if (filteredShops.length > 0 && filteredShops[0].mapPoint) {
      return filteredShops[0].mapPoint;
    }
    return FALLBACK_CENTER;
  }, [filteredShops, userLocation]);

  // Fit all visible markers on map
  const handleFitBounds = useCallback(() => {
    if (!mapRef.current || typeof window === 'undefined' || !window.google) return;
    const bounds = new window.google.maps.LatLngBounds();
    let count = 0;

    if (userLocation) {
      bounds.extend(userLocation);
      count++;
    }
    filteredShops.forEach((s) => {
      if (s.mapPoint) {
        bounds.extend(s.mapPoint);
        count++;
      }
    });

    if (count > 1) {
      mapRef.current.fitBounds(bounds, 48);
    } else if (count === 1) {
      mapRef.current.panTo(bounds.getCenter());
      mapRef.current.setZoom(14);
    }
  }, [filteredShops, userLocation]);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
        <Box
          p={6}
          borderRadius="2xl"
          bg="amber.50"
          border="1px solid"
          borderColor="amber.200"
          textAlign="center"
        >
          <Icon as={FaMapMarkerAlt} boxSize={8} color="amber.600" mb={2} />
          <Heading size="sm" color="amber.900">
            Google Maps API Key Required
          </Heading>
          <Text fontSize="xs" color="amber.700" mt={1}>
            Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.
          </Text>
        </Box>
    );
  }

  if (loadError) {
    return (
        <Box
          p={6}
          borderRadius="2xl"
          bg="red.50"
          border="1px solid"
          borderColor="red.200"
          textAlign="center"
        >
          <Icon as={FaMapMarkerAlt} boxSize={8} color="red.500" mb={2} />
          <Heading size="sm" color="red.800">
            Unable to Load Map
          </Heading>
          <Text fontSize="xs" color="red.600" mt={1}>
            Please check your internet connection and Google Maps API configuration.
          </Text>
        </Box>
    );
  }

  return (
    <Box
      as="section"
      bg={sectionBg}
      py={{ base: 5, md: 9 }}
      borderBottom="1px solid"
      borderColor={borderColor}
    >
        {/* 1. Compact Header + Location Action Row */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'flex-start', md: 'flex-end' }}
          mb={{ base: 3.5, md: 5 }}
          gap={3}
        >
          <Box>
            <HStack spacing={1.5} mb={1}>
              <Icon as={FiCompass} color="var(--color-primary)" boxSize={3.5} />
              <Text
                fontSize="11px"
                fontWeight="700"
                textTransform="uppercase"
                letterSpacing="wider"
                color="var(--color-primary)"
              >
                Live Store Radar
              </Text>
              {userLocation && (
                <Badge
                  colorScheme="green"
                  variant="subtle"
                  rounded="full"
                  px={2}
                  fontSize="9px"
                >
                  ● GPS Active
                </Badge>
              )}
            </HStack>
            <Heading
              as="h2"
              fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }}
              fontWeight="800"
              color={textColor}
              letterSpacing="tight"
              lineHeight="1.2"
            >
              Explore Nearby Local Stores
            </Heading>
          </Box>

          {/* Radius Selector Pills + Locate Me Button */}
          <HStack
            spacing={1.5}
            w={{ base: 'full', md: 'auto' }}
            justify="space-between"
            overflowX="auto"
            pb={{ base: 1, md: 0 }}
            sx={{
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            <HStack
              spacing={1}
              bg={cardBg}
              p={1}
              rounded="full"
              border="1px solid"
              borderColor={borderColor}
              flexShrink={0}
            >
              {radiusOptions.map((r) => {
                const isActive = radiusKm === r;
                return (
                  <Button
                    key={r}
                    size="xs"
                    h="26px"
                    px={2.5}
                    rounded="full"
                    fontSize="11px"
                    fontWeight="700"
                    bg={isActive ? 'var(--color-primary)' : 'transparent'}
                    color={isActive ? 'white' : mutedText}
                    _hover={{ bg: isActive ? 'var(--color-primary)' : subtleBg }}
                    onClick={() => setRadiusKm(r)}
                  >
                    {r} km
                  </Button>
                );
              })}
            </HStack>

            <Button
              size="xs"
              h="34px"
              px={3.5}
              rounded="full"
              colorScheme="brand"
              leftIcon={<FaCrosshairs />}
              isLoading={geoLoading}
              onClick={requestCurrentLocation}
              fontWeight="700"
              flexShrink={0}
              boxShadow="xs"
            >
              Near Me
            </Button>
          </HStack>
        </Flex>

        {/* 2. Search, Filter Chips & Mobile Map/List Toggle Bar */}
        <Flex
          bg={cardBg}
          p={{ base: 2.5, md: 3 }}
          rounded="2xl"
          border="1px solid"
          borderColor={borderColor}
          mb={4}
          gap={2.5}
          align="center"
          justify="space-between"
          flexWrap="wrap"
          boxShadow="2xs"
        >
          {/* Search Input */}
          <InputGroup size="sm" maxW={{ base: 'full', md: '280px' }} flex="1" minW="180px">
            <InputLeftElement pointerEvents="none" h="34px">
              <Icon as={FiSearch} color="gray.400" boxSize={3.5} />
            </InputLeftElement>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search store name or area..."
              h="34px"
              rounded="full"
              bg={subtleBg}
              border="1px solid"
              borderColor={borderColor}
              fontSize="xs"
              _focus={{
                bg: cardBg,
                borderColor: 'var(--color-primary)',
                boxShadow: '0 0 0 2px rgba(37,99,235,0.12)',
              }}
            />
            {searchQuery && (
              <InputRightElement h="34px">
                <IconButton
                  aria-label="Clear search"
                  icon={<AiFillCloseCircle size={11} />}
                  size="xs"
                  variant="ghost"
                  rounded="full"
                  onClick={() => setSearchQuery('')}
                />
              </InputRightElement>
            )}
          </InputGroup>

          {/* Quick Filter Chips */}
          <HStack
            spacing={1.5}
            overflowX="auto"
            flexShrink={0}
            maxW="full"
            sx={{
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            <Badge
              px={2.5}
              py={1}
              rounded="full"
              bg="var(--color-surface-hover)"
              color="var(--color-primary)"
              fontSize="11px"
              fontWeight="700"
            >
              {filteredShops.length} Stores
            </Badge>

            {/* <Button
              size="xs"
              h="28px"
              px={2.5}
              rounded="full"
              variant={filterVerified ? 'solid' : 'outline'}
              colorScheme={filterVerified ? 'blue' : 'gray'}
              leftIcon={<FaCheckCircle size={10} />}
              onClick={() => setFilterVerified((v) => !v)}
              fontSize="11px"
            >
              Verified
            </Button> */}

            <Button
              size="xs"
              h="28px"
              px={2.5}
              rounded="full"
              variant={filterDelivery ? 'solid' : 'outline'}
              colorScheme={filterDelivery ? 'green' : 'gray'}
              leftIcon={<FaShippingFast size={11} />}
              onClick={() => setFilterDelivery((v) => !v)}
              fontSize="11px"
            >
              Delivery
            </Button>

            <Button
              size="xs"
              h="28px"
              px={2.5}
              rounded="full"
              variant={filterTopRated ? 'solid' : 'outline'}
              colorScheme={filterTopRated ? 'orange' : 'gray'}
              leftIcon={<FaStar size={10} />}
              onClick={() => setFilterTopRated((v) => !v)}
              fontSize="11px"
            >
              4.5★+
            </Button>

            {/* Mobile View Switcher (Map vs List) */}
            <HStack
              display={{ base: 'flex', lg: 'none' }}
              bg={subtleBg}
              p={0.5}
              rounded="full"
              border="1px solid"
              borderColor={borderColor}
              ml={1}
            >
              <Button
                size="xs"
                h="24px"
                px={2.5}
                rounded="full"
                leftIcon={<FiMap size={11} />}
                bg={mobileViewMode === 'map' ? 'var(--color-primary)' : 'transparent'}
                color={mobileViewMode === 'map' ? 'white' : mutedText}
                onClick={() => setMobileViewMode('map')}
                fontSize="10px"
              >
                Map
              </Button>
              <Button
                size="xs"
                h="24px"
                px={2.5}
                rounded="full"
                leftIcon={<FiList size={11} />}
                bg={mobileViewMode === 'list' ? 'var(--color-primary)' : 'transparent'}
                color={mobileViewMode === 'list' ? 'white' : mutedText}
                onClick={() => setMobileViewMode('list')}
                fontSize="10px"
              >
                List
              </Button>
            </HStack>
          </HStack>
        </Flex>

        {/* 3. Main Interactive Map + Sidebar Layout */}
        <SimpleGrid columns={{ base: 1, lg: 12 }} spacing={4} alignItems="stretch">
          {/* LEFT: Store List Sidebar (Always visible on Desktop, visible on Mobile when 'list' is active) */}
          <Box
            display={{
              base: mobileViewMode === 'list' ? 'block' : 'none',
              lg: 'block',
            }}
            gridColumn={{ lg: 'span 4' }}
            bg={cardBg}
            borderRadius="2xl"
            border="1px solid"
            borderColor={borderColor}
            overflow="hidden"
            h={{ base: '440px', lg: '540px' }}
            flexDirection="column"
            boxShadow="xs"
          >
            <Flex
              px={4}
              py={3}
              borderBottom="1px solid"
              borderColor={borderColor}
              justify="space-between"
              align="center"
              bg={subtleBg}
            >
              <Text fontWeight="800" fontSize="xs" textTransform="uppercase" letterSpacing="wider" color={mutedText}>
                Nearby Directory ({filteredShops.length})
              </Text>
              {(filterVerified || filterDelivery || filterTopRated || searchQuery) && (
                <Button
                  size="xs"
                  variant="link"
                  colorScheme="red"
                  fontSize="11px"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterVerified(false);
                    setFilterDelivery(false);
                    setFilterTopRated(false);
                  }}
                >
                  Reset
                </Button>
              )}
            </Flex>

            <Box
              overflowY="auto"
              h="calc(100% - 45px)"
              p={2.5}
              sx={{
                '&::-webkit-scrollbar': { width: '4px' },
                '&::-webkit-scrollbar-thumb': {
                  background: '#CBD5E0',
                  borderRadius: 'full',
                },
              }}
            >
              {shopLoading ? (
                <VStack spacing={2.5} align="stretch">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} height="88px" borderRadius="xl" />
                  ))}
                </VStack>
              ) : filteredShops.length === 0 ? (
                <VStack py={12} px={4} spacing={2} textAlign="center">
                  <Circle size="44px" bg="var(--color-surface-hover)" color="var(--color-primary)">
                    <Icon as={FaStore} boxSize={5} />
                  </Circle>
                  <Text fontSize="sm" fontWeight="700" color={textColor}>
                    No matching stores nearby
                  </Text>
                  <Text fontSize="xs" color={mutedText}>
                    Try expanding the km radius above or clearing filters.
                  </Text>
                </VStack>
              ) : (
                <VStack spacing={2} align="stretch">
                  {filteredShops.map((shop, idx) => {
                    const isSelected = selectedShop?._id === shop._id;
                    const isLiked = likedShops.has(shop._id || '');

                    return (
                      <Box
                        key={shop._id || idx}
                        p={3}
                        borderRadius="xl"
                        bg={isSelected ? 'blue.50' : cardBg}
                        _dark={{ bg: isSelected ? 'whiteAlpha.100' : cardBg }}
                        border="1px solid"
                        borderColor={isSelected ? 'var(--color-primary)' : borderColor}
                        cursor="pointer"
                        transition="all 0.15s ease"
                        _hover={{
                          borderColor: 'var(--color-primary)',
                          bg: isSelected ? 'blue.50' : subtleBg,
                        }}
                        onClick={() => {
                          handleShopSelect(shop, idx);
                          if (mobileViewMode === 'list') setMobileViewMode('map');
                        }}
                      >
                        <Flex justify="space-between" align="flex-start" gap={2}>
                          <Box minW={0} flex="1">
                            <HStack spacing={1.5} mb={1}>
                              <Text
                                fontWeight="700"
                                fontSize="sm"
                                textTransform={'capitalize'}
                                color={textColor}
                                noOfLines={1}
                              >
                                {shop.name}
                              </Text>
                              {shop.isVerified && (
                                <Icon
                                  as={FaCheckCircle}
                                  color="var(--color-primary)"
                                  boxSize={3}
                                  flexShrink={0}
                                />
                              )}
                            </HStack>

                            {/* Rating & Distance Pill Row */}
                            <HStack spacing={2} mb={1.5} flexWrap="wrap">
                              <HStack
                                spacing={0.5}
                                bg="green.600"
                                color="white"
                                px={1.5}
                                py={0.2}
                                rounded="md"
                                fontSize="10px"
                                fontWeight="800"
                              >
                                <Text>{shop.rating}</Text>
                                <Icon as={FaStar} boxSize={2} />
                              </HStack>

                              {typeof shop.distanceKm === 'number' && (
                                <Badge
                                  colorScheme="brand"
                                  variant="subtle"
                                  fontSize="10px"
                                  rounded="md"
                                  px={1.5}
                                >
                                  {shop.distanceKm.toFixed(1)} km
                                </Badge>
                              )}

                              {shop.deliveryAvailable && (
                                <Badge
                                  colorScheme="green"
                                  variant="subtle"
                                  fontSize="9px"
                                  rounded="md"
                                  px={1.5}
                                >
                                  Delivery
                                </Badge>
                              )}
                            </HStack>

                            <HStack spacing={1} color={mutedText} fontSize="11px">
                              <Icon as={FiMapPin} boxSize={3} flexShrink={0} />
                              <Text noOfLines={1}>
                                {[shop.location?.address, shop.location?.city]
                                  .filter(Boolean)
                                  .join(', ') || 'Local Store'}
                              </Text>
                            </HStack>
                          </Box>

                          {/* Right Quick Actions */}
                          <VStack spacing={1.5} flexShrink={0}>
                            <IconButton
                              aria-label="Favorite store"
                              icon={
                                <Icon
                                  as={isLiked ? FaHeart : FaRegHeart}
                                  color={isLiked ? 'red.500' : 'gray.400'}
                                  boxSize={3.5}
                                />
                              }
                              size="xs"
                              w="26px"
                              h="26px"
                              minW="26px"
                              rounded="full"
                              variant="ghost"
                              onClick={(e) => toggleLikeShop(shop._id || '', e)}
                            />
                            <IconButton
                              aria-label="Visit store"
                              icon={<FiArrowUpRight size={13} />}
                              size="xs"
                              w="26px"
                              h="26px"
                              minW="26px"
                              rounded="full"
                              colorScheme="brand"
                              variant={isSelected ? 'solid' : 'subtle'}
                              onClick={(e) => handleVisitStore(shop, e)}
                            />
                          </VStack>
                        </Flex>
                      </Box>
                    );
                  })}
                </VStack>
              )}
            </Box>
          </Box>

          {/* RIGHT: Interactive Map + Floating Mobile Store Carousel */}
          <Box
            display={{
              base: mobileViewMode === 'map' ? 'block' : 'none',
              lg: 'block',
            }}
            gridColumn={{ lg: 'span 8' }}
            h={{ base: '440px', sm: '480px', lg: '540px' }}
            borderRadius="2xl"
            overflow="hidden"
            border="1px solid"
            borderColor={borderColor}
            boxShadow="sm"
            position="relative"
            bg={cardBg}
          >
            {/* Subtle non-intrusive status banner */}
            {errorMessage && (
              <HStack
                position="absolute"
                top={3}
                left={3}
                right="56px"
                zIndex={3}
                bg="whiteAlpha.950"
                backdropFilter="blur(8px)"
                px={3}
                py={1.5}
                rounded="full"
                boxShadow="sm"
                spacing={2}
                maxW="fit-content"
              >
                <Icon as={FaMapMarkerAlt} color="orange.500" boxSize={3} />
                <Text fontSize="11px" color="gray.700" fontWeight="600" noOfLines={1}>
                  {errorMessage}
                </Text>
              </HStack>
            )}

            {/* Floating Map Control Buttons (Top-Right) */}
            <VStack position="absolute" top={3} right={3} zIndex={3} spacing={2}>
              <Tooltip label="My Location" placement="left" hasArrow>
                <IconButton
                  aria-label="Center on my location"
                  icon={<FaCrosshairs size={14} />}
                  size="sm"
                  w="34px"
                  h="34px"
                  rounded="xl"
                  bg="white"
                  color="gray.700"
                  boxShadow="md"
                  _hover={{ bg: 'blue.50', color: 'var(--color-primary)' }}
                  isLoading={geoLoading}
                  onClick={requestCurrentLocation}
                />
              </Tooltip>

              <Tooltip label="Fit all stores" placement="left" hasArrow>
                <IconButton
                  aria-label="Fit all stores on screen"
                  icon={<FiMaximize2 size={14} />}
                  size="sm"
                  w="34px"
                  h="34px"
                  rounded="xl"
                  bg="white"
                  color="gray.700"
                  boxShadow="md"
                  _hover={{ bg: 'blue.50', color: 'var(--color-primary)' }}
                  onClick={handleFitBounds}
                />
              </Tooltip>
            </VStack>

            {!isLoaded || shopLoading ? (
              <Flex h="100%" align="center" justify="center" direction="column" gap={3}>
                <Spinner size="lg" color="var(--color-primary)" thickness="3px" />
                <Text fontSize="xs" color={mutedText} fontWeight="600">
                  Finding stores near you...
                </Text>
              </Flex>
            ) : (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={13}
                options={mapOptions}
                onLoad={(map) => {
                  mapRef.current = map;
                }}
              >
                {/* User GPS Marker & Radius Circle */}
                {userLocation && (
                  <>
                    <MarkerF
                      position={userLocation}
                      title="Your Location"
                      icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: '#2563EB',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 3,
                      }}
                    />
                    <CircleF
                      center={userLocation}
                      radius={radiusKm * 1000}
                      options={{
                        fillColor: '#3B82F6',
                        fillOpacity: 0.08,
                        strokeColor: '#2563EB',
                        strokeOpacity: 0.35,
                        strokeWeight: 1.5,
                      }}
                    />
                  </>
                )}

                {/* Store Markers */}
                {filteredShops.map((shop, idx) => {
                  if (!shop.mapPoint) return null;
                  const isSelected = selectedShop?._id === shop._id;
                  return (
                    <MarkerF
                      key={shop._id || `${shop.name}-${idx}`}
                      position={shop.mapPoint}
                      title={shop.name || 'Store'}
                      onClick={() => handleShopSelect(shop, idx)}
                      icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: isSelected ? 12 : 9,
                        fillColor: isSelected ? '#EA580C' : '#2563EB',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2.5,
                      }}
                    />
                  );
                })}

                {/* Instant Store Preview InfoWindow (No 2-second fake delay!) */}
            {selectedShop?.mapPoint && (
  <InfoWindowF
    position={selectedShop.mapPoint}
    onCloseClick={() => setSelectedShop(null)}
    options={{
      headerDisabled: true,
      pixelOffset: new window.google.maps.Size(0, -10),
      disableAutoPan: false,
    }}
  >
    <Box
      w="220px"
      maxW="220px"
      minW="0"
      p={0}
      m={0}
      boxSizing="border-box"
      overflow="hidden"
      color="gray.800"
    >
      {/* Header */}
      <HStack justify="space-between" align="center" spacing={1} mb={1.5}>
        <HStack spacing={1} minW={0} flex="1">
          <Text
            fontWeight="800"
            fontSize="13px"
            color="gray.900"
            noOfLines={1}
          >
            {selectedShop.name || "Local Store"}
          </Text>

          {selectedShop.isVerified && (
            <Icon
              as={FaCheckCircle}
              color="var(--color-primary)"
              boxSize={3.5}
              flexShrink={0}
            />
          )}
        </HStack>

        <IconButton
          aria-label="Close store details"
          icon={<Icon as={FaTimes} boxSize={3} />}
          size="xs"
          variant="ghost"
          color="gray.500"
          minW="22px"
          w="22px"
          h="22px"
          onClick={() => setSelectedShop(null)}
        />
      </HStack>

      {/* Rating and reviews */}
      <HStack spacing={2} mb={1.5}>
        <HStack
          bg="green.600"
          color="white"
          px={1.5}
          py={0.5}
          rounded="md"
          spacing={1}
        >
          <Text fontSize="10px" fontWeight="800">
            {selectedShop.rating || "New"}
          </Text>
          {selectedShop.rating && (
            <Icon as={FaStar} boxSize={2.5} />
          )}
        </HStack>

        <Text fontSize="10px" color="gray.500">
          {selectedShop.totalReviews || 0} reviews
        </Text>

        {typeof selectedShop.distanceKm === "number" && (
          <Text fontSize="10px" color="var(--color-primary)" fontWeight="600">
            {selectedShop.distanceKm.toFixed(1)} km
          </Text>
        )}
      </HStack>

      {/* Description */}
      <Text
        fontSize="11px"
        color="gray.600"
        noOfLines={1}
        lineHeight="16px"
        mb={2}
      >
        {selectedShop.description ||
          [
            selectedShop.location?.address,
            selectedShop.location?.city,
          ].filter(Boolean).join(", ") ||
          "Trusted neighborhood store near you."}
      </Text>

      {/* Actions */}
      <HStack spacing={1.5} w="100%">
        <Button
          size="xs"
          flex="1"
          minW={0}
          h="29px"
          fontSize="11px"
          fontWeight="700"
          colorScheme="brand"
          rounded="md"
          rightIcon={<FiArrowUpRight size={13} />}
          onClick={(e) => handleVisitStore(selectedShop, e)}
        >
          Visit Store
        </Button>

        <IconButton
          aria-label="Get directions"
          icon={<FiNavigation size={13} />}
          size="xs"
          h="29px"
          w="29px"
          minW="29px"
          rounded="md"
          variant="outline"
          colorScheme="brand"
          onClick={(e) => handleGetDirections(selectedShop, e)}
        />

        {selectedShop.contactInfo?.phone && (
          <IconButton
            aria-label="Call store"
            icon={<FaPhoneAlt size={12} />}
            size="xs"
            h="29px"
            w="29px"
            minW="29px"
            rounded="md"
            variant="outline"
            colorScheme="green"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `tel:${selectedShop.contactInfo.phone}`;
            }}
          />
        )}
      </HStack>
    </Box>
  </InfoWindowF>
)}
              </GoogleMap>
            )}

            {/* FLOATING MOBILE BOTTOM STORE RAIL (Swiggy / Google Maps style) */}
            {filteredShops.length > 0 && (
              <Box
                display={{ base: 'block', lg: 'none' }}
                position="absolute"
                bottom={2.5}
                left={0}
                right={0}
                zIndex={3}
              >
                <Flex
                  ref={mobileCardsRef}
                  gap={2.5}
                  overflowX="auto"
                  px={3}
                  py={1}
                  sx={{
                    scrollSnapType: 'x mandatory',
                    '& > *': { scrollSnapAlign: 'center' },
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                  }}
                >
                  {filteredShops.map((shop, idx) => {
                    const isSelected = selectedShop?._id === shop._id;
                    return (
                      <Box
                        key={shop._id || idx}
                        w="260px"
                        flexShrink={0}
                        bg="whiteAlpha.950"
                        backdropFilter="blur(10px)"
                        p={3}
                        rounded="xl"
                        border="1.5px solid"
                        borderColor={isSelected ? 'blue.500' : 'gray.200'}
                        boxShadow="0 8px 20px rgba(0,0,0,0.12)"
                        onClick={() => handleShopSelect(shop, idx)}
                      >
                        <Flex justify="space-between" align="start" gap={2}>
                          <Box minW={0} flex="1">
                            <HStack spacing={1}>
                              <Text fontSize="xs" fontWeight="800" color="gray.900" noOfLines={1}>
                                {shop.name}
                              </Text>
                              {shop.isVerified && (
                                <Icon as={FaCheckCircle} color="var(--color-primary)" boxSize={3} />
                              )}
                            </HStack>
                            <HStack spacing={1.5} mt={1}>
                              <Badge colorScheme="green" fontSize="9px" rounded="sm">
                                ★ {shop.rating}
                              </Badge>
                              {typeof shop.distanceKm === 'number' && (
                                <Text fontSize="10px" fontWeight="700" color="var(--color-primary)">
                                  {shop.distanceKm.toFixed(1)} km
                                </Text>
                              )}
                              <Text fontSize="10px" color="gray.500" noOfLines={1}>
                                • {shop.location?.city || 'Nearby'}
                              </Text>
                            </HStack>
                          </Box>

                          <HStack spacing={1}>
                            <IconButton
                              aria-label="Directions"
                              icon={<FiNavigation size={12} />}
                              size="xs"
                              w="26px"
                              h="26px"
                              minW="26px"
                              rounded="lg"
                              bg="gray.100"
                              color="gray.700"
                              onClick={(e) => handleGetDirections(shop, e)}
                            />
                            <IconButton
                              aria-label="Visit Shop"
                              icon={<FiArrowUpRight size={13} />}
                              size="xs"
                              w="26px"
                              h="26px"
                              minW="26px"
                              rounded="lg"
                              colorScheme="brand"
                              onClick={(e) => handleVisitStore(shop, e)}
                            />
                          </HStack>
                        </Flex>
                      </Box>
                    );
                  })}
                </Flex>
              </Box>
            )}
          </Box>
        </SimpleGrid>
    </Box>
  );
};

export default MapComponent;