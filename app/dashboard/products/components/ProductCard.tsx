"use client";

import React from "react";
import {
  Box,
  Flex,
  Text,
  Image,
  Badge,
  HStack,
  IconButton,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";

interface ProductCardProps {
  product: any;
  onEdit: any;
  onDelete: any;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const mutedText = useColorModeValue("gray.600", "gray.400");

  const inStock = product.stock > 0;
  const imageSrc =
    product.images?.[0] ||
    "https://via.placeholder.com/300x300?text=Product";

  return (
    <Box
      bg={cardBg}
      borderRadius="2xl"
      overflow="hidden"
      border="1px solid"
      borderColor={borderColor}
      boxShadow="sm"
      transition="all 0.25s ease"
      role="group"
      _hover={{
        transform: "translateY(-6px)",
        boxShadow: "xl",
        borderColor: "blue.300",
      }}
    >
      {/* ---------- IMAGE ---------- */}
      <Box position="relative" h="220px" bg="gray.100">
        <Image
          src={imageSrc}
          alt={product.name}
          w="100%"
          h="100%"
          objectFit="cover"
          transition="transform 0.3s ease"
          _groupHover={{ transform: "scale(1.05)" }}
        />

        {/* Stock Badge */}
        <Badge
          position="absolute"
          top={3}
          left={3}
          px={3}
          py={1}
          borderRadius="full"
          fontSize="xs"
          colorScheme={inStock ? "green" : "red"}
          boxShadow="sm"
        >
          {inStock ? `${product.stock} in stock` : "Out of stock"}
        </Badge>

        {/* Hover Actions */}
        <HStack
          position="absolute"
          top={3}
          right={3}
          spacing={2}
          opacity={0}
          _groupHover={{ opacity: 1 }}
          transition="opacity 0.2s ease"
        >
          <Tooltip label="Edit" hasArrow>
            <IconButton
              aria-label="Edit product"
              icon={<FaEdit />}
              size="sm"
              colorScheme="blue"
              variant="solid"
              onClick={() => onEdit(product)}
            />
          </Tooltip>
          <Tooltip label="Delete" hasArrow>
            <IconButton
              aria-label="Delete product"
              icon={<FaTrash />}
              size="sm"
              colorScheme="red"
              variant="solid"
              onClick={() => onDelete(product)}
            />
          </Tooltip>
        </HStack>
      </Box>

      {/* ---------- CONTENT ---------- */}
      <Box p={4}>
        {/* Name */}
        <Text
          fontWeight="semibold"
          fontSize="md"
          noOfLines={2}
          mb={1}
        >
          {product.name}
        </Text>

        {/* Price */}
        <Text
          fontSize="xl"
          fontWeight="bold"
          color="blue.600"
          mb={2}
        >
          ₹{Number(product.price).toLocaleString()}
        </Text>

        {/* Footer */}
        <Flex justify="space-between" align="center">
          <Badge
            variant="subtle"
            colorScheme="purple"
            fontSize="xs"
            px={2}
            py={1}
            borderRadius="md"
            textTransform="uppercase"
          >
            {product.category}
          </Badge>

          {product.brand && (
            <Text fontSize="xs" color={mutedText}>
              {product.brand}
            </Text>
          )}
        </Flex>


        {/* ---------- SUBCATEGORIES (limit to 3) ---------- */}
        {product.subCategories?.length > 0 && (() => {
          const maxShow = 3;
          const extraCount = product.subCategories.length - maxShow;

          return (
            <HStack spacing={1} mt={1}>
              {product.subCategories.slice(0, maxShow).map(sub => (
                <Badge
                  key={sub}
                  variant="outline"
                  colorScheme="teal"
                  fontSize="xx-small"
                  px={2}
                  py={0.5}
                  borderRadius="md"
                >
                  {sub}
                </Badge>
              ))}
              {extraCount > 0 && (
                <Badge variant="outline" fontSize="xx-small" px={2} py={0.5} borderRadius="md">
                  +{extraCount} more
                </Badge>
              )}
            </HStack>
          );
        })()}

      </Box>
    </Box>
  );
};

export default ProductCard;
