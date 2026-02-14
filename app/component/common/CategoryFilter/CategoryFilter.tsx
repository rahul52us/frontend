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
    categoryStore.getAllCategories({ isActive: true, isFeatured: true });
  }, []);

  const handleCategoryClick = (category: any) => {
    setActiveCategory(category._id);
    router.push(`/categories/${category.slug || category.name.toLowerCase()}`);
  };

  const isLoading = loading && categories.length === 0;

  if (isLoading) {
    return (
      <Box py={4} px={{ base: 4, md: 8 }} bg="white" mt={2} overflowX="auto">
        <Flex gap={4} mx="auto" justify="center">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} h="80px" w="120px" borderRadius="lg" />
          ))}
        </Flex>
      </Box>
    )
  }

  // Fallback for empty categories if loading finishes but nothing is there
  if (!loading && (!categories || categories.length === 0)) return null;

  return (
    <Box
      as="nav"
      py={3}
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.100"
      position="sticky"
      top="0"
      zIndex="100"
      overflowX="auto"
      css={{
        '&::-webkit-scrollbar': { display: 'none' },
        '-ms-overflow-style': 'none',
        'scrollbar-width': 'none',
      }}
    >
      <Flex
        px={{ base: 4, md: 6 }}
        gap={{ base: 6, md: 6 }}
        justifyContent="center"
      >
        {categories.map((category) => (
          <Flex
            key={category._id}
            direction="column"
            align="center"
            onClick={() => handleCategoryClick(category)}
            cursor="pointer"
            flex="0 0 auto"
            transition="all 0.2s"
            _active={{ transform: "scale(0.9)" }}
          >
            <Box
              p="2px"
              borderRadius="full"
              border="2px solid"
              borderColor={activeCategory === category._id ? 'purple.500' : 'transparent'}
              mb={1}
            >
              <Box
                borderRadius="full"
                overflow="hidden"
                boxSize={{ base: '50px', md: '60px' }}
                bg="gray.100"
              >
                <Image
                  src={category.image?.url || 'https://via.placeholder.com/150'}
                  alt={category.name}
                  objectFit="cover"
                  w="100%"
                  h="100%"
                />
              </Box>
            </Box>
            <Text
              fontSize="xs"
              fontWeight={activeCategory === category._id ? "bold" : "medium"}
              color={activeCategory === category._id ? 'purple.600' : 'gray.600'}
              textAlign="center"
              maxW="70px"
              noOfLines={1}
            >
              {category.name}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
});

export default CategoryFilter;