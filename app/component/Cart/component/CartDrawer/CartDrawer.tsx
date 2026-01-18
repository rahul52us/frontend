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
import { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";

import CartItem from "../CartItem/CartItem";
import AddressModal from "../DeliveryAddressModal/DelivaryAddressModal";
import stores from "../../../../store/stores";
import { authentication } from "../../../../config/utils/routes";

interface Address {
  id: number;
  name: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

const CartDrawer = observer(
  ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { cartStore, auth } = stores;
    const router = useRouter();

    const [addresses, setAddresses] = useState<Address[]>([
      {
        id: 1,
        name: "Home",
        line1: "123 Main Street",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA",
        isDefault: true,
      },
    ]);

    const [selectedAddress, setSelectedAddress] = useState(1);
    const {
      isOpen: isAddressModalOpen,
      onOpen: onAddressModalOpen,
      onClose: onAddressModalClose,
    } = useDisclosure();

    const handleCheckout = () => {
      if (!auth.user) {
        onClose();
        router.push(authentication.login);
      } else {
        alert("Checkout flow pending");
      }
    };

    const totalAmount = cartStore.cartItems.reduce(
      (sum, item) => {
        if (!item.product || !item.product.price) return sum;
        return sum + Number(item.product.price) * item.quantity;
      },
      0
    );

    const currentAddress =
      addresses.find((a) => a.id === selectedAddress) ||
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
                      <Flex justify="space-between">
                        <Text fontWeight={600}>
                          Delivering to {currentAddress.name}
                        </Text>
                        <Text fontSize="sm" color="purple.500">
                          Change
                        </Text>
                      </Flex>
                      <Text fontSize="sm" color="gray.600">
                        {currentAddress.line1}, {currentAddress.city}
                      </Text>
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
          onAddNewAddress={(addr) => {
            const id = addresses.length + 1;
            setAddresses([...addresses, { ...addr, id }]);
            setSelectedAddress(id);
          }}
        />
      </>
    );
  }
);

export default CartDrawer;
