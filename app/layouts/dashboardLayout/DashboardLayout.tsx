'use client';

import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Flex, HStack, Icon, IconButton, Spinner, Text, useBreakpointValue, useColorModeValue, useMediaQuery, useTheme } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import stores from '../../store/stores';
// import { authenticastion } from '../../config/utils/routes';
import HeaderLayout from './HeaderLayout/HeaderLayout';
import SidebarLayout from './SidebarLayout/SidebarLayout';
// import PermissionDeniedPage from '../../component/common/Loader/PermissionDeniedPage';
import { FaClipboardList, FaHome, FaPlus, FaStore, FaUsers } from 'react-icons/fa';
import PageLoader from '../../component/common/Loader/PageLoader';
import ThemeChangeContainer from '../../component/common/ThemeChangeContainer/ThemeChangeContainer';
import { contentLargeBodyPadding, contentSmallBodyPadding, headerHeight, mediumSidebarWidth } from '../../component/config/utils/variable';
import { dashboardPalette } from './dashboardPalette';
import { ChevronRightIcon, CloseIcon } from '@chakra-ui/icons';

const MainContainer = styled.div<{ $isMobile: boolean; $bgPattern: string }>`
  display: flex;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  margin-left: ${(props) => (props.$isMobile ? '0px' : mediumSidebarWidth)};
  min-height: 100vh;
  background: ${(props) => props.$bgPattern};
`;

const Container = styled.div<{ $fullScreenMode: boolean }>`
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease-in-out;
  min-height: 100vh;
  width: 100%;
`;

const HeaderContainer = styled.div<{
  $fullScreenMode: boolean;
  $sizeStatus: boolean;
  $mediumScreenMode: boolean;
  $isMobile: boolean;
  $runtimeTopInset: number;
  $bgHeader: string;
  $borderColor: string;
}>`
  z-index: 99;
  height: calc(${headerHeight} + ${({ $runtimeTopInset }) => `${$runtimeTopInset}px`});
  padding-top: ${({ $runtimeTopInset }) => `${$runtimeTopInset}px`};
  box-sizing: border-box;
  position: fixed;
  top: 0;
  right: 0;
  background: ${(props) => props.$bgHeader};
  backdrop-filter: blur(14px);
  border-bottom: 1px solid ${(props) => props.$borderColor};
  left: ${(props) => (props.$isMobile ? '0px' : mediumSidebarWidth)};
  transition: all 0.3s ease-in-out;
`;

const ContentContainer = styled.div<{
  $sizeStatus: boolean;
  $fullScreenMode: boolean;
  $mediumScreenMode: boolean;
  $isMobile: boolean;
  $runtimeTopInset: number;
  $textColor: string;
  $bgContent: string;
  $hasMobileBottomNav: boolean;
}>`
  padding: ${({ $isMobile }) =>
    $isMobile ? `${contentSmallBodyPadding}` : `${contentLargeBodyPadding}`};
  padding-bottom: ${({ $isMobile, $hasMobileBottomNav }) =>
    $isMobile && $hasMobileBottomNav ? '96px' : $isMobile ? `${contentSmallBodyPadding}` : `${contentLargeBodyPadding}`};
  width: ${({ $isMobile }) =>
    $isMobile ? '100vw' : `calc(100vw - ${mediumSidebarWidth})`};
  overflow-x: hidden;
  height: calc(100vh - ${headerHeight} - ${({ $runtimeTopInset }) => `${$runtimeTopInset}px`});
  transition: all 0.3s ease-in-out;
  margin-top: calc(${headerHeight} + ${({ $runtimeTopInset }) => `${$runtimeTopInset}px`});
  color: ${(props) => props.$textColor};
  background: ${(props) => props.$bgContent};
`;

