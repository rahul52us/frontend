import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
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
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
  Tag,
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
  FaTimes,
} from 'react-icons/fa';
import { FiTrendingUp } from 'react-icons/fi';
import { observer } from 'mobx-react-lite';
import ProductCard from '../../../(main)/products/components/ProductCard/ProductCard'; 
import { shopStore } from '../../../store/shopStore/shopStore';
import categoryStore from '../../../store/categoryStore/categoryStore';

interface Category {
  _id: string;
  name: string;
}

const ProductBanner = observer(() => {
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const sectionBg = useColorModeValue('gray.50', 'gray.900');

  // State for dynamic data
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [loaderMessage, setLoaderMessage] = useState('Finding amazing deals...');

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minProductPrice, setMinProductPrice] = useState(0);
  const [maxProductPrice, setMaxProductPrice] = useState(10000);
  const [sortBy, setSortBy] = useState('popularity');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Loader animation (same as original)
  const startLoader = useCallback(() => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setLoaderProgress(0);
    setLoaderMessage('Finding amazing deals...');
    setLoading(true);

    const LOADER_DURATION_MS = 1800;
    const stepPercent = 100 / (LOADER_DURATION_MS / 40);
    progressInterval.current = setInterval(() => {
      setLoaderProgress((prev) => {
        const next = Math.min(prev + stepPercent, 100);
        if (next >= 100 && progressInterval.current) {
          clearInterval(progressInterval.current);
        }
        if (next < 30) setLoaderMessage('Finding amazing deals...');
        else if (next < 70) setLoaderMessage('Curating best picks ✨');
        else setLoaderMessage('Almost ready! 🎁');
        return next;
      });
    }, 40);

    timeoutRef.current = setTimeout(() => {
      setLoading(false);
      setLoaderProgress(100);
      if (progressInterval.current) clearInterval(progressInterval.current);
      timeoutRef.current = null;
    }, LOADER_DURATION_MS);
  }, []);

  const stopLoader = useCallback(() => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setLoading(false);
    setLoaderProgress(100);
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryStore.getAllCategories({});
        if (response?.status === 'success' && Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.warn('Could not fetch categories, using empty list');
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: 'Error',
          description: 'Failed to load categories.',
          status: 'error',
          duration: 3000,
        });
      }
    };
    fetchCategories();
  }, [toast]);

  // Fetch products from backend
  const fetchProducts = useCallback(async () => {
    startLoader();
    try {
      const payload: any = {
        page: 1,
        limit: 100, // fetch a reasonable amount for client-side filtering
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchQuery && { search: searchQuery }),
        // Note: price range and sorting can be handled client-side for better UX,
        // but you can also send them to backend if supported.
      };
      const response = await shopStore.getAllProducts(payload, true);
      let productList: any[] = [];
      if (response?.status === 'success') {
        if (Array.isArray(response.data)) productList = response.data;
        else if (response.data?.products) productList = response.data.products;
      } else if (Array.isArray(response?.data)) productList = response.data;
      else if (Array.isArray(response)) productList = response;
      if (!Array.isArray(productList)) productList = [];

      // Calculate min/max price from fetched products
      if (productList.length) {
        const prices = productList.map(p => p.price).filter(Boolean);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        setMinProductPrice(min);
        setMaxProductPrice(max);
        setPriceRange([min, max]);
      }
      setProducts(productList);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products.',
        status: 'error',
        duration: 3000,
      });
      setProducts([]);
    } finally {
      stopLoader();
    }
  }, [selectedCategory, searchQuery, startLoader, stopLoader, toast]);

  // Fetch products when category or search changes (debounced)
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(handler);
  }, [fetchProducts, selectedCategory, searchQuery]);

  // Apply client-side filtering and sorting
  const applyFilters = useCallback(() => {
    if (!products.length) {
      setFilteredProducts([]);
      return;
    }
    let result = [...products];

    // Price range filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sorting
    switch (sortBy) {
      case 'price_low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'sales':
        result.sort((a, b) => (b.sales || 0) - (a.sales || 0));
        break;
      default: // popularity (by sales)
        result.sort((a, b) => (b.sales || 0) - (a.sales || 0));
    }

    setFilteredProducts(result);
  }, [products, priceRange, sortBy]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters, products, priceRange, sortBy]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange([minProductPrice, maxProductPrice]);
    setSortBy('popularity');
    setSearchQuery('');
  };

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Build category options list
  const categoryOptions = [
    { _id: 'all', name: 'All Categories' },
    ...categories,
  ];

  // Helper to format currency
  const formatPrice = (price: number) => `₹${price.toLocaleString()}`;

  return (
    <Box py={{ base: 6, md: 10 }} bg={sectionBg} minH="100vh">
      <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
        {/* Hero Banner - 50% Discount (static or dynamic based on actual sale) */}
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
          wrap="wrap"
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
            maxW={{ base: '100%', lg: '220px' }}
            borderRadius="full"
          >
            {categoryOptions.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
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

          {(selectedCategory !== 'all' ||
            priceRange[0] > minProductPrice ||
            priceRange[1] < maxProductPrice ||
            searchQuery) && (
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
            <Text fontWeight="700" mb={3}>Price Range ({formatPrice(minProductPrice)} – {formatPrice(maxProductPrice)})</Text>
            <RangeSlider
              aria-label={['min', 'max']}
              min={minProductPrice}
              max={maxProductPrice}
              step={100}
              value={priceRange}
              onChange={(val) => setPriceRange(val as [number, number])}
              colorScheme="blue"
            >
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
              <RangeSliderThumb index={1} />
            </RangeSlider>
            <Flex justify="space-between" mt={2}>
              <Text>{formatPrice(priceRange[0])}</Text>
              <Text>{formatPrice(priceRange[1])}</Text>
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
                <ProductCard key={product._id || product.id} product={product} />
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
});

export default ProductBanner;
