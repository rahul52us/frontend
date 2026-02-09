"use client"
import { IconButton, useToast, Box, Image, Text } from "@chakra-ui/react";
import { FiHeart } from "react-icons/fi";
import { observer } from "mobx-react-lite";
import stores from "../../../../store/stores";

const ProductLikeButton = observer(({ product }: { product: any }) => {
    const { auth: authStore } = stores;
    const toast = useToast();
    const { _id, name, image, images } = product;
    const displayImage = image || (images && images.length > 0 ? images[0] : "");

    const isLiked = authStore.wishlist?.some((p: any) => p._id === _id);

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (!authStore.user) {
            toast({
                title: "Please login to like products",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            await authStore.toggleLikeProduct(_id);

            if (!isLiked) {
                toast({
                    position: "bottom",
                    duration: 4000,
                    isClosable: true,
                    render: () => (
                        <Box
                            p={4}
                            bgGradient="linear(to-r, white, gray.50)"
                            boxShadow="2xl"
                            borderRadius="2xl"
                            borderLeft="6px solid"
                            borderColor="green.400"
                            display="flex"
                            alignItems="center"
                            gap={5}
                            minW="340px"
                            maxW="420px"
                            overflow="hidden"
                            transform="scale(1)"
                            _before={{
                                content: '""',
                                position: "absolute",
                                inset: 0,
                                bg: "green.50",
                                opacity: 0.15,
                                zIndex: -1,
                            }}
                        >
                            <Box position="relative">
                                <Image
                                    src={displayImage}
                                    alt={name}
                                    boxSize="64px"
                                    objectFit="cover"
                                    borderRadius="xl"
                                    border="2px solid white"
                                    boxShadow="md"
                                    fallbackSrc="https://via.placeholder.com/64?text=Img"
                                />
                                <Box
                                    position="absolute"
                                    inset="-4px"
                                    borderRadius="xl"
                                    bg="green.400"
                                    opacity={0.2}
                                    filter="blur(8px)"
                                    zIndex={-1}
                                />
                            </Box>

                            <Box flex="1">
                                <Text
                                    color="gray.900"
                                    fontWeight="bold"
                                    fontSize="md"
                                    mb={1}
                                >
                                    Added to Favorites
                                </Text>
                                <Text
                                    color="gray.600"
                                    fontSize="sm"
                                    noOfLines={1}
                                    fontWeight="medium"
                                >
                                    {name}
                                </Text>
                            </Box>

                            <FiHeart
                                fill="#e53e3e"
                                color="#e53e3e"
                                size={28}
                                style={{ flexShrink: 0 }}
                            />
                        </Box>
                    ),
                });
            }

        } catch {
            toast({
                title: "Failed to toggle like",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <IconButton
            aria-label="Add to wishlist"
            icon={<FiHeart fill={isLiked ? "red" : "none"} color={isLiked ? "red" : "currentColor"} />}
            size="sm"
            borderRadius="full"
            bg="white"
            color={isLiked ? "red.500" : "gray.700"}
            border="1px solid"
            borderColor="gray.200"
            _hover={{ bg: "gray.50", color: "red.500" }}
            onClick={handleLike}
        />
    );
});

export default ProductLikeButton;
