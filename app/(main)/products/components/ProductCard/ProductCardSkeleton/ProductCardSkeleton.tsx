import { Box, Flex, Skeleton, SkeletonText, AspectRatio } from "@chakra-ui/react";
import { startColor, endColor } from "../../../../../component/common/utils/skeletonColors";

const ProductCardSkeleton = () => {
  return (
    <Box
      bg="white"
      borderRadius="2xl"
      overflow="hidden"
      borderWidth="1px"
      borderColor="gray.100"
      w="100%"
      h="100%"
      display="flex"
      flexDirection="column"
    >
      {/* Image Skeleton with Aspect Ratio 1/1 */}
      <Box p={{ base: 2, md: 3 }}>
        <AspectRatio ratio={1 / 1}>
          <Skeleton
            width="100%"
            height="100%"
            startColor={startColor}
            endColor={endColor}
            borderRadius="lg"
          />
        </AspectRatio>
      </Box>

      {/* Content Skeleton */}
      <Flex direction="column" px={{ base: 2, md: 3 }} pb={{ base: 2, md: 3 }} flex="1" justify="space-between">
        <Box>
          {/* Category Skeleton */}
          <Skeleton
            height="12px"
            width="40%"
            mb={2}
            startColor={startColor}
            endColor={endColor}
            borderRadius="sm"
          />

          {/* Title Skeleton */}
          <SkeletonText
            noOfLines={2}
            spacing="2"
            skeletonHeight="16px"
            mb={3}
            startColor={startColor}
            endColor={endColor}
          />
        </Box>

        {/* Price Area */}
        <Flex align="center" justify="space-between" mt={3}>
          <Box>
            <Skeleton
              height="20px"
              width="80px"
              mb={1}
              borderRadius="sm"
              startColor={startColor}
              endColor={endColor}
            />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default ProductCardSkeleton;
