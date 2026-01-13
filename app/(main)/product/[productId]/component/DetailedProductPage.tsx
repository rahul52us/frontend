"use client"
import { Box, Flex, Grid, Spinner, Text, useColorModeValue } from "@chakra-ui/react";
import ProductImageViewer from "../../../../component/common/ProductImagesViewer/ProductImagesViewer";
import ProductDetailsSection from "./ProductDetailsSection";
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
    const accentColor = "purple.500";

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await shopStore.getProductById(productId);
                if (res && res.data) {
                    setProduct(res.data);

                    // Fetch related products after product load
                    if (res.data?.category) {
                        const relatedRes = await shopStore.searchGlobalProducts({
                            category: res.data.category,
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
            <Flex justify="center" align="center" h="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
                <Spinner size="xl" color={accentColor} thickness="4px" speed="0.65s" emptyColor="gray.200" />
            </Flex>
        );
    }

    if (!product) {
        return (
            <Flex justify="center" align="center" h="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            maxW="90%"
            mx="auto"
            my={8}
            bg={bgColor}
            p={{ base: 4, md: 8 }}
            rounded="2xl"
            shadow="xl"
            border="1px solid"
            borderColor={useColorModeValue("gray.200", "gray.700")}
        >
            <Grid
                templateColumns={{ base: "1fr", lg: "35% 1fr 300px" }}
                gap={8}
                bg={bgColor}
                rounded="lg"
                overflow="hidden"
            >
                {/* Column 1: Images - Sticky */}
                <MotionBox
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    position={{ lg: "sticky" }}
                    top={{ lg: "8rem" }}
                    alignSelf="start"
                    h="fit-content"
                    bg={useColorModeValue("gray.50", "gray.700")}
                    p={4}
                    rounded="xl"
                    shadow="md"
                    _hover={{ shadow: "lg" }}
                >
                    <ProductImageViewer images={images} />
                </MotionBox>

                {/* Column 2: Details - Scrollable */}
                <MotionBox
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    p={{ base: 0, md: 4 }}
                >
                    <ProductDetailsSection product={product} />
                </MotionBox>

                {/* Column 3: Buy Box - Sticky */}
                <MotionBox
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    position={{ lg: "sticky" }}
                    top={{ lg: "8rem" }}
                    minW={{ lg: "300px" }}
                    alignSelf="start"
                    h="fit-content"
                    bg={useColorModeValue("gray.50", "gray.700")}
                    p={6}
                    rounded="xl"
                    shadow="md"
                    border="1px solid"
                    borderColor={useColorModeValue("gray.200", "gray.600")}
                    _hover={{ borderColor: accentColor, transition: "all 0.3s ease" }}
                >
                    <ProductBuyBox product={product} />
                </MotionBox>
            </Grid>

            {relatedProducts.length > 0 && (
                <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    mt={16}
                    mb={8}
                    bg={useColorModeValue("gray.50", "gray.700")}
                    p={8}
                    rounded="2xl"
                    shadow="sm"
                >
                    <Divider mb={8} borderColor={useColorModeValue("gray.300", "gray.600")} />
                    <Heading size="lg" mb={6} color={textColor} fontWeight="bold">You might also like</Heading>
                    <SimpleGrid columns={{ base: 2, md: 3, lg: 4, xl: 5 }} spacing={6}>
                        {relatedProducts.map((related, index) => (
                            <MotionBox
                                key={related._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.1 * index }}
                            >
                                <ProductCard
                                    product={related}
                                    _hover={{
                                        transform: "scale(1.05)",
                                        transition: "all 0.3s ease",
                                        shadow: "lg"
                                    }}
                                />
                            </MotionBox>
                        ))}
                    </SimpleGrid>
                </MotionBox>
            )}
        </MotionBox>
    );
};

export default observer(DetailedProductPage);