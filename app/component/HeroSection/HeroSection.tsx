"use client";

import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiPercent,
  FiShield,
  FiStar,
  FiTruck,
} from "react-icons/fi";

const MotionBox = motion(Box);

// Banner slides tailored for both Everyday Shoppers & Local Shop Owners
const heroSlides = [
  {
    id: 1,
    badge: "🔥 Maha Local Sale",
    title: "Your Trusted Local Market, Now Online",
    subtitle: "Get up to 60% OFF on daily essentials, groceries & fashion delivered directly from stores in your city.",
    ctaText: "Shop Local Deals",
    ctaLink: "/products",
    secondaryCtaText: "Browse Categories",
    secondaryCtaLink: "/categories",
    bgGradient: "linear(to-r, #1E3A8A, #2563EB, #3B82F6)",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
    badgeStats: "1,200+ Stores Active",
    rating: "4.9 ★ Local Rating",
  },
  {
    id: 2,
    badge: "🏪 For Local Shop Owners",
    title: "Bring Your Local Shop Online in 2 Minutes",
    subtitle: "Reach thousands of customers in your city with 0% setup fee, direct payments & zero middleman commission.",
    ctaText: "Start Selling Free",
    ctaLink: "/register?role=seller",
    secondaryCtaText: "Learn How It Works",
    secondaryCtaLink: "/about-us",
    bgGradient: "linear(to-r, #064E3B, #059669, #10B981)",
    image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1200&q=80",
    badgeStats: "0% Platform Commission",
    rating: "Instant UPI Payouts",
  },
  {
    id: 3,
    badge: "⚡ Express Local Delivery",
    title: "Fresh Arrivals & Trending Neighborhood Styles",
    subtitle: "Superfast doorstep delivery in under 2 hours from verified local boutiques, electronics & kirana stores.",
    ctaText: "Explore New Arrivals",
    ctaLink: "/products",
    secondaryCtaText: "View Today's Offers",
    secondaryCtaLink: "/deals",
    bgGradient: "linear(to-r, #4C1D95, #7C3AED, #8B5CF6)",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    badgeStats: "Under 2-Hour Delivery",
    rating: "100% Verified Stores",
  },
];

// Simple, reassuring trust points for common users
const trustFeatures = [
  { icon: FiCheckCircle, title: "Verified Local Shops", desc: "100% genuine neighborhood stores" },
  { icon: FiTruck, title: "Fast Local Delivery", desc: "Doorstep dispatch in under 2 hours" },
  { icon: FiPercent, title: "Original Shop Rates", desc: "0% middleman price markups" },
  { icon: FiShield, title: "Safe Payments & COD", desc: "Pay via UPI, Cards or Cash" },
];

