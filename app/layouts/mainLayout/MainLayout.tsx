"use client";

import { Box } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import Header from "./component/Header/Header";
import { Footer } from "./component/Footer/Footer";
import MobileBottomNav from "./component/MobileBottomNav/MobileBottomNav";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box>
      <Header />
      <Box pb={{ base: '60px', md: 0 }}>
        {children}
      </Box>
      <Footer />
      <MobileBottomNav />
    </Box>
  );
};

export default MainLayout;
