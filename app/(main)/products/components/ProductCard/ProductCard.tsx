import {
  AspectRatio,
  Box,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Text,
  useColorModeValue,
  VStack,
  useDisclosure,
  Flex,
  Badge,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiEye, FiShoppingBag, FiHeart, FiStar, FiTruck, FiShield } from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import ImageViewerWithModal from "../../../../component/config/component/viewer/ImageViewerWithModal";
import { useRouter } from "next/navigation";
import stores from "../../../../store/stores";
import ProductLikeButton from "./ProductLikeButton";
import { useCartToast } from "../../../../hooks/useCartToast";

const ProductCard = ({ product }: any) => {
  const router = useRouter();

  const { image, images, category, name, price, _id, productId, rating = 4.5, reviews = 128, isNew = false, isFeatured = false } = product;
  const displayImage = image || images?.[0] || "";

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  // Modern, vibrant color palette
  const cardBg = useColorModeValue("white", "gray.900");
  const cardBorder = useColorModeValue("gray.100", "gray.800");
  const imageBg = useColorModeValue("gray.50", "gray.800");
  const textPrimary = useColorModeValue("gray.800", "white");
  const textMuted = useColorModeValue("gray.500", "gray.400");
  const actionButtonBg = useColorModeValue("white", "gray.800");
  const accentColor = "pink.500";
  const gradientStart = "pink.500";
  const gradientEnd = "purple.500";

  const { showAddToCartToast } = useCartToast();
  const { cartStore } = stores;

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    const imgs = images?.length > 0 ? images : [displayImage].filter(Boolean);
    setSelectedImages(imgs);
    onOpen();
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await cartStore.addToCart(product);
    showAddToCartToast(product);
  };

  const navigateToProduct = () => {
    router.push(`/product?productId=${productId || _id}`);
  };

  const categoryName = typeof category === "object" ? category?.name : category || "COLLECTION";

  // Format price with currency
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <Box
      cursor="pointer"
      onClick={navigateToProduct}
      role="group"
      h="100%"
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      position="relative"
      sx={{
        '@media (max-width: 480px)': {
          width: '100%',
        }
      }}
    >
      {/* Premium Card Container */}
      <Box
        position="relative"
        bg={cardBg}
        borderRadius="2xl"
        overflow="hidden"
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        boxShadow={isHovered ? "xl" : "sm"}
        transform={isHovered ? "translateY(-4px)" : "translateY(0)"}
        height="100%"
        _hover={{
          boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)",
        }}
      >
        {/* Badge Container */}
        <Box position="absolute" top={3} left={3} zIndex={2} display="flex" gap={2} flexWrap="wrap">
          {isNew && (
            <Badge
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              color="white"
              borderRadius="full"
              px={3}
              py={1}
              fontSize="10px"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="0.5px"
            >
              ✨ New
            </Badge>
          )}
          {isFeatured && (
            <Badge
              bg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
              color="white"
              borderRadius="full"
              px={3}
              py={1}
              fontSize="10px"
              fontWeight="bold"
              textTransform="uppercase"
            >
              🔥 Featured
            </Badge>
          )}
          {price < 1000 && (
            <Badge
              bg="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
              color="white"
              borderRadius="full"
              px={3}
              py={1}
              fontSize="10px"
              fontWeight="bold"
            >
              💝 Best Deal
            </Badge>
          )}
        </Box>

        {/* Image Section */}
        <Box
          position="relative"
          overflow="hidden"
          bg={imageBg}
        >
          <AspectRatio ratio={1}>
            <Image
              src={displayImage}
              alt={name}
              objectFit="cover"
              transition="transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
              transform={isHovered ? "scale(1.05)" : "scale(1)"}
              fallbackSrc="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=80"
            />
          </AspectRatio>

          {/* Overlay on Hover */}
          <Box
            position="absolute"
            inset={0}
            bg="rgba(0,0,0,0.3)"
            opacity={isHovered ? 1 : 0}
            transition="opacity 0.3s ease"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <HStack spacing={3}>
              <IconButton
                aria-label="Quick view"
                icon={<FiEye size={20} />}
                bg="white"
                color="gray.800"
                borderRadius="full"
                size="lg"
                onClick={handleQuickView}
                _hover={{ bg: accentColor, color: "white", transform: "scale(1.1)" }}
                transition="all 0.2s"
              />
              <IconButton
                aria-label="Add to cart"
                icon={<FiShoppingBag size={20} />}
                bg="white"
                color="gray.800"
                borderRadius="full"
                size="lg"
                onClick={handleAddToCart}
                _hover={{ bg: accentColor, color: "white", transform: "scale(1.1)" }}
                transition="all 0.2s"
              />
            </HStack>
          </Box>
        </Box>

        {/* Product Info */}
        <VStack align="flex-start" spacing={2} p={4}>
          {/* Category with verified icon */}
          <HStack spacing={2}>
            <Text
              fontSize="11px"
              color="pink.500"
              fontWeight="700"
              letterSpacing="0.5px"
              textTransform="uppercase"
            >
              {categoryName}
            </Text>
            <Icon as={MdVerified} color="blue.500" boxSize={3} />
          </HStack>

          {/* Product Name */}
          <Heading
            fontSize={{ base: "md", sm: "lg" }}
            fontWeight="600"
            color={textPrimary}
            noOfLines={2}
            lineHeight="1.4"
            transition="color 0.2s ease"
            _groupHover={{ color: accentColor }}
          >
            {name}
          </Heading>

          {/* Rating Section */}
          <HStack spacing={1}>
            <Icon as={FiStar} color="yellow.400" boxSize={3.5} fill="yellow.400" />
            <Text fontSize="12px" fontWeight="600" color={textPrimary}>
              {rating}
            </Text>
            <Text fontSize="11px" color={textMuted}>
              ({reviews} reviews)
            </Text>
          </HStack>

          {/* Price */}
          <Text
            fontSize="22px"
            fontWeight="800"
            bgGradient={`linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`}
            bgClip="text"
            letterSpacing="-0.5px"
          >
            {formattedPrice}
          </Text>

          {/* Delivery Info */}
          <HStack spacing={3} pt={1}>
            <Flex align="center" gap={1}>
              <Icon as={FiTruck} boxSize={3} color="green.500" />
              <Text fontSize="10px" color="green.600" fontWeight="500">
                Free Delivery
              </Text>
            </Flex>
            <Flex align="center" gap={1}>
              <Icon as={FiShield} boxSize={3} color="blue.500" />
              <Text fontSize="10px" color="blue.600" fontWeight="500">
                Secure
              </Text>
            </Flex>
          </HStack>

          {/* Add to Cart Button (Mobile Friendly) */}
          <Box
            w="full"
            mt={2}
            display={{ base: 'block', md: 'none' }}
          >
            <Flex
              as="button"
              onClick={handleAddToCart}
              align="center"
              justify="center"
              gap={2}
              w="full"
              py={2.5}
              px={4}
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              color="white"
              borderRadius="full"
              fontWeight="bold"
              fontSize="sm"
              transition="all 0.2s"
              _active={{ transform: "scale(0.98)" }}
            >
              <FiShoppingBag size={16} />
              Add to Cart
            </Flex>
          </Box>
        </VStack>

        {/* Floating Like Button */}
        <Box
          position="absolute"
          top={3}
          right={3}
          zIndex={3}
          onClick={(e) => e.stopPropagation()}
        >
          <ProductLikeButton product={product} />
        </Box>
      </Box>

      <ImageViewerWithModal
        isOpen={isOpen}
        onClose={onClose}
        images={selectedImages}
      />
    </Box>
  );
};

export default ProductCard;