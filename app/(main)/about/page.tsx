'use client'

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  BoxProps,
  Button,
  Circle,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  // keyframes,
  SimpleGrid,
  Stack,
  Text,
  usePrefersReducedMotion,
  VStack,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useRef, useState } from 'react'
import type { IconType } from 'react-icons'
import { FaStar } from 'react-icons/fa'
import {
  FiArrowRight,
  FiBook,
  FiCoffee,
  FiEdit3,
  FiHeart,
  FiHome,
  FiMapPin,
  FiPlusCircle,
  FiPlusSquare,
  FiScissors,
  FiSearch,
  FiShield,
  FiShoppingBag,
  FiShoppingCart,
  FiSmartphone,
  FiTag,
  FiTool,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from 'react-icons/fi'

/* ================= CONFIG ================= */
// Swap these with your real route constants
const ROUTES = { shops: '/shops', becomeVendor: '/register' }

const pagePx = { base: 4, md: 6, lg: 8 }
const ease = 'cubic-bezier(0.22, 1, 0.36, 1)'

/* ================= KEYFRAMES ================= */
const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-12px); }
`
const bob = keyframes`
  0%, 100% { transform: translateY(0) rotate(-1deg); }
  50%      { transform: translateY(-8px) rotate(1deg); }
`
const orbFloat = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%      { transform: translate(14px, -18px) scale(1.08); }
`
const pulseRing = keyframes`
  0%   { transform: scale(1);   opacity: 0.55; }
  100% { transform: scale(2.4); opacity: 0; }
`
const shimmer = keyframes`
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`
const marquee = keyframes`
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
`

/* ================= DATA ================= */
const categories: { label: string; icon: IconType; color: string }[] = [
  { label: 'Grocery', icon: FiShoppingCart, color: 'green.500' },
  { label: 'Fashion', icon: FiShoppingBag, color: 'pink.500' },
  { label: 'Electronics', icon: FiSmartphone, color: 'blue.500' },
  { label: 'Restaurants', icon: FiCoffee, color: 'orange.500' },
  { label: 'Beauty & Salons', icon: FiScissors, color: 'purple.500' },
  { label: 'Home & Living', icon: FiHome, color: 'teal.500' },
  { label: 'Pharmacy', icon: FiPlusSquare, color: 'red.500' },
  { label: 'Repairs & Services', icon: FiTool, color: 'var(--color-primary)' },
  { label: 'Books & Stationery', icon: FiBook, color: 'cyan.600' },
]

const phoneShops = [
  { name: 'Fresh Basket', meta: '0.4 km · Grocery', icon: FiShoppingCart, grad: 'linear(to-br, #34D399, #10B981)' },
  { name: 'Urban Threads', meta: '0.9 km · Fashion', icon: FiShoppingBag, grad: 'linear(to-br, #F472B6, #EC4899)' },
  { name: 'Chai & Co.', meta: '1.2 km · Café', icon: FiCoffee, grad: 'linear(to-br, #FBBF24, #F59E0B)' },
  { name: 'Glow Studio', meta: '1.6 km · Beauty', icon: FiScissors, grad: 'linear(to-br, #A78BFA, #7C3AED)' },
]

const journeys = {
  shopper: [
    { icon: FiSearch, title: 'Find shops near you', desc: 'Search by name or category, or let us find the stores around your location.' },
    { icon: FiTag, title: 'Compare & explore', desc: 'Browse products, ratings and offers before you step out of the house.' },
    { icon: FiShoppingBag, title: 'Shop your way', desc: 'Visit the store in person or order online, whichever suits you.' },
  ],
  vendor: [
    { icon: FiEdit3, title: 'Create your shop', desc: 'Sign up in minutes and add your store details, photos and timings.' },
    { icon: FiPlusCircle, title: 'List products & offers', desc: 'Showcase what you sell and run offers your neighbours will notice.' },
    { icon: FiTrendingUp, title: 'Get discovered', desc: 'Nearby shoppers find you, and your footfall and orders grow.' },
  ],
}

const values = [
  { icon: FiShield, title: 'Trusted vendors', desc: 'Real businesses from your own neighbourhood.' },
  { icon: FiZap, title: 'Simple by design', desc: 'Fast to browse on any phone, easy for vendors to manage.' },
  { icon: FiUsers, title: 'Community driven', desc: 'Every purchase keeps money and jobs close to home.' },
]

const stats = [
  { to: 20, suffix: 'K+', decimals: 0, label: 'Happy shoppers' },
  { to: 500, suffix: '+', decimals: 0, label: 'Local shops' },
  { to: 100, suffix: '+', decimals: 0, label: 'Cities connected' },
  { to: 4.9, suffix: '', decimals: 1, label: 'Average rating' },
]

const reviews = [
  {
    name: 'Priya Sharma',
    role: 'Shopper',
    text: 'BusinessSahayata helped me discover amazing nearby stores and made local shopping incredibly simple.',
    grad: 'linear(to-br, #A78BFA, #7C3AED)',
  },
  {
    name: 'Amit Joshi',
    role: 'Store owner',
    text: 'This platform helped my offline store attract more customers and grow digitally.',
    grad: 'linear(to-br, #60A5FA, #2563EB)',
  },
  {
    name: 'Rohan Mehta',
    role: 'Café owner',
    text: 'Customers now find us on their phones before they walk in. It feels like we finally have a shopfront online.',
    grad: 'linear(to-br, #F472B6, #DB2777)',
  },
]

const faqs = [
  {
    q: 'Is BusinessSahayata free for shoppers?',
    a: 'Yes. Browsing shops, comparing products and finding nearby stores is free for shoppers.',
  },
  {
    q: 'How does nearby search work?',
    a: 'Allow location access and choose a radius from 2 km up to 50 km. We show the shops within that distance, and you stay in control of how far to look.',
  },
  {
    q: 'How do I list my shop?',
    a: 'Create a vendor account, add your shop details and products, and your store becomes visible to shoppers around you.',
  },
  {
    q: 'Can I order online or visit the store?',
    a: 'Both, depending on the shop. Each store page shows how you can buy from them.',
  },
]

