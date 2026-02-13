
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
    Box,
    Badge,
    useToast,
    Text,
    Spinner,
    useDisclosure
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import stores from "../../../../store/stores";
import CustomTable from "../../../../component/config/component/CustomTable/CustomTable";
import OrderDrawer from "./OrderDrawer";

const OrdersTab = observer(() => {
    const { orderStore, auth } = stores;
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const companyId = auth.user?.company?._id || auth.user?.company;

    const fetchOrders = useCallback(async () => {
        if (!companyId) return;

        try {
            await orderStore.fetchCompanyOrders(companyId);
        } catch (error: any) {
            console.error("Error fetching orders:", JSON.stringify(error, null, 2));
            toast({
                title: "Error fetching orders",
                description: typeof error?.message === 'string' ? error.message : "An unknown error occurred",
                status: "error"
            });
        }
    }, [companyId, toast, orderStore]);

    useEffect(() => {
        if (auth.token && companyId) {
            fetchOrders();
        }
    }, [fetchOrders, auth.token, companyId]);

    const handleSearchChange = useCallback((e: any) => {
        orderStore.setFilter("search", e.target.value);
    }, [orderStore]);

    const isMounted = React.useRef(false);

    // Debounce search effect (unchanged)
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }
        const timer = setTimeout(() => {
            if (companyId) fetchOrders();
        }, 800);
        return () => clearTimeout(timer);
    }, [orderStore.filters.search, companyId, fetchOrders]);

    const handleDateChange = useCallback((date: any, type: string) => {
        const newDate = { ...orderStore.filters.date, [type]: date };
        orderStore.setFilter("date", newDate);
        fetchOrders();
    }, [orderStore, fetchOrders]);

    const handleStatusChange = useCallback((selectedOptions: any) => {
        orderStore.setFilter("status", selectedOptions.join(','));
        fetchOrders();
    }, [orderStore, fetchOrders]);

    const handleApplyFilter = useCallback(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleReset = useCallback(() => {
        orderStore.resetFilters();
        fetchOrders();
    }, [orderStore, fetchOrders]);

    const handlePageChange = useCallback((page: number) => {
        orderStore.setPage(page);
        fetchOrders();
    }, [orderStore, fetchOrders]);

    const handleRowClick = useCallback((row: any) => {
        setSelectedOrderId(row._id || row.orderId);
        onOpen();
    }, [onOpen]);

    const handleCloseDrawer = useCallback(() => {
        onClose();
        setSelectedOrderId(null);
    }, [onClose]);

    const selectedOrder = orderStore.companyOrders.find((o: any) => (o._id === selectedOrderId || o.orderId === selectedOrderId));

    const columns = useMemo(() => [
        {
            headerName: "Order ID",
            key: "orderId",
            type: "text",
        },
        {
            headerName: "Date",
            key: "createdAt",
            type: "date",
        },
        {
            headerName: "Customer",
            key: "customerName",
            type: "component",
            metaData: {
                component: (row: any) => <Text>{row.user?.name || "N/A"}</Text>
            }
        },
        {
            headerName: "Status",
            key: "orderStatus",
            type: "component",
            metaData: {
                component: (row: any) => (
                    <Badge colorScheme={row.orderStatus === 'created' ? 'blue' : row.orderStatus === 'delivered' ? 'green' : 'orange'}>
                        {row.orderStatus === 'created' ? 'Placed' : row.orderStatus}
                    </Badge>
                )
            }
        },
        {
            headerName: "Amount",
            key: "amount",
            type: "component",
            metaData: {
                component: (row: any) => <Text>₹{row.quote?.price?.value || row.total}</Text>
            }
        },
        {
            headerName: "Items",
            key: "itemsCount",
            type: "component",
            metaData: {
                component: (row: any) => <Text>{row.items?.length} Items</Text>
            }
        }
    ], []);

    const actions = useMemo(() => ({
        search: {
            show: true,
            placeholder: "Search by Order ID or Customer Name",
            searchValue: orderStore.filters.search,
            onSearchChange: handleSearchChange
        },
        datePicker: {
            show: true,
            date: orderStore.filters.date,
            onDateChange: handleDateChange
        },
        multidropdown: {
            show: true,
            title: "Status",
            dropdowns: [
                {
                    name: "Status",
                    options: [
                        { label: "Pending", value: "pending" },
                        { label: "Confirmed", value: "confirmed" },
                        { label: "Processing", value: "processing" },
                        { label: "Shipped", value: "shipped" },
                        { label: "Delivered", value: "delivered" },
                        { label: "Cancelled", value: "cancelled" }
                    ]
                }
            ],
            selectedOptions: orderStore.filters.status ? { [0]: orderStore.filters.status.split(',') } : {},
            onDropdownChange: (val: any) => {
                const statusArr = val[0] || [];
                handleStatusChange(statusArr);
            },
            onApply: handleApplyFilter
        },
        resetData: {
            show: true,
            text: "Reset Filters",
            function: handleReset
        },
        pagination: {
            show: true,
            currentPage: orderStore.pagination.page,
            totalPages: orderStore.pagination.totalPages,
            limit: orderStore.pagination.limit,
            onClick: handlePageChange
        }
    }), [
        orderStore.filters.search,
        orderStore.filters.date,
        orderStore.filters.status,
        orderStore.pagination.page,
        orderStore.pagination.totalPages,
        handleSearchChange,
        handleDateChange,
        handleStatusChange,
        handleApplyFilter,
        handleReset,
        handlePageChange
    ]);

    if (orderStore.isLoading && orderStore.companyOrders.length === 0) {
        return (
            <Box p={6} textAlign="center">
                <Spinner size="xl" />
                <Text mt={4}>Loading orders...</Text>
            </Box>
        );
    }

    if (!companyId) {
        return <Box p={6}><Text>No company information found for this user.</Text></Box>;
    }

    return (
        <Box p={6}>
            <CustomTable
                title={`All Orders (${orderStore.pagination.total || 0})`}
                columns={columns}
                data={orderStore.companyOrders}
                loading={orderStore.isLoading}
                serial={{ show: true, text: "S.No", width: "10%" }}
                onRowClick={handleRowClick}
                actions={actions}
            />
            {selectedOrder && (
                <OrderDrawer
                    isOpen={isOpen}
                    onClose={handleCloseDrawer}
                    order={selectedOrder}
                />
            )}
        </Box>
    );
});

export default OrdersTab;
