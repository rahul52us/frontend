"use client";

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
} from "@chakra-ui/react";
import AddressModal from "../../component/Cart/component/DeliveryAddressModal/DelivaryAddressModal";
import { observer } from "mobx-react-lite";
import stores from "../../store/stores";
import { useRouter } from "next/navigation";
import { FaMapMarkerAlt, FaCreditCard, FaMoneyBillWave, FaLock } from "react-icons/fa";

const CheckoutPage = observer(() => {
    const { cartStore, auth } = stores;
    const router = useRouter();
    const toast = useToast();

    const [selectedAddress, setSelectedAddress] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<string>("cod");
    const [isProcessing, setIsProcessing] = useState(false);

    // Addresses
    const addresses = auth.addresses || []; // Use top-level addresses

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

    // Buy Now Logic
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const buyNowId = searchParams?.get('productId');
    const isBuyNow = searchParams?.get('buyNow') === 'true';

    const [buyNowItem, setBuyNowItem] = useState<any>(null);
    const [loadingBuyNow, setLoadingBuyNow] = useState(false);

    useEffect(() => {
        if (isBuyNow && buyNowId) {
            const fetchProduct = async () => {
                setLoadingBuyNow(true);
                try {
                    const res = await stores.shopStore.getProductById(buyNowId);
                    if (res?.data) {
                        setBuyNowItem({
                            product: res.data,
                            quantity: 1
                        });
                    }
                } catch {
                    toast({ title: "Failed to load product", status: "error" });
                } finally {
                    setLoadingBuyNow(false);
                }
            }
            fetchProduct();
        } else if (cartStore.totalItems === 0) {
            toast({
                title: "Cart is empty",
                description: "Please add items to cart before checkout.",
                status: "warning",
                duration: 3000,
            });
            router.push("/products");
        }
    }, [cartStore.totalItems, router, toast, isBuyNow, buyNowId]);

    // ... calculateTotal 

    const calculateTotal = () => {
        let itemsToCalc = cartStore.cartItems;
        if (isBuyNow && buyNowItem) {
            itemsToCalc = [buyNowItem];
        }

        const subtotal = itemsToCalc.reduce((sum, item) => {
            const price = item.product.discountPrice || item.product.price;
            return sum + (price * item.quantity);
        }, 0);
        const tax = subtotal * 0.18;
        const shipping = subtotal > 500 ? 0 : 50;
        return { subtotal, tax, shipping, total: subtotal + tax + shipping };
    };

    const { subtotal, tax, shipping, total } = calculateTotal();

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

        setIsProcessing(true);
        try {
            const { subtotal, tax, shipping, total } = calculateTotal();

            const payload = {
                company: typeof cartStore.cartItems[0]?.product?.company === 'object' ? cartStore.cartItems[0]?.product?.company?._id : cartStore.cartItems[0]?.product?.company,
                items: cartStore.cartItems.map(item => ({
                    product: item.product._id || item.product.id,
                    productName: item.product.name,
                    productImage: item.product.image || item.product.images?.[0],
                    price: item.product.discountPrice || item.product.price,
                    quantity: item.quantity,
                    variant: item.product.variant // Assuming variant is flattened in cart item for now
                })),
                shippingAddress: addresses.find((a: any) => a._id === selectedAddress),
                paymentMethod,
                subtotal,
                tax,
                deliveryCharges: shipping,
                total
            };

            const response = await stores.orderStore.createOrder(payload);

            toast({
                title: "Order Placed Successfully!",
                description: `Order #${response.data?.orderId || "Confirmed"} has been placed.`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            if (!isBuyNow) {
                cartStore.clearCart();
            }
            router.push("/account/orders");

        } catch {
            toast({
                title: "Order Failed",
                description: "Something went wrong.",
                status: "error",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    if (loadingBuyNow) return <Box p={10} textAlign="center"><Text>Loading checkout...</Text></Box>;
    if (!isBuyNow && cartStore.totalItems === 0) return null;

    return (
        <Box bg="gray.50" minH="100vh" py={8}>
            <Container maxW="container.xl">
                <Heading mb={6} fontSize="2xl" color="gray.800">Checkout</Heading>

                <Grid templateColumns={{ base: "1fr", lg: "1.5fr 1fr" }} gap={8}>

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
                                {(isBuyNow && buyNowItem ? [buyNowItem] : cartStore.cartItems).map((item, idx) => (
                                    <Flex key={idx} justify="space-between" align="center">
                                        <HStack spacing={3}>
                                            <Badge borderRadius="md" px={2}>{item.quantity}x</Badge>
                                            <VStack align="start" spacing={0}>
                                                <Text fontWeight="medium" noOfLines={1} title={item.product?.name}>{item.product?.name}</Text>
                                                {item.product.variant && <Text fontSize="xs" color="gray.500">{item.product.variant}</Text>}
                                            </VStack>
                                        </HStack>
                                        <Text fontWeight="medium">₹{(item.product.discountPrice || item.product.price) * item.quantity}</Text>
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
                                    <Text color="gray.600">Tax (18%)</Text>
                                    <Text fontWeight="medium">₹{tax.toFixed(2)}</Text>
                                </Flex>
                                <Flex justify="space-between" width="100%">
                                    <Text color="gray.600">Shipping</Text>
                                    <Text fontWeight="medium" color={shipping === 0 ? "green.500" : "black"}>
                                        {shipping === 0 ? "Free" : `₹${shipping}`}
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
                    onSelectAddress={setSelectedAddress}
                    onAddNewAddress={handleAddNewAddress}
                    onUpdateAddress={handleUpdateAddress}
                    onDeleteAddress={handleDeleteAddress}
                />
            </Container>
        </Box>
    );
});

export default CheckoutPage;
