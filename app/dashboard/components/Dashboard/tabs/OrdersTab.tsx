
import React, { useEffect, useState, useCallback } from "react";
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
            console.error("Error fetching orders:", error);
            toast({ title: "Error fetching orders", description: error?.message, status: "error" });
        }
    }, [companyId, toast, orderStore]);

    useEffect(() => {
        if (auth.token && companyId) {
            fetchOrders();
        }
    }, [fetchOrders, auth.token, companyId]);

    const handleRowClick = (row: any) => {
        setSelectedOrderId(row._id || row.orderId); // ensure unique ID usage
        onOpen();
    };

    const handleCloseDrawer = () => {
        onClose();
        setSelectedOrderId(null);
    }

    // Derive selected order from store to ensure reactivity
    const selectedOrder = orderStore.companyOrders.find((o: any) => (o._id === selectedOrderId || o.orderId === selectedOrderId));

    const columns = [
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
    ];

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
                title="All Orders"
                columns={columns}
                data={orderStore.companyOrders}
                loading={orderStore.isLoading}
                serial={{ show: true, text: "S.No", width: "10%" }}
                onRowClick={handleRowClick}
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
