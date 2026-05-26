"use client";
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Text,
  Icon,
  HStack,
  VStack,
  Stack,
  useColorModeValue,
  Tooltip,
  Link,
} from '@chakra-ui/react';
import { motion, useScroll, useTransform, MotionConfig } from 'framer-motion';
import { 
  FaMapMarkerAlt, 
  FaStar, 
  FaStarHalfAlt, 
  FaRegStar, 
  FaCheckCircle, 
  FaHeart, 
  FaShareAlt,
  FaStore,
  FaClock,
} from 'react-icons/fa';
import { FiMessageCircle, FiUserPlus, FiShare2, FiHeart } from 'react-icons/fi';
import { useState, useMemo } from 'react';

interface ShopData {
  name: string;
  coverImage?: { url: string };
  logo?: { url: string };
  ratings?: {
    average?: number;
    total?: number;
  };
  location?: {
    city?: string;
    state?: string;
    address?: string;
  };
  categories?: string[];
  about?: string;
  operatingHours?: Array<{
    day: string;
    open: string;
    close: string;
  }>;
  verified?: boolean;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
  };
}

const MotionBox = motion(Box);
const MotionStack = motion(Stack);
const MotionFlex = motion(Flex);
const MotionHeading = motion(Heading);

// Star Rating Component
const StarRating = ({ rating, totalReviews }: { rating: number; totalReviews: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <HStack spacing={0.5}>
      {[...Array(fullStars)].map((_, i) => (
        <Icon as={FaStar} key={`full-${i}`} color="orange.400" boxSize={3.5} />
      ))}
      {hasHalfStar && <Icon as={FaStarHalfAlt} color="orange.400" boxSize={3.5} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Icon as={FaRegStar} key={`empty-${i}`} color="orange.200" boxSize={3.5} />
      ))}
      <Text fontSize="xs" fontWeight="medium" color="gray.500" ml={1}>
        ({totalReviews.toLocaleString()} reviews)
      </Text>
    </HStack>
  );
};

// Category Badge Component
const CategoryBadge = ({ category }: { category: string }) => {
  const bgGradient = useColorModeValue(
    'linear(135deg, #667eea 0%, #764ba2 100%)',
    'linear(135deg, #4a5568 0%, #2d3748 100%)'
  );
  return (
    <Badge
      px={3}
      py={1.5}
      borderRadius="full"
      fontSize="2xs"
      fontWeight="700"
      letterSpacing="0.02em"
      textTransform="uppercase"
      color="white"
      bgGradient={bgGradient}
      boxShadow="sm"
    >
      {category}
    </Badge>
  );
};