/* ================= HOOKS ================= */
const useAnim = () => {
  const reduce = usePrefersReducedMotion()
  return (value: string) => (reduce ? undefined : value)
}

const useInView = <T extends HTMLElement>(threshold = 0.15) => {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return { ref, inView }
}

/* ================= SMALL BUILDING BLOCKS ================= */
// Fades + slides children in when they scroll into view
const Reveal = ({ children, delay = 0, ...rest }: BoxProps & { delay?: number }) => {
  const reduce = usePrefersReducedMotion()
  const { ref, inView } = useInView<HTMLDivElement>()
  const visible = reduce || inView
  return (
    <Box
      ref={ref}
      opacity={visible ? undefined : 0}
      animation={!reduce && inView ? `${fadeSlideUp} 0.8s ${ease} ${delay}s both` : undefined}
      {...rest}
    >
      {children}
    </Box>
  )
}

// Counts up when scrolled into view
const CountUp = ({
  to,
  decimals = 0,
  suffix = '',
  duration = 1600,
}: {
  to: number
  decimals?: number
  suffix?: string
  duration?: number
}) => {
  const reduce = usePrefersReducedMotion()
  const { ref, inView } = useInView<HTMLSpanElement>(0.4)
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setVal(to)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      setVal(to * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration, reduce])

  return (
    <span ref={ref}>
      {val.toFixed(decimals)}
      {suffix}
    </span>
  )
}

const GradientText = ({ children }: { children: ReactNode }) => {
  const anim = useAnim()
  return (
    <Box
      as="span"
      bgGradient="linear(to-r, var(--color-primary), var(--color-secondary), var(--color-primary))"
      bgClip="text"
      backgroundSize="200% auto"
      animation={anim(`${shimmer} 6s linear infinite`)}
    >
      {children}
    </Box>
  )
}

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <Text fontSize="11px" fontWeight="800" letterSpacing="0.14em" textTransform="uppercase" color="var(--color-primary)">
    {children}
  </Text>
)

const SectionHeading = ({ eyebrow, title, sub }: { eyebrow: string; title: ReactNode; sub?: string }) => (
  <VStack spacing={3} textAlign="center" maxW="2xl" mx="auto">
    <Eyebrow>{eyebrow}</Eyebrow>
    <Heading fontSize={{ base: '2xl', md: '4xl' }} fontWeight="800" letterSpacing="-0.02em" lineHeight="1.15" color="var(--color-text)">
      {title}
    </Heading>
    {sub && (
      <Text color="var(--color-text-muted)" fontSize={{ base: 'sm', md: 'lg' }}>
        {sub}
      </Text>
    )}
  </VStack>
)

const cardStyle: BoxProps = {
  bg: 'var(--color-surface)',
  border: '1px solid',
  borderColor: 'var(--color-border)',
  borderRadius: '2xl',
  p: { base: 4, md: 6 },
  boxShadow: 'sm',
  transition: 'all 0.3s ease',
  _hover: {
    transform: 'translateY(-4px)',
    boxShadow: 'lg',
    borderColor: 'var(--color-primary)',
  },
}

const FeatureCard = ({
  icon,
  title,
  desc,
  grad,
  delay = 0,
}: {
  icon: IconType
  title: string
  desc: string
  grad: string
  delay?: number
}) => (
  <Reveal delay={delay} h="full">
    <Box {...cardStyle} h="full">
      <Circle size={{ base: '40px', md: '48px' }} bgGradient={grad} color="white" mb={3} boxShadow="0 8px 18px rgba(79, 70, 229, 0.25)">
        <Icon as={icon} boxSize={{ base: 5, md: 6 }} />
      </Circle>
      <Heading fontSize={{ base: 'sm', md: 'lg' }} fontWeight="800" mb={1.5} color="var(--color-text)">
        {title}
      </Heading>
      <Text fontSize={{ base: 'xs', md: 'sm' }} color="var(--color-text-muted)" lineHeight="1.6">
        {desc}
      </Text>
    </Box>
  </Reveal>
)

const FloatChip = ({
  icon,
  iconColor,
  label,
  delay = 0,
  ...rest
}: BoxProps & { icon: IconType; iconColor: string; label: string; delay?: number }) => {
  const anim = useAnim()
  return (
    <Flex
      position="absolute"
      zIndex={2}
      align="center"
      gap={1.5}
      bg="var(--color-surface)"
      border="1px solid"
      borderColor="var(--color-border)"
      borderRadius="full"
      px={3}
      py={1.5}
      boxShadow="0 10px 24px rgba(79, 70, 229, 0.18)"
      animation={anim(`${bob} 4.5s ease-in-out ${delay}s infinite`)}
      {...rest}
    >
      <Icon as={icon} color={iconColor} boxSize={3.5} />
      <Text fontSize="12px" fontWeight="700" color="var(--color-text)" whiteSpace="nowrap">
        {label}
      </Text>
    </Flex>
  )
}

