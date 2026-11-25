"use client";

import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  SimpleGrid,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiBox,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiDollarSign,
  FiGrid,
  FiLayers,
  FiList,
  FiRefreshCw,
  FiSearch,
  FiX,
} from "react-icons/fi";
import ConfirmationModal from "../../../component/common/ConfirmationModal/ConfirmationModal";
import CustomTable from "../../../component/config/component/CustomTable/CustomTable";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
import stores from "../../../store/stores";
import {
  getMerchantTableProps,
  MerchantBadge,
  merchantGhostButtonProps,
  MerchantPageHeader,
  MerchantPageShell,
  merchantSpin,
  MerchantStatCard,
} from "../../components/common/merchantDashboardUI";
import ProductForm from "../../products/components/ProductForm";
import ProductCard from "./components/ProductCard";
import { ProductColumns } from "./components/ProductColumns";
import ProductViewDrawer from "./components/ProductViewDrawer";
import { SearchableSellerSelect } from "../../components/common/SearchableSellerSelect";
import { SearchableCategorySelect } from "../../components/common/SearchableCategorySelect";
import { useProductDelete } from "./hooks/useProductDelete";
import { useProductEdit } from "./hooks/useProductEdit";
import { useProductList } from "./hooks/useProductList";
import { useProductStats } from "./hooks/useProductStats";

const STOCK_FILTERS = [
  { key: "all", label: "All" },
  { key: "in_stock", label: "In Stock" },
  { key: "low_stock", label: "Low Stock" },
  { key: "out_of_stock", label: "Out of Stock" },
] as const;

type StockFilterType = typeof STOCK_FILTERS[number]["key"];

