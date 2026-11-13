"use client";
import { Flex } from "@chakra-ui/react";
import React from "react";
import NavItem from "../element/NavItem";
import { navItems } from "../utils/constant";

export interface NavItemType {
  title: string;
  link: string;
  children?: { title: string; link: string }[];
}

const NavItemsLayout: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      gap={{ base: 0.5, md: 1 }}
      alignItems={{ base: "stretch", md: "center" }}
      justifyContent={{ base: "flex-start", md: "center" }}
      wrap="nowrap"
      w="full"
    >
      {navItems.map((item: NavItemType) => (
        <NavItem
          item={item}
          key={item.title}
          onClose={onClose || (() => {})}
        />
      ))}
    </Flex>
  );
};

export default NavItemsLayout;