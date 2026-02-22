import { Box, Divider, Text, SimpleGrid, VStack, useColorModeValue, Flex, Badge, Heading, HStack, Icon } from '@chakra-ui/react';
import ProductTitle from '../../../individual-product/component/ProductTitle/ProductTitle';
import ProductRating from '../../../individual-product/component/ProductRating/ProductRating';
import ProductPrice from '../../../individual-product/component/ProductPrice/ProductPrice';
import ProductColorSelector from '../../../individual-product/component/ProductColorSelector/ProductColorSelector';
import ProductSizeSelector from '../../../individual-product/component/ProductSizeSelector/ProductSizeSelector';
import ReturnExchange from '../../../individual-product/component/ReturnExchange/ReturnExchange';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';

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
        weight
    } = product;

    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    const currentPrice = Number(price);
    const mrp = currentPrice + currentPrice * 0.2; // Fake MRP for display
    const discount = Math.round(((mrp - currentPrice) / mrp) * 100);

    // Combine Highlights, Details, and Info for a dynamic specs section
    const dynamicSpecs = [
        ...Object.entries(productDetails || {}),
        ...Object.entries(information || {})
    ].filter(([key, value]) => key !== 'color' && key !== 'size' && key !== 'ssd' && value);

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

    // Theme-aware colors
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const labelColor = useColorModeValue('gray.500', 'gray.500');
    const valueColor = useColorModeValue('gray.800', 'gray.200');
    const dividerColor = useColorModeValue('gray.200', 'gray.700');

    // Animation variants
    const fadeInVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    };

    return (
        <VStack spacing={4} align="stretch" as={motion.div} initial="hidden" animate="visible" variants={fadeInVariants}>
            {/* Header Section - Clean & Big */}
            <Box>
                <Text fontSize="xs" fontWeight="bold" color="blue.500" textTransform="uppercase" letterSpacing="wide" mb={1}>
                    {brand || category || 'Brand'}
                </Text>
                <Heading as="h1" size="lg" lineHeight="shorter" fontWeight="800" mb={2}>
                    {name}
                </Heading>

                <Flex align="center" gap={4} mb={4}>
                    <ProductRating rating={rating} reviews={120} />
                    <HStack spacing={1}>
                        <Icon as={FiCheckCircle} color="green.500" />
                        <Text fontSize="sm" color="green.600" fontWeight="medium">
                            {(stock && stock > 0) ? "In Stock" : "Out of Stock"}
                        </Text>
                    </HStack>
                </Flex>

                <ProductPrice price={currentPrice} discount={discount} mrp={mrp} />
            </Box>

            {/* Selectors */}
            {(colors.length > 0 || sizes.length > 0) && (
                <Box>
                    {colors.length > 0 && (
                        <Box mb={4}>
                            <ProductColorSelector colors={colors} selectedColor={selectedColor} onSelect={setSelectedColor} />
                        </Box>
                    )}
                    {sizes.length > 0 && (
                        <ProductSizeSelector sizes={sizes} selectedSize={selectedSize} onSelect={setSelectedSize} />
                    )}
                </Box>
            )}

            <Divider borderColor={dividerColor} />
            <ReturnExchange services={services} />

        </VStack>
    );
});

export default ProductDetailsSection;