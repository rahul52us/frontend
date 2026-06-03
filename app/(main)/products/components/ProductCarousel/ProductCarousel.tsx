import React, { useState, useEffect, useCallback } from 'react';
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

// ─── Types ──────────────────────────────────────────────────────────────
interface Product {
  id: number;
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

// ─── Mock Data ──────────────────────────────────────────────────────────
const products: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 199.99,
    originalPrice: 299.99,
    rating: 4.9,
    reviews: 2341,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    category: "Electronics",
    badge: "Best Seller",
    isNew: false,
  },
  {
    id: 2,
    name: "Minimalist Leather Watch",
    price: 149.50,
    originalPrice: 220.00,
    rating: 4.8,
    reviews: 1856,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    category: "Accessories",
    badge: "Top Rated",
    isNew: true,
  },
  {
    id: 3,
    name: "Smart Fitness Tracker Pro",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.7,
    reviews: 3102,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&h=500&fit=crop",
    category: "Fitness",
    badge: "Hot Deal",
    isNew: false,
  },
  {
    id: 4,
    name: "Designer Sunglasses",
    price: 245.00,
    originalPrice: 350.00,
    rating: 4.9,
    reviews: 987,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    category: "Fashion",
    badge: "Limited",
    isNew: true,
  },
  {
    id: 5,
    name: "Portable Bluetooth Speaker",
    price: 79.99,
    originalPrice: 119.99,
    rating: 4.6,
    reviews: 4521,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
    category: "Electronics",
    badge: "Best Seller",
    isNew: false,
  },
  {
    id: 6,
    name: "Organic Skincare Set",
    price: 65.00,
    originalPrice: 95.00,
    rating: 4.8,
    reviews: 1567,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop",
    category: "Beauty",
    badge: "Organic",
    isNew: true,
  },
  {
    id: 7,
    name: "Ergonomic Office Chair",
    price: 349.99,
    originalPrice: 499.99,
    rating: 4.7,
    reviews: 892,
    image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&h=500&fit=crop",
    category: "Furniture",
    badge: "Top Rated",
    isNew: false,
  },
  {
    id: 8,
    name: "Premium Coffee Maker",
    price: 129.99,
    originalPrice: 179.99,
    rating: 4.9,
    reviews: 2234,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop",
    category: "Kitchen",
    badge: "Best Seller",
    isNew: true,
  },
];

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
      {/* Animated Shopping Bag */}
      <Box position="relative" width="80px" height="80px">
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, -5, 5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ShoppingBagIcon />
        </motion.div>

        {/* Floating particles */}
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
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut",
            }}
          />
        ))}
      </Box>

      {/* Loading Text */}
      <Flex direction="column" align="center" gap={2}>
        <Text fontSize="xl" fontWeight="bold" color="gray.700" letterSpacing="wide">
          Loading Top Picks
        </Text>
        <Text fontSize="sm" color="gray.500">
          Curating the best for you...
        </Text>
      </Flex>

      {/* Progress Bar */}
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

// ─── Product Card Component ─────────────────────────────────────────────
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
        {/* Image Container */}
        <Box position="relative" overflow="hidden" paddingTop="100%" bg="gray.100">
          <motion.img
            src={product.image}
            alt={product.name}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.4 }}
          />

          {/* Badges */}
          <Flex position="absolute" top={3} left={3} gap={2} zIndex={2}>
            {product.isNew && (
              <Badge colorScheme="green" borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="bold">
                NEW
              </Badge>
            )}
            <Badge colorScheme="red" borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="bold">
              -{discount}%
            </Badge>
          </Flex>

          {/* Wishlist Button */}
          <motion.div
            style={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}
            whileTap={{ scale: 0.8 }}
          >
            <IconButton
              aria-label="Add to wishlist"
              icon={
                isLiked ? (
                  <FaHeart size={18} color="#e53e3e" />
                ) : (
                  <FaRegHeart size={18} color="white" />
                )
              }
              size="sm"
              borderRadius="full"
              bg="rgba(0,0,0,0.3)"
              _hover={{ bg: "rgba(0,0,0,0.5)" }}
              backdropFilter="blur(4px)"
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
            />
          </motion.div>

          {/* Quick Actions Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                }}
              >
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <IconButton
                    aria-label="Quick view"
                    icon={<FaEye size={20} />}
                    size="md"
                    borderRadius="full"
                    bg="white"
                    color="gray.800"
                    _hover={{ bg: "gray.100" }}
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <IconButton
                    aria-label="Add to cart"
                    icon={<FaShoppingCart size={20} />}
                    size="md"
                    borderRadius="full"
                    bg="#3182ce"
                    color="white"
                    _hover={{ bg: "#2c5282" }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* Content */}
        <Flex direction="column" p={4} gap={2} flex={1}>
          <Text fontSize="xs" color="gray.500" fontWeight="medium" textTransform="uppercase" letterSpacing="wider">
            {product.category}
          </Text>

          <Text fontSize="md" fontWeight="bold" color="gray.800" noOfLines={2} lineHeight="short">
            {product.name}
          </Text>

          {/* Rating */}
          <Flex align="center" gap={1}>
            <Flex>
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  size={14}
                  color={i < Math.floor(product.rating) ? "#ecc94b" : "#cbd5e0"}
                  style={{ marginRight: '1px' }}
                />
              ))}
            </Flex>
            <Text fontSize="sm" color="gray.600" fontWeight="medium">
              {product.rating}
            </Text>
            <Text fontSize="xs" color="gray.400">
              ({product.reviews.toLocaleString()})
            </Text>
          </Flex>

          {/* Price */}
          <Flex align="baseline" gap={2} mt="auto" pt={2}>
            <Text fontSize="xl" fontWeight="bold" color="#3182ce">
              ${product.price.toFixed(2)}
            </Text>
            <Text fontSize="sm" color="gray.400" textDecoration="line-through">
              ${product.originalPrice.toFixed(2)}
            </Text>
          </Flex>
        </Flex>
      </Box>
    </motion.div>
  );
};

