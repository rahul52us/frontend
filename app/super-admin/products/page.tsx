"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Box, HStack, Text, Image } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import stores from "../../store/stores";
import CustomTable from "../../component/config/component/CustomTable/CustomTable";

const SuperAdminProductsPage = observer(() => {
    const { shopStore } = stores;
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // Pagination states (even if backend doesn't fully support it yet, we prep the UI)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);

    const fetchProducts = useCallback((page: number) => {
        setLoading(true);
        shopStore
            .getAllProducts({ limit: 10, page, company: null })
            .then((res: any) => {
                if (res?.data) {
                    setProducts(res.data.products || []);
                    setTotalProducts(res.data.total || 0);
                    setTotalPages(res.data.totalPages || 1);
                }
            })
            .catch(() => {
                // Error handling
            })
            .finally(() => {
                setLoading(false);
            });
    }, [shopStore]);

    useEffect(() => {
        fetchProducts(currentPage);
    }, [fetchProducts, currentPage]);

    const columns = [
        {
            headerName: "Product",
            key: "name",
            type: "component",
            metaData: {
                component: (row: any) => (
                    <HStack>
                        <Box boxSize="40px" borderRadius="md" overflow="hidden" flexShrink={0}>
                            {row.images && row.images[0] ? (
                                <Image src={row.images[0]} alt={row.name} w="100%" h="100%" objectFit="cover" />
                            ) : (
                                <Box w="100%" h="100%" bg="gray.200" />
                            )}
                        </Box>
                        <Text fontWeight="medium" noOfLines={2} title={row.name}>{row.name}</Text>
                    </HStack>
                ),
            },
            props: {
                column: { minW: "200px" }
            }
        },
        {
            headerName: "Category",
            key: "category",
            type: "text",
        },
        {
            headerName: "Shop",
            key: "company",
            type: "component",
            metaData: {
                component: (row: any) => (
                    // If company is populated, show name, else show ID or --
                    <Text>{row.company?.name || row.company || "--"}</Text>
                )
            }
        },
        {
            headerName: "Price",
            key: "price",
            type: "component",
            metaData: {
                component: (row: any) => (
                    <Text>₹{row.price}</Text>
                )
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
            viewKey: {
                showViewButton: true,
                function: () => {
                    // View functionality
                }
            },
            editKey: {
                showEditButton: true,
                function: () => {
                    // Edit functionality
                }
            },
            deleteKey: {
                showDeleteButton: true,
                function: () => {
                    // Delete functionality
                }
            }
        },
        pagination: {
            show: true,
            currentPage: currentPage,
            totalPages: totalPages,
            onClick: (page: number) => setCurrentPage(page)
        },
    }

    return (
        <Box p={6}>
            <CustomTable
                title={`All Products (${totalProducts})`}
                columns={columns}
                data={products}
                loading={loading}
                actions={tableActions}
                serial={{ show: true, text: "S.No." }}
            />
        </Box>
    );
});

export default SuperAdminProductsPage;
