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
} from "@chakra-ui/react";
import { useState } from "react";
import { FiEye, FiShoppingBag } from "react-icons/fi";
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

  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textPrimary = useColorModeValue("gray.800", "gray.100");
  const textSecondary = useColorModeValue("gray.500", "gray.400");

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
    router.push(`/product/${productId || _id}`);
  };

  return (
    <Card
      variant="outline"
      borderColor={borderColor}
      borderRadius="md"
      overflow="hidden"
      cursor="pointer"
      onClick={navigateToProduct}
      role="group"
      _hover={{ borderColor: "gray.300" }}
      h="100%"
    >
      <CardBody p={0}>
        {/* Image */}
        <Box position="relative">
          <AspectRatio ratio={1}>
            <Image
              src={displayImage}
              alt={name}
              objectFit="cover"
            />
          </AspectRatio>

          {/* Like Button */}
          <Box position="absolute" top={2} right={2}>
            <ProductLikeButton product={product} />
          </Box>

          {/* Small Action Icons */}
          <Flex
            position="absolute"
            bottom={2}
            right={2}
            gap={1}
            opacity={{ base: 1, md: 0 }}
            _groupHover={{ opacity: 1 }}
            transition="0.2s"
          >
            <IconButton
              aria-label="Quick view"
              icon={<FiEye size={14} />}
              size="xs"
              variant="ghost"
              bg="whiteAlpha.800"
              onClick={handleQuickView}
            />

            <IconButton
              aria-label="Add to cart"
              icon={<FiShoppingBag size={14} />}
              size="xs"
              variant="ghost"
              bg="whiteAlpha.800"
              onClick={handleAddToCart}
            />
          </Flex>
        </Box>

        {/* Content */}
        <Stack spacing={1} p={3}>
          <Text
            fontSize="xs"
            color={textSecondary}
            textTransform="uppercase"
          >
            {typeof category === "object"
              ? category?.name
              : category || ""}
          </Text>

          <Text
            fontSize="sm"
            fontWeight="medium"
            color={textPrimary}
            noOfLines={2}
          >
            {name}
          </Text>

          <Text fontSize="sm" fontWeight="semibold">
            ₹{price?.toLocaleString()}
          </Text>
        </Stack>
      </CardBody>

      <ImageViewerWithModal
        isOpen={isOpen}
        onClose={onClose}
        images={selectedImages}
      />
    </Card>
  );
};

export default ProductCard;
