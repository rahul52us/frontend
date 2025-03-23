import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { useState } from 'react';

const ProductColorSelector = ({ colors }) => {
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  return (
    <Box>
      Color: <Text as={'span'} fontWeight={600}>{selectedColor.name}</Text>
      <Flex mt={2} gap={2}>
        {colors.map((color) => (
          <Box
            key={color.name}
            w={'90px'}
            h={"60px"}
            p={1}
            border={'2px solid'}
            borderColor={selectedColor.name === color.name ? 'black' : 'gray.200'}
            rounded={'lg'}
            cursor={'pointer'}
            onClick={() => setSelectedColor(color)}
          >
            <Image objectFit={'contain'} src={color.image} alt={color.name} />
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default ProductColorSelector;