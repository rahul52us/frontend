"use client";

import {
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  Image,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { FaChartLine, FaEdit, FaFire, FaTrash } from "react-icons/fa";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";

interface ProductCardProps {
  product: any;
  onView: (product: any) => void;
  onEdit: (product: any) => void;
  onDelete: (product: any) => void;
}

const getProductImage = (product: any) =>
  product?.images?.[0]?.preview ||
  product?.images?.[0] ||
  "https://via.placeholder.com/600x600?text=Product";

const getCategoryName = (category: any) =>
  typeof category === "object" ? category?.name || "Uncategorized" : category || "Uncategorized";

const ProductCard: React.FC<ProductCardProps> = ({ product, onView, onEdit, onDelete }) => {
  const surface = useColorModeValue("white", dashboardPalette.surface);
  const surfaceMuted = useColorModeValue("#F8FAFC", dashboardPalette.surfaceAlt);
  const border = useColorModeValue("#E2E8F0", dashboardPalette.border);
  const text = useColorModeValue("#0F172A", dashboardPalette.text);
  const textMuted = useColorModeValue("#64748B", dashboardPalette.textMuted);
  const textSoft = useColorModeValue("#94A3B8", dashboardPalette.textSoft);
  const successSoft = useColorModeValue("rgba(34, 197, 94, 0.12)", dashboardPalette.successSoft);
  const success = useColorModeValue("#15803D", dashboardPalette.success);
  const warningSoft = useColorModeValue("rgba(234, 88, 12, 0.12)", dashboardPalette.warningSoft);
  const warning = useColorModeValue("#C2410C", dashboardPalette.warning);
  const dangerSoft = useColorModeValue("rgba(239, 68, 68, 0.12)", dashboardPalette.dangerSoft);
  const danger = useColorModeValue("#DC2626", dashboardPalette.danger);
  const accent = useColorModeValue("#2563EB", dashboardPalette.accentStrong);
  const accentSoft = useColorModeValue("rgba(37, 99, 235, 0.08)", dashboardPalette.accentSoft);
  const shadow = useColorModeValue("0 14px 28px rgba(37, 99, 235, 0.08)", "0 22px 42px rgba(2, 6, 23, 0.26)");
  const hoverShadow = useColorModeValue("0 20px 34px rgba(37, 99, 235, 0.12)", "0 28px 52px rgba(2, 6, 23, 0.34)");

  const imageSrc = getProductImage(product);
  const categoryName = getCategoryName(product?.category);
  const inStock = Number(product?.stock || 0) > 0;
  const lowStock = inStock && Number(product?.stock || 0) < 10;
  const isFeatured = Boolean(product?.isFeatured);

  return (
    <Box
      role="group"
      cursor="pointer"
      tabIndex={0}
      overflow="hidden"
      borderRadius={{ base: "18px", md: "22px" }}
      border="1px solid"
      borderColor={border}
      bg={surface}
      boxShadow={{ base: "none", md: shadow }}
      transition="transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease"
      onClick={() => onView(product)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onView(product);
        }
      }}
      _hover={{
        transform: { base: "none", md: "translateY(-2px)" },
        boxShadow: { base: "none", md: hoverShadow },
        // borderColor: { base: border, md: accent },
      }}
    >
      <Box position="relative" aspectRatio={0.96} overflow="hidden" bg={surfaceMuted}>
        <Image
          src={imageSrc}
          alt={product?.name || "Product image"}
          w="100%"
          h="100%"
          objectFit="cover"
          transition="transform 0.45s ease"
          _groupHover={{ transform: { base: "none", md: "scale(1.05)" } }}
        />

        {isFeatured ? (
          <HStack
            position="absolute"
            left={1.5}
            top={1.5}
            spacing={1}
            px={2}
            py={0.75}
            borderRadius="full"
            bg="rgba(255,255,255,0.92)"
            color={warning}
            backdropFilter="blur(10px)"
            fontSize="10px"
            fontWeight="700"
          >
            <Icon as={FaFire} boxSize={2.5} />
            <Text>Featured</Text>
          </HStack>
        ) : null}

        <Box
          position="absolute"
          right={1.5}
          top={1.5}
          px={2}
          py={0.75}
          borderRadius="full"
          fontSize="10px"
          fontWeight="700"
          backdropFilter="blur(10px)"
          bg={inStock ? (lowStock ? warningSoft : successSoft) : dangerSoft}
          color={inStock ? (lowStock ? warning : success) : danger}
        >
          {inStock ? `${product?.stock} left` : "Out"}
        </Box>

        <HStack
          position="absolute"
          // left={1.5}
          right={1.5}
          bottom={1.5}
          spacing={1.5}
          opacity={{ base: 1, md: 0 }}
          transform={{ base: "none", md: "translateY(6px)" }}
          transition="all 0.22s ease"
          _groupHover={{ opacity: 1, transform: "translateY(0)" }}
          display={{ base: "none", md: "flex" }}
        >
          <IconButton
            aria-label="Edit product"
            size="sm"
            // h="32px"
            borderRadius="full"
            color={text}
            fontSize="11px"
            fontWeight="700"
            // iconSpacing={1.5}
            icon={<FaEdit />}
            _hover={{ bg: "blue.50",color:"blue.500" }}
            onClick={(event) => {
              event.stopPropagation();
              onEdit(product);
            }}
          />
          <IconButton
            aria-label="Delete product"
            icon={<FaTrash />}
            size="sm"
            h="32px"
            w="32px"
            minW="32px"
            borderRadius="full"
            bg="rgba(255,255,255,0.94)"
            color={danger}
            _hover={{ bg: danger, color: "white" }}
            onClick={(event) => {
              event.stopPropagation();
              onDelete(product);
            }}
          />
        </HStack>
      </Box>

      <VStack align="stretch" spacing={0} p={{ base: 2.5, md: 3.5 }}>
        <Text
          fontSize="9px"
          fontWeight="700"
          textTransform="uppercase"
          letterSpacing="0.12em"
          color={textSoft}
        >
          {product?.brand || categoryName}
        </Text>

        <Text mt={1} fontSize={{ base: "13px", md: "sm" }} fontWeight="600" color={text} noOfLines={2} lineHeight="1.35">
          {product?.name || "Untitled product"}
        </Text>

        <HStack mt={{base:0.5,md:2}} justify="space-between" align="center" spacing={2}>
          <Text fontSize={{ base: "sm", md: "md" }} fontWeight="700" color={text}>
            Rs {Number(product?.price || 0).toLocaleString("en-IN")}
          </Text>

          {product?.discountPrice ? (
            <HStack spacing={1} color={success} fontSize="10px" fontWeight="700">
              <Icon as={FaChartLine} boxSize={2.5} />
              <Text>
                Save Rs{" "}
                {Math.max(Number(product?.price || 0) - Number(product?.discountPrice || 0), 0).toLocaleString(
                  "en-IN"
                )}
              </Text>
            </HStack>
          ) : (
            <Text fontSize="9px" color={textMuted} noOfLines={1}>
              {categoryName}
            </Text>
          )}
        </HStack>

        <HStack mt={2.5} spacing={1.5} display={{ base: "flex", md: "none" }}>
          <Button
            flex="1"
            h="30px"
            borderRadius="lg"
            bg={surfaceMuted}
            color={text}
            fontSize="11px"
            fontWeight="700"
            iconSpacing={1}
            leftIcon={<FaEdit />}
            _active={{ transform: "scale(0.98)" }}
            onClick={(event) => {
              event.stopPropagation();
              onEdit(product);
            }}
          >
            Edit
          </Button>
          <IconButton
            aria-label="Delete product"
            icon={<FaTrash />}
            h="30px"
            w="30px"
            minW="30px"
            borderRadius="lg"
            bg={dangerSoft}
            color={danger}
            _active={{ transform: "scale(0.96)" }}
            onClick={(event) => {
              event.stopPropagation();
              onDelete(product);
            }}
          />
        </HStack>

        {Array.isArray(product?.subCategories) && product.subCategories.length > 0 ? (
          <HStack mt={2.5} spacing={1.5} flexWrap="wrap">
            {product.subCategories.slice(0, 2).map((subCategory: any) => (
              <Box
                key={typeof subCategory === "object" ? subCategory?._id : subCategory}
                px={2}
                py={0.75}
                borderRadius="full"
                bg={accentSoft}
                color={accent}
                fontSize="9px"
                fontWeight="700"
              >
                {typeof subCategory === "object" ? subCategory?.name : subCategory}
              </Box>
            ))}
            {product.subCategories.length > 2 ? (
              <Box
                px={2}
                py={0.75}
                borderRadius="full"
                bg={surfaceMuted}
                color={textMuted}
                fontSize="9px"
                fontWeight="700"
              >
                +{product.subCategories.length - 2}
              </Box>
            ) : null}
          </HStack>
        ) : null}
      </VStack>
    </Box>
  );
};
export default ProductCard;
