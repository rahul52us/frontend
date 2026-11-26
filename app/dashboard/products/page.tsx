"use client";

import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
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
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiBox,
  FiCheckCircle,
  FiDollarSign,
  FiGrid,
  FiLayers,
  FiList,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrendingUp,
  FiX,
} from "react-icons/fi";
import * as Yup from "yup";
import ConfirmationModal from "../../component/common/ConfirmationModal/ConfirmationModal";
import CustomTable from "../../component/config/component/CustomTable/CustomTable";
import { useCartToast } from "../../hooks/useCartToast";
import { dashboardPalette } from "../../layouts/dashboardLayout/dashboardPalette";
import stores from "../../store/stores";
import CompanyRequiredState from "../components/common/CompanyRequiredState";
import {
  getMerchantTableProps,
  MerchantBadge,
  merchantGhostButtonProps,
  MerchantPageHeader,
  MerchantPageShell,
  merchantPrimaryButtonProps,
  merchantSpin,
  MerchantStatCard,
} from "../components/common/merchantDashboardUI";
import ProductCard from "../super-admin/products/components/ProductCard";
import { ProductColumns } from "../super-admin/products/components/ProductColumns";
import ProductDetailView from "./components/ProductDetailView";
import ProductForm from "./components/ProductForm";
import { SearchableCategorySelect } from "../components/common/SearchableCategorySelect";
import { DEFAULT_LOW_STOCK_THRESHOLD } from "./utils/stockThreshold";

const emptyToUndefined = (value: any, originalValue: any) =>
  originalValue === "" || originalValue === null || originalValue === undefined ? undefined : value;

const optionalNumberField = (label: string) =>
  Yup.number().transform(emptyToUndefined).typeError(`${label} must be a valid number`);

const requiredNumberField = (label: string) =>
  Yup.number()
    .transform(emptyToUndefined)
    .typeError(`${label} must be a valid number`)
    .required(`${label} is required`);

