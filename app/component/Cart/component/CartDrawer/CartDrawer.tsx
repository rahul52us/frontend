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
import { useEffect, useState } from "react";
import { FaLocationDot, FaPlus } from "react-icons/fa6";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiChevronRight,
  FiLock,
  FiShoppingBag,
  FiTrash2,
  FiTruck,
} from "react-icons/fi";
import { authentication } from "../../../../config/utils/routes";
import stores from "../../../../store/stores";
import ConfirmationModal from "../../../common/ConfirmationModal/ConfirmationModal";
import CartItem from "../CartItem/CartItem";
import AddressModal from "../DeliveryAddressModal/DelivaryAddressModal";

const FREE_SHIPPING_THRESHOLD = 499;
const DELIVERY_FEE = 40;

const formatAmount = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(value);

const CartDrawer = observer(
  ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { cartStore, auth } = stores;
    const router = useRouter();
    const toast = useToast();

    // Keep every color-mode hook at the top level so the hook order stays stable.
    const drawerBg = useColorModeValue("gray.50", "gray.900");
    const surfaceBg = useColorModeValue("white", "gray.800");
    const itemCardBg = useColorModeValue("white", "whiteAlpha.50");
    const borderColor = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
    const textColor = useColorModeValue("gray.900", "whiteAlpha.900");
    const mutedText = useColorModeValue("gray.500", "gray.400");
    const accentText = useColorModeValue("purple.600", "purple.200");
    const subtleBg = useColorModeValue("gray.50", "whiteAlpha.50");
    const clearHoverBg = useColorModeValue("red.50", "whiteAlpha.100");
    const purpleSurfaceBg = useColorModeValue("purple.50", "whiteAlpha.50");
    const purpleBorder = useColorModeValue("purple.100", "whiteAlpha.100");
    const progressTrack = useColorModeValue("purple.100", "whiteAlpha.100");
    const emptyIconBg = useColorModeValue("purple.50", "whiteAlpha.100");
    const emptyRingBg = useColorModeValue("purple.50", "whiteAlpha.50");
    const successBg = useColorModeValue("green.50", "whiteAlpha.50");
    const successBorder = useColorModeValue("green.100", "whiteAlpha.100");

    const [isClearModalOpen, setIsClearModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<string>("");

    const {
      isOpen: isAddressModalOpen,
      onOpen: onAddressModalOpen,
      onClose: onAddressModalClose,
    } = useDisclosure();

    useEffect(() => {
      if (isOpen && auth.token && auth.addresses.length === 0) {
        auth.fetchAddresses();
      }
    }, [isOpen, auth.token, auth.addresses.length, auth]);

    const addresses = auth.addresses || [];

    useEffect(() => {
      if (addresses.length > 0 && !selectedAddress) {
        const defaultAddress = addresses.find((address: any) => address.isDefault);
        const firstAddress = defaultAddress || addresses[0];
        setSelectedAddress(firstAddress._id || firstAddress.id);
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

    const isEmpty = cartStore.cartItems.length === 0;
    const isFreeDelivery = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
    const deliveryFee = isFreeDelivery ? 0 : DELIVERY_FEE;
    const grandTotal = subtotal + deliveryFee;
    const amountToFreeDelivery = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    const progressToFree = Math.min(
      100,
      Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100),
    );

    const currentAddress =
      addresses.find((address: any) =>
        (address._id || address.id) === selectedAddress,
      ) || addresses[0];

    const hasAddress = Boolean(
      currentAddress &&
        (currentAddress.addressLine1 || currentAddress.line1),
    );

    return (
      <>
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          size={{ base: "full", sm: "md" }}
        >
          <DrawerOverlay bg="blackAlpha.600" backdropFilter="blur(6px)" />

          <DrawerContent
            bg={drawerBg}
            borderLeftRadius={{ base: "none", sm: "2xl" }}
            overflow="hidden"
          >
            <DrawerHeader
              bg={surfaceBg}
              px={{ base: 4, sm: 5 }}
              py={4}
              borderBottom="1px solid"
              borderColor={borderColor}
            >
              <Flex align="center" justify="space-between" gap={3}>
                <HStack spacing={3} minW={0}>
                  <IconButton
                    aria-label="Close cart"
                    icon={<Icon as={FiArrowLeft} boxSize={5} />}
                    size="sm"
                    variant="ghost"
                    rounded="full"
                    onClick={onClose}
                    color={textColor}
                    flexShrink={0}
                    _hover={{ bg: subtleBg }}
                  />

                  <Box minW={0}>
                    <HStack spacing={2}>
                      <Text
                        as="h2"
                        fontSize="lg"
                        fontWeight="800"
                        letterSpacing="-0.02em"
                        color={textColor}
                        lineHeight="1.2"
                      >
                        My cart
                      </Text>
                      {!isEmpty && (
                        <Badge
                          bg={purpleSurfaceBg}
                          color={accentText}
                          fontSize="10px"
                          fontWeight="700"
                          px={2}
                          py={0.5}
                          rounded="full"
                          textTransform="none"
                        >
                          {cartStore.totalItems}{" "}
                          {cartStore.totalItems === 1 ? "item" : "items"}
                        </Badge>
                      )}
                    </HStack>
                    <Text fontSize="xs" color={mutedText} mt={0.5}>
                      {isEmpty
                        ? "Your next favorite find starts here"
                        : "Review your items before checkout"}
                    </Text>
                  </Box>
                </HStack>

                {!isEmpty && (
                  <Button
                    size="xs"
                    variant="ghost"
                    color="red.500"
                    leftIcon={<Icon as={FiTrash2} boxSize={3.5} />}
                    onClick={() => setIsClearModalOpen(true)}
                    fontWeight="600"
                    rounded="full"
                    px={2.5}
                    flexShrink={0}
                    _hover={{ bg: clearHoverBg }}
                  >
                    Clear
                  </Button>
                )}
              </Flex>
            </DrawerHeader>

            <DrawerBody
              display="flex"
              flexDirection="column"
              px={{ base: 3, sm: 4 }}
              py={4}
              overflowY="auto"
              overscrollBehavior="contain"
              sx={{
                scrollbarWidth: "thin",
                scrollbarColor: "var(--chakra-colors-gray-300) transparent",
                "&::-webkit-scrollbar": { width: "5px" },
                "&::-webkit-scrollbar-thumb": {
                  background: "var(--chakra-colors-gray-300)",
                  borderRadius: "full",
                },
              }}
            >
              {isEmpty ? (
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  flex="1"
                  minH="360px"
                  py={12}
                  textAlign="center"
                >
                  <Flex
                    w="120px"
                    h="120px"
                    rounded="full"
                    bg={emptyRingBg}
                    align="center"
                    justify="center"
                    mb={5}
                  >
                    <Flex
                      w="88px"
                      h="88px"
                      rounded="full"
                      bg={emptyIconBg}
                      align="center"
                      justify="center"
                      boxShadow="0 16px 35px -18px rgba(128, 90, 213, 0.65)"
                    >
                      <Icon as={FiShoppingBag} boxSize={9} color="var(--color-primary)" />
                    </Flex>
                  </Flex>

                  <Text
                    fontSize="xl"
                    fontWeight="800"
                    letterSpacing="-0.02em"
                    color={textColor}
                    mb={2}
                  >
                    Your cart is feeling light
                  </Text>
                  <Text
                    fontSize="sm"
                    color={mutedText}
                    maxW="280px"
                    mb={7}
                    lineHeight="1.6"
                  >
                    Discover local favorites and great deals, then add them to
                    your cart.
                  </Text>

                  <Button
                    colorScheme="brand"
                    size="md"
                    h="46px"
                    rounded="xl"
                    px={8}
                    fontWeight="700"
                    fontSize="sm"
                    rightIcon={<Icon as={FiArrowRight} />}
                    onClick={() => {
                      onClose();
                      router.push("/products");
                    }}
                    boxShadow="0 10px 24px -12px rgba(128, 90, 213, 0.8)"
                    _active={{ transform: "scale(0.98)" }}
                  >
                    Explore products
                  </Button>

                  <HStack spacing={1.5} color={mutedText} fontSize="xs" mt={5}>
                    <Icon as={FiTruck} boxSize={3.5} />
                    <Text>Free delivery on orders over ₹499</Text>
                  </HStack>
                </Flex>
              ) : (
                <VStack spacing={4} align="stretch">
                  <Box
                    p={3}
                    rounded="xl"
                    bg={isFreeDelivery ? successBg : purpleSurfaceBg}
                    border="1px solid"
                    borderColor={isFreeDelivery ? successBorder : purpleBorder}
                  >
                    <Flex align="center" gap={2.5}>
                      <Flex
                        w="34px"
                        h="34px"
                        rounded="lg"
                        bg={surfaceBg}
                        color={isFreeDelivery ? "green.500" : "purple.500"}
                        align="center"
                        justify="center"
                        flexShrink={0}
                        boxShadow="sm"
                      >
                        <Icon
                          as={isFreeDelivery ? FiCheckCircle : FiTruck}
                          boxSize={4}
                        />
                      </Flex>

                      <Box flex="1" minW={0}>
                        <Text
                          fontSize="xs"
                          fontWeight="700"
                          color={textColor}
                          lineHeight="1.4"
                        >
                          {isFreeDelivery
                            ? "You’ve unlocked free delivery"
                            : `Add ₹${formatAmount(amountToFreeDelivery)} more for free delivery`}
                        </Text>
                        <Text fontSize="11px" color={mutedText} mt={0.5}>
                          {isFreeDelivery
                            ? "A little saving on this order"
                            : `₹${formatAmount(subtotal)} of ₹${FREE_SHIPPING_THRESHOLD}`}
                        </Text>
                      </Box>

                      {!isFreeDelivery && (
                        <Text
                          fontSize="xs"
                          color={accentText}
                          fontWeight="800"
                          flexShrink={0}
                        >
                          {progressToFree}%
                        </Text>
                      )}
                    </Flex>

                    <Progress
                      value={progressToFree}
                      aria-label="Progress towards free delivery"
                      size="xs"
                      mt={2.5}
                      rounded="full"
                      colorScheme={isFreeDelivery ? "green" : "purple"}
                      bg={progressTrack}
                    />
                  </Box>

                  <VStack spacing={3} align="stretch" role="list">
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
                            role="listitem"
                            bg={itemCardBg}
                            rounded="xl"
                            p={3}
                            border="1px solid"
                            borderColor={borderColor}
                            boxShadow="0 4px 16px -12px rgba(15, 23, 42, 0.18)"
                            transition="border-color 0.2s ease, box-shadow 0.2s ease"
                            _hover={{
                              borderColor: "purple.200",
                              boxShadow:
                                "0 8px 24px -16px rgba(128, 90, 213, 0.45)",
                            }}
                          >
                            <CartItem
                              item={{
                                id,
                                name:
                                  item.product.name ||
                                  item.product.title ||
                                  "Product",
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
                </VStack>
              )}
            </DrawerBody>

            {!isEmpty && (
              <DrawerFooter
                bg={surfaceBg}
                borderTop="1px solid"
                borderColor={borderColor}
                px={{ base: 4, sm: 5 }}
                pt={4}
                pb="calc(16px + env(safe-area-inset-bottom, 0px))"
                flexDirection="column"
                alignItems="stretch"
                gap={3}
                boxShadow="0 -12px 30px -24px rgba(15, 23, 42, 0.45)"
              >
                <Box
                  as="button"
                  type="button"
                  w="full"
                  p={3}
                  bg={subtleBg}
                  border="1px solid"
                  borderColor={borderColor}
                  rounded="xl"
                  textAlign="left"
                  transition="border-color 0.15s ease, background 0.15s ease"
                  _hover={{ borderColor: "purple.300" }}
                  _focusVisible={{
                    outline: "2px solid",
                    outlineColor: "purple.400",
                    outlineOffset: "2px",
                  }}
                  onClick={onAddressModalOpen}
                  aria-haspopup="dialog"
                  aria-label={
                    hasAddress
                      ? "Change delivery address"
                      : "Add a delivery address"
                  }
                >
                  <Flex gap={3} align="center">
                    <Flex
                      w="38px"
                      h="38px"
                      rounded="xl"
                      bg={purpleSurfaceBg}
                      color="var(--color-primary)"
                      align="center"
                      justify="center"
                      flexShrink={0}
                    >
                      <Icon as={FaLocationDot} boxSize={4} />
                    </Flex>

                    <Box flex="1" minW={0}>
                      {hasAddress ? (
                        <>
                          {/* <Text
                            color={mutedText}
                            fontSize="10px"
                            fontWeight="700"
                            letterSpacing="0.08em"
                            textTransform="uppercase"
                            mb={0.5}
                          >
                            Deliver to
                          </Text> */}
                          <HStack spacing={1.5}>
                            <Text
                              fontWeight="700"
                              fontSize="sm"
                              color={textColor}
                              noOfLines={1}
                            >
                              {currentAddress.name || "Home"}
                            </Text>
                            {currentAddress.isDefault && (
                              <Badge
                                colorScheme="brand"
                                variant="subtle"
                                fontSize="9px"
                                rounded="md"
                                textTransform="none"
                              >
                                Default
                              </Badge>
                            )}
                          </HStack>
                          <Text
                            fontSize="xs"
                            color={mutedText}
                            noOfLines={1}
                            mt={0.5}
                          >
                            {[
                              currentAddress.addressLine1 ||
                                currentAddress.line1,
                              currentAddress.city,
                              currentAddress.postalCode,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </Text>
                        </>
                      ) : (
                        <>
                          <Text fontWeight="700" fontSize="sm" color={textColor}>
                            Add a delivery address
                          </Text>
                          <Text fontSize="xs" color={mutedText} mt={0.5}>
                            Tell us where to deliver your order
                          </Text>
                        </>
                      )}
                    </Box>

                    <HStack spacing={1} color="var(--color-primary)" flexShrink={0}>
                      {!hasAddress && <Icon as={FaPlus} boxSize={3} />}
                      <Text fontSize="xs" fontWeight="700">
                        {hasAddress ? "Change" : "Add"}
                      </Text>
                      <Icon as={FiChevronRight} boxSize={4} />
                    </HStack>
                  </Flex>
                </Box>

                <Box
                  w="full"
                  px={3}
                  py={2.5}
                  bg={subtleBg}
                  border="1px solid"
                  borderColor={borderColor}
                  rounded="xl"
                >
                  <Flex
                    justify="space-between"
                    fontSize="xs"
                    color={mutedText}
                    mb={1.5}
                  >
                    <Text>Subtotal · {cartStore.totalItems} items</Text>
                    <Text fontWeight="600" color={textColor}>
                      ₹{formatAmount(subtotal)}
                    </Text>
                  </Flex>
                  <Flex
                    justify="space-between"
                    fontSize="xs"
                    color={mutedText}
                    mb={1.5}
                  >
                    <Text>Delivery fee</Text>
                    <Text
                      fontWeight="700"
                      color={isFreeDelivery ? "green.500" : textColor}
                    >
                      {isFreeDelivery
                        ? "FREE"
                        : `₹${formatAmount(deliveryFee)}`}
                    </Text>
                  </Flex>

                  <Divider my={2} borderColor={borderColor} />

                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontWeight="700" fontSize="sm" color={textColor}>
                        Total
                      </Text>
                      <Text fontSize="10px" color={mutedText}>
                        Subtotal + delivery
                      </Text>
                    </Box>
                    <Text
                      fontWeight="800"
                      fontSize="lg"
                      letterSpacing="-0.02em"
                      color={textColor}
                    >
                      ₹{formatAmount(grandTotal)}
                    </Text>
                  </Flex>
                </Box>

                <Button
                  w="full"
                  h="50px"
                  colorScheme="brand"
                  bg="purple.600"
                  color="white"
                  rounded="xl"
                  fontWeight="700"
                  fontSize="sm"
                  rightIcon={<Icon as={FiArrowRight} boxSize={4} />}
                  onClick={handleCheckout}
                  boxShadow="0 12px 24px -14px rgba(128, 90, 213, 0.9)"
                  _hover={{ bg: "purple.700", transform: "translateY(-1px)" }}
                  _active={{ bg: "purple.700", transform: "scale(0.99)" }}
                >
                  Checkout · ₹{formatAmount(grandTotal)}
                </Button>

                <HStack
                  justify="center"
                  spacing={3}
                  color={mutedText}
                  fontSize="10px"
                >
                  <HStack spacing={1}>
                    <Icon as={FiLock} boxSize={3} />
                    <Text fontWeight="600">Secure checkout</Text>
                  </HStack>
                  <Box w="3px" h="3px" rounded="full" bg={mutedText} />
                  <HStack spacing={1}>
                    <Icon as={FiCheckCircle} boxSize={3} />
                    <Text fontWeight="600">Verified sellers</Text>
                  </HStack>
                </HStack>
              </DrawerFooter>
            )}
          </DrawerContent>
        </Drawer>

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
  },
);

export default CartDrawer;