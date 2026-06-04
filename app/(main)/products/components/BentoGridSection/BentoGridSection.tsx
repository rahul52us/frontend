import React, { useState, useEffect, useRef } from 'react';
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
  Skeleton,
  useToast,
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
  FaBabyCarriage,
  FaShoePrints,
  FaGamepad,
  FaBook,
  FaCamera,
} from 'react-icons/fa';
import { FiTrendingUp, FiArrowRight, FiCompass, FiZap } from 'react-icons/fi';
import { observer } from 'mobx-react-lite';
import categoryStore from '../../../../store/categoryStore/categoryStore';
import { shopStore } from '../../../../store/shopStore/shopStore';

// ---------- Helper Functions ----------
const getCategoryIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('fruit') || lower.includes('vegetable')) return FaGift;
  if (lower.includes('sweet') || lower.includes('dessert')) return FaStar;
  if (lower.includes('beauty')) return FaHeart;
  if (lower.includes('snack')) return FaShoppingBag;
  if (lower.includes('mobile') || lower.includes('electronics')) return FaMobileAlt;
  if (lower.includes('clothing') || lower.includes('fashion')) return FaTshirt;
  if (lower.includes('shoe') || lower.includes('footwear')) return FaShoePrints;
  if (lower.includes('home') || lower.includes('decor')) return FaHome;
  if (lower.includes('baby') || lower.includes('toy')) return FaBabyCarriage;
  if (lower.includes('game') || lower.includes('gaming')) return FaGamepad;
  if (lower.includes('book') || lower.includes('stationery')) return FaBook;
  if (lower.includes('camera') || lower.includes('audio')) return FaCamera;
  return FaGift;
};

const getCategoryColor = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('fruit')) return 'green';
  if (lower.includes('dairy')) return 'cyan';
  if (lower.includes('sweet')) return 'pink';
  if (lower.includes('beauty')) return 'purple';
  if (lower.includes('snack')) return 'orange';
  if (lower.includes('mobile')) return 'blue';
  if (lower.includes('clothing')) return 'teal';
  if (lower.includes('electronics')) return 'cyan';
  if (lower.includes('home')) return 'yellow';
  if (lower.includes('baby')) return 'pink';
  return 'blue';
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
    teal: 'linear(135deg, #0d9488 0%, #14b8a6 100%)',
    yellow: 'linear(135deg, #ca8a04 0%, #eab308 100%)',
  };
  return gradients[color] || gradients.blue;
};

const getSizeByIndex = (index: number): 'large' | 'medium' | 'small' => {
  const pattern = ['large', 'medium', 'small', 'small', 'medium', 'small', 'large'];
  return pattern[index % pattern.length] as any;
};

const FALLBACK_IMAGE = 'https://picsum.photos/id/20/600/400';

