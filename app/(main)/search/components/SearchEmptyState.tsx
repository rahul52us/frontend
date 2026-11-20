"use client";

import {
  Box,
  Button,
  Circle,
  Heading,
  HStack,
  Icon,
  Text,
  useColorModeValue,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import React, { memo } from "react";
import { FiInbox, FiRefreshCcw, FiSearch } from "react-icons/fi";

const POPULAR_SEARCH_SUGGESTIONS = [
  "Electronics",
  "Fashion",
  "Shoes",
  "Home & Kitchen",
  "Beauty",
  "Local Stores",
  "Organic",
];

interface SearchEmptyStateProps {
  searchTerm?: string;
  hasFilters?: boolean;
  onResetFilters: () => void;
  onSelectSuggestion?: (query: string) => void;
}

export const SearchEmptyState = memo(
  ({
    searchTerm,
    hasFilters = false,
    onResetFilters,
    onSelectSuggestion,
  }: SearchEmptyStateProps) => {
    const cardBg = useColorModeValue("var(--color-surface)", "var(--color-surface)");
    const borderColor = useColorModeValue("var(--color-border)", "var(--color-border)");
    const titleColor = useColorModeValue("var(--color-text)", "var(--color-text)");
    const mutedColor = useColorModeValue("var(--color-text-muted)", "var(--color-text-muted)");
    const iconBg = useColorModeValue("var(--color-surface-hover)", "var(--color-surface-hover)");

    return (
      <VStack
        w="full"
        textAlign="center"
        py={{ base: 12, md: 16 }}
        px={{ base: 4, md: 8 }}
        spacing={4}
        bg={cardBg}
        borderRadius="3xl"
        border="1px dashed"
        borderColor={borderColor}
        boxShadow="xs"
      >
        <Circle size="64px" bg={iconBg} color="var(--color-primary)" mb={1}>
          <Icon as={hasFilters ? FiInbox : FiSearch} boxSize={7} />
        </Circle>

        <VStack spacing={1.5} maxW="md">
          <Heading as="h3" fontSize={{ base: "lg", md: "xl" }} fontWeight="800" color={titleColor}>
            {searchTerm
              ? `No products found for "${searchTerm}"`
              : "No matching products found"}
          </Heading>
          <Text fontSize="sm" color={mutedColor} lineHeight="1.5">
            {hasFilters
              ? "We couldn't find anything matching all your selected filters. Try removing a few filters or adjusting the price range."
              : "We couldn't find any products matching your query. Check your spelling or try more general keywords."}
          </Text>
        </VStack>

        <HStack spacing={3} pt={2}>
          {hasFilters && (
            <Button
              leftIcon={<FiRefreshCcw size={13} />}
              size="sm"
              h="38px"
              px={5}
              colorScheme="brand"
              borderRadius="full"
              fontWeight="700"
              onClick={onResetFilters}
            >
              Reset Filters
            </Button>
          )}
        </HStack>

        {/* Popular Suggestions */}
        {onSelectSuggestion && (
          <VStack spacing={2} pt={4} maxW="lg">
            <Text fontSize="xs" fontWeight="700" color={mutedColor} textTransform="uppercase" letterSpacing="wider">
              Popular Searches
            </Text>
            <Wrap justify="center" spacing={2}>
              {POPULAR_SEARCH_SUGGESTIONS.map((tag) => (
                <Button
                  key={tag}
                  size="xs"
                  h="28px"
                  px={3}
                  variant="outline"
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="600"
                  borderColor={borderColor}
                  color="var(--color-text)"
                  _hover={{
                    borderColor: "var(--color-primary)",
                    color: "var(--color-primary)",
                    bg: "var(--color-primary-soft)",
                  }}
                  onClick={() => onSelectSuggestion(tag)}
                >
                  {tag}
                </Button>
              ))}
            </Wrap>
          </VStack>
        )}
      </VStack>
    );
  }
);

SearchEmptyState.displayName = "SearchEmptyState";
