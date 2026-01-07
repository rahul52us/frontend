import React from "react";
import {
    Box,
    Flex,
    Heading,
    Text,
    Image,
    Badge,
    HStack,
    IconButton,
    Tooltip,
    useColorModeValue,
} from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";

interface ProductCardProps {
    product: any;
    onEdit: (product: any) => void;
    onDelete: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
    const cardBg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.100", "gray.700");

    return (
        <Box
            bg={cardBg}
            borderRadius="xl"
            overflow="hidden"
            boxShadow="md"
            border="1px solid"
            borderColor={borderColor}
            transition="all 0.3s ease-in-out"
            _hover={{
                transform: "translateY(-6px)",
                boxShadow: "lg",
                borderColor: "blue.300",
            }}
        >
            <Box h="220px" w="100%" position="relative" bg="gray.50">
                <Image
                    src={product.images?.[0] || "https://via.placeholder.com/300?text=Product+Image"}
                    alt={product.name}
                    objectFit="cover"
                    w="100%"
                    h="100%"
                    transition="transform 0.3s ease"
                    _hover={{ transform: "scale(1.05)" }}
                />
                <Badge
                    position="absolute"
                    top={3}
                    right={3}
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="sm"
                    colorScheme={product.stock > 0 ? "green" : "red"}
                    variant="solid"
                    boxShadow="sm"
                >
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
                </Badge>
            </Box>
            <Box p={5} bgGradient="linear(to-b, transparent, gray.50)">
                <Flex justify="space-between" align="center" mb={3}>
                    <Heading
                        size="md"
                        noOfLines={1}
                        title={product.name}
                        color="gray.800"
                        fontWeight="semibold"
                    >
                        {product.name}
                    </Heading>
                    <Text fontWeight="bold" color="blue.600" fontSize="lg">
                        ₹{product.price.toLocaleString()}
                    </Text>
                </Flex>
                <Text fontSize="sm" color="gray.600" mb={4} noOfLines={2} lineHeight="tall">
                    {product.description || "No description available"}
                </Text>
                <HStack justify="space-between" align="center">
                    <Badge
                        variant="subtle"
                        colorScheme="purple"
                        borderRadius="md"
                        px={3}
                        py={1}
                        fontSize="xs"
                        textTransform="uppercase"
                    >
                        {product.category}
                    </Badge>
                    <HStack spacing={2}>
                        <Tooltip label="Edit product" hasArrow placement="top">
                            <IconButton
                                aria-label="Edit product"
                                icon={<FaEdit />}
                                size="sm"
                                variant="ghost"
                                color="gray.600"
                                _hover={{ color: "blue.500", bg: "blue.50" }}
                                onClick={() => onEdit(product)}
                            />
                        </Tooltip>
                        <Tooltip label="Delete product" hasArrow placement="top">
                            <IconButton
                                aria-label="Delete product"
                                icon={<FaTrash />}
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                _hover={{ color: "red.500", bg: "red.50" }}
                                onClick={() => onDelete(product._id)}
                            />
                        </Tooltip>
                    </HStack>
                </HStack>
            </Box>
        </Box>
    );
};

export default ProductCard;
