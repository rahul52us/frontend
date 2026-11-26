import React from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiCalendar, FiDatabase, FiDownload, FiFolderPlus, FiSearch, FiX } from "react-icons/fi";
import { merchantPrimaryButtonProps } from "../../../components/common/merchantDashboardUI";

export interface CategoryToolbarProps {
  hierarchyFilter: "all" | "root" | "sub";
  onHierarchyChange: (type: "all" | "root" | "sub") => void;
  totalCategories: number;
  rootCategories: number;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  onClearDates: () => void;
  onExportExcel: () => void;
  isExporting: boolean;
  onSeedCatalog: () => void;
  isSeeding: boolean;
  onAddClick: () => void;
}

export const CategoryToolbar: React.FC<CategoryToolbarProps> = ({
  hierarchyFilter,
  onHierarchyChange,
  totalCategories,
  rootCategories,
  searchQuery,
  onSearchChange,
  onClearSearch,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClearDates,
  onExportExcel,
  isExporting,
  onSeedCatalog,
  isSeeding,
  onAddClick,
}) => {
  return (
    <VStack spacing={3} align="stretch" mb={4} w="100%">
      {/* Row 1: Hierarchy Tabs (Left) + Primary Action Buttons (Right) */}
      <Flex
        justify="space-between"
        align="center"
        direction={{ base: "column", md: "row" }}
        gap={3}
        flexWrap="wrap"
      >
        {/* Left: Filter Buttons */}
        <HStack spacing={2} flexWrap="wrap">
          <Button
            size="sm"
            h="36px"
            px={3.5}
            bg={hierarchyFilter === "all" ? "var(--color-primary, #065F68)" : "transparent"}
            color={hierarchyFilter === "all" ? "white" : "var(--merchant-text-muted, #94a3b8)"}
            border="1px solid"
            borderColor={hierarchyFilter === "all" ? "var(--color-primary, #065F68)" : "var(--merchant-border, #1f2e46)"}
            _hover={{
              bg: hierarchyFilter === "all" ? "var(--color-primary-hover, #044249)" : "rgba(255, 255, 255, 0.04)",
              borderColor: "var(--color-primary, #065F68)",
            }}
            borderRadius="10px"
            fontWeight="600"
            fontSize="xs"
            onClick={() => onHierarchyChange("all")}
          >
            All Categories ({totalCategories})
          </Button>
          <Button
            size="sm"
            h="36px"
            px={3.5}
            bg={hierarchyFilter === "root" ? "var(--color-primary, #065F68)" : "transparent"}
            color={hierarchyFilter === "root" ? "white" : "var(--merchant-text-muted, #94a3b8)"}
            border="1px solid"
            borderColor={hierarchyFilter === "root" ? "var(--color-primary, #065F68)" : "var(--merchant-border, #1f2e46)"}
            _hover={{
              bg: hierarchyFilter === "root" ? "var(--color-primary-hover, #044249)" : "rgba(255, 255, 255, 0.04)",
              borderColor: "var(--color-primary, #065F68)",
            }}
            borderRadius="10px"
            fontWeight="600"
            fontSize="xs"
            onClick={() => onHierarchyChange("root")}
          >
            Master Roots Only ({rootCategories})
          </Button>
        </HStack>

        {/* Right: Load Catalog + Add Category */}
        <HStack spacing={2.5} flexWrap="wrap">
          <Button
            leftIcon={<FiDatabase />}
            onClick={onSeedCatalog}
            isLoading={isSeeding}
            loadingText="Seeding..."
            variant="outline"
            size="sm"
            h="36px"
            px={3.5}
            borderRadius="10px"
            fontSize="xs"
            fontWeight="600"
            borderColor="var(--color-primary, #065F68)"
            color="var(--color-primary, #065F68)"
            _hover={{
              bg: "var(--color-primary-light, #e6f4f5)",
              borderColor: "var(--color-primary-hover, #055159)",
            }}
          >
            1-Click Load Full Catalog
          </Button>
          <Button
            leftIcon={<FiFolderPlus />}
            onClick={onAddClick}
            size="sm"
            h="36px"
            px={4}
            borderRadius="10px"
            fontSize="xs"
            fontWeight="600"
            bg="var(--color-primary, #065F68)"
            _hover={{
              bg: "var(--color-primary-hover, #044249)",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(6, 95, 104, 0.3)",
            }}
            _active={{ bg: "var(--color-primary-dark, #032b30)" }}
            color="white"
            boxShadow="0 2px 6px rgba(6, 95, 104, 0.2)"
            transition="all 0.15s ease"
          >
            Add Category
          </Button>
        </HStack>
      </Flex>

      {/* Row 2: Search Input + Date Range Picker + Export Excel (Clean inline toolbar matching Users & Shops) */}
      <Flex
        justify="space-between"
        align="center"
        direction={{ base: "column", md: "row" }}
        gap={2.5}
        flexWrap="wrap"
      >
        <InputGroup size="sm" maxW={{ base: "100%", md: "320px" }}>
          <InputLeftElement pointerEvents="none" h="38px">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search categories, keywords, slug..."
            value={searchQuery}
            onChange={onSearchChange}
            h="38px"
            borderRadius="12px"
            fontSize="xs"
            bg="var(--merchant-surface-alt)"
            borderColor="var(--merchant-border-strong)"
            _hover={{ borderColor: "brand.400" }}
            _focus={{
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
            }}
          />
          {searchQuery && (
            <InputRightElement h="38px">
              <IconButton
                aria-label="Clear search"
                icon={<FiX />}
                size="xs"
                variant="ghost"
                onClick={onClearSearch}
              />
            </InputRightElement>
          )}
        </InputGroup>

        <HStack spacing={2.5} flexWrap="wrap" align="center" ml={{ base: 0, md: "auto" }}>
          {/* Compact Date Range Filter */}
          <HStack
            spacing={1.5}
            bg="var(--merchant-surface-alt)"
            px={2.5}
            py={1}
            borderRadius="12px"
            border="1px solid"
            borderColor="var(--merchant-border-strong)"
            align="center"
            h="38px"
          >
            <Icon as={FiCalendar} color="var(--color-primary, #065F68)" boxSize={3.5} />
            <Box
              as="input"
              type="date"
              h="24px"
              w="115px"
              border="none"
              bg="transparent"
              outline="none"
              fontSize="11px"
              color="var(--merchant-text)"
              value={startDate}
              onChange={(e: any) => onStartDateChange(e.target.value)}
            />
            <Text fontSize="10px" color="gray.400" fontWeight={700}>
              TO
            </Text>
            <Box
              as="input"
              type="date"
              h="24px"
              w="115px"
              border="none"
              bg="transparent"
              outline="none"
              fontSize="11px"
              color="var(--merchant-text)"
              value={endDate}
              onChange={(e: any) => onEndDateChange(e.target.value)}
            />
            {(startDate || endDate) && (
              <IconButton
                aria-label="Clear dates"
                icon={<Icon as={FiX} />}
                size="xs"
                h="18px"
                w="18px"
                minW="18px"
                variant="ghost"
                colorScheme="red"
                onClick={onClearDates}
              />
            )}
          </HStack>

          {/* Export Excel Button with Theme Colors */}
          <Button
            size="sm"
            h="38px"
            px={3.5}
            bg="var(--color-primary, #065F68)"
            _hover={{
              bg: "var(--color-primary-hover, #044249)",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(6, 95, 104, 0.3)",
            }}
            _active={{ bg: "var(--color-primary-dark, #032b30)" }}
            color="white"
            borderRadius="12px"
            fontSize="xs"
            fontWeight={600}
            leftIcon={<Icon as={FiDownload} boxSize={3.5} />}
            isLoading={isExporting}
            loadingText="Exporting..."
            boxShadow="0 2px 6px rgba(6, 95, 104, 0.2)"
            transition="all 0.15s ease"
            onClick={onExportExcel}
          >
            Export Excel
          </Button>
        </HStack>
      </Flex>
    </VStack>
  );
};

export default CategoryToolbar;


