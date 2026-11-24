import React from "react";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiSliders } from "react-icons/fi";
import {
  MerchantBadge,
  merchantPrimaryButtonProps,
} from "../../../components/common/merchantDashboardUI";
import { getCategoryColor } from "./CategoryMobileCard";

export interface CategoryFilterSetupCardProps {
  category: any;
  index: number;
  onConfigureFilters: (category: any) => void;
}

export const CategoryFilterSetupCard: React.FC<CategoryFilterSetupCardProps> = ({
  category,
  index,
  onConfigureFilters,
}) => {
  const filterConfig = category.filterConfig || [];
  const activeFilterCount = filterConfig.filter(
    (item: any) => item.isActive !== false,
  ).length;
  const previewFilters = filterConfig.slice(0, 3);
  const colorTheme = getCategoryColor(index);

  return (
    <Box
      border="1px solid"
      borderColor="var(--color-border, #E2E8F0)"
      borderTop="3.5px solid"
      borderTopColor={colorTheme.accent}
      borderRadius="16px"
      p={{ base: 3.5, md: 4.5 }}
      bg="var(--merchant-surface, white)"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      position="relative"
      overflow="hidden"
      boxShadow="0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.03)"
      transition="all 0.2s ease"
      _hover={{
        borderColor: "var(--color-border-strong, #CBD5E1)",
        boxShadow: `0 8px 24px ${colorTheme.bgSoft}`,
        borderTopColor: colorTheme.accent,
      }}
    >
      <VStack align="stretch" spacing={3}>
        {/* Category Name & Status Badges */}
        <Box>
          <Text
            fontWeight="700"
            fontSize={{ base: "sm", md: "md" }}
            color="var(--merchant-text)"
            noOfLines={1}
          >
            {category.name}
          </Text>
          <HStack spacing={1.5} mt={1.5} flexWrap="wrap">
            <MerchantBadge
              tone={category.parent ? "info" : "soft"}
              size="sm"
            >
              {category.parent
                ? typeof category.parent === "object"
                  ? category.parent.name
                  : "Child"
                : "Root"}
            </MerchantBadge>
            <MerchantBadge
              tone={category.isActive ? "success" : "danger"}
              size="sm"
            >
              {category.isActive ? "Active" : "Inactive"}
            </MerchantBadge>
          </HStack>
        </Box>

        {/* Filter Summary & Preview */}
        <Box p={2.5} borderRadius="12px" bg={colorTheme.bgSoft}>
          <Text
            fontSize={{ base: "xs", md: "sm" }}
            color="var(--merchant-text-muted)"
            fontWeight="600"
            mb={1}
          >
            {activeFilterCount} active filter{activeFilterCount === 1 ? "" : "s"}
          </Text>
          {previewFilters.length > 0 ? (
            <HStack spacing={1} flexWrap="wrap">
              {previewFilters.map((filter: any, idx: number) => (
                <MerchantBadge
                  key={`${filter.label}-${idx}`}
                  tone={filter.isActive === false ? "soft" : "accent"}
                  size="sm"
                >
                  {filter.label}
                </MerchantBadge>
              ))}
              {filterConfig.length > previewFilters.length && (
                <MerchantBadge tone="soft" size="sm">
                  +{filterConfig.length - previewFilters.length}
                </MerchantBadge>
              )}
            </HStack>
          ) : (
            <Text color="var(--merchant-text-muted)" fontSize="xs">
              No filters configured.
            </Text>
          )}
        </Box>
      </VStack>

      {/* Action Button: Mobile Icon vs Desktop Full Button */}
      <Box mt={4}>
        <Box display={{ base: "block", md: "none" }}>
          <IconButton
            aria-label="Configure Filters"
            icon={<FiSliders />}
            size="sm"
            w="100%"
            borderRadius="10px"
            onClick={() => onConfigureFilters(category)}
            bg="var(--color-primary, #065F68)"
            color="white"
            _hover={{
              bg: "var(--color-primary-hover, #044249)",
            }}
          />
        </Box>
        <Box display={{ base: "none", md: "block" }}>
          <Button
            leftIcon={<FiSliders />}
            onClick={() => onConfigureFilters(category)}
            w="100%"
            size="sm"
            borderRadius="10px"
            bg="var(--color-primary, #065F68)"
            color="white"
            fontWeight="600"
            _hover={{
              bg: "var(--color-primary-hover, #044249)",
            }}
          >
            Configure Filters
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CategoryFilterSetupCard;

