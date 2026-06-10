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
      gap={{ base: 4, md: 1 }}
      alignItems="center"
      justifyContent="center"
      wrap={{ base: "wrap", md: "nowrap" }}
    >
      {navItems.map((item: NavItemType) => (
        <NavItem item={item} key={item.title} onClose={onClose || (() => {})} />
      ))}
    </Flex>
  );
};

export default NavItemsLayout;