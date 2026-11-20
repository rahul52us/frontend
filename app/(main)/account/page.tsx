"use client";

import {
  Box,
  Container,
  Grid,
  Skeleton,
  SkeletonCircle,
  VStack,
} from "@chakra-ui/react";
import React, { Suspense, memo } from "react";
import { observer } from "mobx-react-lite";
import AccountPage from "./component/AccountPage";

const AccountSkeleton = memo(() => {
  return (
    <Container maxW="container.xl" py={{ base: 4, md: 8 }} px={{ base: 3, md: 6 }}>
      <Grid templateColumns={{ base: "1fr", md: "320px 1fr" }} gap={8}>
        {/* Sidebar skeleton */}
        <VStack spacing={6} align="stretch">
          <Box p={5} borderRadius="2xl" borderWidth="1px" borderColor="gray.100" bg="white">
            <SkeletonCircle size="14" mb={3} />
            <Skeleton h="20px" w="60%" mb={2} />
            <Skeleton h="14px" w="40%" />
          </Box>
          <Box p={4} borderRadius="2xl" borderWidth="1px" borderColor="gray.100" bg="white">
            <VStack spacing={3} align="stretch">
              <Skeleton h="44px" borderRadius="lg" />
              <Skeleton h="44px" borderRadius="lg" />
              <Skeleton h="44px" borderRadius="lg" />
              <Skeleton h="44px" borderRadius="lg" />
            </VStack>
          </Box>
        </VStack>

        {/* Content skeleton */}
        <Box p={{ base: 4, md: 8 }} borderRadius="2xl" borderWidth="1px" borderColor="gray.100" bg="white">
          <Skeleton h="28px" w="200px" mb={6} />
          <VStack spacing={4} align="stretch">
            <Skeleton h="80px" borderRadius="xl" />
            <Skeleton h="80px" borderRadius="xl" />
            <Skeleton h="80px" borderRadius="xl" />
          </VStack>
        </Box>
      </Grid>
    </Container>
  );
});
AccountSkeleton.displayName = "AccountSkeleton";

const Page = () => {
  return (
    <Box minH="80vh">
      <Suspense fallback={<AccountSkeleton />}>
        <AccountPage />
      </Suspense>
    </Box>
  );
};

export default memo(observer(Page));
