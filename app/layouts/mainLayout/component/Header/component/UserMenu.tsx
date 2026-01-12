"use client";

import {
  Avatar,
  Box,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Button,
  Flex,
  useColorModeValue,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import stores from "../../../../../store/stores";
import { motion } from "framer-motion";
import WishlistDrawer from "../../../../../component/Wishlist/component/WishlistDrawer/WishlistDrawer";
import {
  FiHeart,
  FiShoppingBag,
  FiMapPin,
  FiCreditCard,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

const MotionMenuItem = motion(MenuItem);

const UserMenu = observer(() => {
  const router = useRouter();
  const { user, logout } = stores.auth;
  const {
    isOpen: isWishlistOpen,
    onOpen: onWishlistOpen,
    onClose: onWishlistClose
  } = useDisclosure();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const bg = useColorModeValue(
    "rgba(255,255,255,0.85)",
    "rgba(26,32,44,0.9)"
  );
  const border = useColorModeValue("gray.200", "gray.700");
  const text = useColorModeValue("gray.800", "white");
  const muted = useColorModeValue("gray.500", "gray.400");
  const hoverBg = useColorModeValue("gray.100", "gray.700");

  const menuVariants = {
    hidden: { opacity: 0, y: -6, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  const renderItem = (
    label: string,
    icon: any,
    color: string,
    onClick: () => void
  ) => (
    <MotionMenuItem
      onClick={onClick}
      whileHover={{ x: 4 }}
      px={4}
      py={3}
      bg="transparent"
      _hover={{ bg: hoverBg }}
    >
      <Flex align="center" gap={3} w="full">
        <Flex
          w="36px"
          h="36px"
          align="center"
          justify="center"
          rounded="full"
          bg={`${color}.50`}
        >
          <Icon as={icon} color={`${color}.500`} boxSize={5} />
        </Flex>
        <Text fontWeight="500">{label}</Text>
      </Flex>
    </MotionMenuItem>
  );

  return (
    <>
      <Menu placement="bottom-end">
        <MenuButton
          as={Button}
          variant="ghost"
          rounded="full"
          px={0}
          _hover={{ transform: "scale(1.05)" }}
        >
          <Avatar
            size="sm"
            name={user?.name || "User"}
            src={user?.avatar}
            bg="blue.500"
            color="white"
            boxShadow="md"
          />
        </MenuButton>

        <MenuList
          as={motion.div}
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          minW="280px"
          bg={bg}
          backdropFilter="blur(12px)"
          border="1px solid"
          borderColor={border}
          borderRadius="xl"
          boxShadow="2xl"
          overflow="hidden"
          p={0}
        >
          {/* Profile Header */}
          <Box px={5} py={4} borderBottom="1px solid" borderColor={border}>
            <Flex align="center" gap={4}>
              <Avatar
                size="md"
                name={user?.name || "User"}
                src={user?.avatar}
                bg="blue.500"
              />
              <Box>
                <Text fontWeight="bold" color={text}>
                  {user?.name || "User"}
                </Text>
                <Text fontSize="sm" color={muted}>
                  {user?.email}
                </Text>
              </Box>
            </Flex>
          </Box>

          {/* Menu Items */}
          {renderItem("Your Wishlist", FiHeart, "red", onWishlistOpen)}
          {renderItem("Your Orders", FiShoppingBag, "blue", () =>
            router.push("/dashboard/orders")
          )}
          {renderItem("Address Book", FiMapPin, "green", () =>
            router.push("/dashboard/address")
          )}
          {renderItem("Payment Methods", FiCreditCard, "purple", () =>
            router.push("/dashboard/payments")
          )}
          {renderItem("Seller Dashboard", FiUser, "orange", () =>
            router.push("/dashboard")
          )}

          <MenuDivider m={0} />

          {/* Logout */}
          <MotionMenuItem
            onClick={handleLogout}
            whileHover={{ x: 4 }}
            px={4}
            py={3}
            _hover={{ bg: "red.50" }}
          >
            <Flex align="center" gap={3}>
              <Flex
                w="36px"
                h="36px"
                align="center"
                justify="center"
                rounded="full"
                bg="red.50"
              >
                <Icon as={FiLogOut} color="red.500" boxSize={5} />
              </Flex>
              <Text color="red.500" fontWeight="600">
                Logout
              </Text>
            </Flex>
          </MotionMenuItem>
        </MenuList>
      </Menu>
      <WishlistDrawer isOpen={isWishlistOpen} onClose={onWishlistClose} />
    </>
  );
});

export default UserMenu;