const ProductSchema = Yup.object({
  name: Yup.string().trim().required("Product name is required"),
  category: Yup.string().trim().required("Category is required"),
  subCategories: Yup.array().of(Yup.string().trim().required("Subcategory is required")),
  price: requiredNumberField("Price").moreThan(0, "Price must be greater than 0"),
  description: Yup.string().trim().optional(),
  stock: requiredNumberField("Stock quantity")
    .integer("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),
  lowStockThreshold: requiredNumberField("Low stock threshold")
    .integer("Low stock threshold must be a whole number")
    .min(1, "Low stock threshold must be at least 1"),
  brand: Yup.string().trim().optional(),
  sku: Yup.string().trim().optional(),
  weight: Yup.string().trim().optional(),
  productDetails: Yup.array().of(
    Yup.object({
      key: Yup.string().trim().required("Specification label is required"),
      value: Yup.string().trim().required("Specification value is required"),
    })
  ),
  information: Yup.array().of(
    Yup.object({
      key: Yup.string().trim().required("Information label is required"),
      value: Yup.string().trim().required("Information value is required"),
    })
  ),
  discountPrice: optionalNumberField("Discount price")
    .min(0, "Discount price cannot be negative")
    .test("discount-not-greater-than-price", "Discount price cannot be greater than the base price", function (value) {
      const { price } = this.parent;
      if (value !== undefined && price !== undefined && value > price) {
        return false;
      }
      return true;
    }),
});

const defaultProductValues = {
  name: "",
  category: "",
  subCategories: [],
  price: "",
  discountPrice: "",
  brand: "",
  sku: "",
  weight: "",
  description: "",
  stock: "",
  lowStockThreshold: DEFAULT_LOW_STOCK_THRESHOLD,
  productDetails: [],
  information: [],
  tags: [],
  offer: "",
  freebieProducts: [],
  isFeatured: false,
  isActive: true,
  images: [],
};

const getParentCategoryId = (category: any) => {
  if (!category) return null;
  if (typeof category.parent === "string") return category.parent;
  if (typeof category.parent === "object" && category.parent?._id) return String(category.parent._id);
  if (typeof category.parentCategory === "string") return category.parentCategory;
  if (typeof category.parentCategory === "object" && category.parentCategory?._id) return String(category.parentCategory._id);
  return null;
};

const getParentCategoryName = (category: any) => {
  if (!category) return "";
  if (typeof category.parent === "object" && category.parent?.name) return String(category.parent.name);
  if (typeof category.parentCategory === "object" && category.parentCategory?.name) return String(category.parentCategory.name);
  return "";
};

const ProductsPage = observer(() => {
  const { auth, shopStore, categoryStore, offerStore } = stores;
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const toast = useToast();
  const { showAddToCartToast } = useCartToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Toolbar & filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState<"all" | "in_stock" | "low_stock" | "out_of_stock">("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Data state
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [summary, setSummary] = useState({
    total: 0,
    inStock: 0,
    featured: 0,
    low: 0,
  });

  // Action states
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [detailProduct, setDetailProduct] = useState<any | null>(null);

  const isSuperAdmin = auth.user?.role === "superAdmin" || auth.user?.type === "superAdmin";
  const isAdmin = isSuperAdmin || auth.user?.role === "admin" || auth.user?.type === "admin";
  const hasCompany = Boolean(auth.company || auth.user?.company);

  const shopCompany = auth.company || auth.user?.company;
  const reviewStatus = typeof shopCompany === "object" ? shopCompany?.reviewStatus : null;
  const isShopApproved = isAdmin || reviewStatus === "approved";

  // Shop categories allowed for seller
  const shopCategoryTokens = useMemo(() => {
    const rawCategories = auth.company?.categories || auth.user?.company?.categories || [];
    return new Set(
      rawCategories
        .map((entry: any) => {
          if (!entry) return "";
          if (typeof entry === "string") return entry.trim().toLowerCase();
          return String(entry.name || entry.slug || entry._id || "").trim().toLowerCase();
        })
        .filter(Boolean)
    );
  }, [auth.company?.categories, auth.user?.company?.categories]);

  const allowedRootCategories = useMemo(() => {
    const rootCategories = categoryStore.categories.filter(
      (category: any) => !category.parent && category.isActive !== false
    );
    if (shopCategoryTokens.size === 0) return rootCategories;
    return rootCategories.filter((category: any) => {
      const idMatch = shopCategoryTokens.has(String(category._id).toLowerCase());
      const nameMatch = shopCategoryTokens.has(String(category.name || "").trim().toLowerCase());
      const slugMatch = shopCategoryTokens.has(String(category.slug || "").trim().toLowerCase());
      return idMatch || nameMatch || slugMatch;
    });
  }, [categoryStore.categories, shopCategoryTokens]);

  const sellerProductCategories = useMemo(() => {
    const activeCategories = categoryStore.categories.filter((category: any) => category.isActive !== false);
    if (shopCategoryTokens.size === 0) return activeCategories;
    const allowedIds = new Set(allowedRootCategories.map((c: any) => String(c._id)));
    const allowedNames = new Set(allowedRootCategories.map((c: any) => String(c.name || "").toLowerCase()));

    return activeCategories.filter((category: any) => {
      const parentId = getParentCategoryId(category);
      const parentName = getParentCategoryName(category);
      const isAllowedRoot = !parentId && (allowedIds.has(String(category._id)) || allowedNames.has(String(category.name || "").toLowerCase()));
      const isAllowedChild = Boolean(parentId) && (allowedIds.has(String(parentId)) || allowedNames.has(String(parentName || "").toLowerCase()));
      return isAllowedRoot || isAllowedChild;
    });
  }, [allowedRootCategories, categoryStore.categories, shopCategoryTokens]);

  // Fetch shop products
  const fetchProducts = useCallback(
    async (page = 1, search = searchQuery, cat = selectedCategory, stock = stockFilter) => {
      const companyId =
        auth.company?._id ||
        auth.company ||
        auth.user?.company?._id ||
        auth.user?.company;

      if (!companyId) {
        setProducts([]);
        setTotalProducts(0);
        setTotalPages(1);
        setCurrentPage(1);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const payload: any = {
          company: companyId,
          page,
          limit: 12,
        };
        if (search.trim()) payload.search = search.trim();
        if (cat !== "all") payload.category = cat;

        const response = await shopStore.getShopProducts(payload);
        const nextProducts = response.data?.products || [];
        const nextSummary = response.data?.summary || {};

        setProducts(nextProducts);
        setCurrentPage(page);
        setTotalPages(response.data?.totalPages || 1);
        setTotalProducts(response.data?.total || 0);
        setSummary({
          total: Number(nextSummary.total || response.data?.total || 0),
          inStock: Number(nextSummary.inStock || 0),
          featured: Number(nextSummary.featured || 0),
          low: Number(nextSummary.low || 0),
        });
      } catch (error: any) {
        toast({
          title: "Error fetching products",
          description: error?.message || "We could not load your products.",
          status: "error",
          duration: 3500,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [auth.company, auth.user?.company, searchQuery, selectedCategory, stockFilter, shopStore, toast]
  );

  useEffect(() => {
    if (auth.company || auth.user?.company || isSuperAdmin) {
      categoryStore.getAllCategories();
      offerStore.getAllOffers({ isActive: true });
    }
  }, [auth.company, auth.user?.company, categoryStore, isSuperAdmin, offerStore]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProducts(1, searchQuery, selectedCategory, stockFilter);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery, selectedCategory, stockFilter, fetchProducts]);

  // Stock filter in-memory if needed
  const filteredProducts = useMemo(() => {
    if (stockFilter === "all") return products;
    if (stockFilter === "in_stock") return products.filter((p) => (p.stock ?? p.quantity ?? 0) > 0);
    if (stockFilter === "low_stock") return products.filter((p) => (p.stock ?? p.quantity ?? 0) > 0 && (p.stock ?? p.quantity ?? 0) <= 5);
    if (stockFilter === "out_of_stock") return products.filter((p) => (p.stock ?? p.quantity ?? 0) <= 0);
    return products;
  }, [products, stockFilter]);

  const inStockCount = summary.inStock;
  const lowStockCount = summary.low;
  const outOfStockCount = Math.max(0, totalProducts - inStockCount);

  // Edit / Form management
  const initialValues = useMemo(() => {
    if (!selectedProductId) return defaultProductValues;
    const item = products.find((p) => String(p._id) === String(selectedProductId));
    if (!item) return defaultProductValues;
    return {
      ...defaultProductValues,
      ...item,
      category: item.category?._id || item.category || "",
      subCategories: (item.subCategories || []).map((sub: any) => sub?._id || sub),
      offer: item.offer?._id || item.offer || "",
      freebieProducts: (item.freebieProducts || []).map((fp: any) => fp?._id || fp),
    };
  }, [products, selectedProductId]);

  const handleOpenCreate = () => {
    if (!isShopApproved) {
      toast({
        title: "Shop Under Review",
        description:
          "Your shop is currently waiting for admin approval. You can create products once your shop is approved.",
        status: "warning",
        duration: 4500,
        isClosable: true,
      });
      return;
    }
    setSelectedProductId(null);
    setDetailProduct(null);
    onOpen();
  };

  const handleEdit = (product: any) => {
    setSelectedProductId(product?._id || null);
    setDetailProduct(null);
    onOpen();
  };

  const handleDelete = (product: any) => {
    setProductToDelete(product);
  };

  const handleView = (product: any) => {
    setDetailProduct(product);
  };

  const confirmDelete = async () => {
    if (!productToDelete?._id) return;
    setIsDeleting(true);
    try {
      await shopStore.deleteProduct(productToDelete._id);
      toast({
        title: "Product deleted",
        description: "The product has been removed successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setProductToDelete(null);
      await fetchProducts(currentPage);
    } catch (error: any) {
      toast({
        title: "Error deleting product",
        description: error?.message || "Could not delete product.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (values: any, actions: any) => {
    try {
      if (!selectedProductId && !isShopApproved) {
        toast({
          title: "Shop Under Review",
          description:
            "Your shop is currently waiting for admin approval. You can create products once your shop is approved.",
          status: "warning",
          duration: 4500,
          isClosable: true,
        });
        actions.setSubmitting(false);
        return;
      }

      const companyId =
        auth.company?._id ||
        auth.company ||
        auth.user?.company?._id ||
        auth.user?.company;

      const payload = {
        ...values,
        company: companyId,
        price: Number(values.price),
        stock: Number(values.stock),
        lowStockThreshold: Number(values.lowStockThreshold || DEFAULT_LOW_STOCK_THRESHOLD),
      };

      let response: any;
      if (selectedProductId) {
        response = await shopStore.updateProduct(selectedProductId, payload);
      } else {
        response = await shopStore.createProduct(payload);
      }

      if (response?.status === "success" || response?.statusCode === 200 || response?.statusCode === 201) {
        showAddToCartToast(
          { name: payload.name, image: "", images: [] },
          selectedProductId ? "Product Updated" : "Product Created",
          selectedProductId ? "Product updated successfully." : "Product created successfully."
        );
        actions.resetForm();
        onClose();
        setSelectedProductId(null);
        await fetchProducts(selectedProductId ? currentPage : 1);
      }
    } catch (error: any) {
      toast({
        title: selectedProductId ? "Error updating product" : "Error creating product",
        description: error?.response?.data?.message || error?.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      actions.setSubmitting(false);
    }
  };

  const tableActions = useMemo(() => ({
    actionBtn: {
      viewKey: {
        showViewButton: true,
        title: "View Product",
        function: handleView,
      },
      editKey: {
        showEditButton: true,
        title: "Edit Product",
        function: handleEdit,
      },
      deleteKey: {
        showDeleteButton: true,
        function: (row: any) => handleDelete(row),
      },
    },
    pagination: {
      show: true,
      currentPage: currentPage,
      totalPages: totalPages,
      onClick: (page: number) => fetchProducts(page),
    },
  }), [currentPage, totalPages, fetchProducts]);

  if (!isSuperAdmin && !hasCompany) {
    return <CompanyRequiredState />;
  }

  return (
    <MerchantPageShell>
      {/* ------------------------------ Page Header ------------------------------ */}
      <MerchantPageHeader
        icon={FiBox}
        title="Product Oversight"
        description="Review inventory, audit product cards, and inspect catalog quality in your store."
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
          <HStack spacing={2}>
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
            <Button
              size="sm"
              leftIcon={<FiPlus />}
              onClick={handleOpenCreate}
              {...merchantPrimaryButtonProps}
              h="38px"
              px={4}
              opacity={!isShopApproved ? 0.65 : 1}
              title={!isShopApproved ? "Shop approval required to add products" : undefined}
            >
              Add Product
            </Button>
          </HStack>
        }
        mobileActions={
          <HStack spacing={2}>
            <IconButton
              icon={<Icon as={FiRefreshCw} animation={loading ? `${merchantSpin} 1s linear infinite` : undefined} />}
              aria-label="Refresh"
              size="sm"
              variant="ghost"
              onClick={() => fetchProducts(currentPage)}
              isDisabled={loading}
            />
            <IconButton
              icon={<FiPlus />}
              aria-label="Add"
              size="sm"
              {...merchantPrimaryButtonProps}
              onClick={handleOpenCreate}
              opacity={!isShopApproved ? 0.65 : 1}
              title={!isShopApproved ? "Shop approval required to add products" : undefined}
            />
          </HStack>
        }
      />

      {/* ------------------------------ Top Stats Grid ------------------------------ */}
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
          value={products.filter((p) => p.category).length}
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
          label="Low Stock Items"
          value={lowStockCount}
          variant="panel"
          icon={FiTrendingUp}
          iconColor={dashboardPalette.warning}
          iconBg="rgba(245, 158, 11, 0.14)"
          valueColor={dashboardPalette.warning}
        />
      </SimpleGrid>

      {/* ------------------------------ Main Content Area ------------------------------ */}
      <Box w="100%">
        {/* Clean Balanced Toolbar: Filters + Search + Category + View Switcher */}
        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={3}
          mb={5}
          px={0.5}
        >
          {/* Top row on Mobile: Horizontal scrollable stock chips */}
          <Box
            w={{ base: "100%", lg: "auto" }}
            overflowX="auto"
            py={0.5}
            sx={{
              "&::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
            }}
          >
            <HStack spacing={2} minW="max-content">
              <Button
                size="sm"
                h="36px"
                px={3.5}
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
                flexShrink={0}
                onClick={() => setStockFilter("all")}
              >
                All ({totalProducts})
              </Button>
              <Button
                size="sm"
                h="36px"
                px={3.5}
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
                flexShrink={0}
                onClick={() => setStockFilter("in_stock")}
              >
                In Stock ({inStockCount})
              </Button>
              <Button
                size="sm"
                h="36px"
                px={3.5}
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
                flexShrink={0}
                onClick={() => setStockFilter("low_stock")}
              >
                Low Stock ({lowStockCount})
              </Button>
              <Button
                size="sm"
                h="36px"
                px={3.5}
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
                flexShrink={0}
                onClick={() => setStockFilter("out_of_stock")}
              >
                Out of Stock ({outOfStockCount})
              </Button>
            </HStack>
          </Box>

          {/* Search Input (Full width on mobile, adjacent on desktop) */}
          <Box flex={1} w={{ base: "100%", lg: "auto" }}>
            <InputGroup size="sm" w="100%">
              <InputLeftElement pointerEvents="none" h="38px">
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name, brand..."
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
          </Box>

          {/* Right: Category Dropdown & View Mode Switcher */}
          <Flex
            justify={{ base: "space-between", sm: "flex-end" }}
            align="center"
            gap={2.5}
            w={{ base: "100%", lg: "auto" }}
          >
            <Box flex={{ base: 1, sm: "initial" }}>
              <SearchableCategorySelect
                value={selectedCategory}
                onChange={(categoryId) => setSelectedCategory(categoryId)}
                allowedRootCategories={allowedRootCategories}
                isSuperAdmin={isSuperAdmin}
              />
            </Box>

            {/* View Mode Toggle Switcher */}
            <ButtonGroup isAttached size="sm" variant="outline" borderRadius="12px" flexShrink={0}>
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
          </Flex>
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
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
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
                : "No products are currently recorded in your shop."}
            </Text>
            {(searchQuery || selectedCategory !== "all" || stockFilter !== "all") ? (
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
                Clear Filters
              </Button>
            ) : (
              <Button
                size="sm"
                leftIcon={<FiPlus />}
                borderRadius="12px"
                mt={3.5}
                {...merchantPrimaryButtonProps}
                onClick={handleOpenCreate}
              >
                Add Your First Product
              </Button>
            )}
          </Box>
        )}
      </Box>

      {/* Floating Action Button (Mobile) */}
      <IconButton
        aria-label="Add product"
        display={{ base: "flex", md: "none" }}
        position="fixed"
        right={4}
        bottom="calc(130px + env(safe-area-inset-bottom, 0px))"
        zIndex={110}
        h="52px"
        w="52px"
        minW="52px"
        borderRadius="full"
        color="white"
        icon={<FiPlus size={20} />}
        boxShadow="0 18px 34px rgba(6, 95, 104, 0.35)"
        {...merchantPrimaryButtonProps}
        onClick={handleOpenCreate}
      />

      {/* Product Form Modal/Drawer - only mounted when open to prevent DOM overhead and scroll leaks */}
      {isOpen && (
        <ProductForm
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setSelectedProductId(null);
          }}
          initialValues={initialValues}
          validationSchema={ProductSchema}
          onSubmit={handleSubmit}
          categories={sellerProductCategories}
          offersList={offerStore.offers}
          products={products}
          isEdit={Boolean(selectedProductId)}
        />
      )}

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmButtonProps={{ colorScheme: "red" }}
        isLoading={isDeleting}
      />

      {/* View Drawer */}
      {Boolean(isDesktop && detailProduct) && (
        <Drawer
          isOpen={Boolean(isDesktop && detailProduct)}
          placement="right"
          onClose={() => setDetailProduct(null)}
          size="xl"
          blockScrollOnMount={false}
        >
          <DrawerOverlay bg="rgba(15, 23, 42, 0.28)" backdropFilter="blur(10px)" />
          <DrawerContent maxW="720px" bg="transparent" boxShadow="none">
            <DrawerBody p={0}>
              {detailProduct ? <ProductDetailView product={detailProduct} onBack={() => setDetailProduct(null)} /> : null}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </MerchantPageShell>
  );
});

export default ProductsPage;
