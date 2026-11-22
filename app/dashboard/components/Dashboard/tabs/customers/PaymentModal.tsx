"use client";

import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Progress,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import { FiInfo } from "react-icons/fi";
import BottomSheetDrawer from "../../../../../component/common/Drawer/BottomSheetDrawer";
import CustomDrawer from "../../../../../component/common/Drawer/CustomDrawer";
import { merchantGhostButtonProps } from "../../../common/merchantDashboardUI";
import { useCustomerTheme } from "./theme";
import { BuyerLedgerEntry, LedgerFormValues } from "./types";
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

/* Small label + value tile used in the summary strip */
const AmountTile: React.FC<{
  label: string;
  value: React.ReactNode;
  valueColor: string;
  bg: string;
  borderColor: string;
  labelColor: string;
}> = ({ label, value, valueColor, bg, borderColor, labelColor }) => (
  <Box
    borderWidth="1px"
    borderColor={borderColor}
    bg={bg}
    borderRadius="lg"
    px={{ base: 2.5, sm: 3 }}
    py={2.5}
    minW={0}
  >
    <Text
      fontSize="10px"
      fontWeight="800"
      color={labelColor}
      textTransform="uppercase"
      letterSpacing="0.04em"
    >
      {label}
    </Text>
    <Text
      fontSize={{ base: "13px", sm: "sm" }}
      fontWeight="900"
      color={valueColor}
      mt={1}
      noOfLines={1}
    >
      {value}
    </Text>
  </Box>
);

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
  const subtitle = isSelectedSupplier
    ? "Record money sent to the supplier"
    : "Record money received from the customer";

  const currencySymbol = useMemo(
    () => String(formatCurrency(0)).replace(/[\d.,\s-]/g, "") || "₹",
    []
  );

  // Derived values
  const contextSummary = paymentContextEntry?.linkedSaleSummary;
  const contextRemainingDue = getLinkedSaleRemainingDue(paymentContextEntry);
  const parsedPaymentAmount = Number(ledgerFormValues.amount || 0);
  const paymentAmount = Number.isFinite(parsedPaymentAmount)
    ? Math.max(parsedPaymentAmount, 0)
    : 0;
  const remainingAfterPayment =
    contextRemainingDue !== null
      ? Math.max(contextRemainingDue - paymentAmount, 0)
      : null;
  const exceedsMax =
    contextRemainingDue !== null && paymentAmount > contextRemainingDue + 0.001;
  const canSubmit = paymentAmount > 0 && !exceedsMax;

  const totalAmount = contextSummary?.saleAmount ?? paymentContextEntry?.amount ?? 0;
  const paidAmount = contextSummary?.paidAmount ?? 0;
  const paidPercent =
    totalAmount > 0 ? Math.min(Math.max((paidAmount / totalAmount) * 100, 0), 100) : 0;

  const renderContextCard = () => {
    if (!paymentContextEntry) {
      return (
        <HStack
          align="start"
          spacing={3}
          borderWidth="1px"
          borderColor={cBorder}
          bg={cSurfaceAlt}
          borderRadius="xl"
          p={3.5}
        >
          <Icon as={FiInfo} boxSize={4} color={cAccentStrong} mt="2px" flexShrink={0} />
          <Text fontSize="sm" color={cTextMuted}>
            This records money {isSelectedSupplier ? "sent to the supplier" : "received from the customer"}{" "}
            and reduces the open balance.
          </Text>
        </HStack>
      );
    }

    const canOpenHistory =
      !!getLinkedSaleRecordIdFromEntry(paymentContextEntry) && !!onOpenSaleDetailsFromEntry;

    return (
      <Box
        borderWidth="1px"
        borderColor={cBorder}
        bg={cAccentSoft}
        borderRadius="xl"
        p={{ base: 3, sm: 4 }}
      >
        {/* Title row */}
        <Flex justify="space-between" align="flex-start" gap={3}>
          <Box minW={0} flex={1}>
            <Text
              fontSize="10px"
              fontWeight="800"
              color={cTextMuted}
              textTransform="uppercase"
              letterSpacing="0.06em"
            >
              Paying this {selectedTransactionSingularLabel.toLowerCase()}
            </Text>
            <Text fontSize="md" fontWeight="800" color={cText} mt={1} lineHeight="short">
              {getLedgerEntryTypeLabel(paymentContextEntry.entryType, selectedPartyType)} of{" "}
              {formatCurrency(paymentContextEntry.amount || 0)}
            </Text>
            <Text fontSize="xs" color={cTextMuted} mt={0.5}>
              {formatDateTime(paymentContextEntry.entryDate)}
            </Text>
          </Box>
          {canOpenHistory && (
            <Button
              size="xs"
              variant="outline"
              flexShrink={0}
              onClick={() => onOpenSaleDetailsFromEntry!(paymentContextEntry)}
              {...merchantGhostButtonProps}
            >
              History
            </Button>
          )}
        </Flex>

        {/* Summary strip */}
        <SimpleGrid columns={3} spacing={2} mt={3}>
          <AmountTile
            label="Total"
            value={formatCurrency(totalAmount)}
            valueColor={cText}
            bg={cSurfaceAlt}
            borderColor={cBorder}
            labelColor={cTextMuted}
          />
          <AmountTile
            label="Paid"
            value={formatCurrency(paidAmount)}
            valueColor={dashboardPalette.success}
            bg={cSurfaceAlt}
            borderColor={cBorder}
            labelColor={cTextMuted}
          />
          <AmountTile
            label="Remaining"
            value={
              contextRemainingDue !== null
                ? getEntryRemainingText(paymentContextEntry)
                : "After save"
            }
            valueColor={cAccentStrong}
            bg={cSurfaceAlt}
            borderColor={cBorder}
            labelColor={cTextMuted}
          />
        </SimpleGrid>

        {/* Progress */}
        {contextRemainingDue !== null && totalAmount > 0 && (
          <Box mt={3}>
            <Progress
              value={paidPercent}
              size="xs"
              borderRadius="full"
              bg={cBorder}
              sx={{ "& > div:first-of-type": { background: dashboardPalette.success } }}
            />
            <Text fontSize="10px" fontWeight="700" color={cTextMuted} mt={1}>
              {Math.round(paidPercent)}% paid
            </Text>
          </Box>
        )}

        {/* Entry note */}
        {paymentContextEntry.notes ? (
          <>
            <Divider my={3} borderColor={cBorder} />
            <Text fontSize="xs" color={cTextMuted} noOfLines={3}>
              <Text as="span" fontWeight="800" color={cText}>
                Note:{" "}
              </Text>
              {paymentContextEntry.notes}
            </Text>
          </>
        ) : null}
      </Box>
    );
  };

  const renderLedgerEntryFormFields = () => (
    <VStack spacing={4} align="stretch">
      {renderContextCard()}

      {/* Form */}
      <VStack spacing={3.5} align="stretch">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3.5}>
          <FormControl isInvalid={exceedsMax}>
            <Flex justify="space-between" align="center" mb={1.5}>
              <FormLabel m={0} fontSize="sm" fontWeight="700">
                Payment amount
              </FormLabel>
              {contextRemainingDue !== null && contextRemainingDue > 0 && (
                <Button
                  size="xs"
                  variant="link"
                  colorScheme="brand"
                  fontWeight="700"
                  onClick={() =>
                    setLedgerFormValues((prev) => ({
                      ...prev,
                      amount: String(Number(contextRemainingDue.toFixed(2))),
                    }))
                  }
                >
                  Pay full remaining
                </Button>
              )}
            </Flex>
            <InputGroup size={useCompact ? "lg" : "md"}>
              <InputLeftElement pointerEvents="none" color={cTextMuted} fontWeight="700">
                {currencySymbol}
              </InputLeftElement>
              <Input
                type="number"
                inputMode="decimal"
                min="0"
                max={contextRemainingDue !== null ? contextRemainingDue : undefined}
                step="0.01"
                value={ledgerFormValues.amount}
                onChange={(e) =>
                  setLedgerFormValues((prev) => ({ ...prev, amount: e.target.value }))
                }
                placeholder="0.00"
                borderRadius="lg"
                fontWeight="700"
              />
            </InputGroup>
            {exceedsMax ? (
              <FormErrorMessage fontSize="xs">
                Amount is more than the remaining {formatCurrency(Math.max(contextRemainingDue ?? 0, 0))}
              </FormErrorMessage>
            ) : contextRemainingDue !== null ? (
              <FormHelperText fontSize="xs" color={cTextMuted}>
                Maximum: {formatCurrency(Math.max(contextRemainingDue, 0))}
              </FormHelperText>
            ) : null}
          </FormControl>

          <FormControl>
            <FormLabel mb={1.5} fontSize="sm" fontWeight="700">
              Payment date
            </FormLabel>
            <Input
              size={useCompact ? "lg" : "md"}
              type="date"
              borderRadius="lg"
              value={ledgerFormValues.entryDate}
              onChange={(e) =>
                setLedgerFormValues((prev) => ({ ...prev, entryDate: e.target.value }))
              }
            />
          </FormControl>
        </SimpleGrid>

        <FormControl>
          <FormLabel mb={1.5} fontSize="sm" fontWeight="700">
            Notes{" "}
            <Text as="span" fontWeight="500" color={cTextMuted}>
              (optional)
            </Text>
          </FormLabel>
          <Input
            size={useCompact ? "lg" : "md"}
            borderRadius="lg"
            value={ledgerFormValues.notes}
            onChange={(e) =>
              setLedgerFormValues((prev) => ({ ...prev, notes: e.target.value }))
            }
            placeholder="Payment mode, receipt number, or short note"
          />
        </FormControl>
      </VStack>

      {/* After-payment preview */}
      {remainingAfterPayment !== null && (
        <Flex
          justify="space-between"
          align="center"
          gap={3}
          borderWidth="1px"
          borderColor={cBorder}
          bg={cSurfaceAlt}
          borderRadius="xl"
          px={3.5}
          py={3}
        >
          <Text fontSize="sm" color={cTextMuted} fontWeight="600">
            Remaining after this payment
          </Text>
          <Text
            fontSize="sm"
            fontWeight="900"
            color={remainingAfterPayment === 0 ? dashboardPalette.success : cAccentStrong}
            flexShrink={0}
          >
            {remainingAfterPayment === 0 ? "Fully paid" : formatCurrency(remainingAfterPayment)}
          </Text>
        </Flex>
      )}
    </VStack>
  );

  if (useCompact) {
    return (
      <BottomSheetDrawer
        isOpen={isOpen}
        onClose={onClose}
        title="Record Payment"
        footer={
          <HStack spacing={2} w="full" justify="flex-end">
            <Button
              variant="outline"
              onClick={onClose}
              size="sm"
              h="38px"
              w="110px"
              borderRadius="lg"
              fontWeight="700"
            >
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={onSubmit}
              isLoading={submitting}
              isDisabled={!canSubmit}
              size="sm"
              h="38px"
              w="110px"
              borderRadius="lg"
              fontWeight="700"
            >
              Save
            </Button>
          </HStack>
        }
      >
        {renderLedgerEntryFormFields()}
      </BottomSheetDrawer>
    );
  }

  return (
    <CustomDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Record Payment"
      subtitle={subtitle}
      size="md"
      showDivider={true}
      bodyProps={{
        px: { base: 3, md: 5 },
        py: 4,
        pb: 8,
      }}
      footer={
        <HStack spacing={3} w="full" justify="flex-end">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="brand"
            onClick={onSubmit}
            isLoading={submitting}
            isDisabled={!canSubmit}
            px={6}
            fontWeight="800"
          >
            Save Payment
          </Button>
        </HStack>
      }
    >
      {renderLedgerEntryFormFields()}
    </CustomDrawer>
  );
};

export default PaymentModal;