
import { useToast, Box, Image, Text } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

export const useCartToast = () => {
    const toast = useToast();

    const showAddToCartToast = (product: any, title = "Added to Cart", message?: string) => {
        const displayImage = product.image || (product.images && product.images.length > 0 ? product.images[0] : "");

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
                    {displayImage && (
                        <Image
                            src={displayImage}
                            alt={product.name}
                            boxSize="60px"
                            objectFit="cover"
                            borderRadius="lg"
                            border="1px solid"
                            borderColor="green.100"
                        />
                    )}
                    <Box>
                        <Text color="green.800" fontWeight="semibold" fontSize="md">
                            {title}
                        </Text>
                        <Text color="gray.700" fontSize="sm" noOfLines={1} maxW="240px">
                            {message || product.name}
                        </Text>
                    </Box>
                </Box>
            ),
        });
    };

    return { showAddToCartToast };
};
