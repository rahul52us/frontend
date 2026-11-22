"use client";

import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import BottomSheetDrawer from "../../../../../component/common/Drawer/BottomSheetDrawer";
import { merchantGhostButtonProps } from "../../../common/merchantDashboardUI";
import { useCustomerTheme } from "./theme";
import {
  BuyerLedgerEntry,
  LedgerFormValues,
} from "./types";
import {
  formatCurrency,
  formatDateTime,
  getEntryRemainingText,
  getLedgerEntryTypeLabel,
  getLinkedSaleRecordIdFromEntry,
  getLinkedSaleRemainingDue,
} from "./utils";

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  useCompact: boolean;
  paymentContextEntry: BuyerLedgerEntry | null;
  ledgerFormValues: LedgerFormValues;
  setLedgerFormValues: React.Dispatch<React.SetStateAction<LedgerFormValues>>;
  submitting: boolean;
  onSubmit: () => void;
  selectedPartyType: "customer" | "supplier";
  onOpenSaleDetailsFromEntry?: (entry: BuyerLedgerEntry) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  useCompact,
  paymentContextEntry,
  ledgerFormValues,
  setLedgerFormValues,
  submitting,
  onSubmit,
  selectedPartyType,
  onOpenSaleDetailsFromEntry,
}) => {
  const theme = useCustomerTheme();
  const {
    cAccentSoft,
    cAccentStrong,
    cTextMuted,
    cText,
    cSurfaceAlt,
    cBorder,
    dashboardPalette,
  } = theme;

  const isSelectedSupplier = selectedPartyType === "supplier";
  const selectedTransactionSingularLabel = isSelectedSupplier ? "Purchase" : "Sale";

  const renderLedgerEntryFormFields = () => {
    const contextSummary = paymentContextEntry?.linkedSaleSummary;
    const contextRemainingDue = getLinkedSaleRemainingDue(paymentContextEntry);
    const parsedPaymentAmount = Number(ledgerFormValues.amount || 0);
    const paymentAmount = Number.isFinite(parsedPaymentAmount) ? Math.max(parsedPaymentAmount, 0) : 0;
    const remainingAfterPayment =
      contextRemainingDue !== null ? Math.max(contextRemainingDue - paymentAmount, 0) : null;

    return (
      <VStack spacing={4} align="stretch">
        {paymentContextEntry ? (
          <Box
            borderWidth="1px"
            borderColor={cBorder}
            bg={cAccentSoft}
            borderRadius="lg"
            p={4}
          >
            <HStack justify="space-between" align="start" spacing={3}>
              <Box flex="1" minW={0}>
                <Text fontSize="xs" fontWeight="800" color={cTextMuted} textTransform="uppercase">
                  Paying this {selectedTransactionSingularLabel.toLowerCase()}
                </Text>
                <Text fontSize="md" fontWeight="800" color={cText} mt={1}>
                  {getLedgerEntryTypeLabel(paymentContextEntry.entryType, selectedPartyType)} of {formatCurrency(paymentContextEntry.amount || 0)}
                </Text>
                <Text fontSize="sm" color={cTextMuted} mt={1}>
                  {formatDateTime(paymentContextEntry.entryDate)}
                </Text>
                <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={2.5} mt={3}>
                  <Box borderWidth="1px" borderColor={cBorder} bg={cSurfaceAlt} borderRadius="md" p={3}>
                    <Text fontSize="10px" fontWeight="800" color={cTextMuted} textTransform="uppercase">
                      Total
                    </Text>
                    <Text fontSize="sm" fontWeight="900" color={cText} mt={1}>
                      {formatCurrency(contextSummary?.saleAmount ?? paymentContextEntry.amount ?? 0)}
                    </Text>
                  </Box>
                  <Box borderWidth="1px" borderColor={cBorder} bg={cSurfaceAlt} borderRadius="md" p={3}>
                    <Text fontSize="10px" fontWeight="800" color={cTextMuted} textTransform="uppercase">
                      Paid
                    </Text>
                    <Text fontSize="sm" fontWeight="900" color={dashboardPalette.success} mt={1}>
                      {formatCurrency(contextSummary?.paidAmount ?? 0)}
                    </Text>
                  </Box>
                  <Box borderWidth="1px" borderColor={cBorder} bg={cSurfaceAlt} borderRadius="md" p={3}>
                    <Text fontSize="10px" fontWeight="800" color={cTextMuted} textTransform="uppercase">
                      Remaining
                    </Text>
                    <Text fontSize="sm" fontWeight="900" color={cAccentStrong} mt={1}>
                      {contextRemainingDue !== null ? getEntryRemainingText(paymentContextEntry) : "Calculated after save"}
                    </Text>
                  </Box>
                </SimpleGrid>
                {remainingAfterPayment !== null ? (
                  <Text fontSize="sm" color={cTextMuted} mt={3}>
                    After this payment, remaining will be {formatCurrency(remainingAfterPayment)}.
                  </Text>
                ) : (
                  <Text fontSize="sm" color={cTextMuted} mt={3}>
                    This payment is linked to this entry and will reduce its due amount.
                  </Text>
                )}
                {paymentContextEntry.notes ? (
                  <Text fontSize="sm" color={cTextMuted} mt={2}>
                    {paymentContextEntry.notes}
                  </Text>
                ) : null}
              </Box>
              {getLinkedSaleRecordIdFromEntry(paymentContextEntry) && onOpenSaleDetailsFromEntry ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onOpenSaleDetailsFromEntry(paymentContextEntry)}
                  {...merchantGhostButtonProps}
                >
                  History
                </Button>
              ) : null}
            </HStack>
          </Box>
        ) : (
          <Box borderWidth="1px" borderColor={cBorder} bg={cSurfaceAlt} borderRadius="lg" p={4}>
            <Text fontSize="sm" color={cTextMuted}>
              This records money {isSelectedSupplier ? "sent to the supplier" : "received from the customer"} and reduces the open balance.
            </Text>
          </Box>
        )}

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
          <FormControl>
            <FormLabel>Payment Amount</FormLabel>
            <Input
              type="number"
              min="0"
              max={contextRemainingDue !== null ? contextRemainingDue : undefined}
              step="0.01"
              value={ledgerFormValues.amount}
              onChange={(e) => setLedgerFormValues((prev) => ({ ...prev, amount: e.target.value }))}
              placeholder="Enter payment amount"
            />
            {contextRemainingDue !== null ? (
              <Text fontSize="xs" color={cTextMuted} mt={1}>
                Maximum: {formatCurrency(Math.max(contextRemainingDue, 0))}
              </Text>
            ) : null}
          </FormControl>

          <FormControl>
            <FormLabel>Payment Date</FormLabel>
            <Input
              type="date"
              value={ledgerFormValues.entryDate}
              onChange={(e) => setLedgerFormValues((prev) => ({ ...prev, entryDate: e.target.value }))}
            />
          </FormControl>
        </SimpleGrid>

        <FormControl>
          <FormLabel>Notes (optional)</FormLabel>
          <Input
            value={ledgerFormValues.notes}
            onChange={(e) => setLedgerFormValues((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="Payment mode, receipt number, or short note"
          />
        </FormControl>
      </VStack>
    );
  };

  if (useCompact) {
    return (
      <BottomSheetDrawer
        isOpen={isOpen}
        onClose={onClose}
        title="Record Payment"
        footer={
          <>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="brand" onClick={onSubmit} isLoading={submitting} flex="1" h="52px">
              Save Payment
            </Button>
          </>
        }
      >
        {renderLedgerEntryFormFields()}
      </BottomSheetDrawer>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Record Payment</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{renderLedgerEntryFormFields()}</ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="brand" onClick={onSubmit} isLoading={submitting}>
            Save Payment
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaymentModal;
