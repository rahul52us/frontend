"use client";

import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
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
  FiCoffee,
  FiCpu,
  FiGift,
  FiHome,
  FiPercent,
  FiRefreshCw,
  FiShield,
  FiShoppingBag,
  FiSmile,
  FiStar,
  FiTrendingUp,
  FiTruck,
} from "react-icons/fi";
import { products } from "./constant";

const MotionBox = motion(Box);

// 1. Quick-access categories for everyday shoppers
const quickCategories = [
  { label: "Top Offers", icon: FiPercent, color: "orange.500", bg: "orange.50", path: "/deals" },
  { label: "Fashion", icon: FiShoppingBag, color: "purple.500", bg: "purple.50", path: "/categories?cat=fashion" },
  { label: "Daily Needs", icon: FiCoffee, color: "green.500", bg: "green.50", path: "/categories?cat=groceries" },
  { label: "Electronics", icon: FiCpu, color: "blue.500", bg: "blue.50", path: "/categories?cat=electronics" },
  { label: "Home & Living", icon: FiHome, color: "teal.500", bg: "teal.50", path: "/categories?cat=home" },
  { label: "Beauty & Care", icon: FiSmile, color: "pink.500", bg: "pink.50", path: "/categories?cat=beauty" },
  { label: "Local Gifts", icon: FiGift, color: "red.500", bg: "red.50", path: "/categories?cat=gifts" },
];

// 2. Banner slides tailored for both Common Shoppers & Local Shop Owners
const heroSlides = [
  {
    id: 1,
    badge: "🔥 Maha Local Sale",
    title: "Your Trusted Local Market, Now Online!",
    subtitle: "Get up to 60% OFF on daily essentials, fashion & electronics directly from nearby shops.",
    ctaText: "Shop Local Deals",
    ctaLink: "/products",
    bgGradient: "linear(to-r, #1E3A8A, #2563EB)",
    accentColor: "amber.300",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    badge: "🏪 For Local Shop Owners",
    title: "Bring Your Local Shop Online in 2 Minutes",
    subtitle: "Reach thousands of customers in your city with 0% setup fee and fast direct payments.",
    ctaText: "Become a Seller",
    ctaLink: "/register?role=seller",
    bgGradient: "linear(to-r, #065F46, #059669)",
    accentColor: "green.200",
    image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    badge: "⚡ Express Delivery",
    title: "Fresh Arrivals & Trending Styles",
    subtitle: "Same-day & next-day doorstep delivery from verified neighborhood stores near you.",
    ctaText: "Explore New Arrivals",
    ctaLink: "/new-arrivals",
    bgGradient: "linear(to-r, #581C87, #7C3AED)",
    accentColor: "purple.200",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
  },
];

// 3. Simple, reassuring trust points for common users
const trustFeatures = [
  { icon: FiCheckCircle, title: "Verified Local Shops", desc: "100% genuine neighborhood sellers" },
  { icon: FiTruck, title: "Fast Local Delivery", desc: "Quick delivery within your city" },
  { icon: FiShield, title: "Safe Payments & COD", desc: "Pay via UPI, Cards or Cash" },
  { icon: FiRefreshCw, title: "Easy 7-Day Returns", desc: "Hassle-free local replacements" },
];

