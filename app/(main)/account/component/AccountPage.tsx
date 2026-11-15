"use client";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Flex,
  Grid,
  HStack,
  Icon,
  IconButton,
  Text,
  VStack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FaBox,
  FaHome,
  FaShoppingCart,
  FaSignOutAlt,
  FaUser,
  FaWallet,
} from "react-icons/fa";
import { FiArrowLeft, FiChevronRight } from "react-icons/fi";
import ConfirmationModal from "../../../component/common/ConfirmationModal/ConfirmationModal";
import stores from "../../../store/stores";
import { ThemeModeSwitcher } from "../../../theme/ThemeModeSwitcher";
import { AddressesSection } from "./AddressSection/AddressSection";
import CartSection from "./CartSection/CartSection";
import OrdersSection from "./OrderSection/OrderSection";
import { ProfileSection } from "./ProfileSection/ProfileSection";
import SidebarButton from "./SidebarButton/SidebarButton";
import { WalletSection } from "./WalletSection/WalletSection";

const MotionBox = motion(Box);

const VALID_TABS = ["details", "cart", "orders", "addresses", "wallet"] as const;
type TabType = (typeof VALID_TABS)[number];

const SECTION_TITLES: Record<string, string> = {
  details: "Personal Details",
  cart: "Cart",
  orders: "Orders",
  addresses: "Addresses",
  wallet: "Wallet",
};

