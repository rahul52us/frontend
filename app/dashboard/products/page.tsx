"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Circle,
  Flex,
  Heading,
  Text,
  useToast,
  SimpleGrid,
  Icon,
  Spinner,
  useDisclosure,
  VStack,
  HStack,
  Badge,
  Divider,
  Center,
  Input,
  InputGroup,
  InputLeftElement,
  Select, useColorModeValue } from "@chakra-ui/react";
import * as Yup from "yup";
import {
  FaBoxOpen,
  FaPlus,
  FaSearch,
  FaFire,
  FaTrash,
} from "react-icons/fa";
import axios from "axios";
import { observer } from "mobx-react-lite";
import stores from "../../store/stores";
import ProductCard from "./components/ProductCard";
import ProductForm from "./components/ProductForm";
import DeleteProductDialog from "./components/DeleteProductDialog";
import { useCartToast } from "../../hooks/useCartToast";
import CompanyRequiredState from "../components/common/CompanyRequiredState";
import { dashboardPalette } from "../../layouts/dashboardLayout/dashboardPalette";
import {
  MerchantHeroSection,
  MerchantPageShell,
  MerchantPanel,
} from "../components/common/merchantDashboardUI";



const ProductSchema = Yup.object().shape({
  name: Yup.string().required("Product Name is required"),
  category: Yup.string().required("Category is required"),
  subCategories: Yup.array().of(Yup.string().required("Subcategory is required")),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be positive"),
  description: Yup.string().optional(),
  stock: Yup.number()
    .required("Stock level is required")
    .integer("Stock must be an integer")
    .min(0, "Stock cannot be negative"),
  brand: Yup.string().optional(),
  sku: Yup.string().optional(),
  weight: Yup.string().optional(),
  productDetails: Yup.array().of(
    Yup.object().shape({
      key: Yup.string().required("Key is required"),
      value: Yup.string().required("Value is required"),
    })
  ),
  information: Yup.array().of(
    Yup.object().shape({
      key: Yup.string().required("Key is required"),
      value: Yup.string().required("Value is required"),
    })
  ),
  discountPrice: Yup.number().min(0, "Cannot be negative").optional(),
  isFeatured: Yup.boolean(),
  tags: Yup.array().of(Yup.string()),
  variants: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Variant name is required"),
      options: Yup.array().of(Yup.string()).min(1, "At least one option is required")
    })
  ),

  offers: Yup.array().of(Yup.object()).optional(),
  images: Yup.array().min(1, "At least one image is required"),
});

