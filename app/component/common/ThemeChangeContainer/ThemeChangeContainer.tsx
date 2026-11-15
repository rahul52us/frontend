"use client";

import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import CustomDrawer from "../Drawer/CustomDrawer";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  HStack,
  SystemStyleObject,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";
import stores from "../../../store/stores";
import ColorPickerComponent from "./ColorPicker/ColorPicker";
import { ThemeModeSwitcher } from "../../../theme/ThemeModeSwitcher";
import { useAppTheme } from "../../../theme/ThemeContext";

interface ColorOption {
  name: string;
  code: string;
}

interface CustomColorBoxProps {
  color: string;
  colorName: string;
  selected: boolean;
  onClick: () => void;
}

const CustomColorBox: React.FC<CustomColorBoxProps> = ({
  color,
  colorName,
  selected,
  onClick,
}) => {
  const boxStyle: SystemStyleObject = {
    width: "56px",
    height: "56px",
    backgroundColor: color,
    borderRadius: "50%",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: selected ? "3px solid var(--color-primary)" : "2px solid rgba(0,0,0,0.1)",
    boxShadow: selected ? "0 0 0 2px white, 0 4px 12px rgba(0,0,0,0.15)" : "none",
    transition: "all 0.2s ease",
    _hover: { transform: "scale(1.06)" },
  };

  return (
    <Box display="flex" flexDir="column" alignItems="center">
      <Box sx={boxStyle} onClick={onClick}>
        {selected && <FaCheck color="white" />}
      </Box>
      <Text mt={1.5} fontSize="xs" fontWeight="600" color="var(--color-text-secondary)">
        {colorName}
      </Text>
    </Box>
  );
};

