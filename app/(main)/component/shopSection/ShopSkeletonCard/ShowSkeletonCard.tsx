import { Box, Flex, HStack, Skeleton, SkeletonCircle, VStack } from "@chakra-ui/react";
import { endColor, startColor } from "../../../../component/common/utils/skeletonColors";

const ShopCardSkeleton = () => {
  return (
    <Box
      w="full"
      bg="white"
      borderRadius="3xl"
      overflow="hidden"
      boxShadow="0 4px 20px rgba(0, 0, 0, 0.05)"
    >
      {/* Image Section Skeleton */}
      <Box position="relative" h={{ base: "160px", md: "200px" }}>
        <Skeleton
          w="100%"
          h="100%"
          startColor={startColor}
          endColor={endColor}
        />
        {/* Status Badge Skeleton */}
        <Skeleton
          position="absolute"
          top="16px"
          right="16px"
          w="70px"
          h="24px"
          borderRadius="full"
          startColor={startColor}
          endColor={endColor}
        />
      </Box>

      {/* Content Section Skeleton */}
      <VStack px={5} pt={8} pb={6} spacing={4} align="start" position="relative">
        {/* Logo Overlap Skeleton */}
        <Box
          position="absolute"
          top="-40px"
          left="20px"
          zIndex={2}
        >
          <Skeleton
            boxSize="64px"
            borderRadius="2xl"
            startColor={startColor}
            endColor={endColor}
          />
        </Box>

        {/* Name and Location Skeleton */}
        <Box w="full">
          <Skeleton
            h="28px"
            w="80%"
            mb={2}
            startColor={startColor}
            endColor={endColor}
          />
          <Skeleton
            h="12px"
            w="40%"
            startColor={startColor}
            endColor={endColor}
          />
        </Box>

        {/* Description Skeleton */}
        <VStack w="full" align="start" spacing={2}>
          <Skeleton h="12px" w="100%" startColor={startColor} endColor={endColor} />
          <Skeleton h="12px" w="90%" startColor={startColor} endColor={endColor} />
        </VStack>

        {/* Footer Skeleton */}
        <Flex justify="space-between" align="center" w="full" pt={2} borderTop="1px solid" borderColor="gray.50">
          <Skeleton h="12px" w="40%" startColor={startColor} endColor={endColor} />
          <Skeleton h="12px" w="20%" startColor={startColor} endColor={endColor} />
        </Flex>
      </VStack>
    </Box>
  );
};

export default ShopCardSkeleton;
