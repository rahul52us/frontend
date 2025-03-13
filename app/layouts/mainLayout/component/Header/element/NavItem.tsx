"use client";
import { Box, Text, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";

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
      fontSize={{ base: "md", md: "sm", lg: "md" }} // Compact yet readable
      color="gray.700"
      cursor="pointer"
      fontWeight="medium"
      px={2}
      py={1}
      position="relative"
      transition="all 0.2s ease"
      _hover={{
        color: "orange.500",
      }}
      onClick={() => {
        router.push(item.link);
        onClose();
      }}
    >
      <Flex alignItems="center" gap={1}>
        <Text as="span">{item.title}</Text>
        <ChevronDownIcon fontSize="sm" color="gray.500" />
      </Flex>
    </Box>
  );
};

export default NavItem;