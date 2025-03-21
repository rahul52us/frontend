import { Box, Flex, Skeleton, SkeletonText } from "@chakra-ui/react";

const ProductCardSkeleton = () => {
  const startColor = "purple.50";
  const endColor = "purple.100";
  return (
    <Box
      h="330px" // Fixed height to match the ProductCard
      shadow="base"
      bg="white"
      borderRadius="xl"
      w="100%"
    >
      {/* Image Skeleton */}
      <Skeleton
        width="100%"
        height={{ base: "180px", md: "200px" }}
        rounded={"xl"}
        startColor={startColor}
        endColor={endColor}
      />

      {/* Content Skeleton */}
      <Box px={4} py={3}>
        <Flex justifyContent="space-between" alignItems="flex-start">
          <Box w="100%">
            {/* Category Skeleton */}
            <Skeleton
              height="14px"
              width="40%"
              mb={2}
              startColor={startColor}
              endColor={endColor}
            />

            {/* Title Skeleton */}
            <SkeletonText
              noOfLines={2}
              spacing="2"
              mb={4}
              startColor={startColor}
              endColor={endColor}
            />
          </Box>
        </Flex>

        {/* Price and Button Skeleton */}
        <Flex mt={1} justifyContent="space-between" alignItems="center  ">
          <Skeleton
            height="20px"
            width="30%"
            startColor={startColor}
            endColor={endColor}
          />
          <Skeleton
            height="32px"
            width="60px"
            borderRadius="md"
            startColor={startColor}
            endColor={endColor}
          />
        </Flex>
      </Box>
    </Box>
  );
};

export default ProductCardSkeleton;
