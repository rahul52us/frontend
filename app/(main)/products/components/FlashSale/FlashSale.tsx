'use client';

import {
  Box,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  Image,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { FiZap } from 'react-icons/fi';

interface FlashProduct {
  id: number;
  name: string;
  price: string;
  original: string;
  img: string;
  discount: string;
  category?: string;
  soldCount?: number;
  progressPercent?: number;
}

const DEFAULT_FLASH_PRODUCTS: FlashProduct[] = [
  {
    id: 1,
    name: 'AirPods Max',
    price: '449',
    original: '549',
    img: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=400&q=80',
    discount: '15%',
    category: 'Tech Gear',
    soldCount: 85,
    progressPercent: 85,
  },
  {
    id: 2,
    name: 'Apple Watch Ultra',
    price: '699',
    original: '799',
    img: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&q=80',
    discount: '12%',
    category: 'Premium',
    soldCount: 62,
    progressPercent: 60,
  },
  {
    id: 3,
    name: 'Premium Leather Boots',
    price: '129',
    original: '199',
    img: 'https://images.unsplash.com/photo-1520639889313-7272a74b1c73?w=400&q=80',
    discount: '35%',
    category: 'Premium',
    soldCount: 45,
    progressPercent: 70,
  },
  {
    id: 4,
    name: 'Designer Backpack',
    price: '89',
    original: '159',
    img: 'https://images.unsplash.com/photo-1546750547-73099bc39223?w=400&q=80',
    discount: '44%',
    category: 'Premium',
    soldCount: 94,
    progressPercent: 90,
  },
];

const formatTime = (time: number) => time.toString().padStart(2, '0');

/* -------------------------------------------------------------------------- */
/*  Subcomponent: FlashSaleTimer                                              */
/*  Updates every 1s internally without re-rendering the product grid cards   */
/* -------------------------------------------------------------------------- */

const FlashSaleTimer = memo(() => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(12 * 3600 + 45 * 60 + 30);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;

  return (
    <HStack
      spacing={4}
      bg="gray.900"
      p={3}
      px={5}
      borderRadius="2xl"
      boxShadow="dark-lg"
    >
      <Text
        fontSize="xs"
        fontWeight="black"
        color="gray.400"
        textTransform="uppercase"
        letterSpacing="widest"
      >
        Ends In
      </Text>
      <HStack spacing={3}>
        {[hours, minutes, seconds].map((t, i) => (
          <Flex key={i} align="center">
            <Box
              bgGradient="linear(to-b, #333, #000)"
              color="white"
              px={2}
              py={1.5}
              borderRadius="lg"
              fontWeight="black"
              fontSize="lg"
              minW="45px"
              textAlign="center"
              border="1px solid rgba(255,255,255,0.1)"
            >
              {formatTime(t)}
            </Box>
            {i < 2 && (
              <Text
                color="white"
                fontWeight="black"
                mx={1}
                sx={{
                  animation: 'blink 1s infinite',
                  '@keyframes blink': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.2 },
                  },
                }}
              >
                :
              </Text>
            )}
          </Flex>
        ))}
      </HStack>
    </HStack>
  );
});
FlashSaleTimer.displayName = 'FlashSaleTimer';

/* -------------------------------------------------------------------------- */
/*  Subcomponent: FlashProductCard                                            */
/* -------------------------------------------------------------------------- */

