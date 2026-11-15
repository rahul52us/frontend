'use client'

import { AddIcon, ArrowUpIcon, CloseIcon, SearchIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Container,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Fade,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  // keyframes,
  Select,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  usePrefersReducedMotion,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { IconType } from 'react-icons'
import {
  FiCoffee,
  FiGrid,
  FiHeart,
  FiHome,
  FiMapPin,
  FiNavigation,
  FiPlusSquare,
  FiShoppingBag,
  FiShoppingCart,
  FiSliders,
  FiSmartphone,
} from 'react-icons/fi'
import { authentication } from '../../config/utils/routes'
import ShopSection from '../component/shopSection/ShopSection'

/* ---------- keyframes ---------- */
const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`
const float = keyframes`
  0%, 100% { transform: translateY(0) scale(1); }
  50%      { transform: translateY(-14px) scale(1.06); }
`
const pulseRing = keyframes`
  0%   { transform: scale(1);   opacity: 0.6; }
  100% { transform: scale(2.2); opacity: 0; }
`
const shimmer = keyframes`
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`

/* ---------- static data ---------- */
const categories: { label: string; icon: IconType }[] = [
  { label: 'All Shops', icon: FiGrid },
  { label: 'Grocery', icon: FiShoppingCart },
  { label: 'Clothing', icon: FiShoppingBag },
  { label: 'Electronics', icon: FiSmartphone },
  { label: 'Restaurants', icon: FiCoffee },
  { label: 'Beauty', icon: FiHeart },
  { label: 'Home', icon: FiHome },
  { label: 'Pharmacy', icon: FiPlusSquare },
]
const radiusOptions = [2, 5, 10, 20, 50]

type GeoFilter = { lat: number | null; lng: number | null; radiusKm: number }
type ActiveTag = { key: string; label: string; onRemove: () => void }

const ShopsPage = () => {
  const router = useRouter()
  const toast = useToast()
  const reduceMotion = usePrefersReducedMotion()
  const anim = (value: string) => (reduceMotion ? undefined : value)
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? false
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const [toolbarHidden, setToolbarHidden] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const [radiusKm, setRadiusKm] = useState(5)
  const [sortBy, setSortBy] = useState<'distance' | 'latest'>('distance')
  const [geoFilter, setGeoFilter] = useState<GeoFilter>({ lat: null, lng: null, radiusKm: 5 })
  const lastY = useRef(0)

  /* ---------- theme tokens ---------- */
  const pageBg = useColorModeValue('gray.50', 'gray.900')
  const surface = useColorModeValue('white', 'gray.800')
  const stickyBg = useColorModeValue('rgba(255,255,255,0.88)', 'rgba(26,32,44,0.88)')
  const textColor = useColorModeValue('gray.800', 'white')
  const subTextColor = useColorModeValue('gray.600', 'gray.400')
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200')
  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100')
  const heroGradient = useColorModeValue(
    'linear(to-br, #F5F3FF, #EFF6FF, #FDF2F8)',
    'linear(to-br, whiteAlpha.100, whiteAlpha.50)'
  )
  const bannerGradient = useColorModeValue('linear(to-r, #F5F3FF, #EFF6FF)', 'linear(to-r, whiteAlpha.100, whiteAlpha.50)')

  const geoActive = geoFilter.lat !== null && geoFilter.lng !== null

  /* ---------- effects ---------- */
  // scroll: show scroll-to-top + hide toolbar on scroll down (mobile only)
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setShowScrollBtn(y > 300)
      if (isMobile) {
        const delta = y - lastY.current
        if (Math.abs(delta) > 8) {
          setToolbarHidden(delta > 0 && y > 160)
          lastY.current = y
        }
      } else {
        setToolbarHidden(false)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  // debounce search so the list doesn't refetch on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300)
    return () => clearTimeout(t)
  }, [searchQuery])

  useEffect(() => {
    setGeoFilter((prev) => ({ ...prev, radiusKm }))
  }, [radiusKm])

  // keep the active category chip centered in the scroll strip
  useEffect(() => {
    const el = document.getElementById(`cat-${activeCategory ?? 'All Shops'}`)
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [activeCategory])

  /* ---------- handlers ---------- */
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const clearGeoFilter = () => {
    setGeoFilter((prev) => ({ lat: null, lng: null, radiusKm: prev.radiusKm }))
  }

  const clearAll = () => {
    clearGeoFilter()
    setSearchQuery('')
    setDebouncedQuery('')
    setActiveCategory(null)
    setSortBy('distance')
    setRadiusKm(5)
  }

  const detectLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      toast({ title: 'Location not supported on this browser', status: 'error', duration: 3000, position: 'top' })
      return
    }

    setGeoLoading(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(6))
        const lng = Number(position.coords.longitude.toFixed(6))
        setGeoFilter((prev) => ({ lat, lng, radiusKm: prev.radiusKm }))
        setGeoLoading(false)
        toast({ title: 'Showing shops near you', status: 'success', duration: 2000, position: 'top' })
      },
      (error) => {
        setGeoLoading(false)
        toast({
          title: 'Could not get your location',
          description: error.message || 'Please allow location access and try again.',
          status: 'error',
          duration: 4000,
          position: 'top',
        })
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }, [toast])

  /* ---------- derived ---------- */
  const activeFilterCount = (geoActive ? 1 : 0) + (sortBy !== 'distance' ? 1 : 0) + (radiusKm !== 5 ? 1 : 0)

  const activeTags = [
    geoActive && { key: 'geo', label: `Within ${radiusKm} km`, onRemove: clearGeoFilter },
    sortBy === 'latest' && { key: 'sort', label: 'Latest first', onRemove: () => setSortBy('distance') },
    activeCategory && { key: 'cat', label: activeCategory, onRemove: () => setActiveCategory(null) },
    searchQuery.trim() && { key: 'q', label: `“${searchQuery.trim()}”`, onRemove: () => setSearchQuery('') },
  ].filter(Boolean) as ActiveTag[]

  /* ---------- shared filter controls (inline on desktop, drawer on mobile) ---------- */
  const renderFilters = (vertical: boolean) => (
    <Stack
      direction={vertical ? 'column' : 'row'}
      spacing={vertical ? 6 : 3}
      align={vertical ? 'stretch' : 'center'}
    >
      <Box>
        {vertical && (
          <Text fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="wider" color={subTextColor} mb={2}>
            Distance
          </Text>
        )}
        <HStack spacing={2}>
          {radiusOptions.map((r) => {
            const active = radiusKm === r
            return (
              <Button
                key={r}
                flex={vertical ? 1 : undefined}
                size="sm"
                h="36px"
                px={vertical ? 0 : 3.5}
                borderRadius="full"
                fontWeight="700"
                fontSize="13px"
                onClick={() => setRadiusKm(r)}
                colorScheme={active ? 'brand' : 'gray'}
                variant={active ? 'solid' : 'outline'}
                transition="all 0.2s"
                _active={{ transform: 'scale(0.95)' }}
              >
                {r} km
              </Button>
            )
          })}
        </HStack>
      </Box>

      <Box>
        {vertical && (
          <Text fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="wider" color={subTextColor} mb={2}>
            Sort by
          </Text>
        )}
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'distance' | 'latest')}
          size="sm"
          h={vertical ? '44px' : '36px'}
          w={vertical ? 'full' : '160px'}
          borderRadius="full"
          borderColor={borderColor}
          bg={inputBg}
          fontWeight="600"
        >
          <option value="distance">Nearest first</option>
          <option value="latest">Latest first</option>
        </Select>
      </Box>

      <Box position="relative">
        <Button
          onClick={detectLocation}
          isLoading={geoLoading}
          loadingText="Detecting"
          leftIcon={<Icon as={FiNavigation} />}
          size="sm"
          h={vertical ? '44px' : '36px'}
          w={vertical ? 'full' : 'auto'}
          px={5}
          borderRadius="full"
          colorScheme="brand"
          variant={geoActive ? 'solid' : 'outline'}
          fontWeight="700"
          transition="all 0.2s"
          _hover={{ transform: 'translateY(-1px)' }}
          _active={{ transform: 'scale(0.97)' }}
        >
          {geoActive ? 'Near you' : 'Use my location'}
        </Button>
        {geoActive && (
          <Box position="absolute" top="-2px" right="-2px" w="10px" h="10px">
            <Box position="absolute" inset={0} borderRadius="full" bg="green.400" animation={anim(`${pulseRing} 1.8s ease-out infinite`)} />
            <Box position="absolute" inset={0} borderRadius="full" bg="green.400" border="2px solid" borderColor={surface} />
          </Box>
        )}
      </Box>
    </Stack>
  )

  const pagePx = { base: 3, md: 5, xl: 8 }

  return (
    <Box bg={pageBg} minH="100vh" position="relative" pb={{ base: 0, md: 10 }}>
      {/* ---------- mobile: minimal title ---------- */}
      <Container maxW="100%" px={pagePx} pt={3} display={{ base: 'block', md: 'none' }}>
        <Flex align="center" justify="space-between" animation={anim(`${fadeSlideUp} 0.4s ease-out both`)}>
          <Heading fontSize="lg" fontWeight="800" color={textColor} letterSpacing="-0.02em">
            Explore shops
          </Heading>
          <HStack spacing={1} color={subTextColor}>
            <Icon as={FiMapPin} boxSize={3} color="var(--color-primary)" />
            <Text fontSize="xs" fontWeight="500">
              {geoActive ? `Within ${radiusKm} km` : 'All areas'}
            </Text>
          </HStack>
        </Flex>
      </Container>

      {/* ---------- desktop: slim hero ---------- */}
      <Container maxW="100%" px={pagePx} pt={6} display={{ base: 'none', md: 'block' }}>
        <Box
          position="relative"
          overflow="hidden"
          bgGradient={heroGradient}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="3xl"
          px={10}
          py={8}
          mb={5}
          animation={anim(`${fadeSlideUp} 0.6s ease-out both`)}
        >
          <Box
            position="absolute"
            top="-60px"
            right="8%"
            w="220px"
            h="220px"
            borderRadius="full"
            bg="purple.200"
            opacity={0.4}
            filter="blur(45px)"
            pointerEvents="none"
            animation={anim(`${float} 8s ease-in-out infinite`)}
          />
          <Box
            position="absolute"
            bottom="-70px"
            right="28%"
            w="180px"
            h="180px"
            borderRadius="full"
            bg="blue.200"
            opacity={0.4}
            filter="blur(40px)"
            pointerEvents="none"
            animation={anim(`${float} 10s ease-in-out infinite reverse`)}
          />
          <VStack align="flex-start" spacing={2} position="relative" maxW="2xl">
            <Heading fontSize={{ md: '3xl', lg: '4xl' }} fontWeight="800" color={textColor} letterSpacing="-0.03em" lineHeight="1.1">
              Discover{' '}
              <Box
                as="span"
                bgGradient="linear(to-r, var(--color-primary), var(--color-secondary), var(--color-primary))"
                bgClip="text"
                backgroundSize="200% auto"
                animation={anim(`${shimmer} 6s linear infinite`)}
              >
                shops around you
              </Box>
            </Heading>
            <Text color={subTextColor} fontSize="md" fontWeight="500">
              Browse local stores across every category, filter by distance, and find what you need nearby.
            </Text>
          </VStack>
        </Box>
      </Container>

      {/* ---------- sticky toolbar: search + filters + categories ---------- */}
      {/* If your app has a fixed top navbar, change top={0} to its height */}
      <Box
        position="sticky"
        top={0}
        zIndex={20}
        bg={stickyBg}
        backdropFilter="saturate(180%) blur(12px)"
        borderBottom="1px solid"
        borderColor={borderColor}
        mt={{ base: 2, md: 0 }}
        transform={toolbarHidden && !searchFocused && !isOpen ? 'translateY(-110%)' : 'translateY(0)'}
        transition="transform 0.3s ease"
      >
        <Container maxW="100%" px={pagePx} py={{ base: 2, md: 3 }}>
          <Stack spacing={{ base: 2, md: 3 }}>
            <Flex gap={2} align="center">
              <InputGroup size="md" flex={1} maxW={{ lg: '420px' }}>
                <InputLeftElement pointerEvents="none" h="42px">
                  <SearchIcon color="gray.400" boxSize={3.5} />
                </InputLeftElement>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
                  }}
                  type="search"
                  inputMode="search"
                  enterKeyHint="search"
                  placeholder="Search shops or categories"
                  h="42px"
                  borderRadius="full"
                  bg={inputBg}
                  border="1px solid"
                  borderColor="transparent"
                  fontSize="16px"
                  _placeholder={{ color: 'gray.400' }}
                  _hover={{ borderColor }}
                  _focus={{
                    bg: surface,
                    borderColor: 'purple.400',
                    boxShadow: '0 0 0 4px rgba(124, 58, 237, 0.12)',
                  }}
                  transition="all 0.2s"
                  sx={{ '&::-webkit-search-cancel-button': { display: 'none' } }}
                />
                {searchQuery && (
                  <InputRightElement h="42px">
                    <IconButton
                      aria-label="Clear search"
                      icon={<CloseIcon boxSize={2} />}
                      size="xs"
                      variant="ghost"
                      borderRadius="full"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setSearchQuery('')}
                    />
                  </InputRightElement>
                )}
              </InputGroup>

              {/* filter button: mobile / tablet */}
              <Box display={{ base: 'block', lg: 'none' }} position="relative" flexShrink={0}>
                <IconButton
                  aria-label="Open filters"
                  icon={<Icon as={FiSliders} boxSize={4} />}
                  onClick={onOpen}
                  h="42px"
                  w="42px"
                  borderRadius="full"
                  bg={surface}
                  border="1px solid"
                  borderColor={borderColor}
                  _active={{ transform: 'scale(0.94)' }}
                />
                {activeFilterCount > 0 && (
                  <Flex
                    position="absolute"
                    top="-4px"
                    right="-4px"
                    minW="18px"
                    h="18px"
                    px={1}
                    align="center"
                    justify="center"
                    borderRadius="full"
                    bg="purple.500"
                    color="white"
                    fontSize="10px"
                    fontWeight="800"
                  >
                    {activeFilterCount}
                  </Flex>
                )}
              </Box>

              {/* inline filters: desktop */}
              <Box display={{ base: 'none', lg: 'block' }} ml="auto">
                {renderFilters(false)}
              </Box>
            </Flex>

            {/* category chips */}
            <Box
              mx={{ base: -3, md: 0 }}
              px={{ base: 3, md: 0 }}
              overflowX="auto"
              css={{
                '&::-webkit-scrollbar': { display: 'none' },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                scrollSnapType: 'x proximity',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <HStack spacing={2} w="max-content" pr={3}>
                {categories.map((category, i) => {
                  const isActive =
                    activeCategory === category.label || (category.label === 'All Shops' && !activeCategory)
                  return (
                    <Button
                      key={category.label}
                      id={`cat-${category.label}`}
                      onClick={() => setActiveCategory(category.label === 'All Shops' ? null : category.label)}
                      h="34px"
                      px={3.5}
                      borderRadius="full"
                      fontSize="13px"
                      fontWeight="700"
                      whiteSpace="nowrap"
                      leftIcon={<Icon as={category.icon} boxSize={3.5} />}
                      bg={isActive ? undefined : surface}
                      bgGradient={isActive ? 'linear(to-r, brand.400, brand.500)' : undefined}
                      color={isActive ? 'white' : textColor}
                      border="1px solid"
                      borderColor={isActive ? 'transparent' : borderColor}
                      boxShadow={isActive ? '0 6px 14px rgba(124, 58, 237, 0.28)' : 'none'}
                      transition="all 0.2s"
                      _hover={{
                        transform: 'translateY(-1px)',
                        borderColor: isActive ? 'transparent' : 'brand.300',
                      }}
                      _active={{ transform: 'scale(0.96)' }}
                      sx={{ scrollSnapAlign: 'start' }}
                      animation={anim(`${fadeSlideUp} 0.4s ease-out ${0.04 * i}s both`)}
                    >
                      {category.label}
                    </Button>
                  )
                })}
              </HStack>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* ---------- content ---------- */}
      <Container maxW="100%" px={pagePx} pt={{ base: 3, md: 5 }}>
        {/* active filter tags */}
        {activeTags.length > 0 && (
          <HStack spacing={2} flexWrap="wrap" rowGap={2} mb={3}>
            {activeTags.map((tag) => (
              <Tag
                key={tag.key}
                size="md"
                borderRadius="full"
                colorScheme="brand"
                variant="subtle"
                animation={anim(`${fadeSlideUp} 0.25s ease-out both`)}
              >
                <TagLabel fontWeight="600">{tag.label}</TagLabel>
                <TagCloseButton onClick={tag.onRemove} />
              </Tag>
            ))}
            <Button size="xs" variant="link" colorScheme="brand" onClick={clearAll}>
              Clear all
            </Button>
          </HStack>
        )}

        {/* section heading */}
        <Flex justify="space-between" align="baseline" mb={3}>
          <Heading
            key={activeCategory ?? 'All Shops'}
            fontSize={{ base: 'md', md: 'xl' }}
            fontWeight="800"
            color={textColor}
            letterSpacing="-0.01em"
            animation={anim(`${fadeSlideUp} 0.3s ease-out both`)}
          >
            {activeCategory ?? 'All Shops'}
          </Heading>
          <Text fontSize="xs" color={subTextColor} fontWeight="500">
            {sortBy === 'distance' ? 'Nearest first' : 'Latest first'}
          </Text>
        </Flex>

        <ShopSection
          searchQuery={debouncedQuery}
          activeCategory={activeCategory}
          geoFilter={geoFilter}
          sortBy={sortBy}
        />

        {/* ---------- partner banner ---------- */}
        <Box
          position="relative"
          overflow="hidden"
          mt={{ base: 8, md: 16 }}
          bgGradient={bannerGradient}
          border="1px solid"
          borderColor={borderColor}
          borderRadius={{ base: '2xl', md: '3xl' }}
          px={{ base: 4, md: 10 }}
          py={{ base: 5, md: 8 }}
          transition="all 0.3s"
          _hover={{ boxShadow: '0 12px 30px rgba(124, 58, 237, 0.12)', transform: 'translateY(-2px)' }}
        >
          <Box
            position="absolute"
            top="-30px"
            right="-20px"
            w="140px"
            h="140px"
            borderRadius="full"
            bg="purple.200"
            opacity={0.4}
            filter="blur(35px)"
            pointerEvents="none"
            animation={anim(`${float} 8s ease-in-out infinite`)}
          />
          <Flex
            position="relative"
            direction={{ base: 'column', md: 'row' }}
            align={{ base: 'stretch', md: 'center' }}
            justify="space-between"
            gap={{ base: 3, md: 8 }}
          >
            <Box>
              <Text fontSize="xs" fontWeight="800" letterSpacing="widest" textTransform="uppercase" color="var(--color-primary)" mb={1}>
                For sellers
              </Text>
              <Heading fontSize={{ base: 'md', md: '2xl' }} fontWeight="800" color={textColor}>
                Own a shop? Start selling here
              </Heading>
              <Text fontSize="sm" color={subTextColor} mt={1} maxW="lg">
                List your store and reach customers in your neighbourhood.
              </Text>
            </Box>
            <Button
              leftIcon={<AddIcon boxSize={3} />}
              h={{ base: '44px', md: '48px' }}
              px={8}
              flexShrink={0}
              w={{ base: 'full', md: 'auto' }}
              borderRadius="full"
              color="white"
              fontWeight="700"
              bgGradient="linear(to-r, var(--color-primary), var(--color-secondary), var(--color-primary))"
              backgroundSize="200% auto"
              boxShadow="0 8px 20px rgba(124, 58, 237, 0.3)"
              transition="all 0.25s"
              _hover={{
                animation: anim(`${shimmer} 2s linear infinite`),
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 26px rgba(124, 58, 237, 0.4)',
              }}
              _active={{ transform: 'scale(0.97)' }}
              onClick={() => router.push(authentication.register)}
            >
              Partner With Us
            </Button>
          </Flex>
        </Box>
      </Container>

      {/* ---------- mobile filter drawer ---------- */}
      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
        <DrawerOverlay backdropFilter="blur(2px)" />
        <DrawerContent borderTopRadius="3xl" pb="env(safe-area-inset-bottom)">
          <Box w="40px" h="4px" bg="gray.300" borderRadius="full" mx="auto" mt={3} />
          <DrawerHeader fontSize="lg" fontWeight="800" pb={2}>
            Filters
          </DrawerHeader>
          <DrawerBody py={3}>{renderFilters(true)}</DrawerBody>
          <DrawerFooter gap={3}>
            <Button flex={1} variant="outline" borderRadius="full" h="46px" onClick={clearAll}>
              Reset
            </Button>
            <Button flex={2} colorScheme="brand" borderRadius="full" h="46px" onClick={onClose}>
              Show shops
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* ---------- scroll to top ---------- */}
      <Fade in={showScrollBtn}>
        <IconButton
          icon={<ArrowUpIcon />}
          onClick={scrollToTop}
          position="fixed"
          bottom={{ base: 4, md: 10 }}
          right={{ base: 3, md: 10 }}
          bgGradient="linear(to-br, var(--color-primary), var(--color-secondary))"
          color="white"
          _hover={{ transform: 'translateY(-3px)' }}
          _active={{ transform: 'scale(0.94)' }}
          aria-label="Scroll to top"
          borderRadius="full"
          size="md"
          zIndex={30}
          boxShadow="0 10px 24px rgba(124, 58, 237, 0.35)"
        />
      </Fade>
    </Box>
  )
}

export default ShopsPage