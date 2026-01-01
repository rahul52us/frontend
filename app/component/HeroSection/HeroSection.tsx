"use client";

import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiPlayCircle, FiX, FiArrowRight, FiZap } from "react-icons/fi";
import { slides } from "./constant";
import { keyframes } from "@emotion/react";

// --- LOVABLE ANIMATIONS ---
const morph = keyframes`
  0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
`;

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Auto-slide logic (pauses if video is playing)
  useEffect(() => {
    if (isVideoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isVideoPlaying]);

  const toggleVideo = () => setIsVideoPlaying(!isVideoPlaying);

  return (
    <Box
      position="relative"
      height={{ base: "auto", md: "520px" }}
      mb={4}
      mt={4}
      overflow="hidden"
      bg="gray.50"
      rounded="3xl"
      boxShadow="0 20px 50px rgba(0,0,0,0.05)"
    >
      {/* 1. LAYER: DYNAMIC BACKGROUND GRADIENTS */}
      {slides.map((slide, index) => (
        <Box
          key={index}
          position="absolute"
          inset={0}
          opacity={activeIndex === index ? 1 : 0}
          bgGradient={slide.bgGradient}
          transition="all 1.2s cubic-bezier(0.4, 0, 0.2, 1)"
          zIndex={0}
        />
      ))}

      {/* 2. LAYER: ORGANIC FLOATING BLOBS (Lovable Detail) */}
      <Box
        position="absolute"
        top="-10%"
        right="5%"
        w="400px"
        h="400px"
        bg="whiteAlpha.400"
        filter="blur(60px)"
        animation={`${morph} 15s infinite linear`}
        zIndex={1}
      />

      <Container maxW="100%" height="100%" position="relative" zIndex={2}>
        <Grid
          templateColumns={{ base: "1fr", md: "1.2fr 0.8fr" }}
          gap={0}
          height="100%"
          alignItems="center"
        >
          {/* --- LEFT CONTENT --- */}
          <GridItem px={{ base: 6, md: 16 }} py={{ base: 12, md: 0 }}>
            <VStack
              spacing={6}
              align="flex-start"
              key={activeIndex}
              animation="fadeInUp 0.8s cubic-bezier(0.2, 1, 0.3, 1)"
            >
              <HStack>
                <Badge
                  bg="whiteAlpha.800"
                  backdropFilter="blur(10px)"
                  px={4}
                  py={1.5}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="black"
                  color="gray.700"
                  boxShadow="sm"
                >
                  <HStack spacing={2}>
                    <FiZap color="#FFB100" />
                    <Text>{slides[activeIndex].badge}</Text>
                  </HStack>
                </Badge>
              </HStack>

              <Heading
                fontSize={{ base: "3xl", md: "5xl" }}
                fontWeight="900"
                lineHeight="1.1"
                letterSpacing="-2px"
                color="gray.800"
              >
                {slides[activeIndex].title}
              </Heading>

              <Text
                fontSize={{ base: "md", md: "xl" }}
                color="blackAlpha.700"
                maxW="500px"
                lineHeight="tall"
              >
                {slides[activeIndex].text}
              </Text>

              <HStack spacing={4} pt={4} w={{ base: "full", md: "auto" }}>
                <Button
                  size="lg"
                  h="65px"
                  px={10}
                  bg="gray.900"
                  color="white"
                  borderRadius="24px"
                  rightIcon={<FiArrowRight />}
                  _hover={{ transform: "translateY(-4px) scale(1.02)", bg: "black" }}
                  transition="all 0.3s"
                >
                  Shop Now
                </Button>
                
                <Button
                  onClick={toggleVideo}
                  size="lg"
                  h="65px"
                  variant="ghost"
                  color="gray.800"
                  borderRadius="24px"
                  leftIcon={<FiPlayCircle size="24px" />}
                  _hover={{ bg: "whiteAlpha.600" }}
                >
                  Watch Video
                </Button>
              </HStack>
            </VStack>
          </GridItem>

          {/* --- RIGHT MEDIA SECTION --- */}
          <GridItem height="100%" position="relative">
            <Flex
              h="100%"
              align="center"
              justify="center"
              position="relative"
              pr={{ base: 0, md: 8 }}
            >
              {/* Image Container */}
              <Box
                w="100%"
                h={{ base: "300px", md: "420px" }}
                position="relative"
                transform={isVideoPlaying ? "scale(0.8) translateX(100px)" : "scale(1)"}
                opacity={isVideoPlaying ? 0 : 1}
                transition="all 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
                animation={`${float} 6s infinite ease-in-out`}
              >
                <Image
                  key={activeIndex}
                  src={slides[activeIndex].image}
                  alt="Product"
                  w="100%"
                  h="100%"
                  objectFit="contain"
                  animation="scaleIn 1s cubic-bezier(0.2, 1, 0.3, 1)"
                />
              </Box>

              {/* VIDEO OVERLAY */}
              <Box
                position="absolute"
                inset={0}
                m={4}
                bg="black"
                rounded="3xl"
                overflow="hidden"
                transform={isVideoPlaying ? "translateX(0)" : "translateX(100%) opacity(0)"}
                opacity={isVideoPlaying ? 1 : 0}
                transition="all 0.8s cubic-bezier(0.19, 1, 0.22, 1)"
                zIndex={10}
                boxShadow="2xl"
              >
                {isVideoPlaying && (
                  <>
                    <IconButton
                      aria-label="Close video"
                      icon={<FiX />}
                      position="absolute"
                      top={4}
                      right={4}
                      zIndex={11}
                      onClick={toggleVideo}
                      borderRadius="full"
                      bg="whiteAlpha.300"
                      color="white"
                      _hover={{ bg: "whiteAlpha.500" }}
                    />
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                      title="Product Video"
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    ></iframe>
                  </>
                )}
              </Box>
            </Flex>
          </GridItem>
        </Grid>

        {/* --- DYNAMIC DOTS --- */}
        <HStack
          position="absolute"
          bottom={10}
          left={{ base: "50%", md: "16" }}
          transform={{ base: "translateX(-50%)", md: "none" }}
          spacing={3}
        >
          {slides.map((_, index) => (
            <Box
              key={index}
              cursor="pointer"
              onClick={() => setActiveIndex(index)}
              w={activeIndex === index ? "40px" : "12px"}
              h="6px"
              bg={activeIndex === index ? "gray.800" : "blackAlpha.200"}
              borderRadius="full"
              transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            />
          ))}
        </HStack>
      </Container>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8) rotate(-5deg); }
          to { opacity: 1; transform: scale(1) rotate(0deg); }
        }
      `}</style>
    </Box>
  );
};

export default HeroSection;