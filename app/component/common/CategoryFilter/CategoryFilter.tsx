import { Box, Flex, Image, Text, Skeleton, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { observer } from 'mobx-react-lite';
import categoryStore from '../../../store/categoryStore/categoryStore';

const MotionFlex = motion(Flex);
const MotionBox = motion(Box);

const CategoryFilter = observer(() => {
  const router = useRouter();
  const { categories, loading } = categoryStore;
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    categoryStore.getAllCategories({ isActive: true, isFeatured: true });
  }, []);

  const handleCategoryClick = (category: any) => {
    setActiveCategory(category._id);
    router.push(`/categories/${category.slug || category.name.toLowerCase()}`);
  };

  const bgColor = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)');
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.200');

  const isLoading = loading && categories.length === 0;

  if (isLoading) {
    return (
      <Box py={4} px={{ base: 4, md: 8 }} mt={2} overflowX="auto">
        <Flex gap={4} mx="auto" justify="center">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} h="80px" w="100px" borderRadius="2xl" />
          ))}
        </Flex>
      </Box>
    )
  }

  if (!loading && (!categories || categories?.length === 0)) return null;

  return (
    <Box
      as="nav"
      py={4}
      bg={bgColor}
      backdropFilter="blur(20px)"
      borderBottom="1px solid"
      borderColor={borderColor}
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
        px={{ base: 4, md: 8 }}
        gap={{ base: 8, md: 10 }}
        justifyContent={{ base: "flex-start", md: "center" }}
        align="center"
      >
        {categories.map((category) => (
          <MotionFlex
            key={category._id}
            direction="column"
            align="center"
            onClick={() => handleCategoryClick(category)}
            cursor="pointer"
            flex="0 0 auto"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Box
              p="3px"
              borderRadius="2xl"
              bgGradient={activeCategory === category._id ? "linear(to-tr, purple.500, blue.500)" : "transparent"}
              mb={2}
              transition="all 0.3s"
              boxShadow={activeCategory === category._id ? "0 8px 20px -5px rgba(128, 90, 213, 0.5)" : "none"}
            >
              <Box
                borderRadius="xl"
                overflow="hidden"
                boxSize={{ base: '54px', md: '64px' }}
                bg="gray.100"
                border="2px solid white"
              >
                <Image
                  src={category.image?.url || 'https://via.placeholder.com/150'}
                  alt={category.name}
                  objectFit="cover"
                  w="100%"
                  h="100%"
                  transition="transform 0.5s"
                  _hover={{ transform: 'scale(1.1)' }}
                />
              </Box>
            </Box>
            <Text
              fontSize="xs"
              fontWeight={activeCategory === category._id ? "bold" : "semibold"}
              color={activeCategory === category._id ? 'purple.600' : 'gray.500'}
              textAlign="center"
              maxW="80px"
              noOfLines={1}
              letterSpacing="wide"
              textTransform="uppercase"
            >
              {category.name}
            </Text>
            {activeCategory === category._id && (
              <MotionBox
                layoutId="activeCategory"
                mt={1}
                h="3px"
                w="20px"
                bg="purple.500"
                borderRadius="full"
              />
            )}
          </MotionFlex>
        ))}
      </Flex>
    </Box>
  );
});

export default CategoryFilter;
