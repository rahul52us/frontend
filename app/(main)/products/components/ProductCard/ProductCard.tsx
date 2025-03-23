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
import { FiEye, FiHeart } from "react-icons/fi";
import ImageViewerWithModal from "../../../../component/config/component/viewer/ImageViewerWithModal";
import { useRouter } from "next/navigation";

const ProductCard = ({ product }: any) => {
  const router = useRouter();
  const { image, category, name, price } = product;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<any>([]);

  // Static discount price for now
  const discountPrice = 499; // Example static value
  // Calculate discount percentage statically
  const discountPercentage = Math.round(((price - discountPrice) / price) * 100);

  const handleImageClick = () => {
    setSelectedImage([image]);
    onOpen();
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
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)", // Slightly deeper shadow
        borderColor: "gray.300",
      }}
      role="group"
      w="100%"
    >
      <Box position="relative" h="180px">
        <Image
          src={image}
          alt={name}
          objectFit="cover"
          w="100%"
          h="100%"
          transition="all 0.3s ease"
          _groupHover={{
            filter: "brightness(1.1) contrast(1.03)", // Enhanced image pop
          }}
        />
        {/* Stylish Gradient Discount Badge */}
        <Box
          position="absolute"
          top="0"
          left="0"
          bgGradient="linear(to-r, purple.600, purple.800)" // Gradient for flair
          color="white"
          fontSize="xs"
          fontWeight="bold"
          px={2.5}
          py={1}
          borderRadius="0 0 6px 0" // Slightly larger curve
          transform="translate(-1px, -1px)"
          boxShadow="0 2px 6px rgba(0, 0, 0, 0.25)" // Deeper shadow
          textTransform="uppercase"
          letterSpacing="wide" // Stylish spacing
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
            borderRadius="full" // Circular for a modern touch
            bg="white"
            color="gray.700"
            border="1px solid"
            borderColor="gray.200"
            _hover={{ bg: "gray.50", color: "purple.600" }} // Tie to theme
            onClick={handleImageClick}
          />
          <IconButton
            aria-label="Add to wishlist"
            icon={<FiHeart />}
            size="sm"
            borderRadius="full"
            bg="white"
            color="gray.700"
            border="1px solid"
            borderColor="gray.200"
            _hover={{ bg: "gray.50", color: "red.500" }}
          />
        </Flex>
      </Box>
      <Box px={4} py={4} h="160px" display="flex" flexDir="column" justifyContent="space-between">
        <Box>
          <Text fontSize="xs" color="gray.600" fontWeight="medium" textTransform="uppercase" mb={2}>
            {category}
          </Text>
          <Heading
            fontSize={{ base: "md", md: "lg" }} // Responsive size
            fontWeight="semibold"
            minH="40px"
            cursor="pointer"
            onClick={() => router.push("individual-product")}
            noOfLines={2}
            color="gray.900" // Darker for contrast
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
              color="gray.500" // Slightly darker gray
              textDecoration="line-through"
            >
              ₹{price}
            </Text>
            <Text fontSize="lg" fontWeight="extrabold" color="purple.700">
              ₹{discountPrice}
            </Text>
          </Box>
          <Button
            size="sm"
            colorScheme="purple"
            variant="solid"
            borderRadius="full" // Circular button
            px={5} // Wider for balance
            bg="purple.600"
            fontWeight="semibold"
            _hover={{ bg: "purple.700", transform: "scale(1.05)" }} // Subtle scale
            _active={{ bg: "purple.800" }}
            onClick={() => alert("Added to cart!")}
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