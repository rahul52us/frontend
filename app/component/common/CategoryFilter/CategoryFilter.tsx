'use client';

import {
  Box,
  Button,
  Flex,
  Image,
  Text,
  Skeleton,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { observer } from 'mobx-react-lite';
import categoryStore from '../../../store/categoryStore/categoryStore';

const MotionBox = motion(Box);

const CategorySection = observer(() => {
  const router = useRouter();
  const { categories, loading } = categoryStore;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    categoryStore.getAllCategories({ isActive: true, isFeatured: true });
  }, []);

  const cardBg = useColorModeValue('white', 'gray.800');
  const descriptionColor = useColorModeValue('gray.600', 'gray.400');
  const sectionText = useColorModeValue('gray.700', 'gray.300');

  const handleCategoryClick = useCallback(
    (category: any) => {
      router.push(`/categories?slug=${category.slug || category.name.toLowerCase()}`);
    },
    [router]
  );

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const isLoading = loading && categories.length === 0;

  if (isLoading) {
    return (
      <Box py={10} px={{ base: 4, md: 8 }}>
        <Flex gap={6} overflow="hidden">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} h="280px" w="260px" borderRadius="24px" flexShrink={0} />
          ))}
        </Flex>
      </Box>
    );
  }

  if (!categories.length) return null;

  return (
    <Box py={{ base: 8, md: 12 }} px={{ base: 4, md: 8 }} maxW="1600px" mx="auto">
      <Flex
        direction={{ base: 'column', md: 'row' }}
        wrap={{ base: 'wrap', md: 'nowrap' }}
        justify="space-between"
        align={{ base: 'flex-start', md: 'center' }}
        mb={6}
        gap={4}
      >
        <Box flex="1" minW={0} maxW={{ md: '620px' }}>
          <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="extrabold" lineHeight="1.05">
            Shop by Category
          </Text>
          <Text mt={3} color={sectionText} fontSize={{ base: 'sm', md: 'md' }} maxW="720px" lineHeight="1.7">
            Browse top categories curated for local buyers and sellers. Tap a category to explore the best products from trusted vendors near you.
          </Text>
        </Box>

        <Flex
          align="center"
          gap={2}
          flexShrink={0}
          justify={{ base: 'flex-start', md: 'flex-end' }}
        >
          <IconButton
            aria-label="Scroll left"
            icon={<ChevronLeftIcon />}
            onClick={() => scroll('left')}
            borderRadius="full"
            variant="outline"
            size="sm"
          />
          <IconButton
            aria-label="Scroll right"
            icon={<ChevronRightIcon />}
            onClick={() => scroll('right')}
            borderRadius="full"
            variant="outline"
            size="sm"
          />
        </Flex>
      </Flex>

      <Box position="relative">
        <Flex
          ref={scrollRef}
          gap={6}
          overflowX="auto"
          overflowY="hidden"
          pb={2}
          sx={{
            scrollSnapType: 'x mandatory',
            '& > div': {
              scrollSnapAlign: 'start',
            },
            /* Hide scrollbar for Chrome, Safari, Opera */
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            /* Hide scrollbar for IE, Edge, Firefox */
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {categories.map((category: any) => (
            <MotionBox
              key={category._id}
              bg={cardBg}
              borderRadius="24px"
              overflow="hidden"
              boxShadow="lg"
              cursor="pointer"
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.25 }}
              _hover={{ boxShadow: '2xl' }}
              minW="260px"
              w="260px"
              flexShrink={0}
            >
              <Box h={{ base: '170px', md: '180px' }} overflow="hidden" position="relative">
                <Image
                  src={category.image?.url || 'https://via.placeholder.com/500x500'}
                  alt={category.name}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                  transition="transform 0.5s ease"
                  _hover={{ transform: 'scale(1.08)' }}
                />
              </Box>
              <Box p={{ base: 4, md: 5 }}>
                <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold" noOfLines={1} mb={2}>
                  {category.name}
                </Text>
                <Text fontSize="sm" color={descriptionColor} noOfLines={2} mb={4}>
                  {category.description || 'Discover premium products and bestselling items.'}
                </Text>
                <Button
                  size="sm"
                  w="full"
                  borderRadius="full"
                  bgGradient="linear(to-r, purple.500, blue.500)"
                  color="white"
                  _hover={{ bgGradient: 'linear(to-r, purple.600, blue.600)' }}
                  onClick={() => handleCategoryClick(category)}
                >
                  Explore
                </Button>
              </Box>
            </MotionBox>
          ))}
        </Flex>
      </Box>
    </Box>
  );
});

export default CategorySection;