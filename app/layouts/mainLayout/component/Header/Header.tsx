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
      shadow="sm"
      position="sticky"
      top="0"
      zIndex="1000"
      bg="gray.50" // Subtle background color
      borderBottom="2px solid #E5E7EB" // Softer border color
    >
      {/* Top Bar */}
      <Box
        h={{ base: "2rem", lg: "2.5rem" }}
        color="white"
        textAlign="center"
        bgGradient="linear(to-r, teal.500, blue.500)" // Smooth gradient
        fontSize={{ base: "xs", lg: "md" }}
        fontWeight="medium"
        p={1.5}
      >
        🎉 Enjoy 30% OFF on your first order! Limited Time Only.
      </Box>

      {/* Header for Mobile */}
      <Flex
        alignItems="center"
        justify="space-between"
        px={{ base: 4, md: 6 }}
        py={2}
        bg="white"
        display={{ base: "flex", md: "none" }}
        h="4rem"
      >
        {/* Logo */}
        <Image
          src="/images/logo.png"
          alt="eCommerce Logo"
          h="40px"
          cursor="pointer"
          onClick={() => router.push("/")}
        />

        {/* Hamburger Menu */}
        <IconButton
          icon={<HamburgerIcon fontSize="24px" />}
          onClick={onOpen}
          aria-label="Open menu"
          variant="ghost"
          size="lg"
          _hover={{ bg: "blue.100" }} // Subtle hover effect
        />
      </Flex>

      {/* Drawer for Mobile Navigation */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="white">
          <DrawerCloseButton />
          <DrawerBody>
            {/* Centered Logo */}
            <Center mt={6} mb={4}>
              <Image
                src="/images/logo.png"
                alt="eCommerce Logo"
                h="50px"
                cursor="pointer"
                onClick={() => router.push("/")}
              />
            </Center>

            {/* Navigation Items */}
            <Box px={4}>
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
        px={{ lg: 8 }}
        py={3}
        display={{ base: "none", md: "flex" }}
        bg="white"
      >
        {/* Logo */}
        <Image
          src="/images/logo.png"
          alt="eCommerce Logo"
          h={{ base: "40px", lg: "50px" }}
          cursor="pointer"
          onClick={() => router.push("/")}
        />

        {/* Navigation Items */}
        <Flex flex={1} justify="center">
          <NavItemsLayout />
        </Flex>

        {/* Hero Button */}
        <HeroNavButton />
      </Flex>
    </Box>
  );
};

export default Header;
