import { Box, Divider, Text, VStack, useColorModeValue, Button, Flex, useToast, Image, Badge, Heading } from '@chakra-ui/react';
import ProductTitle from '../../../individual-product/component/ProductTitle/ProductTitle';
import ProductRating from '../../../individual-product/component/ProductRating/ProductRating';
import ProductPrice from '../../../individual-product/component/ProductPrice/ProductPrice';
import CouponOffers from '../../../individual-product/component/CouponOffers.tsx/CouponOffers';
import ProductColorSelector from '../../../individual-product/component/ProductColorSelector/ProductColorSelector';
import ProductSizeSelector from '../../../individual-product/component/ProductSizeSelector/ProductSizeSelector';
import ProductSpecs from '../../../individual-product/component/ProductSpecs/ProductSpecs';
import ReturnExchange from '../../../individual-product/component/ReturnExchange/ReturnExchange';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiCreditCard } from 'react-icons/fi';
import stores from '../../../../store/stores';
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useState } from 'react';

// Define a proper interface for product to make it production-ready
interface Product {
    name: string;
    category: string;
    price: number | string;
    rating?: number;
    description?: string;
    brand?: string;
    productDetails?: Record<string, any>;
    information?: Record<string, any>;
    stock?: number;
    sku?: string;
    weight?: string;
    image?: string;
    images?: string[];
    _id?: string;
}

const ProductDetailsSection = observer(({ product }: { product: Product }) => {
    const {
        name,
        category,
        price,
        rating = 4.5,
        description,
        brand,
        productDetails,
        information,
        stock,
        sku,
        weight,
        image,
        images = [],
    } = product;

    const { cartStore } = stores;
    const toast = useToast();
    const displayImage = image || (images && images.length > 0 ? images[0] : "");
    const initialImage = image || (images.length > 0 ? images[0] : '');
    const [selectedImage, setSelectedImage] = useState(initialImage);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    const currentPrice = Number(price);
    const mrp = currentPrice + currentPrice * 0.2; // Fake MRP for display
    const discount = Math.round(((mrp - currentPrice) / mrp) * 100);

    const highlights = [
        { label: 'Brand', value: brand },
        { label: 'SKU', value: sku },
        { label: 'Stock', value: stock && stock > 0 ? 'In Stock' : 'Out of Stock' },
        { label: 'Weight', value: weight },
        ...(productDetails
            ? Object.entries(productDetails).map(([key, value]) => ({ label: key, value: String(value) }))
            : []),
    ].filter((item) => item.value);

    const infoSpecs = information
        ? Object.entries(information).map(([key, value]) => ({ label: key, value: String(value) }))
        : [];

    const colors = productDetails?.color ? [productDetails.color] : [];
    const sizes = productDetails?.size
        ? [productDetails.size]
        : productDetails?.ssd
            ? [productDetails.ssd]
            : [];

    const services = [
        { label: '7 Days Replacement', icon: 'return' },
        { label: 'Cash on Delivery', icon: 'cod' },
    ];

    // Theme-aware colors for better attractiveness in light/dark modes
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const dividerColor = useColorModeValue('gray.300', 'gray.600');
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const accentColor = useColorModeValue('purple.500', 'purple.300');

    // Animation variants for subtle fade-in
    const fadeInVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <VStack spacing={6} align="stretch" as={motion.div} initial="hidden" animate="visible" variants={fadeInVariants}>
            <Box
                p={{ base: 4, md: 6 }}
                borderWidth={1}
                borderColor={borderColor}
                rounded="2xl"
                shadow="sm"
                bg={bgColor}
            >
                <Flex align="center" justify="space-between" mb={2}>
                    <ProductTitle brand={brand || category || 'Generic'} title={name} />
                    {discount > 0 && (
                        <Badge colorScheme="green" fontSize="md" px={3} py={1} rounded="full">
                            {discount}% OFF
                        </Badge>
                    )}
                </Flex>

                <ProductRating rating={rating} reviews={120} />
                <ProductPrice price={currentPrice} discount={discount} mrp={mrp} />
                <Divider borderColor={dividerColor} maxW="90%" mx="auto" my={4} />

                {colors.length > 0 && (
                    <motion.div variants={fadeInVariants}>
                        <ProductColorSelector colors={colors} selectedColor={selectedColor} onSelect={setSelectedColor} />
                    </motion.div>
                )}
                {sizes.length > 0 && (
                    <motion.div variants={fadeInVariants}>
                        <ProductSizeSelector sizes={sizes} selectedSize={selectedSize} onSelect={setSelectedSize} />
                    </motion.div>
                )}

                <Divider borderColor={dividerColor} maxW="90%" mx="auto" my={6} />
                <ReturnExchange services={services} />

                {description && (
                    <Box mt={6}>
                        <Heading fontSize="md" fontWeight="bold" mb={2}>
                            Description
                        </Heading>
                        <Text color={textColor} fontSize="sm" whiteSpace="pre-wrap" lineHeight="tall">
                            {description}
                        </Text>
                    </Box>
                )}
            </Box>

            <ProductSpecs specs={highlights} title="Highlights" />
            {infoSpecs.length > 0 && <ProductSpecs specs={infoSpecs} title="Information" />}
        </VStack>
    );
});

export default ProductDetailsSection;