import { Stat, StatHelpText, StatNumber, Text } from '@chakra-ui/react';

const ProductPrice = ({ price, discount, mrp }) => {
  return (
    <Stat mt={4}>
      <StatNumber fontSize="32px">
        {price}{" "}
        <Text as="span" color="green.600" fontSize="sm" fontWeight="medium">
          {discount}% off
        </Text>
      </StatNumber>
      <StatHelpText fontSize="sm" color="gray.600">
        MRP{" "}
        <Text as="span" textDecoration="line-through" color="gray.500">
          {mrp}
        </Text>{" "}
        (incl. of all taxes)
      </StatHelpText>
    </Stat>
  );
};

export default ProductPrice;