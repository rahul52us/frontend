"use client";
import {
    Box,
    Container,
    SimpleGrid,
    Text,
    Heading,
    Flex,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Spinner,
    Image,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import stores from "../../store/stores";
import categoryStore from "../../store/categoryStore/categoryStore";
import ProductCard from "../products/components/ProductCard/ProductCard";

// View when a specific category slug is selected - shows products
const CategoryProductsView = observer(({ slug }: { slug: string }) => {
    const { shopStore } = stores;
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response: any = await shopStore.getShopProducts({
                    categorySlug: slug,
                    page: 1,
                    limit: 20
                });

                if (response && response.data) {
                    setProducts(response.data.products);
                    setCategoryName(String(slug));
                }
            } catch {
                // Ignore error locally
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [slug, shopStore]);

    if (loading) {
        return (
            <Flex justify="center" align="center" h="50vh">
                <Spinner size="xl" color="purple.500" />
            </Flex>
        )
    }

    const displayTitle = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).replace(/-/g, " ");

    return (
        <Box py={8} minH="80vh" bg="gray.50">
            <Container maxW="container.xl">
                {/* Breadcrumb */}
                <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />} mb={8} fontSize="sm">
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink color="purple.600" fontWeight="medium">{displayTitle}</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>

                {/* Header */}
                <Box mb={8}>
                    <Heading as="h1" size="xl" mb={2} textTransform="capitalize" color="gray.800">
                        {displayTitle}
                    </Heading>
                    <Text color="gray.600">Explore our collection of {displayTitle}</Text>
                </Box>

                {/* Products Grid */}
                {products.length > 0 ? (
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
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
                            No products found in this category.
                        </Text>
                    </Flex>
                )}
            </Container>
        </Box>
    );
});

// View when no slug is provided - shows all categories
const AllCategoriesView = observer(() => {
    const router = useRouter();
    const { categories, loading } = categoryStore;

    useEffect(() => {
        categoryStore.getAllCategories({ isActive: true });
    }, []);

    if (loading && categories.length === 0) {
        return (
            <Flex justify="center" align="center" h="50vh">
                <Spinner size="xl" color="purple.500" />
            </Flex>
        );
    }

    const handleCategoryClick = (category: any) => {
        router.push(`/categories?slug=${category.slug || category.name.toLowerCase()}`);
    };

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
                    <Text color="gray.600">Browse through our wide range of categories</Text>
                </Box>

                {/* Categories Grid */}
                {categories.length > 0 ? (
                    <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={6}>
                        {categories.map((category) => (
                            <Box
                                key={category._id}
                                cursor="pointer"
                                bg="white"
                                borderRadius="2xl"
                                overflow="hidden"
                                boxShadow="sm"
                                transition="all 0.3s ease"
                                _hover={{
                                    transform: "translateY(-6px)",
                                    boxShadow: "lg",
                                }}
                                onClick={() => handleCategoryClick(category)}
                                role="group"
                            >
                                <Box
                                    h={{ base: "140px", md: "180px" }}
                                    bg="gray.100"
                                    overflow="hidden"
                                >
                                    <Image
                                        src={category.image?.url || "https://via.placeholder.com/300x200?text=Category"}
                                        alt={category.name}
                                        w="100%"
                                        h="100%"
                                        objectFit="cover"
                                        transition="transform 0.4s ease"
                                        _groupHover={{ transform: "scale(1.08)" }}
                                    />
                                </Box>
                                <Box p={4} textAlign="center">
                                    <Text
                                        fontWeight="bold"
                                        fontSize={{ base: "sm", md: "md" }}
                                        color="gray.800"
                                        _groupHover={{ color: "purple.600" }}
                                        noOfLines={1}
                                    >
                                        {category.name}
                                    </Text>
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

// Main component that decides which view to show
const CategoryContent = () => {
    const searchParams = useSearchParams();
    const slug = searchParams.get('slug');

    if (slug) {
        return <CategoryProductsView slug={slug} />;
    }

    return <AllCategoriesView />;
};

export default function CategoryPage() {
    return (
        <Suspense fallback={
            <Flex justify="center" align="center" h="50vh">
                <Spinner size="xl" color="purple.500" />
            </Flex>
        }>
            <CategoryContent />
        </Suspense>
    );
}
