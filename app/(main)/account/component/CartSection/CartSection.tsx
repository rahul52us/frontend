"use client";

import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  Progress,
  SimpleGrid,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiLock,
  FiRotateCcw,
  FiShoppingBag,
  FiTrash2,
  FiTruck,
} from "react-icons/fi";
import { FaLocationDot, FaPlus } from "react-icons/fa6";

import CartItem from "../../../../component/Cart/component/CartItem/CartItem";
import AddressModal from "../../../../component/Cart/component/DeliveryAddressModal/DelivaryAddressModal";
import ConfirmationModal from "../../../../component/common/ConfirmationModal/ConfirmationModal";
import stores from "../../../../store/stores";

const FREE_SHIPPING_THRESHOLD = 499;

const CartSection = observer(() => {
  const { cartStore, auth } = stores;
  const router = useRouter();
  const toast = useToast();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.900", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const highlightBg = useColorModeValue("purple.50", "whiteAlpha.50");

  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const {
    isOpen: isAddressOpen,
    onOpen: onAddressOpen,
    onClose: onAddressClose,
  } = useDisclosure();

  useEffect(() => {
    if (auth.token && auth.addresses.length === 0) {
      auth.fetchAddresses();
    }
  }, [auth]);

  const addresses = useMemo(() => auth.addresses || [], [auth.addresses]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find((a: any) => a.isDefault);
      setSelectedAddress(
        defaultAddr
          ? defaultAddr._id || defaultAddr.id
          : addresses[0]._id || addresses[0].id
      );
    }
  }, [addresses, selectedAddress]);

  const handleAddNewAddress = async (newAddress: any) => {
    try {
      const res = await auth.addAddress(newAddress);
      await auth.fetchAddresses();
      if (res?.data?._id || res?.data?.id) {
        setSelectedAddress(res.data._id || res.data.id);
      }
      toast({
        title: "Address saved",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Failed to save address",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateAddress = async (id: string, data: any) => {
    try {
      await auth.updateAddress(id, data);
      await auth.fetchAddresses();
    } catch {}
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await auth.deleteAddress(id);
      await auth.fetchAddresses();
      if (selectedAddress === id) setSelectedAddress("");
    } catch {}
  };

  const handleClearCart = () => {
    cartStore.clearCart();
    setIsClearModalOpen(false);
    toast({
      title: "Cart cleared",
      description: "All items have been removed.",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const subtotal = cartStore.cartItems.reduce((sum, item) => {
    if (!item.product) return sum;
    const price = Number(item.product.discountPrice ?? item.product.price) || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  const isFreeDelivery = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const deliveryFee = isFreeDelivery ? 0 : 40;
  const grandTotal = subtotal + deliveryFee;
  const progressToFree = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  const currentAddress =
    addresses.find((a: any) => (a._id || a.id) === selectedAddress) ||
    addresses[0];

  const isEmpty = cartStore.cartItems.length === 0;

  return (
    <Box>
      {/* ─── Header ─── */}
      <Flex
        justify="space-between"
        align="center"
        mb={6}
        pb={4}
        borderBottom="1px solid"
        borderColor={borderColor}
        flexWrap="wrap"
        gap={3}
      >
        <HStack spacing={3}>
          <Heading size="md" color={textColor}>
            My Cart
          </Heading>
          {!isEmpty && (
            <Badge
              colorScheme="purple"
              variant="subtle"
              fontSize="xs"
              px={2.5}
              py={0.5}
              rounded="full"
            >
              {cartStore.totalItems} {cartStore.totalItems === 1 ? "item" : "items"}
            </Badge>
          )}
        </HStack>

        {!isEmpty && (
          <HStack spacing={2}>
            <Button
              size="sm"
              variant="ghost"
              colorScheme="red"
              leftIcon={<Icon as={FiTrash2} />}
              onClick={() => setIsClearModalOpen(true)}
              fontSize="xs"
              rounded="lg"
            >
              Clear Cart
            </Button>
            <Button
              size="sm"
              variant="outline"
              colorScheme="purple"
              onClick={() => router.push("/products")}
              fontSize="xs"
              rounded="lg"
            >
              Continue Shopping
            </Button>
          </HStack>
        )}
      </Flex>

      {/* ─── Body ─── */}
      {isEmpty ? (
        <Card
          borderRadius="2xl"
          border="1px dashed"
          borderColor={borderColor}
          bg="transparent"
          p={10}
          textAlign="center"
        >
          <CardBody>
            <Flex
              w="80px"
              h="80px"
              rounded="full"
              bg="purple.50"
              align="center"
              justify="center"
              mx="auto"
              mb={4}
            >
              <Icon as={FiShoppingBag} boxSize={8} color="purple.500" />
            </Flex>
            <Heading size="sm" mb={2} color={textColor}>
              Your Cart is Empty
            </Heading>
            <Text fontSize="sm" color={mutedText} maxW="340px" mx="auto" mb={6}>
              Looks like you haven&apos;t added any items yet. Explore top local products
              and enjoy great discounts!
            </Text>
            <Button
              colorScheme="purple"
              size="md"
              rounded="xl"
              px={8}
              onClick={() => router.push("/products")}
              boxShadow="0 8px 20px -4px rgba(107, 70, 193, 0.4)"
            >
              Browse Products
            </Button>
          </CardBody>
        </Card>
      ) : (
        <Grid templateColumns={{ base: "1fr", lg: "1.7fr 1fr" }} gap={6}>
          {/* Left Column: Cart Items */}
          <VStack spacing={3} align="stretch">
            {/* Free Shipping Milestone Alert */}
            <Box
              p={3.5}
              bg={highlightBg}
              rounded="xl"
              border="1px solid"
              borderColor={useColorModeValue("purple.200", "purple.800")}
            >
              <Flex justify="space-between" align="center" mb={1.5}>
                <HStack spacing={2}>
                  <Icon
                    as={FiTruck}
                    color={isFreeDelivery ? "green.600" : "purple.600"}
                  />
                  <Text
                    fontSize="xs"
                    fontWeight="700"
                    color={isFreeDelivery ? "green.600" : "purple.600"}
                  >
                    {isFreeDelivery
                      ? "🎉 You have qualified for FREE Delivery!"
                      : `Add ₹${FREE_SHIPPING_THRESHOLD - subtotal} more for FREE Delivery`}
                  </Text>
                </HStack>
                <Text fontSize="2xs" color={mutedText} fontWeight="600">
                  ₹{subtotal} / ₹{FREE_SHIPPING_THRESHOLD}
                </Text>
              </Flex>
              <Progress
                value={progressToFree}
                size="xs"
                rounded="full"
                colorScheme={isFreeDelivery ? "green" : "purple"}
              />
            </Box>

            {/* Items list */}
            {cartStore.cartItems
              .filter((item) => item.product)
              .map((item) => {
                const id = item.product._id || item.product.id;
                const image =
                  item.product.image ||
                  (Array.isArray(item.product.images)
                    ? item.product.images[0]
                    : "") ||
                  "";
                const price =
                  item.product.discountPrice ?? item.product.price;
                const originalPrice =
                  item.product.originalPrice ?? item.product.mrp;

                return (
                  <Box
                    key={id}
                    p={4}
                    bg={cardBg}
                    rounded="xl"
                    border="1px solid"
                    borderColor={borderColor}
                    boxShadow="xs"
                  >
                    <CartItem
                      item={{
                        id,
                        name: item.product.name || item.product.title || "Product",
                        image,
                        price,
                        originalPrice,
                        quantity: item.quantity,
                      }}
                      updateQuantity={cartStore.updateQuantity}
                      onRemove={cartStore.removeFromCart}
                    />
                  </Box>
                );
              })}
          </VStack>

          {/* Right Column: Address & Bill Details */}
          <VStack spacing={4} align="stretch">
            {/* Delivery Address Card */}
            <Box
              p={4}
              bg={cardBg}
              rounded="2xl"
              border="1px solid"
              borderColor={borderColor}
              boxShadow="xs"
            >
              <Flex justify="space-between" align="center" mb={3}>
                <HStack spacing={2}>
                  <Icon as={FaLocationDot} color="purple.500" />
                  <Text fontWeight="700" fontSize="sm" color={textColor}>
                    Delivery Address
                  </Text>
                </HStack>
                <Button
                  size="xs"
                  variant="ghost"
                  colorScheme="purple"
                  onClick={onAddressOpen}
                  fontWeight="700"
                >
                  {currentAddress ? "Change" : "Add"}
                </Button>
              </Flex>

              {currentAddress &&
              (currentAddress.addressLine1 || currentAddress.line1) ? (
                <Box
                  p={3}
                  bg={highlightBg}
                  rounded="xl"
                  border="1px solid"
                  borderColor={useColorModeValue("purple.200", "purple.800")}
                >
                  <HStack spacing={2} align="center">
                    <Text fontWeight="700" fontSize="xs" color={textColor}>
                      {currentAddress.name || "Home"}
                    </Text>
                    {currentAddress.isDefault && (
                      <Badge colorScheme="purple" fontSize="3xs" rounded="sm">
                        Default
                      </Badge>
                    )}
                  </HStack>
                  <Text fontSize="xs" color={mutedText} mt={1} lineHeight="1.4">
                    {[
                      currentAddress.addressLine1 || currentAddress.line1,
                      currentAddress.city,
                      currentAddress.state,
                      currentAddress.postalCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </Text>
                  {currentAddress.phone && (
                    <Text fontSize="2xs" color={mutedText} mt={1}>
                      Phone: {currentAddress.phone}
                    </Text>
                  )}
                </Box>
              ) : (
                <Button
                  w="full"
                  variant="outline"
                  colorScheme="purple"
                  leftIcon={<Icon as={FaPlus} />}
                  size="sm"
                  rounded="xl"
                  onClick={onAddressOpen}
                >
                  Add Delivery Address
                </Button>
              )}
            </Box>

            {/* Bill Summary */}
            <Box
              p={5}
              bg={cardBg}
              rounded="2xl"
              border="1px solid"
              borderColor={borderColor}
              boxShadow="xs"
            >
              <Heading size="xs" color={textColor} mb={4} textTransform="uppercase" letterSpacing="wider">
                Order Summary
              </Heading>

              <VStack spacing={2.5} align="stretch" fontSize="sm">
                <Flex justify="space-between" color={mutedText}>
                  <Text>Items Subtotal</Text>
                  <Text fontWeight="600" color={textColor}>₹{subtotal}</Text>
                </Flex>
                <Flex justify="space-between" color={mutedText}>
                  <Text>Delivery Fee</Text>
                  <Text fontWeight="700" color={isFreeDelivery ? "green.600" : textColor}>
                    {isFreeDelivery ? "FREE" : `₹${deliveryFee}`}
                  </Text>
                </Flex>
                <Divider my={1} borderColor={borderColor} />
                <Flex justify="space-between" align="baseline">
                  <Text fontWeight="800" fontSize="md" color={textColor}>
                    Total Amount
                  </Text>
                  <Text fontWeight="800" fontSize="lg" color="purple.600">
                    ₹{grandTotal}
                  </Text>
                </Flex>
              </VStack>

              <Button
                mt={5}
                w="full"
                h="48px"
                bgGradient="linear(to-r, purple.600, blue.600)"
                color="white"
                rounded="xl"
                fontWeight="700"
                fontSize="sm"
                rightIcon={<Icon as={FiArrowRight} />}
                onClick={() => router.push("/checkout")}
                boxShadow="0 8px 20px -4px rgba(107, 70, 193, 0.4)"
                _hover={{ bgGradient: "linear(to-r, purple.700, blue.700)" }}
              >
                Proceed to Checkout • ₹{grandTotal}
              </Button>

              {/* Guarantees */}
              <SimpleGrid columns={2} spacing={3} mt={5} pt={4} borderTop="1px dashed" borderColor={borderColor}>
                <HStack spacing={2} color={mutedText} fontSize="2xs">
                  <Icon as={FiLock} color="green.500" />
                  <Text fontWeight="600">100% Secure Payments</Text>
                </HStack>
                <HStack spacing={2} color={mutedText} fontSize="2xs">
                  <Icon as={FiRotateCcw} color="blue.500" />
                  <Text fontWeight="600">Easy Returns</Text>
                </HStack>
              </SimpleGrid>
            </Box>
          </VStack>
        </Grid>
      )}

      {/* Address Modal / BottomSheet for Mobile */}
      <AddressModal
        isOpen={isAddressOpen}
        onClose={onAddressClose}
        addresses={addresses}
        selectedAddress={selectedAddress}
        onSelectAddress={(id) => setSelectedAddress(id)}
        onAddNewAddress={handleAddNewAddress}
        onUpdateAddress={handleUpdateAddress}
        onDeleteAddress={handleDeleteAddress}
      />

      {/* Clear Cart Confirmation */}
      <ConfirmationModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleClearCart}
        title="Empty Cart?"
        message="Are you sure you want to remove all items from your cart?"
        confirmText="Clear All"
        confirmButtonProps={{ colorScheme: "red" }}
        cancelText="Cancel"
      />
    </Box>
  );
});

export default CartSection;
