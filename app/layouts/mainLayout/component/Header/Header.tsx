"use client";

import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Divider,
  Flex,
  HStack,
  IconButton,
  Image,
  Text,
  useBreakpointValue,
  useDisclosure,
  Badge,
  Icon,
  Stack,
  Avatar,
  Tooltip,
  // keyframes,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import stores from "../../../../store/stores";
import { useRouter } from "next/navigation";
import {
  FiShoppingCart,
  FiHeart,
  FiShoppingBag,
  FiMapPin,
  FiCreditCard,
  FiUser,
  FiLogOut,
  FiGrid,
  FiPhone,
  FiShield,
  FiTruck,
  FiZap,
  FiGift,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";
import { Suspense, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import CartDrawer from "../../../../component/Cart/component/CartDrawer/CartDrawer";
import WishlistDrawer from "../../../../component/Wishlist/component/WishlistDrawer/WishlistDrawer";
import WhatsAppButton from "../../../../component/common/whatsApp/whatsAppButton";
import HeroNavButton from "./component/HeroNavButton";
import UserMenu from "./component/UserMenu";
import NavItemsLayout from "./component/NavItemsLayout";
import SearchInput from "./element/SearchInput";
import NotificationBell from "./Notification/NotificationBell";

// Animation keyframes for cart bounce
// const bounce = keyframes`
//   0% { transform: scale(1); }
//   50% { transform: scale(1.2); }
//   100% { transform: scale(1); }
// `;

// const pulse = keyframes`
//   0% { transform: scale(1); opacity: 1; }
//   50% { transform: scale(1.15); opacity: 0.8; }
//   100% { transform: scale(1); opacity: 1; }
// `;

// const slideIn = keyframes`
//   from { transform: translateX(-10px); opacity: 0; }
//   to { transform: translateX(0); opacity: 1; }
// `;

const promoMessages = [
  { text: "🔥 Flash Sale: Up to 60% off on local treasures!", icon: FiZap },
  { text: "🎁 Free gift on orders above ₹999", icon: FiGift },
  { text: "⭐ New sellers added this week! Explore now", icon: FiStar },
  { text: "🚚 Fast local delivery in 2-3 days", icon: FiTruck },
];

const promoFeatures = [
  { label: "Fast local delivery", icon: FiTruck, color: "blue.400" },
  { label: "Secure checkout", icon: FiShield, color: "green.400" },
  { label: "24/7 support", icon: FiPhone, color: "purple.400" },
];

const QuickAction = ({ icon, label, onClick, badge, color }: { icon: any; label: string; onClick: () => void; badge?: number | string | null; color?: string; }) => (
  <motion.div
    whileHover={{ x: 5, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    <Flex
      align="center"
      gap={3}
      py={2.5}
      px={4}
      borderRadius="xl"
      bg="white"
      _hover={{ bg: "gray.50", cursor: "pointer", boxShadow: "sm" }}
      transition="all 0.2s"
      onClick={onClick}
      border="1px solid"
      borderColor="gray.100"
    >
      <Icon as={icon} color={color || "blue.500"} boxSize={5} />
      <Text fontWeight="500" fontSize="sm" flex="1">
        {label}
      </Text>
      {badge ? (
        <Badge ml="auto" colorScheme="blue" borderRadius="full" px={2} fontSize="xs">
          {badge}
        </Badge>
      ) : null}
    </Flex>
  </motion.div>
);

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

  // Scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cart bounce animation when item count changes
  useEffect(() => {
    if (prevTotalItems.current !== cartStore.totalItems && cartStore.totalItems > 0) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 500);
      return () => clearTimeout(timer);
    }
    prevTotalItems.current = cartStore.totalItems;
  }, [cartStore.totalItems]);

  // Auto-rotate promo messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % promoMessages.length);
    }, 5000);
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

  const handleLogout = () => {
    logout();
    router.push("/");
    onClose();
  };

  const drawerWidth = useBreakpointValue({
    base: "92%",
    md: "70%",
    lg: "420px",
  });

  const isAuthenticated = isMounted && Boolean(user);
  const greetingName = user?.name?.split(" ")[0] || "Seller";
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  // Get user avatar or fallback
  const userAvatar = user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || "User"}&background=3B82F6&color=fff&rounded=true&bold=true`;

  return (
    <Box position="sticky" top="0" zIndex="1000">
      {/* Modernized Top Bar with auto-rotating messages */}
      <Box
        display={{ base: "none", md: "flex" }}
        alignItems="center"
        justifyContent="space-between"
        bg="linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)"
        color="white"
        px={{ base: 4, md: 10 }}
        py={2.5}
        borderBottom="1px solid"
        borderColor="whiteAlpha.200"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPromoIndex}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <Icon as={promoMessages[currentPromoIndex].icon} boxSize={4} />
            <Text fontSize="xs" fontWeight="semibold" letterSpacing="wider">
              {promoMessages[currentPromoIndex].text}
            </Text>
          </motion.div>
        </AnimatePresence>

        <HStack spacing={3}>
          {promoFeatures.map((feature) => (
            <Tooltip label={feature.label} key={feature.label} hasArrow>
              <HStack
                spacing={1}
                px={3}
                py={1}
                bg="whiteAlpha.200"
                borderRadius="full"
                _hover={{ bg: "whiteAlpha.300", transform: "scale(1.05)" }}
                transition="all 0.2s"
                cursor="default"
              >
                <Icon as={feature.icon} boxSize={3.5} color={feature.color} />
                <Text fontSize="xs" display={{ base: "none", lg: "block" }}>
                  {feature.label}
                </Text>
              </HStack>
            </Tooltip>
          ))}
        </HStack>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="sm"
            variant="solid"
            bg="whiteAlpha.200"
            backdropFilter="blur(4px)"
            color="white"
            _hover={{ bg: "whiteAlpha.300", transform: "translateY(-1px)" }}
            onClick={() => router.push("/contact-us")}
            leftIcon={<FiPhone />}
            borderRadius="full"
            fontSize="xs"
          >
            Talk to a local expert
          </Button>
        </motion.div>
      </Box>

      {/* Main header with dynamic scroll effect */}
      <Box
        bg={isScrolled ? "rgba(255, 255, 255, 0.95)" : "white"}
        backdropFilter={isScrolled ? "blur(12px)" : "none"}
        borderBottom="1px solid"
        borderColor={isScrolled ? "gray.200" : "gray.100"}
        boxShadow={isScrolled ? "lg" : "sm"}
        transition="all 0.3s ease"
      >
        <Flex
          align="center"
          justify="space-between"
          px={{ base: 4, md: 10 }}
          py={2}
          gap={2}
          maxW="8xl"
          mx="auto"
          wrap="wrap"
        >
          {/* Logo + Brand with animation */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
            style={{ cursor: "pointer" }}
            onClick={() => router.push("/")}
          >
            <Flex align="center" gap={3} minW="220px">
              <Box position="relative">
                <Image
                  src="/images/logo3.jpg"
                  alt="Business Sahayata"
                  h={{ base: "38px", md: "44px" }}
                  objectFit="contain"
                  borderRadius="md"
                />
                <Badge
                  position="absolute"
                  bottom="-6px"
                  right="-10px"
                  bg="orange.400"
                  color="white"
                  fontSize="9px"
                  px={1.5}
                  borderRadius="full"
                  display={{ base: "none", md: "flex" }}
                >
                  Local Love ❤️
                </Badge>
              </Box>
              <Box>
                <Text
                  fontWeight="extrabold"
                  fontSize={{ base: "md", md: "lg" }}
                  bgGradient="linear(to-r, blue.600, purple.600)"
                  bgClip="text"
                  lineHeight="short"
                >
                  Business Sahayata
                </Text>
                <Text fontSize="xs" color="gray.500" lineHeight="short">
                  Empowering local sellers 🚀
                </Text>
              </Box>
            </Flex>
          </motion.div>

          {/* Search - Desktop with enhanced styling */}
          <Box
            display={{ base: "none", md: "block" }}
            flex="1"
            minW="0"
            maxW="560px"
            position="relative"
          >
            <Box borderRadius="full" p={0.5} bgGradient="linear(to-r, blue.100, purple.100)">
              <Suspense fallback={null}>
                <SearchInput />
              </Suspense>
            </Box>
          </Box>

          {/* Action buttons with animations */}
          <HStack spacing={1} align="center" flexShrink={0}>
            <Tooltip label="Wishlist" hasArrow>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  icon={<FiHeart size={19} />}
                  aria-label="Wishlist"
                  variant="ghost"
                  color="red.500"
                  size="sm"
                  onClick={onWishlistOpen}
                  _hover={{ bg: "red.50" }}
                  borderRadius="full"
                />
              </motion.div>
            </Tooltip>

            <Tooltip label="Shopping Cart" hasArrow>
              <Box position="relative">
                <motion.div
                  animate={cartBounce ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <IconButton
                    icon={<FiShoppingCart size={19} />}
                    aria-label="Cart"
                    variant="ghost"
                    color="blue.600"
                    size="sm"
                    onClick={onCartOpen}
                    borderRadius="full"
                    _hover={{ bg: "blue.50" }}
                  />
                </motion.div>
                {cartStore.totalItems > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <Badge
                      position="absolute"
                      top="-1"
                      right="-1"
                      bg="linear-gradient(135deg, #F59E0B, #EF4444)"
                      color="white"
                      borderRadius="full"
                      fontSize="0.6em"
                      px={1.5}
                      minW="18px"
                      textAlign="center"
                    >
                      {cartStore.totalItems > 9 ? "9+" : cartStore.totalItems}
                    </Badge>
                  </motion.div>
                )}
              </Box>
            </Tooltip>

            {isAuthenticated && <NotificationBell />}

            <Box>
              {isAuthenticated ? <UserMenu /> : <HeroNavButton />}
            </Box>

            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<HamburgerIcon />}
              aria-label="Open menu"
              variant="ghost"
              colorScheme="blue"
              size="sm"
              onClick={onOpen}
              borderRadius="full"
            />
          </HStack>
        </Flex>

        {/* Category navigation (desktop) - Enhanced */}
        <Box display={{ base: "none", md: "flex" }} px={{ md: 10 }} pb={2}>
          <Flex align="center" justify="space-between" w="full" gap={2}>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="solid"
                bgGradient="linear(to-r, blue.500, blue.600)"
                color="white"
                size="sm"
                leftIcon={<FiGrid />}
                onClick={() => router.push("/categories")}
                _hover={{ bgGradient: "linear(to-r, blue.600, blue.700)", transform: "translateY(-1px)" }}
                transition="all 0.2s"
                borderRadius="xl"
                boxShadow="sm"
              >
                Shop by category
              </Button>
            </motion.div>

            <Box flex="1" ml={2}>
              <NavItemsLayout />
            </Box>

            <Tooltip label="Trending this week" hasArrow>
              <HStack
                spacing={1}
                px={3}
                py={1.5}
                bg="orange.50"
                borderRadius="full"
                border="1px solid"
                borderColor="orange.200"
                cursor="pointer"
                onClick={() => router.push("/trending")}
                _hover={{ bg: "orange.100", transform: "scale(1.02)" }}
                transition="all 0.2s"
              >
                <FiTrendingUp color="#F97316" size={14} />
                <Text fontSize="xs" fontWeight="medium" color="orange.600">
                  Trending
                </Text>
              </HStack>
            </Tooltip>
          </Flex>
        </Box>
      </Box>

      {/* Mobile bottom bar (enhanced) */}
      <Box
        display={{ base: "block", md: "none" }}
        bg="white"
        px={4}
        py={2}
        borderTop="1px solid"
        borderColor="gray.100"
        boxShadow="0 -1px 8px rgba(0,0,0,0.04)"
      >
        <Flex direction="column" gap={3}>
          <Box bg="gray.50" borderRadius="2xl" p={1}>
            <Suspense fallback={null}>
              <SearchInput />
            </Suspense>
          </Box>

          <Flex gap={2}>
            <motion.div whileTap={{ scale: 0.97 }} style={{ flex: 1 }}>
              <Button
                leftIcon={<FiGrid />}
                variant="outline"
                colorScheme="blue"
                size="sm"
                w="full"
                onClick={() => router.push("/categories")}
                borderRadius="xl"
              >
                Categories
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.97 }} style={{ flex: 1 }}>
              <Button
                variant="outline"
                size="sm"
                flex="1"
                leftIcon={<FiHeart />}
                onClick={onWishlistOpen}
                _hover={{ borderColor: "red.300", color: "red.500" }}
                borderRadius="xl"
              >
                Wishlist
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.97 }} style={{ flex: 1 }}>
              <Button
                variant="solid"
                size="sm"
                colorScheme="blue"
                flex="1"
                leftIcon={<FiShoppingCart />}
                onClick={onCartOpen}
                borderRadius="xl"
                position="relative"
              >
                Cart {cartStore.totalItems > 0 && `(${cartStore.totalItems})`}
              </Button>
            </motion.div>
          </Flex>
        </Flex>
      </Box>

      {/* Mobile Drawer - Enhanced with animations and better design */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay backdropFilter="blur(4px)" />
        <DrawerContent maxW={drawerWidth} borderRadius="2xl 0 0 2xl">
          <DrawerCloseButton mt={4} mr={4} size="sm" borderRadius="full" />
          <DrawerBody pt={8} px={0}>
            <Box px={4} mb={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  bgGradient="linear(135deg, #EBF4FF 0%, #E0ECFF 100%)"
                  borderRadius="2xl"
                  p={5}
                  mb={6}
                  position="relative"
                  overflow="hidden"
                >
                  <Flex align="center" gap={3} mb={2}>
                    {isAuthenticated ? (
                      <Avatar
                        size="md"
                        name={user?.name}
                        src={userAvatar}
                        bg="blue.500"
                        border="2px solid white"
                      />
                    ) : (
                      <Avatar
                        size="md"
                        bg="blue.500"
                        icon={<FiUser color="white" />}
                      />
                    )}
                    <Box>
                      <Text fontSize="lg" fontWeight="bold" mb={0} color="blue.800">
                        {isAuthenticated
                          ? `Hey ${greetingName}! 👋`
                          : "Welcome! ✨"}
                      </Text>
                      <Text fontSize="xs" color="gray.700">
                        {isAuthenticated
                          ? "Ready to shop local?"
                          : "Sign in for exclusive deals"}
                      </Text>
                    </Box>
                  </Flex>
                  <Text fontSize="sm" color="gray.700">
                    Shop local, support small businesses, and get best prices.
                  </Text>
                  <Box
                    position="absolute"
                    bottom="-10px"
                    right="-10px"
                    fontSize="60px"
                    opacity={0.1}
                  >
                    🛍️
                  </Box>
                </Box>
              </motion.div>

              <Text fontSize="xs" fontWeight="bold" color="gray.400" mb={3} textTransform="uppercase" letterSpacing="wider">
                Quick links
              </Text>
              <QuickAction
                icon={FiGrid}
                label="Shop by category"
                onClick={() => {
                  onClose();
                  router.push("/categories");
                }}
                color="blue.500"
              />
              <Box ml={2} mt={2}>
                <NavItemsLayout onClose={onClose} />
              </Box>
            </Box>

            <Divider />

            <Box px={4} mt={4}>
              {isAuthenticated ? (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.05 } },
                  }}
                >
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    color="gray.400"
                    mb={3}
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    My account
                  </Text>

                  <QuickAction
                    icon={FiShoppingCart}
                    label="Your Cart"
                    badge={cartStore.totalItems > 0 ? cartStore.totalItems : null}
                    onClick={() => {
                      onClose();
                      onCartOpen();
                    }}
                    color="blue.500"
                  />

                  <QuickAction
                    icon={FiHeart}
                    label="Your Wishlist"
                    onClick={() => {
                      onClose();
                      onWishlistOpen();
                    }}
                    color="red.500"
                  />
      
                  <QuickAction
                    icon={FiShoppingBag}
                    label="Your Orders"
                    onClick={() => {
                      onClose();
                      router.push("/account?tab=orders");
                    }}
                    color="blue.600"
                  />

                  <QuickAction
                    icon={FiMapPin}
                    label="Address Book"
                    onClick={() => {
                      onClose();
                      router.push("/account?tab=addresses");
                    }}
                    color="green.500"
                  />

                  <QuickAction
                    icon={FiCreditCard}
                    label="Payment Methods"
                    onClick={() => {
                      onClose();
                      router.push("/dashboard/payments");
                    }}
                    color="purple.500"
                  />

                  {user?.type === "user" && (
                    <QuickAction
                      icon={FiGrid}
                      label="Dashboard"
                      onClick={() => {
                        onClose();
                        router.push("/dashboard");
                      }}
                      color="blue.500"
                    />
                  )}

                  {user?.type === "seller" && (
                    <QuickAction
                      icon={FiUser}
                      label="Seller Dashboard"
                      onClick={() => {
                        onClose();
                        router.push("/dashboard");
                      }}
                      color="orange.500"
                    />
                  )}

                  <Box mt={4} pt={2}>
                    <QuickAction
                      icon={FiLogOut}
                      label="Logout"
                      onClick={handleLogout}
                      color="red.500"
                    />
                  </Box>
                </motion.div>
              ) : (
                <Box mt={4}>
                  <HeroNavButton />
                </Box>
              )}
            </Box>

            <Center mt={8} mb={4}>
              <WhatsAppButton />
            </Center>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Drawers for cart and wishlist */}
      <CartDrawer isOpen={isCartOpen} onClose={onCartClose} />
      <WishlistDrawer isOpen={isWishlistOpen} onClose={onWishlistClose} />
    </Box>
  );
});

export default Header;