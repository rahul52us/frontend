"use client";

import React, { useRef } from "react";
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
} from "@chakra-ui/react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { FaBoxOpen, FaSave, FaPlus, FaTrash, FaUpload } from "react-icons/fa";
import axios from "axios";
import { AUTH_TOKEN, BACKEND_URL, USER_SESSION_DATA } from "../../config/utils/variables";

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

const ProductsPage = () => {
    const toast = useToast();
    const cardBg = useColorModeValue("white", "gray.800");
    const fileInputRef = useRef(null);

    const initialValues = {
        name: "",
        description: "",
        sku: "",
        category: "",
        price: "",
        stock: 0,
        brand: "",
        weight: "",
        productDetails: [{ key: "", value: "" }],
        information: [{ key: "", value: "" }],
        images: [],
    };

    const handleSubmit = async (values: any, actions: any) => {
        try {
            // Note: images are sending as Blob URLs (strings).
            // A real implementation requires a file upload handler (e.g. S3/Cloudinary)
            // to convert Files -> URLs before sending to this endpoint.

            const response = await axios.post("/product/create", values);

            if (response.data?.success || response.status === 201) {
                toast({
                    title: "Product Created.",
                    description: "Product created successfully.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                actions.resetForm();
            }
        } catch (error: any) {
            console.error("Submission Error:", error);
            toast({
                title: "Error creating product.",
                description: error.response?.data?.message || "Something went wrong.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            actions.setSubmitting(false);
        }
    };

    const handleImageUpload = (event, setFieldValue, currentImages) => {
        const files = Array.from(event.target.files);
        // In a real app, you might upload these to S3/Cloudinary here or convert to Base64
        // For this demo, we'll create object URLs
        const newImages = files.map((file: any) => URL.createObjectURL(file));
        setFieldValue("images", [...currentImages, ...newImages]);
    };

    return (
        <Container maxW="container.xl" py={8}>
            <Flex direction="column" gap={6}>
                <Box>
                    <Heading size="lg" mb={2} display="flex" alignItems="center" gap={3}>
                        <Icon as={FaBoxOpen} color="blue.500" />
                        Add New Product
                    </Heading>
                    <Text color="gray.500">
                        Create a new product card for your shop.
                    </Text>
                </Box>

                <Box
                    bg={cardBg}
                    p={8}
                    borderRadius="xl"
                    boxShadow="sm"
                    border="1px solid"
                    borderColor={useColorModeValue("gray.100", "gray.700")}
                >
                    <Formik
                        initialValues={initialValues}
                        validationSchema={ProductSchema}
                        onSubmit={handleSubmit}
                    >
                        {(props) => (
                            <Form>
                                <VStack spacing={6} align="stretch">
                                    {/* Basic Info */}
                                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                        <Field name="name">
                                            {({ field, form }) => (
                                                <FormControl
                                                    isInvalid={form.errors.name && form.touched.name}
                                                    isRequired
                                                >
                                                    <FormLabel>Product Name</FormLabel>
                                                    <Input {...field} placeholder="e.g. Wireless Headphones" />
                                                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>

                                        <Field name="brand">
                                            {({ field, form }) => (
                                                <FormControl
                                                    isInvalid={form.errors.brand && form.touched.brand}
                                                >
                                                    <FormLabel>Brand</FormLabel>
                                                    <Input {...field} placeholder="e.g. Sony" />
                                                    <FormErrorMessage>{form.errors.brand}</FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>
                                    </SimpleGrid>

                                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                                        <Field name="sku">
                                            {({ field, form }) => (
                                                <FormControl
                                                    isInvalid={form.errors.sku && form.touched.sku}
                                                >
                                                    <FormLabel>SKU</FormLabel>
                                                    <Input {...field} placeholder="e.g. WH-1000XM4" />
                                                    <FormErrorMessage>{form.errors.sku}</FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>

                                        <Field name="weight">
                                            {({ field, form }) => (
                                                <FormControl
                                                    isInvalid={form.errors.weight && form.touched.weight}
                                                >
                                                    <FormLabel>Weight</FormLabel>
                                                    <Input {...field} placeholder="e.g. 250g" />
                                                    <FormErrorMessage>{form.errors.weight}</FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>

                                        <Field name="category">
                                            {({ field, form }) => (
                                                <FormControl
                                                    isInvalid={
                                                        form.errors.category && form.touched.category
                                                    }
                                                    isRequired
                                                >
                                                    <FormLabel>Category</FormLabel>
                                                    <Select {...field} placeholder="Select Category">
                                                        {activeCategories.map((cat) => (
                                                            <option key={cat} value={cat}>
                                                                {cat}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                    <FormErrorMessage>
                                                        {form.errors.category}
                                                    </FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>
                                    </SimpleGrid>

                                    <Field name="description">
                                        {({ field, form }) => (
                                            <FormControl
                                                isInvalid={
                                                    form.errors.description && form.touched.description
                                                }
                                            >
                                                <FormLabel>Description</FormLabel>
                                                <Textarea
                                                    {...field}
                                                    placeholder="Detailed description of the product..."
                                                    rows={4}
                                                />
                                                <FormErrorMessage>
                                                    {form.errors.description}
                                                </FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>

                                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                        <Field name="price">
                                            {({ field, form }) => (
                                                <FormControl
                                                    isInvalid={form.errors.price && form.touched.price}
                                                    isRequired
                                                >
                                                    <FormLabel>Price ($)</FormLabel>
                                                    <NumberInput
                                                        min={0}
                                                        onChange={(val) => form.setFieldValue(field.name, val)}
                                                        value={field.value}
                                                    >
                                                        <NumberInputField placeholder="0.00" />
                                                    </NumberInput>
                                                    <FormErrorMessage>{form.errors.price}</FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>

                                        <Field name="stock">
                                            {({ field, form }) => (
                                                <FormControl
                                                    isInvalid={form.errors.stock && form.touched.stock}
                                                    isRequired
                                                >
                                                    <FormLabel>Stock Quantity</FormLabel>
                                                    <NumberInput
                                                        min={0}
                                                        onChange={(val) => form.setFieldValue(field.name, val)}
                                                        value={field.value}
                                                    >
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
                                            {props.values.images.map((src, index) => (
                                                <Box key={index} position="relative" boxSize="100px">
                                                    <Image src={src} alt={`Product ${index}`} boxSize="100%" objectFit="cover" borderRadius="md" />
                                                    <IconButton
                                                        aria-label="Remove image"
                                                        icon={<FaTrash />}
                                                        size="xs"
                                                        colorScheme="red"
                                                        position="absolute"
                                                        top={-2}
                                                        right={-2}
                                                        onClick={() => {
                                                            const newImages = props.values.images.filter((_, i) => i !== index);
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

                                    {/* Product Details (Dynamic) */}
                                    <Box>
                                        <FormLabel>Product Details</FormLabel>
                                        <FieldArray name="productDetails">
                                            {({ push, remove }) => (
                                                <VStack spacing={3} align="stretch">
                                                    {props.values.productDetails.map((detail, index) => (
                                                        <HStack key={index}>
                                                            <Field name={`productDetails[${index}].key`}>
                                                                {({ field, form }) => (
                                                                    <FormControl isInvalid={form.errors.productDetails?.[index]?.key && form.touched.productDetails?.[index]?.key}>
                                                                        <Input {...field} placeholder="Attribute (e.g. Color)" />
                                                                    </FormControl>
                                                                )}
                                                            </Field>
                                                            <Field name={`productDetails[${index}].value`}>
                                                                {({ field, form }) => (
                                                                    <FormControl isInvalid={form.errors.productDetails?.[index]?.value && form.touched.productDetails?.[index]?.value}>
                                                                        <Input {...field} placeholder="Value (e.g. Red)" />
                                                                    </FormControl>
                                                                )}
                                                            </Field>
                                                            <IconButton
                                                                aria-label="Remove detail"
                                                                icon={<FaTrash />}
                                                                colorScheme="red"
                                                                variant="ghost"
                                                                onClick={() => remove(index)}
                                                            />
                                                        </HStack>
                                                    ))}
                                                    <Button
                                                        leftIcon={<FaPlus />}
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => push({ key: "", value: "" })}
                                                        alignSelf="flex-start"
                                                    >
                                                        Add Detail
                                                    </Button>
                                                </VStack>
                                            )}
                                        </FieldArray>
                                    </Box>

                                    {/* Information (Dynamic) */}
                                    <Box>
                                        <FormLabel>Additional Information</FormLabel>
                                        <FieldArray name="information">
                                            {({ push, remove }) => (
                                                <VStack spacing={3} align="stretch">
                                                    {props.values.information.map((info, index) => (
                                                        <HStack key={index}>
                                                            <Field name={`information[${index}].key`}>
                                                                {({ field, form }) => (
                                                                    <FormControl isInvalid={form.errors.information?.[index]?.key && form.touched.information?.[index]?.key}>
                                                                        <Input {...field} placeholder="Title (e.g. Disclaimer)" />
                                                                    </FormControl>
                                                                )}
                                                            </Field>
                                                            <Field name={`information[${index}].value`}>
                                                                {({ field, form }) => (
                                                                    <FormControl isInvalid={form.errors.information?.[index]?.value && form.touched.information?.[index]?.value}>
                                                                        <Input {...field} placeholder="Content (e.g. Not a toy)" />
                                                                    </FormControl>
                                                                )}
                                                            </Field>
                                                            <IconButton
                                                                aria-label="Remove information"
                                                                icon={<FaTrash />}
                                                                colorScheme="red"
                                                                variant="ghost"
                                                                onClick={() => remove(index)}
                                                            />
                                                        </HStack>
                                                    ))}
                                                    <Button
                                                        leftIcon={<FaPlus />}
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => push({ key: "", value: "" })}
                                                        alignSelf="flex-start"
                                                    >
                                                        Add Information
                                                    </Button>
                                                </VStack>
                                            )}
                                        </FieldArray>
                                    </Box>

                                    <Box pt={4}>
                                        <Button
                                            type="submit"
                                            colorScheme="blue"
                                            size="lg"
                                            isLoading={props.isSubmitting}
                                            leftIcon={<FaSave />}
                                            loadingText="Saving..."
                                        >
                                            Save Product
                                        </Button>
                                    </Box>
                                </VStack>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Flex>
        </Container>
    );
};

export default ProductsPage;
