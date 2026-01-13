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
import { FiShoppingCart, FiHeart, FiShoppingBag, FiMapPin, FiCreditCard, FiUser, FiLogOut } from "react-icons/fi";

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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isCartOpen,
    onOpen: onCartOpen,
    onClose: onCartClose,
  } = useDisclosure();
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
          py={2}
        >
          <Image
            src="/images/logo3.jpg"
            alt="Logo"
            h="32px"
            objectFit="contain"
            cursor="pointer"
            onClick={() => router.push("/")}
          />

          <Flex align="center" gap={1}>
            <IconButton
              icon={<SearchIcon />}
              aria-label="Search"
              variant="ghost"
              size="sm"
              color="blue.600"
              onClick={() => router.push("/search")}
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

        {/* ================= MOBILE DRAWER ================= */}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent maxW={drawerWidth}>
            <DrawerCloseButton mt={3} mr={3} />
            <DrawerBody pt={6} px={0}>

              <Box px={4}>

                {user && (
                  <Box mt={6} borderTop="1px solid" borderColor="gray.100" pt={2}>
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

                    <Flex align="center" gap={3} py={2} cursor="pointer" onClick={() => { onClose(); router.push("/dashboard/orders"); }}>
                      <Icon as={FiShoppingBag} color="blue.500" />
                      <Text fontWeight="500" fontSize="md">Your Orders</Text>
                    </Flex>

                    <Flex align="center" gap={3} py={2} cursor="pointer" onClick={() => { onClose(); router.push("/dashboard/address"); }}>
                      <Icon as={FiMapPin} color="green.500" />
                      <Text fontWeight="500" fontSize="md">Address Book</Text>
                    </Flex>

                    <Flex align="center" gap={3} py={2} cursor="pointer" onClick={() => { onClose(); router.push("/dashboard/payments"); }}>
                      <Icon as={FiCreditCard} color="purple.500" />
                      <Text fontWeight="500" fontSize="md">Payment Methods</Text>
                    </Flex>

                    <Flex align="center" gap={3} py={2} cursor="pointer" onClick={() => { onClose(); router.push("/dashboard"); }}>
                      <Icon as={FiUser} color="orange.500" />
                      <Text fontWeight="500" fontSize="md">Seller Dashboard</Text>
                    </Flex>

                    <Box mt={2} pt={2} borderTop="1px dashed" borderColor="gray.200">
                      <Flex align="center" gap={3} py={2} cursor="pointer" onClick={handleLogout}>
                        <Icon as={FiLogOut} color="red.500" />
                        <Text fontWeight="500" fontSize="md" color="red.500">Logout</Text>
                      </Flex>
                    </Box>
                  </Box>
                )}

                {!user && (
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
          py={2.5}
          gap={5}
        >
          {/* LEFT: LOGO */}
          <Image
            src="/images/logo3.jpg"
            alt="Logo"
            h="32px"
            objectFit="contain"
            cursor="pointer"
            onClick={() => router.push("/")}
          />

          {/* CENTER: SEARCH */}
          <Flex flex={1} maxW="480px" bg="gray.50" borderRadius="md" px={2}>
            <SearchInput />
          </Flex>

          {/* RIGHT: NAV + ACTIONS */}
          <Flex align="center" gap={3}>
            <NavItemsLayout />

            {/* ✅ Notification (ONLY when logged in) */}
            {user && <NotificationBell count={2} />}

            {/* Cart */}
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

            {user ? <UserMenu /> : <HeroNavButton />}
          </Flex>
        </Flex>
      </Box>

      <CartDrawer isOpen={isCartOpen} onClose={onCartClose} />
      <WishlistDrawer isOpen={isWishlistOpen} onClose={onWishlistClose} />
    </Box>
  );
});

export default Header;