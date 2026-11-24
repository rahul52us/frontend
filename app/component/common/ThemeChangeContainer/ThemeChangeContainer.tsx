"use client";

import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import CustomDrawer from "../Drawer/CustomDrawer";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  Tooltip,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaCheck, FaUndo } from "react-icons/fa";
import { FiCheck, FiLayers, FiMoon, FiSun, FiSliders, FiEye } from "react-icons/fi";
import stores from "../../../store/stores";
import ColorPickerComponent from "./ColorPicker/ColorPicker";
import { ThemeModeSwitcher } from "../../../theme/ThemeModeSwitcher";
import { useAppTheme } from "../../../theme/ThemeContext";

interface PresetColor {
  name: string;
  code: string;
  description: string;
}

const PRESET_COLORS: PresetColor[] = [
  { name: "Teal Brand", code: "#065F68", description: "Default Marketplace Theme" },
  { name: "Classic Navy", code: "#094a82", description: "Professional Deep Blue" },
  { name: "Ocean Blue", code: "#007acc", description: "Modern Electric Blue" },
  { name: "Emerald", code: "#10b981", description: "Lush Eco Green" },
  { name: "Amber Yellow", code: "#d97706", description: "Warm Energetic Gold" },
  { name: "Sunset Orange", code: "#ea580c", description: "Vibrant Punchy Orange" },
  { name: "Crimson Red", code: "#e11d48", description: "Bold Rose Passion" },
  { name: "Royal Violet", code: "#7c3aed", description: "Luxury Creative Purple" },
];