const HeroSection = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance banner every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const activeSlide = heroSlides[currentSlide];

  return (
    <Box bg="#F8FAFC" borderBottom="1px solid" borderColor="gray.100" pb={{ base: 4, md: 8 }}>
      {/* PART 1: Quick Category Bar (App-style horizontal scroll on mobile) */}
      {/* <Box bg="white" borderBottom="1px solid" borderColor="gray.100" py={{ base: 2.5, md: 3 }}>
        <Container maxW="8xl" px={{ base: 3, md: 8 }}>
          <Flex
            justify={{ base: "flex-start", md: "space-between" }}
            align="center"
            gap={{ base: 4, md: 6 }}
            overflowX="auto"
            sx={{
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {quickCategories.map((cat) => (
              <VStack
                key={cat.label}
                as="button"
                onClick={() => router.push(cat.path)}
                spacing={1.5}
                flexShrink={0}
                minW={{ base: "64px", md: "80px" }}
                role="group"
                _focus={{ outline: "none" }}
              >
                <Flex
                  w={{ base: "44px", md: "48px" }}
                  h={{ base: "44px", md: "48px" }}
                  rounded="2xl"
                  bg={cat.bg}
                  color={cat.color}
                  align="center"
                  justify="center"
                  transition="all 0.2s ease"
                  _groupHover={{ transform: "translateY(-2px)", boxShadow: "sm" }}
                >
                  <Icon as={cat.icon} boxSize={{ base: 5, md: 5 }} />
                </Flex>
                <Text
                  fontSize={{ base: "11px", md: "xs" }}
                  fontWeight="600"
                  color="gray.700"
                  noOfLines={1}
                  _groupHover={{ color: "blue.600" }}
                >
                  {cat.label}
                </Text>
              </VStack>
            ))}

            <Box display={{ base: "none", lg: "block" }} pl={2}>
              <Button
                size="sm"
                rounded="xl"
                colorScheme="green"
                variant="outline"
                rightIcon={<FiArrowRight />}
                onClick={() => router.push("/register?role=seller")}
                fontWeight="600"
                fontSize="xs"
              >
                Sell Your Products
              </Button>
            </Box>
          </Flex>
        </Container>
      </Box> */}

      {/* PART 2: Main Storefront Grid (Banner Slider + Side Deal/Seller Cards) */}
      <Container maxW="8xl" px={{ base: 3, md: 8 }} pt={{ base: 3, md: 6 }}>
        <Grid
          templateColumns={{ base: "1fr", lg: "2.1fr 1fr" }}
          gap={{ base: 3.5, md: 5 }}
        >
          {/* LEFT: Auto-Sliding Promotional Banner */}
          <GridItem
            position="relative"
            rounded="2xl"
            overflow="hidden"
            h={{ base: "195px", sm: "240px", md: "330px" }}
            boxShadow="sm"
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
                  px={{ base: 4, sm: 7, md: 10 }}
                  py={{ base: 4, md: 6 }}
                >
                  {/* Banner Text Content */}
                  <VStack
                    align="flex-start"
                    spacing={{ base: 2, md: 3.5 }}
                    maxW={{ base: "62%", sm: "58%", md: "55%" }}
                    zIndex={2}
                    color="white"
                  >
                    <Badge
                      bg="whiteAlpha.200"
                      color="white"
                      backdropFilter="blur(6px)"
                      px={2.5}
                      py={0.5}
                      rounded="full"
                      fontSize={{ base: "10px", md: "xs" }}
                      fontWeight="700"
                      textTransform="none"
                    >
                      {activeSlide.badge}
                    </Badge>

                    <Heading
                      as="h1"
                      fontSize={{ base: "md", sm: "xl", md: "3xl" }}
                      fontWeight="800"
                      lineHeight="1.2"
                      noOfLines={2}
                    >
                      {activeSlide.title}
                    </Heading>

                    <Text
                      fontSize={{ base: "11px", sm: "xs", md: "sm" }}
                      color="whiteAlpha.900"
                      noOfLines={2}
                      lineHeight="1.4"
                    >
                      {activeSlide.subtitle}
                    </Text>

                    <Button
                      size={{ base: "xs", sm: "sm", md: "md" }}
                      bg="white"
                      color="gray.900"
                      fontWeight="700"
                      rounded="full"
                      px={{ base: 4, md: 6 }}
                      rightIcon={<FiArrowRight />}
                      _hover={{ bg: "gray.100", transform: "translateY(-1px)" }}
                      onClick={() => router.push(activeSlide.ctaLink)}
                      mt={1}
                    >
                      {activeSlide.ctaText}
                    </Button>
                  </VStack>

                  {/* Banner Visual Cutout / Image */}
                  <Box
                    position="absolute"
                    right="0"
                    top="0"
                    bottom="0"
                    w={{ base: "45%", sm: "46%", md: "48%" }}
                    zIndex={1}
                  >
                    <Box
                      position="absolute"
                      inset="0"
                      bgGradient="linear(to-r, blackAlpha.400, transparent)"
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
                        md: "polygon(14% 0, 100% 0, 100% 100%, 0% 100%)",
                      }}
                    />
                  </Box>
                </Flex>
              </MotionBox>
            </AnimatePresence>

            {/* Desktop Prev / Next Arrows */}
            <IconButton
              display={{ base: "none", md: "flex" }}
              aria-label="Previous slide"
              icon={<FiChevronLeft size={18} />}
              position="absolute"
              left={3}
              top="50%"
              transform="translateY(-50%)"
              size="sm"
              rounded="full"
              bg="blackAlpha.400"
              color="white"
              _hover={{ bg: "blackAlpha.600" }}
              onClick={prevSlide}
              zIndex={3}
            />
            <IconButton
              display={{ base: "none", md: "flex" }}
              aria-label="Next slide"
              icon={<FiChevronRight size={18} />}
              position="absolute"
              right={3}
              top="50%"
              transform="translateY(-50%)"
              size="sm"
              rounded="full"
              bg="blackAlpha.400"
              color="white"
              _hover={{ bg: "blackAlpha.600" }}
              onClick={nextSlide}
              zIndex={3}
            />

            {/* Slide Indicator Dots */}
            <HStack
              position="absolute"
              bottom={2.5}
              left="50%"
              transform="translateX(-50%)"
              spacing={1.5}
              zIndex={3}
            >
              {heroSlides.map((s, idx) => (
                <Box
                  key={s.id}
                  as="button"
                  onClick={() => setCurrentSlide(idx)}
                  w={currentSlide === idx ? "18px" : "6px"}
                  h="6px"
                  rounded="full"
                  bg={currentSlide === idx ? "white" : "whiteAlpha.500"}
                  transition="all 0.2s ease"
                />
              ))}
            </HStack>
          </GridItem>

          {/* RIGHT (Desktop): Stacked "Top Local Deals" + "Local Shop Owner CTA" */}
          <Flex direction="column" gap={4} justify="space-between">
            {/* Today's Spotlight Products */}
            <Box
              bg="white"
              rounded="2xl"
              p={{ base: 3.5, md: 4 }}
              border="1px solid"
              borderColor="gray.100"
              boxShadow="xs"
              flex="1"
            >
              <HStack justify="space-between" mb={3}>
                <HStack spacing={1.5}>
                  <Icon as={FiTrendingUp} color="orange.500" boxSize={4} />
                  <Text fontSize="sm" fontWeight="700" color="gray.800">
                    Top Local Deals Today
                  </Text>
                </HStack>
                <Button
                  variant="link"
                  size="xs"
                  colorScheme="blue"
                  onClick={() => router.push("/products")}
                >
                  View All
                </Button>
              </HStack>

              {/* 2-Card Mini Product Row (Works cleanly on both Mobile & Desktop!) */}
              <SimpleGrid columns={2} spacing={2.5}>
                {(products?.slice(0, 2) || []).map((prod, idx) => (
                  <Flex
                    key={idx}
                    as="button"
                    onClick={() => router.push("/products")}
                    bg="gray.50"
                    p={2}
                    rounded="xl"
                    align="center"
                    gap={2.5}
                    textAlign="left"
                    border="1px solid"
                    borderColor="gray.100"
                    _hover={{ borderColor: "blue.200", bg: "blue.50" }}
                    transition="all 0.15s ease"
                  >
                    <Image
                      src={prod.image}
                      alt={prod.title}
                      boxSize={{ base: "46px", md: "52px" }}
                      rounded="lg"
                      objectFit="cover"
                      bg="white"
                      flexShrink={0}
                    />
                    <Box minW={0} flex="1">
                      <Text
                        fontSize="xs"
                        fontWeight="600"
                        color="gray.800"
                        noOfLines={1}
                      >
                        {prod.title}
                      </Text>
                      <Text fontSize="xs" fontWeight="800" color="blue.600" mt={0.5}>
                        {prod.price}
                      </Text>
                      <HStack spacing={0.5} mt={0.5}>
                        <Icon as={FiStar} color="amber.400" boxSize={2.5} />
                        <Text fontSize="10px" color="gray.500" fontWeight="600">
                          {prod.rating}
                        </Text>
                      </HStack>
                    </Box>
                  </Flex>
                ))}
              </SimpleGrid>
            </Box>

            {/* Dedicated Banner for Local Shopkeepers / Sellers */}
            <Flex
              bgGradient="linear(to-r, orange.50, amber.50)"
              border="1px solid"
              borderColor="orange.200"
              rounded="2xl"
              p={{ base: 3.5, md: 4 }}
              align="center"
              justify="space-between"
              gap={3}
            >
              <Box>
                <Badge
                  colorScheme="orange"
                  fontSize="9px"
                  rounded="md"
                  px={1.5}
                  mb={1}
                >
                  FOR SHOP OWNERS
                </Badge>
                <Text fontSize="sm" fontWeight="700" color="gray.800" lineHeight="1.2">
                  Own a Local Shop or Business?
                </Text>
                <Text fontSize="xs" color="gray.600" mt={0.5}>
                  List your products free & sell to customers near you.
                </Text>
              </Box>
              <Button
                size="sm"
                colorScheme="orange"
                rounded="xl"
                px={4}
                flexShrink={0}
                rightIcon={<FiArrowRight />}
                onClick={() => router.push("/register?role=seller")}
              >
                Start Selling
              </Button>
            </Flex>
          </Flex>
        </Grid>

        {/* PART 3: Compact Trust Bar (2x2 on Mobile, 4-Column Row on Desktop) */}
        <SimpleGrid
          columns={{ base: 2, md: 4 }}
          spacing={{ base: 2.5, md: 4 }}
          mt={{ base: 3.5, md: 5 }}
        >
          {trustFeatures.map((item) => (
            <HStack
              key={item.title}
              bg="white"
              px={{ base: 3, md: 4 }}
              py={{ base: 2.5, md: 3 }}
              rounded="xl"
              border="1px solid"
              borderColor="gray.100"
              spacing={3}
            >
              <Flex
                w={{ base: "32px", md: "36px" }}
                h={{ base: "32px", md: "36px" }}
                rounded="lg"
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
      </Container>
    </Box>
  );
};

export default HeroSection;