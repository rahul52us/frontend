"use client";

import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState, memo } from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiPercent,
  FiShield,
  FiShoppingBag,
  FiStar,
  FiTag,
  FiTruck,
  FiZap,
} from "react-icons/fi";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionFlex = motion(Flex);

const SLIDE_DURATION = 5500; // ms

// Each slide has its own gradient, accent, and visual layout
const heroSlides = [
  {
    id: 1,
    layout: "diagonal",
    icon: FiTag,
    badge: "Maha Local Sale",
    title: "Your Trusted Local Market, Now Online",
    subtitle:
      "Get up to 60% OFF on daily essentials, groceries & fashion delivered directly from stores in your city.",
    ctaText: "Shop Local Deals",
    ctaLink: "/products",
    secondaryCtaText: "Browse Categories",
    secondaryCtaLink: "/categories",
    bgGradient: "linear(to-br, #1E3A8A, #2563EB, #38BDF8)",
    orbA: "#60A5FA",
    orbB: "#22D3EE",
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
    badgeStats: "1,200+ Stores Active",
    rating: "4.9 ★ Local Rating",
  },
  {
    id: 2,
    layout: "card",
    icon: FiShoppingBag,
    badge: "For Local Shop Owners",
    title: "Bring Your Local Shop Online in 2 Minutes",
    subtitle:
      "Reach thousands of customers in your city with 0% setup fee, direct payments & zero middleman commission.",
    ctaText: "Start Selling Free",
    ctaLink: "/register?role=seller",
    secondaryCtaText: "Learn How It Works",
    secondaryCtaLink: "/about-us",
    bgGradient: "linear(to-br, #064E3B, #059669, #34D399)",
    orbA: "#6EE7B7",
    orbB: "#FDE047",
    image:
      "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1200&q=80",
    badgeStats: "0% Platform Commission",
    rating: "Instant UPI Payouts",
  },
  {
    id: 3,
    layout: "circle",
    icon: FiZap,
    badge: "Express Local Delivery",
    title: "Fresh Arrivals & Trending Neighborhood Styles",
    subtitle:
      "Superfast doorstep delivery in under 2 hours from verified local boutiques, electronics & kirana stores.",
    ctaText: "Explore New Arrivals",
    ctaLink: "/products",
    secondaryCtaText: "View Today's Offers",
    secondaryCtaLink: "/deals",
    bgGradient: "linear(to-br, #4C1D95, #7C3AED, #EC4899)",
    orbA: "#F0ABFC",
    orbB: "#FB7185",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    badgeStats: "Under 2-Hour Delivery",
    rating: "100% Verified Stores",
  },
];

const trustFeatures = [
  { icon: FiCheckCircle, title: "Verified Local Shops", desc: "100% genuine neighborhood stores" },
  { icon: FiTruck, title: "Fast Local Delivery", desc: "Doorstep dispatch in under 2 hours" },
  { icon: FiPercent, title: "Original Shop Rates", desc: "0% middleman price markups" },
  { icon: FiShield, title: "Safe Payments & COD", desc: "Pay via UPI, Cards or Cash" },
];

// Staggered text entrance
const textContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
};
const textItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

// Indicator pill with its own progress fill (isolated so only it re-renders)
const ProgressPill = memo(({
  active,
  paused,
  onSelect,
  onComplete,
}: {
  active: boolean;
  paused: boolean;
  onSelect: () => void;
  onComplete: () => void;
}) => {
  const [progress, setProgress] = useState(0);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    if (!active) {
      setProgress(0);
      return;
    }
    if (paused) return;
    let raf: number;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setProgress((p) => Math.min(100, p + (dt / SLIDE_DURATION) * 100));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, paused]);

  useEffect(() => {
    if (active && progress >= 100) completeRef.current();
  }, [active, progress]);

  return (
    <Box
      as="button"
      type="button"
      aria-label="Go to slide"
      onClick={onSelect}
      position="relative"
      overflow="hidden"
      h="6px"
      w={active ? "34px" : "8px"}
      rounded="full"
      bg="whiteAlpha.500"
      transition="width 0.4s cubic-bezier(0.22, 1, 0.36, 1)"
    >
      <Box
        position="absolute"
        left={0}
        top={0}
        bottom={0}
        bg="white"
        rounded="full"
        w={active ? `${progress}%` : "0%"}
      />
    </Box>
  );
});
ProgressPill.displayName = "ProgressPill";

