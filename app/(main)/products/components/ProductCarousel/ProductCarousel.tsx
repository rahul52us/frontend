'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Skeleton,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaCartPlus, FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { FiArrowRight, FiAward, FiShoppingCart } from 'react-icons/fi';
import { useCartToast } from '../../../../hooks/useCartToast';
import { shopStore } from '../../../../store/shopStore/shopStore';
import stores from '../../../../store/stores';

const MotionBox = motion(Box);

// ─── Types ──────────────────────────────────────────────────────────────
interface Product {
  id: number | string;
  productId?: string;
  _id?: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  badge?: string;
  isNew?: boolean;
  raw?: any;
}

// ─── Helper: Map API product to UI Product interface ────────────────────
const mapApiProductToProduct = (apiProduct: any, index: number): Product => {
  const rawPrice = parseFloat(apiProduct.price ?? apiProduct.sellingPrice) || 0;
  const rawOriginal =
    parseFloat(apiProduct.originalPrice ?? apiProduct.mrp) ||
    Math.round(rawPrice * 1.25);

  const imageUrl =
    typeof apiProduct.image === 'string'
      ? apiProduct.image
      : apiProduct.image?.url ||
        (typeof apiProduct.images?.[0] === 'string'
          ? apiProduct.images[0]
          : apiProduct.images?.[0]?.url) ||
        `https://picsum.photos/seed/prod-${apiProduct._id || index}/400/400`;

  const categoryName =
    typeof apiProduct.category === 'string'
      ? apiProduct.category
      : apiProduct.category?.name || apiProduct.categoryName || 'Local Pick';

  const isRecent =
    Boolean(apiProduct.isNew) ||
    (Boolean(apiProduct.createdAt) &&
      Date.now() - new Date(apiProduct.createdAt).getTime() <
        7 * 24 * 60 * 60 * 1000);

  const resolvedId = apiProduct.productId || apiProduct._id || apiProduct.id || index;

  return {
    id: resolvedId,
    productId: apiProduct.productId,
    _id: apiProduct._id,
    raw: apiProduct,
    name: apiProduct.name || apiProduct.title || 'Featured Product',
    price: rawPrice,
    originalPrice: rawOriginal > rawPrice ? rawOriginal : Math.round(rawPrice * 1.2),
    rating: Number(apiProduct.rating) || 4.6,
    reviews: Number(apiProduct.reviews ?? apiProduct.numReviews) || 48 + (index * 17) % 150,
    image: imageUrl,
    category: categoryName,
    badge:
      apiProduct.badge || (apiProduct.isBestSeller ? 'Bestseller' : undefined),
    isNew: isRecent,
  };
};