const FlashProductCard = memo(({ product }: { product: FlashProduct }) => {
  return (
    <Box
      position="relative"
      role="group"
      cursor="pointer"
      transition="0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
      _hover={{ transform: 'scale(1.05)' }}
    >
      <Box
        borderRadius="2xl"
        overflow="hidden"
        bg="white"
        mb={4}
        boxShadow="md"
        position="relative"
      >
        <Image
          src={product.img}
          alt={product.name}
          objectFit="cover"
          w="100%"
          h={{ base: '180px', md: '220px' }}
          transition="all 0.5s"
          _groupHover={{ transform: 'scale(1.1)' }}
          loading="lazy"
          decoding="async"
        />
        <Box
          position="absolute"
          top={3}
          left={3}
          bgGradient="linear(to-r, #FF0080, #7928CA)"
          color="white"
          px={3}
          py={1}
          borderRadius="full"
          fontSize="xs"
          fontWeight="black"
          boxShadow="lg"
        >
          {product.discount} OFF
        </Box>
      </Box>

      <Text
        fontSize="xs"
        fontWeight="black"
        color="gray.400"
        textTransform="uppercase"
        mb={1}
      >
        {product.category || (product.id === 1 ? 'Tech Gear' : 'Premium')}
      </Text>
      <Text
        fontSize="sm"
        fontWeight="bold"
        noOfLines={1}
        mb={2}
        color="gray.800"
      >
        {product.name}
      </Text>

      <HStack spacing={3} align="center">
        <Text fontSize="xl" fontWeight="black" color="#FF0080">
          ${product.price}
        </Text>
        <Text
          fontSize="xs"
          color="gray.400"
          textDecoration="line-through"
          fontWeight="bold"
        >
          ${product.original}
        </Text>
      </HStack>

      <Box
        w="full"
        h="8px"
        bg="gray.100"
        borderRadius="full"
        mt={4}
        overflow="hidden"
      >
        <Box
          w={`${product.progressPercent ?? 75}%`}
          h="full"
          bgGradient="linear(to-r, #FF0080, #7928CA)"
          borderRadius="full"
        />
      </Box>
      <HStack justify="space-between" mt={2}>
        <Text fontSize="10px" fontWeight="black" color="#FF0080">
          ALMOST GONE
        </Text>
        <Text fontSize="10px" color="gray.500" fontWeight="bold">
          {product.soldCount ? `${product.soldCount} sold` : '62 sold'}
        </Text>
      </HStack>
    </Box>
  );
});
FlashProductCard.displayName = 'FlashProductCard';

/* -------------------------------------------------------------------------- */
/*  Main Component: FlashSale                                                 */
/* -------------------------------------------------------------------------- */

interface FlashSaleProps {
  products?: FlashProduct[];
}

const FlashSale = ({ products = DEFAULT_FLASH_PRODUCTS }: FlashSaleProps) => {
  const cardBorderColor = useColorModeValue('red.100', 'whiteAlpha.200');
  const bgGradient = useColorModeValue('linear(to-br, white, #FFFAFF)', 'linear(to-br, gray.800, gray.900)');
  const headingColor = useColorModeValue('gray.800', 'white');

  const flashProducts = useMemo(() => products, [products]);

  return (
    <Box
      bgGradient={bgGradient}
      p={{ base: 4, md: 8 }}
      borderRadius="3xl"
      boxShadow="2xl"
      mb={10}
      border="1px solid"
      borderColor={cardBorderColor}
      position="relative"
      overflow="hidden"
    >
      {/* Background radial glow */}
      <Box
        position="absolute"
        top="-10%"
        right="-5%"
        w="30%"
        h="50%"
        bgGradient="radial(circle, rgba(255,0,128,0.05) 0%, transparent 70%)"
        pointerEvents="none"
      />

      {/* Header with Title and Isolated Timer */}
      <Flex justify="space-between" align="center" mb={10} flexWrap="wrap" gap={6}>
        <HStack spacing={4}>
          <Box
            bgGradient="linear(to-br, #FF0080, #7928CA)"
            p={3}
            borderRadius="2xl"
            boxShadow="0 4px 15px rgba(255, 0, 128, 0.4)"
          >
            <Icon as={FiZap} color="white" boxSize={6} />
          </Box>
          <Box>
            <Heading
              size="lg"
              color={headingColor}
              fontWeight="900"
              textTransform="uppercase"
              letterSpacing="tight"
            >
              Flash Sale
            </Heading>
            <HStack spacing={2}>
              <Box
                w="8px"
                h="8px"
                borderRadius="full"
                bg="red.500"
                sx={{
                  animation: 'pulse 1.5s infinite',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)', opacity: 1 },
                    '50%': { transform: 'scale(1.2)', opacity: 0.6 },
                    '100%': { transform: 'scale(1)', opacity: 1 },
                  },
                }}
              />
              <Text fontSize="sm" color="red.500" fontWeight="bold">
                LIVE NOW
              </Text>
            </HStack>
          </Box>
        </HStack>

        {/* Isolated Timer */}
        <FlashSaleTimer />
      </Flex>

      {/* Products Grid */}
      <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={6}>
        {flashProducts.map((product) => (
          <FlashProductCard key={product.id} product={product} />
        ))}
      </Grid>
    </Box>
  );
};

export default memo(FlashSale);