const SuperAdminProductsPage = observer(() => {
  const { offerStore } = stores;

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [stockFilter, setStockFilter] = useState<StockFilterType>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [sellerRefreshKey, setSellerRefreshKey] = useState(0);

  const {
    products,
    loading,
    currentPage,
    totalPages,
    totalProducts,
    setFilters,
    setCurrentPage,
    fetchProducts,
  } = useProductList();

  const { stats, loadingStats, fetchStats } = useProductStats(selectedCompany);

  const handleRefreshAll = useCallback(() => {
    fetchProducts(currentPage);
    fetchStats();
    setSellerRefreshKey((prev) => prev + 1);
  }, [fetchProducts, fetchStats, currentPage]);

  const {
    isOpen: isDeleteOpen,
    onClose: onDeleteClose,
    selectedProduct,
    isDeleting,
    handleDeleteClick,
    confirmDelete,
  } = useProductDelete(handleRefreshAll);

  const {
    isEditOpen,
    onEditClose,
    editProduct,
    handleEditClick,
    handleSubmit,
    initialValues,
    ProductSchema,
    activeCategories,
  } = useProductEdit(handleRefreshAll);

  // Product View Drawer state
  const [selectedViewProduct, setSelectedViewProduct] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Debounced search & filter sync to backend
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters({
        search: searchQuery,
        category: selectedCategory,
        company: selectedCompany,
        stockFilter,
      });
      setCurrentPage(1);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchQuery, selectedCategory, selectedCompany, stockFilter, setFilters, setCurrentPage]);

  // Initial setup
  useEffect(() => {
    offerStore.getAllOffers({ isActive: true });
    if (stores.categoryStore.categories.length === 0) {
      stores.categoryStore.getAllCategories();
    }
  }, [offerStore]);

  const handleViewClick = useCallback((product: any) => {
    setSelectedViewProduct(product);
    setIsViewOpen(true);
  }, []);

  const handleCloseView = useCallback(() => {
    setIsViewOpen(false);
    setSelectedViewProduct(null);
  }, []);

  const handleSellerChange = useCallback((companyId: string) => {
    setSelectedCompany(companyId);
    setCurrentPage(1);
  }, [setCurrentPage]);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  }, [setCurrentPage]);

  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedCompany("all");
    setStockFilter("all");
    setCurrentPage(1);
  }, [setCurrentPage]);

  // Real-time backend summary metrics from dedicated global stats
  const {
    inStock: inStockCount,
    lowStock: lowStockCount,
    outOfStock: outOfStockCount,
    totalProducts: overallTotalProducts,
    withCategory: populatedCategoryCount,
    avgPrice,
  } = stats;

  const stockCounts = useMemo(() => ({
    all: overallTotalProducts,
    in_stock: inStockCount,
    low_stock: lowStockCount,
    out_of_stock: outOfStockCount,
  }), [overallTotalProducts, inStockCount, lowStockCount, outOfStockCount]);

  const tableActions = useMemo(() => ({
    actionBtn: {
      viewKey: {
        showViewButton: true,
        title: "View Product",
        function: handleViewClick,
      },
      editKey: {
        showEditButton: true,
        title: "Edit Product",
        function: handleEditClick,
      },
      deleteKey: {
        showDeleteButton: true,
        function: handleDeleteClick,
      },
    },
    pagination: {
      show: true,
      currentPage,
      totalPages,
      onClick: (page: number) => setCurrentPage(page),
    },
  }), [currentPage, totalPages, handleViewClick, handleEditClick, handleDeleteClick, setCurrentPage]);

  // Page header components memoized
  const headerActions = useMemo(() => (
    <HStack spacing={3}>
      <SearchableSellerSelect
        value={selectedCompany}
        onChange={handleSellerChange}
        refreshTrigger={sellerRefreshKey}
      />
      <Button
        size="sm"
        onClick={handleRefreshAll}
        isDisabled={loading || loadingStats}
        leftIcon={
          <Icon
            as={FiRefreshCw}
            animation={loading || loadingStats ? `${merchantSpin} 1s linear infinite` : undefined}
          />
        }
        {...merchantGhostButtonProps}
      >
        Refresh
      </Button>
    </HStack>
  ), [selectedCompany, handleSellerChange, sellerRefreshKey, handleRefreshAll, loading, loadingStats]);

  const headerMobileActions = useMemo(() => (
    <HStack spacing={2}>
      <SearchableSellerSelect
        value={selectedCompany}
        onChange={handleSellerChange}
        refreshTrigger={sellerRefreshKey}
      />
      <IconButton
        icon={
          <Icon
            as={FiRefreshCw}
            animation={loading || loadingStats ? `${merchantSpin} 1s linear infinite` : undefined}
          />
        }
        aria-label="Refresh products"
        size="sm"
        variant="ghost"
        onClick={handleRefreshAll}
        isDisabled={loading || loadingStats}
      />
    </HStack>
  ), [selectedCompany, handleSellerChange, sellerRefreshKey, handleRefreshAll, loading, loadingStats]);

  const hasActiveFilters = searchQuery.trim() !== "" || selectedCategory !== "all" || selectedCompany !== "all" || stockFilter !== "all";

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
              {loadingStats ? "…" : overallTotalProducts} Total Products
            </MerchantBadge>
            <MerchantBadge tone="success">
              {loadingStats ? "…" : inStockCount} In Stock
            </MerchantBadge>
          </HStack>
        }
        actions={headerActions}
        mobileActions={headerMobileActions}
      />

      {/* Top Stats Grid */}
      <SimpleGrid
        columns={{ base: 2, lg: 4 }}
        spacing={{ base: 3, md: 4 }}
        mb={{ base: 4, md: 6 }}
      >
        <MerchantStatCard
          label="Total Products"
          value={loadingStats ? "…" : overallTotalProducts}
          variant="panel"
          icon={FiBox}
          iconColor={dashboardPalette.accentStrong}
          iconBg="rgba(59, 130, 246, 0.12)"
        />
        <MerchantStatCard
          label="With Category"
          value={loadingStats ? "…" : populatedCategoryCount}
          variant="panel"
          icon={FiLayers}
          iconColor={dashboardPalette.success}
          iconBg="rgba(70, 201, 139, 0.14)"
          valueColor={dashboardPalette.success}
        />
        <MerchantStatCard
          label="In Stock"
          value={loadingStats ? "…" : inStockCount}
          variant="panel"
          icon={FiCheckCircle}
          iconColor={dashboardPalette.accent}
          iconBg="rgba(6, 95, 104, 0.14)"
        />
        <MerchantStatCard
          label="Avg Price"
          value={loadingStats ? "…" : `₹${avgPrice.toLocaleString("en-IN")}`}
          variant="panel"
          icon={FiDollarSign}
          iconColor={dashboardPalette.warning}
          iconBg="rgba(245, 158, 11, 0.14)"
        />
      </SimpleGrid>

      {/* Main Content Area */}
      <Box w="100%">
        {/* Balanced Toolbar */}
        <Flex
          justify="space-between"
          align="center"
          direction={{ base: "column", lg: "row" }}
          gap={3}
          mb={5}
          px={0.5}
        >
          {/* Left Cluster: Filters + Search Bar */}
          <HStack spacing={3} flexWrap="wrap" flex={1} align="center">
            {/* Quick Stock Filter Buttons */}
            <HStack spacing={2} flexWrap="wrap">
              {STOCK_FILTERS.map(({ key, label }) => {
                const isActive = stockFilter === key;
                return (
                  <Button
                    key={key}
                    size="sm"
                    h="38px"
                    px={4}
                    bg={isActive ? "var(--color-primary, #065F68)" : "transparent"}
                    color={isActive ? "white" : "var(--merchant-text-muted, #94a3b8)"}
                    border="1px solid"
                    borderColor={isActive ? "var(--color-primary, #065F68)" : "var(--merchant-border, #1f2e46)"}
                    _hover={{
                      bg: isActive ? "var(--color-primary-hover, #044249)" : "rgba(255, 255, 255, 0.04)",
                      borderColor: "var(--color-primary, #065F68)",
                    }}
                    borderRadius="12px"
                    fontWeight="600"
                    fontSize="xs"
                    onClick={() => setStockFilter(key)}
                  >
                    {label} ({loadingStats ? "…" : stockCounts[key]})
                  </Button>
                );
              })}
            </HStack>

            {/* Search Bar */}
            <InputGroup size="sm" maxW={{ base: "100%", md: "280px", lg: "320px" }}>
              <InputLeftElement pointerEvents="none" h="38px">
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name, sku, brand..."
                borderRadius="12px"
                h="38px"
                fontSize="sm"
                bg="var(--merchant-surface-alt)"
                borderColor="var(--merchant-border-strong)"
                _hover={{ borderColor: "brand.400" }}
                _focus={{
                  borderColor: "brand.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                }}
              />
              {searchQuery && (
                <InputRightElement h="38px">
                  <IconButton
                    aria-label="Clear search"
                    icon={<FiX />}
                    size="xs"
                    variant="ghost"
                    onClick={() => setSearchQuery("")}
                  />
                </InputRightElement>
              )}
            </InputGroup>
          </HStack>

          {/* Right: Category Dropdown & View Mode Switcher */}
          <HStack spacing={2.5} justify="flex-end">
            <SearchableCategorySelect
              value={selectedCategory}
              onChange={handleCategoryChange}
              isSuperAdmin={true}
            />

            {/* View Mode Toggle Switcher */}
            <ButtonGroup isAttached size="sm" variant="outline" borderRadius="12px">
              <IconButton
                aria-label="Grid view"
                icon={<FiGrid size={16} />}
                h="38px"
                px={3.5}
                borderRadius="12px 0 0 12px"
                bg={viewMode === "grid" ? "var(--color-primary, #065F68)" : "var(--merchant-surface-alt)"}
                color={viewMode === "grid" ? "white" : "var(--merchant-text-muted)"}
                borderColor="var(--merchant-border-strong)"
                _hover={{ color: "white", bg: viewMode === "grid" ? "var(--color-primary-hover, #044249)" : "rgba(255, 255, 255, 0.08)" }}
                onClick={() => setViewMode("grid")}
              />
              <IconButton
                aria-label="Table view"
                icon={<FiList size={16} />}
                h="38px"
                px={3.5}
                borderRadius="0 12px 12px 0"
                bg={viewMode === "table" ? "var(--color-primary, #065F68)" : "var(--merchant-surface-alt)"}
                color={viewMode === "table" ? "white" : "var(--merchant-text-muted)"}
                borderColor="var(--merchant-border-strong)"
                _hover={{ color: "white", bg: viewMode === "table" ? "var(--color-primary-hover, #044249)" : "rgba(255, 255, 255, 0.08)" }}
                onClick={() => setViewMode("table")}
              />
            </ButtonGroup>
          </HStack>
        </Flex>

        {/* Content View: Grid OR Table */}
        {loading ? (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, xl: 4 }} spacing={{ base: 3.5, md: 4.5 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Box
                key={i}
                borderRadius="20px"
                border="1px solid"
                borderColor="var(--merchant-border-strong, #1f2e46)"
                p={4}
                bg="var(--merchant-surface-alt, #131d2e)"
              >
                <Skeleton h="180px" borderRadius="16px" mb={3} />
                <Skeleton h="14px" w="40%" mb={2} />
                <Skeleton h="18px" w="85%" mb={2} />
                <Skeleton h="20px" w="60%" />
              </Box>
            ))}
          </SimpleGrid>
        ) : products.length > 0 ? (
          viewMode === "grid" ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, xl: 4 }} spacing={{ base: 3.5, md: 4.5 }}>
              {products.map((product: any) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onView={handleViewClick}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Box
              dir="ltr"
              w="100%"
              sx={{
                "& > div": {
                  bg: "transparent !important",
                  boxShadow: "none !important",
                  borderRadius: "0 !important",
                  "& > div": {
                    px: "0 !important",
                    py: "0 !important",
                    bg: "transparent !important",
                    "& > div": {
                      borderRadius: "16px !important",
                    },
                  },
                },
              }}
            >
              <CustomTable
                columns={ProductColumns}
                data={products}
                loading={loading}
                actions={tableActions}
                serial={{ show: true, text: "S.No." }}
                {...getMerchantTableProps("62vh")}
              />
            </Box>
          )
        ) : (
          /* Empty State */
          <Box
            py={14}
            textAlign="center"
            bg="var(--merchant-surface-alt, #131d2e)"
            borderRadius="20px"
            border="1px dashed"
            borderColor="var(--merchant-border-strong, #1f2e46)"
          >
            <Flex
              w="64px"
              h="64px"
              borderRadius="full"
              bg="rgba(59, 130, 246, 0.12)"
              align="center"
              justify="center"
              mx="auto"
              mb={3}
            >
              <Icon as={FiBox} boxSize={7} color="brand.400" />
            </Flex>
            <Text fontSize="md" fontWeight="700" color="var(--merchant-text, #ffffff)">
              No products found
            </Text>
            <Text fontSize="sm" color="var(--merchant-text-muted, #94a3b8)" mt={1} maxW="sm" mx="auto">
              {hasActiveFilters
                ? "Try clearing your search query or selecting a different filter."
                : "No products are currently recorded in the marketplace."}
            </Text>
            {hasActiveFilters && (
              <Button
                size="sm"
                variant="outline"
                borderRadius="12px"
                mt={3.5}
                borderColor="var(--merchant-border-strong, #1f2e46)"
                color="var(--merchant-text, #ffffff)"
                onClick={handleResetFilters}
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
            borderColor="var(--merchant-border-strong, #1f2e46)"
            align="center"
            justify="space-between"
            flexWrap="wrap"
            gap={3}
          >
            <Text fontSize="xs" color="var(--merchant-text-muted, #94a3b8)" fontWeight="600">
              Page {currentPage} of {totalPages} ({totalProducts} total products)
            </Text>

            <HStack spacing={2}>
              <Button
                size="sm"
                variant="outline"
                borderRadius="12px"
                borderColor="var(--merchant-border-strong, #1f2e46)"
                color="var(--merchant-text, #ffffff)"
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
                      borderRadius="10px"
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
                borderRadius="12px"
                borderColor="var(--merchant-border-strong, #1f2e46)"
                color="var(--merchant-text, #ffffff)"
                rightIcon={<FiChevronRight />}
                isDisabled={currentPage >= totalPages || loading}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </HStack>
          </Flex>
        )}
      </Box>

      {/* Delete Confirmation Modal */}
      {selectedProduct && (
        <ConfirmationModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          onConfirm={confirmDelete}
          isLoading={isDeleting}
          title="Delete Product"
          message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
          confirmText="Delete"
        />
      )}

      {/* Product Edit / Creation Form */}
      {isEditOpen && (
        <ProductForm
          isOpen={isEditOpen}
          onClose={onEditClose}
          isEdit={Boolean(editProduct)}
          onSubmit={handleSubmit}
          initialValues={initialValues}
          validationSchema={ProductSchema}
          categories={activeCategories}
        />
      )}

      {/* Product Detail View Drawer */}
      <ProductViewDrawer
        isOpen={isViewOpen}
        onClose={handleCloseView}
        product={selectedViewProduct}
        onEdit={(prod) => {
          handleCloseView();
          handleEditClick(prod);
        }}
      />
    </MerchantPageShell>
  );
});

export default SuperAdminProductsPage;
