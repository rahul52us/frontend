import { Suspense, memo } from "react";
import CategoryClient from "./CategoryClient";
import { Box, Container, SimpleGrid, Skeleton, SkeletonText } from "@chakra-ui/react";

const CategoryLoadingSkeleton = memo(() => (
  <Box py={8} minH="80vh" bg="var(--color-bg)">
    <Container maxW="container.xl">
      <Skeleton h="20px" w="180px" mb={8} rounded="md" />
      <Box mb={8}>
        <Skeleton h="32px" w="240px" mb={2} rounded="md" />
        <Skeleton h="16px" w="320px" rounded="md" />
      </Box>
      <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={6}>
        {[...Array(10)].map((_, i) => (
          <Box key={i} rounded="2xl" overflow="hidden" borderWidth="1px" borderColor="gray.100" p={2}>
            <Skeleton h={{ base: "140px", md: "180px" }} rounded="xl" mb={3} />
            <SkeletonText noOfLines={1} skeletonHeight="16px" mx="auto" w="70%" />
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  </Box>
));
CategoryLoadingSkeleton.displayName = "CategoryLoadingSkeleton";

const CategoryPage = memo(() => {
  return (
    <Suspense fallback={<CategoryLoadingSkeleton />}>
      <CategoryClient />
    </Suspense>
  );
});

CategoryPage.displayName = "CategoryPage";

export default CategoryPage;