const MobileSellerBottomNav = observer(({ pathname }: { pathname: string }) => {
  const router = useRouter();
  const navBg = useColorModeValue('rgba(255, 255, 255, 0.96)', 'rgba(11, 17, 32, 0.92)');
  const navBorder = useColorModeValue('rgba(226, 232, 240, 0.95)', dashboardPalette.border);
  const activeColor = useColorModeValue('#4568FF', dashboardPalette.accentStrong);
  const mutedColor = useColorModeValue('#64748B', dashboardPalette.textMuted);

  const items = [
    {
      id: 'home',
      label: 'Home',
      icon: FaHome,
      url: '/dashboard',
      sidebarId: 1,
      active: pathname === '/dashboard',
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: FaClipboardList,
      url: '/dashboard/orders',
      sidebarId: 7,
      active: pathname.startsWith('/dashboard/orders'),
    },
    {
      id: 'add',
      label: '',
      icon: FaPlus,
      url: '/dashboard/products',
      sidebarId: 6,
      active: pathname.startsWith('/dashboard/products'),
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: FaUsers,
      url: '/dashboard/customers',
      sidebarId: 8,
      active: pathname.startsWith('/dashboard/customers'),
    },
    {
      id: 'shop',
      label: 'Shop',
      icon: FaStore,
      url: '/dashboard/shop',
      sidebarId: 2,
      active: pathname.startsWith('/dashboard/shop'),
    },
  ];

  const handleNavigate = (url: string, sidebarId: number) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeSidebarItemId', String(sidebarId));
    }
    router.push(url);
  };

  return (
    <Box
      position="fixed"
      left={0}
      right={0}
      bottom={0}
      zIndex={120}
      bg={navBg}
      borderTop="1px solid"
      borderTopColor={navBorder}
      backdropFilter="blur(18px)"
    >
      <Flex
        maxW="560px"
        mx="auto"
        align="flex-end"
        justify="space-between"
        px={4}
        pt={2}
        pb="calc(10px + env(safe-area-inset-bottom, 0px))"
      >
        {items.map((item) => {
          if (item.id === 'add') {
            return (
              <Box
                key={item.id}
                as="button"
                onClick={() => handleNavigate(item.url, item.sidebarId)}
                mt="-26px"
                w="50px"
                h="50px"
                borderRadius="20px"
                bgGradient="linear(135deg, #5B6CFF 0%, #C44AE8 100%)"
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow={item.active ? '0 16px 36px rgba(91, 108, 255, 0.34)' : '0 14px 30px rgba(91, 108, 255, 0.24)'}
                transition="transform 0.18s ease"
                _active={{ transform: 'scale(0.96)' }}
              >
                <Icon as={item.icon} boxSize={5} />
              </Box>
            );
          }

          return (
            <Box
              key={item.id}
              as="button"
              onClick={() => handleNavigate(item.url, item.sidebarId)}
              flex="1"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              gap="4px"
              color={item.active ? activeColor : mutedColor}
              transition="color 0.18s ease"
            >
              <Icon as={item.icon} boxSize={item.active ? 5.5 : 5} />
              <Text fontSize="10px" fontWeight={item.active ? '800' : '600'}>
                {item.label}
              </Text>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
});

const DashboardLayout = observer(({ children }: { children: React.ReactNode }) => {
  const {
    auth: { user },
    layout: { fullScreenMode, mediumScreenMode, isCallapse, openDashSidebarFun, openMobileSideDrawer, setOpenMobileSideDrawer },
    themeStore: { themeConfig },
  } = stores;
  const theme = useTheme();
  const pathname = usePathname();

  const [sizeStatus] = useMediaQuery(`(max-width: ${theme.breakpoints.xl})`);
  const isMobile = useBreakpointValue({ base: true, lg: false }) ?? false;
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const normalizedRoles = Array.isArray(user?.role)
    ? user.role.filter(Boolean)
    : [user?.role].filter(Boolean);
  const hasCompany = Boolean(user?.company?._id || user?.company);
  const isSuperAdmin =
    user?.type === 'superAdmin' ||
    user?.role === 'superAdmin' ||
    normalizedRoles.includes('superAdmin');
  const isBuyerOnlyUser = !isSuperAdmin && !hasCompany && user?.type !== 'seller';
  const showMobileSellerNav = isMobile && !isSuperAdmin && !isBuyerOnlyUser;

  // Navy (#070B14) base with Electric Blue radial glows — elevation replaces near-black
  const bgPagePatternDark = `radial-gradient(circle at top right, rgba(59, 130, 246, 0.10), transparent 28%), radial-gradient(circle at bottom left, rgba(99, 102, 241, 0.08), transparent 32%), ${dashboardPalette.page}`;
  const bgPagePatternLight = `#FFFFFF`;
  const bgPagePattern = useColorModeValue(bgPagePatternLight, bgPagePatternDark);

  // Header: deep navy glass with blue border contrast instead of near-black
  const bgHeaderDark = `linear-gradient(180deg, rgba(11, 17, 32, 0.97) 0%, rgba(11, 17, 32, 0.92) 100%)`;
  const bgHeaderLight = `linear-gradient(180deg, rgba(255, 255, 255, 0.97) 0%, rgba(255, 255, 255, 0.92) 100%)`;
  const bgHeader = useColorModeValue(bgHeaderLight, bgHeaderDark);

  // Content: subtle blue glow + navy gradient — elevation via shell (#0B1120) → page (#070B14)
  const bgContentDark = `radial-gradient(circle at top right, rgba(59, 130, 246, 0.06), transparent 22%), linear-gradient(180deg, ${dashboardPalette.shellElevated} 0%, ${dashboardPalette.page} 100%)`;
  const bgContentLight = `#FFFFFF`;
  const bgContent = useColorModeValue(bgContentLight, bgContentDark);

  const borderColor = useColorModeValue("blue.100", dashboardPalette.border);
  const textColor = useColorModeValue("gray.800", dashboardPalette.text);
  const pageBg = useColorModeValue("#FFFFFF", dashboardPalette.page);

  const closeDrawerModel = () => {
    setOpenMobileSideDrawer(false);
  };

  const handleSidebarItemClick = (item: any) => {
    if (!item.children || item.url) {
      localStorage.setItem('activeComponentName', item.id);
    }
  };
  const shopStatus =
    user?.company && typeof user.company === 'object'
      ? user.company.shopStatus
      : null;
  const reviewStatus =
    user?.company && typeof user.company === 'object'
      ? user.company.reviewStatus
      : null;
  const reviewRemarks =
    user?.company && typeof user.company === 'object'
      ? user.company.reviewRemarks
      : "";

  const [isMounted, setIsMounted] = useState(false);
  const [runtimeTopInset, setRuntimeTopInset] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const platform = (window as any)?.Capacitor?.getPlatform?.();
    if (platform === 'android') {
      setRuntimeTopInset(28);
      return;
    }

    if (platform === 'ios') {
      setRuntimeTopInset(0);
      return;
    }

    setRuntimeTopInset(0);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        openDashSidebarFun(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCallapse, openDashSidebarFun]);

  if (!isMounted) {
    return (
      <PageLoader loading={true}>
        <Spinner />
      </PageLoader>
    );
  }

  const shopStatusBanner:any = (() => {
    if (isSuperAdmin) return null;

    switch (reviewStatus) {
      case 'pending':
        return {
          status: 'warning' as const,
          title: 'Shop under review',
          description:
            "Your shop is waiting for admin approval. You can continue updating your details and inventory while it is under review.",
        };
      case 'changes_requested':
        return {
          status: 'warning' as const,
          title: 'Changes requested by admin',
          description: reviewRemarks
            ? `${reviewRemarks} Update your shop details and save again to resubmit it for review.`
            : 'Admin requested changes to your shop. Update the details and save again to resubmit it for review.',
        };
      case 'rejected':
        return {
          status: 'error' as const,
          title: 'Shop review rejected',
          description: reviewRemarks
            ? `${reviewRemarks} Update the shop and save again when you are ready to resubmit it for review.`
            : 'Your shop review was rejected. Update the shop details and save again when you are ready to resubmit it.',
        };
      default:
        break;
    }

    switch (shopStatus) {
      case 'pending':
        return {
          status: 'warning' as const,
          title: 'Shop under review',
          description:
            "Your shop is waiting for admin approval. You can continue updating your details and inventory while it is under review.",
        };
      case 'inactive':
        return {
          status: 'error' as const,
          title: 'Shop inactive',
          description:
            "Your shop is currently inactive. Your shop and products are hidden from buyers until an admin reactivates it.",
        };
      case 'suspended':
        return {
          status: 'error' as const,
          title: 'Shop suspended',
          description:
            'Your shop is currently suspended. Your shop and products are hidden from buyers while this status is active. Please contact admin or support for help.',
        };
      default:
        return null;
    }
  })();
  const shouldShowLayoutShopBanner = !pathname?.startsWith('/dashboard/shop');

  return user ? (
    <Box bg={pageBg}>
      <MainContainer $isMobile={isMobile} $bgPattern={bgPagePattern}>
        <Box ref={sidebarRef}>
          <SidebarLayout
            onItemClick={handleSidebarItemClick}
            isCollapsed={isCallapse}
            onLeafItemClick={handleSidebarItemClick}
            openMobileSideDrawer={openMobileSideDrawer}
            setOpenMobileSideDrawer={closeDrawerModel}
          />
        </Box>
        <Container $fullScreenMode={fullScreenMode}>
          <HeaderContainer
            $isMobile={isMobile}
            $sizeStatus={sizeStatus}
            $mediumScreenMode={mediumScreenMode}
            $fullScreenMode={fullScreenMode}
            $runtimeTopInset={runtimeTopInset}
            $bgHeader={bgHeader}
            $borderColor={borderColor}
          >
            <HeaderLayout />
          </HeaderContainer>
     <ContentContainer
  $isMobile={isMobile}
  $mediumScreenMode={mediumScreenMode}
  className={
    fullScreenMode ? "fullscreen" : mediumScreenMode ? "mediumScreen" : ""
  }
  $fullScreenMode={fullScreenMode}
  $sizeStatus={sizeStatus}
  $runtimeTopInset={runtimeTopInset}
  $textColor={textColor}
  $bgContent={bgContent}
  $hasMobileBottomNav={showMobileSellerNav}
>
  {shopStatusBanner && shouldShowLayoutShopBanner ? (
    <Alert
      status={shopStatusBanner.status}
      variant="unstyled" // Strips default bulky styling
      mb={2}
      display="flex"
      flexDirection="row"
      alignItems="center"
      bg={useColorModeValue("white", dashboardPalette?.surfaceAlt || "gray.800")}
      border="1px solid"
      borderColor={
        shopStatusBanner.status === "error"
          ? useColorModeValue("red.100", "rgba(248, 113, 113, 0.15)")
          : useColorModeValue("orange.200", "rgba(234, 88, 12, 0.15)")
      }
      borderRadius={{ base: "xl", md: "2xl" }}
      p={{ base: 2, md: 4 }}
      boxShadow={useColorModeValue(
        "0 4px 12px rgba(0, 0, 0, 0.02)",
        "0 8px 24px rgba(0, 0, 0, 0.2)"
      )}
      position="relative"
      overflow="hidden"
    >
      {/* Decorative subtle background glow */}
      <Box
        position="absolute"
        top="-20px"
        left="-20px"
        w="100px"
        h="80px"
        bg={shopStatusBanner.status === "error" ? "red.400" : "orange.400"}
        filter="blur(40px)"
        opacity={useColorModeValue(0.15, 0.1)}
        zIndex={0}
      />

      <Flex w="full" align="center" gap={{ base: 3, md: 4 }} zIndex={1}>
        {/* Modern Icon Container */}
        <Flex
          justify="center"
          align="center"
          w={{ base: "36px", md: "44px" }}
          h={{ base: "36px", md: "44px" }}
          borderRadius="full"
          bg={
            shopStatusBanner.status === "error"
              ? useColorModeValue("red.50", "rgba(248, 113, 113, 0.1)")
              : useColorModeValue("orange.50", "rgba(234, 88, 12, 0.1)")
          }
          flexShrink={0}
        >
          <AlertIcon w={{ base: 4, md: 5 }} h={{ base: 4, md: 5 }} m={0} />
        </Flex>

        {/* Text Content */}
        <Box flex="1" minW={0}>
          <Text
            fontWeight="700"
            fontSize={{ base: "sm", md: "md" }}
            color={textColor}
            lineHeight="1.2"
            noOfLines={1}
          >
            {shopStatusBanner.title}
          </Text>
          <Text
            fontSize={{ base: "xs", md: "sm" }}
            color={useColorModeValue("gray.600", "gray.400")}
            mt={0.5}
            noOfLines={{ base: 1, md: 2 }} // Truncates on mobile to save massive space
          >
            {shopStatusBanner.description}
          </Text>
        </Box>

        {/* Action Indicator (Shows the user they can interact with it) */}
        <IconButton
          aria-label="View details"
          icon={<ChevronRightIcon w={5} h={5} />}
          size="sm"
          variant="ghost"
          colorScheme={shopStatusBanner.status === "error" ? "red" : "orange"}
          borderRadius="full"
          flexShrink={0}
        />
      </Flex>
    </Alert>
  ) : null}
  {children}
</ContentContainer>
        </Container>
      </MainContainer>
      {showMobileSellerNav ? <MobileSellerBottomNav pathname={pathname || '/dashboard'} /> : null}
      <ThemeChangeContainer />
    </Box>
  ) : (
    <PageLoader loading={true}>
      <Spinner />
    </PageLoader>
    // <RedirectComponent />
  );
});

export default DashboardLayout;
