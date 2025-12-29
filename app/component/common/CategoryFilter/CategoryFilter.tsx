import React, { useState } from 'react';
import { Box, Flex, Image, Text, Center, VStack, Circle, BoxProps } from '@chakra-ui/react';

interface Category {
  id: number;
  name: string;
  image: string;
  color: string;
}

const categories: Category[] = [
  { id: 1, name: 'Electronics', image: 'https://images.unsplash.com/photo-1610438250910-01cb769c1334?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', color: 'blue.400' },
  { id: 2, name: 'Fashion', image: 'https://images.unsplash.com/photo-1587467512961-120760940315?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', color: 'pink.400' },
  { id: 3, name: 'Home Decor', image: 'https://images.unsplash.com/photo-1615874694520-474822394e73?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', color: 'green.400' },
  { id: 4, name: 'Mobiles', image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', color: 'purple.400' },
  { id: 5, name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', color: 'red.400' },
  { id: 6, name: 'Sports', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', color: 'orange.400' },
  { id: 7, name: 'Books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', color: 'teal.400' },
  { id: 8, name: 'Toys', image: 'https://images.unsplash.com/photo-1556012018-50c5c0da73bf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', color: 'yellow.500' },
  { id: 9, name: 'Fitness', image: 'https://images.unsplash.com/photo-1655869443567-492f48ee8d77?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', color: 'cyan.400' },
];

const CategoryFilter: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  return (
    <Box
      as="nav"
      py={8}
      px={{ base: 4, md: 10 }}
      bg="white"
      overflowX="auto"
      sx={{
        '&::-webkit-scrollbar': { display: 'none' },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
    >
      <Flex
        maxW="1400px"
        mx="auto"
        gap={{ base: 8, md: 12 }}
        justifyContent={{ base: 'flex-start', md: 'center' }}
        alignItems="flex-end" // Aligns text and icons beautifully
      >
        {categories.map((category) => {
          const isActive = activeCategory === category.id;

          return (
            <VStack
              key={category.id}
              spacing={4}
              onClick={() => setActiveCategory(category.id)}
              cursor="pointer"
              role="group"
              flexShrink={0}
              position="relative"
              transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              _hover={{ transform: 'translateY(-5px)' }}
              _active={{ transform: 'scale(0.9)' }}
            >
              {/* Outer Decorative Ring */}
              <Box position="relative">
                <Circle
                  size={{ base: '70px', md: '85px' }}
                  p="3px"
                  bg={isActive ? category.color : 'transparent'}
                  border={isActive ? 'none' : '2px solid'}
                  borderColor="gray.100"
                  transition="all 0.3s ease"
                  _groupHover={{ borderColor: category.color, transform: 'rotate(15deg)' }}
                >
                  <Circle size="100%" bg="white" p="2px">
                    <Box
                      w="100%"
                      h="100%"
                      borderRadius="full"
                      overflow="hidden"
                      bg="gray.50"
                    >
                      <Image
                        src={category.image}
                        alt={category.name}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        transition="all 0.5s ease"
                        filter={isActive ? 'none' : 'grayscale(60%)'}
                        _groupHover={{ filter: 'none', transform: 'scale(1.15) rotate(-15deg)' }}
                      />
                    </Box>
                  </Circle>
                </Circle>

                {/* Lovable Floating Label (Only visible when active) */}
                {isActive && (
                  <Box
                    position="absolute"
                    top="-12px"
                    left="50%"
                    transform="translateX(-50%)"
                    bg={category.color}
                    color="white"
                    px={2}
                    py={0.5}
                    borderRadius="full"
                    fontSize="9px"
                    fontWeight="bold"
                    boxShadow="0 4px 10px rgba(0,0,0,0.1)"
                    whiteSpace="nowrap"
                  >
                    SELECTED
                  </Box>
                )}
              </Box>

              {/* Text with soft transition */}
              <VStack spacing={1}>
                <Text
                  fontSize="xs"
                  fontWeight={isActive ? "800" : "700"}
                  color={isActive ? "gray.800" : "gray.400"}
                  textTransform="uppercase"
                  letterSpacing="1px"
                  transition="all 0.2s ease"
                >
                  {category.name}
                </Text>
                
                {/* The "Blob" Indicator */}
                <Box
                  h="6px"
                  w={isActive ? "6px" : "0px"}
                  bg={category.color}
                  borderRadius="full"
                  transition="all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
                />
              </VStack>
            </VStack>
          );
        })}
      </Flex>
    </Box>
  );
};

export default CategoryFilter;