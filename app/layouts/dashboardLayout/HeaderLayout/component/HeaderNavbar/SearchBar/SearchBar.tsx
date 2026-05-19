"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Box,
  InputGroup,
  Input,
  InputLeftElement,
  List,
  ListItem,
  Flex,
  Text,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import debounce from "lodash.debounce";
import Link from "next/link";
import { observer } from "mobx-react-lite";
import stores from "../../../../../../store/stores";
import { getSidebarDataByRole, sidebarFooterData } from "../../../../SidebarLayout/utils/SidebarItems";
import { dashboardPalette } from "../../../../dashboardPalette";

type SearchableSidebarItem = {
  id: number;
  name: string;
  icon: any;
  url: string;
  role?: string[];
  children?: SearchableSidebarItem[];
};

const flattenSidebarItems = (items: SearchableSidebarItem[]): SearchableSidebarItem[] =>
  items.flatMap((item) => [item, ...(item.children ? flattenSidebarItems(item.children) : [])]);

const SearchBar = observer(() => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { user } = stores.auth;

  // Theme-aware tokens
  const cShell = useColorModeValue("white", dashboardPalette.shell);
  const cSurface = useColorModeValue("white", dashboardPalette.surface);
  const cSurfaceAlt = useColorModeValue("gray.50", dashboardPalette.surfaceAlt);
  const cSurfaceSoft = useColorModeValue("gray.100", dashboardPalette.surfaceSoft);
  const cBorder = useColorModeValue("blue.100", dashboardPalette.border);
  const cBorderStrong = useColorModeValue("gray.300", dashboardPalette.borderStrong);
  const cText = useColorModeValue("gray.800", dashboardPalette.text);
  const cTextMuted = useColorModeValue("gray.500", dashboardPalette.textMuted);
  const cAccent = useColorModeValue("blue.600", dashboardPalette.accent);
  const cAccentGlow = useColorModeValue("rgba(37, 99, 235, 0.1)", dashboardPalette.accentGlow);
  const cHighlight = useColorModeValue("blue.600", dashboardPalette.success);

  const searchableItems = useMemo(() => {
    const rawRoles = Array.isArray(user?.role)
      ? user.role.filter(Boolean)
      : [user?.role, user?.type].filter(Boolean);
    const hasCompany = Boolean(user?.company?._id || user?.company);
    const isSuperAdmin = rawRoles.includes("superAdmin");
    const isBuyerOnlyUser =
      !isSuperAdmin &&
      !rawRoles.includes("admin") &&
      !hasCompany &&
      user?.type !== "seller";
    const roles = isSuperAdmin
      ? ["superAdmin"]
      : isBuyerOnlyUser
        ? ["buyer"]
        : ["seller", "admin", ...rawRoles];

    return flattenSidebarItems([
      ...getSidebarDataByRole(roles),
      ...sidebarFooterData.filter(
        (item) => !item.role || item.role.some((role) => roles.includes(role))
      ),
    ]);
  }, [user]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setResults([]);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSearch = useMemo(
    () => (query: string) => {
      setSearchQuery(query);

      if (!query.trim()) {
        setResults([]);
        return;
      }

      const normalizedQuery = query.toLowerCase();
      const filtered = searchableItems.filter((item) =>
        item?.name?.toLowerCase()?.includes(normalizedQuery)
      );
      setResults(filtered);
    },
    [searchableItems]
  );

  const handleSearchDebounced = useMemo(
    () => debounce((query: string) => handleSearch(query), 100),
    [handleSearch]
  );

  useEffect(() => {
    return () => {
      handleSearchDebounced.cancel();
    };
  }, [handleSearchDebounced]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const normalizedQuery = searchQuery.toLowerCase();
    setResults(
      searchableItems.filter((item) => item?.name?.toLowerCase()?.includes(normalizedQuery))
    );
  }, [searchQuery, searchableItems]);

  // Function to highlight the searched term
  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));

    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <Text as="span" key={index} color={cHighlight} fontWeight="800">
          {part}
        </Text>
      ) : (
        <Text as="span" key={index}>
          {part}
        </Text>
      )
    );
  };


  return (
    <Box position="relative" width={{ base: "full", md: "320px" }} ref={dropdownRef}>
      <InputGroup size="md">
        <InputLeftElement pointerEvents="none" h="full" px={4}>
          <Icon as={FaSearch} color={cTextMuted} boxSize={3.5} />
        </InputLeftElement>
        <Input
          placeholder="Search features..."
          bg={cSurfaceAlt}
          border="1px solid"
          borderColor={cBorder}
          color={cText}
          _placeholder={{ color: cTextMuted, fontSize: "sm" }}
          _focus={{ 
            borderColor: cAccent, 
            boxShadow: `0 0 0 1px ${cAccent}, 0 4px 20px ${cAccentGlow}`,
            bg: cSurface
          }}
          _hover={{ borderColor: cBorderStrong }}
          borderRadius="18px"
          h="44px"
          pl={10}
          fontSize="sm"
          fontWeight="500"
          value={searchQuery}
          onChange={(e) => handleSearchDebounced(e.target.value)}
          transition="all 0.2s"
        />
      </InputGroup>

      {results.length > 0 && (
        <List
          bg={cSurface}
          mt={3}
          borderRadius="22px"
          boxShadow={useColorModeValue(
            "0 12px 30px rgba(0,0,0,0.08)",
            "0 24px 60px rgba(0,0,0,0.45)"
          )}
          position="absolute"
          width="100%"
          zIndex={100}
          border="1px solid"
          borderColor={cBorder}
          maxHeight="320px"
          overflowY="auto"
          overflowX="hidden"
          p={2}
          className="customScrollBar"
        >
          {results.map((result: any, index: number) => (
            <ListItem
              key={result.url}
              px={4}
              py={3}
              borderRadius="14px"
              _hover={{
                bg: cSurfaceSoft,
                cursor: "pointer",
                transform: "translateX(4px)",
              }}
              transition="all 0.2s ease-in-out"
              mb={index < results.length - 1 ? 1 : 0}
            >
              <Link
                href={result.url}
                onClick={() => {
                  setSearchQuery("");
                  setResults([]);
                }}
              >
                <Flex align="center" gap={4}>
                  <Box 
                    fontSize="20px" 
                    color={cAccent}
                    p={2}
                    borderRadius="10px"
                    bg={cAccentGlow}
                  >
                    {result.icon}
                  </Box>
                  <Box>
                    <Text fontWeight="700" fontSize="sm" color={cText} lineHeight="1.2">
                      {highlightText(result.name, searchQuery)}
                    </Text>
                    <Text fontSize="11px" color={cTextMuted} mt={0.5}>
                      Navigation Menu
                    </Text>
                  </Box>
                </Flex>
              </Link>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
});

export default SearchBar;
