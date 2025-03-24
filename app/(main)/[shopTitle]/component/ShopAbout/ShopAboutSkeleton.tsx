import { Box, Flex, Heading, Skeleton, SkeletonText } from "@chakra-ui/react";
import { endColor, startColor } from "../../../../component/common/utils/skeletonColors";

const AboutUsSkeleton = () => {
  return (
    <Box mb="6">
      <Heading as="h2" size="lg" fontWeight="bold" mb="4">
        <Skeleton startColor={startColor} endColor={endColor} height="28px" width="150px" />
      </Heading>

      {/* About Preview Text Skeleton */}
      <Box mb="4">
        <SkeletonText startColor={startColor} endColor={endColor} noOfLines={1} spacing="2" skeletonHeight="4" mb="2" />
        <SkeletonText startColor={startColor} endColor={endColor} noOfLines={2} spacing="2" skeletonHeight="4" />

        {/* Toggle button skeleton */}
        <Skeleton startColor={startColor} endColor={endColor} height="20px" width="80px" mt="2" />
      </Box>

      {/* Optional Tags Section */}
      <Box mt="6">
    
        <Flex flexWrap="wrap" gap="2">
          {[...Array(3)].map((_, index) => (
            <Skeleton startColor={startColor} endColor={endColor} key={index} height="24px" width="60px" borderRadius="full" />
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default AboutUsSkeleton;
