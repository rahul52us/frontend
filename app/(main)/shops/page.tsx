'use client'

import {
  Box,
  Heading,
  Container,
  Text,
  Stack,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  Select,
  useColorModeValue,
  IconButton,
  Fade,
  HStack,
  VStack
} from '@chakra-ui/react'
import { SearchIcon, AddIcon, ArrowUpIcon } from '@chakra-ui/icons'
import React, { useCallback, useEffect, useState } from 'react'
import ShopSection from '../component/shopSection/ShopSection'
import { useRouter } from 'next/navigation'
import { authentication } from '../../config/utils/routes'

const ShopsPage = () => {
  const router = useRouter()
  const bg = useColorModeValue('white', 'gray.950')
  const textColor = useColorModeValue('gray.900', 'white')
  const subTextColor = useColorModeValue('gray.600', 'gray.400')
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState('')
  const [radiusKm, setRadiusKm] = useState(5)
  const [sortBy, setSortBy] = useState<'distance' | 'latest'>('distance')
  const [geoFilter, setGeoFilter] = useState<{
    lat: number | null
    lng: number | null
    radiusKm: number
  }>({
    lat: null,
    lng: null,
    radiusKm: 5,
  })

  const inputBg = useColorModeValue('gray.50', 'whiteAlpha.50')
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.200')
  const heroBg = useColorModeValue('purple.50', 'whiteAlpha.100')
  const panelBg = useColorModeValue('white', 'gray.900')

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollBtn(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setGeoFilter((prev) => ({
      ...prev,
      radiusKm,
    }))
  }, [radiusKm])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const clearGeoFilter = () => {
    setGeoError('')
    setGeoFilter((prev) => ({
      lat: null,
      lng: null,
      radiusKm: prev.radiusKm,
    }))
  }

  const useCurrentLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGeoError('Geolocation is not supported on this browser.')
      return
    }

    setGeoLoading(true)
    setGeoError('')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(6))
        const lng = Number(position.coords.longitude.toFixed(6))
        setGeoFilter((prev) => ({
          lat,
          lng,
          radiusKm: prev.radiusKm,
        }))
        setGeoLoading(false)
      },
      (error) => {
        setGeoLoading(false)
        setGeoError(error.message || 'Unable to fetch current location.')
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }, [])

  // Removed automatic useCurrentLocation on mount to prevent "User denied geolocation" errors on Android/iOS when permissions are not yet granted.
  // Users must explicitly click "Use Current Location".

  const categories = ['All Shops', 'Grocery', 'Clothing', 'Electronics', 'Restaurants', 'Beauty', 'Home', 'Pharmacy']

  return (
    <Box bg={bg} minH="100vh" position="relative" pb={{ base: 28, md: 10 }}>
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h={{ base: '220px', md: '280px' }}
        bgGradient="linear(to-br, purple.100, transparent)"
        zIndex={0}
      />

      <Container maxW="7xl" px={{ base: 4, md: 6 }} pt={{ base: 10, md: 12 }} position="relative" zIndex={1}>
        <Box
          bg={heroBg}
          borderRadius="3xl"
          p={{ base: 6, md: 10 }}
          shadow="xl"
          border="1px solid"
          borderColor={inputBorder}
          mb={{ base: 8, md: 12 }}
        >
          <VStack spacing={8} align="center" textAlign="center">
            <Stack spacing={4} maxW="3xl">
              <Heading
                fontSize={{ base: '3xl', md: '5xl', lg: '64px' }}
                fontWeight="800"
                color={textColor}
                lineHeight="1.05"
                letterSpacing="-0.03em"
              >
                The Boutique <Text as="span" color="purple.500">Collection</Text>
              </Heading>
              <Text color={subTextColor} fontSize={{ base: 'md', md: 'lg' }} fontWeight="500" lineHeight="1.7" opacity={0.9}>
                Discover a curated selection of premium local businesses dedicated to quality, service, and community excellence.
              </Text>
            </Stack>

            <InputGroup size="lg" maxW="xl" shadow="md" borderRadius="3xl" overflow="hidden">
              <InputLeftElement pointerEvents="none" h="full" pl={4}>
                <SearchIcon color="gray.400" boxSize={5} />
              </InputLeftElement>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or category..."
                borderRadius="3xl"
                bg={inputBg}
                border="1px solid"
                borderColor={inputBorder}
                fontSize="md"
                h="64px"
                pl={14}
                _placeholder={{ color: 'gray.400' }}
                _focus={{
                  borderColor: 'purple.500',
                  bg: 'white',
                  shadow: 'xl',
                }}
                transition="all 0.3s"
              />
            </InputGroup>
          </VStack>
        </Box>

        <Box
          bg={panelBg}
          borderRadius="3xl"
          p={{ base: 5, md: 6 }}
          shadow="xl"
          border="1px solid"
          borderColor={inputBorder}
          mb={{ base: 8, md: 10 }}
        >
          <VStack spacing={6} align="stretch">
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4} align="center" justify="space-between">
              <VStack align="flex-start" spacing={2} flex={1} minW={0}>
                <Text fontSize="sm" fontWeight="600" color={textColor} opacity={0.9}>
                  Refine your search with location-aware filters
                </Text>
                <Text fontSize="sm" color={subTextColor} lineHeight="1.6">
                  Your results refresh automatically as you update filters.
                </Text>
              </VStack>
              <Button
                colorScheme="purple"
                onClick={useCurrentLocation}
                isLoading={geoLoading}
                loadingText="Detecting..."
                w={{ base: 'full', md: 'auto' }}
                minW={{ md: '180px' }}
                borderRadius="full"
                h="56px"
              >
                Use Current Location
              </Button>
            </Stack>

            <Stack direction={{ base: 'column', md: 'row' }} spacing={3} align="stretch">
              <Select
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                maxW={{ base: '100%', md: '240px' }}
                borderRadius="2xl"
                borderColor={inputBorder}
                h="56px"
                bg={inputBg}
              >
                <option value={2}>2 km radius</option>
                <option value={5}>5 km radius</option>
                <option value={10}>10 km radius</option>
                <option value={20}>20 km radius</option>
                <option value={50}>50 km radius</option>
              </Select>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'distance' | 'latest')}
                maxW={{ base: '100%', md: '240px' }}
                borderRadius="2xl"
                borderColor={inputBorder}
                h="56px"
                bg={inputBg}
              >
                <option value="distance">Sort by distance</option>
                <option value="latest">Sort by latest</option>
              </Select>
              <HStack spacing={3} flex={1} flexWrap="wrap">
                <Button colorScheme="purple" variant="outline" flex={1} minW={{ base: '100%', md: 'auto' }} borderRadius="2xl" h="56px" onClick={useCurrentLocation}>
                  Refresh Location
                </Button>
                <Button variant="ghost" flex={1} minW={{ base: '100%', md: 'auto' }} borderRadius="2xl" h="56px" onClick={clearGeoFilter}>
                  Clear
                </Button>
              </HStack>
            </Stack>

            <VStack spacing={2} align="stretch">
              {geoFilter.lat !== null && geoFilter.lng !== null && (
                <Text fontSize="sm" color={subTextColor}>
                  Showing shops near ({geoFilter.lat}, {geoFilter.lng}) within {geoFilter.radiusKm} km.
                </Text>
              )}
              {geoError ? (
                <Text fontSize="sm" color="red.500">
                  {geoError}
                </Text>
              ) : null}
            </VStack>
          </VStack>
        </Box>

        <Box
          mb={12}
          overflowX="auto"
          display="flex"
          justifyContent={{ base: 'flex-start', md: 'center' }}
          css={{
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          <HStack spacing={3} px={{ base: 2, md: 4 }} py={2} bg={panelBg} borderRadius="3xl" shadow="sm" border="1px solid" borderColor={inputBorder}>
            {categories.map((category) => {
              const isActive = activeCategory === category || (category === 'All Shops' && !activeCategory)
              return (
                <Button
                  key={category}
                  onClick={() => setActiveCategory(category === 'All Shops' ? null : category)}
                  variant={isActive ? 'solid' : 'ghost'}
                  colorScheme={isActive ? 'purple' : 'gray'}
                  h="auto"
                  px={6}
                  py={2.5}
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight="700"
                  whiteSpace="nowrap"
                  transition="all 0.2s"
                >
                  {category}
                </Button>
              )
            })}
          </HStack>
        </Box>

        <ShopSection
          searchQuery={searchQuery}
          activeCategory={activeCategory}
          geoFilter={geoFilter}
          sortBy={sortBy}
        />

        <Box
          mt={{ base: 20, md: 32 }}
          bgGradient="linear(to-br, gray.900, black)"
          color="white"
          p={{ base: 10, md: 20 }}
          textAlign="center"
          borderRadius="3xl"
          shadow="2xl"
        >
          <VStack spacing={6}>
            <Heading fontSize={{ base: '2xl', md: '4xl' }} fontWeight="800">
              Grow Your Business With Us
            </Heading>
            <Text fontSize="lg" color="gray.400" maxW="xl" mx="auto">
              Join our network of elite vendors and showcase your brand to a discerning local audience.
            </Text>
            <Button
              bg="white"
              color="gray.900"
              leftIcon={<AddIcon boxSize={3} />}
              size="lg"
              h="56px"
              px={10}
              borderRadius="full"
              fontSize="md"
              fontWeight="bold"
              _hover={{ transform: 'translateY(-2px)', shadow: 'xl', bg: 'purple.50' }}
              onClick={() => router.push(authentication.register)}
            >
              Partner With Us
            </Button>
          </VStack>
        </Box>
      </Container>

      <Box
        display={{ base: 'flex', md: 'none' }}
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        bg={bg}
        borderTop="1px solid"
        borderColor={inputBorder}
        px={4}
        py={3}
        zIndex={999}
        shadow="xl"
      >
        <HStack spacing={3} w="full" justify="space-between">
          <Button flex={1} size="sm" variant="ghost" colorScheme="purple" borderRadius="2xl">
            Explore
          </Button>
          <Button flex={1} size="sm" variant="solid" colorScheme="purple" borderRadius="2xl" onClick={useCurrentLocation} isLoading={geoLoading}>
            Location
          </Button>
          <Button flex={1} size="sm" variant="outline" borderRadius="2xl" onClick={clearGeoFilter}>
            Clear
          </Button>
        </HStack>
      </Box>

      <Fade in={showScrollBtn}>
        <IconButton
          icon={<ArrowUpIcon />}
          onClick={scrollToTop}
          position="fixed"
          bottom={{ base: '84px', md: '40px' }}
          right={{ base: '20px', md: '40px' }}
          bg="purple.500"
          color="white"
          _hover={{ bg: 'purple.600', transform: 'scale(1.1)' }}
          aria-label="Scroll to top"
          borderRadius="full"
          size="lg"
          zIndex={1000}
          shadow="xl"
        />
      </Fade>
    </Box>
  )
}

export default ShopsPage
