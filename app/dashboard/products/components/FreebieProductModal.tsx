import React, { useState, useEffect } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    Icon,
    VStack,
    HStack,
    Box,
    Text,
    Image,
    SimpleGrid,
    Spinner,
    Center,
    Badge,
} from "@chakra-ui/react";
import { FaSearch, FaCheck } from "react-icons/fa";

interface FreebieProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    products: any[];
    selectedProductId?: string;
    onSelect: (product: any) => void;
    loading?: boolean;
}

const FreebieProductModal: React.FC<FreebieProductModalProps> = ({
    isOpen,
    onClose,
    products,
    selectedProductId,
    onSelect,
    loading = false,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredProducts(products);
        } else {
            const lowerSearch = searchTerm.toLowerCase();
            setFilteredProducts(
                products.filter(
                    (p) =>
                        p.name?.toLowerCase().includes(lowerSearch) ||
                        p.sku?.toLowerCase().includes(lowerSearch) ||
                        p.brand?.toLowerCase().includes(lowerSearch)
                )
            );
        }
    }, [searchTerm, products]);

    const handleSelect = (product: any) => {
        onSelect(product);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
            <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
            <ModalContent borderRadius="xl" maxH="85vh">
                <ModalHeader borderBottomWidth="1px" pb={4}>
                    <Text fontSize="xl" fontWeight="bold">
                        Select Freebie Product
                    </Text>
                    <Text fontSize="sm" color="gray.500" fontWeight="normal" mt={1}>
                        Choose a product from your inventory to offer as a freebie
                    </Text>
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody py={4}>
                    {/* Search Input */}
                    <InputGroup mb={4}>
                        <InputLeftElement>
                            <Icon as={FaSearch} color="gray.400" />
                        </InputLeftElement>
                        <Input
                            placeholder="Search products by name, SKU, or brand..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            bg="gray.50"
                            border="1px solid"
                            borderColor="gray.200"
                            _focus={{ bg: "white", borderColor: "blue.400", shadow: "sm" }}
                        />
                    </InputGroup>

                    {/* Products Grid */}
                    {loading ? (
                        <Center py={10}>
                            <VStack spacing={3}>
                                <Spinner size="lg" color="blue.500" />
                                <Text color="gray.500">Loading products...</Text>
                            </VStack>
                        </Center>
                    ) : filteredProducts.length === 0 ? (
                        <Center py={10}>
                            <VStack spacing={3}>
                                <Text fontSize="lg" color="gray.600" fontWeight="medium">
                                    No products found
                                </Text>
                                <Text color="gray.500" fontSize="sm">
                                    {searchTerm
                                        ? "Try a different search term"
                                        : "Add products to your inventory first"}
                                </Text>
                            </VStack>
                        </Center>
                    ) : (
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                            {filteredProducts.map((product) => {
                                const isSelected = product._id === selectedProductId;
                                const imageUrl =
                                    product.images?.[0]?.preview ||
                                    product.images?.[0] ||
                                    "https://via.placeholder.com/100x100?text=No+Image";

                                return (
                                    <Box
                                        key={product._id}
                                        p={3}
                                        borderWidth="2px"
                                        borderRadius="lg"
                                        borderColor={isSelected ? "blue.500" : "gray.200"}
                                        bg={isSelected ? "blue.50" : "white"}
                                        cursor="pointer"
                                        transition="all 0.2s"
                                        _hover={{
                                            borderColor: isSelected ? "blue.500" : "blue.300",
                                            shadow: "md",
                                            transform: "translateY(-2px)",
                                        }}
                                        onClick={() => handleSelect(product)}
                                    >
                                        <HStack spacing={3} align="flex-start">
                                            <Image
                                                src={imageUrl}
                                                alt={product.name}
                                                boxSize="60px"
                                                objectFit="cover"
                                                borderRadius="md"
                                                fallbackSrc="https://via.placeholder.com/60x60?text=?"
                                            />
                                            <Box flex={1} minW={0}>
                                                <HStack justify="space-between" align="flex-start">
                                                    <Text
                                                        fontWeight="semibold"
                                                        fontSize="sm"
                                                        noOfLines={2}
                                                        flex={1}
                                                    >
                                                        {product.name}
                                                    </Text>
                                                    {isSelected && (
                                                        <Icon as={FaCheck} color="blue.500" boxSize={4} />
                                                    )}
                                                </HStack>
                                                {product.brand && (
                                                    <Text fontSize="xs" color="gray.500">
                                                        {product.brand}
                                                    </Text>
                                                )}
                                                <HStack mt={1} spacing={2}>
                                                    <Badge colorScheme="green" size="sm">
                                                        ₹{product.price}
                                                    </Badge>
                                                    {product.stock > 0 ? (
                                                        <Badge colorScheme="blue" size="sm">
                                                            Stock: {product.stock}
                                                        </Badge>
                                                    ) : (
                                                        <Badge colorScheme="red" size="sm">
                                                            Out of stock
                                                        </Badge>
                                                    )}
                                                </HStack>
                                            </Box>
                                        </HStack>
                                    </Box>
                                );
                            })}
                        </SimpleGrid>
                    )}
                </ModalBody>

                <ModalFooter borderTopWidth="1px" pt={4}>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default FreebieProductModal;
