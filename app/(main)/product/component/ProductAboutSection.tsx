"use client";

import { Box, Divider, Flex, Heading, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React, { memo, useMemo } from 'react';

interface ProductAboutSectionProps {
  product: any;
}

const ProductAboutSection = memo(
  observer(({ product }: ProductAboutSectionProps) => {
    const { productDetails, information, description } = product || {};

    const labelColor = useColorModeValue('gray.500', 'gray.400');
    const valueColor = useColorModeValue('gray.800', 'gray.200');
    const dividerColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const altRowBg = useColorModeValue('gray.50', 'whiteAlpha.50');

    // Memoize specs filtering
    const dynamicSpecs = useMemo(() => {
      return [
        ...Object.entries(productDetails || {}),
        ...Object.entries(information || {}),
      ].filter(
        ([key, value]) =>
          key !== 'color' && key !== 'size' && key !== 'ssd' && Boolean(value)
      );
    }, [productDetails, information]);

    if (!description && dynamicSpecs.length === 0) return null;

    return (
      <VStack spacing={{ md: 4, lg: 12 }} align="stretch" mt={{ lg: 8 }}>
        <Divider borderColor={dividerColor} />

        <Flex direction={{ base: "column", lg: "row" }} gap={{ base: 6, lg: 16 }}>
          {/* Description Column */}
          {description && (
            <Box flex="1.5">
              <Heading fontSize="xl" fontWeight="800" mb={4} letterSpacing="-0.02em">
                About this item
              </Heading>
              <Text color={textColor} fontSize="md" lineHeight="1.8" whiteSpace="pre-line">
                {description}
              </Text>
            </Box>
          )}

          {/* Specifications Column */}
          {dynamicSpecs.length > 0 && (
            <Box flex="1">
              <Heading fontSize="xl" fontWeight="800" mb={4} letterSpacing="-0.02em">
                Specifications
              </Heading>
              <Box
                borderWidth="1px"
                borderColor={dividerColor}
                rounded="2xl"
                overflow="hidden"
              >
                {dynamicSpecs.map(([key, value], idx) => (
                  <Flex
                    key={key}
                    borderBottom={idx === dynamicSpecs.length - 1 ? "none" : "1px solid"}
                    borderColor={dividerColor}
                    bg={idx % 2 === 0 ? altRowBg : "transparent"}
                    p={3.5}
                    align="center"
                  >
                    <Text
                      flex="1"
                      fontSize="xs"
                      color={labelColor}
                      fontWeight="semibold"
                      textTransform="capitalize"
                    >
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Text>
                    <Text
                      flex="1.2"
                      fontSize="xs"
                      color={valueColor}
                      fontWeight="bold"
                    >
                      {typeof value === 'object'
                        ? (Array.isArray(value) ? value.join(', ') : JSON.stringify(value))
                        : String(value)}
                    </Text>
                  </Flex>
                ))}
              </Box>
            </Box>
          )}
        </Flex>
      </VStack>
    );
  })
);

ProductAboutSection.displayName = "ProductAboutSection";

export default ProductAboutSection;
