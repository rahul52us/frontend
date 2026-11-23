import React from "react";
import {
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { FiDatabase, FiFolderPlus, FiSearch, FiX } from "react-icons/fi";
import { merchantPrimaryButtonProps } from "../../../components/common/merchantDashboardUI";

export interface CategoryToolbarProps {
  hierarchyFilter: "all" | "root" | "sub";
  onHierarchyChange: (type: "all" | "root" | "sub") => void;
  totalCategories: number;
  rootCategories: number;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
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
  onSeedCatalog,
  isSeeding,
  onAddClick,
}) => {
  return (
    <Flex
      justify="space-between"
      align="center"
      direction={{ base: "column", lg: "row" }}
      gap={3}
      mb={5}
      px={0.5}
    >
      <HStack spacing={2} flexWrap="wrap">
        <Button
          size="sm"
          h="38px"
          px={4}
          bg={hierarchyFilter === "all" ? "#094a82" : "transparent"}
          color={hierarchyFilter === "all" ? "white" : "var(--merchant-text-muted, #94a3b8)"}
          border="1px solid"
          borderColor={hierarchyFilter === "all" ? "#094a82" : "var(--merchant-border, #1f2e46)"}
          _hover={{
            bg: hierarchyFilter === "all" ? "#063864" : "rgba(255, 255, 255, 0.04)",
            borderColor: "#094a82",
          }}
          borderRadius="12px"
          fontWeight="600"
          onClick={() => onHierarchyChange("all")}
        >
          All Categories ({totalCategories})
        </Button>
        <Button
          size="sm"
          h="38px"
          px={4}
          bg={hierarchyFilter === "root" ? "#094a82" : "transparent"}
          color={hierarchyFilter === "root" ? "white" : "var(--merchant-text-muted, #94a3b8)"}
          border="1px solid"
          borderColor={hierarchyFilter === "root" ? "#094a82" : "var(--merchant-border, #1f2e46)"}
          _hover={{
            bg: hierarchyFilter === "root" ? "#063864" : "rgba(255, 255, 255, 0.04)",
            borderColor: "#094a82",
          }}
          borderRadius="12px"
          fontWeight="600"
          onClick={() => onHierarchyChange("root")}
        >
          Master Roots Only ({rootCategories})
        </Button>
      </HStack>

      <HStack spacing={3} flex={1} maxW={{ base: "100%", lg: "340px" }}>
        <InputGroup size="sm">
          <InputLeftElement pointerEvents="none" h="38px">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search categories, keywords..."
            value={searchQuery}
            onChange={onSearchChange}
            h="38px"
            borderRadius="12px"
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
      </HStack>

      <HStack spacing={2.5} justify="flex-end">
        <Button
          leftIcon={<FiDatabase />}
          onClick={onSeedCatalog}
          isLoading={isSeeding}
          loadingText="Seeding..."
          variant="outline"
          colorScheme="blue"
          size="sm"
          h="38px"
          px={4}
          borderRadius="12px"
          fontWeight="600"
          _hover={{ bg: "blue.50", borderColor: "blue.400" }}
        >
          1-Click Load Full Catalog
        </Button>
        <Button
          leftIcon={<FiFolderPlus />}
          onClick={onAddClick}
          size="sm"
          h="38px"
          px={4}
          borderRadius="12px"
          fontWeight="600"
          {...merchantPrimaryButtonProps}
        >
          Add Category
        </Button>
      </HStack>
    </Flex>
  );
};

export default CategoryToolbar;

