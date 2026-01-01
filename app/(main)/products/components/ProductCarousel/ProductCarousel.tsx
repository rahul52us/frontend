'use client'
import { Box, Flex, Heading, Text, VStack, Button, Icon, HStack } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import CommonHeading from "../../../../component/common/CommonHeading/CommonHeading";
import stores from "../../../../store/stores";
import { observer } from "mobx-react-lite";
import { featuredProducts } from "./utils/constant";
import { FiArrowRight } from "react-icons/fi";

// --- LOVABLE ANIMATIONS ---
const progress = keyframes`
  from { width: 0%; }
  to { width: 100%; }
`;

const floatBlob = keyframes`
  0% { transform: translate(0px, 0px); }
  33% { transform: translate(30px, -50px); }
  66% { transform: translate(-20px, 20px); }
  100% { transform: translate(0px, 0px); }
`;

const MotionBox = motion(Box);

const ProductCarousel = observer(() => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { themeStore: { themeConfig } } = stores;
  const isDarkMode = themeConfig.config.initialColorMode === "dark";

  // Auto-play logic
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const primaryColor = isDarkMode
    ? themeConfig.colors.dark.primary[500]
    : themeConfig.colors.light.primary[500];

  return (
    <Box 
      py={20} 
      my={{ base: 8, md: 16 }} 
      px={{ base: 6, md: 12 }}
      position="relative"
      overflow="hidden"
      bg={isDarkMode ? "gray.950" : "gray.50"}
      rounded={{ base: "40px", md: "80px" }}
    >
      {/* 1. DECORATIVE AMBIENT BLOBS */}
      <Box
        position="absolute"
        top="-10%"
        left="-5%"
        w="600px"
        h="600px"
        bg={primaryColor}
        filter="blur(140px)"
        opacity={0.07}
        animation={`${floatBlob} 15s infinite ease-in-out`}
        zIndex={0}
      />

      <CommonHeading
        heading="Must-Have Picks for You"
        subheading="Experience the future of style with our curated trending collections."
        mb={{ base: 12, md: 20 }}
        color={primaryColor}
      />

      <Flex 
        gap={{ base: 10, lg: 16 }} 
        direction={{ base: "column", lg: "row" }} 
        align="center"
        position="relative"
        zIndex={1}
      >
        {/* --- LEFT: THE DYNAMIC 3D GALLERY --- */}
        <Flex 
          flex={1.8} 
          gap={4} 
          w="full"
          h={{ base: "450px", md: "600px" }}
          direction="row"
          sx={{ perspective: "1200px" }} // Fixed the perspective error
        >
          {featuredProducts.map((product, index) => {
            const isActive = activeIndex === index;
            return (
              <MotionBox
                key={index}
                flex={isActive ? 6 : 1}
                position="relative"
                borderRadius="32px"
                overflow="hidden"
                cursor="pointer"
                onMouseEnter={() => setActiveIndex(index)}
                initial={false}
                animate={{
                  flex: isActive ? 6 : 1,
                  scale: isActive ? 1 : 0.95,
                  rotateY: isActive ? 0 : index < activeIndex ? 15 : -15, // 3D Book-fold effect
                }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                style={{ transformStyle: "preserve-3d" }}
                boxShadow={isActive ? "0 40px 80px -20px rgba(0,0,0,0.35)" : "none"}
              >
                {/* Image Background */}
                <Box
                  w="100%"
                  h="100%"
                  bgImage={product.image}
                  bgSize="cover"
                  bgPosition="center"
                  transition="all 1.2s ease"
                  transform={isActive ? "scale(1.1)" : "scale(1.3)"}
                  filter={isActive ? "brightness(1.1)" : "brightness(0.4) grayscale(0.3)"}
                />

                {/* Vertical Label for Inactive Items */}
                <AnimatePresence>
                  {!isActive && (
                    <MotionBox
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      position="absolute"
                      inset={0}
                      bg="blackAlpha.400"
                      backdropFilter="blur(6px)"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text
                        sx={{ writingMode: "vertical-rl" }}
                        transform="rotate(180deg)"
                        color="whiteAlpha.900"
                        fontWeight="900"
                        fontSize="sm"
                        letterSpacing="5px"
                        textTransform="uppercase"
                      >
                        {product.title}
                      </Text>
                    </MotionBox>
                  )}
                </AnimatePresence>

                {/* Active Progress Bar Overlay */}
                {isActive && (
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    w="100%"
                    h="8px"
                    bg="whiteAlpha.300"
                  >
                    <Box
                      h="100%"
                      bg="white"
                      boxShadow="0 0 20px white"
                      animation={`${progress} 5s linear`}
                    />
                  </Box>
                )}
              </MotionBox>
            );
          })}
        </Flex>

        {/* --- RIGHT: THE STORYTELLING CONTENT --- */}
        <VStack 
          flex={1} 
          align="start" 
          spacing={10} 
          p={{ base: 6, md: 12 }}
          bg={isDarkMode ? "whiteAlpha.50" : "white"}
          borderRadius="50px"
          boxShadow="2xl"
          border="1px solid"
          borderColor={isDarkMode ? "whiteAlpha.100" : "gray.100"}
          backdropFilter="blur(30px)"
          position="relative"
        >
          <AnimatePresence mode="wait">
            <MotionBox
              key={activeIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <HStack spacing={4} mb={6}>
                <Box w="50px" h="3px" bg={primaryColor} rounded="full" />
                <Text 
                  color={primaryColor} 
                  fontWeight="900" 
                  fontSize="xs" 
                  letterSpacing="4px"
                >
                  SELECTION 0{activeIndex + 1}
                </Text>
              </HStack>

              <Heading 
                fontSize={{ base: "3xl", md: "5xl" }} 
                mb={6} 
                color={isDarkMode ? "white" : "gray.900"}
                lineHeight="1.1"
                letterSpacing="-2.5px"
                fontWeight="900"
              >
                {featuredProducts[activeIndex].title}
              </Heading>
              
              <Text 
                fontSize="lg" 
                color={isDarkMode ? "whiteAlpha.700" : "gray.600"} 
                lineHeight="tall"
                mb={10}
                fontWeight="medium"
              >
                {featuredProducts[activeIndex].description}
              </Text>

              <Flex align="center" gap={8} flexWrap="wrap">
                <VStack align="start" spacing={0}>
                  <Text fontSize="2xs" color="gray.500" fontWeight="black" letterSpacing="2px">STATUS</Text>
                  <Text fontWeight="900" fontSize="2xl" color={primaryColor} textTransform="uppercase">
                    {featuredProducts[activeIndex].availability}
                  </Text>
                </VStack>

                <Button
                  rightIcon={<Icon as={FiArrowRight} />}
                  bg={primaryColor}
                  color="white"
                  h="70px"
                  px={10}
                  rounded="24px"
                  fontSize="md"
                  fontWeight="bold"
                  boxShadow={`0 20px 40px ${primaryColor}44`}
                  _hover={{ 
                    transform: "translateY(-6px) scale(1.03)",
                    bg: isDarkMode ? "white" : "gray.900",
                    color: isDarkMode ? "black" : "white",
                    boxShadow: `0 25px 50px ${primaryColor}66`,
                  }}
                  transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                >
                  EXPLORE ITEM
                </Button>
              </Flex>
            </MotionBox>
          </AnimatePresence>

          {/* Pagination Indicators (Bottom) */}
          <HStack spacing={4}>
            {featuredProducts.map((_, i) => (
              <Box
                key={i}
                w={activeIndex === i ? "50px" : "12px"}
                h="12px"
                bg={activeIndex === i ? primaryColor : isDarkMode ? "whiteAlpha.200" : "gray.200"}
                rounded="full"
                transition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                cursor="pointer"
                onClick={() => setActiveIndex(i)}
                _hover={{ bg: primaryColor }}
              />
            ))}
          </HStack>
        </VStack>
      </Flex>
    </Box>
  );
});

export default ProductCarousel;