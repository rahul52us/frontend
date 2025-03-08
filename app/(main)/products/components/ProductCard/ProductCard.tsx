import { StarIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, HStack, IconButton, Image, Text } from "@chakra-ui/react";
import { FiEye, FiHeart } from "react-icons/fi";

const ProductCard = ({ product }) => {
  const { image, category, name, price, rating, freeShipping } = product;

  return (
    <Box
    //   mx={'auto'}
      // my={12}
      h={'100%'}
      shadow={'base'}
      position="relative"
      bg="white"
      borderWidth="1px"
      borderColor="gray.100"
      borderRadius="xl"
      transition="all 0.5s"
      _hover={{
        transform: "translateY(-4px)",
      }}
      role="group"
    //   maxW={'xs'}
    >
      <Box
        position="relative"
        overflow="hidden"
        borderRadius="lg"
        mb={2}
      >
        <Image
          src={image}
          alt={name}
          objectFit="cover"
          width="100%"
          height="200px"
          transition="transform 2s"
          _groupHover={{
            transform: "scale(1.15)",
          }}
        />
        <Flex
          position="absolute"
          bottom="2"
          right="2"
          gap={2}
          opacity={0}
          transition="opacity 0.2s"
          _groupHover={{
            opacity: 1,
          }}
        >
          <IconButton
            aria-label="Quick view"
            icon={<FiEye />}
            size="sm"
            borderRadius="full"
            bg={'blackAlpha.600'}
          />
          <IconButton
            aria-label="Add to wishlist"
            icon={<FiHeart />}
            size="sm"
            borderRadius="full"
            bg={'blackAlpha.600'}
          />
        </Flex>
      </Box>
      <Box px={4} py={2}>
        <HStack justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>{category}</Text>
            <Heading fontSize={'lg'} mb={1} fontWeight="600">{name}</Heading>
          </Box>
        </HStack>
        <Flex mt={2} justifyContent="space-between" alignItems="center">
          <Box>
            <Text fontSize="xl" fontWeight="700" color="brand.100">
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