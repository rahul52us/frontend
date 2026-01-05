"use client";

import React from "react";
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
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FaBoxOpen, FaSave } from "react-icons/fa";

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
    description: Yup.string().required("Description is required").min(10, "Description must be at least 10 characters"),
    sku: Yup.string().required("SKU is required"),
    category: Yup.string().required("Category is required"),
    price: Yup.number()
        .required("Price is required")
        .positive("Price must be positive"),
    stock: Yup.number()
        .required("Stock level is required")
        .integer("Stock must be an integer")
        .min(0, "Stock cannot be negative"),
});

const ProductsPage = () => {
    const toast = useToast();
    const cardBg = useColorModeValue("white", "gray.800");

    const initialValues = {
        name: "",
        description: "",
        sku: "",
        category: "",
        price: "",
        stock: "",
    };

    const handleSubmit = (values, actions) => {
        setTimeout(() => {
            console.log("Product Submitted:", values);
            toast({
                title: "Product Created.",
                description: "We've created your product layout for you.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            actions.setSubmitting(false);
            actions.resetForm();
        }, 1000);
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

                                        <Field name="sku">
                                            {({ field, form }) => (
                                                <FormControl
                                                    isInvalid={form.errors.sku && form.touched.sku}
                                                    isRequired
                                                >
                                                    <FormLabel>SKU</FormLabel>
                                                    <Input {...field} placeholder="e.g. WH-1000XM4" />
                                                    <FormErrorMessage>{form.errors.sku}</FormErrorMessage>
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
                                                isRequired
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

                                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
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
