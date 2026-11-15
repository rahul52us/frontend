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
import React, { useEffect, useMemo, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiNavigation,
  FiPhone,
  FiShoppingBag,
} from "react-icons/fi";
import stores from "../../../../store/stores";
import ProductCard from "../../../products/components/ProductCard/ProductCard";
import ContactSection from "../ContactSection/ContactSection";
import LocationSection from "../LocationSection/LocationSection";
import OperatingHours from "../OperatingHours/OperatingHours";
import ShopAbout from "../ShopAbout/ShopAbout";
import ShopFooterSection from "../ShopFooterSection/ShopFooterSection";
import ShopHeroSection from "../ShopHeroSection/ShopHeroSection";
import ShopImages from "../ShopImages/ShopImages";

const MotionBox = motion(Box);

const TABS = [
  { id: "products", label: "Products" },
  { id: "about", label: "About" },
  { id: "info", label: "Visit" },
] as const;

type TabType = (typeof TABS)[number]["id"];

const ShopPage = observer(({ shopData }: any) => {
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
  const pageBg = useColorModeValue("gray.50", "gray.950");
  const cardBg = useColorModeValue("white", "gray.850");
  const borderColor = useColorModeValue("gray.100", "gray.750");
  const textPrimary = useColorModeValue("gray.900", "white");
  const textMuted = useColorModeValue("gray.500", "gray.400");
  const stickyBg = useColorModeValue(
    "rgba(255, 255, 255, 0.9)",
    "rgba(23, 25, 35, 0.9)"
  );
  const trackBg = useColorModeValue("gray.100", "gray.800");
  const pillBg = useColorModeValue("white", "gray.700");
  const btnBg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.100", "gray.700");

  // Fetch shop products using actual shopStore API
  const fetchProducts = async (page = 1) => {
    if (!shopData?._id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getShopProducts({
        company: shopData?._id,
        page: page,
        limit: 8,
      });
      const data = res?.data?.products || [];
      const total = res?.data?.totalPages || 1;

      setProducts(data);
      setTotalPages(total);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err?.message || "Couldn't load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopData?._id) {
      fetchProducts(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopData?._id]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchProducts(newPage);
      document.getElementById("tabs")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSwitchToProducts = () => {
    setTab("products");
    document.getElementById("tabs")?.scrollIntoView({ behavior: "smooth" });
  };

  // Categories list
  const categories = useMemo(
    () => ["All", ...(shopData?.categories ?? [])],
    [shopData]
  );

  // Filtered products based on selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return products;
    return products.filter((p: any) => {
      const pCat =
        typeof p.category === "object" ? p.category?.name : p.category;
      return String(pCat || "").toLowerCase() === selectedCategory.toLowerCase();
    });
  }, [products, selectedCategory]);

  // Directions & Contact info for mobile bottom bar
  const loc = shopData?.location;
  const address = [
    loc?.address,
    loc?.city,
    loc?.state,
    loc?.postalCode || loc?.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    address || shopData?.name || ""
  )}`;

  const phone = shopData?.contactInfo?.phone;

  return (
    <Box minH="100vh" bg={pageBg} pb={{ base: 28, md: 14 }}>
      {/* Shop Hero Section with Cover & Floating Identity Card */}
      <ShopHeroSection
        shopData={shopData}
        onShopProductsClick={handleSwitchToProducts}
      />

      {/* Main Container */}
      <Container maxW="6xl" px={4} mt={6}>
        {/* Sticky Segmented Pill Tabs Navigation */}
        <Box
          id="tabs"
          position="sticky"
          top={{ base: "0px", md: "0px" }}
          zIndex={20}
          bg={stickyBg}
          backdropFilter="blur(16px)"
          py={3}
          px={2}
          mx={-2}
          mb={6}
          borderRadius="2xl"
          transition="all 0.2s"
        >
          <Box
            position="relative"
            display="grid"
            gridTemplateColumns="repeat(3, 1fr)"
            borderRadius="full"
            bg={trackBg}
            p="4px"
            maxW={{ base: "full", sm: "420px" }}
            mx="auto"
          >
            {TABS.map((t) => {
              const isActive = tab === t.id;
              return (
                <Box
                  as="button"
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  position="relative"
                  zIndex={1}
                  py={2.5}
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight="bold"
                  color={isActive ? textPrimary : textMuted}
                  transition="color 0.2s"
                  textAlign="center"
                  _focus={{ outline: "none" }}
                >
                  {isActive && (
                    <MotionBox
                      layoutId="activeShopTabPill"
                      position="absolute"
                      inset={0}
                      borderRadius="full"
                      bg={pillBg}
                      boxShadow="0 2px 10px rgba(0, 0, 0, 0.08)"
                      zIndex={-1}
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 32,
                      }}
                    />
                  )}
                  {t.label}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Tab Content Display */}
        <AnimatePresence mode="wait">
          {tab === "products" && (
            <MotionBox
              key="products-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {/* Category Filter Pills (Horizontal Scroll) */}
              {categories.length > 1 && (
                <Box
                  overflowX="auto"
                  display="flex"
                  gap={2}
                  pb={3}
                  mb={6}
                  mx={{ base: -2, md: 0 }}
                  px={{ base: 2, md: 0 }}
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
                        h="36px"
                        px={4}
                        borderRadius="full"
                        flexShrink={0}
                        variant={isSelected ? "solid" : "outline"}
                        bg={
                          isSelected
                            ? "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)"
                            : btnBg
                        }
                        color={isSelected ? "white" : textMuted}
                        borderColor={isSelected ? "transparent" : borderColor}
                        _hover={{
                          bg: isSelected
                            ? "linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%)"
                            : hoverBg,
                          transform: "scale(1.02)",
                        }}
                        _active={{ transform: "scale(0.96)" }}
                        fontWeight="semibold"
                        fontSize="xs"
                        onClick={() => setSelectedCategory(cat)}
                        boxShadow={
                          isSelected
                            ? "0 4px 12px rgba(37, 99, 235, 0.25)"
                            : "none"
                        }
                        transition="all 0.2s"
                      >
                        {cat}
                      </Button>
                    );
                  })}
                </Box>
              )}

              {/* Error State */}
              {error ? (
                <VStack
                  py={16}
                  spacing={4}
                  textAlign="center"
                  bg={cardBg}
                  borderRadius="3xl"
                  border="1px solid"
                  borderColor={borderColor}
                  p={8}
                >
                  <Circle size="60px" bg="red.50" color="red.500">
                    <Icon as={FiShoppingBag} boxSize={7} />
                  </Circle>
                  <Heading size="md" fontWeight="bold" color={textPrimary}>
                    Couldn't load products
                  </Heading>
                  <Text fontSize="sm" color={textMuted} maxW="sm">
                    {error}
                  </Text>
                  <Button
                    size="sm"
                    colorScheme="brand"
                    borderRadius="full"
                    px={6}
                    onClick={() => fetchProducts(currentPage)}
                  >
                    Try again
                  </Button>
                </VStack>
              ) : loading ? (
                /* Skeleton Loading State */
                <SimpleGrid
                  columns={{ base: 2, sm: 2, md: 3, lg: 4 }}
                  spacing={{ base: 3, md: 5 }}
                >
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
                /* Empty State */
                <VStack
                  py={16}
                  spacing={3}
                  textAlign="center"
                  bg={cardBg}
                  borderRadius="3xl"
                  border="1px solid"
                  borderColor={borderColor}
                  p={8}
                >
                  <Circle size="60px" bg="gray.100" color="gray.400">
                    <Icon as={FiShoppingBag} boxSize={7} />
                  </Circle>
                  <Heading size="md" fontWeight="bold" color={textPrimary}>
                    No products yet
                  </Heading>
                  <Text fontSize="sm" color={textMuted} maxW="sm">
                    {selectedCategory === "All"
                      ? "Check back soon for new arrivals."
                      : `No products found under category "${selectedCategory}".`}
                  </Text>
                </VStack>
              ) : (
                /* Products Grid */
                <SimpleGrid
                  columns={{ base: 2, sm: 2, md: 3, lg: 4 }}
                  spacing={{ base: 3, md: 5 }}
                >
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={`${product._id || product.id || product.productId}-${product.name}`}
                      product={product}
                    />
                  ))}
                </SimpleGrid>
              )}

              {/* Pagination Controls */}
              {!loading && totalPages > 1 && (
                <Flex justify="center" align="center" mt={10} gap={4}>
                  <IconButton
                    aria-label="Previous Page"
                    icon={<FiChevronLeft size={18} />}
                    size="sm"
                    borderRadius="full"
                    isDisabled={currentPage === 1 || loading}
                    onClick={() => handlePageChange(currentPage - 1)}
                    variant="outline"
                    bg={cardBg}
                    borderColor={borderColor}
                  />

                  <HStack spacing={1.5}>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <Box
                        as="button"
                        key={i}
                        aria-label={`Page ${i + 1}`}
                        onClick={() => handlePageChange(i + 1)}
                        w={currentPage === i + 1 ? "24px" : "8px"}
                        h="8px"
                        borderRadius="full"
                        bg={currentPage === i + 1 ? "blue.600" : "gray.300"}
                        transition="all 0.3s ease"
                        _hover={{ bg: "blue.400" }}
                      />
                    ))}
                  </HStack>

                  <IconButton
                    aria-label="Next Page"
                    icon={<FiChevronRight size={18} />}
                    size="sm"
                    borderRadius="full"
                    isDisabled={currentPage === totalPages || loading}
                    onClick={() => handlePageChange(currentPage + 1)}
                    variant="outline"
                    bg={cardBg}
                    borderColor={borderColor}
                  />
                </Flex>
              )}
            </MotionBox>
          )}

          {tab === "about" && (
            <MotionBox
              key="about-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <VStack spacing={6} align="stretch">
                <ShopAbout shopData={shopData} />
                <ShopImages shopData={shopData} />
              </VStack>
            </MotionBox>
          )}

          {tab === "info" && (
            <MotionBox
              key="info-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} alignItems="start">
                {/* Left Column: Location & Google Map */}
                <LocationSection shopData={shopData} />

                {/* Right Column: Opening Hours & Contact */}
                <VStack spacing={6} align="stretch">
                  <OperatingHours shopData={shopData} />
                  <ContactSection shopData={shopData} />
                </VStack>
              </SimpleGrid>
            </MotionBox>
          )}
        </AnimatePresence>
      </Container>

      {/* Footer Section */}
      <Box mt={16}>
        <ShopFooterSection shopData={shopData} />
      </Box>

      {/* Mobile Sticky Bottom Action Bar */}
      <Box
        display={{ base: "block", md: "none" }}
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        zIndex={99}
        bg={cardBg}
        backdropFilter="blur(16px)"
        borderTop="1px solid"
        borderColor={borderColor}
        p={3}
        boxShadow="0 -4px 20px rgba(0, 0, 0, 0.08)"
      >
        <HStack spacing={2} w="full">
          {phone && (
            <Button
              as="a"
              href={`tel:${phone}`}
              aria-label="Call"
              size="md"
              h="44px"
              px={4}
              borderRadius="xl"
              border="1px solid"
              borderColor={borderColor}
              bg={cardBg}
              color={textPrimary}
              _active={{ transform: "scale(0.95)" }}
            >
              <FiPhone size={16} />
            </Button>
          )}

          <Button
            as="a"
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Directions"
            size="md"
            h="44px"
            px={4}
            borderRadius="xl"
            border="1px solid"
            borderColor={borderColor}
            bg={cardBg}
            color={textPrimary}
            _active={{ transform: "scale(0.95)" }}
          >
            <FiNavigation size={16} />
          </Button>

          <Button
            onClick={handleSwitchToProducts}
            leftIcon={<FiShoppingBag />}
            flex={1}
            size="md"
            h="44px"
            borderRadius="xl"
            bgGradient="linear(to-r, var(--color-primary), var(--color-secondary))"
            color="white"
            fontWeight="bold"
            fontSize="sm"
            boxShadow="0 4px 12px rgba(37, 99, 235, 0.3)"
            _active={{ transform: "scale(0.97)" }}
          >
            Shop products
          </Button>
        </HStack>
      </Box>
    </Box>
  );
});

export default ShopPage;
