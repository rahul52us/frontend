'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Icon,
  useBreakpointValue,
  IconButton,
} from '@chakra-ui/react';
import { FaStar, FaRegStar, FaStarHalfAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// ============================
// Types
// ============================
interface Product {
  id: string | number;
  name: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: string;
  category?: string;
}

interface ProductCarouselProps {
  products?: Product[];
  title?: string;
  subtitle?: string;
  autoplay?: boolean;
  autoplaySpeed?: number;
}

// ============================
// Helper: Star Rating
// ============================
const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <HStack spacing={0.5}>
      {[...Array(fullStars)].map((_, i) => (
        <Icon key={`full-${i}`} as={FaStar} color="yellow.400" boxSize={3.5} />
      ))}
      {hasHalfStar && (
        <Icon as={FaStarHalfAlt} color="yellow.400" boxSize={3.5} />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Icon key={`empty-${i}`} as={FaRegStar} color="gray.300" boxSize={3.5} />
      ))}
    </HStack>
  );
};

// ============================
// Default product data
// ============================
const defaultProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Noise Cancelling Headphones',
    price: 249.99,
    oldPrice: 349.99,
    rating: 4.8,
    reviewCount: 234,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=450&fit=crop',
    badge: 'Best Seller',
    category: 'Electronics',
  },
  {
    id: 2,
    name: 'Smart Watch Ultra',
    price: 399.99,
    rating: 4.9,
    reviewCount: 189,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=450&fit=crop',
    badge: 'New',
    category: 'Wearables',
  },
  {
    id: 3,
    name: 'Minimalist Leather Backpack',
    price: 89.99,
    oldPrice: 129.99,
    rating: 4.7,
    reviewCount: 456,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=450&fit=crop',
    category: 'Fashion',
  },
  {
    id: 4,
    name: 'Premium Running Shoes',
    price: 159.99,
    rating: 4.6,
    reviewCount: 892,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=450&fit=crop',
    badge: '-20%',
    category: 'Sports',
  },
  {
    id: 5,
    name: 'Smart Home Speaker',
    price: 129.99,
    oldPrice: 179.99,
    rating: 4.5,
    reviewCount: 567,
    image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600&h=450&fit=crop',
    category: 'Electronics',
  },
  {
    id: 6,
    name: 'Ultra HD Action Camera',
    price: 299.99,
    rating: 4.8,
    reviewCount: 321,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=450&fit=crop',
    badge: 'Trending',
    category: 'Camera',
  },
  {
    id: 7,
    name: 'Ergonomic Office Chair',
    price: 349.99,
    oldPrice: 499.99,
    rating: 4.4,
    reviewCount: 178,
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600&h=450&fit=crop',
    category: 'Furniture',
  },
  {
    id: 8,
    name: 'Wireless Mechanical Keyboard',
    price: 119.99,
    rating: 4.7,
    reviewCount: 245,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=450&fit=crop',
    badge: 'Hot',
    category: 'Electronics',
  },
];

