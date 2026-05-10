// components/CategorySelector.tsx
import { Box, BoxProps, Flex, HStack, SimpleGrid, Spinner, Text, VStack } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { BsLayers } from 'react-icons/bs';
import { getCategoryIcon } from './utils/category';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent: null | { _id: string; name: string; slug: string };
  isActive: boolean;
}

interface CategorySelectorProps extends Omit<BoxProps, 'onChange'> {
  categories: Category[];
  selected: string[];
  onChange: (selected: string[]) => void;
  loading?: boolean;
  primaryColor?: string;
  maxSelection?: number;
}

// Subtle, muted fill colors per category
const getCategoryFill = (name: string): { bg: string; border: string; text: string; iconColor: string } => {
  const fills: Record<string, { bg: string; border: string; text: string; iconColor: string }> = {
    Electronics:   { bg: '#EEF2FF', border: '#C7D2FE', text: '#3730A3', iconColor: '#4F46E5' },
    Clothing:      { bg: '#FDF2F8', border: '#F9A8D4', text: '#9D174D', iconColor: '#EC4899' },
    'Graphics Card':{ bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF', iconColor: '#3B82F6' },
    Processor:     { bg: '#F0FDF4', border: '#BBF7D0', text: '#14532D', iconColor: '#22C55E' },
    Mobile:        { bg: '#FFF7ED', border: '#FED7AA', text: '#92400E', iconColor: '#F97316' },
    Glass:         { bg: '#F0FDFA', border: '#99F6E4', text: '#134E4A', iconColor: '#14B8A6' },
    'T-shirt':     { bg: '#FFF1F2', border: '#FECDD3', text: '#9F1239', iconColor: '#F43F5E' },
  };

  if (fills[name]) return fills[name];

  // Generate consistent color from name hash
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return {
    bg: `hsl(${h}, 60%, 95%)`,
    border: `hsl(${h}, 55%, 80%)`,
    text: `hsl(${h}, 65%, 28%)`,
    iconColor: `hsl(${h}, 65%, 45%)`,
  };
};

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selected,
  onChange,
  loading = false,
  primaryColor = '#3182ce',
  maxSelection,
  ...boxProps
}) => {
  const rootCategories = useMemo(
    () => categories.filter((cat) => !cat.parent && cat.isActive !== false),
    [categories]
  );

  const toggleCategory = (name: string) => {
    if (selected.includes(name)) {
      onChange(selected.filter((s) => s !== name));
    } else if (!maxSelection || selected.length < maxSelection) {
      onChange([...selected, name]);
    }
  };

  if (loading) {
    return (
      <Box {...boxProps}>
        <HStack color="gray.400" spacing={2.5}>
          <Spinner size="xs" color={primaryColor} thickness="2px" />
          <Text fontSize="sm" color="gray.500">Loading categories...</Text>
        </HStack>
      </Box>
    );
  }

  if (rootCategories.length === 0) {
    return (
      <Box
        borderRadius="lg"
        border="1.5px dashed"
        borderColor="gray.200"
        p={5}
        textAlign="center"
        {...boxProps}
      >
        <BsLayers size={20} color="#9CA3AF" />
        <Text fontSize="sm" fontWeight="600" color="gray.500" mt={2}>
          No categories available
        </Text>
        <Text fontSize="xs" color="gray.400" mt={0.5}>
          Ask the superadmin to add categories first.
        </Text>
      </Box>
    );
  }

  return (
    <VStack align="stretch" spacing={4} {...boxProps}>
      {/* Header */}
      <Box>
        <Text fontSize="sm" fontWeight="700" color="gray.800" letterSpacing="-0.01em">
          Select shop categories
        </Text>
        <Text fontSize="xs" color="gray.400" mt={0.5} lineHeight="1.5">
          Choose categories your shop will sell.
        </Text>
      </Box>

      {/* Category Grid */}
      <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={1.5}>
        {rootCategories.map((category) => {
          const isSelected = selected.includes(category.name);
          const fill = getCategoryFill(category.name);

          return (
            <Box
              key={category._id}
              as="button"
              type="button"
              onClick={() => toggleCategory(category.name)}
              position="relative"
              overflow="hidden"
              border="1.5px solid"
              borderColor={isSelected ? fill.border : 'gray.200'}
              borderRadius="xl"
              bg="white"
              p={{md:0.5}}
              cursor="pointer"
              transition="border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease"
              boxShadow={
                isSelected
                  ? `0 1px 6px ${fill.border}99`
                  : '0 1px 2px rgba(0,0,0,0.04)'
              }
              _hover={{
                borderColor: isSelected ? fill.border : 'gray.300',
                boxShadow: isSelected
                  ? `0 2px 8px ${fill.border}bb`
                  : '0 1px 5px rgba(0,0,0,0.07)',
              }}
              _active={{
                transform: 'scale(0.97)',
                transition: 'all 0.1s',
              }}
              textAlign="left"
            >
              {/* Left-to-right fill layer */}
              <Box
                position="absolute"
                inset={0}
                bg={fill.bg}
                transformOrigin="left center"
                transform={isSelected ? 'scaleX(1)' : 'scaleX(0)'}
                transition="transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)"
                pointerEvents="none"
                zIndex={0}
              />

              {/* Card content — horizontal layout */}
              <HStack
                spacing={1.5}
                px={2}
                py={1.5}
                position="relative"
                zIndex={1}
              >
                {/* Icon */}
                <Flex
                  w="22px"
                  h="22px"
                  borderRadius="sm"
                  bg={isSelected ? `${fill.border}55` : 'gray.100'}
                  align="center"
                  justify="center"
                  flexShrink={0}
                  transition="background 0.25s ease"
                >
                  {getCategoryIcon(
                    category.name,
                    11,
                    isSelected ? fill.iconColor : '#9CA3AF',
                    1.6
                  )}
                </Flex>

                {/* Label */}
                <Text
                  fontWeight={isSelected ? '600' : '500'}
                  fontSize={{base:"10px",md:"sm"}}
                  color={isSelected ? fill.text : 'gray.500'}
                  lineHeight="1.2"
                  transition="color 0.25s ease"
                  noOfLines={1}
                  flex={1}
                >
                  {category.name}
                </Text>

                {/* Checkmark dot */}
                <Box
                  w="6px"
                  h="6px"
                  borderRadius="full"
                  bg={fill.iconColor}
                  flexShrink={0}
                  opacity={isSelected ? 1 : 0}
                  transform={isSelected ? 'scale(1)' : 'scale(0)'}
                  transition="opacity 0.2s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)"
                />
              </HStack>
            </Box>
          );
        })}
      </SimpleGrid>

      {/* Max selection warning */}
      {maxSelection && selected.length >= maxSelection && (
        <Text fontSize="xs" color="amber.600" fontWeight="500">
          Maximum {maxSelection} {maxSelection === 1 ? 'category' : 'categories'} allowed.
        </Text>
      )}
    </VStack>
  );
};