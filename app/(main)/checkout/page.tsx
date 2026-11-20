"use client";

import { Suspense, memo } from "react";
import CheckoutClient from "./CheckoutClient";
import { Box, Container, Flex, Heading, Skeleton, VStack } from "@chakra-ui/react";

const CheckoutLoadingSkeleton = memo(() => (
  <Box bg="#F8FAFC" minH="100vh" py={{ base: 4, md: 8 }} px={{ base: 2, sm: 4, lg: 6 }}>
    <Container maxW="container.xl">
      <Skeleton h="28px" w="180px" mb={6} rounded="md" />
      <Flex direction={{ base: "column", lg: "row" }} gap={6}>
        <VStack flex="1.45" spacing={4} align="stretch">
          <Skeleton h="140px" rounded="2xl" />
          <Skeleton h="180px" rounded="2xl" />
          <Skeleton h="220px" rounded="2xl" />
        </VStack>
        <Box flex="1">
          <Skeleton h="360px" rounded="2xl" />
        </Box>
      </Flex>
    </Container>
  </Box>
));
CheckoutLoadingSkeleton.displayName = "CheckoutLoadingSkeleton";

const CheckoutPage = memo(() => {
  return (
    <Suspense fallback={<CheckoutLoadingSkeleton />}>
      <CheckoutClient />
    </Suspense>
  );
});

CheckoutPage.displayName = "CheckoutPage";

export default CheckoutPage;
