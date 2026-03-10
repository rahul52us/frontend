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
    <Box bg={bg} minH="100vh" position="relative" pb={10}>
      <Container maxW="7xl" px={{ base: 4, md: 6 }} pt={{ base: 8, md: 10 }}>
        {/* Editorial Header */}
        <VStack spacing={8} align="center" textAlign="center" mb={20}>

          <Stack spacing={4} maxW="3xl">
            <Heading
              fontSize={{ base: '4xl', md: '64px' }}
              fontWeight="800"
              color={textColor}
              lineHeight="1.1"
              letterSpacing="-0.03em"
            >
              The Boutique <Text as="span" color="purple.500">Collection</Text>
            </Heading>
            <Text color={subTextColor} fontSize={{ base: 'lg', md: 'xl' }} fontWeight="500" lineHeight="1.6" opacity={0.8}>
              Discover a curated selection of premium local businesses dedicated to quality, service, and community excellence.
            </Text>
          </Stack>

          {/* Centered Search Bar */}
          <InputGroup size="lg" maxW="xl" shadow="sm">
            <InputLeftElement pointerEvents="none" h="full" pl={4}>
              <SearchIcon color="gray.400" boxSize={4} />
            </InputLeftElement>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or category..."
              borderRadius="full"
              bg={inputBg}
              border="1px solid"
              borderColor={inputBorder}
              fontSize="md"
              h="64px"
              pl={12}
              _placeholder={{ color: 'gray.400' }}
              _focus={{
                borderColor: 'purple.500',
                bg: 'white',
                shadow: 'xl'
              }}
              transition="all 0.3s"
            />
          </InputGroup>

          <Box
            w="full"
            maxW="6xl"
            p={{ base: 4, md: 5 }}
            borderRadius="2xl"
            border="1px solid"
            borderColor={inputBorder}
            bg={inputBg}
          >
            <VStack spacing={4} align="stretch">
              <Stack direction={{ base: 'column', lg: 'row' }} spacing={3}>
                <Button
                  colorScheme="purple"
                  onClick={useCurrentLocation}
                  isLoading={geoLoading}
                  loadingText="Detecting..."
                  minW={{ lg: '180px' }}
                >
                  Use Current Location
                </Button>
                <Text fontSize="sm" color="gray.500" alignSelf="center">
                  We will ask browser permission and use your current coordinates.
                </Text>
              </Stack>

              <Stack direction={{ base: 'column', lg: 'row' }} spacing={3}>
                <Select
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  maxW={{ lg: '220px' }}
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
                  maxW={{ lg: '220px' }}
                >
                  <option value="distance">Sort by distance</option>
                  <option value="latest">Sort by latest</option>
                </Select>
                <HStack spacing={3}>
                  <Button colorScheme="purple" variant="outline" onClick={useCurrentLocation}>
                    Refresh Location
                  </Button>
                  <Button variant="ghost" onClick={clearGeoFilter}>
                    Clear
                  </Button>
                </HStack>
              </Stack>

              {geoFilter.lat !== null && geoFilter.lng !== null && (
                <Text fontSize="sm" color="gray.500">
                  Showing shops near ({geoFilter.lat}, {geoFilter.lng}) within {geoFilter.radiusKm} km.
                </Text>
              )}
              {geoError ? (
                <Text fontSize="sm" color="red.500">
                  {geoError}
                </Text>
              ) : null}
            </VStack>
          </Box>
        </VStack>

        {/* Category Pill Navigation */}
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
          <HStack spacing={3} px={4}>
            {categories.map((category) => {
              const isActive = activeCategory === category || (category === 'All Shops' && !activeCategory);
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

        {/* Shops Section Content */}
        <ShopSection
          searchQuery={searchQuery}
          activeCategory={activeCategory}
          geoFilter={geoFilter}
          sortBy={sortBy}
        />

        {/* Premium Call to Action */}
        <Box
          mt={32}
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

      {/* Floating Scroll to Top */}
      <Fade in={showScrollBtn}>
        <IconButton
          icon={<ArrowUpIcon />}
          onClick={scrollToTop}
          position="fixed"
          bottom="40px"
          right="40px"
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
