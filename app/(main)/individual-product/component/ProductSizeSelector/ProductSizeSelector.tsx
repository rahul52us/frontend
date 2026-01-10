import { Box, Flex, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

const ProductSizeSelector = ({ sizes, selectedSize: propSelectedSize, onSelect }: any) => {
  const [internalSelectedSize, setInternalSelectedSize] = useState(sizes[0]);

  const isControlled = propSelectedSize !== undefined && onSelect !== undefined;
  const selectedSize = isControlled ? propSelectedSize : internalSelectedSize;

  const handleSelect = (size: string) => {
    if (isControlled) {
      onSelect(size);
    } else {
      setInternalSelectedSize(size);
    }
  };

  return (
    <Box mt={4}>
      Size: <Text as={'span'} fontWeight={600}>{selectedSize}</Text>
      <Flex mt={2} gap={2}>
        {sizes.map((size: string) => (
          <Box
            key={size}
            w={'90px'}
            h={"50px"}
            border={'1px solid'}
            borderColor={selectedSize === size ? 'black' : 'gray.200'}
            rounded={'lg'}
            cursor={'pointer'}
            onClick={() => handleSelect(size)}
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

export default observer(ProductSizeSelector);