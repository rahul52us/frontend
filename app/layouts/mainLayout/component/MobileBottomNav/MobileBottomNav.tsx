'use client';

import { Badge, Box, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  FiGrid,
  FiHome,
  FiShoppingBag,
  FiShoppingCart,
  FiUser,
} from 'react-icons/fi';
import stores from '../../../../store/stores';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const MobileBottomNav = observer(() => {
  const router = useRouter();
  const pathname = usePathname();
  const { cartStore, auth } = stores;

  const [cartBounce, setCartBounce] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const prevCartCount = useRef(cartStore?.totalItems || 0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Trigger a spring bounce on the Cart icon whenever items are added
  useEffect(() => {
    const currentCount = cartStore?.totalItems || 0;
    if (currentCount > prevCartCount.current) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 450);
      prevCartCount.current = currentCount;
      return () => clearTimeout(timer);
    }
    prevCartCount.current = currentCount;
  }, [cartStore?.totalItems]);

  // Theme-aware tokens hoisted to top
  const dockBg = useColorModeValue(
    'rgba(255, 255, 255, 0.94)',
    'rgba(11, 17, 32, 0.94)'
  );
  const dockBorder = useColorModeValue(
    'rgba(226, 232, 240, 0.9)',
    'rgba(255, 255, 255, 0.1)'
  );
  const activeColor = 'var(--color-primary)';
  const inactiveColor = useColorModeValue('gray.500', 'gray.400');
  const activePillBg = 'var(--color-primary-soft)';
  const centerRingBg = useColorModeValue('white', 'var(--color-surface)');

  // Ordered with HOME in the exact center (index 2)
  const navItems = [
    { label: 'Categories', icon: FiGrid, path: '/categories' },
    { label: 'Shops', icon: FiShoppingBag, path: '/shops' },
    { label: 'Home', icon: FiHome, path: '/', isCenter: true },
    { label: 'Cart', icon: FiShoppingCart, path: '/cart', isCart: true },
    { label: 'Account', icon: FiUser, path: '/account', isAccount: true },
  ];

  const isTabActive = (item: (typeof navItems)[0]) => {
    if (item.isCart) {
      return Boolean(cartStore?.isCartOpen) || pathname === '/cart';
    }
    if (item.path === '/') {
      return pathname === '/' && !cartStore?.isCartOpen;
    }
    return pathname?.startsWith(item.path) && !cartStore?.isCartOpen;
  };

  const handleNavClick = (item: (typeof navItems)[0]) => {
    if (item.isCart) {
      cartStore?.openCart?.();
      return;
    }
    if (cartStore?.isCartOpen) {
      cartStore?.closeCart?.();
    }
    if (item.isAccount && !auth?.user) {
      router.push('/login');
      return;
    }
    router.push(item.path);
  };

  const totalCartItems = cartStore?.totalItems || 0;

  return (
    <Box
      as="nav"
      aria-label="Mobile Bottom Navigation"
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      zIndex={1000}
      display={{ base: 'block', md: 'none' }}
      bg={dockBg}
      backdropFilter="blur(16px)"
      borderTop="1px solid"
      borderColor={dockBorder}
      boxShadow="0 -4px 20px rgba(0, 0, 0, 0.05)"
      pb="max(env(safe-area-inset-bottom, 0px), 8px)"
      pt={0}
      transition="background-color 0.2s ease, border-color 0.2s ease"
    >
      <Flex
        w="full"
        maxW="540px"
        mx="auto"
        h="56px"
        justify="space-around"
        align="center"
        px={1.5}
        position="relative"
      >
        {navItems.map((item) => {
          const isActive = isTabActive(item);

          // ─── CENTER ELEVATED HOME BUTTON ────────────────────────────────
          if (item.isCenter) {
            return (
              <Flex
                key={item.label}
                flex="1"
                direction="column"
                align="center"
                justify="center"
                position="relative"
                h="full"
                cursor="pointer"
                onClick={() => handleNavClick(item)}
                role="button"
                aria-label="Home"
                _focus={{ outline: 'none' }}
              >
                {/* Elevated Floating Circle */}
                <MotionFlex
                  mt="-20px"
                  w="48px"
                  h="48px"
                  borderRadius="full"
                  bg={centerRingBg}
                  p="3px"
                  boxShadow="0 -3px 12px rgba(6, 95, 104, 0.16)"
                  align="center"
                  justify="center"
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    y: isActive ? -2 : 0,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 22,
                  }}
                >
                  <Flex
                    w="full"
                    h="full"
                    borderRadius="full"
                    bgGradient={
                      isActive
                        ? 'linear(to-tr, var(--color-primary), var(--color-secondary))'
                        : 'linear(to-tr, gray.800, gray.700)'
                    }
                    color="white"
                    align="center"
                    justify="center"
                    boxShadow={
                      isActive
                        ? '0 8px 20px -4px var(--color-primary-soft)'
                        : '0 6px 14px -4px rgba(0, 0, 0, 0.25)'
                    }
                    transition="all 0.25s ease"
                  >
                    <Icon as={item.icon} boxSize="20px" strokeWidth={2.3} />
                  </Flex>
                </MotionFlex>

                <Text
                  fontSize="10px"
                  fontWeight={isActive ? '800' : '600'}
                  color={isActive ? activeColor : inactiveColor}
                  mt={0.5}
                  lineHeight="1"
                  letterSpacing="-0.01em"
                >
                  {item.label}
                </Text>
              </Flex>
            );
          }

          // ─── SIDE TABS (Categories, Shops, Cart, Account) ───────────────
          return (
            <MotionFlex
              key={item.label}
              flex="1"
              h="50px"
              direction="column"
              align="center"
              justify="center"
              position="relative"
              cursor="pointer"
              borderRadius="xl"
              onClick={() => handleNavClick(item)}
              whileTap={{ scale: 0.92 }}
              role="button"
              aria-label={item.label}
            >
              {/* Shared Sliding Background Pill for Active Side Tab */}
              {/* {isActive && (
                <MotionBox
                  layoutId="mobileNavActivePill"
                  position="absolute"
                  inset={0}
                  bg={activePillBg}
                  borderRadius="xl"
                  zIndex={0}
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )} */}

              {/* Icon Wrapper with Cart Badge & Spring Animation */}
              <MotionBox
                position="relative"
                zIndex={1}
                animate={
                  item.isCart && cartBounce
                    ? { scale: [1, 1.3, 0.9, 1.05, 1], rotate: [0, -8, 8, 0] }
                    : { y: isActive ? -1.5 : 0, scale: isActive ? 1.08 : 1 }
                }
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 20,
                }}
              >
                <Icon
                  as={item.icon}
                  boxSize="19px"
                  color={isActive ? activeColor : inactiveColor}
                  strokeWidth={isActive ? 2.4 : 2}
                  transition="color 0.2s ease"
                />

                {/* Live Cart Counter Badge */}
                {item.isCart && isMounted && totalCartItems > 0 && (
                  <Badge
                    position="absolute"
                    top="-6px"
                    right="-10px"
                    bgGradient="linear(to-r, orange.500, red.500)"
                    color="white"
                    borderRadius="full"
                    fontSize="9px"
                    fontWeight="800"
                    px={1.5}
                    minW="17px"
                    h="17px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    border="2px solid"
                    borderColor={centerRingBg}
                    boxShadow="xs"
                  >
                    {totalCartItems > 9 ? '9+' : totalCartItems}
                  </Badge>
                )}

                {/* Logged-In Online Dot on Account Icon */}
                {item.isAccount && isMounted && Boolean(auth?.user) && (
                  <Box
                    position="absolute"
                    top="-2px"
                    right="-3px"
                    w="7px"
                    h="7px"
                    borderRadius="full"
                    bg="green.500"
                    border="1.5px solid"
                    borderColor={centerRingBg}
                  />
                )}
              </MotionBox>

              {/* Tab Label */}
              <Text
                position="relative"
                zIndex={1}
                fontSize="10px"
                fontWeight={isActive ? '700' : '500'}
                color={isActive ? activeColor : inactiveColor}
                mt={0}
                lineHeight="1"
                letterSpacing="-0.01em"
                transition="color 0.2s ease"
              >
                {item.label}
              </Text>

              {/* Top Active Indicator Line */}
              {/* {isActive && (
                <MotionBox
                  layoutId="mobileNavActiveDot"
                  position="absolute"
                  top="2px"
                  w="14px"
                  h="2.5px"
                  borderRadius="full"
                  bgGradient="linear(to-r, var(--color-primary), var(--color-secondary))"
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 28,
                  }}
                />
              )} */}
            </MotionFlex>
          );
        })}
      </Flex>
    </Box>
  );
});

export default MobileBottomNav;