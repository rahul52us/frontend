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

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  return (
    <Box shadow="sm">
      {/* Top Bar */}
      <Box
        h={{ lg: "2.5rem", xl: "3rem" }}
        color="white"
        textAlign="center"
        bg="#045B64"
        fontSize={{ base: "sm", lg: "xl" }}
        // fontWeight="bold"
        p={2}
      >
        Get 30% discount on your first therapy session!
      </Box>
      {/* Header for Mobile */}
      <Flex
        alignItems="center"
        justify="space-between"
        px={{ base: 2, md: 6 }}
        pb={1}
        bg="white"
        display={{ base: "flex", md: "none" }}
      >
        {/* <Image src="/images/logo.png" alt="Logo" h="50px" /> */}
        <Image
          src="/images/logo.png"
          alt="Logo"
          h={{ base: "35px", sm: "40px" }}
          cursor="pointer"
          onClick={() => router.push("/")}
          mr="auto"
        />
        <IconButton
          icon={<HamburgerIcon fontSize={"26px"} />}
          onClick={onOpen}
          aria-label="Open menu"
          variant="ghost"
          size={"lg"}
        />
      </Flex>
      {/* Drawer for Mobile Navigation */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            {/* Centered Logo */}
            <Center mt={8} mb={6}>
              <Image
                src="/images/logo.png"
                alt="Logo"
                h="60px"
                onClick={() => router.push("/")}
              />
            </Center>
            {/* Navigation Items */}
            <Box px={4}>
              <NavItemsLayout onClose={onClose} />
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      {/* Header for Desktop */}
      <Flex
        alignItems="center"
        justify="space-around"
        px={{ lg: 5, xl: 8 }}
        py={3}
        display={{ base: "none", md: "flex" }}
      >
        <Image
          src="/images/logo.png"
          alt="Logo"
          h={{ base: "40px", lg: "60px", xl: "70px" }}
          cursor={"pointer"}
          onClick={() => router.push("/")}
        />
        {/* <NavItemsLayout /> */}
        <Flex flex={1} justify="center" pr={2}>
          <NavItemsLayout />
        </Flex>

        <HeroNavButton />
      </Flex>
    </Box>
  );
};

export default Header;
