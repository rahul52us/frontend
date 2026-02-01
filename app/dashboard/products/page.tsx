"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
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
  Select,
  Image,
  Circle,
  Tabs,
  TabList,
  Tab,
} from "@chakra-ui/react";
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

  images: Yup.array().min(1, "At least one image is required"),
});

const ProductsPage = observer(() => {
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

  const { shopStore, auth, categoryStore } = stores;

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.company, categoryStore]);

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
    <Box minH="100vh" bgGradient="linear(to-br, gray.50, cyan.50)" py={{ base: 4, md: 6 }}>
      <Container maxW="8xl">
        {/* Refined Hero Header */}
        <Box bg="white" borderRadius="2xl" shadow="md" overflow="hidden" mb={6}>
          <Box bgGradient="linear(to-r, blue.500, cyan.500)" px={{ base: 6, md: 10 }} py={9}>
            <Flex
              justify="space-between"
              align="center"
              flexDirection={{ base: "column", lg: "row" }}
              gap={6}
              textAlign={{ base: "center", lg: "left" }}
            >
              <Box>
                <HStack spacing={3} mb={3} justify={{ base: "center", lg: "flex-start" }}>
                  <Circle bg="whiteAlpha.300" size="12" p={3}>
                    <Icon as={FaBoxOpen} boxSize={6} color="white" />
                  </Circle>
                  <Badge colorScheme="cyan" px={3} py={1} fontSize="sm" variant="solid">
                    LIVE INVENTORY
                  </Badge>
                </HStack>
                <Heading size="2xl" color="white" fontWeight="extrabold" mb={1}>
                  Your Products
                </Heading>
                <Text fontSize="lg" color="whiteAlpha.900">
                  Managing {totalCount} {totalCount === 1 ? "item" : "items"}
                </Text>
              </Box>
              <Button
                size="lg"
                px={9}
                bg="white"
                color="cyan.600"
                leftIcon={<FaPlus />}
                fontWeight="bold"
                boxShadow="md"
                _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                transition="all 0.2s"
                onClick={onOpen}
              >
                Add Product
              </Button>
            </Flex>
          </Box>
        </Box>

        {/* Main Content */}
        <Box bg="white" borderRadius="2xl" shadow="md" p={{ base: 5, md: 8 }}>
          {loading ? (
            <Center py={20}>
              <VStack spacing={5}>
                <Spinner size="xl" color="cyan.500" thickness="4px" speed="0.7s" />
                <Text fontSize="lg" color="gray.600" fontWeight="medium">
                  Loading products...
                </Text>
              </VStack>
            </Center>
          ) : (
            <Box>
              {/* Search & Filter */}
              <Flex
                direction={{ base: "column", md: "row" }}
                gap={4}
                mb={6}
                align="center"
              >
                <InputGroup maxW={{ base: "full", md: "360px" }}>
                  <InputLeftElement>
                    <Icon as={FaSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search by name, SKU, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    bg="gray.50"
                    border="none"
                    _focus={{ bg: "white", shadow: "outline", ringColor: "cyan.500" }}
                  />
                </InputGroup>

                <Tabs variant="soft-rounded" colorScheme="cyan" index={showInactive ? 1 : 0} onChange={(index) => setShowInactive(index === 1)} size="sm">
                  <TabList>
                    <Tab>Active</Tab>
                    <Tab>Trash</Tab>
                  </TabList>
                </Tabs>

                <Select
                  maxW={{ base: "full", md: "240px" }}
                  placeholder="All Categories"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  bg="gray.50"
                  border="none"
                >
                  {categoryStore.categories
                    .filter((cat: any) => !cat.parent)
                    .map((cat: any) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </Select>

                <Badge ml="auto" colorScheme="cyan" variant="subtle" fontSize="sm" px={3} py={1.5}>
                  {filteredProducts.length} visible
                </Badge>
              </Flex>

              <Divider my={5} />

              {filteredProducts.length === 0 ? (
                /* Unified Empty State */
                <Center py={14}>
                  <VStack spacing={6} textAlign="center" maxW="md">
                    <Image
                      src="https://mir-s3-cdn-cf.behance.net/project_modules/1400/8e427a83004519.5d2ef81a41825.png"
                      alt="No products found"
                      borderRadius="lg"
                      shadow="sm"
                      maxH="280px"
                      objectFit="contain"
                      fallbackSrc="https://via.placeholder.com/600x400?text=Empty+Inventory"
                    />
                    <VStack spacing={3}>
                      <Heading size="lg" color="gray.700">
                        {searchTerm || selectedCategory
                          ? "No products found"
                          : showInactive
                            ? "Trash is empty"
                            : "No products added yet"}
                      </Heading>
                      <Text fontSize="md" color="gray.500">
                        {searchTerm || selectedCategory
                          ? "We couldn't find any products matching your search or filters."
                          : showInactive
                            ? "There are no deleted products."
                            : "Start building your store by adding your first product."}
                      </Text>
                    </VStack>
                    {!searchTerm && !selectedCategory && !showInactive && (
                      <Button
                        colorScheme="cyan"
                        size="lg"
                        leftIcon={<FaPlus />}
                        px={8}
                        onClick={onOpen}
                      >
                        Add Your First Product
                      </Button>
                    )}
                  </VStack>
                </Center>
              ) : (
                <>
                  <Flex justify="space-between" align="center" mb={6}>
                    <Heading size="lg" color="gray.800" display="flex" alignItems="center" gap={2}>
                      <Icon as={showInactive ? FaTrash : FaFire} color={showInactive ? "red.500" : "orange.500"} />
                      {showInactive ? "Inactive Products" : "Active Products"}
                    </Heading>

                    <Tabs variant="soft-rounded" colorScheme="cyan" index={showInactive ? 1 : 0} onChange={(index) => setShowInactive(index === 1)}>
                      <TabList>
                        <Tab>Active</Tab>
                        <Tab>Trash</Tab>
                      </TabList>
                    </Tabs>
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

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <Flex justify="center" mt={10} gap={4} align="center">
                      <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        isDisabled={currentPage === 1}
                        colorScheme="cyan"
                        variant="outline"
                      >
                        Previous
                      </Button>
                      <Text fontWeight="bold" color="gray.600">
                        Page {currentPage} of {totalPages}
                      </Text>
                      <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        isDisabled={currentPage === totalPages}
                        colorScheme="cyan"
                        variant="outline"
                      >
                        Next
                      </Button>
                    </Flex>
                  )}
                </>
              )}
            </Box>
          )}
        </Box>
      </Container>

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
        isEdit={!!selectedProduct}
      />

      <DeleteProductDialog
        isOpen={deleteOpen.open}
        onClose={() => setDeleteOpen({ open: false, data: null })}
        onConfirm={confirmDelete}
        data={deleteOpen.data}
      />
    </Box>
  );
});

export default ProductsPage;