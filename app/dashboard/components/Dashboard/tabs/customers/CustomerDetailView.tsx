"use client";

import { AddIcon, ArrowBackIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Circle,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import {
  FiArrowDownLeft,
  FiArrowUpRight,
  FiMail,
  FiPhone,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import { MotionBox, useCustomerTheme } from "./theme";
import {
  BuyerLedgerEntry,
  BuyerProfile,
  LedgerSummary,
} from "./types";
import {
  canDownloadLedgerInvoice,
  canPayEntry,
  formatCurrency,
  formatDateOnly,
  formatSignedAmount,
  getBuyerActionPhone,
  getBuyerAvatarHue,
  getBuyerBalanceMeta,
  getBuyerDisplayName,
  getBuyerInitials,
  getBuyerPartyType,
  getBuyerPrimaryContact,
  getEntryPaidText,
  getEntryRemainingText,
  getLedgerAmountColor,
  getLedgerEffectLabel,
  getLedgerEntryTypeLabel,
  getLinkedSaleRecordIdFromEntry,
  getTimelineTitle,
  getWhatsAppHref,
  isEntryFullySettled,
  openExternalLink,
} from "./utils";

export interface CustomerDetailViewProps {
  selectedLedgerBuyer: BuyerProfile;
  ledgerEntries: BuyerLedgerEntry[];
  ledgerSummary: LedgerSummary;
  ledgerLoading: boolean;
  ledgerTotal: number;
  ledgerPage: number;
  ledgerTotalPages: number;
  isCompact: boolean;
  invoiceDownloadingLedgerEntryId: string;
  onBack: () => void;
  onDeleteBuyer: (buyer: BuyerProfile) => void;
  onRecordPayment: () => void;
  onAddSaleRecord: () => void;
  onPayEntry: (entry: BuyerLedgerEntry) => void;
  onOpenSaleDetailsFromEntry: (entry: BuyerLedgerEntry) => void;
  onDownloadLedgerInvoice: (entry: BuyerLedgerEntry) => void;
  onLedgerPageChange: (newPage: number) => void;
}

export const CustomerDetailView: React.FC<CustomerDetailViewProps> = ({
  selectedLedgerBuyer,
  ledgerEntries,
  ledgerLoading,
  ledgerTotal,
  ledgerPage,
  ledgerTotalPages,
  isCompact,
  invoiceDownloadingLedgerEntryId,
  onBack,
  onDeleteBuyer,
  onRecordPayment,
  onAddSaleRecord,
  onPayEntry,
  onOpenSaleDetailsFromEntry,
  onDownloadLedgerInvoice,
  onLedgerPageChange,
}) => {
  const theme = useCustomerTheme();
  const {
    isDarkMode,
    cAccentStrong,
    cTextMuted,
    cText,
    cTextSoft,
    cSurface,
    cSurfaceAlt,
    cBorder,
    cBorderStrong,
    cSurfaceSoft,
    cDangerAccentSoft,
    cSuccessAccentSoft,
    cSurfaceElevated,
    cSurfaceMuted,
    cBadgeBg,
    cIconButtonHover,
    cIconButtonMutedBg,
    cCardShadow,
    cFabShadow,
    dashboardPalette,
  } = theme;

  const partyType = getBuyerPartyType(selectedLedgerBuyer);
  const isSelectedSupplier = partyType === "supplier";
  const partySingularLabel = isSelectedSupplier ? "Supplier" : "Customer";
  const partyPluralLabel = isSelectedSupplier ? "Suppliers" : "Customers";

  const balanceMeta: any = getBuyerBalanceMeta(selectedLedgerBuyer, partyType, {
    textMuted: cTextMuted,
    success: theme.cSuccess,
    danger: theme.cDanger,
  });

  const phone = getBuyerActionPhone(selectedLedgerBuyer);
  const email = String(selectedLedgerBuyer.buyerId?.emailNormalized || "").trim();
  const whatsappHref = getWhatsAppHref(phone);
  const avatarHue = getBuyerAvatarHue(selectedLedgerBuyer);
  const selectedBuyerName = getBuyerDisplayName(selectedLedgerBuyer);

  const tagList = selectedLedgerBuyer.tags?.length
    ? selectedLedgerBuyer.tags.slice(0, 3)
    : selectedLedgerBuyer.source
      ? [selectedLedgerBuyer.source.charAt(0).toUpperCase() + selectedLedgerBuyer.source.slice(1)]
      : [];

  const accentBg = isDarkMode
    ? `hsla(${avatarHue}, 72%, 56%, 0.18)`
    : `hsl(${avatarHue}, 60%, 92%)`;
  const accentColor = isDarkMode
    ? `hsl(${avatarHue}, 88%, 78%)`
    : `hsl(${avatarHue}, 70%, 28%)`;
  const accentMid = isDarkMode
    ? `hsla(${avatarHue}, 72%, 56%, 0.12)`
    : `hsl(${avatarHue}, 55%, 96%)`;
  const headerGradient = isDarkMode
    ? `linear-gradient(160deg, ${accentMid} 0%, ${cSurface} 70%)`
    : `linear-gradient(160deg, ${accentMid} 0%, white 70%)`;

  return (
    <MotionBox
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.2 }}
      bg={cSurface}
      borderRadius={{ base: "none", md: "20px" }}
      overflow="hidden"
      minH={isCompact ? "100dvh" : "auto"}
      position="relative"
      display="flex"
      flexDirection="column"
    >
      {/* ── HERO HEADER ────────────────────────────────── */}
      <Box
        bg={headerGradient}
        px={{ base: 3, md: 6 }}
        pt={3}
        pb={3}
        borderBottom="1px solid"
        borderColor={cBorder}
      >
        {/* Back · avatar · identity · delete (single compact row) */}
        <Flex align="center" gap={2.5}>
          <IconButton
            aria-label={`Back to ${partyPluralLabel}`}
            icon={<ArrowBackIcon boxSize={4} />}
            onClick={onBack}
            size="sm"
            variant="ghost"
            borderRadius="full"
            color={cTextMuted}
            flexShrink={0}
            _hover={{ bg: cIconButtonHover }}
          />

          <Box position="relative" flexShrink={0}>
            <Flex
              h={{ base: "46px", md: "56px" }}
              w={{ base: "46px", md: "56px" }}
              borderRadius="14px"
              align="center"
              justify="center"
              fontWeight="800"
              fontSize={{ base: "lg", md: "xl" }}
              bg={accentBg}
              color={accentColor}
              boxShadow={`0 2px 12px ${accentBg}`}
              letterSpacing="-0.5px"
            >
              {getBuyerInitials(selectedLedgerBuyer)}
            </Flex>
            {selectedLedgerBuyer.isBlocked && (
              <Circle
                position="absolute"
                bottom="-3px"
                right="-3px"
                size="18px"
                bg="red.500"
                color="white"
                border="2px solid"
                borderColor={cSurface}
                fontSize="9px"
                fontWeight="900"
              >
                !
              </Circle>
            )}
          </Box>

          <Box flex="1" minW={0}>
            <Heading
              color={cText}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="700"
              lineHeight="1.2"
              noOfLines={1}
            >
              {selectedBuyerName}
            </Heading>
            <Text color={cTextSoft} fontSize="xs" mt={0.5} noOfLines={1}>
              {getBuyerPrimaryContact(selectedLedgerBuyer)}
            </Text>
            {tagList.length > 0 && (
              <Flex mt={1.5} gap={1.5} flexWrap="wrap">
                {tagList.map((tag) => (
                  <Badge
                    key={`${selectedLedgerBuyer._id}-${tag}`}
                    px={2}
                    py="2px"
                    borderRadius="6px"
                    bg={accentBg}
                    color={accentColor}
                    textTransform="none"
                    fontWeight="600"
                    fontSize="10px"
                    letterSpacing="0"
                  >
                    {tag}
                  </Badge>
                ))}
              </Flex>
            )}
          </Box>

          <IconButton
            aria-label={`Delete ${partySingularLabel}`}
            icon={<FiTrash2 size={15} />}
            onClick={() => onDeleteBuyer(selectedLedgerBuyer)}
            size="sm"
            variant="ghost"
            colorScheme="red"
            borderRadius="full"
            flexShrink={0}
          />
        </Flex>

        {/* Balance + contact actions */}
        <Box
          mt={3}
          bg={cSurfaceElevated}
          border="1px solid"
          borderColor={cBorder}
          borderRadius="16px"
          p={3}
          boxShadow={cCardShadow}
        >
          <Flex align="center" justify="space-between" gap={3}>
            <Box minW={0}>
              <HStack spacing={1.5}>
                <Box
                  boxSize="6px"
                  borderRadius="full"
                  bg={
                    balanceMeta.state === "settled"
                      ? cTextSoft
                      : balanceMeta.state === "receivable"
                        ? "green.500"
                        : "red.500"
                  }
                />
                <Text
                  fontSize="10px"
                  color={cTextSoft}
                  textTransform="uppercase"
                  fontWeight="700"
                  letterSpacing="0.08em"
                  noOfLines={1}
                >
                  {balanceMeta.detailLabel}
                </Text>
              </HStack>
              <Text
                mt={1}
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="800"
                color={
                  balanceMeta.state === "settled"
                    ? cTextSoft
                    : balanceMeta.state === "receivable"
                      ? "green.600"
                      : "red.500"
                }
                letterSpacing="-0.5px"
                lineHeight="1.1"
                noOfLines={1}
              >
                {balanceMeta.state === "settled"
                  ? "₹0.00"
                  : formatCurrency(balanceMeta.amount)}
              </Text>
            </Box>

            <HStack spacing={1.5} flexShrink={0}>
              {[
                {
                  label: "Call",
                  icon: <FiPhone size={15} />,
                  href: phone ? `tel:${phone}` : "",
                  disabled: !phone,
                  color: "blue.500",
                },
                {
                  label: "WhatsApp",
                  icon: <FaWhatsapp size={15} />,
                  href: whatsappHref,
                  disabled: !whatsappHref,
                  color: "green.500",
                },
                {
                  label: "Email",
                  icon: <FiMail size={15} />,
                  href: email ? `mailto:${email}` : "",
                  disabled: !email,
                  color: "purple.500",
                },
              ].map(({ label, icon, href, disabled, color }) => (
                <IconButton
                  key={label}
                  aria-label={label}
                  icon={icon}
                  onClick={() => openExternalLink(href)}
                  isDisabled={disabled}
                  size="sm"
                  variant="ghost"
                  h="36px"
                  w="36px"
                  minW="36px"
                  borderRadius="10px"
                  bg={cIconButtonMutedBg}
                  color={disabled ? cTextSoft : color}
                  _hover={{ bg: cBadgeBg }}
                  _active={{ transform: "scale(0.94)" }}
                  border="1px solid"
                  borderColor={cBorder}
                />
              ))}
            </HStack>
          </Flex>
        </Box>
      </Box>

      {/* ── ACTIVITY SECTION ───────────────────────────── */}
      <Box
        px={{ base: 3, md: 6 }}
        pt={4}
        pb={isCompact ? "120px" : "80px"}
        flex="1"
        overflowY="auto"
      >
        {/* Section header */}
        <Flex justify="space-between" align="center" mb={3}>
          <HStack spacing={2}>
            <Text fontSize="sm" fontWeight="800" color={cText}>
              Activity
            </Text>
            <Box
              px={1.5}
              py="1px"
              bg={cBadgeBg}
              borderRadius="6px"
              color={cTextSoft}
              fontSize="10px"
              fontWeight="700"
            >
              {ledgerTotal}
            </Box>
          </HStack>
          <Button
            size="xs"
            variant="outline"
            borderRadius="full"
            borderColor={cBorderStrong}
            color={cTextMuted}
            fontWeight="600"
            fontSize="xs"
            h="30px"
            px={3}
            leftIcon={<AddIcon fontSize="8px" />}
            bg={cSurfaceElevated}
            _hover={{ bg: cSurfaceMuted }}
            _active={{ transform: "scale(0.97)" }}
            onClick={onRecordPayment}
          >
            Record payment
          </Button>
        </Flex>

        {/* States */}
        {ledgerLoading ? (
          <VStack spacing={2} align="stretch">
            {Array.from({ length: 4 }).map((_, i) => (
              <Box
                key={`skel-${i}`}
                bg={cSurfaceElevated}
                border="1px solid"
                borderColor={cBorder}
                borderRadius="14px"
                p={3}
              >
                <HStack spacing={3}>
                  <SkeletonCircle size="8" />
                  <Box flex="1">
                    <Skeleton h="10px" w="55%" borderRadius="4px" />
                    <Skeleton h="8px" w="35%" mt={2} borderRadius="4px" />
                  </Box>
                  <Skeleton h="14px" w="14" borderRadius="4px" />
                </HStack>
              </Box>
            ))}
          </VStack>
        ) : ledgerEntries.length === 0 ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            py={10}
            bg={cSurfaceMuted}
            borderRadius="16px"
            border="1px dashed"
            borderColor={cBorderStrong}
          >
            <Circle
              size="44px"
              bg={cSurfaceElevated}
              border="1px solid"
              borderColor={cBorderStrong}
              mb={3}
            >
              <Icon as={FiUsers} boxSize={4.5} color={cTextSoft} />
            </Circle>
            <Text fontSize="sm" fontWeight="700" color={cTextMuted}>
              No activity yet
            </Text>
            <Text mt={1} fontSize="xs" color={cTextSoft} textAlign="center" px={6}>
              {isSelectedSupplier
                ? "Purchases and payouts will appear here."
                : "Sales and payments will appear here."}
            </Text>
          </Flex>
        ) : (
          <VStack align="stretch" spacing={4}>
            {(() => {
              // Group entries by month for easier scanning
              const groups: { label: string; items: typeof ledgerEntries }[] = [];
              ledgerEntries.forEach((entry) => {
                const d = new Date(entry.entryDate || entry.createdAt);
                const label = Number.isNaN(d.getTime())
                  ? ""
                  : d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
                const last = groups[groups.length - 1];
                if (last && last.label === label) last.items.push(entry);
                else groups.push({ label, items: [entry] });
              });

              return groups.map((group, groupIndex) => (
                <Box key={`${group.label}-${groupIndex}`}>
                  {group.label && (
                    <Text
                      mb={2}
                      px={0.5}
                      fontSize="10px"
                      fontWeight="700"
                      color={cTextSoft}
                      textTransform="uppercase"
                      letterSpacing="0.08em"
                    >
                      {group.label}
                    </Text>
                  )}

                  <VStack align="stretch" spacing={2}>
                    {group.items.map((entry) => {
                      const title = getTimelineTitle(entry, isSelectedSupplier);
                      const linkedSaleRecordId = getLinkedSaleRecordIdFromEntry(entry);
                      const isDebit = entry.direction === "debit";
                      const isReversed = entry.status === "reversed";
                      const hasLinkedSaleSummary = Boolean(entry.linkedSaleSummary);
                      const remainingTone = isEntryFullySettled(entry)
                        ? dashboardPalette.success
                        : cAccentStrong;
                      const saleTotal = Number(entry.linkedSaleSummary?.saleAmount ?? 0);
                      const salePaid = Number(entry.linkedSaleSummary?.paidAmount ?? 0);
                      const paidPercent =
                        saleTotal > 0
                          ? Math.min(Math.max((salePaid / saleTotal) * 100, 0), 100)
                          : 0;
                      const showActions =
                        !isReversed &&
                        (linkedSaleRecordId ||
                          canDownloadLedgerInvoice(entry, partyType) ||
                          canPayEntry(entry));

                      return (
                        <Box
                          key={entry._id}
                          bg={cSurfaceElevated}
                          border="1px solid"
                          borderColor={cBorder}
                          borderRadius="14px"
                          p={3}
                          opacity={isReversed ? 0.6 : 1}
                          position="relative"
                          overflow="hidden"
                          boxShadow={cCardShadow}
                          _before={
                            !isReversed
                              ? {
                                  content: '""',
                                  position: "absolute",
                                  left: 0,
                                  top: "20%",
                                  bottom: "20%",
                                  w: "3px",
                                  borderRadius: "0 3px 3px 0",
                                  bg: isDebit ? "red.400" : "green.400",
                                }
                              : {}
                          }
                        >
                          <Flex align="start" gap={2.5}>
                            <Circle
                              size="32px"
                              bg={isDebit ? cDangerAccentSoft : cSuccessAccentSoft}
                              color={isDebit ? "red.500" : "green.500"}
                              flexShrink={0}
                            >
                              <Icon
                                as={isDebit ? FiArrowUpRight : FiArrowDownLeft}
                                boxSize={4}
                              />
                            </Circle>

                            <Box flex="1" minW={0}>
                              {/* Title + amount */}
                              <Flex justify="space-between" align="start" gap={2}>
                                <Box minW={0} flex="1">
                                  <Text
                                    fontSize="sm"
                                    fontWeight="700"
                                    color={cText}
                                    noOfLines={1}
                                    lineHeight="1.3"
                                  >
                                    {title}
                                  </Text>
                                  <Text mt={0.5} fontSize="11px" color={cTextSoft} noOfLines={1}>
                                    {getLedgerEntryTypeLabel(entry.entryType, partyType)}
                                    {" · "}
                                    {formatDateOnly(entry.entryDate || entry.createdAt)}
                                  </Text>
                                </Box>

                                <Box textAlign="right" flexShrink={0}>
                                  <Text
                                    fontSize="sm"
                                    fontWeight="800"
                                    color={getLedgerAmountColor(entry, cAccentStrong)}
                                    letterSpacing="-0.3px"
                                    textDecoration={isReversed ? "line-through" : "none"}
                                  >
                                    {formatSignedAmount(entry)}
                                  </Text>
                                  <Text
                                    mt={0.5}
                                    fontSize="10px"
                                    color={cTextSoft}
                                    textTransform="capitalize"
                                  >
                                    {isReversed
                                      ? "reversed"
                                      : getLedgerEffectLabel(entry, partyType).toLowerCase()}
                                  </Text>
                                </Box>
                              </Flex>

                              {/* Notes */}
                              {entry.notes?.trim() && (
                                <Text
                                  mt={1.5}
                                  fontSize="xs"
                                  color={cTextMuted}
                                  lineHeight="1.4"
                                  noOfLines={2}
                                >
                                  {entry.notes.trim()}
                                </Text>
                              )}

                              {/* Paid / remaining progress */}
                              {hasLinkedSaleSummary ? (
                                <Box mt={2.5}>
                                  <Box
                                    h="4px"
                                    borderRadius="full"
                                    bg={cBorder}
                                    overflow="hidden"
                                  >
                                    <Box
                                      h="full"
                                      w={`${paidPercent}%`}
                                      bg={dashboardPalette.success}
                                      borderRadius="full"
                                      transition="width 0.4s ease"
                                    />
                                  </Box>
                                  <Flex justify="space-between" align="center" mt={1.5} gap={2}>
                                    <Text fontSize="11px" color={cTextSoft} noOfLines={1}>
                                      {isSelectedSupplier ? "Paid out " : "Paid "}
                                      <Text
                                        as="span"
                                        fontWeight="700"
                                        color={dashboardPalette.success}
                                      >
                                        {getEntryPaidText(entry)}
                                      </Text>
                                    </Text>
                                    <Text fontSize="11px" color={cTextSoft} noOfLines={1}>
                                      Remaining{" "}
                                      <Text as="span" fontWeight="700" color={remainingTone}>
                                        {getEntryRemainingText(entry)}
                                      </Text>
                                    </Text>
                                  </Flex>
                                </Box>
                              ) : null}

                              {/* Actions */}
                              {showActions && (
                                <Flex
                                  mt={2.5}
                                  pt={2.5}
                                  gap={1.5}
                                  align="center"
                                  borderTop="1px solid"
                                  borderColor={cBorder}
                                >
                                  {linkedSaleRecordId && (
                                    <Button
                                      size="xs"
                                      variant="outline"
                                      borderRadius="full"
                                      borderColor={cBorderStrong}
                                      color={cTextMuted}
                                      fontWeight="600"
                                      h="26px"
                                      fontSize="11px"
                                      px={3}
                                      onClick={() => onOpenSaleDetailsFromEntry(entry)}
                                    >
                                      Details
                                    </Button>
                                  )}
                                  {canDownloadLedgerInvoice(entry, partyType) && (
                                    <Button
                                      size="xs"
                                      variant="outline"
                                      borderRadius="full"
                                      borderColor={cBorderStrong}
                                      color={cTextMuted}
                                      fontWeight="600"
                                      h="26px"
                                      fontSize="11px"
                                      px={3}
                                      isLoading={invoiceDownloadingLedgerEntryId === entry._id}
                                      onClick={() => onDownloadLedgerInvoice(entry)}
                                    >
                                      Invoice
                                    </Button>
                                  )}
                                  {canPayEntry(entry) && (
                                    <Button
                                      size="xs"
                                      ml="auto"
                                      bg={dashboardPalette.accent}
                                      color="white"
                                      borderRadius="full"
                                      fontWeight="700"
                                      h="26px"
                                      fontSize="11px"
                                      px={4}
                                      _hover={{ opacity: 0.9 }}
                                      _active={{ transform: "scale(0.96)" }}
                                      onClick={() => onPayEntry(entry)}
                                    >
                                      Pay
                                    </Button>
                                  )}
                                </Flex>
                              )}
                            </Box>
                          </Flex>
                        </Box>
                      );
                    })}
                  </VStack>
                </Box>
              ));
            })()}
          </VStack>
        )}

        {/* ── PAGINATION ─────────────────────────────── */}
        {(ledgerTotalPages || 1) > 1 && (
          <Flex justify="space-between" align="center" mt={5}>
            <Button
              size="xs"
              variant="outline"
              borderRadius="full"
              borderColor={cBorderStrong}
              color={cTextMuted}
              fontWeight="600"
              h="30px"
              w="84px"
              isDisabled={ledgerPage <= 1 || ledgerLoading}
              onClick={() => {
                if (!selectedLedgerBuyer?._id || ledgerPage <= 1) return;
                onLedgerPageChange(ledgerPage - 1);
              }}
            >
              ← Prev
            </Button>
            <Text fontSize="xs" color={cTextSoft} fontWeight="700">
              {ledgerPage} / {ledgerTotalPages || 1}
            </Text>
            <Button
              size="xs"
              variant="outline"
              borderRadius="full"
              borderColor={cBorderStrong}
              color={cTextMuted}
              fontWeight="600"
              h="30px"
              w="84px"
              isDisabled={ledgerPage >= (ledgerTotalPages || 1) || ledgerLoading}
              onClick={() => {
                if (!selectedLedgerBuyer?._id || ledgerPage >= (ledgerTotalPages || 1)) return;
                onLedgerPageChange(ledgerPage + 1);
              }}
            >
              Next →
            </Button>
          </Flex>
        )}
      </Box>

      {/* ── FLOATING ACTION BUTTON ─────────────────────── */}
      <Box
        position={isCompact ? "fixed" : "absolute"}
        bottom={
          isCompact
            ? "calc(76px + env(safe-area-inset-bottom, 0px))"
            : "16px"
        }
        right={{ base: "16px", md: "20px" }}
        zIndex={110}
      >
        <Button
          h={{ base: "42px", md: "46px" }}
          px={{ base: 4, md: 5 }}
          borderRadius="full"
          bg={dashboardPalette.accent}
          color="white"
          leftIcon={<AddIcon fontSize="9px" />}
          fontWeight="700"
          fontSize="sm"
          boxShadow={cFabShadow}
          _hover={{ opacity: 0.92 }}
          _active={{ transform: "scale(0.96)" }}
          onClick={onAddSaleRecord}
        >
          New entry
        </Button>
      </Box>
    </MotionBox>
  );
};

export default CustomerDetailView;
