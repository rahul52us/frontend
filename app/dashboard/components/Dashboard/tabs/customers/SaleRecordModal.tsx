"use client";

import React from "react";
import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
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
import BottomSheetDrawer from "../../../../../component/common/Drawer/BottomSheetDrawer";
import { useCustomerTheme } from "./theme";
import {
  InventoryProductSuggestion,
  SaleFormItem,
  SaleFormValues,
} from "./types";
import {
  calculateSaleLineTotal,
  formatCurrency,
} from "./utils";

export interface SaleRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  useCompact: boolean;
  saleFormValues: SaleFormValues;
  setSaleFormValues: React.Dispatch<React.SetStateAction<SaleFormValues>>;
  activeSaleItemIndex: number | null;
  setActiveSaleItemIndex: React.Dispatch<React.SetStateAction<number | null>>;
  saleItemSuggestions: InventoryProductSuggestion[];
  saleItemSuggestionsLoading: boolean;
  onApplySuggestedProduct: (index: number, product: InventoryProductSuggestion) => void;
  onAddSaleItem: () => void;
  onRemoveSaleItem: (index: number) => void;
  onUpdateSaleItem: (index: number, field: keyof SaleFormItem, value: string) => void;
  submitting: boolean;
  onSubmit: () => void;
  selectedPartyType: "customer" | "supplier";
}

