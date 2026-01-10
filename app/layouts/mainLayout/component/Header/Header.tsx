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
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useBreakpointValue,
  useDisclosure,
  Badge,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import stores from "../../../../store/stores";
import { useRouter } from "next/navigation";
import { FiShoppingCart } from "react-icons/fi";

import CartDrawer from "../../../../component/Cart/component/CartDrawer/CartDrawer";
import WhatsAppButton from "../../../../component/common/whatsApp/whatsAppButton";
import HeroNavButton from "./component/HeroNavButton";
import UserMenu from "./component/UserMenu";
import NavItemsLayout from "./component/NavItemsLayout";
import SearchInput from "./element/SearchInput";

const Header = observer(() => {
  const router = useRouter();
  const {
    auth: { user },
  } = stores;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isCartOpen,
    onOpen: onCartOpen,
    onClose: onCartClose,
  } = useDisclosure();

  const drawerWidth = useBreakpointValue({
    base: "92%",
    md: "60%",
    lg: "420px",
  });

  return (
    <Box position="sticky" top="0" zIndex="1000">
      {/* TOP BAR (unchanged height) */}
      <Box
        bg="blue.600"
        color="white"
        py={1.5}                 // ⬅ slightly reduced
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
          py={2}                  // ⬅ reduced from 3
        >
          <Image
            src="/images/logo3.jpg"
            alt="Logo"
            h="32px"               // ⬅ smaller & cleaner
            objectFit="contain"
            cursor="pointer"
            onClick={() => router.push("/")}
          />

          <Flex align="center" gap={1}>
            <IconButton
              icon={<SearchIcon />}
              aria-label="Search"
              variant="ghost"
              size="sm"            // ⬅ smaller icon button
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
              <Center mb={5}>
                <Image
                  src="/images/logo3.jpg"
                  alt="Logo"
                  h="42px"
                  objectFit="contain"
                  cursor="pointer"
                  onClick={() => {
                    router.push("/");
                    onClose();
                  }}
                />
              </Center>

              <Box px={4} mb={5}>
                <InputGroup size="sm">
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search products"
                    borderRadius="md"
                    _focus={{
                      borderColor: "blue.500",
                      boxShadow: "0 0 0 1px blue.500",
                    }}
                  />
                </InputGroup>
              </Box>

              <Center mb={4}>
                <Text
                  fontWeight="600"
                  cursor="pointer"
                  onClick={() => {
                    onClose();
                    onCartOpen();
                  }}
                >
                  View Cart
                  {stores.cartStore.totalItems > 0 &&
                    ` (${stores.cartStore.totalItems})`}
                </Text>
              </Center>

              <Box px={4}>
                <NavItemsLayout onClose={onClose} />
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
          py={2.5}                // ⬅ reduced from 4
          gap={5}
        >
          {/* LEFT: LOGO */}
          <Image
            src="/images/logo3.jpg"
            alt="Logo"
            h="32px"               // ⬅ consistent height
            objectFit="contain"
            cursor="pointer"
            onClick={() => router.push("/")}
          />

          {/* CENTER: SEARCH */}
          <Flex
            flex={1}
            maxW="480px"           // ⬅ slightly narrower
            bg="gray.50"
            borderRadius="md"
            px={2}
          >
            <SearchInput />
          </Flex>

          {/* RIGHT: NAV + ACTIONS */}
          <Flex align="center" gap={4}>
            <NavItemsLayout />

            <Box
              position="relative"
              px={1}
              py={1}
              borderRadius="md"
              _hover={{ bg: "gray.50" }}
            >
              <IconButton
                icon={<FiShoppingCart size={18} />}  // ⬅ slightly smaller
                aria-label="Cart"
                size="sm"
                variant="ghost"
                color="blue.600"
                onClick={onCartOpen}
              />
              {stores.cartStore.totalItems > 0 && (
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
                  {stores.cartStore.totalItems}
                </Badge>
              )}
            </Box>

            {user ? <UserMenu /> : <HeroNavButton />}
          </Flex>
        </Flex>
      </Box>

      <CartDrawer isOpen={isCartOpen} onClose={onCartClose} />
    </Box>
  );
});

export default Header;
