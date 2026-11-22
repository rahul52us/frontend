"use client";

import {
  Box,
  Button,
  Circle,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  IconButton,
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
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { FiCheckCircle, FiPlus, FiTrash2 } from "react-icons/fi";
import BottomSheetDrawer from "../../../../../component/common/Drawer/BottomSheetDrawer";
import { useCustomerTheme } from "./theme";
import {
  InventoryProductSuggestion,
  SaleFormItem,
  SaleFormValues,
} from "./types";
import { calculateSaleLineTotal, formatCurrency } from "./utils";

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
  const { cAccentSoft, cAccentStrong, cText, cTextMuted, cBorder } = theme;

  // Dropdown / card tokens (dark-mode aware)
  const cardBg = useColorModeValue("white", "whiteAlpha.50");
  const dropdownBg = useColorModeValue("white", "gray.800");
  const dropdownBorder = useColorModeValue("gray.200", "whiteAlpha.300");
  const dropdownDivider = useColorModeValue("gray.100", "whiteAlpha.200");
  const dropdownHover = useColorModeValue("gray.50", "whiteAlpha.100");
  const dropdownTitle = useColorModeValue("gray.800", "white");

  const isSelectedSupplier = selectedPartyType === "supplier";
  const selectedTransactionSingularLabel = isSelectedSupplier ? "Purchase" : "Sale";
  const modalTitle = `Add ${isSelectedSupplier ? "Supplier Purchase" : "Customer Sale"} Record`;
  const itemCount = saleFormValues.items.length;

  const grandTotal = saleFormValues.items.reduce((sum, item) => {
    const line = Number(calculateSaleLineTotal(item));
    return sum + (Number.isFinite(line) ? line : 0);
  }, 0);

  const labelProps = {
    mb: 1,
    fontSize: "xs",
    fontWeight: "700",
    color: cTextMuted,
  } as const;

  const numberField = (
    item: SaleFormItem,
    index: number,
    field: "quantity" | "unitPrice" | "discount" | "tax",
    label: string
  ) => (
    <FormControl>
      <FormLabel {...labelProps}>{label}</FormLabel>
      <Input
        type="number"
        inputMode="decimal"
        min="0"
        step="0.01"
        borderRadius="lg"
        value={item[field]}
        onChange={(e) => onUpdateSaleItem(index, field, e.target.value)}
        placeholder="0"
      />
    </FormControl>
  );

  const renderSuggestions = (index: number) => (
    <Box
      position="absolute"
      top="calc(100% + 6px)"
      left={0}
      right={0}
      bg={dropdownBg}
      borderWidth="1px"
      borderColor={dropdownBorder}
      borderRadius="xl"
      boxShadow="xl"
      zIndex={20}
      overflow="hidden"
      maxH="260px"
      overflowY="auto"
    >
      {saleItemSuggestionsLoading ? (
        <Flex align="center" justify="center" py={4} gap={2}>
          <Spinner size="sm" color="var(--color-primary)" />
          <Text fontSize="sm" color={cTextMuted}>
            Searching your inventory...
          </Text>
        </Flex>
      ) : saleItemSuggestions.length > 0 ? (
        <VStack align="stretch" spacing={0}>
          {saleItemSuggestions.map((product, suggestionIndex) => (
            <Box
              key={product._id}
              px={3}
              py={2.5}
              cursor="pointer"
              borderTopWidth={suggestionIndex === 0 ? "0" : "1px"}
              borderColor={dropdownDivider}
              _hover={{ bg: dropdownHover }}
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
                    color={dropdownTitle}
                    whiteSpace="normal"
                    lineHeight="short"
                  >
                    {product.name}
                  </Text>
                  <Text
                    fontSize="xs"
                    color={cTextMuted}
                    whiteSpace="normal"
                    lineHeight="short"
                    mt={0.5}
                  >
                    {[product.brand, product.sku ? `SKU: ${product.sku}` : ""]
                      .filter(Boolean)
                      .join(" | ") || "Inventory product"}
                  </Text>
                </Box>
                <Box textAlign="right" flexShrink={0}>
                  <Text fontSize="sm" fontWeight="bold" color="var(--color-primary)">
                    {formatCurrency(Number(product.price || 0))}
                  </Text>
                  {typeof product.stock === "number" && Number.isFinite(product.stock) ? (
                    <Text fontSize="xs" color={cTextMuted}>
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
          <Text fontSize="sm" color={cTextMuted}>
            No matching inventory items found.
          </Text>
        </Box>
      )}
    </Box>
  );

  const renderSaleRecordFormFields = () => (
    <VStack spacing={5} align="stretch">
      {/* Record details */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
        <FormControl>
          <FormLabel {...labelProps}>
            {selectedTransactionSingularLabel} date{" "}
            <Text as="span" fontWeight="500">
              (optional)
            </Text>
          </FormLabel>
          <Input
            type="datetime-local"
            borderRadius="lg"
            value={saleFormValues.saleDate}
            onChange={(e) =>
              setSaleFormValues((prev) => ({ ...prev, saleDate: e.target.value }))
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel {...labelProps}>
            Notes{" "}
            <Text as="span" fontWeight="500">
              (optional)
            </Text>
          </FormLabel>
          <Input
            borderRadius="lg"
            value={saleFormValues.notes}
            onChange={(e) => setSaleFormValues((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder={isSelectedSupplier ? "Purchase remarks" : "Sale remarks"}
          />
        </FormControl>
      </SimpleGrid>

      {/* Items */}
      <Box>
        <Flex align="center" justify="space-between" mb={2.5}>
          <Box>
            <Heading as="h3" fontSize="sm" fontWeight="800" color={cText}>
              Items ({itemCount})
            </Heading>
            <Text fontSize="xs" color={cTextMuted} mt={0.5}>
              Shows in the activity list with its item details
            </Text>
          </Box>
        </Flex>

        <VStack align="stretch" spacing={3}>
          {saleFormValues.items.map((item, index) => (
            <Box
              key={`sale-item-${index}`}
              borderWidth="1px"
              borderColor={cBorder}
              bg={cardBg}
              borderRadius="xl"
              p={{ base: 3, md: 4 }}
            >
              {/* Card header */}
              <Flex justify="space-between" align="center" mb={3}>
                <HStack spacing={2}>
                  <Circle
                    size="22px"
                    bg={cAccentSoft}
                    color={cAccentStrong}
                    fontSize="xs"
                    fontWeight="800"
                  >
                    {index + 1}
                  </Circle>
                  <Text fontSize="sm" fontWeight="700" color={cText}>
                    Item
                  </Text>
                </HStack>
                <IconButton
                  aria-label={`Remove item ${index + 1}`}
                  icon={<FiTrash2 size={15} />}
                  size="xs"
                  variant="ghost"
                  colorScheme="red"
                  borderRadius="md"
                  onClick={() => onRemoveSaleItem(index)}
                  isDisabled={itemCount <= 1}
                />
              </Flex>

              <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} spacing={3}>
                {/* Item name + inventory suggestions */}
                <FormControl
                  position="relative"
                  gridColumn={{ base: "span 2", md: "span 4", lg: "span 2" }}
                >
                  <FormLabel {...labelProps}>Item name</FormLabel>
                  <Input
                    borderRadius="lg"
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
                  {activeSaleItemIndex === index && item.itemName.trim()
                    ? renderSuggestions(index)
                    : null}
                  {item.productId ? (
                    <HStack mt={1.5} spacing={1.5} color="var(--color-primary)">
                      <Icon as={FiCheckCircle} boxSize={3.5} />
                      <Text fontSize="xs" fontWeight="medium">
                        Price filled from inventory — you can still edit it
                      </Text>
                    </HStack>
                  ) : null}
                </FormControl>

                {numberField(item, index, "quantity", "Quantity")}
                {numberField(item, index, "unitPrice", "Unit price")}
                {numberField(item, index, "discount", "Discount")}
                {numberField(item, index, "tax", "Tax")}
              </SimpleGrid>

              {/* Line total */}
              <Flex
                mt={3}
                px={3}
                py={2}
                justify="space-between"
                align="center"
                borderRadius="lg"
                bg={cAccentSoft}
              >
                <Text fontSize="xs" fontWeight="700" color={cTextMuted}>
                  Line total
                </Text>
                <Text fontSize="sm" fontWeight="900" color={cText}>
                  {formatCurrency(calculateSaleLineTotal(item))}
                </Text>
              </Flex>
            </Box>
          ))}
        </VStack>

        <Button
          mt={3}
          size="sm"
          h="38px"
          w="full"
          variant="outline"
          borderStyle="dashed"
          borderRadius="lg"
          leftIcon={<FiPlus />}
          onClick={onAddSaleItem}
        >
          Add another item
        </Button>
      </Box>
    </VStack>
  );

  const totalBlock = (
    <Box minW={0}>
      <Text
        fontSize="10px"
        fontWeight="800"
        color={cTextMuted}
        textTransform="uppercase"
        letterSpacing="0.05em"
      >
        Total
      </Text>
      <Text fontSize="md" fontWeight="900" color={cText} noOfLines={1} lineHeight="short">
        {formatCurrency(grandTotal)}
      </Text>
    </Box>
  );

  const footerButtonProps = {
    size: "sm",
    h: "38px",
    w: "92px",
    borderRadius: "lg",
    fontWeight: "700",
  } as const;

  if (useCompact) {
    return (
      <BottomSheetDrawer
        isOpen={isOpen}
        onClose={onClose}
        title={modalTitle}
        size="full"
        bodyProps={{ py: 4 }}
        footer={
          <Flex w="full" align="center" justify="space-between" gap={3}>
            {totalBlock}
            <HStack spacing={2} flexShrink={0}>
              <Button variant="outline" onClick={onClose} {...footerButtonProps}>
                Cancel
              </Button>
              <Button
                colorScheme="brand"
                onClick={onSubmit}
                isLoading={submitting}
                {...footerButtonProps}
              >
                Save
              </Button>
            </HStack>
          </Flex>
        }
      >
        {renderSaleRecordFormFields()}
      </BottomSheetDrawer>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="4xl"
      scrollBehavior="inside"
    >
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="2xl">
        <ModalHeader pb={2}>
          <Heading as="h2" fontSize="lg" fontWeight="800" color={cText}>
            {modalTitle}
          </Heading>
          <Text fontSize="sm" fontWeight="500" color={cTextMuted} mt={0.5}>
            {isSelectedSupplier
              ? "Add the items you purchased from this supplier"
              : "Add the items sold to this customer"}
          </Text>
        </ModalHeader>
        <ModalCloseButton top={4} borderRadius="full" />
        <ModalBody pt={2}>{renderSaleRecordFormFields()}</ModalBody>
        <ModalFooter
          justifyContent="space-between"
          borderTop="1px solid"
          borderColor={cBorder}
          mt={2}
        >
          {totalBlock}
          <HStack spacing={3}>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={onSubmit}
              isLoading={submitting}
              px={6}
              fontWeight="800"
            >
              Save {selectedTransactionSingularLabel} Record
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SaleRecordModal;