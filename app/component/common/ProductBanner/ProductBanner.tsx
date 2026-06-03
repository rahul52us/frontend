import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Image,
  VStack,
  HStack,
  Badge,
  Icon,
  Flex,
  Circle,
  Progress,
  Button,
  useColorModeValue,
  Select,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Checkbox,
  CheckboxGroup,
  Input,
  InputGroup,
  InputLeftElement,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tag,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import {
  FaGift,
  FaHeart,
  FaStar,
  FaRupeeSign,
  FaFire,
  FaStore,
  FaSearch,
  FaFilter,
  FaTags,
  FaSortAmountDown,
  FaSortAmountUp,
  FaTimes,
} from 'react-icons/fa';
import { FiTrendingUp, FiClock } from 'react-icons/fi';

// ---------- Mock Product Data ----------
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  sales: number;
  rating: number;
  category: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

const allProducts: Product[] = [
  { id: 1, name: 'Premium Cotton T-Shirt', price: 599, originalPrice: 1199, discount: 50, image: 'https://picsum.photos/id/20/300/200', sales: 1240, rating: 4.8, category: 'Men' },
  { id: 2, name: 'Slim Fit Jeans', price: 999, originalPrice: 1999, discount: 50, image: 'https://picsum.photos/id/21/300/200', sales: 890, rating: 4.6, category: 'Men' },
  { id: 3, name: 'Running Shoes', price: 1499, originalPrice: 2999, discount: 50, image: 'https://picsum.photos/id/22/300/200', sales: 2100, rating: 4.7, category: 'Sports' },
  { id: 4, name: 'Smart Watch', price: 2499, originalPrice: 4999, discount: 50, image: 'https://picsum.photos/id/23/300/200', sales: 560, rating: 4.9, category: 'Electronics' },
  { id: 5, name: 'Wooden Toy Set', price: 449, originalPrice: 899, discount: 50, image: 'https://picsum.photos/id/24/300/200', sales: 3200, rating: 4.5, category: 'Kids' },
  { id: 6, name: 'Leather Wallet', price: 599, originalPrice: 1199, discount: 50, image: 'https://picsum.photos/id/25/300/200', sales: 3400, rating: 4.7, category: 'Accessories' },
  { id: 7, name: 'Silk Saree', price: 3999, originalPrice: 7999, discount: 50, image: 'https://picsum.photos/id/26/300/200', sales: 780, rating: 4.9, category: 'Women' },
  { id: 8, name: 'Wireless Earbuds', price: 1299, originalPrice: 2599, discount: 50, image: 'https://picsum.photos/id/27/300/200', sales: 5600, rating: 4.4, category: 'Electronics' },
  { id: 9, name: 'Yoga Mat', price: 799, originalPrice: 1599, discount: 50, image: 'https://picsum.photos/id/28/300/200', sales: 8900, rating: 4.6, category: 'Sports' },
  { id: 10, name: 'Handcrafted Pot', price: 299, originalPrice: 599, discount: 50, image: 'https://picsum.photos/id/29/300/200', sales: 2100, rating: 4.5, category: 'Home' },
  { id: 11, name: 'Designer Handbag', price: 1999, originalPrice: 3999, discount: 50, image: 'https://picsum.photos/id/30/300/200', sales: 2300, rating: 4.8, category: 'Women' },
  { id: 12, name: 'Gaming Mouse', price: 999, originalPrice: 1999, discount: 50, image: 'https://picsum.photos/id/31/300/200', sales: 4100, rating: 4.6, category: 'Electronics' },
];

const categories = ['All', 'Men', 'Women', 'Kids', 'Electronics', 'Sports', 'Home', 'Accessories'];

