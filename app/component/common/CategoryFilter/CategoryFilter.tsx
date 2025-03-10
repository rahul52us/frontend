import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { useState } from 'react';

// Define a subtle bounce animation for active state
const bounce = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const categories = [
  { id: 1, name: 'Electronics', image: 'https://images.unsplash.com/photo-1610438250910-01cb769c1334?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', color: 'blue.500' },
  { id: 2, name: 'Fashion', image: 'https://images.unsplash.com/photo-1587467512961-120760940315?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', color: 'pink.500' },
  { id: 3, name: 'Home Decor', image: 'https://images.unsplash.com/photo-1615874694520-474822394e73?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', color: 'green.500' },
  { id: 4, name: 'Mobiles', image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', color: 'purple.500' },
  { id: 5, name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', color: 'red.500' },
  { id: 6, name: 'Sports', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', color: 'orange.500' },
  { id: 7, name: 'Books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', color: 'teal.500' },
  { id: 8, name: 'Toys', image: 'https://images.unsplash.com/photo-1556012018-50c5c0da73bf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', color: 'yellow.500' },
  { id: 9, name: 'Fitness', image: 'https://images.unsplash.com/photo-1655869443567-492f48ee8d77?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', color: 'cyan.500' },
];

const CategoryFilter = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setActiveCategory(category.id);
  };

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
        justify="space-between" // Spread items evenly
        maxW="1400px"
        mx="auto"
        gap={{ base: 2, md: 4 }} // Responsive gap
        css={{
          '&::-webkit-scrollbar': { height: '6px' }, // Slim scrollbar
          '&::-webkit-scrollbar-thumb': { bg: 'gray.300', borderRadius: 'full' },
        }}
      >
        {categories.map((category) => (
          <Box
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            cursor="pointer"
            flex="1" // Equal width for all items
            minW={{ base: '100px', md: '120px' }} // Minimum width
            maxW="150px" // Cap width for consistency
            borderRadius="lg"
            overflow="hidden"
            bg={activeCategory === category.id ? `${category.color}10` : 'gray.50'} // Light category color background
            border="2px solid"
            borderColor={activeCategory === category.id ? category.color : 'gray.200'}
            transition="all 0.3s ease"
            _hover={{
              bg: `${category.color}20`, // Slightly darker on hover
              transform: "scale(1.05)", // Subtle scale-up
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)", // Shadow on hover
            }}
            animation={activeCategory === category.id ? `${bounce} 1.5s infinite` : undefined}
            position="relative"
          >
            <Image
              src={category.image}
              alt={category.name}
              height={{ base: '60px', md: '80px' }} // Taller images
              width="100%"
              objectFit="cover"
              borderRadius="md"
              opacity={activeCategory === category.id ? 1 : 0.9}
              transition="opacity 0.3s ease"
              _hover={{ opacity: 1 }}
            />
            <Text
              py={2}
              fontSize={{ base: 'sm', md: 'md' }}
              fontWeight="bold"
              color={activeCategory === category.id ? category.color : 'gray.800'}
              textAlign="center"
              textTransform="capitalize"
              letterSpacing="0.5px"
            >
              {category.name}
            </Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default CategoryFilter;