"use client";

import {
  Box,
  Flex,
  HStack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import useRegisterOverlay from "../../../../hooks/useRegisterOverlay";
import stores from "../../../../store/stores";

// Extracted Sub-Components
import DeliveryLocationButton from "./component/DeliveryLocationButton";
import DesktopSubNav from "./component/DesktopSubNav";
import HeaderActions from "./component/HeaderActions";
import HeaderBrand from "./component/HeaderBrand";
import HeaderModals from "./component/HeaderModals";
import MobileNavDrawer from "./component/MobileNavDrawer";
import SearchInput from "./element/SearchInput";

// Drawers lazy-loaded on demand
const CartDrawer = dynamic(
  () => import("../../../../component/Cart/component/CartDrawer/CartDrawer"),
  { ssr: false }
);

const WishlistDrawer = dynamic(
  () => import("../../../../component/Wishlist/component/WishlistDrawer/WishlistDrawer"),
  { ssr: false }
);

export const Header = observer(() => {
  const router = useRouter();
  const {
    auth: { user, logout },
    cartStore,
  } = stores;

  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const prevTotalItems = useRef(cartStore.totalItems);

  // Mount effect
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Passive scroll listener for sticky elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Micro-interaction bounce on cart count change
  useEffect(() => {
    if (prevTotalItems.current !== cartStore.totalItems && cartStore.totalItems > 0) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 400);
      return () => clearTimeout(timer);
    }
    prevTotalItems.current = cartStore.totalItems;
  }, [cartStore.totalItems]);

  // Sync cart data on authenticated mount
  useEffect(() => {
    if (isMounted && user) {
      cartStore.fetchCart();
    }
  }, [isMounted, user, cartStore]);

  // Modal / Drawer Disclosures
  const { isOpen: isMobileNavOpen, onOpen: onMobileNavOpen, onClose: onMobileNavClose } = useDisclosure();
  const { isOpen: isWishlistOpen, onOpen: onWishlistOpen, onClose: onWishlistClose } = useDisclosure();
  const { isOpen: isLocationModalOpen, onOpen: onLocationModalOpen, onClose: onLocationModalClose } = useDisclosure();
  const { isOpen: isAddAddressOpen, onOpen: onAddAddressOpen, onClose: onAddAddressClose } = useDisclosure();

  // Register mobile overlays for native browser back-button dismissal
  useRegisterOverlay(isMobileNavOpen, onMobileNavClose, "header_nav_drawer");
  useRegisterOverlay(isWishlistOpen, onWishlistClose, "wishlist_drawer");
  useRegisterOverlay(isLocationModalOpen, onLocationModalClose, "location_modal");

  const isAuthenticated = isMounted && Boolean(user);

  const handleLogout = () => {
    logout();
    router.push("/");
    onMobileNavClose();
  };

  // Memoized delivery location
  const userLocation = user?.location;
  const userAddresses = user?.addresses || stores.auth.addresses || [];
  const defaultAddress = userAddresses.find((a: any) => a.isDefault) || userAddresses[0];

  const cleanLocality = useMemo(() => {
    if (userLocation?.area && userLocation?.city) {
      return `${userLocation.area}, ${userLocation.city}`;
    }
    if (userLocation?.city) {
      return `${userLocation.city}, ${userLocation.state || "MP"}`;
    }
    if (defaultAddress?.city) {
      const landmarkOrArea = defaultAddress.addressLine2 || defaultAddress.name || defaultAddress.city;
      return `${landmarkOrArea}, ${defaultAddress.city}`;
    }
    return "Gwalior, Madhya Pradesh";
  }, [userLocation, defaultAddress]);

  const fullDisplayAddress = useMemo(() => {
    if (userLocation?.address) {
      return userLocation.address.replace(/^[A-Z0-9\+]{4,10},\s*/i, "").trim();
    }
    if (defaultAddress) {
      return [
        defaultAddress.line1 || defaultAddress.addressLine1,
        defaultAddress.city,
        defaultAddress.state,
        defaultAddress.postalCode,
      ]
        .filter(Boolean)
        .join(", ");
    }
    return "Gwalior, Madhya Pradesh - 474001";
  }, [userLocation, defaultAddress]);

  const userAvatar =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "User"
    )}&background=2563EB&color=fff&rounded=true&bold=true`;

  // Styling Tokens
  const headerBg = useColorModeValue(
    isScrolled ? "rgba(255, 255, 255, 0.95)" : "white",
    isScrolled ? "rgba(11, 17, 32, 0.95)" : "var(--color-bg)"
  );
  const headerBorder = useColorModeValue("gray.100", "var(--color-border)");

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="1000"
      pt="env(safe-area-inset-top, 0px)"
      bg={headerBg}
      backdropFilter={isScrolled ? "blur(10px)" : "none"}
      boxShadow={isScrolled ? "sm" : "none"}
      borderBottom="1px solid"
      borderColor={headerBorder}
      transition="all 0.2s ease"
    >
      {/* Primary Header Row */}
      <Box px={{ base: 3, md: 8 }} py={{ base: 2, md: 2.5 }}>
        <Flex mx="auto" align="center" justify="space-between" gap={{ base: 2, md: 6 }}>
          {/* Brand + Delivery Location */}
          <HStack spacing={{ base: 2, md: 4 }} flexShrink={0}>
            <HeaderBrand />

            <Box
              display={{ base: "none", md: "block" }}
              h="28px"
              w="1px"
              bg={headerBorder}
            />

            <DeliveryLocationButton
              locality={cleanLocality}
              fullAddress={fullDisplayAddress}
              onClick={onLocationModalOpen}
            />
          </HStack>

          {/* Desktop Search Bar */}
          <Box display={{ base: "none", md: "block" }} flex="1" maxW="680px">
            <Suspense fallback={null}>
              <SearchInput />
            </Suspense>
          </Box>

          {/* User Actions */}
          <HeaderActions
            isAuthenticated={isAuthenticated}
            user={user}
            userAvatar={userAvatar}
            cartTotalItems={isMounted ? cartStore.totalItems : 0}
            cartBounce={cartBounce}
            onCartOpen={cartStore.openCart}
            onWishlistOpen={onWishlistOpen}
            onMobileMenuOpen={onMobileNavOpen}
          />
        </Flex>

        {/* Mobile Search Bar */}
        <Box display={{ base: "block", md: "none" }} mt={2}>
          <Suspense fallback={null}>
            <SearchInput />
          </Suspense>
        </Box>
      </Box>

      {/* Desktop Sub Navigation Bar */}
      <DesktopSubNav />

      {/* Mobile Slide-in Drawer */}
      <MobileNavDrawer
        isOpen={isMobileNavOpen}
        onClose={onMobileNavClose}
        isAuthenticated={isAuthenticated}
        user={user}
        userAvatar={userAvatar}
        cartTotalItems={isMounted ? cartStore.totalItems : 0}
        onCartOpen={cartStore.openCart}
        onWishlistOpen={onWishlistOpen}
        onLogout={handleLogout}
      />

      {/* Cart Drawer */}
      {cartStore.isCartOpen && (
        <CartDrawer isOpen={cartStore.isCartOpen} onClose={cartStore.closeCart} />
      )}

      {/* Wishlist Drawer */}
      {isWishlistOpen && (
        <WishlistDrawer isOpen={isWishlistOpen} onClose={onWishlistClose} />
      )}

      {/* Location Selector & Add Address Modals */}
      <HeaderModals
        isLocationModalOpen={isLocationModalOpen}
        onLocationModalClose={onLocationModalClose}
        isAddAddressOpen={isAddAddressOpen}
        onAddAddressOpen={onAddAddressOpen}
        onAddAddressClose={onAddAddressClose}
      />
    </Box>
  );
});

export default Header;