// Floating glass chip
const GlassChip = memo(({ children, delay = 0, ...props }: any) => (
  <MotionBox
    animate={{ y: [0, -6, 0] }}
    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay }}
    position="absolute"
    zIndex={3}
    bg="blackAlpha.500"
    backdropFilter="blur(10px)"
    border="1px solid"
    borderColor="whiteAlpha.300"
    px={3.5}
    py={1.5}
    rounded="full"
    {...props}
  >
    {children}
  </MotionBox>
));
GlassChip.displayName = "GlassChip";

// One slide: gradient + orbs + text + layout-specific visual
const Slide = memo(({ slide, onNavigate }: { slide: (typeof heroSlides)[0]; onNavigate: (link: string) => void }) => {
  const kenBurns = {
    initial: { scale: 1.18 },
    animate: { scale: 1 },
    transition: { duration: SLIDE_DURATION / 1000 + 1.5, ease: "easeOut" },
  };

  const renderVisual = () => {
    if (slide.layout === "diagonal") {
      return (
        <Box
          position="absolute"
          right="0"
          top="0"
          bottom="0"
          w={{ base: "45%", sm: "46%", md: "52%" }}
          zIndex={1}
          overflow="hidden"
          clipPath={{
            base: "polygon(18% 0, 100% 0, 100% 100%, 0% 100%)",
            md: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)",
          }}
        >
          <MotionBox w="full" h="full" {...kenBurns}>
            <Image
              src={slide.image}
              alt={slide.title}
              w="full"
              h="full"
              objectFit="cover"
              loading="eager"
              decoding="async"
            />
          </MotionBox>
          <Box
            position="absolute"
            inset="0"
            bgGradient="linear(to-r, blackAlpha.500, transparent)"
            display={{ base: "block", md: "none" }}
          />
        </Box>
      );
    }

    if (slide.layout === "card") {
      return (
        <Flex
          position="absolute"
          right="0"
          top="0"
          bottom="0"
          w={{ base: "42%", sm: "42%", md: "46%" }}
          align="center"
          justify="center"
          zIndex={1}
          pr={{ base: 2, md: 8 }}
        >
          <MotionBox
            initial={{ opacity: 0, x: 60, rotate: 9 }}
            animate={{ opacity: 1, x: 0, rotate: 4 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            w={{ base: "92%", md: "78%" }}
            h={{ base: "72%", md: "80%" }}
            rounded="2xl"
            overflow="hidden"
            border="4px solid"
            borderColor="whiteAlpha.700"
            boxShadow="0 20px 45px rgba(0,0,0,0.35)"
          >
            <MotionBox w="full" h="full" {...kenBurns}>
              <Image
                src={slide.image}
                alt={slide.title}
                w="full"
                h="full"
                objectFit="cover"
                loading="lazy"
                decoding="async"
              />
            </MotionBox>
          </MotionBox>
          {/* Back card for depth */}
          <Box
            position="absolute"
            w={{ base: "80%", md: "70%" }}
            h={{ base: "66%", md: "74%" }}
            rounded="2xl"
            bg="whiteAlpha.300"
            transform="rotate(-6deg)"
            zIndex={-1}
            mr={{ base: 2, md: 8 }}
          />
        </Flex>
      );
    }

    // circle
    return (
      <Flex
        position="absolute"
        right="0"
        top="0"
        bottom="0"
        w={{ base: "42%", sm: "42%", md: "46%" }}
        align="center"
        justify="center"
        zIndex={1}
        pr={{ base: 2, md: 8 }}
      >
        <Box position="relative" h={{ base: "74%", md: "86%" }} sx={{ aspectRatio: "1 / 1" }}>
          <MotionBox
            position="absolute"
            inset={{ base: "-6px", md: "-12px" }}
            rounded="full"
            border="2px dashed"
            borderColor="whiteAlpha.500"
            animate={{ rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          />
          <MotionBox
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            w="full"
            h="full"
            rounded="full"
            overflow="hidden"
            border="5px solid"
            borderColor="whiteAlpha.600"
            boxShadow="0 20px 45px rgba(0,0,0,0.35)"
          >
            <MotionBox w="full" h="full" {...kenBurns}>
              <Image
                src={slide.image}
                alt={slide.title}
                w="full"
                h="full"
                objectFit="cover"
                loading="lazy"
                decoding="async"
              />
            </MotionBox>
          </MotionBox>
        </Box>
      </Flex>
    );
  };

  return (
    <MotionBox
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      position="absolute"
      inset="0"
      bgGradient={slide.bgGradient}
      overflow="hidden"
    >
      {/* Dot pattern */}
      <Box
        position="absolute"
        inset="0"
        opacity={0.14}
        backgroundImage="radial-gradient(white 1px, transparent 1px)"
        backgroundSize="18px 18px"
      />

      {/* Floating orbs */}
      <MotionBox
        position="absolute"
        top="-60px"
        left="-40px"
        w={{ base: "160px", md: "260px" }}
        h={{ base: "160px", md: "260px" }}
        rounded="full"
        bg={slide.orbA}
        opacity={0.35}
        filter="blur(50px)"
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <MotionBox
        position="absolute"
        bottom="-70px"
        right="30%"
        w={{ base: "150px", md: "240px" }}
        h={{ base: "150px", md: "240px" }}
        rounded="full"
        bg={slide.orbB}
        opacity={0.3}
        filter="blur(55px)"
        animate={{ x: [0, -25, 0], y: [0, -20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <Flex
        h="full"
        align="center"
        px={{ base: 4, sm: 8, md: 12 }}
        py={{ base: 4, md: 6 }}
        position="relative"
      >
        {/* Text */}
        <MotionVStack
          variants={textContainer}
          initial="hidden"
          animate="show"
          align="flex-start"
          spacing={{ base: 2, sm: 3, md: 4 }}
          maxW={{ base: "62%", sm: "58%", md: "52%", lg: "50%" }}
          zIndex={2}
          color="white"
        >
          <MotionBox variants={textItem}>
            <Badge
              display="inline-flex"
              alignItems="center"
              gap={1.5}
              bg="whiteAlpha.250"
              color="white"
              backdropFilter="blur(8px)"
              px={3}
              py={1}
              rounded="full"
              fontSize={{ base: "10px", sm: "11px", md: "xs" }}
              fontWeight="700"
              textTransform="none"
              border="1px solid"
              borderColor="whiteAlpha.300"
            >
              <Icon as={slide.icon} boxSize={3} />
              {slide.badge}
            </Badge>
          </MotionBox>

          <MotionBox variants={textItem}>
            <Heading
              as="h1"
              fontSize={{ base: "19px", sm: "24px", md: "32px", lg: "40px" }}
              fontWeight="800"
              lineHeight="1.15"
              letterSpacing="-0.02em"
              noOfLines={{ base: 3, md: 3 }}
            >
              {slide.title}
            </Heading>
          </MotionBox>

          <MotionBox variants={textItem}>
            <Text
              fontSize={{ base: "11px", sm: "xs", md: "sm" }}
              color="whiteAlpha.900"
              noOfLines={{ base: 2, sm: 3 }}
              lineHeight="1.5"
            >
              {slide.subtitle}
            </Text>
          </MotionBox>

          <MotionBox variants={textItem}>
            <HStack spacing={{ base: 2, md: 3 }} pt={{ base: 0.5, md: 1 }}>
              <Button
                size={{ base: "xs", sm: "sm", md: "md" }}
                bg="white"
                color="gray.900"
                fontWeight="700"
                rounded="full"
                px={{ base: 3.5, sm: 5, md: 6 }}
                rightIcon={<FiArrowRight />}
                boxShadow="0 8px 20px rgba(0,0,0,0.2)"
                _hover={{ bg: "gray.100", transform: "translateY(-2px)", boxShadow: "0 12px 26px rgba(0,0,0,0.25)" }}
                _active={{ transform: "scale(0.97)" }}
                transition="all 0.2s ease"
                onClick={() => onNavigate(slide.ctaLink)}
              >
                {slide.ctaText}
              </Button>

              <Button
                display={{ base: "none", sm: "inline-flex" }}
                size={{ base: "xs", sm: "sm", md: "md" }}
                bg="whiteAlpha.200"
                color="white"
                fontWeight="600"
                rounded="full"
                px={{ base: 3, sm: 4, md: 5 }}
                backdropFilter="blur(6px)"
                border="1px solid"
                borderColor="whiteAlpha.400"
                _hover={{ bg: "whiteAlpha.300", transform: "translateY(-2px)" }}
                _active={{ transform: "scale(0.97)" }}
                transition="all 0.2s ease"
                onClick={() => onNavigate(slide.secondaryCtaLink)}
              >
                {slide.secondaryCtaText}
              </Button>
            </HStack>
          </MotionBox>

          <MotionBox variants={textItem} display={{ base: "none", md: "block" }}>
            <HStack spacing={4} pt={1} fontSize="xs" color="whiteAlpha.900">
              <HStack spacing={1}>
                <Icon as={FiTruck} boxSize={3.5} />
                <Text fontWeight="600">Local Express Dispatch</Text>
              </HStack>
              <Text opacity={0.6}>•</Text>
              <HStack spacing={1}>
                <Icon as={FiPercent} boxSize={3.5} />
                <Text fontWeight="600">Direct Shop Rates</Text>
              </HStack>
              <Text opacity={0.6}>•</Text>
              <HStack spacing={1}>
                <Icon as={FiShield} boxSize={3.5} />
                <Text fontWeight="600">Verified Sellers</Text>
              </HStack>
            </HStack>
          </MotionBox>
        </MotionVStack>

        {/* Visual */}
        {renderVisual()}

        {/* Floating chips */}
        <GlassChip display={{ base: "none", md: "block" }} top={6} right={8}>
          <HStack spacing={2}>
            <Box w="8px" h="8px" rounded="full" bg="green.400" boxShadow="0 0 0 3px rgba(74,222,128,0.35)" />
            <Text fontSize="xs" fontWeight="700" color="white">
              {slide.badgeStats}
            </Text>
          </HStack>
        </GlassChip>

        <GlassChip display={{ base: "none", lg: "block" }} bottom={10} right={10} delay={0.8}>
          <HStack spacing={1.5}>
            <Icon as={FiStar} color="yellow.300" boxSize={3.5} />
            <Text fontSize="xs" fontWeight="700" color="white">
              {slide.rating}
            </Text>
          </HStack>
        </GlassChip>
      </Flex>
    </MotionBox>
  );
});
Slide.displayName = "Slide";

const HeroSection = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const ribbonBg = useColorModeValue("orange.50", "rgba(249, 115, 22, 0.12)");
  const ribbonBorder = useColorModeValue("orange.200", "rgba(249, 115, 22, 0.3)");
  const ribbonText = useColorModeValue("gray.800", "gray.200");

  const nextSlide = useCallback(
    () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length),
    []
  );
  const prevSlide = useCallback(
    () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length),
    []
  );

  const handleNavigate = useCallback(
    (link: string) => {
      router.push(link);
    },
    [router]
  );

  const activeSlide = heroSlides[currentSlide];

  // Swipe support for mobile
  const handleDragEnd = useCallback(
    (_: any, info: any) => {
      setIsPaused(false);
      if (info.offset.x < -60 || info.velocity.x < -400) nextSlide();
      else if (info.offset.x > 60 || info.velocity.x > 400) prevSlide();
    },
    [nextSlide, prevSlide]
  );

  const handlePause = useCallback(() => setIsPaused(true), []);
  const handleResume = useCallback(() => setIsPaused(false), []);

  return (
    <Box bg="var(--color-bg)" borderBottom="1px solid" borderColor="var(--color-border)" pb={{ base: 3, md: 6 }}>
      {/* HERO BANNER */}
      <MotionBox
        position="relative"
        rounded="2xl"
        overflow="hidden"
        h={{ base: "230px", sm: "285px", md: "345px", lg: "380px" }}
        boxShadow="0 10px 30px rgba(0,0,0,0.12)"
        bg="gray.900"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        dragDirectionLock
        style={{ touchAction: "pan-y" }}
        onDragStart={handlePause}
        onDragEnd={handleDragEnd}
        onMouseEnter={handlePause}
        onMouseLeave={handleResume}
      >
        {/* Crossfade: old and new slide overlap, so there's no blank flash */}
        <AnimatePresence initial={false}>
          <Slide
            key={activeSlide.id}
            slide={activeSlide}
            onNavigate={handleNavigate}
          />
        </AnimatePresence>

        {/* Prev / Next */}
        <IconButton
          display={{ base: "none", md: "flex" }}
          aria-label="Previous slide"
          icon={<FiChevronLeft size={20} />}
          position="absolute"
          left={4}
          top="50%"
          transform="translateY(-50%)"
          size="sm"
          rounded="full"
          bg="blackAlpha.400"
          color="white"
          backdropFilter="blur(6px)"
          _hover={{ bg: "blackAlpha.700", transform: "translateY(-50%) scale(1.1)" }}
          _active={{ transform: "translateY(-50%) scale(0.95)" }}
          transition="all 0.2s ease"
          onClick={prevSlide}
          zIndex={5}
        />
        <IconButton
          display={{ base: "none", md: "flex" }}
          aria-label="Next slide"
          icon={<FiChevronRight size={20} />}
          position="absolute"
          right={4}
          top="50%"
          transform="translateY(-50%)"
          size="sm"
          rounded="full"
          bg="blackAlpha.400"
          color="white"
          backdropFilter="blur(6px)"
          _hover={{ bg: "blackAlpha.700", transform: "translateY(-50%) scale(1.1)" }}
          _active={{ transform: "translateY(-50%) scale(0.95)" }}
          transition="all 0.2s ease"
          onClick={nextSlide}
          zIndex={5}
        />

        {/* Progress pills */}
        <HStack
          position="absolute"
          bottom={3}
          left="50%"
          transform="translateX(-50%)"
          spacing={2}
          zIndex={5}
        >
          {heroSlides.map((s, idx) => (
            <ProgressPill
              key={s.id}
              active={currentSlide === idx}
              paused={isPaused}
              onSelect={() => setCurrentSlide(idx)}
              onComplete={nextSlide}
            />
          ))}
        </HStack>
      </MotionBox>

      {/* SELLER RIBBON */}
      <MotionFlex
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        mt={{ base: 2.5, md: 3.5 }}
        bg={ribbonBg}
        border="1px solid"
        borderColor={ribbonBorder}
        rounded="xl"
        px={{ base: 3, md: 4 }}
        py={2}
        align="center"
        justify="space-between"
        gap={2}
      >
        <HStack spacing={2} minW={0}>
          <Badge colorScheme="orange" fontSize="9px" rounded="md" px={1.5} flexShrink={0}>
            SELLER HUB
          </Badge>
          <Text
            fontSize={{ base: "11px", sm: "xs" }}
            fontWeight="600"
            color={ribbonText}
            noOfLines={1}
          >
            Own a local shop or business? Reach thousands of customers in your city with 0% setup fee.
          </Text>
        </HStack>
        <Button
          size="xs"
          colorScheme="orange"
          rounded="lg"
          px={3}
          flexShrink={0}
          rightIcon={<FiArrowRight size={11} />}
          _hover={{ transform: "translateY(-1px)" }}
          _active={{ transform: "scale(0.97)" }}
          transition="all 0.2s ease"
          onClick={() => handleNavigate("/register?role=seller")}
        >
          Start Selling Free
        </Button>
      </MotionFlex>

      {/* TRUST STRIP */}
      <Box
        mt={{ base: 2.5, md: 3.5 }}
        bg="var(--color-surface)"
        rounded="2xl"
        border="1px solid"
        borderColor="var(--color-border)"
        p={{ base: 3, md: 3.5 }}
        boxShadow="xs"
      >
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 2.5, md: 4 }}>
          {trustFeatures.map((item, i) => (
            <MotionBox
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
              whileHover={{ y: -2 }}
            >
              <HStack
                spacing={3}
                align="center"
                justify={{ base: "flex-start", md: "center" }}
              >
                <Flex
                  w={{ base: "32px", md: "36px" }}
                  h={{ base: "32px", md: "36px" }}
                  rounded="xl"
                  bg="var(--color-surface-hover)"
                  color="var(--color-primary)"
                  align="center"
                  justify="center"
                  flexShrink={0}
                >
                  <Icon as={item.icon} boxSize={4} />
                </Flex>
                <Box minW={0}>
                  <Text
                    fontSize={{ base: "11px", md: "xs" }}
                    fontWeight="700"
                    color="var(--color-text)"
                    noOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text
                    fontSize="10px"
                    color="var(--color-text-muted)"
                    noOfLines={1}
                    display={{ base: "none", sm: "block" }}
                  >
                    {item.desc}
                  </Text>
                </Box>
              </HStack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default memo(HeroSection);
