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
    Avatar,
    Text,
    Badge,
} from "@chakra-ui/react";
import { FiEdit2, FiTrash2, FiExternalLink } from "react-icons/fi";

const ShopsPage = () => {
    // Mock data
    const shops = [
        { id: 1, name: "Tech World", owner: "John Doe", status: "Active", products: 45 },
        { id: 2, name: "Fashion Hub", owner: "Jane Smith", status: "Pending", products: 12 },
        { id: 3, name: "Green Earth", owner: "Mike Ross", status: "Suspended", products: 0 },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active": return "green";
            case "Pending": return "orange";
            case "Suspended": return "red";
            default: return "gray";
        }
    };

    return (
        <Box p={6}>
            <Heading size="lg" mb={6}>All Shops</Heading>

            <Card>
                <CardBody>
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Shop Name</Th>
                                <Th>Owner</Th>
                                <Th>Status</Th>
                                <Th isNumeric>Products</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {shops.map((shop) => (
                                <Tr key={shop.id}>
                                    <Td>
                                        <HStack>
                                            <Avatar name={shop.name} size="sm" />
                                            <Text fontWeight="medium">{shop.name}</Text>
                                        </HStack>
                                    </Td>
                                    <Td>{shop.owner}</Td>
                                    <Td>
                                        <Badge colorScheme={getStatusColor(shop.status)}>{shop.status}</Badge>
                                    </Td>
                                    <Td isNumeric>{shop.products}</Td>
                                    <Td>
                                        <HStack spacing={2}>
                                            <IconButton
                                                aria-label="View"
                                                icon={<FiExternalLink />}
                                                size="sm"
                                                variant="ghost"
                                                colorScheme="blue"
                                            />
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

export default ShopsPage;
