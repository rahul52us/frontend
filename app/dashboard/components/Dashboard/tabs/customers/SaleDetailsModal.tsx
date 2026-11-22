"use client";

import { CheckIcon, CopyIcon, DownloadIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  HStack,
  IconButton,
  // keyframes,
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
  useToast,
  VStack
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import React from "react";
import BottomSheetDrawer from "../../../../../component/common/Drawer/BottomSheetDrawer";
import CustomDrawer from "../../../../../component/common/Drawer/CustomDrawer";
import { useCustomerTheme } from "./theme";
import {
  BuyerSaleRecord,
  BuyerSaleRecordDetails,
} from "./types";
import {
  formatCurrency,
  formatDateTime,
  formatLedgerReference,
  formatShortId,
  formatSignedAmount,
  getLedgerAmountColor,
  getLedgerEffectColorScheme,
  getLedgerEffectLabel,
  getLedgerEntryTypeLabel,
  getTimelineTitle,
} from "./utils";

/* ------------------------------------------------------------------ */
/* Animations                                                          */
/* ------------------------------------------------------------------ */

const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const sheetUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const enter = (index = 0) => ({
  animation: `${fadeSlideUp} 0.4s ease ${Math.min(index, 8) * 0.05}s both`,
  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
});

/* ------------------------------------------------------------------ */
/* Small presentational helpers                                        */
/* ------------------------------------------------------------------ */

const GOLD_BORDER = "rgba(214, 183, 114, 0.28)";
const GOLD_BG = "rgba(214, 183, 114, 0.10)";

const SectionTitle: React.FC<{ children: React.ReactNode; count?: number }> = ({
  children,
  count,
}) => {
  const { cTextSoft, cAccent } = useCustomerTheme();
  return (
    <HStack spacing={2} mb={3} px={1}>
      <Box w="3px" h="14px" borderRadius="full" bg={cAccent} />
      <Text
        fontSize="xs"
        textTransform="uppercase"
        letterSpacing="0.1em"
        fontWeight="800"
        color={cTextSoft}
      >
        {children}
      </Text>
      {typeof count === "number" ? (
        <Badge borderRadius="full" px={2} fontSize="10px" variant="subtle">
          {count}
        </Badge>
      ) : null}
    </HStack>
  );
};

const Panel: React.FC<
  React.PropsWithChildren<{ title?: string; index?: number }>
> = ({ title, index = 0, children }) => {
  const { cSurface, cBorder } = useCustomerTheme();
  return (
    <Box
      bg={cSurface}
      borderWidth="1px"
      borderColor={cBorder}
      borderRadius="2xl"
      p={{ base: 3.5, md: 4 }}
      boxShadow="0 8px 24px rgba(0, 0, 0, 0.12)"
      sx={enter(index)}
    >
      {title ? <SectionTitle>{title}</SectionTitle> : null}
      {children}
    </Box>
  );
};

const InfoRow: React.FC<{
  label: string;
  value: React.ReactNode;
  strong?: boolean;
}> = ({ label, value, strong }) => {
  const { cText, cTextSoft, cBorder, cAccentStrong } = useCustomerTheme();
  return (
    <Flex
      justify="space-between"
      align="flex-start"
      gap={4}
      py={2.5}
      borderBottom="1px dashed"
      borderBottomColor={cBorder}
      _last={{ borderBottom: "none", pb: 0 }}
      _first={{ pt: 0 }}
    >
      <Text fontSize="sm" color={cTextSoft} flexShrink={0}>
        {label}
      </Text>
      <Text
        fontSize="sm"
        fontWeight={strong ? "800" : "600"}
        color={strong ? cAccentStrong : cText}
        textAlign="right"
        wordBreak="break-word"
        minW={0}
      >
        {value}
      </Text>
    </Flex>
  );
};

type StatTone = "green" | "orange" | "accent" | "red";

const StatCard: React.FC<{
  label: string;
  value: string;
  tone: StatTone;
  index?: number;
}> = ({ label, value, tone, index = 0 }) => {
  const { cAccent, cText, cTextSoft } = useCustomerTheme();

  const dotColor: Record<StatTone, string> = {
    green: "green.300",
    orange: "orange.300",
    red: "red.300",
    accent: cAccent,
  };

  return (
    <Box px={1} py={1.5} minW={0} sx={enter(index)}>
      <HStack spacing={1.5} minW={0}>
        <Box
          w="6px"
          h="6px"
          borderRadius="full"
          bg={dotColor[tone]}
          flexShrink={0}
        />
        <Text
          fontSize="11px"
          fontWeight="600"
          color={cTextSoft}
          noOfLines={1}
        >
          {label}
        </Text>
      </HStack>
      <Text
        mt={0.5}
        fontSize={{ base: "md", md: "lg" }}
        fontWeight="800"
        letterSpacing="-0.01em"
        color={cText}
        noOfLines={1}
      >
        {value}
      </Text>
    </Box>
  );
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export interface SaleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  useCompact: boolean;
  saleRecordDetails: BuyerSaleRecordDetails | null;
  selectedSaleRecord: BuyerSaleRecord | null;
  loading: boolean;
  invoiceDownloadingSaleId: string;
  selectedPartyType: "customer" | "supplier";
  onDownloadInvoice: (details: BuyerSaleRecordDetails) => void;
  isInvoiceOptionsOpen: boolean;
  onCloseInvoiceOptions: () => void;
  onConfirmInvoiceOption: (includeHistory: boolean) => void;
  invoiceDownloadingLedgerEntryId: string;
  pendingInvoiceHistoryCount?: number;
}

export const SaleDetailsModal: React.FC<SaleDetailsModalProps> = ({
  isOpen,
  onClose,
  useCompact,
  saleRecordDetails,
  selectedSaleRecord,
  loading,
  invoiceDownloadingSaleId,
  selectedPartyType,
  onDownloadInvoice,
  isInvoiceOptionsOpen,
  onCloseInvoiceOptions,
  onConfirmInvoiceOption,
  invoiceDownloadingLedgerEntryId,
  pendingInvoiceHistoryCount,
}) => {
  const toast = useToast();
  const theme = useCustomerTheme();
  const {
    cAccent,
    cAccentStrong,
    cText,
    cTextSoft,
    cSurface,
    cSurfaceAlt,
    cBorder,
    cBorderStrong,
    cSurfaceSoft,
    cPage,
  } = theme;

  const [copied, setCopied] = React.useState(false);

  const isSelectedSupplier = selectedPartyType === "supplier";
  const selectedTransactionSingularLabel = isSelectedSupplier ? "Purchase" : "Sale";
  const activeSaleRecord = saleRecordDetails?.saleRecord || selectedSaleRecord;
  const isInvoiceBusy = Boolean(invoiceDownloadingSaleId || invoiceDownloadingLedgerEntryId);

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast({
        title: `${selectedTransactionSingularLabel} ID copied`,
        status: "success",
        duration: 1200,
        isClosable: true,
        position: "top",
      });
    } catch {
      toast({
        title: "Could not copy ID",
        status: "error",
        duration: 1500,
        isClosable: true,
        position: "top",
      });
    }
  };

  const renderSaleDetailsContent = () => {
    if (loading) {
      return (
        <Flex minH="260px" align="center" justify="center" direction="column" gap={3} textAlign="center" px={4}>
          <Spinner color={cAccent} thickness="3px" size="lg" />
          <Text fontSize="sm" color={cTextSoft}>
            Loading {isSelectedSupplier ? "purchase" : "sale"} history
            {activeSaleRecord ? ` for ${formatShortId(activeSaleRecord._id)}` : ""}...
          </Text>
        </Flex>
      );
    }

    if (!saleRecordDetails) {
      return (
        <Flex minH="220px" align="center" justify="center" textAlign="center" px={4}>
          <Text fontSize="sm" color={cTextSoft}>
            {selectedTransactionSingularLabel} details are not available
            {activeSaleRecord ? ` for ${formatShortId(activeSaleRecord._id)}` : ""}.
          </Text>
        </Flex>
      );
    }

    const { saleRecord, summary, timeline } = saleRecordDetails;
    const totalItems = Array.isArray(saleRecord.items)
      ? saleRecord.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
      : 0;

    const saleAmountNum = Number(summary.saleAmount || 0);
    const paidAmountNum = Number(summary.paidAmount || 0);
    const paidPct =
      saleAmountNum > 0 ? Math.min(100, Math.max(0, (paidAmountNum / saleAmountNum) * 100)) : 0;

    const statusScheme =
      saleRecord.status === "posted" ? "green" : saleRecord.status === "void" ? "red" : "orange";

    return (
      <VStack align="stretch" spacing={4}>
   <Box
  position="relative"
  overflow="hidden"
  borderWidth="1px"
  borderColor={cBorderStrong}
  borderRadius="2xl"
  p={{ base: 4, md: 5 }}
  sx={enter(0)}
>
  {/* Header: status + actions */}
  <Flex justify="space-between" align="center" gap={3}>
    <HStack spacing={2} minW={0}>
      <Box
        w="8px"
        h="8px"
        borderRadius="full"
        bg={`${statusScheme}.300`}
        flexShrink={0}
      />
      <Text
        fontSize="10px"
        textTransform="uppercase"
        letterSpacing="0.14em"
        color={cTextSoft}
        fontWeight="700"
        noOfLines={1}
      >
        {selectedTransactionSingularLabel} · {saleRecord.status}
      </Text>
    </HStack>

    <HStack spacing={1} flexShrink={0}>
      <IconButton
        aria-label={`Copy ${selectedTransactionSingularLabel.toLowerCase()} ID`}
        title="Copy ID"
        icon={copied ? <CheckIcon /> : <CopyIcon />}
        size="sm"
        variant="ghost"
        borderRadius="full"
        color={copied ? "green.300" : cTextSoft}
        _hover={{ bg: cSurfaceSoft, color: cText }}
        onClick={() => handleCopyId(saleRecord._id || "")}
      />
      {!isSelectedSupplier ? (
        <IconButton
          aria-label="Download invoice"
          title="Download invoice"
          icon={<DownloadIcon />}
          size="sm"
          variant="ghost"
          borderRadius="full"
          color={cTextSoft}
          isLoading={invoiceDownloadingSaleId === saleRecord._id}
          _hover={{ bg: cSurfaceSoft, color: cText }}
          _active={{ transform: "scale(0.94)" }}
          onClick={() => onDownloadInvoice(saleRecordDetails)}
        />
      ) : null}
    </HStack>
  </Flex>

  {/* ID */}
  <Text
    mt={1.5}
    fontFamily="mono"
    fontSize="11px"
    color={cTextSoft}
    noOfLines={1}
    title={saleRecord._id}
  >
    #{saleRecord._id}
  </Text>

  {/* Total + progress ring */}
  <Flex mt={4} align="center" justify="space-between" gap={4}>
    <Box minW={0}>
      <Text fontSize="xs" color={cTextSoft} fontWeight="600">
        {selectedTransactionSingularLabel} Total
      </Text>
      <Text
        mt={0.5}
        fontSize={{ base: "xl", md: "2xl" }}
        fontWeight="800"
        lineHeight="1.1"
        letterSpacing="-0.01em"
        color={cText}
        noOfLines={1}
      >
        {formatCurrency(summary.saleAmount)}
      </Text>
    </Box>

    <CircularProgress
      value={paidPct}
      size={{ base: "52px", md: "58px" }}
      thickness="8px"
      color="green.300"
      trackColor={cSurfaceSoft}
      capIsRound
      flexShrink={0}
    >
      <CircularProgressLabel fontSize="10px" fontWeight="800" color={cText}>
        {Math.round(paidPct)}%
      </CircularProgressLabel>
    </CircularProgress>
  </Flex>

  {/* Divider */}
  <Box
    my={4}
    borderTopWidth="1px"
    borderTopStyle="dashed"
    borderColor={cBorderStrong}
    opacity={0.6}
  />

  {/* Paid / Left */}
  <Flex gap={4}>
    <Box flex="1" minW={0}>
      <HStack spacing={1.5}>
        <Box w="6px" h="6px" borderRadius="full" bg="green.300" />
        <Text fontSize="11px" color={cTextSoft}>
          {isSelectedSupplier ? "Paid out" : "Paid"}
        </Text>
      </HStack>
      <Text mt={0.5} fontSize="sm" fontWeight="700" color={cText} noOfLines={1}>
        {formatCurrency(summary.paidAmount)}
      </Text>
    </Box>
    <Box flex="1" minW={0} textAlign="right">
      <HStack spacing={1.5} justify="flex-end">
        <Box w="6px" h="6px" borderRadius="full" bg={cTextSoft} />
        <Text fontSize="11px" color={cTextSoft}>
          Left
        </Text>
      </HStack>
      <Text mt={0.5} fontSize="sm" fontWeight="700" color={cText} noOfLines={1}>
        {formatCurrency(summary.remainingDue)}
      </Text>
    </Box>
  </Flex>

  {/* Meta tags */}
  <HStack spacing={2} mt={4} wrap="wrap" rowGap={2}>
    <Badge
      colorScheme={summary.isPosted ? "blue" : "gray"}
      variant="subtle"
      borderRadius="full"
      px={2}
      py={0.5}
      fontSize="10px"
    >
      {summary.isPosted ? "Ledger Linked" : "Not Posted"}
    </Badge>
    {saleRecord.source ? (
      <Badge
        variant="subtle"
        textTransform="capitalize"
        borderRadius="full"
        px={2}
        py={0.5}
        fontSize="10px"
      >
        {saleRecord.source}
      </Badge>
    ) : null}
  </HStack>
</Box>

        <SimpleGrid columns={2} spacing={3}>
          <StatCard
            index={1}
            tone="green"
            label={isSelectedSupplier ? "Paid Out" : "Paid"}
            value={formatCurrency(summary.paidAmount)}
          />
          <StatCard
            index={2}
            tone="accent"
            label={isSelectedSupplier ? "Remaining Payable" : "Remaining Due"}
            value={formatCurrency(summary.remainingDue)}
          />
          <StatCard
            index={3}
            tone="orange"
            label="Debit Corrections"
            value={formatCurrency(summary.adjustmentDebitAmount)}
          />
          <StatCard
            index={4}
            tone="green"
            label="Credit Corrections"
            value={formatCurrency(summary.adjustmentCreditAmount)}
          />
        </SimpleGrid>

        {/* ---------------- Meta + totals ---------------- */}
        <Panel title={`${selectedTransactionSingularLabel} Info`} index={5}>
          <InfoRow label={`${selectedTransactionSingularLabel} Date`} value={formatDateTime(saleRecord.saleDate)} />
          <InfoRow label="Created" value={formatDateTime(saleRecord.createdAt)} />
          <InfoRow label="Posted At" value={formatDateTime(saleRecord.postedAt)} />
          <InfoRow label="Items" value={`${saleRecord.items?.length || 0} lines / ${totalItems} qty`} />
          <InfoRow
            label="Ledger Entry"
            value={saleRecord.ledgerEntryId ? formatShortId(saleRecord.ledgerEntryId) : "-"}
          />
          <InfoRow label="History Events" value={summary.eventCount} />
          {saleRecord.notes ? (
            <Box
              mt={3}
              p={3}
              borderRadius="xl"
              bg={cSurfaceAlt}
              borderWidth="1px"
              borderColor={cBorder}
            >
              <Text fontSize="10px" textTransform="uppercase" letterSpacing="0.08em" fontWeight="800" color={cTextSoft}>
                Notes
              </Text>
              <Text mt={1} fontSize="sm" color={cText} wordBreak="break-word">
                {saleRecord.notes}
              </Text>
            </Box>
          ) : null}
        </Panel>

        <Panel title="Amount Breakdown" index={6}>
          <InfoRow label="Subtotal" value={formatCurrency(Number(saleRecord.subtotal || 0))} />
          <InfoRow label="Discount" value={formatCurrency(Number(saleRecord.discountTotal || 0))} />
          <InfoRow label="Tax" value={formatCurrency(Number(saleRecord.taxTotal || 0))} />
          <InfoRow label="Total" value={formatCurrency(summary.saleAmount)} strong />
        </Panel>

        {/* ---------------- Items ---------------- */}
        <Box>
          <SectionTitle count={saleRecord.items?.length || 0}>Items</SectionTitle>
          <VStack align="stretch" spacing={2.5}>
            {saleRecord.items?.map((item, index) => (
              <Flex
                key={`${saleRecord._id}-item-${index}`}
                justify="space-between"
                align="center"
                gap={3}
                p={3.5}
                borderWidth="1px"
                borderColor={cBorder}
                borderRadius="xl"
                bg={cSurface}
                transition="border-color 0.2s ease, transform 0.2s ease"
                _hover={{ borderColor: GOLD_BORDER, transform: "translateY(-1px)" }}
                sx={enter(index + 7)}
              >
                <HStack spacing={3} minW={0} flex="1" align="center">
                  <Flex
                    w="32px"
                    h="32px"
                    flexShrink={0}
                    align="center"
                    justify="center"
                    borderRadius="lg"
                    bg={GOLD_BG}
                    color={cAccent}
                    fontSize="xs"
                    fontWeight="800"
                  >
                    {index + 1}
                  </Flex>
                  <Box minW={0}>
                    <Text fontSize="sm" fontWeight="700" color={cText} wordBreak="break-word">
                      {item.itemName}
                    </Text>
                    <Text fontSize="xs" color={cTextSoft} mt={0.5}>
                      Qty {item.quantity} × {formatCurrency(Number(item.unitPrice || 0))}
                    </Text>
                  </Box>
                </HStack>
                <Text fontSize="sm" fontWeight="800" color={cAccentStrong} flexShrink={0}>
                  {formatCurrency(Number(item.lineTotal || 0))}
                </Text>
              </Flex>
            ))}
          </VStack>
        </Box>

        {/* ---------------- Timeline ---------------- */}
        <Box>
          <SectionTitle count={timeline.length}>History</SectionTitle>

          {timeline.length === 0 ? (
            <Box
              p={4}
              borderWidth="1px"
              borderStyle="dashed"
              borderColor={cBorderStrong}
              borderRadius="xl"
              textAlign="center"
            >
              <Text fontSize="sm" color={cTextSoft}>
                No ledger activity linked to this {selectedTransactionSingularLabel.toLowerCase()} yet.
              </Text>
            </Box>
          ) : null}

          <Box>
            {timeline.map((entry, index) => {
              const dotColor =
                entry.status === "reversed"
                  ? "red.400"
                  : entry.entryType === "sale"
                    ? "orange.400"
                    : entry.entryType === "payment"
                      ? "green.400"
                      : "blue.400";

              return (
                <Flex key={entry._id} gap={3} align="stretch" sx={enter(index)}>
                  <Flex direction="column" align="center" flexShrink={0} pt={4}>
                    <Box
                      w="12px"
                      h="12px"
                      borderRadius="full"
                      bg={dotColor}
                      boxShadow={`0 0 0 4px ${cPage}`}
                    />
                    <Box w="2px" flex="1" bg={cBorder} mt={1} borderRadius="full" />
                  </Flex>

                  <Box flex="1" minW={0} pb={3}>
                    <Box
                      p={3.5}
                      borderWidth="1px"
                      borderColor={cBorder}
                      borderRadius="xl"
                      bg={cSurface}
                    >
                      <Flex justify="space-between" align="flex-start" gap={3}>
                        <Box minW={0} flex="1">
                          <Text fontSize="sm" fontWeight="700" color={cText} wordBreak="break-word">
                            {getTimelineTitle(entry, isSelectedSupplier)}
                          </Text>
                          <Text fontSize="xs" color={cTextSoft} mt={0.5}>
                            {formatDateTime(entry.entryDate || entry.createdAt)}
                          </Text>
                        </Box>
                        <Box textAlign="right" flexShrink={0}>
                          <Text
                            fontSize="sm"
                            fontWeight="800"
                            color={getLedgerAmountColor(entry, cAccentStrong)}
                          >
                            {formatSignedAmount(entry)}
                          </Text>
                          <Text fontSize="10px" color={cTextSoft} mt={0.5}>
                            {isSelectedSupplier ? "Supplier" : "Customer"} bal.{" "}
                            {formatCurrency(Number(entry.balanceAfter || 0))}
                          </Text>
                        </Box>
                      </Flex>

                      <HStack spacing={1.5} wrap="wrap" rowGap={1.5} mt={2.5}>
                        <Badge
                          colorScheme={
                            entry.entryType === "sale"
                              ? "orange"
                              : entry.entryType === "payment"
                                ? "green"
                                : "blue"
                          }
                          textTransform="capitalize"
                          borderRadius="full"
                          px={2}
                        >
                          {getLedgerEntryTypeLabel(entry.entryType, selectedPartyType)}
                        </Badge>
                        <Badge
                          colorScheme={getLedgerEffectColorScheme(entry, selectedPartyType)}
                          textTransform="none"
                          borderRadius="full"
                          px={2}
                        >
                          {getLedgerEffectLabel(entry, selectedPartyType)}
                        </Badge>
                        {entry.status ? (
                          <Badge
                            colorScheme={entry.status === "reversed" ? "red" : "green"}
                            textTransform="capitalize"
                            borderRadius="full"
                            px={2}
                          >
                            {entry.status}
                          </Badge>
                        ) : null}
                        {entry.relationType === "reversal" ? (
                          <Badge colorScheme="brand" borderRadius="full" px={2}>
                            Linked Reversal
                          </Badge>
                        ) : null}
                      </HStack>

                      {entry.notes || entry.referenceId ? (
                        <Box mt={2.5} pt={2.5} borderTop="1px dashed" borderTopColor={cBorder}>
                          {entry.notes ? (
                            <Text fontSize="sm" color={cText} wordBreak="break-word">
                              {entry.notes}
                            </Text>
                          ) : null}
                          {entry.referenceId ? (
                            <Text fontSize="xs" color={cTextSoft} mt={entry.notes ? 1 : 0} wordBreak="break-word">
                              Ref: {formatLedgerReference(entry)}
                            </Text>
                          ) : null}
                        </Box>
                      ) : null}
                    </Box>
                  </Box>
                </Flex>
              );
            })}

            {/* Record created (timeline end) */}
            <Flex gap={3} align="stretch" sx={enter(timeline.length)}>
              <Flex direction="column" align="center" flexShrink={0} pt={4}>
                <Box
                  w="12px"
                  h="12px"
                  borderRadius="full"
                  bg={cAccent}
                  boxShadow={`0 0 0 4px ${cPage}`}
                />
              </Flex>
              <Box flex="1" minW={0}>
                <Flex
                  justify="space-between"
                  align="center"
                  gap={3}
                  p={3.5}
                  borderWidth="1px"
                  borderColor={GOLD_BORDER}
                  borderRadius="xl"
                  bg={GOLD_BG}
                >
                  <Box minW={0}>
                    <Text fontSize="sm" fontWeight="700" color={cText}>
                      {selectedTransactionSingularLabel} Record Created
                    </Text>
                    <Text fontSize="xs" color={cTextSoft} mt={0.5}>
                      {formatDateTime(saleRecord.createdAt || saleRecord.saleDate)}
                    </Text>
                  </Box>
                  <Text fontSize="sm" fontWeight="800" color={cAccentStrong} flexShrink={0}>
                    {formatCurrency(summary.saleAmount)}
                  </Text>
                </Flex>
              </Box>
            </Flex>
          </Box>
        </Box>
      </VStack>
    );
  };

  return (
    <>
      {useCompact ? (
        <BottomSheetDrawer
          isOpen={isOpen}
          onClose={onClose}
          title={`${selectedTransactionSingularLabel} Details`}
          size="full"
          bodyProps={{
            px: 3,
            pt: 2,
            pb: 8,
          }}
        >
          {renderSaleDetailsContent()}
        </BottomSheetDrawer>
      ) : (
        <CustomDrawer
          open={isOpen}
          close={onClose}
          title={`${selectedTransactionSingularLabel} Details`}
          size="md"
          loading={loading && !saleRecordDetails}
          showDivider={true}
          bodyProps={{
            px: { base: 3, md: 4 },
            py: 4,
            pb: 8,
          }}
        >
          {renderSaleDetailsContent()}
        </CustomDrawer>
      )}

      {/* Invoice Options Modal (bottom sheet on mobile, centered on desktop) */}
      <Modal isOpen={isInvoiceOptionsOpen} onClose={onCloseInvoiceOptions} isCentered size="md">
        <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(6px)" />
        <ModalContent
          borderRadius={{ base: "24px 24px 0 0", md: "24px" }}
          alignSelf={{ base: "flex-end", md: "center" }}
          m={{ base: 0, md: "auto" }}
          w={{ base: "100%", md: "auto" }}
          maxW={{ base: "100%", md: "md" }}
          overflow="hidden"
          bg={cSurface}
          color={cText}
          borderWidth="1px"
          borderColor={cBorder}
          sx={{
            animation: `${sheetUp} 0.3s ease both`,
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        >
          <Box
            display={{ base: "block", md: "none" }}
            w="40px"
            h="4px"
            borderRadius="full"
            bg={cBorderStrong}
            mx="auto"
            mt={3}
          />
          <ModalHeader pb={1} pt={{ base: 3, md: 5 }} fontWeight="800">
            Include ledger history?
          </ModalHeader>
          <ModalCloseButton borderRadius="full" />
          <ModalBody>
            <VStack align="stretch" spacing={4}>
              <Text fontSize="sm" color={cTextSoft}>
                Add the linked ledger timeline to this invoice, including posting, payments
                received, corrections, and remaining balance.
              </Text>
              <Flex
                align="center"
                gap={3}
                border="1px solid"
                borderColor={GOLD_BORDER}
                bg={GOLD_BG}
                borderRadius="2xl"
                p={4}
              >
                <Flex
                  w="44px"
                  h="44px"
                  flexShrink={0}
                  align="center"
                  justify="center"
                  borderRadius="xl"
                  bg={cSurfaceAlt}
                  color={cAccentStrong}
                  fontSize="lg"
                  fontWeight="900"
                >
                  {pendingInvoiceHistoryCount || 0}
                </Flex>
                <Box minW={0}>
                  <Text fontSize="sm" color={cText} fontWeight="700">
                    {pendingInvoiceHistoryCount
                      ? `${pendingInvoiceHistoryCount} linked ${pendingInvoiceHistoryCount === 1 ? "entry" : "entries"} found`
                      : "No linked entries found yet"}
                  </Text>
                  <Text mt={0.5} fontSize="xs" color={cTextSoft}>
                    Invoice-only keeps the PDF shorter. Include history when the customer needs
                    payment proof.
                  </Text>
                </Box>
              </Flex>
            </VStack>
          </ModalBody>
          <ModalFooter
            gap={3}
            flexDirection={{ base: "column-reverse", sm: "row" }}
            alignItems="stretch"
            pb={{ base: 6, md: 4 }}
          >
            <Button
              variant="outline"
              w={{ base: "full", sm: "auto" }}
              flex={{ sm: 1 }}
              minH="46px"
              borderRadius="16px"
              borderColor={cBorderStrong}
              onClick={() => onConfirmInvoiceOption(false)}
              isLoading={isInvoiceBusy}
            >
              Invoice Only
            </Button>
            <Button
              w={{ base: "full", sm: "auto" }}
              flex={{ sm: 1 }}
              minH="46px"
              borderRadius="16px"
              bg={'brand.500'}
              color="white"
              boxShadow="0 14px 28px rgba(37, 99, 235, 0.24)"
              _hover={{ bg:"brand.600" }}
              _active={{ transform: "scale(0.98)" }}
              onClick={() => onConfirmInvoiceOption(true)}
              isLoading={isInvoiceBusy}
            >
              Include Ledger History
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SaleDetailsModal;