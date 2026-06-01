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
    { icon: FiHeadphones, text: "AI Noise Cancellation", color: "blue.500" },
    { icon: FiBattery, text: "48h Battery Life", color: "green.500" },
    { icon: FiShield, text: "2 Year Warranty", color: "blue.600" }
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

  // Blue & White color mode values
  const cardBg = useColorModeValue('white', 'gray.800');
  const badgeBg = useColorModeValue('blue.50', 'blue.900');
  const badgeColor = useColorModeValue('blue.700', 'blue.200');
  const buttonBg = useColorModeValue('blue.600', 'blue.500');
  const buttonColor = useColorModeValue('white', 'white');
  const featureBg = useColorModeValue('gray.50', 'gray.700');
  const sectionBg = useColorModeValue('blue.50', 'gray.900');

  return (
    <Container maxW="7xl" py={{ base: 8, md: 12, lg: 16 }} px={{ base: 4, sm: 6, md: 8 }}>
      <Box
        position="relative"
        minH={{ base: 'auto', md: '550px', lg: '600px' }}
        borderRadius={{ base: '2xl', md: '3xl' }}
        overflow="hidden"
        bg={cardBg}
        boxShadow="xl"
        p={{ base: 6, sm: 8, md: 12, lg: 16 }}
        transition="all 0.3s ease"
        _hover={{ boxShadow: "2xl" }}
      >
        {/* Background Decorative Elements - Soft blue tones */}
        <Box
          position="absolute"
          top="-20%"
          right="-10%"
          w={{ base: "300px", md: "500px" }}
          h={{ base: "300px", md: "500px" }}
          bg="blue.200"
          borderRadius="full"
          filter="blur(100px)"
          opacity={0.4}
        />
        <Box
          position="absolute"
          bottom="-20%"
          left="-10%"
          w={{ base: "250px", md: "400px" }}
          h={{ base: "250px", md: "400px" }}
          bg="blue.100"
          borderRadius="full"
          filter="blur(80px)"
          opacity={0.5}
        />
        <Box
          position="absolute"
          top="30%"
          left="20%"
          w="200px"
          h="200px"
          bg="cyan.200"
          borderRadius="full"
          filter="blur(60px)"
          opacity={0.3}
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
            {/* Flash Deal Badge - Blue theme */}
            <HStack
              bg={badgeBg}
              px={4}
              py={2}
              borderRadius="full"
              border="1px solid"
              borderColor="blue.200"
              spacing={2}
              transition="all 0.3s"
              _hover={{ transform: "scale(1.05)", bg: "blue.100" }}
            >
              <FiZap color="#2563eb" size={18} />
              <Text fontSize={{ base: "10px", sm: "xs", md: "sm" }} fontWeight="800" color={badgeColor} letterSpacing="widest" textTransform="uppercase">
                Flash Deal - 50% OFF
              </Text>
            </HStack>

            {/* Title */}
            <Box>
              <Heading
                fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl', xl: '7xl' }}
                fontWeight="900"
                lineHeight="1.1"
                color="gray.800"
                _dark={{ color: "white" }}
                letterSpacing="-0.02em"
              >
                Quantum X3
                <Text 
                  as="span" 
                  bgGradient="linear(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%)"
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
              color="gray.600"
              _dark={{ color: "gray.300" }}
              maxW={{ base: "100%", lg: "500px" }}
              lineHeight="tall"
            >
              The future of audio is here. Immersive soundscapes, active AI noise cancellation, 
              and a battery life that keeps up with your rhythm.
            </Text>

            {/* Features Grid - Light backgrounds */}
            <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3} w="full">
              {features.map((feature, idx) => (
                <HStack 
                  key={idx} 
                  spacing={2}
                  bg={featureBg}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-2px)", bg: "blue.50" }}
                >
                  <feature.icon color={feature.color} size={16} />
                  <Text fontSize="xs" fontWeight="600" color="gray.700" _dark={{ color: "gray.200" }}>
                    {feature.text}
                  </Text>
                </HStack>
              ))}
            </SimpleGrid>

            {/* Price Section - Blue accents */}
            <HStack spacing={6} pt={2}>
              <Box>
                <Text color="gray.500" fontSize="xs" fontWeight="700" letterSpacing="widest">
                  PRICE
                </Text>
                <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="900" color="gray.800" _dark={{ color: "white" }}>
                  $299.99
                </Text>
                <Text fontSize="sm" color="gray.400" textDecoration="line-through">
                  $499.99
                </Text>
              </Box>
              <Divider orientation="vertical" h="50px" bg="gray.200" _dark={{ bg: "gray.600" }} />
              <Box>
                <Text color="gray.500" fontSize="xs" fontWeight="700" letterSpacing="widest">
                  YOU SAVE
                </Text>
                <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="900" color="green.600">
                  $200
                </Text>
                <Badge colorScheme="green" fontSize="xs">40% OFF</Badge>
              </Box>
            </HStack>

            {/* Trust Badges */}
            <HStack spacing={4} pt={2}>
              <HStack spacing={1}>
                <FiStar color="#fbbf24" size={14} />
                <Text fontSize="xs" color="gray.600">4.9/5 Rating</Text>
              </HStack>
              <HStack spacing={1}>
                <FiTruck color="#3b82f6" size={14} />
                <Text fontSize="xs" color="gray.600">Free Shipping</Text>
              </HStack>
              <HStack spacing={1}>
                <FiTrendingUp color="#10b981" size={14} />
                <Text fontSize="xs" color="gray.600">Top Seller</Text>
              </HStack>
            </HStack>

            {/* CTA Button - Solid Blue */}
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
                boxShadow: "0 20px 40px -10px rgba(37,99,235,0.4)",
                bg: useColorModeValue('blue.700', 'blue.400')
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
                filter="drop-shadow(0 20px 30px rgba(0,0,0,0.15))"
                transition="opacity 0.3s ease"
                opacity={1}
              />
            </Box>

            {/* Navigation Arrows - Blue themed */}
            <IconButton
              aria-label="Previous"
              icon={<FiChevronLeft size={24} />}
              position="absolute"
              left={{ base: "-10px", md: "-20px" }}
              top="50%"
              transform="translateY(-50%)"
              bg="white"
              color="blue.600"
              boxShadow="md"
              borderRadius="full"
              onClick={prevImage}
              size={{ base: "sm", md: "md" }}
              transition="all 0.3s"
              _hover={{ 
                transform: "translateY(-50%) scale(1.1)",
                bg: "blue.50",
                color: "blue.700"
              }}
            />
            <IconButton
              aria-label="Next"
              icon={<FiChevronRight size={24} />}
              position="absolute"
              right={{ base: "-10px", md: "-20px" }}
              top="50%"
              transform="translateY(-50%)"
              bg="white"
              color="blue.600"
              boxShadow="md"
              borderRadius="full"
              onClick={nextImage}
              size={{ base: "sm", md: "md" }}
              transition="all 0.3s"
              _hover={{ 
                transform: "translateY(-50%) scale(1.1)",
                bg: "blue.50",
                color: "blue.700"
              }}
            />

            {/* Thumbnail Indicators - Blue */}
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
                  bg={currentImageIndex === idx ? "blue.600" : "gray.300"}
                  cursor="pointer"
                  transition="all 0.3s"
                  onClick={() => setCurrentImageIndex(idx)}
                  _hover={{ bg: "blue.400", transform: "scaleX(1.2)" }}
                />
              ))}
            </HStack>
          </Box>
        </Flex>

        {/* Bottom Decorative Bar - Blue gradient */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          h="3px"
          bgGradient="linear(90deg, #1e3a8a, #3b82f6, #06b6d4, #1e3a8a)"
          borderBottomRadius="full"
        />
      </Box>
    </Container>
  );
};

export default ProductBanner;