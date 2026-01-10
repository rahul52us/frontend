"use client"
import { Box, Flex, Grid, Spinner, Text } from "@chakra-ui/react";
import ProductImageViewer from "../../../../component/common/ProductImagesViewer/ProductImagesViewer";
import ProductDetailsSection from "./ProductDetailsSection";
import ProductBuyBox from "./ProductBuyBox";
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
        <Box maxW={"90%"} mx={"auto"} my={4}>
            <Grid templateColumns={{ base: "1fr", lg: "35% 1fr 300px" }} gap={6}>
                {/* Column 1: Images - Sticky */}
                <Box
                    position={{ lg: "sticky" }}
                    top={{ lg: "8rem" }}
                    alignSelf="start"
                    h="fit-content"
                >
                    <ProductImageViewer images={images} />
                </Box>

                {/* Column 2: Details - Scrollable */}
                <Box>
                    <ProductDetailsSection product={product} />
                </Box>

                {/* Column 3: Buy Box - Sticky */}
                <Box
                    position={{ lg: "sticky" }}
                    top={{ lg: "8rem" }}
                    minW={{ lg: "300px" }}
                    alignSelf="start"
                    h="fit-content"
                >
                    <ProductBuyBox product={product} />
                </Box>
            </Grid>
        </Box>
    );
};

export default observer(DetailedProductPage);
