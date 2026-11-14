'use client';

import {
  Badge,
  Box,
  Button,
  Collapse,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Select,
  SimpleGrid,
  Skeleton,
  Text,
  useColorModeValue,
  useToast,
  VStack,
  Wrap,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  // FiClose,
  FiSearch,
  FiShoppingBag,
  FiSliders,
  FiZap,
} from 'react-icons/fi';
import ProductCard from '../../../(main)/products/components/ProductCard/ProductCard';
import categoryStore from '../../../store/categoryStore/categoryStore';
import { shopStore } from '../../../store/shopStore/shopStore';
import { AiFillCloseCircle } from 'react-icons/ai';

interface Category {
  _id: string;
  name: string;
}

const ProductBanner = observer(() => {
  const toast = useToast();

  // Hoisted Theme Tokens
  const sectionBg = useColorModeValue('#F8FAFC', 'gray.950');
  const cardBg = useColorModeValue('white', 'gray.800');
  const subtleBg = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const titleColor = useColorModeValue('gray.900', 'white');
  const mutedText = useColorModeValue('gray.500', 'gray.400');

  // Dynamic Data State
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minProductPrice, setMinProductPrice] = useState(0);
  const [maxProductPrice, setMaxProductPrice] = useState(10000);
  const [sortBy, setSortBy] = useState('popularity');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryStore.getAllCategories({});
        if (response?.status === 'success' && Array.isArray(response.data)) {
          setCategories(response.data);
        } else if (Array.isArray(categoryStore.categories)) {
          setCategories(categoryStore.categories);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products from Backend
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const payload: any = {
        page: 1,
        limit: 100,
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchQuery.trim() && { search: searchQuery.trim() }),
      };

      const response = await shopStore.getAllProducts(payload, true);
      let productList: any[] = [];

      if (response?.status === 'success') {
        if (Array.isArray(response.data)) productList = response.data;
        else if (response.data?.products) productList = response.data.products;
      } else if (Array.isArray(response?.data?.products)) {
        productList = response.data.products;
      } else if (Array.isArray(response?.data)) {
        productList = response.data;
      } else if (Array.isArray(response)) {
        productList = response;
      }

      if (!Array.isArray(productList)) productList = [];

      if (productList.length > 0) {
        const prices = productList
          .map((p) => Number(p.price ?? p.sellingPrice ?? 0))
          .filter((val) => Number.isFinite(val) && val >= 0);

        if (prices.length > 0) {
          const min = Math.floor(Math.min(...prices));
          const max = Math.ceil(Math.max(...prices));
          const safeMax = max > min ? max : min + 1000;
          setMinProductPrice(min);
          setMaxProductPrice(safeMax);
          setPriceRange([min, safeMax]);
        }
      }

      setProducts(productList);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Unable to load products',
        description: 'Please check your connection and try again.',
        status: 'error',
        duration: 3000,
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, toast]);

  // Debounced Fetch on Category / Search Change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  // Client-Side Filtering & Sorting
  const filteredProducts = useMemo(() => {
    if (!products.length) return [];

    const result = products.filter((p) => {
      const itemPrice = Number(p.price ?? p.sellingPrice ?? 0);
      return itemPrice >= priceRange[0] && itemPrice <= priceRange[1];
    });

    switch (sortBy) {
      case 'price_low':
        result.sort(
          (a, b) =>
            Number(a.price ?? a.sellingPrice ?? 0) -
            Number(b.price ?? b.sellingPrice ?? 0)
        );
        break;
      case 'price_high':
        result.sort(
          (a, b) =>
            Number(b.price ?? b.sellingPrice ?? 0) -
            Number(a.price ?? a.sellingPrice ?? 0)
        );
        break;
      case 'rating':
        result.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
        break;
      case 'sales':
      default:
        result.sort((a, b) => (Number(b.sales) || 0) - (Number(a.sales) || 0));
        break;
    }

    return result;
  }, [products, priceRange, sortBy]);

  const isPriceFiltered =
    priceRange[0] > minProductPrice || priceRange[1] < maxProductPrice;

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    isPriceFiltered ||
    Boolean(searchQuery.trim()) ||
    sortBy !== 'popularity';

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange([minProductPrice, maxProductPrice]);
    setSortBy('popularity');
    setSearchQuery('');
  };

  const categoryOptions = useMemo(
    () => [{ _id: 'all', name: 'All Items' }, ...categories],
    [categories]
  );

  const formatPrice = (price: number) =>
    `₹${Math.round(price).toLocaleString('en-IN')}`;

  return (
    <Box
      as="section"
      py={{ base: 5, md: 9 }}
      bg={sectionBg}
      borderBottom="1px solid"
      borderColor={borderColor}
    >
      <Container maxW="8xl" px={{ base: 3, md: 8 }}>
        {/* 1. Compact Flash Sale Header Banner */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'flex-start', md: 'flex-end' }}
          mb={{ base: 3.5, md: 5 }}
          gap={2}
        >
          <Box>
            <HStack spacing={2} mb={1}>
              <Badge
                bgGradient="linear(to-r, orange.500, red.500)"
                color="white"
                fontSize="10px"
                fontWeight="800"
                px={2.5}
                py={0.5}
                borderRadius="full"
                display="inline-flex"
                alignItems="center"
                gap={1}
              >
                <Icon as={FiZap} boxSize={2.5} />
                FLASH DEALS
              </Badge>
              <Text fontSize="xs" fontWeight="600" color="orange.600">
                Up to 50% Off Local Favorites
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
              Explore All Deals & Offers
            </Heading>
          </Box>

          <Text fontSize="xs" fontWeight="600" color={mutedText}>
            {loading
              ? 'Loading catalog...'
              : `Showing ${filteredProducts.length} ${
                  filteredProducts.length === 1 ? 'product' : 'products'
                }`}
          </Text>
        </Flex>

        {/* 2. Horizontal Swipeable Category Chips (Replaces Clunky Category Select) */}
        <Flex
          gap={2}
          overflowX="auto"
          pb={2.5}
          mb={2}
          sx={{
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {categoryOptions.map((cat) => {
            const isSelected = selectedCategory === cat._id;
            return (
              <Button
                key={cat._id}
                size="xs"
                h={{ base: '30px', md: '34px' }}
                px={3.5}
                rounded="full"
                flexShrink={0}
                fontSize="xs"
                fontWeight="700"
                bg={isSelected ? 'blue.600' : cardBg}
                color={isSelected ? 'white' : titleColor}
                border="1px solid"
                borderColor={isSelected ? 'blue.600' : borderColor}
                boxShadow="2xs"
                _hover={{
                  bg: isSelected ? 'blue.700' : subtleBg,
                  borderColor: isSelected ? 'blue.700' : 'blue.200',
                }}
                onClick={() => setSelectedCategory(cat._id)}
              >
                {cat.name}
              </Button>
            );
          })}
        </Flex>

        {/* 3. Compact Search, Sort & Price Filter Toolbar */}
        <Box
          bg={cardBg}
          p={{ base: 2.5, md: 3 }}
          rounded="2xl"
          border="1px solid"
          borderColor={borderColor}
          boxShadow="2xs"
          mb={4}
        >
          <Flex
            direction={{ base: 'column', sm: 'row' }}
            gap={2.5}
            align="center"
            justify="space-between"
          >
            {/* Search Input */}
            <InputGroup size="sm" flex="1" w="full">
              <InputLeftElement pointerEvents="none" h="36px">
                <Icon as={FiSearch} color="gray.400" boxSize={3.5} />
              </InputLeftElement>
              <Input
                placeholder="Search deals, products, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                h="36px"
                rounded="xl"
                bg={subtleBg}
                border="1px solid"
                borderColor={borderColor}
                fontSize="xs"
                _focus={{
                  bg: cardBg,
                  borderColor: 'blue.500',
                  boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.12)',
                }}
              />
              {searchQuery && (
                <InputRightElement h="36px">
                  <IconButton
                    aria-label="Clear search"
                    icon={<AiFillCloseCircle size={11} />}
                    size="xs"
                    variant="ghost"
                    rounded="full"
                    onClick={() => setSearchQuery('')}
                  />
                </InputRightElement>
              )}
            </InputGroup>

            {/* Right Controls: Sort Dropdown + Price Filter Button + Reset */}
            <HStack spacing={2} w={{ base: 'full', sm: 'auto' }}>
              <Select
                size="sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                h="36px"
                rounded="xl"
                bg={subtleBg}
                borderColor={borderColor}
                fontSize="xs"
                fontWeight="600"
                flex={{ base: 1, sm: 'initial' }}
                w={{ sm: '165px' }}
              >
                <option value="popularity">Sort: Popular</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="sales">Best Selling</option>
              </Select>

              <Button
                size="sm"
                h="36px"
                px={3.5}
                rounded="xl"
                variant={showFilters || isPriceFiltered ? 'solid' : 'outline'}
                colorScheme={showFilters || isPriceFiltered ? 'blue' : 'gray'}
                borderColor={borderColor}
                leftIcon={<Icon as={FiSliders} boxSize={3.5} />}
                fontSize="xs"
                fontWeight="700"
                flexShrink={0}
                onClick={() => setShowFilters((prev) => !prev)}
              >
                Price
                {isPriceFiltered ? ' •' : ''}
              </Button>

              {hasActiveFilters && (
                <IconButton
                  aria-label="Reset all filters"
                  icon={<AiFillCloseCircle size={14} />}
                  size="sm"
                  h="36px"
                  w="36px"
                  rounded="xl"
                  colorScheme="red"
                  variant="subtle"
                  onClick={clearFilters}
                />
              )}
            </HStack>
          </Flex>

          {/* Collapsible Price Range & Quick Budget Chips */}
          <Collapse in={showFilters} animateOpacity>
            <Box
              pt={3.5}
              mt={3}
              borderTop="1px solid"
              borderColor={borderColor}
            >
              <Flex
                direction={{ base: 'column', md: 'row' }}
                justify="space-between"
                align={{ base: 'stretch', md: 'center' }}
                gap={4}
              >
                <Box flex="1">
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="xs" fontWeight="700" color={titleColor}>
                      Price Range:{' '}
                      <Text as="span" color="blue.600">
                        {formatPrice(priceRange[0])} – {formatPrice(priceRange[1])}
                      </Text>
                    </Text>
                    {isPriceFiltered && (
                      <Button
                        size="xs"
                        variant="link"
                        colorScheme="blue"
                        onClick={() =>
                          setPriceRange([minProductPrice, maxProductPrice])
                        }
                      >
                        Reset Price
                      </Button>
                    )}
                  </HStack>

                  {maxProductPrice > minProductPrice && (
                    <Box px={2}>
                      <RangeSlider
                        aria-label={['Minimum price', 'Maximum price']}
                        min={minProductPrice}
                        max={maxProductPrice}
                        step={Math.max(
                          10,
                          Math.round((maxProductPrice - minProductPrice) / 50)
                        )}
                        value={priceRange}
                        onChange={(val) =>
                          setPriceRange(val as [number, number])
                        }
                        colorScheme="blue"
                      >
                        <RangeSliderTrack h="5px" rounded="full">
                          <RangeSliderFilledTrack />
                        </RangeSliderTrack>
                        <RangeSliderThumb
                          index={0}
                          boxSize={4}
                          border="2px solid"
                          borderColor="blue.600"
                        />
                        <RangeSliderThumb
                          index={1}
                          boxSize={4}
                          border="2px solid"
                          borderColor="blue.600"
                        />
                      </RangeSlider>
                    </Box>
                  )}
                </Box>

                {/* Quick Budget Tap Pills */}
                <Wrap spacing={1.5} flexShrink={0}>
                  {[299, 499, 999, 1999]
                    .filter((cap) => cap > minProductPrice && cap <= maxProductPrice)
                    .map((cap) => {
                      const isActive =
                        priceRange[0] === minProductPrice &&
                        priceRange[1] === cap;
                      return (
                        <Button
                          key={cap}
                          size="xs"
                          h="26px"
                          px={2.5}
                          rounded="full"
                          fontSize="11px"
                          variant={isActive ? 'solid' : 'outline'}
                          colorScheme={isActive ? 'blue' : 'gray'}
                          onClick={() =>
                            setPriceRange([minProductPrice, cap])
                          }
                        >
                          Under ₹{cap}
                        </Button>
                      );
                    })}
                </Wrap>
              </Flex>
            </Box>
          </Collapse>
        </Box>

        {/* 4. Product Grid (2 Columns on Mobile, 3 on Tablet, 4 on Desktop) */}
        {loading ? (
          <SimpleGrid
            columns={{ base: 2, sm: 2, md: 3, lg: 4 }}
            spacing={{ base: 2.5, sm: 3.5, md: 5 }}
          >
            {Array.from({ length: 8 }).map((_, idx) => (
              <Box
                key={idx}
                bg={cardBg}
                rounded="2xl"
                p={2.5}
                border="1px solid"
                borderColor={borderColor}
              >
                <Skeleton
                  h={{ base: '140px', sm: '165px', md: '190px' }}
                  rounded="xl"
                  mb={2.5}
                />
                <Skeleton h="10px" w="45%" mb={2} rounded="sm" />
                <Skeleton h="14px" w="85%" mb={1.5} rounded="sm" />
                <Skeleton h="14px" w="60%" mb={3} rounded="sm" />
                <Flex justify="space-between" align="center">
                  <Skeleton h="18px" w="40%" rounded="md" />
                  <Skeleton h="28px" w="56px" rounded="lg" />
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        ) : filteredProducts.length > 0 ? (
          <SimpleGrid
            columns={{ base: 2, sm: 2, md: 3, lg: 4 }}
            spacing={{ base: 2.5, sm: 3.5, md: 5 }}
          >
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product._id || product.id || index}
                product={product}
              />
            ))}
          </SimpleGrid>
        ) : (
          /* Clean Empty State */
          <VStack
            py={12}
            px={4}
            spacing={2.5}
            bg={cardBg}
            rounded="2xl"
            border="1px dashed"
            borderColor={borderColor}
            textAlign="center"
          >
            <Flex
              w="44px"
              h="44px"
              rounded="full"
              bg="blue.50"
              color="blue.600"
              align="center"
              justify="center"
            >
              <Icon as={FiShoppingBag} boxSize={5} />
            </Flex>
            <Text fontSize="md" fontWeight="700" color={titleColor}>
              No matching products found
            </Text>
            <Text fontSize="xs" color={mutedText} maxW="xs">
              Try adjusting your price slider or clearing your active search
              filters.
            </Text>
            <Button
              size="xs"
              h="32px"
              px={4}
              mt={1}
              colorScheme="blue"
              rounded="full"
              onClick={clearFilters}
            >
              Reset All Filters
            </Button>
          </VStack>
        )}
      </Container>
    </Box>
  );
});

export default ProductBanner;