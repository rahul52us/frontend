"use client";

import {
  Avatar,
  Badge,
  Box,
  HStack,
  IconButton,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";
import { FiHeart, FiShoppingCart, FiUser } from "react-icons/fi";
import { ThemeModeSwitcher } from "../../../../../theme/ThemeModeSwitcher";
import HeroNavButton from "./HeroNavButton";
import UserMenu from "./UserMenu";

interface HeaderActionsProps {
  isAuthenticated: boolean;
  user: any;
  userAvatar: string;
  cartTotalItems: number;
  cartBounce: boolean;
  onCartOpen: () => void;
  onWishlistOpen: () => void;
  onMobileMenuOpen: () => void;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  isAuthenticated,
  user,
  userAvatar,
  cartTotalItems,
  cartBounce,
  onCartOpen,
  onWishlistOpen,
  onMobileMenuOpen,
}) => {
  const iconColor = useColorModeValue("gray.700", "var(--color-text-primary)");

  return (
    <HStack spacing={{ base: 1, md: 2 }} flexShrink={0}>
      {/* Desktop Theme Switcher */}
      <Box display={{ base: "none", md: "block" }}>
        <ThemeModeSwitcher />
      </Box>

      {/* Wishlist Icon */}
      <Tooltip label="Wishlist" hasArrow openDelay={300}>
        <IconButton
          icon={<FiHeart size={18} />}
          aria-label="Wishlist"
          variant="ghost"
          color={iconColor}
          size="sm"
          borderRadius="full"
          onClick={onWishlistOpen}
          _hover={{ bg: "red.50", color: "red.500" }}
        />
      </Tooltip>

      {/* Cart Icon with Counter Badge */}
      <Tooltip label="Cart" hasArrow openDelay={300}>
        <Box position="relative">
          <motion.div
            animate={cartBounce ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.25 }}
          >
            <IconButton
              icon={<FiShoppingCart size={18} />}
              aria-label="Shopping Cart"
              variant="ghost"
              color={iconColor}
              size="sm"
              borderRadius="full"
              onClick={onCartOpen}
              _hover={{ bg: "var(--color-primary-soft)", color: "var(--color-primary)" }}
            />
          </motion.div>
          {cartTotalItems > 0 && (
            <Badge
              position="absolute"
              top="-2px"
              right="-2px"
              bg="var(--color-primary)"
              color="white"
              borderRadius="full"
              fontSize="10px"
              fontWeight="bold"
              px={1.5}
              minW="18px"
              h="18px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="2px solid white"
              pointerEvents="none"
            >
              {cartTotalItems > 9 ? "9+" : cartTotalItems}
            </Badge>
          )}
        </Box>
      </Tooltip>

      {/* Desktop Auth / User Menu */}
      <Box display={{ base: "none", md: "block" }} pl={1}>
        {isAuthenticated ? <UserMenu /> : <HeroNavButton />}
      </Box>

      {/* Mobile Profile Avatar Shortcut */}
      <Box display={{ base: "block", md: "none" }}>
        {isAuthenticated ? (
          <Avatar
            size="xs"
            name={user?.name}
            src={userAvatar}
            onClick={onMobileMenuOpen}
            cursor="pointer"
            border="1px solid"
            borderColor="gray.200"
          />
        ) : (
          <IconButton
            icon={<FiUser size={18} />}
            aria-label="Account"
            variant="ghost"
            color="gray.700"
            size="sm"
            borderRadius="full"
            onClick={onMobileMenuOpen}
          />
        )}
      </Box>
    </HStack>
  );
};

export default HeaderActions;

