"use client";

import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Progress,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  FaHouse,
  FaLocationDot,
  FaPhone,
  FaPlus,
} from "react-icons/fa6";
import {
  FiArrowRight,
  FiCheck,
  FiHeadphones,
  FiLock,
  FiMinus,
  FiPlus,
  FiRotateCcw,
  FiShield,
  FiShoppingBag,
  FiTrash2,
} from "react-icons/fi";
import { IoReceiptOutline } from "react-icons/io5";

import AddressModal from "../../../../component/Cart/component/DeliveryAddressModal/DelivaryAddressModal";
import ConfirmationModal from "../../../../component/common/ConfirmationModal/ConfirmationModal";
import stores from "../../../../store/stores";

const FREE_SHIPPING_THRESHOLD = 499;
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80";

/* -------------------------------------------------------------------------- */
/*  Exact Inline Illustrations matching Reference Design                      */
/* -------------------------------------------------------------------------- */

// Delivery Truck Illustration with teal motion lines & salmon cab
const DeliveryTruckIllustration = memo(() => (
  <Box flexShrink={0}>
    <svg
      width="72"
      height="36"
      viewBox="0 0 72 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Wind / speed motion lines */}
      <path d="M4 14H18" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" />
      <path d="M1 20H13" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 26H16" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" />
      {/* Top energy rays */}
      <path d="M60 5L62 1" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
      <path d="M65 8L69 7" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
      {/* Truck Cargo Box */}
      <rect x="22" y="8" width="28" height="20" rx="4" fill="#FCA5A5" />
      {/* Truck Cabin */}
      <path
        d="M50 14H58C59.2 14 60.2 14.8 60.5 16L62.2 21.5V28H50V14Z"
        fill="#F87171"
      />
      {/* Window */}
      <path d="M52 16H56.5L58 21.5H52V16Z" fill="#FFFFFF" opacity="0.9" />
      {/* Front Bumper */}
      <rect x="61" y="24" width="4" height="3" rx="1.5" fill="#334155" />
      {/* Wheels */}
      <circle cx="31" cy="28" r="4.5" fill="#1E293B" />
      <circle cx="31" cy="28" r="2" fill="#E2E8F0" />
      <circle cx="55" cy="28" r="4.5" fill="#1E293B" />
      <circle cx="55" cy="28" r="2" fill="#E2E8F0" />
    </svg>
  </Box>
));
DeliveryTruckIllustration.displayName = "DeliveryTruckIllustration";

// House Illustration for Delivery Address Card
const HouseIllustration = memo(() => (
  <Box
    position="absolute"
    right="8px"
    bottom="6px"
    pointerEvents="none"
    userSelect="none"
    opacity={{ base: 0.85, sm: 1 }}
  >
    <svg
      width="72"
      height="54"
      viewBox="0 0 72 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Soft ground curve */}
      <path d="M0 48C14 44 38 43 72 48V54H0V48Z" fill="#FCE7E7" />
      {/* Left Tree */}
      <circle cx="11" cy="38" r="8" fill="#0D9488" opacity="0.85" />
      <rect x="10" y="42" width="2.5" height="7" rx="1" fill="#78350F" />
      {/* Right Tree */}
      <circle cx="63" cy="38" r="7" fill="#0D9488" opacity="0.8" />
      <rect x="62" y="42" width="2" height="7" rx="1" fill="#78350F" />
      {/* House Main Body */}
      <rect
        x="21"
        y="26"
        width="34"
        height="23"
        rx="2"
        fill="#FFFFFF"
        stroke="#E2E8F0"
        strokeWidth="1"
      />
      {/* Roof */}
      <path d="M17 27L38 12L59 27H17Z" fill="#EF4444" />
      {/* Chimney */}
      <rect x="48" y="16" width="4.5" height="8" fill="#B91C1C" rx="1" />
      {/* Door */}
      <rect x="34" y="37" width="8" height="12" rx="1" fill="var(--color-primary)" />
      {/* Windows */}
      <rect x="25" y="31" width="6" height="6" rx="1" fill="#38BDF8" />
      <rect x="45" y="31" width="6" height="6" rx="1" fill="#38BDF8" />
    </svg>
  </Box>
));
HouseIllustration.displayName = "HouseIllustration";

/* -------------------------------------------------------------------------- */
/*  Subcomponent: CartItemCard                                                */
/* -------------------------------------------------------------------------- */

