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
  HStack,
  Icon,
  IconButton,
  Image,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  FiCreditCard,
  FiGift,
  FiGrid,
  FiHeart,
  FiHelpCircle,
  FiLogOut,
  FiMapPin,
  FiShoppingBag,
  FiShoppingCart,
  FiStar,
  FiTrendingUp,
  FiTruck,
  FiUser,
  FiZap,
} from "react-icons/fi";
import CartDrawer from "../../../../component/Cart/component/CartDrawer/CartDrawer";
import WhatsAppButton from "../../../../component/common/whatsApp/whatsAppButton";
import WishlistDrawer from "../../../../component/Wishlist/component/WishlistDrawer/WishlistDrawer";
import useRegisterOverlay from "../../../../hooks/useRegisterOverlay";
import stores from "../../../../store/stores";
import {  ThemeModeSwitcher } from "../../../../theme/ThemeModeSwitcher";
import HeroNavButton from "./component/HeroNavButton";
import NavItemsLayout from "./component/NavItemsLayout";
import UserMenu from "./component/UserMenu";
import SearchInput from "./element/SearchInput";

const promoMessages = [
  { text: "Flash Sale: Up to 60% off on local treasures!", icon: FiZap },
  { text: "Free gift on orders above ₹999", icon: FiGift },
  { text: "New local sellers added this week! Explore now", icon: FiStar },
  { text: "Fast local delivery in 2-3 days", icon: FiTruck },
];

const QuickLinks = [
  { label: "Today's Deals", path: "/deals" },
  { label: "New Arrivals", path: "/new-arrivals" },
  { label: "Top Rated", path: "/top-rated" },
  { label: "Local Sellers", path: "/sellers" },
];

interface QuickActionProps {
  icon: any;
  label: string;
  onClick: () => void;
  badge?: number | string | null;
  color?: string;
}

const QuickAction = ({
  icon,
  label,
  onClick,
  badge,
  color = "gray.600",
}: QuickActionProps) => {
  const hoverBg = useColorModeValue("gray.100", "whiteAlpha.100");
  const activeBg = useColorModeValue("gray.200", "whiteAlpha.200");
  const textColor = useColorModeValue("gray.700", "gray.200");

  return (
    <Flex
      as="button"
      w="full"
      align="center"
      gap={3}
      py={2.5}
      px={3}
      borderRadius="lg"
      bg="transparent"
      _hover={{ bg: hoverBg, color: "var(--color-primary)" }}
      _active={{ bg: activeBg }}
      transition="all 0.15s ease"
      onClick={onClick}
      textAlign="left"
    >
      <Icon as={icon} color={color} boxSize={4} flexShrink={0} />
      <Text fontWeight="500" fontSize="sm" color={textColor} flex="1" noOfLines={1}>
        {label}
      </Text>
      {badge ? (
        <Badge colorScheme="brand" borderRadius="full" px={2} py={0.5} fontSize="2xs">
          {badge}
        </Badge>
      ) : null}
    </Flex>
  );
};