// ---------- Component ----------
const BentoGridSection = observer(() => {
  const toast = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [categoryImages, setCategoryImages] = useState<Map<string, string[]>>(new Map());
  const [imageIndices, setImageIndices] = useState<Map<string, number>>(new Map());
  const intervalRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const gradientOverlay = useColorModeValue(
    'linear(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 100%)',
    'linear(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%)'
  );

  // 1. Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryStore.getAllCategories({});
        if (res?.status === 'success' && Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          throw new Error('Invalid categories response');
        }
      } catch (err) {
        console.error(err);
        toast({ title: 'Error', description: 'Failed to load categories', status: 'error', duration: 3000 });
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [toast]);

  // 2. Fetch product images for each category
  useEffect(() => {
    if (categories.length === 0) return;
    const fetchImages = async () => {
      const newMap = new Map<string, string[]>();
      for (const cat of categories) {
        try {
          const payload = { category: cat._id, limit: 8 };
          const res = await shopStore.getAllProducts(payload, true);
          let products: any[] = [];
          if (res?.status === 'success') {
            if (Array.isArray(res.data)) products = res.data;
            else if (res.data?.products) products = res.data.products;
          } else if (Array.isArray(res?.data)) products = res.data;
          else if (Array.isArray(res)) products = res;
          const images = products
            .map(p => p.image || p.images?.[0])
            .filter(Boolean) as string[];
          if (images.length === 0) images.push(cat.image || FALLBACK_IMAGE);
          newMap.set(cat._id, images);
        } catch (err) {
          console.warn(`Failed to fetch images for ${cat.name}`, err);
          newMap.set(cat._id, [cat.image || FALLBACK_IMAGE]);
        }
      }
      setCategoryImages(newMap);
      // Initialize indices
      const idxMap = new Map<string, number>();
      categories.forEach(cat => idxMap.set(cat._id, 0));
      setImageIndices(idxMap);
    };
    fetchImages();
  }, [categories]);

  // 3. Auto-rotate images (every 3 seconds) - FIXED iteration
  useEffect(() => {
    if (categoryImages.size === 0) return;
    // Clear previous intervals
    intervalRefs.current.forEach(clearInterval);
    intervalRefs.current.clear();

    Array.from(categoryImages.entries()).forEach(([catId, images]) => {
      if (images.length <= 1) return;
      const interval = setInterval(() => {
        setImageIndices(prev => {
          const current = prev.get(catId) || 0;
          const next = (current + 1) % images.length;
          return new Map(prev).set(catId, next);
        });
      }, 3000);
      intervalRefs.current.set(catId, interval);
    });

    return () => {
      intervalRefs.current.forEach(clearInterval);
      intervalRefs.current.clear();
    };
  }, [categoryImages]);

  const toggleLike = (id: string, e: React.MouseEvent) => {
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
        return { gridColumn: { base: 'span 1', md: 'span 2' }, gridRow: { base: 'span 1', md: 'span 2' }, height: { base: '320px', md: '380px' } };
      case 'medium':
        return { gridColumn: 'span 1', gridRow: { base: 'span 1', md: 'span 2' }, height: { base: '280px', md: '320px' } };
      default:
        return { gridColumn: 'span 1', gridRow: 'span 1', height: { base: '200px', md: '240px' } };
    }
  };

  // Build bento items (max 7)
  const bentoItems = categories.slice(0, 7).map((cat, idx) => {
    const name = cat.name || 'Category';
    const color = getCategoryColor(name);
    const size = getSizeByIndex(idx);
    const images = categoryImages.get(cat._id) || [cat.image || FALLBACK_IMAGE];
    const currentIdx = imageIndices.get(cat._id) || 0;
    const currentImage = images[currentIdx];
    const productCount = cat.productCount || cat.products?.length || 0;
    const discount = productCount > 10 ? `${Math.floor(Math.random() * 30) + 20}% Off` : '';
    return {
      id: cat._id,
      title: name,
      subtitle: productCount > 0 ? `${productCount}+ products` : 'Explore collection',
      image: currentImage,
      imagesCount: images.length,
      size,
      colorScheme: color,
      icon: getCategoryIcon(name),
      badge: cat.isFeatured ? '🔥 Featured' : '✨ Trending',
      cta: 'Shop Now',
      discount,
    };
  });

  // Loading skeleton
  if (loading) {
    return (
      <Box py={{ base: 10, md: 16 }} bg={bgColor}>
        <Container maxW="container.xl">
          <VStack spacing={6} mb={12}>
            <Skeleton height="40px" width="300px" />
            <Skeleton height="24px" width="500px" />
          </VStack>
          <SimpleGrid columns={{ base: 1, md: 4 }} gap={5}>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} height="240px" borderRadius="3xl" />
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    );
  }

  if (bentoItems.length === 0) {
    return (
      <Box py={12} textAlign="center">
        <Text>No categories available</Text>
      </Box>
    );
  }

  return (
    <Box py={{ base: 10, md: 16 }} bg={bgColor} position="relative" overflow="hidden">
      {/* Animated background orbs */}
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
        pointerEvents="none"
      />

      <Container maxW="container.xl" px={{ base: 4, md: 6 }} position="relative" zIndex={2}>
        {/* Header */}
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
        <SimpleGrid columns={{ base: 1, md: 4 }} gap={5} autoRows="minmax(200px, auto)">
          {bentoItems.map((item) => {
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
                  '& .overlay-glow': { opacity: 1 },
                }}
                sx={sizeStyles}
                cursor="pointer"
              >
                {/* Image with carousel */}
                <Box position="relative" w="100%" h="100%">
                  <Image
                    src={item.image}
                    alt={item.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    transition="transform 0.6s ease"
                    _groupHover={{ transform: 'scale(1.08)' }}
                  />
                  {/* Dot indicators */}
                  {item.imagesCount > 1 && (
                    <HStack
                      position="absolute"
                      bottom={3}
                      left="50%"
                      transform="translateX(-50%)"
                      spacing={1.5}
                      zIndex={3}
                    >
                      {Array.from({ length: item.imagesCount }).map((_, idx) => (
                        <Box
                          key={idx}
                          w="6px"
                          h="6px"
                          borderRadius="full"
                          bg={idx === (imageIndices.get(item.id) || 0) ? 'white' : 'whiteAlpha.600'}
                          transition="all 0.2s"
                        />
                      ))}
                    </HStack>
                  )}
                </Box>

                {/* Hover gradient overlay */}
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
                <Box position="absolute" inset={0} bgGradient={gradientOverlay} />

                {/* Top left badge */}
                <Box position="absolute" top={4} left={4} zIndex={2}>
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

                {/* Discount chip */}
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

                {/* Like button */}
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

                {/* Bottom text + CTA */}
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

        {/* Footer CTA */}
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
});

export default BentoGridSection;
