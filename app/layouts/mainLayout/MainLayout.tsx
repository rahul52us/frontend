"use client";

import { Box } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import Header from "./component/Header/Header";
import { Footer } from "./component/Footer/Footer";
import MobileBottomNav from "./component/MobileBottomNav/MobileBottomNav";

import { useParams, usePathname } from "next/navigation";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const params = useParams();
  const pathname = usePathname();
  const isShopPage = !!params?.shopTitle || !!params?.shopId;
  const isProductDetailPage =
    pathname === "/product" ||
    pathname === "/individual-product" ||
    pathname?.startsWith("/product/") ||
    pathname?.startsWith("/individual-product/");

  const hideBottomNav = isShopPage || isProductDetailPage;

  return (
    <Box
      minH="100dvh"
      display="flex"
      flexDirection="column"
      position="relative"
      overflowX="hidden"
      pl="env(safe-area-inset-left, 0px)"
      pr="env(safe-area-inset-right, 0px)"
      bg="var(--color-bg)"
      color="var(--color-text-primary)"
      transition="background-color 0.2s ease, color 0.2s ease"
    >
      <Header />
      <Box as="main" flex="1" w="full">
        {children}
      </Box>
      {!isShopPage && <Footer hideBottomNav={hideBottomNav} />}
      {!hideBottomNav && <MobileBottomNav />}
    </Box>
  );
};

export default MainLayout;
