'use client';

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  HStack,
  VStack,
  Image,
  Icon,
  Badge,
  useColorModeValue,
  SimpleGrid,
  Circle,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import {
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiStar,
  FiChevronRight,
  FiTrendingUp,
  FiHeart,
} from 'react-icons/fi';
import { FaHandsHelping, FaStore } from 'react-icons/fa';

const HeroSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Three product images provided
  const productImages = [
    'https://img.freepik.com/premium-photo/various-electronic-devices-are-spread-out-blue-background_36682-204844.jpg?w=360',
    'https://www.shutterstock.com/image-photo/clothes-store-shopping-mall-600nw-2492349933.jpg',
    'https://www.planetizen.com/files/styles/featured_small/public/images/AdobeStock_184650002.jpeg.webp?itok=iV4TAVX3',
  ];

  const bgGradient = useColorModeValue(
    'linear(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    'linear(135deg, #1e293b 0%, #0f172a 100%)'
  );
  const headingColor = useColorModeValue('gray.800', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const buttonGradient = 'linear(135deg, #1e3a8a 0%, #3b82f6 100%)';

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Verified Buyer",
      text: "Amazing quality and super fast delivery! The products exceeded my expectations.",
      rating: 5,
    },
    {
      name: "Rahul Mehta",
      role: "Regular Customer",
      text: "Best platform to discover authentic Indian handicrafts. Highly recommended!",
      rating: 5,
    },
    {
      name: "Anjali Nair",
      role: "Artisan Partner",
      text: "Business Sahayata has transformed my small business. Grateful for the support!",
      rating: 5,
    },
  ];

  // Auto-rotate product images every 4 seconds
  useEffect(() => {
    const imageInterval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % productImages.length);
    }, 4000);
    return () => clearInterval(imageInterval);
  }, []);

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(testimonialInterval);
  }, []);

  return (
    <Box
      as="section"
      position="relative"
      overflow="hidden"
      bg={bgGradient}
      minH={{ base: "auto", lg: "90vh" }}
      display="flex"
      alignItems="center"
    >
      {/* Decorative Background Elements */}
      <Box
        position="absolute"
        top="-20%"
        right="-10%"
        w="500px"
        h="500px"
        bg="blue.200"
        borderRadius="full"
        filter="blur(100px)"
        opacity={0.4}
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-20%"
        left="-10%"
        w="400px"
        h="400px"
        bg="cyan.200"
        borderRadius="full"
        filter="blur(100px)"
        opacity={0.3}
        pointerEvents="none"
      />

      {/* Lovable floating hearts (static, just for cuteness) */}
      <Box position="absolute" top="15%" left="5%" opacity={0.2} pointerEvents="none">
        <Icon as={FiHeart} boxSize={8} color="pink.400" />
      </Box>
      <Box position="absolute" bottom="20%" right="8%" opacity={0.15} pointerEvents="none">
        <Icon as={FiHeart} boxSize={12} color="pink.300" />
      </Box>

      <Container maxW="100%" px={{ base: 4, md: 6, lg: 8 }} py={{ base: 12, md: 16, lg: 20 }}>
        <Flex
          direction={{ base: "column", lg: "row" }}
          align="center"
          justify="space-between"
          gap={{ base: 10, lg: 12 }}
        >
          {/* Left Content */}
          <VStack align={{ base: "center", lg: "flex-start" }} spacing={6} flex={1}>
            <Badge
              px={4}
              py={2}
              borderRadius="full"
              bg="blue.100"
              color="blue.700"
              fontSize="xs"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="widest"
            >
              🌟 Welcome to Business Sahayata
            </Badge>

            <Heading
              as="h1"
              fontSize={{ base: "4xl", sm: "5xl", md: "6xl", lg: "7xl" }}
              fontWeight="900"
              lineHeight="1.1"
              textAlign={{ base: "center", lg: "left" }}
              color={headingColor}
            >
              Discover Treasures,
              <Text as="span" bgGradient={buttonGradient} bgClip="text">
                {" "}Support Local{" "}
              </Text>
            </Heading>

            <Text
              fontSize={{ base: "md", lg: "lg" }}
              color={textColor}
              textAlign={{ base: "center", lg: "left" }}
              maxW="lg"
              lineHeight="tall"
            >
              Join thousands of happy customers exploring authentic handmade products from artisans across India. Quality guaranteed, delivered with care.
            </Text>

            {/* CTA Buttons - Only Shop Now, removed Watch Story */}
            <HStack spacing={4} flexWrap="wrap" justify={{ base: "center", lg: "flex-start" }}>
              <Button
                size="lg"
                bgGradient={buttonGradient}
                color="white"
                _hover={{ transform: "translateY(-2px)", boxShadow: "xl" }}
                transition="all 0.3s"
                rightIcon={<FiShoppingBag />}
                px={8}
                borderRadius="full"
              >
                Shop Now
              </Button>
            </HStack>

            {/* Trust Indicators */}
            <SimpleGrid columns={{ base: 2, sm: 3 }} spacing={4} pt={4}>
              <HStack spacing={2}>
                <Circle size="32px" bg="blue.100" color="blue.600">
                  <Icon as={FaStore} boxSize={4} />
                </Circle>
                <Box>
                  <Text fontWeight="800" fontSize="lg">10K+</Text>
                  <Text fontSize="xs" color="gray.500">Artisans</Text>
                </Box>
              </HStack>
              <HStack spacing={2}>
                <Circle size="32px" bg="green.100" color="green.600">
                  <Icon as={FiTruck} boxSize={4} />
                </Circle>
                <Box>
                  <Text fontWeight="800" fontSize="lg">Free Ship</Text>
                  <Text fontSize="xs" color="gray.500">Pan India</Text>
                </Box>
              </HStack>
              <HStack spacing={2}>
                <Circle size="32px" bg="purple.100" color="purple.600">
                  <Icon as={FiShield} boxSize={4} />
                </Circle>
                <Box>
                  <Text fontWeight="800" fontSize="lg">100%</Text>
                  <Text fontSize="xs" color="gray.500">Authentic</Text>
                </Box>
              </HStack>
            </SimpleGrid>
          </VStack>

          {/* Right Side - Rotating Product Image Carousel */}
          <Box flex={1} position="relative" maxW={{ base: "400px", lg: "500px" }} mx="auto">
            {/* Floating Elements (static hover effects) */}
            <Box
              position="absolute"
              top="-20px"
              right="-20px"
              zIndex={2}
              transition="transform 0.3s"
              _hover={{ transform: "scale(1.05)" }}
            >
              <Circle size="60px" bg="white" boxShadow="lg" border="2px solid" borderColor="blue.200">
                <Icon as={FiTrendingUp} boxSize={6} color="blue.600" />
              </Circle>
            </Box>
            <Box
              position="absolute"
              bottom="-10px"
              left="-30px"
              zIndex={2}
              transition="transform 0.3s"
              _hover={{ transform: "scale(1.05)" }}
            >
              <Circle size="50px" bg="white" boxShadow="lg" border="2px solid" borderColor="blue.200">
                <Icon as={FaHandsHelping} boxSize={5} color="blue.600" />
              </Circle>
            </Box>

            {/* Main Product Image with smooth cross-fade transition */}
            <Box
              position="relative"
              borderRadius="3xl"
              overflow="hidden"
              boxShadow="2xl"
              transform="rotate(2deg)"
              transition="transform 0.3s"
              _hover={{ transform: "rotate(0deg) scale(1.02)" }}
            >
              <Image
                src={productImages[activeImageIndex]}
                alt="Featured Product"
                objectFit="cover"
                w="100%"
                h="auto"
                borderRadius="3xl"
                transition="opacity 0.5s ease"
              />
              <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                p={4}
                bgGradient="linear(to-t, blackAlpha.700, transparent)"
                borderBottomRadius="3xl"
              >
                <Text color="white" fontWeight="bold" fontSize="sm">
                  Premium Collection
                </Text>
                <Text color="whiteAlpha.800" fontSize="xs">
                  Limited time offer
                </Text>
              </Box>
            </Box>

            {/* Image Navigation Dots */}
            <HStack
              position="absolute"
              bottom="-30px"
              left="50%"
              transform="translateX(-50%)"
              spacing={2}
              mt={2}
            >
              {productImages.map((_, idx) => (
                <Box
                  key={idx}
                  w={activeImageIndex === idx ? "24px" : "8px"}
                  h="8px"
                  borderRadius="full"
                  bg={activeImageIndex === idx ? "blue.600" : "gray.300"}
                  cursor="pointer"
                  transition="all 0.2s"
                  onClick={() => setActiveImageIndex(idx)}
                />
              ))}
            </HStack>

            {/* Testimonial Card Overlay */}
            <Box
              position="absolute"
              bottom="-20px"
              right="-20px"
              bg="white"
              p={4}
              borderRadius="2xl"
              boxShadow="xl"
              maxW="220px"
              border="1px solid"
              borderColor="blue.100"
              zIndex={3}
              backdropFilter="blur(10px)"
            >
              <HStack spacing={1} mb={2}>
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} as={FiStar} boxSize={3} color="yellow.400" fill="yellow.400" />
                ))}
              </HStack>
              <Text fontSize="xs" fontWeight="500" noOfLines={2}>
                {testimonials[activeTestimonial].text}
              </Text>
              <Text fontSize="xs" fontWeight="bold" mt={1}>
                – {testimonials[activeTestimonial].name}
              </Text>
              <HStack justify="center" spacing={1} mt={2}>
                {testimonials.map((_, idx) => (
                  <Box
                    key={idx}
                    w={activeTestimonial === idx ? "12px" : "6px"}
                    h="6px"
                    borderRadius="full"
                    bg={activeTestimonial === idx ? "blue.500" : "gray.300"}
                    transition="all 0.3s"
                  />
                ))}
              </HStack>
            </Box>
          </Box>
        </Flex>

        {/* Bottom Scroll Hint */}
        <Flex justify="center" mt={{ base: 12, lg: 16 }}>
          <Button
            variant="ghost"
            colorScheme="blue"
            rightIcon={<FiChevronRight />}
            borderRadius="full"
            size="sm"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
          >
            Explore Collections
          </Button>
        </Flex>
      </Container>
    </Box>
  );
};

export default HeroSection;