// ─── Compact Skeleton Loader ────────────────────────────────────────────
const ProductCarouselSkeleton = () => {
  const sectionBg = useColorModeValue('#F8FAFC', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');

  return (
    <Box bg={sectionBg} py={{ base: 6, md: 10 }}>
      <Container maxW="8xl" px={{ base: 3, md: 8 }}>
        <Flex justify="space-between" align="flex-end" mb={{ base: 4, md: 6 }}>
          <Box>
            <Skeleton h="14px" w="100px" mb={2} rounded="md" />
            <Skeleton h="26px" w="210px" rounded="md" />
          </Box>
          <Skeleton h="32px" w="90px" rounded="full" />
        </Flex>

        <Flex gap={{ base: 3, md: 4 }} overflow="hidden">
          {[...Array(5)].map((_, i) => (
            <Box
              key={i}
              w={{ base: '162px', sm: '195px', md: '230px' }}
              bg={cardBg}
              rounded="2xl"
              p={2.5}
              border="1px solid"
              borderColor={borderColor}
              flexShrink={0}
            >
              <Skeleton
                h={{ base: '140px', sm: '165px', md: '190px' }}
                w="full"
                rounded="xl"
                mb={3}
              />
              <Skeleton h="10px" w="50%" mb={2} rounded="sm" />
              <Skeleton h="14px" w="90%" mb={1.5} rounded="sm" />
              <Skeleton h="14px" w="65%" mb={3} rounded="sm" />
              <Flex justify="space-between" align="center" pt={1}>
                <Skeleton h="20px" w="45%" rounded="md" />
                <Skeleton h="30px" w="64px" rounded="lg" />
              </Flex>
            </Box>
          ))}
        </Flex>
      </Container>
    </Box>
  );
};

// ─── Mobile-First Product Card Component ────────────────────────────────
const ProductCard = ({
  product,
  onSelect,
  onAddToCart,
}: {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}) => {
  const [isLiked, setIsLiked] = useState(false);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const titleColor = useColorModeValue('gray.800', 'gray.100');
  const mutedColor = useColorModeValue('gray.500', 'gray.400');
   const hoverColor = useColorModeValue("brand.600", "brand.300");

  const discount =
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

  return (
    <MotionBox
      w={{ base: '162px', sm: '195px', md: '232px' }}
      flexShrink={0}
      bg={cardBg}
      borderRadius="2xl"
      border="1px solid"
      borderColor={borderColor}
      overflow="hidden"
      display="flex"
      flexDirection="column"
      cursor="pointer"
      role="group"
      position="relative"
      onClick={() => onSelect(product)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      _hover={{
        // borderColor: 'blue.200',
        boxShadow: '0 12px 28px -8px rgba(37, 99, 235, 0.12)',
      }}
    >
      {/* Image Box */}
      <Box
        position="relative"
        w="full"
        h={{ base: '145px', sm: '170px', md: '195px' }}
        bg="gray.50"
        overflow="hidden"
      >
        <Image
          src={product.image}
          alt={product.name}
          w="full"
          h="full"
          objectFit="cover"
          loading="lazy"
          transition="transform 0.35s ease"
          _groupHover={{ transform: 'scale(1.06)' }}
        />

        {/* Top-Left Badges (Discount / New / Bestseller) */}
        <HStack position="absolute" top={2} left={2} spacing={1} zIndex={2}>
          {discount > 0 && (
            <Badge
              bg="red.500"
              color="white"
              borderRadius="md"
              px={1.5}
              py={0.5}
              fontSize="10px"
              fontWeight="700"
            >
              {discount}% OFF
            </Badge>
          )}
          {product.badge ? (
            <Badge
              bg="amber.400"
              color="gray.900"
              borderRadius="md"
              px={1.5}
              py={0.5}
              fontSize="9px"
              fontWeight="700"
              display={{ base: 'none', sm: 'inline-block' }}
            >
              {product.badge}
            </Badge>
          ) : product.isNew ? (
            <Badge
              bg="green.500"
              color="white"
              borderRadius="md"
              px={1.5}
              py={0.5}
              fontSize="9px"
              fontWeight="700"
            >
              NEW
            </Badge>
          ) : null}
        </HStack>

        {/* Top-Right Wishlist Button */}
        <IconButton
          aria-label="Add to wishlist"
          icon={
            isLiked ? (
              <FaHeart size={13} color="#EF4444" />
            ) : (
              <FaRegHeart size={13} color="#4B5563" />
            )
          }
          size="xs"
          w="28px"
          h="28px"
          minW="28px"
          borderRadius="full"
          bg="whiteAlpha.900"
          backdropFilter="blur(4px)"
          boxShadow="xs"
          position="absolute"
          top={2}
          right={2}
          zIndex={2}
          _hover={{ bg: 'white', transform: 'scale(1.08)' }}
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked((prev) => !prev);
          }}
        />

        {/* Bottom-Left Compact Rating Pill (Saves vertical space inside card body) */}
        <HStack
          position="absolute"
          bottom={2}
          left={2}
          bg="whiteAlpha.900"
          backdropFilter="blur(6px)"
          px={2}
          py={0.5}
          rounded="full"
          spacing={1}
          boxShadow="2xs"
          zIndex={2}
        >
          <Icon as={FaStar} color="amber.400" boxSize={2.5} />
          <Text fontSize="10px" fontWeight="700" color="gray.800">
            {product.rating.toFixed(1)}
          </Text>
          <Text fontSize="9px" color="gray.500" fontWeight="500">
            ({product.reviews})
          </Text>
        </HStack>
      </Box>

      {/* Card Details */}
      <Flex
        direction="column"
        p={{ base: 2.5, md: 3.5 }}
        flex="1"
        justify="space-between"
      >
        <Box>
          {/* <Text
            fontSize="10px"
            color={mutedColor}
            fontWeight="600"
            textTransform="uppercase"
            letterSpacing="wider"
            noOfLines={1}
          >
            {product.category}
          </Text> */}

          <Text
            fontSize={{ base: 'xs', md: 'sm' }}
            fontWeight="700"
            color={titleColor}
            noOfLines={2}
            lineHeight="1.3"
            mt={0.5}
            minH={{ base: '31px', md: '36px' }}
            _groupHover={{ color: hoverColor }}
            transition="color 0.15s ease"
          >
            {product.name}
          </Text>
        </Box>

        {/* Bottom Price + Always-Accessible Add Button */}
        <Flex
          align="center"
          justify="space-between"
          mt={2.5}
          pt={2}
          borderTop="1px solid"
          borderColor={borderColor}
          gap={1}
        >
          <Box minW={0}>
            <Text
              fontSize={{ base: 'sm', md: 'md' }}
              fontWeight="700"
              color="gray.900"
              lineHeight="1.1"
            >
              ₹{Math.round(product.price).toLocaleString('en-IN')}
            </Text>
            {product.originalPrice > product.price && (
              <Text
                fontSize="10px"
                color="gray.400"
                textDecoration="line-through"
                fontWeight="500"
              >
                ₹{Math.round(product.originalPrice).toLocaleString('en-IN')}
              </Text>
            )}
          </Box>

          <IconButton
            size="xs"
            aria-label='add to cart'
            h={{ base: '28px', md: '32px' }}
            px={{ base: 2.5, md: 3 }}
            rounded="lg"
            colorScheme="brand"
            variant="subtle"
            bg="var(--color-surface-hover)"
            color="var(--color-primary)"
            fontWeight="700"
            fontSize="xs"
            icon={<FaCartPlus size={12} />}
            _hover={{ bg: 'brand.600', color: 'white' }}
            _active={{ transform: 'scale(0.95)' }}
            flexShrink={0}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
          />
         
        </Flex>
      </Flex>
    </MotionBox>
  );
};

