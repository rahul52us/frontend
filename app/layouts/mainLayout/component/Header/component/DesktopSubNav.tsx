"use client";

import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";
import { FiGrid, FiTrendingUp } from "react-icons/fi";
import NavItemsLayout from "./NavItemsLayout";

const QuickLinks = [
  { label: "Today's Deals", path: "/deals" },
  { label: "New Arrivals", path: "/new-arrivals" },
  { label: "Top Rated", path: "/top-rated" },
  { label: "Local Sellers", path: "/sellers" },
];

export const DesktopSubNav: React.FC = () => {
  const router = useRouter();

  const subNavBg = useColorModeValue("gray.50", "var(--color-surface-alt)");
  const subNavBorder = useColorModeValue("gray.100", "var(--color-border)");
  const subNavDivider = useColorModeValue("gray.300", "var(--color-border-strong)");
  const subNavText = useColorModeValue("gray.600", "var(--color-text-secondary)");
  const iconColor = useColorModeValue("gray.700", "var(--color-text-primary)");
  const hoverBg = useColorModeValue("white", "var(--color-surface)");

  return (
    <Box
      display={{ base: "none", md: "block" }}
      bg={subNavBg}
      borderTop="1px solid"
      borderColor={subNavBorder}
      px={8}
      py={1}
    >
      <Flex mx="auto" align="center" justify="space-between" gap={4}>
        <HStack spacing={1} overflowX="auto" className="no-scrollbar" py={0.5}>
          <Button
            size="xs"
            variant="ghost"
            color={iconColor}
            fontWeight="600"
            leftIcon={<FiGrid />}
            onClick={() => router.push("/categories")}
            _hover={{ bg: hoverBg, color: "var(--color-primary)" }}
            borderRadius="md"
            px={2.5}
          >
            All Categories
          </Button>

          <Divider orientation="vertical" h="14px" borderColor={subNavDivider} />

          <Box flexShrink={0}>
            <NavItemsLayout />
          </Box>

          <Divider orientation="vertical" h="14px" borderColor={subNavDivider} />

          {QuickLinks.map((item) => (
            <Button
              key={item.label}
              size="xs"
              variant="ghost"
              color={subNavText}
              fontWeight="500"
              onClick={() => router.push(item.path)}
              _hover={{ bg: hoverBg, color: "var(--color-primary)" }}
              borderRadius="md"
              px={2.5}
            >
              {item.label}
            </Button>
          ))}
        </HStack>

        <Button
          size="xs"
          variant="ghost"
          colorScheme="orange"
          leftIcon={<FiTrendingUp />}
          onClick={() => router.push("/trending")}
          borderRadius="full"
          fontWeight="600"
          flexShrink={0}
        >
          Trending
        </Button>
      </Flex>
    </Box>
  );
};

export default DesktopSubNav;

