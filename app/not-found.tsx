'use client'

import {
  Box,
  Button,
  Circle,
  Flex,
  Heading,
  Icon,
  // keyframes,
  Stack,
  Text,
  usePrefersReducedMotion,
  VStack,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { IconType } from 'react-icons'
import {
  FiArrowLeft,
  FiCoffee,
  FiCompass,
  FiGift,
  FiHome,
  FiMapPin,
  FiShoppingBag,
  FiShoppingCart,
  FiTag,
} from 'react-icons/fi'

/* ================= KEYFRAMES ================= */
const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`
const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50%      { transform: translateY(-14px) rotate(3deg); }
`
const swing = keyframes`
  0%, 100% { transform: rotate(-5deg); }
  50%      { transform: rotate(5deg); }
`
const hop = keyframes`
  0%, 100% { transform: translateY(0) scale(1); }
  40%      { transform: translateY(-12px) scale(1.06, 0.96); }
  60%      { transform: translateY(-12px) scale(1.06, 0.96); }
`
const pulseRing = keyframes`
  0%   { transform: scale(1);   opacity: 0.5; }
  100% { transform: scale(1.9); opacity: 0; }
`
const jiggle = keyframes`
  0%   { transform: rotate(0) scale(1); }
  20%  { transform: rotate(-12deg) scale(1.08); }
  40%  { transform: rotate(10deg) scale(1.04); }
  60%  { transform: rotate(-6deg); }
  80%  { transform: rotate(3deg); }
  100% { transform: rotate(0) scale(1); }
`
const popIn = keyframes`
  from { opacity: 0; transform: scale(0.6) rotate(-8deg); }
  to   { opacity: 1; transform: scale(1) rotate(0); }
`
const textSwap = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`
const burst = keyframes`
  0%   { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--x), var(--y)) scale(0.2); opacity: 0; }
`
const orbFloat = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%      { transform: translate(16px, -20px) scale(1.08); }
`
const shimmer = keyframes`
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`

/* ================= DATA ================= */
const ease = 'cubic-bezier(0.22, 1, 0.36, 1)'

const messages = [
  'This page stepped out for a chai break.',
  'The shop you’re looking for may have moved or closed.',
  'Our map doesn’t show this address. Yet.',
  'Let’s get you back to shops that are open.',
]

type Floater = {
  icon: IconType
  pos: { top?: string; left?: string; right?: string; bottom?: string }
  color: string
  bg: string
  depth: number
  delay: number
}

const floaters: Floater[] = [
  { icon: FiShoppingBag, pos: { top: '9%', left: '7%' }, color: 'purple.500', bg: 'purple.50', depth: 18, delay: 0 },
  { icon: FiTag, pos: { top: '15%', right: '7%' }, color: 'pink.500', bg: 'pink.50', depth: -22, delay: 0.8 },
  { icon: FiCoffee, pos: { top: '58%', left: '5%' }, color: 'orange.500', bg: 'orange.50', depth: 26, delay: 1.4 },
  { icon: FiGift, pos: { top: '66%', right: '6%' }, color: 'blue.500', bg: 'blue.50', depth: -16, delay: 0.4 },
  { icon: FiShoppingCart, pos: { bottom: '7%', left: '22%' }, color: 'green.500', bg: 'green.50', depth: 14, delay: 1.9 },
  { icon: FiMapPin, pos: { bottom: '12%', right: '24%' }, color: 'purple.400', bg: 'purple.50', depth: -12, delay: 1.1 },
]

const particleColors = ['#8B5CF6', '#F472B6', '#FBBF24', '#34D399', '#60A5FA']
const particles = Array.from({ length: 14 }, (_, i) => {
  const angle = (i * (360 / 14) * Math.PI) / 180
  const dist = 64 + (i % 3) * 20
  return {
    x: Math.round(Math.cos(angle) * dist),
    y: Math.round(Math.sin(angle) * dist),
    c: particleColors[i % particleColors.length],
    s: 7 + (i % 3) * 2,
  }
})

