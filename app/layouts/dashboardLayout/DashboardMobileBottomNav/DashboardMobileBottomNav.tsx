'use client';

import {
  Badge,
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  Text,
  VStack,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FiBox,
  FiClipboard,
  FiExternalLink,
  FiGift,
  FiHome,
  FiLayers,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiPackage,
  FiPieChart,
  FiSettings,
  FiShoppingBag,
  FiSun,
  FiUsers
} from 'react-icons/fi';
import stores from '../../../store/stores';
import { dashboardPalette } from '../dashboardPalette';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

interface NavItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  sidebarId?: number;
  isCenter?: boolean;
  isMore?: boolean;
}

const DashboardMobileBottomNav = observer(() => {
  const router = useRouter();
  const pathname = usePathname() || '/dashboard';
  const { auth } = stores;
  const user = auth?.user;
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen: isMoreOpen, onOpen: onOpenMore, onClose: onCloseMore } = useDisclosure();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Theme styling tokens
  const isDark = colorMode === 'dark';
  const dockBg = useColorModeValue(
    'rgba(255, 255, 255, 0.96)',
    'rgba(11, 17, 32, 0.95)'
  );
  const dockBorder = useColorModeValue(
    'rgba(226, 232, 240, 0.95)',
    dashboardPalette.border || 'rgba(59, 130, 246, 0.18)'
  );
  const activeColor = 'var(--color-primary, #065F68)';
  const inactiveColor = useColorModeValue('#64748B', dashboardPalette.textMuted || '#94A3B8');
  const activePillBg = useColorModeValue(
    'var(--color-primary-soft, rgba(6, 95, 104, 0.08))',
    'var(--color-primary-soft, rgba(6, 95, 104, 0.20))'
  );
  const centerRingBg = useColorModeValue('#FFFFFF', '#0B1120');
  const drawerBg = useColorModeValue('#FFFFFF', '#0B1120');
  const drawerBorder = useColorModeValue('#E2E8F0', dashboardPalette.border || 'rgba(6, 95, 104, 0.22)');
  const drawerItemHoverBg = useColorModeValue('gray.50', 'rgba(255, 255, 255, 0.05)');

  // Identify role
  const normalizedRoles = Array.isArray(user?.role)
    ? user.role.filter(Boolean)
    : [user?.role].filter(Boolean);

  const isSuperAdmin =
    user?.type === 'superAdmin' ||
    user?.role === 'superAdmin' ||
    normalizedRoles.includes('superAdmin') ||
    pathname.startsWith('/dashboard/super-admin');

  // SuperAdmin Navigation Items - Center Tab is Dashboard
  const superAdminNavItems: NavItem[] = [
    {
      id: 'admin-shops',
      label: 'Shops',
      icon: FiShoppingBag,
      path: '/dashboard/super-admin/shops',
      sidebarId: 103,
    },
    {
      id: 'admin-categories',
      label: 'Categories',
      icon: FiLayers,
      path: '/dashboard/super-admin/categories',
      sidebarId: 102,
    },
    {
      id: 'admin-dashboard',
      label: 'Dashboard',
      icon: FiPieChart,
      path: '/dashboard/super-admin/index',
      sidebarId: 101,
      isCenter: true,
    },
    {
      id: 'admin-products',
      label: 'Products',
      icon: FiBox,
      path: '/dashboard/super-admin/products',
      sidebarId: 104,
    },
    {
      id: 'admin-more',
      label: 'More',
      icon: FiMenu,
      path: '',
      isMore: true,
    },
  ];

  // Seller Navigation Items - Center Tab is Dashboard
  const sellerNavItems: NavItem[] = [
    {
      id: 'seller-shop',
      label: 'Shop',
      icon: FiShoppingBag,
      path: '/dashboard/shop',
      sidebarId: 2,
    },
    {
      id: 'seller-products',
      label: 'Products',
      icon: FiPackage,
      path: '/dashboard/products',
      sidebarId: 6,
    },
    {
      id: 'seller-home',
      label: 'Dashboard',
      icon: FiHome,
      path: '/dashboard',
      sidebarId: 1,
      isCenter: true,
    },
    {
      id: 'seller-orders',
      label: 'Orders',
      icon: FiClipboard,
      path: '/dashboard/orders',
      sidebarId: 7,
    },
    {
      id: 'seller-customers',
      label: 'Customers',
      icon: FiUsers,
      path: '/dashboard/customers',
      sidebarId: 8,
    },
  ];

  const currentNavItems = isSuperAdmin ? superAdminNavItems : sellerNavItems;

  const isTabActive = (item: NavItem) => {
    if (item.isMore) {
      return (
        pathname.startsWith('/dashboard/super-admin/offers') ||
        pathname.startsWith('/dashboard/super-admin/notifications') ||
        pathname.startsWith('/profile')
      );
    }
    if (item.path === '/dashboard') {
      return pathname === '/dashboard';
    }
    if (item.path === '/dashboard/super-admin/index') {
      return (
        pathname === '/dashboard/super-admin/index' ||
        pathname === '/dashboard/super-admin'
      );
    }
    return pathname.startsWith(item.path);
  };

  const handleNavClick = (item: NavItem) => {
    if (item.isMore) {
      onOpenMore();
      return;
    }

    if (typeof window !== 'undefined' && item.sidebarId) {
      localStorage.setItem('activeSidebarItemId', String(item.sidebarId));
    }

    router.push(item.path);
  };

  const handleDrawerNavigate = (url: string, sidebarId?: number) => {
    onCloseMore();
    if (typeof window !== 'undefined' && sidebarId) {
      localStorage.setItem('activeSidebarItemId', String(sidebarId));
    }
    router.push(url);
  };

  const handleLogout = async () => {
    onCloseMore();
    if (auth?.doLogout) {
      await auth.doLogout();
    } else if (auth?.logout) {
      await auth.logout();
    }
    router.push('/login');
  };

  if (!isMounted) return null;

  return (
    <>
      <Box
        as="nav"
        aria-label="Dashboard Mobile Navigation"
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        zIndex={1000}
        display={{ base: 'block', lg: 'none' }}
        bg={dockBg}
        backdropFilter="blur(20px)"
        borderTop="1px solid"
        borderColor={dockBorder}
        boxShadow="0 -4px 24px rgba(0, 0, 0, 0.08)"
        pt={1}
        pb="max(env(safe-area-inset-bottom, 0px), 8px)"
        transition="background-color 0.25s ease, border-color 0.25s ease"
      >
        <Flex
          w="full"
          maxW="560px"
          mx="auto"
          h="56px"
          justify="space-around"
          align="center"
          px={2}
          position="relative"
        >
          {currentNavItems.map((item) => {
            const isActive = isTabActive(item);

            // ─── CENTER ELEVATED BUTTON ───────────────────────────────────
            if (item.isCenter) {
              return (
                <Flex
                  key={item.id}
                  flex="1"
                  direction="column"
                  align="center"
                  justify="center"
                  position="relative"
                  h="full"
                  cursor="pointer"
                  onClick={() => handleNavClick(item)}
                  role="button"
                  aria-label={item.label}
                  _focus={{ outline: 'none' }}
                >
                  {/* Floating Action Button */}
                  <MotionFlex
                    mt="-24px"
                    w="52px"
                    h="52px"
                    borderRadius="full"
                    bg={centerRingBg}
                    p="3px"
                    boxShadow={
                      isActive
                        ? '0 10px 24px var(--color-primary-glow, rgba(6, 95, 104, 0.45))'
                        : '0 6px 18px rgba(0, 0, 0, 0.18)'
                    }
                    align="center"
                    justify="center"
                    whileTap={{ scale: 0.92 }}
                    animate={{
                      y: isActive ? -3 : 0,
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
                      bgGradient="linear(135deg, var(--color-primary, #065F68) 0%, var(--color-secondary, #2A8A94) 100%)"
                      color="white"
                      align="center"
                      justify="center"
                      boxShadow="inset 0 1px 2px rgba(255, 255, 255, 0.25)"
                    >
                      <Icon as={item.icon} boxSize="22px" strokeWidth={2.3} />
                    </Flex>
                  </MotionFlex>

                  <Text
                    fontSize="10px"
                    fontWeight={isActive ? '800' : '600'}
                    color={isActive ? activeColor : inactiveColor}
                    mt={1}
                    lineHeight="1"
                    letterSpacing="-0.01em"
                  >
                    {item.label}
                  </Text>
                </Flex>
              );
            }

            // ─── STANDARD SIDE TABS ───────────────────────────────────────
            return (
              <MotionFlex
                key={item.id}
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
                {/* Active Indicator Background Pill */}
                {isActive && (
                  <MotionBox
                    layoutId="dashboardMobileNavPill"
                    position="absolute"
                    inset="3px 4px"
                    bg={activePillBg}
                    borderRadius="xl"
                    zIndex={0}
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}

                {/* Top Active Line - breathing space above icon */}
                {isActive && (
                  <MotionBox
                    layoutId="dashboardMobileActiveDot"
                    position="absolute"
                    top="-1px"
                    w="20px"
                    h="3px"
                    borderRadius="full"
                    bgGradient="linear(to-r, var(--color-primary, #065F68), var(--color-secondary, #2A8A94))"
                    boxShadow="0 2px 6px var(--color-primary-glow, rgba(6, 95, 104, 0.35))"
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 28,
                    }}
                  />
                )}

                {/* Icon Wrapper */}
                <MotionBox
                  position="relative"
                  zIndex={1}
                  mt="5px"
                  animate={{
                    y: isActive ? -1 : 0,
                    scale: isActive ? 1.08 : 1,
                  }}
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
                </MotionBox>

                {/* Tab Label */}
                <Text
                  position="relative"
                  zIndex={1}
                  fontSize="10px"
                  fontWeight={isActive ? '700' : '500'}
                  color={isActive ? activeColor : inactiveColor}
                  mt={1}
                  lineHeight="1"
                  letterSpacing="-0.01em"
                  transition="color 0.2s ease"
                >
                  {item.label}
                </Text>
              </MotionFlex>
            );
          })}
        </Flex>
      </Box>

      {/* ─── MORE DRAWER FOR SUPERADMIN & ADDITIONAL ACTIONS ───────── */}
      <Drawer isOpen={isMoreOpen} placement="bottom" onClose={onCloseMore}>
        <DrawerOverlay backdropFilter="blur(6px)" />
        <DrawerContent
          bg={drawerBg}
          borderTopRadius="24px"
          borderTop="1px solid"
          borderColor={drawerBorder}
          boxShadow="0 -10px 40px rgba(0, 0, 0, 0.25)"
          maxW="560px"
          mx="auto"
          pb="max(env(safe-area-inset-bottom, 0px), 16px)"
        >
          {/* Subtle Pull Indicator Bar */}
          <Flex justify="center" pt={3} pb={1}>
            <Box w="36px" h="4px" borderRadius="full" bg={drawerBorder} />
          </Flex>

          <DrawerCloseButton top={4} right={4} />

          <DrawerHeader pt={2} pb={3}>
            <HStack spacing={2} align="center">
              <Text fontSize="lg" fontWeight="800">
                {isSuperAdmin ? 'Admin Center' : 'Menu & Settings'}
              </Text>
              {isSuperAdmin && (
                <Badge
                  colorScheme="purple"
                  variant="subtle"
                  borderRadius="full"
                  px={2}
                  fontSize="10px"
                >
                  Super Admin
                </Badge>
              )}
            </HStack>
          </DrawerHeader>

          <DrawerBody px={4} pb={4}>
            <VStack spacing={2} align="stretch">
              {/* SuperAdmin Quick Links */}
              {isSuperAdmin && (
                <>
                  <Flex
                    as="button"
                    onClick={() => handleDrawerNavigate('/dashboard/super-admin/offers', 105)}
                    align="center"
                    gap={3}
                    p={3}
                    borderRadius="16px"
                    _hover={{ bg: drawerItemHoverBg }}
                    transition="all 0.15s ease"
                    textAlign="left"
                  >
                    <Flex
                      w="40px"
                      h="40px"
                      borderRadius="12px"
                      bg="rgba(245, 158, 11, 0.12)"
                      color="orange.400"
                      align="center"
                      justify="center"
                    >
                      <Icon as={FiGift} boxSize={5} />
                    </Flex>
                    <Box flex="1">
                      <Text fontSize="sm" fontWeight="700">
                        Offers & Coupons
                      </Text>
                      <Text fontSize="xs" color={inactiveColor}>
                        Manage platform campaigns & discounts
                      </Text>
                    </Box>
                  </Flex>

                  <Flex
                    as="button"
                    onClick={() => handleDrawerNavigate('/dashboard/super-admin/notifications', 106)}
                    align="center"
                    gap={3}
                    p={3}
                    borderRadius="16px"
                    _hover={{ bg: drawerItemHoverBg }}
                    transition="all 0.15s ease"
                    textAlign="left"
                  >
                    <Flex
                      w="40px"
                      h="40px"
                      borderRadius="12px"
                      bg="rgba(59, 130, 246, 0.12)"
                      color="brand.400"
                      align="center"
                      justify="center"
                    >
                      <Icon as={FiClipboard} boxSize={5} />
                    </Flex>
                    <Box flex="1">
                      <Text fontSize="sm" fontWeight="700">
                        Notifications & Alerts
                      </Text>
                      <Text fontSize="xs" color={inactiveColor}>
                        Send broadcast notices to sellers & buyers
                      </Text>
                    </Box>
                  </Flex>
                </>
              )}

              {/* Profile & Account Settings */}
              <Flex
                as="button"
                onClick={() => handleDrawerNavigate('/profile', 34)}
                align="center"
                gap={3}
                p={3}
                borderRadius="16px"
                _hover={{ bg: drawerItemHoverBg }}
                transition="all 0.15s ease"
                textAlign="left"
              >
                <Flex
                  w="40px"
                  h="40px"
                  borderRadius="12px"
                  bg="rgba(99, 102, 241, 0.12)"
                  color="indigo.400"
                  align="center"
                  justify="center"
                >
                  <Icon as={FiSettings} boxSize={5} />
                </Flex>
                <Box flex="1">
                  <Text fontSize="sm" fontWeight="700">
                    Profile & Settings
                  </Text>
                  <Text fontSize="xs" color={inactiveColor}>
                    Manage credentials, phone, and account security
                  </Text>
                </Box>
              </Flex>

              {/* View Storefront / Public Website */}
              <Flex
                as="button"
                onClick={() => handleDrawerNavigate('/')}
                align="center"
                gap={3}
                p={3}
                borderRadius="16px"
                _hover={{ bg: drawerItemHoverBg }}
                transition="all 0.15s ease"
                textAlign="left"
              >
                <Flex
                  w="40px"
                  h="40px"
                  borderRadius="12px"
                  bg="rgba(16, 185, 129, 0.12)"
                  color="teal.400"
                  align="center"
                  justify="center"
                >
                  <Icon as={FiExternalLink} boxSize={5} />
                </Flex>
                <Box flex="1">
                  <Text fontSize="sm" fontWeight="700">
                    View Marketplace Store
                  </Text>
                  <Text fontSize="xs" color={inactiveColor}>
                    Switch to buyer marketplace view
                  </Text>
                </Box>
              </Flex>

              {/* Theme Mode Switcher */}
              <Flex
                as="button"
                onClick={toggleColorMode}
                align="center"
                gap={3}
                p={3}
                borderRadius="16px"
                _hover={{ bg: drawerItemHoverBg }}
                transition="all 0.15s ease"
                textAlign="left"
              >
                <Flex
                  w="40px"
                  h="40px"
                  borderRadius="12px"
                  bg="rgba(139, 92, 246, 0.12)"
                  color="purple.400"
                  align="center"
                  justify="center"
                >
                  <Icon as={isDark ? FiSun : FiMoon} boxSize={5} />
                </Flex>
                <Box flex="1">
                  <Text fontSize="sm" fontWeight="700">
                    {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  </Text>
                  <Text fontSize="xs" color={inactiveColor}>
                    Adjust interface appearance
                  </Text>
                </Box>
              </Flex>

              {/* Sign Out */}
              <Flex
                as="button"
                onClick={handleLogout}
                align="center"
                gap={3}
                p={3}
                borderRadius="16px"
                _hover={{ bg: 'rgba(239, 68, 68, 0.1)' }}
                transition="all 0.15s ease"
                textAlign="left"
                color="red.400"
              >
                <Flex
                  w="40px"
                  h="40px"
                  borderRadius="12px"
                  bg="rgba(239, 68, 68, 0.12)"
                  align="center"
                  justify="center"
                >
                  <Icon as={FiLogOut} boxSize={5} />
                </Flex>
                <Box flex="1">
                  <Text fontSize="sm" fontWeight="700">
                    Log Out
                  </Text>
                  <Text fontSize="xs" color={inactiveColor}>
                    End your active session securely
                  </Text>
                </Box>
              </Flex>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
});

export default DashboardMobileBottomNav;
