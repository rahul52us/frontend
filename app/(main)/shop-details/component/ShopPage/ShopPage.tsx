"use client";

import {
  AspectRatio,
  Box,
  Button,
  Circle,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  SimpleGrid,
  Skeleton,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiInfo,
  FiMapPin,
  FiRefreshCw,
  FiShoppingBag,
} from "react-icons/fi";
import stores from "../../../../store/stores";
import ProductCard from "../../../products/components/ProductCard/ProductCard";
import ContactSection from "../ContactSection/ContactSection";
import LocationSection from "../LocationSection/LocationSection";
import OperatingHours from "../OperatingHours/OperatingHours";
import ShopAbout from "../ShopAbout/ShopAbout";
import ShopHeroSection from "../ShopHeroSection/ShopHeroSection";
import ShopImages from "../ShopImages/ShopImages";

const MotionBox = motion(Box);

const TABS = [
  { id: "products", label: "Products", icon: FiShoppingBag },
  { id: "about", label: "About", icon: FiInfo },
  { id: "info", label: "Visit", icon: FiMapPin },
] as const;

type TabType = (typeof TABS)[number]["id"];

const tabMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.3, ease: "easeOut" },
} as const;

const ShopPage = memo(
  observer(({ shopData }: any) => {
    const {
      shopStore: { getShopProducts },
    } = stores;

    const [tab, setTab] = useState<TabType>("products");
    const [products, setProducts] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Color tokens
    const pageBg = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.100", "whiteAlpha.200");
    const textPrimary = useColorModeValue("gray.900", "white");
    const textMuted = useColorModeValue("gray.500", "gray.400");
    const stickyBg = useColorModeValue(
      "rgba(249, 250, 251, 0.85)",
      "rgba(23, 25, 35, 0.85)"
    );
    const trackBg = useColorModeValue("gray.100", "whiteAlpha.100");
    const pillBg = useColorModeValue("white", "whiteAlpha.300");
    const chipBg = useColorModeValue("white", "whiteAlpha.100");
    const chipHover = useColorModeValue("gray.100", "whiteAlpha.200");
    const errBg = useColorModeValue("red.50", "whiteAlpha.100");
    const emptyBg = useColorModeValue("gray.100", "whiteAlpha.100");
    const emptyIcon = useColorModeValue("gray.400", "gray.500");

    // Fetch shop products
    const fetchProducts = useCallback(
      async (page = 1) => {
        if (!shopData?._id) return;
        setLoading(true);
        setError(null);
        try {
          const res = await getShopProducts({
            company: shopData?._id,
            page,
            limit: 8,
          });
          setProducts(res?.data?.products || []);
          setTotalPages(res?.data?.totalPages || 1);
          setCurrentPage(page);
        } catch (err: any) {
          setError(err?.message || "Couldn’t load products");
        } finally {
          setLoading(false);
        }
      },
      [getShopProducts, shopData?._id]
    );

    useEffect(() => {
      if (shopData?._id) {
        fetchProducts(1);
      }
    }, [shopData?._id, fetchProducts]);

    // Scroll to the top of the tab content (accounts for the sticky tab bar)
    const scrollToContent = useCallback((force = false) => {
      const el = document.getElementById("shop-content");
      if (!el) return;
      if (force || el.getBoundingClientRect().top < 72) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, []);

    const handleTabChange = useCallback(
      (id: TabType) => {
        setTab(id);
        scrollToContent();
      },
      [scrollToContent]
    );

    const handlePageChange = useCallback(
      (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
          fetchProducts(newPage);
          scrollToContent(true);
        }
      },
      [fetchProducts, totalPages, scrollToContent]
    );

    const handleSwitchToProducts = useCallback(() => {
      setTab("products");
      scrollToContent(true);
    }, [scrollToContent]);

    // Categories
    const categories = useMemo(
      () => ["All", ...(shopData?.categories ?? [])],
      [shopData?.categories]
    );

    const filteredProducts = useMemo(() => {
      if (selectedCategory === "All") return products;
      return products.filter((p: any) => {
        const pCat =
          typeof p.category === "object" ? p.category?.name : p.category;
        return String(pCat || "").toLowerCase() === selectedCategory.toLowerCase();
      });
    }, [products, selectedCategory]);

    const stateCard = {
      py: 12,
      px: 6,
      spacing: 3,
      textAlign: "center",
      bg: cardBg,
      borderRadius: "3xl",
      border: "1px solid",
      borderColor,
    } as const;

    const gridProps = {
      columns: { base: 2, md: 3, lg: 5 },
      spacing: { base: 3, md: 5 },
    } as const;

    return (
      <Box minH="100vh" bg={pageBg} pb={{ base: 2, md: 14 }}>
        <ShopHeroSection
          shopData={shopData}
          onShopProductsClick={handleSwitchToProducts}
        />

        {/* Sticky segmented tabs (full-bleed bar) */}
        <Box
          id="tabs"
          position="sticky"
          top="0px"
          zIndex={20}
          mt={3}
          py={2}
          bg={stickyBg}
          backdropFilter="blur(16px)"
          borderBottom="1px solid"
          borderColor={borderColor}
        >
          <Container maxW="100%" px={{ base: 3, md: 8 }}>
            <Box
              role="tablist"
              display="grid"
              gridTemplateColumns="repeat(3, 1fr)"
              borderRadius="full"
              bg={trackBg}
              p="4px"
              maxW={{ base: "full", md: "420px" }}
            >
              {TABS.map((t) => {
                const isActive = tab === t.id;
                return (
                  <Box
                    as="button"
                    role="tab"
                    aria-selected={isActive}
                    key={t.id}
                    onClick={() => handleTabChange(t.id)}
                    position="relative"
                    py={2}
                    borderRadius="full"
                    fontSize="sm"
                    fontWeight="bold"
                    color={isActive ? textPrimary : textMuted}
                    transition="color 0.2s"
                    _focus={{ outline: "none" }}
                    _focusVisible={{ boxShadow: "outline" }}
                  >
                    {isActive && (
                      <MotionBox
                        layoutId="activeShopTabPill"
                        position="absolute"
                        inset={0}
                        borderRadius="full"
                        bg={pillBg}
                        boxShadow="0 2px 10px rgba(0, 0, 0, 0.08)"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                    <HStack
                      position="relative"
                      zIndex={1}
                      justify="center"
                      spacing={1.5}
                    >
                      <Icon as={t.icon} boxSize={4} />
                      <Text as="span">{t.label}</Text>
                    </HStack>
                  </Box>
                );
              })}
            </Box>
          </Container>
        </Box>

        {/* Tab content */}
        <Container
          id="shop-content"
          maxW="100%"
          px={{ base: 3, md: 8 }}
          pt={{ base: 4, md: 6 }}
          scrollMarginTop="72px"
        >
          <AnimatePresence mode="wait">
            {tab === "products" && (
              <MotionBox key="products-tab" {...tabMotion}>
                {/* Category chips */}
                {categories.length > 1 && (
                  <Box
                    display="flex"
                    gap={2}
                    overflowX="auto"
                    mx={{ base: -3, md: 0 }}
                    px={{ base: 3, md: 0 }}
                    pb={3}
                    css={{
                      "&::-webkit-scrollbar": { display: "none" },
                      scrollbarWidth: "none",
                    }}
                  >
                    {categories.map((cat: string) => {
                      const isSelected = selectedCategory === cat;
                      return (
                        <Button
                          key={cat}
                          size="sm"
                          h="34px"
                          px={4}
                          flexShrink={0}
                          borderRadius="full"
                          border="1px solid"
                          bg={isSelected ? "brand.500" : chipBg}
                          color={isSelected ? "white" : textMuted}
                          borderColor={isSelected ? "transparent" : borderColor}
                          fontWeight="semibold"
                          fontSize="xs"
                          boxShadow={
                            isSelected ? "0 4px 12px rgba(37, 99, 235, 0.25)" : "none"
                          }
                          _hover={{
                            bg: isSelected ? "brand.500" : chipHover,
                            transform: "translateY(-1px)",
                          }}
                          _active={{ transform: "scale(0.96)" }}
                          transition="all 0.2s"
                          onClick={() => setSelectedCategory(cat)}
                        >
                          {cat}
                        </Button>
                      );
                    })}
                  </Box>
                )}

                {/* Section header */}
                <Flex justify="space-between" align="baseline" mb={3}>
                  <Heading
                    as="h2"
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="800"
                    letterSpacing="-0.01em"
                    color={textPrimary}
                  >
                    {selectedCategory === "All" ? "All products" : selectedCategory}
                  </Heading>
                  {!loading && !error && filteredProducts.length > 0 && (
                    <Text fontSize="xs" fontWeight="semibold" color={textMuted}>
                      {filteredProducts.length}{" "}
                      {filteredProducts.length === 1 ? "item" : "items"}
                    </Text>
                  )}
                </Flex>

                {error ? (
                  <VStack {...stateCard}>
                    <Circle size="56px" bg={errBg} color="red.400">
                      <Icon as={FiAlertCircle} boxSize={6} />
                    </Circle>
                    <Heading size="sm" fontWeight="bold" color={textPrimary}>
                      Couldn’t load products
                    </Heading>
                    <Text fontSize="sm" color={textMuted} maxW="sm">
                      {error}
                    </Text>
                    <Button
                      size="sm"
                      colorScheme="brand"
                      borderRadius="full"
                      px={5}
                      leftIcon={<FiRefreshCw />}
                      onClick={() => fetchProducts(currentPage)}
                    >
                      Try again
                    </Button>
                  </VStack>
                ) : loading ? (
                  <SimpleGrid {...gridProps}>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Box
                        key={i}
                        borderRadius="2xl"
                        overflow="hidden"
                        bg={cardBg}
                        border="1px solid"
                        borderColor={borderColor}
                        p={3}
                      >
                        <AspectRatio ratio={1} w="full" mb={3}>
                          <Skeleton borderRadius="xl" />
                        </AspectRatio>
                        <Skeleton height="14px" width="80%" mb={2} borderRadius="md" />
                        <Skeleton height="12px" width="40%" borderRadius="md" />
                      </Box>
                    ))}
                  </SimpleGrid>
                ) : filteredProducts.length === 0 ? (
                  <VStack {...stateCard}>
                    <Circle size="56px" bg={emptyBg} color={emptyIcon}>
                      <Icon as={FiShoppingBag} boxSize={6} />
                    </Circle>
                    <Heading size="sm" fontWeight="bold" color={textPrimary}>
                      No products yet
                    </Heading>
                    <Text fontSize="sm" color={textMuted} maxW="sm">
                      {selectedCategory === "All"
                        ? "Check back soon for new arrivals."
                        : `No products found under “${selectedCategory}”.`}
                    </Text>
                    {selectedCategory !== "All" && (
                      <Button
                        size="sm"
                        variant="outline"
                        borderRadius="full"
                        px={5}
                        onClick={() => setSelectedCategory("All")}
                      >
                        Show all products
                      </Button>
                    )}
                  </VStack>
                ) : (
                  <SimpleGrid {...gridProps}>
                    {filteredProducts.map((product, i) => (
                      <MotionBox
                        key={`${product._id || product.id || product.productId}-${product.name}`}
                        h="full"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: Math.min(i, 8) * 0.04,
                          ease: "easeOut",
                        }}
                      >
                        <ProductCard product={product} />
                      </MotionBox>
                    ))}
                  </SimpleGrid>
                )}

                {/* Pagination */}
                {!loading && !error && totalPages > 1 && (
                  <Flex justify="center" mt={8}>
                    <HStack
                      spacing={1}
                      p={1}
                      bg={cardBg}
                      border="1px solid"
                      borderColor={borderColor}
                      borderRadius="full"
                      boxShadow="sm"
                    >
                      <IconButton
                        aria-label="Previous page"
                        icon={<FiChevronLeft size={18} />}
                        size="sm"
                        variant="ghost"
                        borderRadius="full"
                        isDisabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                      />
                      <Text
                        fontSize="xs"
                        fontWeight="bold"
                        color={textPrimary}
                        px={3}
                        minW="88px"
                        textAlign="center"
                      >
                        Page {currentPage} of {totalPages}
                      </Text>
                      <IconButton
                        aria-label="Next page"
                        icon={<FiChevronRight size={18} />}
                        size="sm"
                        variant="ghost"
                        borderRadius="full"
                        isDisabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                      />
                    </HStack>
                  </Flex>
                )}
              </MotionBox>
            )}

            {tab === "about" && (
              <MotionBox key="about-tab" {...tabMotion}>
                <VStack spacing={4} align="stretch">
                  <ShopAbout shopData={shopData} />
                  <ShopImages shopData={shopData} />
                </VStack>
              </MotionBox>
            )}

            {tab === "info" && (
              <MotionBox key="info-tab" {...tabMotion}>
                <SimpleGrid
                  columns={{ base: 1, lg: 2 }}
                  spacing={{ base: 4, md: 6 }}
                  alignItems="start"
                >
                  <LocationSection shopData={shopData} />
                  <VStack spacing={{ base: 4, md: 6 }} align="stretch">
                    <OperatingHours shopData={shopData} />
                    <ContactSection shopData={shopData} />
                  </VStack>
                </SimpleGrid>
              </MotionBox>
            )}
          </AnimatePresence>
        </Container>

        {/* Footer (desktop only) */}
        {/* <Box mt={12} display={{ base: "none", md: "block" }}>
          <ShopFooterSection shopData={shopData} />
        </Box> */}
      </Box>
    );
  })
);

ShopPage.displayName = "ShopPage";

export default ShopPage;