/* ================= PAGE ================= */
export default function NotFoundPage() {
  const router = useRouter()
  const reduce = usePrefersReducedMotion()
  const anim = (value: string) => (reduce ? undefined : value)

  const [isOpen, setIsOpen] = useState(false) // the hanging sign
  const [msgIdx, setMsgIdx] = useState(0)
  const [taps, setTaps] = useState(0) // taps on the pin
  const [wiggleL, setWiggleL] = useState(0)
  const [wiggleR, setWiggleR] = useState(0)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })

  // rotate the helper message
  useEffect(() => {
    const t = setInterval(() => setMsgIdx((i) => (i + 1) % messages.length), 3400)
    return () => clearInterval(t)
  }, [])

  const handleGoHome = () => router.push('/')
  const handleShops = () => router.push('/shops')
  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) router.back()
    else router.push('/')
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (reduce) return
    setPointer({
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
    })
  }

  const digitProps = {
    as: 'span' as const,
    'aria-hidden': true,
    display: 'inline-block',
    fontSize: { base: '112px', md: '190px' },
    fontWeight: 900,
    lineHeight: 1,
    letterSpacing: '-0.05em',
    bgGradient: 'linear(to-b, #8B5CF6, #4F46E5)',
    bgClip: 'text' as const,
    cursor: 'pointer',
    userSelect: 'none' as const,
    transition: 'transform 0.2s',
    _active: { transform: 'scale(0.92)' },
    sx: { WebkitTapHighlightColor: 'transparent' },
  }

  return (
    <Box
      position="relative"
      overflow="hidden"
      minH="100vh"
      sx={{ minHeight: '100dvh' }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
      py={{ base: 6, md: 10 }}
      bgGradient="linear(to-b, #F5F3FF 0%, #FFFFFF 100%)"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
    >
      {/* dot grid */}
      <Box
        position="absolute"
        inset={0}
        pointerEvents="none"
        opacity={0.5}
        backgroundImage="radial-gradient(#C4B5FD 1.2px, transparent 1.2px)"
        backgroundSize="24px 24px"
        sx={{
          maskImage: 'radial-gradient(ellipse at 50% 40%, black 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, black 0%, transparent 70%)',
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
        bottom="-70px"
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

      {/* floating shop icons with pointer parallax */}
      {floaters.map((f, i) => (
        <Box
          key={i}
          position="absolute"
          {...f.pos}
          pointerEvents="none"
          zIndex={0}
          transform={`translate3d(${pointer.x * f.depth}px, ${pointer.y * f.depth}px, 0)`}
          transition="transform 0.25s ease-out"
        >
          <Circle
            size={{ base: '40px', md: '56px' }}
            bg={f.bg}
            border="1px solid"
            borderColor="whiteAlpha.900"
            boxShadow="0 10px 24px rgba(79, 70, 229, 0.15)"
            animation={anim(`${float} ${5 + (i % 3)}s ease-in-out ${f.delay}s infinite`)}
          >
            <Icon as={f.icon} color={f.color} boxSize={{ base: 4.5, md: 6 }} />
          </Circle>
        </Box>
      ))}

      {/* content */}
      <VStack position="relative" zIndex={1} spacing={0} textAlign="center" maxW="lg" w="full">
        {/* hanging sign */}
        <Box transformOrigin="top center" animation={anim(`${swing} 4s ease-in-out infinite`)} mb={{ base: 2, md: 4 }}>
          <Flex direction="column" align="center">
            <Box w="2px" h="34px" bg="purple.300" />
            <Box
              role="button"
              tabIndex={0}
              aria-label={isOpen ? 'Sign says open. Tap to flip.' : 'Sign says closed. Tap to flip.'}
              onClick={() => setIsOpen((v) => !v)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsOpen((v) => !v)}
              position="relative"
              cursor="pointer"
              userSelect="none"
              px={7}
              py={3}
              borderRadius="2xl"
              color="white"
              bgGradient={isOpen ? 'linear(to-br, #34D399, #059669)' : 'linear(to-br, #F87171, #DC2626)'}
              boxShadow={isOpen ? '0 12px 26px rgba(5, 150, 105, 0.35)' : '0 12px 26px rgba(220, 38, 38, 0.3)'}
              transition="box-shadow 0.3s, transform 0.15s"
              _active={{ transform: 'scale(0.94)' }}
              sx={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Circle size="8px" bg="white" position="absolute" top="-4px" left="50%" ml="-4px" opacity={0.9} />
              <Box key={String(isOpen)} animation={anim(`${popIn} 0.4s ${ease} both`)}>
                <Text fontSize="xl" fontWeight="900" letterSpacing="0.14em" lineHeight="1.1">
                  {isOpen ? 'OPEN' : 'CLOSED'}
                </Text>
                <Text fontSize="10px" fontWeight="600" opacity={0.9} mt={0.5}>
                  {isOpen ? '…but not this page' : 'Tap to flip'}
                </Text>
              </Box>
            </Box>
          </Flex>
        </Box>

        {/* 4 [pin] 4 */}
        <Flex align="center" justify="center" mt={{ base: 2, md: 4 }} role="img" aria-label="404">
          <Text key={`l-${wiggleL}`} {...digitProps} onClick={() => setWiggleL((n) => n + 1)} animation={wiggleL ? anim(`${jiggle} 0.6s ease`) : undefined}>
            4
          </Text>

          <Box position="relative" mx={{ base: 1, md: 3 }} w={{ base: '92px', md: '156px' }} h={{ base: '92px', md: '156px' }} flexShrink={0}>
            <Circle position="absolute" inset={0} bg="purple.300" animation={anim(`${pulseRing} 2.4s ease-out infinite`)} />
            <Box
              role="button"
              tabIndex={0}
              aria-label="Tap the pin"
              onClick={() => setTaps((n) => n + 1)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setTaps((n) => n + 1)}
              position="relative"
              w="full"
              h="full"
              borderRadius="full"
              p={{ base: '9px', md: '14px' }}
              cursor="pointer"
              bgGradient="linear(to-br, var(--color-primary), var(--color-secondary))"
              boxShadow="0 16px 36px rgba(79, 70, 229, 0.38)"
              transition="transform 0.15s"
              _active={{ transform: 'scale(0.9)' }}
              sx={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Flex align="center" justify="center" w="full" h="full" borderRadius="full" bg="white" overflow="hidden">
                <Box key={`pin-${taps}`} animation={anim(`${hop} ${taps ? '0.6s' : '2.4s'} ease-in-out ${taps ? '1' : 'infinite'}`)}>
                  <Icon as={FiMapPin} boxSize={{ base: 9, md: 16 }} color="var(--color-primary)" />
                </Box>
              </Flex>
            </Box>

            {/* confetti burst */}
            {taps > 0 && !reduce && (
              <Box key={`burst-${taps}`} position="absolute" top="50%" left="50%" pointerEvents="none" zIndex={3}>
                {particles.map((p, i) => (
                  <Circle
                    key={i}
                    size={`${p.s}px`}
                    bg={p.c}
                    position="absolute"
                    top={`-${p.s / 2}px`}
                    left={`-${p.s / 2}px`}
                    animation={`${burst} 0.8s ease-out forwards`}
                    sx={{ '--x': `${p.x}px`, '--y': `${p.y}px` }}
                  />
                ))}
              </Box>
            )}

            {/* tap hint */}
            {taps === 0 && (
              <Text
                position="absolute"
                bottom={{ base: '-22px', md: '-26px' }}
                left="50%"
                transform="translateX(-50%)"
                fontSize="11px"
                fontWeight="700"
                color="var(--color-secondary)"
                whiteSpace="nowrap"
                animation={anim(`${textSwap} 0.6s ease 1s both`)}
              >
                tap the pin
              </Text>
            )}
          </Box>

          <Text key={`r-${wiggleR}`} {...digitProps} onClick={() => setWiggleR((n) => n + 1)} animation={wiggleR ? anim(`${jiggle} 0.6s ease`) : undefined}>
            4
          </Text>
        </Flex>

        {/* heading + rotating message */}
        <Heading
          as="h1"
          mt={{ base: 9, md: 10 }}
          fontSize={{ base: '2xl', md: '4xl' }}
          fontWeight="800"
          letterSpacing="-0.02em"
          lineHeight="1.2"
          color="gray.800"
          animation={anim(`${fadeSlideUp} 0.7s ${ease} 0.1s both`)}
        >
          Oops! This page{' '}
          <Box
            as="span"
            bgGradient="linear(to-r, var(--color-primary), var(--color-secondary), var(--color-primary))"
            bgClip="text"
            backgroundSize="200% auto"
            animation={anim(`${shimmer} 6s linear infinite`)}
          >
            went missing
          </Box>
        </Heading>

        <Box minH="52px" mt={3} px={2} animation={anim(`${fadeSlideUp} 0.7s ${ease} 0.2s both`)}>
          <Text key={msgIdx} color="gray.600" fontSize={{ base: 'sm', md: 'lg' }} lineHeight="1.7" animation={anim(`${textSwap} 0.5s ease both`)}>
            {messages[msgIdx]}
          </Text>
        </Box>

        {/* secret after 5 taps */}
        {taps >= 5 && (
          <Flex
            mt={2}
            px={4}
            py={2}
            borderRadius="full"
            bg="var(--color-surface-hover)"
            border="1px solid"
            borderColor="var(--color-border)"
            animation={anim(`${popIn} 0.5s ${ease} both`)}
          >
            <Text fontSize="xs" fontWeight="700" color="var(--color-primary)">
              You really like tapping things. Let’s get you home!
            </Text>
          </Flex>
        )}

        {/* actions */}
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          spacing={3}
          mt={{ base: 6, md: 8 }}
          w={{ base: 'full', sm: 'auto' }}
          animation={anim(`${fadeSlideUp} 0.7s ${ease} 0.3s both`)}
        >
          <Button
            h="52px"
            px={8}
            borderRadius="full"
            color="white"
            fontWeight="700"
            leftIcon={<FiHome />}
            bgGradient="linear(to-r, var(--color-primary), var(--color-secondary), var(--color-primary))"
            backgroundSize="200% auto"
            boxShadow="0 10px 24px rgba(124, 58, 237, 0.35)"
            transition="all 0.25s"
            _hover={{
              animation: anim(`${shimmer} 2s linear infinite`),
              transform: 'translateY(-2px)',
              boxShadow: '0 14px 30px rgba(124, 58, 237, 0.45)',
            }}
            _active={{ transform: 'scale(0.97)' }}
            onClick={handleGoHome}
          >
            Go to Home
          </Button>
          <Button
            h="52px"
            px={8}
            borderRadius="full"
            bg="white"
            color="var(--color-primary)"
            border="1px solid"
            borderColor="var(--color-border)"
            fontWeight="700"
            leftIcon={<FiCompass />}
            transition="all 0.25s"
            _hover={{ transform: 'translateY(-2px)', bg: 'purple.50' }}
            _active={{ transform: 'scale(0.97)' }}
            onClick={handleShops}
          >
            Explore Shops
          </Button>
        </Stack>

        <Button
          mt={3}
          variant="link"
          colorScheme="brand"
          fontWeight="600"
          fontSize="sm"
          leftIcon={<FiArrowLeft />}
          onClick={handleBack}
          animation={anim(`${fadeSlideUp} 0.7s ${ease} 0.4s both`)}
        >
          Go back
        </Button>

        <Text mt={8} fontSize="11px" fontWeight="700" letterSpacing="0.14em" textTransform="uppercase" color="gray.400">
          Error 404
        </Text>
      </VStack>
    </Box>
  )
}