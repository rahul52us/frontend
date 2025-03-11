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

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);

  return (
    <Flex
      direction={{ base: 'column', md: 'row' }} // Column on mobile, row on tablet/desktop
      position="relative"
      minH={{ base: 'auto', md: '450px', lg: '500px' }}
      borderRadius={{ base: 'xl', md: '2xl', lg: '3xl' }}
      overflow="hidden"
      boxShadow={{ base: 'md', md: 'lg', lg: 'dark-lg' }}
      bgGradient="linear(to-r, #1e3a8a, #9333ea)"
      _hover={{ transform: { md: 'scale(1.005)' } }} // Hover effect only on larger screens
      transition="all 0.4s ease"
      p={{ base: 4, md: 6, lg: 8 }} // Responsive padding
      align="center"
      justify="space-between"
      w="100%"
      // maxW="1200px" // Max width for desktop
      mx="auto" // Center on page
    >
      {/* Left Side - Product Info */}
      <Stack
        flex={{ base: '1', md: '1' }}
        spacing={{ base: 4, md: 6 }}
        color="white"
        maxW={{ base: '100%', md: '450px', lg: '500px' }}
        zIndex={2}
        align={{ base: 'center', md: 'flex-start' }}
        textAlign={{ base: 'center', md: 'left' }}
      >
        <Box
          bg="whiteAlpha.300"
          px={{ base: 3, md: 4 }}
          py={2}
          borderRadius="full"
          w="fit-content"
          backdropFilter="blur(10px)"
        >
          <Text fontSize={{ base: 'xs', md: 'sm', lg: 'lg' }} fontWeight="bold">🔥 Limited Time Offer</Text>
        </Box>

        <Heading
          fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }}
          fontWeight="extrabold"
          lineHeight="1.1"
        >
          Quantum X3 Pro{' '}
          <Text as="span" bgGradient="linear(to-r, yellow.400, orange.400)" bgClip="text">
            Wireless
          </Text>
        </Heading>

        <Text
          fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
          color="gray.200"
          noOfLines={{ base: 3, md: 4 }} // Limit text overflow
        >
          Experience unparalleled sound with AI-enhanced noise cancellation and ultra-fast charging.
        </Text>

        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          gap={{ base: 2, md: 4 }}
        >
          <Text fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }} fontWeight="bold">
            $199
            <Text as="span" fontSize={{ base: 'md', md: 'xl' }} color="gray.300">
              .99
            </Text>
          </Text>
          <Text
            textDecoration="line-through"
            fontSize={{ base: 'md', md: 'xl' }}
            color="gray.400"
          >
            $399.99
          </Text>
        </Flex>

        <Button
          size={{ base: 'md', md: 'lg' }}
          px={{ base: 6, md: 8 }}
          py={{ base: 4, md: 6 }}
          borderRadius="xl"
          w={'100%'}
          bgGradient="linear(to-r, yellow.400, orange.400)"
          color="black"
          fontSize={{ base: 'md', md: 'xl' }}
          fontWeight="bold"
          boxShadow={{ base: 'md', md: 'lg' }}
          _hover={{
            transform: { md: 'scale(1.08)' },
            bgGradient: 'linear(to-r, yellow.300, orange.300)'
          }}
          transition="all 0.3s ease"
          rightIcon={<FiShoppingBag />}
        >
          Add to Cart
        </Button>
      </Stack>

      {/* Right Side - Product Image Carousel */}
      <Box
        flex={{ base: '1', md: '0.8', lg: '0.4' }}
        position="relative"
        // maxW={{ base: '100%', md: '400px', lg: '450px' }}
        mt={{ base: 6, md: 0 }}
      >
        <Image
          src={productImages[currentImageIndex]}
          alt="Quantum X3 Pro"
          w="100%"
          h={{ base: '300px', md: '350px', lg: '400px' }}
          objectFit="cover"
          borderRadius={{ base: 'lg', md: 'xl' }}
          boxShadow={{ base: 'lg', md: '2xl' }}
          transition="opacity 0.5s ease-in-out"
        />

        {/* Carousel Controls - Hidden on mobile if space is tight */}
        <IconButton
          aria-label="Previous Image"
          icon={<FiChevronLeft />}
          position="absolute"
          left={{ base: 2, md: -6 }}
          top="50%"
          transform="translateY(-50%)"
          bg="whiteAlpha.300"
          color="white"
          size={{ base: 'sm', md: 'md' }}
          _hover={{ bg: 'whiteAlpha.500' }}
          onClick={prevImage}
          display={{ base: productImages.length > 1 ? 'flex' : 'none', md: 'flex' }}
        />
        <IconButton
          aria-label="Next Image"
          icon={<FiChevronRight />}
          position="absolute"
          right={{ base: 2, md: -6 }}
          top="50%"
          transform="translateY(-50%)"
          bg="whiteAlpha.300"
          color="white"
          size={{ base: 'sm', md: 'md' }}
          _hover={{ bg: 'whiteAlpha.500' }}
          onClick={nextImage}
          display={{ base: productImages.length > 1 ? 'flex' : 'none', md: 'flex' }}
        />
      </Box>
    </Flex>
  );
};

export default ProductBanner;