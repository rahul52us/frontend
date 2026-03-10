import {
  Card,
  CardBody,
  Stack,
  Text,
  Image,
  Flex,
  IconButton,
  AspectRatio,
  Box,
  useColorModeValue,
  HStack,
  Icon,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiEye, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import ImageViewerWithModal from "../../../../component/config/component/viewer/ImageViewerWithModal";
import { useRouter } from "next/navigation";
import stores from "../../../../store/stores";
import ProductLikeButton from "./ProductLikeButton";
import { useCartToast } from "../../../../hooks/useCartToast";
import { useDisclosure } from "@chakra-ui/react";

const ProductCard = ({ product }: any) => {
  const router = useRouter();

  const { image, images, category, name, price, _id, productId } = product;
  const displayImage = image || images?.[0] || "";

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const cardBg = useColorModeValue("white", "gray.900");
  const cardBorder = useColorModeValue("gray.100", "gray.800");
  const textPrimary = useColorModeValue("gray.900", "white");
  const accentColor = "purple.500";

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

  return (
    <Box
      cursor="pointer"
      onClick={navigateToProduct}
      role="group"
      h="100%"
      transition="all 0.4s ease"
      border="1px solid"
      borderColor={cardBorder}
      bg={cardBg}
      p={2} // Internal frame spacing
      _hover={{
        shadow: "0 30px 60px -20px rgba(0,0,0,0.1)",
        transform: "translateY(-4px)",
        borderColor: "gray.300"
      }}
    >
      <VStack spacing={6} align="stretch" h="full">
        {/* Editorial Frame - Sharp Edges, Minimalist presence */}
        <Box
          position="relative"
          overflow="hidden"
          borderRadius="0" // Sharp Modern Minimalist
          bg="gray.50"
          transition="all 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
        >
          <AspectRatio ratio={1}>
            <Image
              src={displayImage}
              alt={name}
              objectFit="cover"
              transition="transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)"
              _groupHover={{ transform: "scale(1.05)" }}
              fallbackSrc="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=80"
            />
          </AspectRatio>

          {/* Action Tools - Discreet Strip */}
          <VStack
            position="absolute"
            top={0}
            right={0}
            spacing={0}
            zIndex={2}
            opacity={0}
            _groupHover={{ opacity: 1 }}
            transition="all 0.3s"
          >
            <IconButton
              aria-label="Quick view"
              icon={<FiEye size={18} />}
              bg="white"
              color="gray.900"
              borderRadius="0"
              size="md"
              onClick={handleQuickView}
              _hover={{ bg: "gray.900", color: "white" }}
            />
            <IconButton
              aria-label="Add to cart"
              icon={<FiShoppingBag size={18} />}
              bg="white"
              color="gray.900"
              borderRadius="0"
              size="md"
              onClick={handleAddToCart}
              _hover={{ bg: accentColor, color: "white" }}
            />
          </VStack>

          {/* Bottom Reveal Border */}
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            h="2px"
            bg={accentColor}
            transform="scaleX(0)"
            transformOrigin="left"
            transition="transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
            _groupHover={{ transform: "scaleX(1)" }}
          />
        </Box>

        {/* Left-Aligned Editorial Details */}
        <VStack align="flex-start" spacing={3} px={2} pb={4} flex={1}>
          <VStack align="flex-start" spacing={1}>
            <Text
              fontSize="9px"
              color={accentColor}
              fontWeight="900"
              letterSpacing="0.4em"
              textTransform="uppercase"
            >
              {categoryName}
            </Text>

            <Heading
              fontSize="md"
              fontWeight="800"
              color={textPrimary}
              noOfLines={2}
              letterSpacing="-0.02em"
              lineHeight="1.2"
              transition="all 0.3s"
              _groupHover={{ color: accentColor }}
            >
              {name}
            </Heading>
          </VStack>

          <HStack justify="space-between" w="full" align="flex-end">
            <Text
              fontSize="xl"
              fontWeight="400"
              color={textPrimary}
              letterSpacing="-0.02em"
              fontFamily="monospace"
            >
              ₹{price?.toLocaleString()}
            </Text>

            <Icon
              as={FiArrowRight}
              color="gray.200"
              _groupHover={{ color: accentColor, transform: "translateX(4px)" }}
              transition="all 0.3s"
            />
          </HStack>
        </VStack>
      </VStack>

      <ImageViewerWithModal
        isOpen={isOpen}
        onClose={onClose}
        images={selectedImages}
      />
    </Box>
  );
};

export default ProductCard;
