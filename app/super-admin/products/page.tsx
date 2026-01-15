"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Box, HStack, Text, Image, useDisclosure } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import stores from "../../store/stores";
import CustomTable from "../../component/config/component/CustomTable/CustomTable";
import ConfirmationModal from "../../component/common/ConfirmationModal/ConfirmationModal";

const SuperAdminProductsPage = observer(() => {
    const { shopStore, auth } = stores;
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);

    // Delete Modal State
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

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
                // Error handling handled by store or ignored for now
            })
            .finally(() => {
                setLoading(false);
            });
    }, [shopStore]);

    useEffect(() => {
        fetchProducts(currentPage);
    }, [fetchProducts, currentPage]);

    const handleDeleteClick = (row: any) => {
        setSelectedProduct(row);
        onOpen();
    };

    const confirmDelete = async () => {
        if (!selectedProduct) return;
        setIsDeleting(true);
        try {
            await shopStore.deleteProduct(selectedProduct._id);
            auth.openNotification({
                title: "Success",
                message: "Product deleted successfully",
                type: "success",
                image: selectedProduct?.images?.[0]
            });
            fetchProducts(currentPage); // Refresh list
            onClose();
        } catch (error: any) {
            auth.openNotification({
                title: "Error",
                message: error?.message || "Failed to delete product",
                type: "error"
            });
        } finally {
            setIsDeleting(false);
            setSelectedProduct(null);
        }
    };

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
                function: (row: any) => {
                    handleDeleteClick(row);
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

            <ConfirmationModal
                isOpen={isOpen}
                onClose={onClose}
                onConfirm={confirmDelete}
                title="Confirm Delete"
                message={
                    <Text>
                        Are you sure you want to delete the product <strong>{selectedProduct?.name}</strong>? This action cannot be undone.
                    </Text>
                }
                confirmText="Delete"
                confirmButtonProps={{ colorScheme: "red" }}
                isLoading={isDeleting}
                image={selectedProduct?.images?.[0]}
            />
        </Box>
    );
});

export default SuperAdminProductsPage;
