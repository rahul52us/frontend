"use client";

import { Box } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import Header from "./component/Header/Header";
import { Footer } from "./component/Footer/Footer";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box>
      <Header />
      <Box>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;
