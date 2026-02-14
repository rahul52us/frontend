import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiEye } from "react-icons/fi";
import ImageViewerWithModal from "../../../../component/config/component/viewer/ImageViewerWithModal";
import { useRouter } from "next/navigation";
import stores from "../../../../store/stores";

import ProductLikeButton from "./ProductLikeButton";
import { useCartToast } from "../../../../hooks/useCartToast";

const ProductCard = ({ product }: any) => {
  const router = useRouter();
  const { image, images, category, name, price, _id, productId } = product;
  const displayImage = image || (images && images.length > 0 ? images[0] : "");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<any>([]);

  // Static discount price for now
  const discountPrice = 499; // Example static value
  // Calculate discount percentage statically
  const discountPercentage = Math.round(((price - discountPrice) / price) * 100);

  const handleImageClick = () => {
    const imagesToShow =
      images && images.length > 0 ? images : [displayImage].filter(Boolean);
    setSelectedImage(imagesToShow);
    onOpen();
  };

  const { showAddToCartToast } = useCartToast();
  const { cartStore } = stores;

  const handleAddToCart = async () => {
    await cartStore.addToCart(product);
    showAddToCartToast(product);
  };

  return (
    <Box
      h="350px"
      bg="white"
      borderRadius="2xl"
      overflow="hidden"
      boxShadow="sm"
      transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
      _hover={{
        boxShadow: "2xl",
        transform: "translateY(-6px)",
      }}
      role="group"
      position="relative"
    >
      <Box position="relative" h="180px">
        <Image
          src={displayImage}
          alt={name}
          objectFit="cover"
          w="100%"
          h="100%"
          transition="all 0.3s ease"
          _groupHover={{
            filter: "brightness(1.1) contrast(1.03)",
          }}
        />
        <Box
          position="absolute"
          top="0"
          left="0"
          bgGradient="linear(to-r, purple.600, purple.800)"
          color="white"
          fontSize="xs"
          fontWeight="bold"
          px={2.5}
          py={1}
          borderRadius="0 0 6px 0"
          transform="translate(-1px, -1px)"
          boxShadow="0 2px 6px rgba(0, 0, 0, 0.25)"
          textTransform="uppercase"
          letterSpacing="wide"
        >
          {discountPercentage}% Off
        </Box>
        <Flex
          position="absolute"
          top="2"
          right="2"
          gap={1.5}
          opacity={0}
          transition="opacity 0.25s ease"
          _groupHover={{
            opacity: 1,
          }}
        >
          <IconButton
            aria-label="Quick view"
            icon={<FiEye />}
            size="sm"
            borderRadius="full"
            bg="white"
            color="gray.700"
            border="1px solid"
            borderColor="gray.200"
            _hover={{ bg: "gray.50", color: "purple.600" }}
            onClick={handleImageClick}
          />
          <ProductLikeButton product={product} />
        </Flex>
      </Box>
      <Box px={4} py={4} h="160px" display="flex" flexDir="column" justifyContent="space-between">
        <Box>
          <Text fontSize="xs" color="gray.600" fontWeight="medium" textTransform="uppercase" mb={2}>
            {typeof category === 'object' ? category?.name : category}
          </Text>
          <Heading
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="semibold"
            minH="40px"
            cursor="pointer"
            onClick={() => router.push(`/product/${productId || _id}`)}
            noOfLines={2}
            color="gray.900"
            _hover={{ color: "purple.700" }}
          >
            {name}
          </Heading>
        </Box>
        <Flex justify="space-between" align="center">
          <Box>
            <Text
              fontSize="sm"
              fontWeight="medium"
              color="gray.500"
              textDecoration="line-through"
            >
              ₹{price}
            </Text>
            <Text fontSize="lg" fontWeight="extrabold" color="purple.700">
              ₹{price - discountPrice}
            </Text>
          </Box>
          <Button
            size="sm"
            colorScheme="purple"
            variant="solid"
            borderRadius="full"
            px={5}
            bg="purple.600"
            fontWeight="semibold"
            _hover={{ bg: "purple.700", transform: "scale(1.05)" }}
            _active={{ bg: "purple.800" }}
            onClick={handleAddToCart}
          >
            Add
          </Button>
        </Flex>
      </Box>
      <ImageViewerWithModal isOpen={isOpen} onClose={onClose} images={selectedImage} />
    </Box>
  );
};

export default ProductCard;