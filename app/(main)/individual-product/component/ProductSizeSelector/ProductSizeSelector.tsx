"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import React, { memo, useCallback, useState } from "react";

interface ProductSizeSelectorProps {
  sizes: string[];
  selectedSize?: string;
  onSelect?: (size: string) => void;
}

// Memoized Individual Size Button to prevent re-rendering the whole row
const SizeButton = memo(
  ({
    size,
    isSelected,
    onSelect,
  }: {
    size: string;
    isSelected: boolean;
    onSelect: (size: string) => void;
  }) => {
    return (
      <Box
        w="64px"
        h="44px"
        border="1.5px solid"
        borderColor={isSelected ? "black" : "gray.200"}
        rounded="lg"
        cursor="pointer"
        onClick={() => onSelect(size)}
        _hover={{ borderColor: isSelected ? "black" : "gray.400" }}
        transition="border-color 0.2s"
      >
        <Flex align="center" justify="center" h="100%">
          <Text fontWeight={700} fontSize="sm">
            {size}
          </Text>
        </Flex>
      </Box>
    );
  }
);
SizeButton.displayName = "SizeButton";

const ProductSizeSelector: React.FC<ProductSizeSelectorProps> = memo(
  ({ sizes, selectedSize: propSelectedSize, onSelect }) => {
    const [internalSelectedSize, setInternalSelectedSize] = useState(sizes?.[0]);

    const isControlled = propSelectedSize !== undefined && onSelect !== undefined;
    const selectedSize = isControlled ? propSelectedSize : internalSelectedSize;

    const handleSelect = useCallback(
      (size: string) => {
        if (isControlled && onSelect) {
          onSelect(size);
        } else {
          setInternalSelectedSize(size);
        }
      },
      [isControlled, onSelect]
    );

    if (!sizes || sizes.length === 0) return null;

    return (
      <Box mt={4}>
        <Text fontSize="sm">
          Size:{" "}
          <Text as="span" fontWeight={700}>
            {selectedSize}
          </Text>
        </Text>
        <Flex mt={2} gap={2} wrap="wrap">
          {sizes.map((size) => (
            <SizeButton
              key={size}
              size={size}
              isSelected={selectedSize === size}
              onSelect={handleSelect}
            />
          ))}
        </Flex>
      </Box>
    );
  }
);

ProductSizeSelector.displayName = "ProductSizeSelector";

export default ProductSizeSelector;
