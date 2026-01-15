"use client";

import React, { useState } from "react";
import { Box, Button, Heading, HStack, Badge } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import CustomTable from "../../component/config/component/CustomTable/CustomTable";

const CategoriesPage = () => {
    // Mock data
    const [categories] = useState([
        { id: 1, name: "Electronics", slug: "electronics", subCategories: 5 },
        { id: 2, name: "Fashion", slug: "fashion", subCategories: 12 },
        { id: 3, name: "Home & Garden", slug: "home-garden", subCategories: 8 },
    ]);

    const columns = [
        {
            headerName: "Name",
            key: "name",
            type: "text",
            props: {
                column: { minW: "200px" }
            }
        },
        {
            headerName: "Slug",
            key: "slug",
            type: "component",
            metaData: {
                component: (row: any) => (
                    <Badge colorScheme="gray">{row.slug}</Badge>
                )
            }
        },
        {
            headerName: "Sub-categories",
            key: "subCategories",
            type: "text",
            props: {
                column: { isNumeric: true },
                row: { isNumeric: true, textAlign: 'right' }
            }
        },
        {
            headerName: "Action",
            key: "action",
            type: "table-actions",
            props: {
                isSticky: true,
            }
        }
    ];

    const tableActions = {
        actionBtn: {
            editKey: {
                showEditButton: true,
                function: () => {
                    // Edit category logic
                }
            },
            deleteKey: {
                showDeleteButton: true,
                function: () => {
                    // Delete category logic
                }
            }
        },
        pagination: {
            show: true,
            currentPage: 1,
            totalPages: 1,
            onClick: () => {
                // Page change logic
            }
        }
    };

    return (
        <Box p={6}>
            <HStack justify="space-between" mb={6}>
                <Heading size="lg">Categories</Heading>
                <Button leftIcon={<FiPlus />} colorScheme="blue">
                    Add Category
                </Button>
            </HStack>

            <CustomTable
                title={`All Categories (${categories.length})`}
                columns={columns}
                data={categories}
                loading={false}
                actions={tableActions}
                serial={{ show: true, text: "S.No." }}
            />
        </Box>
    );
};

export default CategoriesPage;
