import { Box, Button, Flex, Heading, Icon, IconButton, Image, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiShoppingBag } from 'react-icons/fi';

const ProductBanner = () => {
  // State for image carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const productImages = [
    'https://images.unsplash.com/photo-1619113026857-7aa017691b1f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aGVhZHBob25lJTIwcHVycGxlfGVufDB8fDB8fHwy',
    'https://images.unsplash.com/photo-1615281612781-4b972bd4e3fe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGhlYWRwaG9uZSUyMHB1cnBsZXxlbnwwfHwwfHx8Mg%3D%3D',
    'https://images.unsplash.com/photo-1715548199124-3e49b59feb5c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGhlYWRwaG9uZSUyMHB1cnBsZXxlbnwwfHwwfHx8Mg%3D%3D',
  ];

  // Carousel navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  return (
    <Flex
      position="relative"
      minH="400px"
      borderRadius="2xl"
      overflow="hidden"
      boxShadow="2xl"
      bgGradient="linear(45deg, #6366f1, #8b5cf6, #ec4899)"
      _hover={{ transform: 'scale(1.005)' }}
      transition="all 0.3s ease"
    >
      {/* Content Container */}
      <Flex
        position="relative"
        zIndex={1}
        direction={{ base: 'column', lg: 'row' }}
        align="center"
        justify="center"
        p={8}
        gap={8}
        w="full"
      >
        {/* Product Info */}
        <Stack flex={1} spacing={6} color="white" align={{ base: 'center', lg: 'start' }} textAlign={{ base: 'center', lg: 'left' }}>
          {/* Offer Badge */}
          <Box
            bg="whiteAlpha.200"
            backdropFilter="blur(10px)"
            px={4}
            py={2}
            borderRadius="full"
            w="fit-content"
            transform="rotate(-3deg)"
          >
            <Text fontSize="lg" fontWeight="bold">
              🚀 50% OFF
            </Text>
          </Box>

          {/* Product Title */}
          <Heading fontSize="4xl" fontWeight="black" lineHeight="1">
            Quantum X3 Pro
            <Text as="span" bgGradient="linear(45deg, #fef08a, #fde047)" bgClip="text">
              Wireless
            </Text>
          </Heading>

          {/* Features Grid */}
          <Flex gap={4} wrap="wrap" justify={{ base: 'center', lg: 'start' }}>
            {['100W Fast Charge', '4K HD Sound', 'AI Noise Cancel', '24mo Warranty'].map((feature) => (
              <Flex
                key={feature}
                align="center"
                bg="whiteAlpha.100"
                px={4}
                py={2}
                borderRadius="xl"
                _hover={{ bg: 'whiteAlpha.200' }}
                transition="all 0.2s"
              >
                <Icon as={FiShoppingBag} boxSize={5} mr={2} />
                <Text fontSize="md">{feature}</Text>
              </Flex>
            ))}
          </Flex>

          {/* Price Section */}
          <Flex align="center" gap={4}>
            <Text fontSize="2xl" fontWeight="bold">
              $199<Text as="span" fontSize="lg" color="whiteAlpha.700">.99</Text>
            </Text>
            <Text textDecoration="line-through" fontSize="lg" color="whiteAlpha.600">
              $399.99
            </Text>
          </Flex>

          {/* CTA Button */}
          <Button
            size="lg"
            w="fit-content"
            px={8}
            py={6}
            borderRadius="xl"
            colorScheme="yellow"
            rightIcon={<FiShoppingBag />}
            fontSize="xl"
            fontWeight="bold"
            _hover={{ transform: 'scale(1.05)' }}
            transition="all 0.3s ease"
          >
            Add to Cart
          </Button>
        </Stack>

        {/* Product Image Carousel */}
        <Box flex={1} position="relative" maxW="500px">
          <Image
            src={productImages[currentImageIndex]}
            alt="Quantum X3 Pro"
            w="full"
            h={'400px'}
            objectFit={'cover'}
            borderRadius="xl"
            boxShadow="2xl"
          />
          {/* Carousel Controls */}
          <IconButton
            aria-label="Previous Image"
            icon={<FiChevronLeft />}
            position="absolute"
            left={2}
            top="50%"
            transform="translateY(-50%)"
            bg="whiteAlpha.200"
            _hover={{ bg: 'whiteAlpha.300' }}
            onClick={prevImage}
          />
          <IconButton
            aria-label="Next Image"
            icon={<FiChevronRight />}
            position="absolute"
            right={2}
            top="50%"
            transform="translateY(-50%)"
            bg="whiteAlpha.200"
            _hover={{ bg: 'whiteAlpha.300' }}
            onClick={nextImage}
          />
        </Box>
      </Flex>
    </Flex>
  );
};

export default ProductBanner;