const ProductBanner = () => {
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts);
  const [loading, setLoading] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [loaderMessage, setLoaderMessage] = useState("Finding amazing deals...");
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState('popularity');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const sectionBg = useColorModeValue("gray.50", "gray.900");
  const bannerBg = useColorModeValue("blue.600", "blue.800");

  const startLoader = () => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setLoaderProgress(0);
    setLoaderMessage("Finding amazing deals...");
    setLoading(true);

    const LOADER_DURATION_MS = 1800;
    const stepPercent = 100 / (LOADER_DURATION_MS / 40);
    progressInterval.current = setInterval(() => {
      setLoaderProgress((prev) => {
        const next = Math.min(prev + stepPercent, 100);
        if (next >= 100 && progressInterval.current) {
          clearInterval(progressInterval.current);
        }
        if (next < 30) setLoaderMessage("Finding amazing deals...");
        else if (next < 70) setLoaderMessage("Curating best picks ✨");
        else setLoaderMessage("Almost ready! 🎁");
        return next;
      });
    }, 40);

    timeoutRef.current = setTimeout(() => {
      setLoading(false);
      setLoaderProgress(100);
      if (progressInterval.current) clearInterval(progressInterval.current);
      timeoutRef.current = null;
    }, LOADER_DURATION_MS);
  };

  // Apply filters and sorting
  const applyFilters = () => {
    startLoader();
    setTimeout(() => {
      let result = [...products];

      // Category filter
      if (selectedCategory !== 'All') {
        result = result.filter(p => p.category === selectedCategory);
      }

      // Price range filter
      result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

      // Search query
      if (searchQuery) {
        result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      // Sorting
      switch (sortBy) {
        case 'price_low':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_high':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'sales':
          result.sort((a, b) => b.sales - a.sales);
          break;
        default: // popularity
          result.sort((a, b) => b.sales - a.sales);
      }

      setFilteredProducts(result);
    }, 200);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedCategory, priceRange, sortBy, searchQuery, products]);

  useEffect(() => {
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const clearFilters = () => {
    setSelectedCategory('All');
    setPriceRange([0, 5000]);
    setSortBy('popularity');
    setSearchQuery('');
  };

  return (
    <Box py={{ base: 6, md: 10 }} bg={sectionBg} minH="100vh">
      <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
        {/* Hero Banner - 50% Discount */}
        <Box
          position="relative"
          borderRadius="3xl"
          overflow="hidden"
          bgGradient="linear(135deg, #1e3a8a 0%, #3b82f6 100%)"
          mb={10}
          p={{ base: 6, md: 10 }}
          boxShadow="2xl"
        >
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align="center"
            gap={6}
          >
            <VStack align={{ base: 'center', md: 'start' }} spacing={3} flex={1}>
              <Badge
                bg="whiteAlpha.300"
                color="white"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="sm"
              >
                🔥 MEGA SALE
              </Badge>
              <Heading color="white" fontSize={{ base: '3xl', md: '5xl' }} fontWeight="900">
                50% OFF
              </Heading>
              <Text color="whiteAlpha.900" fontSize="lg" textAlign={{ base: 'center', md: 'left' }}>
                On all products across categories
              </Text>
              <HStack spacing={4}>
                <Button
                  bg="white"
                  color="blue.600"
                  size="lg"
                  borderRadius="full"
                  px={8}
                  _hover={{ transform: 'scale(1.05)' }}
                  rightIcon={<FiTrendingUp />}
                >
                  Shop Now
                </Button>
                <Button
                  variant="outline"
                  borderColor="white"
                  color="white"
                  size="lg"
                  borderRadius="full"
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  Learn More
                </Button>
              </HStack>
            </VStack>
            <Box position="relative" boxSize={{ base: '150px', md: '200px' }}>
              <Circle size="100%" bg="whiteAlpha.200" backdropFilter="blur(10px)">
                <Icon as={FaGift} boxSize="80px" color="white" />
              </Circle>
            </Box>
          </Flex>
        </Box>

        {/* Header with Stats */}
        <VStack spacing={2} mb={6} align="start">
          <HStack spacing={2}>
            <Circle size="40px" bg="blue.100" _dark={{ bg: "blue.900" }}>
              <Icon as={FaStore} color="blue.600" boxSize={5} />
            </Circle>
            <Badge colorScheme="blue" fontSize="xs" px={3} py={1.5} borderRadius="full">
              LIMITED TIME DEAL
            </Badge>
          </HStack>
          <Heading
            size={{ base: "xl", md: "2xl" }}
            fontWeight="900"
            bgGradient="linear(135deg, #1e3a8a 0%, #3b82f6 100%)"
            bgClip="text"
          >
            Flash Sale: 50% Off Everything!
          </Heading>
          <Text color="gray.600" _dark={{ color: "gray.400" }} maxW="2xl">
            Hurry up! Limited stock available. Grab your favorites before they're gone.
          </Text>
        </VStack>

        {/* Filters Bar - Desktop */}
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          gap={4}
          mb={6}
          p={4}
          bg={cardBg}
          borderRadius="2xl"
          border="1px solid"
          borderColor={borderColor}
          boxShadow="sm"
        >
          <InputGroup maxW={{ base: '100%', lg: '300px' }}>
            <InputLeftElement pointerEvents="none">
              <Icon as={FaSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              borderRadius="full"
            />
          </InputGroup>

          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            maxW={{ base: '100%', lg: '200px' }}
            borderRadius="full"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            maxW={{ base: '100%', lg: '220px' }}
            borderRadius="full"
          >
            <option value="popularity">Popularity</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="sales">Best Selling</option>
          </Select>

          <Button
            variant="outline"
            leftIcon={<Icon as={FaFilter} />}
            onClick={() => setShowFilters(!showFilters)}
            borderRadius="full"
          >
            Price Filter
          </Button>

          {(selectedCategory !== 'All' || priceRange[0] > 0 || priceRange[1] < 5000 || searchQuery) && (
            <Button
              variant="ghost"
              leftIcon={<Icon as={FaTimes} />}
              onClick={clearFilters}
              borderRadius="full"
              colorScheme="red"
            >
              Clear Filters
            </Button>
          )}
        </Flex>

        {/* Price Range Slider - Collapsible */}
        {showFilters && (
          <Box
            p={4}
            mb={6}
            bg={cardBg}
            borderRadius="2xl"
            border="1px solid"
            borderColor={borderColor}
          >
            <Text fontWeight="700" mb={3}>Price Range (₹)</Text>
            <RangeSlider
              aria-label={['min', 'max']}
              min={0}
              max={5000}
              step={100}
              value={priceRange}
              onChange={(val) => setPriceRange(val)}
              colorScheme="blue"
            >
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
              <RangeSliderThumb index={1} />
            </RangeSlider>
            <Flex justify="space-between" mt={2}>
              <Text>₹{priceRange[0]}</Text>
              <Text>₹{priceRange[1]}</Text>
            </Flex>
          </Box>
        )}

        {/* Loader or Product Grid */}
        {loading ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            minH="400px"
            gap={6}
            bg="whiteAlpha.700"
            _dark={{ bg: "blackAlpha.500" }}
            borderRadius="3xl"
            backdropFilter="blur(8px)"
            p={8}
          >
            <Box position="relative" boxSize="80px">
              <Icon
                as={FaGift}
                boxSize="80px"
                color="blue.400"
                animation="pulse 0.8s infinite"
                sx={{
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)', opacity: 1 },
                    '50%': { transform: 'scale(1.1)', opacity: 0.8 },
                    '100%': { transform: 'scale(1)', opacity: 1 },
                  },
                }}
              />
              <Icon
                as={FaHeart}
                position="absolute"
                top="-10px"
                right="-10px"
                boxSize="24px"
                color="red.500"
                animation="bounce 0.6s infinite"
                sx={{
                  '@keyframes bounce': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                  },
                }}
              />
            </Box>
            <Text fontWeight="800" fontSize="lg" color="blue.600">
              {loaderMessage}
            </Text>
            <Progress
              value={loaderProgress}
              size="sm"
              width="250px"
              colorScheme="blue"
              borderRadius="full"
              hasStripe
              isAnimated
            />
            <Text fontSize="sm" color="gray.500">Finding the best products for you...</Text>
          </Flex>
        ) : (
          <>
            <Flex justify="space-between" align="center" mb={4}>
              <Text fontWeight="600">
                Showing {filteredProducts.length} products
              </Text>
            </Flex>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
              {filteredProducts.map((product) => (
                <Box
                  key={product.id}
                  bg={cardBg}
                  borderRadius="2xl"
                  overflow="hidden"
                  border="1px solid"
                  borderColor={borderColor}
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-6px)", boxShadow: "xl" }}
                >
                  <Box position="relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      h="180px"
                      w="100%"
                      objectFit="cover"
                    />
                    <Badge
                      position="absolute"
                      top={3}
                      left={3}
                      bg="red.500"
                      color="white"
                      fontSize="xs"
                      px={2}
                      py={1}
                      borderRadius="full"
                    >
                      -{product.discount}%
                    </Badge>
                    <Badge
                      position="absolute"
                      top={3}
                      right={3}
                      bg="whiteAlpha.800"
                      backdropFilter="blur(4px)"
                      color="blue.700"
                      fontSize="xs"
                      px={2}
                      py={1}
                      borderRadius="full"
                    >
                      <HStack spacing={1}>
                        <Icon as={FaFire} color="orange.500" boxSize={3} />
                        <Text>Best Seller</Text>
                      </HStack>
                    </Badge>
                  </Box>

                  <VStack p={4} align="stretch" spacing={2}>
                    <Text fontWeight="800" noOfLines={1}>
                      {product.name}
                    </Text>
                    <HStack justify="space-between">
                      <HStack spacing={1}>
                        <Icon as={FaStar} color="yellow.400" boxSize={3.5} />
                        <Text fontSize="sm" fontWeight="600">
                          {product.rating}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          ({product.sales}+ sold)
                        </Text>
                      </HStack>
                      <Tag size="sm" colorScheme="green" borderRadius="full">
                        {product.category}
                      </Tag>
                    </HStack>
                    <HStack spacing={2}>
                      <Text fontWeight="700" fontSize="lg" color="blue.600">
                        ₹{product.price.toLocaleString()}
                      </Text>
                      <Text fontSize="sm" color="gray.500" textDecoration="line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </Text>
                    </HStack>
                    <Button
                      size="sm"
                      variant="solid"
                      colorScheme="blue"
                      borderRadius="full"
                      mt={2}
                      rightIcon={<FiTrendingUp />}
                      _hover={{ transform: "translateX(2px)" }}
                    >
                      Shop Now
                    </Button>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
            {filteredProducts.length === 0 && (
              <Flex justify="center" p={10}>
                <VStack>
                  <Icon as={FaStore} boxSize={12} color="gray.300" />
                  <Text fontSize="lg" fontWeight="600">No products found</Text>
                  <Text color="gray.500">Try adjusting your filters</Text>
                  <Button onClick={clearFilters} colorScheme="blue" borderRadius="full">
                    Clear Filters
                  </Button>
                </VStack>
              </Flex>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default ProductBanner;