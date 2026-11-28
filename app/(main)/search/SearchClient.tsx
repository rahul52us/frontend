"use client";

import {
  Badge,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Select,
  SimpleGrid,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FiCheck,
  FiChevronRight,
  FiFilter,
  FiHome,
  FiRefreshCcw,
  FiSliders,
} from "react-icons/fi";
import BottomSheetDrawer from "../../component/common/Drawer/BottomSheetDrawer";
import MainPagePagination from "../../component/config/component/pagination/MainPagePagination";
import stores from "../../store/stores";
import ProductCard from "../products/components/ProductCard/ProductCard";
import ProductCardSkeleton from "../products/components/ProductCard/ProductCardSkeleton/ProductCardSkeleton";
import { emptyAdvancedFilters } from "../products/components/ProductCard/constant";
import {
  AdvancedFilterPanel,
  compactAdvancedFilters,
  getAdvancedFilterCount,
} from "./components/AdvancedFilterPanel";
import { SearchEmptyState } from "./components/SearchEmptyState";

const MotionBox = motion(Box);
const PRODUCT_LIMIT = 12;

const pageMotionVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.04,
    },
  },
};

const cardMotionVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

const normalizeValues = (value: any): string[] =>
  Array.isArray(value) ? value : [];

export const SearchClient = observer(() => {
  const { shopStore, layout } = stores;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mobileFilterDrawer = useDisclosure();

  const [products, setProducts] = useState<any[]>([]);
  const [facets, setFacets] = useState<any[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState<any>(emptyAdvancedFilters);
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Read search term from URL query ('q' or 'search')
  const urlSearchTerm = (
    searchParams.get("q") ||
    searchParams.get("search") ||
    ""
  ).trim();

  const searchTerm = String(
    urlSearchTerm || layout.productSearchQuery || ""
  ).trim();

  const previousSearchTermRef = useRef(searchTerm);

  // Sync store query with URL query
  useEffect(() => {
    if (urlSearchTerm !== layout.productSearchQuery) {
      layout.setProductSearchQuery(urlSearchTerm);
    }
  }, [layout, urlSearchTerm]);

  // Hoisted theme tokens
  const pageBg = useColorModeValue("var(--color-bg, #F8FAFC)", "var(--color-bg, #070B14)");
  const surfaceBg = useColorModeValue("var(--color-surface, #FFFFFF)", "var(--color-surface, #0B1120)");
  const borderColor = useColorModeValue("var(--color-border, #E2E8F0)", "var(--color-border, rgba(255, 255, 255, 0.1))");
  const titleColor = useColorModeValue("var(--color-text, #0F172A)", "var(--color-text, #F8FAFC)");
  const mutedText = useColorModeValue("var(--color-text-muted, #64748B)", "var(--color-text-muted, #94A3B8)");

  const advancedFilterCount = getAdvancedFilterCount(advancedFilters);

  // Core product fetch logic
  const fetchProducts = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const res = await shopStore.getAllProducts({
          page,
          limit: PRODUCT_LIMIT,
          search: searchTerm,
          filters: compactAdvancedFilters(advancedFilters),
          sort: sortBy !== "relevance" ? sortBy : undefined,
          includeFacets: true,
        });

        const payload = res?.data || {};
        let fetchedProducts = payload.products || [];

        // Client-side sort enhancements if needed
        if (sortBy === "price_asc") {
          fetchedProducts = [...fetchedProducts].sort(
            (a, b) => Number(a.price || a.sellingPrice || 0) - Number(b.price || b.sellingPrice || 0)
          );
        } else if (sortBy === "price_desc") {
          fetchedProducts = [...fetchedProducts].sort(
            (a, b) => Number(b.price || b.sellingPrice || 0) - Number(a.price || a.sellingPrice || 0)
          );
        } else if (sortBy === "newest") {
          fetchedProducts = [...fetchedProducts].sort(
            (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          );
        }

        setProducts(fetchedProducts);
        setFacets(payload.facets || []);
        setTotalProducts(payload.total || 0);
        setTotalPages(payload.totalPages || 1);
        setCurrentPage(payload.currentPage || page);
      } catch {
        setProducts([]);
        setFacets([]);
        setTotalProducts(0);
        setTotalPages(1);
        setCurrentPage(1);
      } finally {
        setLoading(false);
      }
    },
    [advancedFilters, searchTerm, shopStore, sortBy]
  );

  // Fetch when search query, filters, or sort change
  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchProducts(1);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [fetchProducts]);

  // When search keyword changes, reset specific category filters
  useEffect(() => {
    if (previousSearchTermRef.current !== searchTerm) {
      previousSearchTermRef.current = searchTerm;
      setAdvancedFilters(emptyAdvancedFilters);
    }
  }, [searchTerm]);

  // Update query in URL smoothly
  const updateQueryInUrl = useCallback(
    (newSearch: string) => {
      const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
      params.delete("search");
      if (newSearch.trim()) {
        params.set("q", newSearch.trim());
      } else {
        params.delete("q");
      }
      layout.setProductSearchQuery(newSearch.trim());
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [layout, pathname, router, searchParams]
  );

  const clearSearchParam = useCallback(() => {
    updateQueryInUrl("");
  }, [updateQueryInUrl]);

  const resetAllFilters = useCallback(() => {
    clearSearchParam();
    setAdvancedFilters(emptyAdvancedFilters);
  }, [clearSearchParam]);

  const toggleAdvancedFilter = useCallback((facetKey: string, value: string) => {
    setAdvancedFilters((prev: any) => {
      const next = {
        ...prev,
        variants: { ...(prev.variants || {}) },
        specs: { ...(prev.specs || {}) },
        information: { ...(prev.information || {}) },
      };

      const toggleList = (values: string[]) =>
        values.includes(value)
          ? values.filter((item) => item !== value)
          : [...values, value];

      if (facetKey.startsWith("variant:")) {
        const key = facetKey.replace("variant:", "");
        next.variants[key] = toggleList(normalizeValues(next.variants[key]));
      } else if (facetKey.startsWith("spec:")) {
        const key = facetKey.replace("spec:", "");
        next.specs[key] = toggleList(normalizeValues(next.specs[key]));
      } else if (facetKey.startsWith("information:")) {
        const key = facetKey.replace("information:", "");
        next.information[key] = toggleList(
          normalizeValues(next.information[key])
        );
      } else {
        next[facetKey] = toggleList(normalizeValues(next[facetKey]));
      }

      return next;
    });
  }, []);

  const setPriceFilter = useCallback((min?: number, max?: number) => {
    setAdvancedFilters((prev: any) => ({
      ...prev,
      price: { min, max },
    }));
  }, []);

  const clearAdvancedFilters = useCallback(() => {
    setAdvancedFilters(emptyAdvancedFilters);
  }, []);

  const handlePageChange = useCallback(
    ({ selected }: { selected: number }) => {
      const nextPage = Math.max(1, Number(selected) || 1);
      fetchProducts(nextPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [fetchProducts]
  );

  // Active Filter Chips
  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];
    const facetLabelMap = new Map<string, string>();
    const optionLabelMap = new Map<string, string>();

    facets.forEach((facet: any) => {
      facetLabelMap.set(facet.key, facet.label);
      (facet.options || []).forEach((option: any) => {
        optionLabelMap.set(`${facet.key}:${option.value}`, option.label);
      });
    });

    if (searchTerm.trim()) {
      chips.push({
        key: "search-query",
        label: `"${searchTerm.trim()}"`,
        onRemove: clearSearchParam,
      });
    }

    ["brand", "idea", "deal", "availability"].forEach((key) => {
      normalizeValues(advancedFilters[key]).forEach((value) => {
        chips.push({
          key: `${key}:${value}`,
          label: `${optionLabelMap.get(`${key}:${value}`) || value}`,
          onRemove: () => toggleAdvancedFilter(key, value),
        });
      });
    });

    Object.entries(advancedFilters.variants || {}).forEach(([name, values]) => {
      normalizeValues(values).forEach((value) => {
        const facetKey = `variant:${name}`;
        chips.push({
          key: `${facetKey}:${value}`,
          label: `${name}: ${optionLabelMap.get(`${facetKey}:${value}`) || value}`,
          onRemove: () => toggleAdvancedFilter(facetKey, value),
        });
      });
    });

    Object.entries(advancedFilters.specs || {}).forEach(([name, values]) => {
      normalizeValues(values).forEach((value) => {
        const facetKey = `spec:${name}`;
        chips.push({
          key: `${facetKey}:${value}`,
          label: `${name}: ${optionLabelMap.get(`${facetKey}:${value}`) || value}`,
          onRemove: () => toggleAdvancedFilter(facetKey, value),
        });
      });
    });

    Object.entries(advancedFilters.information || {}).forEach(([name, values]) => {
      normalizeValues(values).forEach((value) => {
        const facetKey = `information:${name}`;
        chips.push({
          key: `${facetKey}:${value}`,
          label: `${name}: ${optionLabelMap.get(`${facetKey}:${value}`) || value}`,
          onRemove: () => toggleAdvancedFilter(facetKey, value),
        });
      });
    });

    if (
      advancedFilters.price?.min !== undefined ||
      advancedFilters.price?.max !== undefined
    ) {
      chips.push({
        key: "price-filter",
        label: `₹${Math.round(
          Number(advancedFilters.price.min || 0)
        ).toLocaleString("en-IN")} – ₹${Math.round(
          Number(advancedFilters.price.max || 0)
        ).toLocaleString("en-IN")}`,
        onRemove: () => setPriceFilter(undefined, undefined),
      });
    }

    return chips;
  }, [
    advancedFilters,
    clearSearchParam,
    facets,
    searchTerm,
    setPriceFilter,
    toggleAdvancedFilter,
  ]);

  return (
    <Box bg={pageBg} minH="90vh" py={{ base: 3, md: 6 }} overflowX="hidden">
      <Container maxW="8xl" px={{ base: 3, sm: 4, md: 6, lg: 8 }}>
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          spacing="8px"
          separator={<Icon as={FiChevronRight} color="gray.400" boxSize={3} />}
          fontSize="xs"
          color={mutedText}
          mb={{ base: 3, md: 5 }}
        >
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => router.push("/")}
              display="flex"
              alignItems="center"
              gap={1}
              _hover={{ color: "var(--color-primary)" }}
            >
              <Icon as={FiHome} boxSize={3.5} />
              <span>Home</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink color={titleColor} fontWeight="700">
              Search Results
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Top Search Controls Bar */}
   <Box
  bg={surfaceBg}
  border="1px solid"
  borderColor={borderColor}
  borderRadius={{ base: "xl", md: "2xl" }}
  p={{ base: 3.5, md: 5 }}
  mb={{ base: 4, md: 6 }}
