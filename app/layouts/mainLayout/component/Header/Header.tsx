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
    <Box shadow="sm" position="sticky" top="0" zIndex="1000" bg="white">

      {/* Top Bar */}
      <Box
        h={{ lg: "2rem", xl: "2.5rem" }} // Reduce height
        color="white"
        textAlign="center"
        bg="#045B64"
        fontSize={{ base: "xs", lg: "lg" }} // Reduce font size
        p={1} // Reduce padding
      >
        Get 30% discount on your first therapy session!
      </Box>

      {/* Header for Mobile */}
      <Flex
        alignItems="center"
        justify="space-between"
        px={{ base: 2, md: 6 }}
        py={1} // Reduced padding
        bg="white"
        display={{ base: "flex", md: "none" }}
        h="4rem" // Reduced height
      >
        <Image
          src="/images/logo.png"
          alt="best child psychologist in noida"
          h={{ base: "43px", sm: "48px" }}  // Reduced logo size
          cursor="pointer"
          onClick={() => router.push("/")}
          mr="auto"
        />
        <Flex gap={2}>

        <IconButton
          icon={<HamburgerIcon fontSize={"22px"} />} // Reduced icon size
          onClick={onOpen}
          aria-label="Open menu"
          variant="ghost"
          size={"md"} // Adjusted size
          />
          </Flex>
      </Flex>

      {/* Drawer for Mobile Navigation */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            {/* Centered Logo */}
            <Center mt={6} mb={4}>
              <Image
                src="/images/logo.png"
                alt="Mental Health Clinic In Noida"
                h="50px" // Reduced logo size in mobile menu
                onClick={() => router.push("/")}
              />
            </Center>
            {/* Navigation Items */}
            <Box px={4}>
              <NavItemsLayout onClose={onClose} />
            </Box>
            <Center my={4}>
            <WhatsAppButton/>
            </Center>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Header for Desktop */}
      <Flex
        alignItems="center"
        justify="space-between"
        px={{ lg: 5, xl: 8 }}
        py={2.5} // Reduced padding
        display={{ base: "none", md: "flex" }}
      // h="4rem" // Reduced height
      >
        <Image
          src="/images/logo.png"
          alt="Mental Health Doctor In Noida"
          h={{ base: "35px", lg: "50px", xl: "60px" }} // Reduced logo size
          cursor={"pointer"}
          onClick={() => router.push("/")}
        />
        <Flex flex={1} justify="center" pr={2}>
          <NavItemsLayout />
        </Flex>
        <HeroNavButton />
      </Flex>
    </Box>
  );
};

export default Header;
