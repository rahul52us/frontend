"use client";

import { 
  Box, 
  Button, 
  Flex, 
  Grid, 
  Image, 
  Text, 
  VStack, 
  Icon, 
  Badge, 
  Heading 
} from "@chakra-ui/react";
import { data } from "./utils/constant";
import { keyframes } from "@emotion/react";
import { FiArrowRight, FiChevronRight } from "react-icons/fi";

// --- PROFESSIONAL ANIMATIONS ---
const slideUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const softFloat = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const HeroSectionProfessional = () => {
  return (
    <Box
      maxW="1440px"
      my={{ base: 16, md: 28 }}
      mx="auto"
      position="relative"
      px={{ base: 6, md: 10 }}
      animation={`${slideUp} 1s ease-out`}
    >
      {/* BACKGROUND ELEGANCE */}
      <Box
        position="absolute"
        top="-15%"
        left="5%"
        w="500px"
        h="500px"
        bgGradient="radial(purple.400, transparent, transparent)"
        filter="blur(140px)"
        opacity={0.12}
        zIndex={0}
      />

      <Box
        position="relative"
        zIndex={1}
        bg="#0B0E14" // Solid deep charcoal for professional contrast
        p={{ base: 8, md: 20 }}
        rounded={{ base: "40px", md: "70px" }}
        boxShadow="0 60px 100px -30px rgba(0,0,0,0.7)"
        border="1px solid"
        borderColor="whiteAlpha.100"
        overflow="hidden"
      >
        {/* Subtle Grid for Texture */}
        <Box
          position="absolute"
          inset={0}
          opacity={0.15}
          bgImage="url('https://www.transparenttextures.com/patterns/carbon-fibre.png')"
          pointerEvents="none"
        />

        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={{ base: 16, lg: 24 }}
          align="center"
        >
          {/* --- CONTENT BLOCK --- */}
          <VStack 
            align={{ base: "center", lg: "start" }} 
            spacing={8} 
            flex="1"
            textAlign={{ base: "center", lg: "left" }}
          >
            <Badge
              colorScheme="purple"
              variant="outline"
              px={4}
              py={1.5}
              rounded="full"
              fontSize="xs"
              fontWeight="extrabold"
              letterSpacing="widest"
              borderColor="purple.500"
              color="purple.300"
              bg="purple.900"
            >
              PREMIUM EXPERIENCE
            </Badge>

            <Box>
              <Heading
                as="h2"
                fontSize={{ base: "4xl", md: "7xl" }}
                fontWeight="900"
                lineHeight="0.95"
                color="white"
                letterSpacing="-4px"
              >
                Refine Your{" "}
                <Text
                  as="span"
                  bgGradient="linear(to-tr, #8B5CF6, #EC4899)"
                  bgClip="text"
                >
                  Daily
                </Text>{" "}
                Life.
              </Heading>
              <Text
                mt={6}
                fontSize={{ base: "md", md: "lg" }}
                color="whiteAlpha.600"
                maxW="500px"
                lineHeight="tall"
              >
                Experience a hand-picked collection of technology and fashion designed for the modern connoisseur. Quality meets aesthetic.
              </Text>
            </Box>

            <Flex gap={4} direction={{ base: "column", sm: "row" }}>
              <Button
                size="lg"
                height="65px"
                px={10}
                bg="white"
                color="black"
                rounded="full"
                fontWeight="bold"
                rightIcon={<FiArrowRight />}
                _hover={{ bg: "purple.100", transform: "translateY(-4px)" }}
                transition="all 0.3s ease"
              >
                Shop Collection
              </Button>
              <Button
                size="lg"
                height="65px"
                px={10}
                variant="outline"
                color="white"
                rounded="full"
                borderColor="whiteAlpha.300"
                _hover={{ bg: "whiteAlpha.100" }}
              >
                View Catalog
              </Button>
            </Flex>
          </VStack>

          {/* --- CATEGORY GRID --- */}
          <Box flex="1.2" w="full">
            <Grid
              templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
              gap={6}
            >
              {data.slice(0, 6).map((item, idx) => (
                <Box
                  key={item.id}
                  role="group"
                  cursor="pointer"
                  animation={`${softFloat} ${4 + idx}s infinite ease-in-out`}
                >
                  <VStack
                    p={8}
                    bg="whiteAlpha.50"
                    rounded="3xl"
                    border="1px solid"
                    borderColor="whiteAlpha.100"
                    transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                    _hover={{
                      bg: "whiteAlpha.200",
                      borderColor: "purple.500",
                      transform: "scale(1.05)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
                    }}
                    textAlign="center"
                  >
                    <Box 
                      p={4} 
                      bg="whiteAlpha.100" 
                      rounded="2xl" 
                      mb={2}
                      transition="0.4s"
                      _groupHover={{ bg: "white", transform: "rotate(-5deg)" }}
                    >
                      <Image
                        src={item.img}
                        alt={item.title}
                        boxSize="70px"
                        objectFit="contain"
                        filter="grayscale(100%)"
                        transition="0.4s"
                        _groupHover={{ filter: "grayscale(0%)", transform: "scale(1.1)" }}
                      />
                    </Box>

                    <Text
                      fontWeight="bold"
                      color="white"
                      fontSize="sm"
                      letterSpacing="wide"
                    >
                      {item.title}
                    </Text>
                    
                    <Icon 
                      as={FiChevronRight} 
                      color="purple.400" 
                      opacity={0} 
                      transform="translateX(-10px)"
                      transition="0.3s"
                      _groupHover={{ opacity: 1, transform: "translateX(0)" }}
                    />
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