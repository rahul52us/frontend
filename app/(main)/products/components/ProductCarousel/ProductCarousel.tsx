import React, { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Flex, Text, Badge, IconButton, useBreakpointValue } from '@chakra-ui/react';
import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaEye,
  FaRegHeart,
} from 'react-icons/fa';
import { shopStore } from '../../../../store/shopStore/shopStore'; // adjust path

// ─── Types ──────────────────────────────────────────────────────────────
interface Product {
  id: number | string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  badge?: string;
  isNew?: boolean;
}

// ─── Inline SVG Icons (no external deps) ────────────────────────────────
const ShoppingBagIcon = ({ size = 80, color = "#3182ce" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

// ─── E-Commerce Loader Component ──────────────────────────────────────────
const EcommerceLoader = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="500px"
      bg="gray.50"
      borderRadius="2xl"
      gap={6}
    >
      <Box position="relative" width="80px" height="80px">
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ShoppingBagIcon />
        </motion.div>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: i === 0 ? '#38b2ac' : i === 1 ? '#ed8936' : '#e53e3e',
              top: '50%',
              left: '50%',
            }}
            animate={{
              x: [0, (i - 1) * 40, 0],
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
          />
        ))}
      </Box>
      <Flex direction="column" align="center" gap={2}>
        <Text fontSize="xl" fontWeight="bold" color="gray.700" letterSpacing="wide">
          Loading Top Picks
        </Text>
        <Text fontSize="sm" color="gray.500">
          Curating the best for you...
        </Text>
      </Flex>
      <Box width="200px" height="4px" bg="gray.200" borderRadius="full" overflow="hidden">
        <motion.div
          style={{ height: '100%', background: 'linear-gradient(90deg, #3182ce, #38b2ac)', borderRadius: 'full' }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
      </Box>
    </Flex>
  );
};

// ─── Helper: Map API product to UI Product interface ────────────────────
const mapApiProductToProduct = (apiProduct: any): Product => {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    price: parseFloat(apiProduct.price) || 0,
    originalPrice: parseFloat(apiProduct.originalPrice) || parseFloat(apiProduct.price) * 1.2 || 0,
    rating: apiProduct.rating || 4.5,
    reviews: apiProduct.reviews || Math.floor(Math.random() * 1000) + 100,
    image: apiProduct.image || apiProduct.images?.[0] || 'https://via.placeholder.com/500',
    category: apiProduct.category || apiProduct.categoryName || 'General',
    badge: apiProduct.badge || (apiProduct.isBestSeller ? 'Best Seller' : undefined),
    isNew: apiProduct.isNew || apiProduct.createdAt && (Date.now() - new Date(apiProduct.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000),
  };
};

// ─── Product Card Component (unchanged) ─────────────────────────────────
const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      style={{ height: '100%' }}
    >
      <Box
        bg="white"
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="0 4px 20px rgba(0,0,0,0.08)"
        transition="box-shadow 0.3s ease"
        _hover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
        position="relative"
        height="100%"
        display="flex"
        flexDirection="column"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box position="relative" overflow="hidden" paddingTop="100%" bg="gray.100">
          <motion.img
            src={product.image}
            alt={product.name}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.4 }}
          />
          <Flex position="absolute" top={3} left={3} gap={2} zIndex={2}>
            {product.isNew && <Badge colorScheme="green" borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="bold">NEW</Badge>}
            <Badge colorScheme="red" borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="bold">-{discount}%</Badge>
          </Flex>
          <motion.div style={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }} whileTap={{ scale: 0.8 }}>
            <IconButton
              aria-label="Add to wishlist"
              icon={isLiked ? <FaHeart size={18} color="#e53e3e" /> : <FaRegHeart size={18} color="white" />}
              size="sm"
              borderRadius="full"
              bg="rgba(0,0,0,0.3)"
              _hover={{ bg: "rgba(0,0,0,0.5)" }}
              backdropFilter="blur(4px)"
              onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
            />
          </motion.div>
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
              >
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <IconButton aria-label="Quick view" icon={<FaEye size={20} />} size="md" borderRadius="full" bg="white" color="gray.800" _hover={{ bg: "gray.100" }} />
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <IconButton aria-label="Add to cart" icon={<FaShoppingCart size={20} />} size="md" borderRadius="full" bg="#3182ce" color="white" _hover={{ bg: "#2c5282" }} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
        <Flex direction="column" p={4} gap={2} flex={1}>
          <Text fontSize="xs" color="gray.500" fontWeight="medium" textTransform="uppercase" letterSpacing="wider">{product.category}</Text>
          <Text fontSize="md" fontWeight="bold" color="gray.800" noOfLines={2} lineHeight="short">{product.name}</Text>
          <Flex align="center" gap={1}>
            <Flex>{[...Array(5)].map((_, i) => <FaStar key={i} size={14} color={i < Math.floor(product.rating) ? "#ecc94b" : "#cbd5e0"} style={{ marginRight: '1px' }} />)}</Flex>
            <Text fontSize="sm" color="gray.600" fontWeight="medium">{product.rating}</Text>
            <Text fontSize="xs" color="gray.400">({product.reviews.toLocaleString()})</Text>
          </Flex>
          <Flex align="baseline" gap={2} mt="auto" pt={2}>
            <Text fontSize="xl" fontWeight="bold" color="#3182ce">${product.price.toFixed(2)}</Text>
            <Text fontSize="sm" color="gray.400" textDecoration="line-through">${product.originalPrice.toFixed(2)}</Text>
          </Flex>
        </Flex>
      </Box>
    </motion.div>
  );
};

