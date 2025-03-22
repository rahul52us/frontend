import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiEye, FiHeart } from "react-icons/fi";
import ImageViewerWithModal from "../../../../component/config/component/viewer/ImageViewerWithModal";

const ProductCard = ({ product }: any) => {
  const { image, category, name, price } = product;
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal state management
  const [selectedImage, setSelectedImage] = useState<any>([]); // State to hold the selected image for ImageViewer

  const handleImageClick = () => {
    setSelectedImage([image]); // Set the selected image when the image is clicked
    onOpen(); // Open the ImageViewer modal
  };

  return (
    <Box
      h="350px" // Fixed height
      shadow="base"
      position="relative"
      bg="white"
      borderWidth="1px"
      borderColor="gray.100"
      borderRadius="xl"
      overflow="hidden"
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-6px)",
        shadow: "lg",
      }}
      role="group"
      w="100%"
    >
      <Box position="relative" overflow="hidden" borderRadius="lg">
        <Image
          src={image}
          alt={name}
          objectFit="cover"
          width="100%"
          height={{ base: "180px", md: "200px" }}
          transition="transform 0.5s ease"
          _groupHover={{
            transform: "scale(1.1)",
          }}
        />
        <Flex
          position="absolute"
          bottom="3"
          right="3"
          gap={2}
          opacity={0}
          transition="opacity 0.2s ease"
          _groupHover={{
            opacity: 1,
          }}
        >
          <IconButton
            aria-label="Quick view"
            icon={<FiEye />}
            size="sm"
            borderRadius="full"
            bg="blackAlpha.700"
            color="white"
            _hover={{ bg: "blackAlpha.800" }}
            onClick={handleImageClick} // Open ImageViewer modal on button click
          />
          <IconButton
            aria-label="Add to wishlist"
            icon={<FiHeart />}
            size="sm"
            borderRadius="full"
            bg="blackAlpha.700"
            color="white"
            _hover={{ bg: "blackAlpha.800" }}
          />
        </Flex>
      </Box>
      <Box px={4} py={3}>
        <HStack justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
              {category}
            </Text>
            <Heading
              fontSize={{ base: "md", md: "lg" }}
              mb={2}
              minH={"40px"}
              fontWeight="600"
              noOfLines={2} // Limit title to 2 lines
            >
              {name}
            </Heading>
          </Box>
        </HStack>
        <Flex mt={1} justifyContent="space-between" alignItems="end">
          <Box>
            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="700" color="brand.600">
              ₹{price}
            </Text>

          </Box>
          <Button
          mt={3}
          // w="100%"
          colorScheme="purple"
          variant={'outline'}
          size="sm"
          onClick={() => alert("Added to cart!")} // Add functionality here
        >
          Add
        </Button>
        </Flex>
      </Box>
      {/* ImageViewer Modal */}
      <ImageViewerWithModal
        isOpen={isOpen}
        onClose={onClose}
        images={selectedImage}
      />
    </Box>
  );
};

export default ProductCard;