const ThemeChangeContainer: React.FC = observer(() => {
  const {
    themeStore: { openThemeDrawer, setOpenThemeDrawer, resetTheme, setThemeConfig },
  } = stores;
  const { colors: brandColors, mode } = useAppTheme();

  const presetColors: ColorOption[] = [
    { name: "Teal Brand", code: "var(--color-primary)" },
    { name: "Ocean Blue", code: "#007acc" },
    { name: "Emerald", code: "#10b981" },
    { name: "Amber", code: "#d97706" },
    { name: "Rose", code: "#e11d48" },
    { name: "Violet", code: "#7c3aed" },
  ];

  const [selectedColor, setSelectedColor] = useState<string | null>(brandColors.primary);

  const bannerBg = useColorModeValue("#E5F6FD", "rgba(6, 95, 104, 0.2)");
  const bannerTextColor = useColorModeValue("#014361", "#A5F3FC");

  const handleColorSelect = (color: ColorOption) => {
    setSelectedColor(color.code);
    setThemeConfig("colors.custom.light.primary", color.code);
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--color-primary", color.code);
    }
  };

  return (
    <CustomDrawer
      open={openThemeDrawer.open}
      close={setOpenThemeDrawer}
      title="Appearance & Theme"
      size="xs"
    >
      <Flex flexDir="column" gap={5}>
        {/* Intro */}
        <Box bgColor={bannerBg} borderRadius="12px" p={3.5} mt={1}>
          <Text color={bannerTextColor} fontSize="xs" lineHeight="1.5">
            Personalize your workspace appearance. Choose between Light, Dark, or System mode, and preview theme colors.
          </Text>
        </Box>

        {/* Section 1: Light / Dark / System Switcher */}
        <Box>
          <Text
            fontSize="xs"
            fontWeight="700"
            color="var(--color-text-muted)"
            textTransform="uppercase"
            letterSpacing="wider"
            mb={2}
          >
            Theme Mode
          </Text>
          <ThemeModeSwitcher size="md" />
        </Box>

        <Divider borderColor="var(--color-border)" />

        {/* Section 2: Active Brand Palette */}
        <Box>
          <Text
            fontSize="xs"
            fontWeight="700"
            color="var(--color-text-muted)"
            textTransform="uppercase"
            letterSpacing="wider"
            mb={2.5}
          >
            Active Brand Colors
          </Text>
          <VStack align="stretch" spacing={2}>
            <Flex
              align="center"
              justify="space-between"
              p={2.5}
              borderRadius="10px"
              bg="var(--color-surface-alt)"
              border="1px solid"
              borderColor="var(--color-border)"
            >
              <HStack spacing={3}>
                <Box
                  w="24px"
                  h="24px"
                  borderRadius="6px"
                  bg={brandColors.primary}
                  border="1px solid rgba(0,0,0,0.15)"
                />
                <Text fontSize="xs" fontWeight="600">
                  Primary Color
                </Text>
              </HStack>
              <Badge variant="subtle" fontSize="10px">
                {brandColors.primary}
              </Badge>
            </Flex>

            <Flex
              align="center"
              justify="space-between"
              p={2.5}
              borderRadius="10px"
              bg="var(--color-surface-alt)"
              border="1px solid"
              borderColor="var(--color-border)"
            >
              <HStack spacing={3}>
                <Box
                  w="24px"
                  h="24px"
                  borderRadius="6px"
                  bg={brandColors.secondary}
                  border="1px solid rgba(0,0,0,0.15)"
                />
                <Text fontSize="xs" fontWeight="600">
                  Secondary Color
                </Text>
              </HStack>
              <Badge variant="subtle" fontSize="10px">
                {brandColors.secondary}
              </Badge>
            </Flex>

            <Flex
              align="center"
              justify="space-between"
              p={2.5}
              borderRadius="10px"
              bg="var(--color-surface-alt)"
              border="1px solid"
              borderColor="var(--color-border)"
            >
              <HStack spacing={3}>
                <Box
                  w="24px"
                  h="24px"
                  borderRadius="6px"
                  bg={brandColors.accent}
                  border="1px solid rgba(0,0,0,0.15)"
                />
                <Text fontSize="xs" fontWeight="600">
                  Accent Color
                </Text>
              </HStack>
              <Badge variant="subtle" fontSize="10px">
                {brandColors.accent}
              </Badge>
            </Flex>
          </VStack>
          <Text fontSize="10px" color="var(--color-text-muted)" mt={2}>
            To permanently configure colors, edit <Text as="span" fontFamily="monospace">src/theme/themeConfig.ts</Text>.
          </Text>
        </Box>

        <Divider borderColor="var(--color-border)" />

        {/* Section 3: Preset Palettes */}
        <Box>
          <Text
            fontSize="xs"
            fontWeight="700"
            color="var(--color-text-muted)"
            textTransform="uppercase"
            letterSpacing="wider"
            mb={3}
          >
            Quick Primary Presets
          </Text>
          <Grid gridTemplateColumns="repeat(3, 1fr)" gap={3}>
            {presetColors.map((color) => (
              <CustomColorBox
                key={color.code}
                color={color.code}
                colorName={color.name}
                selected={selectedColor === color.code}
                onClick={() => handleColorSelect(color)}
              />
            ))}
          </Grid>
        </Box>

        {/* Section 4: Custom Color Picker */}
        <Box>
          <Text
            fontSize="xs"
            fontWeight="700"
            color="var(--color-text-muted)"
            textTransform="uppercase"
            letterSpacing="wider"
            mb={2}
          >
            Custom Color Picker
          </Text>
          <ColorPickerComponent />
        </Box>

        <Button
          mt={2}
          variant="outline"
          size="sm"
          borderRadius="12px"
          onClick={() => {
            resetTheme();
            setSelectedColor(brandColors.primary);
            if (typeof document !== "undefined") {
              document.documentElement.style.removeProperty("--color-primary");
            }
          }}
        >
          Reset to Config Defaults
        </Button>
      </Flex>
    </CustomDrawer>
  );
});

export default ThemeChangeContainer;
