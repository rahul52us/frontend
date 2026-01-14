"use client";

import React from "react";
import {
    Box,
    Button,
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
    Badge,
} from "@chakra-ui/react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

const CategoriesPage = () => {
    // Mock data
    const categories = [
        { id: 1, name: "Electronics", slug: "electronics", subCategories: 5 },
        { id: 2, name: "Fashion", slug: "fashion", subCategories: 12 },
        { id: 3, name: "Home & Garden", slug: "home-garden", subCategories: 8 },
    ];

    return (
        <Box p={6}>
            <HStack justify="space-between" mb={6}>
                <Heading size="lg">Categories</Heading>
                <Button leftIcon={<FiPlus />} colorScheme="blue">
                    Add Category
                </Button>
            </HStack>

            <Card>
                <CardBody>
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Slug</Th>
                                <Th isNumeric>Sub-categories</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {categories.map((cat) => (
                                <Tr key={cat.id}>
                                    <Td fontWeight="medium">{cat.name}</Td>
                                    <Td>
                                        <Badge colorScheme="gray">{cat.slug}</Badge>
                                    </Td>
                                    <Td isNumeric>{cat.subCategories}</Td>
                                    <Td>
                                        <HStack spacing={2}>
                                            <IconButton
                                                aria-label="Edit"
                                                icon={<FiEdit2 />}
                                                size="sm"
                                                variant="ghost"
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

export default CategoriesPage;
