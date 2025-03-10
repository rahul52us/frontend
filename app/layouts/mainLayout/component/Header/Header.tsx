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
} from "@chakra-ui/react";
import React from "react";
import NavItemsLayout from "./component/NavItemsLayout";
import HeroNavButton from "./component/HeroNavButton";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import WhatsAppButton from "../../../../component/common/whatsApp/whatsAppButton";

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  return (
    <Box
      position="sticky"
      top="0"
      zIndex="1000"
      bg="white" // Clean, simple white background
      boxShadow="0 2px 8px rgba(0, 0, 0, 0.05)" // Soft shadow for elegance
      borderBottom="1px solid"
      borderColor="gray.100" // Subtle border
    >
      {/* Header for Mobile */}
      <Flex
        alignItems="center"
        justify="space-between"
        px={{ base: 4, md: 6 }}
        py={3}
        display={{ base: "flex", md: "none" }}
        h="4rem"
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
        />

        {/* Hamburger Menu */}
        <IconButton
          icon={<HamburgerIcon fontSize="24px" />}
          onClick={onOpen}
          aria-label="Open menu"
          variant="ghost"
          color="gray.600"
          _hover={{ color: "gray.800", bg: "gray.50" }}
          transition="all 0.2s ease"
        />
      </Flex>

      {/* Drawer for Mobile Navigation */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay bg="rgba(0, 0, 0, 0.2)" />
        <DrawerContent bg="white" maxW="75%">
          <DrawerCloseButton size="md" color="gray.600" mt={3} mr={3} />
          <DrawerBody p={0}>
            {/* Centered Logo */}
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
              />
            </Center>

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

      {/* Header for Desktop */}
      <Flex
        alignItems="center"
        justify="space-between"
        px={{ md: 6, lg: 10 }}
        py={4}
        display={{ base: "none", md: "flex" }}
        bg="white"
      >
        {/* Logo */}
        <Image
          src="/images/logo3.jpg"
          alt="eCommerce Logo"
          h={{ md: "45px", lg: "50px" }}
          cursor="pointer"
          onClick={() => router.push("/")}
          transition="transform 0.2s ease"
          _hover={{ transform: "scale(1.05)" }}
        />

        {/* Navigation Items */}
        <Flex flex={1} justify="center" mx={6}>
          <NavItemsLayout />
        </Flex>

        {/* Hero Button */}
        <HeroNavButton />
      </Flex>
    </Box>
  );
};

export default Header;