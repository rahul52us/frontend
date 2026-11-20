"use client";

import React, { memo } from "react";
import { Box, Grid, GridItem, Heading } from "@chakra-ui/react";

export interface SpecItem {
  label: string;
  value: string | string[];
}

interface ProductSpecsProps {
  specs: SpecItem[];
  title: string;
}

const ProductSpecs: React.FC<ProductSpecsProps> = memo(({ specs, title }) => {
  if (!specs || specs.length === 0) return null;

  return (
    <Box p={{ base: 4, md: 6 }} borderWidth={1} borderColor="gray.200" rounded="2xl" mt={4} bg="white">
      <Heading size="sm" fontWeight={800}>
        {title}
      </Heading>
      <Grid templateColumns="1fr 1.25fr" mt={4} gap={3}>
        {specs.map((item, index) => {
          const displayValue = Array.isArray(item.value)
            ? item.value.join(", ")
            : String(item.value ?? "");

          return (
            <React.Fragment key={`${item.label}-${index}`}>
              <GridItem fontSize="xs" color="gray.500" fontWeight={500}>
                {item.label}
              </GridItem>
              <GridItem fontWeight={600} color="gray.800" fontSize="xs">
                {displayValue}
              </GridItem>
            </React.Fragment>
          );
        })}
      </Grid>
    </Box>
  );
});

ProductSpecs.displayName = "ProductSpecs";

export default ProductSpecs;
