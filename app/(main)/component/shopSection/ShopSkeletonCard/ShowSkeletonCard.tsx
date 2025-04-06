import { Box, Flex, HStack, Skeleton, SkeletonCircle, VStack } from "@chakra-ui/react";
import { endColor, startColor } from "../../../../component/common/utils/skeletonColors";

const ShopCardSkeleton = () => {
  return (
    <Box
      maxW="340px"
      m={4}
      bg="white"
      shadow={'base'}
      borderRadius="xl"
    >
      {/* Image Section Skeleton */}
      <Box position="relative" h="180px">
        <Skeleton
          w="100%"
          h="100%"
          startColor={startColor}
          endColor={endColor}
          borderTopRadius="xl"
        />
        {/* Status Badge Skeleton */}
        <Skeleton
          position="absolute"
          top={3}
          left={3}
          w="80px"
          h="24px"
          borderRadius="full"
          startColor={startColor}
          endColor={endColor}
        />
      </Box>

      {/* Content Section Skeleton */}
      <VStack p={4} spacing={4} align="start">
        {/* Name and Logo Skeleton */}
        <HStack spacing={3} w="full" align="center">
          <SkeletonCircle
            size="50px"
            startColor={startColor}
            endColor={endColor}
          />
          <Skeleton
            h="24px"
            w="70%"
            startColor={startColor}
            endColor={endColor}
          />
        </HStack>

        {/* Categories Skeleton */}
        <Flex wrap="wrap" gap={2}>
          {[1, 2].map((_, index) => (
            <Skeleton
              key={index}
              h="20px"
              w="80px"
              borderRadius="full"
              startColor={startColor}
              endColor={endColor}
            />
          ))}
        </Flex>
        {/* Description Skeleton */}
        <Skeleton h="30px" w="100%" startColor={startColor} endColor={endColor} />

        {/* Contact Skeleton */}
        <HStack spacing={3} w="full">
          {/* <SkeletonCircle size="16px" startColor={startColor} endColor={endColor} /> */}
          <Skeleton h="16px" w="50%" startColor={startColor} endColor={endColor} />
        </HStack>
      </VStack>
    </Box>
  );
};

export default ShopCardSkeleton;