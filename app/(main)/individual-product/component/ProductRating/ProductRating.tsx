"use client";

import { Flex, Tag, TagLeftIcon, Text } from "@chakra-ui/react";
import React, { memo } from "react";
import { FiStar } from "react-icons/fi";

interface ProductRatingProps {
  rating: number | string;
  reviews: number | string;
}

const ProductRating: React.FC<ProductRatingProps> = memo(({ rating, reviews }) => {
  return (
    <Flex align="center" gap={2} my={2}>
      <Tag colorScheme="green" variant="solid" size="sm" borderRadius="md" px={2} py={0.5}>
        <TagLeftIcon as={FiStar} boxSize={3} mr={1} />
        {rating}
      </Tag>
      <Text fontSize="xs" color="gray.500" fontWeight={500}>
        ({reviews} reviews)
      </Text>
    </Flex>
  );
});

ProductRating.displayName = "ProductRating";

export default ProductRating;
