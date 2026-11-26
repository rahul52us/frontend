'use client';

import { Alert, AlertIcon, Box, Flex, HStack, Icon, IconButton, Spinner, Text, useBreakpointValue, useColorModeValue, useMediaQuery, useTheme } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import stores from '../../store/stores';
// import { authenticastion } from '../../config/utils/routes';
import HeaderLayout from './HeaderLayout/HeaderLayout';
import SidebarLayout from './SidebarLayout/SidebarLayout';
import DashboardMobileBottomNav from './DashboardMobileBottomNav/DashboardMobileBottomNav';
import { ChevronRightIcon, CloseIcon } from '@chakra-ui/icons';
import PageLoader from '../../component/common/Loader/PageLoader';
import ThemeChangeContainer from '../../component/common/ThemeChangeContainer/ThemeChangeContainer';
import { contentLargeBodyPadding, contentSmallBodyPadding, headerHeight, mediumSidebarWidth, sidebarWidth } from '../../component/config/utils/variable';
import { dashboardPalette } from './dashboardPalette';
import useRegisterOverlay from '../../hooks/useRegisterOverlay';

const MainContainer = styled.div<{ $isMobile: boolean }>`
  display: flex;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  min-height: 100vh;
  background: transparent;
`;

const Container = styled.div<{ $fullScreenMode: boolean; $sidebarOffset: string }>`
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease-in-out;
  min-height: 100vh;
  width: ${({ $sidebarOffset }) => `calc(100% - ${$sidebarOffset})`};
  margin-left: ${({ $sidebarOffset }) => $sidebarOffset};
`;

const HeaderContainer = styled.div<{
  $fullScreenMode: boolean;
  $sizeStatus: boolean;
  $mediumScreenMode: boolean;
  $isMobile: boolean;
  $runtimeTopInset: number;
  $bgHeader: string;
  $borderColor: string;
  $sidebarOffset: string;
}>`
  z-index: 99;
  height: calc(${({ $isMobile }) => ($isMobile ? '52px' : headerHeight)} + var(--safe-area-top, env(safe-area-inset-top, 0px)));
  padding-top: var(--safe-area-top, env(safe-area-inset-top, 0px));
  box-sizing: border-box;
  position: fixed;
  top: 0;
  right: 0;
  background: ${(props) => props.$bgHeader};
  backdrop-filter: blur(14px);
  border-bottom: 1px solid ${(props) => props.$borderColor};
  left: ${({ $sidebarOffset }) => $sidebarOffset};
  transition: all 0.3s ease-in-out;
`;

const ContentContainer = styled.div<{
  $sizeStatus: boolean;
  $fullScreenMode: boolean;
  $mediumScreenMode: boolean;
  $isMobile: boolean;
  $runtimeTopInset: number;
  $textColor: string;
  $hasMobileBottomNav: boolean;
  $sidebarOffset: string;
}>`
  padding: 0;
  padding-bottom: ${({ $isMobile, $hasMobileBottomNav }) =>
    $isMobile && $hasMobileBottomNav
      ? 'calc(76px + env(safe-area-inset-bottom, 0px))'
      : '0px'};
  width: 100%;
  overflow-x: clip;
  overflow-y: visible;
  min-height: calc(100vh - ${({ $isMobile }) => ($isMobile ? '52px' : headerHeight)} - var(--safe-area-top, env(safe-area-inset-top, 0px)));
  transition: all 0.3s ease-in-out;
  margin-top: calc(${({ $isMobile }) => ($isMobile ? '52px' : headerHeight)} + var(--safe-area-top, env(safe-area-inset-top, 0px)));
  color: ${(props) => props.$textColor};
  background: transparent;

  @media (max-width: 1023px) {
    padding-bottom: calc(76px + env(safe-area-inset-bottom, 0px));
  }
`;

