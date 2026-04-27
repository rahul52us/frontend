"use client";

import React from "react";
import {
  Badge,
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";

interface ProductCardProps {
  product: any;
  onEdit: any;
  onDelete: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  const inStock = product.stock > 0;
  const imageSrc =
    product.images?.[0]?.preview ||
    product.images?.[0] ||
    "https://via.placeholder.com/300x300?text=Product";

  return (
    <Box
      bg={dashboardPalette.surface}
      borderRadius="24px"
      overflow="hidden"
      border="1px solid"
      borderColor={dashboardPalette.border}
      boxShadow="0 18px 42px rgba(0, 0, 0, 0.20)"
      transition="all 0.25s ease"
      role="group"
      _hover={{
        transform: "translateY(-6px)",
        boxShadow: "0 26px 56px rgba(0, 0, 0, 0.28)",
        borderColor: dashboardPalette.accent,
      }}
    >
      <Box position="relative" h="220px" bg={dashboardPalette.surfaceSoft}>
        <Image
          src={imageSrc}
          alt={product.name}
          w="100%"
          h="100%"
          objectFit="cover"
          transition="transform 0.3s ease"
          _groupHover={{ transform: "scale(1.05)" }}
        />

        <Badge
          position="absolute"
          top={3}
          left={3}
          px={3}
          py={1}
          borderRadius="full"
          fontSize="xs"
          bg={inStock ? "rgba(70, 201, 139, 0.14)" : "rgba(239, 107, 107, 0.14)"}
          color={inStock ? dashboardPalette.success : dashboardPalette.danger}
          border="1px solid"
          borderColor={inStock ? "rgba(70, 201, 139, 0.24)" : "rgba(239, 107, 107, 0.24)"}
        >
          {inStock ? `${product.stock} in stock` : "Out of stock"}
        </Badge>

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
              bg={dashboardPalette.accentSoft}
              color={dashboardPalette.accentStrong}
              border="1px solid"
              borderColor={dashboardPalette.border}
              _hover={{ bg: dashboardPalette.accent, color: dashboardPalette.page }}
              onClick={() => onEdit(product)}
            />
          </Tooltip>
          <Tooltip label="Delete" hasArrow>
            <IconButton
              aria-label="Delete product"
              icon={<FaTrash />}
              size="sm"
              bg="rgba(239, 107, 107, 0.12)"
              color={dashboardPalette.danger}
              border="1px solid"
              borderColor="rgba(239, 107, 107, 0.24)"
              _hover={{ bg: "rgba(239, 107, 107, 0.20)" }}
              onClick={() => onDelete(product)}
            />
          </Tooltip>
        </HStack>
      </Box>

      <Box p={4}>
        <Text fontWeight="600" fontSize="md" color={dashboardPalette.text} noOfLines={2} mb={1}>
          {product.name}
        </Text>

        <Text fontSize="xl" fontWeight="700" color={dashboardPalette.accentStrong} mb={2}>
          Rs {Number(product.price).toLocaleString()}
        </Text>

        <Flex justify="space-between" align="center" gap={3}>
          <Badge
            bg={dashboardPalette.accentSoft}
            color={dashboardPalette.accentStrong}
            fontSize="xs"
            px={2.5}
            py={1}
            borderRadius="md"
            textTransform="uppercase"
          >
            {typeof product.category === "object" ? product.category.name : product.category}
          </Badge>

          {product.brand ? (
            <Text fontSize="xs" color={dashboardPalette.textSoft}>
              {product.brand}
            </Text>
          ) : null}
        </Flex>

        {product.subCategories?.length > 0
          ? (() => {
              const maxShow = 3;
              const extraCount = product.subCategories.length - maxShow;

              return (
                <HStack spacing={1} mt={3} flexWrap="wrap">
                  {product.subCategories.slice(0, maxShow).map((sub: any) => (
                    <Badge
                      key={typeof sub === "object" ? sub._id : sub}
                      variant="outline"
                      color={dashboardPalette.textMuted}
                      borderColor={dashboardPalette.borderStrong}
                      fontSize="xx-small"
                      px={2}
                      py={0.5}
                      borderRadius="md"
                    >
                      {typeof sub === "object" ? sub.name : sub}
                    </Badge>
                  ))}
                  {extraCount > 0 ? (
                    <Badge
                      variant="outline"
                      color={dashboardPalette.textSoft}
                      borderColor={dashboardPalette.borderStrong}
                      fontSize="xx-small"
                      px={2}
                      py={0.5}
                      borderRadius="md"
                    >
                      +{extraCount} more
                    </Badge>
                  ) : null}
                </HStack>
              );
            })()
          : null}
      </Box>
    </Box>
  );
};

export default ProductCard;