// ============================
// Main Component (No scrollbar, perfect autoplay)
// ============================
const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products = defaultProducts,
  title = '✨ Featured Products',
  subtitle = 'Hand-picked just for you',
  autoplay = true,
  autoplaySpeed = 4000,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive cards per view
  const slidesToShow = useBreakpointValue({
    base: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 4,
  }) || 4;

  // Update card width and total slides
  const updateMetrics = useCallback(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const firstCard = container.querySelector('.product-card') as HTMLElement;
      if (firstCard) {
        const cardWidthValue = firstCard.offsetWidth;
        setCardWidth(cardWidthValue);
        const scrollWidth = container.scrollWidth;
        const visibleWidth = container.clientWidth;
        const maxScroll = scrollWidth - visibleWidth;
        const maxIndex = Math.ceil(maxScroll / cardWidthValue);
        setTotalSlides(Math.max(1, maxIndex + 1));
      }
    }
  }, [products.length]);

  // Update active index on scroll
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current && cardWidth > 0) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(newIndex);
    }
  }, [cardWidth]);

  // Scroll to index with smooth behavior
  const scrollToIndex = useCallback(
    (index: number) => {
      if (scrollContainerRef.current && cardWidth > 0) {
        const maxIndex = totalSlides - 1;
        const targetIndex = Math.min(Math.max(index, 0), maxIndex);
        scrollContainerRef.current.scrollTo({
          left: targetIndex * cardWidth,
          behavior: 'smooth',
        });
        setActiveIndex(targetIndex);
      }
    },
    [cardWidth, totalSlides]
  );

  const handlePrev = () => scrollToIndex(activeIndex - 1);
  const handleNext = () => scrollToIndex(activeIndex + 1);

  // Autoplay logic with cleanup
  useEffect(() => {
    if (!autoplay || isHovering || totalSlides <= 1) {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      return;
    }
    autoplayTimerRef.current = setInterval(() => {
      if (activeIndex + 1 < totalSlides) {
        scrollToIndex(activeIndex + 1);
      } else {
        scrollToIndex(0);
      }
    }, autoplaySpeed);
    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [autoplay, autoplaySpeed, activeIndex, totalSlides, scrollToIndex, isHovering]);

  // Set up resize and scroll listeners
  useEffect(() => {
    updateMetrics();
    window.addEventListener('resize', updateMetrics);
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      window.removeEventListener('resize', updateMetrics);
      if (container) container.removeEventListener('scroll', handleScroll);
    };
  }, [updateMetrics, handleScroll]);

  // Re-run metrics when products or slidesToShow change
  useEffect(() => {
    updateMetrics();
  }, [updateMetrics, slidesToShow]);

  return (
    <Box
      as="section"
      py={{ base: 8, md: 12 }}
      bg="linear-gradient(135deg, #f5f7fa 0%, #e9edf2 100%)"
      position="relative"
      overflow="hidden"
    >
      {/* Decorative blobs */}
      <Box
        position="absolute"
        top="-20%"
        right="-10%"
        w="300px"
        h="300px"
        bg="blue.100"
        borderRadius="full"
        filter="blur(80px)"
        opacity={0.4}
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="-20%"
        left="-10%"
        w="300px"
        h="300px"
        bg="purple.100"
        borderRadius="full"
        filter="blur(80px)"
        opacity={0.4}
        zIndex={0}
      />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        {/* Header */}
        <VStack mb={{ base: 6, md: 10 }} spacing={2}>
          <Text
            fontSize={{ base: 'sm', md: 'md' }}
            fontWeight="semibold"
            color="blue.600"
            textTransform="uppercase"
            letterSpacing="wider"
            bg="white"
            px={4}
            py={1}
            borderRadius="full"
            boxShadow="sm"
          >
            {subtitle}
          </Text>
          <Text
            fontSize={{ base: '2xl', md: '3xl' }}
            fontWeight="bold"
            color="gray.800"
            textAlign="center"
          >
            {title}
          </Text>
          <Box w="80px" h="3px" bg="linear-gradient(90deg, #3182ce, #9f7aea)" rounded="full" />
        </VStack>

        {/* Carousel Wrapper */}
        <Box position="relative" px={{ base: 0, md: 6 }}>
          {/* Navigation Buttons (desktop) */}
          <IconButton
            aria-label="Previous products"
            icon={<FaChevronLeft />}
            position="absolute"
            left={{ base: -2, md: -4 }}
            top="50%"
            transform="translateY(-50%)"
            zIndex={10}
            rounded="full"
            bg="white"
            color="blue.600"
            boxShadow="xl"
            size="lg"
            onClick={handlePrev}
            isDisabled={activeIndex === 0}
            display={{ base: 'none', md: 'flex' }}
            _hover={{ bg: 'blue.500', color: 'white', transform: 'translateY(-50%) scale(1.05)' }}
            transition="all 0.2s"
            opacity={activeIndex === 0 ? 0.5 : 1}
          />
          <IconButton
            aria-label="Next products"
            icon={<FaChevronRight />}
            position="absolute"
            right={{ base: -2, md: -4 }}
            top="50%"
            transform="translateY(-50%)"
            zIndex={10}
            rounded="full"
            bg="white"
            color="blue.600"
            boxShadow="xl"
            size="lg"
            onClick={handleNext}
            isDisabled={activeIndex >= totalSlides - 1}
            display={{ base: 'none', md: 'flex' }}
            _hover={{ bg: 'blue.500', color: 'white', transform: 'translateY(-50%) scale(1.05)' }}
            transition="all 0.2s"
            opacity={activeIndex >= totalSlides - 1 ? 0.5 : 1}
          />

          {/* Scrollable Container - NO SCROLLBAR */}
          <Box
            ref={scrollContainerRef}
            overflowX="auto"
            css={{
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE/Edge
              scrollSnapType: 'x mandatory',
              '&::-webkit-scrollbar': {
                display: 'none', // Chrome/Safari
              },
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <HStack
              spacing={6}
              align="stretch"
              px={{ base: 2, md: 0 }}
              py={4}
              display="inline-flex"
            >
              {products.map((product) => (
                <Box
                  key={product.id}
                  className="product-card"
                  width={{
                    base: '280px',
                    sm: 'calc((100vw - 48px) / 2 - 12px)',
                    md: 'calc((100vw - 80px) / 3 - 16px)',
                    lg: 'calc((100vw - 120px) / 4 - 16px)',
                    xl: '300px',
                  }}
                  minW={{ base: '260px', sm: '240px', md: '220px', lg: '250px', xl: '280px' }}
                  flexShrink={0}
                  scrollSnapAlign="start"
                >
                  <Box
                    bg="white"
                    rounded="2xl"
                    overflow="hidden"
                    boxShadow="lg"
                    transition="all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)"
                    _hover={{
                      transform: { base: 'none', md: 'translateY(-12px)' },
                      boxShadow: '2xl',
                    }}
                    height="100%"
                    display="flex"
                    flexDirection="column"
                    position="relative"
                    backdropFilter="blur(2px)"
                    bgGradient="linear(to-br, white, gray.50)"
                  >
                    {/* Animated Badge */}
                    {product.badge && (
                      <Badge
                        position="absolute"
                        top={3}
                        left={3}
                        zIndex={2}
                        bg="linear-gradient(135deg, #3182ce, #63b3ed)"
                        color="white"
                        px={3}
                        py={1}
                        rounded="full"
                        fontSize="xs"
                        fontWeight="bold"
                        textTransform="uppercase"
                        boxShadow="md"
                        animation="pulse 2s infinite"
                        sx={{
                          '@keyframes pulse': {
                            '0%': { opacity: 0.8, transform: 'scale(1)' },
                            '50%': { opacity: 1, transform: 'scale(1.05)' },
                            '100%': { opacity: 0.8, transform: 'scale(1)' },
                          },
                        }}
                      >
                        {product.badge}
                      </Badge>
                    )}

                    {/* Image */}
                    <Box
                      position="relative"
                      height="200px"
                      width="100%"
                      overflow="hidden"
                      bg="gray.100"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.08)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
                        }}
                      />
                    </Box>

                    {/* Details */}
                    <VStack p={4} align="stretch" flex="1" spacing={2}>
                      {product.category && (
                        <Text fontSize="xs" color="blue.500" fontWeight="bold" letterSpacing="wide">
                          {product.category}
                        </Text>
                      )}
                      <Text
                        fontWeight="bold"
                        fontSize="md"
                        color="gray.800"
                        noOfLines={2}
                        lineHeight="short"
                        minH="2.5rem"
                      >
                        {product.name}
                      </Text>
                      <HStack spacing={1} alignItems="center">
                        {renderStars(product.rating)}
                        <Text fontSize="xs" color="gray.500" ml={1}>
                          ({product.reviewCount})
                        </Text>
                      </HStack>
                      <HStack spacing={2} alignItems="baseline">
                        <Text fontWeight="bold" fontSize="xl" color="blue.600">
                          ${product.price.toFixed(2)}
                        </Text>
                        {product.oldPrice && (
                          <Text fontSize="sm" color="gray.400" textDecoration="line-through">
                            ${product.oldPrice.toFixed(2)}
                          </Text>
                        )}
                      </HStack>
                      <Button
                        mt={2}
                        colorScheme="blue"
                        variant="outline"
                        size="sm"
                        rounded="full"
                        w="full"
                        _hover={{
                          bg: 'blue.500',
                          color: 'white',
                          transform: 'translateY(-2px)',
                          boxShadow: 'md',
                        }}
                        transition="all 0.2s"
                      >
                        Quick View →
                      </Button>
                    </VStack>
                  </Box>
                </Box>
              ))}
            </HStack>
          </Box>

          {/* Dots Indicator with animation */}
          {totalSlides > 1 && (
            <HStack justify="center" mt={8} spacing={3}>
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <Box
                  key={idx}
                  as="button"
                  onClick={() => scrollToIndex(idx)}
                  w={idx === activeIndex ? '28px' : '8px'}
                  h="8px"
                  rounded="full"
                  bg={idx === activeIndex ? 'blue.500' : 'gray.300'}
                  transition="all 0.3s ease"
                  cursor="pointer"
                  _hover={{ bg: 'blue.400', transform: 'scale(1.2)' }}
                />
              ))}
            </HStack>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ProductCarousel;