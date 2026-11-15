"use client";

import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Skeleton,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React, { useMemo, useState } from "react";
import {
  FiBox,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiDollarSign,
  FiLayers,
  FiRefreshCw,
  FiSearch
} from "react-icons/fi";
import ConfirmationModal from "../../../component/common/ConfirmationModal/ConfirmationModal";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
import stores from "../../../store/stores";
import {
  MerchantBadge,
  merchantGhostButtonProps,
  MerchantPageHeader,
  MerchantPageShell,
  MerchantPanel,
  merchantSpin,
  MerchantStatCard,
} from "../../components/common/merchantDashboardUI";
import ProductForm from "../../products/components/ProductForm";
import ProductCard from "./components/ProductCard";
import ProductViewDrawer from "./components/ProductViewDrawer";
import { useProductDelete } from "./hooks/useProductDelete";
import { useProductEdit } from "./hooks/useProductEdit";
import { useProductList } from "./hooks/useProductList";

const SuperAdminProductsPage = observer(() => {
  const { offerStore } = stores;
  const {
    products,
    loading,
    currentPage,
    totalPages,
    totalProducts,
    setCurrentPage,
    fetchProducts,
  } = useProductList();

  const {
    isOpen: isDeleteOpen,
    onClose: onDeleteClose,
    selectedProduct,
    isDeleting,
    handleDeleteClick,
    confirmDelete,
  } = useProductDelete(() => fetchProducts(currentPage));

  const {
    isEditOpen,
    onEditClose,
    editProduct,
    handleEditClick,
    handleSubmit,
    initialValues,
    ProductSchema,
    activeCategories,
  } = useProductEdit(() => fetchProducts(currentPage));

  // Product View Drawer state
  const [selectedViewProduct, setSelectedViewProduct] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Local filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const surfaceBg = useColorModeValue("white", dashboardPalette.surface);
  const borderCol = useColorModeValue("#E2E8F0", dashboardPalette.border);
  const textMuted = useColorModeValue("#64748B", dashboardPalette.textMuted);

  React.useEffect(() => {
    offerStore.getAllOffers({ isActive: true });
  }, [offerStore]);

  const handleViewClick = (product: any) => {
    setSelectedViewProduct(product);
    setIsViewOpen(true);
  };

  const handleViewClose = () => {
    setIsViewOpen(false);
    setSelectedViewProduct(null);
  };

  // Filtered products based on search & category
  const filteredProducts = useMemo(() => {
    return products.filter((item: any) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name?.toLowerCase().includes(q) ||
        item.company?.name?.toLowerCase().includes(q) ||
        (typeof item.company === "string" && item.company.toLowerCase().includes(q)) ||
        item.category?.name?.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === "all" ||
        item.category?._id === selectedCategory ||
        item.category?.name === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Derived stats
  const inStockCount = products.filter(
    (p: any) => (p.stock ?? p.quantity ?? 1) > 0
  ).length;
  const populatedCategoryCount = products.filter((p: any) =>
    Boolean(p.category?.name)
  ).length;
  const totalValue = products.reduce(
    (acc: number, p: any) => acc + (Number(p.price) || 0),
    0
  );
  const avgPrice =
    products.length > 0 ? Math.round(totalValue / products.length) : 0;

  // Extract unique category options for filter dropdown
  const categoryOptions = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p: any) => {
      if (p.category?._id && p.category?.name) {
        map.set(p.category._id, p.category.name);
      }
    });
    return Array.from(map.entries());
  }, [products]);

  return (
    <MerchantPageShell>
      {/* Page Header */}
      <MerchantPageHeader
        icon={FiBox}
        title="Product Oversight"
        description="Review marketplace inventory, audit product cards, and inspect catalog quality across merchant stores."
        badges={
          <HStack spacing={2}>
            <MerchantBadge tone="accent">
              {totalProducts} Total Products
            </MerchantBadge>
            <MerchantBadge tone="success">
              {inStockCount} In Stock
            </MerchantBadge>
          </HStack>
        }
        actions={
          <Button
            size="sm"
            onClick={() => fetchProducts(currentPage)}
            isDisabled={loading}
            leftIcon={
              <Icon
                as={FiRefreshCw}
                animation={loading ? `${merchantSpin} 1s linear infinite` : undefined}
              />
            }
            {...merchantGhostButtonProps}
          >
            Refresh
          </Button>
        }
        mobileActions={
          <IconButton
            icon={
              <Icon
                as={FiRefreshCw}
                animation={loading ? `${merchantSpin} 1s linear infinite` : undefined}
              />
            }
            aria-label="Refresh products"
            size="sm"
            variant="ghost"
            onClick={() => fetchProducts(currentPage)}
            isDisabled={loading}
          />
        }
      />

      {/* Top Stats Grid */}
      <SimpleGrid
        columns={{ base: 2, lg: 4 }}
        spacing={{ base: 3, md: 4 }}
        mb={{ base: 4, md: 6 }}
      >
        <MerchantStatCard
          label="Total Products"
          value={totalProducts}
          variant="panel"
          icon={FiBox}
          iconColor={dashboardPalette.accentStrong}
          iconBg="rgba(59, 130, 246, 0.12)"
        />
        <MerchantStatCard
          label="With Category"
          value={populatedCategoryCount}
          variant="panel"
          icon={FiLayers}
          iconColor={dashboardPalette.success}
          iconBg="rgba(70, 201, 139, 0.14)"
          valueColor={dashboardPalette.success}
        />
        <MerchantStatCard
          label="In Stock In View"
          value={inStockCount}
          variant="panel"
          icon={FiCheckCircle}
          iconColor={dashboardPalette.accent}
          iconBg="rgba(6, 95, 104, 0.14)"
        />
        <MerchantStatCard
          label="Avg Price In View"
          value={`₹${avgPrice.toLocaleString("en-IN")}`}
          variant="panel"
          icon={FiDollarSign}
          iconColor={dashboardPalette.warning}
          iconBg="rgba(245, 158, 11, 0.14)"
        />
      </SimpleGrid>

      {/* Main Content Panel: Search, Filters, and Cards */}
      <MerchantPanel p={{ base: 0, md: 6 }}>
        {/* Filter and Search Bar */}
        <Flex
          direction={{ base: "column", sm: "row" }}
          gap={3}
          align={{ base: "stretch", sm: "center" }}
          justify="space-between"
          mb={5}
        >
          {/* Search Input */}
          <InputGroup maxW={{ base: "100%", sm: "320px", md: "380px" }}>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color={textMuted} />
            </InputLeftElement>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, shop, category..."
              borderRadius="full"
              fontSize="sm"
              bg={surfaceBg}
              borderColor={borderCol}
              _focusVisible={{
                borderColor: dashboardPalette.accent,
                boxShadow: `0 0 0 1px ${dashboardPalette.accent}`,
              }}
            />
          </InputGroup>

          {/* Category Dropdown & Results count */}
          <HStack spacing={2} align="center" justify="space-between">
            {categoryOptions.length > 0 && (
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                borderRadius="full"
                size="sm"
                maxW="180px"
                fontSize="xs"
                fontWeight="600"
                bg={surfaceBg}
                borderColor={borderCol}
              >
                <option value="all">All Categories</option>
                {categoryOptions.map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Select>
            )}

            <Badge
              colorScheme="gray"
              variant="subtle"
              borderRadius="full"
              px={2.5}
              py={1}
              fontSize="xs"
              fontWeight="700"
              whiteSpace="nowrap"
            >
              {filteredProducts.length} items
            </Badge>
          </HStack>
        </Flex>

        {/* Product Cards Grid */}
        {loading ? (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, xl: 4 }} spacing={{ base: 3.5, md: 4.5 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Box
                key={i}
                borderRadius="22px"
                border="1px solid"
                borderColor={borderCol}
                overflow="hidden"
                bg={surfaceBg}
                p={4}
              >
                <Skeleton h="180px" borderRadius="16px" mb={3} />
                <Skeleton h="14px" w="40%" mb={2} />
                <Skeleton h="18px" w="80%" mb={3} />
                <Skeleton h="24px" w="50%" mb={4} />
                <HStack spacing={2}>
                  <Skeleton h="32px" flex="1" borderRadius="full" />
                  <Skeleton h="32px" flex="1" borderRadius="full" />
                </HStack>
              </Box>
            ))}
          </SimpleGrid>
        ) : filteredProducts.length > 0 ? (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, xl: 5 }} spacing={{ base: 3, md: 5 }}>
            {filteredProducts.map((product: any) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onView={handleViewClick}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </SimpleGrid>
        ) : (
          <Box
            py={14}
            textAlign="center"
            bg={dashboardPalette.surfaceAlt}
            borderRadius="20px"
            border="1px dashed"
            borderColor={borderCol}
          >
            <Flex
              w="64px"
              h="64px"
              borderRadius="full"
              bg={dashboardPalette.accentSoft}
              align="center"
              justify="center"
              mx="auto"
              mb={3}
            >
              <Icon as={FiBox} boxSize={7} color={dashboardPalette.accent} />
            </Flex>
            <Text fontSize="md" fontWeight="700" color={dashboardPalette.text}>
              No products found
            </Text>
            <Text fontSize="sm" color={textMuted} mt={1} maxW="sm" mx="auto">
              {searchQuery || selectedCategory !== "all"
                ? "Try clearing your search query or selecting a different category filter."
                : "No products are currently recorded in the marketplace."}
            </Text>
            {(searchQuery || selectedCategory !== "all") && (
              <Button
                size="sm"
                variant="outline"
                borderRadius="full"
                mt={3.5}
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Reset Filters
              </Button>
            )}
          </Box>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <Flex
            mt={6}
            pt={4}
            borderTop="1px solid"
            borderColor={borderCol}
            align="center"
            justify="space-between"
            flexWrap="wrap"
            gap={3}
          >
            <Text fontSize="xs" color={textMuted} fontWeight="600">
              Page {currentPage} of {totalPages} ({totalProducts} total products)
            </Text>

            <HStack spacing={2}>
              <Button
                size="sm"
                variant="outline"
                borderRadius="full"
                borderColor={borderCol}
                leftIcon={<FiChevronLeft />}
                isDisabled={currentPage <= 1 || loading}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>

              <HStack spacing={1}>
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const pNum = i + 1;
                  const isCurrent = pNum === currentPage;
                  return (
                    <IconButton
                      key={pNum}
                      size="sm"
                      aria-label={`Page ${pNum}`}
                      icon={<Text fontSize="xs">{pNum}</Text>}
                      borderRadius="full"
                      variant={isCurrent ? "solid" : "ghost"}
                      colorScheme={isCurrent ? "brand" : "gray"}
                      onClick={() => setCurrentPage(pNum)}
                    />
                  );
                })}
              </HStack>

              <Button
                size="sm"
                variant="outline"
                borderRadius="full"
                borderColor={borderCol}
                rightIcon={<FiChevronRight />}
                isDisabled={currentPage >= totalPages || loading}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </HStack>
          </Flex>
        )}
      </MerchantPanel>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message={
          <Text>
            Are you sure you want to delete the product{" "}
            <strong>{selectedProduct?.name}</strong>? This action cannot be
            undone.
          </Text>
        }
        confirmText="Delete"
        confirmButtonProps={{ colorScheme: "red" }}
        isLoading={isDeleting}
        image={selectedProduct?.images?.[0]}
      />

      {/* Product Edit / Creation Form (uses CustomDrawer with responsive Bottom Sheet on mobile) */}
      <ProductForm
        isOpen={isEditOpen}
        onClose={onEditClose}
        initialValues={initialValues}
        validationSchema={ProductSchema}
        onSubmit={handleSubmit}
        categories={activeCategories.filter((c: any) => c !== "")}
        offersList={offerStore.offers}
        isEdit={!!editProduct}
      />

      {/* Product Details View Drawer (BottomSheetDrawer on mobile, CustomDrawer on desktop) */}
      <ProductViewDrawer
        isOpen={isViewOpen}
        onClose={handleViewClose}
        product={selectedViewProduct}
        onEdit={(prod) => handleEditClick(prod)}
        onDelete={(prod) => handleDeleteClick(prod)}
      />
    </MerchantPageShell>
  );
});

export default SuperAdminProductsPage;
