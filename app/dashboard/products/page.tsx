"use client";

import React, { useRef, useState, useEffect } from "react";
import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Text,
    useToast,
    SimpleGrid,
    useColorModeValue,
    Icon,
    Spinner,
    useDisclosure,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { FaBoxOpen, FaPlus } from "react-icons/fa";
import axios from "axios";
import { observer } from "mobx-react-lite";
import stores from "../../store/stores";
import ProductCard from "./components/ProductCard";
import ProductForm from "./components/ProductForm";
import DeleteProductDialog from "./components/DeleteProductDialog";

const activeCategories = [
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
    const cardBg = useColorModeValue("white", "gray.800");

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

    const { shopStore, auth } = stores;

    const triggerDelete = (productId: string) => {
        setSelectedProduct(productId);
        setDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedProduct) return;
        setDeleteOpen(false);
        try {
            await shopStore.deleteProduct(selectedProduct);
            toast({
                title: "Product Deleted",
                description: "The product has been removed.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            fetchProducts();
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

    const fetchProducts = async () => {
        if (!auth.company) return;
        setLoading(true);
        try {
            const res = await shopStore.getShopProducts({ company: auth.company });
            setProducts(res.data || []);
        } catch (error) {
            console.error("Fetch Products Error:", error);
            toast({
                title: "Error fetching products.",
                status: "error",
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [auth.company]);

    const handleEdit = (product: any) => {
        setSelectedProduct(product._id);
        setDeleteOpen(false);
        onOpen();
    };

    const initialValues = selectedProduct && products.find(p => p._id === selectedProduct) ? {
        ...products.find(p => p._id === selectedProduct),
        images: products.find(p => p._id === selectedProduct).images || [],
        productDetails: products.find(p => p._id === selectedProduct).productDetails ?
            Object.entries(products.find(p => p._id === selectedProduct).productDetails).map(([key, value]) => ({ key, value })) : [],
        information: products.find(p => p._id === selectedProduct).information ?
            Object.entries(products.find(p => p._id === selectedProduct).information).map(([key, value]) => ({ key, value })) : [],
    } : {
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
        console.log("Submitting product form with values:", values);
        try {
            const cleanImages = values.images.map((img: any) => {
                if (img.buffer) {
                    const { preview, ...rest } = img;
                    return rest;
                }
                return img;
            });

            const payload = { ...values, images: cleanImages };

            let response;
            if (selectedProduct) {
                response = await shopStore.updateProduct(selectedProduct, payload);
            } else {
                response = await axios.post("/product/create", payload);
            }

            if (response.success || response.data?.success || response.status === "success" || response.status === 201 || response.status === 200 || response.statusCode === 200 || response.statusCode === 201) {
                toast({
                    title: selectedProduct ? "Product Updated." : "Product Created.",
                    description: selectedProduct ? "Product updated successfully." : "Product created successfully.",
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
            console.error("Submission Error:", error);
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
        <Container maxW="container.xl" py={8}>
            <Flex justifyContent="space-between" alignItems="center" mb={6}>
                <Box>
                    <Heading size="lg" mb={2} display="flex" alignItems="center" gap={3}>
                        <Icon as={FaBoxOpen} color="blue.500" />
                        Products
                    </Heading>
                    <Text color="gray.500">
                        Manage your shop's inventory
                    </Text>
                </Box>
                <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={onOpen}>
                    Add Product
                </Button>
            </Flex>

            {/* Product List */}
            {loading ? (
                <Flex justify="center" align="center" h="200px">
                    <Spinner size="xl" color="blue.500" />
                </Flex>
            ) : products.length === 0 ? (
                <Box
                    textAlign="center"
                    py={10}
                    px={6}
                    bg={cardBg}
                    borderRadius="xl"
                    border="1px dashed"
                    borderColor="gray.300"
                >
                    <Text fontSize="lg" color="gray.500" mb={4}>
                        No products found. Start by adding one!
                    </Text>
                    <Button colorScheme="blue" variant="outline" onClick={onOpen}>
                        Create First Product
                    </Button>
                </Box>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
                    {products.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onEdit={handleEdit}
                            onDelete={triggerDelete}
                        />
                    ))}
                </SimpleGrid>
            )}

            <ProductForm
                isOpen={isOpen}
                onClose={() => { onClose(); setSelectedProduct(null); }}
                initialValues={initialValues}
                validationSchema={ProductSchema}
                onSubmit={handleSubmit}
                activeCategories={activeCategories}
                isEdit={!!selectedProduct}
            />

            <DeleteProductDialog
                isOpen={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={confirmDelete}
            />
        </Container>
    );
});

export default ProductsPage;
