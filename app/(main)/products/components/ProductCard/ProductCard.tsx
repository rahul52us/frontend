import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Image,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiEye, FiHeart } from "react-icons/fi";
import ImageViewerWithModal from "../../../../component/config/component/viewer/ImageViewerWithModal";
import { useRouter } from "next/navigation";
import stores from "../../../../store/stores";
import { CheckCircleIcon } from "@chakra-ui/icons";
import ProductLikeButton from "./ProductLikeButton";

const ProductCard = ({ product }: any) => {
  const router = useRouter();
  const { image, images, category, name, price, _id } = product;
  const displayImage = image || (images && images.length > 0 ? images[0] : "");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
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

  const { cartStore } = stores;

  const handleAddToCart = async () => {
    await cartStore.addToCart(product);
    toast({
      position: "bottom",
      duration: 3000,
      isClosable: true,
      render: () => (
        <Box
          p={4}
          bg="green.50"
          boxShadow="md"
          borderRadius="lg"
          border="1px solid"
          borderColor="green.200"
          display="flex"
          alignItems="center"
          gap={4}
          minW="320px"
          maxW="400px"
          _hover={{ boxShadow: "xl" }}
          transition="box-shadow 0.2s ease-in-out"
        >
          <CheckCircleIcon color="green.500" boxSize={6} />
          <Image
            src={displayImage}
            alt={name}
            boxSize="60px"
            objectFit="cover"
            borderRadius="lg"
            border="1px solid"
            borderColor="green.100"
          />
          <Box>
            <Text color="green.800" fontWeight="semibold" fontSize="md">
              Added to Cart
            </Text>
            <Text color="gray.700" fontSize="sm" noOfLines={1} maxW="240px">
              {name}
            </Text>
          </Box>
        </Box>
      ),
    });
  };

  return (
    <Box
      h="340px"
      maxW="100%"
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.3s ease"
      _hover={{
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        borderColor: "gray.300",
      }}
      role="group"
      w="100%"
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
            {category}
          </Text>
          <Heading
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="semibold"
            minH="40px"
            cursor="pointer"
            onClick={() => router.push(`/product/${_id}`)}
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