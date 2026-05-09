"use client";

import {
  Badge,
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Grid,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaBoxOpen,
  FaChartLine,
  FaChevronDown,
  FaFilter,
  FaFire,
  FaLayerGroup,
  FaPlus,
  FaSearch,
} from "react-icons/fa";
import * as Yup from "yup";
import { useCartToast } from "../../hooks/useCartToast";
import { dashboardPalette } from "../../layouts/dashboardLayout/dashboardPalette";
import stores from "../../store/stores";
import CompanyRequiredState from "../components/common/CompanyRequiredState";
import DeleteProductDialog from "./components/DeleteProductDialog";
import ProductCard from "./components/ProductCard";
import ProductDetailView from "./components/ProductDetailView";
import ProductForm from "./components/ProductForm";
import { ProductStatCard } from "./components/ProductStatCard";

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
      if (value === undefined || value === null) {
        return true;
      }

      const { price } = this.parent;
      if (price === undefined || price === null) {
        return true;
      }

      return Number(value) <= Number(price);
    }),
  taxRate: optionalNumberField("Tax rate")
    .min(0, "Tax rate cannot be negative")
    .max(100, "Tax rate cannot be more than 100"),
  isFeatured: Yup.boolean(),
  tags: Yup.array().of(Yup.string().trim()),
  variants: Yup.array().of(
    Yup.object({
      name: Yup.string().trim().required("Variant name is required"),
      options: Yup.array()
        .of(Yup.string().trim().required("Variant option is required"))
        .min(1, "At least one option is required"),
    })
  ),
  offers: Yup.array().of(Yup.object()).optional(),
  images: Yup.array().min(1, "At least one image is required"),
});

const numericOfferKeys = new Set([
  "discountPercentage",
  "maxDiscountAmount",
  "minCartValue",
  "buyQuantity",
  "getQuantity",
]);