interface CartItemCardProps {
  item: any;
  cSurfaceElevated: string;
  cBorderLight: string;
  cPrimary: string;
  cBorder: string;
  cSurface: string;
  cText: string;
  cBannerBg: string;
  cPrimarySoft: string;
  bannerBorderTeal: string;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
}

const CartItemCard = memo(({
  item,
  cSurfaceElevated,
  cBorderLight,
  cPrimary,
  cBorder,
  cSurface,
  cText,
  cBannerBg,
  cPrimarySoft,
  bannerBorderTeal,
  onRemove,
  onUpdateQuantity,
}: CartItemCardProps) => {
  const id = item.product._id || item.product.id;
  const image =
    item.product.image ||
    (Array.isArray(item.product.images) ? item.product.images[0] : "") ||
    FALLBACK_IMAGE;
  const price = Number(item.product.discountPrice ?? item.product.price) || 0;
  const title = item.product.name || item.product.title || "Product";

  const handleDecrease = useCallback(() => {
    if (item.quantity <= 1) {
      onRemove(id);
    } else {
      onUpdateQuantity(id, item.quantity - 1);
    }
  }, [id, item.quantity, onRemove, onUpdateQuantity]);

  const handleIncrease = useCallback(() => {
    onUpdateQuantity(id, item.quantity + 1);
  }, [id, item.quantity, onUpdateQuantity]);

  const handleRemove = useCallback(() => {
    onRemove(id);
  }, [id, onRemove]);

  return (
    <Box
      bg={cSurfaceElevated}
      backdropFilter="auto"
      backdropBlur="10px"
      border="1px solid"
      borderColor={cBorderLight}
      borderRadius="16px"
      p={{ base: 3.5, sm: 4 }}
      boxShadow="0 2px 8px rgba(0, 0, 0, 0.02)"
      transition="all 0.15s ease"
      _hover={{ borderColor: cPrimary }}
    >
      <Flex align="center" justify="space-between" gap={{ base: 3, sm: 4 }}>
        {/* Product Image + Details */}
        <HStack spacing={{ base: 3, sm: 4 }} flex="1" minW={0} align="center">
          {/* Image */}
          <Box
            boxSize={{ base: "64px", sm: "74px" }}
            borderRadius="14px"
            overflow="hidden"
            border="1px solid"
            borderColor={cBorder}
            bg={cSurface}
            flexShrink={0}
          >
            <Image
              src={image}
              fallbackSrc={FALLBACK_IMAGE}
              alt={title}
              w="full"
              h="full"
              objectFit="cover"
              loading="lazy"
              decoding="async"
            />
          </Box>

          {/* Title & Bold Teal Price */}
          <Box flex="1" minW={0}>
            <Text
              fontWeight="700"
              fontSize={{ base: "sm", sm: "15px" }}
              color={cText}
              noOfLines={2}
              lineHeight="1.3"
            >
              {title}
            </Text>

            <Text
              fontWeight="800"
              fontSize={{ base: "md", sm: "18px" }}
              color={cPrimary}
              mt={1}
              letterSpacing="-0.01em"
            >
              ₹{price}
            </Text>
          </Box>
        </HStack>

        {/* Right: Trash Icon (Top) + Mint Quantity Stepper (Bottom) */}
        <Flex
          direction="column"
          align="flex-end"
          justify="space-between"
          minH={{ base: "64px", sm: "74px" }}
          flexShrink={0}
        >
          {/* Delete Trash Icon */}
          <IconButton
            aria-label="Remove item"
            icon={<Icon as={FiTrash2} boxSize={4} />}
            size="xs"
            variant="ghost"
            color="#94A3B8"
            _hover={{ color: "#E53E3E", bg: cBannerBg }}
            onClick={handleRemove}
          />

          {/* Mint Quantity Pill Stepper */}
          <HStack
            spacing={0}
            bg={cPrimarySoft}
            border="1px solid"
            borderColor={bannerBorderTeal}
            borderRadius="full"
            h="32px"
            px={1}
            align="center"
          >
            <IconButton
              aria-label="Decrease quantity"
              icon={<Icon as={FiMinus} boxSize={3.5} strokeWidth={3} />}
              size="xs"
              variant="ghost"
              color={cPrimary}
              _hover={{ bg: "whiteAlpha.600" }}
              borderRadius="full"
              boxSize="24px"
              minW="24px"
              onClick={handleDecrease}
            />

            <Text
              px={2}
              minW="22px"
              textAlign="center"
              fontSize="13px"
              fontWeight="800"
              color={cText}
            >
              {item.quantity}
            </Text>

            <IconButton
              aria-label="Increase quantity"
              icon={<Icon as={FiPlus} boxSize={3.5} strokeWidth={3} />}
              size="xs"
              variant="ghost"
              color={cPrimary}
              _hover={{ bg: "whiteAlpha.600" }}
              borderRadius="full"
              boxSize="24px"
              minW="24px"
              onClick={handleIncrease}
            />
          </HStack>
        </Flex>
      </Flex>
    </Box>
  );
});
CartItemCard.displayName = "CartItemCard";

