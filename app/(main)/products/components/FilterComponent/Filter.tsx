"use client";

import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Select,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useColorModeValue,
  useToast,
  Wrap,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { memo, useCallback, useState } from "react";
import { FiChevronDown, FiDollarSign, FiMapPin, FiSliders, FiX } from "react-icons/fi";

const MotionBox = motion(Box);

const STATIC_CATEGORIES = ["Electronics", "Fashion", "Home", "Beauty"];
const STATIC_VENDORS = ["Nike", "Apple", "Samsung", "Sony"];
const STATIC_LOCATIONS = ["All", "USA", "Europe", "Asia"];

interface CompactFiltersProps {
  categories?: string[];
  vendors?: string[];
  locations?: string[];
  onFilterChange?: (filters: {
    priceRange: [number, number];
    categories: string[];
    vendors: string[];
    location?: string;
  }) => void;
}

const CompactFilters = ({
  categories = STATIC_CATEGORIES,
  vendors = STATIC_VENDORS,
  locations = STATIC_LOCATIONS,
  onFilterChange,
}: CompactFiltersProps) => {
  const accentColor = useColorModeValue("brand.100", "purple.300");
  const trackBg = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const toast = useToast();

  const handlePriceChange = useCallback(
    (val: number[]) => {
      const range: [number, number] = [val[0], val[1]];
      setPriceRange(range);
      onFilterChange?.({
        priceRange: range,
        categories: selectedCategories,
        vendors: selectedVendors,
        location: selectedLocation,
      });
    },
    [onFilterChange, selectedCategories, selectedLocation, selectedVendors]
  );

  const handleCategoryChange = useCallback(
    (values: (string | number)[]) => {
      const newCats = values.map(String);
      setSelectedCategories(newCats);
      onFilterChange?.({
        priceRange,
        categories: newCats,
        vendors: selectedVendors,
        location: selectedLocation,
      });
    },
    [onFilterChange, priceRange, selectedLocation, selectedVendors]
  );

  const handleVendorChange = useCallback(
    (values: (string | number)[]) => {
      const newVendors = values.map(String);
      setSelectedVendors(newVendors);
      onFilterChange?.({
        priceRange,
        categories: selectedCategories,
        vendors: newVendors,
        location: selectedLocation,
      });
    },
    [onFilterChange, priceRange, selectedCategories, selectedLocation]
  );

  const handleLocationChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const loc = e.target.value;
      setSelectedLocation(loc);
      onFilterChange?.({
        priceRange,
        categories: selectedCategories,
        vendors: selectedVendors,
        location: loc,
      });
    },
    [onFilterChange, priceRange, selectedCategories, selectedVendors]
  );

  const removeFilter = useCallback(
    (type: "category" | "vendor", value: string) => {
      if (type === "category") {
        setSelectedCategories((prev) => {
          const next = prev.filter((item) => item !== value);
          onFilterChange?.({
            priceRange,
            categories: next,
            vendors: selectedVendors,
            location: selectedLocation,
          });
          return next;
        });
      } else if (type === "vendor") {
        setSelectedVendors((prev) => {
          const next = prev.filter((item) => item !== value);
          onFilterChange?.({
            priceRange,
            categories: selectedCategories,
            vendors: next,
            location: selectedLocation,
          });
          return next;
        });
      }
      toast({
        title: "Filter removed",
        status: "info",
        duration: 1000,
        isClosable: true,
      });
    },
    [onFilterChange, priceRange, selectedCategories, selectedLocation, selectedVendors, toast]
  );

  const resetFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedVendors([]);
    setSelectedLocation("");
    setPriceRange([0, 1000]);
    onFilterChange?.({
      priceRange: [0, 1000],
      categories: [],
      vendors: [],
      location: "",
    });
    toast({
      title: "Filters reset",
      status: "success",
      duration: 1500,
      isClosable: true,
    });
  }, [onFilterChange, toast]);

  return (
    <Box>
      {/* Filter Controls Row */}
      <Flex gap={3} my={4} align="center" wrap="wrap" justify="end">
        {/* Price Filter */}
        <Menu closeOnSelect={false}>
          <MenuButton
            as={Button}
            size="sm"
            variant="outline"
            leftIcon={<FiDollarSign />}
            rightIcon={<FiChevronDown />}
            _hover={{ bg: accentColor, color: "white" }}
            transition="all 0.2s"
          >
            Price
          </MenuButton>
          <MenuList p={3} minWidth="240px" borderRadius="lg" boxShadow="lg">
            <RangeSlider
              aria-label={["min-price", "max-price"]}
              value={priceRange}
              min={0}
              max={1000}
              step={50}
              onChange={handlePriceChange}
              mt={4}
              mb={2}
            >
              <RangeSliderTrack bg={trackBg}>
                <RangeSliderFilledTrack bgGradient={`linear(to-r, ${accentColor}, pink.400)`} />
              </RangeSliderTrack>
              <RangeSliderThumb boxSize={4} index={0} bg={accentColor} />
              <RangeSliderThumb boxSize={4} index={1} bg={accentColor} />
            </RangeSlider>
            <Flex justify="space-between" fontSize="sm" color={textColor}>
              <Text>${priceRange[0]}</Text>
              <Text>${priceRange[1]}</Text>
            </Flex>
          </MenuList>
        </Menu>

        {/* Category Filter */}
        <Menu closeOnSelect={false}>
          <MenuButton
            as={Button}
            size="sm"
            variant="outline"
            leftIcon={<FiSliders />}
            rightIcon={<FiChevronDown />}
            _hover={{ bg: accentColor, color: "white" }}
            transition="all 0.2s"
          >
            Category
          </MenuButton>
          <MenuList p={3} minWidth="200px" borderRadius="lg" boxShadow="lg">
            <CheckboxGroup
              value={selectedCategories}
              onChange={handleCategoryChange}
            >
              <Stack spacing={2}>
                {categories.map((category) => (
                  <Checkbox
                    key={category}
                    value={category}
                    size="sm"
                    colorScheme="brand"
                    _hover={{ transform: "translateX(2px)" }}
                    transition="transform 0.2s"
                  >
                    {category}
                  </Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>
          </MenuList>
        </Menu>

        {/* Vendor Filter */}
        <Menu closeOnSelect={false}>
          <MenuButton
            as={Button}
            size="sm"
            variant="outline"
            leftIcon={<FiSliders />}
            rightIcon={<FiChevronDown />}
            _hover={{ bg: accentColor, color: "white" }}
            transition="all 0.2s"
          >
            Brand
          </MenuButton>
          <MenuList p={3} minWidth="200px" borderRadius="lg" boxShadow="lg">
            <CheckboxGroup
              value={selectedVendors}
              onChange={handleVendorChange}
            >
              <Stack spacing={2}>
                {vendors.map((vendor) => (
                  <Checkbox
                    key={vendor}
                    value={vendor}
                    size="sm"
                    colorScheme="brand"
                    _hover={{ transform: "translateX(2px)" }}
                    transition="transform 0.2s"
                  >
                    {vendor}
                  </Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>
          </MenuList>
        </Menu>

        {/* Location Filter */}
        <Select
          size="sm"
          width="140px"
          placeholder="Location"
          icon={<FiMapPin />}
          variant="outline"
          value={selectedLocation}
          onChange={handleLocationChange}
          _hover={{ borderColor: accentColor }}
          focusBorderColor={accentColor}
        >
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </Select>

        {/* Reset Button */}
        <IconButton
          size="sm"
          aria-label="Reset filters"
          icon={<FiX />}
          onClick={resetFilters}
          colorScheme="red"
          variant="ghost"
        />
      </Flex>

      {/* Active Filters */}
      {(selectedCategories.length > 0 || selectedVendors.length > 0) && (
        <MotionBox
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Wrap spacing={2} mb={4}>
            {selectedCategories.map((category) => (
              <Tag
                size="sm"
                key={category}
                borderRadius="full"
                variant="subtle"
                colorScheme="brand"
                _hover={{ transform: "scale(1.05)" }}
                transition="transform 0.2s"
              >
                <TagLabel>{category}</TagLabel>
                <TagCloseButton onClick={() => removeFilter("category", category)} />
              </Tag>
            ))}
            {selectedVendors.map((vendor) => (
              <Tag
                size="sm"
                key={vendor}
                borderRadius="full"
                variant="subtle"
                colorScheme="brand"
                _hover={{ transform: "scale(1.05)" }}
                transition="transform 0.2s"
              >
                <TagLabel>{vendor}</TagLabel>
                <TagCloseButton onClick={() => removeFilter("vendor", vendor)} />
              </Tag>
            ))}
          </Wrap>
        </MotionBox>
      )}
    </Box>
  );
};

export default memo(CompactFilters);
