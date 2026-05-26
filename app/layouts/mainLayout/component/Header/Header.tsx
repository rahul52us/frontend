"use client";

import { HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  Image,
  Text,
  useBreakpointValue,
  useDisclosure,
  Badge,
  Icon,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import stores from "../../../../store/stores";
import { useRouter } from "next/navigation";
import { FiShoppingCart, FiHeart, FiShoppingBag, FiMapPin, FiCreditCard, FiUser, FiLogOut, FiGrid } from "react-icons/fi";
import { useEffect, useState } from "react";

import CartDrawer from "../../../../component/Cart/component/CartDrawer/CartDrawer";
import WishlistDrawer from "../../../../component/Wishlist/component/WishlistDrawer/WishlistDrawer";
import WhatsAppButton from "../../../../component/common/whatsApp/whatsAppButton";
import HeroNavButton from "./component/HeroNavButton";
import UserMenu from "./component/UserMenu";
import NavItemsLayout from "./component/NavItemsLayout";
import SearchInput from "./element/SearchInput";
import NotificationBell from "./Notification/NotificationBell";

/* ✅ NEW: Notification Bell */

const Header = observer(() => {
  const router = useRouter();
  const {
    auth: { user, logout },
    cartStore,
  } = stores;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch cart data when user is logged in
  useEffect(() => {
    if (isMounted && user) {
      cartStore.fetchCart();
    }
  }, [isMounted, user, cartStore]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const isCartOpen = cartStore.isCartOpen;
  const onCartOpen = cartStore.openCart;
  const onCartClose = cartStore.closeCart;
  const {
    isOpen: isWishlistOpen,
    onOpen: onWishlistOpen,
    onClose: onWishlistClose
  } = useDisclosure();

  const handleLogout = () => {
    logout();
    router.push("/");
    onClose();
  };

  const drawerWidth = useBreakpointValue({
    base: "92%",
    md: "60%",
    lg: "420px",
  });

  return (
    <Box position="sticky" top="0" zIndex="1000">
      {/* TOP BAR */}
      <Box
        bg="blue.600"
        color="white"
        py={1.5}
        fontSize="sm"
        textAlign="center"
        fontWeight="500"
      >
        <Text opacity={0.95}>
          Trusted local sellers • Secure payments • Easy returns
        </Text>
      </Box>

      {/* HEADER */}
      <Box
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)"
      >
        {/* ================= MOBILE ================= */}
        <Flex
          display={{ base: "flex", md: "none" }}
          align="center"
          justify="space-between"
          px={4}
          py={3}
          bg="white"
          borderBottom="1px solid"
          borderColor="gray.200"
        >
          <Flex align="center" gap={3} cursor="pointer" onClick={() => router.push("/")}> 
            <Image
              src="/images/logo3.jpg"
              alt="Logo"
              h="36px"
              objectFit="contain"
            />
            <Box>
              <Text fontWeight="bold" fontSize="md">
                Business Sahayata
              </Text>
              <Text fontSize="xs" color="gray.500">
                Marketplace for local sellers
              </Text>
            </Box>
          </Flex>

          <Flex align="center" gap={1}>
            <IconButton
              icon={<FiHeart size={18} />}
              aria-label="Wishlist"
              variant="ghost"
              size="sm"
              color="gray.600"
              onClick={onWishlistOpen}
            />
            <IconButton
              icon={<FiShoppingCart size={18} />}
              aria-label="Cart"
              variant="ghost"
              size="sm"
              color="gray.600"
              onClick={onCartOpen}
            />
            <IconButton
              icon={<HamburgerIcon />}
              aria-label="Menu"
              variant="ghost"
              size="sm"
              color="blue.600"
              onClick={onOpen}
            />
          </Flex>
        </Flex>

        <Box display={{ base: "block", md: "none" }} bg="gray.50" px={4} py={3}>
          <SearchInput />
        </Box>

        {/* ================= MOBILE DRAWER ================= */}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent maxW={drawerWidth}>
            <DrawerCloseButton mt={3} mr={3} />
            <DrawerBody pt={6} px={0}>

              <Box px={4} mb={4}>
                <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={3}>
                  Navigation
                </Text>
                <NavItemsLayout onClose={onClose} />
              </Box>

              <Box px={4}>
                {isMounted && user && (
                  <Box mt={2} borderTop="1px solid" borderColor="gray.100" pt={4}>
                    <Text fontSize="xs" fontWeight="bold" color="gray.400" mb={3} textTransform="uppercase" letterSpacing="wider">
                      My Account
                    </Text>

                    <Flex align="center" gap={3} py={2} cursor="pointer" onClick={() => { onClose(); onCartOpen(); }}>
                      <Icon as={FiShoppingCart} color="blue.500" />
                      <Text fontWeight="500" fontSize="md">Your Cart
                        {cartStore.totalItems > 0 && <span style={{ marginLeft: "4px", fontSize: "0.8em", color: "gray" }}>({cartStore.totalItems})</span>}
                      </Text>
                    </Flex>

                    <Flex align="center" gap={3} py={2} cursor="pointer" onClick={() => { onClose(); onWishlistOpen(); }}>
                      <Icon as={FiHeart} color="red.500" />
                      <Text fontWeight="500" fontSize="md">Your Wishlist</Text>
                    </Flex>

                    <Flex align="center" gap={3} py={2} cursor="pointer" onClick={() => { onClose(); router.push("/account?tab=orders"); }}>
                      <Icon as={FiShoppingBag} color="blue.500" />
                      <Text fontWeight="500" fontSize="md">Your Orders</Text>
                    </Flex>

                    <Flex align="center" gap={3} py={2} cursor="pointer" onClick={() => { onClose(); router.push("/account?tab=addresses"); }}>
                      <Icon as={FiMapPin} color="green.500" />
                      <Text fontWeight="500" fontSize="md">Address Book</Text>
                    </Flex>

                    <Flex align="center" gap={3} py={2} cursor="pointer" onClick={() => { onClose(); router.push("/dashboard/payments"); }}>
                      <Icon as={FiCreditCard} color="purple.500" />
                      <Text fontWeight="500" fontSize="md">Payment Methods</Text>
                    </Flex>

                    {user?.type === "user" && (
                      <Flex align="center" gap={3} py={2} cursor="pointer" onClick={() => { onClose(); router.push("/dashboard"); }}>
                        <Icon as={FiGrid} color="blue.500" />
                        <Text fontWeight="500" fontSize="md">Dashboard</Text>
                      </Flex>
                    )}

                    {user?.type === "seller" && (
                      <Flex align="center" gap={3} py={2} cursor="pointer" onClick={() => { onClose(); router.push("/dashboard"); }}>
                        <Icon as={FiUser} color="orange.500" />
                        <Text fontWeight="500" fontSize="md">Seller Dashboard</Text>
                      </Flex>
                    )}

                    <Box mt={2} pt={2} borderTop="1px dashed" borderColor="gray.200">
                      <Flex align="center" gap={3} py={2} cursor="pointer" onClick={handleLogout}>
                        <Icon as={FiLogOut} color="red.500" />
                        <Text fontWeight="500" fontSize="md" color="red.500">Logout</Text>
                      </Flex>
                    </Box>
                  </Box>
                )}

                {(!isMounted || !user) && (
                  <Box mt={6}>
                    <HeroNavButton />
                  </Box>
                )}
              </Box>

              <Center mt={8}>
                <WhatsAppButton />
              </Center>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* ================= DESKTOP ================= */}
        <Flex
          display={{ base: "none", md: "flex" }}
          align="center"
          justify="space-between"
          px={{ md: 6, lg: 10 }}
          py={3}
          gap={5}
          maxW="8xl"
          mx="auto"
        >
          <Flex align="center" gap={3} cursor="pointer" onClick={() => router.push("/")}> 
            <Image
              src="/images/logo3.jpg"
              alt="Logo"
              h="38px"
              objectFit="contain"
            />
            <Box>
              <Text fontWeight="bold" fontSize="lg">
                Business Sahayata
              </Text>
              <Text fontSize="xs" color="gray.500">
                Trusted local marketplace
              </Text>
            </Box>
          </Flex>

          <Flex align="center" gap={8} flex={1} justify="center">
            <NavItemsLayout />
          </Flex>

          <Flex align="center" gap={3} minW="360px" justify="flex-end">
            <Box w="full" maxW="380px" bg="gray.50" borderRadius="full" px={3} py={2} boxShadow="sm">
              <SearchInput />
            </Box>

            <Flex align="center" gap={1}>
              <IconButton
                icon={<FiHeart size={18} />}
                aria-label="Wishlist"
                size="sm"
                variant="ghost"
                color="gray.600"
                onClick={onWishlistOpen}
              />
              <Box
                position="relative"
                px={1}
                py={1}
                borderRadius="md"
                _hover={{ bg: "gray.50" }}
              >
                <IconButton
                  icon={<FiShoppingCart size={18} />}
                  aria-label="Cart"
                  size="sm"
                  variant="ghost"
                  color="blue.600"
                  onClick={onCartOpen}
                />
                {cartStore.totalItems > 0 && (
                  <Badge
                    position="absolute"
                    top="-2px"
                    right="-2px"
                    bg="blue.600"
                    color="white"
                    borderRadius="full"
                    fontSize="0.7em"
                    px={2}
                  >
                    {cartStore.totalItems}
                  </Badge>
                )}
              </Box>

              {isMounted && user && <NotificationBell />}
            </Flex>

            {isMounted && user ? <UserMenu /> : <HeroNavButton />}
          </Flex>
        </Flex>
      </Box>

      <CartDrawer isOpen={isCartOpen} onClose={onCartClose} />
      <WishlistDrawer isOpen={isWishlistOpen} onClose={onWishlistClose} />
    </Box>
  );
});

export default Header;
