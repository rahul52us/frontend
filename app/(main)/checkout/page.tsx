import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

import React, { useEffect, useState } from "react";
import {
    Box,
    Container,
    Flex,
    Heading,
    Text,
    Button,
    VStack,
    HStack,
    Radio,
    RadioGroup,
    Divider,
    useToast,
    Icon,
    Badge,
    Grid,
    GridItem,
    useDisclosure,
    Spinner,
} from "@chakra-ui/react";
import AddressModal from "../../component/Cart/component/DeliveryAddressModal/DelivaryAddressModal";
import { observer } from "mobx-react-lite";
import stores from "../../store/stores";
import { useRouter, useSearchParams } from "next/navigation";
import { FaMapMarkerAlt, FaCreditCard, FaMoneyBillWave, FaLock } from "react-icons/fa";

const CheckoutPage = observer(() => {
    const { cartStore, auth, orderStore, shopStore } = stores;
    const router = useRouter();
    const toast = useToast();

    const [selectedAddress, setSelectedAddress] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<string>("cod");
    const [isProcessing, setIsProcessing] = useState(false);

    // Initialized Order State
    const [initializedOrder, setInitializedOrder] = useState<any>(null);
    const [isInitializing, setIsInitializing] = useState(false);

    // Addresses
    const addresses = auth.addresses || [];

    useEffect(() => {
        if (auth.token && auth.addresses.length === 0) {
            auth.fetchAddresses();
        }
    }, [auth.token, auth.addresses.length, auth]);

    const {
        isOpen: isAddressModalOpen,
        onOpen: onAddressModalOpen,
        onClose: onAddressModalClose,
    } = useDisclosure();

    const handleAddNewAddress = async (newAddress: any) => {
        try {
            await auth.addAddress(newAddress);
            auth.fetchAddresses();
        } catch {
            toast({ title: "Failed to add address", status: "error" });
        }
    };

    const handleUpdateAddress = async (id: string, data: any) => {
        try {
            await auth.updateAddress(id, data);
        } catch {
            toast({ title: "Failed to update address", status: "error" });
        }
    };

    const handleDeleteAddress = async (id: string) => {
        try {
            await auth.deleteAddress(id);
        } catch {
            toast({ title: "Failed to delete address", status: "error" });
        }
    };

    const handleSelectAddress = async (addressId: string) => {
        setSelectedAddress(addressId);

        if (!initializedOrder) return;

        try {
            const address = addresses.find((a: any) => a._id === addressId);
            if (!address) return;

            // Use cart items for re-initialization payload as initializedOrder structure is now complex
            // or extract from current orders
            const currentItems = cartStore.cartItems.length > 0
                ? cartStore.cartItems.map(item => ({
                    product: item.product._id || item.product.id,
                    quantity: item.quantity,
                    variant: item.product.variant
                }))
                : (initializedOrder.orders ? initializedOrder.orders.flatMap((o: any) => o.items.map((i: any) => ({
                    product: i.product._id || i.product, // Schema specific
                    quantity: i.quantity,
                    variant: i.variant
                }))) : []);

            const payload = {
                items: currentItems,
                // company: null, // Let backend split by company
                shippingAddress: address
            };

            const res = await orderStore.initializeOrder(payload);
            if (res?.success) {
                setInitializedOrder(res.data);
                toast({ title: "Delivery address updated", status: "success", duration: 2000 });
            }
        } catch (error) {
            console.error("Failed to update order address", error);
        }
    };

    // Buy Now Logic & Initialization
    const searchParams = useSearchParams();
    const buyNowId = searchParams.get('productId');
    const isBuyNow = searchParams.get('buyNow') === 'true';

    useEffect(() => {
        const initOrder = async () => {
            if (!auth.token) return;

            setIsInitializing(true);
            try {
                let itemsPayload = [];
                // let companyId = null;

                if (isBuyNow && buyNowId) {
                    const res = await shopStore.getProductById(buyNowId);
                    if (res?.data) {
                        const product = res.data;
                        itemsPayload.push({
                            product: product._id || product.id,
                            quantity: 1,
                            variant: product.variant
                        });
                        // companyId = ...
                    }
                } else {
                    if (cartStore.cartItems.length === 0) {
                        setIsInitializing(false);
                        return;
                    }
                    itemsPayload = cartStore.cartItems.map(item => ({
                        product: item.product._id || item.product.id,
                        quantity: item.quantity,
                        variant: item.product.variant
                    }));
                }

                if (itemsPayload.length > 0) {
                    const payload = {
                        items: itemsPayload,
                        // company: companyId // Removed to allow backend split
                    };
                    const res = await orderStore.initializeOrder(payload);
                    if (res?.success) {
                        setInitializedOrder(res.data);
                        // Access shippingAddress from top level of response data (we added it there)
                        if (res.data.shippingAddress && res.data.shippingAddress._id) {
                            setSelectedAddress(res.data.shippingAddress._id);
                        }
                    }
                }

            } catch (error: any) {
                toast({
                    title: "Failed to initialize order",
                    description: error.message || "Please try again",
                    status: "error"
                });
            } finally {
                setIsInitializing(false);
            }
        };

        if (auth.token) {
            initOrder();
        }
    }, [auth.token, isBuyNow, buyNowId, cartStore.cartItems, orderStore, shopStore, toast]);


    // ... (Validation useEffect) ...

    const handlePlaceOrder = async () => {
        if (!auth.token) {
            toast({ title: "Please login to place order", status: "error" });
            router.push("/login?redirect=/checkout");
            return;
        }
        if (!selectedAddress) {
            toast({ title: "Please select a delivery address", status: "error", position: "top" });
            return;
        }
        if (!initializedOrder) {
            toast({ title: "Order not initialized", description: "Please refresh page", status: "error" });
            return;
        }

        setIsProcessing(true);
        try {
            const payload = {
                // orderId: initializedOrder._id, // Not needed given backend confirms ALL initialized
                shippingAddress: addresses.find((a: any) => a._id === selectedAddress),
                paymentMethod
            };

            // Confim the initialized order(s)
            const responseConfirm = await stores.orderStore.confirmOrder(payload);

            toast({
                title: "Order Placed Successfully!",
                description: `Orders have been confirmed.`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            if (!isBuyNow) {
                cartStore.clearCart();
            }
            router.push("/account?tab=orders");

        } catch (error: any) {
            toast({
                title: "Order Failed",
                description: error.message || "Something went wrong.",
                status: "error",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    if (isInitializing) return <Box p={10} textAlign="center"><Spinner size="xl" /><Text mt={4}>Preparing your order...</Text></Box>;
    if (!isBuyNow && cartStore.totalItems === 0) {
        return <Box p={10} textAlign="center"><Text>Your cart is empty.</Text><Button mt={4} onClick={() => router.push('/products')}>Browse Products</Button></Box>;
    }

    if (!initializedOrder) return <Box p={10} textAlign="center"><Text>Failed to load order details.</Text></Box>;

    // Flatten items from all orders for display
    const items = initializedOrder.orders ? initializedOrder.orders.flatMap((o: any) => o.items) : (initializedOrder.items || []);
    const quote = initializedOrder.quote;

    // Calculate pricing from quote breakup
    const subtotal = quote?.breakup
        ?.filter((b: any) => b.title_type === 'item')
        .reduce((sum: number, b: any) => {
            // Use item.price (unit price) × quantity for subtotal, excluding freebie items
            const unitPrice = parseFloat(b.item?.price?.value || '0');
            const qty = b.item_quantity?.count || 1;
            return sum + (unitPrice * qty);
        }, 0) || 0;

    // ... rest of render ...

    const tax = quote?.breakup
        ?.filter((b: any) => b.title_type === 'tax')
        .reduce((sum: number, b: any) => sum + parseFloat(b.price.value), 0) || 0;

    const discount = quote?.breakup
        ?.filter((b: any) => b.title_type === 'discount')
        .reduce((sum: number, b: any) => sum + parseFloat(b.price.value), 0) || 0;

    const deliveryCharges = quote?.breakup
        ?.find((b: any) => b.title_type === 'delivery')?.price.value
        ? parseFloat(quote.breakup.find((b: any) => b.title_type === 'delivery').price.value)
        : 0;

    const total = parseFloat(quote?.price?.value || '0');

    return (
        <Box bg="gray.50" minH="100vh" py={8}>
            <Container maxW="container.xl">
                <Heading mb={6} fontSize="2xl" color="gray.800">Checkout</Heading>

                <Grid templateColumns={{ base: "1fr", lg: "1fr 1.2fr" }} gap={8}>

                    {/* Left Column: Address & Payment */}
                    <GridItem>
                        <VStack spacing={6} align="stretch">

                            {/* 1. Delivery Address */}
                            <Box bg="white" p={6} borderRadius="xl" shadow="sm">
                                <Heading fontSize="lg" mb={4} display="flex" alignItems="center">
                                    <Icon as={FaMapMarkerAlt} mr={2} color="blue.500" />
                                    Delivery Address
                                </Heading>

                                {!selectedAddress ? (
                                    <Box p={4} border="1px dashed" borderColor="gray.300" borderRadius="md" textAlign="center">
                                        <Text color="gray.500" mb={4}>Please select a delivery address.</Text>
                                        <Button size="sm" colorScheme="blue" onClick={onAddressModalOpen}>
                                            Select Address
                                        </Button>
                                    </Box>
                                ) : (
                                    <Box
                                        borderWidth="1px"
                                        borderColor="blue.500"
                                        p={4}
                                        borderRadius="lg"
                                        bg="blue.50"
                                    >
                                        {addresses.find((a: any) => a._id === selectedAddress) ? (
                                            <Flex justify="space-between" align="start">
                                                <VStack align="start" spacing={1}>
                                                    <Text fontWeight="bold">
                                                        {addresses.find((a: any) => a._id === selectedAddress)?.name}
                                                        <Badge ml={2} colorScheme="blue">Selected</Badge>
                                                    </Text>
                                                    <Text fontSize="sm">
                                                        {[
                                                            addresses.find((a: any) => a._id === selectedAddress)?.addressLine1 || addresses.find((a: any) => a._id === selectedAddress)?.line1,
                                                            addresses.find((a: any) => a._id === selectedAddress)?.city,
                                                            addresses.find((a: any) => a._id === selectedAddress)?.state,
                                                            addresses.find((a: any) => a._id === selectedAddress)?.postalCode
                                                        ].filter(Boolean).join(", ")}
                                                    </Text>
                                                    <Text fontSize="sm" color="gray.600">
                                                        Mobile: {addresses.find((a: any) => a._id === selectedAddress)?.phone}
                                                    </Text>
                                                </VStack>
                                                <Button size="sm" variant="outline" colorScheme="blue" onClick={onAddressModalOpen}>
                                                    Change
                                                </Button>
                                            </Flex>
                                        ) : (
                                            <Button size="sm" colorScheme="blue" onClick={onAddressModalOpen}>
                                                Select Address
                                            </Button>
                                        )}
                                    </Box>
                                )}
                            </Box>

                            {/* 2. Payment Method */}
                            <Box bg="white" p={6} borderRadius="xl" shadow="sm">
                                <Heading fontSize="lg" mb={4} display="flex" alignItems="center">
                                    <Icon as={FaCreditCard} mr={2} color="green.500" />
                                    Payment Method
                                </Heading>

                                <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
                                    <VStack align="stretch" spacing={3}>
                                        <Box
                                            p={4}
                                            borderWidth="1px"
                                            borderRadius="lg"
                                            borderColor={paymentMethod === "cod" ? "green.500" : "gray.200"}
                                            bg={paymentMethod === "cod" ? "green.50" : "white"}
                                            cursor="pointer"
                                            onClick={() => setPaymentMethod("cod")}
                                        >
                                            <Radio value="cod" colorScheme="green">
                                                <HStack>
                                                    <Icon as={FaMoneyBillWave} color="green.600" />
                                                    <Text fontWeight="medium">Cash on Delivery (COD)</Text>
                                                </HStack>
                                            </Radio>
                                        </Box>

                                        <Box
                                            p={4}
                                            borderWidth="1px"
                                            borderRadius="lg"
                                            borderColor="gray.200"
                                            opacity={0.6}
                                            cursor="not-allowed"
                                        >
                                            <Radio value="online" isDisabled>
                                                <HStack>
                                                    <Icon as={FaLock} color="gray.400" />
                                                    <Text fontWeight="medium">Online Payment (Coming Soon)</Text>
                                                </HStack>
                                            </Radio>
                                        </Box>
                                    </VStack>
                                </RadioGroup>
                            </Box>

                        </VStack>
                    </GridItem>

                    {/* Right Column: Order Summary */}
                    <GridItem>
                        <Box bg="white" p={6} borderRadius="xl" shadow="sm" position="sticky" top="100px">
                            <Heading fontSize="lg" mb={4}>Order Summary</Heading>

                            <VStack spacing={4} align="stretch">
                                {items.map((item: any, idx: number) => (
                                    <Flex key={idx} justify="space-between" align="flex-start" gap={3}>
                                        <HStack spacing={3} flex={1} minW={0} maxW="calc(100% - 80px)">
                                            <Badge borderRadius="md" px={2} flexShrink={0}>{item.quantity}x</Badge>
                                            <VStack align="start" spacing={0} flex={1} minW={0}>
                                                <Text fontWeight="medium" noOfLines={2} title={item.productName}>{item.productName}</Text>
                                                {item.variant && <Text fontSize="xs" color="gray.500">{JSON.stringify(item.variant)}</Text>}
                                            </VStack>
                                        </HStack>
                                        <Text fontWeight="medium" flexShrink={0} minW="70px" textAlign="right">
  ₹{item.total ?? (item.unitPrice * item.quantity)}
</Text>

                                    </Flex>
                                ))}
                            </VStack>

                            <Divider my={4} />

                            <VStack spacing={2} width="100%">
                                <Flex justify="space-between" width="100%">
                                    <Text color="gray.600">Subtotal</Text>
                                    <Text fontWeight="medium">₹{subtotal.toFixed(2)}</Text>
                                </Flex>
                                <Flex justify="space-between" width="100%">
                                    <Text color="gray.600">Tax</Text>
                                    <Text fontWeight="medium">₹{tax.toFixed(2)}</Text>
                                </Flex>
                                {discount !== 0 && (
                                    <Flex justify="space-between" width="100%">
                                        <Text color="green.600">Discount</Text>
                                        <Text fontWeight="medium" color="green.600">
                                            -₹{Math.abs(discount).toFixed(2)}
                                        </Text>
                                    </Flex>
                                )}
                                <Flex justify="space-between" width="100%">
                                    <Text color="gray.600">Shipping</Text>
                                    <Text fontWeight="medium" color={deliveryCharges === 0 ? "green.500" : "black"}>
                                        {deliveryCharges === 0 ? "Free" : `₹${deliveryCharges}`}
                                    </Text>
                                </Flex>
                                <Divider />
                                <Flex justify="space-between" width="100%" pt={2}>
                                    <Text fontSize="lg" fontWeight="bold">Total</Text>
                                    <Text fontSize="lg" fontWeight="bold" color="blue.600">₹{total.toFixed(2)}</Text>
                                </Flex>
                            </VStack>

                            <Button
                                mt={6}
                                colorScheme="blue"
                                size="lg"
                                width="100%"
                                isLoading={isProcessing}
                                onClick={handlePlaceOrder}
                            >
                                Place Order
                            </Button>

                            <Text fontSize="xs" color="gray.500" mt={3} textAlign="center">
                                By placing order, you agree to our Terms & Conditions.
                            </Text>
                        </Box>
                    </GridItem>

                </Grid>

                <AddressModal
                    isOpen={isAddressModalOpen}
                    onClose={onAddressModalClose}
                    addresses={addresses}
                    selectedAddress={selectedAddress}
                    onSelectAddress={handleSelectAddress}
                    onAddNewAddress={handleAddNewAddress}
                    onUpdateAddress={handleUpdateAddress}
                    onDeleteAddress={handleDeleteAddress}
                />
            </Container>
        </Box>
    );
});

export default CheckoutPage;