>
  <Flex
    justify="space-between"
    align={{ base: "flex-start", md: "center" }}
    direction={{ base: "column", md: "row" }}
    gap={{ base: 3, md: 4 }}
  >
    {/* Title & Item Count */}
    <Box>
      <Heading
        as="h1"
        fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
        fontWeight="800"
        color={titleColor}
        letterSpacing="-0.02em"
        lineHeight="1.2"
      >
        Explore Products
      </Heading>

      <Text fontSize="xs" color={mutedText} mt={1}>
        {loading ? (
          "Searching catalog..."
        ) : (
          <>
            Showing{" "}
            <Text as="span" fontWeight="700" color={titleColor}>
              {totalProducts}
            </Text>{" "}
            matching item{totalProducts === 1 ? "" : "s"}
          </>
        )}
      </Text>
    </Box>

    {/* Actions: Relevance and Reset */}
    <HStack spacing={2} w={{ base: "full", md: "auto" }} justify={{ base: "space-between", md: "flex-end" }}>
      <Select
        size="sm"
        h="36px"
        borderRadius="full"
        bg={surfaceBg}
        borderColor={borderColor}
        color={titleColor}
        fontWeight="600"
        fontSize="xs"
        maxW={{ base: "full", md: "170px" }}
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="relevance">Relevance</option>
      </Select>

      {(activeFilterChips.length > 0 || advancedFilterCount > 0) && (
        <Button
          leftIcon={<FiRefreshCcw size={12} />}
          onClick={resetAllFilters}
          variant="ghost"
          size="sm"
          h="36px"
          px={3}
          borderRadius="full"
          colorScheme="red"
          fontSize="xs"
          fontWeight="700"
        >
          Reset
        </Button>
      )}
    </HStack>
  </Flex>