const Header = observer(() => {
  const router = useRouter();
  const {
    auth: { user, logout },
    cartStore,
  } = stores;

  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const prevTotalItems = useRef(cartStore.totalItems);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (
      prevTotalItems.current !== cartStore.totalItems &&
      cartStore.totalItems > 0
    ) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 400);
      return () => clearTimeout(timer);
    }
    prevTotalItems.current = cartStore.totalItems;
  }, [cartStore.totalItems]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % promoMessages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isMounted && user) {
      cartStore.fetchCart();
    }
  }, [isMounted, user, cartStore]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const isCartOpen = cartStore.isCartOpen;
  const onCartOpen = cartStore.openCart;
  const onCartClose = cartStore.closeCart;
  const {
    isOpen: isWishlistOpen,
    onOpen: onWishlistOpen,
    onClose: onWishlistClose,
  } = useDisclosure();

  // Register mobile drawer & wishlist drawer for native back-button dismissal
  useRegisterOverlay(isOpen, onClose, 'header_nav_drawer');
  useRegisterOverlay(isWishlistOpen, onWishlistClose, 'wishlist_drawer');

  const handleLogout = () => {
    logout();
    router.push("/");
    onClose();
  };

  const isAuthenticated = isMounted && Boolean(user);
  const greetingName = user?.name?.split(" ")[0] || "There";
  const userAvatar =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "User"
    )}&background=2563EB&color=fff&rounded=true&bold=true`;

  const CurrentPromoIcon = promoMessages[currentPromoIndex].icon;

  // Theme-aware tokens
  const headerBg = useColorModeValue(
    isScrolled ? "rgba(255, 255, 255, 0.95)" : "white",
    isScrolled ? "rgba(11, 17, 32, 0.95)" : "var(--color-bg)"
  );
  const headerBorder = useColorModeValue("gray.100", "var(--color-border)");
  const subNavBg = useColorModeValue("gray.50", "var(--color-surface-alt)");
  const subNavBorder = useColorModeValue("gray.100", "var(--color-border)");
  const subNavDivider = useColorModeValue("gray.300", "var(--color-border-strong)");
  const subNavText = useColorModeValue("gray.600", "var(--color-text-secondary)");
  const iconColor = useColorModeValue("gray.700", "var(--color-text-primary)");
  const drawerBg = useColorModeValue("white", "var(--color-surface)");
  const drawerHeaderBg = useColorModeValue("gray.50", "var(--color-surface-alt)");
  const drawerFooterBg = useColorModeValue("gray.50", "var(--color-surface-alt)");
  const drawerBorder = useColorModeValue("gray.100", "var(--color-border)");
  const drawerTextColor = useColorModeValue("gray.800", "var(--color-text-primary)");
  const drawerMutedColor = useColorModeValue("gray.500", "var(--color-text-muted)");

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
      {/* Slim Top Announcement Bar - Collapses smoothly on scroll for compact height */}
      <Box
        bg="gray.900"
        color="white"
        px={{ base: 3, md: 8 }}
        h={isScrolled ? "0px" : "30px"}
        opacity={isScrolled ? 0 : 1}
        overflow="hidden"
        transition="all 0.25s ease"
      >
        <Flex
          mx="auto"
          h="full"
          // align="center"
          justify={{ base: "center", md: "space-between" }}
          fontSize="xs"
        >
          <HStack spacing={2} overflow="hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPromoIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Icon as={CurrentPromoIcon} color="amber.400" boxSize={3.5} />
                <Text fontWeight="medium" noOfLines={1} color="gray.100">
                  {promoMessages[currentPromoIndex].text}
                </Text>
              </motion.div>
            </AnimatePresence>
          </HStack>

          <HStack
            spacing={4}
            display={{ base: "none", md: "flex" }}
            color="gray.300"
          >
            <Text>24h local fulfillment</Text>
            <Text color="whiteAlpha.400">•</Text>
            <Button
              variant="link"
              size="xs"
              color="white"
              fontWeight="medium"
              leftIcon={<FiHelpCircle />}
              onClick={() => router.push("/contact-us")}
              _hover={{ color: "blue.300", textDecoration: "none" }}
            >
              Help
            </Button>
          </HStack>
        </Flex>
      </Box>

      {/* Main Primary Header Row */}
      <Box px={{ base: 3, md: 8 }} py={{ base: 2, md: 2.5 }}>
        <Flex
          // maxW="8xl"
          mx="auto"
          align="center"
          justify="space-between"
          gap={{ base: 2, md: 6 }}
        >
          {/* Left: Mobile Menu Trigger & Brand Logo */}
          <HStack spacing={{ base: 1.5, md: 3 }} flexShrink={0}>
            {/* <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<HamburgerIcon boxSize={5} />}
              aria-label="Open menu"
              variant="ghost"
              color={iconColor}
              size="sm"
              onClick={onOpen}
              borderRadius="lg"
            /> */}

            <Flex
              as="button"
              onClick={() => router.push("/")}
              align="center"
              gap={2.5}
              textAlign="left"
              _focus={{ outline: "none" }}
            >
              <Image
                src="/images/logo3.jpg"
                alt="Business Sahayata"
                h={{ base: "30px", md: "36px" }}
                w="auto"
                objectFit="contain"
                borderRadius="md"
              />
              <Box display={{ base: "block", sm: "block" }}>
                <Text
                  fontWeight="800"
                  fontSize={{ base: "sm", md: "md" }}
                  bgGradient="linear(to-r, var(--color-primary), var(--color-secondary))"
                  bgClip="text"
                  letterSpacing="tight"
                  lineHeight="1.1"
                >
                  Business Sahayata
                </Text>
                <Text
                  display={{ base: "none", lg: "block" }}
                  fontSize="10px"
                  color="gray.500"
                  fontWeight="medium"
                >
                  Local Marketplace
                </Text>
              </Box>
            </Flex>
          </HStack>

          {/* Center: Clean Search Bar (Desktop & Tablet) */}
          <Box
            display={{ base: "none", md: "block" }}
            flex="1"
            maxW="580px"
          >
            <Suspense fallback={null}>
              <SearchInput />
            </Suspense>
          </Box>

          {/* Right: Quick Actions (Theme Switcher, Wishlist, Cart, Profile) */}
          <HStack spacing={{ base: 1, md: 2 }} flexShrink={0}>
            <Box display={{ base: "none", md: "block" }}>
              <ThemeModeSwitcher  />
            </Box>

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
                {isMounted && cartStore.totalItems > 0 && (
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
                    {cartStore.totalItems > 9 ? "9+" : cartStore.totalItems}
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
                  onClick={onOpen}
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
                  onClick={onOpen}
                />
              )}
            </Box>
          </HStack>
        </Flex>

        {/* Mobile Search Bar Row - Compact & Native Feel */}
        <Box display={{ base: "block", md: "none" }} mt={2}>
          <Suspense fallback={null}>
            <SearchInput />
          </Suspense>
        </Box>
      </Box>

      {/* Desktop Slim Secondary Navigation Bar */}
      <Box
        display={{ base: "none", md: "block" }}
        bg={subNavBg}
        borderTop="1px solid"
        borderColor={subNavBorder}
        px={8}
        py={1}
      >
        <Flex
          // maxW="8xl"
          mx="auto"
          align="center"
          justify="space-between"
          gap={4}
        >
          <HStack spacing={1} overflowX="auto" className="no-scrollbar" py={0.5}>
            <Button
              size="xs"
              variant="ghost"
              color={iconColor}
              fontWeight="600"
              leftIcon={<FiGrid />}
              onClick={() => router.push("/categories")}
              _hover={{ bg: drawerBg, color: "var(--color-primary)" }}
              borderRadius="md"
              px={2.5}
            >
              All Categories
            </Button>

            <Divider orientation="vertical" h="14px" borderColor={subNavDivider} />

            <Box flexShrink={0}>
              <NavItemsLayout />
            </Box>

            <Divider orientation="vertical" h="14px" borderColor={subNavDivider} />

            {QuickLinks.map((item) => (
              <Button
                key={item.label}
                size="xs"
                variant="ghost"
                color={subNavText}
                fontWeight="500"
                onClick={() => router.push(item.path)}
                _hover={{ bg: drawerBg, color: "var(--color-primary)" }}
                borderRadius="md"
                px={2.5}
              >
                {item.label}
              </Button>
            ))}
          </HStack>

          <Button
            size="xs"
            variant="ghost"
            colorScheme="orange"
            leftIcon={<FiTrendingUp />}
            onClick={() => router.push("/trending")}
            borderRadius="full"
            fontWeight="600"
            flexShrink={0}
          >
            Trending
          </Button>
        </Flex>
      </Box>

      {/* Clean Mobile Navigation Drawer */}
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
                    badge={isMounted && cartStore.totalItems > 0 ? cartStore.totalItems : null}
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
                <ThemeModeSwitcher  />
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
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Cart & Wishlist Drawers */}
      <CartDrawer isOpen={isCartOpen} onClose={onCartClose} />
      <WishlistDrawer isOpen={isWishlistOpen} onClose={onWishlistClose} />
    </Box>
  );
});

export default Header;