"use client";

import React from "react";
import { 
  Box, 
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
import { FaFireAlt, FaRocket, FaGem } from "react-icons/fa";

// --- Theme Constant ---
const accentColor = "#00BFFF"; // Skyblue

// --- Animations ---
const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0px rgba(0, 191, 255, 0.4); }
  70% { box-shadow: 0 0 0 20px rgba(0, 191, 255, 0); }
  100% { box-shadow: 0 0 0 0px rgba(0, 191, 255, 0); }
`;

const marquee = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const ProductsListSection = observer(() => {
  const { themeStore: { themeConfig } } = stores;
  const isDarkMode = themeConfig.config.initialColorMode === "dark";

  // Use Skyblue for heading in both modes for brand consistency
  const headingColor = isDarkMode ? "white" : "gray.800";

  const sectionBg = useColorModeValue("gray.50", "rgba(5, 10, 20, 1)"); // Midnight Navy
  const cardStageBg = useColorModeValue("white", "rgba(10, 20, 35, 0.6)");

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
          ? `radial-gradient(circle at 2px 2px, ${accentColor}15 1px, transparent 0)` 
          : `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.02) 1px, transparent 0)`}
        bgSize="48px 48px"
        zIndex={0}
      />

      <Container maxW="container.2xl" position="relative" zIndex={1}>
        
        {/* --- SECTION 1: NEW SHOPS --- */}
        <Box mb={40}>
          <VStack spacing={6} mb={16}>
            <HStack bg={isDarkMode ? "whiteAlpha.100" : "white"} px={4} py={1} borderRadius="full" boxShadow="sm" border="1px solid" borderColor={`${accentColor}30`}>
                <Icon as={FaRocket} color={accentColor} boxSize={3} />
                <Text fontSize="10px" fontWeight="black" letterSpacing="2px" color={isDarkMode ? "whiteAlpha.700" : "gray.500"}>EXPERIENCE DESIGN</Text>
            </HStack>
            
            <CommonHeading
              heading="New Shops Added"
              subheading="Curated destinations for the modern explorer"
              color={headingColor}
              align="center"
            />
          </VStack>

          <Box 
            p={{ base: 4, md: 12 }} 
            borderRadius="80px" 
            bg={cardStageBg}
            backdropFilter="blur(20px)"
            border="1px solid"
            borderColor={useColorModeValue("gray.100", "whiteAlpha.200")}
            boxShadow={isDarkMode ? `0 40px 100px -30px rgba(0,0,0,0.7)` : "0 40px 100px -30px rgba(0,0,0,0.05)"}
            position="relative"
          >
            <Circle 
              size="60px" bg={accentColor} color="white" 
              position="absolute" top="-30px" left="50%" transform="translateX(-50%)"
              animation={`${pulseGlow} 2s infinite`}
              zIndex={2}
            >
              <Icon as={FaRocket} boxSize={6} />
            </Circle>
            
            <ShopSection />
          </Box>
        </Box>

        {/* --- ARTISTIC BRIDGE: THE ELITE MOMENTUM --- */}
        <Box position="relative" my={-10} zIndex={2} userSelect="none">
          <Flex justify="center" align="center" direction="column" position="relative">
            {/* Massive Ghost Text */}
            <Text 
              fontSize={{ base: "20vw", md: "15vw" }} 
              fontWeight="900" 
              color={isDarkMode ? "whiteAlpha.05" : "blackAlpha.05"} 
              letterSpacing="-10px"
              lineHeight="1"
            >
              ELITE
            </Text>

            {/* Slanted Glass Marquee */}
            <Box
              position="absolute"
              top="50%"
              left="50%"
              w="120%"
              bg={isDarkMode ? "rgba(10, 20, 35, 0.8)" : "rgba(255, 255, 255, 0.6)"}
              backdropFilter="blur(15px)"
              py={5}
              borderY="1px solid"
              borderColor={isDarkMode ? "whiteAlpha.200" : "blackAlpha.100"}
              boxShadow="2xl"
              style={{ transform: "translate(-50%, -50%) rotate(-1.5deg)" }}
            >
              <HStack 
                spacing={12} 
                whiteSpace="nowrap" 
                animation={`${marquee} 40s linear infinite`}
                display="flex"
              >
                {[...Array(8)].map((_, i) => (
                  <HStack key={i} spacing={12}>
                    <Text fontSize="sm" fontWeight="black" letterSpacing="4px" color={accentColor}>AUTHENTICITY</Text>
                    <Circle size="6px" bg="blue.400" />
                    <Text fontSize="sm" fontWeight="black" letterSpacing="4px" color={isDarkMode ? "white" : "gray.800"}>CURATED GEMS</Text>
                    <Circle size="6px" bg={accentColor} />
                    <Text fontSize="sm" fontWeight="black" letterSpacing="4px" color={accentColor}>PREMIUM QUALITY</Text>
                    <Circle size="6px" bg="indigo.400" />
                  </HStack>
                ))}
              </HStack>
            </Box>
          </Flex>
        </Box>

        {/* --- SECTION 2: RECENTLY ADDED --- */}
        <Box 
          position="relative" 
          mt={10} pt={24} pb={12} px={{ base: 4, md: 10 }}
          borderRadius="100px"
          bg={isDarkMode ? "whiteAlpha.50" : "white"}
          border="1px solid"
          borderColor={useColorModeValue(`${accentColor}20`, "transparent")}
        >
          <Box position="absolute" top="-40px" right="10%" animation={`${float} 5s ease-in-out infinite`}>
              <Icon as={FaGem} color={accentColor} opacity={0.6} boxSize={14} filter="drop-shadow(0 0 10px rgba(0,191,255,0.4))" />
          </Box>

          <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center" mb={16} gap={6} px={6}>
            <VStack align={{ base: "center", md: "start" }} spacing={2}>
              <HStack color={accentColor} spacing={3}>
                  <Box w="30px" h="2px" bg={accentColor} />
                  <Text fontSize="xs" fontWeight="black" letterSpacing="3px">LATEST DROPS</Text>
              </HStack>
              <CommonHeading
                heading="Recently Added"
                subheading="Hot arrivals fresh off the press"
                color={headingColor}
                align="left"
              />
            </VStack>
            
            <HStack spacing={4} bg={useColorModeValue("blue.50", "whiteAlpha.100")} p={4} borderRadius="2xl" border="1px solid" borderColor={`${accentColor}20`}>
              <Icon as={FaFireAlt} color={accentColor} />
              <VStack align="start" spacing={0}>
                <Text fontSize="xs" fontWeight="bold" color={isDarkMode ? "white" : "black"}>Trending</Text>
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
                    price: Number(product.price)
                  }} />
                </Box>
              ))}
            </Carousel>
          </Box>
        </Box>

      </Container>

      {/* Global CSS for Carousel Dots */}
      <style jsx global>{`
        .premium-carousel .slick-dots { bottom: -50px; }
        .premium-carousel .slick-dots li { width: 25px; height: 5px; transition: all 0.4s ease; }
        .premium-carousel .slick-dots li button:before {
          content: ""; width: 100%; height: 5px;
          background: ${isDarkMode ? "rgba(255,255,255,0.1)" : "#E2E8F0"};
          border-radius: 4px; opacity: 1;
        }
        .premium-carousel .slick-dots li.slick-active { width: 60px; }
        .premium-carousel .slick-dots li.slick-active button:before {
          background: ${accentColor};
          box-shadow: 0 4px 12px rgba(0, 191, 255, 0.5);
        }
        .premium-carousel .slick-list { overflow: visible !important; }
      `}</style>

    </Box>
  );
});

export default ProductsListSection;