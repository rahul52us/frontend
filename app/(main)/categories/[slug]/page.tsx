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
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import stores from "../../../store/stores";
import ProductCard from "../../products/components/ProductCard/ProductCard";

const CategoryPage = observer(() => {
    const { slug } = useParams();
    const { shopStore } = stores;
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            if (!slug) return;

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
                // Ignore error locally or use a toast if needed
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

export default CategoryPage;
