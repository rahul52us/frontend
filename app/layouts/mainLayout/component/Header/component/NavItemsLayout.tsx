"use client";

import { Flex } from "@chakra-ui/react";
import React from "react";
import { navItems } from "../utils/constant";
import NavItem from "../element/NavItem";

interface NavItemType {
  title: string;
  link: string;
}

const NavItemsLayout: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      gap={{ base: 6, md: 3 }} // slightly smoother spacing
      alignItems="center"
      justifyContent="center"
      wrap={{ base: "wrap", md: "nowrap" }}
      px={{ base: 4, md: 0 }}
      transition="all 0.3s ease"
    >
      {navItems.map((item: NavItemType) => (
        <Flex
          key={item.title}
          _hover={{
            transform: "translateY(-2px) scale(1.05)",
          }}
          transition="all 0.25s ease"
        >
          <NavItem
            item={item}
            onClose={onClose || (() => {})}
          />
        </Flex>
      ))}
    </Flex>
  );
};

export default NavItemsLayout;
