"use client"; // Add this for client-side component in Next.js

import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  useColorModeValue,
  Divider,
  Box,
  HStack,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiGlobe } from "react-icons/fi";
import { FaFlagUsa, FaFlag } from "react-icons/fa";

// Define interface for language options
interface LanguageOption {
  value: string;
  label: string;
  icon: React.ReactElement;
}


const HeaderLanguageSwitch = () => {
  const { i18n } = useTranslation();
  const menuBgColor = useColorModeValue("white", "gray.800");
  const menuHoverBgColor = useColorModeValue("gray.100", "gray.700");
  const menuActiveBgColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.800", "white");

  // Define language options with typed structure
  const languageOptions: LanguageOption[] = [
    { value: "en", label: "English", icon: <FaFlagUsa size={20} /> },
    { value: "hi", label: "Hindi", icon: <FaFlag size={20} /> },
    // Add more languages as needed
  ];

  // Handle language change with typed parameter
  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    if (typeof window !== "undefined") { // Check for client-side
      localStorage.setItem("setLanguage", value);
    }
  };

  return (
    <Menu closeOnSelect={true} placement="bottom-end">
      <MenuButton
        as={IconButton}
        icon={<FiGlobe />}
        variant="ghost"
        aria-label="Switch Language"
        fontSize="2xl"
        color="white"
        _hover={{ color: "blue.500", bg: "gray.700" }}
        _active={{ bg: "gray.800" }}
        p={2}
        m={1}
      />
      <Portal>
        <MenuList
          minWidth="240px"
          boxShadow="lg"
          py={2}
          borderRadius="md"
          bg={menuBgColor}
          zIndex={10}
        >
          {languageOptions.map((option, index) => (
            <Box key={option.value}>
              {index > 0 && <Divider />}
              <MenuItem
                onClick={() => handleLanguageChange(option.value)}
                px={4}
                py={3}
                _hover={{ bg: menuHoverBgColor }}
                _active={{ bg: menuActiveBgColor }}
                rounded="md"
                transition="background-color 0.2s"
              >
                <HStack spacing={3}>
                  {option.icon}
                  <Text fontSize="md" fontWeight="medium" color={textColor}>
                    {option.label}
                  </Text>
                </HStack>
              </MenuItem>
            </Box>
          ))}
        </MenuList>
      </Portal>
    </Menu>
  );
};

export default HeaderLanguageSwitch;