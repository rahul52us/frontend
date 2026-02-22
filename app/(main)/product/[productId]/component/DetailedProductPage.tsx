"use client"
import { Box, Flex, Grid, Spinner, Text, useColorModeValue, Button } from "@chakra-ui/react";
import ProductImageViewer from "../../../../component/common/ProductImagesViewer/ProductImagesViewer";
import ProductDetailsSection from "./ProductDetailsSection";
import ProductAboutSection from "./ProductAboutSection";
import ProductBuyBox from "./ProductBuyBox";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import stores from "../../../../store/stores";
import ProductCard from "../../../products/components/ProductCard/ProductCard";
import { Heading, SimpleGrid, Divider } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const DetailedProductPage = ({ productId }: { productId: string }) => {
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState<any>(null);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const { shopStore } = stores;

    const bgColor = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const accentColor = "grey.500";
    const spinnerBg = useColorModeValue("gray.50", "gray.900");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const imageBoxBg = useColorModeValue("gray.50", "gray.700");
    const buyBoxBorder = useColorModeValue("gray.200", "gray.600");
    const relatedBg = useColorModeValue("gray.50", "gray.700");
    const dividerColor = useColorModeValue("gray.300", "gray.600");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await shopStore.getProductById(productId);
                if (res && res.data) {
                    setProduct(res.data);

                    // Fetch related products after product load
                    if (res.data?.category) {
                        const subCategories = res.data.subCategories;
                        const subCategory = Array.isArray(subCategories) && subCategories.length > 0
                            ? (subCategories[0]._id || subCategories[0])
                            : undefined;

                        const relatedRes = await shopStore.searchGlobalProducts({
                            category: res.data.category?._id || res.data.category,
                            subCategory,
                            excludeId: res.data._id,
                            limit: 5
                        });
                        if (relatedRes && relatedRes.data && relatedRes.data.products) {
                            setRelatedProducts(relatedRes.data.products);
                        }
                    }

                } else {
                    setProduct(res);
                }
            } catch (error) {
                alert(error?.message)
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId, shopStore]);

    if (loading) {
        return (
            <Flex justify="center" align="center" h="100vh" bg={spinnerBg}>
                <Spinner size="xl" color={accentColor} thickness="4px" speed="0.65s" emptyColor="gray.200" />
            </Flex>
        );
    }

    if (!product) {
        return (
            <Flex justify="center" align="center" h="100vh" bg={spinnerBg}>
                <Text fontSize="2xl" color={textColor} fontWeight="semibold">Product not found</Text>
            </Flex>
        );
    }

    // Map product images
    const images = product.images && product.images.length > 0
        ? product.images
        : (product.image ? [product.image] : []);

    return (
        <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            maxW="container.xl"
            mx="auto"
            py={{ base: 2, md: 6 }}
            px={{ base: 4, md: 8 }}
            pb={{ base: 24, lg: 8 }} // Added bottom padding for mobile sticky bar
        >
            <Grid
                templateColumns={{ base: "1fr", lg: "1.2fr 1fr" }}
                gap={{ base: 4, lg: 8 }} // Reduced gap further
                alignItems="start"
            >
                {/* Column 1: Images - Sticky on Desktop */}
                <Box
                    position={{ lg: "sticky" }}
                    top={{ lg: "24px" }}
                    h="fit-content"
                >
                    <ProductImageViewer images={images} />
                </Box>

                {/* Column 2: Details & Actions */}
                <Box>
                    <ProductDetailsSection product={product} />

                    {/* Integrated Buy Box - visually separated but part of the flow */}
                    <Box mt={4}>
                        <ProductBuyBox product={product} />
                    </Box>
                </Box>
            </Grid>

            {/* Full-width Product About Section (Description & Specs) */}
            <ProductAboutSection product={product} />

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <Box mt={20}>
                    <Heading size="lg" mb={8} color={textColor}>You might also like</Heading>
                    <SimpleGrid columns={{ base: 2, md: 3, lg: 4, xl: 5 }} spacing={{ base: 4, md: 6 }}>
                        {relatedProducts.map((related, index) => (
                            <MotionBox
                                key={related._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.05 * index }}
                            >
                                <ProductCard product={related} />
                            </MotionBox>
                        ))}
                    </SimpleGrid>
                </Box>
            )}

            {/* Mobile Sticky Action Bar */}
            <Box
                display={{ base: "block", lg: "none" }}
                position="fixed"
                bottom={0}
                left={0}
                right={0}
                bg={bgColor}
                p={3}
                borderTop="1px solid"
                borderColor={borderColor}
                zIndex={100}
                boxShadow="0 -2px 10px rgba(0,0,0,0.05)"
            >
                <Flex gap={3}>
                    <Button
                        flex={1}
                        size="lg"
                        variant="outline"
                        colorScheme="gray"
                        rounded="xl"
                        onClick={() => stores.cartStore.addToCart(product)}
                    >
                        Add to Cart
                    </Button>
                    <Button
                        flex={1}
                        size="lg"
                        colorScheme="blackAlpha"
                        bg="black"
                        color="white"
                        rounded="xl"
                    >
                        Buy Now
                    </Button>
                </Flex>
            </Box>
        </MotionBox>
    );
};

export default observer(DetailedProductPage);