const ShopHeroSection = ({ shopData }: { shopData: ShopData }) => {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, 120]);
  const opacityParallax = useTransform(scrollY, [0, 300], [1, 0.6]);
  
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const cardBg = useColorModeValue("rgba(255,255,255,0.98)", "rgba(26,32,44,0.98)");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Status Logic
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = days[new Date().getDay()];
  const operatingHours = shopData?.operatingHours || [];
  const todayHours = operatingHours.find((h: any) => h.day === today);

  const isOpenNow = () => {
    if (!todayHours) return false;
    try {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const [openHour, openMinute] = todayHours.open.split(":").map(Number);
      const [closeHour, closeMinute] = todayHours.close.split(":").map(Number);
      return currentMinutes >= (openHour * 60 + openMinute) && currentMinutes < (closeHour * 60 + closeMinute);
    } catch { return false; }
  };

  const isLive = isOpenNow();
  
  // Get closing time text
  const getClosingTimeText = () => {
    if (!todayHours || !isLive) return null;
    const [closeHour, closeMinute] = todayHours.close.split(":").map(Number);
    const closeDate = new Date();
    closeDate.setHours(closeHour, closeMinute);
    return closeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const aboutText = shopData?.about || "✨ Experience the finest craftsmanship and curated collections designed for modern lifestyles. Each piece tells a unique story of passion, precision, and timeless elegance.";
  const previewText = aboutText.slice(0, 140);
  const showReadMore = aboutText.length > 140;

  // Get first 3 categories
  const displayCategories = shopData?.categories?.slice(0, 3) || [];
  
  // Calculate average rating
  const avgRating = shopData?.ratings?.average || 4.8;
  const totalRatings = shopData?.ratings?.total || 128;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Floating animation using framer-motion loop
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const floatingReverseAnimation = {
    y: [0, 10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const pulseAnimation = {
    scale: [1, 1.2, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const scrollIndicatorPulse = {
    y: [0, 8, 0],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <MotionConfig reducedMotion="user">
      <Box position="relative" minH={{ base: "85vh", md: "75vh" }} overflow="hidden" bg="gray.50">
        {/* Background Parallax Image with Enhanced Overlay */}
        <MotionBox
          style={{ y: yParallax, opacity: opacityParallax }}
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={0}
        >
          <Image
            src={shopData?.coverImage?.url || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=900&fit=crop"}
            alt="Shop Cover"
            w="full"
            h="full"
            objectFit="cover"
            filter="brightness(0.85) contrast(1.05)"
          />
          {/* Multi-layer gradient overlay */}
          <Box
            position="absolute"
            inset={0}
            bgGradient="linear(to-b, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 50%, rgba(255,255,255,0.95) 100%)"
          />
          <Box
            position="absolute"
            inset={0}
            bgGradient="radial(circle at 20% 40%, rgba(255,255,255,0.1) 0%, transparent 70%)"
          />
        </MotionBox>

        {/* Decorative Floating Elements - without keyframes */}
        <MotionBox
          position="absolute"
          top="15%"
          right="5%"
          w="60px"
          h="60px"
          borderRadius="full"
          bg="whiteAlpha.300"
          filter="blur(20px)"
          animate={floatingAnimation}
          zIndex={1}
        />
        <MotionBox
          position="absolute"
          bottom="20%"
          left="3%"
          w="40px"
          h="40px"
          borderRadius="full"
          bg="whiteAlpha.200"
          filter="blur(15px)"
          animate={floatingReverseAnimation}
          zIndex={1}
        />

        {/* Main Content */}
        <Container maxW="container.xl" h="full" position="relative" zIndex={2} px={{ base: 4, md: 6, lg: 8 }}>
          <Flex
            direction="column"
            justify="center"
            align="center"
            h="full"
            pt={{ base: 20, md: 28, lg: 32 }}
            pb={{ base: 16, md: 24 }}
          >
            {/* Main Card */}
            <MotionBox
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              w="full"
              maxW="6xl"
              mx="auto"
            >
              <Box
                bg={cardBg}
                backdropFilter="blur(10px)"
                borderRadius={{ base: "2xl", md: "3xl", xl: "4xl" }}
                p={{ base: 5, md: 8, lg: 10 }}
                boxShadow="0 30px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.02)"
                transition="all 0.3s ease"
                _hover={{
                  boxShadow: "0 40px 80px rgba(0,0,0,0.16)",
                  transform: "translateY(-4px)",
                }}
              >
                <Stack
                  direction={{ base: "column", lg: "row" }}
                  spacing={{ base: 6, md: 8, lg: 12 }}
                  align={{ base: "center", lg: "stretch" }}
                >
                  {/* Left: Logo + Brand Identity */}
                  <MotionFlex variants={itemVariants} justify="center" align="center">
                    <Box position="relative">
                      <Box
                        w={{ base: "100px", md: "130px", xl: "160px" }}
                        h={{ base: "100px", md: "130px", xl: "160px" }}
                        borderRadius="full"
                        bg="white"
                        p={1.5}
                        position="relative"
                        boxShadow="xl"
                        overflow="hidden"
                        border="3px solid white"
                        transition="all 0.3s"
                        _hover={{ transform: "scale(1.02)", boxShadow: "2xl" }}
                      >
                        <Image
                          src={shopData?.logo?.url || "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&h=500&fit=crop"}
                          alt={`${shopData?.name} logo`}
                          w="full"
                          h="full"
                          objectFit="cover"
                          borderRadius="full"
                        />
                      </Box>
                      {/* Verified Badge */}
                      {(shopData?.verified || avgRating >= 4.5) && (
                        <Box
                          position="absolute"
                          bottom={2}
                          right={2}
                          bg="blue.500"
                          borderRadius="full"
                          p={1.5}
                          boxShadow="lg"
                        >
                          <Icon as={FaCheckCircle} color="white" boxSize={3.5} />
                        </Box>
                      )}
                    </Box>
                  </MotionFlex>

                  {/* Center: Main Info */}
                  <VStack align={{ base: "center", lg: "flex-start" }} spacing={4} flex={2}>
                    <VStack align={{ base: "center", lg: "flex-start" }} spacing={2} w="full">
                      {/* Name & Status Row */}
                      <Flex 
                        direction={{ base: "column", sm: "row" }} 
                        align={{ base: "center", sm: "center" }} 
                        justify="space-between" 
                        w="full"
                        wrap="wrap"
                        gap={2}
                      >
                        <HStack wrap="wrap" spacing={3} justify={{ base: "center", lg: "flex-start" }}>
                          <MotionHeading
                            variants={itemVariants}
                            fontSize={{ base: "2xl", md: "3xl", xl: "4xl" }}
                            fontWeight="800"
                            bgGradient="linear(to-r, gray.900, gray.700)"
                            bgClip="text"
                            letterSpacing="-0.02em"
                          >
                            {shopData?.name || "Luxury Boutique"}
                          </MotionHeading>
                          <Tooltip label={isLive ? "We're open! Come visit us" : "Check our operating hours"} hasArrow>
                            <HStack
                              spacing={2}
                              bg={isLive ? "green.50" : "red.50"}
                              px={3}
                              py={1.5}
                              borderRadius="full"
                              border="1px solid"
                              borderColor={isLive ? "green.200" : "red.200"}
                              cursor="default"
                            >
                              <MotionBox
                                w="8px"
                                h="8px"
                                bg={isLive ? "green.500" : "red.500"}
                                borderRadius="full"
                                animate={isLive ? pulseAnimation : {}}
                              />
                              <Text fontSize="2xs" fontWeight="800" color={isLive ? "green.700" : "red.700"}>
                                {isLive ? "OPEN NOW" : "CLOSED"}
                              </Text>
                            </HStack>
                          </Tooltip>
                        </HStack>
                      </Flex>

                      {/* Rating & Location Row */}
                      <HStack 
                        spacing={3} 
                        wrap="wrap" 
                        justify={{ base: "center", lg: "flex-start" }} 
                        rowGap={2}
                      >
                        <StarRating rating={avgRating} totalReviews={totalRatings} />
                        <Box w="1px" h="4" bg="gray.200" />
                        <Tooltip label={shopData?.location?.address || "View on map"} hasArrow>
                          <HStack spacing={1} cursor="pointer">
                            <Icon as={FaMapMarkerAlt} boxSize={3} color="blue.500" />
                            <Text fontSize="xs" fontWeight="500" color="gray.600">
                              {shopData?.location?.city && shopData?.location?.state 
                                ? `${shopData.location.city}, ${shopData.location.state}`
                                : "San Francisco, CA"}
                            </Text>
                          </HStack>
                        </Tooltip>
                        {getClosingTimeText() && isLive && (
                          <>
                            <Box w="1px" h="4" bg="gray.200" />
                            <HStack spacing={1}>
                              <Icon as={FaClock} boxSize={2.5} color="gray.400" />
                              <Text fontSize="2xs" fontWeight="500" color="gray.500">
                                Closes {getClosingTimeText()}
                              </Text>
                            </HStack>
                          </>
                        )}
                      </HStack>

                      {/* Categories */}
                      {displayCategories.length > 0 && (
                        <HStack spacing={2} wrap="wrap" justify={{ base: "center", lg: "flex-start" }} mt={1}>
                          <Icon as={FaStore} boxSize={3} color="purple.500" />
                          {displayCategories.map((cat, idx) => (
                            <CategoryBadge key={idx} category={cat} />
                          ))}
                        </HStack>
                      )}
                    </VStack>

                    {/* About Section */}
                    <VStack align={{ base: "center", lg: "flex-start" }} spacing={3} w="full" mt={2}>
                      <Text
                        color="gray.600"
                        fontSize={{ base: "sm", md: "md" }}
                        lineHeight="1.6"
                        textAlign={{ base: "center", lg: "left" }}
                        fontWeight="500"
                      >
                        {isExpanded ? aboutText : `${previewText}${showReadMore ? '...' : ''}`}
                      </Text>
                      {showReadMore && (
                        <Button
                          variant="link"
                          color="blue.600"
                          fontSize="xs"
                          fontWeight="700"
                          onClick={() => setIsExpanded(!isExpanded)}
                          _hover={{ textDecoration: "none", color: "blue.700" }}
                          leftIcon={<Text>{isExpanded ? "−" : "+"}</Text>}
                        >
                          {isExpanded ? "READ LESS" : "READ MORE"}
                        </Button>
                      )}
                    </VStack>
                  </VStack>

                  {/* Right: Action Buttons */}
                  <MotionFlex variants={itemVariants} align="center" justify="center">
                    <VStack spacing={3} w={{ base: "full", lg: "220px" }}>
                      <Button
                        leftIcon={<FiMessageCircle />}
                        bg="gray.900"
                        color="white"
                        size="lg"
                        w="full"
                        borderRadius="xl"
                        fontWeight="700"
                        fontSize="sm"
                        letterSpacing="0.02em"
                        _hover={{ bg: "black", transform: "translateY(-2px)", boxShadow: "lg" }}
                        _active={{ transform: "translateY(0)" }}
                        transition="all 0.2s"
                        boxShadow="md"
                      >
                        CONTACT
                      </Button>
                      <Button
                        leftIcon={<FiShare2 />}
                        variant="outline"
                        size="lg"
                        w="full"
                        borderRadius="xl"
                        fontWeight="700"
                        fontSize="sm"
                        borderColor="gray.200"
                        color="gray.700"
                        _hover={{ bg: "gray.50", transform: "translateY(-2px)", borderColor: "gray.300" }}
                        transition="all 0.2s"
                      >
                        SHARE
                      </Button>
                      <Button
                        leftIcon={<Icon as={isLiked ? FaHeart : FiHeart} color={isLiked ? "red.500" : "gray.500"} />}
                        variant="ghost"
                        size="lg"
                        w="full"
                        borderRadius="xl"
                        fontWeight="600"
                        fontSize="sm"
                        color="gray.600"
                        onClick={() => setIsLiked(!isLiked)}
                        _hover={{ bg: "red.50", color: "red.600" }}
                        transition="all 0.2s"
                      >
                        {isLiked ? "SAVED" : "SAVE"}
                      </Button>
                    </VStack>
                  </MotionFlex>
                </Stack>
              </Box>
            </MotionBox>

            {/* Scroll Indicator - without keyframes */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              position="absolute"
              bottom={6}
              left="50%"
              transform="translateX(-50%)"
              cursor="pointer"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
            >
              <VStack spacing={2}>
                <Text fontSize="2xs" fontWeight="600" color="whiteAlpha.800" letterSpacing="0.1em">
                  SCROLL
                </Text>
                <Box
                  w="24px"
                  h="40px"
                  borderRadius="full"
                  border="2px solid"
                  borderColor="whiteAlpha.700"
                  display="flex"
                  justifyContent="center"
                  pt={1}
                >
                  <MotionBox
                    w="2px"
                    h="8px"
                    bg="whiteAlpha.900"
                    borderRadius="full"
                    animate={scrollIndicatorPulse}
                  />
                </Box>
              </VStack>
            </MotionBox>
          </Flex>
        </Container>
      </Box>
    </MotionConfig>
  );
};

export default ShopHeroSection;