"use client";

import { HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  Image,
  VStack,
  useBreakpointValue,
  useDisclosure,
  Icon,
  chakra,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FiShoppingCart, FiShoppingBag, FiTag, FiTruck, FiBox } from "react-icons/fi";
import { motion } from "framer-motion";

import CartDrawer from "../../../../component/Cart/component/CartDrawer/CartDrawer";
import WhatsAppButton from "../../../../component/common/whatsApp/whatsAppButton";
import HeroNavButton from "./component/HeroNavButton";
import NavItemsLayout from "./component/NavItemsLayout";
import SearchInput from "./element/SearchInput";

const MotionBox = motion(Box);

const LiveBackgroundParticles = () => {
  const icons = [FiShoppingBag, FiTag, FiTruck, FiBox];
  
  const iconColor = useColorModeValue("gray.800", "gray.400");
  const glowColor = useColorModeValue("rgba(0,0,0,0.1)", "rgba(255,255,255,0.05)");

  return (
    <Box position="absolute" inset={0} overflow="hidden" pointerEvents="none" zIndex={0}>
      <Box 
        position="absolute" 
        inset={0} 
        bgGradient={useColorModeValue(
          "radial(circle at 50% -20%, gray.50 0%, white 100%)",
          "radial(circle at 50% -20%, #1A202C 0%, #0A0A0A 100%)"
        )}
      />

      {[...Array(8)].map((_, i) => (
        <MotionBox
          key={i}
          position="absolute"
          initial={{ opacity: 0 }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 15, -15, 0],
            opacity: [0, 0.15, 0],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 10 + i,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.8,
          }}
          style={{
            left: `${(i * 14)}%`,
            top: `${15 + (i % 4) * 10}%`,
          }}
        >
          <Icon 
            as={icons[i % icons.length]} 
            boxSize={14} 
            color={iconColor} 
            filter={`drop-shadow(0 0 8px ${glowColor})`}
          />
        </MotionBox>
      ))}

      <MotionBox
        position="absolute"
        w="400px"
        h="400px"
        rounded="full"
        bg="gray.800"
        filter="blur(100px)"
        opacity={useColorModeValue(0.03, 0.2)}
        animate={{
          x: [-200, 600],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </Box>
  );
};

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isCartOpen, onOpen: onCartOpen, onClose: onCartClose } = useDisclosure();
  const router = useRouter();
  const drawerWidth = useBreakpointValue({ base: "90%", md: "50%", lg: "400px" });

  const headerBg = useColorModeValue("rgba(255, 255, 255, 0.8)", "rgba(15, 15, 15, 0.9)");

  return (
    <Box position="sticky" top="0" zIndex="1000" isolation="isolate">
      <Box
        bg="gray.900"
        color="white"
        py={2}
        px={{ base: 4, md: 6 }}
        fontSize="xs"
        fontWeight="800"
        letterSpacing="1px"
        textTransform="uppercase"
        textAlign="center"
        position="relative"
        overflow="hidden"
      >
        <MotionBox
          position="absolute"
          inset={0}
          bgGradient="linear(to-r, transparent, whiteAlpha.200, transparent)"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
        <chakra.span position="relative">
          Shop directly from local vendors • Exclusive deals inside
        </chakra.span>
      </Box>

      <Box 
        bg={headerBg} 
        boxShadow="0 10px 40px -10px rgba(0,0,0,0.1)" 
        backdropFilter="blur(20px)" 
        position="relative"
        borderBottom="1px solid"
        borderColor={useColorModeValue("gray.100", "whiteAlpha.100")}
      >
        <LiveBackgroundParticles />

        <Flex
          alignItems="center" justify="space-between" px={4} py={3}
          display={{ base: "flex", md: "none" }} position="relative" zIndex={1}
        >
          <Image 
            src="/images/logo3.jpg" 
            alt="Mobile Logo" 
            h="40px" 
            borderRadius="md" 
            onClick={() => router.push("/")} 
          />
          <Flex gap={2}>
            <IconButton icon={<SearchIcon />} aria-label="Search" variant="ghost" rounded="full" onClick={() => router.push("/search")} />
            <IconButton icon={<HamburgerIcon />} aria-label="Menu" variant="solid" colorScheme="gray" rounded="full" onClick={onOpen} />
          </Flex>
        </Flex>

        <Flex
          alignItems="center" justify="space-between" px={{ md: 6, lg: 10 }} py={4}
          display={{ base: "none", md: "flex" }} position="relative" zIndex={1}
        >
          <Image
            src="/images/logo3.jpg"
            alt="Logo"
            h={{ md: "45px", lg: "55px" }}
            borderRadius="xl"
            cursor="pointer"
            onClick={() => router.push("/")}
            _hover={{ transform: "translateY(-2px)" }}
            transition="0.3s"
          />

          <Flex flex={1} mx={8} maxW="420px">
            <SearchInput />
          </Flex>

          <Flex alignItems="center" gap={6}>
            <NavItemsLayout />
            <IconButton
              icon={<FiShoppingCart fontSize="22px" />}
              aria-label="Cart"
              variant="ghost"
              rounded="full"
              _hover={{ bg: "gray.100", transform: "rotate(-10deg)" }}
              onClick={onCartOpen}
            />
            <HeroNavButton />
          </Flex>
        </Flex>
      </Box>

      <CartDrawer isOpen={isCartOpen} onClose={onCartClose} />
      
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay backdropFilter="blur(10px)" />
        <DrawerContent bg="white" maxW={drawerWidth}>
          <DrawerCloseButton rounded="full" />
          <DrawerBody pt={10}>
            <VStack spacing={6}>
              <Image src="/images/logo3.jpg" alt="Drawer Logo" h="50px" />
              <NavItemsLayout onClose={onClose} />
              <WhatsAppButton />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;