export const SaleRecordModal: React.FC<SaleRecordModalProps> = ({
  isOpen,
  onClose,
  useCompact,
  saleFormValues,
  setSaleFormValues,
  activeSaleItemIndex,
  setActiveSaleItemIndex,
  saleItemSuggestions,
  saleItemSuggestionsLoading,
  onApplySuggestedProduct,
  onAddSaleItem,
  onRemoveSaleItem,
  onUpdateSaleItem,
  submitting,
  onSubmit,
  selectedPartyType,
}) => {
  const theme = useCustomerTheme();
  const { cAccentSoft, cTextMuted, cBorder } = theme;

  const isSelectedSupplier = selectedPartyType === "supplier";
  const selectedTransactionSingularLabel = isSelectedSupplier ? "Purchase" : "Sale";

  const renderSaleRecordFormFields = () => (
    <VStack spacing={4} align="stretch">
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
        <FormControl>
          <FormLabel>{isSelectedSupplier ? "Purchase" : "Sale"} Date (optional)</FormLabel>
          <Input
            type="datetime-local"
            value={saleFormValues.saleDate}
            onChange={(e) => setSaleFormValues((prev) => ({ ...prev, saleDate: e.target.value }))}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Notes (optional)</FormLabel>
          <Input
            value={saleFormValues.notes}
            onChange={(e) => setSaleFormValues((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder={isSelectedSupplier ? "Purchase remarks" : "Sale remarks"}
          />
        </FormControl>
      </SimpleGrid>

      <Box borderWidth="1px" borderColor={cBorder} bg={cAccentSoft} borderRadius="lg" p={3}>
        <Text fontSize="sm" color={cTextMuted}>
          This will appear immediately in the activity list with its item details.
        </Text>
      </Box>

      <VStack align="stretch" spacing={4}>
        {saleFormValues.items.map((item, index) => (
          <Box key={`sale-item-${index}`} borderWidth="1px" borderRadius="md" p={3}>
            <SimpleGrid columns={{ base: 1, md: 2, xl: 6 }} spacing={3}>
              <FormControl position="relative" gridColumn={{ base: "auto", md: "span 2 / span 2" }}>
                <FormLabel>Item Name</FormLabel>
                <Input
                  value={item.itemName}
                  onChange={(e) => onUpdateSaleItem(index, "itemName", e.target.value)}
                  onFocus={() => setActiveSaleItemIndex(index)}
                  onBlur={() => {
                    window.setTimeout(() => {
                      setActiveSaleItemIndex((current) => (current === index ? null : current));
                    }, 120);
                  }}
                  placeholder="e.g. Cement Bag"
                  autoComplete="off"
                />
                {activeSaleItemIndex === index && item.itemName.trim() ? (
                  <Box
                    position="absolute"
                    top="calc(100% + 8px)"
                    left={0}
                    right={0}
                    bg="white"
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="lg"
                    boxShadow="xl"
                    zIndex={20}
                    overflow="hidden"
                    maxH="320px"
                    overflowY="auto"
                  >
                    {saleItemSuggestionsLoading ? (
                      <Flex align="center" justify="center" py={4} gap={2}>
                        <Spinner size="sm" color="var(--color-primary)" />
                        <Text fontSize="sm" color="gray.600">
                          Searching your inventory...
                        </Text>
                      </Flex>
                    ) : saleItemSuggestions.length > 0 ? (
                      <VStack align="stretch" spacing={0}>
                        {saleItemSuggestions.map((product, suggestionIndex) => (
                          <Box
                            key={product._id}
                            px={3}
                            py={3}
                            cursor="pointer"
                            bg="white"
                            borderTopWidth={suggestionIndex === 0 ? "0" : "1px"}
                            borderColor="gray.100"
                            _hover={{ bg: "gray.50" }}
                            onMouseDown={(event) => {
                              event.preventDefault();
                              onApplySuggestedProduct(index, product);
                            }}
                          >
                            <Flex justify="space-between" align="flex-start" gap={3}>
                              <Box minW={0}>
                                <Text
                                  fontSize="sm"
                                  fontWeight="semibold"
                                  color="gray.800"
                                  whiteSpace="normal"
                                  lineHeight="short"
                                >
                                  {product.name}
                                </Text>
                                <Text
                                  fontSize="xs"
                                  color="gray.500"
                                  whiteSpace="normal"
                                  lineHeight="short"
                                  mt={1}
                                >
                                  {[product.brand, product.sku ? `SKU: ${product.sku}` : ""]
                                    .filter(Boolean)
                                    .join(" | ") || "Inventory product"}
                                </Text>
                              </Box>
                              <Box textAlign="right" flexShrink={0}>
                                <Text fontSize="sm" fontWeight="semibold" color="var(--color-primary)">
                                  {formatCurrency(Number(product.price || 0))}
                                </Text>
                                {typeof product.stock === "number" && Number.isFinite(product.stock) ? (
                                  <Text fontSize="xs" color="gray.500">
                                    Stock {product.stock}
                                  </Text>
                                ) : null}
                              </Box>
                            </Flex>
                          </Box>
                        ))}
                      </VStack>
                    ) : (
                      <Box px={3} py={3}>
                        <Text fontSize="sm" color="gray.600">
                          No matching inventory items found.
                        </Text>
                      </Box>
                    )}
                  </Box>
                ) : null}
                {item.productId ? (
                  <Text mt={2} fontSize="xs" color="var(--color-primary)" fontWeight="medium">
                    Price auto-filled from your inventory. You can still edit this row.
                  </Text>
                ) : null}
              </FormControl>

              <FormControl>
                <FormLabel>Quantity</FormLabel>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.quantity}
                  onChange={(e) => onUpdateSaleItem(index, "quantity", e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Unit Price</FormLabel>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => onUpdateSaleItem(index, "unitPrice", e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Discount</FormLabel>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.discount}
                  onChange={(e) => onUpdateSaleItem(index, "discount", e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Tax</FormLabel>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.tax}
                  onChange={(e) => onUpdateSaleItem(index, "tax", e.target.value)}
                />
              </FormControl>
            </SimpleGrid>

            <Flex mt={3} justify="space-between" align="center">
              <Text fontSize="sm" color="gray.600">
                Line Total: {formatCurrency(calculateSaleLineTotal(item))}
              </Text>
              <Button
                size="xs"
                colorScheme="red"
                variant="ghost"
                onClick={() => onRemoveSaleItem(index)}
                isDisabled={saleFormValues.items.length <= 1}
              >
                Remove
              </Button>
            </Flex>
          </Box>
        ))}
      </VStack>

      <Button size="sm" variant="outline" leftIcon={<AddIcon />} alignSelf="flex-start" onClick={onAddSaleItem}>
        Add Item Row
      </Button>
    </VStack>
  );

  if (useCompact) {
    return (
      <BottomSheetDrawer
        isOpen={isOpen}
        onClose={onClose}
        title={`Add ${isSelectedSupplier ? "Supplier Purchase" : "Customer Sale"} Record`}
        size="full"
        bodyProps={{ py: 4 }}
        footer={
          <>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="brand" onClick={onSubmit} isLoading={submitting} flex="1" h="52px">
              Save {selectedTransactionSingularLabel} Record
            </Button>
          </>
        }
      >
        {renderSaleRecordFormFields()}
      </BottomSheetDrawer>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add {isSelectedSupplier ? "Supplier Purchase" : "Customer Sale"} Record</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{renderSaleRecordFormFields()}</ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="brand" onClick={onSubmit} isLoading={submitting}>
            Save {selectedTransactionSingularLabel} Record
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SaleRecordModal;
