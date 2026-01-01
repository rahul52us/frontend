"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Text,
  useDisclosure,
  Badge,
  VStack,
  useColorModeValue,
  Circle,
  HStack,
  Tooltip,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiEye, FiHeart, FiShoppingBag } from "react-icons/fi";
import ImageViewerWithModal from "../../../../component/config/component/viewer/ImageViewerWithModal";
import { useRouter } from "next/navigation";
import { keyframes } from "@emotion/react";

const pulse = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(72, 187, 120, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(72, 187, 120, 0); }
`;

// FIX: Updated interface to accept number OR string for price
interface ProductCardProps {
  product: {
    id?: string | number; // Added to match the key usage in ShopPage
    image: string;
    category: string;
    name: string;
    price: number | string; 
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter();
  const { image, category, name, price } = product;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<string[]>([]);

  // FIX: Safety check to ensure price is treated as a number for calculations
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;
  
  const discountPrice = 499;
  // Calculate percentage only if price is valid and greater than discount
  const discountPercentage = numericPrice > 0 
    ? Math.round(((numericPrice - discountPrice) / numericPrice) * 100) 
    : 0;

  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");
  const borderColor = useColorModeValue("gray.50", "whiteAlpha.100");

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage([image]);
    onOpen();
  };

  return (
    <Box
      position="relative"
      role="group"
      h="440px"
      w="100%"
      bg={cardBg}
      borderRadius="30px"
      overflow="hidden"
      transition="all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
      border="1px solid"
      borderColor={borderColor}
      _hover={{
        transform: "translateY(-12px)",
        boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box position="relative" h="240px" overflow="hidden">
        <Image
          src={image}
          alt={name}
          objectFit="cover"
          w="100%"
          h="100%"
          cursor="pointer"
          onClick={() => router.push("individual-product")}
          transition="transform 1.2s cubic-bezier(0.19, 1, 0.22, 1)"
          _groupHover={{ transform: "scale(1.12)" }}
        />

        <Badge
          position="absolute"
          top="4"
          left="4"
          variant="solid"
          bg="whiteAlpha.900"
          backdropFilter="blur(10px)"
          color="gray.800"
          px={3}
          py={1}
          borderRadius="full"
          fontSize="10px"
          fontWeight="bold"
          textTransform="uppercase"
          letterSpacing="wider"
        >
          {category}
        </Badge>

        <Flex
          position="absolute"
          inset="0"
          bg="blackAlpha.200"
          opacity={0}
          transition="all 0.3s ease"
          _groupHover={{ opacity: 1 }}
          align="center"
          justify="center"
          gap={3}
        >
          <Tooltip label="Quick View" hasArrow>
            <Circle
              size="46px"
              bg="white"
              color="purple.600"
              cursor="pointer"
              onClick={handleImageClick}
              transition="0.2s"
              _hover={{ transform: "scale(1.1)", bg: "purple.600", color: "white" }}
            >
              <FiEye size="20px" />
            </Circle>
          </Tooltip>
          <Tooltip label="Add to Wishlist" hasArrow>
            <Circle
              size="46px"
              bg="white"
              color="red.400"
              cursor="pointer"
              transition="0.2s"
              _hover={{ transform: "scale(1.1)", bg: "red.400", color: "white" }}
            >
              <FiHeart size="20px" />
            </Circle>
          </Tooltip>
        </Flex>
      </Box>

      <Box px={6} py={5}>
        <VStack align="start" spacing={1} mb={4}>
          <HStack spacing={2}>
            <Box
              w="8px"
              h="8px"
              bg="green.400"
              borderRadius="full"
              animation={`${pulse} 2s infinite`}
            />
            <Text fontSize="10px" fontWeight="black" color="gray.400" letterSpacing="1px">
              IN STOCK
            </Text>
          </HStack>
          <Heading
            fontSize="lg"
            fontWeight="bold"
            color={textColor}
            noOfLines={1}
            cursor="pointer"
            onClick={() => router.push("individual-product")}
            _hover={{ color: "purple.500" }}
          >
            {name}
          </Heading>
        </VStack>

        <Flex justify="space-between" align="flex-end">
          <VStack align="start" spacing={0}>
            <HStack align="center" spacing={2}>
                <Text fontSize="xs" color="gray.400" textDecoration="line-through">
                ₹{price}
                </Text>
                {discountPercentage > 0 && (
                  <Badge colorScheme="purple" variant="subtle" borderRadius="md" fontSize="9px">
                      -{discountPercentage}%
                  </Badge>
                )}
            </HStack>
            <Text fontSize="2xl" fontWeight="900" color="purple.600" letterSpacing="-1px">
              ₹{discountPrice}
            </Text>
          </VStack>

          <Button
            leftIcon={<FiShoppingBag />}
            size="lg"
            bg="purple.600"
            color="white"
            borderRadius="18px"
            px={7}
            fontSize="sm"
            fontWeight="bold"
            boxShadow="0 10px 20px -10px rgba(128, 90, 213, 0.6)"
            _hover={{
              bg: "purple.700",
              transform: "translateY(-2px)",
              boxShadow: "0 15px 30px -10px rgba(128, 90, 213, 0.7)",
            }}
            _active={{ transform: "scale(0.95)" }}
            onClick={(e) => {
              e.stopPropagation();
              alert("Added to cart!");
            }}
          >
            Add
          </Button>
        </Flex>

        <Box 
            mt={5} 
            opacity={0} 
            transform="translateY(10px)" 
            transition="0.4s ease" 
            _groupHover={{ opacity: 1, transform: "translateY(0)" }}
        >
            <Flex justify="space-between" align="center" mb={1.5}>
                <Text fontSize="10px" fontWeight="bold" color="orange.500">LIMITED QUANTITY</Text>
                <Text fontSize="10px" fontWeight="bold" color="gray.400">8 LEFT</Text>
            </Flex>
            <Box w="100%" h="4px" bg="gray.100" borderRadius="full">
                <Box w="30%" h="100%" bg="orange.400" borderRadius="full" />
            </Box>
        </Box>
      </Box>

      <Box
        position="absolute"
        bottom="0"
        left="0"
        h="6px"
        w="0%"
        bgGradient="linear(to-r, purple.400, pink.400, orange.400)"
        transition="all 0.8s cubic-bezier(0.23, 1, 0.32, 1)"
        _groupHover={{ w: "100%" }}
      />

      <ImageViewerWithModal isOpen={isOpen} onClose={onClose} images={selectedImage} />
    </Box>
  );
};

export default ProductCard;