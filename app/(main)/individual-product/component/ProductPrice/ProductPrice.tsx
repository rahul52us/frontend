"use client";

import { Stat, StatHelpText, StatNumber, Text } from "@chakra-ui/react";
import React, { memo } from "react";

interface ProductPriceProps {
  price: number | string;
  discount?: number | string;
  mrp?: number | string;
}

const ProductPrice: React.FC<ProductPriceProps> = memo(
  ({ price, discount, mrp }) => {
    return (
      <Stat mt={4}>
        <StatNumber fontSize="28px" fontWeight="800">
          ₹{price}{" "}
          {discount && (
            <Text as="span" color="green.600" fontSize="sm" fontWeight="700">
              {discount}% off
            </Text>
          )}
        </StatNumber>
        {mrp && (
          <StatHelpText fontSize="sm" color="gray.600" mb={0}>
            MRP{" "}
            <Text as="span" textDecoration="line-through" color="gray.500">
              ₹{mrp}
            </Text>{" "}
            (incl. of all taxes)
          </StatHelpText>
        )}
      </Stat>
    );
  }
);

ProductPrice.displayName = "ProductPrice";

export default ProductPrice;
