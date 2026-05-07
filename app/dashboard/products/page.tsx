"use client";

import {
  Badge,
  Box,
  Button,
  Center,
  Circle,
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
  MenuDivider,
  MenuItem,
  MenuList,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { IconType } from "react-icons";
import {
  FaBoxOpen,
  FaChartLine,
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
import ProductForm from "./components/ProductForm";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showInactive, setShowInactive] = useState(false);

  const hasCompany = Boolean(auth.user?.company?._id || auth.user?.company || auth.company);
  const isSuperAdmin = auth.user?.type === "superAdmin" || auth.user?.role === "superAdmin";

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

  const rootCategories = useMemo(
    () => categoryStore.categories.filter((category: any) => !category.parent),
    [categoryStore.categories]
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
    async (page = 1, search = searchTerm, category = selectedCategory) => {
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
          isDeleted: showInactive ? true : undefined,
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
    [auth.company, auth.user?.company, searchTerm, selectedCategory, shopStore, showInactive, toast]
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
      fetchProducts(1, searchTerm, selectedCategory);
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [fetchProducts, searchTerm, selectedCategory, showInactive]);

  if (!isSuperAdmin && !hasCompany) {
    return <CompanyRequiredState />;
  }

  const handleOpenCreate = () => {
    setSelectedProductId(null);
    onOpen();
  };

  const handleCloseForm = () => {
    onClose();
    setSelectedProductId(null);
  };

  const handleEdit = (product: any) => {
    setSelectedProductId(product?._id || null);
    onOpen();
  };

  const handleDelete = (product: any) => {
    setProductToDelete(product);
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
        response = await axios.post("/product/create", payload);
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
        handleCloseForm();
        await fetchProducts(currentPage, searchTerm, selectedCategory);
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

  const showFirstProductAction = !searchTerm && !selectedCategory && !showInactive;

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
              <StatCard icon={FaBoxOpen} label="Total products" value={stats.total} tint="sage" />
              <StatCard icon={FaChartLine} label="In stock" value={stats.inStock} tint="green" />
              <StatCard icon={FaFire} label="Featured" value={stats.featured} tint="rose" />
              <StatCard icon={FaLayerGroup} label="Low stock" value={stats.low} tint="warning" />
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

          <HStack align="center" spacing={2}>
            <HStack
              spacing={2}
              overflowX="auto"
              flex="1"
              pb={1}
            >
              <CategoryPill
                active={!selectedCategory}
                label="All"
                onClick={() => setSelectedCategory("")}
                accent={accent}
                border={border}
                text={text}
              />
              {rootCategories.map((category: any) => (
                <CategoryPill
                  key={category._id}
                  active={selectedCategory === category._id}
                  label={category.name}
                  onClick={() => setSelectedCategory(category._id)}
                  accent={accent}
                  border={border}
                  text={text}
                />
              ))}
            </HStack>

            <Menu placement="bottom-end">
              <MenuButton
                as={IconButton}
                aria-label="Filter categories"
                icon={<FaFilter />}
                h="38px"
                w="38px"
                minW="38px"
                borderRadius="full"
                borderWidth="1px"
                borderColor={border}
                bg={surface}
                color={textMuted}
                _hover={{ color: text, borderColor: borderStrong }}
              />
              <MenuList bg={surface} borderColor={border} color={text} boxShadow={shadow}>
                <MenuItem onClick={() => setSelectedCategory("")}>All categories</MenuItem>
                <MenuDivider />
                {rootCategories.map((category: any) => (
                  <MenuItem key={category._id} onClick={() => setSelectedCategory(category._id)}>
                    {category.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </HStack>

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
              searchTerm || selectedCategory
                ? "No products found"
                : showInactive
                  ? "Trash is empty"
                  : "No products yet"
            }
            description={
              searchTerm || selectedCategory
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
        categories={categoryStore.categories}
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
    </Box>
  );
});

function StatCard({
  icon,
  label,
  value,
  tint,
}: {
  icon: IconType;
  label: string;
  value: number;
  tint: "sage" | "green" | "rose" | "warning";
}) {
  const surface = useColorModeValue("white", dashboardPalette.surface);
  const border = useColorModeValue("#E2E8F0", dashboardPalette.border);
  const text = useColorModeValue("#0F172A", dashboardPalette.text);
  const textMuted = useColorModeValue("#64748B", dashboardPalette.textMuted);

  const shadow = useColorModeValue(
    "0 10px 30px rgba(15, 23, 42, 0.06)",
    "0 16px 40px rgba(0, 0, 0, 0.28)"
  );

  const toneMap = {
    sage: {
      bg: useColorModeValue("#E8F7F1", "rgba(45, 212, 191, 0.14)"),
      color: useColorModeValue("#1D7A61", "#7DD3C7"),
    },
    green: {
      bg: useColorModeValue("#ECFDF5", "rgba(16, 185, 129, 0.14)"),
      color: useColorModeValue("#15803D", "#6EE7B7"),
    },
    rose: {
      bg: useColorModeValue("#FFF1F2", "rgba(244, 63, 94, 0.14)"),
      color: useColorModeValue("#BE123C", "#FDA4AF"),
    },
    warning: {
      bg: useColorModeValue("#FFF7ED", "rgba(234, 88, 12, 0.16)"),
      color: useColorModeValue("#C2410C", "#FDBA74"),
    },
  } as const;

  const tone = toneMap[tint];

  return (
    <Flex
      direction={{ base: "row", md: "column" }}
      align={{ base: "center", md: "flex-start" }}
      justify="space-between"
      gap={{ base: 2, md: 4 }}
      w="full"
      minW={{ base: "100%", sm: "180px", md: "unset" }}
      borderRadius="16px"
      borderWidth="1px"
      borderColor={border}
      bg={surface}
      px={{ base: 2, md: 5 }}
      py={{ base: 3, md: 5 }}
      boxShadow={{ base: "sm", md: shadow }}
      transition="all 0.25s ease"
      _hover={{
        transform: "translateY(-2px)",
        boxShadow: shadow,
      }}
    >
      {/* Left Section */}
      <HStack spacing={3} align="center">
        <Flex
          align="center"
          justify="center"
          boxSize={{ base: "38px", md: "52px" }}
          borderRadius="16px"
          bg={tone.bg}
          color={tone.color}
          flexShrink={0}
        >
          <Icon as={icon} boxSize={{ base: 4, md: 5 }} />
        </Flex>

        {/* Mobile Content */}
        <Box display={{ base: "block", md: "none" }}>
          <Text
            fontSize="sm"
            color={textMuted}
            fontWeight="500"
            lineHeight="short"
          >
            {label}
          </Text>

          <Text
            fontSize="xl"
            fontWeight="800"
            color={text}
            lineHeight="1"
            mt={1}
          >
            {value}
          </Text>
        </Box>
      </HStack>

      {/* Desktop Content */}
      <Box display={{ base: "none", md: "block" }}>
        <Text
          fontSize="3xl"
          fontWeight="800"
          color={text}
          lineHeight="1"
          mt={1}
        >
          {value}
        </Text>

        <Text
          mt={2}
          fontSize="sm"
          color={textMuted}
          fontWeight="500"
        >
          {label}
        </Text>
      </Box>
    </Flex>
  );
}

function StatCardSkeleton() {
  return (
    <Box minW={{ base: "148px", md: "unset" }} flexShrink={0} borderRadius="24px" borderWidth="1px" borderColor="transparent" bg="transparent" px={4} py={4}>
      <SkeletonCircle size="38px" />
      <Skeleton mt={3} h="28px" w="56px" />
      <Skeleton mt={2} h="12px" w="92px" />
    </Box>
  );
}

function CategoryPill({
  active,
  label,
  onClick,
  accent,
  border,
  text,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  accent: string;
  border: string;
  text: string;
}) {
  const mutedBg = useColorModeValue("white", dashboardPalette.surface);
  const mutedText = useColorModeValue("#64748B", dashboardPalette.textMuted);

  return (
    <Button
      h="36px"
      px={4}
      borderRadius="full"
      flexShrink={0}
      borderWidth="1px"
      borderColor={active ? accent : border}
      bg={active ? accent : mutedBg}
      color={active ? "white" : text}
      fontSize="xs"
      fontWeight="700"
      _hover={{
        bg: active ? accent : mutedBg,
        borderColor: active ? accent : mutedText,
      }}
      onClick={onClick}
    >
      {label}
    </Button>
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
