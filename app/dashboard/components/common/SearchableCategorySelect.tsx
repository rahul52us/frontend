"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  Spinner,
  Text,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiChevronDown, FiSearch, FiCheck, FiLayers } from "react-icons/fi";
import stores from "../../../store/stores";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";

export interface SearchableCategorySelectProps {
  value: string;
  onChange: (categoryId: string) => void;
  allowedRootCategories?: any[];
  isSuperAdmin?: boolean;
}

export const SearchableCategorySelect: React.FC<SearchableCategorySelectProps> = ({
  value,
  onChange,
  allowedRootCategories = [],
  isSuperAdmin = false,
}) => {
  const { categoryStore } = stores;
  const [searchTerm, setSearchTerm] = useState("");
  const [backendCategories, setBackendCategories] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<any>(null);

  // Theme-adaptive colors
  const menuBg = useColorModeValue("white", "var(--color-surface, #0B1120)");
  const menuBorder = useColorModeValue("gray.200", "var(--color-border, #1E293B)");
  const searchInputBg = useColorModeValue("gray.50", "var(--color-surface-alt, #151F32)");
  const itemHoverBg = useColorModeValue("gray.100", "var(--color-surface-soft, rgba(255,255,255,0.06))");
  const itemSelectedBg = useColorModeValue("brand.50", "rgba(6, 95, 104, 0.2)");
  const textPrimary = useColorModeValue("gray.800", "var(--color-text-primary, #F8FAFC)");
  const textMuted = useColorModeValue("gray.500", "var(--color-text-muted, #94A3B8)");
  const buttonBorder = useColorModeValue("gray.200", "var(--color-border, #1E293B)");
  const buttonBg = useColorModeValue("white", "var(--color-surface-alt, #151F32)");

  // Determine current active label
  const activeCategory = [...allowedRootCategories, ...backendCategories, ...categoryStore.categories].find(
    (c: any) => String(c._id) === String(value)
  );

  const displayLabel = value === "all" || !value ? "All Categories" : activeCategory?.name || "Selected Category";

  // Real-time backend search with debounce
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!val.trim()) {
      setIsSearching(false);
      setBackendCategories([]);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await categoryStore.searchRootCategories(val.trim(), 1, 20);
        if (res?.status === "success" && Array.isArray(res.data)) {
          setBackendCategories(res.data);
        } else {
          setBackendCategories([]);
        }
      } catch (err) {
        setBackendCategories([]);
      } finally {
        setIsSearching(false);
      }
    }, 280);
  };

  // Base list of categories when search term is empty
  const optionsToDisplay = React.useMemo(() => {
    if (searchTerm.trim()) {
      return backendCategories;
    }
    // If empty search, return allowed categories or top store categories
    if (allowedRootCategories && allowedRootCategories.length > 0) {
      return allowedRootCategories;
    }
    return categoryStore.categories.filter((c: any) => !c.parent && c.isActive !== false).slice(0, 15);
  }, [searchTerm, backendCategories, allowedRootCategories, categoryStore.categories]);

  return (
    <Menu isLazy closeOnSelect={true} placement="bottom-end">
      <MenuButton
        as={Button}
        rightIcon={<FiChevronDown size={14} />}
        h="38px"
        px={3.5}
        borderRadius="12px"
        bg={buttonBg}
        border="1px solid"
        borderColor={value && value !== "all" ? dashboardPalette.accent : buttonBorder}
        color={textPrimary}
        fontSize="xs"
        fontWeight="600"
        boxShadow="sm"
        _hover={{
          borderColor: dashboardPalette.accent,
          bg: useColorModeValue("gray.50", "var(--color-surface, #0B1120)"),
        }}
        _active={{ bg: useColorModeValue("gray.100", "var(--color-surface, #0B1120)") }}
        maxW={{ base: "100%", md: "200px" }}
      >
        <HStack spacing={2} overflow="hidden">
          <Icon as={FiLayers} color={value && value !== "all" ? dashboardPalette.accent : textMuted} boxSize={3.5} flexShrink={0} />
          <Text isTruncated fontSize="xs">
            {displayLabel}
          </Text>
        </HStack>
      </MenuButton>

      <Portal>
        <MenuList
          bg={menuBg}
          borderColor={menuBorder}
          borderWidth="1px"
          boxShadow={useColorModeValue(
            "0 12px 30px rgba(0,0,0,0.12), 0 4px 10px rgba(0,0,0,0.06)",
            "0 18px 45px rgba(0,0,0,0.65), 0 0 1px 1px rgba(255,255,255,0.08)"
          )}
          p={2}
          borderRadius="16px"
          zIndex={99999}
          minW="240px"
          maxW="280px"
        >
          {/* Real-time Search Input Box */}
          <Box px={1} pb={2} mb={1} borderBottom="1px solid" borderColor={menuBorder}>
            <InputGroup size="sm">
              <InputLeftElement pointerEvents="none">
                {isSearching ? (
                  <Spinner size="xs" color="var(--color-primary, #065F68)" />
                ) : (
                  <Icon as={FiSearch} color={textMuted} />
                )}
              </InputLeftElement>
              <Input
                placeholder="Search category..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                borderRadius="10px"
                bg={searchInputBg}
                border="1px solid"
                borderColor={menuBorder}
                color={textPrimary}
                fontSize="xs"
                _placeholder={{ color: textMuted }}
                _focus={{
                  borderColor: dashboardPalette.accent,
                  boxShadow: "none",
                }}
              />
            </InputGroup>
          </Box>

          <Box
            maxH="220px"
            overflowY="auto"
            sx={{
              "&::-webkit-scrollbar": {
                width: "5px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: useColorModeValue("gray.300", "whiteAlpha.200"),
                borderRadius: "full",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: useColorModeValue("gray.400", "whiteAlpha.300"),
              },
            }}
          >
            {/* Option: All Categories */}
            <MenuItem
              onClick={() => onChange("all")}
              borderRadius="10px"
              bg={value === "all" || !value ? itemSelectedBg : "transparent"}
              _hover={{ bg: itemHoverBg }}
              py={2.5}
              px={3}
              mb={1}
            >
              <Flex align="center" justify="space-between" w="100%">
                <HStack spacing={2}>
                  <Text
                    fontSize="xs"
                    fontWeight={value === "all" || !value ? "700" : "500"}
                    color={value === "all" || !value ? dashboardPalette.accent : textPrimary}
                  >
                    All Categories
                  </Text>
                </HStack>
                {(value === "all" || !value) && (
                  <Icon as={FiCheck} color={dashboardPalette.accent} boxSize={4} />
                )}
              </Flex>
            </MenuItem>

            {/* Searched / Root Categories List */}
            {optionsToDisplay.map((cat: any) => {
              const isSelected = String(value) === String(cat._id);
              return (
                <MenuItem
                  key={cat._id}
                  onClick={() => onChange(String(cat._id))}
                  borderRadius="10px"
                  bg={isSelected ? itemSelectedBg : "transparent"}
                  _hover={{ bg: itemHoverBg }}
                  py={2.5}
                  px={3}
                  mb={1}
                >
                  <Flex align="center" justify="space-between" w="100%">
                    <Text
                      fontSize="xs"
                      fontWeight={isSelected ? "700" : "500"}
                      color={isSelected ? dashboardPalette.accent : textPrimary}
                      isTruncated
                      maxW="190px"
                    >
                      {cat.name}
                    </Text>
                    {isSelected && (
                      <Icon as={FiCheck} color={dashboardPalette.accent} boxSize={4} />
                    )}
                  </Flex>
                </MenuItem>
              );
            })}

            {optionsToDisplay.length === 0 && !isSearching && (
              <Box py={5} textAlign="center">
                <Text fontSize="xs" color={textMuted}>
                  No categories found
                </Text>
              </Box>
            )}
          </Box>
        </MenuList>
      </Portal>
    </Menu>
  );
};
