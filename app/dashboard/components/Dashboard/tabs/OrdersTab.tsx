
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
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const { auth } = stores;

    const companyId = auth.user?.company?._id || auth.user?.company;

    const fetchOrders = useCallback(async () => {
        if (!companyId) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8500/api'}/order/company/${companyId}`, {
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            if (data.success) {
                setOrders(data.data);
            } else {
                toast({ title: "Failed to fetch orders", description: data.message, status: "error" });
            }

        } catch (error) {
            console.error("Error fetching orders:", error);
            toast({ title: "Error fetching orders", status: "error" });
        } finally {
            setIsLoading(false);
        }
    }, [auth.token, companyId, toast]);

    useEffect(() => {
        if (auth.token && companyId) {
            fetchOrders();
        }
    }, [fetchOrders, auth.token, companyId]);

    const handleRowClick = (row: any) => {
        setSelectedOrder(row);
        onOpen();
    };

    const handleDrawerUpdate = () => {
        fetchOrders(); // Refresh list
        // Update selected order details? 
        // Ideally fetch single order again or iterate local list. 
        // For simplicity, just refetch list and update selected if possible, or close drawer.
        // Let's refetch list.
    };

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

    if (isLoading && orders.length === 0) {
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
                data={orders}
                loading={isLoading}
                serial={{ show: true, text: "S.No", width: "10%" }}
                onRowClick={handleRowClick}
            />
            {selectedOrder && (
                <OrderDrawer
                    isOpen={isOpen}
                    onClose={onClose}
                    order={selectedOrder}
                    onUpdate={handleDrawerUpdate}
                />
            )}
        </Box>
    );
});

export default OrdersTab;
