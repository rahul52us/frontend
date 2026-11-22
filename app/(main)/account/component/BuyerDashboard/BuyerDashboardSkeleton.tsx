"use client";

import {
  Box,
  Flex,
  HStack,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  VStack,
} from "@chakra-ui/react";
import React from "react";

export const BuyerDashboardSkeleton = () => {
  return (
    <VStack align="stretch" spacing={6} py={2}>
      {/* Banner Skeleton */}
      <Box
        p={{ base: 5, md: 6 }}
        borderRadius="2xl"
        bg="var(--color-surface)"
        borderWidth="1px"
        borderColor="var(--color-border)"
      >
        <Skeleton h="20px" w="100px" borderRadius="full" mb={3} />
        <Skeleton h="32px" w="220px" mb={2} />
        <Skeleton h="16px" w="60%" />
      </Box>

      {/* Core KPI Metrics Skeleton */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
        {[1, 2, 3, 4].map((i) => (
          <Box
            key={i}
            bg="var(--color-surface)"
            p={4}
            borderRadius="xl"
            borderWidth="1px"
            borderColor="var(--color-border)"
          >
            <Flex justify="space-between" mb={2}>
              <Skeleton h="12px" w="70px" />
              <SkeletonCircle size="4" />
            </Flex>
            <Skeleton h="28px" w="50px" mb={2} />
            <Skeleton h="10px" w="90px" />
          </Box>
        ))}
      </SimpleGrid>

      {/* Tab Header Skeleton */}
      <HStack spacing={3}>
        <Skeleton h="36px" w="140px" borderRadius="full" />
        <Skeleton h="36px" w="180px" borderRadius="full" />
      </HStack>

      {/* List Skeleton */}
      <VStack align="stretch" spacing={3}>
        {[1, 2, 3].map((i) => (
          <Box
            key={i}
            bg="var(--color-surface)"
            borderRadius="xl"
            p={4}
            borderWidth="1px"
            borderColor="var(--color-border)"
          >
            <Flex justify="space-between" align="center">
              <HStack spacing={3}>
                <SkeletonCircle size="12" borderRadius="lg" />
                <Box>
                  <Skeleton h="16px" w="180px" mb={2} />
                  <Skeleton h="12px" w="130px" mb={2} />
                  <Skeleton h="12px" w="90px" />
                </Box>
              </HStack>
              <VStack align="flex-end" spacing={1}>
                <Skeleton h="18px" w="70px" />
                <Skeleton h="12px" w="50px" />
              </VStack>
            </Flex>
          </Box>
        ))}
      </VStack>
    </VStack>
  );
};

