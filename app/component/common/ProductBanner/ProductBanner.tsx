import { Box, Button, Flex, Heading, IconButton, Image, Stack, Text, useColorModeValue, Container } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiShoppingBag, FiZap } from 'react-icons/fi';

const MotionBox = motion(Box);
const MotionStack = motion(Stack);
const MotionHeading = motion(Heading);
const MotionImage = motion(Image);

const ProductBanner = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const productImages = [
    'https://images.unsplash.com/photo-1619113026857-7aa017691b1f?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1615281612781-4b972bd4e3fe?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1715548199124-3e49b59feb5c?w=600&auto=format&fit=crop&q=60',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);

  return (
    <Container maxW="7xl" py={12}>
      <MotionBox
        position="relative"
        minH={{ base: 'auto', md: '500px' }}
        borderRadius="3xl"
        overflow="hidden"
        bgGradient="linear(to-br, #0f172a, #334155, #1e293b)"
        p={{ base: 8, md: 12, lg: 16 }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        {/* Background Decorative Circles */}
        <Box
          position="absolute"
          top="-20%"
          right="-10%"
          w="500px"
          h="500px"
          bg="blue.500"
          borderRadius="full"
          filter="blur(120px)"
          opacity={0.3}
        />
        <Box
          position="absolute"
          bottom="-20%"
          left="-10%"
          w="400px"
          h="400px"
          bg="purple.500"
          borderRadius="full"
          filter="blur(100px)"
          opacity={0.2}
        />

        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="space-between"
          gap={12}
          position="relative"
          zIndex={1}
        >
          {/* Info Section */}
          <MotionStack
            flex={1}
            spacing={8}
            align={{ base: 'center', md: 'flex-start' }}
            textAlign={{ base: 'center', md: 'left' }}
          >
            <Flex
              bg="whiteAlpha.200"
              backdropFilter="blur(12px)"
              px={5}
              py={2.5}
              borderRadius="full"
              border="1px solid"
              borderColor="whiteAlpha.300"
              align="center"
              gap={2}
            >
              <FiZap color="#fbbf24" />
              <Text fontSize="sm" fontWeight="black" color="white" letterSpacing="widest" textTransform="uppercase">
                Flash Deal - 50% OFF
              </Text>
            </Flex>

            <MotionHeading
              fontSize={{ base: '4xl', md: '5xl', lg: '7xl' }}
              fontWeight="900"
              lineHeight="1"
              color="white"
              letterSpacing="tight"
            >
              Quantum X3{' '}
              <Text as="span" bgGradient="linear(to-r, blue.400, cyan.400)" bgClip="text">
                Pro Max
              </Text>
            </MotionHeading>

            <Text
              fontSize={{ base: 'md', md: 'xl' }}
              color="whiteAlpha.700"
              maxW="450px"
              lineHeight="tall"
            >
              The future of audio is here. Immersive soundscapes, active AI noise cancellation, and a battery life that keeps up with your rhythm.
            </Text>

            <Flex align="center" gap={6}>
              <Box>
                <Text color="whiteAlpha.600" fontSize="xs" fontWeight="bold">PRICE</Text>
                <Text fontSize="4xl" fontWeight="black" color="white">$299.99</Text>
              </Box>
              <Box h="40px" w="1px" bg="whiteAlpha.300" />
              <Box>
                <Text color="whiteAlpha.600" fontSize="xs" fontWeight="bold">OFFER</Text>
                <Text fontSize="2xl" fontWeight="black" color="green.400">SAVE $200</Text>
              </Box>
            </Flex>

            <Button
              size="lg"
              h="70px"
              px={12}
              borderRadius="2xl"
              bg="white"
              color="slate.900"
              fontSize="xl"
              fontWeight="black"
              leftIcon={<FiShoppingBag />}
              _hover={{
                transform: 'translateY(-5px)',
                boxShadow: '0 20px 40px -10px rgba(255,255,255,0.3)',
                bg: 'blue.50'
              }}
              transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            >
              Grab It Now
            </Button>
          </MotionStack>

          {/* Image Section */}
          <Box flex={1} position="relative">
            <AnimatePresence mode="wait">
              <MotionBox
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 1.1, rotateY: -20 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Image
                  src={productImages[currentImageIndex]}
                  alt="Product Image"
                  w="full"
                  maxH="500px"
                  objectFit="contain"
                  filter="drop-shadow(0 40px 80px rgba(0,0,0,0.5))"
                />
              </MotionBox>
            </AnimatePresence>

            {/* Controls */}
            <IconButton
              aria-label="Previous"
              icon={<FiChevronLeft />}
              position="absolute"
              left="-10"
              top="50%"
              transform="translateY(-50%)"
              variant="whiteAlpha"
              colorScheme="whiteAlpha"
              borderRadius="full"
              onClick={prevImage}
              display={{ base: 'none', lg: 'flex' }}
            />
            <IconButton
              aria-label="Next"
              icon={<FiChevronRight />}
              position="absolute"
              right="-10"
              top="50%"
              transform="translateY(-50%)"
              variant="whiteAlpha"
              colorScheme="whiteAlpha"
              borderRadius="full"
              onClick={nextImage}
              display={{ base: 'none', lg: 'flex' }}
            />
          </Box>
        </Flex>
      </MotionBox>
    </Container>
  );
};

export default ProductBanner;