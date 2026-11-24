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
  Spinner,
  Text,
  Button,
} from "@chakra-ui/react";
import { FiChevronDown, FiSearch, FiCheck, FiLayers } from "react-icons/fi";
import stores from "../../../store/stores";

interface SearchableCategorySelectProps {
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
        bg="var(--merchant-surface-alt)"
        borderColor="var(--merchant-border-strong)"
        border="1px solid"
        color="var(--merchant-text)"
        fontSize="xs"
        fontWeight="600"
        maxW={{ base: "100%", sm: "200px" }}
        w={{ base: "100%", sm: "auto" }}
        textAlign="left"
        _hover={{
          borderColor: "var(--color-primary, #065F68)",
          bg: "rgba(255, 255, 255, 0.04)",
        }}
        _active={{
          bg: "var(--merchant-surface-alt)",
        }}
      >
        <Text noOfLines={1} pr={1}>
          {displayLabel}
        </Text>
      </MenuButton>

      <MenuList
        bg="var(--merchant-surface, #0d1522)"
        borderColor="var(--merchant-border-strong, #1f2e46)"
        boxShadow="0 14px 28px rgba(0, 0, 0, 0.4)"
        borderRadius="14px"
        p={2}
        minW="220px"
        maxW="280px"
        zIndex={1400}
      >
        {/* Search input inside dropdown */}
        <Box p={1} mb={1.5}>
          <InputGroup size="sm">
            <InputLeftElement pointerEvents="none" h="32px">
              {isSearching ? (
                <Spinner size="xs" color="var(--color-primary, #065F68)" />
              ) : (
                <Icon as={FiSearch} color="gray.400" size={12} />
              )}
            </InputLeftElement>
            <Input
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search category in real-time..."
              borderRadius="8px"
              h="32px"
              fontSize="xs"
              bg="var(--merchant-surface-alt, #131d2e)"
              borderColor="var(--merchant-border-strong, #1f2e46)"
              _focus={{
                borderColor: "var(--color-primary, #065F68)",
                boxShadow: "0 0 0 1px var(--color-primary, #065F68)",
              }}
              color="var(--merchant-text, #ffffff)"
              autoFocus
            />
          </InputGroup>
        </Box>

        {/* Scrollable list of options */}
        <Box maxH="220px" overflowY="auto" pr={1}>
          {/* Default 'All Categories' Option */}
          <MenuItem
            bg={value === "all" ? "var(--color-primary, #065F68)" : "transparent"}
            color={value === "all" ? "white" : "var(--merchant-text, #ffffff)"}
            _hover={{
              bg: value === "all" ? "var(--color-primary-hover, #044249)" : "rgba(255, 255, 255, 0.08)",
            }}
            borderRadius="8px"
            fontSize="xs"
            fontWeight="600"
            py={2}
            px={2.5}
            onClick={() => onChange("all")}
          >
            <HStack justify="space-between" w="100%">
              <Text>All Categories</Text>
              {value === "all" && <FiCheck size={12} />}
            </HStack>
          </MenuItem>

          {optionsToDisplay.map((cat: any) => {
            const isSelected = String(value) === String(cat._id);
            return (
              <MenuItem
                key={cat._id}
                bg={isSelected ? "var(--color-primary, #065F68)" : "transparent"}
                color={isSelected ? "white" : "var(--merchant-text, #ffffff)"}
                _hover={{
                  bg: isSelected ? "var(--color-primary-hover, #044249)" : "rgba(255, 255, 255, 0.08)",
                }}
                borderRadius="8px"
                fontSize="xs"
                fontWeight={isSelected ? "700" : "500"}
                py={2}
                px={2.5}
                onClick={() => onChange(String(cat._id))}
              >
                <HStack justify="space-between" w="100%">
                  <Text noOfLines={1} title={cat.name}>
                    {cat.name}
                  </Text>
                  {isSelected && <FiCheck size={12} />}
                </HStack>
              </MenuItem>
            );
          })}

          {searchTerm.trim() && optionsToDisplay.length === 0 && !isSearching && (
            <Box py={4} textAlign="center">
              <Text fontSize="xs" color="var(--merchant-text-muted, #94a3b8)">
                No categories found
              </Text>
            </Box>
          )}
        </Box>
      </MenuList>
    </Menu>
  );
};