const ProductsPage = observer(() => {
  const cAccentSoft = useColorModeValue("blue.50", dashboardPalette.accentSoft);
  const cAccentStrong = useColorModeValue("blue.700", dashboardPalette.accentStrong);
  const cAccent = useColorModeValue("blue.600", dashboardPalette.accent);
  const cTextMuted = useColorModeValue("gray.500", dashboardPalette.textMuted);
  const cText = useColorModeValue("gray.800", dashboardPalette.text);
  const cTextSoft = useColorModeValue("gray.500", dashboardPalette.textSoft);
  const cSurfaceAlt = useColorModeValue("gray.50", dashboardPalette.surfaceAlt);
  const cBorder = useColorModeValue("gray.200", dashboardPalette.border);
  const cBorderStrong = useColorModeValue("gray.300", dashboardPalette.borderStrong);
  const cSurfaceSoft = useColorModeValue("gray.100", dashboardPalette.surfaceSoft);
  const cPage = useColorModeValue("#F4F7FE", dashboardPalette.page);
  const cDanger = useColorModeValue("red.500", dashboardPalette.danger);
  const cWarning = useColorModeValue("orange.500", dashboardPalette.warning);
  
                            
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { showAddToCartToast } = useCartToast();

  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState({ data: null, open: false });
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showInactive, setShowInactive] = useState(false);

  const { shopStore, auth, categoryStore, offerStore } = stores;
  const hasCompany = Boolean(auth.user?.company?._id || auth.user?.company);
  const isSuperAdmin = auth.user?.type === "superAdmin" || auth.user?.role === "superAdmin";

  if (!isSuperAdmin && !hasCompany) {
    return <CompanyRequiredState />;
  }

  const triggerDelete = (product: any) => {
    setSelectedProduct(product);
    setDeleteOpen({ open: true, data: product });
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    setDeleteOpen({ open: false, data: null });
    try {
      await shopStore.deleteProduct(selectedProduct?._id);
      toast({
        title: "Product Deleted",
        description: "The product has been removed.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchProducts(currentPage);
    } catch (error: any) {
      toast({
        title: "Error deleting product",
        description: error.message || "Could not delete product.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSelectedProduct(null);
    }
  };

  const fetchProducts = async (page = 1, search = searchTerm, category = selectedCategory) => {
    if (!auth.company) return;
    setLoading(true);
    try {
      const companyId = auth.company?._id || auth.company;
      const res = await shopStore.getShopProducts({
        company: companyId,
        page: page,
        limit: 12,
        search,
        category,
        isDeleted: showInactive ? true : undefined
      });
      const data = res.data?.products || [];
      const { totalPages, total } = res.data || {};

      setProducts(data);
      setFilteredProducts(data);
      setTotalPages(totalPages || 1);
      setTotalCount(total || 0);
      setCurrentPage(page);
    } catch (error: any) {
      toast({
        title: "Error fetching products.",
        status: "error",
        description: error?.message,
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchProducts(newPage);
    }
  }

  // Combined Effect for Fetching
  useEffect(() => {
    fetchProducts(1);
    if (auth.company) {
      categoryStore.getAllCategories();
      offerStore.getAllOffers({ isActive: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.company, categoryStore, offerStore]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(1, searchTerm, selectedCategory);
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory, showInactive, auth.company]);

  const handleEdit = (product: any) => {
    setSelectedProduct(product._id);
    setDeleteOpen({ open: false, data: null });
    onOpen();
  };

  const initialValues =
    selectedProduct && products.find((p) => p._id === selectedProduct)
      ? {
        ...products.find((p) => p._id === selectedProduct),
        category: typeof products.find((p) => p._id === selectedProduct).category === 'object'
          ? products.find((p) => p._id === selectedProduct).category?._id
          : products.find((p) => p._id === selectedProduct).category,
        subCategories: products.find((p) => p._id === selectedProduct).subCategories
          ? products.find((p) => p._id === selectedProduct).subCategories.map((sub: any) =>
            typeof sub === 'object' ? sub._id : sub
          )
          : [],
        images: products.find((p) => p._id === selectedProduct).images || [],
        productDetails: products.find((p) => p._id === selectedProduct).productDetails
          ? Object.entries(products.find((p) => p._id === selectedProduct).productDetails).map(
            ([key, value]) => ({ key, value })
          )
          : [],
        information: products.find((p) => p._id === selectedProduct).information
          ? Object.entries(products.find((p) => p._id === selectedProduct).information).map(
            ([key, value]) => ({ key, value })
          )
          : [],
        // New Fields Initialization
        discountPrice: products.find((p) => p._id === selectedProduct).discountPrice || "",
        isFeatured: products.find((p) => p._id === selectedProduct).isFeatured || false,
        tags: products.find((p) => p._id === selectedProduct).tags || [],
        variants: products.find((p) => p._id === selectedProduct).variants || [],
        offers: products.find((p) => p._id === selectedProduct).offers || [],
      }
      : {
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
        // New Fields Defaults
        discountPrice: "",
        isFeatured: false,
        tags: [],
        variants: [],
        offers: [],
      };

  const handleSubmit = async (values: any, actions: any) => {
    try {
      const cleanImages = values.images.map((img: any) => {
        if (!img?.buffer) return img;

        const rest = Object.fromEntries(
          Object.entries(img).filter(([key]) => key !== "preview")
        );

        return rest;
      });


      const payload = { ...values, images: cleanImages };

      let response;
      if (selectedProduct) {
        response = await shopStore.updateProduct(selectedProduct, payload);
      } else {
        response = await axios.post("/product/create", payload);
      }

      if (
        response.success ||
        response.data?.success ||
        response.status === "success" ||
        response.status === 201 ||
        response.status === 200 ||
        response.statusCode === 200 ||
        response.statusCode === 201
      ) {
        // Use custom image toast
        // selectedProduct is the ID or object during edit? In this scope, selectedProduct is state ID.
        // We need the image object/url for the toast.
        // payload.images is 'cleanImages'. array of objects or strings.

        const isEdit = !!selectedProduct;
        const toastTitle = isEdit ? "Product Updated" : "Product Created";
        const toastMsg = isEdit ? "Product updated successfully." : "Product created successfully.";

        // Construct a temp product object for the toast to consume
        const toastProduct = {
          name: payload.name,
          // No image for product creation/update as requested
          image: "",
          images: []
        };

        showAddToCartToast(toastProduct, toastTitle, toastMsg);

        actions.resetForm();
        onClose();
        setSelectedProduct(null);
        // Force refresh
        await fetchProducts(currentPage);
      }
    } catch (error: any) {
      toast({
        title: selectedProduct ? "Error updating product." : "Error creating product.",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <MerchantPageShell>
      <MerchantHeroSection
        icon={FaBoxOpen}
        primaryBadge="Merchant Inventory"
        title="Your Products"
        description={`Managing ${totalCount} ${totalCount === 1 ? "item" : "items"} across your active catalog.`}
        align={{ base: "start", lg: "center" }}
        direction={{ base: "column", lg: "row" }}
        glowProps={{ top: "-80px", right: "-30px", w: "220px", h: "220px" }}
        rightContent={
          <Button
            size="lg"
            px={9}
            bg={cAccent}
            color={cPage}
            leftIcon={<FaPlus />}
            fontWeight="700"
            borderRadius="18px"
            _hover={{ bg: cAccentStrong, transform: "translateY(-1px)" }}
            transition="all 0.2s"
            onClick={onOpen}
          >
            Add Product
          </Button>
        }
      />

      <MerchantPanel>
          {loading ? (
            <Center py={20}>
              <VStack spacing={5}>
                <Spinner size="xl" color={cAccent} thickness="4px" speed="0.7s" />
                <Text fontSize="lg" color={cTextMuted} fontWeight="medium">
                  Loading products...
                </Text>
              </VStack>
            </Center>
          ) : (
            <Box>
              <Flex
                direction={{ base: "column", xl: "row" }}
                gap={4}
                mb={6}
                align={{ base: "stretch", xl: "center" }}
              >
                <InputGroup maxW={{ base: "full", xl: "380px" }}>
                  <InputLeftElement
                    pointerEvents="none"
                    h="100%"
                    top={0}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FaSearch} color={cTextSoft} />
                  </InputLeftElement>
                  <Input
                    placeholder="Search by name, SKU, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    bg={cSurfaceAlt}
                    border="1px solid"
                    borderColor={cBorderStrong}
                    color={cText}
                    borderRadius="16px"
                    _placeholder={{ color: cTextSoft }}
                    _hover={{ borderColor: cAccent }}
                    _focusVisible={{
                      borderColor: cAccent,
                      boxShadow: `0 0 0 1px ${cAccent}`,
                    }}
                  />
                </InputGroup>

                <HStack
                  spacing={2}
                  bg={cSurfaceAlt}
                  border="1px solid"
                  borderColor={cBorder}
                  borderRadius="18px"
                  p={1}
                  alignSelf={{ base: "stretch", xl: "center" }}
                >
                  <Button
                    size="sm"
                    borderRadius="14px"
                    bg={!showInactive ? cAccent : "transparent"}
                    color={!showInactive ? cPage : cTextMuted}
                    _hover={{ bg: !showInactive ? cAccentStrong : "rgba(255,255,255,0.04)" }}
                    onClick={() => setShowInactive(false)}
                  >
                    Active
                  </Button>
                  <Button
                    size="sm"
                    borderRadius="14px"
                    bg={showInactive ? "rgba(239, 107, 107, 0.14)" : "transparent"}
                    color={showInactive ? cDanger : cTextMuted}
                    _hover={{ bg: showInactive ? "rgba(239, 107, 107, 0.20)" : "rgba(255,255,255,0.04)" }}
                    onClick={() => setShowInactive(true)}
                  >
                    Trash
                  </Button>
                </HStack>

                <Select
                  maxW={{ base: "full", xl: "250px" }}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  bg={cSurfaceAlt}
                  border="1px solid"
                  borderColor={cBorderStrong}
                  color={cText}
                  borderRadius="16px"
                  iconColor={cTextSoft}
                  _hover={{ borderColor: cAccent }}
                  _focusVisible={{
                    borderColor: cAccent,
                    boxShadow: `0 0 0 1px ${cAccent}`,
                  }}
                  sx={{
                    option: {
                      color: cPage,
                      backgroundColor: "#ffffff",
                    },
                  }}
                >
                  <option value="" style={{ color: cPage, backgroundColor: "#ffffff" }}>
                    All Categories
                  </option>
                  {categoryStore.categories
                    .filter((cat: any) => !cat.parent)
                    .map((cat: any) => (
                      <option
                        key={cat._id}
                        value={cat._id}
                        style={{ color: cPage, backgroundColor: "#ffffff" }}
                      >
                        {cat.name}
                      </option>
                    ))}
                </Select>

                <Badge
                  ml={{ xl: "auto" }}
                  alignSelf={{ base: "flex-start", xl: "center" }}
                  bg={cAccentSoft}
                  color={cAccentStrong}
                  border="1px solid"
                  borderColor={cBorder}
                  fontSize="sm"
                  px={3}
                  py={1.5}
                  borderRadius="full"
                >
                  {filteredProducts.length} visible
                </Badge>
              </Flex>

              <Divider my={5} borderColor={cBorder} />

              {filteredProducts.length === 0 ? (
                <Center py={14}>
                  <VStack spacing={6} textAlign="center" maxW="lg">
                    <Circle
                      size="88px"
                      bg="rgba(214, 183, 114, 0.10)"
                      border="1px solid"
                      borderColor={cBorder}
                    >
                      <Icon as={FaBoxOpen} boxSize={9} color={cAccentStrong} />
                    </Circle>
                    <VStack spacing={3}>
                      <Heading size="lg" color={cText} fontWeight="500">
                        {searchTerm || selectedCategory
                          ? "No products found"
                          : showInactive
                            ? "Trash is empty"
                            : "No products added yet"}
                      </Heading>
                      <Text fontSize="md" color={cTextMuted}>
                        {searchTerm || selectedCategory
                          ? "No products match the current search or filter set."
                          : showInactive
                            ? "There are no deleted products in this view."
                            : "Start building your catalog by adding the first product to your shop."}
                      </Text>
                    </VStack>
                    {!searchTerm && !selectedCategory && !showInactive ? (
                      <Button
                        size="lg"
                        leftIcon={<FaPlus />}
                        px={8}
                        borderRadius="18px"
                        bg={cAccent}
                        color={cPage}
                        _hover={{ bg: cAccentStrong }}
                        onClick={onOpen}
                      >
                        Add Your First Product
                      </Button>
                    ) : null}
                  </VStack>
                </Center>
              ) : (
                <>
                  <Flex
                    justify="space-between"
                    align={{ base: "start", lg: "center" }}
                    mb={6}
                    gap={4}
                    direction={{ base: "column", lg: "row" }}
                  >
                    <Heading
                      size="lg"
                      color={cText}
                      display="flex"
                      alignItems="center"
                      gap={2}
                      fontWeight="500"
                    >
                      <Icon
                        as={showInactive ? FaTrash : FaFire}
                        color={showInactive ? cDanger : cWarning}
                      />
                      {showInactive ? "Inactive Products" : "Active Products"}
                    </Heading>

                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        borderRadius="14px"
                        variant="outline"
                        borderColor={!showInactive ? cAccent : cBorderStrong}
                        color={!showInactive ? cAccentStrong : cTextMuted}
                        bg={!showInactive ? cAccentSoft : "transparent"}
                        _hover={{ bg: "rgba(255,255,255,0.04)" }}
                        onClick={() => setShowInactive(false)}
                      >
                        Active
                      </Button>
                      <Button
                        size="sm"
                        borderRadius="14px"
                        variant="outline"
                        borderColor={showInactive ? "rgba(239, 107, 107, 0.32)" : cBorderStrong}
                        color={showInactive ? cDanger : cTextMuted}
                        bg={showInactive ? "rgba(239, 107, 107, 0.12)" : "transparent"}
                        _hover={{ bg: "rgba(255,255,255,0.04)" }}
                        onClick={() => setShowInactive(true)}
                      >
                        Trash
                      </Button>
                    </HStack>
                  </Flex>

                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        onEdit={handleEdit}
                        onDelete={triggerDelete}
                      />
                    ))}
                  </SimpleGrid>

                  {totalPages > 1 ? (
                    <Flex justify="center" mt={10} gap={4} align="center" flexWrap="wrap">
                      <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        isDisabled={currentPage === 1}
                        variant="outline"
                        borderRadius="16px"
                        borderColor={cBorderStrong}
                        color={cTextMuted}
                        _hover={{ bg: "rgba(255,255,255,0.04)", color: cText }}
                      >
                        Previous
                      </Button>
                      <Text fontWeight="600" color={cTextMuted}>
                        Page {currentPage} of {totalPages}
                      </Text>
                      <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        isDisabled={currentPage === totalPages}
                        variant="outline"
                        borderRadius="16px"
                        borderColor={cBorderStrong}
                        color={cTextMuted}
                        _hover={{ bg: "rgba(255,255,255,0.04)", color: cText }}
                      >
                        Next
                      </Button>
                    </Flex>
                  ) : null}
                </>
              )}
            </Box>
          )}
      </MerchantPanel>

      {/* Modals */}
      <ProductForm
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelectedProduct(null);
        }}
        initialValues={initialValues}
        validationSchema={ProductSchema}
        onSubmit={handleSubmit}
        categories={categoryStore.categories}
        offersList={offerStore.offers}
        products={products}
        isEdit={!!selectedProduct}
      />

      <DeleteProductDialog
        isOpen={deleteOpen.open}
        onClose={() => setDeleteOpen({ open: false, data: null })}
        onConfirm={confirmDelete}
        data={deleteOpen.data}
      />
    </MerchantPageShell>
  );
});

export default ProductsPage;
