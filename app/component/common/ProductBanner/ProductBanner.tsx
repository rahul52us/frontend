import { 
  Box, 
  Button, 
  Flex, 
  Heading, 
  IconButton, 
  Image, 
  Stack, 
  Text, 
  useColorModeValue, 
  Container,
  HStack,
  Badge,
  SimpleGrid,
  Divider
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiShoppingBag, 
  FiZap, 
  FiStar, 
  FiTruck, 
  FiHeadphones,
  FiBattery,
  FiShield,
  FiTrendingUp
} from 'react-icons/fi';

const ProductBanner = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  
  const productImages = [
    'https://images.unsplash.com/photo-1619113026857-7aa017691b1f?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1615281612781-4b972bd4e3fe?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1715548199124-3e49b59feb5c?w=600&auto=format&fit=crop&q=60',
  ];

  const features = [
    { icon: FiHeadphones, text: "AI Noise Cancellation", color: "blue.400" },
    { icon: FiBattery, text: "48h Battery Life", color: "green.400" },
    { icon: FiShield, text: "2 Year Warranty", color: "purple.400" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovering) {
        setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovering]);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);

  // Color mode values
  const badgeBg = useColorModeValue('whiteAlpha.200', 'blackAlpha.300');
  const buttonBg = useColorModeValue('white', 'gray.800');
  const buttonColor = useColorModeValue('gray.900', 'white');

  return (
    <Container maxW="7xl" py={{ base: 8, md: 12, lg: 16 }} px={{ base: 4, sm: 6, md: 8 }}>
      <Box
        position="relative"
        minH={{ base: 'auto', md: '550px', lg: '600px' }}
        borderRadius={{ base: '2xl', md: '3xl' }}
        overflow="hidden"
        bgGradient="linear(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)"
        p={{ base: 6, sm: 8, md: 12, lg: 16 }}
        transition="all 0.3s ease"
        _hover={{ boxShadow: "2xl" }}
      >
        {/* Background Decorative Elements - No animations */}
        <Box
          position="absolute"
          top="-20%"
          right="-10%"
          w={{ base: "300px", md: "500px" }}
          h={{ base: "300px", md: "500px" }}
          bg="blue.500"
          borderRadius="full"
          filter="blur(100px)"
          opacity={0.2}
        />
        <Box
          position="absolute"
          bottom="-20%"
          left="-10%"
          w={{ base: "250px", md: "400px" }}
          h={{ base: "250px", md: "400px" }}
          bg="purple.500"
          borderRadius="full"
          filter="blur(80px)"
          opacity={0.15}
        />
        <Box
          position="absolute"
          top="30%"
          left="20%"
          w="200px"
          h="200px"
          bg="cyan.500"
          borderRadius="full"
          filter="blur(60px)"
          opacity={0.1}
        />

        <Flex
          direction={{ base: 'column', lg: 'row' }}
          align="center"
          justify="space-between"
          gap={{ base: 8, md: 12, lg: 16 }}
          position="relative"
          zIndex={1}
        >
          {/* Left Section - Product Info */}
          <Stack
            flex={1}
            spacing={{ base: 5, md: 6, lg: 8 }}
            align={{ base: 'center', lg: 'flex-start' }}
            textAlign={{ base: 'center', lg: 'left' }}
          >
            {/* Flash Deal Badge */}
            <HStack
              bg={badgeBg}
              backdropFilter="blur(12px)"
              px={4}
              py={2}
              borderRadius="full"
              border="1px solid"
              borderColor="whiteAlpha.300"
              spacing={2}
              transition="all 0.3s"
              _hover={{ transform: "scale(1.05)", bg: "whiteAlpha.300" }}
            >
              <FiZap color="#fbbf24" size={18} />
              <Text fontSize={{ base: "10px", sm: "xs", md: "sm" }} fontWeight="800" color="white" letterSpacing="widest" textTransform="uppercase">
                Flash Deal - 50% OFF
              </Text>
            </HStack>

            {/* Title */}
            <Box>
              <Heading
                fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl', xl: '7xl' }}
                fontWeight="900"
                lineHeight="1.1"
                color="white"
                letterSpacing="-0.02em"
              >
                Quantum X3
                <Text 
                  as="span" 
                  bgGradient="linear(135deg, #60a5fa 0%, #34d399 50%, #a78bfa 100%)"
                  bgClip="text"
                  display="block"
                >
                  Pro Max
                </Text>
              </Heading>
            </Box>

            {/* Description */}
            <Text
              fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
              color="whiteAlpha.700"
              maxW={{ base: "100%", lg: "500px" }}
              lineHeight="tall"
            >
              The future of audio is here. Immersive soundscapes, active AI noise cancellation, 
              and a battery life that keeps up with your rhythm.
            </Text>

            {/* Features Grid */}
            <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3} w="full">
              {features.map((feature, idx) => (
                <HStack 
                  key={idx} 
                  spacing={2}
                  bg="whiteAlpha.100"
                  px={3}
                  py={2}
                  borderRadius="lg"
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-2px)", bg: "whiteAlpha.200" }}
                >
                  <feature.icon color={feature.color} size={16} />
                  <Text fontSize="xs" fontWeight="600" color="whiteAlpha.900">
                    {feature.text}
                  </Text>
                </HStack>
              ))}
            </SimpleGrid>

            {/* Price Section */}
            <HStack spacing={6} pt={2}>
              <Box>
                <Text color="whiteAlpha.600" fontSize="xs" fontWeight="700" letterSpacing="widest">
                  PRICE
                </Text>
                <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="900" color="white">
                  $299.99
                </Text>
                <Text fontSize="sm" color="whiteAlpha.500" textDecoration="line-through">
                  $499.99
                </Text>
              </Box>
              <Divider orientation="vertical" h="50px" bg="whiteAlpha.300" />
              <Box>
                <Text color="whiteAlpha.600" fontSize="xs" fontWeight="700" letterSpacing="widest">
                  YOU SAVE
                </Text>
                <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="900" color="green.400">
                  $200
                </Text>
                <Badge colorScheme="green" fontSize="xs">40% OFF</Badge>
              </Box>
            </HStack>

            {/* Trust Badges */}
            <HStack spacing={4} pt={2}>
              <HStack spacing={1}>
                <FiStar color="#fbbf24" size={14} />
                <Text fontSize="xs" color="whiteAlpha.800">4.9/5 Rating</Text>
              </HStack>
              <HStack spacing={1}>
                <FiTruck color="#60a5fa" size={14} />
                <Text fontSize="xs" color="whiteAlpha.800">Free Shipping</Text>
              </HStack>
              <HStack spacing={1}>
                <FiTrendingUp color="#34d399" size={14} />
                <Text fontSize="xs" color="whiteAlpha.800">Top Seller</Text>
              </HStack>
            </HStack>

            {/* CTA Button */}
            <Button
              size="lg"
              h={{ base: "60px", md: "70px" }}
              px={{ base: 8, md: 10, lg: 12 }}
              borderRadius="2xl"
              bg={buttonBg}
              color={buttonColor}
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="800"
              leftIcon={<FiShoppingBag size={22} />}
              transition="all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "0 20px 40px -10px rgba(255,255,255,0.2)",
                bg: buttonBg === 'white' ? "gray.100" : "gray.700"
              }}
              _active={{ transform: "translateY(0px)" }}
              w={{ base: "full", sm: "auto" }}
            >
              Grab It Now
            </Button>
          </Stack>

          {/* Right Section - Product Image Carousel */}
          <Box 
            flex={1} 
            position="relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Main Image */}
            <Box
              position="relative"
              transition="all 0.5s ease"
              _hover={{ transform: "scale(1.02)" }}
            >
              <Image
                src={productImages[currentImageIndex]}
                alt="Product Image"
                w="full"
                maxH={{ base: "300px", sm: "400px", md: "450px", lg: "500px" }}
                objectFit="contain"
                filter="drop-shadow(0 20px 40px rgba(0,0,0,0.3))"
                transition="opacity 0.3s ease"
                opacity={1}
              />
            </Box>

            {/* Navigation Arrows */}
            <IconButton
              aria-label="Previous"
              icon={<FiChevronLeft size={24} />}
              position="absolute"
              left={{ base: "-10px", md: "-20px" }}
              top="50%"
              transform="translateY(-50%)"
              bg="whiteAlpha.200"
              color="white"
              backdropFilter="blur(10px)"
              borderRadius="full"
              onClick={prevImage}
              size={{ base: "sm", md: "md" }}
              transition="all 0.3s"
              _hover={{ 
                transform: "translateY(-50%) scale(1.1)",
                bg: "whiteAlpha.400"
              }}
            />
            <IconButton
              aria-label="Next"
              icon={<FiChevronRight size={24} />}
              position="absolute"
              right={{ base: "-10px", md: "-20px" }}
              top="50%"
              transform="translateY(-50%)"
              bg="whiteAlpha.200"
              color="white"
              backdropFilter="blur(10px)"
              borderRadius="full"
              onClick={nextImage}
              size={{ base: "sm", md: "md" }}
              transition="all 0.3s"
              _hover={{ 
                transform: "translateY(-50%) scale(1.1)",
                bg: "whiteAlpha.400"
              }}
            />

            {/* Thumbnail Indicators */}
            <HStack
              position="absolute"
              bottom="-30px"
              left="50%"
              transform="translateX(-50%)"
              spacing={2}
              zIndex={2}
            >
              {productImages.map((_, idx) => (
                <Box
                  key={idx}
                  w={currentImageIndex === idx ? "24px" : "8px"}
                  h="8px"
                  borderRadius="full"
                  bg={currentImageIndex === idx ? "white" : "whiteAlpha.400"}
                  cursor="pointer"
                  transition="all 0.3s"
                  onClick={() => setCurrentImageIndex(idx)}
                  _hover={{ bg: "white", transform: "scaleX(1.2)" }}
                />
              ))}
            </HStack>
          </Box>
        </Flex>

        {/* Bottom Decorative Bar */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          h="3px"
          bgGradient="linear(90deg, #60a5fa, #34d399, #a78bfa, #60a5fa)"
          borderBottomRadius="full"
        />
      </Box>
    </Container>
  );
};

export default ProductBanner;