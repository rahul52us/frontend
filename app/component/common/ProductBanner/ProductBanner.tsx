import { Box, Button, Flex, Heading, IconButton, Image, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiShoppingBag } from 'react-icons/fi';

const ProductBanner = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const productImages = [
    'https://images.unsplash.com/photo-1619113026857-7aa017691b1f?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1615281612781-4b972bd4e3fe?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1715548199124-3e49b59feb5c?w=600&auto=format&fit=crop&q=60',
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  return (
    <Flex
      position="relative"
      minH={{ base: '450px', lg: '500px' }}
      borderRadius="3xl"
      overflow="hidden"
      boxShadow="dark-lg"
      bgGradient="linear(to-r, #1e3a8a, #9333ea)"
      _hover={{ transform: 'scale(1.005)' }}
      transition="all 0.4s ease"
      p={10}
      align="center"
      justify="space-between"
    >
      {/* Left Side - Product Info */}
      <Stack flex={1} spacing={6} color="white" maxW="500px" zIndex={2}>
        <Box bg="whiteAlpha.300" px={4} py={2} borderRadius="full" w="fit-content" backdropFilter="blur(10px)">
          <Text fontSize="lg" fontWeight="bold">🔥 Limited Time Offer</Text>
        </Box>
        <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }} fontWeight="extrabold" lineHeight="1.2">
          Quantum X3 Pro <Text as="span" bgGradient="linear(to-r, yellow.400, orange.400)" bgClip="text">Wireless</Text>
        </Heading>
        <Text fontSize="lg" color="gray.200">
          Experience unparalleled sound with AI-enhanced noise cancellation and ultra-fast charging.
        </Text>
        <Flex align="center" gap={4}>
          <Text fontSize="3xl" fontWeight="bold">$199<span style={{ fontSize: 'xl', color: 'gray.300' }}>.99</span></Text>
          <Text textDecoration="line-through" fontSize="xl" color="gray.400">$399.99</Text>
        </Flex>
        <Button
          size="lg"
          px={8}
          py={6}
          borderRadius="xl"
          bgGradient="linear(to-r, yellow.400, orange.400)"
          color="black"
          fontSize="xl"
          fontWeight="bold"
          boxShadow="lg"
          _hover={{ transform: 'scale(1.08)' }}
          transition="all 0.3s ease"
          rightIcon={<FiShoppingBag />}
        >
          Add to Cart
        </Button>
      </Stack>

      {/* Right Side - Product Image Carousel */}
      <Box flex={1} position="relative" maxW={{ base: '300px', lg: '450px' }}>
        <Image
          src={productImages[currentImageIndex]}
          alt="Quantum X3 Pro"
          w="full"
          h={{ base: '350px', lg: '400px' }}
          objectFit="cover"
          borderRadius="xl"
          boxShadow="2xl"
          transition="opacity 0.5s ease-in-out"
        />
        {/* Carousel Controls */}
        <IconButton
          aria-label="Previous Image"
          icon={<FiChevronLeft />}
          position="absolute"
          left={-6}
          top="50%"
          transform="translateY(-50%)"
          bg="whiteAlpha.300"
          color="white"
          _hover={{ bg: 'whiteAlpha.500' }}
          onClick={prevImage}
        />
        <IconButton
          aria-label="Next Image"
          icon={<FiChevronRight />}
          position="absolute"
          right={-6}
          top="50%"
          transform="translateY(-50%)"
          bg="whiteAlpha.300"
          color="white"
          _hover={{ bg: 'whiteAlpha.500' }}
          onClick={nextImage}
        />
      </Box>
    </Flex>
  );
};

export default ProductBanner;