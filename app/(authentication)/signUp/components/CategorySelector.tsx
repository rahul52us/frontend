// components/CategorySelector.tsx
import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import {
  Box,
  BoxProps,
  Flex,
  HStack,
  VStack,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button,
  Badge,
  Spinner,
  IconButton,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  FiSearch,
  FiX,
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiLayers,
} from 'react-icons/fi';
import { getCategoryIcon } from './utils/category';
import stores from '../../../store/stores';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: null | { _id: string; name: string; slug: string } | string;
  isActive?: boolean;
  image?: { url?: string; name?: string };
}

interface CategorySelectorProps extends Omit<BoxProps, 'onChange'> {
  categories?: Category[];
  selected: string[];
  onChange: (selected: string[]) => void;
  loading?: boolean;
  primaryColor?: string;
  maxSelection?: number;
}

// Pastel icon backgrounds for app-like clean aesthetics
const getCategoryIconStyle = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hueList = [210, 150, 280, 25, 340, 180, 40, 260];
  const h = hueList[Math.abs(hash) % hueList.length];
  return {
    bg: `hsl(${h}, 85%, 94%)`,
    color: `hsl(${h}, 80%, 40%)`,
  };
};

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories: initialCategoriesProp,
  selected = [],
  onChange,
  loading: externalLoading = false,
  primaryColor = '#094a82',
  maxSelection = 5,
  ...boxProps
}) => {
  const { categoryStore } = stores;

  const [topCategories, setTopCategories] = useState<Category[]>([]);
  const [loadingTop, setLoadingTop] = useState<boolean>(true);

  // Search & Pagination state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Category[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [extraCategories, setExtraCategories] = useState<Category[]>([]);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const searchTimeoutRef = useRef<any>(null);

  // 1. Initial Top 10 Root Categories Load
  useEffect(() => {
    let isMounted = true;
    const fetchTop = async () => {
      setLoadingTop(true);
      try {
        const res = await categoryStore.getTopCategories(10);
        if (isMounted) {
          if (res?.status === 'success' && Array.isArray(res.data) && res.data.length > 0) {
            setTopCategories(res.data);
          } else if (initialCategoriesProp && initialCategoriesProp.length > 0) {
            const roots = initialCategoriesProp.filter(c => !c.parent && c.isActive !== false);
            setTopCategories(roots.slice(0, 10));
          }
        }
      } catch (err) {
        if (isMounted && initialCategoriesProp && initialCategoriesProp.length > 0) {
          const roots = initialCategoriesProp.filter(c => !c.parent && c.isActive !== false);
          setTopCategories(roots.slice(0, 10));
        }
      } finally {
        if (isMounted) setLoadingTop(false);
      }
    };

    fetchTop();
    return () => {
      isMounted = false;
    };
  }, [categoryStore, initialCategoriesProp]);

  // 2. Real-time Backend Search with Debounce
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!value.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await categoryStore.searchRootCategories(value.trim(), 1, 30);
        if (res?.status === 'success' && Array.isArray(res.data)) {
          setSearchResults(res.data);
        } else {
          setSearchResults([]);
        }
      } catch (e) {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);
  };

  // 3. Toggle View More / View Less
  const handleToggleExpand = async () => {
    if (!isExpanded && extraCategories.length === 0) {
      setLoadingMore(true);
      try {
        const res = await categoryStore.searchRootCategories('', 1, 40);
        if (res?.status === 'success' && Array.isArray(res.data)) {
          const existingIds = new Set(topCategories.map((c) => c._id));
          const fresh = res.data.filter((c: Category) => !existingIds.has(c._id));
          setExtraCategories(fresh);
        }
      } catch (e) {
        // silent
      } finally {
        setLoadingMore(false);
      }
    }
    setIsExpanded((prev) => !prev);
  };

  const toggleCategory = useCallback(
    (name: string) => {
      if (selected.includes(name)) {
        onChange(selected.filter((item) => item !== name));
      } else {
        if (!maxSelection || selected.length < maxSelection) {
          onChange([...selected, name]);
        }
      }
    },
    [selected, onChange, maxSelection]
  );

  // Active items list
  const currentList = useMemo(() => {
    if (searchQuery.trim()) {
      return searchResults;
    }
    if (isExpanded) {
      return [...topCategories, ...extraCategories];
    }
    return topCategories;
  }, [searchQuery, searchResults, isExpanded, topCategories, extraCategories]);

  const isLoading = externalLoading || (loadingTop && topCategories.length === 0);

  return (
    <VStack align="stretch" spacing={3.5} {...boxProps}>
      {/* 1. Header with title & selection count */}
      <Flex justify="space-between" align="center">
        <Box>
          <HStack spacing={2}>
            <Text fontSize={{ base: '15px', md: '16px' }} fontWeight="800" color="gray.900">
              Select Shop Categories
            </Text>
            {selected.length > 0 && (
              <Badge
                borderRadius="full"
                px={2.5}
                py={0.5}
                fontSize="11px"
                fontWeight="700"
                bg={`${primaryColor}15`}
                color={primaryColor}
              >
                {selected.length}/{maxSelection} Selected
              </Badge>
            )}
          </HStack>
          <Text fontSize="12px" color="gray.500" mt={0.5}>
            Choose up to {maxSelection} categories your shop sells.
          </Text>
        </Box>

        {selected.length > 0 && (
          <Button
            variant="ghost"
            size="xs"
            color="red.500"
            fontWeight="600"
            fontSize="11.5px"
            h="24px"
            px={2}
            _hover={{ bg: 'red.50' }}
            onClick={() => onChange([])}
          >
            Clear all
          </Button>
        )}
      </Flex>

      {/* 2. Sleek Real-Time Search Bar */}
      <InputGroup size="sm">
        <InputLeftElement pointerEvents="none" h="full" pl={2}>
          {isSearching ? (
            <Spinner size="xs" color={primaryColor} />
          ) : (
            <FiSearch color="#94A3B8" size={14} />
          )}
        </InputLeftElement>
        <Input
          placeholder="Search categories (e.g. Electricals, Clothing, Toys, Hardware)..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          borderRadius="12px"
          borderColor="gray.200"
          bg="white"
          h="38px"
          fontSize="13px"
          pl={8}
          pr={8}
          _hover={{ borderColor: 'gray.300' }}
          _focus={{
            borderColor: primaryColor,
            boxShadow: `0 0 0 1.5px ${primaryColor}30`,
          }}
        />
        {searchQuery && (
          <InputRightElement h="full" pr={1}>
            <IconButton
              aria-label="Clear"
              icon={<FiX size={13} />}
              size="xs"
              variant="ghost"
              borderRadius="full"
              onClick={() => handleSearchChange('')}
            />
          </InputRightElement>
        )}
      </InputGroup>

      {/* 3. App-Style Uniform Grid (2 columns on mobile, 2 columns on desktop for balanced readability) */}
      {isLoading ? (
        <Flex minH="120px" align="center" justify="center" direction="column" gap={2} py={6} bg="white" borderRadius="xl">
          <Spinner size="sm" color={primaryColor} thickness="2.5px" />
          <Text fontSize="12px" color="gray.500">Loading shop categories...</Text>
        </Flex>
      ) : isSearching ? (
        <Flex minH="120px" align="center" justify="center" direction="column" gap={2} py={6} bg="white" borderRadius="xl">
          <Spinner size="sm" color={primaryColor} thickness="2.5px" />
          <Text fontSize="12px" color="gray.500">Searching for "{searchQuery}"...</Text>
        </Flex>
      ) : searchQuery.trim() && currentList.length === 0 ? (
        <Box py={8} textAlign="center" bg="white" borderRadius="xl" border="1.5px dashed" borderColor="gray.200">
          <FiLayers size={28} color="#94A3B8" style={{ margin: '0 auto' }} />
          <Text fontSize="13px" fontWeight="700" color="gray.700" mt={2}>
            No categories found matching "{searchQuery}"
          </Text>
          <Text fontSize="11.5px" color="gray.500" mt={0.5}>
            Try another keyword or clear search to browse root categories.
          </Text>
        </Box>
      ) : (
        <VStack align="stretch" spacing={2.5}>
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2.5}>
            {currentList.map((category) => {
              const isSelected = selected.includes(category.name);
              const iconStyle = getCategoryIconStyle(category.name);

              return (
                <Flex
                  key={category._id}
                  as="button"
                  type="button"
                  onClick={() => toggleCategory(category.name)}
                  align="center"
                  justify="space-between"
                  px={3.5}
                  py={2.5}
                  minH="52px"
                  borderRadius="14px"
                  border="1.5px solid"
                  borderColor={isSelected ? primaryColor : 'gray.200'}
                  bg={isSelected ? `${primaryColor}0C` : 'white'}
                  cursor="pointer"
                  transition="all 0.15s ease"
                  boxShadow={
                    isSelected
                      ? `0 2px 8px ${primaryColor}22`
                      : '0 1px 2px rgba(0,0,0,0.02)'
                  }
                  _hover={{
                    borderColor: isSelected ? primaryColor : 'gray.300',
                    bg: isSelected ? `${primaryColor}10` : 'gray.50',
                    transform: 'translateY(-1px)',
                  }}
                  _active={{
                    transform: 'scale(0.98)',
                  }}
                  textAlign="left"
                >
                  {/* Left: Icon + Text */}
                  <HStack spacing={3} flex={1} minW={0} pr={2}>
                    <Flex
                      w="32px"
                      h="32px"
                      borderRadius="10px"
                      bg={isSelected ? primaryColor : iconStyle.bg}
                      color={isSelected ? 'white' : iconStyle.color}
                      align="center"
                      justify="center"
                      flexShrink={0}
                      transition="all 0.15s ease"
                    >
                      {getCategoryIcon(
                        category.name,
                        14,
                        isSelected ? 'white' : iconStyle.color,
                        1.8
                      )}
                    </Flex>

                    <Text
                      fontSize="13px"
                      fontWeight={isSelected ? '700' : '600'}
                      color={isSelected ? primaryColor : 'gray.800'}
                      lineHeight="1.25"
                      noOfLines={2}
                    >
                      {category.name}
                    </Text>
                  </HStack>

                  {/* Right: Touch checkbox */}
                  <Flex
                    w="20px"
                    h="20px"
                    borderRadius="full"
                    align="center"
                    justify="center"
                    border="1.5px solid"
                    borderColor={isSelected ? primaryColor : 'gray.300'}
                    bg={isSelected ? primaryColor : 'white'}
                    flexShrink={0}
                    transition="all 0.15s ease"
                  >
                    {isSelected && (
                      <FiCheck size={11} color="white" strokeWidth={3.5} />
                    )}
                  </Flex>
                </Flex>
              );
            })}
          </SimpleGrid>

          {/* Toggle More / Less button */}
          {!searchQuery.trim() && (
            <Flex justify="center" pt={1}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleExpand}
                isLoading={loadingMore}
                rightIcon={isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                color="gray.600"
                _hover={{ bg: 'gray.100', color: primaryColor }}
                fontSize="12.5px"
                fontWeight="700"
                borderRadius="full"
                px={4}
                h="34px"
              >
                {isExpanded ? 'Show less categories' : 'Browse more categories'}
              </Button>
            </Flex>
          )}
        </VStack>
      )}
    </VStack>
  );
};
