'use client'
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Image,
  Stack,
  Text,
  Badge,
  HStack,
  VStack,
  chakra,
  shouldForwardProp,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiShoppingBag } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Properly filter props and handle the transition type conflict
const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) => shouldForwardProp(prop) || prop === 'transition',
});

const ProductBanner = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const productImages = [
    'https://images.unsplash.com/photo-1619113026857-7aa017691b1f?w=800&q=80',
    'https://images.unsplash.com/photo-1615281612781-4b972bd4e3fe?w=800&q=80',
    'https://images.unsplash.com/photo-1715548199124-3e49b59feb5c?w=800&q=80',
  ];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrent((prev) => (prev + newDirection + productImages.length) % productImages.length);
  };

  return (
    <Box position="relative" w="100%" overflow="hidden" py={10} px={4}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        position="relative"
        minH={{ base: '600px', md: '500px' }}
        borderRadius="3xl"
        overflow="hidden"
        bg="gray.900"
        p={{ base: 6, md: 12 }}
        align="center"
        justify="space-between"
      >
        {/* Background Decorations */}
        <Box
          position="absolute"
          top="-20%"
          right="-10%"
          w="500px"
          h="500px"
          bgGradient="radial(circle, purple.600 0%, transparent 70%)"
          opacity="0.4"
          filter="blur(80px)"
          zIndex={0}
        />

        {/* Left Content */}
        <Stack
          flex="1"
          spacing={8}
          color="white"
          zIndex={2}
          align={{ base: 'center', md: 'flex-start' }}
          textAlign={{ base: 'center', md: 'left' }}
        >
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 } as any}
          >
            <Badge
              px={4}
              py={1}
              borderRadius="full"
              bg="whiteAlpha.200"
              color="orange.300"
              border="1px solid"
              borderColor="whiteAlpha.300"
              backdropFilter="blur(10px)"
              textTransform="none"
              fontSize="sm"
            >
              ✨ New Arrival: Edition 2024
            </Badge>
          </MotionBox>

          <VStack align={{ base: 'center', md: 'flex-start' }} spacing={3}>
            <Heading fontSize={{ base: '4xl', md: '6xl' }} fontWeight="900" lineHeight="1">
              Quantum <br />
              <chakra.span color="blue.400">X3 Pro</chakra.span>
            </Heading>
            <Text fontSize="lg" color="gray.400" maxW="400px">
              Precision engineered for those who demand absolute sonic purity.
            </Text>
          </VStack>

          <HStack spacing={4}>
            <Text fontSize="4xl" fontWeight="800">$199</Text>
            <Text textDecoration="line-through" color="gray.500" fontSize="xl">$349</Text>
          </HStack>

          <Button
            as={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            size="lg"
            h="70px"
            px={10}
            bg="white"
            color="black"
            fontSize="xl"
            borderRadius="2xl"
            rightIcon={<FiShoppingBag />}
            _hover={{ bg: 'blue.400', color: 'white' }}
          >
            Pre-order Now
          </Button>
        </Stack>

        {/* Right Carousel */}
        <Box
          flex="1"
          position="relative"
          w="100%"
          h={{ base: '300px', md: '450px' }}
          mt={{ base: 12, md: 0 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <AnimatePresence initial={false} custom={direction}>
            <MotionBox
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              } as any}
              position="absolute"
              w="100%"
              h="100%"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Image
                src={productImages[current]}
                alt="Product"
                objectFit="contain"
                maxH="100%"
                filter="drop-shadow(0 20px 50px rgba(0,0,0,0.5))"
              />
            </MotionBox>
          </AnimatePresence>

          {/* Indicators & Controls */}
          <HStack position="absolute" bottom="-10" spacing={4} zIndex={10}>
            <IconButton
              aria-label="prev"
              icon={<FiChevronLeft />}
              onClick={() => paginate(-1)}
              rounded="full"
              variant="outline"
              color="white"
            />
            {productImages.map((_, i) => (
              <Box
                key={i}
                w={current === i ? '30px' : '8px'}
                h="8px"
                bg={current === i ? 'blue.400' : 'gray.600'}
                borderRadius="full"
                transition="0.3s ease"
              />
            ))}
            <IconButton
              aria-label="next"
              icon={<FiChevronRight />}
              onClick={() => paginate(1)}
              rounded="full"
              variant="outline"
              color="white"
            />
          </HStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default ProductBanner;