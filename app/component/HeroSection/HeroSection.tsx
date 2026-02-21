import { Badge, Box, Button, Container, Flex, Grid, GridItem, Heading, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiPlayCircle, FiArrowRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { slides } from './constant';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      position="relative"
      height={{ base: "500px", md: "600px" }}
      mb={10}
      mt={0}
      mx={{ base: 0, md: 4 }}
      rounded={{ base: '0', md: '3xl' }}
      overflow="hidden"
      bg="gray.50"
    >
      {/* Background Slideshow */}
      <AnimatePresence mode="wait">
        <MotionBox
          key={activeIndex}
          position="absolute"
          inset={0}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          bgGradient={slides[activeIndex].bgGradient}
          zIndex={0}
        >
          {/* Decorative Elements */}
          <Box
            position="absolute"
            top="-10%"
            right="-5%"
            w="400px"
            h="400px"
            bg="whiteAlpha.300"
            borderRadius="full"
            filter="blur(80px)"
          />
          <Box
            position="absolute"
            bottom="-10%"
            left="-5%"
            w="300px"
            h="300px"
            bg="whiteAlpha.200"
            borderRadius="full"
            filter="blur(60px)"
          />

          {/* Subtle overlay for better text readability */}
          <Box
            position="absolute"
            inset={0}
            bgGradient="linear(to-r, blackAlpha.400, transparent)"
          />
        </MotionBox>
      </AnimatePresence>

      <Container
        maxW="7xl"
        height="100%"
        position="relative"
        zIndex={1}
        display="flex"
        alignItems="center"
      >
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          gap={10}
          height="100%"
          alignItems="center"
          w="full"
        >
          <GridItem pl={{ base: 4, md: 4 }}>
            <AnimatePresence mode="wait">
              <MotionVStack
                key={activeIndex}
                spacing={8}
                align="flex-start"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Badge
                  colorScheme="whiteAlpha"
                  variant="solid"
                  fontSize="sm"
                  px={5}
                  py={2}
                  borderRadius="full"
                  backdropFilter="blur(10px)"
                  bg="whiteAlpha.300"
                  color="white"
                  border="1px solid"
                  borderColor="whiteAlpha.400"
                  letterSpacing="widest"
                  fontWeight="bold"
                >
                  {slides[activeIndex].badge}
                </Badge>

                <MotionHeading
                  size="3xl"
                  lineHeight="tight"
                  fontWeight="900"
                  fontSize={{ base: "5xl", md: "7xl" }}
                  color="white"
                  letterSpacing="tight"
                  textShadow="0 4px 12px rgba(0,0,0,0.2)"
                >
                  {slides[activeIndex].title.split(' ').map((word, i) => (
                    <Box as="span" key={i} display="inline-block" mr={4}>
                      {word}
                    </Box>
                  ))}
                </MotionHeading>

                <MotionText
                  fontSize={{ base: "lg", md: "2xl" }}
                  maxW="lg"
                  color="whiteAlpha.900"
                  fontWeight="medium"
                  lineHeight="relaxed"
                >
                  {slides[activeIndex].text}
                </MotionText>

                <HStack
                  spacing={5}
                  pt={4}
                  w="full"
                >
                  <Button
                    size="lg"
                    bg="white"
                    color="gray.900"
                    _hover={{
                      transform: 'translateY(-4px)',
                      boxShadow: '0 20px 40px -10px rgba(255,255,255,0.4)',
                      bg: 'gray.50'
                    }}
                    borderRadius="full"
                    px={10}
                    h="64px"
                    fontSize="lg"
                    fontWeight="bold"
                    transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                    rightIcon={<FiArrowRight />}
                  >
                    Start Shopping
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    color="white"
                    borderColor="whiteAlpha.500"
                    _hover={{ bg: 'whiteAlpha.200', borderColor: 'white' }}
                    borderRadius="full"
                    px={8}
                    h="64px"
                    backdropFilter="blur(10px)"
                    leftIcon={<FiPlayCircle fontSize="24px" />}
                    display={{ base: 'none', md: 'flex' }}
                  >
                    Watch Story
                  </Button>
                </HStack>
              </MotionVStack>
            </AnimatePresence>
          </GridItem>

          <GridItem
            display={{ base: 'none', md: 'block' }}
            height="100%"
            position="relative"
          >
            <AnimatePresence mode="wait">
              <MotionBox
                key={activeIndex}
                height="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.1, rotate: 5 }}
                transition={{ duration: 1, ease: "circOut" }}
              >
                <Box
                  position="relative"
                  p={8}
                  filter="drop-shadow(0 30px 60px rgba(0,0,0,0.3))"
                >
                  <Image
                    src={slides[activeIndex].image}
                    alt="Featured product"
                    objectFit="contain"
                    maxH="500px"
                    transition="transform 0.6s ease-in-out"
                    _hover={{ transform: 'scale(1.05) rotate(2deg)' }}
                  />
                  {/* Floating badge for image */}
                  <MotionBox
                    position="absolute"
                    top="20%"
                    right="0"
                    bg="white"
                    p={4}
                    borderRadius="2xl"
                    boxShadow="2xl"
                    initial={{ y: 20 }}
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Text fontWeight="bold" fontSize="xs" color="gray.500">LIMITED EDITION</Text>
                  </MotionBox>
                </Box>
              </MotionBox>
            </AnimatePresence>
          </GridItem>
        </Grid>

        {/* Improved Progress Indicator */}
        <Flex position="absolute" bottom={10} left={{ base: "50%", md: "4" }} transform={{ base: "translateX(-50%)", md: "none" }} gap={3}>
          {slides.map((_, index) => (
            <Box
              key={index}
              cursor="pointer"
              onClick={() => setActiveIndex(index)}
              w={activeIndex === index ? '48px' : '12px'}
              h="6px"
              bg={activeIndex === index ? 'white' : 'whiteAlpha.400'}
              borderRadius="full"
              transition="all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              _hover={{ bg: 'whiteAlpha.600' }}
            />
          ))}
        </Flex>
      </Container>
    </Box>
  );
};

export default HeroSection;
