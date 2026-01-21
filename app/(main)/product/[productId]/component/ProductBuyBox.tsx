import { Box, Button, Flex, Text, VStack, useColorModeValue, useToast, Image } from '@chakra-ui/react';
import { FiShoppingCart, FiCreditCard } from 'react-icons/fi';
import { observer } from 'mobx-react-lite';
import stores from '../../../../store/stores';
import CouponOffers from '../../../individual-product/component/CouponOffers.tsx/CouponOffers';
import { CheckCircleIcon } from '@chakra-ui/icons';
import ProductLikeButton from '../../../products/components/ProductCard/ProductLikeButton';

const ProductBuyBox = observer(({ product }: { product: any }) => {
    const { cartStore } = stores;
    const toast = useToast();

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

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    // Dummy offers
    const offers = [
        'Bank Offer 5% Unlimited Cashback on Axis Bank Credit Card',
        'Special Price Get extra 10% off (price inclusive of discount)',
    ];

    return (
        <Box
            w="100%"
            minH="550px"
            p={4}
            borderWidth={1}
            borderColor={borderColor}
            rounded="xl"
            shadow="md"
            bg={bgColor}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
        >
            <CouponOffers offers={offers} />

            <Box mt={4}>
                <Text fontSize="xl" fontWeight="bold" color="green.600" mb={2}>
                    {(stock ?? 0) > 0 ? 'In Stock' : 'Out of Stock'}
                </Text>
                <Text fontSize="sm" mb={4}>
                    Sold by <Text as="span" color="blue.500" cursor="pointer">{brand || 'Retailer'}</Text> and fulfilled by App.
                </Text>
            </Box>

            <VStack spacing={3} mt={6}>
                <Button
                    leftIcon={<FiShoppingCart />}
                    colorScheme="purple"
                    size="lg"
                    w="full"
                    onClick={handleAddToCart}
                    isLoading={cartStore.loading}
                    loadingText="Adding..."
                    isDisabled={(stock ?? 0) <= 0}
                    _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                    transition="all 0.2s"
                    rounded="full"
                >
                    {(stock ?? 0) > 0 ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button
                    leftIcon={<FiCreditCard />}
                    variant="solid"
                    bg="orange.400"
                    _hover={{ bg: 'orange.500', transform: 'translateY(-2px)', shadow: 'md' }}
                    color="white"
                    size="lg"
                    w="full"
                    isDisabled={(stock ?? 0) <= 0}
                    transition="all 0.2s"
                    rounded="full"
                >
                    Buy Now
                </Button>
                <Flex w="full" justify="center" align="center" gap={2} pt={2}>
                    <ProductLikeButton product={product} />
                    <Text fontSize="sm" fontWeight="medium" color="gray.600">Add to Wishlist</Text>
                </Flex>
            </VStack>
            <Flex align="center" gap={2} mt={4} fontSize="xs" color="gray.500" justify="center">
                <Text>Secure Transaction</Text>
            </Flex>
        </Box>
    );
});

export default ProductBuyBox;
