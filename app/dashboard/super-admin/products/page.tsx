"use client";

import {
  Badge,
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
  Select,
  SimpleGrid,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useState } from "react";
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
import { useProductDelete } from "./hooks/useProductDelete";
import { useProductEdit } from "./hooks/useProductEdit";
import { useProductList } from "./hooks/useProductList";

const SuperAdminProductsPage = observer(() => {
  const { offerStore } = stores;
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState<"all" | "in_stock" | "low_stock" | "out_of_stock">("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const {
    products,
    loading,
    currentPage,
    totalPages,
    totalProducts,
    summary,
    setFilters,
    setCurrentPage,
    fetchProducts,
  } = useProductList({
    search: searchQuery,
    category: selectedCategory,
    stockFilter,
  });

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

  // Debounced search sync to backend
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters({
        search: searchQuery,
        category: selectedCategory,
        stockFilter,
      });
      setCurrentPage(1);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchQuery, selectedCategory, stockFilter, setFilters, setCurrentPage]);

  React.useEffect(() => {
    offerStore.getAllOffers({ isActive: true });
    if (stores.categoryStore.categories.length === 0) {
      stores.categoryStore.getAllCategories();
    }
  }, [offerStore]);

  const handleViewClick = (product: any) => {
    setSelectedViewProduct(product);
    setIsViewOpen(true);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setSelectedViewProduct(null);
  };

  // Products directly from backend result (server-side filtered)
  const filteredProducts = products;

  // Real-time backend summary metrics
  const inStockCount = summary.inStock;
  const lowStockCount = summary.low;
  const outOfStockCount = Math.max(0, totalProducts - inStockCount);

  const populatedCategoryCount = useMemo(() => {
    return products.filter((p: any) => Boolean(p.category)).length;
  }, [products]);

  const totalValue = useMemo(() => {
    return products.reduce((acc: number, p: any) => {
      const price =
        typeof p.price === "number" ? p.price : parseFloat(p.price) || 0;
      return acc + price;
    }, 0);
  }, [products]);

  const avgPrice =
    products.length > 0 ? Math.round(totalValue / products.length) : 0;

  // Extract category options from global categoryStore + active product categories
  const categoryOptions = useMemo(() => {
    const map = new Map<string, string>();
    stores.categoryStore.categories.forEach((c: any) => {
      if (c._id && c.name) {
        map.set(String(c._id), c.name);
      }
    });
    products.forEach((p: any) => {
      if (p.category?._id && p.category?.name) {
        map.set(String(p.category._id), p.category.name);
      }
    });
    return Array.from(map.entries());
  }, [products]);

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
        function: (row: any) => handleDeleteClick(row),
      },
    },
    pagination: {
      show: true,
      currentPage: currentPage,
      totalPages: totalPages,
      onClick: (page: number) => setCurrentPage(page),
    },
  }), [currentPage, totalPages]);

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

      {/* Main Content Area */}
      <Box w="100%">
        {/* Clean Balanced Toolbar: [Left: Stock Filter Buttons + Search Bar adjacent] ----- [Right: Category & View Switcher] */}
        <Flex
          justify="space-between"
          align="center"
          direction={{ base: "column", lg: "row" }}
          gap={3}
          mb={5}
          px={0.5}
        >
          {/* Left Cluster: Filters + Search Bar starting immediately next to them */}
          <HStack spacing={3} flexWrap="wrap" flex={1} align="center">
            {/* Quick Stock Filter Buttons */}
            <HStack spacing={2} flexWrap="wrap">
              <Button
                size="sm"
                h="38px"
                px={4}
                bg={stockFilter === "all" ? "var(--color-primary, #065F68)" : "transparent"}
                color={stockFilter === "all" ? "white" : "var(--merchant-text-muted, #94a3b8)"}
                border="1px solid"
                borderColor={stockFilter === "all" ? "var(--color-primary, #065F68)" : "var(--merchant-border, #1f2e46)"}
                _hover={{
                  bg: stockFilter === "all" ? "var(--color-primary-hover, #044249)" : "rgba(255, 255, 255, 0.04)",
                  borderColor: "var(--color-primary, #065F68)",
                }}
                borderRadius="12px"
                fontWeight="600"
                fontSize="xs"
                onClick={() => setStockFilter("all")}
              >
                All ({totalProducts})
              </Button>
              <Button
                size="sm"
                h="38px"
                px={4}
                bg={stockFilter === "in_stock" ? "var(--color-primary, #065F68)" : "transparent"}
                color={stockFilter === "in_stock" ? "white" : "var(--merchant-text-muted, #94a3b8)"}
                border="1px solid"
                borderColor={stockFilter === "in_stock" ? "var(--color-primary, #065F68)" : "var(--merchant-border, #1f2e46)"}
                _hover={{
                  bg: stockFilter === "in_stock" ? "var(--color-primary-hover, #044249)" : "rgba(255, 255, 255, 0.04)",
                  borderColor: "var(--color-primary, #065F68)",
                }}
                borderRadius="12px"
                fontWeight="600"
                fontSize="xs"
                onClick={() => setStockFilter("in_stock")}
              >
                In Stock ({inStockCount})
              </Button>
              <Button
                size="sm"
                h="38px"
                px={4}
                bg={stockFilter === "low_stock" ? "var(--color-primary, #065F68)" : "transparent"}
                color={stockFilter === "low_stock" ? "white" : "var(--merchant-text-muted, #94a3b8)"}
                border="1px solid"
                borderColor={stockFilter === "low_stock" ? "var(--color-primary, #065F68)" : "var(--merchant-border, #1f2e46)"}
                _hover={{
                  bg: stockFilter === "low_stock" ? "var(--color-primary-hover, #044249)" : "rgba(255, 255, 255, 0.04)",
                  borderColor: "var(--color-primary, #065F68)",
                }}
                borderRadius="12px"
                fontWeight="600"
                fontSize="xs"
                onClick={() => setStockFilter("low_stock")}
              >
                Low Stock ({lowStockCount})
              </Button>
              <Button
                size="sm"
                h="38px"
                px={4}
                bg={stockFilter === "out_of_stock" ? "var(--color-primary, #065F68)" : "transparent"}
                color={stockFilter === "out_of_stock" ? "white" : "var(--merchant-text-muted, #94a3b8)"}
                border="1px solid"
                borderColor={stockFilter === "out_of_stock" ? "var(--color-primary, #065F68)" : "var(--merchant-border, #1f2e46)"}
                _hover={{
                  bg: stockFilter === "out_of_stock" ? "var(--color-primary-hover, #044249)" : "rgba(255, 255, 255, 0.04)",
                  borderColor: "var(--color-primary, #065F68)",
                }}
                borderRadius="12px"
                fontWeight="600"
                fontSize="xs"
                onClick={() => setStockFilter("out_of_stock")}
              >
                Out of Stock ({outOfStockCount})
              </Button>
            </HStack>

            {/* Search Bar immediately next to the filter buttons */}
            <InputGroup size="sm" maxW={{ base: "100%", md: "280px", lg: "320px" }}>
              <InputLeftElement pointerEvents="none" h="38px">
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name, shop..."
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
            {categoryOptions.length > 0 && (
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                borderRadius="12px"
                h="38px"
                size="sm"
                maxW="170px"
                fontSize="xs"
                fontWeight="600"
                bg="var(--merchant-surface-alt)"
                borderColor="var(--merchant-border-strong)"
                color="var(--merchant-text)"
              >
                <option value="all" style={{ background: "#0d1522", color: "#ffffff" }}>
                  All Categories
                </option>
                {categoryOptions.map(([id, name]) => (
                  <option key={id} value={id} style={{ background: "#0d1522", color: "#ffffff" }}>
                    {name}
                  </option>
                ))}
              </Select>
            )}

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
        ) : filteredProducts.length > 0 ? (
          viewMode === "grid" ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, xl: 4 }} spacing={{ base: 3.5, md: 4.5 }}>
              {filteredProducts.map((product: any) => (
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
                data={filteredProducts}
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
              {searchQuery || selectedCategory !== "all" || stockFilter !== "all"
                ? "Try clearing your search query or selecting a different filter."
                : "No products are currently recorded in the marketplace."}
            </Text>
            {(searchQuery || selectedCategory !== "all" || stockFilter !== "all") && (
              <Button
                size="sm"
                variant="outline"
                borderRadius="12px"
                mt={3.5}
                borderColor="var(--merchant-border-strong, #1f2e46)"
                color="var(--merchant-text, #ffffff)"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setStockFilter("all");
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
