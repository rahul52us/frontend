"use client";

import {
  Badge,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FiCheck,
  FiFilter,
  FiInbox,
  FiRefreshCcw,
  FiSliders,
  FiTrendingUp,
} from "react-icons/fi";
import MainPagePagination from "../../../../component/config/component/pagination/MainPagePagination";
import stores from "../../../../store/stores";
import ShopSection from "../../../component/shopSection/ShopSection";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton/ProductCardSkeleton";
import { colorMap, emptyAdvancedFilters } from "./constant";

const MotionBox = motion(Box);
const PRODUCT_LIMIT = 12;

const getRangePercent = (value: number, min: number, max: number) => {
  if (!Number.isFinite(value) || max <= min) {
    return 0;
  }
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
};

// ─── Custom Dual-Thumb Price Slider ─────────────────────────────────────
const PriceRangeControl = ({
  min,
  max,
  value,
  onChange,
  onCommit,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (_value: [number, number]) => void;
  onCommit: (_value: [number, number]) => void;
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeHandle, setActiveHandle] = useState<"min" | "max" | null>(null);
  const lowerValue = Math.min(value[0], value[1]);
  const upperValue = Math.max(value[0], value[1]);
  const lowerPercent = getRangePercent(lowerValue, min, max);
  const upperPercent = getRangePercent(upperValue, min, max);
  const step = Math.max(1, Math.round((max - min) / 100));

  const getValueFromClientX = useCallback(
    (clientX: number) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect || rect.width <= 0) {
        return min;
      }
      const percentage = Math.min(
        1,
        Math.max(0, (clientX - rect.left) / rect.width)
      );
      return Math.round(min + percentage * (max - min));
    },
    [max, min]
  );

  const getNextRange = useCallback(
    (nextValue: number, handle: "min" | "max"): [number, number] => {
      if (handle === "min") {
        return [Math.min(nextValue, upperValue), upperValue];
      }
      return [lowerValue, Math.max(nextValue, lowerValue)];
    },
    [lowerValue, upperValue]
  );

  const updateFromClientX = useCallback(
    (clientX: number, handle: "min" | "max") => {
      const nextRange = getNextRange(getValueFromClientX(clientX), handle);
      onChange(nextRange);
      return nextRange;
    },
    [getNextRange, getValueFromClientX, onChange]
  );

  useEffect(() => {
    if (!activeHandle) {
      return undefined;
    }

    const handlePointerMove = (event: PointerEvent) => {
      updateFromClientX(event.clientX, activeHandle);
    };
    const handlePointerUp = (event: PointerEvent) => {
      const nextRange = updateFromClientX(event.clientX, activeHandle);
      onCommit(nextRange);
      setActiveHandle(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [activeHandle, onCommit, updateFromClientX]);

  const startDrag = (event: any, handle: "min" | "max") => {
    event.currentTarget?.focus?.();
    event.preventDefault();
    setActiveHandle(handle);
    updateFromClientX(event.clientX, handle);
  };

  const handleTrackPointerDown = (event: any) => {
    const nextValue = getValueFromClientX(event.clientX);
    const handle =
      Math.abs(nextValue - lowerValue) <= Math.abs(nextValue - upperValue)
        ? "min"
        : "max";
    startDrag(event, handle);
  };

  const handleKeyDown = (event: any, handle: "min" | "max") => {
    if (
      !["ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp"].includes(event.key)
    ) {
      return;
    }
    event.preventDefault();
    const direction =
      event.key === "ArrowLeft" || event.key === "ArrowDown" ? -1 : 1;
    const currentValue = handle === "min" ? lowerValue : upperValue;
    const nextRange = getNextRange(currentValue + direction * step, handle);
    onChange(nextRange);
    onCommit(nextRange);
  };

  return (
    <Box position="relative" h="28px" mb={2} pt="12px" px={1}>
      <Box
        ref={trackRef}
        position="relative"
        h="5px"
        borderRadius="full"
        bg="gray.200"
        cursor="pointer"
        onPointerDown={handleTrackPointerDown}
      >
        <Box
          position="absolute"
          left={`${lowerPercent}%`}
          right={`${100 - upperPercent}%`}
          top={0}
          h="5px"
          borderRadius="full"
          bgGradient="linear(to-r, var(--color-primary), var(--color-secondary))"
        />
        {[
          {
            key: "min" as const,
            value: lowerValue,
            percent: lowerPercent,
            label: "Minimum price",
          },
          {
            key: "max" as const,
            value: upperValue,
            percent: upperPercent,
            label: "Maximum price",
          },
        ].map((handle) => (
          <Box
            key={handle.key}
            role="slider"
            aria-label={handle.label}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={handle.value}
            tabIndex={0}
            position="absolute"
            left={`${handle.percent}%`}
            top="50%"
            transform="translate(-50%, -50%)"
            boxSize="18px"
            borderRadius="full"
            bg="white"
            border="2.5px solid"
            borderColor="var(--color-primary)"
            boxShadow="0 2px 6px rgba(37, 99, 235, 0.3)"
            cursor="grab"
            zIndex={handle.key === "min" ? 2 : 3}
            _active={{ cursor: "grabbing", transform: "translate(-50%, -50%) scale(1.1)" }}
            transition="transform 0.1s ease"
            onPointerDown={(event) => startDrag(event, handle.key)}
            onKeyDown={(event) => handleKeyDown(event, handle.key)}
          />
        ))}
      </Box>
    </Box>
  );
};

// ─── Filter Helpers ─────────────────────────────────────────────────────
const normalizeValues = (value: any) => (Array.isArray(value) ? value : []);

const getFacetSelection = (filters: any, facetKey: string) => {
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

const getAdvancedFilterCount = (filters: any) => {
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

const compactAdvancedFilters = (filters: any) => {
  const next: any = {};

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

// ─── Clean Filter Panel (Desktop Sidebar & Mobile Drawer Body) ──────────
const AdvancedFilterPanel = ({
  facets,
  filters,
  loading,
  emptyMessage,
  onToggle,
  onPriceChange,
  onClear,
  hideHeader = false,
}: {
  facets: any[];
  filters: any;
  loading?: boolean;
  emptyMessage?: string;
  onToggle: (_facetKey: string, _value: string) => void;
  onPriceChange: (_min?: number, _max?: number) => void;
  onClear: () => void;
  hideHeader?: boolean;
}) => {
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const textMuted = useColorModeValue("gray.500", "gray.400");
  const boxBg = useColorModeValue("gray.50", "gray.800");
  const activeCount = getAdvancedFilterCount(filters);
  const priceFacet = facets.find((facet) => facet.type === "range");
  const priceMin = Number(priceFacet?.min || 0);
  const priceMax = Number(priceFacet?.max || 0);
  const [draftPrice, setDraftPrice] = useState<[number, number] | null>(null);

  useEffect(() => {
    setDraftPrice(null);
  }, [filters.price?.min, filters.price?.max, priceMin, priceMax]);

  if (!facets.length) {
    return (
      <Box py={4} textAlign="center">
        <Text color={textMuted} fontSize="xs">
          {loading
            ? "Loading filters..."
            : emptyMessage || "Search products to see related filters."}
        </Text>
      </Box>
    );
  }

  return (
    <VStack align="stretch" spacing={4}>
      {!hideHeader && (
        <HStack
          justify="space-between"
          align="center"
          pb={2.5}
          borderBottom="1px solid"
          borderColor={borderColor}
        >
          <HStack spacing={2}>
            <Icon as={FiFilter} color="var(--color-primary)" boxSize={3.5} />
            <Text fontWeight="700" fontSize="sm">
              Filters
            </Text>
            {activeCount > 0 && (
              <Badge
                colorScheme="brand"
                borderRadius="full"
                px={2}
                fontSize="10px"
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
              fontWeight="600"
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
          const max = Number(facet.max || 0);
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
                fontWeight="700"
                textTransform="uppercase"
                letterSpacing="wider"
                color="gray.700"
                mb={2.5}
              >
                {facet.label}
              </Text>

              {/* Min - Max Price Display Boxes */}
              <HStack spacing={2} mb={2.5}>
                <Box
                  flex="1"
                  bg={boxBg}
                  px={2.5}
                  py={1.5}
                  rounded="lg"
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <Text fontSize="9px" color={textMuted} fontWeight="600">
                    MIN
                  </Text>
                  <Text fontSize="xs" fontWeight="700">
                    ₹{Math.round(lowerValue).toLocaleString("en-IN")}
                  </Text>
                </Box>
                <Text color="gray.400" fontSize="xs">
                  –
                </Text>
                <Box
                  flex="1"
                  bg={boxBg}
                  px={2.5}
                  py={1.5}
                  rounded="lg"
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <Text fontSize="9px" color={textMuted} fontWeight="600">
                    MAX
                  </Text>
                  <Text fontSize="xs" fontWeight="700">
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
                <Wrap spacing={1.5} mt={2}>
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
                        colorScheme={isBucketActive ? "blue" : "gray"}
                        onClick={() => {
                          setDraftPrice([
                            Number(bucket.min ?? min),
                            Number(bucket.max ?? max),
                          ]);
                          onPriceChange(bucket.min, bucket.max);
                        }}
                      >
                        {String(bucket.label).replace(/Rs\.?\s*/gi, "₹")}
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

        return (
          <Box key={facet.key}>
            <Text
              fontSize="xs"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing="wider"
              color="gray.700"
              mb={2.5}
            >
              {facet.label}
            </Text>

            {facet.type === "pills" ? (
              <Wrap spacing={1.5}>
                {(facet.options || []).map((option: any) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <Button
                      key={option.value}
                      size="xs"
                      h="28px"
                      px={3}
                      variant={isSelected ? "solid" : "outline"}
                      colorScheme={isSelected ? "blue" : "gray"}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="600"
                      onClick={() => onToggle(facet.key, option.value)}
                    >
                      {option.label}
                    </Button>
                  );
                })}
              </Wrap>
            ) : (
              <VStack
                align="stretch"
                spacing={1.5}
                maxH="200px"
                overflowY="auto"
                pr={1}
                sx={{
                  "&::-webkit-scrollbar": { width: "4px" },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#CBD5E0",
                    borderRadius: "full",
                  },
                }}
              >
                {(facet.options || []).map((option: any) => {
                  const isSelected = selectedValues.includes(option.value);
                  const swatchColor =
                    colorMap[String(option.label || "").toLowerCase()];

                  return (
                    <Flex
                      key={option.value}
                      align="center"
                      justify="space-between"
                      py={1}
                      px={1.5}
                      rounded="md"
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
                        <HStack spacing={2}>
                          {facet.type === "color" && (
                            <Box
                              boxSize="14px"
                              rounded="full"
                              border="1px solid"
                              borderColor="gray.300"
                              bg={
                                swatchColor ||
                                String(option.label || "").toLowerCase()
                              }
                            />
                          )}
                          <Text
                            fontSize="xs"
                            fontWeight={isSelected ? "600" : "500"}
                            noOfLines={1}
                          >
                            {option.label}
                          </Text>
                        </HStack>
                      </Checkbox>

                      {option.count !== undefined && (
                        <Text fontSize="10px" color={textMuted} fontWeight="500">
                          {option.count}
                        </Text>
                      )}
                    </Flex>
                  );
                })}
              </VStack>
            )}

            {!isLast && <Divider mt={4} borderColor={borderColor} />}
          </Box>
        );
      })}
    </VStack>
  );
};

// ─── Main Products List Section ─────────────────────────────────────────
const ProductsListSection = observer(() => {
  const { shopStore, layout } = stores;

  const [products, setProducts] = useState<any[]>([]);
  const [facets, setFacets] = useState<any[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState<any>(
    emptyAdvancedFilters
  );
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const filterDrawer = useDisclosure();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlSearchTerm = (
    searchParams.get("search") ||
    searchParams.get("q") ||
    ""
  ).trim();
  const searchTerm = String(layout.productSearchQuery || "").trim();
  const previousSearchTermRef = useRef(searchTerm);

  // Clean UI Tokens
  const pageBg = useColorModeValue("#F8FAFC", "gray.950");
  const surfaceBg = useColorModeValue("white", "gray.900");
  const filterBorder = useColorModeValue("gray.100", "gray.800");
  const titleColor = useColorModeValue("gray.900", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");

  const advancedFilterCount = getAdvancedFilterCount(advancedFilters);
  const hasActiveFilters = Boolean(searchTerm || advancedFilterCount);
  const showSearchResults = hasActiveFilters;

  const fetchProducts = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const res = await shopStore.getAllProducts({
          page,
          limit: PRODUCT_LIMIT,
          search: searchTerm.trim(),
          filters: compactAdvancedFilters(advancedFilters),
        });
        const payload = res?.data || {};

        setProducts(payload.products || []);
        setFacets(payload.facets || []);
        setTotalProducts(payload.total || 0);
        setTotalPages(payload.totalPages || 1);
        setCurrentPage(payload.currentPage || page);
      } catch {
        setProducts([]);
        setFacets([]);
        setTotalProducts(0);
        setTotalPages(1);
        setCurrentPage(1);
      } finally {
        setLoading(false);
      }
    },
    [advancedFilters, searchTerm, shopStore]
  );

  useEffect(() => {
    if (urlSearchTerm !== layout.productSearchQuery) {
      layout.setProductSearchQuery(urlSearchTerm);
    }
  }, [layout, urlSearchTerm]);

  useEffect(() => {
    if (!showSearchResults) {
      setProducts([]);
      setFacets([]);
      setTotalProducts(0);
      setTotalPages(1);
      setCurrentPage(1);
      setLoading(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      fetchProducts(1);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [fetchProducts, showSearchResults]);

  useEffect(() => {
    if (previousSearchTermRef.current === searchTerm) {
      return;
    }
    previousSearchTermRef.current = searchTerm;
    setAdvancedFilters(emptyAdvancedFilters);
  }, [searchTerm]);

  const clearSearchParam = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("q");

    const queryString = params.toString();
    layout.setProductSearchQuery("");
    router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  }, [layout, pathname, router, searchParams]);

  const resetFilters = () => {
    clearSearchParam();
    setAdvancedFilters(emptyAdvancedFilters);
  };

  const toggleAdvancedFilter = useCallback((facetKey: string, value: string) => {
    setAdvancedFilters((prev: any) => {
      const next = {
        ...prev,
        variants: { ...(prev.variants || {}) },
        specs: { ...(prev.specs || {}) },
        information: { ...(prev.information || {}) },
      };

      const toggleList = (values: string[]) =>
        values.includes(value)
          ? values.filter((item) => item !== value)
          : [...values, value];

      if (facetKey.startsWith("variant:")) {
        const key = facetKey.replace("variant:", "");
        next.variants[key] = toggleList(normalizeValues(next.variants[key]));
      } else if (facetKey.startsWith("spec:")) {
        const key = facetKey.replace("spec:", "");
        next.specs[key] = toggleList(normalizeValues(next.specs[key]));
      } else if (facetKey.startsWith("information:")) {
        const key = facetKey.replace("information:", "");
        next.information[key] = toggleList(
          normalizeValues(next.information[key])
        );
      } else {
        next[facetKey] = toggleList(normalizeValues(next[facetKey]));
      }

      return next;
    });
  }, []);

  const setPriceFilter = useCallback((min?: number, max?: number) => {
    setAdvancedFilters((prev: any) => ({
      ...prev,
      price: { min, max },
    }));
  }, []);

  const clearAdvancedFilters = () => {
    setAdvancedFilters(emptyAdvancedFilters);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    const nextPage = Math.max(1, Number(selected) || 1);
    fetchProducts(nextPage);
    document
      .getElementById("all-products")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];
    const facetLabelMap = new Map<string, string>();
    const optionLabelMap = new Map<string, string>();

    facets.forEach((facet: any) => {
      facetLabelMap.set(facet.key, facet.label);
      (facet.options || []).forEach((option: any) => {
        optionLabelMap.set(`${facet.key}:${option.value}`, option.label);
      });
    });

    if (searchTerm.trim()) {
      chips.push({
        key: "search",
        label: `"${searchTerm.trim()}"`,
        onRemove: clearSearchParam,
      });
    }

    ["brand", "idea", "deal", "availability"].forEach((key) => {
      normalizeValues(advancedFilters[key]).forEach((value) => {
        chips.push({
          key: `${key}:${value}`,
          label: `${
            optionLabelMap.get(`${key}:${value}`) || value
          }`,
          onRemove: () => toggleAdvancedFilter(key, value),
        });
      });
    });

    Object.entries(advancedFilters.variants || {}).forEach(([name, values]) => {
      normalizeValues(values).forEach((value) => {
        const facetKey = `variant:${name}`;
        chips.push({
          key: `${facetKey}:${value}`,
          label: `${name}: ${
            optionLabelMap.get(`${facetKey}:${value}`) || value
          }`,
          onRemove: () => toggleAdvancedFilter(facetKey, value),
        });
      });
    });

    Object.entries(advancedFilters.specs || {}).forEach(([name, values]) => {
      normalizeValues(values).forEach((value) => {
        const facetKey = `spec:${name}`;
        chips.push({
          key: `${facetKey}:${value}`,
          label: `${name}: ${
            optionLabelMap.get(`${facetKey}:${value}`) || value
          }`,
          onRemove: () => toggleAdvancedFilter(facetKey, value),
        });
      });
    });

    Object.entries(advancedFilters.information || {}).forEach(
      ([name, values]) => {
        normalizeValues(values).forEach((value) => {
          const facetKey = `information:${name}`;
          chips.push({
            key: `${facetKey}:${value}`,
            label: `${name}: ${
              optionLabelMap.get(`${facetKey}:${value}`) || value
            }`,
            onRemove: () => toggleAdvancedFilter(facetKey, value),
          });
        });
      }
    );

    if (
      advancedFilters.price?.min !== undefined ||
      advancedFilters.price?.max !== undefined
    ) {
      chips.push({
        key: "price",
        label: `₹${Math.round(
          Number(advancedFilters.price.min || 0)
        ).toLocaleString("en-IN")} – ₹${Math.round(
          Number(advancedFilters.price.max || 0)
        ).toLocaleString("en-IN")}`,
        onRemove: () => setPriceFilter(undefined, undefined),
      });
    }

    return chips;
  }, [
    advancedFilters,
    clearSearchParam,
    facets,
    searchTerm,
    setPriceFilter,
    toggleAdvancedFilter,
  ]);

  return (
    <Box bg={pageBg} py={{ base: 5, md: 9 }} overflow="hidden">
      <Container maxW="8xl" px={{ base: 3, md: 8 }}>
        {/* 1. Filtered Search Results View */}
        {showSearchResults && (
          <Box id="all-products" mb={{ base: 10, md: 14 }}>
            {/* Compact Sticky-Style Filter & Results Bar */}
            <Box
              bg={surfaceBg}
              border="1px solid"
              borderColor={filterBorder}
              borderRadius="2xl"
              p={{ base: 3, md: 4 }}
              mb={{ base: 4, md: 6 }}
              boxShadow="xs"
            >
              <Flex
                justify="space-between"
                align="center"
                gap={3}
                flexWrap="wrap"
              >
                <Box>
                  <Heading
                    as="h2"
                    fontSize={{ base: "md", md: "xl" }}
                    fontWeight="800"
                    color={titleColor}
                    lineHeight="1.2"
                  >
                    {searchTerm ? `Results for "${searchTerm}"` : "Filtered Products"}
                  </Heading>
                  <Text fontSize="xs" color={mutedText} mt={0.5}>
                    {loading ? (
                      "Updating products..."
                    ) : (
                      <>
                        Showing{" "}
                        <Text as="span" fontWeight="700" color={titleColor}>
                          {totalProducts}
                        </Text>{" "}
                        item{totalProducts === 1 ? "" : "s"}
                      </>
                    )}
                  </Text>
                </Box>

                {/* Mobile Filter Button + Reset Button */}
                <HStack spacing={2}>
                  <Button
                    display={{ base: "inline-flex", lg: "none" }}
                    leftIcon={<FiSliders size={14} />}
                    onClick={filterDrawer.onOpen}
                    colorScheme="brand"
                    variant="solid"
                    borderRadius="full"
                    size="xs"
                    h="32px"
                    px={3.5}
                  >
                    Filters
                    {advancedFilterCount > 0 ? ` (${advancedFilterCount})` : ""}
                  </Button>

                  <Button
                    leftIcon={<FiRefreshCcw size={13} />}
                    onClick={resetFilters}
                    variant="ghost"
                    size="xs"
                    h="32px"
                    px={3}
                    borderRadius="full"
                    colorScheme="red"
                  >
                    Reset
                  </Button>
                </HStack>
              </Flex>

              {/* Active Filter Chips */}
              {activeFilterChips.length > 0 && (
                <Wrap
                  spacing={1.5}
                  mt={3}
                  pt={2.5}
                  borderTop="1px solid"
                  borderColor={filterBorder}
                >
                  {activeFilterChips.map((chip) => (
                    <Tag
                      key={chip.key}
                      size="sm"
                      borderRadius="full"
                      variant="subtle"
                      colorScheme="brand"
                      px={2.5}
                      py={1}
                    >
                      <TagLabel fontSize="11px" fontWeight="600">
                        {chip.label}
                      </TagLabel>
                      <TagCloseButton onClick={chip.onRemove} />
                    </Tag>
                  ))}
                </Wrap>
              )}
            </Box>

            {/* Sidebar + Product Grid Layout */}
            <Flex gap={6} align="flex-start">
              {/* Desktop Sticky Filter Sidebar */}
              <Box
                display={{ base: "none", lg: "block" }}
                w="260px"
                flexShrink={0}
                position="sticky"
                top="100px"
                maxH="calc(100vh - 120px)"
                overflowY="auto"
                border="1px solid"
                borderColor={filterBorder}
                borderRadius="2xl"
                bg={surfaceBg}
                p={4}
                boxShadow="2xs"
                sx={{
                  "&::-webkit-scrollbar": { width: "4px" },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#CBD5E0",
                    borderRadius: "full",
                  },
                }}
              >
                <AdvancedFilterPanel
                  facets={facets}
                  filters={advancedFilters}
                  loading={loading}
                  emptyMessage="Search products to see related filters."
                  onToggle={toggleAdvancedFilter}
                  onPriceChange={setPriceFilter}
                  onClear={clearAdvancedFilters}
                />
              </Box>

              {/* Product Grid (2 Columns on Mobile, 3 on Tablet, 4 on Desktop) */}
              <Box flex="1" minW={0}>
                {loading ? (
                  <SimpleGrid
                    columns={{ base: 2, sm: 2, md: 3, xl: 4 }}
                    spacing={{ base: 2.5, sm: 3.5, md: 5 }}
                  >
                    {[...Array(PRODUCT_LIMIT)].map((_, index) => (
                      <Box key={index} borderRadius="2xl" overflow="hidden">
                        <ProductCardSkeleton />
                      </Box>
                    ))}
                  </SimpleGrid>
                ) : products.length > 0 ? (
                  <>
                    <SimpleGrid
                      columns={{ base: 2, sm: 2, md: 3, xl: 4 }}
                      spacing={{ base: 2.5, sm: 3.5, md: 5 }}
                    >
                      {products.map((product) => (
                        <MotionBox
                          key={`${product._id || product.productId}-${product.name}`}
                          whileHover={{ y: -4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ProductCard product={product} />
                        </MotionBox>
                      ))}
                    </SimpleGrid>

                    {totalPages > 1 && (
                      <Flex mt={8} justify="center" align="center" w="full">
                        <Box
                          px={3}
                          py={1.5}
                          bg={surfaceBg}
                          borderRadius="full"
                          boxShadow="xs"
                          border="1px solid"
                          borderColor={filterBorder}
                        >
                          <MainPagePagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            placement="center"
                          />
                        </Box>
                      </Flex>
                    )}
                  </>
                ) : (
                  <VStack
                    textAlign="center"
                    py={12}
                    px={4}
                    spacing={3}
                    bg={surfaceBg}
                    borderRadius="2xl"
                    border="1px dashed"
                    borderColor={filterBorder}
                  >
                    <Icon as={FiInbox} boxSize={10} color="gray.300" />
                    <VStack spacing={1}>
                      <Text fontSize="md" fontWeight="700" color={titleColor}>
                        No matching products found
                      </Text>
                      <Text fontSize="xs" color={mutedText} maxW="sm">
                        Try removing a few filters or searching with a broader
                        keyword.
                      </Text>
                    </VStack>
                    <Button
                      size="xs"
                      h="34px"
                      px={4}
                      mt={1}
                      colorScheme="brand"
                      borderRadius="full"
                      onClick={resetFilters}
                    >
                      Reset All Filters
                    </Button>
                  </VStack>
                )}
              </Box>
            </Flex>

            {/* Mobile Filter Bottom Sheet Drawer */}
            <Drawer
              isOpen={filterDrawer.isOpen}
              placement="bottom"
              onClose={filterDrawer.onClose}
            >
              <DrawerOverlay backdropFilter="blur(3px)" bg="blackAlpha.400" />
              <DrawerContent
                borderTopRadius="2xl"
                maxH="85vh"
                overflow="hidden"
              >
                <DrawerCloseButton top={3.5} right={4} borderRadius="full" />
                <DrawerHeader
                  py={3.5}
                  px={5}
                  borderBottom="1px solid"
                  borderColor={filterBorder}
                  fontSize="md"
                  fontWeight="800"
                >
                  <HStack spacing={2}>
                    <Icon as={FiSliders} color="var(--color-primary)" boxSize={4} />
                    <Text>Filter Products</Text>
                    {advancedFilterCount > 0 && (
                      <Badge
                        colorScheme="brand"
                        borderRadius="full"
                        px={2}
                        fontSize="10px"
                      >
                        {advancedFilterCount}
                      </Badge>
                    )}
                  </HStack>
                </DrawerHeader>

                <DrawerBody px={5} py={4}>
                  <AdvancedFilterPanel
                    facets={facets}
                    filters={advancedFilters}
                    loading={loading}
                    emptyMessage="Search products to see related filters."
                    onToggle={toggleAdvancedFilter}
                    onPriceChange={setPriceFilter}
                    onClear={clearAdvancedFilters}
                    hideHeader
                  />
                </DrawerBody>

                <DrawerFooter
                  borderTop="1px solid"
                  borderColor={filterBorder}
                  bg="gray.50"
                  px={5}
                  py={3}
                  gap={3}
                >
                  <Button
                    flex="1"
                    size="sm"
                    h="40px"
                    variant="outline"
                    borderRadius="xl"
                    onClick={clearAdvancedFilters}
                    isDisabled={advancedFilterCount === 0}
                  >
                    Clear All
                  </Button>
                  <Button
                    flex="2"
                    size="sm"
                    h="40px"
                    colorScheme="brand"
                    borderRadius="xl"
                    leftIcon={<FiCheck />}
                    onClick={filterDrawer.onClose}
                  >
                    Show {totalProducts} Products
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </Box>
        )}

        {/* 2. Top Picks For You Section (Unified Compact Header) */}
        <Box>
          <Flex
            justify="space-between"
            align="flex-end"
            mb={{ base: 4, md: 6 }}
            gap={4}
          >
            <Box>
              <HStack spacing={1.5} mb={1}>
                <Icon as={FiTrendingUp} color="var(--color-primary)" boxSize={3.5} />
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  color="var(--color-primary)"
                >
                  Curated For You
                </Text>
              </HStack>
              <Heading
                as="h2"
                fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                fontWeight="800"
                color={titleColor}
                letterSpacing="tight"
                lineHeight="1.2"
              >
                Top Picks For You
              </Heading>
              <Text
                display={{ base: "none", sm: "block" }}
                fontSize="xs"
                color={mutedText}
                mt={0.5}
              >
                Handpicked everyday favorites from trusted local sellers
              </Text>
            </Box>
          </Flex>

          <Box>
            <ShopSection enableInfiniteLoad={false} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
});

export default ProductsListSection;