const AccountPage = observer(() => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Desktop active tab defaults to 'details' if no tab param is present
  const initialUrlTab = searchParams?.get("tab");
  const [activeTab, setActiveTab] = useState<string>(
    initialUrlTab && VALID_TABS.includes(initialUrlTab as TabType)
      ? initialUrlTab
      : "details"
  );

  // Mobile selected section is null when on the main options list
  const [mobileSelectedTab, setMobileSelectedTab] = useState<string | null>(
    initialUrlTab && VALID_TABS.includes(initialUrlTab as TabType)
      ? initialUrlTab
      : null
  );

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Keep state synchronized with URL searchParams (including browser back/forward)
  useEffect(() => {
    const tab = searchParams?.get("tab");
    if (tab === "dashboard") {
      router.replace("/dashboard");
      return;
    }

    if (tab && VALID_TABS.includes(tab as TabType)) {
      setActiveTab(tab);
      setMobileSelectedTab(tab);
    } else {
      setActiveTab("details");
      setMobileSelectedTab(null);
    }
  }, [router, searchParams]);

  // Hoisted theme tokens
  const pageBg = useColorModeValue("var(--color-bg)", "var(--color-bg)");
  const cardBg = useColorModeValue("white", "var(--color-surface)");
  const headerBg = useColorModeValue("rgba(255, 255, 255, 0.95)", "rgba(18, 26, 33, 0.95)");
  const borderColor = useColorModeValue("gray.100", "var(--color-border)");
  const textColor = useColorModeValue("gray.900", "var(--color-text-primary)");
  const mutedText = useColorModeValue("gray.500", "var(--color-text-muted)");
  const accentColor = "var(--color-primary)";
  const activeBorder = "2px solid var(--color-primary)";

  const {
    isOpen: isLogoutOpen,
    onOpen: onLogoutOpen,
    onClose: onLogoutClose,
  } = useDisclosure();

  const { user: authUser, logout, addresses } = stores.auth;
  const { cartStore } = stores;

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const user = {
    ...authUser,
    name: authUser?.name || "User",
    email: authUser?.email || "",
    phone: authUser?.phone || "",
    avatar:
      authUser?.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        authUser?.name || "User"
      )}&background=6B46C1&color=fff&size=128`,
  };

  // Desktop tab navigation
  const handleDesktopTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/account?tab=${tab}`);
  };

  // Mobile navigation: navigate to individual section view
  const handleMobileSelectTab = (tab: string) => {
    setMobileSelectedTab(tab);
    router.push(`/account?tab=${tab}`);
  };

  // Mobile navigation: return to main options list
  const handleMobileBack = () => {
    setMobileSelectedTab(null);
    router.push("/account");
  };

  // Menu items list (shared configuration)
  const menuItems = [
    {
      tab: "details",
      label: "Personal Details",
      subtitle: "Profile info, phone & contact details",
      icon: FaUser,
      iconColor: "purple.600",
      iconBg: useColorModeValue("purple.50", "whiteAlpha.100"),
    },
    {
      tab: "cart",
      label: "Cart",
      subtitle:
        isMounted && cartStore.totalItems > 0
          ? `${cartStore.totalItems} items in your cart`
          : "View items & checkout",
      icon: FaShoppingCart,
      iconColor: "blue.600",
      iconBg: useColorModeValue("blue.50", "whiteAlpha.100"),
      badge:
        isMounted && cartStore.totalItems > 0 ? (
          <Badge
            colorScheme="brand"
            variant="solid"
            fontSize="2xs"
            rounded="full"
            px={2}
            py={0.5}
          >
            {cartStore.totalItems}
          </Badge>
        ) : null,
    },
    {
      tab: "addresses",
      label: "Addresses",
      subtitle:
        addresses?.length > 0
          ? `${addresses.length} saved delivery addresses`
          : "Manage delivery addresses",
      icon: FaHome,
      iconColor: "teal.600",
      iconBg: useColorModeValue("teal.50", "whiteAlpha.100"),
    },
    {
      tab: "orders",
      label: "Orders",
      subtitle: "Track, return and view order history",
      icon: FaBox,
      iconColor: "orange.600",
      iconBg: useColorModeValue("orange.50", "whiteAlpha.100"),
    },
    {
      tab: "wallet",
      label: "Wallet",
      subtitle: "Balance, payments & saved cards",
      icon: FaWallet,
      iconColor: "green.600",
      iconBg: useColorModeValue("green.50", "whiteAlpha.100"),
    },
  ];

  return (
    <Box
      maxW="container.xl"
      mx="auto"
      py={{ base: 3, md: 12 }}
      px={{ base: 3, md: 4 }}
      bg={pageBg}
      minH={{md:"100vh"}}
    >
      {/* ===================================================================
          1. DESKTOP VIEW (Visible on md and larger) - Unchanged Layout & Logic
         =================================================================== */}
      <Box display={{ base: "none", md: "block" }}>
        <Grid templateColumns="320px 1fr" gap={8}>
          {/* Sidebar */}
          <VStack
            spacing={6}
            align="stretch"
            position="sticky"
            top={44}
            h="fit-content"
          >
            <Card borderRadius="2xl" boxShadow="md" bg={cardBg}>
              <CardBody>
                <Flex align="center" gap={4}>
                  <Avatar
                    name={user.name}
                    src={user.avatar || "/placeholder.svg"}
                    size="lg"
                    border={activeBorder}
                    p={0.5}
                    bg="white"
                  />
                  <Box>
                    <Text fontWeight="bold" fontSize="lg" letterSpacing="wide" color={textColor}>
                      {user.name}
                    </Text>
                    <Text fontSize="sm" color={mutedText} mt={1}>
                      {user.phone || user.email}
                    </Text>
                  </Box>
                </Flex>
              </CardBody>
            </Card>

            <Card borderRadius="2xl" boxShadow="lg" py={2} bg={cardBg}>
              <VStack spacing={1} align="stretch" p={2}>
                {menuItems.map(({ label, icon: IconComponent, tab, badge }) => (
                  <SidebarButton
                    key={tab}
                    label={label}
                    icon={<IconComponent size="18px" />}
                    isActive={activeTab === tab}
                    onClick={() => handleDesktopTabChange(tab)}
                    color={accentColor}
                    badge={badge}
                  />
                ))}

                {/* Logout button */}
                <Button
                  variant="ghost"
                  justifyContent="flex-start"
                  h={14}
                  borderRadius="lg"
                  color="red.500"
                  _hover={{ color: "red.600", bg: "red.50" }}
                  leftIcon={<FaSignOutAlt size="18px" />}
                  fontWeight={600}
                  transition="all 0.2s"
                  onClick={onLogoutOpen}
                >
                  Logout
                </Button>
              </VStack>
            </Card>

            {/* Appearance Card */}
            <Card borderRadius="2xl" boxShadow="sm" p={4} bg={cardBg} border="1px solid" borderColor={borderColor}>
              <Text fontSize="xs" fontWeight="700" color={mutedText} textTransform="uppercase" letterSpacing="wider" mb={2.5}>
                Appearance
              </Text>
              <ThemeModeSwitcher size="sm" />
            </Card>
          </VStack>

          {/* Desktop Main Content Card */}
          {activeTab === "cart" ? (
            <CartSection />
          ) : (
            <Card
              borderRadius="2xl"
              boxShadow="lg"
              bg={cardBg}
            >
              <CardBody p={{ base: 4, sm: 6, md: 8 }}>
                {activeTab === "details" && <ProfileSection user={user} />}
                {activeTab === "orders" && <OrdersSection />}
                {activeTab === "addresses" && <AddressesSection />}
                {activeTab === "wallet" && <WalletSection />}
              </CardBody>
            </Card>
          )}
        </Grid>
      </Box>

      {/* ===================================================================
          2. MOBILE NATIVE VIEW (Visible on base / mobile screens only)
         =================================================================== */}
      <Box display={{ base: "block", md: "none" }}>
        {mobileSelectedTab === null ? (
          /* ─── Mobile View 1: Clean Options List ─── */
          <MotionBox
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            pb={4}
          >
            {/* User Profile Card */}
            <Card
              borderRadius="2xl"
              boxShadow="sm"
              border="1px solid"
              borderColor={borderColor}
              bg={cardBg}
              mb={3.5}
            >
              <CardBody p={4}>
                <Flex align="center" gap={3.5}>
                  <Avatar
                    name={user.name}
                    src={user.avatar || "/placeholder.svg"}
                    size="md"
                    border={activeBorder}
                    p={0.5}
                    bg="white"
                  />
                  <Box flex="1" minW={0}>
                    <HStack spacing={2} align="center">
                      <Text
                        fontWeight="700"
                        fontSize="md"
                        color={textColor}
                        noOfLines={1}
                      >
                        {user.name}
                      </Text>
                      <Badge
                        colorScheme="brand"
                        variant="subtle"
                        fontSize="3xs"
                        rounded="md"
                      >
                        Active
                      </Badge>
                    </HStack>
                    <Text fontSize="xs" color={mutedText} noOfLines={1} mt={0.5}>
                      {user.phone || user.email || "Manage your account"}
                    </Text>
                  </Box>
                </Flex>
              </CardBody>
            </Card>

            {/* Section Header */}
            <Text
              fontSize="xs"
              fontWeight="700"
              color={mutedText}
              textTransform="uppercase"
              letterSpacing="wider"
              px={1}
              mb={2}
            >
              Account Settings
            </Text>

            {/* Navigation Options List */}
            <Card
              borderRadius="2xl"
              boxShadow="sm"
              border="1px solid"
              borderColor={borderColor}
              bg={cardBg}
              overflow="hidden"
              mb={4}
            >
              <VStack
                spacing={0}
                align="stretch"
                divider={<Divider borderColor={borderColor} />}
              >
                {menuItems.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <Flex
                      key={item.tab}
                      as="button"
                      type="button"
                      w="full"
                      align="center"
                      justify="space-between"
                      px={4}
                      py={3.5}
                      transition="all 0.15s ease"
                      _hover={{ bg: useColorModeValue("gray.50", "whiteAlpha.50") }}
                      _active={{
                        bg: useColorModeValue("purple.50", "whiteAlpha.100"),
                        transform: "scale(0.995)",
                      }}
                      onClick={() => handleMobileSelectTab(item.tab)}
                      textAlign="left"
                    >
                      <HStack spacing={3.5} flex="1" minW={0}>
                        <Flex
                          w="40px"
                          h="40px"
                          rounded="xl"
                          bg={item.iconBg}
                          color={item.iconColor}
                          align="center"
                          justify="center"
                          flexShrink={0}
                        >
                          <Icon as={ItemIcon} boxSize={4} />
                        </Flex>

                        <Box flex="1" minW={0}>
                          <Text
                            fontWeight="600"
                            fontSize="sm"
                            color={textColor}
                            lineHeight="1.2"
                          >
                            {item.label}
                          </Text>
                          <Text
                            fontSize="2xs"
                            color={mutedText}
                            noOfLines={1}
                            mt={0.5}
                          >
                            {item.subtitle}
                          </Text>
                        </Box>
                      </HStack>

                      <HStack spacing={2} flexShrink={0}>
                        {item.badge}
                        <Icon as={FiChevronRight} color="gray.400" boxSize={4} />
                      </HStack>
                    </Flex>
                  );
                })}
              </VStack>
            </Card>

            {/* Theme Appearance Option */}
            <Card
              borderRadius="2xl"
              boxShadow="sm"
              border="1px solid"
              borderColor={borderColor}
              bg={cardBg}
              p={3.5}
              mb={3.5}
            >
              <Flex align="center" justify="space-between" wrap="wrap" gap={2}>
                <Box>
                  <Text fontWeight="600" fontSize="sm" color={textColor}>
                    Theme Mode
                  </Text>
                  <Text fontSize="2xs" color={mutedText}>
                    Light, dark or system preference
                  </Text>
                </Box>
                <ThemeModeSwitcher size="sm" />
              </Flex>
            </Card>

            {/* Logout Option */}
            <Card
              borderRadius="2xl"
              boxShadow="sm"
              border="1px solid"
              borderColor={useColorModeValue("red.100", "red.900")}
              bg={useColorModeValue("red.50", "rgba(239, 68, 68, 0.08)")}
              as="button"
              type="button"
              w="full"
              onClick={onLogoutOpen}
              transition="all 0.15s ease"
              _active={{ transform: "scale(0.99)" }}
            >
              <CardBody p={3.5}>
                <Flex align="center" justify="space-between">
                  <HStack spacing={3}>
                    <Flex
                      w="36px"
                      h="36px"
                      rounded="xl"
                      bg={useColorModeValue("red.100", "red.900")}
                      color="red.600"
                      align="center"
                      justify="center"
                    >
                      <Icon as={FaSignOutAlt} boxSize={4} />
                    </Flex>
                    <Box textAlign="left">
                      <Text fontWeight="700" fontSize="sm" color="red.600">
                        Logout
                      </Text>
                      <Text
                        fontSize="3xs"
                        color={useColorModeValue("red.400", "red.300")}
                      >
                        Sign out of this device
                      </Text>
                    </Box>
                  </HStack>
                  <Icon as={FiChevronRight} color="red.400" boxSize={4} />
                </Flex>
              </CardBody>
            </Card>
          </MotionBox>
        ) : (
          /* ─── Mobile View 2: Separate Full-Page Section with Native Back Button ─── */
          <Box>
            {/* Top Navigation Bar with Back Button */}
            <Flex
              position="sticky"
              top={0}
              zIndex={20}
              bg={headerBg}
              backdropFilter="blur(12px)"
              borderBottom="1px solid"
              borderColor={borderColor}
              py={2.5}
              px={2}
              align="center"
              justify="space-between"
              mb={3}
              rounded="xl"
              boxShadow="0 1px 4px rgba(0,0,0,0.03)"
            >
              <HStack spacing={2} align="center">
                <IconButton
                  aria-label="Back to Account Options"
                  icon={<Icon as={FiArrowLeft} boxSize={5} />}
                  variant="ghost"
                  rounded="full"
                  size="sm"
                  onClick={handleMobileBack}
                  color={textColor}
                />
                <Text fontSize="md" fontWeight="800" color={textColor}>
                  {SECTION_TITLES[mobileSelectedTab] || "Account"}
                </Text>
              </HStack>

              {mobileSelectedTab === "cart" && isMounted && cartStore.totalItems > 0 && (
                <Badge
                  colorScheme="brand"
                  variant="subtle"
                  rounded="full"
                  px={2.5}
                  py={0.5}
                  fontSize="2xs"
                >
                  {cartStore.totalItems} items
                </Badge>
              )}
            </Flex>

            {/* Selected Section Rendered as Separate Full-Page View */}
            <MotionBox
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              pb={4}
            >
              {mobileSelectedTab === "details" && <ProfileSection user={user} />}
              {mobileSelectedTab === "cart" && <CartSection />}
              {mobileSelectedTab === "orders" && <OrdersSection />}
              {mobileSelectedTab === "addresses" && <AddressesSection />}
              {mobileSelectedTab === "wallet" && <WalletSection />}
            </MotionBox>
          </Box>
        )}
      </Box>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={isLogoutOpen}
        onClose={onLogoutClose}
        onConfirm={handleLogout}
        title="Logout Confirmation"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        confirmButtonProps={{ colorScheme: "red" }}
      />
    </Box>
  );
});

export default AccountPage;
