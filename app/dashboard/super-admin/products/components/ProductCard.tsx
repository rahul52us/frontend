import React, { useState } from "react";
import {
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
} from "@chakra-ui/react";
import {
  FiBox,
  FiEdit3,
  FiEye,
  FiImage,
  FiShoppingBag,
  FiTrash2,
} from "react-icons/fi";
import { dashboardPalette } from "../../../../layouts/dashboardLayout/dashboardPalette";

interface ProductCardProps {
  product: any;
  onView: (product: any) => void;
  onEdit: (product: any) => void;
  onDelete: (product: any) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onView,
  onEdit,
  onDelete,
}) => {
  const [imageError, setImageError] = useState(false);

  // Dynamic theme colors adapting seamlessly across light & dark themes
  const cardBg = useColorModeValue(
    "white",
    dashboardPalette.surface
  );
  const cardBorder = useColorModeValue(
    "gray.200",
    dashboardPalette.border
  );
  const cardBorderHover = useColorModeValue(
    "var(--color-primary, #065F68)",
    "var(--color-primary, #3b82f6)"
  );
  const cardShadow = useColorModeValue(
    "0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.02)",
    "0 4px 20px rgba(0, 0, 0, 0.22)"
  );
  const cardShadowHover = useColorModeValue(
    "0 6px 20px rgba(37, 99, 235, 0.08)",
    "0 8px 28px rgba(0, 0, 0, 0.38), 0 0 0 1px var(--color-primary-soft, rgba(20, 184, 166, 0.2))"
  );

  const mediaFallbackBg = useColorModeValue(
    "gray.100",
    "linear-gradient(135deg, rgba(20, 184, 166, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)"
  );
  const mediaFallbackText = useColorModeValue("gray.500", "gray.400");
  const mediaIconBg = useColorModeValue(
    "brand.50",
    "rgba(20, 184, 166, 0.14)"
  );
  const mediaIconColor = useColorModeValue("brand.600", "teal.300");

  const titleColor = useColorModeValue("gray.800", "var(--merchant-text, #ffffff)");
  const titleColorHover = useColorModeValue("brand.600", "teal.300");
  const metaTextColor = useColorModeValue("gray.600", "var(--merchant-text-muted, #94a3b8)");

  const priceStripBg = useColorModeValue(
    "gray.50",
    "rgba(255, 255, 255, 0.03)"
  );
  const priceStripBorder = useColorModeValue(
    "gray.200",
    "rgba(255, 255, 255, 0.07)"
  );
  const priceColor = useColorModeValue("gray.900", "#ffffff");
  const mrpColor = useColorModeValue("gray.400", "#64748b");

  const viewBtnBorder = useColorModeValue("gray.300", "rgba(255, 255, 255, 0.14)");
  const viewBtnColor = useColorModeValue("gray.700", "whiteAlpha.900");
  const viewBtnBg = useColorModeValue("white", "rgba(255, 255, 255, 0.03)");
  const viewBtnHoverBg = useColorModeValue("gray.50", "rgba(255, 255, 255, 0.08)");

  const images: string[] = Array.isArray(product.images)
    ? product.images.filter(Boolean)
    : [];
  const rawImage = images[0] || null;
  const primaryImage = !imageError && rawImage ? rawImage : null;

  const companyName =
    product.company?.name ||
    (typeof product.company === "string" ? product.company : "Direct Store");
  const categoryName = product.category?.name || "General";

  const price =
    typeof product.price === "number" ? product.price : parseFloat(product.price) || 0;
  const mrp =
    typeof product.mrp === "number" ? product.mrp : parseFloat(product.mrp) || 0;
  const hasDiscount = mrp > price;
  const discountPct = hasDiscount ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const stock = product.stock ?? product.quantity;
  const isOutOfStock = stock !== undefined && stock <= 0;
  const isLowStock = stock !== undefined && stock > 0 && stock <= 5;

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={cardBorder}
      borderRadius="18px"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      transition="border-color 0.2s ease, box-shadow 0.2s ease"
      boxShadow={cardShadow}
      _hover={{
        borderColor: cardBorderHover,
        boxShadow: cardShadowHover,
      }}
      position="relative"
    >
      {/* Top Media Showcase */}
      <Box
        h={{ base: "175px", sm: "195px", md: "210px" }}
        w="100%"
        position="relative"
        bg={useColorModeValue("gray.100", "#080e18")}
        overflow="hidden"
        cursor="pointer"
        onClick={() => onView(product)}
      >
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.name}
            w="100%"
            h="100%"
            objectFit="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <Flex
            align="center"
            justify="center"
            h="100%"
            w="100%"
            bg={mediaFallbackBg}
            flexDirection="column"
            gap={2.5}
            userSelect="none"
          >
            <Flex
              w="52px"
              h="52px"
              borderRadius="16px"
              bg={mediaIconBg}
              border="1px solid"
              borderColor={useColorModeValue("brand.100", "rgba(20, 184, 166, 0.25)")}
              align="center"
              justify="center"
              color={mediaIconColor}
              boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
            >
              <Icon as={FiBox} boxSize={6} />
            </Flex>
            <Text
              fontSize="11px"
              fontWeight="700"
              color={mediaFallbackText}
              letterSpacing="0.05em"
              textTransform="uppercase"
            >
              No Product Photo
            </Text>
          </Flex>
        )}

        {/* Top Vignette Gradient Overlay */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          h="54px"
          bg="linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 100%)"
          pointerEvents="none"
        />

        {/* Category Pill Tag */}
        <Badge
          position="absolute"
          top={3}
          left={3}
          bg="rgba(13, 148, 136, 0.9)"
          backdropFilter="blur(8px)"
          color="white"
          borderRadius="8px"
          px={2.5}
          py={0.8}
          fontSize="10px"
          fontWeight="700"
          letterSpacing="0.03em"
          boxShadow="0 4px 12px rgba(0, 0, 0, 0.3)"
          noOfLines={1}
          maxW="140px"
        >
          {categoryName}
        </Badge>

        {/* Multi-photo Counter */}
        {images.length > 1 && (
          <HStack
            position="absolute"
            top={3}
            right={3}
            bg="rgba(0, 0, 0, 0.68)"
            backdropFilter="blur(8px)"
            color="white"
            borderRadius="8px"
            px={2}
            py={0.8}
            spacing={1}
            fontSize="10px"
            fontWeight="700"
            boxShadow="0 4px 12px rgba(0, 0, 0, 0.3)"
          >
            <Icon as={FiImage} boxSize={2.5} />
            <Text>{images.length}</Text>
          </HStack>
        )}

        {/* Stock Status Pill */}
        <Box position="absolute" bottom={3} left={3}>
          {isOutOfStock ? (
            <Badge
              bg="rgba(239, 68, 68, 0.92)"
              backdropFilter="blur(8px)"
              color="white"
              borderRadius="8px"
              px={2.5}
              py={0.8}
              fontSize="10px"
              fontWeight="700"
              boxShadow="0 4px 12px rgba(0, 0, 0, 0.3)"
            >
              ● OUT OF STOCK
            </Badge>
          ) : isLowStock ? (
            <Badge
              bg="rgba(245, 158, 11, 0.92)"
              backdropFilter="blur(8px)"
              color="white"
              borderRadius="8px"
              px={2.5}
              py={0.8}
              fontSize="10px"
              fontWeight="700"
              boxShadow="0 4px 12px rgba(0, 0, 0, 0.3)"
            >
              ● ONLY {stock} LEFT
            </Badge>
          ) : stock !== undefined ? (
            <Badge
              bg="rgba(16, 185, 129, 0.92)"
              backdropFilter="blur(8px)"
              color="white"
              borderRadius="8px"
              px={2.5}
              py={0.8}
              fontSize="10px"
              fontWeight="700"
              boxShadow="0 4px 12px rgba(0, 0, 0, 0.3)"
            >
              ● IN STOCK ({stock})
            </Badge>
          ) : null}
        </Box>
      </Box>

      {/* Card Content & Details */}
      <Flex direction="column" flex="1" p={{ base: 3.5, md: 4 }}>
        {/* Merchant & Subcategory Row */}
        <Flex justify="space-between" align="center" mb={1.5} gap={2}>
          <HStack spacing={1.5} fontSize="xs" color={metaTextColor} minW={0}>
            <Icon
              as={FiShoppingBag}
              color="var(--merchant-accent, #14b8a6)"
              boxSize={3}
              flexShrink={0}
            />
            <Text fontWeight="600" noOfLines={1}>
              {companyName}
            </Text>
          </HStack>

          {Array.isArray(product.subCategories) && product.subCategories.length > 0 && (
            <Badge
              bg={useColorModeValue("gray.100", "rgba(255, 255, 255, 0.06)")}
              color={metaTextColor}
              variant="subtle"
              fontSize="9px"
              fontWeight="600"
              borderRadius="6px"
              px={1.5}
              py={0.5}
              flexShrink={0}
              noOfLines={1}
            >
              {product.subCategories[0]?.name || product.subCategories[0]}
            </Badge>
          )}
        </Flex>

        {/* Product Title */}
        <Tooltip label={product.name} placement="top" openDelay={400}>
          <Text
            fontSize={{ base: "sm", md: "15px" }}
            fontWeight="700"
            color={titleColor}
            lineHeight="1.38"
            noOfLines={2}
            minH={{ base: "38px", md: "42px" }}
            cursor="pointer"
            _hover={{ color: titleColorHover }}
            onClick={() => onView(product)}
            transition="color 0.15s ease"
          >
            {product.name}
          </Text>
        </Tooltip>

        <Box mt="auto" pt={3.5}>
          {/* Price Strip Card */}
          <Flex
            align="center"
            justify="space-between"
            mb={3.5}
            px={3}
            py={2.5}
            borderRadius="12px"
            bg={priceStripBg}
            border="1px solid"
            borderColor={priceStripBorder}
          >
            <HStack align="baseline" spacing={2}>
              <Text
                fontSize={{ base: "md", md: "18px" }}
                fontWeight="800"
                color={priceColor}
                lineHeight="1"
              >
                ₹{price.toLocaleString("en-IN")}
              </Text>
              {hasDiscount && (
                <Text as="s" fontSize="xs" color={mrpColor} fontWeight="600">
                  ₹{mrp.toLocaleString("en-IN")}
                </Text>
              )}
            </HStack>

            {hasDiscount ? (
              <Badge
                bg="rgba(16, 185, 129, 0.15)"
                color="green.400"
                border="1px solid"
                borderColor="rgba(16, 185, 129, 0.3)"
                fontSize="10px"
                fontWeight="700"
                borderRadius="6px"
                px={1.5}
                py={0.5}
              >
                {discountPct}% OFF
              </Badge>
            ) : (
              <Badge
                bg={useColorModeValue("gray.200", "rgba(255, 255, 255, 0.06)")}
                color={metaTextColor}
                fontSize="10px"
                fontWeight="600"
                borderRadius="6px"
                px={1.5}
                py={0.5}
              >
                STANDARD
              </Badge>
            )}
          </Flex>

          {/* Action Row */}
          <HStack spacing={2}>
            <Button
              size="sm"
              flex="1"
              variant="outline"
              borderColor={viewBtnBorder}
              color={viewBtnColor}
              bg={viewBtnBg}
              borderRadius="10px"
              h="36px"
              fontSize="xs"
              fontWeight="600"
              leftIcon={<FiEye size={14} />}
              _hover={{
                bg: viewBtnHoverBg,
                borderColor: "teal.400",
                color: "teal.300",
              }}
              onClick={() => onView(product)}
            >
              View
            </Button>

            <Button
              size="sm"
              flex="1"
              variant="solid"
              bg="var(--color-primary, #065F68)"
              color="white"
              borderRadius="10px"
              h="36px"
              fontSize="xs"
              fontWeight="700"
              leftIcon={<FiEdit3 size={14} />}
              _hover={{
                bg: "var(--color-primary-hover, #044249)",
              }}
              onClick={() => onEdit(product)}
            >
              Edit
            </Button>

            <IconButton
              size="sm"
              variant="ghost"
              colorScheme="red"
              borderRadius="10px"
              h="36px"
              w="36px"
              minW="36px"
              icon={<FiTrash2 size={15} />}
              aria-label="Delete product"
              _hover={{ bg: "rgba(239, 68, 68, 0.15)", color: "red.300" }}
              onClick={() => onDelete(product)}
            />
          </HStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default ProductCard;
