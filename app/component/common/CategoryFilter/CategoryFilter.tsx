'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Skeleton,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiArrowRight, FiArrowUpRight, FiGrid } from 'react-icons/fi';
import categoryStore from '../../../store/categoryStore/categoryStore';

const MotionBox = motion(Box);

const CategorySection = observer(() => {
  const router = useRouter();
  const { categories, loading } = categoryStore;
  const scrollRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Hoisted color mode values (fixes React Rules of Hooks violations)
  const sectionBg = useColorModeValue('white', 'gray.900');
  const cardBg = useColorModeValue('gray.50', 'gray.800');
  const cardHoverBg = useColorModeValue('white', 'gray.750');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const hoverBorderColor = useColorModeValue('blue.200', 'blue.500');
  const titleColor = useColorModeValue('gray.900', 'white');
  const subTextColor = useColorModeValue('gray.500', 'gray.400');
  const imageBg = useColorModeValue('white', 'gray.700');
  const skeletonStart = useColorModeValue('gray.100', 'gray.800');
  const skeletonEnd = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    categoryStore.getAllCategories({ isActive: true, isFeatured: true });
  }, []);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, categories.length]);

  const handleCategoryClick = useCallback(
    (category: any) => {
      const slug = category.slug || category.name?.toLowerCase() || '';
      router.push(`/categories?slug=${encodeURIComponent(slug)}`);
    },
    [router]
  );

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -340 : 340;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const isLoading = loading && categories.length === 0;

  if (isLoading) {
    return (
      <Box bg={sectionBg} py={{ base: 5, md: 8 }} borderBottom="1px solid" borderColor={borderColor}>
          <Flex justify="space-between" align="center" mb={4}>
            <Box>
              <Skeleton h="14px" w="110px" mb={2} rounded="md" startColor={skeletonStart} endColor={skeletonEnd} />
              <Skeleton h="24px" w="200px" rounded="md" startColor={skeletonStart} endColor={skeletonEnd} />
            </Box>
            <Skeleton h="32px" w="90px" rounded="full" startColor={skeletonStart} endColor={skeletonEnd} />
          </Flex>

          <Flex gap={{ base: 2.5, md: 4 }} overflow="hidden">
            {[...Array(7)].map((_, i) => (
              <Skeleton
                key={i}
                w={{ base: '115px', sm: '140px', md: '170px' }}
                h={{ base: '150px', sm: '175px', md: '205px' }}
                borderRadius="2xl"
                flexShrink={0}
                startColor={skeletonStart}
                endColor={skeletonEnd}
              />
            ))}
          </Flex>
      </Box>
    );
  }

  if (!categories.length) return null;

  return (
    <Box
      as="section"
      bg={sectionBg}
      py={{ base: 5, md: 8 }}
      borderBottom="1px solid"
      borderColor={borderColor}
    >
        {/* Compact Section Header */}
        <Flex
          justify="space-between"
          align="flex-end"
          mb={{ base: 3.5, md: 5 }}
          gap={4}
        >
          <Box>
            <HStack spacing={1.5} mb={1}>
              <Icon as={FiGrid} color="var(--color-primary)" boxSize={3.5} />
              <Text
                fontSize="11px"
                fontWeight="700"
                textTransform="uppercase"
                letterSpacing="wider"
                color="var(--color-primary)"
              >
                Categories
              </Text>
            </HStack>
            <Heading
              as="h2"
              fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }}
              fontWeight="800"
              color={titleColor}
              letterSpacing="tight"
              lineHeight="1.2"
            >
              Shop by Category
            </Heading>
          </Box>

          {/* Right Controls: View All + Desktop Scroll Arrows */}
          <HStack spacing={2} flexShrink={0}>
            <Button
              size="xs"
              h={{ base: '30px', md: '34px' }}
              px={3.5}
              rounded="full"
              variant="ghost"
              colorScheme="brand"
              fontWeight="600"
              rightIcon={<FiArrowRight />}
              onClick={() => router.push('/categories')}
            >
              View All
            </Button>

            <HStack spacing={1.5} display={{ base: 'none', md: 'flex' }}>
              <IconButton
                aria-label="Scroll categories left"
                icon={<ChevronLeftIcon boxSize={5} />}
                onClick={() => scroll('left')}
                isDisabled={!canScrollLeft}
                size="sm"
                h="34px"
                w="34px"
                rounded="full"
                variant="outline"
                borderColor={borderColor}
                color={titleColor}
                _hover={{ bg: 'gray.50', borderColor: 'gray.300' }}
                _disabled={{ opacity: 0.35, cursor: 'not-allowed' }}
              />
              <IconButton
                aria-label="Scroll categories right"
                icon={<ChevronRightIcon boxSize={5} />}
                onClick={() => scroll('right')}
                isDisabled={!canScrollRight}
                size="sm"
                h="34px"
                w="34px"
                rounded="full"
                variant="outline"
                borderColor={borderColor}
                color={titleColor}
                _hover={{ bg: 'gray.50', borderColor: 'gray.300' }}
                _disabled={{ opacity: 0.35, cursor: 'not-allowed' }}
              />
            </HStack>
          </HStack>
        </Flex>

        {/* Horizontal Category Rail */}
        <Box position="relative">
          <Flex
            ref={scrollRef}
            gap={{ base: 2.5, sm: 3.5, md: 4 }}
            overflowX="auto"
            py={1}
            px={0.5}
            sx={{
              scrollSnapType: 'x mandatory',
              '& > *': { scrollSnapAlign: 'start' },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {categories.map((category: any, index: number) => {
              const imageUrl =
                category.image?.url ||
                `https://picsum.photos/seed/${category._id || index}/300/300`;
              const productCount = category.productCount;

              return (
                <MotionBox
                  key={category._id || index}
                  as="button"
                  onClick={() => handleCategoryClick(category)}
                  w={{ base: '112px', sm: '136px', md: '168px' }}
                  flexShrink={0}
                  // bg={cardBg}
                  // border="1px solid"
                  borderColor={borderColor}
                  rounded={{ base: 'xl', md: '2xl' }}
                  p={{ base: 2, md: 2.5 }}
                  textAlign="left"
                  position="relative"
                  role="group"
                  animation="all 0.2s ease"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  _hover={{
                    bg: cardHoverBg,
                    borderColor: hoverBorderColor,
                    boxShadow: '0 10px 25px -8px rgba(37, 99, 235, 0.14)',
                  }}
                >
                  {/* Image Container */}
                  <Box
                    w="full"
                    h={{ base: '92px', sm: '100px', md: '120px' }}
                    rounded={{ base: 'lg', md: '3xl' }}
                    overflow="hidden"
                    bg={imageBg}
                    position="relative"
                    mb={{ base: 2, md: 2.5 }}
                  >
                    <Image
                      src={imageUrl}
                      alt={category.name}
                      w="full"
                      h="full"
                      objectFit="cover"
                      loading="lazy"
                      transition="transform 0.35s ease"
                      _groupHover={{ transform: 'scale(1.07)' }}
                    />

                    {/* Subtle Item Count Pill (Only shown if real count exists) */}
                    {typeof productCount === 'number' && productCount > 0 && (
                      <Badge
                        position="absolute"
                        top={1.5}
                        right={1.5}
                        bg="blackAlpha.700"
                        color="white"
                        backdropFilter="blur(4px)"
                        rounded="full"
                        px={2}
                        py={0.5}
                        fontSize="9px"
                        fontWeight="600"
                      >
                        {productCount}+
                      </Badge>
                    )}
                  </Box>

                  {/* Category Name & Subtle Action Icon */}
                  <HStack justify="space-between" align="center" spacing={1} px={0.5}>
                    <Box minW={0} flex="1">
                      <Text
                        fontSize={{ base: 'xs', md: 'sm' }}
                        fontWeight="700"
                        color={titleColor}
                        noOfLines={1}
                        lineHeight="1.2"
                        _groupHover={{ color: 'var(--color-primary)' }}
                        transition="color 0.15s ease"
                      >
                        {category.name}
                      </Text>

                      {/* <Text
                        display={{ base: 'none', md: 'block' }}
                        fontSize="11px"
                        color={subTextColor}
                        noOfLines={1}
                        mt={0.5}
                      >
                        {category.description || 'Explore collection'}
                      </Text> */}
                    </Box>

                    <Flex
                      display={{ base: 'none', sm: 'flex' }}
                      w="22px"
                      h="22px"
                      rounded="full"
                      bg="white"
                      color="gray.400"
                      align="center"
                      justify="center"
                      flexShrink={0}
                      boxShadow="2xs"
                      transition="all 0.2s ease"
                      _groupHover={{
                        bg: 'var(--color-primary)',
                        color: 'white',
                        transform: 'translate(1px, -1px)',
                      }}
                    >
                      <Icon as={FiArrowUpRight} boxSize={3} />
                    </Flex>
                  </HStack>
                </MotionBox>
              );
            })}

            {/* End Card: Browse All Categories */}
            <Flex
              as="button"
              onClick={() => router.push('/categories')}
              w={{ base: '105px', sm: '130px', md: '155px' }}
              flexShrink={0}
              bgGradient="linear(to-br, blue.50, purple.50)"
              border="1px dashed"
              borderColor="var(--color-border)"
              rounded={{ base: 'xl', md: '2xl' }}
              p={3}
              direction="column"
              align="center"
              justify="center"
              gap={2}
              role="group"
              transition="all 0.2s ease"
              _hover={{
                borderColor: 'blue.400',
                bgGradient: 'linear(to-br, blue.100, purple.100)',
              }}
            >
              <Flex
                w={{ base: '36px', md: '44px' }}
                h={{ base: '36px', md: '44px' }}
                rounded="full"
                bg="white"
                color="var(--color-primary)"
                align="center"
                justify="center"
                boxShadow="xs"
                transition="transform 0.2s ease"
                _groupHover={{ transform: 'scale(1.1)' }}
              >
                <Icon as={FiArrowRight} boxSize={{ base: 4, md: 5 }} />
              </Flex>
              <VStack spacing={0}>
                <Text fontSize="xs" fontWeight="700" color="var(--color-primary)">
                  See All
                </Text>
                <Text fontSize="10px" color="var(--color-primary)" fontWeight="500">
                  {categories.length}+ Categories
                </Text>
              </VStack>
            </Flex>
          </Flex>
        </Box>
    </Box>
  );
});

export default CategorySection;