"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
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
  Avatar,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiChevronDown, FiSearch, FiCheck, FiShoppingBag } from "react-icons/fi";
import stores from "../../../store/stores";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";

export interface SearchableSellerSelectProps {
  value: string;
  onChange: (companyId: string) => void;
  size?: "sm" | "md";
  refreshTrigger?: number;
}

export const SearchableSellerSelect: React.FC<SearchableSellerSelectProps> = ({
  value,
  onChange,
  size = "sm",
  refreshTrigger,
}) => {
  const { companyStore } = stores;
  const [searchTerm, setSearchTerm] = useState("");
  const [shops, setShops] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedShop, setSelectedShop] = useState<any>(null);
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

  // Fetch initial shops (top 15) on mount or refreshTrigger using cached store data
  useEffect(() => {
    let isMounted = true;
    const force = Boolean(refreshTrigger && refreshTrigger > 0);
    companyStore
      .getAllShops({
        limit: 15,
        page: 1,
        shopStatus: "all",
        includeInactive: true,
      }, force)
      .then((res: any) => {
        if (isMounted && res?.data?.data) {
          setShops(res.data.data);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [companyStore, refreshTrigger]);

  // Sync selectedShop object if value changes
  useEffect(() => {
    if (!value || value === "all") {
      setSelectedShop(null);
      return;
    }
    const found = shops.find((s: any) => String(s._id) === String(value));
    if (found) {
      setSelectedShop(found);
    }
  }, [value, shops]);

  // Real-time backend search with debounce
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const payload: any = {
          limit: 20,
          page: 1,
          shopStatus: "all",
          includeInactive: true,
        };
        if (val.trim()) {
          payload.name = val.trim();
        }
        const res = await companyStore.getAllShops(payload, true);
        if (res?.data?.data && Array.isArray(res.data.data)) {
          setShops(res.data.data);
        }
      } catch {
        // Handled gracefully
      } finally {
        setIsSearching(false);
      }
    }, 280);
  };

  const displayLabel = useMemo(() => {
    if (!value || value === "all") return "All Sellers / Shops";
    if (selectedShop?.name) return selectedShop.name;
    const found = shops.find((s: any) => String(s._id) === String(value));
    return found?.name || "Selected Shop";
  }, [value, selectedShop, shops]);

  return (
    <Menu isLazy closeOnSelect={true} placement="bottom-end">
      <MenuButton
        as={Button}
        rightIcon={<FiChevronDown size={13} />}
        h="36px"
        px={3}
        borderRadius="full"
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
        maxW={{ base: "100%", md: "260px" }}
      >
        <HStack spacing={2} overflow="hidden">
          <Icon as={FiShoppingBag} color={value && value !== "all" ? dashboardPalette.accent : textMuted} boxSize={3.5} flexShrink={0} />
          <Text isTruncated fontSize="xs">
            {displayLabel}
          </Text>
          {value && value !== "all" ? (
            <Badge
              bg={dashboardPalette.accent}
              color="white"
              borderRadius="full"
              fontSize="9px"
              px={1.5}
            >
              FILTERED
            </Badge>
          ) : null}
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
          minW="270px"
          maxW="320px"
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
                placeholder="Search shop by name..."
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
            maxH="240px"
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
            {/* Option: All Sellers */}
            <MenuItem
              onClick={() => {
                setSelectedShop(null);
                onChange("all");
              }}
              borderRadius="10px"
              bg={!value || value === "all" ? itemSelectedBg : "transparent"}
              _hover={{ bg: itemHoverBg }}
              py={2.5}
              px={3}
              mb={1}
            >
              <Flex align="center" justify="space-between" w="100%">
                <HStack spacing={2.5}>
                  <Flex
                    w="26px"
                    h="26px"
                    borderRadius="full"
                    bg={useColorModeValue("gray.100", "whiteAlpha.100")}
                    align="center"
                    justify="center"
                  >
                    <Icon as={FiShoppingBag} boxSize={3.5} color={textMuted} />
                  </Flex>
                  <Text
                    fontSize="xs"
                    fontWeight={!value || value === "all" ? "700" : "500"}
                    color={!value || value === "all" ? dashboardPalette.accent : textPrimary}
                  >
                    All Sellers / Shops
                  </Text>
                </HStack>
                {(!value || value === "all") && (
                  <Icon as={FiCheck} color={dashboardPalette.accent} boxSize={4} />
                )}
              </Flex>
            </MenuItem>

            {/* Searched Shops List */}
            {shops.map((shop: any) => {
              const isSelected = String(value) === String(shop._id);
              return (
                <MenuItem
                  key={shop._id}
                  onClick={() => {
                    setSelectedShop(shop);
                    onChange(String(shop._id));
                  }}
                  borderRadius="10px"
                  bg={isSelected ? itemSelectedBg : "transparent"}
                  _hover={{ bg: itemHoverBg }}
                  py={2.5}
                  px={3}
                  mb={1}
                >
                  <Flex align="center" justify="space-between" w="100%">
                    <HStack spacing={2.5} overflow="hidden">
                      <Avatar
                        size="xs"
                        name={shop.name}
                        src={shop.logo?.url}
                        boxSize="26px"
                        borderRadius="md"
                      />
                      <Box textAlign="left" overflow="hidden">
                        <Text
                          fontSize="xs"
                          fontWeight={isSelected ? "700" : "500"}
                          color={isSelected ? dashboardPalette.accent : textPrimary}
                          isTruncated
                          maxW="180px"
                        >
                          {shop.name}
                        </Text>
                        {shop.companyCode ? (
                          <Text fontSize="10px" color={textMuted}>
                            {shop.companyCode}
                          </Text>
                        ) : null}
                      </Box>
                    </HStack>
                    {isSelected && (
                      <Icon as={FiCheck} color={dashboardPalette.accent} boxSize={4} ml={2} />
                    )}
                  </Flex>
                </MenuItem>
              );
            })}

            {shops.length === 0 && !isSearching && (
              <Box py={5} textAlign="center">
                <Text fontSize="xs" color={textMuted}>
                  No shops found
                </Text>
              </Box>
            )}
          </Box>
        </MenuList>
      </Portal>
    </Menu>
  );
};
