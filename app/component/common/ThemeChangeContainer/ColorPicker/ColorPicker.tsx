'use client';
import { useState } from "react";
import { ChromePicker, ColorResult } from "react-color";
import { Button, useDisclosure, Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import stores from "../../../../store/stores";
import theme from "../../../../theme/theme";

const ColorPickerComponent = observer(() => {
  const {
    themeStore: { setThemeConfig },
  } = stores;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [color, setColor] = useState("#000000");

  const handleColorChange = (newColor: ColorResult) => {
    setColor(newColor.hex);
    theme.colors.custom.light.primary = newColor.hex;
    setThemeConfig("colors.custom.light.primary", newColor.hex);
  };

  const pickerStyles = {
    default: {
      picker: {
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
        borderRadius: "10px",
        background: "#fff",
        border: "1px solid #ccc",
        zIndex: "999",
      },
    },
  };

  return (
    <>
      <Button
        onClick={isOpen ? onClose : onOpen}
        colorScheme="teal"
        size="sm"
        fontWeight="normal"
      >
        Custom Color
      </Button>
      {isOpen && (
        <Box position="absolute" zIndex={999}>
          <ChromePicker
            color={color}
            onChange={handleColorChange}
            disableAlpha
            styles={pickerStyles}
          />
        </Box>
      )}
    </>
  );
});

export default ColorPickerComponent;
