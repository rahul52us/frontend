import {
  Box,
  Button,
  Checkbox,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useDisclosure,
  useColorModeValue,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import axios from "axios";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiFilter, FiInbox, FiRefreshCcw, FiSearch, FiSliders } from "react-icons/fi";
import CommonHeading from "../../../../component/common/CommonHeading/CommonHeading";
import MainPagePagination from "../../../../component/config/component/pagination/MainPagePagination";
import stores from "../../../../store/stores";
import ShopSection from "../../../component/shopSection/ShopSection";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton/ProductCardSkeleton";

const MotionBox = motion(Box);
const PRODUCT_LIMIT = 12;

const emptyAdvancedFilters = {
  brand: [],
  idea: [],
  deal: [],
  availability: [],
  variants: {},
  specs: {},
  information: {},
  price: {},
};

const colorMap: Record<string, string> = {
  black: "#111827",
  white: "#ffffff",
  grey: "#9ca3af",
  gray: "#9ca3af",
  red: "#dc2626",
  blue: "#2563eb",
  green: "#16a34a",
  yellow: "#facc15",
  orange: "#f97316",
  pink: "#f9a8d4",
  purple: "#7c3aed",
  brown: "#92400e",
  silver: "#d1d5db",
  gold: "#d4af37",
};

const getRangePercent = (value: number, min: number, max: number) => {
  if (!Number.isFinite(value) || max <= min) {
    return 0;
  }

  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
};

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

  const getValueFromClientX = useCallback((clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();

    if (!rect || rect.width <= 0) {
      return min;
    }

    const percentage = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return Math.round(min + percentage * (max - min));
  }, [max, min]);

  const getNextRange = useCallback((nextValue: number, handle: "min" | "max"): [number, number] => {
    if (handle === "min") {
      return [Math.min(nextValue, upperValue), upperValue];
    }

    return [lowerValue, Math.max(nextValue, lowerValue)];
  }, [lowerValue, upperValue]);

  const updateFromClientX = useCallback((clientX: number, handle: "min" | "max") => {
    const nextRange = getNextRange(getValueFromClientX(clientX), handle);
    onChange(nextRange);
    return nextRange;
  }, [getNextRange, getValueFromClientX, onChange]);

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
    const handle = Math.abs(nextValue - lowerValue) <= Math.abs(nextValue - upperValue) ? "min" : "max";
    startDrag(event, handle);
  };

  const handleKeyDown = (event: any, handle: "min" | "max") => {
    if (!["ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp"].includes(event.key)) {
      return;
    }

    event.preventDefault();
    const direction = event.key === "ArrowLeft" || event.key === "ArrowDown" ? -1 : 1;
    const currentValue = handle === "min" ? lowerValue : upperValue;
    const nextRange = getNextRange(currentValue + direction * step, handle);
    onChange(nextRange);
    onCommit(nextRange);
  };

  return (
    <Box position="relative" h="34px" mb={3} pt="15px">
      <Box
        ref={trackRef}
        position="relative"
        h="4px"
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
          h="4px"
          borderRadius="full"
          bg="blue.600"
        />
        {[
          { key: "min" as const, value: lowerValue, percent: lowerPercent, label: "Minimum price" },
          { key: "max" as const, value: upperValue, percent: upperPercent, label: "Maximum price" },
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
            bg="blue.600"
            border="3px solid white"
            boxShadow="0 2px 8px rgba(37, 99, 235, 0.35)"
            cursor="grab"
            zIndex={handle.key === "min" ? 2 : 3}
            _active={{ cursor: "grabbing" }}
            onPointerDown={(event) => startDrag(event, handle.key)}
            onKeyDown={(event) => handleKeyDown(event, handle.key)}
          />
        ))}
      </Box>
    </Box>
  );
};

const getCategoryId = (category: any) => String(category?._id || category?.id || "");
const getCategoryName = (category: any) => String(category?.name || "").trim();
const getParentCategoryId = (category: any) => {
  const parent = category?.parent;
  if (!parent) return "";
  return typeof parent === "object" ? String(parent?._id || parent?.id || "") : String(parent);
};

const normalizeValues = (value: any) => Array.isArray(value) ? value : [];

