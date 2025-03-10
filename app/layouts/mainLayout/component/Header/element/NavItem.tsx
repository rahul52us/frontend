"use client";
import { Box, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";

interface NavItemProps {
  item: {
    title: string;
    link: string;
  };
  onClose: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ item, onClose }) => {
  const router = useRouter();

  return (
    <Box
      as="span"
      fontSize={{ base: "md", md: "md", lg: "lg" }} // Simple, readable sizes
      color="gray.700" // Soft, neutral color
      cursor="pointer"
      fontWeight="medium"
      px={2}
      py={1}
      position="relative"
      transition="all 0.2s ease"
      _hover={{
        color: "blue.600", // Simple, bold hover color
        transform: "translateY(-1px)", // Minimal lift
      }}
      _after={{
        content: '""',
        position: "absolute",
        bottom: "-2px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "0%",
        height: "2px",
        bg: "blue.600",
        transition: "width 0.2s ease",
      }}

      onClick={() => {
        router.push(item.link);
        onClose();
      }}
    >
      <Text as="span">{item.title}</Text>
    </Box>
  );
};

export default NavItem;