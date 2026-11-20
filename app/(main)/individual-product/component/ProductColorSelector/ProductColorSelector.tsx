"use client";

import { Box, Flex, Image, Text } from "@chakra-ui/react";
import React, { memo, useCallback, useMemo, useState } from "react";

export interface ColorItemObject {
  name?: string;
  image?: string;
  label?: string;
  [key: string]: any;
}

export type ColorItem = string | ColorItemObject;

interface ProductColorSelectorProps {
  colors: ColorItem[];
  selectedColor?: any;
  onSelect?: (color: any) => void;
}

const getColorName = (color: ColorItem): string => {
  if (!color) return "";
  if (typeof color === "string") return color;
  return color.name || color.label || "";
};

const getColorImage = (color: ColorItem): string => {
  if (!color || typeof color === "string") return "";
  return color.image || color.file?.url || color.url || "";
};

// Memoized Single Color Swatch Item to prevent re-rendering all items when one is clicked
const ColorItemSwatch = memo(
  ({
    color,
    isSelected,
    onSelect,
  }: {
    color: ColorItem;
    isSelected: boolean;
    onSelect: (color: ColorItem) => void;
  }) => {
    const name = getColorName(color);
    const image = getColorImage(color);

    return (
      <Box
        minW="60px"
        maxW="80px"
        h="44px"
        px={2}
        py={1}
        border="2px solid"
        borderColor={isSelected ? "black" : "gray.200"}
        rounded="lg"
        cursor="pointer"
        onClick={() => onSelect(color)}
        _hover={{ borderColor: isSelected ? "black" : "gray.400" }}
        transition="border-color 0.2s"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {image ? (
          <Image
            w="full"
            h="full"
            objectFit="contain"
            src={image}
            alt={name}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <Text fontSize="xs" fontWeight={600} noOfLines={1}>
            {name}
          </Text>
        )}
      </Box>
    );
  }
);
ColorItemSwatch.displayName = "ColorItemSwatch";

const ProductColorSelector: React.FC<ProductColorSelectorProps> = memo(
  ({ colors, selectedColor: propSelectedColor, onSelect }) => {
    const [internalSelectedColor, setInternalSelectedColor] = useState(
      colors?.[0]
    );

    const isControlled =
      propSelectedColor !== undefined && onSelect !== undefined;
    const selectedColor = isControlled
      ? propSelectedColor
      : internalSelectedColor;

    const selectedName = useMemo(() => getColorName(selectedColor), [selectedColor]);

    const handleSelect = useCallback(
      (color: ColorItem) => {
        if (isControlled && onSelect) {
          onSelect(color);
        } else {
          setInternalSelectedColor(color);
        }
      },
      [isControlled, onSelect]
    );

    if (!colors || colors.length === 0) return null;

    return (
      <Box mt={3}>
        <Text fontSize="sm">
          Color:{" "}
          <Text as="span" fontWeight={700}>
            {selectedName}
          </Text>
        </Text>
        <Flex mt={2} gap={2} wrap="wrap">
          {colors.map((color, idx) => {
            const name = getColorName(color);
            return (
              <ColorItemSwatch
                key={`${name}-${idx}`}
                color={color}
                isSelected={selectedName === name}
                onSelect={handleSelect}
              />
            );
          })}
        </Flex>
      </Box>
    );
  }
);

ProductColorSelector.displayName = "ProductColorSelector";

export default ProductColorSelector;
