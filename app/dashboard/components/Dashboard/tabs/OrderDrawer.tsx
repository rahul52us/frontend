
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
    Button,
    useToast,
    Grid,
    GridItem,
    Flex,
    Heading
} from "@chakra-ui/react";
import CustomDrawer from "../../../../component/common/Drawer/CustomDrawer";
// Actually, this component will likely be in OrdersTab folder or verify path
// If I put it in app/dashboard/components/Dashboard/tabs/OrderDrawer.tsx
import { FaBox, FaUser, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import stores from "../../../../store/stores";

interface OrderDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    order: any;
    onUpdate: () => void; // Callback to refresh list
}


const OrderDrawer: React.FC<OrderDrawerProps> = ({ isOpen, onClose, order, onUpdate }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<any>(null);
    const toast = useToast();
    const { auth } = stores;

    React.useEffect(() => {
        if (order) {
            setCurrentOrder(order);
        }
    }, [order]);

    if (!order) return null;

    const handleStatusUpdate = async (newStatus: string) => {
        setIsUpdating(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8500/api'}/order/update-status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.token}`
                },
                body: JSON.stringify({ orderId: currentOrder._id, status: newStatus })
            });
            const data = await response.json();
            if (data.success) {
                toast({ title: "Status updated", status: "success" });
                setCurrentOrder({ ...currentOrder, orderStatus: newStatus });
                onUpdate();
            } else {
                toast({ title: "Failed update", description: data.message, status: "error" });
            }
        } catch (error) {
            toast({ title: "Error", status: "error" });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleItemStatusUpdate = async (itemId: string, newStatus: string) => {
        setIsUpdating(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8500/api'}/order/update-item-status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.token}`
                },
                body: JSON.stringify({ orderId: currentOrder._id, itemId: itemId, status: newStatus })
            });
            const data = await response.json();
            if (data.success) {
                toast({ title: "Item Status updated", status: "success" });

                // Update local state for immediate feedback
                const updatedFulfillments = currentOrder.fulfillments.map((f: any) => {
                    if (f.id === itemId) {
                        return { ...f, status: newStatus };
                    }
                    return f;
                });
                setCurrentOrder({ ...currentOrder, fulfillments: updatedFulfillments });

                onUpdate();
            } else {
                toast({ title: "Failed update", description: data.message, status: "error" });
            }
        } catch (error) {
            toast({ title: "Error", status: "error" });
        } finally {
            setIsUpdating(false);
        }
    };

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
};

export default OrderDrawer;
