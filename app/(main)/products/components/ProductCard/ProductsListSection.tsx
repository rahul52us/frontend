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
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiFilter, FiRefreshCcw, FiSearch } from "react-icons/fi";
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
  const filterBg = useColorModeValue("white", "gray.900");
  const filterBorder = useColorModeValue("gray.200", "gray.700");
  const mutedText = useColorModeValue("gray.600", "gray.400");

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
      mx="auto"
      px={{ base: 4, md: 8, lg: 12 }}
      py={{ base: 6, md: 10 }}
      overflow="hidden"
    >
      {/* Filterable Product Section */}
      <MotionBox
        id="all-products"
        mb={{ base: 10, md: 16 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <CommonHeading
          heading="All Products"
          subheading="Filter and browse products from every shop"
          mb={{ base: 4, md: 6 }}
          color={headingColor}
          align="left"
        />

        <Box
          bg={filterBg}
          border="1px solid"
          borderColor={filterBorder}
          borderRadius="md"
          p={{ base: 3, md: 4 }}
          mb={{ base: 5, md: 8 }}
        >
          <Flex gap={3} align={{ base: "stretch", lg: "center" }} direction={{ base: "column", lg: "row" }}>
            <InputGroup flex={{ base: "unset", lg: 1 }}>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color={mutedText} />
              </InputLeftElement>
              <Input
                value={searchTerm}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Search products"
                borderRadius="md"
              />
            </InputGroup>

            <Select
              value={selectedCategory}
              onChange={(event) => handleCategoryChange(event.target.value)}
              placeholder="All categories"
              maxW={{ base: "100%", lg: "220px" }}
              borderRadius="md"
              icon={<FiFilter />}
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
              placeholder="All subcategories"
              maxW={{ base: "100%", lg: "240px" }}
              borderRadius="md"
              isDisabled={!selectedCategory || subCategories.length === 0}
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
              variant="outline"
              borderRadius="md"
              isDisabled={!hasActiveFilters}
            >
              Reset
            </Button>
          </Flex>

          <HStack mt={3} justify="space-between" color={mutedText} fontSize="sm" flexWrap="wrap">
            <Text>
              {loading ? "Loading products..." : `${totalProducts} product${totalProducts === 1 ? "" : "s"} found`}
            </Text>
            {hasActiveFilters && <Text>Filters update automatically</Text>}
          </HStack>
        </Box>

        <Box>
          {loading ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={{ base: 4, md: 5 }}>
              {[...Array(PRODUCT_LIMIT)].map((_, index) => (
                <Box key={index}>
                  <ProductCardSkeleton />
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            products.length > 0 ? (
              <>
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={{ base: 4, md: 5 }}>
                  {products.map((product) => (
                    <ProductCard
                      key={`${product._id || product.productId}-${product.name}`}
                      product={product}
                    />
                  ))}
                </SimpleGrid>

                {totalPages > 1 && (
                  <Box mt={8}>
                    <MainPagePagination
                      totalPages={totalPages}
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                      placement="center"
                    />
                  </Box>
                )}
              </>
            ) : (
              <Box textAlign="center" py={10} fontSize="lg" color="gray.500">
                No products match the selected filters.
              </Box>
            )
          )}
        </Box>
      </MotionBox>

      {/* Trending Products Section */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <CommonHeading
          heading="Top Picks For You"
          subheading="Handpicked favorites based on current trends"
          mb={{ base: 6, md: 10 }}
          color={headingColor}
          align="left"
        />
        <ShopSection />
      </MotionBox>
    </Box>
  );
});

export default ProductsListSection;
