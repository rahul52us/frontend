import { Box, Container, Flex, HStack, SimpleGrid, Skeleton } from "@chakra-ui/react";
import { Metadata } from "next";
import { Suspense, memo } from "react";
import SearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "Search Results | Business Sahayata",
  description: "Explore and find products from verified sellers and local businesses.",
};

const SearchLoadingSkeleton = memo(() => (
  <Box bg="var(--color-bg, #F8FAFC)" minH="90vh" py={{ base: 3, md: 6 }}>
    <Container maxW="8xl" px={{ base: 3, sm: 4, md: 6, lg: 8 }}>
      <Skeleton height="16px" width="140px" mb={4} borderRadius="md" />

      {/* Top Bar Skeleton */}
      <Box
        bg="var(--color-surface, #FFFFFF)"
        border="1px solid"
        borderColor="var(--color-border, #E2E8F0)"
        borderRadius="2xl"
        p={{ base: 3.5, md: 5 }}
        mb={{ base: 4, md: 6 }}
      >
        <Flex justify="space-between" align="center" gap={4} flexWrap="wrap">
          <Box>
            <Skeleton height="28px" width="220px" mb={2} borderRadius="md" />
            <Skeleton height="14px" width="160px" borderRadius="md" />
          </Box>
          <HStack spacing={2}>
            <Skeleton height="36px" width="140px" borderRadius="full" />
            <Skeleton height="36px" width="80px" borderRadius="full" />
          </HStack>
        </Flex>
      </Box>

      {/* Main Grid Skeleton */}
      <Flex gap={{ base: 4, lg: 7 }} align="flex-start">
        <Box
          display={{ base: "none", lg: "block" }}
          w="280px"
          flexShrink={0}
          p={5}
          border="1px solid"
          borderColor="var(--color-border, #E2E8F0)"
          borderRadius="2xl"
          bg="var(--color-surface, #FFFFFF)"
        >
          <Skeleton height="30px" mb={4} borderRadius="md" />
          <Skeleton height="180px" mb={4} borderRadius="lg" />
          <Skeleton height="180px" mb={4} borderRadius="lg" />
        </Box>

        <Box flex="1">
          <SimpleGrid
            columns={{ base: 2, sm: 2, md: 3, xl: 4 }}
            spacing={{ base: 2.5, sm: 3.5, md: 5 }}
          >
            {[...Array(8)].map((_, i) => (
              <Box
                key={i}
                border="1px solid"
                borderColor="var(--color-border, #E2E8F0)"
                borderRadius="2xl"
                overflow="hidden"
                p={2}
                bg="var(--color-surface, #FFFFFF)"
              >
                <Skeleton height={{ base: "140px", md: "190px" }} borderRadius="xl" mb={3} />
                <Skeleton height="14px" width="60%" mb={2} borderRadius="md" />
                <Skeleton height="18px" width="85%" mb={3} borderRadius="md" />
                <Skeleton height="16px" width="40%" borderRadius="md" />
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Flex>
    </Container>
  </Box>
));

SearchLoadingSkeleton.displayName = "SearchLoadingSkeleton";

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoadingSkeleton />}>
      <SearchClient />
    </Suspense>
  );
}
