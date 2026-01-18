"use client";
import { Box, Flex, Image, Text, Skeleton } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { observer } from 'mobx-react-lite';
import categoryStore from '../../../store/categoryStore/categoryStore';

// Define a subtle bounce animation for active state
const bounce = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const CategoryFilter = observer(() => {
  const router = useRouter();
  const { categories, loading } = categoryStore;
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    // Fetch all active categories (including subcategories)
    categoryStore.getAllCategories({ isActive: true });
  }, []);

  const handleCategoryClick = (category: any) => {
    setActiveCategory(category._id);
    router.push(`/categories/${category.slug || category.name.toLowerCase()}`);
  };

  const isLoading = loading && categories.length === 0;

  if (isLoading) {
    return (
      <Box py={4} px={{ base: 4, md: 8 }} bg="white" mt={2} overflowX="auto">
        <Flex gap={4} maxW="1400px" mx="auto" justify="center">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} h="80px" w="120px" borderRadius="lg" />
          ))}
        </Flex>
      </Box>
    )
  }

  // Fallback for empty categories if loading finishes but nothing is there
  if (!loading && (!categories || categories.length === 0)) return null;

  // Function to determine if we should render. 
  // If we only want to limit the display to 6, we slice here.
  const displayCategories = categories.slice(0, 6);

  return (
    <Box
      as="nav"
      py={4} // Comfortable padding
      px={{ base: 4, md: 8 }} // Responsive padding
      bg="white" // Clean white background
      boxShadow="0 2px 10px rgba(0, 0, 0, 0.1)" // Subtle shadow
      position="sticky"
      top="0"
      zIndex="10"
      mt={2}
      overflowX="auto" // Scrollable on small screens
    >
      <Flex
        align="center"
        justify="center"
        maxW="1400px"
        mx="auto"
        gap={{ base: 2, md: 4 }} // Responsive gap
        css={{
          '&::-webkit-scrollbar': { height: '6px' }, // Slim scrollbar
          '&::-webkit-scrollbar-thumb': { bg: 'gray.300', borderRadius: 'full' },
        }}
      >
        {displayCategories.map((category) => (
          <Box
            key={category._id}
            onClick={() => handleCategoryClick(category)}
            cursor="pointer"
            flex="0 0 auto" // Don't stretch, maintain width
            minW={{ base: '100px', md: '120px' }} // Minimum width
            maxW="150px" // Cap width for consistency
            w={{ base: '100px', md: '120px' }}
            borderRadius="lg"
            overflow="hidden"
            bg={activeCategory === category._id ? `purple.50` : 'gray.50'} // Simplified color logic as dynamic color might not be on DB object yet
            border="2px solid"
            borderColor={activeCategory === category._id ? 'purple.500' : 'gray.200'}
            transition="all 0.3s ease"
            _hover={{
              bg: `purple.50`,
              borderColor: 'purple.400',
              transform: "scale(1.05)",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)", // Shadow on hover
            }}
            animation={activeCategory === category._id ? `${bounce} 1.5s infinite` : undefined}
            position="relative"
          >
            <Image
              src={category.image?.url || 'https://via.placeholder.com/150'} // Fallback image
              alt={category.name}
              height={{ base: '60px', md: '80px' }}
              width="100%"
              objectFit="cover"
              borderRadius="md"
              opacity={activeCategory === category._id ? 1 : 0.9}
              transition="opacity 0.3s ease"
              _hover={{ opacity: 1 }}
            />
            <Text
              py={2}
              fontSize={{ base: 'xs', md: 'sm' }}
              fontWeight="bold"
              color={activeCategory === category._id ? 'purple.600' : 'gray.800'}
              textAlign="center"
              textTransform="capitalize"
              letterSpacing="0.5px"
              overflowWrap="break-word"
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              px={1}
            >
              {category.name}
            </Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
});

export default CategoryFilter;