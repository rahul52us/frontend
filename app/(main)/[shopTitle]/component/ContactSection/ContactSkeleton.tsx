import { Box, Flex, Grid, HStack, Skeleton, SkeletonCircle } from "@chakra-ui/react";

const ContactSectionSkeleton = () => {
  return (
    <Box py={2} px={6}>
     
      <Grid templateColumns={["1fr", "1fr", "repeat(3, 1fr)"]} gap={8}>
        {Array(3)
          .fill("")
          .map((_, index) => (
            <Flex
              key={index}
              direction="column"
              align="center"
              p={8}
              bg="white"
              borderRadius="2xl"
              boxShadow="xl"
              textAlign="center"
            >
              <SkeletonCircle startColor={"purple.200"} endColor={"purple.50"} size="12" mb={3} />
              <Skeleton startColor={"purple.200"} endColor={"purple.50"} height="24px" width="120px" mb={2} />
              <Skeleton startColor={"purple.200"} endColor={"purple.50"} height="16px" width="180px" />
            </Flex>
          ))}
      </Grid>

      {/* Social Media Section */}
      <Box mt={8} textAlign="center">
        <HStack spacing={6} justify="center">
          {Array(3)
            .fill("")
            .map((_, index) => (
              <SkeletonCircle startColor={"purple.200"} endColor={"purple.50"} key={index} size="12" />
            ))}
        </HStack>
      </Box>
    </Box>
  );
};

export default ContactSectionSkeleton;