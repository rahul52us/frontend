import { Badge, Box, Button, Container, Flex, Grid, GridItem, Heading, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiPlayCircle } from 'react-icons/fi';
import { slides } from './constant';

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      position="relative"
      height={{ base: "500px", md: "480px" }}
      mb={2}
      mt={4}
      borderWidth={2}
      overflow="hidden"
      borderColor={'gray.200'}
      rounded={'2xl'}
      >
      {/* Background Slideshow */}
      {slides.map((slide, index) => (
          <Box
          key={index}
          position="absolute"
          top={0}
          left={0}
          shadow={'base'}
          right={0}
          bottom={0}
          opacity={activeIndex === index ? 1 : 0}
          bgGradient={slide.bgGradient}
          transition="opacity 1s ease-in-out"
          zIndex={0}
        >
          {/* <Image
            src={slide.image}
            alt="Background"
            width="100%"
            height="100%"
            objectFit="cover"
            filter="auto"
            brightness={'0.3'}
            blur={'2px'}
          /> */}
        </Box>
      ))}

      <Container
        maxW="100%"
        w={'100%'}
        height="100%"
        position="relative"
        zIndex={1}
        display="flex"
        alignItems="center"
      >
        <Grid
          templateColumns="repeat(2, 1fr)"
          gap={6}
          height="100%"
          alignItems="center"
        >
          <GridItem  pl={8}>
            <VStack
              spacing={6}
              align="flex-start"
              color="gray.700"
              position="relative"
              key={activeIndex}
              animation="fadeIn 1s ease-in-out"
            >
              <Badge
                colorScheme="blackAlpha"
                fontSize="md"
                px={4}
                py={1.5}
                borderRadius="full"
                backdropFilter="blur(4px)"
              >
                {slides[activeIndex].badge}
              </Badge>

              <Heading
                size="2xl"
                lineHeight="1.2"
                // textShadow="0 2px 4px rgba(0,0,0,0.3)"
                maxW={{ base: "100%", md: "80%" }}
              >
                {slides[activeIndex].title}
              </Heading>

              <Text
                fontSize="lg"
                maxW={{ base: "100%", md: "80%" }}
                // textShadow="0 1px 2px rgba(0,0,0,0.3)"
                color="blackAlpha.900"
              >
                {slides[activeIndex].text}
              </Text>

              <HStack spacing={4} pt={4}>
                <Button
                  size="lg"
                  bg="white"
                  color={`${slides[activeIndex].buttonColor}.600`}
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  borderRadius="full"
                  px={8}
                  transition="all 0.2s"
                >
                  Shop Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  color="black"
                  borderColor="blackAlpha.400"
                  _hover={{ bg: 'whiteAlpha.100' }}
                  borderRadius="full"
                  px={8}
                  rightIcon={<FiPlayCircle />}
                >
                  Watch Video
                </Button>
              </HStack>
            </VStack>
          </GridItem>

          <GridItem
            // colSpan={{ base: 12, md: 5 }}
            display={{ base: 'none', md: 'block' }}
            height="100%"
            position="relative"
          >
            <Box
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="relative"
              overflow="hidden"
            >
              <Box
                borderRadius="xl"
                overflow="hidden"
                // boxShadow="2xl"
                width={{ base: "100%", md: "100%" }}
                height={{ base: "300px", md: "460px" }}
                h={'100%'}
                position="relative"
                key={activeIndex}
                animation="scaleIn 1s ease-in-out"
              >
                <Image
                  src={slides[activeIndex].image}
                // src='/images/heroImage.png'
                  alt="Featured product"
                  objectFit="contain"
                  width="100%"
                  height="100%"
                  transition="transform 0.5s ease-in-out"
                  _hover={{ transform: 'scale(1.05)' }}
                />
              </Box>
            </Box>
          </GridItem>
        </Grid>

        {/* Progress Indicator */}
        <Flex position="absolute" bottom={8} left="50%" transform="translateX(-50%)" gap={2}>
          {slides.map((_, index) => (
            <Box
              key={index}
              w={activeIndex === index ? '32px' : '16px'}
              h="4px"
              bg={activeIndex === index ? 'white' : 'whiteAlpha.500'}
              borderRadius="full"
              transition="all 0.3s ease"
            />
          ))}
        </Flex>
      </Container>

      {/* Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </Box>
  );
};
export default HeroSection;