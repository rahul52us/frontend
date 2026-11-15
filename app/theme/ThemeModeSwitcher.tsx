"use client";

import React from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiCheck, FiMoon, FiSun, FiTv } from "react-icons/fi";
import { ThemeMode, useAppTheme } from "./ThemeContext";

interface ThemeModeSwitcherProps {
  size?: "sm" | "md" | "lg";
  variant?: "segmented" | "menu" | "compact";
  showLabels?: boolean;
}

/**
 * Modern Segmented Theme Switcher supporting Light, Dark, and System Default.
 */
export const ThemeModeSwitcher: React.FC<ThemeModeSwitcherProps> = ({
  size = "md",
  variant = "segmented",
}) => {
  const { mode, setMode } = useAppTheme();

  const options: { id: ThemeMode; label: string; icon: any }[] = [
    { id: "light", label: "Light", icon: FiSun },
    { id: "dark", label: "Dark", icon: FiMoon },
    { id: "system", label: "System", icon: FiTv },
  ];

  const bgContainer = useColorModeValue("gray.100", "rgba(255, 255, 255, 0.08)");
  const borderContainer = useColorModeValue("gray.200", "rgba(255, 255, 255, 0.12)");
  const activeBg = useColorModeValue("white", "var(--color-primary)");
  const activeText = useColorModeValue("var(--color-primary)", "white");
  const inactiveText = useColorModeValue("gray.600", "gray.400");
  const activeShadow = useColorModeValue(
    "0 2px 6px rgba(0, 0, 0, 0.08)",
    "0 2px 8px rgba(0, 0, 0, 0.3)"
  );

  if (variant === "menu") {
    return <ThemeModeMenu size={size} />;
  }

  const py = size === "sm" ? 1 : size === "lg" ? 2 : 1.5;
  const px = size === "sm" ? 2 : size === "lg" ? 4 : 3;
  const fontSize = size === "sm" ? "xs" : size === "lg" ? "md" : "sm";
  const iconSize = size === "sm" ? 3.5 : size === "lg" ? 4.5 : 4;

  return (
    <HStack
      spacing={1}
      p={1}
      bg={bgContainer}
      borderRadius="14px"
      border="1px solid"
      borderColor={borderContainer}
      w="full"
      justify="stretch"
    >
      {options.map((opt) => {
        const isActive = mode === opt.id;
        return (
          <Button
            key={opt.id}
            flex={1}
            size={size}
            py={py}
            px={px}
            variant="unstyled"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            borderRadius="10px"
            bg={isActive ? activeBg : "transparent"}
            color={isActive ? activeText : inactiveText}
            boxShadow={isActive ? activeShadow : "none"}
            fontWeight={isActive ? "700" : "500"}
            fontSize={fontSize}
            onClick={() => setMode(opt.id)}
            transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            _hover={{
              color: isActive ? activeText : "var(--color-primary)",
              bg: isActive ? activeBg : "rgba(0, 0, 0, 0.03)",
            }}
            aria-pressed={isActive}
            aria-label={`${opt.label} Mode`}
          >
            <Icon as={opt.icon} boxSize={iconSize} />
            <Text as="span">{opt.label}</Text>
          </Button>
        );
      })}
    </HStack>
  );
};

/**
 * Dropdown menu theme switcher ideal for header bars and compact spaces.
 */
export const ThemeModeMenu: React.FC<{ size?: "sm" | "md" | "lg" }> = ({
  size = "md",
}) => {
  const { mode, resolvedTheme, setMode } = useAppTheme();

  const currentIcon =
    mode === "system" ? FiTv : resolvedTheme === "dark" ? FiMoon : FiSun;

  const bgBtn = useColorModeValue("gray.50", "rgba(255, 255, 255, 0.06)");
  const borderBtn = useColorModeValue("gray.200", "rgba(255, 255, 255, 0.12)");
  const textBtn = useColorModeValue("gray.700", "gray.200");
  const menuBg = useColorModeValue("white", "var(--color-surface)");
  const menuBorder = useColorModeValue("gray.200", "var(--color-border)");
  const menuText = useColorModeValue("gray.800", "var(--color-text-primary)");
  const hoverBg = useColorModeValue("gray.50", "rgba(255, 255, 255, 0.08)");

  const options: { id: ThemeMode; label: string; icon: any; desc: string }[] = [
    { id: "light", label: "Light", icon: FiSun, desc: "Clean bright theme" },
    { id: "dark", label: "Dark", icon: FiMoon, desc: "Comfortable night theme" },
    { id: "system", label: "System Default", icon: FiTv, desc: "Follow device settings" },
  ];

  return (
    <Menu placement="bottom-end">
      <Tooltip
        label={`Theme: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`}
        openDelay={300}
      >
        <MenuButton
          as={IconButton}
          aria-label="Switch Theme Mode"
          icon={<Icon as={currentIcon} boxSize={size === "sm" ? 4 : 4.5} />}
          size={size}
          variant="ghost"
          bg={bgBtn}
          color={textBtn}
          border="1px solid"
          borderColor={borderBtn}
          borderRadius="12px"
          _hover={{
            color: "var(--color-primary)",
            bg: hoverBg,
            borderColor: "var(--color-primary-border)",
          }}
          _active={{ transform: "scale(0.96)" }}
        />
      </Tooltip>

      <MenuList
        bg={menuBg}
        border="1px solid"
        borderColor={menuBorder}
        borderRadius="16px"
        boxShadow="0 18px 38px rgba(0, 0, 0, 0.35)"
        p={2}
        minW="220px"
        zIndex={1400}
      >
        <Box px={3} py={1.5} mb={1}>
          <Text fontSize="11px" fontWeight="700" color="gray.400" textTransform="uppercase" letterSpacing="wider">
            Appearance
          </Text>
        </Box>

        {options.map((opt) => {
          const isSelected = mode === opt.id;
          return (
            <MenuItem
              key={opt.id}
              onClick={() => setMode(opt.id)}
              bg="transparent"
              borderRadius="10px"
              py={2}
              px={3}
              _hover={{ bg: hoverBg }}
              color={isSelected ? "var(--color-primary)" : menuText}
              fontWeight={isSelected ? "700" : "500"}
            >
              <Flex align="center" justify="space-between" w="full">
                <HStack spacing={3}>
                  <Flex
                    w="28px"
                    h="28px"
                    align="center"
                    justify="center"
                    borderRadius="8px"
                    bg={isSelected ? "var(--color-primary-soft)" : "transparent"}
                    color={isSelected ? "var(--color-primary)" : "inherit"}
                  >
                    <Icon as={opt.icon} boxSize={4} />
                  </Flex>
                  <Box>
                    <Text fontSize="sm" lineHeight="1.2">
                      {opt.label}
                    </Text>
                    <Text fontSize="10px" color="gray.400" fontWeight="normal">
                      {opt.desc}
                    </Text>
                  </Box>
                </HStack>
                {isSelected && <Icon as={FiCheck} color="var(--color-primary)" boxSize={4} />}
              </Flex>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};

export default ThemeModeSwitcher;
