import { Box, Flex, Heading, Image, Text, HStack, Badge, Icon, useColorModeValue, VStack, Circle, Button, Container } from "@chakra-ui/react";
import Carousel from "../CommonCarousel/CommonCarousel";
import CommonHeading from "../CommonHeading/CommonHeading";
import { indianStates } from "./utils/constant";
import { useState } from "react";
import { FiMapPin, FiHeart, FiStar, FiAward, FiCompass, FiTrendingUp } from "react-icons/fi";
import { FaHandsHelping, FaStore } from "react-icons/fa";

const StateFilter = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Professional blue & white color mode values
  const sectionBg = useColorModeValue("blue.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const gradientOverlay = useColorModeValue(
    "linear(180deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0.75) 100%)",
    "linear(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)"
  );

  // Sample data enhancement
  const enhancedStates = indianStates.map((state, idx) => ({
    ...state,
    productCount: Math.floor(Math.random() * 500) + 100,
    rating: (Math.random() * 1.5 + 3.5).toFixed(1),
    isTrending: idx < 5,
    popularItem: ["Handicrafts", "Textiles", "Pottery", "Jewelry", "Spices", "Art"][idx % 6]
  }));

  const settings = {
    slidesToShow: 6,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 5 } },
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 2.5 } },
      { breakpoint: 480, settings: { slidesToShow: 1.5 } }
    ]
  };

  return (
    <Box 
      py={{ base: 6, md: 12, lg: 16 }} 
      bg={sectionBg} 
      position="relative" 
      overflow="hidden"
    >
      {/* Background Decorative Elements - Blue & White Theme */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        h="200px"
        bgGradient="linear(135deg, blue.100 0%, cyan.100 100%)"
        opacity="0.4"
        _dark={{ opacity: 0.05 }}
      />
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        h="150px"
        bgGradient="linear(135deg, blue.50 0%, white 100%)"
        opacity="0.6"
        _dark={{ opacity: 0 }}
      />

      <Container maxW="100%" px={{ base: 4, md: 6, lg: 8 }}>
        {/* Header Section */}
        <Box position="relative" zIndex={2} mb={{ base: 6, md: 10 }}>
          <Flex justify="center" mb={4}>
            <HStack spacing={2}>
              <Icon as={FiCompass} boxSize={5} color="blue.500" />
              <Text
                fontSize="xs"
                fontWeight="800"
                letterSpacing="widest"
                textTransform="uppercase"
                bgGradient="linear(135deg, #2563eb 0%, #1e3a8a 100%)"
                bgClip="text"
              >
                Explore India
              </Text>
              <Icon as={FiHeart} boxSize={5} color="blue.400" />
            </HStack>
          </Flex>
          
          <CommonHeading
            mb={{ base: 2, md: 4 }}
            fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
            fontWeight="900"
            color={"gray.800"}
            _dark={{ color: "white" }}
            padding={2}
            align={"center"}
            heading="Discover Treasures from Every State"
            subheading="Experience the rich cultural heritage through unique handcrafted products from across India"
          />
          
          {/* Stats Bar - Mobile Friendly */}
          <Flex 
            justify="center" 
            gap={{ base: 3, md: 8 }} 
            mt={6}
            direction={{ base: "column", sm: "row" }}
            align="center"
          >
            <HStack spacing={2} bg="whiteAlpha.800" _dark={{ bg: "gray.800" }} px={4} py={2} borderRadius="full" boxShadow="sm">
              <Circle size="32px" bg="blue.100" _dark={{ bg: "blue.900" }}>
                <Icon as={FaStore} color="blue.600" size={14} />
              </Circle>
              <Box>
                <Text fontWeight="bold" fontSize="xl" color="blue.700" _dark={{ color: "blue.200" }}>{indianStates.length}+</Text>
                <Text fontSize="xs" color="gray.600" _dark={{ color: "gray.400" }}>States & UTs</Text>
              </Box>
            </HStack>
            <HStack spacing={2} bg="whiteAlpha.800" _dark={{ bg: "gray.800" }} px={4} py={2} borderRadius="full" boxShadow="sm">
              <Circle size="32px" bg="cyan.100" _dark={{ bg: "cyan.900" }}>
                <Icon as={FaHandsHelping} color="cyan.600" size={14} />
              </Circle>
              <Box>
                <Text fontWeight="bold" fontSize="xl" color="cyan.700" _dark={{ color: "cyan.200" }}>10K+</Text>
                <Text fontSize="xs" color="gray.600" _dark={{ color: "gray.400" }}>Artisans</Text>
              </Box>
            </HStack>
            <HStack spacing={2} bg="whiteAlpha.800" _dark={{ bg: "gray.800" }} px={4} py={2} borderRadius="full" boxShadow="sm">
              <Circle size="32px" bg="blue.100" _dark={{ bg: "blue.900" }}>
                <Icon as={FiAward} color="blue.600" size={14} />
              </Circle>
              <Box>
                <Text fontWeight="bold" fontSize="xl" color="blue.700" _dark={{ color: "blue.200" }}>50K+</Text>
                <Text fontSize="xs" color="gray.600" _dark={{ color: "gray.400" }}>Products</Text>
              </Box>
            </HStack>
          </Flex>
        </Box>

        {/* Carousel Section - Mobile Optimized */}
        <Box position="relative" zIndex={2} px={{ base: 1, md: 4 }}>
          <Carousel {...settings}>
            {enhancedStates.map((state, index) => (
              <Box
                key={index}
                px={{ base: 1, md: 2 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                cursor="pointer"
                transition="all 0.3s ease"
                transform={hoveredIndex === index ? "translateY(-4px)" : "translateY(0)"}
              >
                <Box
                  position="relative"
                  borderRadius="2xl"
                  overflow="hidden"
                  bg={cardBg}
                  boxShadow={hoveredIndex === index ? "xl" : "md"}
                  transition="all 0.3s ease"
                  height={{ base: "220px", md: "260px" }}
                >
                  <Image
                    src={state.image}
                    alt={state.state}
                    objectFit="cover"
                    height="100%"
                    width="100%"
                    transition="transform 0.5s ease"
                    transform={hoveredIndex === index ? "scale(1.06)" : "scale(1)"}
                  />

                  <Box
                    position="absolute"
                    inset={0}
                    bgGradient={gradientOverlay}
                  />

                  {/* Trending Badge - Blue theme */}
                  {state.isTrending && (
                    <Badge
                      position="absolute"
                      top={3}
                      left={3}
                      bg="linear(135deg, #2563eb 0%, #1e3a8a 100%)"
                      color="white"
                      px={2.5}
                      py={1}
                      borderRadius="full"
                      fontSize="10px"
                      fontWeight="bold"
                      zIndex={2}
                    >
                      <HStack spacing={1}>
                        <Icon as={FiTrendingUp} boxSize={3} />
                        <Text>TRENDING</Text>
                      </HStack>
                    </Badge>
                  )}

                  {/* Rating Badge */}
                  <Badge
                    position="absolute"
                    top={3}
                    right={3}
                    bg="whiteAlpha.300"
                    backdropFilter="blur(10px)"
                    color="white"
                    px={2}
                    py={1}
                    borderRadius="full"
                    fontSize="10px"
                    zIndex={2}
                  >
                    <HStack spacing={1}>
                      <Icon as={FiStar} boxSize={3} fill="gold" />
                      <Text>{state.rating}</Text>
                    </HStack>
                  </Badge>

                  <VStack
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    p={{ base: 3, md: 4 }}
                    color="white"
                    spacing={{ base: 1, md: 2 }}
                    align="flex-start"
                    zIndex={2}
                  >
                    <Flex align="center" gap={2}>
                      <Icon as={FiMapPin} boxSize={3} />
                      <Heading as="h3" size={{ base: "sm", md: "md" }} fontWeight="800" letterSpacing="-0.5px">
                        {state.state}
                      </Heading>
                    </Flex>
                    
                    <Box
                      opacity={hoveredIndex === index ? 1 : 0}
                      transform={hoveredIndex === index ? "translateY(0)" : "translateY(10px)"}
                      transition="all 0.3s ease"
                      width="100%"
                    >
                      <Text fontSize={{ base: "9px", md: "xs" }} opacity={0.9} noOfLines={2}>
                        Known for {state.popularItem} • {state.productCount}+ products
                      </Text>
                      
                      <Button
                        size="xs"
                        variant="outline"
                        borderColor="white"
                        borderRadius="full"
                        mt={2}
                        px={{ base: 3, md: 4 }}
                        py={1}
                        height="auto"
                        fontSize={{ base: "8px", md: "10px" }}
                        fontWeight="bold"
                        bg="whiteAlpha.200"
                        backdropFilter="blur(4px)"
                        _hover={{ bg: "white", color: "blue.600" }}
                        transition="all 0.3s"
                      >
                        Explore Collection
                      </Button>
                    </Box>
                  </VStack>

                  {/* Bottom Border - Blue theme */}
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    height="3px"
                    bgGradient="linear(90deg, #2563eb, #3b82f6, #06b6d4, #2563eb)"
                    transformOrigin="left"
                    transition="transform 0.3s ease"
                    transform={hoveredIndex === index ? "scaleX(1)" : "scaleX(0)"}
                  />
                </Box>
              </Box>
            ))}
          </Carousel>
        </Box>

        {/* Footer CTA - Blue theme */}
        <Flex justify="center" mt={{ base: 8, md: 12 }}>
          <Button
            size={{ base: "md", md: "lg" }}
            variant="solid"
            bg="blue.600"
            color="white"
            borderRadius="full"
            px={{ base: 6, md: 8 }}
            rightIcon={<FiCompass />}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "xl",
              bg: "blue.700"
            }}
            transition="all 0.3s"
          >
            View All States
          </Button>
        </Flex>
      </Container>
    </Box>
  );
};

export default StateFilter;