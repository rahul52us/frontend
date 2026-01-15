"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Box, HStack, Avatar, Text, Badge } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import stores from "../../store/stores";
import CustomTable from "../../component/config/component/CustomTable/CustomTable";

const ShopsPage = observer(() => {
    const { companyStore } = stores;
    const [shops, setShops] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalShops, setTotalShops] = useState(0);

    const fetchShops = useCallback((page: number) => {
        setLoading(true);
        companyStore
            .getAllShops({ limit: 10, page: page, shopStatus: "all", includeInactive: true })
            .then((res: any) => {
                if (res?.data?.data) {
                    setShops(res.data.data);
                    setTotalPages(res.data.totalPages || 1);
                    setTotalShops(res.data.total || 0);
                }
            })
            .catch(() => {
                // Error handling
            })
            .finally(() => {
                setLoading(false);
            });
    }, [companyStore]);

    useEffect(() => {
        fetchShops(currentPage);
    }, [fetchShops, currentPage]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "green";
            case "pending":
                return "orange";
            case "suspended":
                return "red";
            default:
                return "gray";
        }
    };

    const columns = [
        {
            headerName: "Shop Name",
            key: "name",
            type: "component",
            metaData: {
                component: (row: any) => (
                    <HStack>
                        <Avatar name={row.name} src={row.logo?.url} size="sm" />
                        <Text fontWeight="medium">{row.name}</Text>
                    </HStack>
                ),
            },
        },
        {
            headerName: "Description",
            key: "description",
            type: "component",
            metaData: {
                component: (row: any) => (
                    <Text noOfLines={1} maxW="200px">
                        {row.description || "N/A"}
                    </Text>
                )
            }
        },
        {
            headerName: "Status",
            key: "shopStatus",
            type: "component",
            metaData: {
                component: (row: any) => (
                    <Box>
                        <Badge colorScheme={getStatusColor(row.shopStatus)}>
                            {row.shopStatus}
                        </Badge>
                        {!row.isActive && (
                            <Badge ml={2} colorScheme="red">
                                Inactive
                            </Badge>
                        )}
                    </Box>
                ),
            },
        },
        {
            headerName: "Rating",
            key: "rating",
            type: "component",
            metaData: {
                component: (row: any) => (
                    <Text>{row.ratings?.averageRating?.toFixed(1) || 0} ({row.ratings?.count || 0})</Text>
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
                    // Handle view logic
                }
            },
            editKey: {
                showEditButton: true,
                function: () => {
                    // Handle edit logic
                }
            },
            deleteKey: {
                showDeleteButton: true,
                function: () => {
                    // Handle delete logic
                }
            }
        },
        pagination: {
            show: true,
            currentPage: currentPage,
            totalPages: totalPages,
            onClick: (page: number) => setCurrentPage(page)
        },
        search: {
            show: false // Can enable later
        }
    }

    return (
        <Box p={6}>
            <CustomTable
                title={`All Shops (${totalShops})`}
                columns={columns}
                data={shops}
                loading={loading}
                actions={tableActions}
                serial={{ show: true, text: "S.No." }}
            />
        </Box>
    );
});

export default ShopsPage;
