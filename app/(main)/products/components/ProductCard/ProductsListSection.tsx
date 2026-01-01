"use client";

import { 
  Box, 
  Grid, 
  useBreakpointValue, 
  useColorModeValue, 
  VStack, 
  Icon, 
  Flex,
  Text,
  HStack,
  Container,
  Circle
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { keyframes } from "@emotion/react";
import Carousel from "../../../../component/common/CommonCarousel/CommonCarousel";
import CommonHeading from "../../../../component/common/CommonHeading/CommonHeading";
import stores from "../../../../store/stores";
import ShopSection from "../../../component/shopSection/ShopSection";
import { uniqueProducts } from "../utils/constant";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton/ProductCardSkeleton";
import { FaFireAlt, FaRocket, FaGem } from "react-icons/fa";

// Sophisticated Float
const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
`;

// Soft Inner Glow Pulse
const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0px rgba(56, 178, 172, 0.4); }
  70% { box-shadow: 0 0 0 20px rgba(56, 178, 172, 0); }
  100% { box-shadow: 0 0 0 0px rgba(56, 178, 172, 0); }
`;

const ProductsListSection = observer(() => {
  const { themeStore: { themeConfig } } = stores;
  const isDarkMode = themeConfig.config.initialColorMode === "dark";

  const headingColor = isDarkMode
    ? themeConfig.colors.dark.primary[500]
    : themeConfig.colors.light.primary[500];

  const sectionBg = useColorModeValue("gray.50", "gray.950");
  const cardStageBg = useColorModeValue("white", "rgba(23, 25, 35, 0.4)");

  const slidesToShow = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }) || 1;

  const carouselSettings = {
    slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 1000,
    dots: true,
    infinite: true,
    arrows: slidesToShow > 1,
    pauseOnHover: true,
  };

  return (
    <Box position="relative" bg={sectionBg} py={24} overflow="hidden">
      
      {/* --- DESIGNER MESH BACKGROUND --- */}
      <Box 
        position="absolute" top="0" left="0" w="full" h="full" 
        bgImage={isDarkMode 
          ? "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)" 
          : "radial-gradient(circle at 2px 2px, rgba(0,0,0,0.02) 1px, transparent 0)"}
        bgSize="48px 48px"
        zIndex={0}
      />

      <Container maxW="container.2xl" position="relative" zIndex={1}>
        
        {/* --- SECTION 1: NEW SHOPS (The Premium Stage) --- */}
        <Box mb={40}>
          <VStack spacing={6} mb={16}>
            <HStack bg="white" px={4} py={1} borderRadius="full" boxShadow="sm" border="1px solid" borderColor="teal.50">
                <Icon as={FaRocket} color="teal.400" boxSize={3} />
                <Text fontSize="10px" fontWeight="black" letterSpacing="2px" color="gray.500">EXPERIENCE DESIGN</Text>
            </HStack>
            
            <VStack spacing={0}>
              <CommonHeading
                heading="New Shops Added"
                subheading="Curated destinations for the modern explorer"
                color={headingColor}
                align="center"
              />
            </VStack>
          </VStack>

          <Box 
            p={{ base: 4, md: 12 }} 
            borderRadius="80px" 
            bg={cardStageBg}
            backdropFilter="blur(20px)"
            border="1px solid"
            borderColor={useColorModeValue("gray.100", "whiteAlpha.100")}
            boxShadow="0 40px 100px -30px rgba(0,0,0,0.05)"
            position="relative"
          >
            <Circle 
              size="60px" bg="teal.400" color="white" 
              position="absolute" top="-30px" left="50%" transform="translateX(-50%)"
              animation={`${pulseGlow} 2s infinite`}
              zIndex={2}
            >
              <Icon as={FaRocket} boxSize={6} />
            </Circle>
            
            <ShopSection />
          </Box>
        </Box>

        {/* --- ARTISTIC BRIDGE --- */}
        <Flex justify="center" align="center" my={-20} opacity={0.05} userSelect="none">
            <Text fontSize="15vw" fontWeight="900" color="gray.500" letterSpacing="-10px">
              GEMS
            </Text>
        </Flex>

        {/* --- SECTION 2: RECENTLY ADDED (The Infinite Gallery) --- */}
        <Box 
          position="relative" 
          mt={10} pt={20} pb={12} px={{ base: 4, md: 10 }}
          borderRadius="100px"
          bg={isDarkMode ? "whiteAlpha.50" : "white"}
          border="1px solid"
          borderColor={useColorModeValue("teal.50", "transparent")}
        >
          {/* Floating Gem Accent */}
          <Box position="absolute" top="-40px" right="10%" animation={`${float} 5s ease-in-out infinite`}>
             <Icon as={FaGem} color="blue.300" boxSize={14} opacity={0.4} />
          </Box>

          <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center" mb={16} gap={6} px={6}>
            <VStack align={{ base: "center", md: "start" }} spacing={2}>
              <HStack color="blue.400" spacing={3}>
                 <Box w="30px" h="2px" bg="blue.400" />
                 <Text fontSize="xs" fontWeight="black" letterSpacing="3px">LATEST DROPS</Text>
              </HStack>
              <CommonHeading
                heading="Recently Added"
                subheading="Hot arrivals fresh off the press"
                color={headingColor}
                align="left"
              />
            </VStack>
            
            <HStack spacing={4} bg={useColorModeValue("gray.50", "gray.800")} p={4} borderRadius="2xl">
              <Icon as={FaFireAlt} color="orange.400" />
              <VStack align="start" spacing={0}>
                <Text fontSize="xs" fontWeight="bold">Trending</Text>
                <Text fontSize="10px" color="gray.500">Popular this week</Text>
              </VStack>
            </HStack>
          </Flex>

          <Box className="premium-carousel">
            <Carousel {...carouselSettings}>
              {uniqueProducts.map((product) => (
                <Box
                  key={`${product.id}-${product.name}-carousel`}
                  px={4} py={10}
                  transition="all 0.5s cubic-bezier(0.19, 1, 0.22, 1)"
                  _hover={{ transform: "scale(1.03) translateY(-10px)" }}
                >
                  <ProductCard product={{
                    ...product,
                    // FIX: Convert string price to number to satisfy ProductCard interface
                    price: Number(product.price)
                  }} />
                </Box>
              ))}
            </Carousel>
            
            <Grid display="none" templateColumns={"repeat(5, 1fr)"} gap={4} my={2}>
              {[...Array(5)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </Grid>
          </Box>
        </Box>

      </Container>

      {/* --- INJECTED PREMIUM STYLES --- */}
      <style jsx global>{`
        .premium-carousel .slick-dots { bottom: -50px; }
        .premium-carousel .slick-dots li { width: 25px; height: 5px; transition: all 0.4s ease; }
        .premium-carousel .slick-dots li button { width: 100%; height: 100%; padding: 0; }
        .premium-carousel .slick-dots li button:before {
          content: ""; width: 100%; height: 5px;
          background: ${isDarkMode ? "rgba(255,255,255,0.1)" : "#E2E8F0"};
          border-radius: 4px; opacity: 1;
        }
        .premium-carousel .slick-dots li.slick-active { width: 60px; }
        .premium-carousel .slick-dots li.slick-active button:before {
          background: #319795;
          box-shadow: 0 4px 12px rgba(49, 151, 149, 0.4);
        }
        .premium-carousel .slick-list { overflow: visible !important; }
      `}</style>

    </Box>
  );
});

export default ProductsListSection;