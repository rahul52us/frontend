"use client";

import {
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  IconButton,
  Progress,
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
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiLock,
  FiShoppingBag,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { FaLocationDot, FaPlus } from "react-icons/fa6";

import { authentication } from "../../../../config/utils/routes";
import stores from "../../../../store/stores";
import ConfirmationModal from "../../../common/ConfirmationModal/ConfirmationModal";
import CartItem from "../CartItem/CartItem";
import AddressModal from "../DeliveryAddressModal/DelivaryAddressModal";

const FREE_SHIPPING_THRESHOLD = 499;

const CartDrawer = observer(
  ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { cartStore, auth } = stores;
    const router = useRouter();
    const toast = useToast();

    // Theme tokens
    const drawerBg = useColorModeValue("#F8FAFC", "gray.900");
    const headerBg = useColorModeValue("white", "gray.850");
    const itemCardBg = useColorModeValue("white", "gray.800");
    const footerBg = useColorModeValue("white", "gray.850");
    const borderColor = useColorModeValue("gray.100", "gray.750");
    const textColor = useColorModeValue("gray.900", "white");
    const mutedText = useColorModeValue("gray.500", "gray.400");

    const [isClearModalOpen, setIsClearModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<string>("");

    const {
      isOpen: isAddressModalOpen,
      onOpen: onAddressModalOpen,
      onClose: onAddressModalClose,
    } = useDisclosure();

    // Load addresses on open
    useEffect(() => {
      if (isOpen && auth.token && auth.addresses.length === 0) {
        auth.fetchAddresses();
      }
    }, [isOpen, auth.token, auth.addresses.length, auth]);

    const addresses = useMemo(() => auth.addresses || [], [auth.addresses]);

    // Select default address if none chosen
    useEffect(() => {
      if (addresses.length > 0 && !selectedAddress) {
        const defaultAddr = addresses.find((a: any) => a.isDefault);
        setSelectedAddress(defaultAddr ? defaultAddr._id || defaultAddr.id : addresses[0]._id || addresses[0].id);
      }
    }, [addresses, selectedAddress]);

    // Handle address creation
    const handleAddNewAddress = async (newAddress: any) => {
      try {
        const res = await auth.addAddress(newAddress);
        await auth.fetchAddresses();
        if (res?.data?._id || res?.data?.id) {
          setSelectedAddress(res.data._id || res.data.id);
        }
        toast({
          title: "Address saved",
          description: "New delivery address has been saved.",
          status: "success",
          duration: 2500,
          isClosable: true,
        });
      } catch (err: any) {
        toast({
          title: "Failed to save address",
          description: err?.message || "Please check the details and try again.",
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
        toast({
          title: "Address updated",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } catch {
        toast({
          title: "Update failed",
          status: "error",
          duration: 2500,
          isClosable: true,
        });
      }
    };

    const handleDeleteAddress = async (id: string) => {
      try {
        await auth.deleteAddress(id);
        await auth.fetchAddresses();
        if (selectedAddress === id) {
          setSelectedAddress("");
        }
        toast({
          title: "Address removed",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } catch {
        toast({
          title: "Delete failed",
          status: "error",
          duration: 2500,
          isClosable: true,
        });
      }
    };

    const handleCheckout = () => {
      onClose();
      if (!auth.token) {
        router.push(authentication.login + "?redirect=/checkout");
      } else {
        router.push("/checkout");
      }
    };

    const handleClearCart = () => {
      cartStore.clearCart();
      setIsClearModalOpen(false);
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
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
    const progressToFree = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

    const currentAddress =
      addresses.find(
        (a: any) => (a._id || a.id) === selectedAddress
      ) || addresses[0];

    const isEmpty = cartStore.cartItems.length === 0;

    return (
      <>
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          size={{ base: "full", sm: "md" }}
        >
          <DrawerOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />

          <DrawerContent
            bg={drawerBg}
            borderLeftRadius={{ base: "none", sm: "2xl" }}
            overflow="hidden"
            display="flex"
            flexDirection="column"
          >
            {/* ─── 1. Header ─── */}
            <DrawerHeader
              bg={headerBg}
              py={3.5}
              px={4}
              borderBottom="1px solid"
              borderColor={borderColor}
              boxShadow="0 1px 3px rgba(0,0,0,0.03)"
            >
              <Flex align="center" justify="space-between">
                <HStack spacing={2.5}>
                  <IconButton
                    aria-label="Close cart"
                    icon={<Icon as={FiArrowLeft} boxSize={5} />}
                    size="sm"
                    variant="ghost"
                    rounded="full"
                    onClick={onClose}
                    color={textColor}
                  />
                  <Box>
                    <HStack spacing={2} align="center">
                      <Text fontSize="md" fontWeight="800" color={textColor} lineHeight="1">
                        My Cart
                      </Text>
                      {!isEmpty && (
                        <Badge
                          colorScheme="purple"
                          variant="solid"
                          fontSize="2xs"
                          px={2}
                          py={0.5}
                          rounded="full"
                        >
                          {cartStore.totalItems} {cartStore.totalItems === 1 ? "item" : "items"}
                        </Badge>
                      )}
                    </HStack>
                  </Box>
                </HStack>

                {!isEmpty && (
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    leftIcon={<Icon as={FiTrash2} boxSize={3} />}
                    onClick={() => setIsClearModalOpen(true)}
                    fontWeight="600"
                    rounded="full"
                    px={2.5}
                  >
                    Clear
                  </Button>
                )}
              </Flex>

              {/* Free Shipping Milestone Indicator */}
              {!isEmpty && (
                <Box mt={3} pt={2} borderTop="1px dashed" borderColor={borderColor}>
                  <Flex justify="space-between" align="center" mb={1.5}>
                    <Text fontSize="2xs" fontWeight="700" color={isFreeDelivery ? "green.600" : "purple.600"}>
                      {isFreeDelivery
                        ? "🎉 FREE Delivery Unlocked!"
                        : `Add ₹${FREE_SHIPPING_THRESHOLD - subtotal} more for FREE Delivery`}
                    </Text>
                    <Text fontSize="2xs" color={mutedText} fontWeight="600">
                      ₹{subtotal} / ₹{FREE_SHIPPING_THRESHOLD}
                    </Text>
                  </Flex>
                  <Progress
                    value={progressToFree}
                    size="xs"
                    rounded="full"
                    colorScheme={isFreeDelivery ? "green" : "purple"}
                    bg={useColorModeValue("gray.100", "gray.700")}
                  />
                </Box>
              )}
            </DrawerHeader>

            {/* ─── 2. Cart Body ─── */}
            <DrawerBody
              px={{ base: 3, sm: 4 }}
              py={4}
              overflowY="auto"
              sx={{
                scrollbarWidth: "thin",
              }}
            >
              {isEmpty ? (
                /* Empty Cart State */
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  h="70vh"
                  textAlign="center"
                  px={4}
                >
                  <Flex
                    w="96px"
                    h="96px"
                    rounded="full"
                    bg="purple.50"
                    align="center"
                    justify="center"
                    mb={4}
                    boxShadow="0 10px 25px -5px rgba(107, 70, 193, 0.2)"
                  >
                    <Icon as={FiShoppingBag} boxSize={10} color="purple.500" />
                  </Flex>

                  <Text fontSize="lg" fontWeight="800" color={textColor} mb={1}>
                    Your cart is empty
                  </Text>
                  <Text fontSize="xs" color={mutedText} maxW="240px" mb={6} lineHeight="1.5">
                    Explore top local deals, exclusive discounts, and add items to your cart!
                  </Text>

                  <Button
                    colorScheme="purple"
                    size="md"
                    rounded="xl"
                    px={8}
                    fontWeight="700"
                    fontSize="sm"
                    onClick={() => {
                      onClose();
                      router.push("/products");
                    }}
                    boxShadow="0 8px 20px -4px rgba(107, 70, 193, 0.4)"
                    _active={{ transform: "scale(0.97)" }}
                  >
                    Start Shopping
                  </Button>
                </Flex>
              ) : (
                /* Item Cards List */
                <VStack spacing={3} align="stretch">
                  {cartStore.cartItems
                    .filter((item) => item.product)
                    .map((item) => {
                      const id = item.product._id || item.product.id;
                      const image =
                        item.product.image ||
                        (Array.isArray(item.product.images) ? item.product.images[0] : "") ||
                        "";
                      const price = item.product.discountPrice ?? item.product.price;
                      const originalPrice = item.product.originalPrice ?? item.product.mrp;

                      return (
                        <Box
                          key={id}
                          bg={itemCardBg}
                          rounded="2xl"
                          p={3.5}
                          border="1px solid"
                          borderColor={borderColor}
                          boxShadow="0 2px 8px -2px rgba(15, 23, 42, 0.04)"
                          transition="all 0.2s ease"
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
              )}
            </DrawerBody>

            {/* ─── 3. Footer (Address & Checkout) ─── */}
            {!isEmpty && (
              <DrawerFooter
                bg={footerBg}
                borderTop="1px solid"
                borderColor={borderColor}
                px={{ base: 3.5, sm: 4 }}
                pt={3}
                pb="calc(12px + env(safe-area-inset-bottom, 0px))"
                flexDirection="column"
                gap={3}
                boxShadow="0 -4px 20px rgba(15, 23, 42, 0.05)"
              >
                {/* Delivery Address Preview Card */}
                <Box
                  w="full"
                  p={2.5}
                  bg={useColorModeValue("purple.50", "whiteAlpha.50")}
                  border="1px solid"
                  borderColor={useColorModeValue("purple.200", "purple.800")}
                  rounded="xl"
                  cursor="pointer"
                  transition="all 0.15s ease"
                  _hover={{ borderColor: "purple.400" }}
                  onClick={onAddressModalOpen}
                >
                  <Flex gap={2.5} align="center">
                    <Flex
                      w="32px"
                      h="32px"
                      rounded="lg"
                      bg="purple.500"
                      color="white"
                      align="center"
                      justify="center"
                      flexShrink={0}
                    >
                      <Icon as={FaLocationDot} boxSize={3.5} />
                    </Flex>

                    <Box flex="1" minW={0}>
                      {currentAddress &&
                      (currentAddress.addressLine1 || currentAddress.line1) ? (
                        <>
                          <Flex justify="space-between" align="center">
                            <HStack spacing={1.5}>
                              <Text fontWeight="700" fontSize="xs" color={textColor} noOfLines={1}>
                                Delivering to {currentAddress.name || "Home"}
                              </Text>
                              {currentAddress.isDefault && (
                                <Badge colorScheme="purple" fontSize="3xs" rounded="sm">
                                  Default
                                </Badge>
                              )}
                            </HStack>
                            <Text fontSize="2xs" fontWeight="700" color="purple.600">
                              Change
                            </Text>
                          </Flex>
                          <Text fontSize="2xs" color={mutedText} noOfLines={1} mt={0.5}>
                            {[
                              currentAddress.addressLine1 || currentAddress.line1,
                              currentAddress.city,
                              currentAddress.postalCode,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </Text>
                        </>
                      ) : (
                        <Flex justify="space-between" align="center">
                          <Text fontWeight="700" fontSize="xs" color={textColor}>
                            Add a delivery address
                          </Text>
                          <HStack spacing={1} color="purple.600">
                            <Icon as={FaPlus} boxSize={3} />
                            <Text fontSize="2xs" fontWeight="700">
                              Add
                            </Text>
                          </HStack>
                        </Flex>
                      )}
                    </Box>
                  </Flex>
                </Box>

                {/* Price Breakdown */}
                <Box w="full" px={1}>
                  <Flex justify="space-between" fontSize="xs" color={mutedText} mb={1}>
                    <Text>Subtotal ({cartStore.totalItems} items)</Text>
                    <Text fontWeight="600" color={textColor}>₹{subtotal}</Text>
                  </Flex>
                  <Flex justify="space-between" fontSize="xs" color={mutedText} mb={1}>
                    <Text>Delivery</Text>
                    <Text fontWeight="700" color={isFreeDelivery ? "green.600" : textColor}>
                      {isFreeDelivery ? "FREE" : `₹${deliveryFee}`}
                    </Text>
                  </Flex>
                  <Divider my={1.5} borderColor={borderColor} />
                  <Flex justify="space-between" align="baseline">
                    <Text fontWeight="800" fontSize="sm" color={textColor}>
                      Total Amount
                    </Text>
                    <Text fontWeight="800" fontSize="md" color="purple.600">
                      ₹{grandTotal}
                    </Text>
                  </Flex>
                </Box>

                {/* Checkout CTA Button */}
                <Button
                  w="full"
                  h="48px"
                  bgGradient="linear(to-r, purple.600, blue.600)"
                  color="white"
                  rounded="xl"
                  fontWeight="700"
                  fontSize="sm"
                  rightIcon={<Icon as={FiArrowRight} boxSize={4} />}
                  onClick={handleCheckout}
                  boxShadow="0 8px 20px -4px rgba(107, 70, 193, 0.4)"
                  _hover={{ bgGradient: "linear(to-r, purple.700, blue.700)" }}
                  _active={{ transform: "scale(0.98)" }}
                >
                  Proceed to Checkout • ₹{grandTotal}
                </Button>

                {/* Trust Badge */}
                <HStack justify="center" spacing={1.5} color={mutedText} fontSize="3xs">
                  <Icon as={FiLock} boxSize={3} />
                  <Text fontWeight="600">100% Secure Checkout</Text>
                  <Text>•</Text>
                  <Icon as={FiCheckCircle} boxSize={3} />
                  <Text fontWeight="600">Verified Sellers</Text>
                </HStack>
              </DrawerFooter>
            )}
          </DrawerContent>
        </Drawer>

        {/* ─── Address Modal / Mobile BottomSheet ─── */}
        <AddressModal
          isOpen={isAddressModalOpen}
          onClose={onAddressModalClose}
          addresses={addresses}
          selectedAddress={selectedAddress}
          onSelectAddress={(id) => setSelectedAddress(id)}
          onAddNewAddress={handleAddNewAddress}
          onUpdateAddress={handleUpdateAddress}
          onDeleteAddress={handleDeleteAddress}
        />

        {/* ─── Clear Cart Confirmation ─── */}
        <ConfirmationModal
          isOpen={isClearModalOpen}
          onClose={() => setIsClearModalOpen(false)}
          onConfirm={handleClearCart}
          title="Empty Cart?"
          message="Are you sure you want to remove all items from your cart?"
          confirmText="Clear All"
          confirmButtonProps={{ colorScheme: "red" }}
          cancelText="Keep Items"
        />
      </>
    );
  }
);

export default CartDrawer;
