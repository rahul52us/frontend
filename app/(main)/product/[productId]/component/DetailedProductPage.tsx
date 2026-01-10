"use client"
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import ProductImageViewer from "../../../../component/common/ProductImagesViewer/ProductImagesViewer";
import ProductDetailsSection from "./ProductDetailsSection";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import stores from "../../../../store/stores";

const DetailedProductPage = ({ productId }: { productId: string }) => {
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState<any>(null);
    const { shopStore } = stores;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await shopStore.getProductById(productId);
                if (res && res.data) {
                    setProduct(res.data);
                } else {
                    setProduct(res);
                }
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    if (loading) {
        return <Flex justify="center" align="center" h="50vh"><Spinner size="xl" color="purple.500" /></Flex>;
    }

    if (!product) {
        return <Box p={10}><Text>Product not found</Text></Box>;
    }

    // Map product images
    const images = product.images && product.images.length > 0
        ? product.images
        : (product.image ? [product.image] : []);

    return (
        <Box maxW={"75%"} mx={"auto"} my={4}>
            <Flex gap={6} align="flex-start" direction={{ base: "column", md: "row" }}>
                {/* Left Section - Sticky */}
                <Box position={{ md: "sticky" }} top={{ md: "9rem" }} alignSelf={{ md: "flex-start" }} w={{ base: "100%", md: "40%" }}>
                    <ProductImageViewer images={images} />
                </Box>

                {/* Right Section - Scrollable */}
                <Box flex={1}>
                    <ProductDetailsSection product={product} />
                </Box>
            </Flex>
        </Box>
    );
};

export default observer(DetailedProductPage);
