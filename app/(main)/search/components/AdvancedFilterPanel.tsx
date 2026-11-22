"use client";

import {
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useColorModeValue,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import React, { memo, useEffect, useMemo, useState } from "react";
import { FiFilter, FiSearch } from "react-icons/fi";
import { colorMap } from "../../products/components/ProductCard/constant";
import { PriceRangeControl } from "./PriceRangeControl";

const normalizeValues = (value: any): string[] =>
  Array.isArray(value) ? value : [];

export const getFacetSelection = (filters: any, facetKey: string): string[] => {
  if (facetKey.startsWith("variant:")) {
    return normalizeValues(filters.variants?.[facetKey.replace("variant:", "")]);
  }
  if (facetKey.startsWith("spec:")) {
    return normalizeValues(filters.specs?.[facetKey.replace("spec:", "")]);
  }
  if (facetKey.startsWith("information:")) {
    return normalizeValues(
      filters.information?.[facetKey.replace("information:", "")]
    );
  }
  return normalizeValues(filters[facetKey]);
};

export const getAdvancedFilterCount = (filters: any): number => {
  if (!filters) return 0;
  const baseCount = ["brand", "idea", "deal", "availability"].reduce(
    (count, key) => count + normalizeValues(filters[key]).length,
    0
  );
  const variantCount = (Object.values(filters.variants || {}) as any[]).reduce(
    (count: number, values: any) => count + normalizeValues(values).length,
    0
  );
  const specCount = (Object.values(filters.specs || {}) as any[]).reduce(
    (count: number, values: any) => count + normalizeValues(values).length,
    0
  );
  const informationCount = (
    Object.values(filters.information || {}) as any[]
  ).reduce(
    (count: number, values: any) => count + normalizeValues(values).length,
    0
  );
  const priceCount =
    filters.price?.min !== undefined || filters.price?.max !== undefined ? 1 : 0;

  return baseCount + variantCount + specCount + informationCount + priceCount;
};

export const compactAdvancedFilters = (filters: any): any => {
  const next: any = {};
  if (!filters) return next;

  ["brand", "idea", "deal", "availability"].forEach((key) => {
    const values = normalizeValues(filters[key]);
    if (values.length) {
      next[key] = values;
    }
  });

  const variants = Object.fromEntries(
    Object.entries(filters.variants || {}).filter(
      ([, values]) => normalizeValues(values).length > 0
    )
  );
  const specs = Object.fromEntries(
    Object.entries(filters.specs || {}).filter(
      ([, values]) => normalizeValues(values).length > 0
    )
  );
  const information = Object.fromEntries(
    Object.entries(filters.information || {}).filter(
      ([, values]) => normalizeValues(values).length > 0
    )
  );

  if (Object.keys(variants).length) next.variants = variants;
  if (Object.keys(specs).length) next.specs = specs;
  if (Object.keys(information).length) next.information = information;
  if (filters.price?.min !== undefined || filters.price?.max !== undefined) {
    next.price = filters.price;
  }

  return next;
};

interface AdvancedFilterPanelProps {
  facets: any[];
  filters: any;
  loading?: boolean;
  emptyMessage?: string;
  onToggle: (_facetKey: string, _value: string) => void;
  onPriceChange: (_min?: number, _max?: number) => void;
  onClear: () => void;
  hideHeader?: boolean;
}

export const AdvancedFilterPanel = memo(
  ({
    facets = [],
    filters,
    loading = false,
    emptyMessage,
    onToggle,
    onPriceChange,
    onClear,
    hideHeader = false,
  }: AdvancedFilterPanelProps) => {
    const borderColor = useColorModeValue("var(--color-border)", "var(--color-border)");
    const textMuted = useColorModeValue("var(--color-text-muted)", "var(--color-text-muted)");
    const textPrimary = useColorModeValue("var(--color-text)", "var(--color-text)");
    const boxBg = useColorModeValue("var(--color-surface-hover)", "var(--color-surface-hover)");
    const activeCount = getAdvancedFilterCount(filters);

    const priceFacet = facets.find((facet) => facet.type === "range");
    const priceMin = Number(priceFacet?.min || 0);
    const priceMax = Number(priceFacet?.max || 10000);
    const [draftPrice, setDraftPrice] = useState<[number, number] | null>(null);
    const [facetSearch, setFacetSearch] = useState<Record<string, string>>({});

    useEffect(() => {
      setDraftPrice(null);
    }, [filters.price?.min, filters.price?.max, priceMin, priceMax]);

    const handleFacetSearchChange = (key: string, term: string) => {
      setFacetSearch((prev) => ({ ...prev, [key]: term }));
    };

    if (!facets.length) {
      return (
        <Box py={6} textAlign="center">
          <Text color={textMuted} fontSize="xs">
            {loading ? "Discovering filters..." : emptyMessage || "Search products to see filter options."}
          </Text>
        </Box>
      );
    }

    return (
      <VStack align="stretch" spacing={5}>
        {!hideHeader && (
          <HStack
            justify="space-between"
            align="center"
            pb={3}
            borderBottom="1px solid"
            borderColor={borderColor}
          >
            <HStack spacing={2}>
              <Icon as={FiFilter} color="var(--color-primary)" boxSize={4} />
              <Text fontWeight="800" fontSize="sm" color={textPrimary} letterSpacing="-0.01em">
                Filters
              </Text>
              {activeCount > 0 && (
                <Badge
                  colorScheme="brand"
                  borderRadius="full"
                  px={2}
                  py={0.5}
                  fontSize="10px"
                  fontWeight="700"
                >
                  {activeCount}
                </Badge>
              )}
            </HStack>
            {activeCount > 0 && (
              <Button
                size="xs"
                variant="link"
                colorScheme="red"
                fontWeight="700"
                onClick={onClear}
              >
                Clear All
              </Button>
            )}
          </HStack>
        )}

        {facets.map((facet, idx) => {
          const isLast = idx === facets.length - 1;

          if (facet.type === "range") {
            const min = Number(facet.min || 0);
            const max = Number(facet.max || 10000);
            const selectedMin = Number(filters.price?.min ?? min);
            const selectedMax = Number(filters.price?.max ?? max);
            const sliderValue: [number, number] = draftPrice || [
              selectedMin,
              selectedMax,
            ];
            const lowerValue = Math.min(sliderValue[0], sliderValue[1]);
            const upperValue = Math.max(sliderValue[0], sliderValue[1]);

            return (
              <Box key={facet.key}>
                <Text
                  fontSize="xs"
                  fontWeight="800"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  color="var(--color-text-muted)"
                  mb={2.5}
                >
                  {facet.label || "Price Range"}
                </Text>

                {/* Min - Max Price Display Boxes */}
                <HStack spacing={2} mb={2.5}>
                  <Box
                    flex="1"
                    bg={boxBg}
                    px={2.5}
                    py={1.5}
                    rounded="xl"
                    border="1px solid"
                    borderColor={borderColor}
                  >
                    <Text fontSize="9px" color={textMuted} fontWeight="700" textTransform="uppercase">
                      Min Price
                    </Text>
                    <Text fontSize="xs" fontWeight="800" color={textPrimary}>
                      ₹{Math.round(lowerValue).toLocaleString("en-IN")}
                    </Text>
                  </Box>
                  <Text color="gray.400" fontSize="xs" fontWeight="700">
                    –
                  </Text>
                  <Box
                    flex="1"
                    bg={boxBg}
                    px={2.5}
                    py={1.5}
                    rounded="xl"
                    border="1px solid"
                    borderColor={borderColor}
                  >
                    <Text fontSize="9px" color={textMuted} fontWeight="700" textTransform="uppercase">
                      Max Price
                    </Text>
                    <Text fontSize="xs" fontWeight="800" color={textPrimary}>
                      ₹{Math.round(upperValue).toLocaleString("en-IN")}
                    </Text>
                  </Box>
                </HStack>

                {max > min && (
                  <PriceRangeControl
                    min={min}
                    max={max}
                    value={[lowerValue, upperValue]}
                    onChange={setDraftPrice}
                    onCommit={([nextMin, nextMax]) => {
                      if (nextMin <= min && nextMax >= max) {
                        onPriceChange(undefined, undefined);
                        return;
                      }
                      onPriceChange(nextMin, nextMax);
                    }}
                  />
                )}

                {/* Quick Price Bucket Pills */}
                {(facet.buckets || []).length > 0 && (
                  <Wrap spacing={1.5} mt={2.5}>
                    {(facet.buckets || []).map((bucket: any) => {
                      const isBucketActive =
                        filters.price?.min === bucket.min &&
                        filters.price?.max === bucket.max;
                      return (
                        <Button
                          key={bucket.value}
                          size="xs"
                          h="26px"
                          px={2.5}
                          rounded="full"
                          fontSize="11px"
                          variant={isBucketActive ? "solid" : "outline"}
                          colorScheme={isBucketActive ? "brand" : "gray"}
                          borderColor={isBucketActive ? "transparent" : borderColor}
                          onClick={() => {
                            if (isBucketActive) {
                              onPriceChange(undefined, undefined);
                              return;
                            }
                            onPriceChange(bucket.min, bucket.max);
                          }}
                        >
                          {bucket.label}
                        </Button>
                      );
                    })}
                  </Wrap>
                )}

                {!isLast && <Divider mt={4} borderColor={borderColor} />}
              </Box>
            );
          }

          const selectedValues = getFacetSelection(filters, facet.key);
          const filterTerm = (facetSearch[facet.key] || "").toLowerCase().trim();
          const displayOptions = (facet.options || []).filter((opt: any) =>
            filterTerm ? String(opt.label || "").toLowerCase().includes(filterTerm) : true
          );

          return (
            <Box key={facet.key}>
              <Flex justify="space-between" align="center" mb={2}>
                <Text
                  fontSize="xs"
                  fontWeight="800"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  color="var(--color-text-muted)"
                >
                  {facet.label}
                </Text>
                {selectedValues.length > 0 && (
                  <Badge
                    colorScheme="brand"
                    variant="subtle"
                    borderRadius="full"
                    px={1.5}
                    fontSize="9px"
                    fontWeight="700"
                  >
                    {selectedValues.length}
                  </Badge>
                )}
              </Flex>

              {/* Filter Search for facets with > 6 items */}
              {(facet.options || []).length > 6 && (
                <InputGroup size="xs" mb={2}>
                  <InputLeftElement pointerEvents="none">
                    <FiSearch color="gray" size={12} />
                  </InputLeftElement>
                  <Input
                    placeholder={`Search ${facet.label}...`}
                    value={facetSearch[facet.key] || ""}
                    onChange={(e) => handleFacetSearchChange(facet.key, e.target.value)}
                    borderRadius="md"
                    borderColor={borderColor}
                    _focus={{ borderColor: "var(--color-primary)" }}
                  />
                </InputGroup>
              )}

              {/* Color Swatch Type */}
              {facet.type === "color" ? (
                <Wrap spacing={2}>
                  {displayOptions.map((option: any) => {
                    const isSelected = selectedValues.includes(option.value);
                    const swatchColor =
                      colorMap[String(option.label || "").toLowerCase()] ||
                      String(option.value || "").toLowerCase();

                    return (
                      <Flex
                        key={option.value}
                        as="button"
                        onClick={() => onToggle(facet.key, option.value)}
                        align="center"
                        gap={1.5}
                        px={2.5}
                        py={1}
                        borderRadius="full"
                        border="1px solid"
                        borderColor={isSelected ? "var(--color-primary)" : borderColor}
                        bg={isSelected ? "var(--color-primary-soft)" : "transparent"}
                        transition="all 0.15s ease"
                        _hover={{ borderColor: "var(--color-primary)" }}
                      >
                        <Box
                          boxSize="13px"
                          rounded="full"
                          border="1px solid"
                          borderColor="gray.300"
                          bg={swatchColor}
                          flexShrink={0}
                        />
                        <Text
                          fontSize="xs"
                          fontWeight={isSelected ? "700" : "500"}
                          color={isSelected ? "var(--color-primary)" : textPrimary}
                        >
                          {option.label}
                        </Text>
                        {option.count !== undefined && (
                          <Text fontSize="10px" color={textMuted}>
                            ({option.count})
                          </Text>
                        )}
                      </Flex>
                    );
                  })}
                </Wrap>
              ) : facet.type === "button" ? (
                /* Button Toggle Type */
                <Wrap spacing={1.5}>
                  {displayOptions.map((option: any) => {
                    const isSelected = selectedValues.includes(option.value);
                    return (
                      <Button
                        key={option.value}
                        size="xs"
                        h="28px"
                        px={2.5}
                        rounded="full"
                        variant={isSelected ? "solid" : "outline"}
                        colorScheme={isSelected ? "brand" : "gray"}
                        borderColor={isSelected ? "transparent" : borderColor}
                        fontSize="xs"
                        fontWeight={isSelected ? "700" : "500"}
                        onClick={() => onToggle(facet.key, option.value)}
                      >
                        {option.label}
                        {option.count !== undefined && (
                          <Text as="span" ml={1} opacity={0.7} fontSize="10px">
                            ({option.count})
                          </Text>
                        )}
                      </Button>
                    );
                  })}
                </Wrap>
              ) : (
                /* Standard Checkbox List */
                <VStack
                  align="stretch"
                  spacing={1}
                  maxH="220px"
                  overflowY="auto"
                  pr={1}
                  sx={{
                    "&::-webkit-scrollbar": { width: "4px" },
                    "&::-webkit-scrollbar-thumb": {
                      background: "var(--color-border)",
                      borderRadius: "full",
                    },
                  }}
                >
                  {displayOptions.length === 0 ? (
                    <Text fontSize="xs" color={textMuted} py={2} textAlign="center">
                      No matching options
                    </Text>
                  ) : (
                    displayOptions.map((option: any) => {
                      const isSelected = selectedValues.includes(option.value);

                      return (
                        <Flex
                          key={option.value}
                          align="center"
                          justify="space-between"
                          py={1}
                          px={2}
                          rounded="lg"
                          _hover={{ bg: boxBg }}
                          cursor="pointer"
                          onClick={() => onToggle(facet.key, option.value)}
                        >
                          <Checkbox
                            isChecked={isSelected}
                            onChange={() => onToggle(facet.key, option.value)}
                            colorScheme="brand"
                            size="sm"
                            pointerEvents="none"
                          >
                            <Text
                              fontSize="xs"
                              fontWeight={isSelected ? "700" : "500"}
                              color={isSelected ? "var(--color-primary)" : textPrimary}
                              noOfLines={1}
                            >
                              {option.label}
                            </Text>
                          </Checkbox>

                          {option.count !== undefined && (
                            <Text fontSize="10px" color={textMuted} fontWeight="600">
                              {option.count}
                            </Text>
                          )}
                        </Flex>
                      );
                    })
                  )}
                </VStack>
              )}

              {!isLast && <Divider mt={4} borderColor={borderColor} />}
            </Box>
          );
        })}
      </VStack>
    );
  }
);

AdvancedFilterPanel.displayName = "AdvancedFilterPanel";
