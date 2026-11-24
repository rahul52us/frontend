'use client';
import { useState } from "react";
import { ChromePicker, ColorResult } from "react-color";
import { Button, useDisclosure, Box, HStack, Text, Portal } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import stores from "../../../../store/stores";
import { FaEyeDropper } from "react-icons/fa";

interface ColorPickerComponentProps {
  currentColor?: string;
  onColorChange?: (hex: string) => void;
}

const ColorPickerComponent: React.FC<ColorPickerComponentProps> = observer(({ currentColor = "#065F68", onColorChange }) => {
  const {
    themeStore: { setThemeConfig },
  } = stores;
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [color, setColor] = useState(currentColor);

  const handleColorChange = (newColor: ColorResult) => {
    setColor(newColor.hex);
    if (typeof window !== "undefined") {
      localStorage.setItem("vendor_primary_theme_color", newColor.hex);
      localStorage.setItem("business_primary_theme_color", newColor.hex);
      document.documentElement.style.setProperty("--color-primary", newColor.hex);
      window.dispatchEvent(new Event("vendor_theme_color_changed"));
    }
    setThemeConfig("colors.custom.light.primary", newColor.hex);
    setThemeConfig("colors.custom.dark.primary", newColor.hex);
    onColorChange?.(newColor.hex);
  };

  return (
    <Box position="relative">
      <Button
        onClick={onToggle}
        leftIcon={<FaEyeDropper size={13} />}
        size="sm"
        h="38px"
        w="full"
        borderRadius="12px"
        variant="outline"
        borderColor="var(--color-border)"
        bg="var(--color-surface-alt)"
        color="var(--color-text-primary)"
        fontWeight="600"
        fontSize="xs"
        justifyContent="space-between"
        px={3}
        _hover={{
          bg: "var(--color-surface-soft)",
          borderColor: "var(--color-primary)",
        }}
      >
        <HStack spacing={2}>
          <Box
            w="18px"
            h="18px"
            borderRadius="6px"
            bg={color}
            border="1px solid rgba(0,0,0,0.15)"
          />
          <Text>Pick Custom Hex</Text>
        </HStack>
        <Text fontSize="11px" fontFamily="monospace" color="var(--color-text-muted)">
          {color.toUpperCase()}
        </Text>
      </Button>

      {isOpen && (
        <Box
          position="relative"
          mt={2}
          p={2}
          borderRadius="16px"
          bg="var(--color-surface)"
          border="1px solid"
          borderColor="var(--color-border)"
          boxShadow="0 14px 34px rgba(0, 0, 0, 0.18)"
          zIndex={999}
          display="flex"
          justifyContent="center"
        >
          <ChromePicker
            color={color}
            onChange={handleColorChange}
            disableAlpha
            styles={{
              default: {
                picker: {
                  boxShadow: "none",
                  borderRadius: "12px",
                  background: "transparent",
                  fontFamily: "inherit",
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
});

export default ColorPickerComponent;
