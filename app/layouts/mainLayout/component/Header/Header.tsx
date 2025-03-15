"use client";
import {
  Box,
  Flex,
  Image,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Center,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import React from "react";
import NavItemsLayout from "./component/NavItemsLayout";
import HeroNavButton from "./component/HeroNavButton";
import { HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import WhatsAppButton from "../../../../component/common/whatsApp/whatsAppButton";
import { BsShop } from "react-icons/bs";

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

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
<Text as="span">🛍️ Shop directly from local vendors and grab exclusive deals!</Text>
</Box>

      {/* Main Header */}
      <Box
        bg="white"
        boxShadow="0 2px 12px rgba(0, 0, 0, 0.06)"
        borderBottom="1px solid"
        borderColor="gray.100"
      >
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

        {/* Drawer for Mobile Navigation */}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay bg="rgba(0, 0, 0, 0.2)" />
          <DrawerContent bg="white" maxW="80%">
            <DrawerCloseButton size="md" color="gray.600" mt={3} mr={3} />
            <DrawerBody p={0}>
              {/* Logo */}
              <Center mt={6} mb={6}>
                <Image
                  src="/images/logo3.jpg"
                  alt="eCommerce Logo"
                  h="50px"
                  cursor="pointer"
                  onClick={() => {
                    router.push("/");
                    onClose();
                  }}
                  transition="transform 0.2s ease"
                  _hover={{ transform: "scale(1.1)" }}
                  borderRadius="sm"
                />
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
                    borderColor="gray.200"
                    _focus={{ borderColor: "orange.400", boxShadow: "0 0 0 1px orange.400" }}
                  />
                </InputGroup>
              </Box>

              {/* Navigation Items */}
              <Box px={4} py={2}>
                <NavItemsLayout onClose={onClose} />
              </Box>

              {/* WhatsApp Button */}
              <Center my={6}>
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
              h={{ md: "45px", lg: "55px" }}
              cursor="pointer"
              onClick={() => router.push("/")}
              transition="transform 0.2s ease"
              _hover={{ transform: "scale(1.05)" }}
              borderRadius="sm"
            />
          </Flex>

          {/* Search Bar */}
          <Flex flex={1} mx={{ md: 6, lg: 10 }} maxW="500px">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search products, categories..."
                borderRadius="full"
                borderColor="gray.200"
                bg="gray.50"
                _focus={{ borderColor: "orange.400", boxShadow: "0 0 0 1px orange.400", bg: "white" }}
              />
            </InputGroup>
          </Flex>

          {/* Navigation and Icons */}
          <Flex alignItems="center" gap={{ md: 4, lg: 6 }}>
            <Flex gap={4}>
              <NavItemsLayout />
            </Flex>
            <IconButton
              icon={<BsShop fontSize="24px" />}
              aria-label="Cart"
              variant="ghost"
              color="gray.600"
              _hover={{ color: "orange.500", bg: "gray.50" }}
              onClick={() => router.push("/cart")}
            />
            <HeroNavButton />
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default Header;