/* ================= PAGE ================= */
export default function AboutPage() {
  const router = useRouter()
  const anim = useAnim()
  const [tab, setTab] = useState<'shopper' | 'vendor'>('shopper')
  const steps = journeys[tab]

  return (
    <Box bg="var(--color-bg)" color="var(--color-text)" overflow="hidden">
      {/* ================= HERO ================= */}
      <Box position="relative" overflow="hidden" bg="var(--color-bg)">
        {/* dot grid */}
        <Box
          position="absolute"
          inset={0}
          pointerEvents="none"
          opacity={0.5}
          backgroundImage="radial-gradient(var(--color-border) 1.2px, transparent 1.2px)"
          backgroundSize="24px 24px"
          sx={{
            maskImage: 'radial-gradient(ellipse at 50% 30%, black 0%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 30%, black 0%, transparent 70%)',
          }}
        />
        {/* orbs */}
        <Box
          position="absolute"
          top="-80px"
          right="-60px"
          w="260px"
          h="260px"
          borderRadius="full"
          bg="purple.200"
          opacity={0.5}
          filter="blur(60px)"
          pointerEvents="none"
          animation={anim(`${orbFloat} 9s ease-in-out infinite`)}
        />
        <Box
          position="absolute"
          bottom="-60px"
          left="-60px"
          w="240px"
          h="240px"
          borderRadius="full"
          bg="blue.200"
          opacity={0.45}
          filter="blur(60px)"
          pointerEvents="none"
          animation={anim(`${orbFloat} 11s ease-in-out infinite reverse`)}
        />

        <Container maxW="1200px" px={pagePx} position="relative" pt={{ base: 4, sm: 6, md: 14 }} pb={{ base: 6, sm: 8, md: 18 }}>
          <Flex direction={{ base: 'column', lg: 'row' }} align="center" gap={{ base: 4, sm: 6, lg: 14 }}>
            {/* text */}
            <VStack
              flex={1}
              align={{ base: 'center', lg: 'flex-start' }}
              textAlign={{ base: 'center', lg: 'left' }}
              spacing={{ base: 3, sm: 4, md: 5 }}
            >
              <Flex
                align="center"
                gap={2}
                bg="var(--color-surface)"
                border="1px solid"
                borderColor="var(--color-border)"
                borderRadius="full"
                px={3}
                py={1}
                boxShadow="xs"
                animation={anim(`${fadeSlideUp} 0.7s ${ease} both`)}
              >
                <Box position="relative" w="7px" h="7px">
                  <Box position="absolute" inset={0} borderRadius="full" bg="green.400" animation={anim(`${pulseRing} 1.8s ease-out infinite`)} />
                  <Box position="absolute" inset={0} borderRadius="full" bg="green.500" />
                </Box>
                <Text fontSize={{ base: '11px', md: 'xs' }} fontWeight="700" color="var(--color-primary)">
                  Built for local businesses
                </Text>
              </Flex>

              <Heading
                fontSize={{ base: '28px', sm: '36px', md: '48px', lg: '58px' }}
                fontWeight="900"
                lineHeight={{ base: '1.15', md: '1.08' }}
                letterSpacing="-0.03em"
                color="var(--color-text)"
                animation={anim(`${fadeSlideUp} 0.8s ${ease} 0.1s both`)}
              >
                Shop local.
                <br />
                <GradientText>Grow together.</GradientText>
              </Heading>

              <Text
                color="var(--color-text-muted)"
                fontSize={{ base: '13px', sm: 'sm', md: 'lg' }}
                maxW="lg"
                lineHeight={{ base: '1.55', md: '1.7' }}
                animation={anim(`${fadeSlideUp} 0.8s ${ease} 0.2s both`)}
              >
                BusinessSahayata connects neighbours with trusted local shops, making everyday nearby shopping effortless while giving every local store a digital home.
              </Text>

              <Stack
                direction={{ base: 'row', sm: 'row' }}
                spacing={{ base: 2.5, sm: 3 }}
                w={{ base: 'full', sm: 'auto' }}
                animation={anim(`${fadeSlideUp} 0.8s ${ease} 0.3s both`)}
              >
                <Button
                  flex={{ base: 1, sm: 'initial' }}
                  h={{ base: '42px', md: '50px' }}
                  px={{ base: 4, sm: 7 }}
                  borderRadius="full"
                  color="white"
                  fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}
                  fontWeight="700"
                  rightIcon={<FiArrowRight size={14} />}
                  bgGradient="linear(to-r, var(--color-primary), var(--color-secondary), var(--color-primary))"
                  backgroundSize="200% auto"
                  boxShadow="0 8px 20px rgba(124, 58, 237, 0.3)"
                  transition="all 0.25s"
                  _hover={{
                    animation: anim(`${shimmer} 2s linear infinite`),
                    transform: 'translateY(-2px)',
                    boxShadow: '0 14px 30px rgba(124, 58, 237, 0.45)',
                  }}
                  _active={{ transform: 'scale(0.97)' }}
                  onClick={() => router.push(ROUTES.shops)}
                >
                  Explore Shops
                </Button>
                <Button
                  flex={{ base: 1, sm: 'initial' }}
                  h={{ base: '42px', md: '50px' }}
                  px={{ base: 4, sm: 7 }}
                  borderRadius="full"
                  bg="var(--color-surface)"
                  color="var(--color-primary)"
                  fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}
                  border="1px solid"
                  borderColor="var(--color-border)"
                  fontWeight="700"
                  transition="all 0.25s"
                  _hover={{ transform: 'translateY(-2px)', bg: 'purple.50' }}
                  _active={{ transform: 'scale(0.97)' }}
                  onClick={() => router.push(ROUTES.becomeVendor)}
                >
                  Become a Vendor
                </Button>
              </Stack>

              {/* social proof & trust pills */}
              <HStack
                spacing={{ base: 2.5, sm: 3 }}
                pt={{ base: 0.5, md: 1 }}
                animation={anim(`${fadeSlideUp} 0.8s ${ease} 0.4s both`)}
                flexWrap="wrap"
                justify={{ base: 'center', lg: 'flex-start' }}
              >
                <HStack spacing={1.5} bg="var(--color-surface)" px={2.5} py={1} rounded="full" border="1px solid" borderColor="var(--color-border)" boxShadow="xs">
                  <HStack spacing={0.5}>
                    {[...Array(5)].map((_, i) => (
                      <Icon key={i} as={FaStar} color="yellow.400" boxSize={2.5} />
                    ))}
                  </HStack>
                  <Text fontSize={{ base: '11px', md: 'xs' }} fontWeight="700" color="var(--color-text)">
                    4.9 (20K+ shoppers)
                  </Text>
                </HStack>

                <HStack spacing={1.5} bg="var(--color-surface)" px={2.5} py={1} rounded="full" border="1px solid" borderColor="var(--color-border)" boxShadow="xs">
                  <Icon as={FiShoppingBag} color="var(--color-primary)" boxSize={3} />
                  <Text fontSize={{ base: '11px', md: 'xs' }} fontWeight="700" color="var(--color-text)">
                    500+ Local Shops
                  </Text>
                </HStack>
              </HStack>
            </VStack>

            {/* MOBILE NATIVE SPOTLIGHT WIDGET (Compact, native mobile app feel) */}
            <Box
              display={{ base: 'block', lg: 'none' }}
              w="full"
              maxW="440px"
              mx="auto"
              mt={1}
            >
              <Box
                bg="var(--color-surface)"
                border="1px solid"
                borderColor="var(--color-border)"
                borderRadius="2xl"
                p={3}
                boxShadow="0 4px 16px rgba(124, 58, 237, 0.06)"
                position="relative"
                overflow="hidden"
              >
                <Flex justify="space-between" align="center" mb={2}>
                  <HStack spacing={1.5}>
                    <Box position="relative" w="6px" h="6px">
                      <Box position="absolute" inset={0} borderRadius="full" bg="purple.400" animation={anim(`${pulseRing} 1.8s ease-out infinite`)} />
                      <Box position="absolute" inset={0} borderRadius="full" bg="purple.600" />
                    </Box>
                    <Text fontSize="xs" fontWeight="800" color="var(--color-text)">
                      Nearby Shops
                    </Text>
                    <Badge colorScheme="brand" fontSize="9px" rounded="full" px={1.5} py={0.2}>
                      within 3 km
                    </Badge>
                  </HStack>

                  <Button
                    variant="link"
                    size="xs"
                    color="var(--color-primary)"
                    fontWeight="700"
                    rightIcon={<FiArrowRight size={10} />}
                    onClick={() => router.push(ROUTES.shops)}
                    _hover={{ textDecoration: 'none' }}
                  >
                    View all
                  </Button>
                </Flex>

                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2}>
                  {phoneShops.slice(0, 2).map((s) => (
                    <Flex
                      key={s.name}
                      p={2}
                      align="center"
                      gap={2.5}
                      bg="var(--color-surface)"
                      border="1px solid"
                      borderColor="var(--color-border)"
                      borderRadius="xl"
                      as="button"
                      onClick={() => router.push(ROUTES.shops)}
                      textAlign="left"
                      _active={{ bg: 'purple.50', transform: 'scale(0.99)' }}
                      transition="all 0.15s ease"
                    >
                      <Circle size="30px" bgGradient={s.grad} color="white" flexShrink={0}>
                        <Icon as={s.icon} boxSize={3.5} />
                      </Circle>
                      <Box minW={0} flex={1}>
                        <Text fontSize="11px" fontWeight="700" color="var(--color-text)" noOfLines={1}>
                          {s.name}
                        </Text>
                        <Text fontSize="9px" color="var(--color-text-muted)" noOfLines={1}>
                          {s.meta}
                        </Text>
                      </Box>
                      <Badge colorScheme="green" fontSize="8px" rounded="full" px={1.5}>
                        Open
                      </Badge>
                    </Flex>
                  ))}
                </SimpleGrid>

                <Flex
                  mt={2}
                  px={2.5}
                  py={1.5}
                  bg="var(--color-surface-hover)"
                  borderRadius="lg"
                  align="center"
                  justify="space-between"
                >
                  <HStack spacing={1.5}>
                    <Icon as={FiZap} color="var(--color-primary)" boxSize={3} />
                    <Text fontSize="10px" fontWeight="700" color="var(--color-primary)">
                      Same-day local doorstep delivery
                    </Text>
                  </HStack>
                  <Text fontSize="9px" fontWeight="700" color="var(--color-primary)">
                    0% markup
                  </Text>
                </Flex>
              </Box>
            </Box>

            {/* DESKTOP PHONE MOCKUP (Visible on lg and above) */}
            <Box
              display={{ base: 'none', lg: 'block' }}
              position="relative"
              w="full"
              maxW="360px"
              mx="auto"
              flex={1}
            >
              <FloatChip icon={FaStar} iconColor="#FACC15" label="4.9 rating" top="24px" right="0" delay={0} />
              <FloatChip icon={FiMapPin} iconColor="#7C3AED" label="0.4 km away" top="48%" left="0" delay={1} />
              <FloatChip icon={FiTag} iconColor="#10B981" label="20% off today" bottom="40px" right="4px" delay={2} />

              <Box
                position="relative"
                w="262px"
                mx="auto"
                animation={anim(`${float} 7s ease-in-out infinite`)}
              >
                {/* side buttons */}
                <Box position="absolute" left="-9px" top="70px" w="3px" h="28px" bg="var(--color-text)" borderRadius="full" />
                <Box position="absolute" right="-9px" top="100px" w="3px" h="46px" bg="var(--color-text)" borderRadius="full" />

                {/* phone frame */}
                <Box
                  position="relative"
                  display="flex"
                  flexDirection="column"
                  aspectRatio="7 / 12"
                  bg="var(--color-surface)"
                  border="7px solid"
                  borderColor="var(--color-border)"
                  borderRadius="40px"
                  overflow="hidden"
                  boxShadow="0 30px 60px rgba(79, 70, 229, 0.28)"
                >
                  {/* status bar + notch */}
                  <Flex align="center" justify="space-between" px={5} pt="10px" h="30px" flexShrink={0}>
                    <Text fontSize="10px" fontWeight="700" color="var(--color-text)">
                      9:41
                    </Text>
                    <Box position="absolute" top="7px" left="50%" transform="translateX(-50%)" w="62px" h="18px" bg="var(--color-text)" borderRadius="full" />
                    <Box w="14px" h="7px" borderRadius="2px" border="1.5px solid" borderColor="var(--color-text)" position="relative">
                      <Box position="absolute" inset="1px" right="3px" bg="var(--color-text)" borderRadius="1px" />
                    </Box>
                  </Flex>

                  {/* screen content */}
                  <Flex direction="column" flex={1} minH={0} px={3} pt={2}>
                    <HStack justify="space-between" mb={2.5} flexShrink={0}>
                      <Text fontSize="13px" fontWeight="800" color="var(--color-text)">
                        Shops near you
                      </Text>
                      <HStack spacing={1} color="var(--color-primary)">
                        <Icon as={FiMapPin} boxSize={3} />
                        <Text fontSize="10px" fontWeight="700">
                          5 km
                        </Text>
                      </HStack>
                    </HStack>

                    <HStack bg="var(--color-surface-hover)" borderRadius="full" px={3} h="30px" spacing={2} mb={2.5} flexShrink={0}>
                      <Icon as={FiSearch} boxSize={3} color="var(--color-text-muted)" />
                      <Text fontSize="11px" color="var(--color-text-muted)">
                        Search shops
                      </Text>
                    </HStack>

                    <HStack spacing={1.5} mb={2.5} overflow="hidden" flexShrink={0}>
                      {['All', 'Grocery', 'Café', 'Fashion'].map((c, i) => (
                        <Box
                          key={c}
                          px={2.5}
                          py={1}
                          borderRadius="full"
                          fontSize="10px"
                          fontWeight="700"
                          bg={i === 0 ? 'var(--color-primary)' : 'var(--color-surface-hover)'}
                          color={i === 0 ? 'white' : 'var(--color-text-muted)'}
                        >
                          {c}
                        </Box>
                      ))}
                    </HStack>

                    {/* promo banner */}
                    <Flex
                      align="center"
                      justify="space-between"
                      px={3}
                      py={2.5}
                      mb={2.5}
                      borderRadius="xl"
                      color="white"
                      flexShrink={0}
                      bgGradient="linear(to-r, var(--color-primary), var(--color-secondary))"
                    >
                      <Box>
                        <Text fontSize="9px" fontWeight="700" opacity={0.85} textTransform="uppercase" letterSpacing="0.08em">
                          Flash sale nearby
                        </Text>
                        <Text fontSize="12px" fontWeight="800">
                          Up to 20% off
                        </Text>
                      </Box>
                      <Circle size="26px" bg="whiteAlpha.300">
                        <Icon as={FiTag} boxSize={3.5} />
                      </Circle>
                    </Flex>

                    {/* shop list */}
                    <Box position="relative" flex={1} minH={0} overflow="hidden">
                      <VStack spacing={2} align="stretch">
                        {phoneShops.map((s, i) => (
                          <HStack
                            key={s.name}
                            p={2}
                            spacing={2.5}
                            border="1px solid"
                            borderColor="var(--color-border)"
                            borderRadius="xl"
                            animation={anim(`${fadeSlideUp} 0.6s ${ease} ${0.5 + i * 0.15}s both`)}
                          >
                            <Circle size="34px" bgGradient={s.grad} color="white" flexShrink={0}>
                              <Icon as={s.icon} boxSize={4} />
                            </Circle>
                            <VStack align="flex-start" spacing={0} flex={1} minW={0}>
                              <Text fontSize="12px" fontWeight="700" color="var(--color-text)" noOfLines={1}>
                                {s.name}
                              </Text>
                              <Text fontSize="10px" color="var(--color-text-muted)" noOfLines={1}>
                                {s.meta}
                              </Text>
                            </VStack>
                            <Badge colorScheme="green" fontSize="9px" borderRadius="full" px={2}>
                              Open
                            </Badge>
                          </HStack>
                        ))}
                      </VStack>
                      <Box position="absolute" bottom={0} left={0} right={0} h="32px" bgGradient="linear(to-t, var(--color-surface), transparent)" pointerEvents="none" />
                    </Box>
                  </Flex>

                  {/* bottom tab bar */}
                  <Box flexShrink={0} borderTop="1px solid" borderColor="var(--color-border)" bg="var(--color-surface)">
                    <HStack justify="space-around" px={3} pt={2.5}>
                      {[
                        { icon: FiHome, active: true },
                        { icon: FiSearch, active: false },
                        { icon: FiHeart, active: false },
                        { icon: FiShoppingBag, active: false },
                      ].map((t, i) => (
                        <Icon key={i} as={t.icon} boxSize={4} color={t.active ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
                      ))}
                    </HStack>
                    <Box w="64px" h="4px" bg="var(--color-border)" borderRadius="full" mx="auto" mt={2.5} mb={1.5} />
                  </Box>
                </Box>
              </Box>
            </Box>

          </Flex>
        </Container>
      </Box>

      {/* ================= CATEGORY MARQUEE ================= */}
      <Box borderY="1px solid" borderColor="var(--color-border)" bg="var(--color-surface)" py={4} overflow="hidden">
        <Text textAlign="center" fontSize="11px" fontWeight="700" letterSpacing="0.12em" textTransform="uppercase" color="var(--color-text-muted)" mb={3}>
          Shops across every category
        </Text>
        <Box
          overflow="hidden"
          sx={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}
        >
          <Flex
            w="max-content"
            mt={2}
            gap={3}
            pr={3}
            animation={anim(`${marquee} 38s linear infinite`)}
            _hover={{ animationPlayState: 'paused' }}
          >
            {[...categories, ...categories].map((c, i) => (
              <HStack
                key={`${c.label}-${i}`}
                spacing={2}
                px={4}
                py={2}
                bg="var(--color-surface)"
                border="1px solid"
                borderColor="var(--color-border)"
                borderRadius="full"
                flexShrink={0}
                transition="all 0.2s"
                _hover={{ borderColor: 'purple.300', transform: 'translateY(-2px)' }}
              >
                <Icon as={c.icon} color={c.color} boxSize={4} />
                <Text fontSize="13px" fontWeight="700" color="var(--color-text)" whiteSpace="nowrap">
                  {c.label}
                </Text>
              </HStack>
            ))}
          </Flex>
        </Box>
      </Box>

      {/* ================= FEATURES (BENTO) ================= */}
      <Container maxW="1200px" px={pagePx} py={{ base: 12, md: 20 }}>
        <Reveal>
          <SectionHeading
            eyebrow="Why BusinessSahayata"
            title={
              <>
                Built for <GradientText>local growth</GradientText>
              </>
            }
            sub="Simple tools that work for the people shopping and the people selling."
          />
        </Reveal>

        <SimpleGrid columns={{ base: 2, md: 3 }} spacing={{ base: 3, md: 5 }} mt={{ base: 8, md: 12 }}>
          {/* big discover card */}
          <Reveal gridColumn="span 2" h="full">
            <Flex
              {...cardStyle}
              h="full"
              direction={{ base: 'column', md: 'row' }}
              align="center"
              gap={{ base: 4, md: 8 }}
              bg="var(--color-surface)"
              overflow="hidden"
            >
              <Box position="relative" w="150px" h="150px" flexShrink={0}>
                {['0px', '25px', '50px'].map((inset) => (
                  <Box key={inset} position="absolute" inset={inset} borderRadius="full" border="1.5px solid" borderColor="var(--color-border)" />
                ))}
                <Box
                  position="absolute"
                  inset="53px"
                  borderRadius="full"
                  bg="purple.300"
                  animation={anim(`${pulseRing} 2.4s ease-out infinite`)}
                />
                <Circle
                  size="44px"
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  bgGradient="linear(to-br, var(--color-primary), var(--color-secondary))"
                  color="white"
                  boxShadow="0 8px 18px rgba(124, 58, 237, 0.4)"
                >
                  <Icon as={FiMapPin} boxSize={5} />
                </Circle>
                {[
                  { top: '8px', left: '70px', c: 'green.400', d: 0 },
                  { top: '88px', left: '8px', c: 'pink.400', d: 0.8 },
                  { top: '104px', left: '112px', c: 'orange.400', d: 1.6 },
                ].map((dot) => (
                  <Circle
                    key={dot.c}
                    size="12px"
                    position="absolute"
                    top={dot.top}
                    left={dot.left}
                    bg={dot.c}
                    border="2px solid white"
                    boxShadow="sm"
                    animation={anim(`${bob} 3.5s ease-in-out ${dot.d}s infinite`)}
                  />
                ))}
              </Box>

              <Box textAlign={{ base: 'center', md: 'left' }}>
                <Heading fontSize={{ base: 'lg', md: '2xl' }} fontWeight="800" color="var(--color-text)" mb={2}>
                  Discover shops right around you
                </Heading>
                <Text fontSize={{ base: 'sm', md: 'md' }} color="var(--color-text-muted)" lineHeight="1.7">
                  Pick your radius from 2 km to 50 km and see every shop nearby: groceries, salons, cafés, repairs and more.
                </Text>
              </Box>
            </Flex>
          </Reveal>

          <FeatureCard
            icon={FiShoppingBag}
            title="Empowering vendors"
            desc="A digital storefront for products and offers, no tech skills needed."
            grad="linear(to-br, #6366F1, #2563EB)"
            delay={0.05}
          />
          <FeatureCard
            icon={FiHeart}
            title="Community first"
            desc="Every purchase keeps money and jobs in your neighbourhood."
            grad="linear(to-br, #F472B6, #DB2777)"
            delay={0.1}
          />
          <FeatureCard
            icon={FiShield}
            title="Clear & trustworthy"
            desc="See ratings, prices and shop details before you step out."
            grad="linear(to-br, #34D399, #059669)"
            delay={0.15}
          />
          <FeatureCard
            icon={FiZap}
            title="Fast on every phone"
            desc="Light, smooth and easy to use, built mobile-first."
            grad="linear(to-br, #FBBF24, #F59E0B)"
            delay={0.2}
          />
        </SimpleGrid>
      </Container>

      {/* ================= HOW IT WORKS ================= */}
      <Box bg="var(--color-surface)" borderY="1px solid" borderColor="var(--color-border)">
        <Container maxW="1200px" px={pagePx} py={{ base: 12, md: 20 }}>
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 8, lg: 16 }} alignItems="start">
            <Reveal>
              <VStack
                align={{ base: 'center', lg: 'flex-start' }}
                textAlign={{ base: 'center', lg: 'left' }}
                spacing={4}
                position={{ lg: 'sticky' }}
                top={{ lg: '120px' }}
              >
                <Eyebrow>Simple process</Eyebrow>
                <Heading fontSize={{ base: '2xl', md: '4xl' }} fontWeight="800" letterSpacing="-0.02em" lineHeight="1.15" color="var(--color-text)">
                  Up and running in <GradientText>3 easy steps</GradientText>
                </Heading>
                <Text color="var(--color-text-muted)" fontSize={{ base: 'sm', md: 'lg' }} maxW="md">
                  Whether you’re here to shop or to sell, getting started takes just a few minutes.
                </Text>

                {/* segmented toggle */}
                <Flex
                  position="relative"
                  w="full"
                  maxW="360px"
                  bg="var(--color-surface)"
                  border="1px solid"
                  borderColor="var(--color-border)"
                  borderRadius="full"
                  p="4px"
                  boxShadow="sm"
                  mt={2}
                >
                  <Box
                    position="absolute"
                    top="4px"
                    bottom="4px"
                    left="4px"
                    w="calc(50% - 4px)"
                    borderRadius="full"
                    bgGradient="linear(to-r, var(--color-primary), var(--color-secondary))"
                    boxShadow="0 6px 14px rgba(124, 58, 237, 0.35)"
                    transform={tab === 'vendor' ? 'translateX(100%)' : 'translateX(0)'}
                    transition={`transform 0.4s ${ease}`}
                  />
                  {(['shopper', 'vendor'] as const).map((key) => (
                    <Button
                      key={key}
                      flex={1}
                      h="42px"
                      variant="unstyled"
                      position="relative"
                      zIndex={1}
                      fontSize="sm"
                      fontWeight="700"
                      borderRadius="full"
                      color={tab === key ? 'white' : 'var(--color-text-muted)'}
                      transition="color 0.25s"
                      onClick={() => setTab(key)}
                    >
                      {key === 'shopper' ? 'For Shoppers' : 'For Vendors'}
                    </Button>
                  ))}
                </Flex>
              </VStack>
            </Reveal>

            {/* timeline */}
            <Box key={tab}>
              {steps.map((s, i) => (
                <Flex
                  key={s.title}
                  gap={4}
                  align="stretch"
                  animation={anim(`${fadeSlideUp} 0.6s ${ease} ${i * 0.12}s both`)}
                >
                  <Flex direction="column" align="center" flexShrink={0}>
                    <Circle
                      size="46px"
                      position="relative"
                      bgGradient="linear(to-br, var(--color-primary), var(--color-secondary))"
                      color="white"
                      boxShadow="0 8px 18px rgba(124, 58, 237, 0.3)"
                    >
                      <Icon as={s.icon} boxSize={5} />
                      <Circle
                        size="18px"
                        position="absolute"
                        top="-4px"
                        right="-4px"
                        bg="var(--color-surface)"
                        color="var(--color-primary)"
                        fontSize="10px"
                        fontWeight="800"
                        boxShadow="sm"
                      >
                        {i + 1}
                      </Circle>
                    </Circle>
                    {i < steps.length - 1 && (
                      <Box flex={1} w="2px" minH="20px" my={1} borderRadius="full" bgGradient="linear(to-b, var(--color-secondary), var(--color-surface-hover))" />
                    )}
                  </Flex>

                  <Box {...cardStyle} flex={1} mb={i < steps.length - 1 ? 4 : 0}>
                    <Heading fontSize={{ base: 'md', md: 'lg' }} fontWeight="800" color="var(--color-text)">
                      {s.title}
                    </Heading>
                    <Text fontSize="sm" color="var(--color-text-muted)" mt={1} lineHeight="1.6">
                      {s.desc}
                    </Text>
                  </Box>
                </Flex>
              ))}
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* ================= STORY + STATS ================= */}
      <Container maxW="1200px" px={pagePx} py={{ base: 12, md: 20 }}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 8, lg: 14 }} alignItems="center">
          <Reveal>
            <VStack align={{ base: 'center', lg: 'flex-start' }} textAlign={{ base: 'center', lg: 'left' }} spacing={4}>
              <Eyebrow>Our story</Eyebrow>
              <Heading fontSize={{ base: '2xl', md: '4xl' }} fontWeight="800" letterSpacing="-0.02em" lineHeight="1.15" color="var(--color-text)">
                Local shops deserve a <GradientText>modern storefront</GradientText>
              </Heading>
              <Text color="var(--color-text-muted)" fontSize={{ base: 'sm', md: 'lg' }} lineHeight="1.8">
                The best shops are often the ones around the corner, but they’re hard to find online. BusinessSahayata bridges
                that gap: shoppers discover trusted stores nearby, and vendors get the digital visibility and tools to grow.
              </Text>

              <VStack align="stretch" spacing={3} w="full" pt={2}>
                {values.map((v) => (
                  <HStack
                    key={v.title}
                    align="center"
                    spacing={3.5}
                    textAlign="left"
                    p={3}
                    borderRadius="2xl"
                    transition="all 0.25s"
                    _hover={{ bg: 'var(--color-surface-hover)', transform: 'translateX(4px)' }}
                  >
                    <Circle size="42px" bg="var(--color-surface-hover)" color="var(--color-primary)" flexShrink={0}>
                      <Icon as={v.icon} boxSize={5} />
                    </Circle>
                    <Box>
                      <Text fontWeight="700" color="var(--color-text)" fontSize="sm">
                        {v.title}
                      </Text>
                      <Text color="var(--color-text-muted)" fontSize="sm">
                        {v.desc}
                      </Text>
                    </Box>
                  </HStack>
                ))}
              </VStack>
            </VStack>
          </Reveal>

          <Reveal delay={0.1}>
            <Box
              position="relative"
              overflow="hidden"
              color="white"
              borderRadius="3xl"
              p={{ base: 6, md: 10 }}
              bgGradient="linear(to-br, #0F172A, #1E1B4B, #312E81)"
              boxShadow="0 24px 50px rgba(49, 46, 129, 0.35)"
            >
              <Box
                position="absolute"
                top="-60px"
                right="-40px"
                w="200px"
                h="200px"
                borderRadius="full"
                bg="purple.500"
                opacity={0.35}
                filter="blur(50px)"
                animation={anim(`${orbFloat} 9s ease-in-out infinite`)}
              />
              <Box
                position="absolute"
                bottom="-70px"
                left="-40px"
                w="200px"
                h="200px"
                borderRadius="full"
                bg="blue.500"
                opacity={0.3}
                filter="blur(50px)"
                animation={anim(`${orbFloat} 12s ease-in-out infinite reverse`)}
              />
              <Box position="relative">
                <Text fontSize="11px" fontWeight="800" letterSpacing="0.14em" textTransform="uppercase" color="var(--color-secondary)" mb={1}>
                  Our impact
                </Text>
                <Heading fontSize={{ base: 'xl', md: '2xl' }} fontWeight="800" mb={6}>
                  Growing with every neighbourhood
                </Heading>
                <SimpleGrid columns={2} spacing={0}>
                  {stats.map((s, i) => (
                    <Box
                      key={s.label}
                      py={5}
                      pl={i % 2 === 1 ? 5 : 0}
                      borderLeft={i % 2 === 1 ? '1px solid' : 'none'}
                      borderTop={i > 1 ? '1px solid' : 'none'}
                      borderColor="whiteAlpha.200"
                    >
                      <Text
                        fontSize={{ base: '3xl', md: '5xl' }}
                        fontWeight="900"
                        lineHeight="1"
                        bgGradient="linear(to-r, #FFFFFF, #DDD6FE)"
                        bgClip="text"
                        sx={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        <CountUp to={s.to} decimals={s.decimals} suffix={s.suffix} />
                      </Text>
                      <Text fontSize="sm" color="whiteAlpha.700" mt={1.5}>
                        {s.label}
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            </Box>
          </Reveal>
        </SimpleGrid>
      </Container>

      {/* ================= TESTIMONIALS ================= */}
      <Box bg="var(--color-surface)" borderY="1px solid" borderColor="var(--color-border)" py={{ base: 12, md: 20 }}>
        <Container maxW="1200px" px={pagePx}>
          <Reveal>
            <SectionHeading
              eyebrow="Loved by our community"
              title={
                <>
                  Real stories, <GradientText>real neighbours</GradientText>
                </>
              }
              sub="What shoppers and shop owners say about us."
            />
          </Reveal>

          <Flex
            mt={{ base: 8, md: 12 }}
            gap={4}
            mx={{ base: -4, md: 0 }}
            px={{ base: 4, md: 0 }}
            pb={3}
            overflowX={{ base: 'auto', md: 'visible' }}
            flexWrap={{ base: 'nowrap', md: 'wrap' }}
            css={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              '&::-webkit-scrollbar': { display: 'none' },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {reviews.map((r, i) => (
              <Reveal
                key={r.name}
                delay={i * 0.1}
                flexShrink={0}
                w={{ base: '82%', md: 'calc((100% - 32px) / 3)' }}
                sx={{ scrollSnapAlign: 'start' }}
              >
                <Box {...cardStyle} h="full" p={{ base: 5, md: 6 }} display="flex" flexDirection="column">
                  <Text fontSize="5xl" lineHeight="0.6" fontWeight="900" color="var(--color-secondary)" mb={2}>
                    “
                  </Text>
                  <HStack spacing={0.5} mb={3}>
                    {[...Array(5)].map((_, k) => (
                      <Icon key={k} as={FaStar} color="yellow.400" boxSize={3.5} />
                    ))}
                  </HStack>
                  <Text color="var(--color-text)" fontSize="sm" lineHeight="1.75" flex={1}>
                    {r.text}
                  </Text>
                  <HStack spacing={3} mt={5} pt={4} borderTop="1px solid" borderColor="var(--color-border)">
                    <Circle size="40px" bgGradient={r.grad} color="white" fontWeight="800" fontSize="sm">
                      {r.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </Circle>
                    <Box>
                      <Text fontWeight="700" fontSize="sm" color="var(--color-text)">
                        {r.name}
                      </Text>
                      <Text fontSize="xs" color="var(--color-text-muted)">
                        {r.role}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
              </Reveal>
            ))}
          </Flex>
        </Container>
      </Box>

      {/* ================= FAQ ================= */}
      <Container maxW="760px" px={pagePx} py={{ base: 12, md: 20 }}>
        <Reveal>
          <SectionHeading eyebrow="Good to know" title="Questions, answered" />
        </Reveal>
        <Reveal delay={0.1} mt={{ base: 8, md: 10 }}>
          <Accordion allowToggle>
            {faqs.map((f) => (
              <AccordionItem
                key={f.q}
                border="1px solid"
                borderColor="var(--color-border)"
                _last={{ borderBottomWidth: '1px' }}
                borderRadius="2xl"
                bg="var(--color-surface)"
                mb={3}
                overflow="hidden"
                boxShadow="0 2px 10px rgba(79, 70, 229, 0.05)"
              >
                <AccordionButton py={4} px={5} _hover={{ bg: 'var(--color-surface-hover)' }} _expanded={{ bg: 'var(--color-surface-hover)', color: 'var(--color-primary)' }}>
                  <Box flex="1" textAlign="left" fontWeight="700" fontSize={{ base: 'sm', md: 'md' }}>
                    {f.q}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={5} px={5} color="var(--color-text-muted)" fontSize="sm" lineHeight="1.75">
                  {f.a}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>

      {/* ================= CTA ================= */}
      <Container maxW="1100px" px={pagePx} pb={{ base: 10, md: 20 }}>
        <Reveal>
          <Box
            position="relative"
            overflow="hidden"
            borderRadius={{ base: '2xl', md: '3xl' }}
            px={{ base: 5, md: 16 }}
            py={{ base: 10, md: 16 }}
            textAlign="center"
            color="white"
            bgGradient="linear(to-br, var(--color-primary), var(--color-secondary))"
            boxShadow="0 24px 50px rgba(6, 95, 104, 0.35)"
          >
            <Box
              position="absolute"
              top="-60px"
              left="-40px"
              w="220px"
              h="220px"
              borderRadius="full"
              bg="whiteAlpha.300"
              filter="blur(50px)"
              animation={anim(`${orbFloat} 10s ease-in-out infinite`)}
            />
            <Box
              position="absolute"
              bottom="-80px"
              right="-40px"
              w="240px"
              h="240px"
              borderRadius="full"
              bg="blue.300"
              opacity={0.4}
              filter="blur(60px)"
              animation={anim(`${orbFloat} 12s ease-in-out infinite reverse`)}
            />

            <VStack position="relative" spacing={{ base: 4, md: 5 }}>
              <Box position="relative">
                <Circle position="absolute" inset={0} bg="whiteAlpha.500" animation={anim(`${pulseRing} 2.2s ease-out infinite`)} />
                <Circle size="56px" position="relative" bg="var(--color-surface)" color="var(--color-primary)" boxShadow="xl">
                  <Icon as={FiShoppingBag} boxSize={6} />
                </Circle>
              </Box>
              <Heading fontSize={{ base: '2xl', md: '4xl' }} fontWeight="800" letterSpacing="-0.02em" lineHeight="1.2">
                Your neighbourhood is waiting
              </Heading>
              <Text color="whiteAlpha.900" fontSize={{ base: 'sm', md: 'lg' }} maxW="xl" lineHeight="1.7">
                Join the shoppers and shop owners building a smarter, stronger and more connected local community.
              </Text>
              <Stack direction={{ base: 'column', sm: 'row' }} spacing={3} w={{ base: 'full', sm: 'auto' }} pt={2}>
                <Button
                  h="52px"
                  px={9}
                  borderRadius="full"
                  bg="var(--color-surface)"
                  color="var(--color-primary)"
                  fontWeight="700"
                  rightIcon={<FiArrowRight />}
                  transition="all 0.25s"
                  _hover={{ transform: 'translateY(-2px)', boxShadow: '0 12px 26px rgba(0,0,0,0.25)' }}
                  _active={{ transform: 'scale(0.97)' }}
                  onClick={() => router.push(ROUTES.shops)}
                >
                  Explore Shops
                </Button>
                <Button
                  h="52px"
                  px={9}
                  borderRadius="full"
                  variant="outline"
                  color="white"
                  borderColor="whiteAlpha.500"
                  fontWeight="700"
                  transition="all 0.25s"
                  _hover={{ bg: 'whiteAlpha.200', transform: 'translateY(-2px)' }}
                  _active={{ transform: 'scale(0.97)' }}
                  onClick={() => router.push(ROUTES.becomeVendor)}
                >
                  Become a Vendor
                </Button>
              </Stack>
            </VStack>
          </Box>
        </Reveal>
      </Container>
    </Box>
  )
}