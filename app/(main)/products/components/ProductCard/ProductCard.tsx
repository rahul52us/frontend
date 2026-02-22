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

  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
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
    router.push(`/product/${productId || _id}`);
  };

  const categoryName = typeof category === "object" ? category?.name : category || "COLLECTION";

  return (
    <Box
      cursor="pointer"
      onClick={navigateToProduct}
      role="group"
      h="100%"
      transition="all 0.4s ease"
    >
      <Card
        variant="unstyled"
        bg={cardBg}
        borderRadius="40px" // More pronounced, luxurious radius
        border="1.5px solid" // More substantial border
        borderColor={cardBorder}
        p={3} // Better "Cradle" padding
        transition="all 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
        shadow="0 20px 40px -15px rgba(0,0,0,0.06)" // Sophisticated shadow
        h="100%"
        _hover={{
          transform: "translateY(-12px)",
          shadow: "0 50px 100px -20px rgba(0,0,0,0.15)",
          borderColor: "gray.300"
        }}
      >
        <CardBody p={0} display="flex" flexDirection="column">
          <VStack spacing={6} align="stretch" h="full">
            {/* Image Frame - Perfectly Cradled */}
            <Box
              position="relative"
              overflow="hidden"
              borderRadius="30px" // Inner radius harmony
              bg="gray.50"
            >
              <AspectRatio ratio={1}>
                <Image
                  src={displayImage}
                  alt={name}
                  objectFit="cover"
                  transition="transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)"
                  _groupHover={{ transform: "scale(1.1)" }}
                  fallbackSrc="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=80"
                />
              </AspectRatio>

              {/* Action Buttons - Corner High-End Feel */}
              <VStack position="absolute" top={4} right={4} spacing={2} zIndex={2}>
                <IconButton
                  aria-label="Quick view"
                  icon={<FiEye size={18} />}
                  bg="white"
                  color="gray.900"
                  borderRadius="full"
                  size="md"
                  opacity={0}
                  transform="translateX(20px)"
                  _groupHover={{ opacity: 1, transform: "translateX(0)" }}
                  transition="all 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
                  onClick={handleQuickView}
                  shadow="lg"
                  _hover={{ bg: "gray.900", color: "white" }}
                />
                <IconButton
                  aria-label="Add to cart"
                  icon={<FiShoppingBag size={18} />}
                  bg="white"
                  color="gray.900"
                  borderRadius="full"
                  size="md"
                  opacity={0}
                  transform="translateX(20px)"
                  _groupHover={{ opacity: 1, transform: "translateX(0)", transitionDelay: "0.1s" }}
                  transition="all 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
                  onClick={handleAddToCart}
                  shadow="lg"
                  _hover={{ bg: accentColor, color: "white" }}
                />
              </VStack>
            </Box>

            {/* Structured Label Details */}
            <VStack align="center" spacing={4} px={5} pb={6} flex={1} textAlign="center">
              <VStack spacing={2}>
                <Text
                  fontSize="xs"
                  color={accentColor}
                  fontWeight="900"
                  letterSpacing="0.4em"
                  textTransform="uppercase"
                >
                  {categoryName}
                </Text>

                <Heading
                  fontSize="lg"
                  fontWeight="900"
                  color={textPrimary}
                  noOfLines={2}
                  letterSpacing="-0.03em"
                  lineHeight="1.1"
                >
                  {name}
                </Heading>
              </VStack>

              <HStack spacing={4} mt="auto">
                <Box h="1px" w="20px" bg="gray.100" />
                <Text
                  fontSize="2xl"
                  fontWeight="900"
                  color={textPrimary}
                  letterSpacing="-0.05em"
                >
                  ₹{price?.toLocaleString()}
                </Text>
                <Box h="1px" w="20px" bg="gray.100" />
              </HStack>
            </VStack>
          </VStack>
        </CardBody>
      </Card>

      <ImageViewerWithModal
        isOpen={isOpen}
        onClose={onClose}
        images={selectedImages}
      />
    </Box>
  );
};

export default ProductCard;
