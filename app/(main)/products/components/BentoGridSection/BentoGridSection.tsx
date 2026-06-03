import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Icon,
  SimpleGrid,
  Badge,
  Flex,
  Circle,
  Button,
  useColorModeValue,
//   keyframes,
} from '@chakra-ui/react';
import {
  FaGift,
  FaHeart,
  FaStar,
  FaShoppingBag,
  FaClock,
  FaTshirt,
  FaMobileAlt,
  FaHome,
  FaRegHeart,
} from 'react-icons/fa';
import { FiTrendingUp, FiArrowRight, FiCompass, FiZap } from 'react-icons/fi';

// Floating animation for icons
// const float = keyframes`
//   0% { transform: translateY(0px); }
//   50% { transform: translateY(-8px); }
//   100% { transform: translateY(0px); }
// `;

// const pulse = keyframes`
//   0% { transform: scale(1); opacity: 0.8; }
//   50% { transform: scale(1.05); opacity: 1; }
//   100% { transform: scale(1); opacity: 0.8; }
// `;

interface BentoItem {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  size: 'large' | 'medium' | 'small';
  colorScheme: string;
  icon: any;
  badge?: string;
  cta?: string;
  discount?: string;
}

const bentoData: BentoItem[] = [
  {
    id: 1,
    title: 'New Arrivals',
    subtitle: 'Spring Collection 2025',
    image: 'https://picsum.photos/id/20/600/400',
    size: 'large',
    colorScheme: 'blue',
    icon: FaGift,
    badge: '✨ Just In',
    cta: 'Shop New',
    discount: '',
  },
  {
    id: 2,
    title: '50% OFF',
    subtitle: 'On All Footwear',
    image: 'https://picsum.photos/id/21/400/400',
    size: 'medium',
    colorScheme: 'orange',
    icon: FaShoppingBag,
    badge: '🔥 Mega Sale',
    cta: 'Grab Deal',
    discount: 'Limited Stock',
  },
  {
    id: 3,
    title: 'Best Sellers',
    subtitle: 'Most Loved Products',
    image: 'https://picsum.photos/id/22/400/300',
    size: 'small',
    colorScheme: 'purple',
    icon: FaStar,
    badge: '⭐ Trending',
    cta: 'Explore',
    discount: '',
  },
  {
    id: 4,
    title: 'Electronics',
    subtitle: 'Up to 40% off',
    image: 'https://picsum.photos/id/23/400/300',
    size: 'small',
    colorScheme: 'cyan',
    icon: FaMobileAlt,
    badge: '💻 Tech Deals',
    cta: 'Shop Now',
    discount: 'No Cost EMI',
  },
  {
    id: 5,
    title: 'Men’s Fashion',
    subtitle: 'Summer Essentials',
    image: 'https://picsum.photos/id/24/400/300',
    size: 'small',
    colorScheme: 'green',
    icon: FaTshirt,
    badge: '👕 For Him',
    cta: 'View',
    discount: 'Buy 2 Get 10%',
  },
  {
    id: 6,
    title: 'Home Decor',
    subtitle: 'Transform Your Space',
    image: 'https://picsum.photos/id/25/400/400',
    size: 'medium',
    colorScheme: 'pink',
    icon: FaHome,
    badge: '🏠 New Styles',
    cta: 'Discover',
    discount: 'Free Shipping',
  },
  {
    id: 7,
    title: 'Limited Time',
    subtitle: 'Flash Sale Ends Soon',
    image: 'https://picsum.photos/id/26/600/300',
    size: 'large',
    colorScheme: 'red',
    icon: FaClock,
    badge: '⏰ 24h Left',
    cta: 'Hurry Up',
    discount: 'Up to 60%',
  },
];

