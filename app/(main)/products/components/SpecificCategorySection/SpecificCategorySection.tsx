"use client";

import React from "react";
import { 
  Box, 
  Button, 
  Flex, 
  Grid, 
  Image, 
  Text, 
  VStack, 
  Icon, 
  HStack,
  Heading,
  useColorModeValue,
  Skeleton
} from "@chakra-ui/react";
import { data } from "./utils/constant";
import { keyframes } from "@emotion/react";
import { FiChevronRight, FiShield } from "react-icons/fi";

// --- ANIMATIONS ---
const slideUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const softFloat = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const HeroSectionProfessional = () => {
  // --- HOOKS (Top Level Only) ---
  const mainBg = useColorModeValue("#F4F7FF", "#060910"); 
  const cardBg = useColorModeValue("rgba(255, 255, 255, 0.8)", "rgba(15, 20, 28, 0.7)");
  const textColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.600", "whiteAlpha.600");
  const badgeBg = useColorModeValue("blue.50", "whiteAlpha.100");
  const itemBorderColor = useColorModeValue("white", "whiteAlpha.100");
  const imgBoxBg = useColorModeValue("blue.50", "whiteAlpha.50");
  const imgFilter = useColorModeValue("none", "brightness(0.9)");

  const accentColor = "#3B82F6"; 
  const secondaryAccent = "#8B5CF6";

  // --- DUMMY IMAGE FALLBACK LOGIC ---
  const getFallbackImage = (id: number) => {
    const fallbacks = [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop", 
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&auto=format&fit=crop", 
      "https://images.unsplash.com/photo-1526170315873-3a5616282a63?q=80&w=200&auto=format&fit=crop", 
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop", 
    ];
    return fallbacks[id % fallbacks.length];
  };

  return (
    <Box
      maxW="1550px"
      my={{ base: 12, md: 20 }}
      mx="auto"
      position="relative"
      px={{ base: 4, md: 10 }}
      animation={`${slideUp} 1.2s cubic-bezier(0.19, 1, 0.22, 1)`}
    >
      {/* Background Glow */}
      <Box
        position="absolute"
        top="-10%"
        right="-5%"
        w={{ base: "300px", md: "700px" }}
        h={{ base: "300px", md: "700px" }}
        bgGradient={`radial(${accentColor}, transparent, transparent)`}
        filter="blur(120px)"
        opacity={0.15}
        zIndex={0}
      />

      <Box
        position="relative"
        zIndex={1}
        bg={mainBg}
        p={{ base: 6, md: 16, lg: 24 }}
        rounded={{ base: "40px", md: "80px" }}
        boxShadow="0 80px 150px -40px rgba(0,0,0,0.4)"
        border="1px solid"
        borderColor={useColorModeValue("blue.100", "whiteAlpha.100")}
        overflow="hidden"
      >
        <Flex direction={{ base: "column", lg: "row" }} gap={{ base: 12, lg: 20 }} align="center">
          
          {/* LEFT CONTENT */}
          <VStack align={{ base: "center", lg: "start" }} spacing={10} flex="1" textAlign={{ base: "center", lg: "left" }}>
            <HStack bg={badgeBg} px={5} py={2} rounded="full" spacing={3}>
              <Icon as={FiShield} color={accentColor} />
              <Text fontSize="xs" fontWeight="black" letterSpacing="2px">ELITE SELECTION</Text>
            </HStack>

            <Box>
              <Heading fontSize={{ base: "4xl", md: "6xl", xl: "8xl" }} fontWeight="900" lineHeight="0.9" letterSpacing="-4px">
                The Art of <Text as="span" bgGradient={`linear(to-r, ${accentColor}, ${secondaryAccent})`} bgClip="text">Modern</Text> Living.
              </Heading>
              <Text mt={8} fontSize="xl" color={subTextColor} maxW="550px">
                Curating sophisticated tech and fashion where precision meets aesthetic.
              </Text>
            </Box>

            <Flex gap={5} direction={{ base: "column", sm: "row" }} w={{ base: "full", sm: "auto" }}>
              <Button size="lg" h="70px" px={12} bg={accentColor} color="white" rounded="2xl" _hover={{ transform: "translateY(-5px)" }}>
                Explore Gear
              </Button>
            </Flex>
          </VStack>

          {/* RIGHT GRID WITH SMART IMAGES */}
          <Box flex="1.1" w="full">
            <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={5}>
              {data.slice(0, 6).map((item: any, idx: number) => (
                <Box
                  key={item.id}
                  role="group"
                  cursor="pointer"
                  animation={`${softFloat} ${5 + idx}s infinite ease-in-out`}
                >
                  <VStack
                    p={6}
                    bg={cardBg}
                    backdropFilter="blur(20px)"
                    rounded="3xl"
                    border="1px solid"
                    borderColor={itemBorderColor}
                    transition="all 0.4s"
                    _hover={{ transform: "translateY(-10px)", borderColor: accentColor }}
                  >
                    <Box 
                      p={2} 
                      bg={imgBoxBg} 
                      rounded="2xl" 
                      overflow="hidden"
                      transition="0.4s"
                      _groupHover={{ bg: accentColor }}
                    >
                      <Image
                        src={item.img || getFallbackImage(idx)}
                        alt={item.title}
                        boxSize={{ base: "70px", md: "90px" }}
                        objectFit="cover"
                        rounded="xl"
                        fallback={<Skeleton boxSize="90px" rounded="xl" />}
                        filter={imgFilter}
                        _groupHover={{ filter: "brightness(1.1)", transform: "scale(1.1)" }}
                      />
                    </Box>

                    <Text fontWeight="800" color={textColor} fontSize="sm">
                      {item.title}
                    </Text>
                    
                    <Flex align="center" color={accentColor} fontSize="xs" fontWeight="bold" opacity={0} _groupHover={{ opacity: 1 }}>
                      VIEW <Icon as={FiChevronRight} />
                    </Flex>
                  </VStack>
                </Box>
              ))}
            </Grid>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default HeroSectionProfessional;