const ThemeChangeContainer: React.FC = observer(() => {
  const {
    themeStore: { openThemeDrawer, setOpenThemeDrawer, resetTheme, setThemeConfig },
  } = stores;
  const { colors: brandColors, mode } = useAppTheme();

  const [selectedColor, setSelectedColor] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("vendor_primary_theme_color") ||
        localStorage.getItem("business_primary_theme_color") ||
        brandColors.primary ||
        "#065F68"
      );
    }
    return brandColors.primary || "#065F68";
  });

  useEffect(() => {
    const handleSync = () => {
      if (typeof window !== "undefined") {
        const stored =
          localStorage.getItem("vendor_primary_theme_color") ||
          localStorage.getItem("business_primary_theme_color");
        if (stored) {
          setSelectedColor(stored);
        }
      }
    };
    window.addEventListener("vendor_theme_color_changed", handleSync);
    return () => window.removeEventListener("vendor_theme_color_changed", handleSync);
  }, []);

  const handleApplyColor = (colorHex: string) => {
    setSelectedColor(colorHex);
    if (typeof window !== "undefined") {
      localStorage.setItem("vendor_primary_theme_color", colorHex);
      localStorage.setItem("business_primary_theme_color", colorHex);
      document.documentElement.style.setProperty("--color-primary", colorHex);
      window.dispatchEvent(new Event("vendor_theme_color_changed"));
    }
    setThemeConfig("colors.custom.light.primary", colorHex);
    setThemeConfig("colors.custom.dark.primary", colorHex);
  };

  const handleReset = () => {
    resetTheme();
    const defaultColor = "#065F68";
    handleApplyColor(defaultColor);
  };

  const cSurface = useColorModeValue("white", "var(--color-surface, #111C30)");
  const cSurfaceAlt = useColorModeValue("gray.50", "var(--color-surface-alt, #15223A)");
  const cBorder = useColorModeValue("gray.200", "var(--color-border, rgba(255,255,255,0.1))");
  const cText = useColorModeValue("gray.800", "var(--color-text-primary, #F8FAFC)");
  const cTextMuted = useColorModeValue("gray.500", "var(--color-text-muted, #8AAAC8)");

  return (
    <CustomDrawer
      open={openThemeDrawer.open}
      close={setOpenThemeDrawer}
      title="Appearance & Theme"
      size="xs"
    >
      <Flex flexDir="column" gap={4.5} pb={4}>
        {/* Section 1: Light / Dark Mode Toggle */}
        <Box
          p={3.5}
          borderRadius="16px"
          bg={cSurfaceAlt}
          border="1px solid"
          borderColor={cBorder}
        >
          <Flex align="center" justify="space-between" mb={2}>
            <Text
              fontSize="11px"
              fontWeight="800"
              color={cTextMuted}
              textTransform="uppercase"
              letterSpacing="0.08em"
            >
              Display Mode
            </Text>
            <Badge
              textTransform="capitalize"
              colorScheme="purple"
              borderRadius="full"
              px={2}
              fontSize="10px"
              fontWeight="700"
            >
              {mode}
            </Badge>
          </Flex>
          <ThemeModeSwitcher size="md" />
        </Box>

        {/* Section 2: Active Brand Palette Card */}
        <Box
          p={3.5}
          borderRadius="16px"
          bg={cSurfaceAlt}
          border="1px solid"
          borderColor={cBorder}
        >
          <Flex align="center" justify="space-between" mb={2.5}>
            <Text
              fontSize="11px"
              fontWeight="800"
              color={cTextMuted}
              textTransform="uppercase"
              letterSpacing="0.08em"
            >
              Active Palette
            </Text>
            <Badge
              colorScheme="teal"
              borderRadius="full"
              px={2}
              fontSize="10px"
              fontWeight="700"
            >
              Live Sync
            </Badge>
          </Flex>

          <VStack align="stretch" spacing={2}>
            <Flex
              align="center"
              justify="space-between"
              p={2.5}
              borderRadius="12px"
              bg={cSurface}
              border="1px solid"
              borderColor={cBorder}
              boxShadow="0 1px 2px rgba(0,0,0,0.03)"
            >
              <HStack spacing={2.5}>
                <Box
                  w="26px"
                  h="26px"
                  borderRadius="8px"
                  bg={selectedColor}
                  border="1px solid rgba(0,0,0,0.15)"
                  boxShadow={`0 2px 6px ${selectedColor}40`}
                />
                <Box>
                  <Text fontSize="xs" fontWeight="700" color={cText} lineHeight="1.2">
                    Primary Brand
                  </Text>
                  <Text fontSize="10px" color={cTextMuted}>
                    Sidebar, Table, Active Tabs
                  </Text>
                </Box>
              </HStack>
              <Text fontSize="xs" fontFamily="monospace" fontWeight="700" color={selectedColor}>
                {selectedColor.toUpperCase()}
              </Text>
            </Flex>

            <Flex
              align="center"
              justify="space-between"
              p={2.5}
              borderRadius="12px"
              bg={cSurface}
              border="1px solid"
              borderColor={cBorder}
              boxShadow="0 1px 2px rgba(0,0,0,0.03)"
            >
              <HStack spacing={2.5}>
                <Box
                  w="26px"
                  h="26px"
                  borderRadius="8px"
                  bg={brandColors.secondary}
                  border="1px solid rgba(0,0,0,0.15)"
                />
                <Box>
                  <Text fontSize="xs" fontWeight="700" color={cText} lineHeight="1.2">
                    Secondary Accent
                  </Text>
                  <Text fontSize="10px" color={cTextMuted}>
                    Gradients & Sub-actions
                  </Text>
                </Box>
              </HStack>
              <Text fontSize="xs" fontFamily="monospace" fontWeight="700" color={brandColors.secondary}>
                {brandColors.secondary.toUpperCase()}
              </Text>
            </Flex>
          </VStack>
        </Box>

        {/* Section 3: Preset Palettes Grid */}
        <Box
          p={3.5}
          borderRadius="16px"
          bg={cSurfaceAlt}
          border="1px solid"
          borderColor={cBorder}
        >
          <Text
            fontSize="11px"
            fontWeight="800"
            color={cTextMuted}
            textTransform="uppercase"
            letterSpacing="0.08em"
            mb={3}
          >
            Quick Primary Presets
          </Text>

          <SimpleGrid columns={4} spacing={2.5}>
            {PRESET_COLORS.map((preset) => {
              const isSelected = selectedColor.toLowerCase() === preset.code.toLowerCase();
              return (
                <Tooltip
                  key={preset.code}
                  label={`${preset.name} - ${preset.description}`}
                  fontSize="10px"
                  hasArrow
                >
                  <Box
                    as="button"
                    type="button"
                    onClick={() => handleApplyColor(preset.code)}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={1.5}
                    py={1.5}
                    px={1}
                    borderRadius="12px"
                    bg={isSelected ? "rgba(255,255,255,0.06)" : "transparent"}
                    border="1px solid"
                    borderColor={isSelected ? preset.code : "transparent"}
                    transition="all 0.18s ease"
                    _hover={{
                      transform: "scale(1.05)",
                      borderColor: preset.code,
                    }}
                  >
                    <Box
                      w="36px"
                      h="36px"
                      borderRadius="50%"
                      bg={preset.code}
                      border={isSelected ? "3px solid white" : "2px solid rgba(0,0,0,0.15)"}
                      boxShadow={
                        isSelected
                          ? `0 0 0 2px ${preset.code}, 0 4px 10px rgba(0,0,0,0.25)`
                          : "0 2px 5px rgba(0,0,0,0.1)"
                      }
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      transition="all 0.18s ease"
                    >
                      {isSelected && <FaCheck size={12} color="white" />}
                    </Box>
                    <Text
                      fontSize="10px"
                      fontWeight={isSelected ? "800" : "600"}
                      color={isSelected ? cText : cTextMuted}
                      noOfLines={1}
                      textAlign="center"
                    >
                      {preset.name.split(" ")[0]}
                    </Text>
                  </Box>
                </Tooltip>
              );
            })}
          </SimpleGrid>
        </Box>

        {/* Section 4: Custom Color Picker */}
        <Box
          p={3.5}
          borderRadius="16px"
          bg={cSurfaceAlt}
          border="1px solid"
          borderColor={cBorder}
        >
          <Text
            fontSize="11px"
            fontWeight="800"
            color={cTextMuted}
            textTransform="uppercase"
            letterSpacing="0.08em"
            mb={2.5}
          >
            Custom Hex Color
          </Text>
          <ColorPickerComponent
            currentColor={selectedColor}
            onColorChange={handleApplyColor}
          />
        </Box>

        {/* Reset button */}
        <Button
          leftIcon={<FaUndo size={12} />}
          variant="outline"
          size="sm"
          h="38px"
          borderRadius="12px"
          borderColor={cBorder}
          color={cTextMuted}
          fontWeight="600"
          fontSize="xs"
          _hover={{
            bg: "red.50",
            color: "red.500",
            borderColor: "red.200",
          }}
          onClick={handleReset}
        >
          Reset to Config Defaults
        </Button>
      </Flex>
    </CustomDrawer>
  );
});

export default ThemeChangeContainer;
