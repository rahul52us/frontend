import { StarIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, HStack, IconButton, Image, Text } from "@chakra-ui/react";
import { FiEye, FiHeart } from "react-icons/fi";

const ProductCard = ({ product }) => {
  const { image, category, name, price, rating, freeShipping } = product;

  return (
    <Box
      h="100%"
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
      maxW={{ base: "100%", sm: "300px", md: "280px" }} // Consistent card width
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
            <Heading fontSize={{ base: "md", md: "lg" }} mb={2} fontWeight="600" noOfLines={2}>
              {name}
            </Heading>
          </Box>
        </HStack>
        <Flex mt={2} justifyContent="space-between" alignItems="center">
          <Box>
            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="700" color="brand.600">
              ₹{price}
            </Text>
            {freeShipping && (
              <Text fontSize="sm" color="green.500" mt={1}>
                Free Shipping
              </Text>
            )}
          </Box>
          <HStack spacing={1}>
            {Array(5)
              .fill('')
              .map((_, i) => (
                <StarIcon
                  key={i}
                  boxSize={4}
                  color={i < rating ? 'yellow.400' : 'gray.300'}
                />
              ))}
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
};

export default ProductCard;