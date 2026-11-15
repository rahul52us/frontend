import React, { useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Circle,
  Divider,
  Flex,
  HStack,
  Icon,
  Image,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Text,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import {
  FiBox,
  FiCheckCircle,
  FiDollarSign,
  FiEdit3,
  FiExternalLink,
  FiImage,
  FiInfo,
  FiLayers,
  FiShoppingBag,
  FiTag,
  FiTrash2,
} from "react-icons/fi";
import BottomSheetDrawer from "../../../../component/common/Drawer/BottomSheetDrawer";
import CustomDrawer from "../../../../component/common/Drawer/CustomDrawer";
import { dashboardPalette } from "../../../../layouts/dashboardLayout/dashboardPalette";

interface ProductViewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onEdit?: (product: any) => void;
  onDelete?: (product: any) => void;
}

const ProductViewDrawer: React.FC<ProductViewDrawerProps> = ({
  isOpen,
  onClose,
  product,
  onEdit,
  onDelete,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? false;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const surfaceBg = useColorModeValue("white", dashboardPalette.surface);
  const shellBg = useColorModeValue("#F8FAFC", dashboardPalette.shell);
  const borderCol = useColorModeValue("#E2E8F0", dashboardPalette.border);
  const textMuted = useColorModeValue("#64748B", dashboardPalette.textMuted);
  const textCol = useColorModeValue("#0F172A", dashboardPalette.text);

  if (!product) return null;

  const images: string[] = Array.isArray(product.images)
    ? product.images.filter(Boolean)
    : [];
  const currentImage = images[selectedImageIndex] || images[0] || null;

  const companyName =
    product.company?.name ||
    (typeof product.company === "string" ? product.company : "Direct Merchant");
  const categoryName = product.category?.name || "Uncategorized";
  const subCategories: any[] = Array.isArray(product.subCategories)
    ? product.subCategories
    : [];

  const price = typeof product.price === "number" ? product.price : parseFloat(product.price) || 0;
  const mrp = typeof product.mrp === "number" ? product.mrp : parseFloat(product.mrp) || 0;
  const hasDiscount = mrp > price;
  const discountPct = hasDiscount ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const stock = product.stock ?? product.quantity;
  const isOutOfStock = stock !== undefined && stock <= 0;
  const isLowStock = stock !== undefined && stock > 0 && stock <= 5;

  const drawerContent = (
    <VStack spacing={4} align="stretch" pb={6}>
      {/* Product Image Gallery */}
      <Box
        bg={surfaceBg}
        borderRadius="20px"
        border="1px solid"
        borderColor={borderCol}
        overflow="hidden"
        p={3}
      >
        <Box
          h={{ base: "220px", md: "300px" }}
          w="100%"
          borderRadius="16px"
          overflow="hidden"
          position="relative"
          bg={shellBg}
          cursor={currentImage ? "pointer" : "default"}
          onClick={() => currentImage && setPreviewImage(currentImage)}
        >
          {currentImage ? (
            <Image
              src={currentImage}
              alt={product.name}
              w="100%"
              h="100%"
              objectFit="contain"
              transition="transform 0.3s ease"
              _hover={{ transform: "scale(1.03)" }}
            />
          ) : (
            <Flex align="center" justify="center" h="100%">
              <Icon as={FiBox} boxSize={12} color={textMuted} />
            </Flex>
          )}

          {images.length > 1 && (
            <Badge
              position="absolute"
              bottom={3}
              right={3}
              bg="blackAlpha.750"
              color="white"
              borderRadius="full"
              px={2.5}
              py={0.5}
              fontSize="xs"
              fontWeight="700"
            >
              {selectedImageIndex + 1} / {images.length} photos
            </Badge>
          )}
        </Box>

        {/* Thumbnail Row */}
        {images.length > 1 && (
          <HStack spacing={2} mt={3} overflowX="auto" pb={1}>
            {images.map((img, idx) => (
              <Box
                key={idx}
                boxSize="52px"
                borderRadius="10px"
                overflow="hidden"
                cursor="pointer"
                border="2px solid"
                borderColor={idx === selectedImageIndex ? dashboardPalette.accent : "transparent"}
                opacity={idx === selectedImageIndex ? 1 : 0.6}
                transition="all 0.15s ease"
                flexShrink={0}
                onClick={() => setSelectedImageIndex(idx)}
              >
                <Image src={img} alt="" w="100%" h="100%" objectFit="cover" />
              </Box>
            ))}
          </HStack>
        )}
      </Box>

      {/* Main Info Card */}
      <Box
        bg={surfaceBg}
        borderRadius="20px"
        border="1px solid"
        borderColor={borderCol}
        p={{ base: 4, md: 5 }}
      >
        <HStack justify="space-between" align="start" spacing={3}>
          <Box flex="1">
            <HStack spacing={2} mb={2} flexWrap="wrap">
              <Badge colorScheme="brand" variant="subtle" borderRadius="full" px={2.5} py={0.5} fontSize="xs">
                {categoryName}
              </Badge>
              {subCategories.map((sub, i) => (
                <Badge key={i} colorScheme="gray" variant="subtle" borderRadius="full" px={2} py={0.5} fontSize="xs">
                  {sub.name || sub}
                </Badge>
              ))}
              {isOutOfStock ? (
                <Badge colorScheme="red" variant="solid" borderRadius="full" px={2} py={0.5} fontSize="xs">
                  Out of Stock
                </Badge>
              ) : isLowStock ? (
                <Badge colorScheme="orange" variant="solid" borderRadius="full" px={2} py={0.5} fontSize="xs">
                  Low Stock ({stock})
                </Badge>
              ) : (
                <Badge colorScheme="green" variant="subtle" borderRadius="full" px={2} py={0.5} fontSize="xs">
                  In Stock {stock !== undefined ? `(${stock})` : ""}
                </Badge>
              )}
            </HStack>

            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="800" color={textCol} lineHeight="1.3">
              {product.name}
            </Text>

            <HStack spacing={2} mt={2} color={textMuted} fontSize="sm">
              <Icon as={FiShoppingBag} color={dashboardPalette.accent} />
              <Text fontWeight="600">{companyName}</Text>
            </HStack>
          </Box>
        </HStack>

        <Divider my={3.5} borderColor={borderCol} />

        {/* Pricing Grid */}
        <SimpleGrid columns={{ base: 2, sm: 3 }} spacing={3}>
          <Box p={3} borderRadius="14px" bg={shellBg}>
            <Text fontSize="xs" fontWeight="700" textTransform="uppercase" color={textMuted} letterSpacing="0.06em">
              Selling Price
            </Text>
            <Text fontSize="xl" fontWeight="900" color={dashboardPalette.accentStrong} mt={0.5}>
              ₹{price.toLocaleString("en-IN")}
            </Text>
          </Box>

          {mrp > 0 && (
            <Box p={3} borderRadius="14px" bg={shellBg}>
              <Text fontSize="xs" fontWeight="700" textTransform="uppercase" color={textMuted} letterSpacing="0.06em">
                MRP
              </Text>
              <HStack spacing={1.5} mt={0.5}>
                <Text fontSize="md" fontWeight="700" color={textMuted} textDecoration="line-through">
                  ₹{mrp.toLocaleString("en-IN")}
                </Text>
                {hasDiscount && (
                  <Badge colorScheme="green" fontSize="10px" borderRadius="full">
                    -{discountPct}%
                  </Badge>
                )}
              </HStack>
            </Box>
          )}

          {stock !== undefined && (
            <Box p={3} borderRadius="14px" bg={shellBg}>
              <Text fontSize="xs" fontWeight="700" textTransform="uppercase" color={textMuted} letterSpacing="0.06em">
                Inventory Units
              </Text>
              <Text fontSize="lg" fontWeight="800" color={isOutOfStock ? "red.500" : textCol} mt={0.5}>
                {stock} available
              </Text>
            </Box>
          )}
        </SimpleGrid>
      </Box>

      {/* Description */}
      {product.description && (
        <Box
          bg={surfaceBg}
          borderRadius="20px"
          border="1px solid"
          borderColor={borderCol}
          p={{ base: 4, md: 5 }}
        >
          <HStack spacing={2} mb={2.5}>
            <Icon as={FiInfo} color={dashboardPalette.accent} />
            <Text fontSize="xs" fontWeight="700" textTransform="uppercase" color={textMuted} letterSpacing="0.08em">
              Product Description
            </Text>
          </HStack>
          <Text fontSize="sm" color={textCol} lineHeight="1.7" whiteSpace="pre-line">
            {product.description}
          </Text>
        </Box>
      )}

      {/* Specifications / Highlights if present */}
      {(Array.isArray(product.productDetails) && product.productDetails.length > 0) ||
      (Array.isArray(product.information) && product.information.length > 0) ? (
        <Box
          bg={surfaceBg}
          borderRadius="20px"
          border="1px solid"
          borderColor={borderCol}
          p={{ base: 4, md: 5 }}
        >
          <HStack spacing={2} mb={3}>
            <Icon as={FiLayers} color={dashboardPalette.accent} />
            <Text fontSize="xs" fontWeight="700" textTransform="uppercase" color={textMuted} letterSpacing="0.08em">
              Specifications & Attributes
            </Text>
          </HStack>
          <VStack align="stretch" spacing={2}>
            {[...(product.productDetails || []), ...(product.information || [])].map((item: any, i: number) => (
              <Flex
                key={i}
                justify="space-between"
                align="center"
                py={1.5}
                borderBottom="1px solid"
                borderColor={borderCol}
                fontSize="sm"
              >
                <Text color={textMuted} fontWeight="600">
                  {item.key || item.title || item.label || `Attr ${i + 1}`}
                </Text>
                <Text color={textCol} fontWeight="700" textAlign="right">
                  {item.value || item.desc || "--"}
                </Text>
              </Flex>
            ))}
          </VStack>
        </Box>
      ) : null}

      {/* Action Footer */}
      <HStack spacing={3} pt={2}>
        {onEdit && (
          <Button
            flex="1"
            h="44px"
            borderRadius="full"
            bg={dashboardPalette.accent}
            color="white"
            fontWeight="700"
            leftIcon={<FiEdit3 />}
            _hover={{ bg: dashboardPalette.accentStrong }}
            onClick={() => {
              onClose();
              onEdit(product);
            }}
          >
            Edit Product
          </Button>
        )}
        {onDelete && (
          <Button
            h="44px"
            px={5}
            borderRadius="full"
            variant="outline"
            borderColor="red.300"
            color="red.500"
            leftIcon={<FiTrash2 />}
            _hover={{ bg: "red.50" }}
            onClick={() => {
              onClose();
              onDelete(product);
            }}
          >
            Delete
          </Button>
        )}
      </HStack>

      {/* Lightbox Modal */}
      <Modal isOpen={Boolean(previewImage)} onClose={() => setPreviewImage(null)} isCentered size="3xl">
        <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(6px)" />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalCloseButton color="white" top={4} right={4} zIndex={2} bg="blackAlpha.600" borderRadius="full" />
          <Flex align="center" justify="center" p={4} onClick={() => setPreviewImage(null)}>
            {previewImage && (
              <Image
                src={previewImage}
                alt={product.name}
                maxH="80vh"
                maxW="100%"
                objectFit="contain"
                borderRadius="16px"
              />
            )}
          </Flex>
        </ModalContent>
      </Modal>
    </VStack>
  );

  if (isMobile) {
    return (
      <BottomSheetDrawer isOpen={isOpen} onClose={onClose} title="Product Details" size="full">
        {drawerContent}
      </BottomSheetDrawer>
    );
  }

  return (
    <CustomDrawer
      title="Product Details"
      open={isOpen}
      close={onClose}
      size="2xl"
      width="680px"
      icon={FiBox}
      categoryTag={categoryName}
      subtitle={companyName}
    >
      {drawerContent}
    </CustomDrawer>
  );
};

export default ProductViewDrawer;
