import { Box, Container, Flex, Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

const ShopHeaderSkeleton = () => {
  return (
    <Box>
      <Box position="relative">
        <Box position="relative" h={{ base: "300px", md: "400px", lg: "500px" }} w="full">
          <Skeleton h="full" w="full" />
          <Box
            position="absolute"
            inset="0"
            // bgGradient={{
            //   base: "linear(to-t, burple.800, blackAlpha.400)",
            //   md: "linear(to-t, black, 20%,transparent)"
            // }}
          />
        </Box>

        <Container maxW="container.xl" position="relative" mt={{ base: "-240px", md: "-36" }} zIndex="10" px={{ base: 3, md: 4 }} pb={{ base: 4, md: 8 }}>
          <Flex flexDir={{ base: "column", md: "row" }} alignItems={{ base: "center", md: "flex-end" }} gap={{ base: 3, md: 6 }} justifyContent="space-between" flexWrap={{ base: "wrap", md: "nowrap" }}>
            <Box position="relative" w={{ base: "80px", md: "100px" }} h={{ base: "80px", md: "100px" }} borderRadius="xl" border="3px" borderColor="white" overflow="hidden" bg="white" mb={{ base: 2, md: 0 }}>
              <SkeletonCircle size="full" h="full" w="full" />
            </Box>

            <Box flex="1" color="white" textAlign={{ base: "center", md: "left" }} maxW={{ base: "100%", md: "60%" }}>
              <SkeletonText noOfLines={1} skeletonHeight="6" w="60%" mx={{base:"auto",lg:"0"}}   />

              <Flex alignItems="center" mt={2} gap={2} flexDir={{ base: "column", md: "row" }} justify={{ base: "center", md: "flex-start" }}>
                <SkeletonText noOfLines={1} skeletonHeight="4" w="40%" />
                <SkeletonText noOfLines={1} skeletonHeight="4" w="30%" />
              </Flex>

              <Flex flexWrap="wrap" gap={2} mt={2} justify={{ base: "center", md: "flex-start" }}>
                {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} h="20px" w="50px" borderRadius="full" />
                ))}
              </Flex>
            </Box>

            <Flex alignItems="center" gap={3} mt={{ base: 4, md: 0 }} display={{ base: "none", md: "flex" }} flexShrink={0}>
              <Skeleton h="32px" w="80px" borderRadius="full" />
              <Skeleton h="40px" w="120px" borderRadius="md" />
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default ShopHeaderSkeleton;
