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
import NavItemsLayout from "./component/NavItemsLayout";
import SearchInput from "./element/SearchInput";

const Header = observer(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isCartOpen,
    onOpen: onCartOpen,
    onClose: onCartClose,
  } = useDisclosure();
  const router = useRouter();
  const drawerWidth = useBreakpointValue({ base: "90%", md: "50%", lg: "400px" });

  return (
    <Box position="sticky" top="0" zIndex="1000">
      {/* Top Promotional Bar */}
      <Box
        bg="gray.800"
        color="white"
        py={2}
        px={{ base: 4, md: 6 }}
        fontSize={{ base: "xs", md: "sm" }}
        fontWeight="medium"
        textAlign="center"
        transition="background 0.3s ease"
        _hover={{ bg: "gray.700" }}
      >
        <Text as="span" cursor="pointer">
          🛍️ Shop directly from local vendors and grab exclusive deals!
        </Text>
      </Box>

      {/* Main Header */}
      <Box bgGradient="linear(to-b, #5a97c2 10%, #89c2d9 35%, #b0dff7 65%, #f0faff 100%)">
        {/* Mobile Header */}
        <Flex
          alignItems="center"
          justify="space-between"
          px={{ base: 4, md: 6 }}
          py={3}
          display={{ base: "flex", md: "none" }}
          h="4.5rem"
        >
          {/* Logo */}
          <Image
            src="/images/logo3.jpg"
            alt="eCommerce Logo"
            h="40px"
            cursor="pointer"
            onClick={() => router.push("/")}
            transition="transform 0.2s ease"
            _hover={{ transform: "scale(1.05)" }}
            borderRadius="sm"
          />

          {/* Icons */}
          <Flex gap={3}>
            <IconButton
              icon={<SearchIcon fontSize="20px" />}
              aria-label="Search"
              variant="ghost"
              color="gray.600"
              _hover={{ color: "orange.500", bg: "gray.50" }}
              onClick={() => router.push("/search")}
            />
            <IconButton
              icon={<HamburgerIcon fontSize="24px" />}
              onClick={onOpen}
              aria-label="Open menu"
              variant="ghost"
              color="gray.600"
              _hover={{ color: "orange.500", bg: "gray.50" }}
              transition="all 0.2s ease"
            />
          </Flex>
        </Flex>

        {/* ✅ Updated Mobile Drawer */}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay bg="blackAlpha.300" />
          <DrawerContent bg="white" maxW={drawerWidth}>
            <DrawerCloseButton size="md" color="gray.600" mt={3} mr={3} />
            <DrawerBody px={0} pt={4}>
              {/* Logo */}
              <Center mb={6}>
                <Box
                  onClick={() => {
                    router.push("/");
                    onClose();
                  }}
                  cursor="pointer"
                  _hover={{ transform: "scale(1.05)" }}
                  transition="transform 0.2s ease"
                  borderRadius="md"
                  overflow="hidden"
                >
                  <Image
                    src="/images/logo3.jpg"
                    alt="eCommerce Logo"
                    width={120}
                    height={50}
                    style={{ borderRadius: "4px" }}
                  />
                </Box>
              </Center>

              {/* Search Bar */}
              <Box px={4} mb={6}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search products..."
                    borderRadius="full"
                    border="1px solid"
                    borderColor="gray.200"
                    _focus={{
                      borderColor: "orange.400",
                      boxShadow: "0 0 0 1px orange.400",
                    }}
                    aria-label="Search products"
                  />
                </InputGroup>
              </Box>

              {/* Mobile Cart Option - Simple Text Style */}
              <Box px={4} mb={4} display="flex" justifyContent="center">
                <Text
                  fontSize="md"
                  fontWeight="500"
                  // color="gray.600"
                  cursor="pointer"
                  _hover={{ color: "orange.500" }}
                  onClick={() => {
                    onClose();
                    onCartOpen();
                  }}
                >
                  Cart {stores.cartStore.totalItems > 0 && `(${stores.cartStore.totalItems})`}
                </Text>
              </Box>

              {/* Navigation Items */}
              <Box px={4}>
                <NavItemsLayout onClose={onClose} />
              </Box>

              {/* WhatsApp Button */}
              <Center mt={8} mb={4}>
                <WhatsAppButton />
              </Center>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Desktop Header */}
        <Flex
          alignItems="center"
          justify="space-between"
          px={{ md: 6, lg: 10 }}
          py={4}
          display={{ base: "none", md: "flex" }}
        >
          {/* Logo */}
          <Flex alignItems="center" gap={3}>
            <Image
              src="/images/logo3.jpg"
              alt="eCommerce Logo"
              h={{ base: "40px", md: "45px", lg: "55px" }}
              cursor="pointer"
              onClick={() => router.push("/")}
              transition="all 0.3s ease-in-out"
              _hover={{
                transform: "scale(1.05)",
                boxShadow: "md",
                filter: "brightness(1.05)",
              }}
              boxShadow="sm"
              borderRadius="md"
              objectFit="contain"
            />
          </Flex>

          {/* Search Bar */}
          <Flex flex={1} mx={{ md: 6, lg: 10 }} maxW="500px">
            <SearchInput />
          </Flex>

          {/* Navigation and Icons */}
          <Flex alignItems="center" gap={{ md: 4, lg: 6 }}>
            <Flex gap={4}>
              <NavItemsLayout />
            </Flex>
            <Box position="relative">
              <IconButton
                icon={<FiShoppingCart fontSize="24px" />}
                aria-label="Cart"
                variant="ghost"
                color="gray.700"
                size="md"
                _hover={{
                  color: "orange.600",
                  bg: "gray.100",
                  transform: "scale(1.05)",
                }}
                _active={{
                  transform: "scale(0.95)",
                }}
                transition="all 0.2s ease-in-out"
                onClick={onCartOpen}
              />
              {stores.cartStore.totalItems > 0 && (
                <Badge
                  colorScheme="red"
                  borderRadius="full"
                  position="absolute"
                  top="-1px"
                  right="-1px"
                  variant="solid"
                  fontSize="0.8em"
                  px={2}
                  boxShadow="sm"
                >
                  {stores.cartStore.totalItems}
                </Badge>
              )}
            </Box>
            <HeroNavButton />
          </Flex>
        </Flex>
      </Box>
      <CartDrawer isOpen={isCartOpen} onClose={onCartClose} />
    </Box>
  )
});


export default Header;