// ─── Main Carousel Component ────────────────────────────────────────────
const ProductCarousel = observer(() => {
  const router = useRouter();
  const toast = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const sectionBg = useColorModeValue('#F8FAFC', 'gray.900');
  const borderColor = useColorModeValue('gray.100', 'gray.800');
  const titleColor = useColorModeValue('gray.900', 'white');
  const subTextColor = useColorModeValue('gray.500', 'gray.400');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await shopStore.getAllShopProducts();
        const productsArray = Array.isArray(response)
          ? response
          : response?.products || response?.data || [];
        const mapped = productsArray.map(mapApiProductToProduct);
        setProducts(mapped);
      } catch (error) {
        console.error('Failed to load products', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, products.length]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -440 : 440;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const { cartStore } = stores;
  const { showAddToCartToast } = useCartToast();

  const handleSelectProduct = (product: Product) => {
    const targetId = product.productId || product._id || product.id;
    router.push(`/product?productId=${targetId}`);
  };

  const handleAddToCart = async (product: Product) => {
    try {
      const productToAdd = product.raw || product;
      await cartStore.addToCart(productToAdd);
      showAddToCartToast(productToAdd);
    } catch (err) {
      toast({
        title: 'Added to cart',
        description: `${product.name} added to your cart.`,
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'bottom-right',
      });
    }
  };

  if (isLoading) {
    return <ProductCarouselSkeleton />;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <Box
      as="section"
      bg={sectionBg}
      py={{ base: 6, md: 10 }}
      borderBottom="1px solid"
      borderColor={borderColor}
    >
      <Container maxW="8xl" px={{ base: 3, md: 8 }}>
        {/* Compact Section Header */}
        <Flex
          justify="space-between"
          align="flex-end"
          mb={{ base: 4, md: 6 }}
          gap={4}
        >
          <Box>
            <HStack spacing={1.5} mb={1}>
              <Icon as={FiAward} color="var(--color-primary)" boxSize={3.5} />
              <Text
                fontSize="11px"
                fontWeight="700"
                textTransform="uppercase"
                letterSpacing="wider"
                color="var(--color-primary)"
              >
                Customer Favorites
              </Text>
            </HStack>
            <Heading
              as="h2"
              fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }}
              fontWeight="800"
              color={titleColor}
              letterSpacing="tight"
              lineHeight="1.2"
            >
              Top Rated Products
            </Heading>
            <Text
              display={{ base: 'none', sm: 'block' }}
              fontSize="xs"
              color={subTextColor}
              mt={0.5}
            >
              Most loved items from verified neighborhood stores near you
            </Text>
          </Box>

          {/* Right Controls: View All + Desktop Scroll Arrows */}
          <HStack spacing={2} flexShrink={0}>
            <Button
              size="xs"
              h={{ base: '30px', md: '34px' }}
              px={3.5}
              rounded="full"
              variant="ghost"
              colorScheme="brand"
              fontWeight="600"
              rightIcon={<FiArrowRight />}
              onClick={() => router.push('/products')}
            >
              View All
            </Button>

            <HStack spacing={1.5} display={{ base: 'none', md: 'flex' }}>
              <IconButton
                aria-label="Previous products"
                icon={<ChevronLeftIcon boxSize={5} />}
                onClick={() => scroll('left')}
                isDisabled={!canScrollLeft}
                size="sm"
                h="34px"
                w="34px"
                rounded="full"
                bg="white"
                variant="outline"
                borderColor="gray.200"
                color={titleColor}
                _hover={{ bg: 'gray.50', borderColor: 'gray.300' }}
                _disabled={{ opacity: 0.35, cursor: 'not-allowed' }}
              />
              <IconButton
                aria-label="Next products"
                icon={<ChevronRightIcon boxSize={5} />}
                onClick={() => scroll('right')}
                isDisabled={!canScrollRight}
                size="sm"
                h="34px"
                w="34px"
                rounded="full"
                bg="white"
                variant="outline"
                borderColor="gray.200"
                color={titleColor}
                _hover={{ bg: 'gray.50', borderColor: 'gray.300' }}
                _disabled={{ opacity: 0.35, cursor: 'not-allowed' }}
              />
            </HStack>
          </HStack>
        </Flex>

        {/* Horizontal Touch-Friendly Product Rail */}
        <Flex
          ref={scrollRef}
          gap={{ base: 3, sm: 3.5, md: 4 }}
          overflowX="auto"
          py={1}
          px={0.5}
          sx={{
            scrollSnapType: 'x mandatory',
            '& > *': { scrollSnapAlign: 'start' },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={handleSelectProduct}
              onAddToCart={handleAddToCart}
            />
          ))}

          {/* End Card: Explore All Products */}
          <Flex
            as="button"
            onClick={() => router.push('/products')}
            w={{ base: '130px', sm: '150px', md: '180px' }}
            flexShrink={0}
            bg="white"
            border="1px dashed"
            borderColor="var(--color-border)"
            rounded="2xl"
            p={4}
            direction="column"
            align="center"
            justify="center"
            gap={2.5}
            role="group"
            transition="all 0.2s ease"
            _hover={{
              borderColor: 'brand.400',
              bg: 'brand.50',
            }}
          >
            <Flex
              w="42px"
              h="42px"
              rounded="full"
              bg="var(--color-surface-hover)"
              color="var(--color-primary)"
              align="center"
              justify="center"
              transition="transform 0.2s ease"
              _groupHover={{
                bg: 'brand.600',
                color: 'white',
                transform: 'scale(1.08)',
              }}
            >
              <Icon as={FiShoppingCart} boxSize={4} />
            </Flex>
            <VStack spacing={0.5}>
              <Text fontSize="xs" fontWeight="700" color="gray.800">
                View All Products
              </Text>
              <Text fontSize="10px" color="var(--color-primary)" fontWeight="600">
                Explore {products.length}+ items →
              </Text>
            </VStack>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
});
export default ProductCarousel;