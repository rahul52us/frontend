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
  Wrap
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FiChevronDown, FiDollarSign, FiMapPin, FiSliders, FiX } from "react-icons/fi";

const MotionBox = motion(Box);

const CompactFilters = () => {
  const accentColor = useColorModeValue("brand.100", "purple.300");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const toast = useToast();

  const categories = ["Electronics", "Fashion", "Home", "Beauty"];
  const vendors = ["Nike", "Apple", "Samsung", "Sony"];
  const locations = ["All", "USA", "Europe", "Asia"];

  const removeFilter = (type: string, value: string) => {
    if (type === 'category') {
      setSelectedCategories(prev => prev.filter(item => item !== value));
    } else if (type === 'vendor') {
      setSelectedVendors(prev => prev.filter(item => item !== value));
    }
    toast({
      title: "Filter removed",
      status: "info",
      duration: 1000,
      isClosable: true,
    });
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedVendors([]);
    setPriceRange([0, 1000]);
    toast({
      title: "Filters reset",
      status: "success",
      duration: 1500,
      isClosable: true,
    });
  };

  return (
    <Box>
      {/* Filter Controls Row */}
      <Flex gap={3} my={4} align="center" wrap="wrap" justify={'end'}>
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
              value={priceRange}
              min={0}
              max={1000}
              step={50}
              onChange={setPriceRange}
              mt={4}
              mb={2}
              aria-label={['min', 'max']}
            >
              <RangeSliderTrack bg="gray.100">
                <RangeSliderFilledTrack bgGradient={`linear(to-r, ${accentColor}, pink.400)`} />
              </RangeSliderTrack>
              <RangeSliderThumb boxSize={4} index={0} bg={accentColor} />
              <RangeSliderThumb boxSize={4} index={1} bg={accentColor} />
            </RangeSlider>
            <Flex justify="space-between" fontSize="sm" color="gray.600">
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
              // onChange={setSelectedCategories}
            >
              <Stack spacing={2}>
                {categories.map(category => (
                  <Checkbox 
                    key={category} 
                    value={category}
                    size="sm"
                    colorScheme="purple"
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
              // onChange={setSelectedVendors}
            >
              <Stack spacing={2}>
                {vendors.map(vendor => (
                  <Checkbox 
                    key={vendor} 
                    value={vendor}
                    size="sm"
                    colorScheme="purple"
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
            _hover={{ borderColor: accentColor }}
            focusBorderColor={accentColor}
          >
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
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
            {selectedCategories.map(category => (
              <Tag 
                size="sm" 
                key={category} 
                borderRadius="full" 
                variant="subtle" 
                colorScheme="purple"
                _hover={{ transform: "scale(1.05)" }}
                transition="transform 0.2s"
              >
                <TagLabel>{category}</TagLabel>
                <TagCloseButton onClick={() => removeFilter('category', category)} />
              </Tag>
            ))}
            {selectedVendors.map(vendor => (
              <Tag 
                size="sm" 
                key={vendor} 
                borderRadius="full" 
                variant="subtle" 
                colorScheme="purple"
                _hover={{ transform: "scale(1.05)" }}
                transition="transform 0.2s"
              >
                <TagLabel>{vendor}</TagLabel>
                <TagCloseButton onClick={() => removeFilter('vendor', vendor)} />
              </Tag>
            ))}
          </Wrap>
        </MotionBox>
      )}
    </Box>
  );
};

export default CompactFilters;