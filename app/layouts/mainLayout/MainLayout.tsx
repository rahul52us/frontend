"use client";

import { Box } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import Header from "./component/Header/Header";
import { Footer } from "./component/Footer/Footer";
import MobileBottomNav from "./component/MobileBottomNav/MobileBottomNav";

import { useParams } from "next/navigation";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const params = useParams();
  const isShopPage = !!params?.shopTitle || !!params?.shopId;

  return (
    <Box>
      <Header />
      <Box pb={isShopPage ? 0 : { base: '60px', md: 0 }}>
        {children}
      </Box>
      {!isShopPage && <Footer />}
      {!isShopPage && <MobileBottomNav />}
    </Box>
  );
};

export default MainLayout;
