import { AspectRatio, Box, Flex, SimpleGrid, Skeleton, SkeletonText } from "@chakra-ui/react";
import { endColor, startColor } from "../../../../component/common/utils/skeletonColors";

const AddressMapSkeleton = () => {
  return (
    <Flex
      direction={{ base: "column", lg: "row" }}
      gap={4}
      maxW={{base:"90%",lg:'80%'}}
      mx={'auto'}
      bg="white"
      borderRadius="2xl"
      p={{ base: 6, lg: 4 }}
      boxShadow="base"
      position="relative"
      overflow="hidden"
    >
      {/* Map Section Skeleton */}
      <Box
        flex="1.5"
        borderRadius="2xl"
        overflow="hidden"
        minH={{ base: "auto", lg: "auto" }}
        position="relative"
      >
        <AspectRatio ratio={16 / 9}>
          <Skeleton height="100%" borderRadius="2xl" startColor={startColor} endColor={endColor} />
        </AspectRatio>
      </Box>

      {/* Addresses Section Skeleton */}
      <Box flex="1" position="relative">
        <Box position="relative" pl={{ lg: 6 }}>
          {/* Primary Location Skeleton */}
          <Box bg="white" p={8} borderRadius="2xl" mb={6} boxShadow="lg">
            <Skeleton startColor={startColor} endColor={endColor} height="24px" width="50%" mb={4} />
            <SkeletonText startColor={startColor} endColor={endColor} noOfLines={3} spacing={2} skeletonHeight={4} />
          </Box>

          {/* Additional Locations Skeleton */}
          <SimpleGrid columns={1} spacing={6}>
            {[...Array(1)].map((_, index) => (
              <Box
                key={index}
                bg="white"
                p={6}
                borderRadius="xl"
                border="2px solid"
                borderColor="gray.100"
              >
                <Skeleton startColor={startColor} endColor={endColor} height="20px" width="40%" mb={3} />
                <SkeletonText startColor={startColor} endColor={endColor} noOfLines={4} spacing={2} skeletonHeight={3} />
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    </Flex>
  );
};

export default AddressMapSkeleton;