const BentoGridSection = () => {
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const gradientOverlay = useColorModeValue(
    'linear(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 100%)',
    'linear(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%)'
  );

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const getSizeStyles = (size: string) => {
    switch (size) {
      case 'large':
        return { 
          gridColumn: { base: 'span 1', md: 'span 2' }, 
          gridRow: { base: 'span 1', md: 'span 2' }, 
          height: { base: '320px', md: '380px' } 
        };
      case 'medium':
        return { 
          gridColumn: 'span 1', 
          gridRow: { base: 'span 1', md: 'span 2' }, 
          height: { base: '280px', md: '320px' } 
        };
      default:
        return { 
          gridColumn: 'span 1', 
          gridRow: 'span 1', 
          height: { base: '200px', md: '240px' } 
        };
    }
  };

  const getColorGradient = (color: string) => {
    const gradients: Record<string, string> = {
      blue: 'linear(135deg, #1e3a8a 0%, #3b82f6 100%)',
      orange: 'linear(135deg, #ea580c 0%, #f97316 100%)',
      purple: 'linear(135deg, #7c3aed 0%, #a78bfa 100%)',
      cyan: 'linear(135deg, #06b6d4 0%, #22d3ee 100%)',
      green: 'linear(135deg, #15803d 0%, #22c55e 100%)',
      pink: 'linear(135deg, #ec4899 0%, #f472b6 100%)',
      red: 'linear(135deg, #dc2626 0%, #ef4444 100%)',
    };
    return gradients[color] || gradients.blue;
  };

  return (
    <Box py={{ base: 10, md: 16 }} bg={bgColor} position="relative" overflow="hidden">
      {/* Animated gradient background */}
      <Box
        position="absolute"
        top="-20%"
        left="-10%"
        w="400px"
        h="400px"
        bg="blue.300"
        borderRadius="full"
        filter="blur(120px)"
        opacity="0.2"
        // animation={`${float} 15s infinite ease-in-out`}
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-20%"
        right="-10%"
        w="400px"
        h="400px"
        bg="purple.300"
        borderRadius="full"
        filter="blur(120px)"
        opacity="0.2"
        // animation={`${float} 12s infinite ease-in-out reverse`}
        pointerEvents="none"
      />

      <Container maxW="container.xl" px={{ base: 4, md: 6 }} position="relative" zIndex={2}>
        {/* Header with animated icon */}
        <VStack spacing={3} mb={{ base: 8, md: 12 }} textAlign="center">
          <HStack spacing={2}>
            <Circle size="45px" bg="blue.100" _dark={{ bg: 'blue.900' }}>
              <Icon as={FiCompass} color="blue.600" boxSize={5} />
            </Circle>
            <Badge colorScheme="blue" fontSize="xs" px={3} py={1.5} borderRadius="full" letterSpacing="wider">
              ✨ EXPLORE OUR WORLD
            </Badge>
          </HStack>
          <Heading
            size={{ base: '2xl', md: '3xl' }}
            fontWeight="900"
            bgGradient="linear(135deg, #1e3a8a 0%, #3b82f6 100%)"
            bgClip="text"
            letterSpacing="tight"
          >
            Discover Amazing Collections
          </Heading>
          <Text color="gray.600" _dark={{ color: 'gray.400' }} maxW="2xl" fontSize="lg">
            Curated just for you – from trending fashion to must‑have electronics
          </Text>
        </VStack>

        {/* Bento Grid */}
        <SimpleGrid
          columns={{ base: 1, md: 4 }}
          gap={5}
          autoRows="minmax(200px, auto)"
        >
          {bentoData.map((item) => {
            const sizeStyles = getSizeStyles(item.size);
            const isLiked = likedItems.has(item.id);
            return (
              <Box
                key={item.id}
                position="relative"
                borderRadius="3xl"
                overflow="hidden"
                boxShadow="lg"
                transition="all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)"
                _hover={{
                  transform: 'translateY(-10px) scale(1.02)',
                  boxShadow: '2xl',
                  '& .overlay-glow': {
                    opacity: 1,
                  },
                }}
                sx={sizeStyles}
                cursor="pointer"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                  transition="transform 0.6s ease"
                  _groupHover={{ transform: 'scale(1.08)' }}
                />
                {/* Animated gradient overlay on hover */}
                <Box
                  className="overlay-glow"
                  position="absolute"
                  inset={0}
                  bgGradient={getColorGradient(item.colorScheme)}
                  opacity="0"
                  transition="opacity 0.4s ease"
                  mixBlendMode="overlay"
                  pointerEvents="none"
                />
                <Box
                  position="absolute"
                  inset={0}
                  bgGradient={gradientOverlay}
                />
                
                {/* Top left badge with icon and animation */}
                <Box
                  position="absolute"
                  top={4}
                  left={4}
                  zIndex={2}
                >
                  <Badge
                    bg={getColorGradient(item.colorScheme)}
                    color="white"
                    px={3}
                    py={1.5}
                    borderRadius="full"
                    fontSize="10px"
                    fontWeight="bold"
                    textTransform="uppercase"
                    boxShadow="md"
                  >
                    <HStack spacing={1}>
                      <Icon as={item.icon} boxSize={3} />
                      <Text>{item.badge}</Text>
                    </HStack>
                  </Badge>
                </Box>

                {/* Discount chip - bottom left */}
                {item.discount && (
                  <Badge
                    position="absolute"
                    bottom={4}
                    left={4}
                    bg="whiteAlpha.300"
                    backdropFilter="blur(8px)"
                    color="white"
                    px={2}
                    py={1}
                    borderRadius="full"
                    fontSize="9px"
                    fontWeight="bold"
                    zIndex={2}
                  >
                    <HStack spacing={1}>
                      <Icon as={FiZap} boxSize={3} />
                      <Text>{item.discount}</Text>
                    </HStack>
                  </Badge>
                )}

                {/* Like button - top right */}
                <Circle
                  position="absolute"
                  top={4}
                  right={4}
                  size="32px"
                  bg="whiteAlpha.700"
                  backdropFilter="blur(8px)"
                  zIndex={3}
                  cursor="pointer"
                  onClick={(e) => toggleLike(item.id, e)}
                  transition="all 0.2s"
                  _hover={{ transform: 'scale(1.1)', bg: 'whiteAlpha.900' }}
                >
                  <Icon
                    as={isLiked ? FaHeart : FaRegHeart}
                    color={isLiked ? 'red.500' : 'gray.700'}
                    boxSize={4}
                    transition="all 0.2s"
                  />
                </Circle>

                {/* Bottom content */}
                <VStack
                  position="absolute"
                  bottom={0}
                  left={0}
                  right={0}
                  p={{ base: 4, md: 5 }}
                  align="flex-start"
                  spacing={2}
                  zIndex={2}
                  color="white"
                >
                  <Heading size={{ base: 'md', md: 'lg' }} fontWeight="800" letterSpacing="-0.5px">
                    {item.title}
                  </Heading>
                  <Text fontSize={{ base: 'xs', md: 'sm' }} opacity={0.9}>
                    {item.subtitle}
                  </Text>
                  <Button
                    size="sm"
                    variant="outline"
                    borderColor="whiteAlpha.600"
                    color="white"
                    borderRadius="full"
                    rightIcon={<FiArrowRight />}
                    _hover={{
                      bg: 'white',
                      color: `${item.colorScheme}.600`,
                      borderColor: 'white',
                      transform: 'translateX(5px)',
                    }}
                    transition="all 0.3s"
                  >
                    {item.cta}
                  </Button>
                </VStack>
              </Box>
            );
          })}
        </SimpleGrid>

        {/* Footer CTA with animated arrow */}
        <Flex justify="center" mt={12}>
          <Button
            size="lg"
            bgGradient="linear(135deg, #1e3a8a 0%, #3b82f6 100%)"
            color="white"
            borderRadius="full"
            px={10}
            rightIcon={<FiTrendingUp />}
            _hover={{
              transform: 'translateY(-4px)',
              boxShadow: '2xl',
              rightIcon: { transform: 'translateX(5px)' },
            }}
            transition="all 0.3s"
          >
            View All Collections
          </Button>
        </Flex>
      </Container>
    </Box>
  );
};

export default BentoGridSection;