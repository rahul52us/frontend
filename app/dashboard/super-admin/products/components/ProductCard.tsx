import React from "react";
import {
  Badge,
  Box,
  Button,
  Circle,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
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
  const surfaceBg = useColorModeValue("white", dashboardPalette.surface);
  const shellBg = useColorModeValue("#F8FAFC", dashboardPalette.surfaceAlt);
  const borderCol = useColorModeValue("#E2E8F0", dashboardPalette.border);
  const textCol = useColorModeValue("#0F172A", dashboardPalette.text);
  const textMuted = useColorModeValue("#64748B", dashboardPalette.textMuted);

  const images: string[] = Array.isArray(product.images)
    ? product.images.filter(Boolean)
    : [];
  const primaryImage = images[0] || null;

  const companyName =
    product.company?.name ||
    (typeof product.company === "string" ? product.company : "Direct");
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
      bg={surfaceBg}
      // border="1px solid"
      // borderColor={borderCol}
      borderRadius="22px"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      transition="all 0.22s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        // borderColor: dashboardPalette.accent,
        boxShadow: "0 14px 30px rgba(15, 23, 42, 0.08)",
        transform: "translateY(-3px)",
      }}
      position="relative"
    >
      {/* Media Box */}
      <Box
        h={{ base: "170px", sm: "190px", md: "205px" }}
        w="100%"
        position="relative"
        bg={shellBg}
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
            transition="transform 0.4s ease"
            _hover={{ transform: "scale(1.06)" }}
          />
        ) : (
          <Flex align="center" justify="center" h="100%">
            <Icon as={FiBox} boxSize={10} color={textMuted} />
          </Flex>
        )}

        {/* Category Badge Overlaid */}
        <Badge
          position="absolute"
          top={3}
          left={3}
          colorScheme="brand"
          variant="solid"
          borderRadius="full"
          px={2.5}
          py={0.5}
          fontSize="10px"
          fontWeight="700"
          boxShadow="0 4px 10px rgba(0, 0, 0, 0.12)"
          noOfLines={1}
          maxW="130px"
        >
          {categoryName}
        </Badge>

        {/* Multi-photo Indicator */}
        {images.length > 1 && (
          <HStack
            position="absolute"
            top={3}
            right={3}
            bg="blackAlpha.700"
            backdropFilter="blur(4px)"
            color="white"
            borderRadius="full"
            px={2}
            py={0.5}
            spacing={1}
            fontSize="10px"
            fontWeight="700"
          >
            <Icon as={FiImage} boxSize={2.5} />
            <Text>{images.length}</Text>
          </HStack>
        )}

        {/* Stock Status Badge */}
        <Box position="absolute" bottom={3} left={3}>
          {isOutOfStock ? (
            <Badge colorScheme="red" variant="solid" borderRadius="full" px={2} py={0.5} fontSize="10px">
              Out of stock
            </Badge>
          ) : isLowStock ? (
            <Badge colorScheme="orange" variant="solid" borderRadius="full" px={2} py={0.5} fontSize="10px">
              Only {stock} left
            </Badge>
          ) : stock !== undefined ? (
            <Badge colorScheme="green" variant="solid" borderRadius="full" px={2} py={0.5} fontSize="10px">
              In Stock ({stock})
            </Badge>
          ) : null}
        </Box>
      </Box>

      {/* Body Info */}
      <Flex direction="column" flex="1" p={{ base: 3.5, md: 4.5 }}>
        {/* Shop Name */}
        <HStack spacing={1.5} fontSize="xs" color={textMuted} mb={1.5}>
          <Icon as={FiShoppingBag} color={dashboardPalette.accent} boxSize={3} flexShrink={0} />
          <Text fontWeight="600" noOfLines={1}>
            {companyName}
          </Text>
        </HStack>

        {/* Product Title */}
        <Tooltip label={product.name} placement="top" openDelay={500}>
          <Text
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="700"
            color={textCol}
            lineHeight="1.3"
            noOfLines={2}
            minH={{ base: "36px", md: "42px" }}
            cursor="pointer"
            _hover={{ color: dashboardPalette.accent }}
            onClick={() => onView(product)}
          >
            {product.name}
          </Text>
        </Tooltip>

        {/* Subcategories (if any) */}
        {Array.isArray(product.subCategories) && product.subCategories.length > 0 && (
          <HStack spacing={1} mt={1.5} flexWrap="wrap" rowGap={1}>
            {product.subCategories.slice(0, 2).map((sub: any, i: number) => (
              <Badge key={i} colorScheme="gray" variant="subtle" fontSize="9px" borderRadius="full" px={1.5}>
                {sub.name || sub}
              </Badge>
            ))}
            {product.subCategories.length > 2 && (
              <Text fontSize="9px" color={textMuted} fontWeight="600">
                +{product.subCategories.length - 2} more
              </Text>
            )}
          </HStack>
        )}

        <Box mt="auto" pt={3}>
          {/* Price Section */}
          <Flex align="baseline" justify="space-between" mb={3}>
            <HStack align="baseline" spacing={1.5}>
              <Text fontSize={{ base: "md", md: "xl" }} fontWeight="900" color={textCol} lineHeight="1">
                ₹{price.toLocaleString("en-IN")}
              </Text>
              {hasDiscount && (
                <Text as="s" fontSize="xs" color={textMuted} fontWeight="600">
                  ₹{mrp.toLocaleString("en-IN")}
                </Text>
              )}
            </HStack>
            {hasDiscount && (
              <Badge colorScheme="green" variant="subtle" fontSize="10px" borderRadius="full" px={1.5}>
                {discountPct}% off
              </Badge>
            )}
          </Flex>

          {/* Action Row */}
          <HStack spacing={2} pt={1}>
            <Button
              size="sm"
              flex="1"
              variant="outline"
              borderColor={borderCol}
              borderRadius="full"
              fontSize="xs"
              fontWeight="700"
              leftIcon={<FiEye />}
              _hover={{ bg: shellBg, borderColor: dashboardPalette.accent }}
              onClick={() => onView(product)}
            >
              View
            </Button>

            <Button
              size="sm"
              flex="1"
              variant="solid"
              colorScheme="brand"
              borderRadius="full"
              fontSize="xs"
              fontWeight="700"
              leftIcon={<FiEdit3 />}
              onClick={() => onEdit(product)}
            >
              Edit
            </Button>

            <IconButton
              size="sm"
              variant="ghost"
              colorScheme="red"
              borderRadius="full"
              icon={<FiTrash2 />}
              aria-label="Delete product"
              _hover={{ bg: "red.50" }}
              onClick={() => onDelete(product)}
            />
          </HStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default ProductCard;
