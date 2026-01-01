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
  // Text removed to resolve 'no-unused-vars' error
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FiShoppingCart } from "react-icons/fi";

import CartDrawer from "../../../../component/Cart/component/CartDrawer/CartDrawer";
import WhatsAppButton from "../../../../component/common/whatsApp/whatsAppButton";
import HeroNavButton from "./component/HeroNavButton";
import NavItemsLayout from "./component/NavItemsLayout";
import SearchInput from "./element/SearchInput";

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isCartOpen,
    onOpen: onCartOpen,
    onClose: onCartClose,
  } = useDisclosure();

  const router = useRouter();
  const drawerWidth = useBreakpointValue({
    base: "90%",
    md: "50%",
    lg: "400px",
  });

  return (
    <Box position="sticky" top="0" zIndex="1000">
      {/* 🔝 Top Promo Bar */}
      <Box
        bg="gray.800"
        color="white"
        py={2}
        px={{ base: 4, md: 6 }}
        fontSize={{ base: "xs", md: "sm" }}
        fontWeight="medium"
        textAlign="center"
        _hover={{ bg: "gray.700" }}
      >
        Shop directly from local vendors and grab exclusive deals!
      </Box>

      {/* 🔥 Main Header */}
      <Box bg="white" boxShadow="sm" backdropFilter="blur(12px)">
        {/* 📱 Mobile Header */}
        <Flex
          alignItems="center"
          justify="space-between"
          px={4}
          py={3}
          display={{ base: "flex", md: "none" }}
        >
          {/* Logo */}
          <Image
            src="/images/logo3.jpg"
            alt="Logo"
            h="40px"
            cursor="pointer"
            onClick={() => router.push("/")}
            _hover={{ transform: "scale(1.05)" }}
            transition="0.2s"
          />

          {/* Icons */}
          <Flex gap={2}>
            <IconButton
              icon={<SearchIcon />}
              aria-label="Search"
              variant="ghost"
              color="gray.600"
              _hover={{ color: "orange.500", bg: "orange.50" }}
              onClick={() => router.push("/search")}
            />
            <IconButton
              icon={<HamburgerIcon />}
              aria-label="Menu"
              variant="ghost"
              color="gray.600"
              _hover={{ color: "orange.500", bg: "orange.50" }}
              onClick={onOpen}
            />
          </Flex>
        </Flex>

        {/* 📱 Mobile Drawer */}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay bg="blackAlpha.300" />
          <DrawerContent bg="white" maxW={drawerWidth}>
            <DrawerCloseButton mt={3} mr={3} />
            <DrawerBody pt={6}>
              <Center mb={6}>
                <Image
                  src="/images/logo3.jpg"
                  alt="Logo"
                  h="45px"
                  cursor="pointer"
                  onClick={() => {
                    router.push("/");
                    onClose();
                  }}
                />
              </Center>

              {/* Search */}
              <InputGroup mb={6}>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search products..."
                  borderRadius="full"
                  _focus={{
                    borderColor: "orange.400",
                    boxShadow: "0 0 0 1px orange.400",
                  }}
                />
              </InputGroup>

              <NavItemsLayout onClose={onClose} />

              <Center mt={8}>
                <WhatsAppButton />
              </Center>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* 🖥️ Desktop Header */}
        <Flex
          alignItems="center"
          justify="space-between"
          px={{ md: 6, lg: 10 }}
          py={4}
          display={{ base: "none", md: "flex" }}
        >
          {/* Logo */}
          <Image
            src="/images/logo3.jpg"
            alt="Logo"
            h={{ md: "45px", lg: "55px" }}
            cursor="pointer"
            onClick={() => router.push("/")}
            _hover={{ transform: "scale(1.05)" }}
            transition="0.2s"
          />

          {/* Search */}
          <Flex flex={1} mx={8} maxW="420px">
            <SearchInput />
          </Flex>

          {/* Nav + Actions */}
          <Flex alignItems="center" gap={6}>
            <NavItemsLayout />

            <IconButton
              icon={<FiShoppingCart fontSize="22px" />}
              aria-label="Cart"
              variant="ghost"
              color="gray.700"
              _hover={{ color: "orange.500", bg: "orange.50" }}
              onClick={onCartOpen}
            />

            <HeroNavButton />
          </Flex>
        </Flex>
      </Box>

      {/* 🛒 Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={onCartClose} />
    </Box>
  );
};

export default Header;