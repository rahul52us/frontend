"use client";
import {
    Box,
    Container,
    SimpleGrid,
    Text,
    Heading,
    Flex,
    Image,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Spinner,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import categoryStore from "../../store/categoryStore/categoryStore"; // Import directly as default export

const CategoriesPage = observer(() => {
    const router = useRouter();
    const { categories, loading } = categoryStore;

    useEffect(() => {
        categoryStore.getAllCategories({ isActive: true, parent: 'null' }); // Fetch only root categories
    }, []);

    if (loading && categories.length === 0) {
        return (
            <Flex justify="center" align="center" h="50vh">
                <Spinner size="xl" color="purple.500" />
            </Flex>
        )
    }

    return (
        <Box py={8} minH="80vh" bg="gray.50">
            <Container maxW="container.xl">
                {/* Breadcrumb */}
                <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />} mb={8} fontSize="sm">
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink color="purple.600" fontWeight="medium">Categories</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>

                {/* Header */}
                <Box mb={8}>
                    <Heading as="h1" size="xl" mb={2} color="gray.800">
                        All Categories
                    </Heading>
                    <Text color="gray.600">Browse all our product categories</Text>
                </Box>

                {/* Categories Grid */}
                {categories.length > 0 ? (
                    <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={6}>
                        {categories.map((category) => (
                            <Box
                                key={category._id}
                                bg="white"
                                borderRadius="lg"
                                overflow="hidden"
                                boxShadow="sm"
                                cursor="pointer"
                                transition="all 0.2s"
                                _hover={{ transform: "translateY(-4px)", boxShadow: "md" }}
                                onClick={() => router.push(`/categories/${category.slug || category.name.toLowerCase()}`)}
                                border="1px solid"
                                borderColor="gray.100"
                            >
                                <Box h="180px" bg="gray.100" position="relative" overflow="hidden">
                                    {category.image?.url ? (
                                        <Image
                                            src={category.image.url}
                                            alt={category.name}
                                            w="100%"
                                            h="100%"
                                            objectFit="cover"
                                            transition="all 0.3s"
                                            _groupHover={{ transform: "scale(1.05)" }}
                                        />
                                    ) : (
                                        <Flex h="100%" w="100%" justify="center" align="center" bg="gray.200" color="gray.400">
                                            <Text fontSize="xs">No Image</Text>
                                        </Flex>
                                    )}
                                </Box>
                                <Box p={4} textAlign="center">
                                    <Heading size="md" fontWeight="semibold" color="gray.700" textTransform="capitalize" noOfLines={1}>
                                        {category.name}
                                    </Heading>
                                </Box>
                            </Box>
                        ))}
                    </SimpleGrid>
                ) : (
                    <Flex
                        direction="column"
                        align="center"
                        justify="center"
                        bg="white"
                        p={12}
                        borderRadius="xl"
                        border="1px dashed"
                        borderColor="gray.200"
                    >
                        <Text fontSize="lg" fontWeight="medium" color="gray.500">
                            No categories found.
                        </Text>
                    </Flex>
                )}
            </Container>
        </Box>
    );
});

export default CategoriesPage;