</Box>

        {/* Main Content Layout: Desktop Sticky Sidebar + Grid */}
        <Flex gap={{ base: 4, lg: 7 }} align="flex-start">
          {/* Desktop Filter Sidebar */}
          <Box
            display={{ base: "none", lg: "block" }}
            w="280px"
            flexShrink={0}
            position="sticky"
            top="92px"
            maxH="calc(100vh - 110px)"
            overflowY="auto"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="2xl"
            bg={surfaceBg}
            p={5}
            boxShadow="xs"
            sx={{
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-thumb": {
                background: "var(--color-border)",
                borderRadius: "full",
              },
            }}
          >
            <AdvancedFilterPanel
              facets={facets}
              filters={advancedFilters}
              loading={loading}
              emptyMessage="No filter facets available for this query."
              onToggle={toggleAdvancedFilter}
              onPriceChange={setPriceFilter}
              onClear={clearAdvancedFilters}
            />
          </Box>

          {/* Product Results Grid */}
          <Box flex="1" minW={0}>
            {loading ? (
              <SimpleGrid
                columns={{ base: 2, sm: 2, md: 3, xl: 4 }}
                spacing={{ base: 2.5, sm: 3.5, md: 5 }}
              >
                {[...Array(PRODUCT_LIMIT)].map((_, index) => (
                  <Box key={index} borderRadius="2xl" overflow="hidden">
                    <ProductCardSkeleton />
                  </Box>
                ))}
              </SimpleGrid>
            ) : products.length > 0 ? (
              <MotionBox
                variants={pageMotionVariants}
                initial="hidden"
                animate="visible"
              >
                <SimpleGrid
                  columns={{ base: 2, sm: 2, md: 3, xl: 4 }}
                  spacing={{ base: 2.5, sm: 3.5, md: 5 }}
                >
                  {products.map((product, idx) => (
                    <MotionBox
                      key={`${product._id || product.productId}-${idx}`}
                      variants={cardMotionVariants}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ProductCard product={product} />
                    </MotionBox>
                  ))}
                </SimpleGrid>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <Flex mt={10} mb={6} justify="center" align="center" w="full">
                    <Box
                      px={4}
                      py={2}
                      bg={surfaceBg}
                      borderRadius="full"
                      boxShadow="xs"
                      border="1px solid"
                      borderColor={borderColor}
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
              </MotionBox>
            ) : (
              /* Empty Search Results State */
              <SearchEmptyState
                searchTerm={searchTerm}
                hasFilters={advancedFilterCount > 0}
                onResetFilters={resetAllFilters}
                onSelectSuggestion={(suggestion) => updateQueryInUrl(suggestion)}
              />
            )}
          </Box>
        </Flex>

        {/* Mobile Filter Drawer using BottomSheetDrawer */}
        <BottomSheetDrawer
          isOpen={mobileFilterDrawer.isOpen}
          onClose={mobileFilterDrawer.onClose}
          title={
            <HStack spacing={2} align="center">
              <Icon as={FiSliders} color="var(--color-primary)" boxSize={4} />
              <Text>Filters</Text>
              {advancedFilterCount > 0 && (
                <Badge colorScheme="brand" borderRadius="full" px={2} fontSize="11px">
                  {advancedFilterCount}
                </Badge>
              )}
            </HStack>
          }
          footer={
            <Flex w="full" gap={3} pt={2}>
              <Button
                flex="1"
                h="44px"
                variant="outline"
                borderRadius="xl"
                fontWeight="700"
                onClick={clearAdvancedFilters}
                isDisabled={advancedFilterCount === 0}
              >
                Clear All
              </Button>
              <Button
                flex="2"
                h="44px"
                colorScheme="brand"
                borderRadius="xl"
                fontWeight="700"
                leftIcon={<FiCheck />}
                onClick={mobileFilterDrawer.onClose}
              >
                Apply ({totalProducts} Products)
              </Button>
            </Flex>
          }
        >
          <Box pb={4}>
            <AdvancedFilterPanel
              facets={facets}
              filters={advancedFilters}
              loading={loading}
              emptyMessage="No filter facets available for this query."
              onToggle={toggleAdvancedFilter}
              onPriceChange={setPriceFilter}
              onClear={clearAdvancedFilters}
              hideHeader
            />
          </Box>
        </BottomSheetDrawer>
      </Container>
    </Box>
  );
});

export default SearchClient;
