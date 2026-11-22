"use client";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";
import {
  FiCreditCard,
  FiGrid,
  FiHeart,
  FiHelpCircle,
  FiLogOut,
  FiMapPin,
  FiShoppingBag,
  FiShoppingCart,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";
import WhatsAppButton from "../../../../../component/common/whatsApp/whatsAppButton";
import { ThemeModeSwitcher } from "../../../../../theme/ThemeModeSwitcher";
import HeroNavButton from "./HeroNavButton";
import NavItemsLayout from "./NavItemsLayout";
import QuickAction from "./QuickAction";

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  user: any;
  userAvatar: string;
  cartTotalItems: number;
  onCartOpen: () => void;
  onWishlistOpen: () => void;
  onLogout: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  isAuthenticated,
  user,
  userAvatar,
  cartTotalItems,
  onCartOpen,
  onWishlistOpen,
  onLogout,
}) => {
  const router = useRouter();

  const drawerBg = useColorModeValue("white", "var(--color-surface)");
  const drawerHeaderBg = useColorModeValue("gray.50", "var(--color-surface-alt)");
  const drawerFooterBg = useColorModeValue("gray.50", "var(--color-surface-alt)");
  const drawerBorder = useColorModeValue("gray.100", "var(--color-border)");
  const drawerTextColor = useColorModeValue("gray.800", "var(--color-text-primary)");
  const drawerMutedColor = useColorModeValue("gray.500", "var(--color-text-muted)");

  const greetingName = user?.name?.split(" ")[0] || "There";

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
      <DrawerOverlay backdropFilter="blur(3px)" bg="blackAlpha.400" />
      <DrawerContent borderRightRadius="2xl" overflow="hidden" bg={drawerBg} color={drawerTextColor}>
        <DrawerCloseButton
          top="max(16px, calc(16px + var(--safe-area-top, env(safe-area-inset-top, 0px))))"
          right={4}
          borderRadius="full"
          size="sm"
        />

        {/* Drawer Header Profile Section */}
        <DrawerHeader
          bg={drawerHeaderBg}
          borderBottom="1px solid"
          borderColor={drawerBorder}
          pt="max(20px, calc(20px + var(--safe-area-top, env(safe-area-inset-top, 0px))))"
          pb={4}
          px={5}
        >
          <Flex align="center" gap={3}>
            <Avatar
              size="md"
              name={isAuthenticated ? user?.name : undefined}
              src={isAuthenticated ? userAvatar : undefined}
              bg="blue.600"
              icon={!isAuthenticated ? <FiUser color="white" /> : undefined}
            />
            <Box overflow="hidden">
              <Text fontSize="md" fontWeight="bold" color={drawerTextColor} noOfLines={1}>
                {isAuthenticated ? `Hi, ${greetingName}` : "Welcome"}
              </Text>
              <Text fontSize="xs" color={drawerMutedColor} fontWeight="normal">
                {isAuthenticated
                  ? user?.email || "Explore local treasures"
                  : "Sign in for the best experience"}
              </Text>
            </Box>
          </Flex>

          {!isAuthenticated && (
            <Box mt={4} onClick={onClose}>
              <HeroNavButton />
            </Box>
          )}
        </DrawerHeader>

        {/* Drawer Body Links */}
        <DrawerBody px={3} py={4}>
          <VStack align="stretch" spacing={4}>
            {/* Shopping & Categories */}
            <Box>
              <Text
                px={3}
                mb={1.5}
                fontSize="11px"
                fontWeight="700"
                color="gray.400"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Explore
              </Text>
              <VStack align="stretch" spacing={0.5}>
                <QuickAction
                  icon={FiGrid}
                  label="All Categories"
                  color="var(--color-primary)"
                  onClick={() => {
                    onClose();
                    router.push("/categories");
                  }}
                />
                <QuickAction
                  icon={FiTrendingUp}
                  label="Trending Deals"
                  color="orange.500"
                  onClick={() => {
                    onClose();
                    router.push("/trending");
                  }}
                />
              </VStack>

              <Box pl={3} mt={1}>
                <NavItemsLayout onClose={onClose} />
              </Box>
            </Box>

            <Divider borderColor="gray.100" />

            {/* Account Section */}
            <Box>
              <Text
                px={3}
                mb={1.5}
                fontSize="11px"
                fontWeight="700"
                color="gray.400"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                My Account
              </Text>
              <VStack align="stretch" spacing={0.5}>
                <QuickAction
                  icon={FiShoppingCart}
                  label="Shopping Cart"
                  badge={cartTotalItems > 0 ? cartTotalItems : null}
                  color="var(--color-primary)"
                  onClick={() => {
                    onClose();
                    onCartOpen();
                  }}
                />
                <QuickAction
                  icon={FiHeart}
                  label="Wishlist"
                  color="red.500"
                  onClick={() => {
                    onClose();
                    onWishlistOpen();
                  }}
                />

                {isAuthenticated && (
                  <>
                    <QuickAction
                      icon={FiShoppingBag}
                      label="My Orders"
                      color="var(--color-primary)"
                      onClick={() => {
                        onClose();
                        router.push("/account?tab=orders");
                      }}
                    />
                    <QuickAction
                      icon={FiMapPin}
                      label="Saved Addresses"
                      color="green.500"
                      onClick={() => {
                        onClose();
                        router.push("/account?tab=addresses");
                      }}
                    />
                    <QuickAction
                      icon={FiCreditCard}
                      label="Payment Methods"
                      color="var(--color-primary)"
                      onClick={() => {
                        onClose();
                        router.push("/dashboard/payments");
                      }}
                    />
                    {user?.type === "user" && (
                      <QuickAction
                        icon={FiGrid}
                        label="User Dashboard"
                        color="var(--color-primary)"
                        onClick={() => {
                          onClose();
                          router.push("/dashboard");
                        }}
                      />
                    )}
                    {user?.type === "seller" && (
                      <QuickAction
                        icon={FiUser}
                        label="Seller Dashboard"
                        color="orange.500"
                        onClick={() => {
                          onClose();
                          router.push("/dashboard");
                        }}
                      />
                    )}
                  </>
                )}

                <QuickAction
                  icon={FiHelpCircle}
                  label="Help & Support"
                  color="gray.500"
                  onClick={() => {
                    onClose();
                    router.push("/contact-us");
                  }}
                />
              </VStack>
            </Box>

            <Divider borderColor={drawerBorder} />

            {/* Theme Settings */}
            <Box px={1}>
              <Text
                px={2}
                mb={2}
                fontSize="11px"
                fontWeight="700"
                color={drawerMutedColor}
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Appearance
              </Text>
              <ThemeModeSwitcher />
            </Box>
          </VStack>
        </DrawerBody>

        {/* Drawer Footer */}
        <DrawerFooter
          borderTop="1px solid"
          borderColor={drawerBorder}
          bg={drawerFooterBg}
          px={4}
          py={3}
          justifyContent="space-between"
        >
          <WhatsAppButton />
          {isAuthenticated && (
            <Button
              size="sm"
              variant="ghost"
              colorScheme="red"
              leftIcon={<FiLogOut />}
              onClick={onLogout}
            >
              Logout
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileNavDrawer;

