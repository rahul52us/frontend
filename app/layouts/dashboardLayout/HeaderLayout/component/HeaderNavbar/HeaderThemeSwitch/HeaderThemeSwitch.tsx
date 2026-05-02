"use client"; // Add this for client-side component in Next.js

import { useEffect, useState } from "react";
import { IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { BiMoon, BiSun } from "react-icons/bi";
import { dashboardPalette } from "../../../../dashboardPalette";


const HeaderThemeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    typeof window !== "undefined" ? colorMode === "dark" : false // Handle SSR
  );

  useEffect(() => {
    setIsDarkMode(colorMode === "dark");
  }, [colorMode]);

  const toggleMode = () => {
    toggleColorMode();
    setIsDarkMode(!isDarkMode);
  };

  // Theme-aware tokens
  const cSurfaceAlt = useColorModeValue("gray.50", dashboardPalette.surfaceAlt);
  const cSurfaceSoft = useColorModeValue("gray.100", dashboardPalette.surfaceSoft);
  const cBorder = useColorModeValue("blue.100", dashboardPalette.border);
  const cText = useColorModeValue("gray.800", dashboardPalette.text);
  const cAccent = useColorModeValue("blue.600", dashboardPalette.accent);

  return (
    <IconButton
      icon={isDarkMode ? <BiSun /> : <BiMoon />}
      onClick={toggleMode}
      variant="ghost"
      fontSize="xl"
      color={cText}
      bg={cSurfaceAlt}
      border="1px solid"
      borderColor={cBorder}
      _hover={{ color: cAccent, bg: cSurfaceSoft }}
      _active={{ bg: cSurfaceSoft }}
      borderRadius="12px"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      transition="all 0.2s"
    />
  );
};

export default HeaderThemeSwitch;