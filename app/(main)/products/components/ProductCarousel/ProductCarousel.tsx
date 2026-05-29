import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  useColorModeValue, 
  Badge, 
  Container, 
  VStack, 
  Button, 
  HStack,
  Icon,
  SimpleGrid,
  Circle,
  Divider,
  ScaleFade,
  SlideFade
} from "@chakra-ui/react";
import { useEffect, useState, useCallback, useRef } from "react";
import CommonHeading from "../../../../component/common/CommonHeading/CommonHeading";
import stores from "../../../../store/stores";
import { observer } from "mobx-react-lite";
import { featuredProducts } from "./utils/constant";
import { 
  FiTrendingUp, 
  FiStar, 
  FiHeart, 
  FiShoppingBag, 
  FiArrowRight,
  FiAward,
  FiZap,
  FiMapPin,
  FiUsers,
  FiGlobe,
  FiCamera
} from "react-icons/fi";

const ProductCarousel = observer(() => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const { themeStore: { themeConfig } } = stores;
  const isDarkMode = themeConfig.config.initialColorMode === "dark";

  const headingColor = isDarkMode
    ? themeConfig.colors.dark.primary[500]
    : themeConfig.colors.light.primary[500];

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');

  // Auto-advance carousel with direction awareness
  useEffect(() => {
    if (isHovering) return;
    
    const interval = setInterval(() => {
      setDirection('right');
      setActiveIndex((prev) => (prev + 1) % featuredProducts.length);
      setProgress(0);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [isHovering]);

  // Progress bar animation
  useEffect(() => {
    if (isHovering) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const animateProgress = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const newProgress = Math.min((elapsed / 8000) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress < 100) {
        animationFrame = requestAnimationFrame(animateProgress);
      }
    };
    
    animationFrame = requestAnimationFrame(animateProgress);
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [activeIndex, isHovering]);

  const getCategoryGradient = (index: number) => {
    const gradients = [
      "linear(135deg, #667eea 0%, #764ba2 100%)",
      "linear(135deg, #f093fb 0%, #f5576c 100%)",
      "linear(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear(135deg, #43e97b 0%, #38f9d7 100%)",
      "linear(135deg, #fa709a 0%, #fee140 100%)",
    ];
    return gradients[index % gradients.length];
  };

  const handleCardClick = (index: number) => {
    setDirection(index > activeIndex ? 'right' : 'left');
    setActiveIndex(index);
    setProgress(0);
  };

  return (
    <Box 
      py={{ base: 8, sm: 12, md: 16, lg: 20 }} 
      px={{ base: 2, sm: 4, md: 6 }}
      bg={useColorModeValue('gray.50', 'gray.900')}
      position="relative"
      overflow="hidden"
    >
      {/* Animated Background Patterns */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        overflow="hidden"
        pointerEvents="none"
      >
        <Box
          position="absolute"
          top="-10%"
          left="-5%"
          w={{ base: "150px", md: "300px", lg: "400px" }}
          h={{ base: "150px", md: "300px", lg: "400px" }}
          bg="purple.200"
          borderRadius="full"
          filter="blur(60px)"
          opacity={0.4}
          _dark={{ opacity: 0.1 }}
          transform="translateZ(0)"
        />
        <Box
          position="absolute"
          bottom="-10%"
          right="-5%"
          w={{ base: "150px", md: "300px", lg: "400px" }}
          h={{ base: "150px", md: "300px", lg: "400px" }}
          bg="pink.200"
          borderRadius="full"
          filter="blur(60px)"
          opacity={0.4}
          _dark={{ opacity: 0.1 }}
          transform="translateZ(0)"
        />
      </Box>

      <Container maxW="7xl" position="relative" zIndex={2}>
        {/* Modern Header with Stats */}
        <VStack spacing={{ base: 4, md: 6 }} mb={{ base: 8, md: 12 }}>
          <HStack spacing={3}>
            <Circle size="50px" bg="purple.100" _dark={{ bg: "purple.900" }}>
              <Icon as={FiGlobe} boxSize={6} color="purple.600" />
            </Circle>
            <Badge
              bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
              color="white"
              px={4}
              py={2}
              borderRadius="full"
              fontSize="xs"
            >
              TRENDING COLLECTION
            </Badge>
          </HStack>
          
          <CommonHeading
            heading="Must-Have Picks for You"
            subheading="Explore our top-rated and trending products, handpicked just for you."
            mb={0}
            color={headingColor}
          />

          {/* Quick Stats Row */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} w="full" maxW="3xl" mx="auto">
            <Flex align="center" justify="center" gap={2}>
              <Icon as={FiUsers} color="purple.500" boxSize={4} />
              <Text fontSize="xs" fontWeight="600">50K+ Happy Customers</Text>
            </Flex>
            <Flex align="center" justify="center" gap={2}>
              <Icon as={FiStar} color="yellow.500" boxSize={4} />
              <Text fontSize="xs" fontWeight="600">4.9/5 Rating</Text>
            </Flex>
            <Flex align="center" justify="center" gap={2}>
              <Icon as={FiShoppingBag} color="green.500" boxSize={4} />
              <Text fontSize="xs" fontWeight="600">Free Shipping</Text>
            </Flex>
            <Flex align="center" justify="center" gap={2}>
              <Icon as={FiMapPin} color="red.500" boxSize={4} />
              <Text fontSize="xs" fontWeight="600">Pan India Delivery</Text>
            </Flex>
          </SimpleGrid>
        </VStack>

        {/* Main Carousel Layout */}
        <Flex 
          gap={{ base: 4, md: 6, lg: 8 }} 
          direction={{ base: "column", xl: "row" }} 
          align="stretch"
          ref={carouselRef}
        >
          {/* Creative Card Grid Section */}
          <Box flex={2}>
            <Flex 
              gap={{ base: 2, sm: 3, md: 4 }} 
              direction={{ base: "column", sm: "row" }} 
              w="full"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {featuredProducts.map((product, index) => {
                const isActive = activeIndex === index;
                const isPrevMobile = !isActive && window.innerWidth < 640;
                
                return (
                  <Box
                    key={index}
                    flex={isActive ? { base: "auto", sm: 2.5, md: 3 } : { base: "auto", sm: 1 }}
                    w={{ base: "100%", sm: "auto" }}
                    h={{ 
                      base: isActive ? "360px" : "240px",
                      sm: isActive ? "400px" : "280px",
                      md: "440px",
                      lg: "480px" 
                    }}
                    position="relative"
                    borderRadius={{ base: "2xl", md: "3xl" }}
                    overflow="hidden"
                    cursor="pointer"
                    onClick={() => handleCardClick(index)}
                    transition="all 0.5s cubic-bezier(0.34, 1.2, 0.64, 1)"
                    boxShadow={isActive ? "2xl" : "md"}
                    _hover={{ 
                      transform: isActive ? "scale(1.02)" : "scale(1.01)",
                      boxShadow: "xl"
                    }}
                  >
                    {/* Background Image */}
                    <Box
                      position="absolute"
                      inset={0}
                      bgImage={`url(${product.image})`}
                      bgSize="cover"
                      bgPosition="center"
                      transition="transform 0.7s cubic-bezier(0.34, 1.2, 0.64, 1)"
                      transform={isActive ? "scale(1.08)" : "scale(1)"}
                    />

                    {/* Dynamic Gradient Overlay */}
                    <Box
                      position="absolute"
                      inset={0}
                      bgGradient={isActive
                        ? "linear(to-t, blackAlpha.900, blackAlpha.500, transparent 60%)"
                        : "linear(to-t, blackAlpha.800, blackAlpha.600)"}
                      transition="all 0.4s ease"
                    />

                    {/* Creative Elements for Active Card */}
                    {isActive && (
                      <>
                        {/* Corner Accents */}
                        <Box
                          position="absolute"
                          top={0}
                          left={0}
                          w="60px"
                          h="60px"
                          borderTop="3px solid"
                          borderLeft="3px solid"
                          borderColor="whiteAlpha.600"
                          borderTopLeftRadius="2xl"
                          zIndex={2}
                        />
                        <Box
                          position="absolute"
                          top={0}
                          right={0}
                          w="60px"
                          h="60px"
                          borderTop="3px solid"
                          borderRight="3px solid"
                          borderColor="whiteAlpha.600"
                          borderTopRightRadius="2xl"
                          zIndex={2}
                        />
                        
                        {/* Glow Effect */}
                        <Box
                          position="absolute"
                          top="50%"
                          left="50%"
                          transform="translate(-50%, -50%)"
                          w="90%"
                          h="90%"
                          borderRadius="full"
                          bgGradient="radial(circle, rgba(255,255,255,0.1) 0%, transparent 70%)"
                          pointerEvents="none"
                        />
                      </>
                    )}

                    {/* Hot Badge */}
                    {isActive && (
                      <Box
                        position="absolute"
                        top={{ base: 3, md: 4 }}
                        left={{ base: 3, md: 4 }}
                        zIndex={3}
                      >
                        <HStack spacing={1}>
                          <Circle size="20px" bg="red.500">
                            <Icon as={FiZap} boxSize={3} color="white" />
                          </Circle>
                          <Text fontSize="10px" fontWeight="800" color="white" letterSpacing="widest">
                            HOT PICK
                          </Text>
                        </HStack>
                      </Box>
                    )}

                    {/* Content Overlay */}
                    <Flex
                      position="absolute"
                      inset={0}
                      p={{ base: 4, md: 5, lg: 6 }}
                      direction="column"
                      justify="flex-end"
                      zIndex={2}
                    >
                      {isActive ? (
                        <SlideFade in={isActive} offsetY={20}>
                          <VStack align="flex-start" spacing={3}>
                            <Badge 
                              bg="whiteAlpha.200"
                              backdropFilter="blur(10px)"
                              color="white"
                              px={3}
                              py={1.5}
                              borderRadius="full"
                              fontSize="9px"
                              border="1px solid whiteAlpha.400"
                            >
                              ✨ EDITOR'S CHOICE
                            </Badge>
                            
                            <Heading 
                              size={{ base: "sm", md: "md", lg: "lg" }} 
                              color="white" 
                              letterSpacing="-0.02em"
                              lineHeight="1.3"
                            >
                              {product.title}
                            </Heading>
                            
                            <Text fontSize="xs" color="whiteAlpha.800" noOfLines={2}>
                              {product.description}
                            </Text>
                            
                            {/* Interactive Progress Bar */}
                            <Box w="full" mt={2}>
                              <Box 
                                h="2px" 
                                bg="whiteAlpha.300" 
                                borderRadius="full" 
                                overflow="hidden"
                              >
                                <Box
                                  h="full"
                                  bgGradient={getCategoryGradient(index)}
                                  width={`${progress}%`}
                                  transition="width 0.05s linear"
                                  borderRadius="full"
                                />
                              </Box>
                            </Box>
                          </VStack>
                        </SlideFade>
                      ) : (
                        <SlideFade in={!isActive} offsetY={10}>
                          <VStack align="flex-start" spacing={1}>
                            <Icon as={FiCamera} color="whiteAlpha.700" boxSize={4} />
                            <Heading
                              size="xs"
                              color="whiteAlpha.900"
                              letterSpacing="widest"
                              textTransform="uppercase"
                              fontSize={{ base: "9px", md: "10px" }}
                              noOfLines={1}
                            >
                              {product.title}
                            </Heading>
                          </VStack>
                        </SlideFade>
                      )}
                    </Flex>

                    {/* Interactive Overlay on Hover for Inactive Cards */}
                    {!isActive && (
                      <Box
                        position="absolute"
                        inset={0}
                        bg="blackAlpha.500"
                        opacity={0}
                        transition="opacity 0.3s ease"
                        _groupHover={{ opacity: 1 }}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <HStack spacing={2}>
                          <Circle size="30px" bg="white" opacity={0.9}>
                            <Icon as={FiArrowRight} color="purple.600" boxSize={4} />
                          </Circle>
                          <Text fontSize="xs" color="white" fontWeight="bold">
                            Click to Explore
                          </Text>
                        </HStack>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Flex>
          </Box>

          {/* Modern Details Panel */}
          <Flex 
            flex={1} 
            direction="column" 
            justify="space-between"
            p={{ base: 5, sm: 6, md: 7, lg: 8 }}
            bg={bgColor}
            borderRadius="3xl"
            boxShadow="xl"
            minH={{ base: "auto", sm: "400px", md: "440px", lg: "480px" }}
            position="relative"
            border="1px solid"
            borderColor={useColorModeValue('gray.100', 'gray.700')}
            overflow="hidden"
          >
            {/* Background Pattern */}
            <Box
              position="absolute"
              top="-20%"
              right="-20%"
              w="200px"
              h="200px"
              bgGradient={getCategoryGradient(activeIndex)}
              borderRadius="full"
              opacity={0.05}
              pointerEvents="none"
            />

            <Box position="relative" zIndex={2}>
              {/* Category Badge with Pulse Effect */}
              <ScaleFade in initialScale={0.9}>
                <Badge
                  bgGradient={getCategoryGradient(activeIndex)}
                  color="white"
                  px={4}
                  py={2}
                  borderRadius="full"
                  fontSize="10px"
                  mb={5}
                  alignSelf="flex-start"
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                >
                  <Icon as={FiAward} boxSize={3} />
                  <Text>EDITOR'S CHOICE {activeIndex + 1}</Text>
                </Badge>
              </ScaleFade>

              {/* Animated Title with Counter */}
              <HStack spacing={2} mb={3}>
                <Circle size="30px" bg="purple.100" _dark={{ bg: "purple.900" }}>
                  <Text fontSize="sm" fontWeight="800" color="purple.600">
                    {String(activeIndex + 1).padStart(2, '0')}
                  </Text>
                </Circle>
                <Text fontSize="xs" fontWeight="600" color="gray.400" letterSpacing="widest">
                  / {String(featuredProducts.length).padStart(2, '0')}
                </Text>
              </HStack>

              <Heading 
                fontSize={{ base: "2xl", sm: "3xl", md: "3xl", lg: "4xl" }} 
                mb={4} 
                color={textColor} 
                fontWeight="900"
                lineHeight="1.2"
                letterSpacing="-0.02em"
              >
                {featuredProducts[activeIndex].title}
              </Heading>

              <Text 
                fontSize={{ base: "sm", md: "md" }} 
                mb={6} 
                color="gray.600"
                _dark={{ color: "gray.400" }}
                lineHeight="relaxed"
              >
                {featuredProducts[activeIndex].description}
              </Text>

              {/* Creative Stats Grid */}
              <SimpleGrid columns={2} spacing={4} mb={6}>
                <Box p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="2xl">
                  <Text fontSize="xs" color="gray.500" mb={1}>AVAILABILITY</Text>
                  <HStack spacing={1}>
                    <Icon as={FiShoppingBag} color="purple.500" boxSize={4} />
                    <Text fontWeight="800" fontSize="lg">{featuredProducts[activeIndex].availability}</Text>
                    <Text fontSize="xs" color="gray.500">units</Text>
                  </HStack>
                </Box>
                <Box p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="2xl">
                  <Text fontSize="xs" color="gray.500" mb={1}>TRENDING SCORE</Text>
                  <HStack spacing={1}>
                    <Icon as={FiTrendingUp} color="green.500" boxSize={4} />
                    <Text fontWeight="800" fontSize="lg">98%</Text>
                    <Icon as={FiArrowRight} boxSize={3} color="green.500" />
                  </HStack>
                </Box>
              </SimpleGrid>

              <Divider my={4} />

              {/* Action Section */}
              <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
                <VStack align="flex-start" spacing={0}>
                  <Text fontSize="10px" fontWeight="700" color="gray.400" letterSpacing="widest">
                    STARTING FROM
                  </Text>
                  <Text fontWeight="900" fontSize="2xl" color="purple.500">
                    $49.99
                  </Text>
                </VStack>
                
                <Button
                  size="lg"
                  bgGradient={getCategoryGradient(activeIndex)}
                  color="white"
                  borderRadius="2xl"
                  px={{ base: 6, md: 8 }}
                  rightIcon={<FiArrowRight />}
                  transition="all 0.3s cubic-bezier(0.34, 1.2, 0.64, 1)"
                  _hover={{
                    transform: "translateX(5px)",
                    boxShadow: "0 10px 25px -5px rgba(128, 90, 213, 0.4)",
                  }}
                >
                  SHOP NOW
                </Button>
              </Flex>
            </Box>

            {/* Creative Navigation Dots */}
            <HStack spacing={2} justify="center" mt={6} pt={4}>
              {featuredProducts.map((_, idx) => (
                <Box
                  key={idx}
                  as="button"
                  onClick={() => handleCardClick(idx)}
                  h="8px"
                  borderRadius="full"
                  bg={activeIndex === idx ? "purple.500" : "gray.300"}
                  transition="all 0.4s cubic-bezier(0.34, 1.2, 0.64, 1)"
                  width={activeIndex === idx ? "28px" : "8px"}
                  _hover={{
                    bg: "purple.400",
                    width: "20px"
                  }}
                />
              ))}
            </HStack>
          </Flex>
        </Flex>

        {/* Floating Action Button */}
        <Flex justify="center" mt={{ base: 8, md: 10 }}>
          <Button
            variant="outline"
            colorScheme="purple"
            borderRadius="full"
            px={8}
            rightIcon={<FiArrowRight />}
            _hover={{
              transform: "translateX(5px)",
              bg: "purple.50",
              _dark: { bg: "purple.900" }
            }}
            transition="all 0.3s"
          >
            View All Collections
          </Button>
        </Flex>
      </Container>
    </Box>
  );
});

export default ProductCarousel;