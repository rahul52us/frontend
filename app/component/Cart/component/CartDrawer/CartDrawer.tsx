import { ArrowLeftIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  Text,
  useDisclosure,
  VStack,
  Divider,
  Image,
} from "@chakra-ui/react";
import { useEffect, useState, useMemo } from "react";
import { FaLocationDot, FaPlus } from "react-icons/fa6";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";

import CartItem from "../CartItem/CartItem";
import AddressModal from "../DeliveryAddressModal/DelivaryAddressModal";
import stores from "../../../../store/stores";
import { authentication } from "../../../../config/utils/routes";



const CartDrawer = observer(
  ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { cartStore, auth } = stores;
    const router = useRouter();

    useEffect(() => {
      if (isOpen && auth.token && auth.addresses.length === 0) {
        auth.fetchAddresses();
      }
    }, [isOpen, auth.token, auth.addresses.length, auth]);

    const addresses = useMemo(() => auth.addresses || [], [auth.addresses]);
    const [selectedAddress, setSelectedAddress] = useState<string>("");

    // Sync selected address with default
    useEffect(() => {
      if (addresses.length > 0 && !selectedAddress) {
        const defaultAddr = addresses.find((a: any) => a.isDefault);
        setSelectedAddress(defaultAddr ? defaultAddr._id : addresses[0]._id);
      }
    }, [addresses, selectedAddress]);

    // Handle Adding New Address
    const handleAddNewAddress = async (newAddress: any) => {
      try {
        await auth.addAddress(newAddress);
        auth.fetchAddresses(); // Refresh list
      } catch {
        // console.error("Failed to add address", error);
      }
    };
    const {
      isOpen: isAddressModalOpen,
      onOpen: onAddressModalOpen,
      onClose: onAddressModalClose,
    } = useDisclosure();

    const handleCheckout = () => {
      onClose();
      if (!auth.token) {
        router.push(authentication.login + "?redirect=/checkout");
      } else {
        router.push("/checkout");
      }
    };

    const totalAmount = cartStore.cartItems.reduce(
      (sum, item) => {
        if (!item.product || !item.product.price) return sum;
        return sum + (Number(item.product.discountPrice || item.product.price) || 0) * (item.quantity || 1);
      },
      0
    );

    const currentAddress =
      addresses.find((a: any) => a._id === selectedAddress) ||
      addresses[0];

    const isEmpty = cartStore.cartItems.length === 0;

    return (
      <>
        <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
          <DrawerOverlay bg="blackAlpha.400" />

          <DrawerContent
            bg="gray.100"
            borderLeftRadius="2xl"
            maxW={{ lg: "28rem" }}
          >
            {/* HEADER */}
            <DrawerHeader bg="white" py={4} borderBottom="1px solid #e2e8f0">
              <Flex align="center" gap={3}>
                <Icon
                  as={ArrowLeftIcon}
                  cursor="pointer"
                  onClick={onClose}
                  color="gray.600"
                />
                <Text fontSize="lg" fontWeight={600}>
                  Your Cart
                </Text>
                <Text fontSize="sm" color="gray.500">
                  ({cartStore.cartItems.length})
                </Text>
              </Flex>
            </DrawerHeader>

            {/* BODY */}
            <DrawerBody px={4} py={4}>
              {isEmpty ? (
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  h="100%"
                  textAlign="center"
                  gap={4}
                >
                  <Image
                    src="https://img.freepik.com/premium-vector/shopping-cart-with-cross-mark-wireless-paymant-icon-shopping-bag-failure-paymant-sign-online-shopping-vector_662353-912.jpg"
                    alt="Empty cart"
                    maxW="180px"
                    opacity={0.9}
                  />
                  <Box>
                    <Text fontSize="lg" fontWeight={600}>
                      Your cart is empty
                    </Text>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Looks like you haven’t added anything yet
                    </Text>
                  </Box>

                  <Button
                    variant="outline"
                    colorScheme="purple"
                    size="sm"
                    mt={2}
                    onClick={onClose}
                  >
                    Continue shopping
                  </Button>
                </Flex>
              ) : (
                <VStack spacing={3} align="stretch">
                  {cartStore.cartItems
                    .filter(item => item.product) // Filter out items with deleted products
                    .map((item) => (
                      <Box
                        key={item.product._id || item.product.id}
                        bg="white"
                        rounded="lg"
                        p={3}
                        boxShadow="sm"
                      >
                        <CartItem
                          item={{
                            id: item.product._id || item.product.id,
                            name: item.product.name,
                            image:
                              item.product.image ||
                              item.product.images?.[0] ||
                              "",
                            price: item.product.price,
                            quantity: item.quantity,
                          }}
                          updateQuantity={cartStore.updateQuantity}
                        />
                      </Box>
                    ))}
                </VStack>
              )}
            </DrawerBody>

            {/* FOOTER (only if not empty) */}
            {!isEmpty && (
              <DrawerFooter
                bg="white"
                borderTop="1px solid #e2e8f0"
                px={4}
                py={4}
                flexDirection="column"
                gap={4}
              >
                {/* ADDRESS */}
                <Box
                  w="full"
                  p={3}
                  border="1px solid"
                  borderColor="gray.200"
                  rounded="lg"
                  cursor="pointer"
                  _hover={{ bg: "gray.50" }}
                  onClick={onAddressModalOpen}
                >
                  <Flex gap={3} align="flex-start">
                    <Icon
                      as={FaLocationDot}
                      color="purple.500"
                      mt={1}
                    />
                    <Box flex="1">
                      {currentAddress && (currentAddress.addressLine1 || currentAddress.line1) ? (
                        <>
                          <Flex justify="space-between">
                            <Text fontWeight={600}>
                              Delivering to {currentAddress.name}
                            </Text>
                            <Text fontSize="sm" color="purple.500">
                              Change
                            </Text>
                          </Flex>
                          <Text fontSize="sm" color="gray.600">
                            {[currentAddress.addressLine1, currentAddress.city, currentAddress.state]
                              .filter(Boolean)
                              .join(", ")}
                          </Text>
                        </>
                      ) : (
                        <Flex justify="space-between" align="center" h="100%">
                          <Text fontWeight={600} color="gray.600">
                            Add a delivery address
                          </Text>
                          <Icon as={FaPlus} color="purple.500" />
                        </Flex>
                      )}
                    </Box>
                  </Flex>
                </Box>

                <Divider />

                {/* CHECKOUT */}
                <Button
                  w="full"
                  size="lg"
                  colorScheme="purple"
                  rounded="xl"
                  fontWeight={600}
                  onClick={handleCheckout}
                >
                  Checkout • ₹{totalAmount}
                </Button>
              </DrawerFooter>
            )}
          </DrawerContent>
        </Drawer>

        {/* ADDRESS MODAL */}
        <AddressModal
          isOpen={isAddressModalOpen}
          onClose={onAddressModalClose}
          addresses={addresses}
          selectedAddress={selectedAddress}
          onSelectAddress={setSelectedAddress}
          onAddNewAddress={handleAddNewAddress}
          onUpdateAddress={async (id: string, data: any) => {
            try {
              await auth.updateAddress(id, data);
            } catch { }
          }}
          onDeleteAddress={async (id: string) => {
            try {
              await auth.deleteAddress(id);
            } catch { }
          }}
        />
      </>
    );
  }
);

export default CartDrawer;