const getFacetSelection = (filters: any, facetKey: string) => {
  if (facetKey.startsWith("variant:")) {
    return normalizeValues(filters.variants?.[facetKey.replace("variant:", "")]);
  }

  if (facetKey.startsWith("spec:")) {
    return normalizeValues(filters.specs?.[facetKey.replace("spec:", "")]);
  }

  if (facetKey.startsWith("information:")) {
    return normalizeValues(filters.information?.[facetKey.replace("information:", "")]);
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
  const informationCount = (Object.values(filters.information || {}) as any[]).reduce(
    (count: number, values: any) => count + normalizeValues(values).length,
    0
  );
  const priceCount = filters.price?.min !== undefined || filters.price?.max !== undefined ? 1 : 0;

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
    Object.entries(filters.variants || {}).filter(([, values]) => normalizeValues(values).length > 0)
  );
  const specs = Object.fromEntries(
    Object.entries(filters.specs || {}).filter(([, values]) => normalizeValues(values).length > 0)
  );
  const information = Object.fromEntries(
    Object.entries(filters.information || {}).filter(([, values]) => normalizeValues(values).length > 0)
  );

  if (Object.keys(variants).length) {
    next.variants = variants;
  }
  if (Object.keys(specs).length) {
    next.specs = specs;
  }
  if (Object.keys(information).length) {
    next.information = information;
  }
  if (filters.price?.min !== undefined || filters.price?.max !== undefined) {
    next.price = filters.price;
  }

  return next;
};

const AdvancedFilterPanel = ({
  facets,
  filters,
  onToggle,
  onPriceChange,
  onClear,
}: {
  facets: any[];
  filters: any;
  onToggle: (_facetKey: string, _value: string) => void;
  onPriceChange: (_min?: number, _max?: number) => void;
  onClear: () => void;
}) => {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textMuted = useColorModeValue("gray.600", "gray.400");
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
      <Box border="1px solid" borderColor={borderColor} borderRadius="md" p={4}>
        <Text fontWeight="700">Filters</Text>
        <Text color={textMuted} fontSize="sm" mt={2}>
          Search products to see related filters.
        </Text>
      </Box>
    );
  }

  return (
    <VStack align="stretch" spacing={5}>
      <HStack justify="space-between" align="center">
        <Text fontWeight="800">Filters</Text>
        <Button size="xs" variant="ghost" onClick={onClear} isDisabled={activeCount === 0}>
          Clear
        </Button>
      </HStack>

      {facets.map((facet) => {
        if (facet.type === "range") {
          const min = Number(facet.min || 0);
          const max = Number(facet.max || 0);
          const selectedMin = Number(filters.price?.min ?? min);
          const selectedMax = Number(filters.price?.max ?? max);
          const sliderValue: [number, number] = draftPrice || [selectedMin, selectedMax];
          const lowerValue = Math.min(sliderValue[0], sliderValue[1]);
          const upperValue = Math.max(sliderValue[0], sliderValue[1]);

          return (
            <Box key={facet.key}>
              <Text fontWeight="800" mb={3}>{facet.label}</Text>
              <Text fontSize="sm" color={textMuted} mb={3}>
                Rs {Math.round(lowerValue).toLocaleString("en-IN")} - Rs {Math.round(upperValue).toLocaleString("en-IN")}
              </Text>
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
              <VStack align="stretch" spacing={1}>
                {(facet.buckets || []).map((bucket: any) => (
                  <Button
                    key={bucket.value}
                    variant="ghost"
                    size="sm"
                    justifyContent="flex-start"
                    px={0}
                    onClick={() => {
                      setDraftPrice([Number(bucket.min ?? min), Number(bucket.max ?? max)]);
                      onPriceChange(bucket.min, bucket.max);
                    }}
                  >
                    {bucket.label}
                  </Button>
                ))}
              </VStack>
              <Divider mt={4} />
            </Box>
          );
        }

        const selectedValues = getFacetSelection(filters, facet.key);

        return (
          <Box key={facet.key}>
            <Text fontWeight="800" mb={3}>{facet.label}</Text>
            {facet.type === "pills" ? (
              <Wrap spacing={2}>
                {(facet.options || []).map((option: any) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <Button
                      key={option.value}
                      size="sm"
                      variant={isSelected ? "solid" : "outline"}
                      colorScheme={isSelected ? "blue" : "gray"}
                      borderRadius="md"
                      onClick={() => onToggle(facet.key, option.value)}
                    >
                      {option.label}
                    </Button>
                  );
                })}
              </Wrap>
            ) : (
              <VStack align="stretch" spacing={2}>
                {(facet.options || []).map((option: any) => {
                  const isSelected = selectedValues.includes(option.value);
                  const swatchColor = colorMap[String(option.label || "").toLowerCase()];

                  return (
                    <Checkbox
                      key={option.value}
                      isChecked={isSelected}
                      onChange={() => onToggle(facet.key, option.value)}
                      colorScheme="blue"
                    >
                      <HStack spacing={2}>
                        {facet.type === "color" && (
                          <Box
                            boxSize="14px"
                            border="1px solid"
                            borderColor="gray.300"
                            bg={swatchColor || String(option.label || "").toLowerCase()}
                          />
                        )}
                        <Text fontSize="sm">{option.label}</Text>
                        <Text fontSize="xs" color={textMuted}>({option.count})</Text>
                      </HStack>
                    </Checkbox>
                  );
                })}
              </VStack>
            )}
            <Divider mt={4} />
          </Box>
        );
      })}
    </VStack>
  );
};