/* -------------------------------------------------------------------------- */
/*  Main Cart Section Component                                               */
/* -------------------------------------------------------------------------- */

const CartSection = observer(() => {
  const { cartStore, auth } = stores;
  const router = useRouter();
  const toast = useToast();

  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const {
    isOpen: isAddressOpen,
    onOpen: onAddressOpen,
    onClose: onAddressClose,
  } = useDisclosure();

  useEffect(() => {
    if (auth.token && auth.addresses.length === 0) {
      auth.fetchAddresses();
    }
  }, [auth]);

  const addresses = useMemo(() => auth.addresses || [], [auth.addresses]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find((a: any) => a.isDefault);
      setSelectedAddress(
        defaultAddr
          ? defaultAddr._id || defaultAddr.id
          : addresses[0]._id || addresses[0].id
      );
    }
  }, [addresses, selectedAddress]);

  const handleAddNewAddress = useCallback(async (newAddress: any) => {
    try {
      const res = await auth.addAddress(newAddress);
      await auth.fetchAddresses();
      if (res?.data?._id || res?.data?.id) {
        setSelectedAddress(res.data._id || res.data.id);
      }
      toast({
        title: "Address saved",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Failed to save address",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [auth, toast]);

  const handleUpdateAddress = useCallback(async (id: string, data: any) => {
    try {
      await auth.updateAddress(id, data);
      await auth.fetchAddresses();
    } catch {}
  }, [auth]);

  const handleDeleteAddress = useCallback(async (id: string) => {
    try {
      await auth.deleteAddress(id);
      await auth.fetchAddresses();
      if (selectedAddress === id) setSelectedAddress("");
    } catch {}
  }, [auth, selectedAddress]);

  const handleClearCart = useCallback(() => {
    cartStore.clearCart();
    setIsClearModalOpen(false);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  }, [cartStore, toast]);

  const handleRemoveItem = useCallback((id: string) => {
    cartStore.removeFromCart(id);
  }, [cartStore]);

  const handleUpdateItemQuantity = useCallback((id: string, qty: number) => {
    cartStore.updateQuantity(id, qty);
  }, [cartStore]);

  const handleNavigateProducts = useCallback(() => {
    router.push("/products");
  }, [router]);

  const handleNavigateCheckout = useCallback(() => {
    router.push("/checkout");
  }, [router]);

  const handleOpenClearModal = useCallback(() => {
    setIsClearModalOpen(true);
  }, []);

  const handleCloseClearModal = useCallback(() => {
    setIsClearModalOpen(false);
  }, []);

  const handleSelectAddress = useCallback((id: string) => {
    setSelectedAddress(id);
  }, []);

  const subtotal = useMemo(() => {
    return cartStore.cartItems.reduce((sum, item) => {
      if (!item.product) return sum;
      const price = Number(item.product.discountPrice ?? item.product.price) || 0;
      return sum + price * (item.quantity || 1);
    }, 0);
  }, [cartStore.cartItems]);

  const validCartItems = useMemo(() => {
    return cartStore.cartItems.filter((item) => Boolean(item.product));
  }, [cartStore.cartItems]);

  const isFreeDelivery = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const deliveryFee = isFreeDelivery ? 0 : 40;
  const grandTotal = subtotal + deliveryFee;
  const progressToFree = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  const currentAddress = useMemo(() => {
    return (
      addresses.find((a: any) => (a._id || a.id) === selectedAddress) ||
      addresses[0]
    );
  }, [addresses, selectedAddress]);

  const isEmpty = validCartItems.length === 0;

  const cSurface = useColorModeValue("#FFFFFF", "var(--color-surface)");
  const cSurfaceElevated = useColorModeValue("#FAFBFD", "var(--color-surface-elevated)");
  const cBorder = useColorModeValue("#E5EAF0", "var(--color-border)");
  const cBorderLight = useColorModeValue("#F1F5F9", "var(--color-border)");
  const cText = useColorModeValue("#172033", "var(--color-text-primary)");
  const cTextMuted = useColorModeValue("#64748B", "var(--color-text-muted)");
  const cPrimary = "var(--color-primary)";
  const cPrimaryHover = "var(--color-primary-hover)";
  const cPrimarySoft = useColorModeValue("#E6F7F3", "rgba(6, 95, 104, 0.2)");
  const cBannerBg = useColorModeValue("#FFF0F0", "rgba(239, 68, 68, 0.12)");
  const cBannerBorder = useColorModeValue("#FFD5D5", "rgba(239, 68, 68, 0.25)");
  const bannerBorderTeal = useColorModeValue("#B5E9DF", "rgba(6, 95, 104, 0.4)");
  const progressBg = useColorModeValue("#D1F2EB", "whiteAlpha.200");

  return (
    <Box
      bg={cSurface}
      borderRadius="24px"
      border="1px solid"
      borderColor={cBorder}
      boxShadow="0 4px 20px -2px rgba(15, 23, 42, 0.04)"
      p={{ base: 4, sm: 6, lg: 7 }}
      position="relative"
    >
      {/* ===================================================================
          1. HEADER SECTION
         =================================================================== */}
      <Flex
        justify="space-between"
        align="center"
        pb={4}
        borderBottom="1px solid"
        borderColor={cBorder}
        flexWrap="wrap"
        gap={3}
      >
        {/* Left: Icon + "My Cart" + Item Count Pill Badge */}
        <HStack spacing={3} align="center">
          <Flex
            boxSize={{ base: "38px", sm: "44px" }}
            bg={cPrimarySoft}
            borderRadius="12px"
            align="center"
            justify="center"
            color={cPrimary}
            flexShrink={0}
          >
            <Icon as={FiShoppingBag} boxSize={{ base: "18px", sm: "22px" }} />
          </Flex>

          <Heading
            size="lg"
            fontSize={{ base: "20px", sm: "24px" }}
            fontWeight="800"
            color={cText}
            letterSpacing="-0.02em"
          >
            My Cart
          </Heading>

          {!isEmpty && (
            <Badge
              bg={cPrimarySoft}
              color={cPrimary}
              borderRadius="full"
              px={3}
              py={1}
              fontSize="xs"
              fontWeight="800"
              letterSpacing="0.05em"
              textTransform="uppercase"
            >
              {cartStore.totalItems} {cartStore.totalItems === 1 ? "ITEM" : "ITEMS"}
            </Badge>
          )}
        </HStack>

        {/* Right: "Clear Cart" Trash Action + Divider + "Continue Shopping" Pill */}
        {!isEmpty && (
          <HStack spacing={2.5} align="center">
            <Button
              size="sm"
              variant="ghost"
              color="#E53E3E"
              _hover={{ bg: cBannerBg, color: "#DC2626" }}
              leftIcon={<Icon as={FiTrash2} boxSize={4} />}
              onClick={handleOpenClearModal}
              fontSize="xs"
              fontWeight="600"
              h="36px"
              px={2.5}
            >
              Clear Cart
            </Button>

            <Box h="20px" w="1px" bg={cBorder} display={{ base: "none", sm: "block" }} />

            <Button
              size="sm"
              variant="outline"
              borderColor={cPrimary}
              color={cPrimary}
              bg="transparent"
              borderRadius="full"
              _hover={{ bg: cPrimarySoft, borderColor: cPrimaryHover }}
              leftIcon={<Icon as={FiShoppingBag} boxSize={3.5} />}
              onClick={handleNavigateProducts}
              fontSize="xs"
              fontWeight="700"
              h="38px"
              px={4}
            >
              Continue Shopping
            </Button>
          </HStack>
        )}
      </Flex>

      {/* ===================================================================
          2. EMPTY CART STATE
         =================================================================== */}
      {isEmpty ? (
        <Flex
          direction="column"
          align="center"
          justify="center"
          py={14}
          px={4}
          textAlign="center"
        >
          <Flex
            boxSize="84px"
            rounded="full"
            bg={cPrimarySoft}
            color={cPrimary}
            align="center"
            justify="center"
            mb={4}
            boxShadow="0 8px 20px -4px rgba(6, 95, 104, 0.25)"
          >
            <Icon as={FiShoppingBag} boxSize={9} />
          </Flex>

          <Heading size="md" color={cText} fontWeight="800" mb={1.5}>
            Your Cart is Empty
          </Heading>
          <Text fontSize="sm" color={cTextMuted} maxW="340px" mb={6} lineHeight="1.5">
            Looks like you haven&apos;t added any items to your cart yet. Explore our
            handpicked catalog and discover amazing deals!
          </Text>

          <Button
            bgGradient="linear(to-r, var(--color-primary), var(--color-secondary))"
            color="white"
            h="46px"
            px={8}
            borderRadius="full"
            fontWeight="700"
            fontSize="sm"
            onClick={handleNavigateProducts}
            boxShadow="0 8px 20px -4px rgba(6, 95, 104, 0.4)"
            _hover={{ opacity: 0.9 }}
            _active={{ transform: "scale(0.98)" }}
          >
            Start Shopping
          </Button>
        </Flex>
      ) : (
        /* ===================================================================
            3. TWO-COLUMN LAYOUT (Desktop: ~64% Left, ~36% Right; Mobile: Stacks)
           =================================================================== */
        <Grid
          templateColumns={{ base: "1fr", lg: "1.65fr 1fr" }}
          gap={{ base: 5, lg: 6 }}
          mt={5}
        >
          {/* ─────────────────────────────────────────────────────────────
              LEFT COLUMN: Free Delivery Banner + Product Cards
             ───────────────────────────────────────────────────────────── */}
          <Flex
            direction="column"
            gap={3.5}
            position="relative"
            minH={{ base: "320px", lg: "440px" }}
          >
            {/* Free Delivery Banner (Foreground) */}
            <Box
              position="relative"
              zIndex={1}
              bg={cPrimarySoft}
              border="1px solid"
              borderColor={bannerBorderTeal}
              borderRadius="16px"
              p={{ base: 3, sm: "12px 18px" }}
            >
              <Flex align="center" justify="space-between" gap={3}>
                <HStack spacing={2.5} align="center" flex="1" minW={0}>
                  <Flex
                    boxSize="24px"
                    borderRadius="full"
                    bg="#159447"
                    color="white"
                    align="center"
                    justify="center"
                    flexShrink={0}
                  >
                    <Icon as={FiCheck} boxSize={3.5} strokeWidth={3} />
                  </Flex>

                  <Text
                    fontSize={{ base: "xs", sm: "13px" }}
                    fontWeight="700"
                    color={cText}
                    lineHeight="1.3"
                  >
                    {isFreeDelivery
                      ? "You have qualified for FREE Delivery!"
                      : `Add ₹${FREE_SHIPPING_THRESHOLD - subtotal} more for FREE Delivery!`}
                  </Text>
                </HStack>

                {/* Cute Truck Illustration with motion lines */}
                <DeliveryTruckIllustration />
              </Flex>

              {!isFreeDelivery && (
                <Box mt={2.5}>
                  <Progress
                    value={progressToFree}
                    size="xs"
                    borderRadius="full"
                    colorScheme="brand"
                    bg={progressBg}
                  />
                </Box>
              )}
            </Box>

            {/* Cart Product Cards List */}
            <VStack spacing={3} align="stretch" position="relative" zIndex={1}>
              {validCartItems.map((item) => {
                const id = item.product._id || item.product.id;
                return (
                  <CartItemCard
                    key={id}
                    item={item}
                    cSurfaceElevated={cSurfaceElevated}
                    cBorderLight={cBorderLight}
                    cPrimary={cPrimary}
                    cBorder={cBorder}
                    cSurface={cSurface}
                    cText={cText}
                    cBannerBg={cBannerBg}
                    cPrimarySoft={cPrimarySoft}
                    bannerBorderTeal={bannerBorderTeal}
                    onRemove={handleRemoveItem}
                    onUpdateQuantity={handleUpdateItemQuantity}
                  />
                );
              })}
            </VStack>
          </Flex>

          {/* ─────────────────────────────────────────────────────────────
              RIGHT COLUMN: Delivery Address Card + Order Summary Card
             ───────────────────────────────────────────────────────────── */}
          <VStack spacing={4} align="stretch">
            {/* 1. Delivery Address Card */}
            <Box
              bg={cSurface}
              border="1px solid"
              borderColor={cBorder}
              borderRadius="18px"
              p={{ base: 4, sm: "18px" }}
              boxShadow="0 2px 8px rgba(0, 0, 0, 0.02)"
            >
              {/* Header */}
              <Flex justify="space-between" align="center">
                <HStack spacing={2} align="center">
                  <Icon as={FaLocationDot} color={cPrimary} boxSize={4} />
                  <Text fontWeight="700" fontSize="15px" color={cText}>
                    Delivery Address
                  </Text>
                </HStack>

                <Button
                  variant="unstyled"
                  color={cPrimary}
                  fontWeight="700"
                  fontSize="13px"
                  h="auto"
                  p={0}
                  _hover={{ textDecoration: "underline", color: cPrimaryHover }}
                  onClick={onAddressOpen}
                >
                  Change
                </Button>
              </Flex>

              {/* Light Blush Address Box */}
              {currentAddress &&
              (currentAddress.addressLine1 || currentAddress.line1) ? (
                <Box
                  mt={3}
                  bg={cBannerBg}
                  border="1px solid"
                  borderColor={cBannerBorder}
                  borderRadius="14px"
                  p="14px"
                  position="relative"
                  overflow="hidden"
                >
                  {/* Subtle House Illustration at bottom right */}
                  <HouseIllustration />

                  <Box position="relative" zIndex={1} pr="56px">
                    {/* Top: Red House Icon + Label + DEFAULT badge */}
                    <HStack spacing={1.5} align="center" mb={1}>
                      <Icon as={FaHouse} color="#E53E3E" boxSize={3} />
                      <Text fontWeight="700" fontSize="13px" color={cText}>
                        {currentAddress.name || "Home"}
                      </Text>
                      {currentAddress.isDefault !== false && (
                        <Badge
                          bg="#FCE7E7"
                          color="#E53E3E"
                          fontSize="9px"
                          fontWeight="800"
                          px="6px"
                          py="1px"
                          borderRadius="full"
                          letterSpacing="0.05em"
                        >
                          DEFAULT
                        </Badge>
                      )}
                    </HStack>

                    {/* Address Text */}
                    <Text
                      fontSize="12px"
                      color={cTextMuted}
                      lineHeight="1.45"
                      noOfLines={2}
                      mb={1}
                    >
                      {[
                        currentAddress.addressLine1 || currentAddress.line1,
                        currentAddress.addressLine2 || currentAddress.line2,
                        currentAddress.city,
                        currentAddress.state,
                        currentAddress.postalCode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </Text>

                    {/* Phone Number */}
                    {currentAddress.phone && (
                      <HStack spacing={1.5} color={cTextMuted} fontSize="12px" align="center">
                        <Icon as={FaPhone} boxSize={2.5} />
                        <Text>Phone: {currentAddress.phone}</Text>
                      </HStack>
                    )}
                  </Box>
                </Box>
              ) : (
                <Button
                  mt={3}
                  w="full"
                  variant="outline"
                  borderColor={cPrimary}
                  color={cPrimary}
                  bg={cPrimarySoft}
                  borderRadius="14px"
                  h="42px"
                  leftIcon={<Icon as={FaPlus} />}
                  fontSize="xs"
                  fontWeight="700"
                  _hover={{ bg: cPrimarySoft, borderColor: cPrimaryHover }}
                  onClick={onAddressOpen}
                >
                  Add Delivery Address
                </Button>
              )}
            </Box>

            {/* 2. Order Summary Card */}
            <Box
              bg={cSurface}
              border="1px solid"
              borderColor={cBorder}
              borderRadius="18px"
              p={{ base: 4, sm: "18px" }}
              boxShadow="0 2px 8px rgba(0, 0, 0, 0.02)"
            >
              {/* Header */}
              <HStack spacing={2} align="center" mb={3.5}>
                <Icon as={IoReceiptOutline} color={cPrimary} boxSize={4.5} />
                <Text fontWeight="700" fontSize="15px" color={cText}>
                  Order Summary
                </Text>
              </HStack>

              {/* Rows */}
              <VStack spacing={2.5} align="stretch">
                <Flex justify="space-between" align="center">
                  <Text fontSize="13px" color={cTextMuted}>
                    Items Subtotal
                  </Text>
                  <Text fontSize="15px" fontWeight="700" color={cText}>
                    ₹{subtotal}
                  </Text>
                </Flex>

                <Flex justify="space-between" align="center">
                  <Text fontSize="13px" color={cTextMuted}>
                    Delivery Fee
                  </Text>
                  <Text
                    fontSize="13px"
                    fontWeight="800"
                    color={isFreeDelivery ? "#159447" : cText}
                  >
                    {isFreeDelivery ? "FREE" : `₹${deliveryFee}`}
                  </Text>
                </Flex>
              </VStack>

              {/* Light Mint Total Amount Box */}
              <Box
                bg={cPrimarySoft}
                borderRadius="12px"
                p="12px 16px"
                my={3.5}
              >
                <Flex justify="space-between" align="center">
                  <Text fontSize="15px" fontWeight="700" color={cText}>
                    Total Amount
                  </Text>
                  <Text
                    fontSize="20px"
                    fontWeight="800"
                    color={cPrimary}
                    letterSpacing="-0.02em"
                  >
                    ₹{grandTotal}
                  </Text>
                </Flex>
              </Box>

              {/* Teal Gradient Proceed to Checkout Button */}
              <Button
                w="full"
                h="50px"
                bgGradient="linear(to-r, var(--color-primary), var(--color-secondary))"
                color="white"
                borderRadius="14px"
                fontWeight="700"
                fontSize="14px"
                leftIcon={<Icon as={FiLock} boxSize={4} />}
                rightIcon={<Icon as={FiArrowRight} boxSize={4} />}
                onClick={handleNavigateCheckout}
                boxShadow="0 8px 20px -4px rgba(6, 95, 104, 0.4)"
                _hover={{
                  opacity: 0.9,
                  boxShadow: "0 10px 24px -4px rgba(6, 95, 104, 0.5)",
                }}
                _active={{ transform: "scale(0.99)" }}
                transition="all 0.15s ease"
              >
                Proceed to Checkout
              </Button>

              {/* Divider below button */}
              <Divider my={3.5} borderColor={cBorder} />

              {/* Trust Indicators Row */}
              <Flex
                justify="space-between"
                align="center"
                pt={0.5}
                gap={1}
                flexWrap="wrap"
              >
                <HStack spacing={1.5} align="center">
                  <Icon as={FiShield} color={cPrimary} boxSize={3.5} />
                  <Text fontSize="11px" fontWeight="600" color={cTextMuted} lineHeight="1.2">
                    100% Secure Payments
                  </Text>
                </HStack>

                <HStack spacing={1.5} align="center">
                  <Icon as={FiRotateCcw} color={cPrimary} boxSize={3.5} />
                  <Text fontSize="11px" fontWeight="600" color={cTextMuted} lineHeight="1.2">
                    Easy Returns
                  </Text>
                </HStack>

                <HStack spacing={1.5} align="center">
                  <Icon as={FiHeadphones} color={cPrimary} boxSize={3.5} />
                  <Text fontSize="11px" fontWeight="600" color={cTextMuted} lineHeight="1.2">
                    24/7 Support
                  </Text>
                </HStack>
              </Flex>
            </Box>
          </VStack>
        </Grid>
      )}

      {/* Address Selection / Add Modal (Drawer on mobile) */}
      <AddressModal
        isOpen={isAddressOpen}
        onClose={onAddressClose}
        addresses={addresses}
        selectedAddress={selectedAddress}
        onSelectAddress={handleSelectAddress}
        onAddNewAddress={handleAddNewAddress}
        onUpdateAddress={handleUpdateAddress}
        onDeleteAddress={handleDeleteAddress}
      />

      {/* Clear Cart Confirmation Dialog */}
      <ConfirmationModal
        isOpen={isClearModalOpen}
        onClose={handleCloseClearModal}
        onConfirm={handleClearCart}
        title="Empty Cart?"
        message="Are you sure you want to remove all items from your cart?"
        confirmText="Clear All"
        confirmButtonProps={{ colorScheme: "red" }}
        cancelText="Keep Items"
      />
    </Box>
  );
});

export default memo(CartSection);
