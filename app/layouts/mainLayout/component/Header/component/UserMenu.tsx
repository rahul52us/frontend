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
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import stores from "../../../../../store/stores";
import { motion } from "framer-motion";
import { FiHeart, FiShoppingBag, FiMapPin, FiCreditCard, FiUser, FiLogOut } from "react-icons/fi";

const UserMenu = observer(() => {
    const router = useRouter();
    const { user, logout } = stores.auth;

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const getInitial = () => {
        if (user?.name) return user.name.charAt(0).toUpperCase();
        if (user?.email) return user.email.charAt(0).toUpperCase();
        return "U";
    };

    // Theme-aware colors
    const bgColor = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const secondaryTextColor = useColorModeValue("gray.500", "gray.400");
    const hoverBg = useColorModeValue("gray.100", "gray.700");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    // Animation variants
    const menuVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
    };

    const itemVariants = {
        hover: { scale: 1.02, transition: { duration: 0.2 } },
    };

    return (
        <Box>
            <Menu>
                <MenuButton
                    as={Button}
                    rounded="full"
                    variant="link"
                    cursor="pointer"
                    minW={0}
                    _hover={{ transform: "scale(1.05)", transition: "all 0.2s" }}
                >
                    <Avatar
                        size="sm"
                        name={user?.name || "User"}
                        src={user?.avatar}
                        bg="blue.500"
                        color="white"
                        boxShadow="md"
                        transition="all 0.2s"
                    />
                </MenuButton>
                <MenuList
                    as={motion.div}
                    initial="hidden"
                    animate="visible"
                    variants={menuVariants}
                    zIndex={1001}
                    bg={bgColor}
                    borderColor={borderColor}
                    borderRadius="lg"
                    shadow="xl"
                    py={0}
                    overflow="hidden"
                >
                    <Box px={4} py={3} borderBottomWidth={1} borderColor={borderColor}>
                        <Flex align="center" gap={3}>
                            <Avatar
                                size="md"
                                name={user?.name || "User"}
                                src={user?.avatar}
                                bg="blue.500"
                                color="white"
                            />
                            <Box>
                                <Text fontWeight="bold" fontSize="md" color={textColor}>
                                    {user?.name || "User"}
                                </Text>
                                <Text fontSize="sm" color={secondaryTextColor}>
                                    {user?.email}
                                </Text>
                            </Box>
                        </Flex>
                    </Box>
                    <MenuDivider m={0} />
                    <MenuItem
                        as={motion.div}
                        whileHover="hover"
                        variants={itemVariants}
                        onClick={() => router.push("/dashboard/wishlist")}
                        _hover={{ bg: hoverBg }}
                        px={4}
                        py={3}
                    >
                        <Flex align="center" gap={3}>
                            <Icon as={FiHeart} boxSize={5} color="red.500" />
                            <Text>Your Wishlist</Text>
                        </Flex>
                    </MenuItem>
                    <MenuItem
                        as={motion.div}
                        whileHover="hover"
                        variants={itemVariants}
                        onClick={() => router.push("/dashboard/orders")}
                        _hover={{ bg: hoverBg }}
                        px={4}
                        py={3}
                    >
                        <Flex align="center" gap={3}>
                            <Icon as={FiShoppingBag} boxSize={5} color="blue.500" />
                            <Text>Your Orders</Text>
                        </Flex>
                    </MenuItem>
                    <MenuItem
                        as={motion.div}
                        whileHover="hover"
                        variants={itemVariants}
                        onClick={() => router.push("/dashboard/address")}
                        _hover={{ bg: hoverBg }}
                        px={4}
                        py={3}
                    >
                        <Flex align="center" gap={3}>
                            <Icon as={FiMapPin} boxSize={5} color="green.500" />
                            <Text>Address Book</Text>
                        </Flex>
                    </MenuItem>
                    <MenuItem
                        as={motion.div}
                        whileHover="hover"
                        variants={itemVariants}
                        onClick={() => router.push("/dashboard/payments")}
                        _hover={{ bg: hoverBg }}
                        px={4}
                        py={3}
                    >
                        <Flex align="center" gap={3}>
                            <Icon as={FiCreditCard} boxSize={5} color="purple.500" />
                            <Text>Payment Methods</Text>
                        </Flex>
                    </MenuItem>
                    <MenuItem
                        as={motion.div}
                        whileHover="hover"
                        variants={itemVariants}
                        onClick={() => router.push("/dashboard")}
                        _hover={{ bg: hoverBg }}
                        px={4}
                        py={3}
                    >
                        <Flex align="center" gap={3}>
                            <Icon as={FiUser} boxSize={5} color="orange.500" />
                            <Text>Your Seller Account</Text>
                        </Flex>
                    </MenuItem>
                    <MenuDivider m={0} />
                    <MenuItem
                        as={motion.div}
                        whileHover="hover"
                        variants={itemVariants}
                        onClick={handleLogout}
                        _hover={{ bg: hoverBg }}
                        px={4}
                        py={3}
                    >
                        <Flex align="center" gap={3}>
                            <Icon as={FiLogOut} boxSize={5} color="red.500" />
                            <Text color="red.500">Logout</Text>
                        </Flex>
                    </MenuItem>
                </MenuList>
            </Menu>
        </Box>
    );
});

export default UserMenu;