const ProductsListSection = observer(() => {
  const {
    themeStore: { themeConfig },
    shopStore,
  } = stores;
  const isDarkMode = themeConfig.config.initialColorMode === "dark";
  const [products, setProducts] = useState<any[]>([]);
  const [filterCategories, setFilterCategories] = useState<any[]>([]);
  const [facets, setFacets] = useState<any[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState<any>(emptyAdvancedFilters);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const filterDrawer = useDisclosure();

  const headingColor = isDarkMode
    ? themeConfig.colors.dark.primary[500]
    : themeConfig.colors.light.primary[500];
  
  // High-end premium UI design tokens
  const pageBg = useColorModeValue("gray.50", "gray.950");
  const filterBg = useColorModeValue("white", "rgba(23, 25, 35, 0.75)");
  const filterBorder = useColorModeValue("gray.200", "gray.800");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const cardGridBg = useColorModeValue("transparent", "transparent");
  const filterShadow = useColorModeValue("sm", "xl");
  const inputFocusBorder = isDarkMode ? "primary.400" : "primary.500";

  const activeCategories = useMemo(
    () => filterCategories.filter((category: any) => category.isActive !== false),
    [filterCategories]
  );

  const rootCategories = useMemo(
    () => activeCategories.filter((category: any) => !getParentCategoryId(category)),
    [activeCategories]
  );

  const subCategories = useMemo(
    () =>
      selectedCategory
        ? activeCategories.filter(
            (category: any) => getParentCategoryId(category) === selectedCategory
          )
        : [],
    [activeCategories, selectedCategory]
  );

  const advancedFilterCount = getAdvancedFilterCount(advancedFilters);
  const hasActiveFilters = Boolean(searchTerm || selectedCategory || selectedSubCategory || advancedFilterCount);

  const fetchProducts = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const res = await shopStore.getAllProducts({
          page,
          limit: PRODUCT_LIMIT,
          search: searchTerm.trim(),
          category: selectedCategory,
          subCategory: selectedSubCategory,
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
    [advancedFilters, searchTerm, selectedCategory, selectedSubCategory, shopStore]
  );

  useEffect(() => {
    const loadFilterCategories = async () => {
      try {
        const response = await axios.get("/category", { params: { isActive: true } });
        setFilterCategories(Array.isArray(response.data?.data) ? response.data.data : []);
      } catch {
        setFilterCategories([]);
      }
    };

    loadFilterCategories();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchProducts(1);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [fetchProducts]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory("");
    setAdvancedFilters(emptyAdvancedFilters);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    if (value.trim()) {
      setSelectedCategory("");
      setSelectedSubCategory("");
    }

    setAdvancedFilters(emptyAdvancedFilters);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedSubCategory("");
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
        values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

      if (facetKey.startsWith("variant:")) {
        const key = facetKey.replace("variant:", "");
        next.variants[key] = toggleList(normalizeValues(next.variants[key]));
      } else if (facetKey.startsWith("spec:")) {
        const key = facetKey.replace("spec:", "");
        next.specs[key] = toggleList(normalizeValues(next.specs[key]));
      } else if (facetKey.startsWith("information:")) {
        const key = facetKey.replace("information:", "");
        next.information[key] = toggleList(normalizeValues(next.information[key]));
      } else {
        next[facetKey] = toggleList(normalizeValues(next[facetKey]));
      }

      return next;
    });
  }, []);

  const setPriceFilter = useCallback((min?: number, max?: number) => {
    setAdvancedFilters((prev: any) => ({
      ...prev,
      price: {
        min,
        max,
      },
    }));
  }, []);

  const clearAdvancedFilters = () => {
    setAdvancedFilters(emptyAdvancedFilters);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    const nextPage = Math.max(1, Number(selected) || 1);
    fetchProducts(nextPage);
    document.getElementById("all-products")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
      chips.push({ key: "search", label: `Search: ${searchTerm.trim()}`, onRemove: () => setSearchTerm("") });
    }

    ["brand", "idea", "deal", "availability"].forEach((key) => {
      normalizeValues(advancedFilters[key]).forEach((value) => {
        chips.push({
          key: `${key}:${value}`,
          label: `${facetLabelMap.get(key) || key}: ${optionLabelMap.get(`${key}:${value}`) || value}`,
          onRemove: () => toggleAdvancedFilter(key, value),
        });
      });
    });

    Object.entries(advancedFilters.variants || {}).forEach(([name, values]) => {
      normalizeValues(values).forEach((value) => {
        const facetKey = `variant:${name}`;
        chips.push({
          key: `${facetKey}:${value}`,
          label: `${name}: ${optionLabelMap.get(`${facetKey}:${value}`) || value}`,
          onRemove: () => toggleAdvancedFilter(facetKey, value),
        });
      });
    });

    Object.entries(advancedFilters.specs || {}).forEach(([name, values]) => {
      normalizeValues(values).forEach((value) => {
        const facetKey = `spec:${name}`;
        chips.push({
          key: `${facetKey}:${value}`,
          label: `${name}: ${optionLabelMap.get(`${facetKey}:${value}`) || value}`,
          onRemove: () => toggleAdvancedFilter(facetKey, value),
        });
      });
    });

    Object.entries(advancedFilters.information || {}).forEach(([name, values]) => {
      normalizeValues(values).forEach((value) => {
        const facetKey = `information:${name}`;
        chips.push({
          key: `${facetKey}:${value}`,
          label: `${name}: ${optionLabelMap.get(`${facetKey}:${value}`) || value}`,
          onRemove: () => toggleAdvancedFilter(facetKey, value),
        });
      });
    });

    if (advancedFilters.price?.min !== undefined || advancedFilters.price?.max !== undefined) {
      chips.push({
        key: "price",
        label: `Price: Rs ${Math.round(Number(advancedFilters.price.min || 0)).toLocaleString("en-IN")} - Rs ${Math.round(Number(advancedFilters.price.max || 0)).toLocaleString("en-IN")}`,
        onRemove: () => setPriceFilter(undefined, undefined),
      });
    }

    return chips;
  }, [advancedFilters, facets, searchTerm, setPriceFilter, toggleAdvancedFilter]);

  return (
    <Box
      bg={pageBg}
      mx="auto"
      px={{ base: 4, sm: 6, md: 8, lg: 12, xl: 16 }}
      py={{ base: 8, md: 14 }}
      overflow="hidden"
      transition="background-color 0.3s ease"
    >
      {/* Filterable Product Section */}
      <MotionBox
        id="all-products"
        mb={{ base: 14, md: 24 }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "start", md: "end" }}
          gap={4}
          mb={{ base: 6, md: 8 }}
        >
          <CommonHeading
            heading="All Products"
            subheading="Filter and browse premium products curated just for you"
            color={headingColor}
            align="left"
          />
        </Flex>

        {/* Filter Bar with Subtle Glassmorphism Card */}
        <Box
          bg={filterBg}
          backdropFilter="blur(8px)"
          border="1px solid"
          borderColor={filterBorder}
          borderRadius="xl"
          p={{ base: 4, md: 5 }}
          mb={{ base: 6, md: 10 }}
          boxShadow={filterShadow}
        >
          <Flex gap={4} align={{ base: "stretch", lg: "center" }} direction={{ base: "column", lg: "row" }}>
            <InputGroup flex={{ base: "unset", lg: 1.5 }}>
              <InputLeftElement h="100%" pointerEvents="none" pl={1}>
                <Icon as={FiSearch} color={mutedText} boxSize={5} />
              </InputLeftElement>
              <Input
                value={searchTerm}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Search premium products..."
                size="lg"
                h="48px"
                pl="44px"
                fontSize="md"
                bg={useColorModeValue("gray.50", "gray.800")}
                border="1px solid"
                borderColor={useColorModeValue("gray.200", "gray.700")}
                _focus={{
                  borderColor: inputFocusBorder,
                  boxShadow: `0 0 0 1px ${isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.05)"}`,
                  bg: useColorModeValue("white", "gray.900"),
                }}
                borderRadius="lg"
                transition="all 0.2s ease"
              />
            </InputGroup>

            <Select
              value={selectedCategory}
              onChange={(event) => handleCategoryChange(event.target.value)}
              placeholder="All Categories"
              size="lg"
              h="48px"
              maxW={{ base: "100%", lg: "220px" }}
              bg={useColorModeValue("gray.50", "gray.800")}
              border="1px solid"
              borderColor={useColorModeValue("gray.200", "gray.700")}
              _focus={{ borderColor: inputFocusBorder }}
              borderRadius="lg"
              icon={<FiFilter />}
              cursor="pointer"
              fontSize="md"
            >
              {rootCategories.map((category: any) => (
                <option key={getCategoryId(category)} value={getCategoryId(category)}>
                  {getCategoryName(category)}
                </option>
              ))}
            </Select>

            <Select
              value={selectedSubCategory}
              onChange={(event) => setSelectedSubCategory(event.target.value)}
              placeholder="All Subcategories"
              size="lg"
              h="48px"
              maxW={{ base: "100%", lg: "240px" }}
              bg={useColorModeValue("gray.50", "gray.800")}
              border="1px solid"
              borderColor={useColorModeValue("gray.200", "gray.700")}
              _focus={{ borderColor: inputFocusBorder }}
              borderRadius="lg"
              isDisabled={!selectedCategory || subCategories.length === 0}
              cursor={!selectedCategory || subCategories.length === 0 ? "not-allowed" : "pointer"}
              fontSize="md"
            >
              {subCategories.map((category: any) => (
                <option key={getCategoryId(category)} value={getCategoryId(category)}>
                  {getCategoryName(category)}
                </option>
              ))}
            </Select>

            <Button
              leftIcon={<FiRefreshCcw />}
              onClick={resetFilters}
              variant="ghost"
              size="lg"
              h="48px"
              px={6}
              borderRadius="lg"
              isDisabled={!hasActiveFilters}
              colorScheme="red"
              _hover={{ bg: useColorModeValue("red.50", "rgba(229, 62, 62, 0.1)") }}
              transition="all 0.2s"
            >
              Reset
            </Button>

            <Button
              display={{ base: "inline-flex", lg: "none" }}
              leftIcon={<FiSliders />}
              onClick={filterDrawer.onOpen}
              colorScheme="blue"
              borderRadius="md"
            >
              Filters{advancedFilterCount ? ` (${advancedFilterCount})` : ""}
            </Button>
          </Flex>

          <HStack mt={4} pt={2} borderTop="1px dashed" borderColor={filterBorder} justify="space-between" color={mutedText} fontSize="sm" flexWrap="wrap" gap={2}>
            <Text fontWeight="medium">
              {loading ? (
                "Syncing catalog..."
              ) : (
                <>
                  Showing <Text as="span" color={useColorModeValue("gray.900", "white")} fontWeight="bold">{totalProducts}</Text> match{totalProducts === 1 ? "" : "es"}
                </>
              )}
            </Text>
            {hasActiveFilters && (
              <Text fontSize="xs" bg={useColorModeValue("blue.50", "rgba(66, 153, 225, 0.1)")} color={useColorModeValue("blue.600", "blue.300")} px={2} py={0.5} borderRadius="md" fontWeight="medium">
                Live filtering active
              </Text>
            )}
          </HStack>

          {activeFilterChips.length > 0 && (
            <Wrap spacing={2} mt={3}>
              {activeFilterChips.map((chip) => (
                <Tag key={chip.key} size="sm" borderRadius="full" colorScheme="blue">
                  <TagLabel>{chip.label}</TagLabel>
                  <TagCloseButton onClick={chip.onRemove} />
                </Tag>
              ))}
            </Wrap>
          )}
        </Box>

        <Flex gap={6} align="flex-start">
          <Box
            display={{ base: "none", lg: "block" }}
            w="280px"
            flexShrink={0}
            position="sticky"
            top="110px"
            maxH="calc(100vh - 130px)"
            overflowY="auto"
            border="1px solid"
            borderColor={filterBorder}
            borderRadius="md"
            bg={filterBg}
            p={4}
          >
            <AdvancedFilterPanel
              facets={facets}
              filters={advancedFilters}
              onToggle={toggleAdvancedFilter}
              onPriceChange={setPriceFilter}
              onClear={clearAdvancedFilters}
            />
          </Box>

          <Box flex={1} minW={0} bg={cardGridBg}>
            {loading ? (
              <SimpleGrid columns={{ base: 1, sm: 2, md: 3, xl: 4 }} spacing={{ base: 4, md: 6 }}>
                {[...Array(PRODUCT_LIMIT)].map((_, index) => (
                  <Box key={index} borderRadius="xl" overflow="hidden">
                    <ProductCardSkeleton />
                  </Box>
                ))}
              </SimpleGrid>
            ) : (
              products.length > 0 ? (
                <>
                  <SimpleGrid columns={{ base: 1, sm: 2, md: 3, xl: 4 }} spacing={{ base: 4, md: 6 }}>
                    {products.map((product) => (
                      <MotionBox
                        key={`${product._id || product.productId}-${product.name}`}
                        whileHover={{ y: -6 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <ProductCard product={product} />
                      </MotionBox>
                    ))}
                  </SimpleGrid>

                  {totalPages > 1 && (
                    <Flex mt={12} justify="center" align="center" width="100%">
                      <Box
                        px={4}
                        py={2}
                        bg={filterBg}
                        borderRadius="full"
                        boxShadow="sm"
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
                <VStack textAlign="center" py={16} px={4} spacing={4} bg={filterBg} borderRadius="xl" border="1px dashed" borderColor={filterBorder}>
                  <Icon as={FiInbox} boxSize={12} color={useColorModeValue("gray.300", "gray.600")} />
                  <VStack spacing={1}>
                    <Text fontSize="xl" fontWeight="semibold" color={useColorModeValue("gray.700", "gray.200")}>
                      No products matched your search
                    </Text>
                    <Text fontSize="md" color={mutedText} maxW="md">
                      Try adjusting your filter selection or clear search key phrases to view the full collection again.
                    </Text>
                  </VStack>
                  {hasActiveFilters && (
                    <Button size="sm" mt={2} colorScheme="blue" variant="outline" borderRadius="lg" onClick={resetFilters}>
                      Clear Active Filters
                    </Button>
                  )}
                </VStack>
              )
            )}
          </Box>
        </Flex>

        <Drawer isOpen={filterDrawer.isOpen} placement="bottom" onClose={filterDrawer.onClose} size="full">
          <DrawerOverlay />
          <DrawerContent borderTopRadius="lg">
            <DrawerCloseButton />
            <DrawerHeader>Filters</DrawerHeader>
            <DrawerBody pb={8}>
              <AdvancedFilterPanel
                facets={facets}
                filters={advancedFilters}
                onToggle={toggleAdvancedFilter}
                onPriceChange={setPriceFilter}
                onClear={clearAdvancedFilters}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </MotionBox>

      {/* Beautiful Section Divider Accent Line */}
      <Box w="100%" h="1px" bgGradient={`linear(to-r, transparent, ${filterBorder}, transparent)`} mb={{ base: 14, md: 24 }} />

      {/* Trending Products Section */}
      <MotionBox
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      >
        <Box mb={{ base: 6, md: 8 }}>
          <CommonHeading
            heading="Top Picks For You"
            subheading="Handpicked favorites based on current global marketplace trends"
            color={headingColor}
            align="left"
          />
        </Box>
        <Box 
          p={{ base: 1, md: 2 }}
          borderRadius="xl"
          bg={useColorModeValue("transparent", "rgba(255,255,255,0.01)")}
        >
          <ShopSection />
        </Box>
      </MotionBox>
    </Box>
  );
});

export default ProductsListSection;
