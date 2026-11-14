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
      position="relative"
      overflowX="hidden"
      pl="env(safe-area-inset-left, 0px)"
      pr="env(safe-area-inset-right, 0px)"
    >
      <Header />
      <Box
        as="main"
        pb={
          hideBottomNav
            ? "env(safe-area-inset-bottom, 0px)"
            : { base: "calc(88px + env(safe-area-inset-bottom, 0px))", md: 0 }
        }
      >
        {children}
      </Box>
      {!isShopPage && <Footer />}
      {!hideBottomNav && <MobileBottomNav />}
    </Box>
  );
};

export default MainLayout;
