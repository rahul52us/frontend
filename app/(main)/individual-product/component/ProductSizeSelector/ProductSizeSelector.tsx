import { Box, Flex, Text } from '@chakra-ui/react';
import { useState } from 'react';

const ProductSizeSelector = ({ sizes }) => {
  const [selectedSize, setSelectedSize] = useState(sizes[0]);

  return (
    <Box mt={4}>
      Size: <Text as={'span'} fontWeight={600}>{selectedSize}</Text>
      <Flex mt={2} gap={2}>
        {sizes.map((size) => (
          <Box
            key={size}
            w={'90px'}
            h={"50px"}
            border={'1px solid'}
            borderColor={selectedSize === size ? 'black' : 'gray.200'}
            rounded={'lg'}
            cursor={'pointer'}
            onClick={() => setSelectedSize(size)}
          >
            <Flex align={'center'} justify={"center"} h={'100%'}>
              <Text fontWeight={700}>{size}</Text>
            </Flex>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default ProductSizeSelector;