// ─── Main Carousel Component ────────────────────────────────────────────
const ProductCarousel = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  // Responsive items per page
  const itemsPerPage = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4 }) || 4;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Simulate loading delay (2-3 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrentPage((prev) => {
      if (newDirection === 1) {
        return prev === totalPages - 1 ? 0 : prev + 1;
      }
      return prev === 0 ? totalPages - 1 : prev - 1;
    });
  }, [totalPages]);

  const currentProducts = products.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  // Auto-play
  useEffect(() => {
    if (isLoading) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(interval);
  }, [isLoading, paginate]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  if (isLoading) {
    return (
      <Box maxW="1400px" mx="auto" px={{ base: 4, md: 8 }} py={12}>
        <EcommerceLoader />
      </Box>
    );
  }

  return (
    <Box bg="gray.50" py={{ base: 12, md: 20 }} overflow="hidden">
      <Box maxW="1400px" mx="auto" px={{ base: 4, md: 8 }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Flex direction="column" align={{ base: "center", md: "flex-start" }} mb={10} gap={3}>
            <Badge colorScheme="blue" borderRadius="full" px={4} py={1} fontSize="sm" textTransform="uppercase" letterSpacing="widest">
              Curated For You
            </Badge>
            <Text
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="extrabold"
              color="gray.900"
              lineHeight="1.1"
              textAlign={{ base: "center", md: "left" }}
            >
              Top Rated{" "}
              <Text as="span" color="#3182ce" position="relative">
                Products
                <svg
                  style={{ position: 'absolute', bottom: '-8px', left: 0, width: '100%' }}
                  viewBox="0 0 200 12"
                  fill="none"
                >
                  <motion.path
                    d="M2 8C50 2 150 2 198 8"
                    stroke="#3182ce"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </svg>
              </Text>
            </Text>
            <Text fontSize="lg" color="gray.600" maxW="600px" textAlign={{ base: "center", md: "left" }}>
              Discover our community's favorite picks, rated and reviewed by thousands of happy customers.
            </Text>
          </Flex>
        </motion.div>

        {/* Carousel Container */}
        <Box position="relative">
          {/* Navigation Arrows */}
          <motion.div
            style={{ position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <IconButton
              aria-label="Previous"
              icon={<FaChevronLeft size={24} />}
              size="lg"
              borderRadius="full"
              bg="white"
              boxShadow="lg"
              color="gray.700"
              _hover={{ bg: "gray.50" }}
              onClick={() => paginate(-1)}
              display={{ base: "none", md: "flex" }}
            />
          </motion.div>

          <motion.div
            style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <IconButton
              aria-label="Next"
              icon={<FaChevronRight size={24} />}
              size="lg"
              borderRadius="full"
              bg="white"
              boxShadow="lg"
              color="gray.700"
              _hover={{ bg: "gray.50" }}
              onClick={() => paginate(1)}
              display={{ base: "none", md: "flex" }}
            />
          </motion.div>

          {/* Products Grid with Animation */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentPage}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
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
            <IconButton
              aria-label="Previous"
              icon={<FaChevronLeft size={20} />}
              borderRadius="full"
              bg="white"
              boxShadow="md"
              onClick={() => paginate(-1)}
            />
            <IconButton
              aria-label="Next"
              icon={<FaChevronRight size={20} />}
              borderRadius="full"
              bg="white"
              boxShadow="md"
              onClick={() => paginate(1)}
            />
          </Flex>

          {/* Pagination Dots */}
          <Flex justify="center" gap={2} mt={8}>
            {[...Array(totalPages)].map((_, i) => (
              <motion.button
                key={i}
                onClick={() => {
                  setDirection(i > currentPage ? 1 : -1);
                  setCurrentPage(i);
                }}
                style={{
                  width: i === currentPage ? 32 : 12,
                  height: 12,
                  borderRadius: 999,
                  border: 'none',
                  background: i === currentPage ? '#3182ce' : '#cbd5e0',
                  cursor: 'pointer',
                }}
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
            <Box
              as="button"
              px={8}
              py={4}
              bg="gray.900"
              color="white"
              borderRadius="full"
              fontWeight="bold"
              fontSize="md"
              letterSpacing="wide"
              boxShadow="0 10px 30px rgba(0,0,0,0.2)"
              transition="all 0.3s"
              _hover={{
                bg: "#3182ce",
                boxShadow: "0 15px 40px rgba(49, 130, 206, 0.3)",
              }}
            >
              View All Products
            </Box>
          </motion.div>
        </Flex>
      </Box>
    </Box>
  );
};

export default ProductCarousel;
