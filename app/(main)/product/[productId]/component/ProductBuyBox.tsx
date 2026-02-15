import { Box, Button, Flex, Text, VStack, useColorModeValue, useToast, Image, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { FiShoppingCart, FiCreditCard } from 'react-icons/fi';
import { observer } from 'mobx-react-lite';
import stores from '../../../../store/stores';
import CouponOffers from '../../../individual-product/component/CouponOffers.tsx/CouponOffers';
import { CheckCircleIcon } from '@chakra-ui/icons';
import ProductLikeButton from '../../../products/components/ProductCard/ProductLikeButton';

const ProductBuyBox = observer(({ product }: { product: any }) => {
    const { cartStore } = stores;
    const toast = useToast();
    const router = useRouter();

    const { stock, brand, name, image, images } = product;
    const displayImage = image || (images && images.length > 0 ? images[0] : "");

    const handleAddToCart = async () => {
        if (stock && stock <= 0) {
            toast({
                title: 'Out of Stock',
                description: 'This product is currently unavailable.',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }

        await cartStore.addToCart(product);
        toast({
            position: "bottom",
            duration: 3000,
            isClosable: true,
            render: () => (
                <Box
                    p={4}
                    bg="green.50"
                    boxShadow="md"
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="green.200"
                    display="flex"
                    alignItems="center"
                    gap={4}
                    minW="320px"
                    maxW="400px"
                    _hover={{ boxShadow: "xl" }}
                    transition="box-shadow 0.2s ease-in-out"
                >
                    <CheckCircleIcon color="green.500" boxSize={6} />
                    <Image
                        src={displayImage}
                        alt={name}
                        boxSize="60px"
                        objectFit="cover"
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="green.100"
                    />
                    <Box>
                        <Text color="green.800" fontWeight="semibold" fontSize="md">
                            Added to Cart
                        </Text>
                        <Text color="gray.700" fontSize="sm" noOfLines={1} maxW="240px">
                            {name}
                        </Text>
                    </Box>
                </Box>
            ),
        });
    };

    const handleBuyNow = async () => {
        if (stock && stock <= 0) {
            toast({
                title: 'Out of Stock',
                description: 'This product is currently unavailable.',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }

        // await cartStore.addToCart(product); // Don't add to cart for direct buy now?
        // User requested separate flow. Often Buy Now implies bypassing cart.
        router.push(`/checkout?buyNow=true&productId=${product._id || product.id}`);
    };

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    // Dummy offers
    const offers = [
        'Bank Offer 5% Unlimited Cashback on Axis Bank Credit Card',
        'Special Price Get extra 10% off (price inclusive of discount)',
    ];

    return (
        <Box w="100%">
            {/* Stock & Seller Info */}
            <Flex justify="space-between" align="center" mb={6}>
                <HStack spacing={2}>
                    <Text fontWeight="bold" color={(stock ?? 0) > 0 ? 'green.600' : 'red.500'}>
                        {(stock ?? 0) > 0 ? 'In Stock' : 'Out of Stock'}
                    </Text>
                    <Text color="gray.400">|</Text>
                    <Text fontSize="sm" color="gray.600">
                        Sold by <Text as="span" color="blue.500" fontWeight="medium" cursor="pointer">{brand || 'Retailer'}</Text>
                    </Text>
                </HStack>
            </Flex>

            {/* Action Buttons */}
            <VStack spacing={4} align="stretch">
                <Flex gap={4} direction={{ base: "column", sm: "row" }}>
                    <Button
                        leftIcon={<FiShoppingCart />}
                        colorScheme="gray"
                        variant="outline"
                        size="lg"
                        flex={1}
                        h="56px" // Taller buttons
                        onClick={handleAddToCart}
                        isLoading={cartStore.loading}
                        loadingText="Adding..."
                        isDisabled={(stock ?? 0) <= 0}
                        rounded="xl"
                        borderWidth="2px"
                    >
                        {(stock ?? 0) > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                    <Button
                        leftIcon={<FiCreditCard />}
                        colorScheme="blackAlpha"
                        bg="black"
                        _hover={{ bg: "gray.800" }}
                        color="white"
                        size="lg"
                        flex={1}
                        h="56px"
                        onClick={handleBuyNow}
                        isLoading={cartStore.loading}
                        isDisabled={(stock ?? 0) <= 0}
                        rounded="xl"
                    >
                        Buy Now
                    </Button>
                </Flex>

                <HStack justify="center" spacing={6} pt={2}>
                    <Flex align="center" gap={2} cursor="pointer" color="gray.600" _hover={{ color: "black" }}>
                        <ProductLikeButton product={product} />
                        <Text fontSize="sm" fontWeight="medium">Add to Wishlist</Text>
                    </Flex>
                </HStack>
            </VStack>

            <Box mt={6}>
                <CouponOffers offers={offers} />
            </Box>
        </Box>
    );
});

export default ProductBuyBox;
