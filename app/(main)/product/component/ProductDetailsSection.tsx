"use client";

import {
    AlertIcon,
  Badge,
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { FiCheckCircle, FiPackage } from "react-icons/fi";
import ProductColorSelector from "../../individual-product/component/ProductColorSelector/ProductColorSelector";
import ProductPrice from "../../individual-product/component/ProductPrice/ProductPrice";
import ProductRating from "../../individual-product/component/ProductRating/ProductRating";
import ProductSizeSelector from "../../individual-product/component/ProductSizeSelector/ProductSizeSelector";
import ReturnExchange from "../../individual-product/component/ReturnExchange/ReturnExchange";

interface Product {
  name?: string;
  title?: string;
  category?: any;
  price?: number | string;
  sellingPrice?: number | string;
  originalPrice?: number | string;
  mrp?: number | string;
  compareAtPrice?: number | string;
  rating?: number;
  reviews?: number;
  numReviews?: number;
  description?: string;
  brand?: string;
  productDetails?: Record<string, any>;
  information?: Record<string, any>;
  stock?: number;
  sku?: string;
  weight?: string;
  image?: string;
  images?: string[];
  _id?: string;
}

const MotionBox = motion(Box);

const ProductDetailsSection = observer(({ product }: { product: Product }) => {
  const {
    name,
    title,
    category,
    price,
    sellingPrice,
    originalPrice,
    mrp: rawMrp,
    compareAtPrice,
    rating = 4.5,
    reviews,
    numReviews,
    brand,
    productDetails,
    information,
    stock,
    sku,
    weight,
  } = product || {};

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Hoisted Theme Tokens
  const dividerColor = useColorModeValue("gray.100", "gray.700");
  const brandColor = useColorModeValue("blue.600", "blue.400");
  const titleColor = useColorModeValue("gray.900", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");

  const productName = name || title || "Product Title";
  const currentPrice = Number(price ?? sellingPrice ?? 0);
  const explicitMrp = Number(originalPrice ?? rawMrp ?? compareAtPrice ?? 0);
  const mrp = explicitMrp > currentPrice ? explicitMrp : currentPrice;
  const discount =
    mrp > currentPrice
      ? Math.round(((mrp - currentPrice) / mrp) * 100)
      : 0;

  const totalReviewsCount = Number(reviews ?? numReviews ?? 128);

  // Category resolution
  const categoryName =
    typeof category === "object"
      ? category?.name
      : category || "General";

  // Dynamic specs extraction
  const dynamicSpecs = [
    ...Object.entries(productDetails || {}),
    ...Object.entries(information || {}),
  ].filter(
    ([key, value]) =>
      !["color", "size", "ssd"].includes(key.toLowerCase()) && Boolean(value)
  );

  const colors = productDetails?.color ? [productDetails.color] : [];
  const sizes = productDetails?.size
    ? [productDetails.size]
    : productDetails?.ssd
    ? [productDetails.ssd]
    : [];

  const services = [
    { label: "7 Days Replacement", icon: "return" },
    { label: "Cash on Delivery Available", icon: "cod" },
  ];

  const inStock = stock === undefined || stock > 0;
  const isLowStock = typeof stock === "number" && stock > 0 && stock <= 5;

  return (
    <VStack
      spacing={3.5}
      align="stretch"
      as={motion.div}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      animation={{ duration: 0.3 }}
    >
      {/* Brand & Title Header */}
      <Box>
        <HStack spacing={2} mb={1}>
          <Text
            fontSize="10px"
            fontWeight="800"
            color={brandColor}
            textTransform="uppercase"
            letterSpacing="wider"
          >
            {brand || categoryName}
          </Text>
          {sku && (
            <Text fontSize="10px" color={mutedText}>
              • SKU: {sku}
            </Text>
          )}
        </HStack>

        <Heading
          as="h1"
          fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
          fontWeight="800"
          color={titleColor}
          lineHeight="1.25"
          mb={2}
          letterSpacing="-0.01em"
        >
          {productName}
        </Heading>

        {/* Rating & Stock Status Row */}
        <Flex align="center" justify="space-between" wrap="wrap" gap={2} mb={3}>
          <ProductRating rating={rating} reviews={totalReviewsCount} />

          <HStack spacing={1.5}>
            {inStock ? (
              <>
                <Icon
                  as={FiCheckCircle}
                  color={isLowStock ? "orange.500" : "green.500"}
                  boxSize={3.5}
                />
                <Text
                  fontSize="xs"
                  color={isLowStock ? "orange.600" : "green.600"}
                  fontWeight="700"
                >
                  {isLowStock ? `Only ${stock} left in stock!` : "In Stock"}
                </Text>
              </>
            ) : (
              <>
                <Icon as={AlertIcon} color="red.500" boxSize={3.5} />
                <Text fontSize="xs" color="red.600" fontWeight="700">
                  Out of Stock
                </Text>
              </>
            )}
          </HStack>
        </Flex>

        {/* Real Price Display Component */}
        <ProductPrice
          price={currentPrice}
          discount={discount}
          mrp={mrp}
        />
      </Box>

      {/* Variant Selectors (Color & Size) */}
      {(colors.length > 0 || sizes.length > 0) && (
        <Box pt={1}>
          {colors.length > 0 && (
            <Box mb={3}>
              <ProductColorSelector
                colors={colors}
                selectedColor={selectedColor}
                onSelect={setSelectedColor}
              />
            </Box>
          )}
          {sizes.length > 0 && (
            <ProductSizeSelector
              sizes={sizes}
              selectedSize={selectedSize}
              onSelect={setSelectedSize}
            />
          )}
        </Box>
      )}

      {/* Quick Specs / Weight Highlight if available */}
      {weight && (
        <HStack spacing={1.5} fontSize="xs" color={mutedText}>
          <Icon as={FiPackage} boxSize={3.5} />
          <Text fontWeight="500">Weight: {weight}</Text>
        </HStack>
      )}

      <Divider borderColor={dividerColor} />

      {/* Return & Exchange Guarantee */}
      <ReturnExchange services={services} />
    </VStack>
  );
});

ProductDetailsSection.displayName = "ProductDetailsSection";

export default ProductDetailsSection;