"use client"; // Add this for client-side component in Next.js

import { useEffect, useState } from "react";
import { IconButton, useColorMode } from "@chakra-ui/react";
import { BiMoon, BiSun } from "react-icons/bi";


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

  return (
    <IconButton
      icon={isDarkMode ? <BiSun /> : <BiMoon />}
      onClick={toggleMode}
      variant="ghost"
      fontSize="2xl"
      color="white"
      _hover={{ color: "blue.500", bg: "gray.700" }}
      _active={{ bg: "gray.800" }}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    />
  );
};

export default HeaderThemeSwitch;