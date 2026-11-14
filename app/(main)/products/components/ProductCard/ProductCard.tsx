"use client";

import {
  AspectRatio,
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { FiCheck, FiEye, FiPlus, FiTruck } from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import ImageViewerWithModal from "../../../../component/config/component/viewer/ImageViewerWithModal";
import { useCartToast } from "../../../../hooks/useCartToast";
import stores from "../../../../store/stores";
import ProductLikeButton from "./ProductLikeButton";

const extractImageUrl = (img: any): string => {
  if (!img) return "";
  if (typeof img === "string") return img;
  return img.url || img.src || "";
};

const ProductCard = ({ product }: any) => {
  const router = useRouter();
  const {
    image,
    images,
    category,
    name,
    title,
    price,
    sellingPrice,
    originalPrice,
    mrp,
    _id,
    productId,
    rating = 4.5,
    reviews = 128,
    isNew = false,
    isFeatured = false,
  } = product || {};

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Hoisted Theme Tokens (Unified Blue/Purple Brand Palette)
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const imageBg = useColorModeValue("gray.50", "gray.900");
  const textPrimary = useColorModeValue("gray.900", "white");
  const textMuted = useColorModeValue("gray.500", "gray.400");
  const priceColor = useColorModeValue("gray.900", "white");
  const addBtnBg = useColorModeValue("blue.50", "whiteAlpha.200");
  const addBtnColor = useColorModeValue("blue.600", "blue.300");

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

  // Price & Discount Calculation
  const finalPrice = Number(price ?? sellingPrice ?? 0);
  const rawOriginalPrice = Number(originalPrice ?? mrp ?? 0);
  const hasDiscount = rawOriginalPrice > finalPrice && finalPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((rawOriginalPrice - finalPrice) / rawOriginalPrice) * 100)
    : 0;

  // Format currency cleanly in INR
  const formatINR = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);

  const categoryName =
    typeof category === "object"
      ? category?.name
      : category || "Local Pick";

  const productTitle = name || title || "Featured Product";

  // Single Priority Badge (Prevents badge crowding on mobile)
  const priorityBadge =
    discountPercent >= 5
      ? { label: `${discountPercent}% OFF`, bg: "red.500", color: "white" }
      : isFeatured
      ? { label: "Featured", bg: "purple.600", color: "white" }
      : isNew
      ? { label: "New", bg: "blue.600", color: "white" }
      : finalPrice > 0 && finalPrice < 499
      ? { label: "Best Value", bg: "emerald.600", color: "white" }
      : null;

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    const imgs =
      normalizedImages.length > 0
        ? normalizedImages
        : [primaryImage].filter(Boolean);
    setSelectedImages(imgs);
    onOpen();
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdding) return;
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
      cursor="pointer"
      onClick={navigateToProduct}
      role="group"
      h="full"
      w="full"
      position="relative"
    >
      <Flex
        direction="column"
        justify="space-between"
        h="full"
        bg={cardBg}
        borderRadius={{ base: "xl", md: "2xl" }}
        border="1px solid"
        borderColor={borderColor}
        overflow="hidden"
        transition="all 0.2s ease"
        boxShadow="0 2px 10px rgba(0, 0, 0, 0.03)"
        _hover={{
          transform: "translateY(-4px)",
          borderColor: "blue.200",
          boxShadow: "0 14px 28px -8px rgba(37, 99, 235, 0.14)",
        }}
      >
        {/* TOP SECTION: Image + Floating Badges + Quick Actions */}
        <Box>
          <Box position="relative" overflow="hidden" bg={imageBg}>
            <AspectRatio ratio={1}>
              <Image
                src={primaryImage}
                alt={productTitle}
                objectFit="cover"
                loading="lazy"
                transition="transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                _groupHover={{ transform: "scale(1.06)" }}
                fallbackSrc="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=80"
              />
            </AspectRatio>

            {/* Top-Left: Single Clean Priority Badge */}
            {priorityBadge && (
              <Badge
                position="absolute"
                top={{ base: 2, md: 2.5 }}
                left={{ base: 2, md: 2.5 }}
                zIndex={2}
                bg={priorityBadge.bg}
                color={priorityBadge.color}
                borderRadius="md"
                px={2}
                py={0.5}
                fontSize={{ base: "9px", md: "10px" }}
                fontWeight="800"
                letterSpacing="0.3px"
                textTransform="uppercase"
                boxShadow="xs"
              >
                {priorityBadge.label}
              </Badge>
            )}

            {/* Top-Right: Like Button + Desktop Quick View Trigger */}
            <Flex
              position="absolute"
              top={{ base: 1.5, md: 2 }}
              right={{ base: 1.5, md: 2 }}
              zIndex={3}
              direction="column"
              gap={1.5}
              align="center"
              onClick={(e) => e.stopPropagation()}
            >
              <ProductLikeButton product={product} />

              <Tooltip label="Quick View" placement="left" hasArrow>
                <IconButton
                  display={{ base: "none", md: "inline-flex" }}
                  aria-label="Quick view"
                  icon={<FiEye size={14} />}
                  size="xs"
                  w="30px"
                  h="30px"
                  minW="30px"
                  borderRadius="full"
                  bg="whiteAlpha.900"
                  color="gray.700"
                  boxShadow="xs"
                  opacity={0}
                  transform="translateX(6px)"
                  _groupHover={{ opacity: 1, transform: "translateX(0)" }}
                  _hover={{ bg: "blue.600", color: "white" }}
                  transition="all 0.2s ease"
                  onClick={handleQuickView}
                />
              </Tooltip>
            </Flex>

            {/* Bottom-Left: Compact Glass Rating Pill (Saves vertical space) */}
            <HStack
              position="absolute"
              bottom={2}
              left={2}
              zIndex={2}
              bg="whiteAlpha.950"
              backdropFilter="blur(6px)"
              px={1.5}
              py={0.5}
              borderRadius="md"
              spacing={1}
              boxShadow="0 2px 6px rgba(0,0,0,0.08)"
            >
              <Text fontSize="10px" fontWeight="800" color="gray.800" lineHeight="1">
                {Number(rating).toFixed(1)}
              </Text>
              <Icon as={FaStar} color="amber.400" boxSize={2.5} />
              <Text fontSize="9px" color="gray.400" lineHeight="1">
                |
              </Text>
              <Text fontSize="9px" fontWeight="600" color="gray.600" lineHeight="1">
                {reviews}
              </Text>
            </HStack>
          </Box>

          {/* MIDDLE SECTION: Category & Product Title */}
          <Box p={{ base: 2.5, sm: 3, md: 3.5 }} pb={{ base: 1.5, md: 2 }}>
            {/* Category + Verified Tick */}
            <HStack spacing={1} mb={1}>
              <Text
                fontSize={{ base: "9px", md: "10px" }}
                color="blue.600"
                fontWeight="700"
                letterSpacing="0.4px"
                textTransform="uppercase"
                noOfLines={1}
              >
                {categoryName}
              </Text>
              <Icon as={MdVerified} color="blue.500" boxSize={3} flexShrink={0} />
            </HStack>

            {/* Product Name (2 lines fixed height for uniform grid alignment) */}
            <Text
              fontSize={{ base: "xs", sm: "sm", md: "sm" }}
              fontWeight="700"
              color={textPrimary}
              noOfLines={2}
              lineHeight="1.35"
              minH={{ base: "32px", md: "38px" }}
              _groupHover={{ color: "blue.600" }}
              transition="color 0.15s ease"
            >
              {productTitle}
            </Text>

            {/* Subtle Delivery Micro-Tag */}
            <HStack spacing={1} mt={1} color="green.600">
              <Icon as={FiTruck} boxSize={2.5} />
              <Text fontSize="10px" fontWeight="600" noOfLines={1}>
                Fast Local Delivery
              </Text>
            </HStack>
          </Box>
        </Box>

        {/* BOTTOM DOCK: Price on Left + Tactile Add Button on Right */}
        <Flex
          px={{ base: 2.5, sm: 3, md: 3.5 }}
          pb={{ base: 2.5, sm: 3, md: 3.5 }}
          pt={1.5}
          align="center"
          justify="space-between"
          gap={1.5}
          mt="auto"
        >
          <Box minW={0}>
            <Text
              fontSize={{ base: "sm", sm: "md", md: "lg" }}
              fontWeight="800"
              color={priceColor}
              lineHeight="1.1"
              letterSpacing="-0.3px"
              noOfLines={1}
            >
              {formatINR(finalPrice)}
            </Text>
            {hasDiscount && (
              <Text
                fontSize={{ base: "10px", md: "11px" }}
                color={textMuted}
                textDecoration="line-through"
                fontWeight="500"
                lineHeight="1.1"
                mt={0.5}
              >
                {formatINR(rawOriginalPrice)}
              </Text>
            )}
          </Box>

          {/* Compact Thumb-Friendly Add Button (Works on both Mobile & Desktop) */}
          <Button
            size="xs"
            h={{ base: "30px", md: "34px" }}
            px={{ base: 2.5, sm: 3.5 }}
            borderRadius="lg"
            bg={justAdded ? "green.500" : addBtnBg}
            color={justAdded ? "white" : addBtnColor}
            border="1px solid"
            borderColor={justAdded ? "green.500" : "blue.100"}
            fontWeight="700"
            fontSize="xs"
            isLoading={isAdding}
            leftIcon={
              justAdded ? <FiCheck size={12} /> : <FiPlus size={12} />
            }
            _hover={{
              bg: justAdded ? "green.600" : "blue.600",
              color: "white",
              borderColor: justAdded ? "green.600" : "blue.600",
            }}
            _active={{ transform: "scale(0.95)" }}
            flexShrink={0}
            transition="all 0.15s ease"
            onClick={handleAddToCart}
          >
            {justAdded ? "Added" : "Add"}
          </Button>
        </Flex>
      </Flex>

      {/* Quick View Image Modal */}
      <ImageViewerWithModal
        isOpen={isOpen}
        onClose={onClose}
        images={selectedImages}
      />
    </Box>
  );
};

export default ProductCard;