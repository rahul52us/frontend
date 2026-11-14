"use client";

import {
  AspectRatio,
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FiCheck, FiPlus } from "react-icons/fi";
import { useCartToast } from "../../../../hooks/useCartToast";
import stores from "../../../../store/stores";
import ProductLikeButton from "./ProductLikeButton";

const extractImageUrl = (img: any): string => {
  if (!img) return "";
  if (typeof img === "string") return img;
  return img.url || img.src || "";
};

const ProductCard = ({ product, i }: { product: any; i?: number }) => {
  const router = useRouter();
  const {
    image,
    images,
    name,
    title,
    price,
    sellingPrice,
    originalPrice,
    mrp,
    _id,
    productId,
    stock,
    quantity,
    availability,
    isOutOfStock: directOutOfStock,
  } = product || {};

  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Theme color tokens
  const cardBg = useColorModeValue("white", "gray.850");
  const borderColor = useColorModeValue("gray.100", "gray.750");
  const imageBg = useColorModeValue("gray.50", "gray.900");
  const textPrimary = useColorModeValue("gray.500", "white");
  const textMuted = useColorModeValue("gray.500", "gray.400");
  const priceColor = useColorModeValue("gray.900", "white");
  const addBtnBg = useColorModeValue("blue.50", "whiteAlpha.150");
  const addBtnColor = useColorModeValue("blue.600", "blue.300");
  const addBtnBorder = useColorModeValue("blue.100", "whiteAlpha.200");

  const { showAddToCartToast } = useCartToast();
  const { cartStore } = stores;

  // Safe image resolution
  const normalizedImages: string[] = Array.isArray(images)
    ? images.map(extractImageUrl).filter(Boolean)
    : [];
  const primaryImage =
    extractImageUrl(image) ||
    normalizedImages[0] ||
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=80";

  // Price & Discount Calculation matching Lovable reference
  const finalPrice = Number(price ?? sellingPrice ?? 0);
  const rawOriginalPrice = Number(originalPrice ?? mrp ?? 0);
  const hasDiscount = rawOriginalPrice > finalPrice && finalPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((rawOriginalPrice - finalPrice) / rawOriginalPrice) * 100)
    : 0;

  // Out of stock logic
  const isOutOfStock =
    stock === 0 ||
    quantity === 0 ||
    availability === "out_of_stock" ||
    directOutOfStock === true;

  const productTitle = name || title || "Product";

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdding || isOutOfStock) return;
    try {
      setIsAdding(true);
      await cartStore.addToCart(product);
      showAddToCartToast(product);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    } finally {
      setIsAdding(false);
    }
  };

  const navigateToProduct = () => {
    router.push(`/product?productId=${productId || _id}`);
  };

  return (
    <Box
      as="article"
      role="group"
      cursor="pointer"
      onClick={navigateToProduct}
      borderRadius="2xl"
      overflow="hidden"
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      boxShadow="0 2px 8px rgba(0, 0, 0, 0.04)"
      transition="all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "0 12px 24px -6px rgba(0, 0, 0, 0.08)",
        borderColor: "blue.200",
      }}
      _active={{ transform: "scale(0.98)" }}
      h="full"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      style={{
        animationDelay: typeof i === "number" ? `${i * 50}ms` : undefined,
      }}
    >
      {/* Product Image Container */}
      <Box position="relative" overflow="hidden" bg={imageBg}>
        <AspectRatio ratio={1} w="full">
          <Image
            src={primaryImage}
            alt={productTitle}
            objectFit="cover"
            loading="lazy"
            transition="transform 0.5s ease, opacity 0.3s ease, filter 0.3s ease"
            _groupHover={{ transform: "scale(1.05)" }}
            opacity={isOutOfStock ? 0.5 : 1}
            filter={isOutOfStock ? "grayscale(100%)" : "none"}
            fallbackSrc="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=80"
          />
        </AspectRatio>

        {/* Top-Left: Discount Badge matching Lovable (e.g. "20% off") */}
        {discountPercent > 0 && (
          <Badge
            position="absolute"
            top={2}
            left={2}
            zIndex={2}
            borderRadius="full"
            bgGradient="linear(to-r, blue.600, indigo.600)"
            color="white"
            px={2.5}
            py={0.5}
            fontSize="xs"
            fontWeight="bold"
            boxShadow="0 2px 8px rgba(37, 99, 235, 0.35)"
            textTransform="none"
          >
            {discountPercent}% off
          </Badge>
        )}

        {/* Top-Right: Wishlist / Like Button */}
        <Box
          position="absolute"
          top={2}
          right={2}
          zIndex={3}
          onClick={(e) => e.stopPropagation()}
        >
          <ProductLikeButton product={product} />
        </Box>

        {/* Bottom-Center: Out of Stock Banner */}
        {isOutOfStock && (
          <Box
            position="absolute"
            insetX={2}
            bottom={2}
            zIndex={2}
            borderRadius="full"
            bg="rgba(0, 0, 0, 0.75)"
            backdropFilter="blur(4px)"
            py={1}
            textAlign="center"
            color="white"
            fontSize="xs"
            fontWeight="semibold"
          >
            Out of stock
          </Box>
        )}
      </Box>

      {/* Product Information Body */}
      <Box p={3} flex={1} display="flex" flexDirection="column" justifyContent="space-between">
        {/* Title */}
        <Text
          fontSize="sm"
          fontWeight="semibold"
          color={textPrimary}
          noOfLines={1}
          lineHeight="shorter"
          title={productTitle}
          _groupHover={{ color: "blue.600" }}
          transition="color 0.2s ease"
        >
          {productTitle}
        </Text>

        {/* Price Row + Add to Cart Button */}
        <Flex
          mt={1.5}
          align="center"
          justify="space-between"
          gap={2}
        >
          <HStack spacing={1.5} align="baseline" minW={0} flex={1}>
            <Text
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="bold"
              color={priceColor}
              lineHeight="1"
              noOfLines={1}
            >
              ₹{finalPrice.toLocaleString("en-IN")}
            </Text>

            {hasDiscount && (
              <Text
                fontSize="xs"
                color={textMuted}
                textDecoration="line-through"
                lineHeight="1"
                noOfLines={1}
              >
                ₹{rawOriginalPrice.toLocaleString("en-IN")}
              </Text>
            )}
          </HStack>

          {/* Cart Button */}
          {/* <Button
            size="xs"
            h="28px"
            px={2.5}
            borderRadius="lg"
            bg={justAdded ? "green.500" : addBtnBg}
            color={justAdded ? "white" : addBtnColor}
            border="1px solid"
            borderColor={justAdded ? "green.500" : addBtnBorder}
            fontWeight="bold"
            fontSize="xs"
            isLoading={isAdding}
            isDisabled={isOutOfStock}
            leftIcon={
              justAdded ? <FiCheck size={11} /> : <FiPlus size={11} />
            }
            _hover={{
              bg: justAdded ? "green.600" : "blue.600",
              color: "white",
              borderColor: justAdded ? "green.600" : "blue.600",
            }}
            _active={{ transform: "scale(0.94)" }}
            flexShrink={0}
            transition="all 0.15s ease"
            onClick={handleAddToCart}
          >
            {justAdded ? "Added" : "Add"}
          </Button> */}
        </Flex>
      </Box>
    </Box>
  );
};

export default ProductCard;