// ─── Main Carousel Component (Dynamic) ───────────────────────────────────
const ProductCarousel = observer(() => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const itemsPerPage = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4 }) || 4;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Fetch products from shopStore
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Using getAllShopProducts (fetches all products from /product/allproducts)
        const response = await shopStore.getAllShopProducts();
        // response is the data returned from API (e.g., { products: [...] } or just array)
        let productsArray = Array.isArray(response) ? response : response?.products || response?.data || [];
        // Map to our Product interface
        const mapped = productsArray.map(mapApiProductToProduct);
        setProducts(mapped);
      } catch (error) {
        console.error("Failed to load products", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const paginate = useCallback((newDirection: number) => {
    if (totalPages === 0) return;
    setDirection(newDirection);
    setCurrentPage((prev) => {
      if (newDirection === 1) return prev === totalPages - 1 ? 0 : prev + 1;
      return prev === 0 ? totalPages - 1 : prev - 1;
    });
  }, [totalPages]);

  const currentProducts = products.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  // Auto-play
  useEffect(() => {
    if (isLoading || totalPages <= 1) return;
    const interval = setInterval(() => paginate(1), 5000);
    return () => clearInterval(interval);
  }, [isLoading, paginate, totalPages]);

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
  };

  if (isLoading) {
    return (
      <Box maxW="1400px" mx="auto" px={{ base: 4, md: 8 }} py={12}>
        <EcommerceLoader />
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Box maxW="1400px" mx="auto" px={{ base: 4, md: 8 }} py={12} textAlign="center">
        <Text fontSize="xl" color="gray.500">No products found.</Text>
      </Box>
    );
  }

  return (
    <Box bg="gray.50" py={{ base: 12, md: 20 }} overflow="hidden">
      <Box maxW="1400px" mx="auto" px={{ base: 4, md: 8 }}>
        {/* Section Header (unchanged) */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Flex direction="column" align={{ base: "center", md: "flex-start" }} mb={10} gap={3}>
            <Badge colorScheme="blue" borderRadius="full" px={4} py={1} fontSize="sm" textTransform="uppercase" letterSpacing="widest">
              Curated For You
            </Badge>
            <Text fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} fontWeight="extrabold" color="gray.900" lineHeight="1.1" textAlign={{ base: "center", md: "left" }}>
              Top Rated{" "}
              <Text as="span" color="#3182ce" position="relative">
                Products
                <svg style={{ position: 'absolute', bottom: '-8px', left: 0, width: '100%' }} viewBox="0 0 200 12" fill="none">
                  <motion.path d="M2 8C50 2 150 2 198 8" stroke="#3182ce" strokeWidth="4" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5 }} />
                </svg>
              </Text>
            </Text>
            <Text fontSize="lg" color="gray.600" maxW="600px" textAlign={{ base: "center", md: "left" }}>
              Discover our community's favorite picks, rated and reviewed by thousands of happy customers.
            </Text>
          </Flex>
        </motion.div>

        <Box position="relative">
          {/* Navigation Arrows */}
          <motion.div style={{ position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%)', zIndex: 10 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton aria-label="Previous" icon={<FaChevronLeft size={24} />} size="lg" borderRadius="full" bg="white" boxShadow="lg" color="gray.700" _hover={{ bg: "gray.50" }} onClick={() => paginate(-1)} display={{ base: "none", md: "flex" }} />
          </motion.div>
          <motion.div style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', zIndex: 10 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton aria-label="Next" icon={<FaChevronRight size={24} />} size="lg" borderRadius="full" bg="white" boxShadow="lg" color="gray.700" _hover={{ bg: "gray.50" }} onClick={() => paginate(1)} display={{ base: "none", md: "flex" }} />
          </motion.div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={currentPage} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }}>
              <Flex gap={6}>
                {currentProducts.map((product, index) => (
                  <Box key={product.id} flex={`0 0 calc(${100 / itemsPerPage}% - ${(itemsPerPage - 1) * 24 / itemsPerPage}px)`}>
                    <ProductCard product={product} index={index} />
                  </Box>
                ))}
              </Flex>
            </motion.div>
          </AnimatePresence>

          {/* Mobile Navigation */}
          <Flex justify="center" gap={4} mt={8} display={{ base: "flex", md: "none" }}>
            <IconButton aria-label="Previous" icon={<FaChevronLeft size={20} />} borderRadius="full" bg="white" boxShadow="md" onClick={() => paginate(-1)} />
            <IconButton aria-label="Next" icon={<FaChevronRight size={20} />} borderRadius="full" bg="white" boxShadow="md" onClick={() => paginate(1)} />
          </Flex>

          {/* Pagination Dots */}
          <Flex justify="center" gap={2} mt={8}>
            {[...Array(totalPages)].map((_, i) => (
              <motion.button
                key={i}
                onClick={() => { setDirection(i > currentPage ? 1 : -1); setCurrentPage(i); }}
                style={{ width: i === currentPage ? 32 : 12, height: 12, borderRadius: 999, border: 'none', background: i === currentPage ? '#3182ce' : '#cbd5e0', cursor: 'pointer' }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                animate={{ width: i === currentPage ? 32 : 12 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </Flex>
        </Box>

        {/* View All Button */}
        <Flex justify="center" mt={12}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Box as="button" px={8} py={4} bg="gray.900" color="white" borderRadius="full" fontWeight="bold" fontSize="md" letterSpacing="wide" boxShadow="0 10px 30px rgba(0,0,0,0.2)" transition="all 0.3s" _hover={{ bg: "#3182ce", boxShadow: "0 15px 40px rgba(49, 130, 206, 0.3)" }}>
              View All Products
            </Box>
          </motion.div>
        </Flex>
      </Box>
    </Box>
  );
});

export default ProductCarousel;
