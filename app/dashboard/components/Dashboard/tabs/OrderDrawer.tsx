
import React, { useState } from "react";
import {
    Box,
    Text,
    VStack,
    HStack,
    Badge,
    Select,
    Image,
    Divider,
    useToast,
    Grid,
    GridItem,
    Flex,
    Heading
} from "@chakra-ui/react";
import CustomDrawer from "../../../../component/common/Drawer/CustomDrawer";

import { FaUser, FaMapMarkerAlt } from "react-icons/fa";
import stores from "../../../../store/stores";

interface OrderDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    order: any;
}


import { observer } from "mobx-react-lite";

const OrderDrawer: React.FC<OrderDrawerProps> = observer(({ isOpen, onClose, order }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const toast = useToast();
    const { orderStore } = stores;

    if (!order) return null;

    const handleStatusUpdate = async (newStatus: string) => {
        setIsUpdating(true);
        try {
            const data = await orderStore.updateOrderStatus(order._id, newStatus);
            if (data.success) {
                toast({ title: "Status updated", status: "success" });
            } else {
                toast({ title: "Failed update", description: data.message, status: "error" });
            }
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || "Something went wrong", status: "error" });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleItemStatusUpdate = async (itemId: string, newStatus: string) => {
        setIsUpdating(true);
        try {
            const data = await orderStore.updateOrderItemStatus(order._id, itemId, newStatus);
            if (data.success) {
                toast({ title: "Item Status updated", status: "success" });
            } else {
                toast({ title: "Failed update", description: data.message, status: "error" });
            }
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || "Something went wrong", status: "error" });
        } finally {
            setIsUpdating(false);
        }
    };

    const currentOrder = order;

    return (
        <CustomDrawer
            open={isOpen}
            close={onClose}
            title={`Order #${currentOrder?.orderId}`}
            size="xl"
            loading={!currentOrder}
        >
            <VStack spacing={6} align="stretch" p={2}>

                {/* Order Status Section */}
                <Box p={4} borderWidth="1px" borderRadius="lg" bg="gray.50">
                    <HStack justify="space-between">
                        <HStack>
                            <Text fontWeight="bold">Order Status:</Text>
                            <Badge colorScheme={currentOrder?.orderStatus === 'created' ? 'blue' : currentOrder?.orderStatus === 'delivered' ? 'green' : 'orange'}>
                                {currentOrder?.orderStatus}
                            </Badge>
                        </HStack>
                        <HStack>
                            <Text fontSize="sm">Update:</Text>
                            <Select
                                size="sm"
                                w="150px"
                                bg="white"
                                isDisabled={isUpdating}
                                value={currentOrder?.orderStatus}
                                onChange={(e) => handleStatusUpdate(e.target.value)}
                            >
                                <option value="created">Created</option>
                                <option value="in-progress">In Progress</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </Select>

                        </HStack>
                    </HStack>
                </Box>

                {/* Customer Details */}
                <Box>
                    <Heading size="sm" mb={3} borderBottom="1px solid" borderColor="gray.200" pb={2}>Customer Details</Heading>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <GridItem>
                            <HStack align="start">
                                <FaUser color="gray" />
                                <Box>
                                    <Text fontWeight="bold">{currentOrder?.user?.name}</Text>
                                    <Text fontSize="sm" color="gray.600">{currentOrder?.user?.email}</Text>
                                    <Text fontSize="sm" color="gray.600">{currentOrder?.user?.phone}</Text>
                                </Box>
                            </HStack>
                        </GridItem>
                        <GridItem>
                            <HStack align="start">
                                <FaMapMarkerAlt color="gray" />
                                <Box>
                                    <Text fontWeight="bold">Shipping Address</Text>
                                    <Text fontSize="sm" color="gray.600">
                                        {currentOrder?.shippingAddress?.addressLine1}, {currentOrder?.shippingAddress?.addressLine2}
                                    </Text>
                                    <Text fontSize="sm" color="gray.600">
                                        {currentOrder?.shippingAddress?.city}, {currentOrder?.shippingAddress?.state} - {currentOrder?.shippingAddress?.pincode}
                                    </Text>
                                </Box>
                            </HStack>
                        </GridItem>
                    </Grid>
                </Box>

                <Divider />

                {/* Items */}
                <Box>
                    <Heading size="sm" mb={3}>Order Items ({currentOrder?.items?.length})</Heading>
                    <VStack spacing={3} align="stretch">
                        {currentOrder?.items?.map((item: any, index: number) => {
                            // Match fulfillment using fulfillment_id stored in item
                            const fulfillment = currentOrder?.fulfillments?.find((f: any) => f.id === item.fulfillment_id);
                            const itemStatus = fulfillment?.status || "pending";

                            return (
                                <Box key={index} p={3} borderWidth="1px" borderRadius="md">
                                    <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
                                        <HStack spacing={4}>
                                            <Image
                                                src={item.productImage || "https://via.placeholder.com/50"}
                                                boxSize="50px"
                                                objectFit="cover"
                                                borderRadius="md"
                                                alt={item.productName}
                                            />
                                            <Box>
                                                <Text fontWeight="bold">{item.productName}</Text>
                                                <Text fontSize="sm">Qty: {item.quantity} | Variant: {item.variant?.join(", ") || "N/A"}</Text>
                                                <Text fontSize="sm" fontWeight="bold">₹{item.total}</Text>
                                            </Box>
                                        </HStack>

                                        <HStack>
                                            <VStack align="end" spacing={1}>
                                                <Badge colorScheme={itemStatus === 'delivered' ? 'green' : 'purple'}>{itemStatus}</Badge>
                                                <Select
                                                    size="xs"
                                                    w="120px"
                                                    isDisabled={isUpdating}
                                                    value={itemStatus}
                                                    onChange={(e) => handleItemStatusUpdate(item.fulfillment_id, e.target.value)}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="in-progress">In Progress</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </Select>
                                            </VStack>
                                        </HStack>
                                    </Flex>
                                </Box>
                            );
                        })}
                    </VStack>
                </Box>

                {/* Payment Info */}
                <Box bg="gray.50" p={3} borderRadius="md">
                    <HStack justify="space-between">
                        <Text fontWeight="bold">Total Amount:</Text>
                        <Text fontWeight="bold" fontSize="lg">₹{currentOrder?.quote?.price?.value || currentOrder?.total}</Text>
                    </HStack>
                    <HStack justify="space-between">
                        <Text fontSize="sm">Payment Method:</Text>
                        <Text fontSize="sm" textTransform="uppercase">{currentOrder?.paymentMethod}</Text>
                    </HStack>
                </Box>

            </VStack>
        </CustomDrawer>
    );
});

export default OrderDrawer;
