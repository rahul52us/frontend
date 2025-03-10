import { Box, Grid, Image, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { useState } from 'react';

// Define a pulsing animation for active state cards
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.025); }
  100% { transform: scale(1); }
`;

const categories = [
  { id: 1, name: 'Electronics', image: 'https://images.unsplash.com/photo-1610438250910-01cb769c1334?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGVsZWN0cm9uaWMlMjBwcm9kdWN0fGVufDB8fDB8fHwyhttps://source.unsplash.com/featured/?electronics' },
  { id: 2, name: 'Fashion', image: 'https://images.unsplash.com/photo-1587467512961-120760940315?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZmFzaGlvbiUyMHByb2R1Y3R8ZW58MHx8MHx8fDI%3D' },
  { id: 3, name: 'Home Decor', image: 'https://images.unsplash.com/photo-1615874694520-474822394e73?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG9tZSUyMGRlY29yfGVufDB8fDB8fHwy' },
  { id: 3, name: 'Mobiles', image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bW9iaWxlfGVufDB8fDB8fHwy' },
  { id: 4, name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmVhdXR5JTIwcHJvZHVjdHxlbnwwfHwwfHx8Mg%3D%3D' },
  { id: 5, name: 'Sports', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3BvcnRzJTIwcHJvZHVjdHxlbnwwfHwwfHx8Mg%3D%3D' },
  { id: 6, name: 'Books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJvb2t8ZW58MHx8MHx8fDI%3D' },
  { id: 7, name: 'Toys', image: 'https://images.unsplash.com/photo-1556012018-50c5c0da73bf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHRveXN8ZW58MHx8MHx8fDI%3D' },
  { id: 8, name: 'Fitness', image: 'https://images.unsplash.com/photo-1655869443567-492f48ee8d77?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGZpdG5lc3MlMjBwcm9kdWN0fGVufDB8fDB8fHwy' },
];

const CategoryFilter = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setActiveCategory(category.id);
    console.log("Filtering by category:", category.name);
  };

  return (
    <Box
      as="section"
      p={2}
      maxW="95%"
      mx="auto"
    >
      <Grid
        templateColumns="repeat(auto-fit, minmax(100px, 1fr))"
        gap={8}
        justifyItems="center"
      >
        {categories.map((category) => (
          <Box 
            key={category.id} 
            onClick={() => handleCategoryClick(category)} 
            cursor="pointer"
            textAlign="center" // Ensure text and image are centered
          >
            <Box
              position="relative"
              borderRadius="full"
              overflow="hidden"
              boxSize="70px"
              border={activeCategory === category.id ? "3px solid" : "2px solid"}
              borderColor={activeCategory === category.id ? "yellow.400" : "gray.300"}
              _hover={{
                transform: "scale(1.1) rotate(5deg)",
                boxShadow: "lg",
              }}
              transition="transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease"
              animation={activeCategory === category.id ? `${pulse} 1.5s infinite` : undefined}
              mx="auto" // Center the image container horizontally
            >
              <Image
                src={category.image}
                alt={category.name}
                boxSize="70px"
                objectFit="cover"
                filter="grayscale(70%)"
                transition="filter 0.3s ease"
                _hover={{ filter: "grayscale(0%)" }}
              />
              <Box
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                // bgGradient="radial(orange.300, transparent)"
                opacity="0"
                _hover={{ opacity: 0.4 }}
                transition="opacity 0.3s ease"
              />
            </Box>
            <Text
              mt={2}
              fontSize="2xs"
              fontWeight="semibold"
              color="gray.700"
              textTransform="uppercase"
              textAlign="center" // Ensure text is centered
            >
              {category.name}
            </Text>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default CategoryFilter;