
import { ArrowLeftIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Icon,
    Text,
    VStack,
    Image,
    useToast,
    IconButton
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import stores from "../../../../store/stores";
import { FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { authentication } from "../../../../config/utils/routes";

const WishlistDrawer = observer(
    ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
        const { cartStore, auth } = stores;
        const router = useRouter();
        const toast = useToast();
        const [wishlistItems, setWishlistItems] = useState<any[]>([]);
        const [loading, setLoading] = useState(false);

        useEffect(() => {
            const fetchWishlist = async () => {
                if (!auth.user) return;
                setLoading(true);
                try {
                    const items = await auth.fetchWishlist();
                    setWishlistItems(items || []);
                } catch {
                    // ignore error
                } finally {
                    setLoading(false);
                }
            }

            if (isOpen && auth.user) {
                fetchWishlist();
            }
        }, [isOpen, auth.user, auth]);

        const handleAddToCart = async (product: any) => {
            if (!auth.user) {
                onClose();
                router.push(authentication.login);
                return;
            }
            await cartStore.addToCart(product);
            toast({
                title: "Added to Cart",
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "bottom"
            });
        };

        const handleRemoveFromWishlist = async (productId: string) => {
            try {
                await auth.toggleLikeProduct(productId);
                setWishlistItems(prev => prev.filter(item => item._id !== productId));
            } catch {
                // ignore error
            }
        }

        const isEmpty = wishlistItems.length === 0;

        return (
            <>
                <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
                    <DrawerOverlay bg="blackAlpha.400" />

                    <DrawerContent
                        bg="gray.50"
                        borderLeftRadius="2xl"
                        maxW={{ lg: "28rem" }}
                    >
                        {/* HEADER */}
                        <DrawerHeader bg="white" py={4} borderBottom="1px solid #e2e8f0">
                            <Flex align="center" gap={3}>
                                <Icon
                                    as={ArrowLeftIcon}
                                    cursor="pointer"
                                    onClick={onClose}
                                    color="gray.600"
                                />
                                <Text fontSize="lg" fontWeight={600}>
                                    Your Wishlist
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                    ({wishlistItems.length})
                                </Text>
                            </Flex>
                        </DrawerHeader>

                        {/* BODY */}
                        <DrawerBody px={4} py={4}>
                            {loading ? (
                                <Flex justify="center" align="center" h="100%">
                                    <Text>Loading...</Text>
                                </Flex>
                            ) : isEmpty ? (
                                <Flex
                                    direction="column"
                                    align="center"
                                    justify="center"
                                    h="100%"
                                    textAlign="center"
                                    gap={4}
                                >
                                    <Image
                                        src="https://img.freepik.com/premium-vector/heart-icon-vector-illustration-symbol-love-valentine-s-day-sign-emblem-isolated-white-background-flat-style-graphic-design-web-logo-app-ui_662353-936.jpg?w=740" // Placeholder heart
                                        alt="Empty wishlist"
                                        maxW="180px"
                                        opacity={0.9}
                                    />
                                    <Box>
                                        <Text fontSize="lg" fontWeight={600}>
                                            Your wishlist is empty
                                        </Text>
                                        <Text fontSize="sm" color="gray.500" mt={1}>
                                            Save items you love to view them here
                                        </Text>
                                    </Box>

                                    <Button
                                        variant="outline"
                                        colorScheme="purple"
                                        size="sm"
                                        mt={2}
                                        onClick={onClose}
                                    >
                                        Continue shopping
                                    </Button>
                                </Flex>
                            ) : (
                                <VStack spacing={3} align="stretch">
                                    {wishlistItems.map((product) => (
                                        <Box
                                            key={product._id}
                                            bg="white"
                                            rounded="lg"
                                            p={3}
                                            boxShadow="sm"
                                            border="1px solid"
                                            borderColor="gray.100"
                                        >
                                            <Flex gap={4}>
                                                <Image
                                                    src={product.image || product.images?.[0]}
                                                    alt={product.name}
                                                    boxSize="80px"
                                                    objectFit="cover"
                                                    borderRadius="md"
                                                />
                                                <Box flex="1">
                                                    <Flex justify="space-between" align="start">
                                                        <Text fontWeight="semibold" noOfLines={2} fontSize="sm">
                                                            {product.name}
                                                        </Text>
                                                        <IconButton
                                                            aria-label="Remove"
                                                            icon={<FiTrash2 />}
                                                            size="xs"
                                                            colorScheme="red"
                                                            variant="ghost"
                                                            onClick={() => handleRemoveFromWishlist(product._id)}
                                                        />
                                                    </Flex>
                                                    <Text fontWeight="bold" color="purple.600" mt={1}>
                                                        ₹{product.price}
                                                    </Text>
                                                    <Button
                                                        size="sm"
                                                        w="full"
                                                        mt={2}
                                                        colorScheme="purple"
                                                        variant="outline"
                                                        leftIcon={<FiShoppingCart />}
                                                        onClick={() => handleAddToCart(product)}
                                                    >
                                                        Add to Cart
                                                    </Button>
                                                </Box>
                                            </Flex>
                                        </Box>
                                    ))}
                                </VStack>
                            )}
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            </>
        );
    }
);

export default WishlistDrawer;
