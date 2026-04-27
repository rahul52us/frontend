import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Center,
  HStack,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaCheck, FaSearch } from "react-icons/fa";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";

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
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();
    setFilteredProducts(
      products.filter(
        (product) =>
          product.name?.toLowerCase().includes(lowerSearch) ||
          product.sku?.toLowerCase().includes(lowerSearch) ||
          product.brand?.toLowerCase().includes(lowerSearch)
      )
    );
  }, [searchTerm, products]);

  const handleSelect = (product: any) => {
    onSelect(product);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay bg="rgba(0, 0, 0, 0.74)" backdropFilter="blur(6px)" />
      <ModalContent
        borderRadius="24px"
        maxH="85vh"
        bg={dashboardPalette.shell}
        border="1px solid"
        borderColor={dashboardPalette.border}
      >
        <ModalHeader borderBottomWidth="1px" borderBottomColor={dashboardPalette.border} pb={4}>
          <Text
            fontSize="xl"
            fontWeight="500"
            color={dashboardPalette.text}
            fontFamily='Georgia, "Times New Roman", serif'
          >
            Select Freebie Product
          </Text>
          <Text fontSize="sm" color={dashboardPalette.textMuted} fontWeight="normal" mt={1}>
            Choose a product from your inventory to offer as a freebie.
          </Text>
        </ModalHeader>
        <ModalCloseButton color={dashboardPalette.text} />

        <ModalBody py={4}>
          <InputGroup mb={4}>
            <InputLeftElement pointerEvents="none">
              <Icon as={FaSearch} color={dashboardPalette.textSoft} />
            </InputLeftElement>
            <Input
              placeholder="Search products by name, SKU, or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg={dashboardPalette.surfaceAlt}
              border="1px solid"
              borderColor={dashboardPalette.borderStrong}
              color={dashboardPalette.text}
              borderRadius="16px"
              _placeholder={{ color: dashboardPalette.textSoft }}
              _focusVisible={{
                borderColor: dashboardPalette.accent,
                boxShadow: `0 0 0 1px ${dashboardPalette.accent}`,
              }}
            />
          </InputGroup>

          {loading ? (
            <Center py={10}>
              <VStack spacing={3}>
                <Spinner size="lg" color={dashboardPalette.accent} />
                <Text color={dashboardPalette.textMuted}>Loading products...</Text>
              </VStack>
            </Center>
          ) : filteredProducts.length === 0 ? (
            <Center py={10}>
              <VStack spacing={3}>
                <Text fontSize="lg" color={dashboardPalette.text} fontWeight="medium">
                  No products found
                </Text>
                <Text color={dashboardPalette.textSoft} fontSize="sm">
                  {searchTerm ? "Try a different search term" : "Add products to your inventory first"}
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
                    borderWidth="1px"
                    borderRadius="18px"
                    borderColor={isSelected ? dashboardPalette.accent : dashboardPalette.borderStrong}
                    bg={isSelected ? dashboardPalette.accentSoft : dashboardPalette.surface}
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{
                      borderColor: dashboardPalette.accent,
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
                            fontWeight="600"
                            fontSize="sm"
                            noOfLines={2}
                            flex={1}
                            color={dashboardPalette.text}
                          >
                            {product.name}
                          </Text>
                          {isSelected ? (
                            <Icon as={FaCheck} color={dashboardPalette.accentStrong} boxSize={4} />
                          ) : null}
                        </HStack>
                        {product.brand ? (
                          <Text fontSize="xs" color={dashboardPalette.textSoft}>
                            {product.brand}
                          </Text>
                        ) : null}
                        <HStack mt={2} spacing={2} flexWrap="wrap">
                          <Badge bg={dashboardPalette.accentSoft} color={dashboardPalette.accentStrong}>
                            Rs {product.price}
                          </Badge>
                          {product.stock > 0 ? (
                            <Badge bg="rgba(70, 201, 139, 0.14)" color={dashboardPalette.success}>
                              Stock: {product.stock}
                            </Badge>
                          ) : (
                            <Badge bg="rgba(239, 107, 107, 0.14)" color={dashboardPalette.danger}>
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

        <ModalFooter borderTopWidth="1px" borderTopColor={dashboardPalette.border} pt={4}>
          <Button
            variant="outline"
            mr={3}
            onClick={onClose}
            borderColor={dashboardPalette.borderStrong}
            color={dashboardPalette.textMuted}
            _hover={{ bg: "rgba(255,255,255,0.04)", color: dashboardPalette.text }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FreebieProductModal;
