"use client"; // Only if using Next.js App Router

import { observer } from "mobx-react-lite";
import CustomDrawer from "../Drawer/CustomDrawer";
import { Box, Button, Flex, Grid, SystemStyleObject, Text } from "@chakra-ui/react";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import stores from "../../../store/stores";
import ColorPickerComponent from "./ColorPicker/ColorPicker";
import theme from "../../../theme/theme";

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

const CustomColorBox: React.FC<CustomColorBoxProps> = ({ color, colorName, selected, onClick }) => {
  const setHovered = useState(false)[1]

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  const boxStyle: SystemStyleObject = {
    width: "70px",
    height: "70px",
    backgroundColor: color,
    borderRadius: "50%",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: selected ? "2px solid black" : "1px solid lightgray",
  };

  return (
    <Box display="flex" flexDir="column" alignItems="center">
      <Box sx={boxStyle} onClick={onClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {selected && <FaCheck color="white" />}
      </Box>
      <Text mt={2} fontSize="sm" fontWeight="bold">
        {colorName}
      </Text>
    </Box>
  );
};

const ThemeChangeContainer: React.FC = observer(() => {
  const {
    themeStore: { openThemeDrawer, setOpenThemeDrawer, resetTheme, setThemeConfig },
  } = stores;

  const colors: ColorOption[] = [
    { name: "Blue", code: "#007acc" },
    { name: "Green", code: "#19a974" },
    { name: "Yellow", code: "#d6a407" },
    { name: "Red", code: "#ff6b6b" },
    { name: "Purple", code: "#6b37ff" },
    { name: "Orange", code: "#ffaa00" },
  ];

  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleColorSelect = (color: ColorOption) => {
    theme.colors.custom.light.primary = color.code;
    setThemeConfig("colors.custom.light.primary", color.code);
    setSelectedColor(color.code);
  };

  return (
    <CustomDrawer open={openThemeDrawer.open} close={setOpenThemeDrawer} title="Select the Theme" size="xs">
      <Flex flexDir="column">
        <Box bgColor="#E5F6FD" borderRadius={5} p={3} mb={5} fontSize="md" mt={3}>
          <Text color="#014361" fontSize="sm">
            {`Welcome! Explore our style options below and select the ones that perfectly match your preferences.`}
          </Text>
        </Box>
        <Box>
          <ColorPickerComponent />
        </Box>
        <Box mt={5}>
          <Grid gridTemplateColumns="repeat(2, 1fr)" gap={5}>
            {colors.map((color) => (
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
        <Button mt={5} onClick={resetTheme}>
          Reset Theme
        </Button>
      </Flex>
    </CustomDrawer>
  );
});

export default ThemeChangeContainer;
