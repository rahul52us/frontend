import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiFilter, FiRefreshCcw, FiSearch, FiInbox } from "react-icons/fi";
import CommonHeading from "../../../../component/common/CommonHeading/CommonHeading";
import MainPagePagination from "../../../../component/config/component/pagination/MainPagePagination";
import stores from "../../../../store/stores";
import ShopSection from "../../../component/shopSection/ShopSection";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton/ProductCardSkeleton";

const MotionBox = motion(Box);
const PRODUCT_LIMIT = 12;

const getCategoryId = (category: any) => String(category?._id || category?.id || "");
const getCategoryName = (category: any) => String(category?.name || "").trim();
const getParentCategoryId = (category: any) => {
  const parent = category?.parent;
  if (!parent) return "";
  return typeof parent === "object" ? String(parent?._id || parent?.id || "") : String(parent);
};

const ProductsListSection = observer(() => {
  const {
    themeStore: { themeConfig },
    shopStore,
  } = stores;
  const isDarkMode = themeConfig.config.initialColorMode === "dark";
  const [products, setProducts] = useState<any[]>([]);
  const [filterCategories, setFilterCategories] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const headingColor = isDarkMode
    ? themeConfig.colors.dark.primary[500]
    : themeConfig.colors.light.primary[500];
  
  // High-end premium UI design tokens
  const pageBg = useColorModeValue("gray.50", "gray.950");
  const filterBg = useColorModeValue("white", "rgba(23, 25, 35, 0.75)");
  const filterBorder = useColorModeValue("gray.200", "gray.800");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const cardGridBg = useColorModeValue("transparent", "transparent");
  const filterShadow = useColorModeValue("sm", "xl");
  const inputFocusBorder = isDarkMode ? "primary.400" : "primary.500";

  const activeCategories = useMemo(
    () => filterCategories.filter((category: any) => category.isActive !== false),
    [filterCategories]
  );

  const rootCategories = useMemo(
    () => activeCategories.filter((category: any) => !getParentCategoryId(category)),
    [activeCategories]
  );

  const subCategories = useMemo(
    () =>
      selectedCategory
        ? activeCategories.filter(
            (category: any) => getParentCategoryId(category) === selectedCategory
          )
        : [],
    [activeCategories, selectedCategory]
  );

  const hasActiveFilters = Boolean(searchTerm || selectedCategory || selectedSubCategory);

  const fetchProducts = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const res = await shopStore.getAllProducts({
          page,
          limit: PRODUCT_LIMIT,
          search: searchTerm.trim(),
          category: selectedCategory,
          subCategory: selectedSubCategory,
        });
        const payload = res?.data || {};

        setProducts(payload.products || []);
        setTotalProducts(payload.total || 0);
        setTotalPages(payload.totalPages || 1);
        setCurrentPage(payload.currentPage || page);
      } catch {
        setProducts([]);
        setTotalProducts(0);
        setTotalPages(1);
        setCurrentPage(1);
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, selectedCategory, selectedSubCategory, shopStore]
  );

  useEffect(() => {
    const loadFilterCategories = async () => {
      try {
        const response = await axios.get("/category", { params: { isActive: true } });
        setFilterCategories(Array.isArray(response.data?.data) ? response.data.data : []);
      } catch {
        setFilterCategories([]);
      }
    };

    loadFilterCategories();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchProducts(1);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [fetchProducts]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory("");
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    if (value.trim()) {
      setSelectedCategory("");
      setSelectedSubCategory("");
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedSubCategory("");
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    const nextPage = Math.max(1, Number(selected) || 1);
    fetchProducts(nextPage);
    document.getElementById("all-products")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Box
      bg={pageBg}
      mx="auto"
      px={{ base: 4, sm: 6, md: 8, lg: 12, xl: 16 }}
      py={{ base: 8, md: 14 }}
      overflow="hidden"
      transition="background-color 0.3s ease"
    >
      {/* Filterable Product Section */}
      <MotionBox
        id="all-products"
        mb={{ base: 14, md: 24 }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "start", md: "end" }}
          gap={4}
          mb={{ base: 6, md: 8 }}
        >
          <CommonHeading
            heading="All Products"
            subheading="Filter and browse premium products curated just for you"
            color={headingColor}
            align="left"
          />
        </Flex>

        {/* Filter Bar with Subtle Glassmorphism Card */}
        <Box
          bg={filterBg}
          backdropFilter="blur(8px)"
          border="1px solid"
          borderColor={filterBorder}
          borderRadius="xl"
          p={{ base: 4, md: 5 }}
          mb={{ base: 6, md: 10 }}
          boxShadow={filterShadow}
        >
          <Flex gap={4} align={{ base: "stretch", lg: "center" }} direction={{ base: "column", lg: "row" }}>
            <InputGroup flex={{ base: "unset", lg: 1.5 }}>
              <InputLeftElement h="100%" pointerEvents="none" pl={1}>
                <Icon as={FiSearch} color={mutedText} boxSize={5} />
              </InputLeftElement>
              <Input
                value={searchTerm}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Search premium products..."
                size="lg"
                h="48px"
                pl="44px"
                fontSize="md"
                bg={useColorModeValue("gray.50", "gray.800")}
                border="1px solid"
                borderColor={useColorModeValue("gray.200", "gray.700")}
                _focus={{
                  borderColor: inputFocusBorder,
                  boxShadow: `0 0 0 1px ${isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.05)"}`,
                  bg: useColorModeValue("white", "gray.900"),
                }}
                borderRadius="lg"
                transition="all 0.2s ease"
              />
            </InputGroup>

            <Select
              value={selectedCategory}
              onChange={(event) => handleCategoryChange(event.target.value)}
              placeholder="All Categories"
              size="lg"
              h="48px"
              maxW={{ base: "100%", lg: "220px" }}
              bg={useColorModeValue("gray.50", "gray.800")}
              border="1px solid"
              borderColor={useColorModeValue("gray.200", "gray.700")}
              _focus={{ borderColor: inputFocusBorder }}
              borderRadius="lg"
              icon={<FiFilter />}
              cursor="pointer"
              fontSize="md"
            >
              {rootCategories.map((category: any) => (
                <option key={getCategoryId(category)} value={getCategoryId(category)}>
                  {getCategoryName(category)}
                </option>
              ))}
            </Select>

            <Select
              value={selectedSubCategory}
              onChange={(event) => setSelectedSubCategory(event.target.value)}
              placeholder="All Subcategories"
              size="lg"
              h="48px"
              maxW={{ base: "100%", lg: "240px" }}
              bg={useColorModeValue("gray.50", "gray.800")}
              border="1px solid"
              borderColor={useColorModeValue("gray.200", "gray.700")}
              _focus={{ borderColor: inputFocusBorder }}
              borderRadius="lg"
              isDisabled={!selectedCategory || subCategories.length === 0}
              cursor={!selectedCategory || subCategories.length === 0 ? "not-allowed" : "pointer"}
              fontSize="md"
            >
              {subCategories.map((category: any) => (
                <option key={getCategoryId(category)} value={getCategoryId(category)}>
                  {getCategoryName(category)}
                </option>
              ))}
            </Select>

            <Button
              leftIcon={<FiRefreshCcw />}
              onClick={resetFilters}
              variant="ghost"
              size="lg"
              h="48px"
              px={6}
              borderRadius="lg"
              isDisabled={!hasActiveFilters}
              colorScheme="red"
              _hover={{ bg: useColorModeValue("red.50", "rgba(229, 62, 62, 0.1)") }}
              transition="all 0.2s"
            >
              Reset
            </Button>
          </Flex>

          <HStack mt={4} pt={2} borderTop="1px dashed" borderColor={filterBorder} justify="space-between" color={mutedText} fontSize="sm" flexWrap="wrap" gap={2}>
            <Text fontWeight="medium">
              {loading ? (
                "Syncing catalog..."
              ) : (
                <>
                  Showing <Text as="span" color={useColorModeValue("gray.900", "white")} fontWeight="bold">{totalProducts}</Text> match{totalProducts === 1 ? "" : "es"}
                </>
              )}
            </Text>
            {hasActiveFilters && (
              <Text fontSize="xs" bg={useColorModeValue("blue.50", "rgba(66, 153, 225, 0.1)")} color={useColorModeValue("blue.600", "blue.300")} px={2} py={0.5} borderRadius="md" fontWeight="medium">
                Live filtering active
              </Text>
            )}
          </HStack>
        </Box>

        {/* Product Workspace Container */}
        <Box bg={cardGridBg}>
          {loading ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={{ base: 4, md: 6 }}>
              {[...Array(PRODUCT_LIMIT)].map((_, index) => (
                <Box key={index} borderRadius="xl" overflow="hidden">
                  <ProductCardSkeleton />
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            products.length > 0 ? (
              <>
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={{ base: 4, md: 6 }}>
                  {products.map((product) => (
                    <MotionBox
                      key={`${product._id || product.productId}-${product.name}`}
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <ProductCard product={product} />
                    </MotionBox>
                  ))}
                </SimpleGrid>

                {totalPages > 1 && (
                  <Flex mt={12} justify="center" align="center" width="100%">
                    <Box 
                      px={4} 
                      py={2} 
                      bg={filterBg} 
                      borderRadius="full" 
                      boxShadow="sm"
                      border="1px solid"
                      borderColor={filterBorder}
                    >
                      <MainPagePagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        placement="center"
                      />
                    </Box>
                  </Flex>
                )}
              </>
            ) : (
              <VStack textAlign="center" py={16} px={4} spacing={4} bg={filterBg} borderRadius="xl" border="1px dashed" borderColor={filterBorder}>
                <Icon as={FiInbox} boxSize={12} color={useColorModeValue("gray.300", "gray.600")} />
                <VStack spacing={1}>
                  <Text fontSize="xl" fontWeight="semibold" color={useColorModeValue("gray.700", "gray.200")}>
                    No products matched your search
                  </Text>
                  <Text fontSize="md" color={mutedText} maxW="md">
                    Try adjusting your filter selection or clear search key phrases to view the full collection again.
                  </Text>
                </VStack>
                {hasActiveFilters && (
                  <Button size="sm" mt={2} colorScheme="blue" variant="outline" borderRadius="lg" onClick={resetFilters}>
                    Clear Active Filters
                  </Button>
                )}
              </VStack>
            )
          )}
        </Box>
      </MotionBox>

      {/* Beautiful Section Divider Accent Line */}
      <Box w="100%" h="1px" bgGradient={`linear(to-r, transparent, ${filterBorder}, transparent)`} mb={{ base: 14, md: 24 }} />

      {/* Trending Products Section */}
      <MotionBox
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      >
        <Box mb={{ base: 6, md: 8 }}>
          <CommonHeading
            heading="Top Picks For You"
            subheading="Handpicked favorites based on current global marketplace trends"
            color={headingColor}
            align="left"
          />
        </Box>
        <Box 
          p={{ base: 1, md: 2 }}
          borderRadius="xl"
          bg={useColorModeValue("transparent", "rgba(255,255,255,0.01)")}
        >
          <ShopSection />
        </Box>
      </MotionBox>
    </Box>
  );
});

export default ProductsListSection;