const normalizeNumberish = (value: any) => {
  if (value === "" || value === null || value === undefined) {
    return "";
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? value : parsed;
};

const normalizeRowPairs = (rows: any[] = []) =>
  rows
    .map((row) => ({
      key: String(row?.key || "").trim(),
      value: String(row?.value || "").trim(),
    }))
    .filter((row) => row.key || row.value);

const normalizeProductPayload = (values: any) => ({
  ...values,
  name: String(values.name || "").trim(),
  description: String(values.description || "").trim(),
  sku: String(values.sku || "").trim(),
  brand: String(values.brand || "").trim(),
  weight: String(values.weight || "").trim(),
  price: normalizeNumberish(values.price),
  stock: normalizeNumberish(values.stock),
  taxRate: normalizeNumberish(values.taxRate),
  discountPrice: normalizeNumberish(values.discountPrice),
  tags: (values.tags || []).map((tag: string) => tag.trim()).filter(Boolean),
  subCategories: (values.subCategories || []).filter(Boolean),
  productDetails: normalizeRowPairs(values.productDetails),
  information: normalizeRowPairs(values.information),
  variants: (values.variants || [])
    .map((variant: any) => ({
      ...variant,
      name: String(variant?.name || "").trim(),
      options: (variant?.options || []).map((option: string) => option.trim()).filter(Boolean),
    }))
    .filter((variant: any) => variant.name || variant.options.length > 0),
  offers: (values.offers || []).map((offer: any) => ({
    ...offer,
    config: Object.fromEntries(
      Object.entries(offer?.config || {}).map(([key, value]) => [
        key,
        numericOfferKeys.has(key) ? normalizeNumberish(value) : value,
      ])
    ),
  })),
});

const mapProductToFormValues = (product: any) => {
  if (!product) {
    return {
      name: "",
      description: "",
      sku: "",
      category: "",
      price: "",
      stock: 0,
      brand: "",
      weight: "",
      productDetails: [],
      information: [],
      images: [],
      subCategories: [],
      discountPrice: "",
      taxRate: 18,
      isFeatured: false,
      tags: [],
      variants: [],
      offers: [],
    };
  }

  return {
    ...product,
    category: typeof product.category === "object" ? product.category?._id : product.category || "",
    subCategories: Array.isArray(product.subCategories)
      ? product.subCategories.map((subCategory: any) =>
          typeof subCategory === "object" ? subCategory?._id : subCategory
        )
      : [],
    images: product.images || [],
    productDetails: product.productDetails
      ? Object.entries(product.productDetails).map(([key, value]) => ({ key, value }))
      : [],
    information: product.information
      ? Object.entries(product.information).map(([key, value]) => ({ key, value }))
      : [],
    price: product.price ?? "",
    stock: product.stock ?? 0,
    discountPrice: product.discountPrice ?? "",
    taxRate: product.taxRate ?? 18,
    isFeatured: Boolean(product.isFeatured),
    tags: product.tags || [],
    variants: product.variants || [],
    offers: product.offers || [],
  };
};

const ProductsPage = observer(() => {
  const toast = useToast();
  const { showAddToCartToast } = useCartToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { shopStore, auth, categoryStore, offerStore } = stores;

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [detailProductId, setDetailProductId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showInactive, setShowInactive] = useState(false);

  const hasCompany = Boolean(auth.user?.company?._id || auth.user?.company || auth.company);
  const isSuperAdmin = auth.user?.type === "superAdmin" || auth.user?.role === "superAdmin";
  const isDesktop = useBreakpointValue({ base: false, md: true }) ?? false;

  const pageBg = useColorModeValue("transparent", "transparent");
  const surface = useColorModeValue("white", dashboardPalette.surface);
  const surfaceMuted = useColorModeValue("#F8FAFC", dashboardPalette.surfaceAlt);
  const border = useColorModeValue("#E2E8F0", dashboardPalette.border);
  const borderStrong = useColorModeValue("#CBD5E1", dashboardPalette.borderStrong);
  const text = useColorModeValue("#0F172A", dashboardPalette.text);
  const textMuted = useColorModeValue("#64748B", dashboardPalette.textMuted);
  const textSoft = useColorModeValue("#94A3B8", dashboardPalette.textSoft);
  const accent = useColorModeValue("#2563EB", dashboardPalette.accent);
  const accentStrong = useColorModeValue("#1D4ED8", dashboardPalette.accentStrong);
  const accentSoft = useColorModeValue("rgba(37, 99, 235, 0.08)", dashboardPalette.accentSoft);
  const heroBadgeBg = useColorModeValue("rgba(37, 99, 235, 0.10)", dashboardPalette.accentSoft);
  const heroBadgeColor = useColorModeValue("#1D4ED8", dashboardPalette.accentStrong);
  const shadow = useColorModeValue("0 22px 44px rgba(37, 99, 235, 0.12)", "0 28px 54px rgba(2, 6, 23, 0.34)");

  const selectedProduct = useMemo(
    () => products.find((product) => product._id === selectedProductId) || null,
    [products, selectedProductId]
  );

  const detailProduct = useMemo(
    () => products.find((product) => product._id === detailProductId) || null,
    [products, detailProductId]
  );

  const rootCategories = useMemo(
    () => categoryStore.categories.filter((category: any) => !category.parent && category.isActive !== false),
    [categoryStore.categories]
  );

  const getParentCategoryId = (category: any) =>
    typeof category?.parent === "object" ? category.parent?._id : category?.parent;

  const getParentCategoryName = (category: any) =>
    typeof category?.parent === "object" ? category.parent?.name : "";

  const shopCategoryTokens = useMemo(() => {
    const company =
      [auth.company, auth.user?.company].find(
        (candidate: any) => candidate && typeof candidate === "object" && Array.isArray(candidate.categories)
      ) ||
      auth.company ||
      auth.user?.company;
    const rawCategories = Array.isArray(company?.categories) ? company.categories : [];

    return new Set(
      rawCategories
        .map((category: any) => {
          if (typeof category === "string") {
            return category.trim().toLowerCase();
          }

          return String(category?.name || category?._id || "").trim().toLowerCase();
        })
        .filter(Boolean)
    );
  }, [auth.company, auth.user?.company]);

  const allowedRootCategories = useMemo(() => {
    if (shopCategoryTokens.size === 0) {
      return rootCategories;
    }

    return rootCategories.filter(
      (category: any) =>
        shopCategoryTokens.has(String(category._id || "").toLowerCase()) ||
        shopCategoryTokens.has(String(category.name || "").toLowerCase())
    );
  }, [rootCategories, shopCategoryTokens]);

  const allowedRootCategoryIds = useMemo(
    () => new Set(allowedRootCategories.map((category: any) => String(category._id))),
    [allowedRootCategories]
  );

  const allowedRootCategoryNames = useMemo(
    () => new Set(allowedRootCategories.map((category: any) => String(category.name || "").toLowerCase())),
    [allowedRootCategories]
  );

  const sellerProductCategories = useMemo(() => {
    const activeCategories = categoryStore.categories.filter((category: any) => category.isActive !== false);

    if (shopCategoryTokens.size === 0) {
      return activeCategories;
    }

    return activeCategories.filter((category: any) => {
      const parentId = getParentCategoryId(category);
      const parentName = getParentCategoryName(category);
      const isAllowedRoot =
        !parentId &&
        (allowedRootCategoryIds.has(String(category._id)) ||
          allowedRootCategoryNames.has(String(category.name || "").toLowerCase()));
      const isAllowedChild =
        Boolean(parentId) &&
        (allowedRootCategoryIds.has(String(parentId)) ||
          allowedRootCategoryNames.has(String(parentName || "").toLowerCase()));

      return isAllowedRoot || isAllowedChild;
    });
  }, [allowedRootCategoryIds, allowedRootCategoryNames, categoryStore.categories, shopCategoryTokens]);

  const selectedRootCategory = useMemo(
    () =>
      allowedRootCategories.find(
        (category: any) => String(category._id) === String(selectedCategory)
      ) || null,
    [allowedRootCategories, selectedCategory]
  );

  const childCategoriesForSelectedRoot = useMemo(() => {
    if (!selectedRootCategory) {
      return [];
    }

    return sellerProductCategories.filter((category: any) => {
      const parentId = getParentCategoryId(category);
      const parentName = getParentCategoryName(category);

      return (
        Boolean(parentId) &&
        (String(parentId) === String(selectedRootCategory._id) ||
          String(parentName || "").toLowerCase() ===
            String(selectedRootCategory.name || "").toLowerCase())
      );
    });
  }, [selectedRootCategory, sellerProductCategories]);

  const selectedChildCategory = useMemo(
    () =>
      childCategoriesForSelectedRoot.find(
        (category: any) => String(category._id) === String(selectedSubCategory)
      ) || null,
    [childCategoriesForSelectedRoot, selectedSubCategory]
  );

  const stats = useMemo(
    () => ({
      total: totalCount,
      inStock: products.filter((product) => Number(product?.stock || 0) > 0).length,
      featured: products.filter((product) => Boolean(product?.isFeatured)).length,
      low: products.filter((product) => Number(product?.stock || 0) > 0 && Number(product?.stock || 0) < 10).length,
    }),
    [products, totalCount]
  );

  const initialValues = useMemo(() => mapProductToFormValues(selectedProduct), [selectedProduct]);

  const fetchProducts = useCallback(
    async (
      page = 1,
      search = searchTerm,
      category = selectedCategory,
      inactiveView = showInactive,
      subCategory = selectedSubCategory
    ) => {
      const companyId =
        auth.company?._id ||
        auth.company ||
        auth.user?.company?._id ||
        auth.user?.company;

      if (!companyId) {
        setProducts([]);
        setTotalCount(0);
        setTotalPages(1);
        setCurrentPage(1);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await shopStore.getShopProducts({
          company: companyId,
          page,
          limit: 12,
          search,
          category,
          subCategory,
          isDeleted: inactiveView ? true : undefined,
        });

        const nextProducts = response.data?.products || [];
        setProducts(nextProducts);
        setCurrentPage(page);
        setTotalPages(response.data?.totalPages || 1);
        setTotalCount(response.data?.total || 0);
      } catch (error: any) {
        toast({
          title: "Error fetching products",
          description: error?.message || "We could not load the product catalog.",
          status: "error",
          duration: 3500,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [auth.company, auth.user?.company, searchTerm, selectedCategory, selectedSubCategory, shopStore, showInactive, toast]
  );

  useEffect(() => {
    if (auth.company || auth.user?.company || isSuperAdmin) {
      categoryStore.getAllCategories();
      offerStore.getAllOffers({ isActive: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.company, auth.user?.company, isSuperAdmin]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchProducts(1, searchTerm, selectedCategory, showInactive, selectedSubCategory);
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [fetchProducts, searchTerm, selectedCategory, selectedSubCategory, showInactive]);

  useEffect(() => {
    if (!selectedCategory) {
      if (selectedSubCategory) {
        setSelectedSubCategory("");
      }
      return;
    }

    const stillAllowed = allowedRootCategories.some(
      (category: any) => String(category._id) === String(selectedCategory)
    );
    if (!stillAllowed) {
      setSelectedCategory("");
      setSelectedSubCategory("");
    }
  }, [allowedRootCategories, selectedCategory, selectedSubCategory]);

  useEffect(() => {
    if (!selectedSubCategory) {
      return;
    }

    const stillAllowed = childCategoriesForSelectedRoot.some(
      (category: any) => String(category._id) === String(selectedSubCategory)
    );

    if (!stillAllowed) {
      setSelectedSubCategory("");
    }
  }, [childCategoriesForSelectedRoot, selectedSubCategory]);

  if (!isSuperAdmin && !hasCompany) {
    return <CompanyRequiredState />;
  }

  const handleRootCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory("");
  };

  const handleOpenCreate = () => {
    setSelectedProductId(null);
    setDetailProductId(null);
    onOpen();
  };

  const handleCloseForm = () => {
    onClose();
    setSelectedProductId(null);
  };

  const handleEdit = (product: any) => {
    setSelectedProductId(product?._id || null);
    setDetailProductId(null);
    onOpen();
  };

  const handleDelete = (product: any) => {
    setProductToDelete(product);
  };

  const handleView = (product: any) => {
    setDetailProductId(product?._id || null);
  };

  const handleCloseDetail = () => {
    setDetailProductId(null);
  };

  const confirmDelete = async () => {
    if (!productToDelete?._id) {
      return;
    }

    const nextPage = products.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;

    try {
      await shopStore.deleteProduct(productToDelete._id);
      toast({
        title: "Product deleted",
        description: "The product has been removed from the active catalog.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      if (detailProductId === productToDelete._id) {
        setDetailProductId(null);
      }
      setProductToDelete(null);
      await fetchProducts(nextPage, searchTerm, selectedCategory);
    } catch (error: any) {
      toast({
        title: "Error deleting product",
        description: error?.message || "We could not delete this product.",
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    fetchProducts(page, searchTerm, selectedCategory);
  };

  const handleSubmit = async (values: any, actions: any) => {
    try {
      const cleanImages = (values.images || []).map((image: any) => {
        if (!image?.buffer) {
          return image;
        }

        return Object.fromEntries(
          Object.entries(image).filter(([key]) => key !== "preview")
        );
      });

      const payload = normalizeProductPayload({ ...values, images: cleanImages });

      let response;
      if (selectedProductId) {
        response = await shopStore.updateProduct(selectedProductId, payload);
      } else {
        response = await shopStore.createProduct(payload);
      }

      if (
        response?.success ||
        response?.data?.success ||
        response?.status === "success" ||
        response?.status === 200 ||
        response?.status === 201 ||
        response?.statusCode === 200 ||
        response?.statusCode === 201
      ) {
        const toastProduct = {
          name: payload.name,
          image: "",
          images: [],
        };

        showAddToCartToast(
          toastProduct,
          selectedProductId ? "Product Updated" : "Product Created",
          selectedProductId ? "Product updated successfully." : "Product created successfully."
        );

        actions.resetForm();
        const nextPage = selectedProductId ? currentPage : 1;
        if (!selectedProductId) {
          setShowInactive(false);
        }
        handleCloseForm();
        await fetchProducts(nextPage, searchTerm, selectedCategory, selectedProductId ? showInactive : false);
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

  const hasCategoryFilter = Boolean(selectedCategory || selectedSubCategory);
  const showFirstProductAction = !searchTerm && !hasCategoryFilter && !showInactive;

  if (!isDesktop && detailProduct) {
    return <ProductDetailView product={detailProduct} onBack={handleCloseDetail} mode="page" />;
  }

  return (
    <Box bg={pageBg}>
      <Box maxW="1500px" mx="auto" px={{ base: 0, md: 1 }} pb={{ base: 4, md: 8 }} pt={{ base: 2, md: 4 }}>
        <Flex align="start" justify="space-between" gap={4} px={{ base: 0, md: 1 }}>
          <Box>
            <HStack
              spacing={1.5}
              px={3}
              py={1.5}
              borderRadius="full"
              bg={heroBadgeBg}
              color={heroBadgeColor}
              w="fit-content"
              fontSize="11px"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing="0.12em"
            >
              <Icon as={FaFire} boxSize={3} />
              <Text>Inventory</Text>
            </HStack>

            <Text mt={3} fontSize={{ base: "xl", md: "4xl" }} fontWeight="700" color={text} lineHeight="1.05">
              Your products
            </Text>
            <Text mt={2} fontSize={{ base: "sm", md: "md" }} color={textMuted}>
              {totalCount} items • {stats.inStock} live in your shop
            </Text>
          </Box>

          <Button
            display={{ base: "none", md: "inline-flex" }}
            h="44px"
            px={5}
            borderRadius="full"
            bg={accent}
            color="white"
            leftIcon={<FaPlus />}
            fontWeight="700"
            boxShadow={{ base: "none", md: shadow }}
            _hover={{ bg: accentStrong, transform: "translateY(-1px)" }}
            onClick={handleOpenCreate}
          >
            Add product
          </Button>
        </Flex>

        <Grid
        templateColumns={{base:"1fr 1fr",md:"1fr 1fr 1fr 1fr"}}
          mt={6}
          gap={3}
          overflowX="auto"
          px={{ base: 0, md: 1 }}
          pb={1}
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => <StatCardSkeleton key={index} />)
          ) : (
            <>
              <ProductStatCard icon={FaBoxOpen} label="Total products" value={stats.total} tint="sage" />
              <ProductStatCard icon={FaChartLine} label="In stock" value={stats.inStock} tint="green" />
              <ProductStatCard icon={FaFire} label="Featured" value={stats.featured} tint="rose" />
              <ProductStatCard icon={FaLayerGroup} label="Low stock" value={stats.low} tint="warning" />
            </>
          )}
        </Grid>

        <VStack align="stretch" spacing={3} mt={{base:2,md:6}} px={{ base: 0, md: 1 }}>
          <InputGroup>
            <InputLeftElement pointerEvents="none" h="100%">
              <Icon as={FaSearch} color={textSoft} />
            </InputLeftElement>
            <Input
              h={{base:38,md:"48px"}}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search products, brands..."
              borderRadius="22px"
              bg={surface}
              borderColor={border}
              color={text}
              _placeholder={{ color: textSoft }}
              _hover={{ borderColor: accent }}
              _focusVisible={{
                borderColor: accent,
                boxShadow: `0 0 0 1px ${accent}`,
              }}
            />
          </InputGroup>

          <Flex
            align={{ base: "stretch", md: "center" }}
            gap={2}
            direction={{ base: "column", sm: "row" }}
          >
            <CategoryFilterDropdown
              label="Root category"
              valueLabel={selectedRootCategory?.name || "All root categories"}
              active={Boolean(selectedCategory)}
              icon={FaFilter}
              minW={{ base: "100%", sm: "220px" }}
              surface={surface}
              surfaceMuted={surfaceMuted}
              border={border}
              borderStrong={borderStrong}
              text={text}
              textMuted={textMuted}
              accent={accent}
              accentSoft={accentSoft}
              shadow={shadow}
              options={[
                {
                  key: "all-categories",
                  label: "All root categories",
                  active: !selectedCategory,
                  onClick: () => handleRootCategorySelect(""),
                },
                ...allowedRootCategories.map((category: any) => ({
                  key: category._id,
                  label: category.name,
                  active: String(selectedCategory) === String(category._id),
                  onClick: () => handleRootCategorySelect(category._id),
                })),
              ]}
            />

            {selectedCategory && childCategoriesForSelectedRoot.length > 0 ? (
              <CategoryFilterDropdown
                label="Subcategory"
                valueLabel={selectedChildCategory?.name || "All subcategories"}
                active={Boolean(selectedSubCategory)}
                icon={FaLayerGroup}
                minW={{ base: "100%", sm: "220px" }}
                surface={surface}
                surfaceMuted={surfaceMuted}
                border={border}
                borderStrong={borderStrong}
                text={text}
                textMuted={textMuted}
                accent={accent}
                accentSoft={accentSoft}
                shadow={shadow}
                options={[
                  {
                    key: "all-subcategories",
                    label: "All subcategories",
                    active: !selectedSubCategory,
                    onClick: () => setSelectedSubCategory(""),
                  },
                  ...childCategoriesForSelectedRoot.map((category: any) => ({
                    key: category._id,
                    label: category.name,
                    active: String(selectedSubCategory) === String(category._id),
                    onClick: () => setSelectedSubCategory(category._id),
                  })),
                ]}
              />
            ) : null}
          </Flex>

          <HStack spacing={2}>
            <HStack
              spacing={1}
              p={1}
              borderRadius="full"
              borderWidth="1px"
              borderColor={border}
              bg={surfaceMuted}
            >
              <SegmentButton
                active={!showInactive}
                label="Active"
                onClick={() => setShowInactive(false)}
                activeBg={surface}
                activeColor={text}
                inactiveColor={textMuted}
              />
              <SegmentButton
                active={showInactive}
                label="Trash"
                onClick={() => setShowInactive(true)}
                activeBg={surface}
                activeColor={text}
                inactiveColor={textMuted}
              />
            </HStack>
          </HStack>
        </VStack>

        <Flex justify="space-between" align="end" mt={7} px={{ base: 0, md: 1 }}>
          <Text fontSize={{ base: "lg", md: "2xl" }} fontWeight="700" color={text}>
            {showInactive ? "Recently deleted" : "Active catalog"}
          </Text>
          <Badge
            borderRadius="full"
            px={{base:2,md:3}}
            py={{base:1,md:1.5}}
            bg={accentSoft}
            color={accentStrong}
            borderWidth="1px"
            borderColor={border}
          >
            {products.length} shown
          </Badge>
        </Flex>

        {loading ? (
          <SimpleGrid columns={{ base: 2, md: 4, xl: 5 }} spacing={{ base: 2.5, md: 4 }} mt={4} px={{ base: 0, md: 1 }}>
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </SimpleGrid>
        ) : products.length === 0 ? (
          <EmptyState
            title={
              searchTerm || hasCategoryFilter
                ? "No products found"
                : showInactive
                  ? "Trash is empty"
                  : "No products yet"
            }
            description={
              searchTerm || hasCategoryFilter
                ? "Try changing the search term or filters to find what you need."
                : showInactive
                  ? "Deleted products will appear here when your backend returns them."
                  : "Add your first item to start building the catalog."
            }
            onAdd={handleOpenCreate}
            showAction={showFirstProductAction}
            text={text}
            textMuted={textMuted}
            accent={accent}
            border={border}
            surface={surface}
          />
        ) : (
          <>
            <SimpleGrid columns={{ base: 2, md: 4, xl: 5 }} spacing={{ base: 2.5, md: 4 }} mt={4} px={{ base: 0, md: 1 }}>
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </SimpleGrid>

            {totalPages > 1 ? (
              <HStack justify="center" spacing={3} mt={8} px={{ base: 0, md: 1 }}>
                <Button
                  h="40px"
                  px={5}
                  borderRadius="full"
                  variant="outline"
                  borderColor={border}
                  color={text}
                  bg={surface}
                  isDisabled={currentPage === 1}
                  _hover={{ bg: surfaceMuted }}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>
                <Text fontSize="sm" fontWeight="700" color={textMuted}>
                  Page {currentPage} of {totalPages}
                </Text>
                <Button
                  h="40px"
                  px={5}
                  borderRadius="full"
                  variant="outline"
                  borderColor={border}
                  color={text}
                  bg={surface}
                  isDisabled={currentPage === totalPages}
                  _hover={{ bg: surfaceMuted }}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </HStack>
            ) : null}
          </>
        )}
      </Box>

      <IconButton
        aria-label="Add product"
        display={{ base: "flex", md: "none" }}
        position="fixed"
        right={4}
        bottom="calc(76px + env(safe-area-inset-bottom, 0px))"
        zIndex={110}
        h="52px"
        w="52px"
        minW="52px"
        borderRadius="full"
        bg={accent}
        color="white"
        icon={<FaPlus />}
        boxShadow="0 18px 34px rgba(37, 99, 235, 0.28)"
        _hover={{ bg: accentStrong }}
        _active={{ transform: "scale(0.96)" }}
        onClick={handleOpenCreate}
      />

      <ProductForm
        isOpen={isOpen}
        onClose={handleCloseForm}
        initialValues={initialValues}
        validationSchema={ProductSchema}
        onSubmit={handleSubmit}
        categories={sellerProductCategories}
        offersList={offerStore.offers}
        products={products}
        isEdit={Boolean(selectedProductId)}
      />

      <DeleteProductDialog
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
        data={productToDelete}
      />

      <Drawer
        isOpen={Boolean(isDesktop && detailProduct)}
        placement="right"
        onClose={handleCloseDetail}
        size="xl"
      >
        <DrawerOverlay bg="rgba(15, 23, 42, 0.28)" backdropFilter="blur(10px)" />
        <DrawerContent maxW="720px" bg="transparent" boxShadow="none">
          <DrawerBody p={0}>
            {detailProduct ? <ProductDetailView product={detailProduct} onBack={handleCloseDetail} /> : null}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
});

function StatCardSkeleton() {
  return (
    <Box minW={{ base: "148px", md: "unset" }} flexShrink={0} borderRadius="24px" borderWidth="1px" borderColor="transparent" bg="transparent" px={4} py={4}>
      <SkeletonCircle size="38px" />
      <Skeleton mt={3} h="28px" w="56px" />
      <Skeleton mt={2} h="12px" w="92px" />
    </Box>
  );
}

function CategoryFilterDropdown({
  label,
  valueLabel,
  active,
  icon,
  options,
  minW,
  surface,
  surfaceMuted,
  border,
  borderStrong,
  text,
  textMuted,
  accent,
  accentSoft,
  shadow,
}: {
  label: string;
  valueLabel: string;
  active: boolean;
  icon: any;
  options: Array<{
    key: string;
    label: string;
    active?: boolean;
    onClick: () => void;
  }>;
  minW?: any;
  surface: string;
  surfaceMuted: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
  shadow: string;
}) {
  return (
    <Menu placement="bottom-start">
      <MenuButton
        as={Button}
        h="48px"
        minW={minW}
        px={4}
        borderRadius="18px"
        borderWidth="1px"
        borderColor={active ? accent : border}
        bg={active ? accentSoft : surface}
        color={text}
        leftIcon={<Icon as={icon} color={active ? accent : textMuted} boxSize={3.5} />}
        rightIcon={<Icon as={FaChevronDown} color={textMuted} boxSize={3} />}
        justifyContent="flex-start"
        textAlign="left"
        _hover={{ borderColor: active ? accent : borderStrong, bg: active ? accentSoft : surfaceMuted }}
        _active={{ bg: active ? accentSoft : surfaceMuted }}
      >
        <Box minW={0}>
          <Text fontSize="10px" fontWeight="800" letterSpacing="0.1em" textTransform="uppercase" color={textMuted} lineHeight="1.1">
            {label}
          </Text>
          <Text mt={0.5} fontSize="sm" fontWeight="800" color={active ? accent : text} noOfLines={1}>
            {valueLabel}
          </Text>
        </Box>
      </MenuButton>
      <MenuList bg={surface} borderColor={border} color={text} boxShadow={shadow} borderRadius="18px" p={1.5}>
        {options.map((option) => (
          <MenuItem
            key={option.key}
            onClick={option.onClick}
            borderRadius="14px"
            bg={option.active ? accentSoft : surface}
            color={option.active ? accent : text}
            fontWeight={option.active ? "800" : "600"}
            _hover={{ bg: option.active ? accentSoft : surfaceMuted, color: option.active ? accent : text }}
          >
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}

function SegmentButton({
  active,
  label,
  onClick,
  activeBg,
  activeColor,
  inactiveColor,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  activeBg: string;
  activeColor: string;
  inactiveColor: string;
}) {
  return (
    <Button
      h="32px"
      px={4}
      borderRadius="full"
      bg={active ? activeBg : "transparent"}
      color={active ? activeColor : inactiveColor}
      fontSize="xs"
      fontWeight="700"
      boxShadow={active ? "sm" : "none"}
      _hover={{ bg: active ? activeBg : "transparent" }}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

function EmptyState({
  title,
  description,
  onAdd,
  showAction,
  text,
  textMuted,
  accent,
  border,
  surface,
}: {
  title: string;
  description: string;
  onAdd: () => void;
  showAction: boolean;
  text: string;
  textMuted: string;
  accent: string;
  border: string;
  surface: string;
}) {
  const badgeBg = useColorModeValue("#E8F7F1", "rgba(45, 212, 191, 0.14)");
  const badgeColor = useColorModeValue("#1D7A61", "#7DD3C7");
  const hoverAccent = useColorModeValue("#1D4ED8", dashboardPalette.accentStrong);

  return (
    <Box
      mt={5}
      borderRadius={{ base: "28px", md: "30px" }}
      borderWidth="1px"
      borderStyle="dashed"
      borderColor={border}
      bg={surface}
      px={{ base: 5, md: 8 }}
      py={{ base: 10, md: 12 }}
      textAlign="center"
    >
      <Center mx="auto" boxSize="56px" borderRadius="22px" bg={badgeBg} color={badgeColor}>
        <FaBoxOpen />
      </Center>
      <Text mt={4} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" color={text}>
        {title}
      </Text>
      <Text mt={2} fontSize="sm" color={textMuted} maxW="md" mx="auto">
        {description}
      </Text>
      {showAction ? (
        <Button
          mt={5}
          h="44px"
          px={5}
          borderRadius="full"
          bg={accent}
          color="white"
          leftIcon={<FaPlus />}
          fontWeight="700"
          _hover={{ bg: hoverAccent }}
          onClick={onAdd}
        >
          Add product
        </Button>
      ) : null}
    </Box>
  );
}

function ProductCardSkeleton() {
  const border = useColorModeValue("#E2E8F0", dashboardPalette.border);
  const surface = useColorModeValue("white", dashboardPalette.surface);

  return (
    <Box borderRadius="24px" borderWidth="1px" borderColor={border} bg={surface} overflow="hidden">
      <Box position="relative" pt="100%">
        <Skeleton position="absolute" inset={0} />
      </Box>
      <Box p={4}>
        <Skeleton h="10px" w="54px" />
        <Skeleton mt={2} h="16px" w="80%" />
        <Skeleton mt={3} h="20px" w="44%" />
        <SkeletonText mt={4} noOfLines={1} spacing={2} />
      </Box>
    </Box>
  );
}

export default ProductsPage;
