"use client";

import React, { useRef, useState, useEffect } from "react";
import {
    Box,
    Button,
    Container,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    NumberInput,
    NumberInputField,
    Select,
    Text,
    Textarea,
    VStack,
    useToast,
    FormErrorMessage,
    SimpleGrid,
    useColorModeValue,
    Icon,
    IconButton,
    HStack,
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    useDisclosure,
    Spinner,
    Badge,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
} from "@chakra-ui/react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { FaBoxOpen, FaSave, FaPlus, FaTrash, FaUpload, FaEdit } from "react-icons/fa";
import axios from "axios";
import { observer } from "mobx-react-lite";
import stores from "../../store/stores";

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
    const borderColor = useColorModeValue("gray.100", "gray.700");
    const fileInputRef = useRef(null);

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const cancelRef = useRef(null);

    const { shopStore, auth } = stores;

    const triggerDelete = (productId: string) => {
        setSelectedProduct(productId);
        setDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedProduct) return;
        setDeleteOpen(false); // Close immediately for better UX or wait?
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
        setDeleteOpen(false); // Ensure delete dialog is closed
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
                onClose(); // Close modal on success
                setSelectedProduct(null); // Reset selection
                fetchProducts(); // Refresh list
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

    const handleImageUpload = async (event: any, setFieldValue: any, currentImages: any[]) => {
        const files = Array.from(event.target.files);

        const fileReaders = files.map((file: any) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve({
                        filename: file.name,
                        buffer: reader.result,
                        isAdd: true,
                        preview: URL.createObjectURL(file)
                    });
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        try {
            const newImages = await Promise.all(fileReaders);
            setFieldValue("images", [...currentImages, ...newImages]);
        } catch (error) {
            console.error("Error reading files:", error);
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
                        <Box
                            key={product._id}
                            bg={cardBg}
                            borderRadius="xl"
                            overflow="hidden"
                            boxShadow="sm"
                            border="1px solid"
                            borderColor={borderColor}
                            transition="all 0.2s"
                            _hover={{ transform: "translateY(-4px)", boxShadow: "md" }}
                        >
                            <Box h="200px" w="100%" position="relative" bg="gray.100">
                                <Image
                                    src={product.images?.[0] || "https://via.placeholder.com/300"}
                                    alt={product.name}
                                    objectFit="cover"
                                    w="100%"
                                    h="100%"
                                />
                                <Badge
                                    position="absolute"
                                    top={2}
                                    right={2}
                                    colorScheme={product.stock > 0 ? "green" : "red"}
                                >
                                    {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
                                </Badge>
                            </Box>
                            <Box p={4}>
                                <Flex justify="space-between" align="start" mb={2}>
                                    <Heading size="sm" noOfLines={1} title={product.name}>
                                        {product.name}
                                    </Heading>
                                    <Text fontWeight="bold" color="blue.600">
                                        ₹{product.price}
                                    </Text>
                                </Flex>
                                <Text fontSize="xs" color="gray.500" mb={3} noOfLines={2}>
                                    {product.description || "No description avaiable"}
                                </Text>
                                <HStack justify="space-between">
                                    <Badge variant="outline" colorScheme="purple">
                                        {product.category}
                                    </Badge>
                                    <HStack spacing={0}>
                                        <IconButton
                                            aria-label="Edit product"
                                            icon={<FaEdit />}
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleEdit(product)}
                                        />
                                        <IconButton
                                            aria-label="Delete product"
                                            icon={<FaTrash />}
                                            size="sm"
                                            colorScheme="red"
                                            variant="ghost"
                                            onClick={() => triggerDelete(product._id)}
                                        />
                                    </HStack>
                                    {/* <IconButton
                                        aria-label="Edit product"
                                        icon={<FaEdit />}
                                        size="sm"
                                        variant="ghost"
                                    /> */}
                                </HStack>
                            </Box>
                        </Box>
                    ))}
                </SimpleGrid>
            )}

            {/* Create/Edit Product Modal */}
            <Modal isOpen={isOpen} onClose={() => { onClose(); setSelectedProduct(null); }} size="4xl" scrollBehavior="inside">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedProduct ? "Edit Product" : "Add New Product"}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={ProductSchema}
                            onSubmit={handleSubmit}
                        >
                            {(props) => (
                                <Form>
                                    <VStack spacing={6} align="stretch">
                                        {/* Copied Form Content from Previous Implementation */}
                                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                            <Field name="name">
                                                {({ field, form }: any) => (
                                                    <FormControl isInvalid={form.errors.name && form.touched.name} isRequired>
                                                        <FormLabel>Product Name</FormLabel>
                                                        <Input {...field} placeholder="e.g. Wireless Headphones" />
                                                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                                    </FormControl>
                                                )}
                                            </Field>
                                            <Field name="brand">
                                                {({ field, form }: any) => (
                                                    <FormControl isInvalid={form.errors.brand && form.touched.brand}>
                                                        <FormLabel>Brand</FormLabel>
                                                        <Input {...field} placeholder="e.g. Sony" />
                                                        <FormErrorMessage>{form.errors.brand}</FormErrorMessage>
                                                    </FormControl>
                                                )}
                                            </Field>
                                        </SimpleGrid>

                                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                                            <Field name="sku">
                                                {({ field, form }: any) => (
                                                    <FormControl isInvalid={form.errors.sku && form.touched.sku}>
                                                        <FormLabel>SKU</FormLabel>
                                                        <Input {...field} placeholder="e.g. WH-1000XM4" />
                                                        <FormErrorMessage>{form.errors.sku}</FormErrorMessage>
                                                    </FormControl>
                                                )}
                                            </Field>
                                            <Field name="weight">
                                                {({ field, form }: any) => (
                                                    <FormControl isInvalid={form.errors.weight && form.touched.weight}>
                                                        <FormLabel>Weight</FormLabel>
                                                        <Input {...field} placeholder="e.g. 250g" />
                                                        <FormErrorMessage>{form.errors.weight}</FormErrorMessage>
                                                    </FormControl>
                                                )}
                                            </Field>
                                            <Field name="category">
                                                {({ field, form }: any) => (
                                                    <FormControl isInvalid={form.errors.category && form.touched.category} isRequired>
                                                        <FormLabel>Category</FormLabel>
                                                        <Select {...field} placeholder="Select Category">
                                                            {activeCategories.map((cat) => (
                                                                <option key={cat} value={cat}>{cat}</option>
                                                            ))}
                                                        </Select>
                                                        <FormErrorMessage>{form.errors.category}</FormErrorMessage>
                                                    </FormControl>
                                                )}
                                            </Field>
                                        </SimpleGrid>

                                        <Field name="description">
                                            {({ field, form }: any) => (
                                                <FormControl isInvalid={form.errors.description && form.touched.description}>
                                                    <FormLabel>Description</FormLabel>
                                                    <Textarea {...field} placeholder="Detailed description..." rows={4} />
                                                    <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>

                                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                            <Field name="price">
                                                {({ field, form }: any) => (
                                                    <FormControl isInvalid={form.errors.price && form.touched.price} isRequired>
                                                        <FormLabel>Price (₹)</FormLabel>
                                                        <NumberInput min={0} onChange={(val) => form.setFieldValue(field.name, val)} value={field.value}>
                                                            <NumberInputField placeholder="0.00" />
                                                        </NumberInput>
                                                        <FormErrorMessage>{form.errors.price}</FormErrorMessage>
                                                    </FormControl>
                                                )}
                                            </Field>
                                            <Field name="stock">
                                                {({ field, form }: any) => (
                                                    <FormControl isInvalid={form.errors.stock && form.touched.stock} isRequired>
                                                        <FormLabel>Stock Quantity</FormLabel>
                                                        <NumberInput min={0} onChange={(val) => form.setFieldValue(field.name, val)} value={field.value}>
                                                            <NumberInputField placeholder="0" />
                                                        </NumberInput>
                                                        <FormErrorMessage>{form.errors.stock}</FormErrorMessage>
                                                    </FormControl>
                                                )}
                                            </Field>
                                        </SimpleGrid>

                                        {/* Images Section */}
                                        <FormControl isInvalid={!!(props.errors.images && props.touched.images)}>
                                            <FormLabel>Product Images</FormLabel>
                                            <HStack spacing={4} wrap="wrap">
                                                {props.values.images.map((img: any, index: number) => (
                                                    <Box key={index} position="relative" boxSize="100px">
                                                        <Image
                                                            src={img.preview || img}
                                                            alt={`Product ${index}`}
                                                            boxSize="100%"
                                                            objectFit="cover"
                                                            borderRadius="md"
                                                        />
                                                        <IconButton
                                                            aria-label="Remove image"
                                                            icon={<FaTrash />}
                                                            size="xs"
                                                            colorScheme="red"
                                                            position="absolute"
                                                            top={-2}
                                                            right={-2}
                                                            onClick={() => {
                                                                const newImages = props.values.images.filter((_: any, i: number) => i !== index);
                                                                props.setFieldValue("images", newImages);
                                                            }}
                                                        />
                                                    </Box>
                                                ))}
                                                <Box
                                                    boxSize="100px"
                                                    border="2px dashed"
                                                    borderColor="gray.300"
                                                    borderRadius="md"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    cursor="pointer"
                                                    _hover={{ borderColor: "blue.500", bg: "gray.50" }}
                                                    onClick={() => fileInputRef.current.click()}
                                                >
                                                    <Icon as={FaUpload} color="gray.400" boxSize={6} />
                                                    <input
                                                        type="file"
                                                        multiple
                                                        ref={fileInputRef}
                                                        style={{ display: "none" }}
                                                        onChange={(e) => handleImageUpload(e, props.setFieldValue, props.values.images)}
                                                        accept="image/*"
                                                    />
                                                </Box>
                                            </HStack>
                                            <FormErrorMessage>{typeof props.errors.images === 'string' ? props.errors.images : "Invalid images"}</FormErrorMessage>
                                        </FormControl>

                                        {/* Product Details & Information - Keep expandable sections */}
                                        <Box>
                                            <FormLabel>Product Details</FormLabel>
                                            <FieldArray name="productDetails">
                                                {({ push, remove }) => (
                                                    <VStack spacing={3} align="stretch">
                                                        {props.values.productDetails.map((detail, index) => (
                                                            <HStack key={index}>
                                                                <Field name={`productDetails[${index}].key`}>
                                                                    {({ field, form }: any) => (
                                                                        <FormControl isInvalid={form.errors.productDetails?.[index]?.key && form.touched.productDetails?.[index]?.key}>
                                                                            <Input {...field} placeholder="Attribute" />
                                                                        </FormControl>
                                                                    )}
                                                                </Field>
                                                                <Field name={`productDetails[${index}].value`}>
                                                                    {({ field, form }: any) => (
                                                                        <FormControl isInvalid={form.errors.productDetails?.[index]?.value && form.touched.productDetails?.[index]?.value}>
                                                                            <Input {...field} placeholder="Value" />
                                                                        </FormControl>
                                                                    )}
                                                                </Field>
                                                                <IconButton aria-label="Remove" icon={<FaTrash />} colorScheme="red" variant="ghost" onClick={() => remove(index)} />
                                                            </HStack>
                                                        ))}
                                                        <Button leftIcon={<FaPlus />} size="sm" variant="outline" onClick={() => push({ key: "", value: "" })} alignSelf="flex-start">Add Detail</Button>
                                                    </VStack>
                                                )}
                                            </FieldArray>
                                        </Box>

                                        <Box pt={4}>
                                            <Button type="submit" colorScheme="blue" size="lg" isLoading={props.isSubmitting} width="full">
                                                {selectedProduct ? "Update Product" : "Create Product"}
                                            </Button>
                                        </Box>
                                    </VStack>
                                </Form>
                            )}
                        </Formik>
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                isOpen={deleteOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => setDeleteOpen(false)}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Product
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => setDeleteOpen(false)}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Container>
    );
});

export default ProductsPage;
