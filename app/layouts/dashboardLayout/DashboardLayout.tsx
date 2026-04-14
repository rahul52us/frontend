'use client';

import { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Spinner, useBreakpointValue, useColorModeValue, useMediaQuery, useTheme } from '@chakra-ui/react';
import styled from 'styled-components';
import { usePathname } from 'next/navigation';
import stores from '../../store/stores';
// import { authenticastion } from '../../config/utils/routes';
import SidebarLayout from './SidebarLayout/SidebarLayout';
import HeaderLayout from './HeaderLayout/HeaderLayout';
// import PermissionDeniedPage from '../../component/common/Loader/PermissionDeniedPage';
import { contentLargeBodyPadding, contentSmallBodyPadding, headerHeight, mediumSidebarWidth } from '../../component/config/utils/variable';
import ThemeChangeContainer from '../../component/common/ThemeChangeContainer/ThemeChangeContainer';
import PageLoader from '../../component/common/Loader/PageLoader';


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

  const closeDrawerModel = () => {
    setOpenMobileSideDrawer(false);
  };

  const handleSidebarItemClick = (item: any) => {
    if (!item.children || item.url) {
      localStorage.setItem('activeComponentName', item.id);
    }
  };
  const headerBackgroundColor = useColorModeValue(
    themeConfig.colors.custom.light.primary,
    themeConfig.colors.custom.dark.primary
  );
  const isSuperAdmin =
    user?.type === 'superAdmin' ||
    user?.role === 'superAdmin' ||
    (Array.isArray(user?.role) && user.role.includes('superAdmin'));
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

  const shopStatusBanner = (() => {
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
    <Box
    >
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
        <Container $fullScreenMode={fullScreenMode}>
          <HeaderContainer
            $isMobile={isMobile}
            $sizeStatus={sizeStatus}
            $mediumScreenMode={mediumScreenMode}
            $fullScreenMode={fullScreenMode}
            $backgroundColor={headerBackgroundColor}
            $runtimeTopInset={runtimeTopInset}
          >
            <HeaderLayout />
          </HeaderContainer>
          <ContentContainer
            $isMobile={isMobile}
            $mediumScreenMode={mediumScreenMode}
            className={
              fullScreenMode ? 'fullscreen' : mediumScreenMode ? 'mediumScreen' : ''
            }
            $fullScreenMode={fullScreenMode}
            $sizeStatus={sizeStatus}
            $runtimeTopInset={runtimeTopInset}
          >
            {shopStatusBanner && shouldShowLayoutShopBanner ? (
              <Alert
                status={shopStatusBanner.status}
                variant="left-accent"
                borderRadius="xl"
                mb={4}
                alignItems="flex-start"
                boxShadow="sm"
              >
                <AlertIcon mt={1} />
                <Box>
                  <AlertTitle>{shopStatusBanner.title}</AlertTitle>
                  <AlertDescription>{shopStatusBanner.description}</AlertDescription>
                </Box>
              </Alert>
            ) : null}
            {children}
          </ContentContainer>
        </Container>
      </MainContainer>
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

const MainContainer = styled.div<{ $isMobile: boolean }>`
  display: flex;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  margin-left: ${(props) => (props.$isMobile ? '0px' : mediumSidebarWidth)};
`;

const Container = styled.div<{ $fullScreenMode: boolean }>`
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease-in-out;
`;

const HeaderContainer = styled.div<{
  $fullScreenMode: boolean;
  $sizeStatus: boolean;
  $mediumScreenMode: boolean;
  $backgroundColor: string;
  $isMobile: boolean;
  $runtimeTopInset: number;
}>`
  z-index: 99;
  height: calc(${headerHeight} + ${({ $runtimeTopInset }) => `${$runtimeTopInset}px`});
  padding-top: ${({ $runtimeTopInset }) => `${$runtimeTopInset}px`};
  box-sizing: border-box;
  position: fixed;
  top: 0;
  right: 0;
  background-color: ${(props) => props.$backgroundColor};
  left: ${(props) => (props.$isMobile ? '0px' : mediumSidebarWidth)};
  transition: all 0.3s ease-in-out;
`;

const ContentContainer = styled.div<{
  $sizeStatus: boolean;
  $fullScreenMode: boolean;
  $mediumScreenMode: boolean;
  $isMobile: boolean;
  $runtimeTopInset: number;
}>`
  padding: ${({ $isMobile }) =>
    $isMobile ? `${contentSmallBodyPadding}` : `${contentLargeBodyPadding}`};
  width: ${({ $isMobile }) =>
    $isMobile ? '100vw' : `calc(100vw - ${mediumSidebarWidth})`};
  overflow-x: hidden;
  height: calc(100vh - ${headerHeight} - ${({ $runtimeTopInset }) => `${$runtimeTopInset}px`});
  transition: all 0.3s ease-in-out;
  margin-top: calc(${headerHeight} + ${({ $runtimeTopInset }) => `${$runtimeTopInset}px`});
`;
