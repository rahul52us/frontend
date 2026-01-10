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
} from "@chakra-ui/react";
import * as Yup from "yup";
import {
  FaBoxOpen,
  FaPlus,
  FaSearch,
  FaFire,
} from "react-icons/fa";
import axios from "axios";
import { observer } from "mobx-react-lite";
import stores from "../../store/stores";
import ProductCard from "./components/ProductCard";
import ProductForm from "./components/ProductForm";
import DeleteProductDialog from "./components/DeleteProductDialog";

const activeCategories = [
  "",
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports",
  "Toys",
  "Health & Beauty",
  "Automotive",
];

const ProductSchema = Yup.object().shape({
  name: Yup.string().required("Product Name is required"),
  category: Yup.string().required("Category is required"),
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
  images: Yup.array().min(1, "At least one image is required"),
});

const ProductsPage = observer(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

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

  const { shopStore, auth } = stores;

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
      const res = await shopStore.getShopProducts({ company: companyId, page: page, limit: 12, search, category });
      const data = res.data?.products || [];
      const { totalPages, total } = res.data || {};

      setProducts(data);
      setFilteredProducts(data);
      setTotalPages(totalPages || 1);
      setTotalCount(total || 0);
      setCurrentPage(page);
    } catch (error) {
      toast({
        title: "Error fetching products.",
        status: "error",
        description:error?.message,
        duration: 3000,
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

  useEffect(() => {
    fetchProducts(1);
  }, [auth.company]);

  // Debounce Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(1, searchTerm);
    }, 2000); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts(1, searchTerm, selectedCategory);
  }, [selectedCategory]);

  const handleEdit = (product: any) => {
    setSelectedProduct(product._id);
    setDeleteOpen({ open: false, data: null });
    onOpen();
  };

  const initialValues =
    selectedProduct && products.find((p) => p._id === selectedProduct)
      ? {
        ...products.find((p) => p._id === selectedProduct),
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
      };

  const handleSubmit = async (values: any, actions: any) => {
    try {
      // const cleanImages = values.images.map((img: any) => {
      //   if (img.buffer) {
      //     const { preview, ...rest } = img;
      //     return rest;
      //   }
      //   return img;
      // });

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
        toast({
          title: selectedProduct ? "Product Updated." : "Product Created.",
          description: selectedProduct
            ? "Product updated successfully."
            : "Product created successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        actions.resetForm();
        onClose();
        setSelectedProduct(null);
        fetchProducts();
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
          ) : products.length === 0 && !searchTerm ? (
            /* Clean & Minimal Empty State */
            <Center py={14}>
              <VStack spacing={6} textAlign="center" maxW="md">
                <Image
                  src="https://mir-s3-cdn-cf.behance.net/project_modules/1400/8e427a83004519.5d2ef81a41825.png"
                  alt="No products yet – your inventory is empty"
                  borderRadius="lg"
                  shadow="sm"
                  maxH="280px"
                  objectFit="contain"
                  fallbackSrc="https://via.placeholder.com/600x400?text=Empty+Inventory"
                />
                <VStack spacing={3}>
                  <Heading size="lg" color="gray.700">
                    No products added yet
                  </Heading>
                  <Text fontSize="md" color="gray.500">
                    Start building your store by adding your first product.
                  </Text>
                </VStack>
                <Button
                  colorScheme="cyan"
                  size="lg"
                  leftIcon={<FaPlus />}
                  px={8}
                  onClick={onOpen}
                >
                  Add Your First Product
                </Button>
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

                <Select
                  maxW={{ base: "full", md: "240px" }}
                  placeholder="All Categories"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  bg="gray.50"
                  border="none"
                >
                  {activeCategories.slice(1).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Select>

                <Badge ml="auto" colorScheme="cyan" variant="subtle" fontSize="sm" px={3} py={1.5}>
                  {filteredProducts.length} visible
                </Badge>
              </Flex>

              <Divider my={5} />

              <Heading size="lg" mb={6} color="gray.800" display="flex" alignItems="center" gap={2}>
                <Icon as={FaFire} color="orange.500" />
                Active Products
              </Heading>

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
        activeCategories={activeCategories.filter(c => c !== "")}
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