const HeroSection = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance banner every 5 seconds (pauses when hovering on desktop)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const activeSlide = heroSlides[currentSlide];

  return (
    <Box bg="#F8FAFC" borderBottom="1px solid" borderColor="gray.100" pb={{ base: 4, md: 6 }}>
      <Container maxW="8xl" px={{ base: 3, md: 8 }} pt={{ base: 3, md: 5 }}>
        {/* FULL-WIDTH PROMINENT HERO BANNER (No cluttered side boxes) */}
        <Box
          position="relative"
          rounded="2xl"
          overflow="hidden"
          h={{ base: "220px", sm: "280px", md: "340px", lg: "370px" }}
          boxShadow="sm"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <MotionBox
              key={activeSlide.id}
              initial={{ opacity: 0.85 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.85 }}
              transition={{ duration: 0.25 }}
              w="full"
              h="full"
              bgGradient={activeSlide.bgGradient}
              position="relative"
            >
              <Flex
                h="full"
                align="center"
                justify="space-between"
                px={{ base: 4, sm: 8, md: 12 }}
                py={{ base: 4, md: 6 }}
              >
                {/* Banner Text Content */}
                <VStack
                  align="flex-start"
                  spacing={{ base: 2, sm: 3, md: 4 }}
                  maxW={{ base: "68%", sm: "62%", md: "54%", lg: "50%" }}
                  zIndex={2}
                  color="white"
                >
                  <Badge
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
                    {activeSlide.badge}
                  </Badge>

                  <Heading
                    as="h1"
                    fontSize={{ base: "base", sm: "xl", md: "3xl", lg: "4xl" }}
                    fontWeight="800"
                    lineHeight="1.2"
                    noOfLines={{ base: 2, md: 3 }}
                  >
                    {activeSlide.title}
                  </Heading>

                  <Text
                    fontSize={{ base: "11px", sm: "xs", md: "sm" }}
                    color="whiteAlpha.900"
                    noOfLines={{ base: 2, sm: 3 }}
                    lineHeight="1.45"
                  >
                    {activeSlide.subtitle}
                  </Text>

                  {/* Dual Action CTAs */}
                  <HStack spacing={{ base: 2, md: 3 }} pt={{ base: 1, md: 1.5 }}>
                    <Button
                      size={{ base: "xs", sm: "sm", md: "md" }}
                      bg="white"
                      color="gray.900"
                      fontWeight="700"
                      rounded="full"
                      px={{ base: 3.5, sm: 5, md: 6 }}
                      rightIcon={<FiArrowRight />}
                      _hover={{ bg: "gray.100", transform: "translateY(-1px)" }}
                      onClick={() => router.push(activeSlide.ctaLink)}
                    >
                      {activeSlide.ctaText}
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
                      _hover={{ bg: "whiteAlpha.300", transform: "translateY(-1px)" }}
                      onClick={() => router.push(activeSlide.secondaryCtaLink)}
                    >
                      {activeSlide.secondaryCtaText}
                    </Button>
                  </HStack>

                  {/* Micro Trust Indicators (Desktop) */}
                  <HStack
                    display={{ base: "none", md: "flex" }}
                    spacing={4}
                    pt={1}
                    fontSize="xs"
                    color="whiteAlpha.900"
                  >
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
                </VStack>

                {/* Banner Visual Image + Floating Glass Badges */}
                <Box
                  position="absolute"
                  right="0"
                  top="0"
                  bottom="0"
                  w={{ base: "45%", sm: "46%", md: "52%" }}
                  zIndex={1}
                >
                  <Box
                    position="absolute"
                    inset="0"
                    bgGradient="linear(to-r, blackAlpha.500, transparent)"
                    zIndex={1}
                    display={{ base: "block", md: "none" }}
                  />
                  <Image
                    src={activeSlide.image}
                    alt={activeSlide.title}
                    w="full"
                    h="full"
                    objectFit="cover"
                    clipPath={{
                      base: "polygon(18% 0, 100% 0, 100% 100%, 0% 100%)",
                      md: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)",
                    }}
                  />

                  {/* Floating Glassmorphic Badge: Live Stats (Desktop) */}
                  <HStack
                    display={{ base: "none", lg: "flex" }}
                    position="absolute"
                    top={6}
                    right={8}
                    zIndex={2}
                    bg="blackAlpha.600"
                    backdropFilter="blur(10px)"
                    border="1px solid"
                    borderColor="whiteAlpha.300"
                    px={3.5}
                    py={1.5}
                    rounded="full"
                    spacing={2}
                  >
                    <Box w="8px" h="8px" rounded="full" bg="green.400" boxShadow="0 0 0 2px rgba(74, 222, 128, 0.4)" />
                    <Text fontSize="xs" fontWeight="700" color="white">
                      {activeSlide.badgeStats}
                    </Text>
                  </HStack>

                  {/* Floating Glassmorphic Badge: Rating / Guarantee (Desktop) */}
                  <HStack
                    display={{ base: "none", lg: "flex" }}
                    position="absolute"
                    bottom={8}
                    right={8}
                    zIndex={2}
                    bg="blackAlpha.600"
                    backdropFilter="blur(10px)"
                    border="1px solid"
                    borderColor="whiteAlpha.300"
                    px={3.5}
                    py={1.5}
                    rounded="full"
                    spacing={1.5}
                  >
                    <Icon as={FiStar} color="amber.300" boxSize={3.5} />
                    <Text fontSize="xs" fontWeight="700" color="white">
                      {activeSlide.rating}
                    </Text>
                  </HStack>
                </Box>
              </Flex>
            </MotionBox>
          </AnimatePresence>

          {/* Desktop Prev / Next Navigation Arrows */}
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
            _hover={{ bg: "blackAlpha.700" }}
            onClick={prevSlide}
            zIndex={3}
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
            _hover={{ bg: "blackAlpha.700" }}
            onClick={nextSlide}
            zIndex={3}
          />

          {/* Slide Indicator Pills */}
          <HStack
            position="absolute"
            bottom={3}
            left="50%"
            transform="translateX(-50%)"
            spacing={2}
            zIndex={3}
          >
            {heroSlides.map((s, idx) => (
              <Box
                key={s.id}
                as="button"
                onClick={() => setCurrentSlide(idx)}
                w={currentSlide === idx ? "26px" : "8px"}
                h="6px"
                rounded="full"
                bg={currentSlide === idx ? "white" : "whiteAlpha.500"}
                transition="all 0.25s ease"
              />
            ))}
          </HStack>
        </Box>

        {/* SLIM SELLER RIBBON: 1-line announcement without any bulky boxes */}
        <Flex
          mt={{ base: 3, md: 3.5 }}
          bg="orange.50"
          border="1px solid"
          borderColor="orange.200"
          rounded="xl"
          px={{ base: 3, md: 4 }}
          py={{ base: 2, md: 2 }}
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
              color="gray.800"
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
            onClick={() => router.push("/register?role=seller")}
          >
            Start Selling Free
          </Button>
        </Flex>

        {/* UNIFIED TRUST STRIP: Single clean cohesive bar (zero box clutter) */}
        <Box
          mt={{ base: 3, md: 3.5 }}
          bg="white"
          rounded="2xl"
          border="1px solid"
          borderColor="gray.100"
          p={{ base: 3, md: 3.5 }}
          boxShadow="xs"
        >
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 2.5, md: 4 }}>
            {trustFeatures.map((item) => (
              <HStack
                key={item.title}
                spacing={3}
                align="center"
                justify={{ base: "flex-start", md: "center" }}
              >
                <Flex
                  w={{ base: "32px", md: "36px" }}
                  h={{ base: "32px", md: "36px" }}
                  rounded="xl"
                  bg="blue.50"
                  color="blue.600"
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
                    color="gray.800"
                    noOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text
                    fontSize="10px"
                    color="gray.500"
                    noOfLines={1}
                    display={{ base: "none", sm: "block" }}
                  >
                    {item.desc}
                  </Text>
                </Box>
              </HStack>
            ))}
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
