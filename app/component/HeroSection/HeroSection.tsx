import { Badge, Box, Button, Container, Flex, Grid, GridItem, Heading, HStack, Image, Text, VStack, Circle, SimpleGrid, Icon } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiPlayCircle, FiArrowRight, FiStar, FiTrendingUp, FiShield, FiZap, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { slides } from './constant';

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [touchStart, setTouchStart] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    if (isHovering) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
      setProgress(0);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [isHovering]);

  // Progress bar animation using requestAnimationFrame
  useEffect(() => {
    if (isHovering) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const animateProgress = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const newProgress = Math.min((elapsed / 6000) * 100, 100);
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

  const handleSlideChange = (index: number) => {
    setActiveIndex(index);
    setProgress(0);
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  return (
    <Box
      position="relative"
      minH={{ base: "600px", sm: "650px", md: "700px", lg: "750px" }}
      mb={{ base: 4, md: 8 }}
      mt={0}
      mx={{ base: 0, md: 4 }}
      rounded={{ base: '0', md: '2xl', lg: '3xl' }}
      overflow="hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background with smooth transition */}
      <Box
        position="absolute"
        inset={0}
        bgGradient={slides[activeIndex].bgGradient}
        transition="all 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
        zIndex={0}
      >
        {/* Decorative Elements - Responsive sizes */}
        <Box
          position="absolute"
          top="-10%"
          right="-5%"
          w={{ base: "150px", sm: "200px", md: "300px", lg: "400px" }}
          h={{ base: "150px", sm: "200px", md: "300px", lg: "400px" }}
          bg="whiteAlpha.300"
          borderRadius="full"
          filter="blur(60px)"
          opacity={0.4}
        />
        <Box
          position="absolute"
          bottom="-10%"
          left="-5%"
          w={{ base: "120px", sm: "150px", md: "200px", lg: "300px" }}
          h={{ base: "120px", sm: "150px", md: "200px", lg: "300px" }}
          bg="whiteAlpha.200"
          borderRadius="full"
          filter="blur(50px)"
          opacity={0.3}
        />
        <Box
          position="absolute"
          top="30%"
          right="20%"
          w={{ base: "80px", md: "150px" }}
          h={{ base: "80px", md: "150px" }}
          bg="whiteAlpha.100"
          borderRadius="full"
          filter="blur(40px)"
        />

        {/* Overlay for text readability */}
        <Box
          position="absolute"
          inset={0}
          bgGradient={{
            base: "linear(to-b, blackAlpha.700, blackAlpha.500, blackAlpha.400)",
            md: "linear(to-r, blackAlpha.700, blackAlpha.400, transparent 60%)"
          }}
        />
      </Box>

      <Container
        maxW="7xl"
        height="100%"
        position="relative"
        zIndex={1}
        display="flex"
        alignItems="center"
        px={{ base: 4, sm: 6, md: 8, lg: 12 }}
        py={{ base: 6, md: 8 }}
      >
        <Grid
          templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
          gap={{ base: 6, md: 8, lg: 12 }}
          height="100%"
          alignItems="center"
          w="full"
        >
          {/* Left Content Section */}
          <GridItem>
            <VStack spacing={{ base: 4, sm: 5, md: 6, lg: 8 }} align={{ base: "center", lg: "flex-start" }}>
              {/* Badge with Progress Bar */}
              <Box position="relative" w="full" textAlign={{ base: "center", lg: "left" }}>
                <Badge
                  fontSize={{ base: "9px", sm: "10px", md: "xs" }}
                  px={{ base: 3, sm: 4, md: 5 }}
                  py={{ base: 1.5, sm: 2 }}
                  borderRadius="full"
                  backdropFilter="blur(10px)"
                  bg="whiteAlpha.200"
                  color="white"
                  border="1px solid"
                  borderColor="whiteAlpha.400"
                  letterSpacing="widest"
                  fontWeight="bold"
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                >
                  <Circle size="6px" bg="green.400" />
                  {slides[activeIndex].badge}
                </Badge>
                
                {/* Animated Progress Bar */}
                <Box
                  position="absolute"
                  bottom="-10px"
                  left={{ base: "50%", lg: "0" }}
                  transform={{ base: "translateX(-50%)", lg: "none" }}
                  w="100%"
                  maxW="120px"
                  h="2px"
                  bg="whiteAlpha.300"
                  borderRadius="full"
                  overflow="hidden"
                >
                  <Box
                    h="full"
                    bg="white"
                    width={`${progress}%`}
                    transition="width 0.05s linear"
                    borderRadius="full"
                  />
                </Box>
              </Box>

              {/* Title with Stagger Effect */}
              <Box textAlign={{ base: "center", lg: "left" }}>
                <Heading
                  lineHeight="1.2"
                  fontWeight="900"
                  fontSize={{ base: "2xl", sm: "3xl", md: "4xl", lg: "5xl", xl: "6xl" }}
                  color="white"
                  letterSpacing="-0.02em"
                  textShadow="0 2px 10px rgba(0,0,0,0.2)"
                >
                  {slides[activeIndex].title.split(' ').map((word, i) => (
                    <Box 
                      as="span" 
                      key={i} 
                      display="inline-block" 
                      mr={{ base: 1, sm: 2 }}
                      transition="all 0.3s ease"
                      _hover={{ transform: "translateY(-4px)" }}
                    >
                      {word}
                    </Box>
                  ))}
                </Heading>
              </Box>

              {/* Description */}
              <Text
                fontSize={{ base: "sm", sm: "md", md: "lg" }}
                maxW={{ base: "full", lg: "lg" }}
                color="whiteAlpha.900"
                fontWeight="500"
                lineHeight="relaxed"
                textAlign={{ base: "center", lg: "left" }}
                px={{ base: 2, sm: 4, lg: 0 }}
              >
                {slides[activeIndex].text}
              </Text>

              {/* Trust Indicators - Responsive Grid */}
              <SimpleGrid 
                columns={{ base: 3 }} 
                spacing={{ base: 2, md: 3 }}
                w="full"
                maxW={{ base: "full", lg: "md" }}
              >
                <HStack spacing={1.5} justify="center">
                  <Circle size="22px" bg="whiteAlpha.200">
                    <Icon as={FiStar} boxSize={3} color="#fbbf24" />
                  </Circle>
                  <Text fontSize={{ base: "9px", sm: "10px" }} color="whiteAlpha.900" fontWeight="500">4.9 Rating</Text>
                </HStack>
                <HStack spacing={1.5} justify="center">
                  <Circle size="22px" bg="whiteAlpha.200">
                    <Icon as={FiTrendingUp} boxSize={3} color="#4ade80" />
                  </Circle>
                  <Text fontSize={{ base: "9px", sm: "10px" }} color="whiteAlpha.900" fontWeight="500">Trending</Text>
                </HStack>
                <HStack spacing={1.5} justify="center">
                  <Circle size="22px" bg="whiteAlpha.200">
                    <Icon as={FiShield} boxSize={3} color="#60a5fa" />
                  </Circle>
                  <Text fontSize={{ base: "9px", sm: "10px" }} color="whiteAlpha.900" fontWeight="500">Secure</Text>
                </HStack>
              </SimpleGrid>

              {/* CTA Buttons */}
              <HStack spacing={3} pt={{ base: 2, md: 4 }} wrap="wrap" justify={{ base: "center", lg: "flex-start" }}>
                <Button
                  size={{ base: "md", sm: "lg" }}
                  bg="white"
                  color="gray.900"
                  _hover={{
                    transform: 'translateY(-3px)',
                    boxShadow: '0 15px 30px -10px rgba(255,255,255,0.3)',
                    bg: 'gray.50'
                  }}
                  _active={{ transform: 'translateY(0)' }}
                  borderRadius="full"
                  px={{ base: 5, sm: 6, md: 8 }}
                  h={{ base: "44px", sm: "50px", md: "56px" }}
                  fontSize={{ base: "sm", sm: "md" }}
                  fontWeight="bold"
                  transition="all 0.3s ease"
                  rightIcon={<Icon as={FiArrowRight} />}
                >
                  Shop Now
                </Button>
                <Button
                  size={{ base: "md", sm: "lg" }}
                  variant="outline"
                  color="white"
                  borderColor="whiteAlpha.500"
                  _hover={{ 
                    bg: 'whiteAlpha.200', 
                    borderColor: 'white', 
                    transform: 'translateY(-3px)' 
                  }}
                  _active={{ transform: 'translateY(0)' }}
                  borderRadius="full"
                  px={{ base: 5, sm: 6, md: 7 }}
                  h={{ base: "44px", sm: "50px", md: "56px" }}
                  backdropFilter="blur(10px)"
                  leftIcon={<Icon as={FiPlayCircle} boxSize={4} />}
                  transition="all 0.3s"
                  display={{ base: "none", sm: "flex" }}
                >
                  Watch Story
                </Button>
              </HStack>
            </VStack>
          </GridItem>

          {/* Right Image Section - Visible on ALL DEVICES */}
          <GridItem
            display="block"
            position="relative"
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="relative"
              py={{ base: 2, md: 4 }}
            >
              <Box
                position="relative"
                p={{ base: 2, sm: 3, md: 4 }}
                filter="drop-shadow(0 20px 40px rgba(0,0,0,0.3))"
              >
                {/* Floating Orbs - Hidden on very small screens */}
                <Box
                  position="absolute"
                  top="10%"
                  left="5%"
                  w={{ base: "50px", sm: "70px", md: "100px" }}
                  h={{ base: "50px", sm: "70px", md: "100px" }}
                  bg="whiteAlpha.200"
                  borderRadius="full"
                  filter="blur(20px)"
                  display={{ base: "none", sm: "block" }}
                />
                <Box
                  position="absolute"
                  bottom="10%"
                  right="5%"
                  w={{ base: "40px", sm: "50px", md: "80px" }}
                  h={{ base: "40px", sm: "50px", md: "80px" }}
                  bg="whiteAlpha.200"
                  borderRadius="full"
                  filter="blur(20px)"
                  display={{ base: "none", sm: "block" }}
                />

                {/* Main Product Image - Responsive Sizing */}
                <Image
                  src={slides[activeIndex].image}
                  alt="Featured product"
                  objectFit="contain"
                  maxH={{ base: "180px", sm: "220px", md: "280px", lg: "350px", xl: "420px" }}
                  w="100%"
                  transition="all 0.5s ease"
                  _hover={{ transform: 'scale(1.03)' }}
                />

                {/* Floating Badge 1 - Limited Edition */}
                <Box
                  position="absolute"
                  top={{ base: "0%", sm: "5%", md: "10%" }}
                  right={{ base: "0%", sm: "0%" }}
                  bg="white"
                  p={{ base: 1.5, sm: 2, md: 3 }}
                  borderRadius="xl"
                  boxShadow="lg"
                  transition="all 0.3s ease"
                  _hover={{ transform: "scale(1.08) rotate(3deg)" }}
                >
                  <VStack spacing={0}>
                    <Icon as={FiZap} boxSize={{ base: 3, sm: 4, md: 5 }} color="#f97316" />
                    <Text fontWeight="bold" fontSize={{ base: "7px", sm: "8px", md: "9px" }} color="gray.700">
                      LIMITED
                    </Text>
                  </VStack>
                </Box>

                {/* Floating Badge 2 - Discount */}
                <Box
                  position="absolute"
                  bottom={{ base: "5%", sm: "10%", md: "15%" }}
                  left={{ base: "0%", sm: "0%" }}
                  bg="blackAlpha.800"
                  backdropFilter="blur(10px)"
                  p={{ base: 1.5, sm: 2, md: 3 }}
                  borderRadius="xl"
                  boxShadow="lg"
                  transition="all 0.3s ease"
                  _hover={{ transform: "scale(1.08) rotate(-3deg)" }}
                >
                  <VStack spacing={0}>
                    <Text fontWeight="900" fontSize={{ base: "14px", sm: "16px", md: "20px" }} color="white">
                      30%
                    </Text>
                    <Text fontSize={{ base: "6px", sm: "7px", md: "8px" }} color="whiteAlpha.800">
                      OFF
                    </Text>
                  </VStack>
                </Box>
              </Box>
            </Box>
          </GridItem>
        </Grid>

        {/* Navigation Arrows - Optimized for mobile */}
        <Button
          position="absolute"
          left={{ base: 2, sm: 4, md: 6 }}
          top="50%"
          transform="translateY(-50%)"
          onClick={prevSlide}
          bg="blackAlpha.400"
          backdropFilter="blur(10px)"
          color="white"
          borderRadius="full"
          size={{ base: "xs", sm: "sm", md: "md" }}
          minW={{ base: "32px", sm: "36px", md: "44px" }}
          h={{ base: "32px", sm: "36px", md: "44px" }}
          p={0}
          _hover={{ bg: "blackAlpha.600", transform: "translateY(-50%) scale(1.1)" }}
          _active={{ transform: "translateY(-50%) scale(0.95)" }}
          transition="all 0.3s ease"
          zIndex={2}
        >
          <Icon as={FiChevronLeft} boxSize={{ base: 4, sm: 5, md: 5 }} />
        </Button>

        <Button
          position="absolute"
          right={{ base: 2, sm: 4, md: 6 }}
          top="50%"
          transform="translateY(-50%)"
          onClick={nextSlide}
          bg="blackAlpha.400"
          backdropFilter="blur(10px)"
          color="white"
          borderRadius="full"
          size={{ base: "xs", sm: "sm", md: "md" }}
          minW={{ base: "32px", sm: "36px", md: "44px" }}
          h={{ base: "32px", sm: "36px", md: "44px" }}
          p={0}
          _hover={{ bg: "blackAlpha.600", transform: "translateY(-50%) scale(1.1)" }}
          _active={{ transform: "translateY(-50%) scale(0.95)" }}
          transition="all 0.3s ease"
          zIndex={2}
        >
          <Icon as={FiChevronRight} boxSize={{ base: 4, sm: 5, md: 5 }} />
        </Button>

        {/* Navigation Dots - Bottom Center */}
        <Flex 
          position="absolute" 
          bottom={{ base: 3, sm: 4, md: 6 }} 
          left="50%"
          transform="translateX(-50%)"
          gap={{ base: 2, md: 3 }}
          bg="blackAlpha.500"
          backdropFilter="blur(10px)"
          px={{ base: 3, sm: 4, md: 5 }}
          py={{ base: 1.5, sm: 2 }}
          borderRadius="full"
          zIndex={2}
        >
          {slides.map((_, index) => (
            <Box
              key={index}
              cursor="pointer"
              onClick={() => handleSlideChange(index)}
              transition="all 0.3s ease"
              _hover={{ opacity: 0.8 }}
            >
              <Box
                w={activeIndex === index ? { base: "20px", sm: "24px", md: "32px" } : { base: "6px", sm: "7px", md: "8px" }}
                h={{ base: "3px", sm: "3px", md: "4px" }}
                bg={activeIndex === index ? 'white' : 'whiteAlpha.600'}
                borderRadius="full"
                transition="all 0.3s ease"
              />
            </Box>
          ))}
        </Flex>
      </Container>
    </Box>
  );
};

export default HeroSection;