"use client";

import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Collapse,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface NavItemProps {
  item: {
    title: string;
    link: string;
    children?: { title: string; link: string }[];
  };
  onClose: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ item, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const hasChildren = Boolean(item.children?.length);

  // Separate disclosure for mobile accordion
  const { isOpen, onToggle } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const isActive =
    pathname === item.link ||
    item.children?.some((child) => pathname === child.link);

  // Theme-aware styles for active & hover states
  const activeBg = useColorModeValue("white", "rgba(6, 95, 104, 0.18)");
  const activeColor = useColorModeValue("var(--color-primary)", "brand.200");
  const inactiveColor = useColorModeValue("gray.600", "var(--color-text-secondary)");
  const activeGlow = useColorModeValue(
    "0 1px 3px rgba(0, 0, 0, 0.08)",
    "0 0 14px rgba(42, 138, 148, 0.4), inset 0 0 0 1px rgba(42, 138, 148, 0.35)"
  );
  const hoverBg = useColorModeValue("white", "rgba(255, 255, 255, 0.06)");
  const popoverBg = useColorModeValue("white", "var(--color-surface)");
  const popoverBorder = useColorModeValue("gray.100", "var(--color-border)");
  const itemActiveBg = useColorModeValue("blue.50", "rgba(6, 95, 104, 0.2)");

  const handleNavigate = (link: string) => {
    router.push(link);
    onClose();
  };

  // 1. Mobile View: Clean Collapsible Accordion inside the Drawer
  if (isMobile) {
    return (
      <Box w="full">
        <Flex
          as="button"
          w="full"
          align="center"
          justify="space-between"
          py={2}
          px={3}
          borderRadius="lg"
          bg={isActive ? itemActiveBg : "transparent"}
          color={isActive ? activeColor : inactiveColor}
          boxShadow={isActive ? activeGlow : "none"}
          _hover={{ bg: hoverBg, color: activeColor }}
          _active={{ bg: hoverBg }}
          transition="all 0.15s ease"
          onClick={() => {
            if (hasChildren) {
              onToggle();
            } else {
              handleNavigate(item.link);
            }
          }}
        >
          <Text
            fontSize="sm"
            fontWeight={isActive ? "600" : "500"}
            noOfLines={1}
          >
            {item.title}
          </Text>

          {hasChildren && (
            <ChevronDownIcon
              boxSize={4}
              color={isActive ? activeColor : "gray.400"}
              transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
              transition="transform 0.2s ease"
            />
          )}
        </Flex>

        {hasChildren && (
          <Collapse in={isOpen} animateOpacity>
            <VStack
              align="stretch"
              spacing={0.5}
              pl={3}
              ml={3}
              mt={0.5}
              mb={1}
              borderLeft="1.5px solid"
              borderColor={popoverBorder}
            >
              {item.children!.map((child) => {
                const isChildActive = pathname === child.link;
                return (
                  <Flex
                    as="button"
                    key={child.title}
                    align="center"
                    py={1.5}
                    px={2.5}
                    borderRadius="md"
                    fontSize="xs"
                    fontWeight={isChildActive ? "600" : "500"}
                    color={isChildActive ? activeColor : inactiveColor}
                    bg={isChildActive ? itemActiveBg : "transparent"}
                    boxShadow={isChildActive ? activeGlow : "none"}
                    _hover={{ bg: hoverBg, color: activeColor }}
                    textAlign="left"
                    transition="all 0.15s ease"
                    onClick={() => handleNavigate(child.link)}
                  >
                    <Text noOfLines={1}>{child.title}</Text>
                  </Flex>
                );
              })}
            </VStack>
          </Collapse>
        )}
      </Box>
    );
  }

  // 2. Desktop View: Compact Pill Button + Hover Popover Menu
  return (
    <Popover trigger="hover" placement="bottom-start" gutter={6} isLazy>
      <PopoverTrigger>
        <Flex
          as="button"
          align="center"
          gap={1}
          px={2.5}
          py={1}
          cursor="pointer"
          position="relative"
          role="group"
          borderRadius="md"
          bg={isActive ? activeBg : "transparent"}
          color={isActive ? activeColor : inactiveColor}
          boxShadow={isActive ? activeGlow : "none"}
          _hover={{
            bg: hoverBg,
            color: activeColor,
            boxShadow: isActive
              ? activeGlow
              : "0 0 10px rgba(42, 138, 148, 0.25)",
          }}
          transition="all 0.15s ease"
          whiteSpace="nowrap"
          onClick={() => {
            if (!hasChildren) {
              handleNavigate(item.link);
            }
          }}
        >
          <Text fontSize="sm" fontWeight={isActive ? "600" : "500"}>
            {item.title}
          </Text>

          {hasChildren && (
            <ChevronDownIcon
              boxSize={3.5}
              color={isActive ? activeColor : "gray.400"}
              transition="transform 0.2s ease, color 0.2s ease"
              _groupHover={{
                transform: "rotate(180deg)",
                color: activeColor,
              }}
            />
          )}
        </Flex>
      </PopoverTrigger>

      {hasChildren && (
        <Portal>
          <PopoverContent
            w="200px"
            bg={popoverBg}
            borderRadius="xl"
            boxShadow="lg"
            border="1px solid"
            borderColor={popoverBorder}
            overflow="hidden"
            _focus={{ outline: "none", boxShadow: "lg" }}
            zIndex="1500"
          >
            <PopoverBody p={1.5}>
              <VStack align="stretch" spacing={0.5}>
                {item.children!.map((child) => {
                  const isChildActive = pathname === child.link;
                  return (
                    <Flex
                      as="button"
                      key={child.title}
                      align="center"
                      justify="space-between"
                      px={3}
                      py={2}
                      fontSize="xs"
                      fontWeight={isChildActive ? "600" : "500"}
                      cursor="pointer"
                      borderRadius="lg"
                      color={isChildActive ? activeColor : inactiveColor}
                      bg={isChildActive ? itemActiveBg : "transparent"}
                      boxShadow={isChildActive ? activeGlow : "none"}
                      role="group"
                      transition="all 0.15s ease"
                      _hover={{
                        bg: hoverBg,
                        color: activeColor,
                      }}
                      textAlign="left"
                      onClick={() => handleNavigate(child.link)}
                    >
                      <Text noOfLines={1}>{child.title}</Text>
                      <ChevronRightIcon
                        boxSize={3.5}
                        opacity={0}
                        transform="translateX(-4px)"
                        transition="all 0.15s ease"
                        color="var(--color-primary)"
                        _groupHover={{
                          opacity: 1,
                          transform: "translateX(0)",
                        }}
                      />
                    </Flex>
                  );
                })}
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      )}
    </Popover>
  );
};

export default NavItem;