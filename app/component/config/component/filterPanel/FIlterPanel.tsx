"use client";
import {
  Box,
  Button,
  Collapse,
  Flex,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Stack,
  Text,
  useDisclosure,
  Tag,
  TagLabel,
  TagCloseButton,
  Divider,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { FaFilter, FaTag, FaPalette, FaRuler, FaDollarSign, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useEffect, useState } from "react";
import FilterSection from "./element/FilterSection";

const FilterPanel = () => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const [isMounted, setIsMounted] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    brands: [],
    colors: [],
    sizes: [],
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filterOptions = {
    categories: ["Electronics", "Clothing", "Home", "Sports"],
    brands: ["Quantum", "Nike", "Adidas", "Sony"],
    colors: ["Black", "White", "Red", "Blue"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
  };

  const handleFilterChange = (type, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((item) => item !== value)
        : [...prev[type], value],
    }));
  };

  const clearFilter = (type, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item !== value),
    }));
  };

  const handleResetFilters = () => {
    setSelectedFilters({
      categories: [],
      brands: [],
      colors: [],
      sizes: [],
    });
    setPriceRange([0, 1000]);
  };

  if (!isMounted) return null;

  return (
    <Box
      w="100%"
      bg="white"
      borderRadius="xl"
      boxShadow="lg"
      p={4}
    >
      {/* Header */}
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={3}>
          <FaFilter size={18} />
          <Text fontWeight="bold" fontSize="lg">Filters</Text>
        </Flex>
        <IconButton
          icon={isOpen ? <FaChevronUp /> : <FaChevronDown />}
          size="sm"
          onClick={onToggle}
          colorScheme="teal"
          variant="ghost"
          aria-label="Toggle filters"
        />
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Divider my={4} />

        {/* Selected Filters */}
        {Object.values(selectedFilters).flat().length > 0 && (
          <Flex wrap="wrap" gap={2} mb={4}>
            {Object.entries(selectedFilters).map(([type, values]) =>
              values.map((value) => (
                <Tag key={`${type}-${value}`} size="md" borderRadius="full" variant="subtle" px={3} bg="gray.100">
                  <TagLabel>{value}</TagLabel>
                  <TagCloseButton onClick={() => clearFilter(type, value)} />
                </Tag>
              ))
            )}
          </Flex>
        )}

        <Stack spacing={6}>
          {/* Price Range */}
          <Box>
            <Flex align="center" gap={2} mb={2}>
              <FaDollarSign size={16} />
              <Text fontWeight="bold" fontSize="md">Price Range</Text>
            </Flex>
            <Tooltip label={`Range: $${priceRange[0]} - $${priceRange[1]}`} aria-label="Price range tooltip">
              <RangeSlider min={0} max={1000} step={10} value={priceRange} onChange={(val) => setPriceRange(val)}>
                <RangeSliderTrack bg="gray.200">
                  <RangeSliderFilledTrack bg="teal.500" />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} boxSize={4} bg="teal.600" />
                <RangeSliderThumb index={1} boxSize={4} bg="teal.600" />
              </RangeSlider>
            </Tooltip>
            <Flex justify="space-between" mt={2}>
              <Text fontSize="sm">${priceRange[0]}</Text>
              <Text fontSize="sm">${priceRange[1]}</Text>
            </Flex>
          </Box>

          {/* Filter Sections */}
          <Flex direction="column" gap={4}>
            <FilterSection title="Categories" icon={<FaTag />} options={filterOptions.categories} selected={selectedFilters.categories} onChange={(val) => handleFilterChange("categories", val)} />
            <FilterSection title="Brands" icon={<FaTag />} options={filterOptions.brands} selected={selectedFilters.brands} onChange={(val) => handleFilterChange("brands", val)} />
            <FilterSection title="Colors" icon={<FaPalette />} options={filterOptions.colors} selected={selectedFilters.colors} onChange={(val) => handleFilterChange("colors", val)} isColor />
            <FilterSection title="Sizes" icon={<FaRuler />} options={filterOptions.sizes} selected={selectedFilters.sizes} onChange={(val) => handleFilterChange("sizes", val)} />
          </Flex>

          {/* Reset Button */}
          <Button
            bg="teal.500"
            color="white"
            size="md"
            borderRadius="full"
            _hover={{ bg: "teal.600" }}
            _active={{ bg: "teal.700" }}
            w="full"
            onClick={handleResetFilters}
          >
            Reset Filters
          </Button>
        </Stack>
      </Collapse>
    </Box>
  );
};

export default FilterPanel;
