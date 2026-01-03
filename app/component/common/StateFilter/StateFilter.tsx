'use client'
import {
  Box,
  Flex,
  Heading,
  Image,
  Text,
  VStack,
  useColorModeValue,
  Circle,
  Container,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Carousel from "../CommonCarousel/CommonCarousel";
import CommonHeading from "../CommonHeading/CommonHeading";
import { indianStates } from "./utils/constant";

const MotionBox = motion(Box);
const MotionImage = motion(Image);

const StateFilter = () => {
  // Theme Colors
  const skyBlue = "#00BFFF";
  const midnightBg = useColorModeValue("#fbfbf9", "#050A14"); // Custom Midnight Navy
  const cardBg = useColorModeValue("white", "rgba(15, 25, 40, 0.7)");
  const textColor = useColorModeValue("gray.700", "whiteAlpha.900");
  const decorationColor = useColorModeValue("gray.100", "whiteAlpha.100");
  const cardBorderColor = useColorModeValue("gray.50", "whiteAlpha.200");

  const carouselSettings = {
    slidesToShow: 6,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 1200,
    dots: false,
    arrows: false,
    responsive: [
      { breakpoint: 1536, settings: { slidesToShow: 5 } },
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1.2 } },
    ],
  };

  return (
    <Box 
      py={{ base: 16, md: 24 }} 
      bg={midnightBg} 
      position="relative" 
      overflow="hidden"
    >
      {/* 1. ARTISTIC DECOR BACKGROUND - "HERITAGE" TEXT */}
      <Text
        position="absolute"
        top="0"
        left="50%"
        transform="translateX(-50%)"
        fontSize={{ base: "100px", md: "220px" }}
        fontWeight="1000"
        color={decorationColor}
        letterSpacing={{ base: "10px", md: "20px" }}
        zIndex={0}
        userSelect="none"
        whiteSpace="nowrap"
      >
        HERITAGE
      </Text>

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <VStack spacing={6} mb={16} textAlign="center">
          <CommonHeading
            fontSize={{ base: '3xl', md: '5xl' }}
            color={textColor}
            align="center"
            heading="Discover Unique Products from Every State"
            subheading="Explore a variety of handmade and traditional items from all over India."
          />
          <Flex align="center" gap={4}>
            <Box h="1px" w="40px" bg={skyBlue} />
            <Text fontWeight="bold" fontSize="sm" color={skyBlue} textTransform="uppercase" letterSpacing="3px">
              Crafted with Love
            </Text>
            <Box h="1px" w="40px" bg={skyBlue} />
          </Flex>
        </VStack>

        <Carousel {...carouselSettings}>
          {indianStates.map((state, index) => (
            <Box key={index} px={4} py={8}>
              <MotionBox
                initial="initial"
                whileHover="hover"
                cursor="pointer"
                position="relative"
                role="group" 
              >
                {/* 2. THE FLOATING CARD DESIGN */}
                <MotionBox
                  variants={{
                    hover: { y: -20 },
                    initial: { y: 0 }
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  borderRadius="2xl" 
                  bg={cardBg}
                  backdropFilter="blur(10px)"
                  boxShadow="0 20px 40px rgba(0,0,0,0.08)"
                  border="1px solid"
                  borderColor={cardBorderColor}
                  overflow="hidden"
                  height={{ base: "320px", md: "400px" }}
                >
                  {/* Image Container */}
                  <Box height="75%" overflow="hidden" position="relative">
                    <MotionImage
                      variants={{
                        hover: { scale: 1.1 },
                        initial: { scale: 1 }
                      }}
                      transition={{ duration: 0.8 }}
                      src={state.image}
                      alt={state.state}
                      objectFit="cover"
                      h="100%"
                      w="100%"
                    />
                  </Box>

                  {/* 3. CONTENT AREA */}
                  <Flex
                    direction="column"
                    p={4}
                    bg={cardBg}
                    height="25%"
                    justify="center"
                    align="center"
                    transition="all 0.4s ease"
                    _groupHover={{ bg: skyBlue }}
                  >
                    <Heading 
                      as="h3" 
                      size="sm" 
                      fontWeight="900" 
                      textAlign="center"
                      textTransform="uppercase"
                      letterSpacing="1px"
                      color={textColor}
                      transition="all 0.4s"
                      _groupHover={{ color: "white" }}
                    >
                      {state.state}
                    </Heading>
                    
                    <Box
                      w="0px"
                      h="2px"
                      bg="white"
                      mt={2}
                      transition="all 0.4s"
                      _groupHover={{ w: "40px" }}
                    />
                  </Flex>
                </MotionBox>

                {/* 4. DECORATIVE NUMBERING */}
                <Circle
                  position="absolute"
                  top="-10px"
                  right="10px"
                  size="40px"
                  bg={useColorModeValue("white", "gray.800")}
                  boxShadow="lg"
                  fontSize="xs"
                  border="2px solid"
                  borderColor={skyBlue}
                  fontWeight="black"
                  color={useColorModeValue(skyBlue, "white")}
                  zIndex={2}
                >
                  {String(index + 1).padStart(2, '0')}
                </Circle>
              </MotionBox>
            </Box>
          ))}
        </Carousel>
      </Container>
      
      {/* 5. BOTTOM SWIPE INDICATOR */}
      <Flex justify="center" mt={10}>
         <MotionBox 
            animate={{ x: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            fontSize="xs" 
            color={skyBlue} 
            fontWeight="bold" 
            letterSpacing="2px"
            opacity={0.8}
         >
            SWIPE TO EXPLORE BHARAT →
         </MotionBox>
      </Flex>
    </Box>
  );
};

export default StateFilter;