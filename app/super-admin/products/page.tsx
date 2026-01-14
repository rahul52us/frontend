"use client";

import React from "react";
import {
    Box,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    HStack,
    IconButton,
    Card,
    CardBody,
    Text,
} from "@chakra-ui/react";
import { FiTrash2, FiEye } from "react-icons/fi";

const SuperAdminProductsPage = () => {
    // Mock data
    const products = [
        { id: 1, name: "Wireless Headphones", shop: "Tech World", price: 99.99, image: "/images/product-placeholder.png" },
        { id: 2, name: "Cotton T-Shirt", shop: "Fashion Hub", price: 29.99, image: "/images/product-placeholder.png" },
        { id: 3, name: "Smartphone", shop: "Tech World", price: 699.99, image: "/images/product-placeholder.png" },
    ];

    return (
        <Box p={6}>
            <Heading size="lg" mb={6}>All Products</Heading>

            <Card>
                <CardBody>
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Product</Th>
                                <Th>Shop</Th>
                                <Th isNumeric>Price</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {products.map((product) => (
                                <Tr key={product.id}>
                                    <Td>
                                        <HStack>
                                            <Box boxSize="40px" bg="gray.100" borderRadius="md" overflow="hidden">
                                                {/* Placeholder since we mock images */}
                                                <Box w="100%" h="100%" bg="gray.200" />
                                            </Box>
                                            <Text fontWeight="medium">{product.name}</Text>
                                        </HStack>
                                    </Td>
                                    <Td>{product.shop}</Td>
                                    <Td isNumeric>${product.price}</Td>
                                    <Td>
                                        <HStack spacing={2}>
                                            <IconButton
                                                aria-label="View"
                                                icon={<FiEye />}
                                                size="sm"
                                                variant="ghost"
                                                colorScheme="blue"
                                            />
                                            <IconButton
                                                aria-label="Delete"
                                                icon={<FiTrash2 />}
                                                size="sm"
                                                variant="ghost"
                                                colorScheme="red"
                                            />
                                        </HStack>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </CardBody>
            </Card>
        </Box>
    );
};

export default SuperAdminProductsPage;