const DashboardLayout = observer(({ children }: { children: React.ReactNode }) => {
  const {
    auth: { user },
    layout: { fullScreenMode, mediumScreenMode, isCallapse, openDashSidebarFun, openMobileSideDrawer, setOpenMobileSideDrawer },
    themeStore: { themeConfig },
  } = stores;
  const theme = useTheme();
  const pathname = usePathname() || '/dashboard';

  const [sizeStatus] = useMediaQuery(`(max-width: ${theme.breakpoints.xl})`);
  const isMobile = useBreakpointValue({ base: true, lg: false }) ?? false;
  const sidebarRef = useRef<any>(null);
  const normalizedRoles = Array.isArray(user?.role)
    ? user.role.filter(Boolean)
    : [user?.role].filter(Boolean);
  const hasCompany = Boolean(user?.company?._id || user?.company);
  const isSellerShop = user?.company?.companyType === "seller_shop" || hasCompany;
  const isSuperAdmin =
    user?.type === 'superAdmin' ||
    user?.role === 'superAdmin' ||
    normalizedRoles.includes('superAdmin') ||
    pathname.startsWith('/dashboard/super-admin');
  const isSeller = isSellerShop || user?.type === 'seller' || user?.role === 'seller';
  const isBuyerOnlyUser = !isSuperAdmin && !isSeller;
  const showMobileBottomNav = isMobile && !isBuyerOnlyUser;

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

  // Register dashboard side drawer for native back button dismissal
  useRegisterOverlay(openMobileSideDrawer, closeDrawerModel, 'dashboard_side_drawer');

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
  const [dismissedBannerKey, setDismissedBannerKey] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedKey = window.localStorage.getItem('dismissedShopStatusBannerKey');
    setDismissedBannerKey(storedKey);
  }, []);

  const shopBannerBg = useColorModeValue("white", dashboardPalette.surfaceAlt || "gray.800");
  const shopBannerShadow = useColorModeValue(
    "0 4px 12px rgba(0, 0, 0, 0.02)",
    "0 8px 24px rgba(0, 0, 0, 0.2)"
  );
  const shopBannerGlowOpacity = useColorModeValue(0.15, 0.1);
  const shopBannerBorderError = useColorModeValue("red.100", "rgba(248, 113, 113, 0.15)");
  const shopBannerBorderWarning = useColorModeValue("orange.200", "rgba(234, 88, 12, 0.15)");
  const shopBannerIconBgError = useColorModeValue("red.50", "rgba(248, 113, 113, 0.1)");
  const shopBannerIconBgWarning = useColorModeValue("orange.50", "rgba(234, 88, 12, 0.1)");
  const shopBannerDescriptionColor = useColorModeValue("gray.600", "gray.400");

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
  const shopStatusBannerKey = shopStatusBanner
    ? JSON.stringify({
        reviewStatus: reviewStatus || null,
        shopStatus: shopStatus || null,
        reviewRemarks: reviewRemarks || '',
      })
    : null;
  const shouldShowLayoutShopBanner = !pathname?.startsWith('/dashboard/shop');

  const closeShopStatusBanner = () => {
    if (!shopStatusBannerKey || typeof window === 'undefined') return;
    window.localStorage.setItem('dismissedShopStatusBannerKey', shopStatusBannerKey);
    setDismissedBannerKey(shopStatusBannerKey);
  };

  const shouldRenderShopStatusBanner =
    Boolean(shopStatusBanner) &&
    shouldShowLayoutShopBanner &&
    dismissedBannerKey !== shopStatusBannerKey;
  const isErrorBanner = shopStatusBanner?.status === 'error';
  const shopBannerBorder = isErrorBanner ? shopBannerBorderError : shopBannerBorderWarning;
  const shopBannerIconBg = isErrorBanner ? shopBannerIconBgError : shopBannerIconBgWarning;
  const sidebarOffset = isMobile ? '0px' : isCallapse ? mediumSidebarWidth : sidebarWidth;

  return user ? (
    <Box bg={pageBg} minH="100vh">
      <MainContainer $isMobile={isMobile}>
        <Box ref={sidebarRef}>
          <SidebarLayout
            onItemClick={handleSidebarItemClick}
            isCollapsed={isCallapse}
            onLeafItemClick={handleSidebarItemClick}
            openMobileSideDrawer={openMobileSideDrawer}
            setOpenMobileSideDrawer={closeDrawerModel}
          />
        </Box>
        <Container $fullScreenMode={fullScreenMode} $sidebarOffset={sidebarOffset}>
          <HeaderContainer
            $isMobile={isMobile}
            $sizeStatus={sizeStatus}
            $mediumScreenMode={mediumScreenMode}
            $fullScreenMode={fullScreenMode}
            $runtimeTopInset={runtimeTopInset}
            $bgHeader={bgHeader}
            $borderColor={borderColor}
            $sidebarOffset={sidebarOffset}
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
  $hasMobileBottomNav={showMobileBottomNav}
  $sidebarOffset={sidebarOffset}
>
  {shouldRenderShopStatusBanner ? (
        <Box px={{ base: 3, sm: 4, md: 5 }} pt={{ base: 2, md: 3 }} pb={1}>
          <Alert
            status={shopStatusBanner.status}
            variant="unstyled"
            display="flex"
            flexDirection="row"
            alignItems="center"
            bg={shopBannerBg}
            border="1px solid"
            borderColor={shopBannerBorder}
            borderRadius={{ base: "xl", md: "2xl" }}
            p={{ base: 2, md: 4 }}
            boxShadow={shopBannerShadow}
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top="-20px"
              left="-20px"
              w="100px"
              h="80px"
              bg={shopStatusBanner.status === "error" ? "red.400" : "orange.400"}
              filter="blur(40px)"
              opacity={shopBannerGlowOpacity}
              zIndex={0}
            />

            <Flex w="full" align="center" gap={{ base: 3, md: 4 }} zIndex={1}>
              <Flex
                justify="center"
                align="center"
                w={{ base: "36px", md: "44px" }}
                h={{ base: "36px", md: "44px" }}
                borderRadius="full"
                bg={shopBannerIconBg}
                flexShrink={0}
              >
                <AlertIcon w={{ base: 4, md: 5 }} h={{ base: 4, md: 5 }} m={0} />
              </Flex>

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
                  color={shopBannerDescriptionColor}
                  mt={0.5}
                  noOfLines={{ base: 1, md: 2 }}
                >
                  {shopStatusBanner.description}
                </Text>
              </Box>

              <HStack spacing={1} flexShrink={0}>
                <IconButton
                  aria-label="Banner details"
                  icon={<ChevronRightIcon w={5} h={5} />}
                  size="sm"
                  variant="ghost"
                  colorScheme={shopStatusBanner.status === "error" ? "red" : "orange"}
                  borderRadius="full"
                />
                <IconButton
                  aria-label="Dismiss status banner"
                  icon={<CloseIcon boxSize={2.5} />}
                  size="sm"
                  variant="ghost"
                  onClick={closeShopStatusBanner}
                  colorScheme={shopStatusBanner.status === "error" ? "red" : "orange"}
                  borderRadius="full"
                />
              </HStack>
            </Flex>
          </Alert>
        </Box>
  ) : null}
  {children}
</ContentContainer>
        </Container>
      </MainContainer>
      {showMobileBottomNav ? <DashboardMobileBottomNav /> : null}
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
